import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import scheduleService, { WeeklyScheduleProgram } from '../services/schedule';

export const ProgramSchedule = () => {
  const [programs, setPrograms] = useState<WeeklyScheduleProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getWeeklySchedule();
      setPrograms(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeDisplay = (program: WeeklyScheduleProgram) => {
    if (program.is_time_specific && program.time_slot_start && program.time_slot_end) {
      const start = scheduleService.formatTime(program.time_slot_start);
      const end = scheduleService.formatTime(program.time_slot_end);
      return `${start} - ${end}`;
    }
    return 'À votre rythme';
  };

  const getWeekProgress = (program: WeeklyScheduleProgram) => {
    if (!program.sessions_per_week) return 0;
    return Math.min(100, (program.sessions_completed_this_week / program.sessions_per_week) * 100);
  };

  const getTimeSlotLabel = (program: WeeklyScheduleProgram) => {
    if (!program.is_time_specific) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    if (program.time_slot_start) {
      const [startHour] = program.time_slot_start.split(':').map(Number);
      
      if (currentHour >= 5 && currentHour < 11 && startHour >= 5 && startHour < 11) {
        return { label: 'Matinée', color: 'bg-yellow-100 text-yellow-800', icon: '🌅' };
      } else if (currentHour >= 11 && currentHour < 14 && startHour >= 11 && startHour < 14) {
        return { label: 'Midi', color: 'bg-orange-100 text-orange-800', icon: '☀️' };
      } else if (currentHour >= 16 && currentHour < 20 && startHour >= 16 && startHour < 20) {
        return { label: 'Après-midi', color: 'bg-blue-100 text-blue-800', icon: '🌤️' };
      } else if ((currentHour >= 20 || currentHour < 5) && (startHour >= 20 || startHour < 5)) {
        return { label: 'Soirée', color: 'bg-indigo-100 text-indigo-800', icon: '🌙' };
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-4">Aucun programme actif cette semaine</p>
        <button
          onClick={() => navigate('/programs')}
          className="px-6 py-2 bg-fytli-orange text-white rounded-full hover:bg-fytli-red transition-colors"
        >
          Découvrir les programmes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Planning de la semaine</h3>
        <span className="text-sm text-gray-500">
          {programs.reduce((sum, p) => sum + p.sessions_completed_this_week, 0)} sessions complétées
        </span>
      </div>

      <AnimatePresence>
        {programs.map((program, index) => {
          const progress = getWeekProgress(program);
          const timeSlot = getTimeSlotLabel(program);
          const isInProgress = program.sessions_completed_this_week > 0 && program.sessions_completed_this_week < program.sessions_per_week;

          return (
            <motion.div
              key={program.program_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-4">
                {/* Image du programme */}
                {program.image_url && (
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  {/* Titre et badges */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{program.title}</h4>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Badge créneau horaire */}
                        {program.is_time_specific && timeSlot && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${timeSlot.color}`}>
                            <span>{timeSlot.icon}</span>
                            {timeSlot.label}
                          </span>
                        )}
                        
                        {/* Badge en cours */}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-fytli-orange/10 text-fytli-orange rounded-full text-xs font-medium">
                            <TrendingUp className="h-3 w-3" />
                            En cours
                          </span>
                        )}
                        
                        {/* Badge terminé */}
                        {program.sessions_completed_this_week >= program.sessions_per_week && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Objectif atteint
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/programs/${program.program_id}`)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Horaires */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeDisplay(program)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{program.sessions_per_week}x/semaine</span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {program.sessions_completed_this_week}/{program.sessions_per_week} sessions
                      </span>
                      <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          progress >= 100
                            ? 'bg-green-500'
                            : progress > 0
                            ? 'bg-fytli-orange'
                            : 'bg-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

