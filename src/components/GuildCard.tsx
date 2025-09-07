import React from 'react';
import { Guild } from '../types';

interface GuildCardProps {
  guild: Guild;
}

const GuildCard: React.FC<GuildCardProps> = ({ guild }) => {
  const getReputationText = (rep: number) => {
    if (rep > 50) return 'Allied';
    if (rep > 20) return 'Friendly';
    if (rep > -20) return 'Neutral';
    if (rep > -50) return 'Wary';
    return 'Hostile';
  };

  const repColor =
    guild.reputation > 20 ? 'text-green-400' :
    guild.reputation < -20 ? 'text-red-400' :
    'text-gray-400';

  return (
    <div className="glass-surface p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
            <h2 className="text-2xl font-display font-bold text-text-emphasis">{guild.name}</h2>
            <p className="text-sm text-accent">{guild.ethos.join(' | ')}</p>
        </div>
        <div className="text-right">
            <p className={`text-xl font-bold ${repColor}`}>{guild.reputation}</p>
            <p className={`text-sm font-semibold ${repColor}`}>{getReputationText(guild.reputation)}</p>
        </div>
      </div>
      <p className="text-text-secondary flex-grow mb-4 text-sm">{guild.description}</p>
      <div className="text-xs space-y-1 mt-auto pt-4 border-t border-border">
          <p><strong className="text-green-400">Positive Effect:</strong> {guild.effects.positive}</p>
          <p><strong className="text-red-400">Negative Effect:</strong> {guild.effects.negative}</p>
      </div>
    </div>
  );
};

export default GuildCard;