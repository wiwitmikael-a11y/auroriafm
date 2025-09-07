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

      <div className="glass-surface p-4 mb-6 text-center border border-accent/20">
          <h2 className="font-bold text-accent">Understanding the Guilds</h2>
          <p className="text-sm text-text-secondary mt-1">
              The Guilds are the major power brokers of Auroria. Your reputation with them is crucial. High reputation unlocks powerful passive buffs for your club, while low reputation can lead to negative consequences. Occasionally, guilds will send you requests and scenarios via your <span className="font-bold text-text-primary">Inbox</span>, providing opportunities to further influence your standing.
          </p>
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