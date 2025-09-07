import React from 'react';
import { useDrag } from 'react-dnd';
import { Player } from '../types';
import StarRating from './StarRating';
import PlayerPortrait from './PlayerPortrait';

interface SquadListItemProps {
    player: Player;
}

const SquadListItem: React.FC<SquadListItemProps> = ({ player }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'player',
        item: { id: player.id, from: 'squad' },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [player.id]);

    return (
        <div
            // FIX: Cast the drag ref to 'any' to resolve a TypeScript error.
            // This is often necessary due to type mismatches between react-dnd and @types/react.
            ref={drag as any}
            className={`flex items-center p-2 rounded-md cursor-grab active:cursor-grabbing transition-all bg-slate-900/50 hover:bg-slate-800/50 ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}`}
        >
            <PlayerPortrait player={player} className="w-12 h-12 mr-3 flex-shrink-0" />
            <div className="flex-grow min-w-0">
                <p className="font-bold text-sm truncate text-text-emphasis">{player.name.first} {player.name.last}</p>
                <p className="text-xs text-text-secondary">{player.position}</p>
            </div>
            <div className="flex-shrink-0">
                <StarRating currentAbility={player.current_ability} potentialAbility={player.potential_ability} />
            </div>
        </div>
    );
};

export default SquadListItem;
