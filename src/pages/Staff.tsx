import React from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Staff, CoachAttributes, ScoutAttributes, PhysioAttributes } from '../types';

const getStaffBuff = (staff: Staff): { title: string, value: string } => {
    const { role, attributes } = staff;
    
    const getBestAttr = (attrs: object) => Object.entries(attrs).reduce((a, b) => a[1] > b[1] ? a : b);

    switch (role) {
        case 'Assistant Manager':
            const amAttrs = attributes as CoachAttributes;
            return { title: 'In-Match Tactic', value: `+${amAttrs.tactical || 10} Knowledge` };
        case 'Head of Youth Development':
            const hoydAttrs = attributes as CoachAttributes;
            const hoydBest = hoydAttrs.working_with_youth || 10;
            return { title: 'Youth Intake', value: `+${Math.floor(hoydBest / 2)}% Quality` };
        case 'Chief Scout':
            const scoutAttrs = attributes as ScoutAttributes;
            const scoutBest = getBestAttr(scoutAttrs);
            return { title: `Best Skill: ${scoutBest[0].replace('_', ' ')}`, value: `+${scoutBest[1]} Accuracy` };
        case 'Physio':
            const physioAttrs = attributes as PhysioAttributes;
            const physioBest = getBestAttr(physioAttrs);
            return { title: 'Team Fitness', value: `${physioBest[0] === 'prevention' ? 'Reduces' : 'Speeds up'} Injury` };
        case 'Coach':
            const coachBest = getBestAttr(attributes as CoachAttributes);
            return { title: 'Training Focus', value: `+${coachBest[1]} ${coachBest[0]}` };
        default:
            return { title: 'Club Buff', value: 'General Support' };
    }
};

const AttributeBar: React.FC<{ label: string, value: number }> = ({ label, value }) => (
    <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-900 rounded-full">
                <div className="h-2 bg-accent rounded-full" style={{ width: `${value * 5}%` }} />
            </div>
            <span className="font-bold w-4 text-right">{value}</span>
        </div>
    </div>
);

const StaffCard: React.FC<{ staff: Staff }> = ({ staff }) => {
    const buff = getStaffBuff(staff);
    return (
        <div className="glass-surface p-4 flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h2 className="text-lg font-bold text-text-emphasis">{staff.name}</h2>
                    <p className="text-accent text-sm font-semibold">{staff.role}</p>
                </div>
                <div className="text-right bg-accent/10 px-3 py-1 rounded-md border border-accent/30">
                    <p className="text-xs text-accent uppercase font-bold">{buff.title}</p>
                    <p className="font-bold text-text-emphasis">{buff.value}</p>
                </div>
            </div>
            <div className="space-y-2 border-t border-border pt-3">
                {Object.entries(staff.attributes).map(([key, value]) => (
                    <AttributeBar key={key} label={key.replace(/_/g, ' ')} value={value as number} />
                ))}
            </div>
        </div>
    );
};


const Staff: React.FC = () => {
    const { staff, managerClubId } = useWorld();
    const clubStaff = staff.filter(s => s.club_id === managerClubId);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Club Staff</h1>
                <p className="text-md text-text-secondary">Your trusted backroom team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubStaff.map(s => (
                   <StaffCard key={s.id} staff={s} />
                ))}
            </div>
        </div>
    );
};

export default Staff;