import React, { useEffect, useState } from 'react';
import { Club } from '../types';
import { useCrests } from '../contexts/CrestContext';

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const { getCrest } = useCrests();
  const [crestUrl, setCrestUrl] = useState('');

  useEffect(() => {
    getCrest(club.crest_tags, club.palette).then(setCrestUrl);
  }, [getCrest, club.crest_tags, club.palette]);

  return (
    <div className="glass-surface p-4 border border-transparent hover:border-accent/50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        {crestUrl ? (
          <img src={crestUrl} alt={`${club.name} crest`} className="w-16 h-16 rounded-full" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-900/50" />
        )}
        <div>
          <h2 className="text-xl font-bold text-text-emphasis">{club.name}</h2>
          <p className="text-text-secondary">"{club.nickname}"</p>
        </div>
      </div>
      <div className="mt-4 text-sm space-y-1">
        <p><span className="font-semibold text-text-secondary">Stadium:</span> {club.stadium}</p>
        <p><span className="font-semibold text-text-secondary">Finances:</span> {club.finances}</p>
      </div>
    </div>
  );
};

export default ClubCard;