// src/types.ts

export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type PreferredFoot = 'Left' | 'Right' | 'Both';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legend';
export type Morale = 'Very High' | 'High' | 'Good' | 'Fair' | 'Poor' | 'Low';
export type SquadStatus = 'First Team' | 'Rotation' | 'Prospect' | 'Transfer Listed';
export type Personality = 'Ambitious' | 'Loyal' | 'Professional' | 'Temperamental';

export interface PlayerAssetIds {
  body: string;
  head: string;
  hair: string;
  torso: string;
  legs: string;
  headwear?: string;
}

export interface PlayerAttributes {
    // Physical
    speed: number;
    stamina: number;
    strength: number;
    aggression: number;
    injury_proneness: number; // Lower is better
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
    name: {
        first: string;
        last: string;
        alias?: string;
    };
    club_id: string;
    nation_id: string;
    age: number;
    position: Position;
    playstyle_id: string;
    rarity: Rarity;
    personality: Personality;
    current_ability: number; // 1-200
    potential_ability: number; // 1-200
    attributes: PlayerAttributes;
    traits: string[];
    squad_status: SquadStatus;
    value: number;
    morale: Morale;
    preferred_foot: PreferredFoot;
    history: PlayerHistoryEntry[];
    scouting_knowledge: number; // 0-100%
    lore?: string;
    training_focus: TrainingFocus | null;
    positionIndex?: number | null;
    assetIds: PlayerAssetIds;
}

export interface Club {
    id: string;
    name: string;
    short_name: string;
    nickname: string;
    nation_id: string;
    palette: [string, string];
    stadium: string;
    finances: 'Rich' | 'Secure' | 'Okay' | 'Insecure';
    crest_tags: string;
    lore_tags: string[];
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

export interface Staff {
    id: string;
    name: string;
    club_id: string;
    nation_id: string;
    role: 'Manager' | 'Assistant Manager' | 'Coach' | 'Chief Scout' | 'Scout' | 'Physio' | 'Head of Youth Development';
    attributes: CoachAttributes | ScoutAttributes | PhysioAttributes;
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

export interface PlayerRole {
    name: string;
    description: string;
    position: Position[];
    key_attributes: (keyof PlayerAttributes)[];
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

export interface InboxMessage {
    id: string;
    type: 'System' | 'Board' | 'Assistant' | 'Staff' | 'Scouting' | 'Media' | 'Guild' | 'Youth';
    sender: string;
    subject: string;
    date: string; // "Season 1, Day 1"
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
    palette: [string, string, string];
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

export interface GuildAction {
    label: string;
    description: string;
    reputationChange: number;
}

export interface ScoutingAssignment {
    playerId: string;
    daysRemaining: number;
}

export interface Fixture {
    day: number;
    home_team_id: string;
    away_team_id: string;
}

export interface MatchEvent {
    minute: number;
    type: 'Commentary' | 'Chance' | 'Goal' | 'Card' | 'Sub';
    team: 'home' | 'away' | 'none';
    player?: string;
    description: string;
}

export interface MatchResult extends Fixture {
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

export type FormationShape = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';

export interface TacticSettings {
    mentality: 'Very Defensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'Very Attacking';
    pressing_intensity: number; // 1-5
    defensive_line_height: number; // 1-5
    formation: FormationShape;
}

export interface Playstyle {
    id: string;
    name: string;
    description: string;
    effects: Partial<Record<keyof PlayerAttributes, number>>;
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

export type CharacterAsset = {
    zIndex: number;
    tags: string[];
    data: string;
};

export type CharacterAssetLibrary = {
    [key: string]: CharacterAsset;
};