import { motion } from 'framer-motion';
import { Badge } from '../types/badges';
import { Lock, Check } from 'lucide-react';
import { Card, CardContent } from './ui/Card';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  earnedAt?: string;
  progress?: number; // 0-100
  onClick?: () => void;
}

export const BadgeCard = ({ badge, earned, earnedAt, progress, onClick }: BadgeCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: earned ? 1.05 : 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card
        className={`
          relative overflow-hidden transition-all duration-300
          ${earned 
            ? 'card-fytli shadow-fytli-hover border-2 border-fytli-orange/20' 
            : 'bg-gray-50 border-gray-200 opacity-75'
          }
        `}
      >
        <CardContent className="p-6">
          {/* Badge Icon */}
          <div className="flex items-center justify-center mb-4">
            <div
              className={`
                relative flex items-center justify-center
                h-20 w-20 rounded-full
                ${earned 
                  ? `bg-gradient-to-br ${badge.gradient} shadow-lg` 
                  : 'bg-gray-200'
                }
              `}
            >
              {earned ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="text-4xl"
                >
                  {badge.icon}
                </motion.div>
              ) : (
                <Lock className="h-8 w-8 text-gray-400" />
              )}
              
              {/* Check mark si débloqué */}
              {earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-fytli-success flex items-center justify-center shadow-md"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Badge Info */}
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-1 ${earned ? 'text-fytli-dark' : 'text-gray-500'}`}>
              {badge.name}
            </h3>
            <p className={`text-sm mb-3 ${earned ? 'text-muted-foreground' : 'text-gray-400'}`}>
              {badge.description}
            </p>
            
            {/* Requirement */}
            <div className={`text-xs font-medium ${earned ? 'text-fytli-orange' : 'text-gray-400'}`}>
              {badge.requirement}
            </div>

            {/* Progress bar si en cours */}
            {!earned && progress !== undefined && progress > 0 && (
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progress}% complété
                </div>
              </div>
            )}

            {/* Date d'obtention */}
            {earned && earnedAt && (
              <div className="mt-2 text-xs text-muted-foreground">
                Débloqué le {formatDate(earnedAt)}
              </div>
            )}
          </div>

          {/* Effet de brillance si débloqué */}
          {earned && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

