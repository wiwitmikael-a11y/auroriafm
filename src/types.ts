// src/types.ts

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legend';
export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type SquadStatus = 'Starter' | 'Rotation' | 'Prospect' | 'Surplus';
export type Morale = 'Very High' | 'High' | 'Good' | 'Fair' | 'Poor' | 'Low';
export type Finances = 'Rich' | 'Secure' | 'Okay' | 'Insecure';
export type FormationShape = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';
export type StaffRole = 'Assistant Manager' | 'Head of Youth Development' | 'Chief Scout' | 'Physio' | 'Coach';


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

export interface CareerHistoryEntry {
    season: number;
    club_id: string;
    appearances: number;
    goals: number;
    assists: number;
    cards: number;
}

export interface Player {
    id: string;
    name: {
        first: string;
        last: string;
        alias?: string;
    };
    club_id: string;
    nation_id: string;
    age: number;
    position: Position;
    playstyle: string;
    rarity: Rarity;
    current_ability: number;
    potential_ability: number;
    attributes: PlayerAttributes;
    traits: string[];
    lore?: string;
    squad_status: SquadStatus;
    value: number;
    morale: Morale;
    preferred_foot: 'Left' | 'Right' | 'Both';
    history: CareerHistoryEntry[];
    scouting_knowledge: number; // 0-100
    // Tactical position, can be null if not set
    x?: number;
    y?: number;
    roleId?: string;
}

export interface TacticalPlayer extends Player {
    x: number;
    y: number;
}

export interface TacticSettings {
    mentality: 'Very Defensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'Very Attacking';
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
    finances: Finances;
    crest_tags: string;
    transfer_budget: number;
    wage_budget: number;
    training_facilities: number; // 1-5
    youth_facilities: number; // 1-5
    staff_ids: string[];
    tactics: TacticSettings;
    rival_club_ids: string[];
    youthIntakeDay: number;
}

export interface StaffAttributes {
    [key: string]: number;
}

export interface Staff {
    id: string;
    name: string;
    role: StaffRole;
    club_id: string;
    attributes: StaffAttributes;
}

export interface LeagueTableRow {
    pos: number;
    club_id: string;
    p: number; // Played
    w: number; // Won
    d: number; // Drawn
    l: number; // Lost
    gf: number; // Goals For
    ga: number; // Goals Against
    gd: number; // Goal Difference
    pts: number; // Points
    form: ('W' | 'D' | 'L')[];
}

export interface Nation {
    id: string;
    name: string;
    adjective: string;
    name_templates: {
        first: string[];
        last: string[];
    };
    attribute_biases: Partial<PlayerAttributes>;
}

export interface GuildAction {
    label: string;
    description: string;
    reputationChange: number;
}

export interface GuildScenarioTemplate {
    minRep?: number;
    maxRep?: number;
    subject: string;
    body: string;
    actions: GuildAction[];
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
    scenarioTemplates: GuildScenarioTemplate[];
}

export interface InboxMessage {
    id: string;
    type: 'System' | 'Scouting' | 'Guild' | 'Staff' | 'Board' | 'Media' | 'Youth';
    sender: string;
    subject: string;
    date: string;
    body: string;
    isRead: boolean;
    actions?: GuildAction[];
    guildId?: string;
}

export interface MatchEvent {
    minute: number;
    type: 'Goal' | 'Chance' | 'Card' | 'Sub' | 'Commentary';
    team: 'home' | 'away' | 'none';
    description: string;
    player?: string;
}

export interface MatchResult {
    day: number;
    home_team_id: string;
    away_team_id: string;
    home_score: number;
    away_score: number;
    events: MatchEvent[];
}

export interface Fixture {
    day: number;
    home_team_id: string;
    away_team_id: string;
}

export interface GameDate {
    season: number;
    day: number;
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
