import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export class CustomSnackbar {
  static show(message, type = 'info', duration = 3000) {
    const containerId = 'snackbar-container';
    let container = document.getElementById(containerId);
    
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    const root = createRoot(container);
    
    const removeSnackbar = () => {
      root.unmount();
      if (container.children.length === 0) {
        container.remove();
      }
    };

    root.render(
      <SnackbarMessage 
        message={message} 
        type={type} 
        duration={duration} 
        onClose={removeSnackbar} 
      />
    );
  }
}

const SnackbarMessage = ({ message, type, duration, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <AlertCircle size={20} className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto min-w-75 ${getBgColor()}`}
      >
        {getIcon()}
        <span className="text-sm font-medium text-gray-700 flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </div>
  );
};