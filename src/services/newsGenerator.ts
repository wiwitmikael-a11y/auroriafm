import { Player, Club, MatchResult, GameDate, InboxMessage, Staff } from '../types';

let messageIdCounter = 100;

export const generateBoardWelcomeMessage = (club: Club, date: GameDate): InboxMessage => {
    return {
        id: `msg_welcome_${club.id}`,
        type: 'Board',
        sender: `The Board of ${club.name}`,
        subject: `Welcome to ${club.name}!`,
        date: `Season ${date.season}, Day ${date.day}`,
        body: `Manager,\n\nOn behalf of the entire board, we are delighted to welcome you to ${club.stadium}.\n\nWe have the utmost confidence that your leadership will guide us to a new era of success. The expectations are high, but we believe you are the right person to lead "${club.nickname}" to glory.\n\nThe staff and players await your instructions. Good luck.\n\n- The Board`,
        isRead: false,
    };
};

export const generateAssistantWelcomeMessage = (club: Club, date: GameDate, managerName: string, assistant?: Staff): InboxMessage => {
    const assistantName = assistant?.name || 'Your Assistant Manager';
    return {
        id: `msg_assistant_welcome_${club.id}`,
        type: 'Assistant',
        sender: assistantName,
        subject: `First Day at the Club`,
        date: `Season ${date.season}, Day ${date.day}`,
        body: `Gaffer ${managerName},\n\nWelcome to the club. The lads are eager to get started under your leadership. I've prepared the squad report and tactical overview for your review.\n\nI'm here to help with anything you need, from training schedules to opposition analysis. Just say the word.\n\nLet's get to work.\n\n- ${assistantName}`,
        isRead: false,
    };
}


export const generateMatchReportMessage = (result: MatchResult, clubs: Club[], date: GameDate): InboxMessage => {
    const homeTeam = clubs.find(c => c.id === result.home_team_id)!;
    const awayTeam = clubs.find(c => c.id === result.away_team_id)!;

    let subject = `Match Result: ${homeTeam.short_name} ${result.home_score} - ${result.away_score} ${awayTeam.short_name}`;
    let body = `A hard-fought match at ${homeTeam.stadium} has concluded.\n\nFinal Score: ${homeTeam.name} ${result.home_score} - ${result.away_score} ${awayTeam.name}.\n\n`;

    if (result.home_score > result.away_score) {
        body += `${homeTeam.name} secured a convincing victory today.`;
    } else if (result.away_score > result.home_score) {
        body += `${awayTeam.name} proved too strong on the day, taking the points on the road.`;
    } else {
        body += `The teams couldn't be separated, sharing the points in a tense draw.`;
    }
    
    const goalScorers = result.events.filter(e => e.type === 'Goal').map(e => e.player).filter(Boolean).join(', ');
    if (goalScorers) {
        body += `\n\nGoalscorers: ${goalScorers}.`;
    }

    return {
        id: `msg${messageIdCounter++}`,
        type: 'Media',
        sender: 'Gazette of Gears',
        subject,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    };
};

export const generateMatchdaySummaryMessage = (results: MatchResult[], clubs: Club[], date: GameDate): InboxMessage => {
    let body = `Here are the results from today's action in The Great Game:\n\n`;
    results.forEach(res => {
        const home = clubs.find(c => c.id === res.home_team_id)?.short_name;
        const away = clubs.find(c => c.id === res.away_team_id)?.short_name;
        body += `${home} ${res.home_score} - ${res.away_score} ${away}\n`;
    });

    const upset = results.find(res => {
        const homeClub = clubs.find(c => c.id === res.home_team_id)!;
        const awayClub = clubs.find(c => c.id === res.away_team_id)!;
        const homeRating = homeClub.training_facilities + homeClub.youth_facilities;
        const awayRating = awayClub.training_facilities + awayClub.youth_facilities;
        return (res.home_score < res.away_score && homeRating > awayRating + 2) || (res.home_score > res.away_score && awayRating > homeRating + 2);
    });

    if (upset) {
        const winner = upset.home_score > upset.away_score ? clubs.find(c => c.id === upset.home_team_id)! : clubs.find(c => c.id === upset.away_team_id)!;
        body += `\nIn the shock of the day, ${winner.name} pulled off a surprising victory.`;
    }

     return {
        id: `msg${messageIdCounter++}`,
        type: 'Media',
        sender: 'Aurorian Sports Network',
        subject: `League Results - Day ${date.day}`,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    };
};


