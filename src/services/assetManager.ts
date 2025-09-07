import { Player } from "../types";

// Simple seeded PRNG for deterministic generation
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


class AssetManager {
    private crestCache: Record<string, string> = {};
    private portraitCache: Record<string, string> = {};

    public async generateCrest(tags: string, palette: string[]): Promise<string> {
        const cacheKey = `${tags}-${palette.join('-')}`;
        if (this.crestCache[cacheKey]) {
            return this.crestCache[cacheKey];
        }

        const seed = hashString(cacheKey);
        const prng = mulberry32(seed);

        const primaryColor = palette[0] || '#ccc';
        const secondaryColor = palette[1] || '#aaa';
        
        const shapes = [
            // Shield
            `<path d="M10 10 H90 V50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 V10 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4"/>`,
            // Circle
            `<circle cx="50" cy="50" r="40" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4"/>`,
            // Diamond
            `<path d="M50 10 L90 50 L50 90 L10 50 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4"/>`
        ];
        
        const symbols = {
            lion: `<path d="M50 30 L40 50 L60 50 Z" fill="${secondaryColor}"/>`, // Placeholder
            gear: `<circle cx="50" cy="50" r="15" fill="none" stroke="${secondaryColor}" stroke-width="5" stroke-dasharray="5, 5"/>`,
            crown: `<path d="M30 35 L40 25 L50 35 L60 25 L70 35 L70 45 L30 45 Z" fill="${secondaryColor}"/>`,
            star: `<path d="M50 25 L55 45 L75 45 L60 55 L65 75 L50 65 L35 75 L40 55 L25 45 L45 45 Z" fill="${secondaryColor}"/>`,
        };
        
        const mainTag = tags.split(',')[0].trim();
        const symbolSvg = (symbols as any)[mainTag] || `<text x="50" y="60" font-family="Exo 2, sans-serif" font-size="24" fill="${secondaryColor}" text-anchor="middle" font-weight="bold">${mainTag.substring(0,1).toUpperCase()}</text>`;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            ${shapes[Math.abs(seed) % shapes.length]}
            ${symbolSvg}
        </svg>`;

        const url = `data:image/svg+xml;base64,${btoa(svg)}`;
        this.crestCache[cacheKey] = url;
        return url;
    }

    public async generatePortrait(player: Player): Promise<string> {
        const cacheKey = player.id;
        if (this.portraitCache[cacheKey]) {
            return this.portraitCache[cacheKey];
        }

        const seed = hashString(player.id);
        const prng = mulberry32(seed);

        const rarityColor = 
            player.rarity === 'Legend' ? '#f59e0b' : 
            player.rarity === 'Epic' ? '#a855f7' : 
            player.rarity === 'Rare' ? '#3b82f6' : 
            '#9ca3af';

        const headShapes = [
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon
            'polygon(50% 0%, 95% 35%, 80% 95%, 20% 95%, 5% 35%)', // Shield-like
            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' // Stretched Hex
        ];

        const clipPath = headShapes[Math.abs(seed) % headShapes.length];

        const bgColor1 = `hsl(${prng() * 360}, 50%, 15%)`;
        const bgColor2 = `hsl(${prng() * 360}, 40%, 10%)`;
        
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
                <defs>
                    <clipPath id="portrait-shape">
                        <path d="${clipPath.replace(/(\d+)%/g, (m, p1) => `${parseInt(p1) * 0.8} `).replace(/polygon\((.*?)\)/, 'M$1Z')}" />
                    </clipPath>
                </defs>
                <g clip-path="url(#portrait-shape)">
                    <rect width="80" height="90" fill="url(#grad)" />
                    <text x="40" y="55" font-family="Exo 2, sans-serif" font-size="40" fill="${rarityColor}" text-anchor="middle" font-weight="900" style="text-shadow: 0 0 8px ${rarityColor};">${player.position}</text>
                </g>
                <path d="${clipPath.replace(/(\d+)%/g, (m, p1) => `${parseInt(p1) * 0.8} `).replace(/polygon\((.*?)\)/, 'M$1Z')}" fill="none" stroke="${rarityColor}" stroke-width="2" />
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${bgColor1};" />
                        <stop offset="100%" style="stop-color:${bgColor2};" />
                    </linearGradient>
                </defs>
            </svg>`;
        
        const url = `data:image/svg+xml;base64,${btoa(svg)}`;
        this.portraitCache[cacheKey] = url;
        return url;
    }
}

// Singleton instance
export const assetManager = new AssetManager();