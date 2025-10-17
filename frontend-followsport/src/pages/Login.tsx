import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials, RegisterCredentials } from '../types';

export const Login = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    if (mode === 'login') {
      await login(data as LoginCredentials);
    } else {
      await register(data as RegisterCredentials);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fytli-cream p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient font-brand mb-2">
            Fytli
          </h1>
          <p className="text-muted-foreground font-medium">
            Bouge mieux, vis mieux.
          </p>
        </div>

        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')}
        />
      </motion.div>
    </div>
  );
};

