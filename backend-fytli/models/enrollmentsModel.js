/**
 * Model pour gérer les inscriptions aux programmes (program_enrollments)
 */

const { pool } = require('../db');

/**
 * Inscrit un utilisateur à un programme
 */
const enroll = async (userId, programId) => {
  const [result] = await pool.query(
    `INSERT INTO program_enrollments (user_id, program_id) 
     VALUES (?, ?)`,
    [userId, programId]
  );
  return {
    id: result.insertId,
    user_id: userId,
    program_id: programId,
    enrolled_at: new Date(),
    status: 'active'
  };
};

/**
 * Désinscrit un utilisateur d'un programme
 */
const unenroll = async (userId, programId) => {
  const [result] = await pool.query(
    'DELETE FROM program_enrollments WHERE user_id = ? AND program_id = ?',
    [userId, programId]
  );
  return result.affectedRows > 0;
};

/**
 * Met à jour le statut d'une inscription
 */
const updateStatus = async (userId, programId, status) => {
  const [result] = await pool.query(
    'UPDATE program_enrollments SET status = ? WHERE user_id = ? AND program_id = ?',
    [status, userId, programId]
  );
  return result.affectedRows > 0;
};

/**
 * Récupère tous les utilisateurs inscrits à un programme
 */
const getUsersByProgram = async (programId) => {
  const [rows] = await pool.query(
    `SELECT 
      pe.*,
      u.first_name,
      u.last_name,
      u.email,
      COUNT(DISTINCT sc.id) as sessions_completed
    FROM program_enrollments pe
    JOIN users u ON pe.user_id = u.id
    LEFT JOIN session_completions sc ON sc.user_id = pe.user_id AND sc.program_id = pe.program_id
    WHERE pe.program_id = ?
    GROUP BY pe.id, u.id
    ORDER BY sessions_completed DESC, pe.enrolled_at ASC`,
    [programId]
  );
  return rows;
};

/**
 * Récupère tous les programmes d'un utilisateur
 */
const getProgramsByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
      pe.*,
      p.title,
      p.description,
      p.level,
      p.goal,
      p.duration_weeks,
      COUNT(DISTINCT sc.id) as sessions_completed,
      COUNT(DISTINCT s.id) as total_sessions
    FROM program_enrollments pe
    JOIN programs p ON pe.program_id = p.id
    LEFT JOIN sessions s ON s.program_id = p.id
    LEFT JOIN session_completions sc ON sc.user_id = pe.user_id AND sc.program_id = pe.program_id
    WHERE pe.user_id = ?
    GROUP BY pe.id, p.id
    ORDER BY pe.enrolled_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Vérifie si un utilisateur est inscrit à un programme
 */
const isEnrolled = async (userId, programId) => {
  const [rows] = await pool.query(
    'SELECT id FROM program_enrollments WHERE user_id = ? AND program_id = ?',
    [userId, programId]
  );
  return rows.length > 0;
};

/**
 * Récupère les statistiques d'inscription pour un programme
 */
const getProgramStats = async (programId) => {
  const [rows] = await pool.query(
    `SELECT 
      COUNT(DISTINCT pe.user_id) as total_enrolled,
      COUNT(DISTINCT CASE WHEN pe.status = 'active' THEN pe.user_id END) as active_users,
      COUNT(DISTINCT sc.id) as total_completions
    FROM program_enrollments pe
    LEFT JOIN session_completions sc ON sc.program_id = pe.program_id
    WHERE pe.program_id = ?`,
    [programId]
  );
  return rows[0];
};

module.exports = {
  enroll,
  unenroll,
  updateStatus,
  getUsersByProgram,
  getProgramsByUser,
  isEnrolled,
  getProgramStats
};

