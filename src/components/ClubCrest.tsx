import React from 'react';
import { useCrests } from '../contexts/CrestContext';
import { useWorld } from '../contexts/WorldContext';

interface ClubCrestProps {
    clubId: string;
    className?: string;
}

const ClubCrest: React.FC<ClubCrestProps> = ({ clubId, className }) => {
    const { getCrest } = useCrests();
    const { findClubById } = useWorld();
    const [crestUrl, setCrestUrl] = React.useState('');
    const club = findClubById(clubId);

    React.useEffect(() => {
        if (club) {
            const url = getCrest(club);
            setCrestUrl(url);
        }
    }, [getCrest, club]);

    if (!club) {
        return <div className={`${className} bg-gray-700 rounded-full animate-pulse`} />;
    }

    if (!crestUrl) {
        return <div className={`${className} bg-gray-800 rounded-full flex items-center justify-center text-white font-bold`}>{club.short_name}</div>;
    }

    return <img src={crestUrl} alt={`${club.name} crest`} className={className} />;
}

export default ClubCrest;