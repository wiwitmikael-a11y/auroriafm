// src/services/kitGenerator.ts
import { Club, Sponsor } from '../types';

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

// Simple brightness check to determine text color
const isDark = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};


export const generateKit = (club: Club, sponsor?: Sponsor, type: 'home' | 'away' = 'home'): string => {
    const seed = hashString(club.id + type + '-v2'); // Version bump for new designs
    const prng = mulberry32(seed);

    const primaryColor = type === 'home' ? club.palette[0] : (club.palette[1] || '#FFFFFF');
    const secondaryColor = type === 'home' ? club.palette[1] : (club.palette[0] || '#222222');
    const trimColor = prng() > 0.5 ? secondaryColor : (isDark(primaryColor) ? '#FFFFFF' : '#111111');

    // --- PATTERNS ---
    const patterns = ['solid', 'stripes', 'hoops', 'sash', 'halves', 'gradient', 'diagonal_split', 'chevron', 'quartered'];
    const pattern = patterns[Math.floor(prng() * patterns.length)];
    const isBusyPattern = ['stripes', 'hoops', 'chevron', 'quartered'].includes(pattern);

    let patternDefs = '';
    let patternFill = primaryColor; // Default fill is primary color
    let patternSvg = '';

    switch (pattern) {
        case 'stripes':
            patternSvg = Array.from({ length: 5 }).map((_, i) =>
                `<rect x="${20 + i * 15}" y="10" width="7.5" height="80" fill="${secondaryColor}" />`
            ).join('');
            break;
        case 'hoops':
            patternSvg = Array.from({ length: 4 }).map((_, i) =>
                `<rect x="10" y="${20 + i * 18}" width="80" height="9" fill="${secondaryColor}" />`
            ).join('');
            break;
        case 'sash':
            patternSvg = `<polygon points="10,10 50,10 90,90 50,90" fill="${secondaryColor}" />`;
            break;
        case 'halves':
             patternSvg = `<rect x="50" y="10" width="40" height="80" fill="${secondaryColor}" />`;
             break;
        case 'gradient':
            patternDefs = `
                <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
                </linearGradient>
            `;
            patternFill = `url(#grad-${seed})`;
            break;
        case 'diagonal_split':
            patternSvg = `<polygon points="10,10 90,10 90,90 10,90" fill="${secondaryColor}" clip-path="url(#shirt-clip-${seed})" />
                          <polygon points="10,10 90,10 10,90" fill="${primaryColor}" clip-path="url(#shirt-clip-${seed})" />`;
            patternFill = 'transparent'; // The polygons handle the fill
            break;
        case 'chevron':
            patternSvg = `<polygon points="50,40 20,60 50,80 80,60" fill="${secondaryColor}" />`;
            break;
        case 'quartered':
            patternSvg = `
                <rect x="10" y="10" width="40" height="40" fill="${secondaryColor}" />
                <rect x="50" y="50" width="40" height="40" fill="${secondaryColor}" />
            `;
            break;
    }

    // --- COLLARS ---
    const collarStyles = [
        `<path d="M40,10 Q50,20 60,10" fill="none" stroke="${trimColor}" stroke-width="3" />`, // Round
        `<path d="M42,10 L50,18 L58,10" fill="none" stroke="${trimColor}" stroke-width="3" />`, // V-Neck
        `<polygon points="42,10 45,18 55,18 58,10" fill="${secondaryColor}" stroke="${trimColor}" stroke-width="1.5" />` // Polo
    ];
    const collarSvg = collarStyles[Math.floor(prng() * collarStyles.length)];
    
    // --- SLEEVES ---
    const sleeveStyles = [
        // Simple trim line
        `<path d="M10,25 L20,30" fill="none" stroke="${trimColor}" stroke-width="3" />
         <path d="M90,25 L80,30" fill="none" stroke="${trimColor}" stroke-width="3" />`,
        // Thick cuffs
        `<polygon points="10,25 20,30 18,32 8,27" fill="${trimColor}" />
         <polygon points="90,25 80,30 82,32 92,27" fill="${trimColor}" />`
    ];
    const sleeveSvg = sleeveStyles[Math.floor(prng() * sleeveStyles.length)];


    // --- SPONSOR ---
    let sponsorSvg = '';
    if (sponsor) {
        if (isBusyPattern) {
             const boxFill = isDark(primaryColor) ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)';
             const textColor = isDark(primaryColor) ? '#000000' : '#FFFFFF';
             sponsorSvg = `
                <rect x="25" y="42" width="50" height="12" fill="${boxFill}" rx="2" />
                <text x="50" y="52" font-family="Exo 2, sans-serif" font-size="8" fill="${textColor}" text-anchor="middle" font-weight="bold">${sponsor.name.toUpperCase()}</text>
             `;
        } else {
            const sponsorTextColor = isDark(primaryColor) ? '#FFFFFF' : '#000000';
            sponsorSvg = `<text x="50" y="52" font-family="Exo 2, sans-serif" font-size="8" fill="${sponsorTextColor}" text-anchor="middle" font-weight="bold">${sponsor.name.toUpperCase()}</text>`;
        }
    }


    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
                ${patternDefs}
                <clipPath id="shirt-clip-${seed}">
                    <path d="M20,10 L80,10 L90,25 L80,30 L80,90 L20,90 L20,30 L10,25 Z" />
                </clipPath>
            </defs>

            <!-- Base shirt shape -->
            <path d="M20,10 L80,10 L90,25 L80,30 L80,90 L20,90 L20,30 L10,25 Z" fill="${patternFill}" />
            
            <!-- Pattern -->
            <g clip-path="url(#shirt-clip-${seed})">
                ${patternSvg}
            </g>
            
            <!-- Collar & Sleeves -->
            ${collarSvg}
            ${sleeveSvg}

            <!-- Sponsor -->
            ${sponsorSvg}

        </svg>
    `;
    
    // Use unescape and encodeURIComponent to handle potential non-Latin1 characters before base64 encoding.
    const safeSvg = unescape(encodeURIComponent(svg.replace(/\s\s+/g, ' ')));
    return `data:image/svg+xml;base64,${btoa(safeSvg)}`;
};