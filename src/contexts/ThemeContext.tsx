import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, defaultTheme } from '../utils/theme';
import { useAuth } from './AuthContext';
import api from '../utils/api';

interface ThemeContextType {
  theme: Theme;
  updateTheme: (newTheme: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.franchise) {
      fetchTheme(user.franchise);
    }
  }, [user]);

  const fetchTheme = async (franchiseId: string) => {
    try {
      const response = await api.get(`/franchises/${franchiseId}/theme`);
      setTheme(response.data);
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  };

  const updateTheme = async (newTheme: Partial<Theme>) => {
    if (user && user.franchise) {
      try {
        const updatedTheme = { ...theme, ...newTheme };
        await api.put(`/franchises/${user.franchise}/theme`, updatedTheme);
        setTheme(updatedTheme);
      } catch (error) {
        console.error('Error updating theme:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};