import toast from 'react-hot-toast';

/**
 * Utilitaires pour les notifications toast Fytli
 */

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#2BB673',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#2BB673',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#FF4D3A',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#FF4D3A',
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#FFCA55',
        color: '#0E0E10',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#2D7FF9',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3A3A3E',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'top-right',
        style: {
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#2BB673',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#2BB673',
          },
        },
        error: {
          style: {
            background: '#FF4D3A',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#FF4D3A',
          },
        },
      }
    );
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Extrait le message d'erreur d'une erreur API
 */
export const getErrorMessage = (error: any): string => {
  // Si c'est une erreur Axios avec une réponse
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Si c'est une erreur avec juste un message
  if (error.message) {
    return error.message;
  }
  
  // Si c'est un string
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback
  return 'Une erreur est survenue';
};

