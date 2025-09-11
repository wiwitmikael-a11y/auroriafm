import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Player, Club, Staff, Fixture, LeagueTableRow, MatchResult, GameDate, InboxMessage, LiveMatch, Guild, GuildAction, TacticSettings, ScoutingAssignment } from '../types';
import { INITIAL_MESSAGES } from '../data/inbox';
import { GUILDS } from '../data/guilds';
import { proceduralService } from '../services/proceduralService';
import { produce } from 'immer';
import { newsGenerator } from '../services/newsGenerator';

interface WorldState {
    gameState: 'login' | 'generating' | 'club_selection' | 'playing';
    worldReady: boolean;
    isProcessing: boolean;
    workerReady: boolean;
    managerName: string;
    managerSeed: number;
    managerClubId: string;
    gameDate: GameDate;
    players: Player[];
    clubs: Club[];
    staff: Staff[];
    fixtures: Fixture[];
    leagueTable: LeagueTableRow[];
    matchResults: MatchResult[];
    inboxMessages: InboxMessage[];
    liveMatch: LiveMatch | null;
    guilds: Guild[];
    scoutingAssignments: ScoutingAssignment[];
}

interface WorldContextProps extends WorldState {
    startGame: (name: string, seed: number) => void;
    finishWorldGeneration: (data: { players: Player[], staff: Staff[], clubs: Club[], fixtures: Fixture[] }) => void;
    setManagerClub: (clubId: string) => void;
    advanceDay: () => void;
    findClubById: (id: string | null | undefined) => Club | undefined;
    updatePlayer: (updatedPlayer: Player) => void;
    markMessageAsRead: (messageId: string) => void;
    handleGuildAction: (guildId: string, action: GuildAction) => void;
    updateClubTactics: (clubId: string, tactics: TacticSettings) => void;
    finishLiveMatch: (result: MatchResult) => void;
}

const WorldContext = createContext<WorldContextProps | undefined>(undefined);

const initialGameDate: GameDate = { season: 1, day: 1 };

