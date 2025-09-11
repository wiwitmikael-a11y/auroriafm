import React, { useState, useEffect, useRef } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { LORE_TIPS } from '../data/tips';
import LoadingAnimation from './LoadingAnimation';

const MIN_LOADING_TIME = 6000; // 6 seconds

const LoadingScreen: React.FC = () => {
  const { startGame, managerSeed, managerName } = useWorld();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Engine...');
  const [currentTip, setCurrentTip] = useState(LORE_TIPS[0]);
  
  const generationStarted = useRef(false);

  useEffect(() => {
    // Memastikan startGame hanya dipanggil sekali
    if (!generationStarted.current && managerName && managerSeed) {
      startGame(managerName, managerSeed);
      generationStarted.current = true;
    }

    const statuses = [
      'Constructing Nations & Clubs...',
      'Scheduling The Great Game...',
      'Populating World with Souls...',
      'Saving world to chronicles...',
      'Finalizing Aurorian Timelines...'
    ];
    
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statuses.length;
        setStatusText(statuses[statusIndex]);
    }, MIN_LOADING_TIME / statuses.length);

    // Animate progress bar over the minimum loading time
    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 1, 100));
    }, MIN_LOADING_TIME / 100);

    // Tip cycler
    const tipInterval = setInterval(() => {
      setCurrentTip(prevTip => {
        const currentIndex = LORE_TIPS.indexOf(prevTip);
        const nextIndex = (currentIndex + 1) % LORE_TIPS.length;
        return LORE_TIPS[nextIndex];
      });
    }, 4000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };

  }, [managerSeed, managerName, startGame]);

  return (
    <div className="w-screen h-screen bg-background flex flex-col p-8 text-center">
        <div className="flex-grow flex flex-col items-center justify-center">
            <LoadingAnimation />
            
            <div className="w-full max-w-lg my-8">
                <div className="h-4 w-full bg-slate-900 border border-border rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-accent rounded-full transition-all duration-500 ease-out" 
                        style={{ 
                            width: `${progress}%`,
                            boxShadow: '0 0 15px var(--color-accent)' 
                        }}
                    />
                </div>
                <p className="text-center text-accent mt-2 font-semibold">{statusText}</p>
            </div>
        </div>

        <div className="flex-shrink-0 w-full max-w-2xl mx-auto">
            <p className="text-lg text-text-secondary italic">"{currentTip}"</p>
        </div>
    </div>
  );
};

export default LoadingScreen;
