import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display font-black text-text-emphasis tracking-widest uppercase animate-pulse" style={{textShadow: '0 0 15px var(--color-accent)'}}>
            Generating World...
        </h1>
        <p className="text-lg text-text-secondary mt-4">Weaving the threads of fate...</p>
    </div>
  );
};

export default LoadingScreen;