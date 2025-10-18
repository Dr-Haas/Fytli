import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Program } from '../types';
import { Dumbbell, Calendar } from 'lucide-react';

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

export const ProgramCard = ({ program, onClick }: ProgramCardProps) => {
  const levelColors = {
    beginner: 'text-green-600 bg-green-50',
    intermediate: 'text-blue-600 bg-blue-50',
    advanced: 'text-purple-600 bg-purple-50',
  };

  const levelLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };

  const colorClass = program.level ? levelColors[program.level] : 'text-gray-600 bg-gray-50';
  const levelLabel = program.level ? levelLabels[program.level] : 'Non défini';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">{program.title}</CardTitle>
            </div>
            {program.level && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${colorClass}`}
              >
                {levelLabel}
              </span>
            )}
          </div>
          <CardDescription className="line-clamp-2 mt-2">
            {program.description || 'Aucune description disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Créé le {new Date(program.created_at || '').toLocaleDateString('fr-FR')}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

