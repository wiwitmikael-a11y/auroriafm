import { PlayerRole } from '../types';

export const PLAYER_ROLES: { [key: string]: PlayerRole } = {
    'DEEP_LYING_PLAYMAKER': {
        name: 'Deep-Lying Playmaker',
        description: 'Operates from a deep position, aiming to control the game with precise passing and vision.',
        position: ['MID', 'DEF'],
        key_attributes: ['passing', 'vision', 'composure', 'temporal_flux'],
    },
    'BALL_WINNING_MIDFIELDER': {
        name: 'Ball-Winning Midfielder',
        description: 'A midfield destroyer whose main job is to win the ball back through tackling and aggression.',
        position: ['MID'],
        key_attributes: ['tackling', 'aggression', 'stamina', 'strength'],
    },
    'TARGET_MAN': {
        name: 'Target Man',
        description: 'A physically imposing forward who acts as a focal point for attacks, holding up the ball.',
        position: ['STR', 'ATT'],
        key_attributes: ['strength', 'shooting', 'composure'],
    },
    'POACHER': {
        name: 'Poacher',
        description: 'A predatory striker who excels at finding space in the box and finishing clinically.',
        position: ['STR', 'ATT'],
        key_attributes: ['shooting', 'speed', 'composure', 'elemental_shot'],
    },
    'ARCANE_WINGER': {
        name: 'Arcane Winger',
        description: 'A tricky wide player who uses magical dribbling and speed to beat opponents.',
        position: ['MID', 'ATT'],
        key_attributes: ['arcane_dribble', 'dribbling', 'speed', 'vision'],
    }
};