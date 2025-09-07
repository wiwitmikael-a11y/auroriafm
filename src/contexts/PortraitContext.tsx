import React, { createContext, useContext, ReactNode } from 'react';

// This is a placeholder context. In a real application, this could
// use Gemini to generate unique player portraits based on their attributes,
// nation, and name, and then cache them.

interface PortraitContextType {
  getPortraitUrl: (playerId: string) => string;
}

const PortraitContext = createContext<PortraitContextType | undefined>(undefined);

export const PortraitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const getPortraitUrl = (playerId: string): string => {
    // For now, this doesn't do anything as the PlayerPortrait component is procedural.
    // This context is a stub for a future, more advanced implementation.
    return ''; 
  };

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