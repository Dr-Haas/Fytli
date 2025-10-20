/**
 * Modèle pour gérer les sessions complétées
 * (Historique des sessions terminées par les utilisateurs)
 */

const { pool } = require('../db');
const { logger } = require('../config/logger');

/**
 * Créer une nouvelle completion de session
 */
const create = async (completionData) => {
  const {
    user_id,
    program_id,
    session_id,
    duration_minutes,
    notes,
    feeling,
    photo_url,
    average_heart_rate,
    calories_burned,
    exercises_data
  } = completionData;

  const [result] = await pool.query(
    `INSERT INTO session_completions 
    (user_id, program_id, session_id, duration_minutes, notes, feeling, photo_url, average_heart_rate, calories_burned, exercises_data) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, program_id, session_id, duration_minutes, notes, feeling, photo_url, average_heart_rate, calories_burned, exercises_data ? JSON.stringify(exercises_data) : null]
  );

  return {
    id: result.insertId,
    user_id,
    program_id,
    session_id,
    duration_minutes,
    notes,
    feeling,
    photo_url,
    completed_at: new Date()
  };
};

/**
 * Récupérer les completions d'un utilisateur
 */
const getByUser = async (userId, limit = 50) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      p.title as program_title,
      s.title as session_title,
      s.order_index as session_order
    FROM session_completions sc
    JOIN programs p ON sc.program_id = p.id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.user_id = ?
    ORDER BY sc.completed_at DESC
    LIMIT ?`,
    [userId, limit]
  );
  return rows;
};

/**
 * Récupérer les completions d'un programme
 */
const getByProgram = async (programId, limit = 50) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name,
      u.last_name,
      s.title as session_title,
      s.order_index as session_order
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.user_id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.program_id = ?
    ORDER BY sc.completed_at DESC
    LIMIT ?`,
    [programId, limit]
  );
  return rows;
};

/**
 * Récupérer les completions d'une session spécifique
 */
const getBySession = async (sessionId, limit = 50) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name,
      u.last_name,
      p.title as program_title
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.user_id
    JOIN programs p ON sc.program_id = p.id
    WHERE sc.session_id = ?
    ORDER BY sc.completed_at DESC
    LIMIT ?`,
    [sessionId, limit]
  );
  return rows;
};

/**
 * Récupérer une completion spécifique par ID
 */
const getById = async (completionId) => {
  const [rows] = await pool.query(
    `SELECT 
      sc.*,
      u.first_name,
      u.last_name,
      u.email,
      p.title as program_title,
      s.title as session_title,
      s.order_index as session_order
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.user_id
    JOIN programs p ON sc.program_id = p.id
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.id = ?`,
    [completionId]
  );
  return rows[0];
};

/**
 * Mettre à jour une completion existante (notes, feeling, photo)
 */
const update = async (completionId, updateData) => {
  const { notes, feeling, photo_url } = updateData;
  
  const [result] = await pool.query(
    `UPDATE session_completions 
    SET notes = ?, feeling = ?, photo_url = ?
    WHERE id = ?`,
    [notes, feeling, photo_url, completionId]
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprimer une completion
 */
const deleteById = async (completionId) => {
  const [result] = await pool.query(
    'DELETE FROM session_completions WHERE id = ?',
    [completionId]
  );
  return result.affectedRows > 0;
};

/**
 * Obtenir les stats utilisateur/programme
 */
const getUserProgramStats = async (userId, programId) => {
  const [rows] = await pool.query(
    `SELECT 
      COUNT(*) as total_completions,
      AVG(duration_minutes) as avg_duration,
      MAX(completed_at) as last_completion,
      COUNT(DISTINCT session_id) as unique_sessions
    FROM session_completions
    WHERE user_id = ? AND program_id = ?`,
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
      s.order_index as session_order,
      s.description as session_description
    FROM session_completions sc
    JOIN users u ON sc.user_id = u.user_id
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
  update,
  getByUser,
  getByProgram,
  getBySession,
  getById,
  deleteById,
  getUserProgramStats,
  getProgramActivityFeed
};
