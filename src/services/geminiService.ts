import { Player } from '../types';
import { ACC } from '../engine/ACC';

function generatePlayerLore(player: Player): string {
    try {
        const lore = ACC.generatePlayerLore(player);
        return lore.trim();
    } catch (error) {
        console.error("Procedural lore generation failed:", error);
        return "The Chroniclers' records on this player are currently unavailable. Perhaps their story is yet to be written.";
    }
}

export const geminiService = {
    generatePlayerLore,
};
