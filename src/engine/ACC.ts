// Aetherium Chronicle Core (ACC)
// This is the main, offline procedural generation engine for the game.
// It manages the world seed, provides consistent random number generation,
// and handles the creation of all dynamic assets like players, staff, and narratives.

// FIX: Added missing type imports to resolve export errors.
import { Player, Club, Nation, Staff, PlayerAttributes, Contract, PlayerPersonality, Rarity, Position, Morale, PreferredFoot, SquadStatus, IndividualTrainingFocus, StaffRole, MatchEvent, Guild, GuildAction } from '../types';
import { NATIONS } from '../data/nations';
import { CLUBS } from '../data/clubs';
import { TRAITS } from '../data/traits';

// --- Core Engine State ---
let worldSeed: number = 0;

// --- Seeded Pseudo-Random Number Generator (PRNG) ---
// Using Mulberry32 algorithm for its simplicity and good distribution.
// This ensures that all "random" events are deterministic based on the seed.
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
/**
 * Initializes the ACC with a seed. This must be called once at the start of the game.
 * @param seed A numerical seed.
 */
const initialize = (seed: number): void => {
    worldSeed = seed;
    seededRandom = mulberry32(worldSeed);
    console.log(`Aetherium Chronicle Core initialized with seed: ${seed}`);
};

/**
 * Retrieves the current world seed.
 * @returns The numerical world seed.
 */
const getSeed = (): number => worldSeed;


