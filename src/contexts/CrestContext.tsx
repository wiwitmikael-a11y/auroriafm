import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ACC } from '../engine/ACC';

interface CrestContextType {
  getCrest: (tags: string, palette: string[]) => Promise<string>;
}

const CrestContext = createContext<CrestContextType | undefined>(undefined);

export const CrestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crestCache, setCrestCache] = useState<Record<string, string>>({});

  const getCrest = useCallback(async (tags: string, palette: string[]): Promise<string> => {
    const cacheKey = `${tags}-${palette.join('-')}`;
    if (crestCache[cacheKey]) {
      return crestCache[cacheKey];
    }

    const url = ACC.generateProceduralCrest(tags, palette);
    setCrestCache(prev => ({ ...prev, [cacheKey]: url }));
    return url;
  }, [crestCache]);

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