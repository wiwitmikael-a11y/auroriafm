import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { Player } from '../types';
import { assetManager } from '../services/assetManager';

interface PortraitContextType {
  getPortraitUrl: (player: Player) => Promise<string>;
}

const PortraitContext = createContext<PortraitContextType | undefined>(undefined);

export const PortraitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const getPortraitUrl = useCallback(async (player: Player): Promise<string> => {
    // Delegate portrait generation and caching to the central asset manager
    return assetManager.generatePortrait(player);
  }, []);

  return (
    <PortraitContext.Provider value={{ getPortraitUrl }}>
      {children}
    </PortraitContext.Provider>
  );
};

export const usePortraits = () => {
  const context = useContext(PortraitContext);
  if (context === undefined) {
    throw new Error('usePortraits must be used within a PortraitProvider');
  }
  return context;
};
