// api/generateLore.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { Player } from '../src/types'; // Mengimpor tipe dari direktori src

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const player: Player = req.body.player;

  if (!player) {
    return res.status(400).json({ success: false, error: 'Player data is required.' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('API_KEY is not set.');
    return res.status(500).json({ success: false, error: 'Server configuration error: API key not found.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Generate a short, flavorful backstory (lore) for a steampunk fantasy football player.
      The backstory should be 2-3 sentences, written in an evocative, "Chronicler's" style.
      It should be based on the following player data:
      - Name: ${player.name.first} ${player.name.last}
      - Age: ${player.age}
      - Position: ${player.position}
      - Rarity: ${player.rarity}
      - Personality: ${player.personality}
      - Key Attributes: Speed (${player.attributes.speed}), Strength (${player.attributes.strength}), Shooting (${player.attributes.shooting}), Arcane Dribble (${player.attributes.arcane_dribble})
      - Traits: ${player.traits.join(', ')}

      Do not repeat the input data. Weave it into a compelling narrative.
      Example: "Hailing from the soot-stained workshops of Gearhaven, Magnus 'The Wrecking Ball' Ironfoot is more akin to a siege engine than a footballer. His shots carry the force of a steam-piston, a testament to his single-minded pursuit of power over finesse."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ success: true, lore: response.text });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error.message || 'An internal server error occurred.';
    return res.status(500).json({ success: false, error: `Failed to get response from AI. Details: ${errorMessage}` });
  }
}
