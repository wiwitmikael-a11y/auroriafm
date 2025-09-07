import { MatchEvent } from "../types";

export const MATCH_EVENTS: MatchEvent[] = [
    { minute: 5, type: 'Commentary', team: 'none', description: "The teams are sizing each other up in the early minutes. Avalon Albion controlling possession." },
    { minute: 12, type: 'Chance', team: 'home', player: 'Celeste Morningstar', description: "Celeste Morningstar unleashes a long-range shot that whistles just past the post! So close!" },
    { minute: 23, type: 'Goal', team: 'home', player: 'Celeste Morningstar', description: "GOAL! A moment of magic from Morningstar! She weaves through the midfield and curls a beautiful shot into the top corner! 1-0 to Albion!" },
    { minute: 35, type: 'Card', team: 'away', player: 'Magnus Ironfoot', description: "Yellow card for Magnus Ironfoot for a clumsy, steam-powered tackle from behind." },
    { minute: 45, type: 'Commentary', team: 'none', description: "Halftime. Avalon Albion leads 1-0 thanks to that stunner from their star player." },
    { minute: 58, type: 'Chance', team: 'away', player: 'Magnus Ironfoot', description: "Ironfoot with a powerful header from a corner, but it's straight at the keeper! He'll be disappointed with that." },
    { minute: 67, type: 'Sub', team: 'home', description: "Substitution for Avalon Albion. A younger, faster winger comes on." },
    { minute: 78, type: 'Goal', team: 'away', player: 'Magnus Ironfoot', description: "GOAL! Gearhaven equalise! Ironfoot smashes home a rebound from close range after a goalmouth scramble. It's 1-1!" },
    { minute: 89, type: 'Chance', team: 'home', player: 'Celeste Morningstar', description: "A free-kick from Morningstar in a dangerous position... she hits the crossbar! Agonizingly close for Albion!" },
    { minute: 90, type: 'Commentary', team: 'none', description: "Full time. It ends in a 1-1 draw. A hard-fought point for both teams." },
];