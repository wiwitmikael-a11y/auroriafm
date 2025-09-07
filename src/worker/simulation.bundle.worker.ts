// This is a bundled worker file. In a real project, this would be the output of a build process.
// For this environment, we'll manually "bundle" the necessary code.

// --- Start of inlined dependencies ---

const NATIONS = [
    { id: 'avalon', name: 'Republic of Avalon', adjective: 'Avalonian', name_templates: { first: ['Arthur', 'Gideon', 'Celeste', 'Rowan'], last: ['Stonewall', 'Swift', 'Morningstar', 'Highwind'] } },
    { id: 'gearhaven', name: 'Imperium of Gearhaven', adjective: 'Gearhavenite', name_templates: { first: ['Magnus', 'Bron', 'Valeria', 'Corvus'], last: ['Ironfoot', 'Cogsworth', 'Hammerhand', 'Steamwright'] } },
    { id: 'arcadia', name: 'Kingdom of Arcadia', adjective: 'Arcadian', name_templates: { first: ['Lyra', 'Aelar', 'Faelan', 'Sorina'], last: ['Silversong', 'Moonshadow', 'Starcaller', 'Spellweaver'] } },
    { id: 'grimmr', name: 'Konfederacy of Grimmr', adjective: 'Grimmric', name_templates: { first: ['Uzgoth', 'Grom', 'Karga', 'Thora'], last: ['Skullcrusher', 'Axebeak', 'Ironhide', 'Stonefist'] } },
    { id: 'solis', name: 'Sunstone Queendom of Solis', adjective: 'Solian', name_templates: { first: ['Zafina', 'Kaelen', 'Nia', 'Rashid'], last: ['Sandstrider', 'Dunehunter', 'Sunstone', 'Mirage'] } },
    { id: 'veridia', name: 'Veridian Grove-Clans', adjective: 'Veridian', name_templates: { first: ['Cian', 'Briar', 'Faolan', 'Rhiannon'], last: ['Wildheart', 'Thornback', 'Riverun', 'Greenmantle'] } }
];

const TRAITS = {
    LEADERSHIP: { name: 'Leadership', description: 'Inspires teammates on the pitch.' },
    POWER_HEADER: { name: 'Power Header', description: 'A major aerial threat.' }
};

const PLAYSTYLES = [
    { id: 'poacher', name: 'Poacher' }, { id: 'aether_weaver', name: 'Aether-Weaver' },
    { id: 'cogwork_defender', name: 'Cogwork Defender' }, { id: 'ball_winner', name: 'Ball-Winner' },
    { id: 'versatile', name: 'Versatile' }
];

class ACC_Worker {
    seed = 0;
    playerIdCounter = 22 * 14; // Start after initial world gen

    initialize(seed) { this.seed = seed; }

    prng = {
        seededRandom: () => {
            let t = this.seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        },
        getRandom: (arr) => arr[Math.floor(this.prng.seededRandom() * arr.length)],
        getBiasedRandom: (min, max, bias, influence) => {
            const r = this.prng.seededRandom();
            const mix = this.prng.seededRandom() * influence;
            return Math.floor((r * (1 - mix) + bias * mix) * (max - min)) + min;
        }
    };

    generatePlayerName(nation) { return { first: this.prng.getRandom(nation.name_templates.first), last: this.prng.getRandom(nation.name_templates.last) }; }
    
