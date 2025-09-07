import { Player, Staff, Club, Nation, PlayerAttributes, Position, Rarity, SquadStatus, Morale, StaffRole, MatchEvent, Guild, GuildAction } from '../types';
import { CLUBS } from '../data/clubs';
import { NATIONS } from '../data/nations';
import { TRAITS } from '../data/traits';

class AetheriumChronicleCore {
    private seed: number = 0;

    public prng = {
        seededRandom: () => {
            let t = this.seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        },
        getRandom: <T>(arr: T[]): T => {
            return arr[Math.floor(this.prng.seededRandom() * arr.length)];
        },
        getBiasedRandom: (min: number, max: number, bias: number, influence: number) => {
            const random = this.prng.seededRandom();
            const mix = this.prng.seededRandom() * influence;
            const biasedRandom = random * (1 - mix) + bias * mix;
            return Math.floor(biasedRandom * (max - min)) + min;
        }
    };

    initialize(seed: number) {
        this.seed = seed;
    }

    private generatePlayerName(nation: Nation): { first: string, last: string } {
        return {
            first: this.prng.getRandom(nation.name_templates.first),
            last: this.prng.getRandom(nation.name_templates.last),
        };
    }

    private generatePlayer(id: string, club: Club, isYouth: boolean = false): Player {
        const nation = NATIONS.find(n => n.id === club.nation_id) || this.prng.getRandom(NATIONS);
        const age = isYouth ? this.prng.getBiasedRandom(16, 19, 0, 1) : this.prng.getBiasedRandom(18, 34, 0.3, 1);
        const potential_ability = this.prng.getBiasedRandom(50, 99, 0.7, 1);
        const current_ability = isYouth ? this.prng.getBiasedRandom(30, 55, 0.5, 1) : Math.min(potential_ability, this.prng.getBiasedRandom(45, 85, 0.5, 1));
        
        const positions: Position[] = ['GK', 'DF', 'MF', 'FW'];
        const position = this.prng.getRandom(positions);

        const attributes: PlayerAttributes = {
            speed: 50, stamina: 50, strength: 50, aggression: 50, injury_proneness: 50,
            shooting: 50, dribbling: 50, passing: 50, tackling: 50,
            composure: 50, vision: 50, consistency: 50, important_matches: 50,
            arcane_dribble: 50, elemental_shot: 50, temporal_flux: 50,
        };

        Object.keys(attributes).forEach(keyStr => {
            const key = keyStr as keyof PlayerAttributes;
            const bias = nation.attribute_biases[key] || 0;
            const baseValue = this.prng.getBiasedRandom(30, 99, (current_ability / 100), 1)
            attributes[key] = Math.max(10, Math.min(99, baseValue + bias));
        });

        const rarityRoll = this.prng.seededRandom();
        const rarity: Rarity = rarityRoll > 0.99 ? 'Legend' : rarityRoll > 0.9 ? 'Epic' : rarityRoll > 0.6 ? 'Rare' : 'Common';

        return {
            id: `player_${id}`,
            name: this.generatePlayerName(nation),
            club_id: club.id,
            nation_id: nation.id,
            age,
            position,
            playstyle: 'Versatile',
            rarity,
            current_ability,
            potential_ability,
            attributes,
            traits: [this.prng.getRandom(Object.keys(TRAITS))],
            squad_status: 'Rotation',
            value: Math.floor(Math.pow(current_ability, 2.5) * 10),
            morale: 'Fair',
            preferred_foot: this.prng.getRandom(['Left', 'Right']),
            history: [{ season: 1, club_id: club.id, appearances: 0, goals: 0, assists: 0, cards: 0 }],
            scouting_knowledge: 20,
        };
    }

    private generateStaff(id: string, club: Club): Staff[] {
        const roles: StaffRole[] = ['Assistant Manager', 'Head of Youth Development', 'Chief Scout', 'Physio', 'Coach'];
        return roles.map((role, i) => ({
            id: `staff_${id}_${i}`,
            name: `${this.prng.getRandom(NATIONS[0].name_templates.first)} ${this.prng.getRandom(NATIONS[0].name_templates.last)}`,
            role,
            club_id: club.id,
            attributes: {
                [role.toLowerCase().replace(/ /g, '_')]: this.prng.getBiasedRandom(10, 20, 0.5, 1)
            }
        }));
    }

    initializeWorld(): { players: Player[], staff: Staff[] } {
        let players: Player[] = [];
        let staff: Staff[] = [];
        let playerIdCounter = 0;

        CLUBS.forEach(club => {
            for (let i = 0; i < 22; i++) {
                players.push(this.generatePlayer(String(playerIdCounter++), club));
            }
            const clubStaff = this.generateStaff(club.id, club);
            staff.push(...clubStaff);
        });

        return { players, staff };
    }

    generateMatchSummary(homeTeam: Club, awayTeam: Club, events: MatchEvent[]): string {
        const goals = events.filter(e => e.type === 'Goal');
        if (goals.length === 0) {
            return `A tense but ultimately goalless affair between ${homeTeam.name} and ${awayTeam.name} ends in a stalemate.`;
        }
        const lastGoal = goals[goals.length - 1];
        const winningTeam = lastGoal.team === 'home' ? homeTeam.name : awayTeam.name;
        return `${winningTeam} emerged victorious in a thrilling encounter, with ${lastGoal.player} scoring the decisive goal in the ${lastGoal.minute}th minute.`;
    }

     generateGuildScenario(guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null {
        const availableScenarios = guild.scenarioTemplates.filter(s => {
            const minRepMet = s.minRep === undefined || guild.reputation >= s.minRep;
            const maxRepMet = s.maxRep === undefined || guild.reputation <= s.maxRep;
            return minRepMet && maxRepMet;
        });

        if (availableScenarios.length === 0) return null;

        const scenario = this.prng.getRandom(availableScenarios);

        // Simple placeholder replacement
        const body = scenario.body
            .replace(/\[CLUB_NAME\]/g, club.name)
            .replace(/\[INVENTION\]/g, 'Aether-Cogs')
            .replace(/\[INGREDIENT\]/g, 'Dragon\'s Breath Root')
            .replace(/\[TARGET\]/g, 'tactical setup')
            .replace(/\[MEDIA_TOPIC\]/g, 'the state of refereeing');

        return { ...scenario, body };
    }

}

export const ACC = new AetheriumChronicleCore();
