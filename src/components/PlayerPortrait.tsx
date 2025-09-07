import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { useWorld } from '../contexts/WorldContext';
import { assetManager } from '../services/assetManager';

interface PlayerPortraitProps {
    player: Player;
    className?: string;
}

const PlayerPortrait: React.FC<PlayerPortraitProps> = ({ player, className = "w-12 h-14" }) => {
    const { findClubById } = useWorld();
    const [portraitUrl, setPortraitUrl] = useState('');
    const club = findClubById(player.club_id);

    useEffect(() => {
        if (club) {
            const url = assetManager.generateModularPortrait(player, club);
            setPortraitUrl(url);
        }
    }, [player, club]);

    if (!portraitUrl) {
        return <div className={`${className} bg-slate-900/50 animate-pulse rounded-lg`} />;
    }

    return (
        <img 
            src={portraitUrl} 
            alt={`${player.name.first} ${player.name.last} portrait`} 
            className={`${className} rounded-lg`}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

export default PlayerPortrait;