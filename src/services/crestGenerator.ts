// src/services/crestGenerator.ts
import { Club } from '../types';
import { CULTURAL_BLUEPRINTS } from '../data/cultures';

// --- UTILS ---
const mulberry32 = (a: number) => {
    return () => {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
};

// --- SYMBOL LIBRARY ---
const SYMBOLS: { [key: string]: string } = {
    lion: "M20.7,6.7C20.2,6,19.4,5.4,18.4,5.4c-1.3,0-2.8,0.6-3.4,1.8c-0.7,1.2-0.2,2.8,1.1,3.4c0.5,0.2,1,0.4,1.5,0.4 c1.3,0,2.8-0.6,3.4-1.8C21.7,8.1,21.4,7.3,20.7,6.7z M18.4,9.4c-0.4,0-0.7-0.1-1-0.3c-0.6-0.3-0.8-0.9-0.5-1.5 c0.2-0.5,0.7-0.8,1.3-0.8c0.4,0,0.7,0.1,1,0.3c0.6,0.3,0.8,0.9,0.5,1.5C19.5,9.2,19,9.4,18.4,9.4z M13.7,11.5 c-0.6-0.3-1.2-0.4-1.8-0.4c-1.4,0-2.8,0.5-3.9,1.5c-1.1,0.9-1.8,2.2-1.8,3.7c0,1.5,0.7,2.8,1.8,3.7c1.1,0.9,2.5,1.5,3.9,1.5 c0.6,0,1.2-0.1,1.8-0.4v-1.1c-0.6,0.3-1.2,0.5-1.8,0.5c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6s0.4-1.9,1.1-2.6 c0.7-0.7,1.6-1.1,2.6-1.1c0.6,0,1.2,0.2,1.8,0.5V11.5z",
    gear: "M16,12c0,2.2-1.8,4-4,4s-4-1.8-4-4s1.8-4,4-4S16,9.8,16,12z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M21.6,13.2l-2.4-0.6c-0.3-1.2-0.8-2.3-1.5-3.3l1.4-2c0.4-0.5,0.3-1.2-0.2-1.6l-2.1-2.1c-0.4-0.4-1.1-0.5-1.6-0.2l-2,1.4 c-1-0.7-2.1-1.2-3.3-1.5L9.2,2.4C8.6,2.2,8,2.5,7.8,3.1L7,5.5C5.8,5.8,4.7,6.3,3.7,7l-2-1.4c-0.5-0.4-1.2-0.3-1.6,0.2L-1.2,8 c-0.4,0.4-0.5,1.1-0.2,1.6l1.4,2c-0.7,1-1.2,2.1-1.5,3.3L-2.4,15.6c-0.6,0.2-0.8,0.8-0.6,1.4l0.8,2.4c0.2,0.6,0.8,0.8,1.4,0.6 l2.4-0.6c0.3,1.2,0.8,2.3,1.5,3.3l-1.4,2c-0.4,0.5-0.3,1.2,0.2,1.6l2.1,2.1c0.4,0.4,1.1,0.5,1.6,0.2l2-1.4c1,0.7,2.1,1.2,3.3,1.5 l0.6,2.4c0.2,0.6,0.8,0.8,1.4,0.6l2.4-0.8c0.6-0.2,0.8-0.8,0.6-1.4l-0.6-2.4c1.2-0.3,2.3-0.8,3.3-1.5l2,1.4 c0.5,0.4,1.2,0.3,1.6-0.2l2.1-2.1c0.4-0.4,0.5-1.1,0.2-1.6l-1.4-2C20.8,15.3,21.3,14.2,21.6,13.2z M18.9,15.3 c-0.1,0.1-0.2,0.3-0.2,0.5l0.9,1.4c0.1,0.1,0.1,0.2,0,0.3l-1.3,1.3c-0.1,0.1-0.2,0.1-0.3,0l-1.4-0.9c-0.2-0.1-0.4-0.1-0.5,0 c-0.8,0.5-1.7,1-2.6,1.2c-0.2,0-0.4,0.2-0.5,0.4l0.4,1.7c0,0.1-0.1,0.2-0.2,0.3l-1.7,0.5c-0.1,0-0.2-0.1-0.3-0.2l-0.4-1.7 c-0.1-0.2-0.3-0.4-0.5-0.4c-0.9-0.2-1.8-0.6-2.6-1.2c-0.2,0-0.4,0-0.5,0.1l-1.4,0.9c-0.1,0.1-0.2,0.1-0.3,0l-1.3-1.3 c-0.1-0.1-0.1-0.2,0-0.3l0.9-1.4c0.1-0.1,0.1-0.3,0-0.5C5.1,14.5,4.6,13.6,4.4,12.7c0-0.2-0.2-0.4-0.4-0.5L2.3,11.8 c-0.1,0-0.2-0.1-0.3-0.2l-0.5-1.7c0-0.1,0.1-0.2,0.2-0.3l1.7-0.4c0.2-0.1,0.4-0.3,0.4-0.5c0.2-0.9,0.6-1.8,1.2-2.6 c0-0.2,0-0.4-0.1-0.5L4.1,4.3c-0.1-0.1,0-0.2,0-0.3l1.3-1.3c0.1-0.1,0.2-0.1,0.3,0l1.4,0.9c0.2,0.1,0.4,0.1,0.5,0 c0.8-0.5,1.7-1,2.6-1.2c0.2,0,0.4-0.2,0.5-0.4L11.8,1c0-0.1,0.1-0.2,0.2-0.3l1.7-0.5c0.1,0,0.2,0.1,0.3,0.2l0.4,1.7 c0.1,0.2,0.3,0.4,0.5,0.4c0.9,0.2,1.8,0.6,2.6,1.2c0.2,0,0.4,0,0.5-0.1l1.4-0.9c0.1-0.1,0.2-0.1,0.3,0l1.3,1.3 c0.1,0.1,0.1,0.2,0,0.3L18,6.1c-0.1,0.1-0.1,0.3,0,0.5c0.5,0.8,1,1.7,1.2,2.6c0,0.2,0.2,0.4,0.4,0.5l1.7,0.4 c0.1,0,0.2,0.1,0.3,0.2l0.5,1.7c0,0.1-0.1,0.2-0.2,0.3L19.3,12c-0.2,0.1-0.4,0.3-0.4,0.5C18.9,13.6,18.5,14.5,18.9,15.3z",
    star: "M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2l-2.81,6.63L2,9.24l5.46,4.73L5.82,21L12,17.27z",
    sword: "M21,3c0,0-5,5-9,9s-9,9-9,9l4-4l4-4l4-4L21,3z M3,14l3,3",
    flame: "M12,2c-3,0-5,2-5,5c0,2,2,4,4,4s4-2,4-4c0-2-1-4-3-4z M10,13c-3,0-5,2-5,5c0,2,2,4,4,4s4-2,4-4C13,14,12,13,10,13z M14,13 c-3,0-5,2-5,5c0,2,2,4,4,4s4-2,4-4C17,14,16,13,14,13z",
};

// --- DRAWING FUNCTIONS ---

const drawShield = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.moveTo(size * 0.1, size * 0.1);
    ctx.lineTo(size * 0.9, size * 0.1);
    ctx.lineTo(size * 0.9, size * 0.6);
    ctx.bezierCurveTo(size * 0.9, size * 0.8, size * 0.7, size * 0.9, size * 0.5, size * 0.9);
    ctx.bezierCurveTo(size * 0.3, size * 0.9, size * 0.1, size * 0.8, size * 0.1, size * 0.6);
    ctx.closePath();
};

