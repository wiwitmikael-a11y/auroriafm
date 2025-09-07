import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Squad from './pages/Squad';
import Tactics from './pages/Tactics';
import Transfers from './pages/Transfers';
import LeagueTable from './pages/LeagueTable';
import Finances from './pages/Finances';
import Staff from './pages/Staff';
import Training from './pages/Training';
import ClubDirectory from './pages/ClubDirectory';
import Guilds from './pages/Guilds';
import Inbox from './pages/Inbox';
import Match from './pages/Match';
import ClubHistory from './pages/ClubHistory';
import { useWorld } from './contexts/WorldContext';
import LoadingScreen from './components/LoadingScreen';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import ClubSelection from './pages/ClubSelection';

const menuConfig = [
    { name: "Main", links: [ {path: "/dashboard", label: "Dashboard"}, {path: "/inbox", label: "Inbox"}, {path: "/match", label: "Match Day"} ] },
    { name: "Squad", links: [ {path: "/squad", label: "Squad"}, {path: "/tactics", label: "Tactics"}, {path: "/training", label: "Training"} ] },
    { name: "Staff", links: [ {path: "/staff", label: "Staff Overview"} ] },
    { name: "Transfers", links: [ {path: "/transfers", label: "Transfer Market"} ] },
    { name: "Club", links: [ {path: "/history", label: "History"}, {path: "/finances", label: "Finances"} ] },
    { name: "Competition", links: [ {path: "/league", label: "League Table"}, {path: "/clubs", label: "Club Directory"} ] },
    { name: "World", links: [ {path: "/guilds", label: "Guilds"} ] },
];

export type MenuConfig = typeof menuConfig;

const App: React.FC = () => {
  const { loading, gameLoaded, isClubChosen } = useWorld();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!gameLoaded) {
    return <Login />;
  }

  if (!isClubChosen) {
    return <ClubSelection />;
  }

  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar menuConfig={menuConfig} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar menuConfig={menuConfig} />
          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/match" element={<Match />} />

              <Route path="/squad" element={<Squad />} />
              <Route path="/tactics" element={<Tactics />} />
              <Route path="/training" element={<Training />} />
              
              <Route path="/staff" element={<Staff />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/transfers" element={<Transfers />} />

              <Route path="/league" element={<LeagueTable />} />
              <Route path="/history" element={<ClubHistory />} />
              
              <Route path="/clubs" element={<ClubDirectory />} />
              <Route path="/guilds" element={<Guilds />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;