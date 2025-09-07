import React from 'react';
import { Player } from '../types';

interface PlayerPortraitProps {
    player: Player;
    className?: string;
}

const PlayerPortrait: React.FC<PlayerPortraitProps> = ({ player, className = "w-12 h-14" }) => {
    // This now exclusively renders a hexagonal procedural portrait.
    const rarityColor = 
        player.rarity === 'Legend' ? '#f59e0b' : 
        player.rarity === 'Epic' ? '#a855f7' : 
        player.rarity === 'Rare' ? '#3b82f6' : 
        '#6b7280';
    
    // Simple hash function for deterministic background colors
    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };
    
    const bgColor1 = `hsl(${hashString(player.id) % 360}, 50%, 15%)`;
    const bgColor2 = `hsl(${(hashString(player.id) + 60) % 360}, 40%, 10%)`;

    return (
        <div 
            className={`${className} relative flex items-center justify-center`}
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
            <div 
                className="absolute inset-0"
                style={{ background: `linear-gradient(145deg, ${bgColor1}, ${bgColor2})` }}
            />
            <span 
                className={`relative z-10 font-display font-black text-text-emphasis ${className.includes('w-28') || className.includes('w-24') ? 'text-5xl' : className.includes('w-14') ? 'text-2xl' : 'text-xl'}`}
                style={{ color: rarityColor, textShadow: `0 0 10px ${rarityColor}`}}
            >
                {player.position}
            </span>
            <div 
                className="absolute inset-0 border-2" 
                style={{ borderColor: rarityColor, opacity: 0.7, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />
        </div>
    );
};

export default PlayerPortrait;