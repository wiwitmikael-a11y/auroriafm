// src/engine/ACC.ts
import { Player, Club, MatchEvent, Guild, GuildAction, CommentaryContext, Staff, FinanceStatus, TacticMentality, Personality, Rarity, StaffRole, ScenarioTemplate } from '../types';
import { NATIONS } from '../data/nations';
import { CULTURAL_BLUEPRINTS } from '../data/cultures';
import { PLAYSTYLES } from '../data/playstyles';
import { TRAITS } from '../data/traits';

class ACC_Core {
    private seed: number = 0;

    public prng = {
        seededRandom: (): number => {
            let t = this.seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        },
        getRandom: <T>(arr: T[]): T => arr[Math.floor(this.prng.seededRandom() * arr.length)],
        getBiasedRandom: (min: number, max: number, bias: number, influence: number): number => {
            const r = this.prng.seededRandom();
            const mix = this.prng.seededRandom() * influence;
            return Math.floor((r * (1 - mix) + bias * mix) * (max - min)) + min;
        }
    };

    private clubNameParts: { [key: string]: { prefixes: string[], suffixes: string[] } } = {
        avalon: { prefixes: ['Avalon', 'Aethelgard', 'Camelot', 'Glaston'], suffixes: ['Albion', 'Sentinels', 'Knights', 'Rovers'] },
        gearhaven: { prefixes: ['Gearhaven', 'Steamforge', 'Clockwork', 'Ironclad'], suffixes: ['United', 'Titans', 'City', 'Foundry'] },
        arcadia: { prefixes: ['Arcane', 'Skyport', 'Crystalheart', 'Starfall'], suffixes: ['Academy', 'Aviators', 'Mages', 'FC'] },
        grimmr: { prefixes: ['Dragonflame', 'Ironfang', 'Grimmwold', 'Bloodpeak'], suffixes: ['Knights', 'Raiders', 'Horde', 'Berserkers'] },
        solis: { prefixes: ['Sunstone', 'Oasis', 'Mirage', 'Dune'], suffixes: ['Nomads', 'Sentinels', 'Striders', 'FC'] },
        veridia: { prefixes: ['Veridia', 'Thornwood', 'Green-Grove', 'Elderwood'], suffixes: ['Wildhearts', 'Rangers', 'Guardians', 'Wanderers'] }
    };
    private stadiumNameParts = {
        first: ['Grand', 'Royal', 'Commonwealth', 'Imperial', 'Elder', 'Sacred', 'Gilded'],
        second: ['Forge', 'Grounds', 'Stadium', 'Colosseum', 'Arena', 'Gardens', 'Spire', 'Bowl']
    };

    initialize(seed: number) {
        this.seed = seed;
    }

    private generateClubName(nationId: string, existingNames: Set<string>): { name: string, nickname: string } {
        const parts = this.clubNameParts[nationId];
        let name;
        do {
            name = `${this.prng.getRandom(parts.prefixes)} ${this.prng.getRandom(parts.suffixes)}`;
        } while (existingNames.has(name));
        
        const nickname = `The ${name.split(' ')[1]}`;
        return { name, nickname };
    }

