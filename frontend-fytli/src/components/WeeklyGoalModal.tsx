import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { weeklyGoalsService, weeklyGoalHelpers } from '../services/weeklyGoals';
import { CreateWeeklyGoalData, WeeklyGoalType, Program } from '../types';
import { programsService } from '../services/programs';
import toast from 'react-hot-toast';

interface WeeklyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WeeklyGoalModal({ isOpen, onClose, onSuccess }: WeeklyGoalModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  
  const [formData, setFormData] = useState<CreateWeeklyGoalData>({
    goal_type: 'workouts',
    goal_target: 3,
    description: '',
    target_programs: [],
    target_sessions: []
  });

  useEffect(() => {
    if (isOpen) {
      loadPrograms();
      loadSuggestion();
    }
  }, [isOpen]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Erreur loadPrograms:', error);
    }
  };

  const loadSuggestion = async () => {
    if (!user) return;
    
    try {
      const suggestion = await weeklyGoalsService.suggestWeeklyGoal(user.id);
      setFormData(prev => ({ ...prev, ...suggestion }));
    } catch (error) {
      console.error('Erreur loadSuggestion:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      // Validation
      if (formData.goal_target < 1) {
        toast.error('L\'objectif doit être au moins de 1');
        return;
      }

      if (formData.goal_type === 'programs' && (!formData.target_programs || formData.target_programs.length === 0)) {
        toast.error('Sélectionne au moins un programme');
        return;
      }

      await weeklyGoalsService.createWeeklyGoal(user.id, formData);
      
      toast.success('🎯 Objectif créé avec succès !');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur handleSubmit:', error);
      toast.error('Erreur lors de la création de l\'objectif');
    } finally {
      setLoading(false);
    }
  };

  const goalTypes: { value: WeeklyGoalType; label: string; icon: string; example: string }[] = [
    { value: 'workouts', label: 'Séances', icon: '🏋️', example: 'Ex: 3 séances cette semaine' },
    { value: 'streak', label: 'Jours consécutifs', icon: '🔥', example: 'Ex: Enchaîner 5 jours' },
    { value: 'duration', label: 'Durée (min)', icon: '⏱️', example: 'Ex: 150 minutes au total' },
    { value: 'exercises', label: 'Exercices', icon: '💪', example: 'Ex: 50 exercices complétés' },
    { value: 'programs', label: 'Programmes', icon: '📋', example: 'Ex: Compléter un programme' },
  ];

  const handleProgramToggle = (programId: number) => {
    setFormData(prev => {
      const current = prev.target_programs || [];
      const isSelected = current.includes(programId);
      
      return {
        ...prev,
        target_programs: isSelected
          ? current.filter(id => id !== programId)
          : [...current, programId]
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🎯 Nouvel objectif hebdomadaire
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Définis ton objectif pour cette semaine
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type d'objectif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type d'objectif *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal_type: type.value })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.goal_type === type.value
                        ? 'border-fytli-red bg-fytli-red/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-semibold text-gray-900">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{type.example}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Objectif cible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif à atteindre *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={formData.goal_target}
                  onChange={(e) => setFormData({ ...formData, goal_target: parseInt(e.target.value) || 1 })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fytli-red focus:border-transparent"
                  required
                />
                <span className="text-gray-600 font-medium">
                  {weeklyGoalHelpers.getGoalTypeLabel(formData.goal_type).toLowerCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {weeklyGoalHelpers.formatGoalDescription({
                  goal_type: formData.goal_type,
                  goal_target: formData.goal_target,
                } as any)}
              </p>
            </div>

            {/* Sélection de programmes (si type = programs) */}
            {formData.goal_type === 'programs' && programs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Programmes à compléter *
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {programs.map((program) => (
                    <label
                      key={program.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.target_programs?.includes(program.id) || false}
                        onChange={() => handleProgramToggle(program.id)}
                        className="w-5 h-5 text-fytli-red border-gray-300 rounded focus:ring-fytli-red"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{program.title}</div>
                        <div className="text-sm text-gray-500">
                          {program.level} • {program.duration_weeks} semaines
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.target_programs?.length || 0} programme(s) sélectionné(s)
                </p>
              </div>
            )}

            {/* Description personnalisée (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description personnalisée (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Ex: Je veux m'entraîner tous les matins avant le travail"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fytli-red focus:border-transparent resize-none"
              />
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Conseil</p>
                  <p className="text-sm text-blue-700">
                    Commence par un objectif réaliste ! Mieux vaut un petit objectif accompli qu'un grand objectif raté.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-fytli-red to-fytli-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : '✨ Créer l\'objectif'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

