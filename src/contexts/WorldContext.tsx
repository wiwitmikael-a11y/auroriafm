import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Player, Club, Staff, GameDate, InboxMessage, LeagueTableRow, Guild, TacticalPlayer } from '../types';
import { generateInitialWorld } from '../services/worldGenerator';
import { CLUBS } from '../data/clubs';
import { INITIAL_MESSAGES } from '../data/inbox';
import { GUILDS } from '../data/guilds';
import { INITIAL_LEAGUE_TABLE } from '../data/league';

interface WorldContextType {
  loading: boolean;
  gameLoaded: boolean;
  players: TacticalPlayer[];
  staff: Staff[];
  clubs: Club[];
  gameDate: GameDate;
  managerClubId: string;
  inboxMessages: InboxMessage[];
  leagueTable: LeagueTableRow[];
  guilds: Guild[];
  advanceDay: () => void;
  updatePlayer: (player: Player) => void;
  updatePlayerTactics: (playerId: string, x: number, y: number) => void;
  findClubById: (id: string) => Club | undefined;
  markMessageAsRead: (id: string) => void;
  // FIX: Add startGame to the context type to be used by the Login screen.
  startGame: (managerName: string, seed: number) => void;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export const WorldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // FIX: Set initial loading to false to allow the Login screen to show.
  const [loading, setLoading] = useState<boolean>(false);
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);
  const [players, setPlayers] = useState<TacticalPlayer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [clubs, setClubs] = useState<Club[]>(CLUBS);
  const [guilds, setGuilds] = useState<Guild[]>(GUILDS);
  const [gameDate, setGameDate] = useState<GameDate>({ season: 1, day: 1 });
  const [managerClubId, setManagerClubId] = useState<string>('avalon_albion');
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES);
  const [leagueTable, setLeagueTable] = useState<LeagueTableRow[]>(INITIAL_LEAGUE_TABLE);

  // FIX: Removed the useEffect that automatically started the game. It is replaced by the `startGame` function.

  // FIX: Implement the startGame function to initialize the world.
  const startGame = useCallback((managerName: string, seed: number) => {
    console.log(`Starting game for manager: ${managerName} with seed: ${seed}`);
    setLoading(true);
    setTimeout(() => {
        const { players: newPlayers, staff: newStaff } = generateInitialWorld(seed);
        setPlayers(newPlayers.map(p => ({...p, x: 50, y: 50})));
        setStaff(newStaff);
        setGameLoaded(true);
        setLoading(false);
    }, 1000);
  }, []);
  
  const advanceDay = useCallback(() => {
    // This is where more complex logic would go (match sim, news gen, etc.)
    setGameDate(prev => {
        // Simple day increment for now, can be expanded to handle end of season.
        return { ...prev, day: prev.day + 1 };
    });
  }, []);

  const updatePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? {...p, ...updatedPlayer} : p));
  }, []);
  
  const updatePlayerTactics = useCallback((playerId: string, x: number, y: number) => {
      setPlayers(prev => prev.map(p => p.id === playerId ? {...p, x, y} : p));
  }, []);

  const findClubById = useCallback((id: string) => {
    return clubs.find(c => c.id === id);
  }, [clubs]);

  const markMessageAsRead = useCallback((id: string) => {
    setInboxMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg));
  }, []);

  const value = {
    loading,
    gameLoaded,
    players,
    staff,
    clubs,
    gameDate,
    managerClubId,
    inboxMessages,
    leagueTable,
    guilds,
    advanceDay,
    updatePlayer,
    updatePlayerTactics,
    findClubById,
    markMessageAsRead,
    // FIX: Provide startGame through the context.
    startGame,
  };

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
};

export const useWorld = () => {
  const context = useContext(WorldContext);
  if (context === undefined) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return context;
};
