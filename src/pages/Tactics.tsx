import React, { useState, useMemo } from 'react';
import TacticsPitch from '../components/TacticsPitch';
import RosterList from '../components/RosterList';
import TacticalInstructions from '../components/TacticalInstructions';
import { useWorld } from '../contexts/WorldContext';
import { TacticalPlayer } from '../types';

const Tactics: React.FC = () => {
    const { players, managerClubId, updatePlayerTactics, findClubById } = useWorld();
    const club = findClubById(managerClubId);

    const squadPlayers = useMemo(() => {
        return players
            .filter(p => p.club_id === managerClubId)
            .map(p => ({
                ...p,
                x: p.x ?? 50, // Default to center if not set
                y: p.y ?? 85,
            }));
    }, [players, managerClubId]);

    const [pitchPlayers, setPitchPlayers] = useState<TacticalPlayer[]>(squadPlayers.slice(0, 11));
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const handleDrop = (item: { id: string }, position: { x: number; y: number }) => {
        const droppedPlayer = squadPlayers.find(p => p.id === item.id);
        if (!droppedPlayer) return;

        const newPitchPlayer = { ...droppedPlayer, ...position };

        setPitchPlayers(prev => {
            const isAlreadyOnPitch = prev.some(p => p.id === item.id);
            if (isAlreadyOnPitch) {
                return prev.map(p => p.id === item.id ? newPitchPlayer : p);
            } else {
                if (prev.length < 11) {
                    return [...prev, newPitchPlayer];
                }
                return prev; // Or replace nearest player logic
            }
        });
        
        updatePlayerTactics(item.id, position.x, position.y);
    };

    const rosterPlayers = useMemo(() => {
        return squadPlayers.filter(p => !pitchPlayers.some(pp => pp.id === p.id));
    }, [squadPlayers, pitchPlayers]);

    if (!club) return null;

    return (
        <div className="h-full flex gap-4">
            <div className="w-3/4 flex flex-col">
                <div className="mb-4 flex-shrink-0">
                  <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Tactics</h1>
                  <p className="text-md text-text-secondary">Set up your team's formation and play style.</p>
                </div>
                <div className="flex-grow">
                    <TacticsPitch 
                        players={pitchPlayers} 
                        onDrop={handleDrop} 
                        selectedPlayerId={selectedPlayerId}
                        onSelectPlayer={setSelectedPlayerId}
                    />
                </div>
            </div>
            <div className="w-1/4 flex flex-col gap-4">
                <TacticalInstructions tactics={club.tactics} />
                <RosterList players={rosterPlayers} />
            </div>
        </div>
    );
};

export default Tactics;