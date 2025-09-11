import React, { useState } from 'react';
import { useWorld } from '../contexts/WorldContext';

const Login: React.FC = () => {
  const { startGame } = useWorld();
  const [managerName, setManagerName] = useState('');
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100000));
  
  // State isLoading lokal tidak lagi diperlukan karena gameState dikelola oleh context
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerName.trim()) return;
    startGame(managerName.trim(), seed);
  };
  
  const handleRandomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 100000));
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-widest text-text-emphasis" style={{textShadow: '0 0 20px var(--color-accent)'}}>
            Aetherium Chronicle
        </h1>
        <p className="text-lg text-text-secondary font-display" style={{textShadow: '0 0 10px var(--color-accent-secondary)'}}>
            Auroria Football Manager
        </p>
      </div>

      <form 
        onSubmit={handleStartGame}
        className="glass-surface p-8 rounded-xl w-full max-w-xs animate-fade-in"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="managerName" className="block text-sm font-bold text-text-secondary mb-2">Manager Name</label>
            <input
              type="text"
              id="managerName"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="seed" className="block text-sm font-bold text-text-secondary mb-2">World Seed</label>
            <div className="flex gap-2">
              <input
                type="number"
                id="seed"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)}
                className="w-full text-lg"
              />
              <button type="button" onClick={handleRandomizeSeed} className="button-primary" style={{backgroundColor: 'var(--color-accent-secondary)'}}>
                Random
              </button>
            </div>
             <p className="text-xs text-text-secondary mt-2">The seed determines player generation. Use the same seed to get the same players.</p>
          </div>
        </div>
        
        <button 
            type="submit" 
            disabled={!managerName.trim()}
            className="w-full button-primary mt-8 text-lg"
        >
          Start New Game
        </button>
      </form>
    </div>
  );
};

export default Login;