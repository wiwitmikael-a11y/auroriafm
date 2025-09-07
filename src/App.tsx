import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Squad from './pages/Squad';
import Tactics from './pages/Tactics';
import LeagueTable from './pages/LeagueTable';
import Transfers from './pages/Transfers';
import ClubDirectory from './pages/ClubDirectory';
import Inbox from './pages/Inbox';
import Guilds from './pages/Guilds';
import ClubHistory from './pages/ClubHistory';
import Finances from './pages/Finances';
import Staff from './pages/Staff';
import Match from './pages/Match';
import Training from './pages/Training';
import Fixtures from './pages/Fixtures';
import Sponsors from './pages/Sponsors';
import Legal from './pages/Legal';

import { useWorld, GameState } from './contexts/WorldContext';
import Login from './pages/Login';
import ClubSelection from './pages/ClubSelection';
import LoadingScreen from './components/LoadingScreen';

export type MenuConfig = {
  name: string;
  links: { path: string; label: string; element: React.ReactNode }[];
}[];

const menuConfig: MenuConfig = [
  { name: 'Main', links: [{ path: '/dashboard', label: 'Dashboard', element: <Dashboard /> }, { path: '/inbox', label: 'Inbox', element: <Inbox /> }] },
  { name: 'Squad', links: [{ path: '/squad', label: 'Players', element: <Squad /> }, { path: '/tactics', label: 'Tactics', element: <Tactics /> }, { path: '/training', label: 'Training', element: <Training /> }] },
  { name: 'Staff', links: [{ path: '/staff', label: 'Club Staff', element: <Staff /> }] },
  { name: 'Transfers', links: [{ path: '/transfers', label: 'Transfer Market', element: <Transfers /> }] },
  { name: 'Club', links: [{ path: '/club/history', label: 'History', element: <ClubHistory /> }, { path: '/club/finances', label: 'Finances', element: <Finances /> }, { path: '/club/sponsors', label: 'Sponsors', element: <Sponsors /> }] },
  { name: 'Competition', links: [{ path: '/league', label: 'League Table', element: <LeagueTable /> }, { path: '/fixtures', label: 'Fixtures', element: <Fixtures /> }] },
  { name: 'World', links: [{ path: '/world/clubs', label: 'Club Directory', element: <ClubDirectory /> }, { path: '/world/guilds', label: 'Guilds', element: <Guilds /> }] },
  { name: 'System', links: [{ path: '/legal', label: 'Legal', element: <Legal /> }] },
];

const App: React.FC = () => {
    const { gameState } = useWorld();

    if (gameState === GameState.LOADING) {
        return <LoadingScreen />;
    }
    
    if (gameState === GameState.LOGIN) {
        return <Login />;
    }

    if (gameState === GameState.CLUB_SELECTION) {
        return <ClubSelection />;
    }

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-background text-text-primary font-sans">
                <Sidebar menuConfig={menuConfig} />
                <main className="flex-grow flex flex-col">
                    <Topbar menuConfig={menuConfig} />
                    <div className="flex-grow p-4 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            {menuConfig.flatMap(category =>
                                category.links.map(link => (
                                    <Route key={link.path} path={link.path} element={link.element} />
                                ))
                            )}
                            {/* Special non-sidebar routes */}
                            <Route path="/match" element={<Match />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
