import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const Staff: React.FC = () => {
    const { staff, managerClubId } = useWorld();
    const clubStaff = staff.filter(s => s.club_id === managerClubId);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Club Staff</h1>
                <p className="text-md text-text-secondary">Your trusted backroom team.</p>
            </div>

            <div className="space-y-4">
                {clubStaff.map(s => (
                    <div key={s.id} className="glass-surface p-4">
                        <h2 className="text-lg font-bold text-text-emphasis">{s.name}</h2>
                        <p className="text-accent text-sm">{s.role}</p>
                        <div className="flex gap-4 mt-2 text-xs">
                            {Object.entries(s.attributes).map(([key, value]) => (
                                <div key={key}>
                                    <span className="capitalize text-text-secondary">{key.replace(/_/g, ' ')}: </span>
                                    <span className="font-bold">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Staff;