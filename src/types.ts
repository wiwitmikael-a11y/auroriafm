// src/types.ts

// --- Basic Types ---
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legend';
export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type Foot = 'Left' | 'Right' | 'Both';
export type Morale = 'Very High' | 'High' | 'Good' | 'Fair' | 'Poor' | 'Low';
export type Personality = 'Ambitious' | 'Loyal' | 'Professional' | 'Temperamental';
export type SquadStatus = 'Starter' | 'Rotation' | 'Prospect' | 'Surplus';
export type FinanceStatus = 'Rich' | 'Secure' | 'Okay' | 'Insecure' | 'Bankrupt';
export type FormationShape = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';
export type TacticMentality = 'Very Defensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'Very Attacking';

// --- Player & Staff ---
export interface Name {
  first: string;
  last: string;
  alias?: string;
}

export interface PlayerAttributes {
  // Physical
  speed: number;
  stamina: number;
  strength: number;
  aggression: number;
  injury_proneness: number;
  // Technical
  shooting: number;
  dribbling: number;
  passing: number;
  tackling: number;
  // Mental
  composure: number;
  vision: number;
  consistency: number;
  important_matches: number;
  // Magical
  arcane_dribble: number;
  elemental_shot: number;
  temporal_flux: number;
}

export interface PlayerHistoryEntry {
  season: number;
  club_id: string;
  appearances: number;
  goals: number;
  assists: number;
  cards: number;
}

export interface TrainingFocus {
  type: 'Attribute Group' | 'Individual Attribute';
  value: 'Physical' | 'Technical' | 'Mental' | 'Magical' | keyof PlayerAttributes;
}

export interface Player {
  id: string;
  name: Name;
  club_id: string;
  nation_id: string;
  age: number;
  position: Position;
  playstyle_id: string;
  rarity: Rarity;
  personality: Personality;
  current_ability: number;
  potential_ability: number;
  attributes: PlayerAttributes;
  traits: string[];
  squad_status: SquadStatus;
  value: number;
  morale: Morale;
  preferred_foot: Foot;
  history: PlayerHistoryEntry[];
  scouting_knowledge: number; // 0-100
  training_focus: TrainingFocus | null;
  positionIndex?: number | null; // For tactics screen
  lore?: string;
}

export interface CoachAttributes {
  attacking: number;
  defending: number;
  technical: number;
  tactical: number;
  mental: number;
  working_with_youth: number;
}

export interface ScoutAttributes {
  judging_ability: number;
  judging_potential: number;
  adaptability: number;
}

export interface PhysioAttributes {
  physiotherapy: number;
  prevention: number;
}

export type StaffRole = 'Assistant Manager' | 'Head of Youth Development' | 'Chief Scout' | 'Physio' | 'Coach';

export interface Staff {
  id: string;
  name: string;
  club_id: string;
  nation_id: string;
  age: number;
  role: StaffRole;
  attributes: CoachAttributes | ScoutAttributes | PhysioAttributes;
}

// --- Club & Competition ---
export interface TacticSettings {
  mentality: TacticMentality;
  pressing_intensity: number; // 1-5
  defensive_line_height: number; // 1-5
  formation: FormationShape;
}

export interface Club {
  id: string;
  name: string;
  short_name: string;
  nickname: string;
  nation_id: string;
  palette: [string, string];
  stadium: string;
  finances: FinanceStatus;
  crest_tags: string;
  lore_tags: { [key: string]: number };
  transfer_budget: number;
  wage_budget: number;
  training_facilities: number; // 1-5
  youth_facilities: number; // 1-5
  staff_ids: string[];
  tactics: TacticSettings;
  rival_club_ids: string[];
  youthIntakeDay: number;
  sponsor_deals: SponsorDeal[];
}

export interface LeagueTableRow {
  pos: number;
  club_id: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Fixture {
    day: number;
    home_team_id: string;
    away_team_id: string;
}

export interface MatchEvent {
    minute: number;
    type: 'Goal' | 'Chance' | 'Card' | 'Sub' | 'Commentary';
    team: 'home' | 'away' | 'none';
    player?: string;
    description: string;
}

export interface MatchResult {
    day: number;
    home_team_id: string;
    away_team_id: string;
    home_score: number;
    away_score: number;
    events: MatchEvent[];
}

export interface LiveMatch extends Fixture {
    home_score: number;
    away_score: number;
    events: MatchEvent[];
    time: number;
}

// --- World & Game ---
export interface GameDate {
  season: number;
  day: number;
}

export interface GuildAction {
    label: string;
    description: string;
    reputationChange: number;
}

export interface InboxMessage {
    id: string;
    type: 'System' | 'Scouting' | 'Guild' | 'Staff' | 'Board' | 'Assistant' | 'Media' | 'Youth';
    sender: string;
    subject: string;
    date: string;
    body: string;
    isRead: boolean;
    guildId?: string;
    actions?: GuildAction[];
}

export interface Guild {
    id: string;
    name: string;
    description: string;
    ethos: string[];
    icon_tags: string;
    palette: string[];
    reputation: number;
    effects: {
        positive: string;
        negative: string;
    };
    scenarioTemplates: {
        minRep?: number;
        maxRep?: number;
        subject: string;
        body: string;
        actions: GuildAction[];
    }[];
}

export interface Nation {
  id: string;
  name: string;
  adjective: string;
  name_templates: {
    first: string[];
    last: string[];
  };
  attribute_biases?: Partial<PlayerAttributes>;
}

export interface ScoutingAssignment {
  playerId: string;
  daysRemaining: number;
}

export interface PlayerRole {
    name: string;
    description: string;
    position: Position[];
    key_attributes: (keyof PlayerAttributes)[];
}

export interface Sponsor {
    id: string;
    name: string;
    slogan: string;
    tier: 'Global' | 'Primary' | 'Secondary' | 'Partner';
    base_value: number;
}

export interface SponsorDeal {
    sponsorId: string;
    weekly_income: number;
    season: number;
    expires_day: number;
}

export interface Playstyle {
    id: string;
    name: string;
    description: string;
    effects: { [key in keyof PlayerAttributes]?: number };
}

export interface CommentaryContext {
    type: 'Kickoff' | 'Goal' | 'Chance' | 'Card' | 'General' | 'FullTime';
    minute: number;
    homeTeam: Club;
    awayTeam: Club;
    homeScore: number;
    awayScore: number;
    actingTeam: 'home' | 'away';
    player?: Player;
}

export interface CharacterAsset {
    zIndex: number;
    tags: string[];
    data: string;
}

export type CharacterAssetLibrary = {
    [key: string]: CharacterAsset;
};

export interface CulturalBlueprint {
    name: string;
    aesthetic_philosophy: {
        primary_shapes: string[];
        secondary_patterns: string[];
        color_psychology: {
            primary: string;
            secondary: string;
        };
        symbol_library_tags: string[];
    };
    tactical_philosophy: {
        preferred_formations: FormationShape[];
        mentality_bias: { [key in TacticMentality]?: number };
        key_player_archetypes: string[];
    };
    social_structure: {
        player_archetype_distribution: { [key: string]: number };
        common_personalities: Personality[];
    };
}
