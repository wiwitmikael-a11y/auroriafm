import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorld } from '../contexts/WorldContext';
import { MenuConfig } from '../App';

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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
    const { gameDate, advanceDay, managerClubId, findClubById } = useWorld();
    const club = findClubById(managerClubId);
    const location = useLocation();

    return (
        <header className="flex-shrink-0 h-20 px-6 flex items-center justify-between glass-surface m-4 mb-0">
            {/* Left side: Main Navigation */}
            <nav className="flex items-center gap-2">
                {menuConfig.map(category => {
                    const isCategoryActive = category.links.some(link => location.pathname.startsWith(link.path));
                    return (
                        <Link
                            key={category.name}
                            to={category.links[0].path}
                            className={`px-4 py-2 rounded-md text-md font-display transition-colors duration-200 ${
                                isCategoryActive ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
                            }`}
                        >
                            {category.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Right side: Actions & Info */}
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="font-bold text-text-emphasis text-sm">{club?.name}</div>
                    <div className="text-xs text-text-secondary">Season {gameDate.season}, Day {gameDate.day}</div>
                </div>
                <button onClick={advanceDay} className="button-primary">
                    Advance
                </button>
                 {/* Placeholder Icons */}
                <div className="flex items-center gap-4 border-l border-border pl-6">
                    <button className="text-text-secondary hover:text-accent transition-colors" aria-label="User Profile"><UserIcon /></button>
                    <button className="text-text-secondary hover:text-accent transition-colors" aria-label="Settings"><SettingsIcon /></button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;