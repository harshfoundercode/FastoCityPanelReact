import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#14532D',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
}

export default App;