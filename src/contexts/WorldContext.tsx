import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Player, Club, Staff, GameDate, InboxMessage, LeagueTableRow, Guild, TacticalPlayer, Fixture, MatchResult, GuildAction } from '../types';
import { generateInitialWorld } from '../services/worldGenerator';
import { CLUBS } from '../data/clubs';
import { INITIAL_MESSAGES } from '../data/inbox';
import { GUILDS } from '../data/guilds';
import { generateFixtures } from '../data/league';
import { matchSimulator } from '../engine/matchSimulator';
import { generateMatchReportMessage, generateYouthIntakeMessage, generateSeasonEndMessage, generateBoardWelcomeMessage } from '../services/newsGenerator';
import { ACC } from '../engine/ACC';

const SEASON_LENGTH = 330; // Number of days in a season

interface WorldContextType {
  loading: boolean;
  gameLoaded: boolean;
  isClubChosen: boolean;
  players: TacticalPlayer[];
  staff: Staff[];
  clubs: Club[];
  gameDate: GameDate;
  managerClubId: string | null;
  inboxMessages: InboxMessage[];
  leagueTable: LeagueTableRow[];
  guilds: Guild[];
  fixtures: Fixture[];
  advanceDay: () => void;
  updatePlayer: (player: Player) => void;
  updatePlayerTactics: (playerId: string, x: number, y: number) => void;
  findClubById: (id: string | null) => Club | undefined;
  markMessageAsRead: (id: string) => void;
  handleGuildAction: (guildId: string, action: GuildAction) => void;
  startGame: (managerName: string, seed: number) => void;
  setManagerClub: (clubId: string) => void;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export const WorldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);
  const [isClubChosen, setIsClubChosen] = useState<boolean>(false);
  const [players, setPlayers] = useState<TacticalPlayer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [clubs, setClubs] = useState<Club[]>(CLUBS);
  const [guilds, setGuilds] = useState<Guild[]>(GUILDS);
  const [gameDate, setGameDate] = useState<GameDate>({ season: 1, day: 1 });
  const [managerClubId, setManagerClubId] = useState<string | null>(null);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES);
  const [leagueTable, setLeagueTable] = useState<LeagueTableRow[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  const setManagerClub = useCallback((clubId: string) => {
    setManagerClubId(clubId);
    const club = CLUBS.find(c => c.id === clubId);
    if (club) {
        const welcomeMessage = generateBoardWelcomeMessage(club, {season: 1, day: 1});
        setInboxMessages(prev => [welcomeMessage, ...prev]);
    }
    setIsClubChosen(true);
  }, []);

  const updateLeagueTable = useCallback((result: MatchResult) => {
    setLeagueTable(prev => {
      const newTable = JSON.parse(JSON.stringify(prev)); // Deep copy
      const homeTeamRow = newTable.find((r: LeagueTableRow) => r.club_id === result.home_team_id);
      const awayTeamRow = newTable.find((r: LeagueTableRow) => r.club_id === result.away_team_id);

      if (!homeTeamRow || !awayTeamRow) return prev;

      homeTeamRow.p++; awayTeamRow.p++;
      homeTeamRow.gf += result.home_score; homeTeamRow.ga += result.away_score;
      awayTeamRow.gf += result.away_score; awayTeamRow.ga += result.home_score;
      homeTeamRow.gd = homeTeamRow.gf - homeTeamRow.ga;
      awayTeamRow.gd = awayTeamRow.gf - awayTeamRow.ga;

      if (result.home_score > result.away_score) { homeTeamRow.w++; homeTeamRow.pts += 3; awayTeamRow.l++; } 
      else if (result.away_score > result.home_score) { awayTeamRow.w++; awayTeamRow.pts += 3; homeTeamRow.l++; }
      else { homeTeamRow.d++; homeTeamRow.pts++; awayTeamRow.d++; awayTeamRow.pts++; }
      
      return newTable.sort((a: LeagueTableRow, b: LeagueTableRow) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf).map((row: LeagueTableRow, i: number) => ({...row, pos: i + 1}));
    });
  }, []);

  const startGame = useCallback((managerName: string, seed: number) => {
    console.log(`Starting game for manager: ${managerName} with seed: ${seed}`);
    setLoading(true);
    setTimeout(() => {
        const { players: newPlayers, staff: newStaff } = generateInitialWorld(seed);
        setPlayers(newPlayers.map(p => ({...p, x: 50, y: 50})));
        setStaff(newStaff);
        setLeagueTable(CLUBS.map((club, i) => ({ pos: i + 1, club_id: club.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] })));
        setFixtures(generateFixtures(CLUBS.map(c => c.id)));
        setGameLoaded(true);
        setLoading(false);
    }, 1000);
  }, []);
  
  const advanceDay = useCallback(() => {
    setGameDate(prevDate => {
      let newDay = prevDate.day + 1;
      let newSeason = prevDate.season;

      if (newDay > SEASON_LENGTH) {
          setInboxMessages(prev => [generateSeasonEndMessage(prevDate), ...prev]);
          setLeagueTable(CLUBS.map((c, i) => ({ pos: i + 1, club_id: c.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] })));
          setFixtures(generateFixtures(CLUBS.map(c => c.id)));
          newDay = 1;
          newSeason += 1;
      }

      const newDate = { season: newSeason, day: newDay };
      const todaysFixtures = fixtures.filter(f => f.day === newDay);

      if (todaysFixtures.length > 0) {
        const matchMessages: InboxMessage[] = [];
        todaysFixtures.forEach(fixture => {
          const result = matchSimulator.run(fixture.home_team_id, fixture.away_team_id, players, clubs);
          updateLeagueTable(result);
          matchMessages.push(generateMatchReportMessage(result, clubs, newDate));
        });
        setInboxMessages(prev => [...matchMessages, ...prev]);
      }

      const club = clubs.find(c => c.id === managerClubId);
      if(club && newDay === club.youthIntakeDay) {
        const newYouth = Array.from({length: 5}, () => ACC.generatePlayer(club.id, club.nation_id, true));
        setPlayers(prev => [...prev, ...newYouth.map(p => ({...p, x: 50, y: 50}))]);
        setInboxMessages(prev => [generateYouthIntakeMessage(club, newYouth, newDate), ...prev]);
      }
      
      // Random event: Morale change
      if (ACC.prng.seededRandom() < 0.1) {
          setPlayers(prev => {
              const playerToUpdate = ACC.prng.getRandom(prev.filter(p => p.club_id === managerClubId));
              if (playerToUpdate) {
                  // FIX: Use 'as const' to ensure TypeScript infers a literal type compatible with the Morale type.
                  const newMorale = ACC.prng.getRandom(['Good', 'Fair', 'Poor'] as const);
                  return prev.map(p => p.id === playerToUpdate.id ? {...p, morale: newMorale} : p);
              }
              return prev;
          });
      }

      return newDate;
    });
  }, [fixtures, players, clubs, managerClubId, updateLeagueTable]);

  const updatePlayer = useCallback((updatedPlayer: Player) => { setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? {...p, ...updatedPlayer} : p)); }, []);
  const updatePlayerTactics = useCallback((playerId: string, x: number, y: number) => { setPlayers(prev => prev.map(p => p.id === playerId ? {...p, x, y} : p)); }, []);
  const findClubById = useCallback((id: string | null) => clubs.find(c => c.id === id), [clubs]);
  const markMessageAsRead = useCallback((id: string) => { setInboxMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg)); }, []);

  const handleGuildAction = useCallback((guildId: string, action: GuildAction) => {
    setGuilds(prev => prev.map(g => g.id === guildId ? { ...g, reputation: g.reputation + action.reputationChange } : g));
    setInboxMessages(prev => prev.map(msg => msg.guildId === guildId && msg.actions ? { ...msg, actions: undefined, isRead: true } : msg));
  }, []);

  const value = { loading, gameLoaded, isClubChosen, players, staff, clubs, gameDate, managerClubId, inboxMessages, leagueTable, guilds, fixtures, advanceDay, updatePlayer, updatePlayerTactics, findClubById, markMessageAsRead, handleGuildAction, startGame, setManagerClub };

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
};

export const useWorld = () => {
  const context = useContext(WorldContext);
  if (context === undefined) throw new Error('useWorld must be used within a WorldProvider');
  return context;
};