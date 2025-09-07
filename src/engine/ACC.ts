// Aetherium Chronicle Core (ACC)
// This is the main, offline procedural generation engine for the game.
// It manages the world seed, provides consistent random number generation,
// and handles the creation of all dynamic assets like players, staff, and narratives.

import { Player, Club, Nation, Staff, PlayerAttributes, Contract, PlayerPersonality, Rarity, Position, StaffRole, MatchEvent, Guild, GuildAction } from '../types';
import { NATIONS } from '../data/nations';
import { CLUBS } from '../data/clubs';
import { TRAITS } from '../data/traits';

// --- Core Engine State ---
let worldSeed: number = 0;

// --- Seeded Pseudo-Random Number Generator (PRNG) ---
function mulberry32(seed: number) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
let seededRandom = mulberry32(worldSeed);

// --- Engine Initialization ---
const initialize = (seed: number): void => {
    worldSeed = seed;
    seededRandom = mulberry32(seed);
    console.log(`Aetherium Chronicle Core initialized with seed: ${seed}`);
};

const getSeed = (): number => worldSeed;

// --- Helper Functions using Seeded PRNG ---
const getRandom = <T>(arr: T[]): T => arr[Math.floor(seededRandom() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(seededRandom() * (max - min + 1)) + min;
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

// --- Name Generation ---
const generateName = (nation: Nation) => ({
    first: getRandom(nation.name_templates.first),
    last: getRandom(nation.name_templates.last),
});

// --- Attribute Generation ---
const generateAttributes = (nation: Nation, position: Position, potential: number): PlayerAttributes => {
    const base = Math.floor(potential / 10);
    const attributes: Partial<PlayerAttributes> = {};
    const keys: (keyof PlayerAttributes)[] = ['shooting','dribbling','passing','tackling','composure','aggression','vision','speed','stamina','strength','arcane_dribble','elemental_shot','temporal_flux','consistency','important_matches','injury_proneness'];

    keys.forEach(key => {
        const bias = nation.attribute_biases[key] || 0;
        let value = randomInt(base, base * 3) + bias;
        if (position === 'FW') {
            if (['shooting', 'elemental_shot', 'speed'].includes(key)) value += randomInt(5, 10);
        } else if (position === 'DF') {
            if (['tackling', 'strength', 'aggression'].includes(key)) value += randomInt(5, 10);
        } else if (position === 'MF') {
             if (['passing', 'vision', 'arcane_dribble', 'composure'].includes(key)) value += randomInt(5, 10);
        }
        attributes[key] = clamp(value, 10, 99);
    });
    
    return attributes as PlayerAttributes;
};

// --- Trait & Playstyle Generation ---
const assignTraitsByAttributes = (player: Player): string[] => {
    const assignedTraits: string[] = [];
    const attrs = player.attributes;
    if (attrs.strength > 85 && attrs.aggression > 80) assignedTraits.push('BRUISER');
    if (attrs.vision > 88) assignedTraits.push('VISIONARY');
    if (attrs.passing > 85 && attrs.vision > 85) assignedTraits.push('PLAYMAKER');
    if (attrs.composure > 85 && attrs.important_matches > 80) assignedTraits.push('STAR_PLAYER');
    if (attrs.stamina > 90) assignedTraits.push('STEAM_POWERED_LUNGS');
    if (attrs.dribbling > 85 && attrs.arcane_dribble > 85) assignedTraits.push('MAGICAL_MAESTRO');
    return assignedTraits;
};

const derivePlaystyle = (player: Player): string => {
    const { position, attributes: attrs } = player;
    if (position === 'GK') return 'Goalkeeper';

    if (position === 'DF') {
        if (attrs.strength > 82 && attrs.tackling > 82) return 'Cogwork Defender';
        if (attrs.speed > 80 && attrs.tackling > 75) return 'Swift Stopper';
        if (attrs.passing > 78 && attrs.vision > 75) return 'Ball-Playing Sentinel';
        if (attrs.arcane_dribble > 75 && attrs.tackling > 75) return 'Aether-Infused Blocker';
        return 'Central Defender';
    }
    if (position === 'MF') {
        if (attrs.passing > 85 && attrs.vision > 85) return 'Aetheric Playmaker';
        if (attrs.tackling > 85 && attrs.stamina > 85) return 'Tireless Engine';
        if (attrs.arcane_dribble > 85 && attrs.dribbling > 80) return 'Arcane Winger';
        if (attrs.temporal_flux > 82 && attrs.passing > 80) return 'Deep-Lying Magister';
        return 'Midfielder';
    }
    if (position === 'FW') {
        if (attrs.strength > 85 && attrs.shooting > 80) return 'Goliath Forward';
        if (attrs.speed > 85 && attrs.shooting > 80) return 'Quicksilver Striker';
        if (attrs.elemental_shot > 88) return 'Elemental Striker';
        if (attrs.dribbling > 82 && attrs.shooting < 75) return 'Shadow Striker';
        return 'Forward';
    }
    return 'Player';
};


// --- Player Generation ---
let playerIdCounter = 0;
const generatePlayer = (club_id: string, nation_id: string, isYouth: boolean = false): Player => {
    const nation = NATIONS.find(n => n.id === nation_id)!;
    const age = isYouth ? randomInt(16, 18) : randomInt(19, 34);
    const potential_ability = randomInt(isYouth ? 60 : 40, 95);
    const current_ability = isYouth ? randomInt(20, 45) : clamp(randomInt(potential_ability - 30, potential_ability), 40, 99);
    const position: Position = getRandom(['GK', 'DF', 'MF', 'FW']);
    let rarity: Rarity = (potential_ability > 90) ? 'Legend' : (potential_ability > 82) ? 'Epic' : (potential_ability > 70) ? 'Rare' : 'Common';

    const player: Partial<Player> = {
        id: `player_${playerIdCounter++}`,
        club_id, name: generateName(nation), age, nation_id, position, rarity,
        value: Math.floor((current_ability * current_ability * 5) / 100) * 1000,
        contract: { wage: Math.floor((current_ability * current_ability * 2) / 100) * 100, expiry_season: 1 + randomInt(1, 4) },
        attributes: generateAttributes(nation, position, potential_ability),
        current_ability, potential_ability, morale: 'Good',
        personality: { description: "A determined professional.", ambition: randomInt(1, 20), loyalty: randomInt(1, 20), professionalism: randomInt(1, 20), temperament: randomInt(1, 20) },
        injury_status: null, history: [], individual_training_focus: 'None', squad_status: 'First Team',
        preferred_foot: seededRandom() > 0.3 ? 'Right' : 'Left', weak_foot_ability: getRandom([1,2,3,4,5]),
        season_goals: 0, season_appearances: 0, international_caps: age > 20 ? randomInt(0, 50) : 0, international_goals: 0,
    };
    
    player.traits = assignTraitsByAttributes(player as Player);
    player.playstyle = derivePlaystyle(player as Player);

    return player as Player;
};

// --- Staff Generation ---
let staffIdCounter = 0;
const generateStaff = (club_id: string, role: StaffRole): Staff => {
    const nation = getRandom(NATIONS);
    const nameParts = generateName(nation);
    let attributes: { [key: string]: number } = {};
    switch(role) {
        case 'Head of Youth Development': attributes = {'judging_potential': randomInt(10, 20), 'working_with_youngsters': randomInt(10, 20)}; break;
        case 'Chief Scout': attributes = {'judging_ability': randomInt(10, 20), 'scouting_knowledge': randomInt(10, 20)}; break;
        case 'Assistant Manager': attributes = {'tactical_knowledge': randomInt(10, 20), 'man_management': randomInt(10, 20)}; break;
        case 'Coach': attributes = {'attacking_coaching': randomInt(5, 20), 'defending_coaching': randomInt(5, 20)}; break;
        case 'Physio': attributes = {'physiotherapy': randomInt(10, 20), 'fitness': randomInt(5, 20)}; break;
    }
    return { id: `staff_${staffIdCounter++}`, club_id, name: `${nameParts.first} ${nameParts.last}`, role, attributes };
};

// --- World Initialization ---
const initializeWorld = (): { players: Player[], staff: Staff[] } => {
    const players: Player[] = [];
    const staff: Staff[] = [];
    CLUBS.forEach(club => {
        for (let i = 0; i < 22; i++) players.push(generatePlayer(club.id, club.nation_id));
        staff.push(generateStaff(club.id, 'Assistant Manager'));
        staff.push(generateStaff(club.id, 'Head of Youth Development'));
        staff.push(generateStaff(club.id, 'Chief Scout'));
        staff.push(generateStaff(club.id, 'Physio'));
        staff.push(generateStaff(club.id, 'Coach'));
    });
    return { players, staff };
};

const generateProceduralCrest = (tags: string, palette: string[]): string => {
    const svg = `<svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" fill="${palette[0] || '#ccc'}" />
        <circle cx="50" cy="50" r="30" fill="${palette[1] || '#aaa'}" stroke="${palette[0]}" stroke-width="4" />
        <text x="50" y="55" font-family="Exo 2, sans-serif" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">${tags.split(',')[0].substring(0,3).toUpperCase()}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// --- Narrative and Dynamic Asset Generation ---
const magitekInventions = ['Kinetic Recycler', 'Aetheric Dampener', 'Chrono-Stitch Weave', 'Hex-Proof Plating'];
const alchemistIngredients = ['Lunar Lotus', 'Sunstone Dust', 'Dragon-Scale Powder', 'Phoenix Ash'];
const syndicateTargets = ['transfer negotiations', 'training regimens', 'scouting reports', 'financial ledgers'];
const mediaTopics = ['a recent tactical blunder', 'your team\'s surprising form', 'rumors of player discontent'];

const generateNickname = (player: Player): string[] => {
  const templates = [`The ${player.playstyle}`, `${player.name.last} the Great`, `The ${getRandom(NATIONS).adjective} Comet`];
  const localRandom = mulberry32(worldSeed + player.id.charCodeAt(7));
  const shuffled = templates.sort(() => 0.5 - localRandom());
  return shuffled.slice(0, 3 + Math.floor(localRandom() * 3));
};

const generateMatchSummary = (homeTeam: Club, awayTeam: Club, events: MatchEvent[]): string => {
    const homeScore = events.filter(e => e.type === 'Goal' && e.team === 'home').length;
    const awayScore = events.filter(e => e.type === 'Goal' && e.team === 'away').length;
    let summary = `A ${getRandom(['tense', 'fiery', 'calculated'])} match at ${homeTeam.stadium} has concluded. The final score: ${homeScore}-${awayScore}.\n\n`;
    if (homeScore > awayScore) summary += `${homeTeam.nickname} put on a ${getRandom(['dominant display', 'commanding performance'])} to secure the victory.`;
    else if (awayScore > homeScore) summary += `It was a tough day for the home side, as ${awayTeam.nickname} proved too strong.`;
    else summary += `Neither side could find a winning goal in this hard-fought draw.`;
    return summary;
};

const fillPlaceholders = (text: string, club: Club): string => {
    let newText = text.replace(/\[CLUB_NAME\]/g, club.name)
                      .replace(/\[INVENTION\]/g, getRandom(magitekInventions))
                      .replace(/\[INGREDIENT\]/g, getRandom(alchemistIngredients))
                      .replace(/\[TARGET\]/g, getRandom(syndicateTargets))
                      .replace(/\[MEDIA_TOPIC\]/g, getRandom(mediaTopics));
    return newText;
}

const generateGuildScenario = (guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null => {
    const eligibleTemplates = (guild.scenarioTemplates || []).filter(t => (t.minRep ?? -101) <= guild.reputation && (t.maxRep ?? 101) >= guild.reputation);
    if (eligibleTemplates.length === 0) return null;
    const template = getRandom(eligibleTemplates);
    return { subject: fillPlaceholders(template.subject, club), body: fillPlaceholders(template.body, club), actions: template.actions };
};

export const ACC = { initialize, getSeed, initializeWorld, generatePlayer, generateNickname, generateMatchSummary, generateGuildScenario, generateProceduralCrest, prng: { getRandom, randomInt, seededRandom } };