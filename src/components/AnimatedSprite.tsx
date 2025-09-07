import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { useWorld } from '../contexts/WorldContext';
import { assetManager } from '../services/assetManager';

interface AnimatedSpriteProps {
    player: Player;
    type: 'idle' | 'walk';
    className?: string;
}

const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({ player, type, className }) => {
    const { findClubById } = useWorld();
    const [spriteSheetUrl, setSpriteSheetUrl] = useState('');
    const club = findClubById(player.club_id);

    useEffect(() => {
        if (club) {
            const url = assetManager.generateAnimatedSpriteSheet(player, club, type);
            setSpriteSheetUrl(url);
        }
    }, [player, club, type]);

    if (!spriteSheetUrl) {
        return <div className={`${className} bg-slate-900/50 animate-pulse rounded-lg`} />;
    }

    return (
        <div 
            className={`${className} ${type === 'idle' ? 'sprite-idle' : 'sprite-walk'}`}
            style={{ 
                backgroundImage: `url(${spriteSheetUrl})`,
            }}
            aria-label={`${player.name.first} ${player.name.last} animated ${type} sprite`}
            role="img"
        />
    );
};

export default AnimatedSprite;
