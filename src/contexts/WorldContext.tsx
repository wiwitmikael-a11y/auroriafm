import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Player, Club, Staff, GameDate, LeagueTableRow, InboxMessage, Guild, GuildAction, ScoutingAssignment, Fixture, LiveMatch, MatchResult, TacticSettings } from '../types';
import { generateInitialWorld } from '../services/worldGenerator';
import { CLUBS } from '../data/clubs';
import { GUILDS } from '../data/guilds';
import { INITIAL_MESSAGES } from '../data/inbox';
import { generateLeagueFixtures } from '../data/league';
import { generateBoardWelcomeMessage, generateMatchReportMessage, generateAssistantWelcomeMessage } from '../services/newsGenerator';
import { ACC } from '../engine/ACC';


export enum GameState {
    LOGIN,
    LOADING,
    CLUB_SELECTION,
    RUNNING,
    LIVE_MATCH,
}

interface WorldData {
    players: Player[];
    staff: Staff[];
    clubs: Club[];
    fixtures: Fixture[];
}

interface WorldContextType {
    gameState: GameState;
    players: Player[];
    clubs: Club[];
    staff: Staff[];
    managerName: string;
    managerClubId: string;
    gameDate: GameDate;
    leagueTable: LeagueTableRow[];
    inboxMessages: InboxMessage[];
    guilds: Guild[];
    scoutingAssignments: ScoutingAssignment[];
    fixtures: Fixture[];
    isProcessing: boolean;
    workerReady: boolean;
    liveMatch: LiveMatch | null;
    startGame: (name: string, seed: number) => void;
    finishWorldGeneration: (worldData: WorldData) => void;
    setManagerClub: (clubId: string) => void;
    advanceDay: () => void;
    finishLiveMatch: (result: MatchResult) => void;
    findClubById: (id: string) => Club | undefined;
    updatePlayer: (updatedPlayer: Player) => void;
    updateClubTactics: (clubId: string, newTactics: Partial<TacticSettings>) => void;
    markMessageAsRead: (messageId: string) => void;
    handleGuildAction: (guildId: string, action: GuildAction) => void;
    startScoutingPlayer: (playerId: string) => void;
    updatePlayerFormation: (assignments: { playerId: string; positionIndex: number | null }[]) => void;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export const WorldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(GameState.LOGIN);
    const [worker, setWorker] = useState<Worker | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [workerReady, setWorkerReady] = useState(false);

    // Game Data State
    const [players, setPlayers] = useState<Player[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [clubs, setClubs] = useState<Club[]>(CLUBS);
    const [managerName, setManagerName] = useState('');
    const [managerSeed, setManagerSeed] = useState(0);
    const [managerClubId, setManagerClubId] = useState('');
    const [gameDate, setGameDate] = useState<GameDate>({ season: 1, day: 1 });
    const [leagueTable, setLeagueTable] = useState<LeagueTableRow[]>([]);
    const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES);
    const [guilds, setGuilds] = useState<Guild[]>(GUILDS);
    const [scoutingAssignments, setScoutingAssignments] = useState<ScoutingAssignment[]>([]);
    const [fixtures, setFixtures] = useState<Fixture[]>([]);
    const [liveMatch, setLiveMatch] = useState<LiveMatch | null>(null);

