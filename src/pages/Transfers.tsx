import React, { useMemo, useState } from 'react';
import { useWorld } from '../contexts/WorldContext';
import PlayerCard from '../components/PlayerCard';
import PlayerDetailModal from '../components/PlayerDetailModal';
import { Player } from '../types';

const Transfers: React.FC = () => {
  const { players, managerClubId } = useWorld();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const transferList = useMemo(() => {
    return players.filter(p => p.club_id !== managerClubId);
  }, [players, managerClubId]);

  const handleSelectPlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setSelectedPlayer(player);
    }
  };
  
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    // In a real scenario, this might trigger a transfer offer flow.
    // For now, we just close the modal.
    setSelectedPlayer(updatedPlayer);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Transfer Market</h1>
        <p className="text-md text-text-secondary">Scout for new talent to join your squad.</p>
      </div>

      <div className="space-y-2">
        {transferList.slice(0, 50).map(player => ( // Limiting for performance
          <PlayerCard 
            key={player.id} 
            player={player}
            onSelectPlayer={handleSelectPlayer}
            isSelected={selectedPlayer?.id === player.id}
          />
        ))}
      </div>
      
      {selectedPlayer && (
        <PlayerDetailModal 
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            onUpdatePlayer={handleUpdatePlayer}
        />
      )}
    </div>
  );
};

export default Transfers;
