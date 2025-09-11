import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWorld } from './contexts/WorldContext';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import LoadingScreen from './components/LoadingScreen';
import ClubSelection from './pages/ClubSelection';

// Page Components
import Dashboard from './pages/Dashboard';
import Squad from './pages/Squad';
import Tactics from './pages/Tactics';
import LeagueTable from './pages/LeagueTable';
import ClubDirectory from './pages/ClubDirectory';
import Guilds from './pages/Guilds';
import Inbox from './pages/Inbox';
import Finances from './pages/Finances';
import Staff from './pages/Staff';
import ClubHistory from './pages/ClubHistory';
import Fixtures from './pages/Fixtures';
import Legal from './pages/Legal';
import Transfers from './pages/Transfers';
import Sponsors from './pages/Sponsors';
import Training from './pages/Training';
import Match from './pages/Match';
import YouthAcademy from './pages/YouthAcademy';

import { menuConfig } from './data/menu';

const App: React.FC = () => {
    const { gameState, worldReady, managerClubId, liveMatch } = useWorld();

    if (gameState === 'login') {
        return <Login />;
    }

    if (gameState === 'generating') {
        return <LoadingScreen />;
    }

    if (gameState === 'club_selection') {
        return <ClubSelection />;
    }

    if (liveMatch) {
        return (
             <main className="h-screen w-screen p-4">
                <Match />
            </main>
        )
    }

    if (gameState === 'playing' && worldReady && managerClubId) {
         return (
            <Router>
                <div className="flex h-screen w-screen bg-background text-text-primary font-sans">
                    <Sidebar menuConfig={menuConfig} />
                    <div className="flex-1 flex flex-col min-w-0">
                        <Topbar />
                        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/squad" element={<Squad />} />
                                <Route path="/tactics" element={<Tactics />} />
                                <Route path="/training" element={<Training />} />
                                <Route path="/league" element={<LeagueTable />} />
                                <Route path="/clubs" element={<ClubDirectory />} />
                                <Route path="/guilds" element={<Guilds />} />
                                <Route path="/inbox" element={<Inbox />} />
                                <Route path="/finances" element={<Finances />} />
                                <Route path="/staff" element={<Staff />} />
                                <Route path="/history" element={<ClubHistory />} />
                                <Route path="/fixtures" element={<Fixtures />} />
                                <Route path="/legal" element={<Legal />} />
                                <Route path="/transfers" element={<Transfers />} />
                                <Route path="/sponsors" element={<Sponsors />} />
                                <Route path="/youth-academy" element={<YouthAcademy />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        );
    }
    
    return <div>Loading...</div>; // Fallback
};

export default App;
