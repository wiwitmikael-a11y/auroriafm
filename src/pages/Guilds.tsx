import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import GuildCard from '../components/GuildCard';

const Guilds: React.FC = () => {
  const { guilds } = useWorld();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Faction & Guilds</h1>
        <p className="text-md text-text-secondary">Manage your standing with the powers that shape Auroria.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {guilds.map(guild => (
          <GuildCard key={guild.id} guild={guild} />
        ))}
      </div>
    </div>
  );
};

export default Guilds;