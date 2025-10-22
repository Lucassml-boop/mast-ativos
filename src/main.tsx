import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import App from './App';
import AuthProvider from './components/AuthProvider';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
