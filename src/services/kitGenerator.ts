// src/services/kitGenerator.ts
import { Club, Sponsor } from '../types';
import { CULTURAL_BLUEPRINTS } from '../data/cultures';

const drawHoops = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.fillStyle = color;
    const stripeHeight = size / 5;
    for (let i = 0; i < 5; i += 2) {
        ctx.fillRect(0, i * stripeHeight, size, stripeHeight);
    }
};

const drawVerticalStripes = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.fillStyle = color;
    const stripeWidth = size / 7;
    for (let i = 0; i < 7; i += 2) {
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, size);
    }
};

const drawSash = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.1);
    ctx.lineTo(size, size * 0.9);
    ctx.stroke();
};

const drawSponsor = (ctx: CanvasRenderingContext2D, sponsor: Sponsor, primaryColor: string, secondaryColor: string, size: number) => {
    ctx.textAlign = 'center';
    ctx.font = `bold ${size * 0.1}px "Exo 2", sans-serif`;
    const text = sponsor.name.split(' ')[0].toUpperCase();
    
    // Simple contrast check
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    ctx.fillStyle = brightness > 128 ? '#000000' : '#FFFFFF';
    ctx.fillText(text, size / 2, size * 0.45, size * 0.8);
};


export const drawKit = (ctx: CanvasRenderingContext2D, club: Club, sponsor: Sponsor | undefined, type: 'home' | 'away', size: number) => {
    const blueprint = CULTURAL_BLUEPRINTS[club.nation_id];
    if (!blueprint) return;

    const primaryColor = type === 'home' ? club.palette[0] : club.palette[1];
    const secondaryColor = type === 'home' ? club.palette[1] : club.palette[0];

    // Base kit color
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(size * 0.2, 0);
    ctx.lineTo(size * 0.8, 0);
    ctx.lineTo(size, size * 0.3);
    ctx.lineTo(size * 0.8, size);
    ctx.lineTo(size * 0.2, size);
    ctx.lineTo(0, size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Sleeves
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.lineTo(size * 0.2, 0);
    ctx.lineTo(size * 0.2, size * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size, size * 0.3);
    ctx.lineTo(size * 0.8, 0);
    ctx.lineTo(size * 0.8, size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Pattern
    const pattern = blueprint.aesthetic_philosophy.secondary_patterns[0] || 'stripes_vertical';
    if (pattern === 'stripes_vertical') {
        drawVerticalStripes(ctx, secondaryColor, size);
    } else if (pattern.includes('checkers')) { // Use includes for broader matching
        drawHoops(ctx, secondaryColor, size); // Re-use hoops for checkers effect
    }
    
    // Sponsor
    if (sponsor) {
        drawSponsor(ctx, sponsor, primaryColor, secondaryColor, size);
    }
};