    generatePlayer(id, club, isYouth = false) {
        const nation = NATIONS.find(n => n.id === club.nation_id) || this.prng.getRandom(NATIONS);
        const age = isYouth ? this.prng.getBiasedRandom(16, 19, 0, 1) : this.prng.getBiasedRandom(18, 34, 0.3, 1);
        const potential_ability = isYouth ? this.prng.getBiasedRandom(80, 200, 0.6, 1) : this.prng.getBiasedRandom(80, 200, 0.7, 1);
        const current_ability = isYouth ? this.prng.getBiasedRandom(20, 80, 0.5, 1) : Math.min(potential_ability, this.prng.getBiasedRandom(90, 160, 0.5, 1));
        const positions = ['GK', 'DF', 'MF', 'FW'];
        const attributes = { speed: 1, stamina: 1, strength: 1, aggression: 1, injury_proneness: 1, shooting: 1, dribbling: 1, passing: 1, tackling: 1, composure: 1, vision: 1, consistency: 1, important_matches: 1, arcane_dribble: 1, elemental_shot: 1, temporal_flux: 1 };
        Object.keys(attributes).forEach(key => {
            attributes[key] = Math.max(1, Math.min(20, this.prng.getBiasedRandom(1, 21, (current_ability / 200), 1)));
        });
        const rarityRoll = this.prng.seededRandom();
        const personalities = ['Ambitious', 'Loyal', 'Professional', 'Temperamental'];
        return {
            id: `player_${id}`, name: this.generatePlayerName(nation), club_id: club.id, nation_id: nation.id, age, position: this.prng.getRandom(positions),
            playstyle_id: 'versatile', rarity: rarityRoll > 0.99 ? 'Legend' : rarityRoll > 0.9 ? 'Epic' : rarityRoll > 0.6 ? 'Rare' : 'Common',
            personality: this.prng.getRandom(personalities), current_ability, potential_ability, attributes, traits: [this.prng.getRandom(Object.keys(TRAITS))],
            squad_status: 'Prospect', value: Math.floor(Math.pow(current_ability, 1.8) * 50), morale: 'Fair',
            preferred_foot: this.prng.getRandom(['Left', 'Right']), history: [], scouting_knowledge: 20, training_focus: null,
        };
    }

    generateYouthIntakeForClub(club) {
        const newPlayers = [];
        const intakeSize = this.prng.getBiasedRandom(5, 10, 0.5, 1) + Math.round(club.youth_facilities);
        for(let i = 0; i < intakeSize; i++) {
            newPlayers.push(this.generatePlayer(String(this.playerIdCounter++), club, true));
        }
        return newPlayers;
    }

    generateDescriptiveScoutingReport(player) {
        const best = Object.entries(player.attributes).reduce((a, b) => a[1] > b[1] ? a : b);
        const worst = Object.entries(player.attributes).reduce((a, b) => a[1] < b[1] ? a : b);
        const playstyle = PLAYSTYLES.find(p => p.id === player.playstyle_id);
        const nation = NATIONS.find(n => n.id === player.nation_id);
        let report = `A ${player.age}-year-old ${nation?.adjective || ''} ${player.position}, he fits the mold of a "${playstyle?.name || 'versatile player'}".\n\n`;
        report += `His standout quality is undoubtedly his ${best[0].replace(/_/g, ' ')}.\n`;
        report += `However, he'll need to work on his ${worst[0].replace(/_/g, ' ')}.\n\n`;
        if (player.potential_ability > 150) report += `Overall, he is a player with significant potential.`;
        else report += `A solid player who could do a job for most teams at this level.`;
        return report;
    }
}

const ACC = new ACC_Worker();

const matchSimulator = {
    run: (homeTeam, awayTeam, allPlayers) => {
        const homeXI = allPlayers.filter(p => p.club_id === homeTeam.id).sort((a,b) => b.current_ability - a.current_ability).slice(0, 11);
        const awayXI = allPlayers.filter(p => p.club_id === awayTeam.id).sort((a,b) => b.current_ability - a.current_ability).slice(0, 11);
        const getRating = (xi, tactics) => {
            if (xi.length === 0) return 100;
            const base = xi.reduce((s, p) => s + p.current_ability, 0) / xi.length;
            let mod = 0;
            if (tactics.mentality.includes('Attacking')) mod = 5;
            if (tactics.mentality.includes('Defensive')) mod = -5;
            return base + mod;
        };
        const homeRating = getRating(homeXI, homeTeam.tactics), awayRating = getRating(awayXI, awayTeam.tactics);
        const diff = homeRating - awayRating;
        let homeScore = 0, awayScore = 0;
        const events = [];
        const expectedGoals = 1.5 + (homeRating + awayRating) / 200;
        const homeChance = (expectedGoals / 90) * (1.1 + diff / 100);
        const awayChance = (expectedGoals / 90) * (0.9 - diff / 100);
        for (let minute = 1; minute <= 90; minute++) {
            if (ACC.prng.seededRandom() < homeChance) { homeScore++; const s = ACC.prng.getRandom(homeXI.filter(p=>p.position!=='GK')); if(s) events.push({ minute, type: 'Goal', team: 'home', player: `${s.name.first} ${s.name.last}` }); }
            if (ACC.prng.seededRandom() < awayChance) { awayScore++; const s = ACC.prng.getRandom(awayXI.filter(p=>p.position!=='GK')); if(s) events.push({ minute, type: 'Goal', team: 'away', player: `${s.name.first} ${s.name.last}` }); }
        }
        return { home_team_id: homeTeam.id, away_team_id: awayTeam.id, home_score: homeScore, away_score: awayScore, events };
    }
};

