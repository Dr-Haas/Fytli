/**
 * Model pour gérer les sessions complétées (session_completions)
 */

const { pool } = require('../db');

/**
 * Enregistre une session complétée
 */
const create = async (data) => {
  const {
    user_id,
    program_id,
    session_id,
    duration_minutes,
    photo_url,
    notes,
    feeling
  } = data;

  const [result] = await pool.query(
    `INSERT INTO session_completions 
     (user_id, program_id, session_id, duration_minutes, photo_url, notes, feeling) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user_id, program_id, session_id, duration_minutes, photo_url, notes, feeling]
  );

  return {
    id: result.insertId,
    user_id,
    program_id,
    session_id,
    duration_minutes,
    photo_url,
    notes,
    feeling,
    completed_at: new Date()
  };
};

/**
 * Récupère toutes les sessions complétées pour un utilisateur
 */
const getByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      p.title as program_title,
      s.title as session_title,
      s.order as session_order
    FROM session_completions sc
    JOIN programs p ON sc.program_id = p.id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.user_id = ?
    ORDER BY sc.completed_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Récupère toutes les sessions complétées pour un programme
 */
const getByProgram = async (programId) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name,
      u.last_name,
      s.title as session_title,
      s.order as session_order
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.program_id = ?
    ORDER BY sc.completed_at DESC
    LIMIT 50`,
    [programId]
  );
  return rows;
};

/**
 * Récupère toutes les sessions complétées pour une session spécifique
 */
const getBySession = async (sessionId) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name,
      u.last_name
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.id
    WHERE sc.session_id = ?
    ORDER BY sc.completed_at DESC`,
    [sessionId]
  );
  return rows;
};

/**
 * Récupère une completion spécifique avec toutes les infos
 */
const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name as user_first_name,
      u.last_name as user_last_name,
      u.email as user_email,
      p.title as program_title,
      p.description as program_description,
      s.title as session_title,
      s.order as session_order
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.id
    JOIN programs p ON sc.program_id = p.id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Supprime une completion
 */
const deleteById = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM session_completions WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Récupère les statistiques de complétion pour un utilisateur sur un programme
 */
const getUserProgramStats = async (userId, programId) => {
  const [rows] = await pool.query(
    `SELECT 
      COUNT(DISTINCT sc.id) as total_completions,
      COUNT(DISTINCT sc.session_id) as unique_sessions_completed,
      SUM(sc.duration_minutes) as total_minutes,
      MAX(sc.completed_at) as last_completion
    FROM session_completions sc
    WHERE sc.user_id = ? AND sc.program_id = ?`,
    [userId, programId]
  );
  return rows[0];
};

/**
 * Récupère le feed d'activité récente pour un programme (avec photos)
 */
const getProgramActivityFeed = async (programId, limit = 20) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name,
      u.last_name,
      s.title as session_title,
      s.order as session_order
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.program_id = ?
    ORDER BY sc.completed_at DESC
    LIMIT ?`,
    [programId, limit]
  );
  return rows;
};

module.exports = {
  create,
  getByUser,
  getByProgram,
  getBySession,
  getById,
  deleteById,
  getUserProgramStats,
  getProgramActivityFeed
};

