import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const Topbar: React.FC = () => {
    const { gameDate, advanceDay, managerClubId, findClubById, isProcessing, workerReady, managerName } = useWorld();
    const club = findClubById(managerClubId);

    const getButtonState = () => {
        if (!workerReady) return { text: 'Initializing...', disabled: true };
        if (isProcessing) return { text: 'Processing...', disabled: true };
        return { text: 'Advance Day', disabled: false };
    };
    const buttonState = getButtonState();

    return (
        <header className="flex-shrink-0 h-20 px-4 lg:px-6 flex items-center justify-between glass-surface m-4 mb-0">
            {/* Left side: Manager & Club Info */}
            <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                    <UserIcon />
                 </div>
                 <div>
                    <h2 className="font-bold text-lg text-text-emphasis leading-tight">{managerName}</h2>
                    <p className="text-sm text-text-secondary leading-tight">Manager, {club?.name}</p>
                 </div>
            </div>

            {/* Right side: Actions & Date */}
            <div className="flex items-center gap-4 lg:gap-6">
                <div className="text-right">
                    <div className="font-bold text-text-emphasis text-lg">S{gameDate.season}, D{gameDate.day}</div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider">Aurorian Standard Time</div>
                </div>
                <div className="h-10 border-l border-border" />
                <button onClick={advanceDay} className="button-primary" disabled={buttonState.disabled}>
                    {buttonState.text}
                </button>
            </div>
        </header>
    );
};

export default Topbar;
