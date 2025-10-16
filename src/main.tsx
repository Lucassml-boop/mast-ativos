import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import App from './App';
import AuthProvider from './components/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
