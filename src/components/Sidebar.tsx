import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorld } from '../contexts/WorldContext';
import ClubCrest from './ClubCrest';
import { MenuConfig } from '../data/menu';

interface SidebarProps {
    menuConfig: MenuConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ menuConfig }) => {
  const { managerClubId, findClubById } = useWorld();
  const club = findClubById(managerClubId);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-nav-link ${isActive ? 'active' : ''}`;

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
      <nav className="flex-grow space-y-4 overflow-y-auto pr-2">
        {menuConfig.map((category) => (
          <div key={category.title}>
            <h2 className="sidebar-category-title">
              <category.icon />
              <span>{category.title}</span>
            </h2>
            <div className="space-y-1 mt-2">
              {category.links.map(link => (
                <NavLink key={link.path} to={link.path} className={navLinkClass}>
                  <link.icon />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto text-center pt-4">
        <p className="text-xs text-text-secondary/50">Aetherium Chronicle v0.4</p>
      </div>
    </aside>
  );
};

export default Sidebar;
