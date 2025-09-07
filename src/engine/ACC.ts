// src/engine/ACC.ts
import { Player, Club, MatchEvent, Guild, GuildAction, CommentaryContext, Staff, Fixture } from '../types';
import { NATIONS } from '../data/nations';
import { CLUBS } from '../data/clubs';

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
    };

    initialize(seed: number) {
        this.seed = seed;
    }

    initializeWorld(): { players: Player[], staff: Staff[], clubs: Club[] } {
        // This is a simplified generation logic for placeholder
        const players: Player[] = [];
        const staff: Staff[] = [];
        const clubs = CLUBS; // Use predefined clubs
        
        clubs.forEach(club => {
            for(let i=0; i<25; i++) {
                // Simplified player generation
                const nation = NATIONS.find(n => n.id === club.nation_id) || this.prng.getRandom(NATIONS);
                const name = {
                    first: this.prng.getRandom(nation.name_templates.first),
                    last: this.prng.getRandom(nation.name_templates.last)
                };
                players.push({
                    id: `player_${club.id}_${i}`,
                    name,
                    club_id: club.id,
                    nation_id: nation.id,
                    age: 20 + Math.floor(this.prng.seededRandom() * 15),
                    position: this.prng.getRandom(['GK', 'DF', 'MF', 'FW']),
                    playstyle_id: 'versatile',
                    rarity: 'Common',
                    personality: 'Professional',
                    current_ability: 50 + Math.floor(this.prng.seededRandom() * 100),
                    potential_ability: 100 + Math.floor(this.prng.seededRandom() * 100),
                    attributes: { speed: 10, stamina: 10, strength: 10, aggression: 10, injury_proneness: 10, shooting: 10, dribbling: 10, passing: 10, tackling: 10, composure: 10, vision: 10, consistency: 10, important_matches: 10, arcane_dribble: 10, elemental_shot: 10, temporal_flux: 10 },
                    traits: [],
                    squad_status: 'Rotation',
                    value: 100000,
                    morale: 'Good',
                    preferred_foot: 'Right',
                    history: [],
                    scouting_knowledge: 20,
                    training_focus: null,
                });
            }
        });

        return { players, staff, clubs };
    }

    generatePlayerLore(player: Player): string {
        return `${player.name.first} ${player.name.last} is a promising player from ${player.nation_id}. His story is just beginning.`;
    }

    generateCommentary(context: CommentaryContext): string {
        const { type, minute, player, actingTeam, homeTeam, awayTeam } = context;
        const actingTeamName = actingTeam === 'home' ? homeTeam.name : awayTeam.name;
        switch (type) {
            case 'Goal':
                return `Goal for ${actingTeamName}! ${player?.name.last} with a clinical finish at ${minute} minutes!`;
            case 'Chance':
                return `A great chance for ${actingTeamName}! ${player?.name.last} couldn't convert!`;
            case 'Card':
                return `A yellow card is shown to ${player?.name.last} of ${actingTeamName}.`;
            case 'Kickoff':
                return `And we're underway at ${homeTeam.stadium}!`;
            case 'FullTime':
                return `The referee blows the final whistle. It's full time!`;
            default:
                return `A moment of calm in the match at the ${minute}' minute.`;
        }
    }

    generateNickname(player: Player): string[] {
        return [
            `The ${player.name.last}`,
            `${player.name.first} "The Hammer" ${player.name.last}`,
            `The ${NATIONS.find(n => n.id === player.nation_id)?.adjective} Flash`
        ];
    }

    generateMatchSummary(homeTeam: Club, awayTeam: Club, events: MatchEvent[]): string {
        return `A summary of the match between ${homeTeam.name} and ${awayTeam.name}. It was an exciting game.`;
    }

    generateGuildScenario(guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null {
        const template = this.prng.getRandom(guild.scenarioTemplates);
        if (!template) return null;
        return {
            subject: template.subject,
            body: template.body.replace('[CLUB_NAME]', club.name),
            actions: template.actions,
        };
    }
}

export const ACC = new ACC_Core();
