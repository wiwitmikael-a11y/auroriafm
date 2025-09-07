import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { Player } from '../types';
import { assetManager } from '../services/assetManager';
import { useWorld } from './WorldContext';

// FIX: Changed return type from Promise<string> to string to match synchronous implementation.
interface PortraitContextType {
  getPortraitUrl: (player: Player) => string;
}

const PortraitContext = createContext<PortraitContextType | undefined>(undefined);

export const PortraitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { findClubById } = useWorld();
  
  // FIX: The `generatePortrait` method does not exist on assetManager. This has been corrected
  // to use `generateModularPortrait`. The `useWorld` hook is now used to retrieve the
  // player's club, which is a required argument. The function has also been made synchronous
  // to match the implementation of the asset manager.
  const getPortraitUrl = useCallback((player: Player): string => {
    const club = findClubById(player.club_id);
    if (!club) {
        return '';
    }
    // Delegate portrait generation and caching to the central asset manager
    return assetManager.generateModularPortrait(player, club);
  }, [findClubById]);

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
