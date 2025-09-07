import React from 'react';

const sponsors = [
    { name: 'Gearhaven Innovations', slogan: 'Engineering the Future of Sport', bonus: '+$50,000 weekly income', tier: 'Primary Sponsor' },
    { name: 'Arcane Elixirs Co.', slogan: 'Unleash Your Potential', bonus: '15% discount on all potions', tier: 'Official Partner' },
    { name: 'Avalon Steelworks', slogan: 'Forged for Victory', bonus: '+5% to stadium gate receipts', tier: 'Official Partner' },
];


const Sponsors: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Sponsors</h1>
        <p className="text-md text-text-secondary">The commercial partners backing your club.</p>
      </div>

      <div className="space-y-4">
        {sponsors.map(sponsor => (
            <div key={sponsor.name} className="glass-surface p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-accent-secondary font-bold uppercase">{sponsor.tier}</p>
                        <h2 className="text-2xl font-bold text-text-emphasis">{sponsor.name}</h2>
                        <p className="text-sm text-text-secondary italic">"{sponsor.slogan}"</p>
                    </div>
                    <div className="text-right bg-accent/10 px-3 py-1 rounded-md border border-accent/30">
                        <p className="text-xs text-accent uppercase font-bold">Sponsorship Bonus</p>
                        <p className="font-bold text-text-emphasis">{sponsor.bonus}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;
