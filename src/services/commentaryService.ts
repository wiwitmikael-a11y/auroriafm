import { GoogleGenAI } from "@google/genai";
import { Player, Club } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';
const systemInstruction = "You are a dramatic, enthusiastic sports commentator for a football league in a steampunk and fantasy world called Auroria. Use flavorful, thematic language reflecting magic and technology (e.g., 'steam-powered shot', 'arcane dribble', 'precision engineering'). Keep commentary for a single event concise, like a real-time shout, under 30 words. Do not use markdown or asterisks.";

interface CommentaryContext {
    type: 'Goal' | 'Chance' | 'Card' | 'General' | 'Kickoff' | 'FullTime';
    minute: number;
    homeTeam: Club;
    awayTeam: Club;
    actingTeam: 'home' | 'away';
    player?: Player;
    homeScore: number;
    awayScore: number;
}

async function generateCommentary(context: CommentaryContext): Promise<string> {
    const actingTeamObject = context.actingTeam === 'home' ? context.homeTeam : context.awayTeam;
    let prompt = `Event: ${context.type} at ${context.minute}' minute. Score: ${context.homeTeam.short_name} ${context.homeScore} - ${context.awayTeam.short_name} ${context.awayScore}.`;

    switch (context.type) {
        case 'Kickoff':
            prompt = `The match between ${context.homeTeam.name} ("${context.homeTeam.nickname}") and ${context.awayTeam.name} ("${context.awayTeam.nickname}") is about to begin at ${context.homeTeam.stadium}. Give an epic opening line.`;
            break;
        case 'Goal':
            prompt += ` ${actingTeamObject.name}'s player ${context.player?.name.first} ${context.player?.name.last} just scored! Describe the goal with excitement.`;
            break;
        case 'Chance':
            prompt += ` ${actingTeamObject.name}'s player ${context.player?.name.first} ${context.player?.name.last} had a great chance but missed or the keeper saved it. Describe the near-miss.`;
            break;
        case 'Card':
             prompt += ` A yellow card is shown to ${context.player?.name.first} ${context.player?.name.last} of ${actingTeamObject.name} for a foul. Describe the infraction with thematic flair.`;
            break;
        case 'General':
             prompt = `It's the ${context.minute}' minute. Score: ${context.homeTeam.short_name} ${context.homeScore} - ${context.awayTeam.short_name} ${context.awayScore}. Nothing major happened. Describe the tactical midfield battle or the tense atmosphere.`;
            break;
        case 'FullTime':
            prompt = `The match is over! Final Score: ${context.homeTeam.name} ${context.homeScore} - ${context.awayTeam.name} ${context.awayScore}. Give a closing remark summarizing the result.`;
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                thinkingConfig: { thinkingBudget: 0 },
                temperature: 0.9,
                maxOutputTokens: 50
            },
        });
        return response.text.trim().replace(/\*/g, ''); // Remove any asterisks
    } catch (error) {
        console.error("Gemini commentary generation failed:", error);
        // Fallback static commentary
        return `A notable moment in the ${context.minute}' minute as a ${context.type.toLowerCase()} occurs involving ${context.player?.name.last || actingTeamObject.name}.`;
    }
}


export const commentaryService = {
    generateCommentary,
};
