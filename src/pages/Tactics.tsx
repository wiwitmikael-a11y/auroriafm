import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { Player, FormationShape, TacticSettings } from '../types';
import FormationPitch from '../components/FormationPitch';
import SquadList from '../components/SquadList';
import TacticalInstructions from '../components/TacticalInstructions';
import { produce } from 'immer';

export const FORMATION_COORDS: Record<FormationShape, { pos: string; coords: { x: number; y: number } }[]> = {
    '4-4-2': [
        { pos: 'GK', coords: { x: 50, y: 92 } },
        { pos: 'DL', coords: { x: 20, y: 75 } }, { pos: 'DC', coords: { x: 40, y: 78 } }, { pos: 'DC', coords: { x: 60, y: 78 } }, { pos: 'DR', coords: { x: 80, y: 75 } },
        { pos: 'ML', coords: { x: 25, y: 50 } }, { pos: 'MC', coords: { x: 45, y: 53 } }, { pos: 'MC', coords: { x: 65, y: 53 } }, { pos: 'MR', coords: { x: 85, y: 50 } },
        { pos: 'ST', coords: { x: 40, y: 25 } }, { pos: 'ST', coords: { x: 60, y: 25 } },
    ],
    '4-3-3': [
        { pos: 'GK', coords: { x: 50, y: 92 } },
        { pos: 'DL', coords: { x: 20, y: 75 } }, { pos: 'DC', coords: { x: 40, y: 78 } }, { pos: 'DC', coords: { x: 60, y: 78 } }, { pos: 'DR', coords: { x: 80, y: 75 } },
        { pos: 'MC', coords: { x: 35, y: 55 } }, { pos: 'MC', coords: { x: 50, y: 60 } }, { pos: 'MC', coords: { x: 65, y: 55 } },
        { pos: 'FWL', coords: { x: 25, y: 25 } }, { pos: 'ST', coords: { x: 50, y: 20 } }, { pos: 'FWR', coords: { x: 75, y: 25 } },
    ],
    '3-5-2': [
        { pos: 'GK', coords: { x: 50, y: 92 } },
        { pos: 'DC', coords: { x: 30, y: 78 } }, { pos: 'DC', coords: { x: 50, y: 80 } }, { pos: 'DC', coords: { x: 70, y: 78 } },
        { pos: 'WBL', coords: { x: 15, y: 50 } }, { pos: 'MC', coords: { x: 35, y: 55 } }, { pos: 'MC', coords: { x: 50, y: 60 } }, { pos: 'MC', coords: { x: 65, y: 55 } }, { pos: 'WBR', coords: { x: 85, y: 50 } },
        { pos: 'ST', coords: { x: 40, y: 25 } }, { pos: 'ST', coords: { x: 60, y: 25 } },
    ],
    '5-3-2': [
        { pos: 'GK', coords: { x: 50, y: 92 } },
        { pos: 'WBL', coords: { x: 15, y: 75 } }, { pos: 'DC', coords: { x: 35, y: 78 } }, { pos: 'DC', coords: { x: 50, y: 80 } }, { pos: 'DC', coords: { x: 65, y: 78 } }, { pos: 'WBR', coords: { x: 85, y: 75 } },
        { pos: 'MC', coords: { x: 35, y: 50 } }, { pos: 'MC', coords: { x: 50, y: 55 } }, { pos: 'MC', coords: { x: 65, y: 50 } },
        { pos: 'ST', coords: { x: 40, y: 25 } }, { pos: 'ST', coords: { x: 60, y: 25 } },
    ],
};


