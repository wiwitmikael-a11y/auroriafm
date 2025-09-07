import { Player, Staff, Club, Nation, PlayerAssetIds, CoachAttributes, ScoutAttributes, PhysioAttributes, Guild, GuildAction } from '../types';
import { NATIONS } from '../data/nations';
import { CLUBS } from '../data/clubs';
import { TRAITS } from '../data/traits';
import { PLAYSTYLES } from '../data/playstyles';
import { characterAssets } from '../data/characterAssets';

class AetheriumChronicleCore {
    private seed: number = 0;
    private playerIdCounter: number = 1;
    private staffIdCounter: number = 1;

    public prng = {
        seededRandom: (): number => {
            let t = this.seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        },
        getRandom: <T>(arr: T[]): T => {
            return arr[Math.floor(this.prng.seededRandom() * arr.length)];
        },
        getBiasedRandom: (min: number, max: number, bias: number, influence: number): number => {
            const r = this.prng.seededRandom();
            const mix = this.prng.seededRandom() * influence;
            const biasedRandom = r * (1 - mix) + bias * mix;
            return Math.floor(biasedRandom * (max - min)) + min;
        },
    };

    public initialize(seed: number) {
        this.seed = seed;
        this.playerIdCounter = 1;
        this.staffIdCounter = 1;
    }

    private generatePlayerName(nation: Nation): { first: string, last: string } {
        const first = this.prng.getRandom(nation.name_templates.first);
        const last = this.prng.getRandom(nation.name_templates.last);
        return { first, last };
    }

    private selectAsset(slot: 'body' | 'head' | 'hair' | 'torso' | 'legs' | 'headwear', keywords: string[]): string {
        const possibleAssets = Object.entries(characterAssets).filter(([_, asset]) => asset.tags.includes(slot));
        if (possibleAssets.length === 0) {
            if (slot === 'body') return 'body_base_human';
            if (slot === 'head') return 'head_base_human';
            return '';
        }

        const scoredAssets = possibleAssets.map(([id, asset]) => {
            const score = asset.tags.reduce((acc, tag) => acc + (keywords.includes(tag) ? 1 : 0), 0);
            return { id, score };
        }).sort((a, b) => b.score - a.score);
        
        const topScore = scoredAssets[0].score;
        // If there's no strong match, it introduces more variety by picking from a wider pool.
        const selectionPool = topScore > 0 ? scoredAssets.filter(a => a.score >= topScore -1) : scoredAssets;
        
        return this.prng.getRandom(selectionPool).id;
    }

    private generatePlayer(club: Club): Player {
        const nation = NATIONS.find(n => n.id === club.nation_id) || this.prng.getRandom(NATIONS);
        const age = this.prng.getBiasedRandom(18, 34, 0.3, 1);
        
        const potential_ability = this.prng.getBiasedRandom(80, 200, 0.7, 1);
        const current_ability = Math.min(potential_ability, this.prng.getBiasedRandom(90, 160, 0.5, 1));

        const positions: Player['position'][] = ['GK', 'DF', 'MF', 'FW'];
        const position = this.prng.getRandom(positions);
        
        // --- Lore-Driven Asset Generation ---
        const keywords = [...club.lore_tags];
        if (position === 'DF') keywords.push('armor'); // Defenders are more likely to wear armor

        const assetIds: PlayerAssetIds = {
            body: this.selectAsset('body', keywords),
            head: this.selectAsset('head', keywords),
            hair: this.selectAsset('hair', keywords),
            torso: this.selectAsset('torso', keywords),
            legs: this.selectAsset('legs', keywords),
        };

        // Add headwear with a certain probability, biased by lore tags
        const hasHeadwearTag = keywords.includes('bandana') || keywords.includes('helmet');
        if (hasHeadwearTag && this.prng.seededRandom() > 0.4) { // 60% chance if tag exists
             const headwear = this.selectAsset('headwear', keywords);
             if (headwear) assetIds.headwear = headwear;
        } else if (this.prng.seededRandom() > 0.8) { // 20% chance otherwise
             const headwear = this.selectAsset('headwear', keywords);
             if (headwear) assetIds.headwear = headwear;
        }
        // --- End Asset Generation ---

        const attributes: Player['attributes'] = {
            speed: 1, stamina: 1, strength: 1, aggression: 1, injury_proneness: 1,
            shooting: 1, dribbling: 1, passing: 1, tackling: 1,
            composure: 1, vision: 1, consistency: 1, important_matches: 1,
            arcane_dribble: 1, elemental_shot: 1, temporal_flux: 1
        };

        Object.keys(attributes).forEach(key => {
            const baseValue = this.prng.getBiasedRandom(1, 21, (current_ability / 200), 1);
            const nationBias = nation.attribute_biases?.[key as keyof Player['attributes']] || 0;
            attributes[key as keyof Player['attributes']] = Math.max(1, Math.min(20, baseValue + nationBias));
        });

        const rarityRoll = this.prng.seededRandom();
        const rarity: Player['rarity'] = rarityRoll > 0.99 ? 'Legend' : rarityRoll > 0.90 ? 'Epic' : rarityRoll > 0.60 ? 'Rare' : 'Common';

        const personalities: Player['personality'][] = ['Ambitious', 'Loyal', 'Professional', 'Temperamental'];
        const playstyle = this.prng.getRandom(PLAYSTYLES);
        
        return {
            id: `player_${this.playerIdCounter++}`,
            name: this.generatePlayerName(nation),
            club_id: club.id,
            nation_id: nation.id,
            age,
            position,
            playstyle_id: playstyle.id,
            rarity,
            personality: this.prng.getRandom(personalities),
            current_ability,
            potential_ability,
            attributes,
            traits: [this.prng.getRandom(Object.keys(TRAITS))],
            squad_status: 'First Team',
            value: Math.floor(Math.pow(current_ability, 1.8) * 50),
            morale: 'Good',
            preferred_foot: this.prng.getRandom(['Left', 'Right']),
            history: [{ season: 1, club_id: club.id, appearances: 0, goals: 0, assists: 0, cards: 0 }],
            scouting_knowledge: 20,
            training_focus: null,
            positionIndex: null,
            assetIds: assetIds,
        };
    }

