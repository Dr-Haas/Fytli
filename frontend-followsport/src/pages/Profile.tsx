import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { BadgeCard } from '../components/BadgeCard';
import { useAuth } from '../hooks/useAuth';
import { badgesService } from '../services/badges';
import enrollmentsService from '../services/enrollments';
import { Calendar, Shield, Edit2, Save, X, Trophy, Dumbbell } from 'lucide-react';
import { showToast, getErrorMessage } from '../utils/toast';
import api from '../services/api';

interface UserBadgeWithProgress {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  category: string;
  requirement: string;
  points: number;
  is_secret: boolean;
  earned: number;
  earned_at?: string | null;
  progress_percent: number;
}

interface ProgramEnrollmentData {
  id: number;
  user_id: number;
  program_id: number;
  enrolled_at: string;
  status: string;
  program_title: string;
  program_level: string;
  sessions_completed: number;
  total_sessions: number;
}

export const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: user?.firstname || '',
    last_name: user?.lastname || '',
    email: user?.email || '',
  });

  // Badges state
  const [badges, setBadges] = useState<UserBadgeWithProgress[]>([]);
  const [badgeStats, setBadgeStats] = useState({
    badges_earned: 0,
    total_points: 0,
    total_badges: 0,
    completion_percent: 0,
  });

  // Programs state
  const [programs, setPrograms] = useState<ProgramEnrollmentData[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.firstname || '',
        last_name: user.lastname || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Fetch badges and programs
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [badgesData, programsData] = await Promise.all([
          badgesService.getUserBadgesWithProgress(user.id),
          enrollmentsService.getProgramsByUser(user.id),
        ]);

        if (badgesData && badgesData.data && Array.isArray(badgesData.data)) {
          // Convert is_secret from number to boolean
          const convertedBadges = badgesData.data.map((badge: any) => ({
            ...badge,
            is_secret: Boolean(badge.is_secret)
          }));
          setBadges(convertedBadges);
          setBadgeStats(badgesData.overview);
        }

        if (programsData) {
          setPrograms(programsData as any);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await api.put(`/users/${user.id}`, formData);
      
      if (response.data.success) {
        showToast.success('Profil mis à jour avec succès ! Rechargez la page pour voir les changements.');
        setIsEditing(false);
        
        // Optionally reload the page to update the user context
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      const message = getErrorMessage(error);
      showToast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.firstname || '',
      last_name: user?.lastname || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const earnedBadges = badges.filter(b => b.earned === 1);
  const unearnedBadges = badges.filter(b => b.earned === 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 lg:pt-4 lg:ml-64 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto space-y-4 lg:space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2 text-gradient font-brand">Mon Profil</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Gérez vos informations et consultez vos succès
                </p>
              </div>
            </div>

            {/* Profile Card */}
            <Card className="card-fytli">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center text-white text-xl lg:text-2xl font-bold">
                      {user?.firstname?.[0]}{user?.lastname?.[0]}
                    </div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl">
                        {user?.firstname} {user?.lastname}
                      </CardTitle>
                      <CardDescription className="text-sm">{user?.email}</CardDescription>
                      {user?.role && user.role !== 'user' && (
                        <div className="mt-1 lg:mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-fytli-red/10 text-fytli-red text-xs font-medium">
                          <Shield className="h-3 w-3" />
                          {user.role === 'admin' ? 'Admin' : 'Coach'}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-full lg:w-auto">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </CardHeader>

              {isEditing && (
                <CardContent className="space-y-4 p-4 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleSave} disabled={saving} className="btn-brand flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={saving} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              <Card className="card-fytli">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange">
                      <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                        {badgeStats.badges_earned}/{badgeStats.total_badges}
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground">
                        Badges débloqués
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 rounded-full bg-gradient-to-br from-amber-400 to-fytli-orange">
                      <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                        {badgeStats.total_points}
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground">
                        Points gagnés
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 rounded-full bg-gradient-to-br from-fytli-success to-green-600">
                      <Dumbbell className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                        {programs.length}
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground">
                        Programmes actifs
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Programs Section */}
            {programs.length > 0 && (
              <Card className="card-fytli">
                <CardHeader className="p-4 lg:p-6">
                  <CardTitle className="text-lg lg:text-xl">Mes Programmes</CardTitle>
                  <CardDescription className="text-sm">Programmes auxquels vous êtes inscrit</CardDescription>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {programs.map((program) => (
                      <div
                        key={program.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 lg:p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-base lg:text-lg">{program.program_title}</h3>
                          <div className="flex items-center gap-3 lg:gap-4 mt-1 lg:mt-2 text-xs lg:text-sm text-muted-foreground">
                            <span className="capitalize">{program.program_level}</span>
                            <span>•</span>
                            <span>
                              {program.sessions_completed} / {program.total_sessions} séances
                            </span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl lg:text-2xl font-bold text-fytli-red">
                            {program.total_sessions > 0 
                              ? Math.round((program.sessions_completed / program.total_sessions) * 100)
                              : 0}%
                          </div>
                          <div className="text-xs text-muted-foreground">Progression</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badges Section */}
            <div className="space-y-6">
              {/* Earned Badges */}
              {earnedBadges.length > 0 && (
                <Card className="card-fytli">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-fytli-red" />
                      Badges Débloqués ({earnedBadges.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {earnedBadges.map((badge) => (
                        <BadgeCard
                          key={badge.badge_id}
                          badge={{
                            id: badge.badge_id,
                            name: badge.name,
                            description: badge.description,
                            icon: badge.icon,
                            color: badge.color,
                            gradient: badge.gradient,
                            category: badge.category,
                            requirement: badge.requirement,
                          } as any}
                          earned={true}
                          progress={badge.progress_percent || 0}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Unearned Badges */}
              {unearnedBadges.length > 0 && (
                <Card className="card-fytli">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="h-5 w-5" />
                      Badges à Débloquer ({unearnedBadges.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {unearnedBadges.map((badge) => (
                        <BadgeCard
                          key={badge.badge_id}
                          badge={{
                            id: badge.badge_id,
                            name: badge.name,
                            description: badge.description,
                            icon: badge.icon,
                            color: badge.color,
                            gradient: badge.gradient,
                            category: badge.category,
                            requirement: badge.requirement,
                          } as any}
                          earned={false}
                          progress={badge.progress_percent || 0}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Account Info */}
            <Card className="card-fytli">
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-fytli-cream">
                      <Calendar className="h-5 w-5 text-fytli-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membre depuis</p>
                      <p className="font-semibold">
                        {new Date(user?.created_at || '').toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-fytli-cream">
                      <Shield className="h-5 w-5 text-fytli-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID utilisateur</p>
                      <p className="font-semibold">#{user?.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
