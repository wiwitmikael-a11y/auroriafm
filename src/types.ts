export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legend';
export type Morale = 'Low' | 'Fair' | 'Good' | 'High' | 'Very High' | 'Poor';
export type PreferredFoot = 'Right' | 'Left';
export type SquadStatus = 'Star Player' | 'First Team' | 'Rotation' | 'Backup' | 'Youth';
export type TeamTrainingFocus = 'Balanced' | 'Attacking' | 'Defending' | 'Possession' | 'Physical' | 'Magicka';

export interface Name {
    first: string;
    last: string;
    alias?: string;
}

export interface Contract {
    wage: number;
    expiry_season: number;
    release_clause?: number;
}

export interface PlayerAttributes {
    shooting: number;
    dribbling: number;
    passing: number;
    tackling: number;
    composure: number;
    aggression: number;
    vision: number;
    speed: number;
    stamina: number;
    strength: number;
    arcane_dribble: number;
    elemental_shot: number;
    temporal_flux: number;
    consistency: number;
    important_matches: number;
    injury_proneness: number;
}

export type IndividualTrainingFocus = 'None' | keyof PlayerAttributes;

export interface PlayerPersonality {
    description: string;
    ambition: number;
    loyalty: number;
    professionalism: number;
    temperament: number;
    personalityId?: string; // Link to personality archetypes
}

export interface Injury {
    type: string;
    duration_days: number;
}

export interface PlayerHistory {
    season: number;
    club_id: string;
    appearances: number;
    goals: number;
}

export interface Player {
    id: string;
    club_id: string;
    name: Name;
    age: number;
    nation_id: string;
    position: Position;
    playstyle: string; // NEW: Procedurally generated archetype
    rarity: Rarity;
    value: number;
    contract: Contract;
    attributes: PlayerAttributes;
    current_ability: number;
    potential_ability: number;
    morale: Morale;
    personality: PlayerPersonality;
    injury_status: Injury | null;
    traits: string[];
    history: PlayerHistory[];
    individual_training_focus: IndividualTrainingFocus;
    squad_status: SquadStatus;
    preferred_foot: PreferredFoot;
    weak_foot_ability: 1 | 2 | 3 | 4 | 5;
    season_goals: number;
    season_appearances: number;
    international_caps: number;
    international_goals: number;
}

export interface TacticalPlayer extends Player {
    x: number; // percentage from left
    y: number; // percentage from top
    roleId?: string;
}

export type TacticMentality = 'Very Defensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'Very Attacking';
export type FormationShape = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';

export interface TacticSettings {
    mentality: TacticMentality;
    pressing_intensity: number;
    defensive_line_height: number;
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
    finances: 'Insecure' | 'Okay' | 'Secure' | 'Rich';
    crest_tags: string;
    transfer_budget: number;
    wage_budget: number;
    training_facilities: number;
    youth_facilities: number;
    staff_ids: string[]; // Will be populated dynamically
    tactics: TacticSettings;
    rival_club_ids: string[];
    youthIntakeDay: number; // Day of the season for youth intake
}

export interface Formation {
    name: string;
    players: TacticalPlayer[];
}

export interface GameDate {
    season: number;
    day: number;
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

export interface MatchResult extends Fixture {
    home_score: number;
    away_score: number;
    events: MatchEvent[];
}


export interface MatchEvent {
    minute: number;
    type: 'Commentary' | 'Chance' | 'Goal' | 'Card' | 'Sub';
    team: 'home' | 'away' | 'none';
    player?: string;
    description: string;
}

// New types for the offline narrative engine
export interface ScenarioAction {
    label: string;
    description: string;
    reputationChange: number;
    // Future extension: add other effects like money change, player morale change etc.
}

export interface ScenarioTemplate {
    minRep?: number; // Minimum reputation required to trigger
    maxRep?: number; // Maximum reputation
    subject: string;
    body: string; // Can contain placeholders like [PLAYER_NAME], [RIVAL_CLUB]
    actions: ScenarioAction[];
}

export interface Guild {
    id: string;
    name: string;
    description: string;
    ethos: string[];
    icon_tags: string;
    palette: [string, string, string] | string[];
    reputation: number; // Reputation is now a number from -100 to 100
    effects: {
        positive: string;
        negative: string;
    }
    scenarioTemplates: ScenarioTemplate[]; // Local templates for narrative generation
}

// Re-using GuildAction for Inbox messages to maintain consistency
export interface GuildAction extends ScenarioAction {}

export interface InboxMessage {
    id: string;
    type: 'System' | 'Scouting' | 'Guild' | 'Staff' | 'Transfer' | 'Media' | 'GuildRequest' | 'Youth' | 'Board';
    sender: string;
    subject: string;
    date: string;
    body: string;
    isRead: boolean;
    actions?: GuildAction[];
    guildId?: string;
}

export interface Nation {
    id: string;
    name: string;
    adjective: string;
    name_templates: {
        first: string[];
        last: string[];
    };
    attribute_biases: Partial<{[key in keyof PlayerAttributes]: number}>;
}

export type StaffRole = 'Head of Youth Development' | 'Chief Scout' | 'Coach' | 'Physio' | 'Assistant Manager';

export interface Staff {
    id: string;
    club_id: string;
    name: string;
    role: StaffRole;
    attributes: {
        [key: string]: number;
    };
}

export interface PlayerRole {
    name: string;
    description: string;
    position: Position[];
    key_attributes: (keyof PlayerAttributes)[];
}