    useEffect(() => {
        let workerUrl: string;

        const initWorker = async () => {
            try {
                const response = await fetch('/src/worker/simulation.bundle.worker.ts');
                if (!response.ok) throw new Error(`Failed to fetch worker script: ${response.statusText}`);
                const workerScript = await response.text();
                const blob = new Blob([workerScript], { type: 'application/javascript' });
                workerUrl = URL.createObjectURL(blob);
                
                const simWorker = new Worker(workerUrl);
                setWorker(simWorker);

                simWorker.onmessage = (e) => {
                    const { type, payload } = e.data;
                    if (type === 'READY') {
                        setWorkerReady(true);
                    } else if (type === 'ADVANCE_DAY_RESULT') {
                        setPlayers(payload.players);
                        setInboxMessages(prev => [...payload.newMessages, ...prev]);
                        setScoutingAssignments(payload.scoutingAssignments);
                        setGameDate(payload.gameDate);
                        setLeagueTable(payload.leagueTable);
                        setIsProcessing(false);
                    }
                };

                 simWorker.onerror = (error) => {
                    console.error("Error from worker:", error.message, "at", error.filename, ":", error.lineno);
                    setIsProcessing(false);
                };

            } catch (error) {
                console.error("Failed to initialize worker:", error);
            }
        };

        initWorker();

        return () => {
            worker?.terminate();
            if (workerUrl) URL.revokeObjectURL(workerUrl);
        };
    }, []);

    const startGame = (name: string, seed: number) => {
        setManagerName(name);
        setManagerSeed(seed);
        setGameState(GameState.LOADING);
        ACC.initialize(seed); // Initialize main thread ACC
    };

    const finishWorldGeneration = (worldData: WorldData) => {
        setPlayers(worldData.players);
        setStaff(worldData.staff);
        setClubs(worldData.clubs);
        setFixtures(worldData.fixtures);
        const initialTable = worldData.clubs.map((club, index) => ({
            pos: index + 1, club_id: club.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [],
        }));
        setLeagueTable(initialTable);
        setGameState(GameState.CLUB_SELECTION);
    };

    const setManagerClub = (clubId: string) => {
        setManagerClubId(clubId);
        const club = findClubById(clubId);
        const assistant = staff.find(s => s.club_id === clubId && s.role === 'Assistant Manager');
        if (club) {
            setInboxMessages(prev => [
                generateAssistantWelcomeMessage(club, gameDate, managerName, assistant),
                generateBoardWelcomeMessage(club, gameDate), 
                ...prev
            ]);
        }
        setGameState(GameState.RUNNING);
    };
    
    const advanceDay = () => {
        if (isProcessing || !workerReady) return;
        
        const nextDay = gameDate.day + 1;
        const managersFixture = fixtures.find(f => f.day === nextDay && (f.home_team_id === managerClubId || f.away_team_id === managerClubId));

        if (managersFixture) {
            setLiveMatch({ ...managersFixture, home_score: 0, away_score: 0, events: [], time: 0 });
            setGameState(GameState.LIVE_MATCH);
        } else {
            setIsProcessing(true);
            worker?.postMessage({ type: 'ADVANCE_DAY', payload: { players, clubs, gameDate, scoutingAssignments, fixtures, leagueTable } });
        }
    };

    const finishLiveMatch = (result: MatchResult) => {
        // 1. Update League Table locally first for immediate UI feedback
        let updatedTable: LeagueTableRow[] = [];
        setLeagueTable(prev => {
            const newTable = JSON.parse(JSON.stringify(prev)); // Deep copy
            const homeIndex = newTable.findIndex((r: LeagueTableRow) => r.club_id === result.home_team_id);
            const awayIndex = newTable.findIndex((r: LeagueTableRow) => r.club_id === result.away_team_id);
            
            if (homeIndex > -1) {
                newTable[homeIndex].p++;
                newTable[homeIndex].gf += result.home_score;
                newTable[homeIndex].ga += result.away_score;
                newTable[homeIndex].gd = newTable[homeIndex].gf - newTable[homeIndex].ga;
            }
             if (awayIndex > -1) {
                newTable[awayIndex].p++;
                newTable[awayIndex].gf += result.away_score;
                newTable[awayIndex].ga += result.home_score;
                newTable[awayIndex].gd = newTable[awayIndex].gf - newTable[awayIndex].ga;
            }

            if (result.home_score > result.away_score) {
                if (homeIndex > -1) { newTable[homeIndex].pts += 3; newTable[homeIndex].w++; }
                if (awayIndex > -1) newTable[awayIndex].l++;
            } else if (result.away_score > result.home_score) {
                if (awayIndex > -1) { newTable[awayIndex].pts += 3; newTable[awayIndex].w++; }
                if (homeIndex > -1) newTable[homeIndex].l++;
            } else {
                if (homeIndex > -1) { newTable[homeIndex].pts += 1; newTable[homeIndex].d++; }
                if (awayIndex > -1) { newTable[awayIndex].pts += 1; newTable[awayIndex].d++; }
            }

            updatedTable = newTable.sort((a: LeagueTableRow,b: LeagueTableRow) => b.pts - a.pts || b.gd - a.gd).map((r: LeagueTableRow, i: number) => ({...r, pos: i + 1 }));
            return updatedTable;
        });

        // 2. Add match report to inbox
        setInboxMessages(prev => [generateMatchReportMessage(result, clubs, gameDate), ...prev]);

        // 3. Clear live match and return to main game
        setLiveMatch(null);
        setGameState(GameState.RUNNING);

        // 4. Trigger the next day's simulation in the worker with the updated table
        setIsProcessing(true);
        worker?.postMessage({ 
            type: 'ADVANCE_DAY', 
            payload: { 
                players, 
                clubs, 
                gameDate, // We advance from the match day
                scoutingAssignments, 
                fixtures, 
                leagueTable: updatedTable,
            } 
        });
    };

