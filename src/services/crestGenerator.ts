// src/services/crestGenerator.ts
import { Club } from '../types';

// Simple PRNG for deterministic generation
const mulberry32 = (seed: number) => {
    return () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

// SVG Icon paths for different crest tags
const ICONS: { [key: string]: string } = {
    'lion': '<path d="M15.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z M17 10h.5a2.5 2.5 0 1 0 0-5h-11a2.5 2.5 0 0 0 0 5H7l-1.5 3.5-2-.5 2 4.5h11l2-4.5-2 .5L17 10Z"/>',
    'crown': '<path d="M5 16h14l-2-7-5 2-5-2-2 7Z M5 16l-1 4h16l-1-4"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    'gear': '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-2a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z M4.93 4.93l1.41 1.41a4 4 0 0 1 0 5.66l-1.41 1.41a6 6 0 0 0 0-8.49Zm8.49 0a6 6 0 0 0 0 8.49l1.41-1.41a4 4 0 0 1 0-5.66l-1.41-1.41Z"/>',
    'hammer': '<path d="M15 12l5-5-3-3-5 5-2 1 1 2Z M9 11l-6 6h4l4-4Z"/>',
    'book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5Z M4 5a2 2 0 0 1 2-2h12v12H6a2 2 0 0 1-2-2V5Z"/>',
    'star': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.25l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>',
    'dragon': '<path d="M10.4 17.6a2 2 0 0 0 2.3 2.3l1-4.3-4.3 1a2 2 0 0 0 1 1ZM3.3 19.8c-1.7-.8-2.6-2.8-1.8-4.5l3.2-6.8 6.8 3.2-4.5 9.6-3.7-1.5ZM17 4a2 2 0 1 0-3-3 2 2 0 0 0 3 3Zm-2 1h2.5c.3 0 .5.2.6.5l.4 1.6c0 .3-.2.6-.5.6H17c-.3 0-.5-.2-.6-.5l-.4-1.6c0-.3.2-.6.5-.6Z M14.5 12.6c0-1-.3-2-.8-2.8l-1.6-2.3-3 2.8 2.3 1.6c.8.5 2.8.3 2.8.8v.1c0 .5-.4.9-1 .9H12c-2.3 0-4.4-1.2-5.5-3.2l-1-1.7c-.2-.4-.1-.8.2-1.1l2-1.9c.3-.3.8-.3 1.1 0l1.8 1.8c1.1 1.1 2.9 1.1 4 0l.3-.3c.3-.3.3-.8 0-1.1l-2-2c-.3-.3-.8-.3-1.1 0l-1.8 1.8c-1.3 1.3-3.4 1.3-4.7 0l-2.7-2.7c-1-1-1-2.5 0-3.5a2.5 2.5 0 0 1 3.5 0l2.7 2.7c1.3 1.3 3.4 1.3 4.7 0l1.8-1.8c.3-.3.8-.3 1.1 0l2 2c.3.3.3.8 0 1.1l-.3.3c-1.1 1.1-1.1 2.9 0 4l1.8 1.8c.3.3.3.8 0 1.1l-2 1.9c-.3.3-.8.2-1.1-.1l-1-1.7c-.5-1-1.5-1.7-2.5-2Z"/>',
    'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-1.12-2.5-2.5-2.5-1.41 0-2.55 1.4-2.5 2.5 0 1.1.9 2 2 2.24 M12 2a4 4 0 0 0-4 4c0 2 2 3 2 5s-2 1-2 3a4 4 0 0 0 8 0c0-2-2-1-2-3s2-3 2-5a4 4 0 0 0-4-4Z"/>',
    'wing': '<path d="M22 12c-2.5-1.5-5-1-7 0l-6 5c-2.2 1.8-5.3 1.2-7-.9C.5 14.6 0 12.8 0 11c0-2.5 1.5-4 4-5.5s4-2.5 7-1.5c2.5 1 4.5 2.5 6.5 4.5l6 5Z"/>',
    'tree': '<path d="M12 22v-8h-4v-4h4V2l6 6-6 6h4v4h-4v8Z"/>',
};

// Helper to determine text color
const isDark = (hex: string): boolean => {
    if (!hex || hex.length < 7) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};

export const generateCrest = (club: Club): string => {
    const seed = hashString(club.id + club.palette.join('') + club.crest_tags);
    const prng = mulberry32(seed);

    const primaryColor = club.palette[0];
    const secondaryColor = club.palette[1];
    const borderColor = isDark(primaryColor) ? '#FFFFFF' : '#000000';

    const tags = club.crest_tags.split(',').map(t => t.trim());
    const mainIconTag = tags.find(t => ICONS[t]) || 'star';
    const mainIcon = ICONS[mainIconTag];
    
    // Background Shape
    const shapes = [
        `<path d="M20 2 H80 L90 30 V80 L50 98 L10 80 V30 Z" />`, // Shield
        `<circle cx="50" cy="50" r="48" />`, // Circle
        `<rect x="2" y="2" width="96" height="96" />`, // Square
    ];
    const backgroundShape = shapes[Math.floor(prng() * shapes.length)];

    // Pattern
    const patterns = [
        `<line x1="0" y1="0" x2="100" y2="100" stroke="${secondaryColor}" stroke-width="15" /> <line x1="100" y1="0" x2="0" y2="100" stroke="${secondaryColor}" stroke-width="15" />`, // Cross
        `<rect x="0" y="0" width="50" height="100" fill="${secondaryColor}" />`, // Halves vertical
        `<rect x="0" y="0" width="100" height="50" fill="${secondaryColor}" />`, // Halves horizontal
        Array.from({length: 5}).map((_, i) => `<rect x="${i * 20}" y="0" width="10" height="100" fill="${secondaryColor}" />`).join('') // Stripes
    ];
    const pattern = prng() > 0.4 ? patterns[Math.floor(prng() * patterns.length)] : '';


    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
                <clipPath id="crest-clip-${seed}">
                    ${backgroundShape}
                </clipPath>
            </defs>
            <g clip-path="url(#crest-clip-${seed})">
                <rect x="0" y="0" width="100" height="100" fill="${primaryColor}" />
                ${pattern}
            </g>
            <g transform="scale(3.5) translate(4, 4)" fill="${borderColor}">
                ${mainIcon}
            </g>
            <g>
               ${backgroundShape}
               <style>
                    path, circle, rect {
                        stroke: ${borderColor};
                        stroke-width: 4;
                        fill: none;
                    }
               </style>
            </g>
        </svg>
    `;

    const safeSvg = unescape(encodeURIComponent(svg.replace(/\s\s+/g, ' ')));
    return `data:image/svg+xml;base64,${btoa(safeSvg)}`;
}
