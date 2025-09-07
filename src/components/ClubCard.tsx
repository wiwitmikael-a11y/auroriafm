import React from 'react';
import { Club } from '../types';
// FIX: Removed unused import for a non-existent context.
import { assetManager } from '../services/assetManager';
import TeamKit from './TeamKit';
import { SPONSORS } from '../data/sponsors';

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  // FIX: Replaced `useCrests` with `assetManager` to generate crests.
  const [crestUrl, setCrestUrl] = React.useState('');

  React.useEffect(() => {
    const url = assetManager.generateCrest(club);
    setCrestUrl(url);
  }, [club]);

  const primarySponsorDeal = club.sponsor_deals.find(deal => {
      const sponsor = SPONSORS.find(s => s.id === deal.sponsorId);
      return sponsor && (sponsor.tier === 'Global' || sponsor.tier === 'Primary');
  });
  const primarySponsor = primarySponsorDeal ? SPONSORS.find(s => s.id === primarySponsorDeal.sponsorId) : undefined;

  return (
    <div className="glass-surface p-4 border border-transparent hover:border-accent/50 transition-colors duration-200 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {crestUrl ? (
          <img src={crestUrl} alt={`${club.name} crest`} className="w-16 h-16" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-900/50 animate-pulse" />
        )}
        <div>
          <h2 className="text-xl font-bold text-text-emphasis">{club.name}</h2>
          <p className="text-text-secondary">"{club.nickname}"</p>
        </div>
      </div>

      <div className="flex justify-around items-center">
          <TeamKit club={club} sponsor={primarySponsor} type="home" />
          <TeamKit club={club} sponsor={primarySponsor} type="away" />
      </div>

      <div className="mt-auto text-sm space-y-1 text-center border-t border-border pt-2">
        <p><span className="font-semibold text-text-secondary">Stadium:</span> {club.stadium}</p>
        <p><span className="font-semibold text-text-secondary">Finances:</span> {club.finances}</p>
      </div>
    </div>
  );
};

export default ClubCard;
