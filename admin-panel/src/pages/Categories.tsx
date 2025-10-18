import { useEffect, useState } from 'react';
import { categoriesService, Category, CreateCategoryData, UpdateCategoryData } from '@/services/categories';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { formatDateShort } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Formulaire
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(search) ||
          cat.description?.toLowerCase().includes(search)
      );
    }

    setFilteredCategories(filtered);
  };

  const handleCreateClick = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
    });
    setShowEditModal(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCategory) {
        await categoriesService.update(selectedCategory.id, formData as UpdateCategoryData);
        toast.success('Catégorie mise à jour avec succès');
      } else {
        await categoriesService.create(formData);
        toast.success('Catégorie créée avec succès');
      }
      
      setShowEditModal(false);
      loadCategories();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await categoriesService.delete(selectedCategory.id);
      toast.success('Catégorie supprimée avec succès');
      setShowDeleteModal(false);
      loadCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des catégories</h1>
          <p className="text-gray-600">
            Total : {filteredCategories.length} catégorie{filteredCategories.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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
                <TableHeader>Description</TableHeader>
                <TableHeader>Icône</TableHeader>
                <TableHeader>Nombre d'exercices</TableHeader>
                <TableHeader>Créée le</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>#{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {category.description || '-'}
                  </TableCell>
                  <TableCell>{category.icon || '-'}</TableCell>
                  <TableCell>{category.exercise_count || 0}</TableCell>
                  <TableCell>{formatDateShort(category.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(category)}
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
          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune catégorie trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition/création */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
              placeholder="Description de la catégorie..."
            />
          </div>

          <Input
            label="Icône"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Ex: 💪, 🏃, 🧘"
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedCategory ? 'Mettre à jour' : 'Créer'}
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
        {selectedCategory && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer la catégorie{' '}
              <strong>{selectedCategory.name}</strong> ?
            </p>
            {selectedCategory.exercise_count && selectedCategory.exercise_count > 0 && (
              <p className="text-sm text-amber-600">
                ⚠️ Cette catégorie contient {selectedCategory.exercise_count} exercice(s).
                Ils seront orphelins après la suppression.
              </p>
            )}
            <p className="text-sm text-red-600">
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteCategory}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

