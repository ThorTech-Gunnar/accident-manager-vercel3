import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';

// ... (keep existing imports)

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();
  const { viewMode } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* ... (keep existing routes) */}
          </Routes>
        </Suspense>
      </div>
      <Chatbot />
    </div>
  );
};

export default App;