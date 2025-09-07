import React, { useState, useEffect, useRef } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { generateInitialWorld } from '../services/worldGenerator';
import { generateLeagueFixtures } from '../data/league';
import { CLUBS } from '../data/clubs';
import { LORE_TIPS } from '../data/tips';

const MIN_LOADING_TIME = 8000; // 8 seconds

const LoadingScreen: React.FC = () => {
  const { finishWorldGeneration, managerSeed } = useWorld() as any; // Use `as any` to access managerSeed
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Engine...');
  const [currentTip, setCurrentTip] = useState(LORE_TIPS[0]);
  const worldDataRef = useRef<any>(null);

  useEffect(() => {
    let worldGenerated = false;
    let minTimeElapsed = false;

    const generationSteps = [
      { text: 'Generating World & Sponsors...', duration: 3000, progress: 50, action: () => generateInitialWorld(managerSeed) },
      { text: 'Scheduling Fixtures...', duration: 1500, progress: 80, action: (world: any) => ({ ...world, fixtures: generateLeagueFixtures(world.clubs) }) },
      { text: 'Finalizing World...', duration: 1000, progress: 100, action: (world: any) => world },
    ];

    const checkCompletion = () => {
        if (worldGenerated && minTimeElapsed && worldDataRef.current) {
            finishWorldGeneration(worldDataRef.current);
        }
    };

    const runGeneration = async () => {
        let currentWorldData: any = {};
        for (const step of generationSteps) {
            setStatusText(step.text);
            await new Promise(resolve => setTimeout(resolve, step.duration / 2)); // simulate work
            currentWorldData = await step.action(currentWorldData);
            setProgress(step.progress);
            await new Promise(resolve => setTimeout(resolve, step.duration / 2));
        }
        worldDataRef.current = currentWorldData;
        worldGenerated = true;
        checkCompletion();
    };

    runGeneration();
    
    setTimeout(() => {
      minTimeElapsed = true;
      checkCompletion();
    }, MIN_LOADING_TIME);

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
    };

  }, [managerSeed, finishWorldGeneration]);

  return (
    <div className="w-screen h-screen bg-background flex flex-col p-8 text-center">
        <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-display font-black text-text-emphasis tracking-widest uppercase" style={{textShadow: '0 0 15px var(--color-accent)'}}>
                Building Auroria
            </h1>
            
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