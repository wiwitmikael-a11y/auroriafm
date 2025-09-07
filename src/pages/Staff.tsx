import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Staff, StaffRole } from '../types';

const getStaffBuff = (staff: Staff): string => {
    const mainAttr = Object.values(staff.attributes)[0] || 10;
    const bonus = Math.floor((mainAttr - 10) / 2);

    switch (staff.role) {
        case 'Assistant Manager':
            return `+${bonus} Tactical Familiarity`;
        case 'Head of Youth Development':
            return `+${bonus}% Youth Prospect Quality`;
        case 'Chief Scout':
            return `+${bonus} Scouting Accuracy`;
        case 'Physio':
            return `-${bonus * 2}% Injury Recovery Time`;
        case 'Coach':
            return `+${bonus}% Training Effectiveness`;
        default:
            return 'No specific buff.';
    }
}

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
                        <div className="flex justify-between items-start">
                             <div>
                                <h2 className="text-lg font-bold text-text-emphasis">{s.name}</h2>
                                <p className="text-accent text-sm">{s.role}</p>
                            </div>
                            <div className="text-right bg-accent/10 px-3 py-1 rounded-md border border-accent/30">
                                <p className="text-xs text-accent uppercase font-bold">Club Buff</p>
                                <p className="font-bold text-text-emphasis">{getStaffBuff(s)}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs border-t border-border pt-2">
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