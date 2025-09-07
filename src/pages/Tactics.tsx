import React, { useState, useMemo, useCallback } from 'react';
import TacticsPitch from '../components/TacticsPitch';
import RosterList from '../components/RosterList';
import TacticalInstructions from '../components/TacticalInstructions';
import { useWorld } from '../contexts/WorldContext';
import { TacticalPlayer, FormationShape } from '../types';

const FORMATION_COORDS: Record<FormationShape, {pos: string, coords: {x: number, y: number}}[]> = {
    '4-4-2': [
        {pos: 'GK', coords: {x: 50, y: 92}},
        {pos: 'DF', coords: {x: 20, y: 75}}, {pos: 'DF', coords: {x: 40, y: 78}}, {pos: 'DF', coords: {x: 60, y: 78}}, {pos: 'DF', coords: {x: 80, y: 75}},
        {pos: 'MF', coords: {x: 25, y: 50}}, {pos: 'MF', coords: {x: 45, y: 53}}, {pos: 'MF', coords: {x: 65, y: 53}}, {pos: 'MF', coords: {x: 85, y: 50}},
        {pos: 'FW', coords: {x: 40, y: 25}}, {pos: 'FW', coords: {x: 60, y: 25}},
    ],
    '4-3-3': [
        {pos: 'GK', coords: {x: 50, y: 92}},
        {pos: 'DF', coords: {x: 20, y: 75}}, {pos: 'DF', coords: {x: 40, y: 78}}, {pos: 'DF', coords: {x: 60, y: 78}}, {pos: 'DF', coords: {x: 80, y: 75}},
        {pos: 'MF', coords: {x: 35, y: 55}}, {pos: 'MF', coords: {x: 50, y: 60}}, {pos: 'MF', coords: {x: 65, y: 55}},
        {pos: 'FW', coords: {x: 25, y: 25}}, {pos: 'FW', coords: {x: 50, y: 20}}, {pos: 'FW', coords: {x: 75, y: 25}},
    ],
    '3-5-2': [
        {pos: 'GK', coords: {x: 50, y: 92}},
        {pos: 'DF', coords: {x: 30, y: 78}}, {pos: 'DF', coords: {x: 50, y: 80}}, {pos: 'DF', coords: {x: 70, y: 78}},
        {pos: 'MF', coords: {x: 15, y: 50}}, {pos: 'MF', coords: {x: 35, y: 55}}, {pos: 'MF', coords: {x: 50, y: 60}}, {pos: 'MF', coords: {x: 65, y: 55}}, {pos: 'MF', coords: {x: 85, y: 50}},
        {pos: 'FW', coords: {x: 40, y: 25}}, {pos: 'FW', coords: {x: 60, y: 25}},
    ],
    '5-3-2': [
        {pos: 'GK', coords: {x: 50, y: 92}},
        {pos: 'DF', coords: {x: 15, y: 75}}, {pos: 'DF', coords: {x: 35, y: 78}}, {pos: 'DF', coords: {x: 50, y: 80}}, {pos: 'DF', coords: {x: 65, y: 78}}, {pos: 'DF', coords: {x: 85, y: 75}},
        {pos: 'MF', coords: {x: 35, y: 50}}, {pos: 'MF', coords: {x: 50, y: 55}}, {pos: 'MF', coords: {x: 65, y: 50}},
        {pos: 'FW', coords: {x: 40, y: 25}}, {pos: 'FW', coords: {x: 60, y: 25}},
    ],
};

const Tactics: React.FC = () => {
    const { players, managerClubId, updatePlayerTactics, findClubById } = useWorld();
    const club = findClubById(managerClubId);

    const squadPlayers = useMemo(() => {
        return players.filter(p => p.club_id === managerClubId).map(p => ({ ...p, x: p.x ?? 50, y: p.y ?? 85 }));
    }, [players, managerClubId]);

    const [pitchPlayers, setPitchPlayers] = useState<TacticalPlayer[]>(squadPlayers.sort((a,b) => b.current_ability - a.current_ability).slice(0, 11));
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const handleDrop = (item: { id: string }, position: { x: number; y: number }) => {
        const droppedPlayer = squadPlayers.find(p => p.id === item.id);
        if (!droppedPlayer) return;

        const newPitchPlayer = { ...droppedPlayer, ...position };
        setPitchPlayers(prev => prev.some(p => p.id === item.id) ? prev.map(p => p.id === item.id ? newPitchPlayer : p) : (prev.length < 11 ? [...prev, newPitchPlayer] : prev));
        updatePlayerTactics(item.id, position.x, position.y);
    };
    
    const handleAutoAssign = useCallback(() => {
        if (!club) return;
        const formationCoords = FORMATION_COORDS[club.tactics.formation];
        const sortedSquad = [...squadPlayers].sort((a,b) => b.current_ability - a.current_ability);
        
        const assignments: TacticalPlayer[] = [];
        const assignedIds = new Set<string>();

        formationCoords.forEach(slot => {
            const bestPlayerForSlot = sortedSquad.find(p => !assignedIds.has(p.id) && (p.position === slot.pos || (slot.pos === 'DF' && p.position === 'DF') || (slot.pos === 'MF' && p.position === 'MF') || (slot.pos === 'FW' && p.position === 'FW')));
            if(bestPlayerForSlot) {
                const playerWithCoords = {...bestPlayerForSlot, ...slot.coords};
                assignments.push(playerWithCoords);
                assignedIds.add(bestPlayerForSlot.id);
                updatePlayerTactics(bestPlayerForSlot.id, slot.coords.x, slot.coords.y);
            }
        });
        setPitchPlayers(assignments);

    }, [club, squadPlayers, updatePlayerTactics]);

    const rosterPlayers = useMemo(() => squadPlayers.filter(p => !pitchPlayers.some(pp => pp.id === p.id)), [squadPlayers, pitchPlayers]);

    if (!club) return null;

    return (
        <div className="h-full flex gap-4">
            <div className="w-1/4 flex flex-col gap-4">
                 <div className="flex-shrink-0">
                  <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Tactics</h1>
                  <p className="text-md text-text-secondary">Set up your team's formation.</p>
                </div>
                <TacticalInstructions tactics={club.tactics} onAutoAssign={handleAutoAssign} />
                <RosterList players={rosterPlayers} />
            </div>
            <div className="w-3/4 flex-grow">
                <TacticsPitch 
                    players={pitchPlayers} 
                    onDrop={handleDrop} 
                    selectedPlayerId={selectedPlayerId}
                    onSelectPlayer={setSelectedPlayerId}
                />
            </div>
        </div>
    );
};

export default Tactics;