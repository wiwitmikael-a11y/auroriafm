import { GoogleGenAI } from "@google/genai";
import { Player } from '../types';
import { NATIONS } from '../data/nations';
import { TRAITS } from "../data/traits";
import { PLAYSTYLES } from "../data/playstyles";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generatePlayerLore(player: Player): Promise<string> {
    const nation = NATIONS.find(n => n.id === player.nation_id);
    const traitDescriptions = player.traits.map(t => TRAITS[t]?.name || t).join(', ');
    const playstyle = PLAYSTYLES.find(p => p.id === player.playstyle_id);

    const prompt = `
        Generate a short, flavorful backstory for a fantasy football player in a world of steampunk and magic.
        The tone should be like a sports commentator's biographical segment. Keep it to 2-3 paragraphs.

        Player Details:
        - Name: ${player.name.first} ${player.name.last}
        - Nation: ${nation?.name} (${nation?.adjective})
        - Position: ${player.position}
        - Playstyle: ${playstyle?.name || 'Unknown'}
        - Key Traits: ${traitDescriptions || 'None notable'}
        - Rarity/Reputation: ${player.rarity}

        Based on these details, create a compelling narrative about his origins and how he came to be a professional player.
        For example, a Gearhavenite player might have worked in the forges, developing strength. An Arcadian might have honed their skills in a magical academy.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "The Chroniclers' records on this player are currently unavailable. Perhaps their story is yet to be written.";
    }
}

export const geminiService = {
    generatePlayerLore,
};