// FIX: This file had invalid content. Replaced it with a functional news generator service.
import { MatchResult, Club, GameDate, Player, InboxMessage } from '../types';

// A simple counter to ensure unique message IDs during a session.
let messageIdCounter = 200;

/**
 * Generates a media message summarizing the results of a matchday.
 */
const generateMatchdaySummaryMessage = (results: MatchResult[], clubs: Club[], date: GameDate): InboxMessage => {
    let body = `A roundup of the results from Day ${date.day}:\n\n`;
    results.forEach(res => {
        const home = clubs.find(c => c.id === res.home_team_id)?.short_name || 'HOM';
        const away = clubs.find(c => c.id === res.away_team_id)?.short_name || 'AWY';
        body += `${home} ${res.home_score} - ${res.away_score} ${away}\n`;
    });

    return {
        id: `msg_media_${date.day}_${messageIdCounter++}`,
        type: 'Media',
        sender: 'Aurorian Sports Network',
        subject: `League Results - Day ${date.day}`,
        date: `Season ${date.season}, Day ${date.day}`,
        body,
        isRead: false
    };
};

/**
 * Generates an inbox message for a completed scouting report.
 */
const generateScoutingReportMessage = (player: Player, date: GameDate, reportText: string): InboxMessage => {
     return {
        id: `msg_scout_${player.id}_${date.day}`,
        type: 'Scouting',
        sender: 'Chief Scout',
        subject: `Scouting Report: ${player.name.first} ${player.name.last}`,
        date: `Season ${date.season}, Day ${date.day}`,
        body: `Gaffer,\n\nThe full report on ${player.name.last} is in.\n\n--- SCOUT'S SUMMARY ---\n${reportText}\n\nAll details are now revealed and have been updated in the player profile.`,
        isRead: false
    };
};

/**
 * Generates a welcome message from the Assistant Manager.
 */
const generateWelcomeMessage = (club: Club, asstManName: string, date: GameDate): InboxMessage => {
    return {
        id: `msg_welcome_asst_${club.id}`,
        type: 'Staff',
        sender: asstManName,
        subject: `First Day at ${club.name}`,
        date: `Season ${date.season}, Day ${date.day}`,
        body: `Gaffer,\n\nWelcome to the club. The lads are eager to get started under your leadership. We've got a big season ahead of us.\n\nAll the facilities are at your disposal. Let me know if you need anything.\n\nBest,\n${asstManName}`,
        isRead: false,
    };
};

/**
 * Generates a welcome message from the Club Board.
 */
const generateBoardWelcomeMessage = (club: Club, date: GameDate): InboxMessage => {
    return {
        id: `msg_welcome_board_${club.id}`,
        type: 'Staff',
        sender: `The Board of ${club.name}`,
        subject: 'Welcome to the Club',
        date: `Season ${date.season}, Day ${date.day}`,
        body: `Dear Manager,\n\nOn behalf of the entire board, we are delighted to welcome you to ${club.name}. We believe your vision and expertise are exactly what this club needs to achieve its ambitions.\n\nWe have placed our full confidence in you. We wish you the very best for the upcoming season.\n\nSincerely,\nThe Board`,
        isRead: false,
    };
};


export const newsGenerator = {
    generateMatchdaySummaryMessage,
    generateScoutingReportMessage,
    generateWelcomeMessage,
    generateBoardWelcomeMessage,
};