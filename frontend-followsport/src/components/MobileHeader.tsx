import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export const MobileHeader = ({ title, showBack = true }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ne pas afficher le bouton retour sur ces pages
  const noBackPages = ['/dashboard', '/login'];
  const shouldShowBack = showBack && !noBackPages.includes(location.pathname);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="lg:hidden sticky top-0 z-30 bg-background border-b px-4 py-3 flex items-center gap-3"
    >
      {shouldShowBack && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-fytli-cream transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-fytli-dark" />
        </button>
      )}
      
      {title && (
        <h1 className="text-lg font-bold text-fytli-dark flex-1">
          {title}
        </h1>
      )}
    </motion.div>
  );
};

