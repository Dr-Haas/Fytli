/**
 * Modèle Body Composition - Gestion des mesures corporelles
 * Gère le poids, taille, masse grasse/maigre, IMC, objectifs et statistiques
 */

const { pool } = require('../db');

const bodyCompositionModel = {
  // =====================================================
  // BODY MEASUREMENTS - Mesures corporelles
  // =====================================================

  /**
   * Créer une nouvelle mesure corporelle
   */
  async createMeasurement(data) {
    const {
      user_id,
      weight_kg,
      height_cm,
      body_fat_percent = null,
      lean_mass_percent = null,
      muscle_mass_kg = null,
      waist_cm = null,
      chest_cm = null,
      hips_cm = null,
      arms_cm = null,
      thighs_cm = null,
      notes = null,
      measurement_date = null // Laisse MySQL utiliser CURRENT_TIMESTAMP par défaut
    } = data;

    const [result] = await pool.query(
      `INSERT INTO body_measurements (
        user_id, weight_kg, height_cm, body_fat_percent, lean_mass_percent,
        muscle_mass_kg, waist_cm, chest_cm, hips_cm, arms_cm, thighs_cm,
        notes, measurement_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, weight_kg, height_cm, body_fat_percent, lean_mass_percent,
        muscle_mass_kg, waist_cm, chest_cm, hips_cm, arms_cm, thighs_cm,
        notes, measurement_date
      ]
    );

    return {
      id: result.insertId,
      user_id,
      weight_kg,
      height_cm,
      body_fat_percent,
      lean_mass_percent,
      bmi: weight_kg / Math.pow(height_cm / 100, 2),
      measurement_date
    };
  },

  /**
   * Récupérer toutes les mesures d'un utilisateur
   */
  async getUserMeasurements(userId, limit = 50) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        user_id,
        weight_kg,
        height_cm,
        body_fat_percent,
        lean_mass_percent,
        muscle_mass_kg,
        bmi,
        waist_cm,
        chest_cm,
        hips_cm,
        arms_cm,
        thighs_cm,
        notes,
        measurement_date,
        created_at
      FROM body_measurements
      WHERE user_id = ?
      ORDER BY measurement_date DESC
      LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  /**
   * Récupérer la dernière mesure d'un utilisateur
   */
  async getLatestMeasurement(userId) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        user_id,
        weight_kg,
        height_cm,
        body_fat_percent,
        lean_mass_percent,
        muscle_mass_kg,
        bmi,
        waist_cm,
        chest_cm,
        hips_cm,
        arms_cm,
        thighs_cm,
        notes,
        measurement_date,
        created_at
      FROM body_measurements
      WHERE user_id = ?
      ORDER BY measurement_date DESC
      LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Récupérer une mesure par ID
   */
  async getMeasurementById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM body_measurements WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Mettre à jour une mesure
   */
  async updateMeasurement(id, data) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'weight_kg', 'height_cm', 'body_fat_percent', 'lean_mass_percent',
      'muscle_mass_kg', 'waist_cm', 'chest_cm', 'hips_cm', 'arms_cm',
      'thighs_cm', 'notes', 'measurement_date'
    ];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE body_measurements SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  /**
   * Supprimer une mesure
   */
  async deleteMeasurement(id) {
    const [result] = await pool.query(
      `DELETE FROM body_measurements WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Récupérer les mesures sur une période
   */
  async getMeasurementsByPeriod(userId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        weight_kg,
        height_cm,
        body_fat_percent,
        lean_mass_percent,
        muscle_mass_kg,
        bmi,
        waist_cm,
        measurement_date
      FROM body_measurements
      WHERE user_id = ?
      AND measurement_date BETWEEN ? AND ?
      ORDER BY measurement_date ASC`,
      [userId, startDate, endDate]
    );
    return rows;
  },

  // =====================================================
  // BODY STATS - Statistiques
  // =====================================================

  /**
   * Récupérer les statistiques corporelles d'un utilisateur
   */
  async getUserBodyStats(userId) {
    const [rows] = await pool.query(
      `SELECT 
        user_id,
        current_weight,
        current_height,
        current_body_fat,
        current_bmi,
        starting_weight,
        starting_body_fat,
        total_weight_change,
        total_body_fat_change,
        total_measurements,
        first_measurement_date,
        last_measurement_date,
        tracking_days
      FROM body_stats
      WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Calculer les statistiques d'évolution
   */
  async getProgressStats(userId, period = 30) {
    const [rows] = await pool.query(
      `SELECT 
        AVG(weight_kg) as avg_weight,
        MIN(weight_kg) as min_weight,
        MAX(weight_kg) as max_weight,
        AVG(body_fat_percent) as avg_body_fat,
        AVG(bmi) as avg_bmi,
        COUNT(*) as measurements_count
      FROM body_measurements
      WHERE user_id = ?
      AND measurement_date >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [userId, period]
    );
    return rows[0];
  },

  /**
   * Obtenir l'évolution du poids (pour graphiques)
   */
  async getWeightTrend(userId, days = 90) {
    const [rows] = await pool.query(
      `SELECT 
        DATE(measurement_date) as date,
        weight_kg,
        bmi
      FROM body_measurements
      WHERE user_id = ?
      AND measurement_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY measurement_date ASC`,
      [userId, days]
    );
    return rows;
  },

  /**
   * Obtenir l'évolution de la composition corporelle
   */
  async getCompositionTrend(userId, days = 90) {
    const [rows] = await pool.query(
      `SELECT 
        DATE(measurement_date) as date,
        body_fat_percent,
        lean_mass_percent,
        muscle_mass_kg
      FROM body_measurements
      WHERE user_id = ?
      AND measurement_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      AND body_fat_percent IS NOT NULL
      ORDER BY measurement_date ASC`,
      [userId, days]
    );
    return rows;
  },

  // =====================================================
  // BODY GOALS - Objectifs
  // =====================================================

  /**
   * Créer un nouvel objectif corporel
   */
  async createGoal(data) {
    try {
      console.log('🔵 [MODEL createGoal] Début - data:', JSON.stringify(data));
      
      const {
        user_id,
        goal_type,
        target_weight_kg = null,
        target_body_fat_percent = null,
        target_muscle_mass_kg = null,
        start_date,
        target_date,
        description = null
      } = data;

      console.log('🔵 [MODEL createGoal] Paramètres extraits:', {
        user_id, goal_type, target_weight_kg, start_date, target_date
      });

      console.log('🔵 [MODEL createGoal] Tentative d\'insertion SQL...');
      
      const [result] = await pool.query(
        `INSERT INTO body_goals (
          user_id, goal_type, target_weight_kg, target_body_fat_percent,
          target_muscle_mass_kg, start_date, target_date, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, goal_type, target_weight_kg, target_body_fat_percent,
          target_muscle_mass_kg, start_date, target_date, description
        ]
      );

      console.log('✅ [MODEL createGoal] Insertion réussie, insertId:', result.insertId);

      return {
        id: result.insertId,
        user_id,
        goal_type,
        target_weight_kg,
        target_body_fat_percent,
        target_muscle_mass_kg,
        start_date,
        target_date,
        status: 'active'
      };
    } catch (error) {
      console.error('❌ [MODEL createGoal] Erreur SQL:', error.message);
      console.error('❌ [MODEL createGoal] Code:', error.code);
      console.error('❌ [MODEL createGoal] SQL State:', error.sqlState);
      throw error;
    }
  },

  /**
   * Récupérer tous les objectifs d'un utilisateur
   */
  async getUserGoals(userId) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        user_id,
        goal_type,
        target_weight_kg,
        target_body_fat_percent,
        target_muscle_mass_kg,
        start_date,
        target_date,
        completed_date,
        status,
        description,
        created_at,
        updated_at
      FROM body_goals
      WHERE user_id = ?
      ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Récupérer l'objectif actif d'un utilisateur
   */
  async getActiveGoal(userId) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        user_id,
        goal_type,
        target_weight_kg,
        target_body_fat_percent,
        target_muscle_mass_kg,
        start_date,
        target_date,
        status,
        description
      FROM body_goals
      WHERE user_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Récupérer la progression d'un objectif
   */
  async getGoalProgress(goalId) {
    const [rows] = await pool.query(
      `SELECT 
        goal_id,
        user_id,
        goal_type,
        status,
        start_date,
        target_date,
        start_weight,
        start_body_fat,
        current_weight,
        current_body_fat,
        target_weight_kg,
        target_body_fat_percent,
        target_muscle_mass_kg,
        progress_percent,
        days_remaining,
        days_elapsed
      FROM goal_progress
      WHERE goal_id = ?`,
      [goalId]
    );
    return rows[0] || null;
  },

  /**
   * Mettre à jour le statut d'un objectif
   */
  async updateGoalStatus(goalId, status, completedDate = null) {
    const [result] = await pool.query(
      `UPDATE body_goals 
       SET status = ?, completed_date = ?
       WHERE id = ?`,
      [status, completedDate, goalId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Supprimer un objectif
   */
  async deleteGoal(goalId) {
    const [result] = await pool.query(
      `DELETE FROM body_goals WHERE id = ?`,
      [goalId]
    );
    return result.affectedRows > 0;
  },

  // =====================================================
  // PROGRESS PHOTOS - Photos de progression
  // =====================================================

  /**
   * Ajouter une photo de progression
   */
  async addProgressPhoto(data) {
    const {
      user_id,
      measurement_id = null,
      photo_url,
      photo_type = 'front',
      notes = null,
      taken_at = new Date()
    } = data;

    const [result] = await pool.query(
      `INSERT INTO body_progress_photos (
        user_id, measurement_id, photo_url, photo_type, notes, taken_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, measurement_id, photo_url, photo_type, notes, taken_at]
    );

    return {
      id: result.insertId,
      user_id,
      photo_url,
      photo_type,
      taken_at
    };
  },

  /**
   * Récupérer les photos de progression d'un utilisateur
   */
  async getUserProgressPhotos(userId, limit = 20) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        user_id,
        measurement_id,
        photo_url,
        photo_type,
        notes,
        taken_at
      FROM body_progress_photos
      WHERE user_id = ?
      ORDER BY taken_at DESC
      LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  /**
   * Supprimer une photo de progression
   */
  async deleteProgressPhoto(photoId) {
    const [result] = await pool.query(
      `DELETE FROM body_progress_photos WHERE id = ?`,
      [photoId]
    );
    return result.affectedRows > 0;
  },

  // =====================================================
  // BADGES - Vérification automatique (VERSION NO FUNCTION)
  // =====================================================

  /**
   * Vérifier tous les badges corporels d'un utilisateur
   * VERSION SANS PROCÉDURES SQL - Compatible OVH
   */
  async checkBodyBadges(userId) {
    try {
      // Récupérer toutes les mesures de l'utilisateur
      const [measurements] = await pool.query(
        `SELECT * FROM body_measurements WHERE user_id = ? ORDER BY measurement_date ASC`,
        [userId]
      );

      if (measurements.length === 0) return false;

      // Badge "Mesure Parfaite" : 12 mesures
      if (measurements.length >= 12) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Mesure Parfaite'`,
          [userId]
        );
      }

      // Badge "Tracker Assidu" : 4 semaines consécutives
      const weekCounts = new Set();
      measurements.forEach(m => {
        const date = new Date(m.measurement_date);
        const year = date.getFullYear();
        const week = this.getWeekNumber(date);
        weekCounts.add(`${year}-${week}`);
      });
      
      if (weekCounts.size >= 4) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Tracker Assidu'`,
          [userId]
        );
      }

      // Calculer les changements de poids et masse grasse
      const firstMeasurement = measurements[0];
      const lastMeasurement = measurements[measurements.length - 1];
      
      const weightChange = lastMeasurement.weight_kg - firstMeasurement.weight_kg;
      const bodyFatChange = (lastMeasurement.body_fat_percent || 0) - (firstMeasurement.body_fat_percent || 0);

      // Badges de perte de poids
      if (weightChange <= -1) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Première Victoire'`,
          [userId]
        );
      }
      if (weightChange <= -5) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Transformation Débutante'`,
          [userId]
        );
      }
      if (weightChange <= -10) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Grande Transformation'`,
          [userId]
        );
      }
      if (weightChange <= -15) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Transformation Héroïque'`,
          [userId]
        );
      }

      // Badge "Sculpteur" : -5% masse grasse
      if (bodyFatChange <= -5 && firstMeasurement.body_fat_percent) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Sculpteur'`,
          [userId]
        );
      }

      // Badge "Maître de la Composition" : -10% masse grasse
      if (bodyFatChange <= -10 && firstMeasurement.body_fat_percent) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Maître de la Composition'`,
          [userId]
        );
      }

      // Badge "Corps Équilibré" : IMC dans zone santé
      if (lastMeasurement.bmi && lastMeasurement.bmi >= 18.5 && lastMeasurement.bmi <= 24.9) {
        await pool.query(
          `INSERT IGNORE INTO user_badges (user_id, badge_id)
           SELECT ?, id FROM badges WHERE name = 'Corps Équilibré'`,
          [userId]
        );
      }

      // Badge "Muscle en Croissance" : +2 kg muscle
      if (lastMeasurement.muscle_mass_kg && firstMeasurement.muscle_mass_kg) {
        const muscleGain = lastMeasurement.muscle_mass_kg - firstMeasurement.muscle_mass_kg;
        if (muscleGain >= 2) {
          await pool.query(
            `INSERT IGNORE INTO user_badges (user_id, badge_id)
             SELECT ?, id FROM badges WHERE name = 'Muscle en Croissance'`,
            [userId]
          );
        }
        if (muscleGain >= 5) {
          await pool.query(
            `INSERT IGNORE INTO user_badges (user_id, badge_id)
             SELECT ?, id FROM badges WHERE name = 'Constructeur'`,
            [userId]
          );
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur check_body_badges:', error);
      return false;
    }
  },

  /**
   * Fonction utilitaire pour calculer le numéro de semaine
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  },

  /**
   * Récupérer les badges de composition corporelle débloqués
   */
  async getBodyBadgesEarned(userId) {
    const [rows] = await pool.query(
      `SELECT 
        b.id as badge_id,
        b.name,
        b.description,
        b.icon,
        b.color,
        b.gradient,
        b.points,
        ub.earned_at
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ?
      AND b.name IN (
        'Tracker Assidu', 'Mesure Parfaite', 'Première Victoire',
        'Transformation Débutante', 'Grande Transformation', 'Transformation Héroïque',
        'Muscle en Croissance', 'Constructeur', 'Sculpteur',
        'Maître de la Composition', 'Corps Équilibré', 'Stabilité',
        'Longue Durée', 'Phoenix'
      )
      ORDER BY ub.earned_at DESC`,
      [userId]
    );
    return rows;
  }
};

module.exports = bodyCompositionModel;

