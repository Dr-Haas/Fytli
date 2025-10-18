import { useEffect, useState } from 'react';
import { programsService } from '@/services/programs';
import { Program } from '@/types';
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

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  // Formulaire
  const [formData, setFormData] = useState<Partial<Program>>({
    title: '',
    description: '',
    difficulty_level: 'débutant',
    duration_weeks: 4,
    sessions_per_week: 3,
    category_id: undefined,
    is_public: true,
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [searchTerm, difficultyFilter, programs]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      toast.error('Erreur lors du chargement des programmes');
    } finally {
      setLoading(false);
    }
  };

  const filterPrograms = () => {
    let filtered = programs;

    // Filtrer par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(search) ||
          program.description?.toLowerCase().includes(search)
      );
    }

    // Filtrer par difficulté
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((program) => program.difficulty_level === difficultyFilter);
    }

    setFilteredPrograms(filtered);
  };

  const handleCreateClick = () => {
    setSelectedProgram(null);
    setFormData({
      title: '',
      description: '',
      difficulty_level: 'débutant',
      duration_weeks: 4,
      sessions_per_week: 3,
      category_id: undefined,
      is_public: true,
    });
    setShowEditModal(true);
  };

  const handleEditClick = (program: Program) => {
    setSelectedProgram(program);
    setFormData({
      title: program.title,
      description: program.description || '',
      difficulty_level: program.difficulty_level,
      duration_weeks: program.duration_weeks,
      sessions_per_week: program.sessions_per_week,
      category_id: program.category_id,
      is_public: program.is_public,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (program: Program) => {
    setSelectedProgram(program);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedProgram) {
        await programsService.update(selectedProgram.id, formData);
        toast.success('Programme mis à jour avec succès');
      } else {
        await programsService.create(formData);
        toast.success('Programme créé avec succès');
      }
      
      setShowEditModal(false);
      loadPrograms();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const deleteProgram = async () => {
    if (!selectedProgram) return;

    try {
      await programsService.delete(selectedProgram.id);
      toast.success('Programme supprimé avec succès');
      setShowDeleteModal(false);
      loadPrograms();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du programme');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des programmes</h1>
          <p className="text-gray-600">
            Total : {filteredPrograms.length} programme{filteredPrograms.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-5 w-5 mr-2" />
          Nouveau programme
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
                placeholder="Rechercher un programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
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
                <TableHeader>Titre</TableHeader>
                <TableHeader>Difficulté</TableHeader>
                <TableHeader>Durée</TableHeader>
                <TableHeader>Sessions/sem</TableHeader>
                <TableHeader>Catégorie</TableHeader>
                <TableHeader>Inscriptions</TableHeader>
                <TableHeader>Public</TableHeader>
                <TableHeader>Créé le</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>#{program.id}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {program.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getDifficultyBadgeVariant(program.difficulty_level)}>
                      {program.difficulty_level}
                    </Badge>
                  </TableCell>
                  <TableCell>{program.duration_weeks} sem</TableCell>
                  <TableCell>{program.sessions_per_week}</TableCell>
                  <TableCell>{program.category_name || '-'}</TableCell>
                  <TableCell>{program.enrollment_count || 0}</TableCell>
                  <TableCell>
                    <Badge variant={program.is_public ? 'success' : 'default'}>
                      {program.is_public ? 'Oui' : 'Non'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateShort(program.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(program)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(program)}
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
          {filteredPrograms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun programme trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition/création */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={selectedProgram ? 'Modifier le programme' : 'Nouveau programme'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
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
              placeholder="Description du programme..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <Input
              label="Durée (semaines) *"
              type="number"
              min="1"
              value={formData.duration_weeks || ''}
              onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <Input
            label="Sessions par semaine *"
            type="number"
            min="1"
            max="7"
            value={formData.sessions_per_week || ''}
            onChange={(e) => setFormData({ ...formData, sessions_per_week: parseInt(e.target.value) || 0 })}
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_public" className="text-sm font-medium text-gray-700">
              Programme public (visible par tous les utilisateurs)
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedProgram ? 'Mettre à jour' : 'Créer'}
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
        {selectedProgram && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer le programme{' '}
              <strong>{selectedProgram.title}</strong> ?
            </p>
            <p className="text-sm text-red-600">
              Cette action est irréversible et supprimera toutes les sessions et inscriptions associées.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteProgram}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

