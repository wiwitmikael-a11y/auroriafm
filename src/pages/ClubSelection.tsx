import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import ClubCrest from '../components/ClubCrest';

const ClubSelection: React.FC = () => {
  const { clubs, setManagerClub } = useWorld();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black font-display uppercase tracking-widest text-text-emphasis" style={{textShadow: '0 0 20px var(--color-accent)'}}>
          Choose Your Club
        </h1>
        <p className="text-lg text-text-secondary">Your managerial career starts now. Who will you lead to glory?</p>
      </div>
      <div className="w-full max-w-4xl h-2/3 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map(club => (
                <div key={club.id} className="glass-surface p-4 flex flex-col text-center items-center">
                    <ClubCrest clubId={club.id} className="w-20 h-20 mb-4" />
                    <h2 className="text-xl font-bold text-text-emphasis">{club.name}</h2>
                    <p className="text-xs text-text-secondary mb-2">"{club.nickname}"</p>
                    <div className="text-sm text-text-secondary flex-grow">
                        <p>{club.stadium}</p>
                        <p>Finances: <span className="font-bold">{club.finances}</span></p>
                    </div>
                    <button 
                        onClick={() => setManagerClub(club.id)}
                        className="button-primary w-full mt-4"
                    >
                        Select Club
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClubSelection;
