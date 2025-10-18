import { useEffect, useState } from 'react';
import { badgesService } from '@/services/badges';
import { Badge as BadgeType, UserBadge } from '@/types';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Trash2, Award, Users } from 'lucide-react';
import { formatDateShort } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Badges() {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'badges' | 'earned'>('badges');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [badgesData, userBadgesData] = await Promise.all([
        badgesService.getAll(),
        badgesService.getAllUserBadges(),
      ]);
      setBadges(badgesData);
      setUserBadges(userBadgesData);
    } catch (error) {
      console.error('Erreur lors du chargement des badges:', error);
      toast.error('Erreur lors du chargement des badges');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (badge: BadgeType) => {
    setSelectedBadge(badge);
    setShowDeleteModal(true);
  };

  const deleteBadge = async () => {
    if (!selectedBadge) return;

    try {
      await badgesService.delete(selectedBadge.id);
      toast.success('Badge supprimé avec succès');
      setShowDeleteModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du badge');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des badges</h1>
        <p className="text-gray-600">Gérez les badges et récompenses de votre plateforme</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total badges</p>
              <p className="text-3xl font-bold text-gray-900">{badges.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Badges gagnés</p>
              <p className="text-3xl font-bold text-gray-900">{userBadges.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('badges')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === 'badges'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Tous les badges ({badges.length})
          </button>
          <button
            onClick={() => setActiveTab('earned')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === 'earned'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Badges gagnés ({userBadges.length})
          </button>
        </nav>
      </div>

      {/* Liste des badges */}
      {activeTab === 'badges' && (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Icône</TableHeader>
                  <TableHeader>Nom</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Condition</TableHeader>
                  <TableHeader>Valeur</TableHeader>
                  <TableHeader>Créé le</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {badges.map((badge) => (
                  <TableRow key={badge.id}>
                    <TableCell>#{badge.id}</TableCell>
                    <TableCell>
                      <span className="text-2xl">{badge.icon}</span>
                    </TableCell>
                    <TableCell className="font-medium">{badge.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{badge.description}</TableCell>
                    <TableCell>
                      <Badge variant="info">{badge.condition_type}</Badge>
                    </TableCell>
                    <TableCell>{badge.condition_value}</TableCell>
                    <TableCell>{formatDateShort(badge.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(badge)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {badges.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun badge disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Liste des badges gagnés */}
      {activeTab === 'earned' && (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Utilisateur</TableHeader>
                  <TableHeader>Badge</TableHeader>
                  <TableHeader>Icône</TableHeader>
                  <TableHeader>Gagné le</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {userBadges.map((userBadge) => (
                  <TableRow key={userBadge.id}>
                    <TableCell>#{userBadge.id}</TableCell>
                    <TableCell className="font-medium">
                      {userBadge.user_name || `User #${userBadge.user_id}`}
                    </TableCell>
                    <TableCell>{userBadge.badge_name || 'Badge inconnu'}</TableCell>
                    <TableCell>
                      <span className="text-2xl">{userBadge.badge_icon || '🏆'}</span>
                    </TableCell>
                    <TableCell>{formatDateShort(userBadge.earned_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {userBadges.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun badge gagné</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        {selectedBadge && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer le badge{' '}
              <strong>{selectedBadge.name}</strong> ?
            </p>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center">
              <span className="text-3xl mr-3">{selectedBadge.icon}</span>
              <div>
                <p className="font-medium">{selectedBadge.name}</p>
                <p className="text-sm text-gray-600">{selectedBadge.description}</p>
              </div>
            </div>
            <p className="text-sm text-red-600">
              Cette action est irréversible et supprimera tous les badges gagnés associés.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteBadge}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

