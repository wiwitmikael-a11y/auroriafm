import { CulturalBlueprint } from '../types';

// This is the "World Knowledge" for the ACC engine.
// It defines the core cultural identity of each nation, which influences
// everything from player generation to visual asset design.

export const CULTURAL_BLUEPRINTS: { [key: string]: CulturalBlueprint } = {
    avalon: {
        name: 'Republic of Avalon',
        aesthetic_philosophy: {
            // Noble, traditional, balanced. Inspired by classic Arthurian legend.
            primary_shapes: ['shield', 'laurel_wreath'],
            secondary_patterns: ['checkers', 'stripes_vertical'],
            color_psychology: {
                primary: 'Deep Greens and Golds, symbolizing land and nobility.',
                secondary: 'Cream and Silver, representing honor and tradition.'
            },
            symbol_library_tags: ['lion', 'crown', 'sword', 'pillar']
        },
        tactical_philosophy: {
            // Prefers balanced, structured play.
            preferred_formations: ['4-4-2', '4-3-3'],
            mentality_bias: { 'Balanced': 0.6, 'Attacking': 0.2, 'Defensive': 0.2 },
            key_player_archetypes: ['knight', 'noble']
        },
        social_structure: {
            // Hierarchical but just. Produces disciplined players.
            player_archetype_distribution: { 'knight': 0.5, 'warrior': 0.3, 'commoner': 0.2 },
            common_personalities: ['Loyal', 'Professional']
        }
    },
    gearhaven: {
        name: 'Imperium of Gearhaven',
        aesthetic_philosophy: {
            // Industrial, pragmatic, powerful. Steampunk and brutalist influences.
            primary_shapes: ['gear', 'square'],
            secondary_patterns: ['rivets', 'grid'],
            color_psychology: {
                primary: 'Grays, Bronze, and Steel, for industry and strength.',
                secondary: 'Fiery Oranges and Golds, representing the forge.'
            },
            symbol_library_tags: ['gear', 'hammer', 'anvil', 'golem_head']
        },
        tactical_philosophy: {
            // Favors overwhelming force and physical dominance.
            preferred_formations: ['4-3-3', '5-3-2'],
            mentality_bias: { 'Attacking': 0.5, 'Balanced': 0.3, 'Defensive': 0.2 },
            key_player_archetypes: ['warrior', 'heavy', 'armor']
        },
        social_structure: {
            // Meritocratic and industrious. Produces hardworking players.
            player_archetype_distribution: { 'warrior': 0.8, 'commoner': 0.2 },
            common_personalities: ['Professional', 'Ambitious']
        }
    },
    arcadia: {
        name: 'Kingdom of Arcadia',
        aesthetic_philosophy: {
            // Magical, elegant, celestial. High fantasy and cosmic horror themes.
            primary_shapes: ['crescent_moon', 'star'],
            secondary_patterns: ['swirls', 'constellations'],
            color_psychology: {
                primary: 'Deep Purples, Blues, and Silvers, for magic and the night sky.',
                secondary: 'Luminescent Cyan and Magenta, for arcane energy.'
            },
            symbol_library_tags: ['star', 'book', 'scroll', 'crystal']
        },
        tactical_philosophy: {
            // Relies on technical and magical superiority over brute force.
            preferred_formations: ['4-3-3', '3-5-2'],
            mentality_bias: { 'Attacking': 0.4, 'Balanced': 0.5, 'Defensive': 0.1 },
            key_player_archetypes: ['mage', 'scholar', 'arcane']
        },
        social_structure: {
            // Scholarly and esoteric. Produces intelligent, sometimes frail players.
            player_archetype_distribution: { 'mage': 0.7, 'scholar': 0.2, 'commoner': 0.1 },
            common_personalities: ['Professional', 'Ambitious']
        }
    },
    grimmr: {
        name: 'Konfederacy of Grimmr',
        aesthetic_philosophy: {
            // Brutal, primal, intimidating. Viking and barbarian influences.
            primary_shapes: ['axe_head', 'sharp_angles'],
            secondary_patterns: ['scratches', 'chains'],
            color_psychology: {
                primary: 'Blood Reds and Charcoal Grays, for war and stone.',
                secondary: 'Bone White and Rusty Iron, representing conquest.'
            },
            symbol_library_tags: ['dragon', 'flame', 'axe', 'skull']
        },
        tactical_philosophy: {
            // Highly aggressive, physical, and direct.
            preferred_formations: ['3-5-2', '5-3-2'],
            mentality_bias: { 'Very Attacking': 0.4, 'Attacking': 0.4, 'Balanced': 0.2 },
            key_player_archetypes: ['berserker', 'warrior', 'battle_worn']
        },
        social_structure: {
            // Clan-based and martial. Produces aggressive and temperamental players.
            player_archetype_distribution: { 'warrior': 0.9, 'rogue': 0.1 },
            common_personalities: ['Temperamental', 'Ambitious']
        }
    },
    solis: {
        name: 'Sunstone Queendom of Solis',
        aesthetic_philosophy: {
            // Nomadic, swift, sun-worshipping. Ancient Egyptian and desert themes.
            primary_shapes: ['sun_disk', 'pyramid'],
            secondary_patterns: ['hieroglyphs', 'dunes'],
            color_psychology: {
                primary: 'Golds and Sand Browns, for the sun and desert.',
                secondary: 'Turquoise and Deep Purple, for oases and royalty.'
            },
            symbol_library_tags: ['sun', 'scarab', 'pyramid', 'shield']
        },
        tactical_philosophy: {
            // Fast-paced, counter-attacking football.
            preferred_formations: ['4-3-3'],
            mentality_bias: { 'Attacking': 0.6, 'Balanced': 0.4 },
            key_player_archetypes: ['nomad', 'agile', 'rogue']
        },
        social_structure: {
            // Tribal and adaptable. Produces fast and resilient players.
            player_archetype_distribution: { 'nomad': 0.6, 'warrior': 0.2, 'rogue': 0.2 },
            common_personalities: ['Loyal', 'Professional']
        }
    },
    veridia: {
        name: 'Veridian Grove-Clans',
        aesthetic_philosophy: {
            // Natural, wild, resilient. Celtic and druidic influences.
            primary_shapes: ['leaf', 'triskelion'],
            secondary_patterns: ['vines', 'wood_grain'],
            color_psychology: {
                primary: 'Forest Greens and Rich Browns, for the woods.',
                secondary: 'Amber and Stone Gray, for sap and ancient rocks.'
            },
            symbol_library_tags: ['tree', 'vine', 'beast_head', 'arrow']
        },
        tactical_philosophy: {
            // Versatile and adaptable, excelling in midfield control.
            preferred_formations: ['3-5-2', '4-4-2'],
            mentality_bias: { 'Balanced': 0.7, 'Attacking': 0.2, 'Defensive': 0.1 },
            key_player_archetypes: ['rogue', 'warrior', 'rugged']
        },
        social_structure: {
            // Communal and nature-bound. Produces versatile and hardy players.
            player_archetype_distribution: { 'rogue': 0.4, 'warrior': 0.3, 'commoner': 0.3 },
            common_personalities: ['Loyal', 'Professional']
        }
    }
};
