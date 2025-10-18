import { useEffect, useState } from 'react';
import { enrollmentsService } from '@/services/enrollments';
import { Enrollment } from '@/types';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Trash2, Search, UserCheck } from 'lucide-react';
import { formatDateShort } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [searchTerm, statusFilter, enrollments]);

  const loadEnrollments = async () => {
    try {
      const data = await enrollmentsService.getAll();
      setEnrollments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions:', error);
      toast.error('Erreur lors du chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.user_name?.toLowerCase().includes(search) ||
          enrollment.program_title?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((enrollment) => enrollment.status === statusFilter);
    }

    setFilteredEnrollments(filtered);
  };

  const handleDeleteClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDeleteModal(true);
  };

  const deleteEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      await enrollmentsService.delete(selectedEnrollment.id);
      toast.success('Inscription supprimée avec succès');
      setShowDeleteModal(false);
      loadEnrollments();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'inscription');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'paused':
        return 'En pause';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeCount = enrollments.filter((e) => e.status === 'active').length;
  const completedCount = enrollments.filter((e) => e.status === 'completed').length;
  const pausedCount = enrollments.filter((e) => e.status === 'paused').length;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des inscriptions</h1>
        <p className="text-gray-600">
          Total : {filteredEnrollments.length} inscription{filteredEnrollments.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Actives</p>
              <p className="text-3xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Terminées</p>
              <p className="text-3xl font-bold text-blue-600">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">En pause</p>
              <p className="text-3xl font-bold text-yellow-600">{pausedCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par utilisateur ou programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="completed">Terminées</option>
              <option value="paused">En pause</option>
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
                <TableHeader>Utilisateur</TableHeader>
                <TableHeader>Programme</TableHeader>
                <TableHeader>Statut</TableHeader>
                <TableHeader>Inscrit le</TableHeader>
                <TableHeader>Début</TableHeader>
                <TableHeader>Fin</TableHeader>
                <TableHeader>Progression</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>#{enrollment.id}</TableCell>
                  <TableCell className="font-medium">
                    {enrollment.user_name || 'Utilisateur inconnu'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {enrollment.program_title || 'Programme inconnu'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                      {getStatusLabel(enrollment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateShort(enrollment.enrolled_at)}</TableCell>
                  <TableCell>
                    {enrollment.start_date ? formatDateShort(enrollment.start_date) : '-'}
                  </TableCell>
                  <TableCell>
                    {enrollment.end_date ? formatDateShort(enrollment.end_date) : '-'}
                  </TableCell>
                  <TableCell>
                    {enrollment.progress_percentage !== undefined
                      ? `${enrollment.progress_percentage}%`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(enrollment)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEnrollments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune inscription trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        {selectedEnrollment && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette inscription ?
            </p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm">
                <strong>Utilisateur :</strong> {selectedEnrollment.user_name}
              </p>
              <p className="text-sm">
                <strong>Programme :</strong> {selectedEnrollment.program_title}
              </p>
            </div>
            <p className="text-sm text-red-600">
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteEnrollment}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