    private _generateClubs(): Club[] {
        const generatedClubs: Club[] = [];
        const clubNames = new Set<string>();

        for (const [nationId, blueprint] of Object.entries(CULTURAL_BLUEPRINTS)) {
            const numClubs = this.prng.seededRandom() > 0.7 ? 3 : 2;
            for (let i = 0; i < numClubs; i++) {
                const { name, nickname } = this.generateClubName(nationId, clubNames);
                clubNames.add(name);
                const short_name = name.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase();
                const financeStatuses: FinanceStatus[] = ['Rich', 'Secure', 'Okay', 'Insecure'];
                const transferBudget = Math.floor(this.prng.seededRandom() * 5000000) * (financeStatuses.indexOf(this.prng.getRandom(financeStatuses)) + 1);
                const wageBudget = Math.floor(this.prng.seededRandom() * 50000) * (financeStatuses.indexOf(this.prng.getRandom(financeStatuses)) + 1);
                const facilities = Math.floor(this.prng.seededRandom() * 3) + 2;

                const newClub: Club = {
                    id: `${nationId}_${name.replace(/\s+/g, '_').toLowerCase()}`, name, short_name, nickname, nation_id: nationId,
                    palette: [blueprint.aesthetic_philosophy.color_psychology.primary.split(',')[0], blueprint.aesthetic_philosophy.color_psychology.secondary.split(',')[0]],
                    stadium: `${this.prng.getRandom(this.stadiumNameParts.first)} ${this.prng.getRandom(this.stadiumNameParts.second)}`,
                    finances: this.prng.getRandom(financeStatuses),
                    crest_tags: blueprint.aesthetic_philosophy.symbol_library_tags.join(', '),
                    lore_tags: Object.keys(blueprint.social_structure.player_archetype_distribution),
                    transfer_budget: transferBudget,
                    wage_budget: wageBudget,
                    training_facilities: facilities,
                    youth_facilities: Math.min(5, facilities + (this.prng.seededRandom() > 0.5 ? 1 : 0)),
                    staff_ids: [],
                    tactics: {
                        mentality: this.prng.getRandom(Object.keys(blueprint.tactical_philosophy.mentality_bias)) as TacticMentality,
                        pressing_intensity: Math.floor(this.prng.seededRandom() * 5) + 1,
                        defensive_line_height: Math.floor(this.prng.seededRandom() * 5) + 1,
                        formation: this.prng.getRandom(blueprint.tactical_philosophy.preferred_formations),
                    },
                    rival_club_ids: [],
                    youthIntakeDay: 280 + Math.floor(this.prng.seededRandom() * 30),
                    sponsor_deals: [],
                };
                generatedClubs.push(newClub);
            }
        }
        // Assign rivals
        generatedClubs.forEach(club => {
            const potentialRivals = generatedClubs.filter(c => c.id !== club.id && c.nation_id === club.nation_id);
            if (potentialRivals.length > 0) club.rival_club_ids.push(this.prng.getRandom(potentialRivals).id);
        });
        return generatedClubs;
    }

    private _generatePlayersForClub(club: Club): Player[] {
        const players: Player[] = [];
        const nation = NATIONS.find(n => n.id === club.nation_id)!;
        const blueprint = CULTURAL_BLUEPRINTS[club.nation_id];
        for (let i = 0; i < 25; i++) {
            const potential_ability = 50 + Math.floor(this.prng.seededRandom() * 150);
            const current_ability = Math.min(potential_ability, 40 + Math.floor(this.prng.seededRandom() * 110));
            const rarityRoll = this.prng.seededRandom();
            const attributes: Player['attributes'] = { speed: 10, stamina: 10, strength: 10, aggression: 10, injury_proneness: 10, shooting: 10, dribbling: 10, passing: 10, tackling: 10, composure: 10, vision: 10, consistency: 10, important_matches: 10, arcane_dribble: 10, elemental_shot: 10, temporal_flux: 10 };
            Object.keys(attributes).forEach((key: keyof typeof attributes) => {
                const bias = nation.attribute_biases?.[key] || 0;
                attributes[key] = Math.max(1, Math.min(20, Math.floor(this.prng.seededRandom() * 15) + 1 + (bias)));
            });
            players.push({
                id: `player_${club.id}_${i}`, name: { first: this.prng.getRandom(nation.name_templates.first), last: this.prng.getRandom(nation.name_templates.last) },
                club_id: club.id, nation_id: nation.id, age: 18 + Math.floor(this.prng.seededRandom() * 14),
                position: this.prng.getRandom(['GK', 'DF', 'MF', 'FW']),
                playstyle_id: this.prng.getRandom(PLAYSTYLES).id,
                rarity: rarityRoll > 0.99 ? 'Legend' : rarityRoll > 0.9 ? 'Epic' : rarityRoll > 0.6 ? 'Rare' : 'Common',
                personality: this.prng.getRandom(blueprint.social_structure.common_personalities),
                current_ability, potential_ability, attributes,
                traits: [this.prng.getRandom(Object.keys(TRAITS))],
                squad_status: 'Rotation', value: Math.floor(Math.pow(current_ability, 1.8) * 50),
                morale: 'Good', preferred_foot: this.prng.getRandom(['Left', 'Right', 'Both']),
                history: [], scouting_knowledge: 20, training_focus: null,
            });
        }
        return players;
    }

