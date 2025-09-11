// api/generateNicknames.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
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
      Generate 4 creative, thematic nicknames for a steampunk fantasy football player.
      Base the nicknames on their attributes, origin, and playstyle.
      Player Data:
      - Name: ${player.name.first} ${player.name.last}
      - Position: ${player.position}
      - Personality: ${player.personality}
      - Highest Attribute: ${Object.keys(player.attributes).reduce((a, b) => player.attributes[a] > player.attributes[b] ? a : b)}
      - Nation: ${player.nation_id}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
          },
          required: ['nicknames']
        }
      }
    });

    const jsonResponse = JSON.parse(response.text);
    return res.status(200).json({ success: true, nicknames: jsonResponse.nicknames });

  } catch (error: any) {
    console.error('Error calling Gemini API for nicknames:', error);
    const errorMessage = error.message || 'An internal server error occurred.';
    return res.status(500).json({ success: false, error: `Failed to get nicknames from AI. Details: ${errorMessage}` });
  }
}
