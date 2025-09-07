import React from 'react';
import { Guild, InboxMessage } from '../types';
import { useWorld } from '../contexts/WorldContext';

interface GuildCardProps {
  guild: Guild;
}

const GuildCard: React.FC<GuildCardProps> = ({ guild }) => {
  const { inboxMessages, handleGuildAction } = useWorld();

  // Find if there's an active, actionable message from this guild
  const activeScenario = inboxMessages.find(msg => msg.guildId === guild.id && msg.actions && msg.actions.length > 0);

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
    <div className="glass-surface p-6 flex flex-col min-h-[280px]">
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
      
      {/* Dynamic Content: Scenario or Description */}
      <div className="flex-grow flex flex-col justify-between">
        {activeScenario ? (
            <div className="bg-slate-900/50 p-3 rounded-md border border-accent/50">
              <p className="text-sm font-bold text-accent mb-2">{activeScenario.subject}</p>
              <p className="text-text-secondary text-sm mb-4 whitespace-pre-wrap">{activeScenario.body}</p>
            </div>
        ) : (
            <p className="text-text-secondary text-sm">{guild.description}</p>
        )}

        {/* Actions or Effects */}
        <div className="mt-auto pt-4 border-t border-border">
          {activeScenario && activeScenario.actions ? (
            <div className="flex justify-end gap-3">
              {activeScenario.actions.map((action, index) => (
                <button 
                  key={index} 
                  className="button-primary text-xs"
                  onClick={() => handleGuildAction(guild.id, action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : (
             <div className="text-xs space-y-1">
                <p><strong className="text-green-400">Positive Effect:</strong> {guild.effects.positive}</p>
                <p><strong className="text-red-400">Negative Effect:</strong> {guild.effects.negative}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuildCard;