import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { SessionCompletion } from '../types';
import { ArrowLeft, Clock, Zap, Trophy, Calendar, User, MessageSquare } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { showToast, getErrorMessage } from '../utils/toast';
import completionsService from '../services/completions';

export const CompletionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [completion, setCompletion] = useState<SessionCompletion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletion = async () => {
      if (!id) return;
      
      try {
        const data = await completionsService.getById(parseInt(id));
        setCompletion(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        const message = getErrorMessage(error);
        showToast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!completion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 pt-20 lg:pt-4 lg:ml-64 lg:p-8">
            <div className="max-w-4xl mx-auto text-center py-24">
              <p className="text-muted-foreground text-lg mb-4">Session non trouvée</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                Retour
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const feelingOptions = {
    terrible: { label: 'Terrible', icon: '😖', color: 'bg-red-100 text-red-700' },
    bad: { label: 'Difficile', icon: '😞', color: 'bg-orange-100 text-orange-700' },
    okay: { label: 'Ok', icon: '😐', color: 'bg-yellow-100 text-yellow-700' },
    good: { label: 'Bien', icon: '😊', color: 'bg-green-100 text-green-700' },
    excellent: { label: 'Excellent', icon: '🤩', color: 'bg-fytli-red/10 text-fytli-red' },
  };

  const currentFeeling = feelingOptions[completion.feeling || 'good'];

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
            className="max-w-4xl mx-auto space-y-4 lg:space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            {/* Header Card */}
            <Card className="card-fytli bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5 border-fytli-red/20">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center">
                      <Trophy className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl lg:text-2xl mb-1">
                      {completion.session_title || 'Session'}
                    </CardTitle>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      {completion.program_title}
                    </p>
                  </div>
                  <div className={`px-3 lg:px-4 py-2 rounded-full ${currentFeeling.color} font-medium text-sm lg:text-base flex items-center gap-2`}>
                    <span className="text-xl lg:text-2xl">{currentFeeling.icon}</span>
                    <span>{currentFeeling.label}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              <Card className="card-fytli text-center">
                <CardContent className="p-3 lg:p-4">
                  <Clock className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1 lg:mb-2 text-fytli-red" />
                  <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                    {completion.duration_minutes || 0}
                  </div>
                  <div className="text-[10px] lg:text-xs text-muted-foreground">
                    Minutes
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli text-center">
                <CardContent className="p-3 lg:p-4">
                  <Zap className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1 lg:mb-2 text-fytli-orange" />
                  <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                    {completion.feeling === 'excellent' ? '10' : 
                     completion.feeling === 'good' ? '8' :
                     completion.feeling === 'okay' ? '6' :
                     completion.feeling === 'bad' ? '4' : '2'}/10
                  </div>
                  <div className="text-[10px] lg:text-xs text-muted-foreground">
                    Intensité
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli text-center">
                <CardContent className="p-3 lg:p-4">
                  <Calendar className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1 lg:mb-2 text-green-600" />
                  <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                    {new Date(completion.completed_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                  <div className="text-[10px] lg:text-xs text-muted-foreground">
                    Date
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Info */}
            <Card className="card-fytli">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                  <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Complété par</span>
                    <span className="font-medium text-sm lg:text-base">
                      {completion.first_name} {completion.last_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Date & heure</span>
                    <span className="font-medium text-sm lg:text-base">
                      {new Date(completion.completed_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Ressenti</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentFeeling.icon}</span>
                      <span className="font-medium text-sm lg:text-base">{currentFeeling.label}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {completion.notes && (
              <Card className="card-fytli">
                <CardHeader className="p-4 lg:p-6">
                  <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <p className="text-sm lg:text-base text-fytli-dark whitespace-pre-wrap">
                    {completion.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Photo */}
            {completion.photo_url && (
              <Card className="card-fytli">
                <CardHeader className="p-4 lg:p-6">
                  <CardTitle className="text-base lg:text-lg">Photo de la session</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <img
                    src={completion.photo_url}
                    alt="Session photo"
                    className="w-full h-auto rounded-lg object-cover max-h-96"
                  />
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(`/programs/${completion.program_id}`)}
                className="btn-brand flex-1"
              >
                Voir le programme
              </Button>
              <Button
                onClick={() => navigate(`/profile/${completion.user_id}`)}
                variant="outline"
                className="flex-1"
              >
                Voir le profil
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

