import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card } from './ui/Card';

interface Exercise {
  id: number;
  name: string;
  type?: string;
}

interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  rest_time_sec: number;
}

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProgramFormData) => Promise<void>;
  availableExercises: Exercise[];
}

export interface ProgramFormData {
  title: string;
  description: string;
  goal?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  exercises: SelectedExercise[];
}

export const CreateProgramModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableExercises,
}: CreateProgramModalProps) => {
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    goal: '',
    level: 'beginner',
    duration_weeks: 4,
    exercises: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (formData.exercises.length === 0) {
      setError('Ajoutez au moins un exercice');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        goal: '',
        level: 'beginner',
        duration_weeks: 4,
        exercises: [],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const addExercise = (exercise: Exercise) => {
    if (formData.exercises.find(e => e.id === exercise.id)) {
      setError('Cet exercice est déjà ajouté');
      return;
    }

    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        {
          ...exercise,
          sets: 3,
          reps: 12,
          rest_time_sec: 60,
        },
      ],
    });
    setError('');
  };

  const removeExercise = (exerciseId: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter(e => e.id !== exerciseId),
    });
  };

  const updateExercise = (exerciseId: number, field: keyof SelectedExercise, value: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.map(e =>
        e.id === exerciseId ? { ...e, [field]: value } : e
      ),
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        {/* Modal/Page */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-fytli-lg shadow-fytli-hover overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="h-full flex flex-col">
          {/* Header - mobile-optimized */}
          <div className="sticky top-0 bg-background border-b px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between z-10">
            <h2 className="text-lg lg:text-2xl font-bold text-gradient">Créer un programme</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto">

            <form id="create-program-form" onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
            {/* Informations du programme */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Titre du programme *</Label>
                <Input
                  id="title"
                  placeholder="ex: Programme Full Body"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Décrivez votre programme..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isLoading}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Objectif</Label>
                <Input
                  id="goal"
                  placeholder="ex: Prise de masse, Perte de poids, Remise en forme..."
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (semaines)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="52"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Sélection d'exercices */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Exercices ({formData.exercises.length})</h3>
              
              {/* Liste des exercices disponibles */}
              <div className="space-y-2">
                <Label>Ajouter un exercice</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                  {availableExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => addExercise(exercise)}
                      disabled={isLoading}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <span className="text-sm font-medium">{exercise.name}</span>
                      <Plus className="h-4 w-4 text-fytli-red" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercices sélectionnés */}
              {formData.exercises.length > 0 && (
                <div className="space-y-2">
                  <Label>Exercices du programme</Label>
                  <div className="space-y-3">
                    {formData.exercises.map((exercise, index) => (
                      <Card key={exercise.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="font-medium text-fytli-dark">
                              {index + 1}. {exercise.name}
                            </span>
                            {exercise.type && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({exercise.type})
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExercise(exercise.id)}
                            className="p-1 hover:bg-destructive/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 lg:gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Séries</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Reps</Label>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Repos (s)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="300"
                              step="15"
                              value={exercise.rest_time_sec}
                              onChange={(e) => updateExercise(exercise.id, 'rest_time_sec', parseInt(e.target.value))}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Erreur */}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions - sticky on mobile */}
            <div className="lg:flex items-center justify-end gap-3 pt-4 border-t hidden">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn-brand"
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer le programme'}
              </Button>
            </div>
          </form>
          </div>
          
          {/* Fixed bottom actions on mobile */}
          <div className="lg:hidden sticky bottom-0 bg-background border-t p-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="create-program-form"
              className="btn-brand flex-1"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                const form = document.querySelector('#create-program-form') as HTMLFormElement;
                if (form) {
                  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
              }}
            >
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </div>
      </motion.div>
      </div>
    </AnimatePresence>
  );
};

