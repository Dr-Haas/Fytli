/**
 * Modèle Social - Gestion des connexions et du feed
 */

const { pool } = require('../db');

// ============ GESTION DES CONNEXIONS ============

/**
 * Créer une demande d'ami
 */
const addFriendRequest = async (userId, friendId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Vérifier si une connexion existe déjà
    const [existing] = await connection.query(
      `SELECT * FROM connections 
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]
    );
    
    if (existing.length > 0) {
      throw new Error('Une connexion existe déjà entre ces utilisateurs');
    }
    
    // Créer la demande
    const [result] = await connection.query(
      'INSERT INTO connections (user_id, friend_id, status) VALUES (?, ?, ?)',
      [userId, friendId, 'pending']
    );
    
    // Créer une notification pour l'autre utilisateur
    await connection.query(
      `INSERT INTO feed_events (user_id, type, message, emoji) 
       VALUES (?, 'connection_request', ?, '🤝')`,
      [userId, 'a envoyé une demande d\'ami']
    );
    
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Accepter une demande d'ami
 */
const acceptFriendRequest = async (userId, friendId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Mettre à jour le statut
    await connection.query(
      `UPDATE connections SET status = 'accepted', updated_at = NOW()
       WHERE friend_id = ? AND user_id = ? AND status = 'pending'`,
      [userId, friendId]
    );
    
    // Créer l'événement dans le feed
    const [user] = await connection.query(
      'SELECT first_name, last_name FROM users WHERE id = ?',
      [userId]
    );
    
    if (user.length > 0) {
      await connection.query(
        `INSERT INTO feed_events (user_id, type, message, emoji) 
         VALUES (?, 'connection_accepted', ?, '🎉')`,
        [userId, `${user[0].first_name} et vous êtes maintenant amis !`]
      );
    }
    
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Supprimer une connexion
 */
const removeFriend = async (userId, friendId) => {
  const [result] = await pool.query(
    `DELETE FROM connections 
     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [userId, friendId, friendId, userId]
  );
  return result.affectedRows > 0;
};

/**
 * Récupérer la liste des amis d'un utilisateur
 */
const getFriendsList = async (userId) => {
  const [friends] = await pool.query(
    `SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.username,
      u.email,
      u.avatar_url,
      u.profile_visibility,
      c.status as connection_status,
      c.created_at as connected_at,
      (SELECT unlocked_date FROM feed_unlocks 
       WHERE user_id = u.id 
       ORDER BY unlocked_date DESC LIMIT 1) as last_unlock_date,
      (SELECT unlocked_date = CURDATE() FROM feed_unlocks 
       WHERE user_id = u.id 
       ORDER BY unlocked_date DESC LIMIT 1) as feed_unlocked_today,
      (SELECT unlocked_at FROM feed_unlocks 
       WHERE user_id = u.id AND unlocked_date = CURDATE() 
       LIMIT 1) as unlocked_at
    FROM connections c
    JOIN users u ON (
      (c.user_id = ? AND c.friend_id = u.id) OR 
      (c.friend_id = ? AND c.user_id = u.id)
    )
    WHERE c.status = 'accepted' 
      AND u.id != ?
    ORDER BY feed_unlocked_today DESC, u.first_name ASC`,
    [userId, userId, userId]
  );
  
  return friends.map(friend => ({
    ...friend,
    name: `${friend.first_name} ${friend.last_name}`,
    feed_unlocked_today: friend.feed_unlocked_today === 1
  }));
};

/**
 * Rechercher des utilisateurs
 */
const searchUsers = async (query, currentUserId) => {
  const searchTerm = `%${query}%`;
  const [users] = await pool.query(
    `SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.username,
      u.email,
      u.avatar_url,
      u.profile_visibility,
      c.status as connection_status
    FROM users u
    LEFT JOIN connections c ON (
      (c.user_id = ? AND c.friend_id = u.id) OR 
      (c.friend_id = ? AND c.user_id = u.id)
    )
    WHERE u.id != ?
      AND (
        u.first_name LIKE ? OR 
        u.last_name LIKE ? OR 
        u.username LIKE ? OR 
        u.email LIKE ?
      )
    LIMIT 20`,
    [currentUserId, currentUserId, currentUserId, searchTerm, searchTerm, searchTerm, searchTerm]
  );
  
  return users.map(user => ({
    ...user,
    name: `${user.first_name} ${user.last_name}`
  }));
};

