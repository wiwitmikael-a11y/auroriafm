import React from 'react';
import { useDrag } from 'react-dnd';
import { Player } from '../types';
import PlayerPortrait from './PlayerPortrait';

interface TacticsPlayerCardProps {
    player: Player;
}

const TacticsPlayerCard: React.FC<TacticsPlayerCardProps> = ({ player }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'player',
        item: { id: player.id, from: 'pitch', originalIndex: player.positionIndex },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [player.id, player.positionIndex]);

     const rarityColor = 
        player.rarity === 'Legend' ? 'border-amber-400' : 
        player.rarity === 'Epic' ? 'border-purple-400' : 
        player.rarity === 'Rare' ? 'border-blue-400' : 
        'border-gray-600';

    return (
        <div
            // FIX: Cast the drag ref to 'any' to resolve a TypeScript error.
            // This is often necessary due to type mismatches between react-dnd and @types/react.
            ref={drag as any}
            className={`w-full h-full flex flex-col items-center justify-center text-center p-1 rounded-lg cursor-grab active:cursor-grabbing transition-opacity glass-surface border-2 ${rarityColor} ${isDragging ? 'opacity-30' : 'opacity-100'}`}
        >
            <PlayerPortrait player={player} className="w-10 h-10" />
            <p className="text-xs font-bold leading-tight mt-1 truncate w-full">{player.name.last}</p>
            <p className="text-[10px] text-accent leading-tight">{player.position}</p>
        </div>
    );
};

export default TacticsPlayerCard;