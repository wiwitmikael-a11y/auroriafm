import { Player, Club, CommentaryContext } from '../types';
import { ACC } from '../engine/ACC';

function generateCommentary(context: CommentaryContext): string {
    try {
        const commentary = ACC.generateCommentary(context);
        return commentary.trim();
    } catch (error) {
        console.error("Procedural commentary generation failed:", error);
        // Fallback static commentary
        const actingTeamObject = context.actingTeam === 'home' ? context.homeTeam : context.awayTeam;
        return `A notable moment in the ${context.minute}' minute as a ${context.type.toLowerCase()} occurs involving ${context.player?.name.last || actingTeamObject.name}.`;
    }
}


export const commentaryService = {
    generateCommentary,
};