// ============ GESTION DU FEED ============

/**
 * Récupérer le feed social (activités des amis)
 */
const getFeed = async (userId, limit = 50, offset = 0) => {
  const [events] = await pool.query(
    `SELECT 
      fe.*,
      u.first_name,
      u.last_name,
      u.username,
      u.avatar_url,
      sc.duration_minutes as duration,
      sc.feeling
    FROM feed_events fe
    JOIN users u ON fe.user_id = u.id
    LEFT JOIN session_completions sc ON (
      fe.type = 'session_completed' AND 
      JSON_EXTRACT(fe.metadata, '$.sessionCompletionId') = sc.id
    )
    WHERE fe.user_id IN (
      SELECT CASE 
        WHEN c.user_id = ? THEN c.friend_id 
        ELSE c.user_id 
      END
      FROM connections c
      WHERE (c.user_id = ? OR c.friend_id = ?)
        AND c.status = 'accepted'
    )
    ORDER BY fe.created_at DESC
    LIMIT ? OFFSET ?`,
    [userId, userId, userId, limit, offset]
  );
  
  return events.map(event => ({
    ...event,
    name: `${event.first_name} ${event.last_name}`,
    metadata: typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata
  }));
};

/**
 * Déverrouiller le feed (après une session)
 */
const unlockFeed = async (userId, sessionCompletionId = null, message = null, emoji = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const today = new Date().toISOString().split('T')[0];
    
    // Récupérer le streak actuel
    const [lastUnlock] = await connection.query(
      `SELECT streak, unlocked_date 
       FROM feed_unlocks 
       WHERE user_id = ? 
       ORDER BY unlocked_date DESC 
       LIMIT 1`,
      [userId]
    );
    
    let newStreak = 1;
    if (lastUnlock.length > 0) {
      const lastDate = new Date(lastUnlock[0].unlocked_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Si déverrouillé hier, incrémenter le streak
      if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        newStreak = lastUnlock[0].streak + 1;
      }
    }
    
    // Insérer ou mettre à jour le déverrouillage
    await connection.query(
      `INSERT INTO feed_unlocks (user_id, unlocked_date, session_completion_id, streak)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         unlocked_at = NOW(),
         session_completion_id = ?,
         streak = ?`,
      [userId, today, sessionCompletionId, newStreak, sessionCompletionId, newStreak]
    );
    
    // Créer l'événement de feed si message fourni
    if (message) {
      const [sessionInfo] = await connection.query(
        `SELECT 
          sc.duration_minutes,
          s.title as session_title,
          p.title as program_title
         FROM session_completions sc
         JOIN sessions s ON sc.session_id = s.id
         JOIN programs p ON sc.program_id = p.id
         WHERE sc.id = ?`,
        [sessionCompletionId]
      );
      
      const metadata = sessionInfo.length > 0 ? {
        sessionCompletionId,
        sessionTitle: sessionInfo[0].session_title,
        programTitle: sessionInfo[0].program_title,
        duration: sessionInfo[0].duration_minutes
      } : { sessionCompletionId };
      
      await connection.query(
        `INSERT INTO feed_events (user_id, type, message, emoji, metadata)
         VALUES (?, 'session_completed', ?, ?, ?)`,
        [userId, message || 'a complété une séance', emoji || '💪', JSON.stringify(metadata)]
      );
    }
    
    // Vérifier si streak badge atteint
    if (newStreak === 7) {
      await connection.query(
        `INSERT INTO feed_events (user_id, type, message, emoji)
         VALUES (?, 'streak_achieved', 'a atteint un streak de 7 jours ! 🔥', '🔥')`,
        [userId]
      );
    }
    
    await connection.commit();
    return { unlocked: true, streak: newStreak };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Vérifier si le feed est déverrouillé aujourd'hui
 */
const checkFeedStatus = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [unlock] = await pool.query(
    `SELECT 
      unlocked_at,
      streak,
      (SELECT COUNT(*) FROM feed_unlocks WHERE user_id = ?) as total_days
     FROM feed_unlocks 
     WHERE user_id = ? AND unlocked_date = ?`,
    [userId, userId, today]
  );
  
  if (unlock.length > 0) {
    return {
      unlocked: true,
      unlocked_at: unlock[0].unlocked_at,
      streak: unlock[0].streak,
      total_days: unlock[0].total_days
    };
  }
  
  // Récupérer le streak même si pas déverrouillé aujourd'hui
  const [lastUnlock] = await pool.query(
    `SELECT streak, 
      (SELECT COUNT(*) FROM feed_unlocks WHERE user_id = ?) as total_days
     FROM feed_unlocks 
     WHERE user_id = ? 
     ORDER BY unlocked_date DESC 
     LIMIT 1`,
    [userId, userId]
  );
  
  return {
    unlocked: false,
    streak: lastUnlock.length > 0 ? lastUnlock[0].streak : 0,
    total_days: lastUnlock.length > 0 ? lastUnlock[0].total_days : 0
  };
};

