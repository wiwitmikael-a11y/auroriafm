import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { usePortraits } from '../contexts/PortraitContext';

interface PlayerPortraitProps {
    player: Player;
    className?: string;
}

const PlayerPortrait: React.FC<PlayerPortraitProps> = ({ player, className = "w-12 h-14" }) => {
    const { getPortraitUrl } = usePortraits();
    const [portraitUrl, setPortraitUrl] = useState('');

    useEffect(() => {
        getPortraitUrl(player).then(setPortraitUrl);
    }, [getPortraitUrl, player]);

    if (!portraitUrl) {
        return <div className={`${className} bg-slate-900/50 animate-pulse`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />;
    }

    return (
        <img 
            src={portraitUrl} 
            alt={`${player.name.first} ${player.name.last} portrait`} 
            className={className} 
        />
    );
};

export default PlayerPortrait;
