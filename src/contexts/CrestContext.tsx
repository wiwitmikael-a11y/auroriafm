import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { assetManager } from '../services/assetManager';

interface CrestContextType {
  getCrest: (tags: string, palette: string[]) => Promise<string>;
}

const CrestContext = createContext<CrestContextType | undefined>(undefined);

export const CrestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const getCrest = useCallback(async (tags: string, palette: string[]): Promise<string> => {
    // Delegate crest generation and caching to the central asset manager
    return assetManager.generateCrest(tags, palette);
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
