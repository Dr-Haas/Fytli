const { pool } = require('../db');

const socialModel = {
  // ============ CONNEXIONS SOCIALES ============
  
  /**
   * Créer une connexion entre deux utilisateurs
   */
  async createConnection(userId, friendId) {
    const query = `
      INSERT INTO user_connections (user_id, friend_id, status)
      VALUES (?, ?, 'pending')
    `;
    const [result] = await pool.execute(query, [userId, friendId]);
    return result;
  },

  /**
   * Accepter une connexion
   */
  async acceptConnection(userId, friendId) {
    const query = `
      UPDATE user_connections 
      SET status = 'accepted', updated_at = NOW()
      WHERE user_id = ? AND friend_id = ?
    `;
    await pool.execute(query, [friendId, userId]);
    
    // Créer la connexion inverse pour relation symétrique
    const insertQuery = `
      INSERT INTO user_connections (user_id, friend_id, status)
      VALUES (?, ?, 'accepted')
      ON DUPLICATE KEY UPDATE status = 'accepted', updated_at = NOW()
    `;
    const [result] = await pool.execute(insertQuery, [userId, friendId]);
    return result;
  },

  /**
   * Supprimer une connexion
   */
  async removeConnection(userId, friendId) {
    const query = `
      DELETE FROM user_connections 
      WHERE (user_id = ? AND friend_id = ?) 
         OR (user_id = ? AND friend_id = ?)
    `;
    const [result] = await pool.execute(query, [userId, friendId, friendId, userId]);
    return result;
  },

  /**
   * Récupérer les amis d'un utilisateur
   */
  async getFriends(userId) {
    const query = `
      SELECT 
        uc.id as connection_id,
        uc.status,
        uc.created_at,
        u.id,
        u.name,
        u.username,
        u.email,
        u.avatar_url,
        u.profile_visibility,
        su.unlocked as feed_unlocked_today,
        su.unlocked_at
      FROM user_connections uc
      JOIN users u ON uc.friend_id = u.id
      LEFT JOIN social_unlocks su ON u.id = su.user_id AND su.date = CURDATE()
      WHERE uc.user_id = ? AND uc.status = 'accepted'
      ORDER BY u.name ASC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  },

  /**
   * Vérifier si deux utilisateurs sont amis
   */
  async areFriends(userId, friendId) {
    const query = `
      SELECT COUNT(*) as count
      FROM user_connections
      WHERE user_id = ? AND friend_id = ? AND status = 'accepted'
    `;
    const [rows] = await pool.execute(query, [userId, friendId]);
    return rows[0].count > 0;
  },

  /**
   * Rechercher des utilisateurs par username
   */
  async searchUsers(searchTerm, currentUserId, limit = 20) {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.username,
        u.avatar_url,
        u.profile_visibility,
        CASE 
          WHEN uc.status IS NOT NULL THEN uc.status
          ELSE 'none'
        END as connection_status
      FROM users u
      LEFT JOIN user_connections uc ON u.id = uc.friend_id AND uc.user_id = ?
      WHERE u.id != ? 
        AND (u.username LIKE ? OR u.name LIKE ?)
        AND u.username IS NOT NULL
      LIMIT ?
    `;
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.execute(query, [
      currentUserId, 
      currentUserId, 
      searchPattern, 
      searchPattern, 
      limit
    ]);
    return rows;
  },

  // ============ FEED SOCIAL ============

  /**
   * Créer un événement dans le feed
   */
  async createFeedEvent(userId, type, message, emoji, sessionCompletionId = null, metadata = null) {
    const query = `
      INSERT INTO user_feed (user_id, type, message, emoji, session_completion_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const metadataJson = metadata ? JSON.stringify(metadata) : null;
    const [result] = await pool.execute(query, [
      userId, 
      type, 
      message, 
      emoji, 
      sessionCompletionId,
      metadataJson
    ]);
    return result;
  },

  /**
   * Récupérer le feed d'un utilisateur (ses amis)
   */
  async getFeed(userId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        uf.id,
        uf.user_id,
        uf.type,
        uf.message,
        uf.emoji,
        uf.metadata,
        uf.created_at,
        u.name,
        u.username,
        u.avatar_url,
        sc.duration,
        sc.average_heart_rate,
        sc.calories_burned
      FROM user_feed uf
      JOIN user_connections uc ON uf.user_id = uc.friend_id
      JOIN users u ON uf.user_id = u.id
      LEFT JOIN session_completions sc ON uf.session_completion_id = sc.id
      WHERE uc.user_id = ? 
        AND uc.status = 'accepted'
        AND DATE(uf.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ORDER BY uf.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(query, [userId, limit, offset]);
    
    // Parser le JSON metadata
    rows.forEach(row => {
      if (row.metadata) {
        try {
          row.metadata = JSON.parse(row.metadata);
        } catch (e) {
          row.metadata = null;
        }
      }
    });
    
    return rows;
  },

  /**
   * Récupérer les événements d'un utilisateur spécifique
   */
  async getUserFeedEvents(userId, limit = 20) {
    const query = `
      SELECT 
        uf.id,
        uf.type,
        uf.message,
        uf.emoji,
        uf.metadata,
        uf.created_at,
        sc.duration,
        sc.average_heart_rate
      FROM user_feed uf
      LEFT JOIN session_completions sc ON uf.session_completion_id = sc.id
      WHERE uf.user_id = ?
      ORDER BY uf.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.execute(query, [userId, limit]);
    
    rows.forEach(row => {
      if (row.metadata) {
        try {
          row.metadata = JSON.parse(row.metadata);
        } catch (e) {
          row.metadata = null;
        }
      }
    });
    
    return rows;
  },

  // ============ DÉVERROUILLAGE DU FEED ============

  /**
   * Déverrouiller le feed pour un utilisateur aujourd'hui
   */
  async unlockFeed(userId, sessionCompletionId) {
    const query = `
      INSERT INTO social_unlocks (user_id, date, unlocked, unlocked_at, session_completion_id)
      VALUES (?, CURDATE(), TRUE, NOW(), ?)
      ON DUPLICATE KEY UPDATE 
        unlocked = TRUE,
        unlocked_at = NOW(),
        session_completion_id = ?
    `;
    const [result] = await pool.execute(query, [userId, sessionCompletionId, sessionCompletionId]);
    return result;
  },

  /**
   * Vérifier si le feed est déverrouillé pour un utilisateur aujourd'hui
   */
  async isFeedUnlocked(userId, date = null) {
    const checkDate = date || new Date().toISOString().split('T')[0];
    const query = `
      SELECT unlocked, unlocked_at
      FROM social_unlocks
      WHERE user_id = ? AND date = ?
    `;
    const [rows] = await pool.execute(query, [userId, checkDate]);
    
    if (rows.length === 0) {
      return { unlocked: false, unlocked_at: null };
    }
    
    return {
      unlocked: Boolean(rows[0].unlocked),
      unlocked_at: rows[0].unlocked_at
    };
  },

  /**
   * Obtenir les statistiques de streak pour un utilisateur
   */
  async getUserStreak(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_days,
        MAX(date) as last_unlock_date
      FROM social_unlocks
      WHERE user_id = ? 
        AND unlocked = TRUE
        AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      ORDER BY date DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    
    // Calculer le streak actuel (jours consécutifs)
    const streakQuery = `
      SELECT date
      FROM social_unlocks
      WHERE user_id = ? AND unlocked = TRUE
      ORDER BY date DESC
      LIMIT 30
    `;
    const [streakRows] = await pool.execute(streakQuery, [userId]);
    
    let currentStreak = 0;
    if (streakRows.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < streakRows.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        
        const rowDate = new Date(streakRows[i].date);
        rowDate.setHours(0, 0, 0, 0);
        
        if (rowDate.getTime() === checkDate.getTime()) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    return {
      total_days: rows[0]?.total_days || 0,
      last_unlock_date: rows[0]?.last_unlock_date || null,
      current_streak: currentStreak
    };
  },

  // ============ PROFIL PUBLIC ============

  /**
   * Récupérer le profil public d'un utilisateur par username
   */
  async getPublicProfile(username) {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.username,
        u.avatar_url,
        u.profile_visibility,
        u.created_at,
        COUNT(DISTINCT uc.friend_id) as friends_count,
        COUNT(DISTINCT sc.id) as total_sessions,
        COUNT(DISTINCT ub.badge_id) as badges_count
      FROM users u
      LEFT JOIN user_connections uc ON u.id = uc.user_id AND uc.status = 'accepted'
      LEFT JOIN session_completions sc ON u.id = sc.user_id
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      WHERE u.username = ?
      GROUP BY u.id
    `;
    const [rows] = await pool.execute(query, [username]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const user = rows[0];
    
    // Récupérer les badges récents si profil public
    if (user.profile_visibility === 'public') {
      const badgesQuery = `
        SELECT b.id, b.name, b.description, b.icon, b.color, ub.earned_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
        ORDER BY ub.earned_at DESC
        LIMIT 5
      `;
      const [badges] = await pool.execute(badgesQuery, [user.id]);
      user.recent_badges = badges;
    }
    
    return user;
  }
};

module.exports = socialModel;

