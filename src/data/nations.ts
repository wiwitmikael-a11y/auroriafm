import { Nation } from '../types';

export const NATIONS: Nation[] = [
    {
        id: 'avalon',
        name: 'Republic of Avalon',
        adjective: 'Avalonian',
        name_templates: {
            first: ['Arthur', 'Gideon', 'Celeste', 'Rowan', 'Kaelan', 'Isolde', 'Percival', 'Elara'],
            last: ['Stonewall', 'Swift', 'Morningstar', 'Highwind', 'Brightmore', 'Oakheart'],
        },
        attribute_biases: {
            composure: 2,
            vision: 2,
            passing: 1,
        }
    },
    {
        id: 'gearhaven',
        name: 'Imperium of Gearhaven',
        adjective: 'Gearhavenite',
        name_templates: {
            first: ['Magnus', 'Bron', 'Valeria', 'Corvus', 'Griselda', 'JAX-7', 'Kael', 'Petra'],
            last: ['Ironfoot', 'Cogsworth', 'Hammerhand', 'Steamwright', 'Piston', 'Fulcrum'],
        },
        attribute_biases: {
            strength: 3,
            stamina: 2,
            shooting: 1,
            arcane_dribble: -5,
        }
    },
    {
        id: 'arcadia',
        name: 'Kingdom of Arcadia',
        adjective: 'Arcadian',
        name_templates: {
            first: ['Lyra', 'Aelar', 'Faelan', 'Sorina', 'Valerius', 'Elara', 'Orion', 'Seraphina'],
            last: ['Silversong', 'Moonshadow', 'Starcaller', 'Spellweaver', 'Sunstrider', 'Aetherwing'],
        },
        attribute_biases: {
            arcane_dribble: 4,
            elemental_shot: 3,
            vision: 2,
            strength: -4,
        }
    },
    {
        id: 'grimmr',
        name: 'Konfederacy of Grimmr',
        adjective: 'Grimmric',
        name_templates: {
            first: ['Uzgoth', 'Grom', 'Karga', 'Thora', 'Borin', 'Grak', 'Ragnar', 'Fraya'],
            last: ['Skullcrusher', 'Axebeak', 'Ironhide', 'Stonefist', 'Direfang', 'Bloodtusk'],
        },
        attribute_biases: {
            aggression: 4,
            strength: 3,
            tackling: 2,
            vision: -3,
        }
    },
    // New Nations
    {
        id: 'solis',
        name: 'Sunstone Queendom of Solis',
        adjective: 'Solian',
        name_templates: {
            first: ['Zafina', 'Kaelen', 'Nia', 'Rashid', 'Samir', 'Layla'],
            last: ['Sandstrider', 'Dunehunter', 'Sunstone', 'Mirage', 'Scorpion'],
        },
        attribute_biases: {
            speed: 3,
            stamina: 3,
            dribbling: 1,
            strength: -2,
        }
    },
    {
        id: 'veridia',
        name: 'Veridian Grove-Clans',
        adjective: 'Veridian',
        name_templates: {
            first: ['Cian', 'Briar', 'Faolan', 'Rhiannon', 'Torin', 'Nessa'],
            last: ['Wildheart', 'Thornback', 'Riverun', 'Greenmantle', 'Barkhide'],
        },
        attribute_biases: {
            arcane_dribble: 2,
            tackling: 1,
            speed: 1,
            passing: 1,
            aggression: -2,
        }
    }
];