    public generatePlayerFromKeywords(club: Club, keywords: string[]): Player {
        const nation = NATIONS.find(n => n.id === club.nation_id) || this.prng.getRandom(NATIONS);
        const age = this.prng.getBiasedRandom(18, 24, 0.2, 1); // Young prospect

        const potential_ability = this.prng.getBiasedRandom(100, 190, 0.7, 1);
        const current_ability = Math.min(potential_ability, this.prng.getBiasedRandom(60, 110, 0.5, 1));

        const positions: Player['position'][] = ['GK', 'DF', 'MF', 'FW'];
        let position: Player['position'] = this.prng.getRandom(positions);
        
        // Infer position from keywords
        if (keywords.includes('knight') || keywords.includes('warrior') || keywords.includes('defender')) {
            position = this.prng.getRandom(['DF', 'MF']);
        } else if (keywords.includes('rogue') || keywords.includes('winger') || keywords.includes('forward')) {
            position = this.prng.getRandom(['MF', 'FW']);
        } else if (keywords.includes('goalkeeper')) {
            position = 'GK';
        }

        const baseKeywords = [...keywords];
        if (position === 'DF') baseKeywords.push('armor');

        const assetIds: PlayerAssetIds = {
            body: this.selectAsset('body', baseKeywords),
            head: this.selectAsset('head', baseKeywords),
            hair: this.selectAsset('hair', baseKeywords),
            torso: this.selectAsset('torso', baseKeywords),
            legs: this.selectAsset('legs', baseKeywords),
        };

        const hasHeadwearTag = baseKeywords.includes('bandana') || baseKeywords.includes('helmet');
        if (hasHeadwearTag && this.prng.seededRandom() > 0.4) {
             const headwear = this.selectAsset('headwear', baseKeywords);
             if (headwear) assetIds.headwear = headwear;
        } else if (this.prng.seededRandom() > 0.8) {
             const headwear = this.selectAsset('headwear', baseKeywords);
             if (headwear) assetIds.headwear = headwear;
        }

        const attributes: Player['attributes'] = {
            speed: 1, stamina: 1, strength: 1, aggression: 1, injury_proneness: 1,
            shooting: 1, dribbling: 1, passing: 1, tackling: 1,
            composure: 1, vision: 1, consistency: 1, important_matches: 1,
            arcane_dribble: 1, elemental_shot: 1, temporal_flux: 1
        };

        Object.keys(attributes).forEach(key => {
            const baseValue = this.prng.getBiasedRandom(1, 21, (current_ability / 200), 1);
            const nationBias = nation.attribute_biases?.[key as keyof Player['attributes']] || 0;
            attributes[key as keyof Player['attributes']] = Math.max(1, Math.min(20, baseValue + nationBias));
        });

        const rarityRoll = this.prng.seededRandom();
        const rarity: Player['rarity'] = rarityRoll > 0.99 ? 'Legend' : rarityRoll > 0.90 ? 'Epic' : rarityRoll > 0.60 ? 'Rare' : 'Common';

        const personalities: Player['personality'][] = ['Ambitious', 'Loyal', 'Professional', 'Temperamental'];
        const playstyle = this.prng.getRandom(PLAYSTYLES);
        
        return {
            id: `player_prompt_${this.playerIdCounter++}`,
            name: this.generatePlayerName(nation),
            club_id: club.id,
            nation_id: nation.id,
            age,
            position,
            playstyle_id: playstyle.id,
            rarity,
            personality: this.prng.getRandom(personalities),
            current_ability,
            potential_ability,
            attributes,
            traits: [this.prng.getRandom(Object.keys(TRAITS))],
            squad_status: 'Prospect',
            value: Math.floor(Math.pow(current_ability, 1.8) * 50),
            morale: 'Good',
            preferred_foot: this.prng.getRandom(['Left', 'Right']),
            history: [{ season: 1, club_id: club.id, appearances: 0, goals: 0, assists: 0, cards: 0 }],
            scouting_knowledge: 100,
            training_focus: null,
            positionIndex: null,
            assetIds: assetIds,
        };
    }