// --- Helper Functions using Seeded PRNG ---
const getRandom = <T>(arr: T[]): T => arr[Math.floor(seededRandom() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(seededRandom() * (max - min + 1)) + min;
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

// --- Name Generation ---
const generateName = (nation: Nation) => {
    return {
        first: getRandom(nation.name_templates.first),
        last: getRandom(nation.name_templates.last),
    };
};

// --- Attribute Generation ---
const generateAttributes = (nation: Nation, position: Position, potential: number): PlayerAttributes => {
    const base = Math.floor(potential / 10);
    const attributes: Partial<PlayerAttributes> = {};

    const attributeKeys: (keyof PlayerAttributes)[] = [
        'shooting', 'dribbling', 'passing', 'tackling', 'composure', 'aggression',
        'vision', 'speed', 'stamina', 'strength', 'arcane_dribble', 'elemental_shot',
        'temporal_flux', 'consistency', 'important_matches', 'injury_proneness'
    ];

    attributeKeys.forEach(key => {
        const bias = nation.attribute_biases[key] || 0;
        let value = randomInt(base, base * 3) + bias;
        // Positional biases
        if (position === 'ATT' || position === 'STR') {
            if (['shooting', 'elemental_shot'].includes(key)) value += randomInt(5, 10);
        } else if (position === 'DEF') {
            if (['tackling', 'strength'].includes(key)) value += randomInt(5, 10);
        } else if (position === 'MID') {
             if (['passing', 'vision', 'arcane_dribble'].includes(key)) value += randomInt(5, 10);
        }
        attributes[key] = clamp(value, 10, 99);
    });
    
    return attributes as PlayerAttributes;
};

// --- Player Generation ---
let playerIdCounter = 0;
const generatePlayer = (club_id: string, nation_id: string, isYouth: boolean = false): Player => {
    const nation = NATIONS.find(n => n.id === nation_id)!;
    
    const age = isYouth ? randomInt(16, 18) : randomInt(19, 34);
    const potential_ability = randomInt(isYouth ? 60 : 40, 95);
    const current_ability = isYouth ? randomInt(20, 45) : clamp(randomInt(potential_ability - 30, potential_ability), 40, 99);
    
    const position: Position = getRandom(['GK', 'DEF', 'MID', 'ATT', 'STR']);
    
    let rarity: Rarity;
    if (potential_ability > 90) rarity = 'Legend';
    else if (potential_ability > 82) rarity = 'Epic';
    else if (potential_ability > 70) rarity = 'Rare';
    else rarity = 'Common';
    
    const personality: PlayerPersonality = {
        description: "A determined young professional.",
        ambition: randomInt(1, 20),
        loyalty: randomInt(1, 20),
        professionalism: randomInt(1, 20),
        temperament: randomInt(1, 20),
    };
    
    const contract: Contract = {
        wage: Math.floor((current_ability * current_ability * 2) / 100) * 100,
        expiry_season: 1 + randomInt(1, 4),
        release_clause: randomInt(1, 10) * 50000,
    };
    
    const traits = Object.keys(TRAITS);
    const numTraits = rarity === 'Legend' ? 3 : rarity === 'Epic' ? 2 : rarity === 'Rare' ? 1 : 0;

    return {
        id: `player_${playerIdCounter++}`,
        club_id,
        name: generateName(nation),
        age,
        nation_id,
        position,
        rarity,
        value: Math.floor((current_ability * current_ability * 5) / 100) * 1000,
        contract,
        attributes: generateAttributes(nation, position, potential_ability),
        current_ability,
        potential_ability,
        morale: 'Good',
        personality,
        injury_status: null,
        traits: Array.from({ length: numTraits }, () => getRandom(traits)),
        history: [],
        individual_training_focus: 'None',
        squad_status: 'First Team',
        preferred_foot: seededRandom() > 0.3 ? 'Right' : 'Left',
        weak_foot_ability: getRandom([1,2,3,4,5]),
        season_goals: 0,
        season_appearances: 0,
        international_caps: age > 20 ? randomInt(0, 50) : 0,
        international_goals: 0,
    };
};

// --- Staff Generation ---
let staffIdCounter = 0;
const generateStaff = (club_id: string, role: StaffRole): Staff => {
    const nation = getRandom(NATIONS);
    const nameParts = generateName(nation);
    
    let attributes: { [key: string]: number } = {};
    switch(role) {
        case 'Head of Youth Development':
            attributes['judging_potential'] = randomInt(10, 20);
            attributes['working_with_youngsters'] = randomInt(10, 20);
            break;
        case 'Chief Scout':
            attributes['judging_ability'] = randomInt(10, 20);
            attributes['scouting_knowledge'] = randomInt(10, 20);
            break;
        case 'Assistant Manager':
            attributes['tactical_knowledge'] = randomInt(10, 20);
            attributes['man_management'] = randomInt(10, 20);
            break;
        case 'Coach':
             attributes['attacking_coaching'] = randomInt(5, 20);
             attributes['defending_coaching'] = randomInt(5, 20);
             break;
        case 'Physio':
             attributes['physiotherapy'] = randomInt(10, 20);
             attributes['fitness'] = randomInt(5, 20);
             break;
    }

    return {
        id: `staff_${staffIdCounter++}`,
        club_id,
        name: `${nameParts.first} ${nameParts.last}`,
        role,
        attributes,
    };
};

// --- World Initialization ---
const initializeWorld = (): { players: Player[], staff: Staff[] } => {
    const players: Player[] = [];
    const staff: Staff[] = [];
    
    CLUBS.forEach(club => {
        // Generate players for each club
        for (let i = 0; i < 22; i++) {
            players.push(generatePlayer(club.id, club.nation_id));
        }
        
        // Generate staff for each club
        staff.push(generateStaff(club.id, 'Assistant Manager'));
        staff.push(generateStaff(club.id, 'Head of Youth Development'));
        staff.push(generateStaff(club.id, 'Chief Scout'));
        staff.push(generateStaff(club.id, 'Physio'));
        staff.push(generateStaff(club.id, 'Coach'));
    });
    
    return { players, staff };
};


// --- Narrative and Dynamic Asset Generation ---

// Word banks for procedural generation
const magitekInventions = ['Kinetic Recycler', 'Aetheric Dampener', 'Chrono-Stitch Weave', 'Hex-Proof Plating'];
const alchemistIngredients = ['Lunar Lotus', 'Sunstone Dust', 'Dragon-Scale Powder', 'Phoenix Ash'];
const syndicateTargets = ['transfer negotiations', 'training regimens', 'scouting reports', 'financial ledgers'];
const mediaTopics = ['a recent tactical blunder', 'your team\'s surprising form', 'rumors of player discontent'];

/**
 * Generates nicknames using a procedural method.
 */
const generateNickname = (player: Player): string[] => {
  const nation = NATIONS.find(n => n.id === player.nation_id);
  const adjective = nation?.adjective || 'Aurorian';
  const templates = [
    `The ${adjective} Comet`, `${player.name.last} the Great`, `The ${player.position} Virtuoso`,
    `The Cogwork Cannon`, `The Alchemist`, `Swift-Shadow`, `The Steam-Powered Wall`,
  ];
  // Use a temporary PRNG so nickname generation doesn't affect other world events
  const localRandom = mulberry32(worldSeed + player.id.charCodeAt(7));
  const shuffled = templates.sort(() => 0.5 - localRandom());
  return shuffled.slice(0, 3 + Math.floor(localRandom() * 3));
};

/**
 * Generates a match summary using a procedural method.
 */
const generateMatchSummary = (homeTeam: Club, awayTeam: Club, events: MatchEvent[]): string => {
    const homeScore = events.filter(e => e.type === 'Goal' && e.team === 'home').length;
    const awayScore = events.filter(e => e.type === 'Goal' && e.team === 'away').length;
    let summary = `A ${getRandom(['tense', 'fiery', 'calculated'])} match at ${homeTeam.stadium} saw ${homeTeam.name} clash with rivals ${awayTeam.name}. The final whistle blew with the scoreline reading ${homeScore}-${awayScore}.\n\n`;
    if (homeScore > awayScore) {
        summary += `${homeTeam.nickname} put on a ${getRandom(['dominant display', 'commanding performance', 'clinical show'])} to secure the victory. The home crowd leaves delighted with the performance and the crucial three points.`;
    } else if (awayScore > homeScore) {
        summary += `It was a tough day for the home side, as ${awayTeam.nickname} proved too strong on this occasion, ${getRandom(['clinical in their finishing', 'resolute in defense', 'superior in midfield'])}.`;
    } else {
        summary += `Neither side could find a winning goal in this hard-fought draw. A share of the points feels like a fair result after a ${getRandom(['balanced', 'competitive', 'grueling'])} 90 minutes.`;
    }
    return summary;
};


const fillPlaceholders = (text: string, club: Club): string => {
    let newText = text;
    // Basic placeholders
    newText = newText.replace(/\[CLUB_NAME\]/g, club.name);
    
    // Word bank placeholders
    if (newText.includes('[INVENTION]')) newText = newText.replace(/\[INVENTION\]/g, getRandom(magitekInventions));
    if (newText.includes('[INGREDIENT]')) newText = newText.replace(/\[INGREDIENT\]/g, getRandom(alchemistIngredients));
    if (newText.includes('[TARGET]')) newText = newText.replace(/\[TARGET\]/g, getRandom(syndicateTargets));
    if (newText.includes('[MEDIA_TOPIC]')) {
        let topic = getRandom(mediaTopics);
        if (club.rival_club_ids.length > 0) {
            const rivalClub = CLUBS.find(c => c.id === getRandom(club.rival_club_ids));
            topic = topic.replace(/\[RIVAL_CLUB\]/g, rivalClub?.name || 'a rival club');
        }
        newText = newText.replace(/\[MEDIA_TOPIC\]/g, topic);
    }
    
    // Add more complex placeholder logic here (e.g., [PLAYER_NAME]) if needed
    
    return newText;
}


/**
 * Generates a guild scenario from local templates. No API calls.
 */
const generateGuildScenario = (guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null => {
    if (!guild.scenarioTemplates || guild.scenarioTemplates.length === 0) {
        return null;
    }

    // Filter templates based on reputation
    const eligibleTemplates = guild.scenarioTemplates.filter(template => {
        const minRep = template.minRep ?? -101;
        const maxRep = template.maxRep ?? 101;
        return guild.reputation >= minRep && guild.reputation <= maxRep;
    });

    if (eligibleTemplates.length === 0) {
        return null;
    }

    const template = getRandom(eligibleTemplates);
    
    // Process the template to fill in placeholders
    const subject = fillPlaceholders(template.subject, club);
    const body = fillPlaceholders(template.body, club);

    return {
        subject,
        body,
        actions: template.actions,
    };
};

export const ACC = {
    initialize,
    getSeed,
    initializeWorld,
    generatePlayer,
    generateNickname,
    generateMatchSummary,
    generateGuildScenario,
    prng: {
      getRandom,
      randomInt
    }
};