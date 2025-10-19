import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, ArrowRight, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import scheduleService, { DailyScheduleSession } from '../services/schedule';

export const DailySchedule = () => {
  const [sessions, setSessions] = useState<DailyScheduleSession[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getDailySchedule();
      setSessions(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (session: DailyScheduleSession) => {
    navigate(`/session/${session.session_id}`);
  };

  const getTimeDisplay = (session: DailyScheduleSession) => {
    if (session.is_time_specific && session.time_slot_start && session.time_slot_end) {
      const start = scheduleService.formatTime(session.time_slot_start);
      const end = scheduleService.formatTime(session.time_slot_end);
      return `${start} - ${end}`;
    }
    return 'Flexible';
  };

  const getStatusColor = (session: DailyScheduleSession) => {
    if (session.completed_today) {
      return 'bg-green-500/10 border-green-500';
    }
    if (session.is_time_specific && scheduleService.isTimeSlotNow(session.time_slot_start, session.time_slot_end)) {
      return 'bg-fytli-orange/10 border-fytli-orange';
    }
    if (session.is_time_specific && scheduleService.isTimeSlotPassed(session.time_slot_end)) {
      return 'bg-gray-100 border-gray-300';
    }
    return 'bg-fytli-cream border-fytli-orange/30';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6 text-fytli-orange" />
          <h2 className="text-xl font-bold">Agenda du jour</h2>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6 text-fytli-orange" />
          <h2 className="text-xl font-bold">Agenda du jour</h2>
        </div>
        <div className="text-center py-8">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Aucune session prévue aujourd'hui</p>
          <button
            onClick={() => navigate('/programs')}
            className="mt-4 text-fytli-orange hover:text-fytli-red transition-colors font-medium"
          >
            Découvrir les programmes →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-fytli-orange" />
          <h2 className="text-xl font-bold">Agenda du jour</h2>
        </div>
        <span className="text-sm text-gray-500">
          {sessions.filter(s => s.completed_today).length}/{sessions.length} complétées
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <motion.button
            key={`${session.program_id}-${session.session_id}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSessionClick(session)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${getStatusColor(session)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Titre du programme */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-fytli-orange">
                    {session.program_title}
                  </span>
                  {session.completed_today && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>

                {/* Titre de la session */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {session.session_title}
                </h3>

                {/* Infos horaire et durée */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeDisplay(session)}</span>
                  </div>
                  {session.target_duration_minutes && (
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      <span>{session.target_duration_minutes} min</span>
                    </div>
                  )}
                  {session.completion_count > 0 && (
                    <span className="text-xs text-gray-400">
                      Faite {session.completion_count}x
                    </span>
                  )}
                </div>

                {/* Badge statut */}
                {session.is_time_specific && scheduleService.isTimeSlotNow(session.time_slot_start, session.time_slot_end) && !session.completed_today && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-fytli-orange text-white text-xs font-bold rounded-full animate-pulse">
                      C'est maintenant !
                    </span>
                  </div>
                )}
              </div>

              <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => navigate('/programs')}
        className="w-full mt-4 py-2 text-sm text-fytli-orange hover:text-fytli-red transition-colors font-medium"
      >
        Voir tous les programmes →
      </button>
    </div>
  );
};

