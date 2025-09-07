import React, { useState, useMemo } from 'react';
import PlayerCard from '../components/PlayerCard';
import PlayerProfile from '../components/PlayerProfile';
import { useWorld } from '../contexts/WorldContext';

const Squad: React.FC = () => {
  const { players, managerClubId, updatePlayer, findClubById } = useWorld();
  
  const squadPlayers = useMemo(() => {
    return players.filter(p => p.club_id === managerClubId)
                  .sort((a,b) => b.current_ability - a.current_ability);
  }, [players, managerClubId]);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(squadPlayers[0]?.id || null);

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };
  
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3 flex flex-col">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Squad</h1>
          <p className="text-md text-text-secondary">Your current roster for {findClubById(managerClubId)?.name}.</p>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 space-y-3">
          {squadPlayers.map(player => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onSelectPlayer={handleSelectPlayer}
              isSelected={selectedPlayerId === player.id}
            />
          ))}
        </div>
      </div>
      <div className="w-2/3 h-full">
        {selectedPlayer ? (
          <PlayerProfile player={selectedPlayer} onUpdatePlayer={updatePlayer} />
        ) : (
          <div className="flex items-center justify-center h-full glass-surface">
            <p className="text-text-secondary">Select a player to view their profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Squad;