    const findClubById = useCallback((id: string) => clubs.find(c => c.id === id), [clubs]);

    const updatePlayer = (updatedPlayer: Player) => {
        setPlayers(prevPlayers => prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    };
    
    const updateClubTactics = (clubId: string, newTactics: Partial<TacticSettings>) => {
        setClubs(prevClubs => prevClubs.map(c => c.id === clubId ? { ...c, tactics: { ...c.tactics, ...newTactics } } : c));
    };

    const markMessageAsRead = (messageId: string) => {
        setInboxMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg));
    };

    const handleGuildAction = (guildId: string, action: GuildAction) => {
        // Update guild reputation
        setGuilds(prev => prev.map(g => g.id === guildId ? { ...g, reputation: g.reputation + action.reputationChange } : g));
        
        // Remove the message that contained the action
        setInboxMessages(prev => prev.filter(msg => msg.guildId !== guildId || !msg.actions));
    };

    const startScoutingPlayer = (playerId: string) => {
        if (scoutingAssignments.some(a => a.playerId === playerId)) return;
        setScoutingAssignments(prev => [...prev, { playerId, daysRemaining: 14 }]);
    };
    
    const updatePlayerFormation = useCallback((assignments: { playerId: string; positionIndex: number | null }[]) => {
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            assignments.forEach(({ playerId, positionIndex }) => {
                const playerIndex = newPlayers.findIndex(p => p.id === playerId);
                if (playerIndex !== -1) {
                    newPlayers[playerIndex] = { ...newPlayers[playerIndex], positionIndex };
                }
            });
            return newPlayers;
        });
    }, []);

    const value: WorldContextType = {
        gameState,
        players,
        clubs,
        staff,
        managerName,
        managerClubId,
        gameDate,
        leagueTable,
        inboxMessages,
        guilds,
        scoutingAssignments,
        fixtures,
        liveMatch,
        isProcessing,
        workerReady,
        startGame,
        finishWorldGeneration,
        setManagerClub,
        advanceDay,
        finishLiveMatch,
        findClubById,
        updatePlayer,
        updateClubTactics,
        markMessageAsRead,
        handleGuildAction,
        startScoutingPlayer,
        updatePlayerFormation,
    };

    // This exposes managerSeed to the LoadingScreen component only
    if (gameState === GameState.LOADING) {
        (value as any).managerSeed = managerSeed;
    }

    return (
        <WorldContext.Provider value={value}>
            {children}
        </WorldContext.Provider>
    );
};

export const useWorld = () => {
    const context = useContext(WorldContext);
    if (context === undefined) {
        throw new Error('useWorld must be used within a WorldProvider');
    }
    return context;
};