    private generateStaff(club: Club): Staff[] {
        const staff: Staff[] = [];
        const roles: Staff['role'][] = ['Assistant Manager', 'Head of Youth Development', 'Chief Scout', 'Physio', 'Coach', 'Coach'];
        roles.forEach(role => {
            const nation = NATIONS.find(n => n.id === club.nation_id) || this.prng.getRandom(NATIONS);
            const name = `${this.prng.getRandom(nation.name_templates.first)} ${this.prng.getRandom(nation.name_templates.last)}`;
            let attributes: CoachAttributes | ScoutAttributes | PhysioAttributes;
            if (role.includes('Coach') || role === 'Assistant Manager' || role === 'Head of Youth Development') {
                attributes = {
                    attacking: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    defending: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    technical: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    tactical: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    mental: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    working_with_youth: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                };
            } else if (role === 'Chief Scout') {
                attributes = {
                    judging_ability: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    judging_potential: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    adaptability: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                };
            } else { // Physio
                attributes = {
                    physiotherapy: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                    prevention: this.prng.getBiasedRandom(5, 20, 0.5, 1),
                };
            }
            staff.push({
                id: `staff_${this.staffIdCounter++}`,
                name,
                club_id: club.id,
                nation_id: nation.id,
                role,
                attributes
            });
        });
        return staff;
    }

    public initializeWorld(): { players: Player[], staff: Staff[], clubs: Club[] } {
        const players: Player[] = [];
        const staff: Staff[] = [];
        const clubsWithBudgets = CLUBS.map(club => {
            const financeTierMultipliers = { 'Rich': 1.5, 'Secure': 1.0, 'Okay': 0.7, 'Insecure': 0.4 };
            const multiplier = financeTierMultipliers[club.finances];
            return {
                ...club,
                transfer_budget: Math.floor(this.prng.getBiasedRandom(1000000, 10000000, 0.2, 1) * multiplier),
                wage_budget: Math.floor(this.prng.getBiasedRandom(50000, 200000, 0.2, 1) * multiplier),
            }
        });

        clubsWithBudgets.forEach(club => {
            for (let i = 0; i < 22; i++) {
                players.push(this.generatePlayer(club));
            }
            const clubStaff = this.generateStaff(club);
            staff.push(...clubStaff);
            club.staff_ids = clubStaff.map(s => s.id);
        });

        return { players, staff, clubs: clubsWithBudgets };
    }

     public generateMatchSummary(homeTeam: Club, awayTeam: Club, events: any[]): string {
        const homeGoals = events.filter(e => e.team === 'home' && e.type === 'Goal').length;
        const awayGoals = events.filter(e => e.team === 'away' && e.type === 'Goal').length;
        return `A match between ${homeTeam.name} and ${awayTeam.name} ended ${homeGoals}-${awayGoals}.`;
    }

    public generateGuildScenario(guild: Guild, club: Club): { subject: string; body: string; actions: GuildAction[] } | null {
        const template = this.prng.getRandom(guild.scenarioTemplates);
        if (template) {
            return {
                subject: template.subject,
                body: template.body.replace('[CLUB_NAME]', club.name),
                actions: template.actions
            };
        }
        return null;
    }
}

export const ACC = new AetheriumChronicleCore();
