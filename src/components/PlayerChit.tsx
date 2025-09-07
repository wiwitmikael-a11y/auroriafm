import React from 'react';
import { TacticalPlayer, Rarity } from '../types';
import { PLAYER_ROLES } from '../data/player_roles';
import { useDrag } from 'react-dnd';

interface PlayerChitProps {
  player: TacticalPlayer;
  isSelected?: boolean;
  style?: React.CSSProperties; // For RosterList usage
}

const RARITY_GLOW_STYLES: { [key in Rarity]: string } = {
  Common: 'text-gray-400',
  Rare: 'text-blue-400',
  Epic: 'text-purple-400',
  Legend: 'text-amber-400',
};


const PlayerChit: React.FC<PlayerChitProps> = ({ player, isSelected = false, style }) => {
    const role = player.roleId ? PLAYER_ROLES[player.roleId] : null;
    const rarityColorClass = RARITY_GLOW_STYLES[player.rarity];
    const rarityColor = 
        player.rarity === 'Legend' ? '#f59e0b' : 
        player.rarity === 'Epic' ? '#a855f7' : 
        player.rarity === 'Rare' ? '#3b82f6' : 
        '#6b7280';

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'player',
        item: { id: player.id },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

  return (
    <div
      ref={(node) => { drag(node); }}
      style={{...style, opacity: isDragging ? 0.5 : 1}}
      className={`relative w-[72px] h-[80px] cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-white transition-all duration-200 hover:scale-110 z-10 p-1 group
        ${isSelected ? 'scale-110' : ''}`}
    >
       <div 
        className={`absolute inset-0 bg-slate-900/80 transition-colors duration-200 ${isSelected ? 'bg-cyan-500/20' : 'group-hover:bg-slate-800/80'}`}
        style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}
      />
       <div 
        className={`absolute inset-0 border-2 ${isSelected ? 'border-accent' : 'border-border'}`}
        style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}
      />

        <div className="font-display font-black text-xl leading-none text-accent" style={{textShadow: `0 0 8px var(--color-accent)`}}>{player.position}</div>
        <div className="text-xs truncate w-full text-center leading-tight px-1 font-medium">{player.name.last}</div>
        <div className={`font-bold text-lg leading-none mt-1 ${rarityColorClass}`} style={{textShadow: `0 0 5px ${rarityColor}`}}>{player.current_ability}</div>
        <div className="text-[10px] text-accent truncate w-full text-center leading-tight px-1 h-4 flex items-center justify-center mt-1">
          {role ? role.name : '-'}
        </div>
    </div>
  );
};

export default PlayerChit;