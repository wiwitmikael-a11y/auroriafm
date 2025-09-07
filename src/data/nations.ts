import { Nation } from '../types';

export const NATIONS: Nation[] = [
    {
        id: 'avalon',
        name: 'Republic of Avalon',
        adjective: 'Avalonian',
        name_templates: {
            first: ['Arthur', 'Gideon', 'Celeste', 'Rowan', 'Kaelan', 'Isolde'],
            last: ['Stonewall', 'Swift', 'Morningstar', 'Highwind', 'Brightmore'],
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
            first: ['Magnus', 'Bron', 'Valeria', 'Corvus', 'Griselda', 'JAX-7'],
            last: ['Ironfoot', 'Cogsworth', 'Hammerhand', 'Steamwright', 'Piston'],
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
            first: ['Lyra', 'Aelar', 'Faelan', 'Sorina', 'Valerius', 'Elara'],
            last: ['Silversong', 'Moonshadow', 'Starcaller', 'Spellweaver', 'Sunstrider'],
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
            first: ['Uzgoth', 'Grom', 'Karga', 'Thora', 'Borin', 'Grak'],
            last: ['Skullcrusher', 'Axebeak', 'Ironhide', 'Stonefist', 'Direfang'],
        },
        attribute_biases: {
            aggression: 4,
            strength: 3,
            tackling: 2,
            vision: -3,
        }
    }
];