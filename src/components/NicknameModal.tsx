import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { proceduralService } from '../services/proceduralService';

interface NicknameModalProps {
  player: Player;
  onUpdatePlayer: (player: Player) => void;
  onClose: () => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ player, onUpdatePlayer, onClose }) => {
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNickname, setSelectedNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchNicknames = async () => {
      setIsLoading(true);
      try {
        const generatedNicknames = await proceduralService.generateNickname(player);
        setNicknames(generatedNicknames);
      } catch (error) {
        console.error("Failed to fetch nicknames:", error);
        // Set a default fallback nickname on error
        setNicknames([`The ${player.name.last}`]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNicknames();
  }, [player]);

  const handleApplyNickname = () => {
    if (selectedNickname) {
      onUpdatePlayer({ ...player, name: { ...player.name, alias: selectedNickname } });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="glass-surface p-8 w-full max-w-md border-2 border-accent" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-display font-bold text-text-emphasis mb-4">Generate Nickname</h2>
        <p className="text-text-secondary mb-6">Choose a new alias for {player.name.first} {player.name.last}.</p>
        
        {isLoading ? (
          <div className="text-center p-8">
            <p className="text-accent animate-pulse">Consulting the Chroniclers for epic names...</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {nicknames.map(name => (
              <div
                key={name}
                onClick={() => setSelectedNickname(name)}
                className={`p-3 rounded-md text-center cursor-pointer border-2 transition-colors ${
                  selectedNickname === name
                    ? 'bg-cyan-500/20 border-accent'
                    : 'bg-slate-900/50 border-border hover:border-accent/50'
                }`}
              >
                {name}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="button-secondary">Cancel</button>
          <button
            onClick={handleApplyNickname}
            disabled={!selectedNickname || isLoading}
            className="button-primary"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
