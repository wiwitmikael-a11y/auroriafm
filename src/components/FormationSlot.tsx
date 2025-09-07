import React from 'react';
import { useDrop } from 'react-dnd';
import { Player } from '../types';
import TacticsPlayerCard from './TacticsPlayerCard';

interface FormationSlotProps {
    player: Player | null;
    position: string;
    positionIndex: number;
    coords: { x: number; y: number };
    onDrop: (item: { id: string, from: 'squad' | 'pitch', originalIndex: number }, targetIndex: number | null) => void;
}

const FormationSlot: React.FC<FormationSlotProps> = ({ player, position, positionIndex, coords, onDrop }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'player',
        drop: (item: { id: string, from: 'squad' | 'pitch', originalIndex: number }) => onDrop(item, positionIndex),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [onDrop, positionIndex]);

    const isActive = isOver && canDrop;

    return (
        <div
            // FIX: Cast the drop ref to 'any' to resolve a TypeScript error.
            // This is often necessary due to type mismatches between react-dnd and @types/react.
            ref={drop as any}
            style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
            }}
            className="absolute w-[80px] h-[90px] flex items-center justify-center"
        >
            {player ? (
                <TacticsPlayerCard player={player} />
            ) : (
                <div 
                    className={`w-full h-full flex items-center justify-center text-center rounded-lg border-2 transition-colors duration-200 ${
                        isActive ? 'bg-accent/30 border-accent' : 'bg-slate-900/50 border-dashed border-border'
                    }`}
                >
                    <span className="font-bold text-accent/50">{position}</span>
                </div>
            )}
        </div>
    );
};

export default FormationSlot;
