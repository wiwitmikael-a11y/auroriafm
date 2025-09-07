import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Player } from "../types";
import { NATIONS } from "../data/nations";
import { ACC } from '../engine/ACC';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePlayerNickname = async (player: Player): Promise<string[]> => {
    const nation = NATIONS.find(n => n.id === player.nation_id);
    const prompt = `Generate 5 cool, fantasy-themed nicknames for a football player named ${player.name.first} ${player.name.last}.
    He is ${player.age} years old from ${nation?.name || 'an unknown land'}.
    His position is ${player.position} and his best skills are reflected in his high attributes.
    He has the following traits: ${player.traits.join(', ')}.
    The nicknames should be short, memorable, and sound epic.
    Return the nicknames as a JSON array of strings in a "nicknames" property.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nicknames: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.nicknames || [];
    } catch (error) {
        console.error("Error generating nickname with Gemini:", error);
        // Fallback to procedural generation from ACC if API fails
        return ACC.generateNickname(player);
    }
};

export const generateCrestUrl = async (tags: string, palette: string[]): Promise<string> => {
    // This is a placeholder for where you might use Imagen
    // In a real implementation, you'd call ai.models.generateImages.
    // Here's a procedural placeholder to avoid breaking the UI.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" fill="${palette[0] || '#ccc'}" />
        <circle cx="50" cy="50" r="30" fill="${palette[1] || '#aaa'}" />
        <text x="50" y="55" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle">${tags.split(',')[0]}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};