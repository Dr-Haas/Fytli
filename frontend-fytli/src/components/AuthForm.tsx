import { useState, FormEvent } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: FormData) => Promise<void>;
  onToggleMode: () => void;
}

interface FormData {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

export const AuthForm = ({ mode, onSubmit, onToggleMode }: AuthFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold">
          {isLogin ? 'Connexion' : 'Inscription'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Entrez vos identifiants pour accéder à votre compte'
            : 'Créez un compte pour commencer votre parcours sportif'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom</Label>
                <Input
                  id="firstname"
                  placeholder="Jean"
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input
                  id="lastname"
                  placeholder="Dupont"
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : isLogin ? (
              'Se connecter'
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}
          </span>{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            {isLogin ? "S'inscrire" : 'Se connecter'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

