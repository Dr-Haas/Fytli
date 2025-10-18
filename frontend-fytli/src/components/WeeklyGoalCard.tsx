import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { weeklyGoalsService, weeklyGoalHelpers } from '../services/weeklyGoals';
import { WeeklyGoalProgress } from '../types';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';

interface WeeklyGoalCardProps {
  onCreateGoal?: () => void;
}

export default function WeeklyGoalCard({ onCreateGoal }: WeeklyGoalCardProps) {
  const { user } = useAuth();
  const [goalProgress, setGoalProgress] = useState<WeeklyGoalProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyGoal();
  }, [user]);

  const loadWeeklyGoal = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const progress = await weeklyGoalsService.getCurrentWeeklyGoal(user.id);
      setGoalProgress(progress);
    } catch (error) {
      console.error('Erreur loadWeeklyGoal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Aucun objectif défini
  if (!goalProgress) {
    return (
      <div className="bg-gradient-to-br from-fytli-red to-fytli-orange rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Objectif de la semaine</h3>
              <p className="text-sm text-white/80">Pas d'objectif défini</p>
            </div>
          </div>
        </div>

        <p className="text-white/90 mb-4">
          Définis un objectif hebdomadaire pour rester motivé et suivre ta progression !
        </p>

        <button
          onClick={onCreateGoal}
          className="w-full bg-white text-fytli-red font-semibold py-3 px-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer un objectif
        </button>
      </div>
    );
  }

  const { goal, progress_percent, remaining, days_left } = goalProgress;
  const icon = weeklyGoalHelpers.getGoalTypeIcon(goal.goal_type);
  const description = weeklyGoalHelpers.formatGoalDescription(goal);
  const progressMessage = weeklyGoalHelpers.getProgressMessage(goalProgress);
  const progressColor = weeklyGoalHelpers.getProgressColor(progress_percent);

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${
      goal.goal_achieved 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
        : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            goal.goal_achieved ? 'bg-white/20' : 'bg-fytli-red/10'
          }`}>
            {goal.goal_achieved ? '🎉' : icon}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              goal.goal_achieved ? 'text-white' : 'text-gray-900'
            }`}>
              Objectif de la semaine
            </h3>
            <p className={`text-sm ${
              goal.goal_achieved ? 'text-white/80' : 'text-gray-500'
            }`}>
              {description}
            </p>
          </div>
        </div>

        {!goal.goal_achieved && (
          <button
            onClick={onCreateGoal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Modifier l'objectif"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${
            goal.goal_achieved ? 'text-white' : 'text-gray-700'
          }`}>
            {progressMessage}
          </span>
          <span className={`text-sm font-bold ${
            goal.goal_achieved ? 'text-white' : 'text-fytli-red'
          }`}>
            {goal.goal_current} / {goal.goal_target}
          </span>
        </div>

        <div className={`w-full h-3 rounded-full overflow-hidden ${
          goal.goal_achieved ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full transition-all duration-500 ${
              goal.goal_achieved ? 'bg-white' : progressColor
            }`}
            style={{ width: `${progress_percent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {!goal.goal_achieved && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-fytli-red">
              {progress_percent}%
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Progression
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-fytli-orange">
              {remaining}
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Target className="w-3 h-3" />
              Restant
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {days_left}j
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              Restant
            </div>
          </div>
        </div>
      )}

      {/* Message d'accomplissement */}
      {goal.goal_achieved && (
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-semibold mb-2">
            🏆 Félicitations !
          </p>
          <p className="text-white/90 text-sm">
            Tu as atteint ton objectif de la semaine. Continue comme ça !
          </p>
        </div>
      )}
    </div>
  );
}

