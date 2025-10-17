import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ProgramCard } from '../components/ProgramCard';
import { CreateProgramModal, ProgramFormData } from '../components/CreateProgramModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { programsService } from '../services/programs';
import { exercisesService } from '../services/exercises';
import { sessionsService } from '../services/sessions';
import { Program, Exercise } from '../types';
import { Search, Loader2, Plus } from 'lucide-react';
import { showToast, getErrorMessage } from '../utils/toast';

export const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsData, exercisesData] = await Promise.all([
          programsService.getAll(),
          exercisesService.getAll(),
        ]);
        setPrograms(programsData);
        setFilteredPrograms(programsData);
        setAvailableExercises(exercisesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        const message = getErrorMessage(error);
        showToast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter((program) =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  }, [searchQuery, programs]);

  const handleCreateProgram = async (formData: ProgramFormData) => {
    try {
      // 1. Créer le programme
      const newProgram = await programsService.create({
        title: formData.title,
        description: formData.description,
        level: formData.level,
        duration_weeks: formData.duration_weeks,
      });

      // 2. Créer une session pour ce programme
      const session = await sessionsService.create({
        program_id: newProgram.id,
        title: 'Session principale',
        day_number: 1,
        notes: formData.description,
      });

      // 3. Ajouter les exercices à la session
      for (let i = 0; i < formData.exercises.length; i++) {
        const exercise = formData.exercises[i];
        await sessionsService.addExercise({
          session_id: session.id,
          exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          rest_time_sec: exercise.rest_time_sec,
          order_index: i + 1,
        });
      }

      // 4. Recharger la liste des programmes
      const updatedPrograms = await programsService.getAll();
      setPrograms(updatedPrograms);
      setFilteredPrograms(updatedPrograms);
      
      setIsCreateModalOpen(false);
      
      // 5. Afficher un toast de succès
      showToast.success('Programme créé ! On y va ? 💪');
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error);
      const message = getErrorMessage(error);
      showToast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Programmes d'entraînement</h1>
                  
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-brand"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau programme
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un programme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Programs Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPrograms.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {filteredPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onClick={() => navigate(`/programs/${program.id}`)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery
                      ? 'Aucun programme ne correspond à votre recherche'
                      : 'Aucun programme disponible'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modal de création */}
      <CreateProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProgram}
        availableExercises={availableExercises}
      />
    </div>
  );
};

