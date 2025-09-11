import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import ClubCard from '../components/ClubCard';

const ClubDirectory: React.FC = () => {
  const { clubs } = useWorld();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Club Directory</h1>
        <p className="text-md text-text-secondary">An overview of the teams in The Great Game.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clubs.map(club => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
};

export default ClubDirectory;