let messageIdCounter = 500;
const NEWS_GENERATOR_WORKER = {
    generateMatchdaySummaryMessage: (results, clubs, date) => {
        let body = `Results from Day ${date.day}:\n\n`;
        results.forEach(res => {
            const home = clubs.find(c => c.id === res.home_team_id)?.short_name;
            const away = clubs.find(c => c.id === res.away_team_id)?.short_name;
            body += `${home} ${res.home_score} - ${res.away_score} ${away}\n`;
        });
        return { id: `msg${messageIdCounter++}`, type: 'Media', sender: 'Aurorian Sports Network', subject: `League Results - Day ${date.day}`, date: `Season ${date.season}, Day ${date.day}`, body, isRead: false };
    },
    generateScoutingReportMessage: (player, date, reportText) => ({
        id: `msg_scout_${player.id}`, type: 'Scouting', sender: 'Chief Scout', subject: `Scouting Report: ${player.name.first} ${player.name.last}`,
        date: `Season ${date.season}, Day ${date.day}`, body: `Gaffer,\n\nThe full report is in.\n\n--- SCOUT'S SUMMARY ---\n${reportText}\n\nAll details are now revealed.`, isRead: false
    }),
    generateYouthIntakeMessage: (club, newPlayers, date) => {
        const best = [...newPlayers].sort((a, b) => b.potential_ability - a.potential_ability)[0];
        let body = `This season's crop of ${newPlayers.length} young talents has arrived.\n\n`;
        if (best) body += `The standout prospect appears to be ${best.name.first} ${best.name.last}, a promising ${best.position}.`;
        return { id: `msg_youth_${club.id}_${date.day}`, type: 'Youth', sender: 'Head of Youth Development', subject: `Youth Intake at ${club.name}`, date: `Season ${date.season}, Day ${date.day}`, body, isRead: false };
    },
    generatePlayerComplaintMessage: (player, date) => ({
        id: `msg_complaint_${player.id}_${date.day}`, type: 'Staff', sender: 'Assistant Manager', subject: `Issue from ${player.name.last}`,
        date: `Season ${date.season}, Day ${date.day}`, body: `Gaffer,\n\n${player.name.first} ${player.name.last} is unhappy with their playing time. Given their temperamental nature, this may need attention.`, isRead: false
    })
};

// --- End of inlined dependencies ---


