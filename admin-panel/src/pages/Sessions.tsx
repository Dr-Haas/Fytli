import { useEffect, useState } from 'react';
import { sessionsService } from '@/services/sessions';
import { SessionCompletion } from '@/types';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Eye, Search, Calendar, Clock } from 'lucide-react';
import { formatDateShort, formatRelativeTime } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Sessions() {
  const [completions, setCompletions] = useState<SessionCompletion[]>([]);
  const [filteredCompletions, setFilteredCompletions] = useState<SessionCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompletion, setSelectedCompletion] = useState<SessionCompletion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCompletions();
  }, []);

  useEffect(() => {
    filterCompletions();
  }, [searchTerm, completions]);

  const loadCompletions = async () => {
    try {
      const data = await sessionsService.getAllCompletions();
      setCompletions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des complétions:', error);
      toast.error('Erreur lors du chargement des sessions');
    } finally {
      setLoading(false);
    }
  };

  const filterCompletions = () => {
    let filtered = completions;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (completion) =>
          completion.user_name?.toLowerCase().includes(search) ||
          completion.session_title?.toLowerCase().includes(search) ||
          completion.program_title?.toLowerCase().includes(search)
      );
    }

    setFilteredCompletions(filtered);
  };

  const handleViewDetails = (completion: SessionCompletion) => {
    setSelectedCompletion(completion);
    setShowDetailModal(true);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions complétées</h1>
        <p className="text-gray-600">
          Total : {filteredCompletions.length} session{filteredCompletions.length > 1 ? 's' : ''} complétée{filteredCompletions.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total complétions</p>
              <p className="text-3xl font-bold text-gray-900">{completions.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Durée moyenne</p>
              <p className="text-3xl font-bold text-gray-900">
                {completions.length > 0
                  ? Math.round(
                      completions.reduce((acc, c) => acc + (c.duration_minutes || 0), 0) /
                        completions.filter((c) => c.duration_minutes).length
                    )
                  : 0}{' '}
                min
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avec photos</p>
              <p className="text-3xl font-bold text-gray-900">
                {completions.filter((c) => c.photo_url).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtre de recherche */}
      <Card className="mb-6">
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, session ou programme..."
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
                <TableHeader>Utilisateur</TableHeader>
                <TableHeader>Programme</TableHeader>
                <TableHeader>Session</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Durée</TableHeader>
                <TableHeader>Photo</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompletions.map((completion) => (
                <TableRow key={completion.id}>
                  <TableCell>#{completion.id}</TableCell>
                  <TableCell className="font-medium">
                    {completion.user_name || 'Utilisateur inconnu'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {completion.program_title || '-'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {completion.session_title || '-'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{formatDateShort(completion.completed_at)}</div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeTime(completion.completed_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {completion.duration_minutes ? `${completion.duration_minutes} min` : '-'}
                  </TableCell>
                  <TableCell>
                    {completion.photo_url ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetails(completion)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCompletions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune session trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de détails */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Détails de la session"
        size="lg"
      >
        {selectedCompletion && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateur</p>
                <p className="text-base text-gray-900">
                  {selectedCompletion.user_name || 'Utilisateur inconnu'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Programme</p>
                <p className="text-base text-gray-900">
                  {selectedCompletion.program_title || 'Programme inconnu'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Session</p>
                <p className="text-base text-gray-900">
                  {selectedCompletion.session_title || 'Session inconnue'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Date de complétion</p>
                <p className="text-base text-gray-900">
                  {formatDateShort(selectedCompletion.completed_at)}
                </p>
              </div>
              {selectedCompletion.duration_minutes && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Durée</p>
                  <p className="text-base text-gray-900">
                    {selectedCompletion.duration_minutes} minutes
                  </p>
                </div>
              )}
            </div>

            {selectedCompletion.notes && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900">{selectedCompletion.notes}</p>
                </div>
              </div>
            )}

            {selectedCompletion.photo_url && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Photo</p>
                <img
                  src={selectedCompletion.photo_url}
                  alt="Session"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowDetailModal(false)}>Fermer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

