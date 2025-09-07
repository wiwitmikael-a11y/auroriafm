import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useWorld } from '../contexts/WorldContext';
import ClubCrest from './ClubCrest';
import { MenuConfig } from '../App';

interface SidebarProps {
    menuConfig: MenuConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ menuConfig }) => {
  const { managerClubId, findClubById } = useWorld();
  const club = findClubById(managerClubId);
  const location = useLocation();

  const activeCategory = menuConfig.find(category => 
    category.links.some(link => location.pathname.startsWith(link.path))
  ) || menuConfig[0]; // Default to first category

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col p-4 glass-surface m-4">
      <div className="text-center mb-6">
        {club && (
            <div className='flex flex-col items-center gap-2'>
                <ClubCrest clubId={club.id} className="w-24 h-24" />
                <h1 className="text-xl font-display font-bold text-text-emphasis">{club.name}</h1>
                <p className="text-xs text-text-secondary">{club.nickname}</p>
            </div>
        )}
      </div>
      <nav className="flex-grow space-y-2 overflow-y-auto" aria-labelledby="sidebar-heading">
        <h2 id="sidebar-heading" className="text-lg font-display text-text-primary px-2 mb-2">{activeCategory.name}</h2>
        <div className="space-y-2">
            {activeCategory.links.map(link => (
                <NavLink key={link.path} to={link.path} className={navLinkClass}>
                    <span className="link-indicator"></span>
                    <span>{link.label}</span>
                </NavLink>
            ))}
        </div>
      </nav>
      <div className="mt-auto text-center pt-4">
        <p className="text-xs text-text-secondary/50">Aetherium Chronicle v0.3</p>
      </div>
    </aside>
  );
};

export default Sidebar;
