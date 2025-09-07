import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Player, Club, Staff, GameDate, LeagueTableRow, InboxMessage, Guild, GuildAction, ScoutingAssignment, Fixture } from '../types';
import { generateInitialWorld } from '../services/worldGenerator';
import { CLUBS } from '../data/clubs';
import { GUILDS } from '../data/guilds';
import { INITIAL_MESSAGES } from '../data/inbox';
import { generateLeagueFixtures } from '../data/league';
import LoadingScreen from '../components/LoadingScreen';
import { generateBoardWelcomeMessage } from '../services/newsGenerator';


export enum GameState {
    LOADING,
    LOGIN,
    CLUB_SELECTION,
    RUNNING,
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
    startGame: (name: string, seed: number) => void;
    setManagerClub: (clubId: string) => void;
    advanceDay: () => void;
    findClubById: (id: string) => Club | undefined;
    updatePlayer: (updatedPlayer: Player) => void;
    markMessageAsRead: (messageId: string) => void;
    handleGuildAction: (guildId: string, action: GuildAction) => void;
    startScoutingPlayer: (playerId: string) => void;
    updatePlayerTactics: (playerId: string, x: number, y: number) => void;
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
    const [clubs] = useState<Club[]>(CLUBS);
    const [managerName, setManagerName] = useState('');
    const [managerClubId, setManagerClubId] = useState('');
    const [gameDate, setGameDate] = useState<GameDate>({ season: 1, day: 1 });
    const [leagueTable, setLeagueTable] = useState<LeagueTableRow[]>([]);
    const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES);
    const [guilds, setGuilds] = useState<Guild[]>(GUILDS);
    const [scoutingAssignments, setScoutingAssignments] = useState<ScoutingAssignment[]>([]);
    const [fixtures, setFixtures] = useState<Fixture[]>([]);

    useEffect(() => {
        let workerUrl: string;

        const initWorker = async () => {
            try {
                const response = await fetch('/src/worker/simulation.bundle.worker.ts');
                if (!response.ok) {
                    throw new Error(`Failed to fetch worker script: ${response.statusText}`);
                }
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
                        if (payload.leagueTable && payload.leagueTable.length > 0) {
                            setLeagueTable(payload.leagueTable);
                        }
                        setInboxMessages(prev => [...payload.newMessages, ...prev]);
                        setScoutingAssignments(payload.scoutingAssignments);
                        setGameDate(payload.gameDate);
                        setIsProcessing(false);
                    }
                };

                 simWorker.onerror = (error) => {
                    console.error("Error from worker:", error.message, "at", error.filename, ":", error.lineno);
                    setIsProcessing(false); // Stop processing on error
                };

            } catch (error) {
                console.error("Failed to initialize worker:", error);
            }
        };

        initWorker();

        return () => {
            worker?.terminate();
            if (workerUrl) {
                URL.revokeObjectURL(workerUrl);
            }
        };
    }, []);

    const startGame = (name: string, seed: number) => {
        setGameState(GameState.LOADING);
        setManagerName(name);
        // Generate world on main thread for simplicity and immediate feedback
        const { players, staff } = generateInitialWorld(seed);
        const fixtures = generateLeagueFixtures(CLUBS);
        setPlayers(players);
        setStaff(staff);
        setFixtures(fixtures);
        const initialTable = CLUBS.map((club, index) => ({
            pos: index + 1, club_id: club.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [],
        }));
        setLeagueTable(initialTable);
        setGameState(GameState.CLUB_SELECTION);
    };

    const setManagerClub = (clubId: string) => {
        setManagerClubId(clubId);
        const club = findClubById(clubId);
        if (club) {
            setInboxMessages(prev => [generateBoardWelcomeMessage(club, gameDate), ...prev]);
        }
        setGameState(GameState.RUNNING);
    };
    
    const advanceDay = () => {
        if (isProcessing || !workerReady) return;
        setIsProcessing(true);
        worker?.postMessage({ type: 'ADVANCE_DAY', payload: { players, clubs, gameDate, scoutingAssignments, fixtures, leagueTable } });
    };

    const findClubById = useCallback((id: string) => clubs.find(c => c.id === id), [clubs]);

    const updatePlayer = (updatedPlayer: Player) => {
        setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    };

    const markMessageAsRead = (messageId: string) => {
        setInboxMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg));
    };
    
    const handleGuildAction = (guildId: string, action: GuildAction) => {
        setGuilds(prev => prev.map(g => g.id === guildId ? { ...g, reputation: g.reputation + action.reputationChange } : g));
        setInboxMessages(prev => prev.filter(msg => !(msg.guildId === guildId && msg.actions)));
    };

    const startScoutingPlayer = (playerId: string) => {
        if (scoutingAssignments.some(a => a.playerId === playerId)) return;
        setScoutingAssignments(prev => [...prev, { playerId, daysRemaining: 14 }]);
    };
    
    const updatePlayerTactics = (playerId: string, x: number, y: number) => {
        setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, x, y } : p));
    };

    const sortedInbox = useMemo(() => {
      return [...inboxMessages].sort((a, b) => {
          const dayA = parseInt(a.date.split('Day ')[1], 10);
          const dayB = parseInt(b.date.split('Day ')[1], 10);
          return dayB - dayA;
      });
    }, [inboxMessages]);

    const renderContent = () => {
        if (gameState === GameState.LOADING || (gameState > GameState.LOGIN && !players.length)) {
             return <LoadingScreen />;
        }
        return children;
    }

    return (
        <WorldContext.Provider value={{
            gameState, players, clubs, staff, managerName, managerClubId, gameDate,
            leagueTable, inboxMessages: sortedInbox, guilds, scoutingAssignments, fixtures, isProcessing, workerReady,
            startGame, setManagerClub, advanceDay, findClubById, updatePlayer,
            markMessageAsRead, handleGuildAction, startScoutingPlayer, updatePlayerTactics
        }}>
            {renderContent()}
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