const Tactics: React.FC = () => {
    const { players, managerClubId, findClubById, updateClubTactics } = useWorld();
    const club = findClubById(managerClubId);
    
    const [formationSlots, setFormationSlots] = useState<(Player | null)[]>(Array(11).fill(null));

    const squadPlayers = useMemo(() => {
        return players.filter(p => p.club_id === managerClubId);
    }, [players, managerClubId]);

    const reserves = useMemo(() => {
        const onPitchIds = new Set(formationSlots.filter(p => p).map(p => p!.id));
        return squadPlayers.filter(p => !onPitchIds.has(p.id));
    }, [squadPlayers, formationSlots]);

    useEffect(() => {
        if (club?.tactics?.formation_slots) {
            const initialFormation = club.tactics.formation_slots.map(playerId => {
                return squadPlayers.find(p => p.id === playerId) || null;
            });
            // Ensure it's always 11 slots
            while (initialFormation.length < 11) {
                initialFormation.push(null);
            }
            setFormationSlots(initialFormation.slice(0, 11));
        } else if (club) {
            setFormationSlots(Array(11).fill(null));
        }
    }, [club, squadPlayers]);

    const handleDrop = useCallback((item: { id: string, from: 'squad' | 'pitch', originalIndex?: number }, targetIndex: number | null) => {
        const droppedPlayer = squadPlayers.find(p => p.id === item.id);
        if (!droppedPlayer) return;

        setFormationSlots(produce(draft => {
            // Find if the player is already on the pitch
            const existingPitchIndex = draft.findIndex(p => p?.id === droppedPlayer.id);

            // If dragging from pitch, remove from original slot
            if (item.from === 'pitch' && typeof item.originalIndex === 'number') {
                if (draft[item.originalIndex]?.id === droppedPlayer.id) {
                    draft[item.originalIndex] = null;
                }
            } else if (existingPitchIndex !== -1) {
                // If dragging from squad list but player is already on pitch, remove them
                draft[existingPitchIndex] = null;
            }

            // If dropping on pitch
            if (targetIndex !== null) {
                const playerInTargetSlot = draft[targetIndex];
                
                // If target slot is occupied, swap the player back to reserves
                // (a more complex implementation could swap them to the original dragged player's slot)
                if (playerInTargetSlot) {
                     const oldSlotIndex = draft.findIndex(p => p?.id === playerInTargetSlot.id);
                     if (oldSlotIndex !== -1 && item.from === 'pitch' && typeof item.originalIndex === 'number') {
                         draft[item.originalIndex] = playerInTargetSlot;
                     }
                }
                
                draft[targetIndex] = droppedPlayer;
            }
        }));
    }, [squadPlayers]);
    
    const autoAssign = () => {
        const sortedSquad = [...squadPlayers].sort((a,b) => b.current_ability - a.current_ability);
        const newFormation = Array(11).fill(null);
        // This is a very naive auto-assign. A better version would consider positions.
        for(let i=0; i<11 && i < sortedSquad.length; i++) {
            newFormation[i] = sortedSquad[i];
        }
        setFormationSlots(newFormation);
    };
    
    useEffect(() => {
        // Auto-save player positions when they change.
        if (club) {
            const playerIds = formationSlots.map(p => p?.id || null);
            // Prevent infinite loop by only updating if the IDs have actually changed.
            if (JSON.stringify(playerIds) !== JSON.stringify(club.tactics.formation_slots || [])) {
                const newTactics: TacticSettings = { ...club.tactics, formation_slots: playerIds };
                updateClubTactics(managerClubId, newTactics);
            }
        }
    }, [formationSlots, club, updateClubTactics, managerClubId]);

    if (!club) return <div>Loading...</div>;

    const playersWithIndices = formationSlots.map((p, i) => p ? { ...p, positionIndex: i } : null);

    return (
        <div className="animate-fade-in h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Tactics</h1>
                <p className="text-md text-text-secondary">Set up your team's formation and instructions.</p>
            </div>
            
            <div className="flex-grow flex gap-4 min-h-0">
                <div className="w-1/4 flex flex-col">
                    <SquadList players={reserves} onDrop={handleDrop} />
                </div>
                <div className="w-3/4 flex flex-col gap-4">
                    <FormationPitch 
                        formation={playersWithIndices}
                        formationShape={club.tactics.formation}
                        onDrop={handleDrop}
                    />
                    <TacticalInstructions tactics={club.tactics} onAutoAssign={autoAssign} />
                </div>
            </div>
        </div>
    );
};

export default Tactics;