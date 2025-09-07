import React from 'react';
import { useDrop } from 'react-dnd';
import { Player } from '../types';
import SquadListItem from './SquadListItem';

interface SquadListProps {
  players: Player[];
  onDrop: (item: { id: string, from: 'squad' | 'pitch', originalIndex: number }, targetIndex: number | null) => void;
}

const SquadList: React.FC<SquadListProps> = ({ players, onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'player',
        drop: (item: { id: string, from: 'squad' | 'pitch', originalIndex: number }) => onDrop(item, null), // Drop to null index signifies removal to reserves
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [onDrop]);

  return (
    <div className="flex-grow flex flex-col min-h-0">
        <h2 className="text-lg font-bold font-display text-text-emphasis mb-2">Squad</h2>
        {/* FIX: Cast the drop ref to 'any' to resolve a TypeScript error.
            This is often necessary due to type mismatches between react-dnd and @types/react. */}
        <div ref={drop as any} className={`flex-grow glass-surface p-2 overflow-y-auto space-y-1 transition-colors ${isOver ? 'bg-accent/10' : ''}`}>
            {players.map(player => (
                <SquadListItem key={player.id} player={player} />
            ))}
        </div>
    </div>
  );
};

export default SquadList;
