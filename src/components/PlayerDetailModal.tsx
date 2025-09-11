import React from 'react';
import { Player } from '../types';
import PlayerProfile from './PlayerProfile';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
  onUpdatePlayer?: (player: Player) => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose, onUpdatePlayer }) => {
  if (!player) return null;

  const handleUpdate = (updatedPlayer: Player) => {
    if (onUpdatePlayer) {
      onUpdatePlayer(updatedPlayer);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button" aria-label="Close player profile">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <PlayerProfile player={player} onUpdatePlayer={handleUpdate} />
      </div>
    </div>
  );
};

export default PlayerDetailModal;
