import React from 'react';
import { TacticalPlayer } from '../types';
import PlayerChit from './PlayerChit';
import { useDrop } from 'react-dnd';

interface TacticsPitchProps {
  players: TacticalPlayer[];
  onDrop: (item: { id: string }, position: { x: number; y: number }) => void;
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string | null) => void;
}

const TacticsPitch: React.FC<TacticsPitchProps> = ({ players, onDrop, selectedPlayerId, onSelectPlayer }) => {
    
    const pitchRef = React.useRef<HTMLDivElement | null>(null);

    const [, drop] = useDrop(() => ({
        accept: 'player',
        drop: (item: {id: string}, monitor) => {
            if (!pitchRef.current) return;
            const pitchBounds = pitchRef.current.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const x = ((clientOffset.x - pitchBounds.left) / pitchBounds.width) * 100;
            const y = ((clientOffset.y - pitchBounds.top) / pitchBounds.height) * 100;
            
            onDrop(item, { x, y });
        },
    }));

    const handleSelect = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onSelectPlayer(id);
    };

  return (
    <div 
        ref={(node) => {
            pitchRef.current = node;
            drop(node);
        }}
        onClick={() => onSelectPlayer(null)}
        className="relative w-full h-full glass-surface overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(var(--color-accent) 1px, transparent 1px),
              radial-gradient(var(--color-accent) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            boxShadow: 'inset 0 0 40px rgba(0, 246, 255, 0.3)',
          }}
    >
      {/* Center Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-accent/50" />
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] aspect-square border-2 border-accent/50 rounded-full" />
      {/* Goal Boxes */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[15%] h-[40%] border-2 border-accent/50 rounded-lg" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[15%] h-[40%] border-2 border-accent/50 rounded-lg" />

        {players.map(player => (
            <div 
                key={player.id} 
                style={{ left: `${player.x}%`, top: `${player.y}%`, transform: 'translate(-50%, -50%)' }}
                className="absolute"
                onClick={(e) => handleSelect(e, player.id)}
            >
                <PlayerChit player={player} isSelected={selectedPlayerId === player.id} />
            </div>
        ))}
    </div>
  );
};

export default TacticsPitch;