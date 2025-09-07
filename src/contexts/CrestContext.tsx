import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { assetManager } from '../services/assetManager';
import { useWorld } from './WorldContext';
import { Club } from '../types';

interface CrestContextType {
  getCrest: (club: Club) => string;
}

const CrestContext = createContext<CrestContextType | undefined>(undefined);

export const CrestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const getCrest = useCallback((club: Club): string => {
    // Delegate crest generation and caching to the central asset manager
    return assetManager.generateCrest(club);
  }, []);

  return (
    <CrestContext.Provider value={{ getCrest }}>
      {children}
    </CrestContext.Provider>
  );
};

export const useCrests = () => {
  const context = useContext(CrestContext);
  if (context === undefined) {
    throw new Error('useCrests must be used within a CrestProvider');
  }
  return context;
};