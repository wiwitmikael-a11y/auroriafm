import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import { SPONSORS } from '../data/sponsors';
import { SponsorDeal } from '../types';

const SponsorCard: React.FC<{ deal: SponsorDeal }> = ({ deal }) => {
    const sponsor = SPONSORS.find(s => s.id === deal.sponsorId);
    if (!sponsor) return null;

    return (
        <div className="glass-surface p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-accent-secondary font-bold uppercase">{sponsor.tier} Sponsor</p>
                    <h2 className="text-2xl font-bold text-text-emphasis">{sponsor.name}</h2>
                    <p className="text-sm text-text-secondary italic">"{sponsor.slogan}"</p>
                </div>
                <div className="text-right bg-accent/10 px-3 py-1 rounded-md border border-accent/30">
                    <p className="text-xs text-accent uppercase font-bold">Sponsorship Bonus</p>
                    <p className="font-bold text-text-emphasis">+${deal.weekly_income.toLocaleString()} weekly</p>
                    <p className="text-xs text-text-secondary">Expires: S{deal.season}, Day {deal.expires_day}</p>
                </div>
            </div>
        </div>
    );
};


const Sponsors: React.FC = () => {
  const { managerClubId, findClubById } = useWorld();
  const club = findClubById(managerClubId);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Sponsors</h1>
        <p className="text-md text-text-secondary">The commercial partners backing your club.</p>
      </div>

      <div className="space-y-4">
        {club?.sponsor_deals.length ? (
            club.sponsor_deals.map(deal => <SponsorCard key={deal.sponsorId} deal={deal} />)
        ) : (
            <div className="glass-surface p-6 text-center">
                <p className="text-text-secondary">No active sponsors. New offers may arrive in your inbox.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Sponsors;