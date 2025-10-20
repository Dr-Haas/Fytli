const { pool } = require('../db');

const scheduleModel = {
  /**
   * Récupérer l'agenda du jour pour un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des sessions planifiées pour aujourd'hui
   */
  async getDailySchedule(userId) {
    const [sessions] = await pool.execute(`
      SELECT 
        p.id as program_id,
        p.title as program_title,
        p.image_url as program_image,
        p.time_slot_start,
        p.time_slot_end,
        p.is_time_specific,
        s.id as session_id,
        s.title as session_title,
        s.description as session_description,
        s.target_duration_minutes,
        -- Vérifier si la session a été complétée aujourd'hui
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM session_completions sc
            WHERE sc.user_id = e.user_id
            AND sc.session_id = s.id
            AND DATE(sc.completed_at) = CURDATE()
          ) THEN TRUE
          ELSE FALSE
        END as completed_today,
        -- Compter combien de fois l'utilisateur a fait cette session
        (
          SELECT COUNT(*) FROM session_completions sc
          WHERE sc.user_id = e.user_id
          AND sc.session_id = s.id
        ) as completion_count
      FROM enrollments e
      INNER JOIN programs p ON e.program_id = p.id
      INNER JOIN sessions s ON s.program_id = p.id
      WHERE e.user_id = ?
      AND e.status = 'active'
      ORDER BY 
        CASE 
          WHEN p.is_time_specific = TRUE THEN 0
          ELSE 1
        END,
        p.time_slot_start ASC,
        s.\`order\` ASC
    `, [userId]);

    return sessions;
  },

  /**
   * Récupérer les programmes avec timeslots pour la semaine
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des programmes avec leurs créneaux
   */
  async getWeeklySchedule(userId) {
    const [programs] = await pool.execute(`
      SELECT 
        p.id as program_id,
        p.title,
        p.description,
        p.image_url,
        p.time_slot_start,
        p.time_slot_end,
        p.is_time_specific,
        p.sessions_per_week,
        -- Nombre de sessions complétées cette semaine
        (
          SELECT COUNT(DISTINCT DATE(sc.completed_at))
          FROM session_completions sc
          INNER JOIN sessions s ON sc.session_id = s.id
          WHERE sc.user_id = e.user_id
          AND s.program_id = p.id
          AND YEARWEEK(sc.completed_at, 1) = YEARWEEK(CURDATE(), 1)
        ) as sessions_completed_this_week,
        -- Nombre total de sessions du programme
        (
          SELECT COUNT(*) FROM sessions s
          WHERE s.program_id = p.id
        ) as total_sessions
      FROM enrollments e
      INNER JOIN programs p ON e.program_id = p.id
      WHERE e.user_id = ?
      AND e.status = 'active'
      ORDER BY p.is_time_specific DESC, p.time_slot_start ASC
    `, [userId]);

    return programs;
  },

  /**
   * Récupérer la prochaine session suggérée pour un programme
   * @param {number} userId - ID de l'utilisateur
   * @param {number} programId - ID du programme
   * @returns {Promise<Object|null>} Prochaine session à faire
   */
  async getNextSession(userId, programId) {
    const [sessions] = await pool.execute(`
      SELECT 
        s.id as session_id,
        s.title,
        s.description,
        s.target_duration_minutes,
        s.order_index,
        -- Vérifier si déjà complétée
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM session_completions sc
            WHERE sc.user_id = ?
            AND sc.session_id = s.id
          ) THEN TRUE
          ELSE FALSE
        END as is_completed
      FROM sessions s
      WHERE s.program_id = ?
      ORDER BY s.order_index ASC
      LIMIT 1
    `, [userId, programId]);

    // Si toutes les sessions sont complétées, proposer la première
    if (sessions.length > 0 && sessions[0].is_completed) {
      // Trouver la première session non complétée
      const [nextUncompleted] = await pool.execute(`
        SELECT 
          s.id as session_id,
          s.title,
          s.description,
          s.target_duration_minutes,
          s.\`order\` as order_index
        FROM sessions s
        WHERE s.program_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM session_completions sc
          WHERE sc.user_id = ?
          AND sc.session_id = s.id
        )
        ORDER BY s.order_index ASC
        LIMIT 1
      `, [programId, userId]);

      return nextUncompleted[0] || null;
    }

    return sessions[0] || null;
  },

  /**
   * Obtenir les statistiques de la semaine pour un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Stats de la semaine
   */
  async getWeeklyStats(userId) {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT DATE(sc.completed_at)) as sessions_this_week,
        SUM(sc.duration_minutes) as total_minutes_this_week,
        COUNT(DISTINCT s.program_id) as programs_active_this_week
      FROM session_completions sc
      INNER JOIN sessions s ON sc.session_id = s.id
      WHERE sc.user_id = ?
      AND YEARWEEK(sc.completed_at, 1) = YEARWEEK(CURDATE(), 1)
    `, [userId]);

    return stats[0] || {
      sessions_this_week: 0,
      total_minutes_this_week: 0,
      programs_active_this_week: 0
    };
  }
};

module.exports = scheduleModel;

