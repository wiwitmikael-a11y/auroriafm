import React, { useMemo, useState } from 'react';
import { useWorld } from '../contexts/WorldContext';
import PlayerCard from '../components/PlayerCard';
import { Player } from '../types';
import PlayerDetailModal from '../components/PlayerDetailModal';

const YouthAcademy: React.FC = () => {
  const { players, managerClubId, findClubById } = useWorld();
  const club = findClubById(managerClubId);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const youthPlayers = useMemo(() => {
    return players
      .filter(p => p.club_id === managerClubId && p.age <= 19)
      .sort((a, b) => b.potential_ability - a.potential_ability);
  }, [players, managerClubId]);

  const handleSelectPlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Youth Academy</h1>
        <p className="text-md text-text-secondary">The future stars of {club?.name}.</p>
      </div>

      <div className="space-y-2">
        {youthPlayers.length > 0 ? (
          youthPlayers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onSelectPlayer={handleSelectPlayer}
              isSelected={selectedPlayer?.id === player.id}
            />
          ))
        ) : (
          <div className="glass-surface p-6 text-center">
            <p className="text-text-secondary">No youth players currently in the academy. The annual intake arrives near the end of the season.</p>
          </div>
        )}
      </div>
       {selectedPlayer && (
        <PlayerDetailModal 
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default YouthAcademy;
