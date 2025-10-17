import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  const profileInfo = [
    {
      icon: User,
      label: 'Nom complet',
      value: `${user?.firstname} ${user?.lastname}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: user?.email,
    },
    {
      icon: Calendar,
      label: 'Membre depuis',
      value: new Date(user?.created_at || '').toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
    {
      icon: Shield,
      label: 'ID utilisateur',
      value: `#${user?.id}`,
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
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
                <p className="text-muted-foreground">
                  Gérez vos informations personnelles
                </p>
              </div>

              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.firstname?.[0]}{user?.lastname?.[0]}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {user?.firstname} {user?.lastname}
                      </CardTitle>
                      <CardDescription>{user?.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <info.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.label}</p>
                            <p className="font-semibold">{info.value}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                  <CardDescription>
                    Gérez vos préférences et votre sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Modifier mes informations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Changer mon mot de passe
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive">
                    Supprimer mon compte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

