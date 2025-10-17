import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Trophy, Clock, Zap, TrendingUp, Home, MessageSquare } from 'lucide-react';

export const SessionSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, exercises, duration } = location.state || {};

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

  // Données statiques pour les commentaires (en attendant OpenAI)
  const aiComments = [
    {
      icon: TrendingUp,
      title: 'Belle régularité',
      message: 'Tu maintiens un bon rythme, continue comme ça ! 💪',
      color: 'from-fytli-success to-green-400',
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
      color: 'from-fytli-info to-blue-400',
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
      color: 'text-fytli-success',
    },
  ];

  return (
    <div className="min-h-screen bg-fytli-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-fytli-red to-fytli-orange text-white py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mb-6"
          >
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
              <Trophy className="h-12 w-12" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 font-brand">
              Séance terminée ! 🎉
            </h1>
            <p className="text-lg text-white/90">
              {session.title}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="card-fytli text-center">
                <CardContent className="p-4">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-fytli-dark mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
            onClick={() => navigate('/programs')}
            variant="outline"
            className="w-full"
          >
            Voir les programmes
          </Button>
        </div>
      </div>
    </div>
  );
};

