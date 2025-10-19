import { useEffect, useState } from 'react';
import { exercisesService, Exercise, CreateExerciseData, UpdateExerciseData } from '@/services/exercises';
import { categoriesService, Category } from '@/services/categories';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { formatDateShort } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  // Formulaire
  const [formData, setFormData] = useState<CreateExerciseData>({
    name: '',
    description: '',
    instructions: '',
    category_id: undefined,
    difficulty_level: 'débutant',
    equipment_needed: '',
    muscles_targeted: '',
    video_url: '',
    image_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchTerm, categoryFilter, difficultyFilter, exercises]);

  const loadData = async () => {
    try {
      const [exercisesData, categoriesData] = await Promise.all([
        exercisesService.getAll(),
        categoriesService.getAll(),
      ]);
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
      setExercises([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(search) ||
          ex.description?.toLowerCase().includes(search) ||
          ex.muscles_targeted?.toLowerCase().includes(search)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((ex) => ex.category_id === parseInt(categoryFilter));
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((ex) => ex.difficulty_level === difficultyFilter);
    }

    setFilteredExercises(filtered);
  };

  const handleCreateClick = () => {
    setSelectedExercise(null);
    setFormData({
      name: '',
      description: '',
      instructions: '',
      category_id: undefined,
      difficulty_level: 'débutant',
      equipment_needed: '',
      muscles_targeted: '',
      video_url: '',
      image_url: '',
    });
    setShowEditModal(true);
  };

  const handleEditClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      name: exercise.name,
      description: exercise.description || '',
      instructions: exercise.instructions || '',
      category_id: exercise.category_id,
      difficulty_level: exercise.difficulty_level,
      equipment_needed: exercise.equipment_needed || '',
      muscles_targeted: exercise.muscles_targeted || '',
      video_url: exercise.video_url || '',
      image_url: exercise.image_url || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedExercise) {
        await exercisesService.update(selectedExercise.id, formData as UpdateExerciseData);
        toast.success('Exercice mis à jour avec succès');
      } else {
        await exercisesService.create(formData);
        toast.success('Exercice créé avec succès');
      }
      
      setShowEditModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const deleteExercise = async () => {
    if (!selectedExercise) return;

    try {
      await exercisesService.delete(selectedExercise.id);
      toast.success('Exercice supprimé avec succès');
      setShowDeleteModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getDifficultyBadgeVariant = (level: string) => {
    switch (level) {
      case 'débutant':
        return 'success';
      case 'intermédiaire':
        return 'warning';
      case 'avancé':
        return 'danger';
      default:
        return 'default';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des exercices</h1>
          <p className="text-gray-600">
            Total : {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-5 w-5 mr-2" />
          Nouvel exercice
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Toutes les catégories</option>
              {(categories || []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Toutes les difficultés</option>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
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
                <TableHeader>Nom</TableHeader>
                <TableHeader>Catégorie</TableHeader>
                <TableHeader>Difficulté</TableHeader>
                <TableHeader>Muscles ciblés</TableHeader>
                <TableHeader>Équipement</TableHeader>
                <TableHeader>Créé le</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredExercises || []).map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>#{exercise.id}</TableCell>
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell>{exercise.category_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getDifficultyBadgeVariant(exercise.difficulty_level)}>
                      {exercise.difficulty_level}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {exercise.muscles_targeted || '-'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {exercise.equipment_needed || 'Aucun'}
                  </TableCell>
                  <TableCell>{formatDateShort(exercise.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(exercise)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(exercise)}
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
          {filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun exercice trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition/création */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={selectedExercise ? 'Modifier l\'exercice' : 'Nouvel exercice'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Catégorie"
              value={formData.category_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : undefined })}
            >
              <option value="">Aucune</option>
              {(categories || []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Select
              label="Difficulté *"
              value={formData.difficulty_level}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
              required
            >
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
            </Select>
          </div>

          <Input
            label="Muscles ciblés"
            value={formData.muscles_targeted}
            onChange={(e) => setFormData({ ...formData, muscles_targeted: e.target.value })}
            placeholder="Ex: Pectoraux, Triceps"
          />

          <Input
            label="Équipement nécessaire"
            value={formData.equipment_needed}
            onChange={(e) => setFormData({ ...formData, equipment_needed: e.target.value })}
            placeholder="Ex: Haltères, Tapis"
          />

          <Input
            label="URL Vidéo"
            type="url"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://..."
          />

          <Input
            label="URL Image"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedExercise ? 'Mettre à jour' : 'Créer'}
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
        {selectedExercise && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l'exercice{' '}
              <strong>{selectedExercise.name}</strong> ?
            </p>
            <p className="text-sm text-red-600">
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteExercise}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

