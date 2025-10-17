import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { programsService } from '../services/programs';
import { Program } from '../types';
import { Dumbbell, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programsService.getAll();
        setPrograms(data.slice(0, 3)); // Afficher les 3 premiers programmes
      } catch (error) {
        console.error('Erreur lors du chargement des programmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const stats = [
    {
      icon: Dumbbell,
      label: 'Programmes actifs',
      value: programs.length,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Progression',
      value: '87%',
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: Calendar,
      label: 'Jours consécutifs',
      value: '12',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Welcome Section */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bienvenue, {user?.firstname} ! 👋
                </h1>
                <p className="text-muted-foreground">
                  Voici un aperçu de votre progression
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.label}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <stat.icon className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent Programs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Programmes récents</h2>
                  <Button variant="outline" onClick={() => navigate('/programs')}>
                    Voir tout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Chargement...
                  </div>
                ) : programs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                          onClick={() => navigate('/programs')}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Dumbbell className="h-5 w-5 text-primary" />
                              {program.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {program.description || 'Aucune description'}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Aucun programme disponible pour le moment
                    </p>
                    <Button onClick={() => navigate('/programs')}>
                      Explorer les programmes
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

