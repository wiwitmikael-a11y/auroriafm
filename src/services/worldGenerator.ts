import { Player, Staff, Club } from '../types';
import { ACC } from '../engine/ACC';

/**
 * Initializes the game world by generating players and staff for all clubs.
 * This is a wrapper around the ACC engine's capabilities.
 * @param seed A numerical seed to ensure deterministic world generation.
 */
export const generateInitialWorld = (seed: number): { players: Player[], staff: Staff[], clubs: Club[] } => {
    ACC.initialize(seed);
    
    const { players, staff, clubs } = ACC.initializeWorld();

    return { players, staff, clubs };
};