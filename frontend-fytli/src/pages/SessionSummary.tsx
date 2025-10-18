import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Trophy, Clock, Zap, TrendingUp, Home, MessageSquare, Camera } from 'lucide-react';
import completionsService from '../services/completions';
import uploadsService from '../services/uploads';
import { showToast, getErrorMessage } from '../utils/toast';
import { Spinner } from '../components/ui/Spinner';

export const SessionSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, exercises, duration, programId } = location.state || {};
  
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState<'terrible' | 'bad' | 'okay' | 'good' | 'excellent'>('good');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sauvegarder automatiquement la completion au chargement
  useEffect(() => {
    if (session && programId && !saved) {
      saveCompletion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id, programId, saved]);

  const saveCompletion = async (withPhoto = false) => {
    if (!session || !programId || saved) return;
    
    setSaving(true);
    try {
      let photoUrl = undefined;
      
      // Si une photo est uploadée, l'uploader d'abord
      if (withPhoto && photoFile) {
        try {
          photoUrl = await uploadsService.uploadSessionPhoto(photoFile);
          console.log('Photo uploadée:', photoUrl);
        } catch (uploadError) {
          console.error('Erreur upload photo:', uploadError);
          showToast.error('Erreur lors de l\'upload de la photo');
          setSaving(false);
          return;
        }
      }

      await completionsService.create({
        program_id: programId,
        session_id: session.id,
        duration_minutes: duration,
        photo_url: photoUrl,
        notes: notes || undefined,
        feeling: feeling,
      });

      setSaved(true);
      if (withPhoto) {
        showToast.success('Photo ajoutée ! 📸');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const message = getErrorMessage(error);
      showToast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (!photoFile) return;
    saveCompletion(true);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-fytli-cream flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Aucune donnée de séance</p>
            <Button onClick={() => navigate('/programs')}>
              Retour aux programmes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const feelingOptions = [
    { value: 'terrible', label: 'Terrible', icon: '😖', color: 'bg-red-100 text-red-700' },
    { value: 'bad', label: 'Difficile', icon: '😞', color: 'bg-orange-100 text-orange-700' },
    { value: 'okay', label: 'Ok', icon: '😐', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'good', label: 'Bien', icon: '😊', color: 'bg-green-100 text-green-700' },
    { value: 'excellent', label: 'Excellent', icon: '🤩', color: 'bg-fytli-red/10 text-fytli-red' },
  ];

  // Données statiques pour les commentaires (en attendant OpenAI)
  const aiComments = [
    {
      icon: TrendingUp,
      title: 'Belle régularité',
      message: 'Tu maintiens un bon rythme, continue comme ça ! 💪',
      color: 'from-green-500 to-green-400',
    },
    {
      icon: Zap,
      title: 'Intensité solide',
      message: 'Tes temps de repos sont bien gérés, parfait pour la progression.',
      color: 'from-fytli-orange to-fytli-red',
    },
    {
      icon: MessageSquare,
      title: 'Conseil du jour',
      message: 'Pense à bien t\'hydrater après cette séance. 💧',
      color: 'from-blue-500 to-blue-400',
    },
  ];

  const stats = [
    {
      icon: Clock,
      label: 'Durée',
      value: `${duration || 25} min`,
      color: 'text-fytli-red',
    },
    {
      icon: Zap,
      label: 'Exercices',
      value: exercises?.length || 3,
      color: 'text-fytli-orange',
    },
    {
      icon: Trophy,
      label: 'Séries totales',
      value: exercises?.reduce((acc: number, ex: any) => acc + ex.sets, 0) || 10,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-fytli-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-fytli-red to-fytli-orange text-white py-8 lg:py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mb-4 lg:mb-6"
          >
            <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 lg:h-12 lg:w-12" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-brand">
              Séance terminée ! 🎉
            </h1>
            <p className="text-base lg:text-lg text-white/90">
              {session.title}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-2xl space-y-4 lg:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="card-fytli text-center">
                <CardContent className="p-3 lg:p-4">
                  <stat.icon className={`h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1 lg:mb-2 ${stat.color}`} />
                  <div className="text-xl lg:text-2xl font-bold text-fytli-dark mb-0.5 lg:mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] lg:text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feeling Selector */}
        <Card className="card-fytli">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg">Comment tu te sens ? 💭</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-5 gap-2">
              {feelingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFeeling(option.value as any)}
                  className={`p-2 lg:p-3 rounded-lg border-2 transition-all touch-target ${
                    feeling === option.value
                      ? `${option.color} border-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl lg:text-2xl mb-0.5 lg:mb-1">{option.icon}</div>
                  <div className="text-[10px] lg:text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="card-fytli">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Camera className="h-4 w-4 lg:h-5 lg:w-5" />
              Partage ta réussite ! 📸
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6">
            {photoPreview ? (
              <div className="space-y-2 lg:space-y-3">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 lg:h-64 object-cover rounded-lg"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleAddPhoto}
                    disabled={saving || saved}
                    className="btn-brand flex-1"
                  >
                    {saving ? <Spinner size="sm" className="mr-2" /> : null}
                    {saved ? 'Photo ajoutée ✓' : 'Ajouter la photo'}
                  </Button>
                  <Button
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview('');
                    }}
                    variant="outline"
                    className="sm:w-auto"
                  >
                    Changer
                  </Button>
                </div>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center cursor-pointer hover:border-fytli-red transition-colors">
                  <Camera className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Prends une photo pour célébrer !
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Optionnel - Motive tes copains)
                  </p>
                </div>
              </label>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="card-fytli">
          <CardHeader>
            <CardTitle className="text-lg">Notes personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Comment s'est passée ta séance ? Des progrès ? Des difficultés ?"
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fytli-red focus-visible:ring-offset-2 resize-none"
            />
          </CardContent>
        </Card>

        {/* AI Comments */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-fytli-dark">
            Analyse de ta séance
          </h2>
          
          {aiComments.map((comment, index) => (
            <motion.div
              key={comment.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="card-fytli overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${comment.color}`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${comment.color}`}>
                      <comment.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-fytli-dark mb-1">
                        {comment.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Exercises completed */}
        {exercises && exercises.length > 0 && (
          <Card className="card-fytli">
            <CardHeader>
              <CardTitle className="text-lg">Exercices réalisés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {exercises.map((ex: any, index: number) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-fytli-cream"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{ex.exercise.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Motivation Quote */}
        <Card className="bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5 border-fytli-red/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium text-fytli-dark mb-2">
              "Le plus dur, c'est de commencer. Et tu l'as fait ! 🔥"
            </p>
            <p className="text-sm text-muted-foreground">
              À bientôt pour la prochaine séance
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="btn-brand w-full"
            size="lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Retour au Dashboard
          </Button>
          
          <Button
            onClick={() => navigate(`/programs/${programId}`)}
            variant="outline"
            className="w-full"
          >
            Voir le programme
          </Button>
        </div>
      </div>
    </div>
  );
};
