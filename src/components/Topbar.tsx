import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorld } from '../contexts/WorldContext';
import { MenuConfig } from '../App';

// --- Icon Components ---
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);
const SquadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);
const StaffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.72a3 3 0 0 0-4.682 2.72 9.094 9.094 0 0 0 3.741.479M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7.5 4.52a9 9 0 0 1 15 0" />
    </svg>
);
const TransfersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);
const ClubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20.25h4M3.34 10.12a9 9 0 0 1 17.32 0M12 2.25c-4.134 0-7.655 2.545-9.088 6.131a.75.75 0 0 0 1.168.738A6.732 6.732 0 0 1 12 7.5c3.726 0 6.75 3.024 6.75 6.75s-3.024 6.75-6.75 6.75S5.25 15.726 5.25 12c0-1.74.662-3.324 1.746-4.553a.75.75 0 0 0-1.168-.737A9.004 9.004 0 0 0 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9Z" />
    </svg>
);
const CompetitionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497c-.621 0-1.125.504-1.125 1.125v3.375m5.007 0h.004v.004h-.004v-.004Zm-5.007 0h.004v.004h-.004v-.004Zm5.007 0a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0Zm-4.5 0h.004v.004h-.004v-.004Zm-3.375-3.375c0-1.036.84-1.875 1.875-1.875h.872a1.875 1.875 0 0 1 1.634 2.871l-1.933.267c-.696.096-.936.864-.503 1.298l.503.504a1.125 1.125 0 0 0 1.59 0l.504-.504c.433-.434.192-1.202-.504-1.298L12 12.75" />
    </svg>
);
const WorldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c1.35 0 2.664-.294 3.86-1.04M12 21c-1.35 0-2.664-.294-3.86-1.04M12 3a9.004 9.004 0 0 0-8.716 6.747M12 3a9.004 9.004 0 0 1 8.716 6.747M12 3c1.35 0 2.664.294 3.86 1.04M12 3c-1.35 0-2.664-.294-3.86-1.04M4.26 15.747A9.004 9.004 0 0 1 12 3c1.35 0 2.664.294 3.86 1.04M4.26 15.747A9.004 9.004 0 0 0 12 21c1.35 0 2.664.294 3.86-1.04M19.74 8.253A9.004 9.004 0 0 0 12 3c-1.35 0-2.664-.294-3.86-1.04M19.74 8.253A9.004 9.004 0 0 1 12 21c-1.35 0-2.664-.294-3.86-1.04M4.26 8.253A9.004 9.004 0 0 1 12 21c1.35 0 2.664.294 3.86-1.04M19.74 15.747A9.004 9.004 0 0 0 12 3c-1.35 0-2.664-.294-3.86-1.04" />
    </svg>
);
const SystemIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M21.75 9V5.625A2.25 2.25 0 0 0 19.5 3.375l-7.5 4.125M21.75 9l-7.5 4.125M3.375 5.625c0-1.036.84-1.875 1.875-1.875h.375m13.5 0h.375c1.036 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875h-1.5a1.875 1.875 0 0 1-1.875-1.875v-1.5m-6.375-9.375c.621 0 1.125.504 1.125 1.125v6.375c0 .621-.504 1.125-1.125 1.125H9.375c-.621 0-1.125-.504-1.125-1.125v-6.375c0-.621.504-1.125 1.125-1.125h6.375Z" />
    </svg>
);

const iconMap: { [key: string]: React.FC } = {
    "Main": DashboardIcon,
    "Squad": SquadIcon,
    "Staff": StaffIcon,
    "Transfers": TransfersIcon,
    "Club": ClubIcon,
    "Competition": CompetitionIcon,
    "World": WorldIcon,
    "System": SystemIcon,
};

// --- Other Icons ---
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


interface TopbarProps {
    menuConfig: MenuConfig;
}

const Topbar: React.FC<TopbarProps> = ({ menuConfig }) => {
    const { gameDate, advanceDay, managerClubId, findClubById, isProcessing, workerReady, resetGame } = useWorld();
    const club = findClubById(managerClubId);
    const location = useLocation();

    const getButtonState = () => {
        if (!workerReady) return { text: 'Loading...', disabled: true };
        if (isProcessing) return { text: 'Processing...', disabled: true };
        return { text: 'Advance', disabled: false };
    };
    const buttonState = getButtonState();

    const handleNewGame = () => {
        if (window.confirm('Are you sure you want to start a new game? All current progress will be lost.')) {
            resetGame();
        }
    };

    return (
        <header className="flex-shrink-0 h-20 px-4 lg:px-6 flex items-center justify-between glass-surface m-4 mb-0">
            {/* Left side: Main Navigation */}
            <nav className="flex items-center gap-2">
                {menuConfig.map(category => {
                    const isCategoryActive = category.links.some(link => location.pathname.startsWith(link.path));
                    const Icon = iconMap[category.name] || DashboardIcon;
                    return (
                        <Link
                            key={category.name}
                            to={category.links[0].path}
                            className={`topbar-button ${isCategoryActive ? 'active' : ''}`}
                            title={category.name}
                        >
                            <Icon />
                            <span className="hidden lg:inline">{category.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Right side: Actions & Info */}
            <div className="flex items-center gap-2 lg:gap-6">
                <div className="text-right">
                    <div className="hidden lg:block font-bold text-text-emphasis text-sm">{club?.name}</div>
                    <div className="text-xs text-text-secondary">S{gameDate.season}, D{gameDate.day}</div>
                </div>
                <button onClick={advanceDay} className="button-primary" disabled={buttonState.disabled}>
                    {buttonState.text}
                </button>
                 {/* Placeholder Icons */}
                <div className="flex items-center gap-2 lg:gap-4 border-l border-border pl-2 lg:pl-6">
                    <button className="text-text-secondary hover:text-accent transition-colors" aria-label="User Profile"><UserIcon /></button>
                    <button onClick={handleNewGame} className="text-text-secondary hover:text-accent transition-colors" aria-label="New Game"><SettingsIcon /></button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;