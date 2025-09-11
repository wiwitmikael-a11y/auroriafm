import { Player } from '../types';
import { ACC } from '../engine/ACC';

async function generatePlayerLore(player: Player): Promise<string> {
    try {
        const response = await fetch('/api/generateLore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch lore from API');
        }

        const data = await response.json();
        return data.lore.trim();
    } catch (error) {
        console.error("Gemini API lore generation failed, using fallback:", error);
        // Fallback to local procedural generation on error
        return ACC.generateFallbackPlayerLore(player).trim();
    }
}

export const geminiService = {
    generatePlayerLore,
};
