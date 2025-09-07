// src/components/TeamKit.tsx
import React, { useState, useEffect } from 'react';
import { Club, Sponsor } from '../types';
import { assetManager } from '../services/assetManager';

interface TeamKitProps {
  club: Club;
  sponsor?: Sponsor;
  type: 'home' | 'away';
  className?: string;
}

const TeamKit: React.FC<TeamKitProps> = ({ club, sponsor, type, className = 'w-20 h-20' }) => {
  const [kitUrl, setKitUrl] = useState('');

  useEffect(() => {
    const url = assetManager.generateKit(club, sponsor, type);
    setKitUrl(url);
  }, [club, sponsor, type]);

  if (!kitUrl) {
    return <div className={`${className} bg-slate-900/50 animate-pulse rounded-md`} />;
  }

  return (
    <div className="flex flex-col items-center">
        <img src={kitUrl} alt={`${club.name} ${type} kit`} className={className} />
        <p className="text-xs font-bold text-text-secondary uppercase mt-1">{type}</p>
    </div>
  );
};

export default TeamKit;