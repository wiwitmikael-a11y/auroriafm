import { InboxMessage } from '../types';

export const INITIAL_MESSAGES: InboxMessage[] = [
    {
        id: 'msg001',
        type: 'System',
        sender: 'Aurorian Football Association',
        subject: 'Welcome to Avalon Albion!',
        date: 'Season 1, Day 1',
        body: `Manager,\n\nOn behalf of the AFA, welcome to your new position at Avalon Albion. We trust your leadership will bring honor and glory to the club.\n\nThe board has set a preliminary expectation of a mid-table finish this season. Of course, we know you're aiming much higher.\n\nYour office at the Commonwealth Grounds is ready. The staff awaits your direction.\n\nMay your tactics be sharp and your players inspired.\n\n- Lord Harrington, AFA President`,
        isRead: false,
    },
    {
        id: 'msg002',
        type: 'Scouting',
        sender: 'Elara Vance, Chief Scout',
        subject: 'Initial Report: Magnus Ironfoot',
        date: 'Season 1, Day 2',
        body: `Gaffer,\n\nAs requested, here's the preliminary file on Magnus Ironfoot of Gearhaven United. He's a powerhouse, a classic Gearhavenite ST built like a steam-golem. His "Overpressure Shot" is known to dent goalposts and keepers' morale in equal measure.\n\n**Strengths:** Raw power, finishing, undeniable physical presence.\n**Weaknesses:** Not the quickest, and his magical affinity is non-existent. He solves problems with force, not finesse.\n\nHe would be a massive asset for breaking down stubborn defences, but acquiring him from a rival like Gearhaven would require a king's ransom in Aurorium Coin. I'll continue to monitor his situation.\n\nRegards,\nElara`,
        isRead: false,
    },
    {
        id: 'msg003',
        type: 'Guild',
        sender: 'The Chroniclers\' Society',
        subject: 'Introductory Communique',
        date: 'Season 1, Day 2',
        body: `Manager of Albion,\n\nGreetings from the Society. We who write the first draft of history will be watching your career with great interest. The Gazette of Gears is always hungry for a good story—be it triumph or tragedy.\n\nOur scribes are at your disposal for official press conferences. Remember, public perception is a powerful tool in The Great Game. Wield it wisely.\n\nMay your legacy be worthy of song.\n\n- The Curators`,
        isRead: true,
    },
     {
        id: 'msg004',
        type: 'Staff',
        sender: 'Master Alchemist Regis',
        subject: 'Potion Stock Report',
        date: 'Season 1, Day 3',
        body: `Manager,\n\nOur inventory of Stamina Draughts and Minor Mana Potions is sufficient for the upcoming fixture. However, I must warn you that our supply of Quicksilver Elixirs is running low.\n\nIf we plan to face a particularly fast winger from a club like Dragonflame Knights, I recommend we place an order with the Alchemist's Union soon. Their prices have been steep lately.\n\nYours in science,\nRegis`,
        isRead: false,
    }
];