self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'ADVANCE_DAY') {
        const { players, clubs, gameDate, scoutingAssignments, fixtures, leagueTable } = payload;
        
        ACC.initialize(gameDate.season * 1000 + gameDate.day);

        const newGameDate = { ...gameDate, day: gameDate.day + 1 };
        const newMessages = [];
        let updatedPlayers = JSON.parse(JSON.stringify(players));
        let updatedLeagueTable = JSON.parse(JSON.stringify(leagueTable));
        
        // 1. Simulate matches
        const todaysFixtures = fixtures.filter(f => f.day === newGameDate.day);
        const matchResults = [];
        if (todaysFixtures.length > 0) {
            todaysFixtures.forEach(fixture => {
                const homeTeam = clubs.find(c => c.id === fixture.home_team_id);
                const awayTeam = clubs.find(c => c.id === fixture.away_team_id);
                const alreadyPlayed = updatedLeagueTable.find(r => r.club_id === homeTeam.id)?.p > leagueTable.find(r => r.club_id === homeTeam.id)?.p;
                if (homeTeam && awayTeam && !alreadyPlayed) {
                    const result = matchSimulator.run(homeTeam, awayTeam, updatedPlayers);
                    matchResults.push(result);
                    const hIdx = updatedLeagueTable.findIndex(r => r.club_id === result.home_team_id), aIdx = updatedLeagueTable.findIndex(r => r.club_id === result.away_team_id);
                    if (hIdx > -1) { updatedLeagueTable[hIdx].p++; updatedLeagueTable[hIdx].gf += result.home_score; updatedLeagueTable[hIdx].ga += result.away_score; }
                    if (aIdx > -1) { updatedLeagueTable[aIdx].p++; updatedLeagueTable[aIdx].gf += result.away_score; updatedLeagueTable[aIdx].ga += result.home_score; }
                    if (result.home_score > result.away_score) { if(hIdx > -1) {updatedLeagueTable[hIdx].pts += 3; updatedLeagueTable[hIdx].w++;} if(aIdx > -1) updatedLeagueTable[aIdx].l++; }
                    else if (result.away_score > result.home_score) { if(aIdx > -1) {updatedLeagueTable[aIdx].pts += 3; updatedLeagueTable[aIdx].w++;} if(hIdx > -1) updatedLeagueTable[hIdx].l++; }
                    else { if(hIdx > -1) {updatedLeagueTable[hIdx].pts += 1; updatedLeagueTable[hIdx].d++;} if(aIdx > -1) {updatedLeagueTable[aIdx].pts += 1; updatedLeagueTable[aIdx].d++;} }
                }
            });
            updatedLeagueTable.forEach(r => { r.gd = r.gf - r.ga; });
            updatedLeagueTable.sort((a,b) => b.pts - a.pts || b.gd - a.gd).forEach((r, i) => r.pos = i + 1);
            if(matchResults.length > 0) newMessages.push(NEWS_GENERATOR_WORKER.generateMatchdaySummaryMessage(matchResults, clubs, newGameDate));
        }

        // 2. Update scouting
        const updatedScouting = scoutingAssignments.map(a => ({ ...a, daysRemaining: a.daysRemaining - 1 })).filter(a => a.daysRemaining > 0);
        const finishedScouting = scoutingAssignments.filter(a => a.daysRemaining <= 1);
        finishedScouting.forEach(assignment => {
            const pIndex = updatedPlayers.findIndex(p => p.id === assignment.playerId);
            if (pIndex > -1) {
                updatedPlayers[pIndex].scouting_knowledge = 100;
                const player = updatedPlayers[pIndex];
                const reportText = ACC.generateDescriptiveScoutingReport(player);
                newMessages.push(NEWS_GENERATOR_WORKER.generateScoutingReportMessage(player, newGameDate, reportText));
            }
        });

        // 3. Player Training
        updatedPlayers.forEach(p => {
            if (p.training_focus && ACC.prng.seededRandom() < 0.2) {
                const { type, value } = p.training_focus;
                let attrsToBoost = [];
                if (type === 'Attribute Group') {
                    if (value === 'Physical') attrsToBoost = ['speed', 'stamina', 'strength'];
                    else if (value === 'Technical') attrsToBoost = ['shooting', 'dribbling', 'passing', 'tackling'];
                } else { attrsToBoost = [value]; }
                if (attrsToBoost.length > 0) {
                    const attr = ACC.prng.getRandom(attrsToBoost);
                    if (p.attributes[attr] < 20 && p.attributes[attr] * 10 < p.potential_ability) p.attributes[attr] += 1;
                }
            }
        });

        // 4. Personality Events & Youth Intake
        clubs.forEach(club => {
             // Youth Intake
            if (club.youthIntakeDay === newGameDate.day) {
                const newYouth = ACC.generateYouthIntakeForClub(club);
                updatedPlayers.push(...newYouth);
                newMessages.push(NEWS_GENERATOR_WORKER.generateYouthIntakeMessage(club, newYouth, newGameDate));
            }
            // Personality
            updatedPlayers.filter(p => p.club_id === club.id).forEach(player => {
                if (player.personality === 'Temperamental' && (player.morale === 'Poor' || player.morale === 'Low') && ACC.prng.seededRandom() < 0.1) {
                    newMessages.push(NEWS_GENERATOR_WORKER.generatePlayerComplaintMessage(player, newGameDate));
                }
            });
        });

        self.postMessage({
            type: 'ADVANCE_DAY_RESULT',
            payload: {
                gameDate: newGameDate, players: updatedPlayers, leagueTable: updatedLeagueTable,
                newMessages, scoutingAssignments: updatedScouting,
            }
        });
    }
};

self.postMessage({ type: 'READY' });