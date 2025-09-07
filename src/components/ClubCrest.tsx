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
            getCrest(club.crest_tags, club.palette).then(setCrestUrl);
        }
    }, [getCrest, club]);

    if (!club) {
        return <div className={`${className} bg-gray-700 rounded-full animate-pulse`} />;
    }

    // Fallback to a simple div with short name if crest generation fails or is in progress
    if (!crestUrl) {
        return <div className={`${className} bg-gray-800 rounded-full flex items-center justify-center text-white font-bold`}>{club.short_name}</div>;
    }

    return <img src={crestUrl} alt={`${club.name} crest`} className={className} />;
}

export default ClubCrest;