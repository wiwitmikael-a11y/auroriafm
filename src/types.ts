// src/types.ts

export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type Morale = 'Very High' | 'High' | 'Good' | 'Fair' | 'Poor' | 'Low';
export type SquadStatus = 'First Team' | 'Rotation' | 'Prospect' | 'Not Needed';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legend';
export type Personality = 'Loyal' | 'Ambitious' | 'Professional' | 'Temperamental';
export type FinanceStatus = 'Rich' | 'Secure' | 'Okay' | 'Insecure';
export type FormationShape = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';
export type TacticMentality = 'Very Defensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'Very Attacking';

export interface PlayerAttributes {
    speed: number;
    stamina: number;
    strength: number;
    aggression: number;
    injury_proneness: number;
    shooting: number;
    dribbling: number;
    passing: number;
    tackling: number;
    composure: number;
    vision: number;
    consistency: number;
    important_matches: number;
    arcane_dribble: number;
    elemental_shot: number;
    temporal_flux: number;
    [key: string]: number;
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
    current_ability: number;
    potential_ability: number;
    attributes: PlayerAttributes;
    traits: string[];
    squad_status: SquadStatus;
    value: number;
    morale: Morale;
    preferred_foot: 'Left' | 'Right' | 'Both';
    history: any[]; // Define more strictly if needed
    scouting_knowledge: number;
    training_focus: { type: string; value: string } | null;
    positionIndex?: number; // For tactics screen
}

export interface CoachAttributes {
    attacking?: number;
    defending?: number;
    technical?: number;
    tactical?: number;
    mental?: number;
    working_with_youth?: number;
    [key: string]: number | undefined;
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

export interface TacticSettings {
    formation: FormationShape;
    mentality: TacticMentality;
    pressing_intensity: number; // 1-5
    defensive_line_height: number; // 1-5
    formation_slots?: (string | null)[];
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
    lore_tags: string[];
    transfer_budget: number;
    wage_budget: number;
    training_facilities: number;
    youth_facilities: number;
    staff_ids: string[];
    tactics: TacticSettings;
    rival_club_ids: string[];
    youthIntakeDay: number;
    sponsor_deals: SponsorDeal[];
}

export interface Nation {
    id: string;
    name: string;
    adjective: string;
    name_templates: {
        first: string[];
        last: string[];
    };
    attribute_biases?: {
        [key in keyof PlayerAttributes]?: number;
    }
}

export interface LeagueTableRow {
    club_id: string;
    pos: number;
    p: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    gd: number;
    pts: number;
}

export interface GameDate {
    season: number;
    day: number;
}

export interface Fixture {
    day: number;
    home_team_id: string;
    away_team_id: string;
}

export interface MatchEvent {
    minute: number;
    type: 'Goal' | 'Chance' | 'Card' | 'Sub' | 'Commentary' | 'Kickoff' | 'FullTime' | 'General';
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

export interface LiveMatch {
    day: number;
    home_team_id: string;
    away_team_id: string;
}

export interface InboxMessage {
    id: string;
    type: 'Scouting' | 'Guild' | 'Staff' | 'Media' | 'Youth' | 'Transfer';
    sender: string;
    subject: string;
    date: string;
    body: string;
    isRead: boolean;
    actions?: GuildAction[];
    guildId?: string;
}

export interface GuildAction {
    label: string;
    description: string;
    reputationChange: number;
}
export interface ScenarioTemplate {
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
    palette: [string, string, string];
    reputation: number;
    effects: {
        positive: string;
        negative: string;
    };
    scenarioTemplates: ScenarioTemplate[];
}

export interface PlayerRole {
    name: string;
    description: string;
    position: Position[];
    key_attributes: (keyof PlayerAttributes)[];
}
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
export interface Playstyle {
    id: string;
    name: string;
    description: string;
    effects: {
        [key in keyof PlayerAttributes]?: number;
    };
}

export interface CharacterAsset {
    zIndex: number;
    tags: string[];
    data: string;
}
export interface CharacterAssetLibrary {
    [key: string]: CharacterAsset;
}

export interface CommentaryContext {
    type: MatchEvent['type'];
    minute: number;
    homeTeam: Club;
    awayTeam: Club;
    homeScore: number;
    awayScore: number;
    actingTeam: 'home' | 'away';
    player?: Player;
}

export interface ScoutingAssignment {
    playerId: string;
    daysRemaining: number;
}
