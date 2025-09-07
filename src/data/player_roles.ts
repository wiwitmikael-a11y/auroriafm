import { PlayerRole } from '../types';

export const PLAYER_ROLES: { [key: string]: PlayerRole } = {
    // Original Roles
    'DEEP_LYING_PLAYMAKER': {
        name: 'Deep-Lying Playmaker',
        description: 'Operates from a deep position, aiming to control the game with precise passing and vision.',
        position: ['MF', 'DF'],
        key_attributes: ['passing', 'vision', 'composure', 'temporal_flux'],
    },
    'BALL_WINNING_MIDFIELDER': {
        name: 'Ball-Winning Midfielder',
        description: 'A midfield destroyer whose main job is to win the ball back through tackling and aggression.',
        position: ['MF'],
        key_attributes: ['tackling', 'aggression', 'stamina', 'strength'],
    },
    'TARGET_MAN': {
        name: 'Target Man',
        description: 'A physically imposing forward who acts as a focal point for attacks, holding up the ball.',
        position: ['FW'],
        key_attributes: ['strength', 'shooting', 'composure'],
    },
    'POACHER': {
        name: 'Poacher',
        description: 'A predatory striker who excels at finding space in the box and finishing clinically.',
        position: ['FW'],
        key_attributes: ['shooting', 'speed', 'composure', 'elemental_shot'],
    },
    'ARCANE_WINGER': {
        name: 'Arcane Winger',
        description: 'A tricky wide player who uses magical dribbling and speed to beat opponents.',
        position: ['MF', 'FW'],
        key_attributes: ['arcane_dribble', 'dribbling', 'speed', 'vision'],
    },
    // New Lore-Friendly Roles
    'COGWORK_DEFENDER': {
        name: 'Cogwork Defender',
        description: 'A stoic and powerful defender who relies on strength, timing, and mechanical efficiency.',
        position: ['DF'],
        key_attributes: ['tackling', 'strength', 'composure', 'consistency'],
    },
    'AETHER_WEAVER': {
        name: 'Aether-Weaver',
        description: 'A creative midfielder who weaves magical passes and controls the tempo with arcane arts.',
        position: ['MF'],
        key_attributes: ['passing', 'vision', 'arcane_dribble', 'temporal_flux'],
    },
    'QUICKSILVER_FORWARD': {
        name: 'Quicksilver Forward',
        description: 'An incredibly fast attacker who excels at running behind the defensive line.',
        position: ['FW'],
        key_attributes: ['speed', 'dribbling', 'shooting', 'composure'],
    }
};