export const WorldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WorldState>({
        gameState: 'login',
        worldReady: false,
        isProcessing: false,
        workerReady: false,
        managerName: '',
        managerSeed: 0,
        managerClubId: '',
        gameDate: initialGameDate,
        players: [],
        clubs: [],
        staff: [],
        fixtures: [],
        leagueTable: [],
        matchResults: [],
        inboxMessages: INITIAL_MESSAGES,
        liveMatch: null,
        guilds: GUILDS,
        scoutingAssignments: [],
    });

    const simWorker = useRef<Worker | null>(null);
    const workerUrlRef = useRef<string | null>(null);
    
    useEffect(() => {
        const initWorker = async () => {
            try {
                const response = await fetch('/src/worker/simulation.bundle.worker.ts');
                if (!response.ok) throw new Error(`Failed to fetch worker script: ${response.status}`);
                const workerCode = await response.text();
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                const workerUrl = URL.createObjectURL(blob);
                workerUrlRef.current = workerUrl;
                
                simWorker.current = new Worker(workerUrl, { type: 'module' });
                
                simWorker.current.onmessage = (e) => {
                    const { type, payload } = e.data;
                    if (type === 'READY') {
                        setState(s => ({ ...s, workerReady: true }));
                    } else if (type === 'WORLD_GENERATED') {
                        // Simpan dunia ke DB di main thread setelah diterima dari worker
                        fetch('/api/saveWorld', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...payload, seed: state.managerSeed })
                        }).catch(error => console.error("Failed to save world:", error));
                        
                        finishWorldGeneration(payload);

                    } else if (type === 'ADVANCE_DAY_RESULT') {
                        setState(s => produce(s, draft => {
                            draft.gameDate = payload.gameDate;
                            draft.players = payload.players;
                            draft.leagueTable = payload.leagueTable;
                            draft.inboxMessages.unshift(...payload.newMessages);
                            draft.scoutingAssignments = payload.scoutingAssignments;
                            draft.isProcessing = false;
                            
                            const managerFixture = draft.fixtures.find(f => f.day === draft.gameDate.day && (f.home_team_id === draft.managerClubId || f.away_team_id === draft.managerClubId));
                            if (managerFixture) {
                                draft.liveMatch = { day: managerFixture.day, home_team_id: managerFixture.home_team_id, away_team_id: managerFixture.away_team_id };
                            }
                        }));
                    }
                };
            } catch (error) {
                console.error("Worker initialization failed:", error);
            }
        };
        
        initWorker();

        return () => {
            simWorker.current?.terminate();
            if (workerUrlRef.current) URL.revokeObjectURL(workerUrlRef.current);
        };
    }, [state.managerSeed]); // state.managerSeed ditambahkan agar bisa diakses di onmessage

    const startGame = useCallback((name: string, seed: number) => {
        setState(s => ({ ...s, gameState: 'generating', managerName: name, managerSeed: seed }));
        
        // Cek dulu apakah dunia ada di DB
        fetch(`/api/getWorld?seed=${seed}`)
            .then(res => {
                if (res.ok) return res.json();
                if (res.status === 404) return Promise.reject('Not found');
                return Promise.reject('API error');
            })
            .then(data => {
                // Dunia ditemukan, muat langsung
                finishWorldGeneration(data.world);
            })
            .catch(() => {
                // Dunia tidak ditemukan atau error, buat baru via worker
                if (simWorker.current) {
                    simWorker.current.postMessage({
                        type: 'GENERATE_WORLD',
                        payload: { seed }
                    });
                }
            });
    }, []);

    const finishWorldGeneration = (data: { players: Player[], staff: Staff[], clubs: Club[], fixtures: Fixture[] }) => {
        const table = data.clubs.map((club, i) => ({ club_id: club.id, pos: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));
        setState(s => ({ ...s, ...data, leagueTable: table, gameState: 'club_selection', worldReady: true }));
    };

    const setManagerClub = (clubId: string) => {
        setState(s => produce(s, draft => {
            const club = draft.clubs.find(c => c.id === clubId);
            if (!club) return;

            const asstMan = draft.staff.find(s => s.club_id === clubId && s.role === 'Assistant Manager');
            const asstManName = asstMan?.name || 'Your Assistant';

            const welcomeAsst = newsGenerator.generateWelcomeMessage(club, asstManName, draft.gameDate);
            const welcomeBoard = newsGenerator.generateBoardWelcomeMessage(club, draft.gameDate);
            
            draft.managerClubId = clubId;
            draft.gameState = 'playing';
            draft.inboxMessages.unshift(welcomeAsst, welcomeBoard);
        }));
    };
    
    const advanceDay = useCallback(() => {
        if (!simWorker.current || state.isProcessing) return;
        
        setState(s => ({ ...s, isProcessing: true }));

        const club = state.clubs.find(c => c.id === state.managerClubId);
        if (club && Math.random() < 0.2) {
             const guild = state.guilds[Math.floor(Math.random() * state.guilds.length)];
             const scenario = proceduralService.generateGuildScenario(guild, club);
             if (scenario) {
                 const newMessage: InboxMessage = {
                     id: `msg_guild_${guild.id}_${state.gameDate.day}`,
                     type: 'Guild', sender: guild.name, subject: scenario.subject,
                     date: `Season ${state.gameDate.season}, Day ${state.gameDate.day}`,
                     body: scenario.body, isRead: false, actions: scenario.actions, guildId: guild.id
                 };
                 setState(s => produce(s, draft => { draft.inboxMessages.unshift(newMessage); }));
             }
        }
        
        simWorker.current.postMessage({
            type: 'ADVANCE_DAY',
            payload: {
                players: state.players, clubs: state.clubs, gameDate: state.gameDate,
                scoutingAssignments: state.scoutingAssignments, fixtures: state.fixtures, leagueTable: state.leagueTable
            }
        });
    }, [state.isProcessing, state.players, state.clubs, state.gameDate, state.scoutingAssignments, state.fixtures, state.leagueTable, state.managerClubId, state.guilds]);

    const findClubById = (id: string | null | undefined) => state.clubs.find(c => c.id === id);
    
    const updatePlayer = useCallback((updatedPlayer: Player) => {
        setState(s => produce(s, draft => {
            const index = draft.players.findIndex(p => p.id === updatedPlayer.id);
            if (index !== -1) draft.players[index] = updatedPlayer;
        }));
    }, []);
    
    const markMessageAsRead = useCallback((messageId: string) => {
        setState(s => produce(s, draft => {
            const message = draft.inboxMessages.find(m => m.id === messageId);
            if(message) message.isRead = true;
        }));
    }, []);
    
    const handleGuildAction = useCallback((guildId: string, action: GuildAction) => {
        setState(s => produce(s, draft => {
            const guild = draft.guilds.find(g => g.id === guildId);
            if(guild) guild.reputation += action.reputationChange;
            const message = draft.inboxMessages.find(m => m.guildId === guildId && m.actions);
            if (message) {
                message.body += `\n\n[You chose: ${action.label}]\n${action.description}`;
                delete message.actions;
                delete message.guildId;
            }
        }));
    }, []);
    
    const updateClubTactics = useCallback((clubId: string, tactics: TacticSettings) => {
         setState(s => produce(s, draft => {
            const club = draft.clubs.find(c => c.id === clubId);
            if(club) club.tactics = tactics;
        }));
    }, []);
    
    const finishLiveMatch = useCallback((result: MatchResult) => {
        setState(s => produce(s, draft => {
            draft.liveMatch = null;
            draft.matchResults.push(result);
        }));
    }, []);

    return (
        <WorldContext.Provider value={{ ...state, startGame, finishWorldGeneration, setManagerClub, advanceDay, findClubById, updatePlayer, markMessageAsRead, handleGuildAction, updateClubTactics, finishLiveMatch }}>
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