/**
 * Obtenir les stats du cercle (combien d'amis actifs aujourd'hui)
 */
const getCircleStats = async (userId) => {
  // Stats de l'utilisateur
  const userStatus = await checkFeedStatus(userId);
  
  // Liste des amis avec leur statut
  const friends = await getFriendsList(userId);
  
  // Compter les amis actifs aujourd'hui
  const activeToday = friends.filter(f => f.feed_unlocked_today).length;
  
  return {
    user_status: userStatus,
    circle: {
      total_friends: friends.length,
      active_today: activeToday,
      friends: friends
    }
  };
};

/**
 * Récupérer le profil public d'un utilisateur
 */
const getPublicProfile = async (username, viewerId) => {
  const [users] = await pool.query(
    `SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.username,
      u.avatar_url,
      u.profile_visibility,
      u.created_at,
      (SELECT COUNT(*) FROM connections c 
       WHERE (c.user_id = u.id OR c.friend_id = u.id) 
       AND c.status = 'accepted') as friends_count,
      (SELECT COUNT(*) FROM session_completions sc 
       WHERE sc.user_id = u.id) as total_sessions,
      (SELECT COUNT(*) FROM user_badges ub 
       WHERE ub.user_id = u.id) as badges_count
    FROM users u
    WHERE u.username = ?`,
    [username]
  );
  
  if (users.length === 0) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const user = users[0];
  
  // Vérifier les permissions
  if (user.profile_visibility === 'private' && user.id !== viewerId) {
    throw new Error('Ce profil est privé');
  }
  
  // Récupérer les badges récents
  const [badges] = await pool.query(
    `SELECT b.*, ub.earned_at
     FROM user_badges ub
     JOIN badges b ON ub.badge_id = b.id
     WHERE ub.user_id = ?
     ORDER BY ub.earned_at DESC
     LIMIT 5`,
    [user.id]
  );
  
  return {
    ...user,
    name: `${user.first_name} ${user.last_name}`,
    recent_badges: badges
  };
};

/**
 * Obtenir les données pour la carte de partage
 */
const getShareCardData = async (userId, sessionCompletionId = null) => {
  // Infos utilisateur
  const [users] = await pool.query(
    `SELECT first_name, last_name, username, avatar_url FROM users WHERE id = ?`,
    [userId]
  );
  
  if (users.length === 0) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const user = users[0];
  
  // Stats utilisateur
  const status = await checkFeedStatus(userId);
  
  // Nombre d'amis
  const [friendsCount] = await pool.query(
    `SELECT COUNT(*) as count FROM connections 
     WHERE (user_id = ? OR friend_id = ?) AND status = 'accepted'`,
    [userId, userId]
  );
  
  // Dernier événement de feed si sessionCompletionId fourni
  let feedEvent = null;
  if (sessionCompletionId) {
    const [events] = await pool.query(
      `SELECT * FROM feed_events 
       WHERE user_id = ? 
       AND JSON_EXTRACT(metadata, '$.sessionCompletionId') = ?
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId, sessionCompletionId]
    );
    
    if (events.length > 0) {
      feedEvent = events[0];
    }
  }
  
  return {
    user: {
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      avatar_url: user.avatar_url
    },
    stats: {
      streak: status.streak,
      total_days: status.total_days,
      friends_count: friendsCount[0].count
    },
    status: {
      unlocked: status.unlocked
    },
    feed_event: feedEvent
  };
};

module.exports = {
  // Connexions
  addFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriendsList,
  searchUsers,
  
  // Feed
  getFeed,
  unlockFeed,
  checkFeedStatus,
  getCircleStats,
  
  // Profil
  getPublicProfile,
  getShareCardData
};

