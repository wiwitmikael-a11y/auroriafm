import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Player, FormationShape } from '../types';
import TacticalInstructions from '../components/TacticalInstructions';
import SquadList from '../components/SquadList';
import FormationPitch from '../components/FormationPitch';

export const FORMATION_COORDS: Record<FormationShape, {pos: string, coords: {x: number, y: number}}[]> = {
    '4-4-2': [
        {pos: 'GK', coords: {x: 50, y: 92}},
        {pos: 'DF', coords: {x: 20, y: 75}}, {pos: 'DF', coords: {x: 40, y: 78}}, {pos: 'DF', coords: {x: 60, y: 78}}, {pos: 'DF', coords: {x: 80, y: 75}},
        {pos: 'MF', coords: {x: 20, y: 50}}, {pos: 'MF', coords: {x: 40, y: 53}}, {pos: 'MF', coords: {x: 60, y: 53}}, {pos: 'MF', coords: {x: 80, y: 50}},
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
    const { players, managerClubId, updatePlayerFormation, findClubById } = useWorld();
    const club = findClubById(managerClubId);

    const squadPlayers = useMemo(() => {
        return players.filter(p => p.club_id === managerClubId);
    }, [players, managerClubId]);
    
    // Local state for the 11 formation slots, storing player ID or null
    const [formation, setFormation] = useState<(Player | null)[]>(new Array(11).fill(null));

    // Initialize or update local formation state when global player data changes
    useEffect(() => {
        const newFormation = new Array(11).fill(null);
        squadPlayers.forEach(p => {
            if (p.positionIndex != null && p.positionIndex >= 0 && p.positionIndex < 11) {
                newFormation[p.positionIndex] = p;
            }
        });
        setFormation(newFormation);
    }, [squadPlayers]); // Rerun only when the squad players list changes

    const startingXIPlayerIds = useMemo(() => new Set(formation.filter(p => p !== null).map(p => p!.id)), [formation]);
    
    const reserves = useMemo(() => {
        return squadPlayers
            .filter(p => !startingXIPlayerIds.has(p.id))
            .sort((a, b) => a.name.last.localeCompare(b.name.last)); // Also add a default sort
    }, [squadPlayers, startingXIPlayerIds]);
    
    const handleDrop = useCallback((item: { id: string, from: 'squad' | 'pitch', originalIndex: number }, targetIndex: number | null) => {
        const player = squadPlayers.find(p => p.id === item.id);
        if (!player) return;

        const updates: { playerId: string; positionIndex: number | null }[] = [];

        // Player being moved
        const sourcePlayer = player;
        // Player at the target destination (could be null)
        const targetPlayer = (targetIndex !== null) ? formation[targetIndex] : null;

        // Case 1: Dragging from Squad to Pitch
        if (item.from === 'squad') {
            if (targetIndex !== null) {
                // If the target slot is occupied, swap the player back to reserves
                if (targetPlayer) {
                    updates.push({ playerId: targetPlayer.id, positionIndex: null });
                }
                // Place the new player in the slot
                updates.push({ playerId: sourcePlayer.id, positionIndex: targetIndex });
                 // Also remove from original position if they had one
                const originalPos = sourcePlayer.positionIndex;
                if(originalPos !== null && originalPos !== undefined && formation[originalPos]?.id === sourcePlayer.id) {
                    // We need to handle this case, but it shouldn't happen if `reserves` logic is correct
                }
            }
        }
        // Case 2: Dragging from Pitch to Pitch (Swapping)
        else if (item.from === 'pitch' && targetIndex !== null) {
            if (targetPlayer) {
                updates.push({ playerId: targetPlayer.id, positionIndex: item.originalIndex });
            }
            updates.push({ playerId: sourcePlayer.id, positionIndex: targetIndex });
        }
        // Case 3: Dragging from Pitch to Squad (Removing from XI)
        else if (item.from === 'pitch' && targetIndex === null) {
             updates.push({ playerId: sourcePlayer.id, positionIndex: null });
        }

        updatePlayerFormation(updates);
    }, [squadPlayers, formation, updatePlayerFormation]);

    
    const handleAutoAssign = useCallback(() => {
        if (!club) return;
        const formationSlots = FORMATION_COORDS[club.tactics.formation];
        const sortedSquad = [...squadPlayers].sort((a,b) => b.current_ability - a.current_ability);
        
        const updates: { playerId: string; positionIndex: number | null }[] = [];
        // First, unassign all players from the current club
        squadPlayers.forEach(p => updates.push({ playerId: p.id, positionIndex: null }));

        const assignedIds = new Set<string>();

        formationSlots.forEach((slot, index) => {
            // Find best available player for the general position type (GK, DF, MF, FW)
            const bestPlayerForSlot = sortedSquad.find(p => !assignedIds.has(p.id) && p.position === slot.pos);
            if(bestPlayerForSlot) {
                assignedIds.add(bestPlayerForSlot.id);
                // Find if an update for this player already exists and modify it, otherwise add new
                const existingUpdate = updates.find(u => u.playerId === bestPlayerForSlot.id);
                if (existingUpdate) {
                    existingUpdate.positionIndex = index;
                } else {
                    updates.push({ playerId: bestPlayerForSlot.id, positionIndex: index });
                }
            }
        });

        updatePlayerFormation(updates);

    }, [club, squadPlayers, updatePlayerFormation]);

    if (!club) return null;

    return (
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 mb-4">
              <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Tactics</h1>
              <p className="text-md text-text-secondary">Set up your team's formation and instructions.</p>
          </div>
          <div className="flex-grow flex gap-4 min-h-0">
              <div className="w-1/3 flex flex-col gap-4">
                  <SquadList players={reserves} onDrop={handleDrop} />
              </div>
              <div className="w-2/3 flex flex-col gap-4">
                  <FormationPitch 
                      formation={formation} 
                      formationShape={club.tactics.formation} 
                      onDrop={handleDrop} 
                  />
                  <TacticalInstructions 
                      tactics={club.tactics} 
                      onAutoAssign={handleAutoAssign} 
                  />
              </div>
          </div>
        </div>
    );
};

export default Tactics;