const drawCircle = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2);
    ctx.closePath();
};

const drawStripes = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.fillStyle = color;
    for (let i = 0; i < size; i += size / 5) {
        ctx.fillRect(i, 0, size / 10, size);
    }
};

const drawCheckers = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    ctx.fillStyle = color;
    const step = size / 8;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if ((x + y) % 2 === 0) {
                ctx.fillRect(x * step, y * step, step, step);
            }
        }
    }
};

const drawSymbol = (ctx: CanvasRenderingContext2D, symbolKey: string, size: number) => {
    if (!SYMBOLS[symbolKey]) return;
    const path = new Path2D(SYMBOLS[symbolKey]);
    const scale = size / 24;
    ctx.save();
    ctx.translate(size / 2 - (12 * scale), size / 2 - (12 * scale));
    ctx.scale(scale, scale);
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore();
};

export const drawCrest = (ctx: CanvasRenderingContext2D, club: Club, size: number) => {
    const blueprint = CULTURAL_BLUEPRINTS[club.nation_id];
    if (!blueprint) return;

    const seed = club.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const prng = mulberry32(seed);

    const primaryColor = club.palette[0];
    const secondaryColor = club.palette[1];

    // 1. Base Shape
    const shape = blueprint.aesthetic_philosophy.primary_shapes[0] || 'shield';
    ctx.fillStyle = primaryColor;
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = size * 0.05;
    
    if (shape === 'shield') drawShield(ctx, size);
    else drawCircle(ctx, size);
    
    ctx.fill();
    ctx.stroke();

    // 2. Background Pattern
    ctx.save();
    ctx.clip(); // Clip pattern to the inside of the shape
    const pattern = blueprint.aesthetic_philosophy.secondary_patterns[Math.floor(prng() * blueprint.aesthetic_philosophy.secondary_patterns.length)];
    if (pattern === 'stripes_vertical') {
        drawStripes(ctx, secondaryColor, size);
    } else if (pattern === 'checkers') {
        drawCheckers(ctx, secondaryColor, size);
    }
    ctx.restore();

    // 3. Central Symbol
    const symbolKey = club.crest_tags.split(', ')[0] || blueprint.aesthetic_philosophy.symbol_library_tags[0];
    ctx.fillStyle = secondaryColor;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = size * 0.02;
    drawSymbol(ctx, symbolKey, size);

    // 4. Club Short Name
    ctx.fillStyle = secondaryColor;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.font = `bold ${size * 0.15}px "Exo 2", sans-serif`;
    ctx.strokeText(club.short_name, size / 2, size * 0.85);
    ctx.fillText(club.short_name, size / 2, size * 0.85);
};