export const generateScoutingReportMessage = (player: Player, date: GameDate, reportText: string): InboxMessage => {
    const subject = `Scouting Report: ${player.name.first} ${player.name.last}`;
    let body = `Gaffer,\n\nThe full report on ${player.name.first} ${player.name.last} is in. We now have a complete picture of his abilities.\n\n--- SCOUT'S SUMMARY ---\n${reportText}\n\nAll his details in the player profile are now fully updated.\n\n- Chief Scout`;

    return {
        id: `msg${messageIdCounter++}`,
        type: 'Scouting',
        sender: 'Chief Scout',
        subject,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    }
};

export const generateRivalryHypeMessage = (homeTeam: Club, awayTeam: Club, date: GameDate): InboxMessage => {
    const subject = `Rivalry Clash: ${homeTeam.name} vs ${awayTeam.name}!`;
    const body = `The air crackles with anticipation! A historic rivalry is renewed today as "${homeTeam.nickname}" host "${awayTeam.nickname}" at ${homeTeam.stadium}.\n\nBragging rights are on the line in what is sure to be a fiery encounter. The fans are expectant, and neither side will want to give an inch in this crucial league match-up. Expect fireworks!`;

     return {
        id: `msg${messageIdCounter++}`,
        type: 'Media',
        sender: 'Aurorian Sports Network',
        subject,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    };
};

export const generateYouthIntakeMessage = (club: Club, newPlayers: Player[], date: GameDate): InboxMessage => {
     if (newPlayers.length === 0) {
        return {
            id: `msg_youth_${club.id}_${date.day}`,
            type: 'Youth',
            sender: 'Head of Youth Development',
            subject: 'Disappointing Youth Intake',
            date: `Season ${date.season}, Day ${date.day}`,
            body: `Gaffer,\n\nUnfortunately, this year's crop of young talent has been underwhelming. We have not signed any new players to the academy this season.\n\nWe must hope for a better intake next year.`,
            isRead: false,
        };
    }

    const bestPlayer = [...newPlayers].sort((a,b) => b.potential_ability - a.potential_ability)[0];
    const subject = `Youth Intake Day at ${club.name}!`;
    let body = `Our Head of Youth Development reports that this season's crop of young talent has arrived at the club.\n\nA total of ${newPlayers.length} new players have been signed to youth contracts.`;
    if(bestPlayer) {
        body += `\n\nThe standout prospect appears to be ${bestPlayer.name.first} ${bestPlayer.name.last}, a promising ${bestPlayer.position} who our scouts believe has exceptional potential (${Math.round(bestPlayer.potential_ability/20)} star potential).`;
    }
    body += `\n\nThey are all available for review in the squad screen.`;
    
    return {
        id: `msg_youth_${club.id}_${date.day}`,
        type: 'Youth',
        sender: 'Head of Youth Development',
        subject,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    };
}

export const generatePlayerComplaintMessage = (player: Player, club: Club, date: GameDate): InboxMessage => {
    const subject = `Issue from ${player.name.first} ${player.name.last}`;
    const body = `Gaffer,\n\n${player.name.first} ${player.name.last} has come to me to complain about a lack of first-team opportunities. His morale has dropped as a result.\n\nGiven his temperamental nature, it might be wise to address this, either by playing him more or speaking with him directly.\n\n- Your Assistant`;

    return {
        id: `msg_complaint_${player.id}_${date.day}`,
        type: 'Staff',
        sender: 'Assistant Manager',
        subject,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    };
}


export const generatePlayerPerformanceMessage = (player: Player, club: Club, date: GameDate): InboxMessage => {
    const templates = [
        `Simply sensational! ${player.name.last} put on a masterclass for ${club.name} today, earning plaudits from fans and pundits alike.`,
        `The name on everyone's lips is ${player.name.first} ${player.name.last}. A truly dominant performance that will be remembered for some time.`,
        `They came, they saw, they conquered. ${player.name.last} was the architect of victory today with a performance that blended artistry with ruthless efficiency.`
    ];
    const subject = `Praise for ${player.name.last}`;
    const body = templates[Math.floor(Math.random() * templates.length)];
    
     return {
        id: `msg${messageIdCounter++}`,
        type: 'Media',
        sender: 'Gazette of Gears',
        subject,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false,
    };
}


export const generateSeasonEndMessage = (date: GameDate): InboxMessage => {
    return {
        id: `msg${messageIdCounter++}`,
        type: 'System',
        sender: 'Aurorian Football Association',
        subject: `Season ${date.season} Concludes`,
        date: `Season ${date.season}, Day ${date.day}`,
        body: `Manager,\n\nSeason ${date.season} has officially come to a close. The off-season will now begin, a time for reflection, rebuilding, and preparing for the next campaign.\n\nAll player histories have been updated, and the new season's fixtures will be generated shortly.\n\nWell done on navigating the trials of The Great Game.`,
        isRead: false,
    }
}