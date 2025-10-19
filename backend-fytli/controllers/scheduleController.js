const scheduleModel = require('../models/scheduleModel');
const { logger } = require('../config/logger');

const scheduleController = {
  /**
   * GET /api/schedule/daily
   * Récupérer l'agenda du jour
   */
  async getDailySchedule(req, res) {
    try {
      const userId = req.user.userId;
      const schedule = await scheduleModel.getDailySchedule(userId);

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'agenda du jour:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de l\'agenda' 
      });
    }
  },

  /**
   * GET /api/schedule/weekly
   * Récupérer l'agenda de la semaine
   */
  async getWeeklySchedule(req, res) {
    try {
      const userId = req.user.userId;
      const schedule = await scheduleModel.getWeeklySchedule(userId);

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'agenda hebdomadaire:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de l\'agenda' 
      });
    }
  },

  /**
   * GET /api/schedule/next-session/:programId
   * Récupérer la prochaine session suggérée
   */
  async getNextSession(req, res) {
    try {
      const userId = req.user.userId;
      const { programId } = req.params;

      const nextSession = await scheduleModel.getNextSession(userId, parseInt(programId));

      if (!nextSession) {
        return res.status(404).json({
          error: 'Aucune session trouvée pour ce programme'
        });
      }

      res.json({
        success: true,
        data: nextSession
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la prochaine session:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de la session' 
      });
    }
  },

  /**
   * GET /api/schedule/weekly-stats
   * Récupérer les statistiques de la semaine
   */
  async getWeeklyStats(req, res) {
    try {
      const userId = req.user.userId;
      const stats = await scheduleModel.getWeeklyStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des stats hebdomadaires:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des statistiques' 
      });
    }
  }
};

module.exports = scheduleController;

