import { useEffect, useState } from 'react';
import { sessionsService } from '@/services/sessions';
import { programsService } from '@/services/programs';
import { sessionExercisesService } from '@/services/sessionExercises';
import { exercisesService } from '@/services/exercises';
import { Session, Program, SessionExercise } from '@/types';
import { Exercise } from '@/services/exercises';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Trash2, Edit, Plus, Search, MoveUp, MoveDown } from 'lucide-react';
import { formatDateShort } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedSessionExercise, setSelectedSessionExercise] = useState<SessionExercise | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'info' | 'exercises'>('info');
  
  // Formulaire session
  const [formData, setFormData] = useState<Partial<Session>>({
    title: '',
    description: '',
    program_id: undefined,
    week_number: 1,
    day_number: 1,
    estimated_duration: 30,
  });

  // Formulaire exercice de session
  const [exerciseFormData, setExerciseFormData] = useState<Partial<SessionExercise>>({
    exercise_id: undefined,
    order_index: 1,
    sets: 3,
    reps: 10,
    duration_seconds: undefined,
    rest_seconds: 60,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [searchTerm, programFilter, sessions]);

  const loadData = async () => {
    try {
      const [sessionsData, programsData, exercisesData] = await Promise.all([
        sessionsService.getAll(),
        programsService.getAll(),
        exercisesService.getAll(),
      ]);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setPrograms(Array.isArray(programsData) ? programsData : []);
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
      setSessions([]);
      setPrograms([]);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionExercises = async (sessionId: number) => {
    try {
      const data = await sessionExercisesService.getBySession(sessionId);
      setSessionExercises(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des exercices:', error);
      toast.error('Erreur lors du chargement des exercices');
      setSessionExercises([]);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(search) ||
          session.description?.toLowerCase().includes(search)
      );
    }

    if (programFilter !== 'all') {
      filtered = filtered.filter((session) => session.program_id === parseInt(programFilter));
    }

    setFilteredSessions(filtered);
  };

  const handleCreateClick = () => {
    setSelectedSession(null);
    setSessionExercises([]);
    setActiveTab('info');
    setFormData({
      title: '',
      description: '',
      program_id: undefined,
      week_number: 1,
      day_number: 1,
      estimated_duration: 30,
    });
    setShowEditModal(true);
  };

  const handleEditClick = async (session: Session) => {
    setSelectedSession(session);
    setActiveTab('info');
    setFormData({
      title: session.title,
      description: session.description || '',
      program_id: session.program_id,
      week_number: session.week_number,
      day_number: session.day_number,
      estimated_duration: session.estimated_duration,
    });
    setShowEditModal(true);
    await loadSessionExercises(session.id);
  };

  const handleDeleteClick = (session: Session) => {
    setSelectedSession(session);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.program_id) {
      toast.error('Veuillez sélectionner un programme');
      return;
    }

    try {
      if (selectedSession) {
        await sessionsService.update(selectedSession.id, formData);
        toast.success('Session mise à jour avec succès');
      } else {
        await sessionsService.create(formData);
        toast.success('Session créée avec succès');
      }
      
      setShowEditModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const deleteSession = async () => {
    if (!selectedSession) return;

    try {
      await sessionsService.delete(selectedSession.id);
      toast.success('Session supprimée avec succès');
      setShowDeleteModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la session');
    }
  };

  // Gestion des exercices de session
  const handleAddExerciseClick = () => {
    if (!selectedSession) return;
    
    setSelectedSessionExercise(null);
    setExerciseFormData({
      exercise_id: undefined,
      order_index: sessionExercises.length + 1,
      sets: 3,
      reps: 10,
      duration_seconds: undefined,
      rest_seconds: 60,
      notes: '',
    });
    setShowExerciseModal(true);
  };

  const handleEditExerciseClick = (sessionExercise: SessionExercise) => {
    setSelectedSessionExercise(sessionExercise);
    setExerciseFormData({
      exercise_id: sessionExercise.exercise_id,
      order_index: sessionExercise.order_index,
      sets: sessionExercise.sets,
      reps: sessionExercise.reps,
      duration_seconds: sessionExercise.duration_seconds,
      rest_seconds: sessionExercise.rest_seconds,
      notes: sessionExercise.notes || '',
    });
    setShowExerciseModal(true);
  };

  const handleDeleteExerciseClick = async (sessionExerciseId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer cet exercice ?')) return;
    
    try {
      await sessionExercisesService.delete(sessionExerciseId);
      toast.success('Exercice retiré avec succès');
      if (selectedSession) {
        await loadSessionExercises(selectedSession.id);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSession || !exerciseFormData.exercise_id) {
      toast.error('Veuillez sélectionner un exercice');
      return;
    }

    try {
      const data = {
        ...exerciseFormData,
        session_id: selectedSession.id,
      };

      if (selectedSessionExercise) {
        await sessionExercisesService.update(selectedSessionExercise.id, data);
        toast.success('Exercice modifié avec succès');
      } else {
        await sessionExercisesService.create(data);
        toast.success('Exercice ajouté avec succès');
      }
      
      setShowExerciseModal(false);
      await loadSessionExercises(selectedSession.id);
      await loadData(); // Recharger pour mettre à jour le compteur d'exercices
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleMoveExercise = async (sessionExerciseId: number, direction: 'up' | 'down') => {
    if (!selectedSession) return;

    const currentIndex = sessionExercises.findIndex(se => se.id === sessionExerciseId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sessionExercises.length) return;

    try {
      const current = sessionExercises[currentIndex];
      const target = sessionExercises[newIndex];

      // Échanger les order_index
      await Promise.all([
        sessionExercisesService.update(current.id, { order_index: target.order_index }),
        sessionExercisesService.update(target.id, { order_index: current.order_index }),
      ]);

      await loadSessionExercises(selectedSession.id);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du déplacement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des sessions</h1>
          <p className="text-gray-600">
            Total : {filteredSessions.length} session{filteredSessions.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle session
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une session..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les programmes</option>
              {(programs || []).map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Titre</TableHeader>
                <TableHeader>Programme</TableHeader>
                <TableHeader>Semaine</TableHeader>
                <TableHeader>Jour</TableHeader>
                <TableHeader>Durée estimée</TableHeader>
                <TableHeader>Exercices</TableHeader>
                <TableHeader>Créée le</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredSessions || []).map((session) => (
                <TableRow key={session.id}>
                  <TableCell>#{session.id}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {session.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {session.program_title || `Programme #${session.program_id}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">S{session.week_number}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">J{session.day_number}</Badge>
                  </TableCell>
                  <TableCell>{session.estimated_duration} min</TableCell>
                  <TableCell>
                    <Badge variant="success">{session.exercises_count || 0}</Badge>
                  </TableCell>
                  <TableCell>{formatDateShort(session.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(session)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(session)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSessions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune session trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition/création */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={selectedSession ? 'Modifier la session' : 'Nouvelle session'}
        size="lg"
      >
        {/* Onglets */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Informations
          </button>
          {selectedSession && (
            <button
              type="button"
              onClick={() => setActiveTab('exercises')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'exercises'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Exercices ({sessionExercises.length})
            </button>
          )}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'info' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Titre *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Nom de la session"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Description de la session..."
              />
            </div>

            <Select
              label="Programme *"
              value={formData.program_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, program_id: e.target.value ? parseInt(e.target.value) : undefined })}
              required
            >
              <option value="">Sélectionnez un programme</option>
              {(programs || []).map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Semaine *"
                type="number"
                min="1"
                value={formData.week_number || ''}
                onChange={(e) => setFormData({ ...formData, week_number: parseInt(e.target.value) || 1 })}
                required
              />

              <Input
                label="Jour *"
                type="number"
                min="1"
                max="7"
                value={formData.day_number || ''}
                onChange={(e) => setFormData({ ...formData, day_number: parseInt(e.target.value) || 1 })}
                required
              />

              <Input
                label="Durée (min) *"
                type="number"
                min="5"
                value={formData.estimated_duration || ''}
                onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) || 30 })}
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {selectedSession ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        ) : (
          /* Onglet Exercices */
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Exercices de la session</h3>
              <Button size="sm" onClick={handleAddExerciseClick}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un exercice
              </Button>
            </div>

            {sessionExercises.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Aucun exercice. Cliquez sur "Ajouter un exercice" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessionExercises.map((se, index) => (
                  <Card key={se.id}>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant="info">{se.order_index}</Badge>
                          <div className="flex-1">
                            <h4 className="font-medium">{se.exercise_name}</h4>
                            <div className="flex gap-3 text-sm text-gray-600 mt-1">
                              {se.sets && se.reps && <span>🏋️ {se.sets} séries × {se.reps} rép.</span>}
                              {se.duration_seconds && <span>⏱️ {se.duration_seconds}s</span>}
                              {se.rest_seconds && <span>😌 Repos: {se.rest_seconds}s</span>}
                            </div>
                            {se.notes && (
                              <p className="text-xs text-gray-500 mt-1 italic">{se.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveExercise(se.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveExercise(se.id, 'down')}
                            disabled={index === sessionExercises.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditExerciseClick(se)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteExerciseClick(se.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal d'ajout/modification d'exercice */}
      <Modal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        title={selectedSessionExercise ? 'Modifier l\'exercice' : 'Ajouter un exercice'}
      >
        <form onSubmit={handleSaveExercise} className="space-y-4">
          <Select
            label="Exercice *"
            value={exerciseFormData.exercise_id?.toString() || ''}
            onChange={(e) => setExerciseFormData({ ...exerciseFormData, exercise_id: e.target.value ? parseInt(e.target.value) : undefined })}
            required
          >
            <option value="">Sélectionnez un exercice</option>
            {(exercises || []).map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </Select>

          <Input
            label="Ordre *"
            type="number"
            min="1"
            value={exerciseFormData.order_index || ''}
            onChange={(e) => setExerciseFormData({ ...exerciseFormData, order_index: parseInt(e.target.value) || 1 })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Séries"
              type="number"
              min="0"
              value={exerciseFormData.sets || ''}
              onChange={(e) => setExerciseFormData({ ...exerciseFormData, sets: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ex: 3"
            />

            <Input
              label="Répétitions"
              type="number"
              min="0"
              value={exerciseFormData.reps || ''}
              onChange={(e) => setExerciseFormData({ ...exerciseFormData, reps: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ex: 10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Durée (secondes)"
              type="number"
              min="0"
              value={exerciseFormData.duration_seconds || ''}
              onChange={(e) => setExerciseFormData({ ...exerciseFormData, duration_seconds: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Pour exercices de temps"
            />

            <Input
              label="Repos (secondes)"
              type="number"
              min="0"
              value={exerciseFormData.rest_seconds || ''}
              onChange={(e) => setExerciseFormData({ ...exerciseFormData, rest_seconds: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ex: 60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={exerciseFormData.notes}
              onChange={(e) => setExerciseFormData({ ...exerciseFormData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Instructions spécifiques..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowExerciseModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedSessionExercise ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        {selectedSession && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer la session{' '}
              <strong>{selectedSession.title}</strong> ?
            </p>
            <p className="text-sm text-red-600">
              Cette action est irréversible et supprimera tous les exercices et complétions associés.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteSession}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