    private _generateStaffForClub(club: Club): Staff[] {
        const staff: Staff[] = [];
        const nation = NATIONS.find(n => n.id === club.nation_id)!;
        const roles: StaffRole[] = ['Assistant Manager', 'Head of Youth Development', 'Chief Scout', 'Physio', 'Coach'];
        roles.forEach(role => {
            const staffAttrs = role === 'Chief Scout' ? { judging_ability: 10, judging_potential: 10, adaptability: 10 } : role === 'Physio' ? { physiotherapy: 10, prevention: 10 } : { attacking: 10, defending: 10, technical: 10, tactical: 10, mental: 10, working_with_youth: 10 };
            staff.push({
                id: `staff_${club.id}_${role.replace(/\s+/g, '_')}`, name: `${this.prng.getRandom(nation.name_templates.first)} ${this.prng.getRandom(nation.name_templates.last)}`,
                club_id: club.id, nation_id: nation.id, age: 30 + Math.floor(this.prng.seededRandom() * 25), role,
                attributes: staffAttrs
            });
        });
        return staff;
    }


    initializeWorld(): { players: Player[], staff: Staff[], clubs: Club[] } {
        const clubs = this._generateClubs();
        const players: Player[] = [];
        const staff: Staff[] = [];

        clubs.forEach(club => {
            players.push(...this._generatePlayersForClub(club));
            staff.push(...this._generateStaffForClub(club));
        });

        return { players, staff, clubs };
    }

    generateFallbackPlayerLore(player: Player): string {
        const nation = NATIONS.find(n => n.id === player.nation_id);
        const playstyle = PLAYSTYLES.find(p => p.id === player.playstyle_id);
        
        const intro = `Hailing from the storied lands of ${nation?.name || 'an unknown region'}, ${player.name.first} ${player.name.last} is a player whose career is watched with keen interest.`;
        const style = `Known as a classic "${playstyle?.name || 'Versatile'}" player, their approach to the game is defined by a ${player.personality.toLowerCase()} demeanor.`;
        const future = `At ${player.age}, the Chroniclers believe their finest chapters are yet to be written on the pitch.`;
        
        return `${intro} ${style} ${future}`;
    }

    generateCommentary(context: CommentaryContext): string {
        const { type, minute, player, actingTeam, homeTeam, awayTeam } = context;
        const actingTeamName = actingTeam === 'home' ? homeTeam.name : awayTeam.name;
        switch (type) {
            case 'Goal': return `Goal for ${actingTeamName}! ${player?.name.last} with a clinical finish at ${minute} minutes!`;
            case 'Chance': return `A great chance for ${actingTeamName}! ${player?.name.last} couldn't convert!`;
            case 'Card': return `A yellow card is shown to ${player?.name.last} of ${actingTeamName}.`;
            case 'Kickoff': return `And we're underway at ${homeTeam.stadium}!`;
            case 'FullTime': return `The referee blows the final whistle. It's full time!`;
            default: return `A moment of calm in the match at the ${minute}' minute.`;
        }
    }

    generateNickname(player: Player): string[] {
        const nation = NATIONS.find(n => n.id === player.nation_id);
        const keyAttr = Object.keys(player.attributes).reduce((a, b) => player.attributes[a] > player.attributes[b] ? a : b);
        
        const nicknames = new Set<string>();
        nicknames.add(`The ${nation?.adjective || ''} Flash`);
        nicknames.add(`The ${keyAttr.charAt(0).toUpperCase() + keyAttr.slice(1).replace(/_/g, ' ')}`);
        
        if (player.personality === "Temperamental") nicknames.add(`The Wildcard`);
        if (player.rarity === "Legend") nicknames.add(`The Legend of ${player.name.last}`);
        
        return Array.from(nicknames).slice(0,4);
    }

    generateMatchSummary(homeTeam: Club, awayTeam: Club, events: MatchEvent[]): string {
        return `A summary of the match between ${homeTeam.name} and ${awayTeam.name}. It was an exciting game.`;
    }

    generateGuildScenario(guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null {
        if (!guild.scenarioTemplates || guild.scenarioTemplates.length === 0) return null;
        const template = this.prng.getRandom(guild.scenarioTemplates) as ScenarioTemplate;
        if (!template) return null;
        return {
            subject: template.subject,
            body: template.body.replace(/\[CLUB_NAME\]/g, club.name),
            actions: template.actions,
        };
    }
}

export const ACC = new ACC_Core();