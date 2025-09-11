// src/services/assetManager.ts
import { Player, Club, Sponsor } from '../types';
import { characterAssets } from '../data/characterAssets';
import { catAssets } from '../data/catAssets';
import { CULTURAL_BLUEPRINTS } from '../data/cultures';
import { drawCrest } from './crestGenerator';
import { drawKit } from './kitGenerator';

// --- UTILS & HELPERS ---

/**
 * A simple seeded pseudo-random number generator.
 */
const mulberry32 = (a: number) => {
    return () => {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
};

/**
 * Converts a hex color to an RGB object.
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Lightens or darkens a hex color by a given amount.
 * @param hex The hex color string.
 * @param amount Negative to darken, positive to lighten.
 */
const adjustHex = (hex: string, amount: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const clamp = (val: number) => Math.max(0, Math.min(255, val));
    const toHex = (c: number) => `0${Math.round(c).toString(16)}`.slice(-2);
    
    rgb.r = clamp(rgb.r + amount);
    rgb.g = clamp(rgb.g + amount);
    rgb.b = clamp(rgb.b + amount);

    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

/**
 * Creates a color palette (light, medium, dark) from a base hex color.
 */
const createColorPalette = (base: string): { [key: string]: string } => ({
    LT: adjustHex(base, 40),
    MD: base,
    DK: adjustHex(base, -40),
});

// --- CACHING ---
const assetCache = new Map<string, string>();

class AssetManager {
    
    // --- PIXEL ART RENDERING ENGINE ---
    private renderPixelArt(
        layers: { assetKey: string; colors: { [key: string]: string } }[],
        width: number,
        height: number,
        pixelSize: number
    ): string {
        const canvas = document.createElement('canvas');
        canvas.width = width * pixelSize;
        canvas.height = height * pixelSize;
        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = false;

        const assetLibrary = { ...characterAssets, ...catAssets };

        const sortedLayers = layers
            .map(layer => ({ ...layer, asset: assetLibrary[layer.assetKey] }))
            .filter(layer => layer.asset)
            .sort((a, b) => a.asset.zIndex - b.asset.zIndex);

        for (const { asset, colors } of sortedLayers) {
            const lines = asset.data.trim().split('\n');
            for (let y = 0; y < lines.length; y++) {
                const parts = lines[y].split('.').filter(p => p);
                let x = 0;
                for (const part of parts) {
                    if (part.startsWith('#')) {
                        const colorKey = part.substring(1, part.length - 1);
                        const finalColor = colors[colorKey] || '#ff00ff'; // Default to magenta for errors
                        ctx.fillStyle = finalColor;
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                        x++;
                    } else {
                        x += parseInt(part, 10);
                    }
                }
            }
        }
        return canvas.toDataURL();
    }
    
    // --- PUBLIC API ---

    public generateCrest(club: Club): string {
        const cacheKey = `crest-${club.id}-${club.palette.join('-')}`;
        if (assetCache.has(cacheKey)) return assetCache.get(cacheKey)!;

        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        drawCrest(ctx, club, size);
        
        const dataUrl = canvas.toDataURL();
        assetCache.set(cacheKey, dataUrl);
        return dataUrl;
    }

    public generateKit(club: Club, sponsor?: Sponsor, type: 'home' | 'away' = 'home'): string {
        const sponsorId = sponsor ? sponsor.id : 'none';
        const cacheKey = `kit-${club.id}-${type}-${sponsorId}`;
        if (assetCache.has(cacheKey)) return assetCache.get(cacheKey)!;

        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        
        drawKit(ctx, club, sponsor, type, size);

        const dataUrl = canvas.toDataURL();
        assetCache.set(cacheKey, dataUrl);
        return dataUrl;
    }
    
    public generateModularPortrait(player: Player, club: Club): string {
        const cacheKey = `portrait-${player.id}`;
        if (assetCache.has(cacheKey)) return assetCache.get(cacheKey)!;

        const prng = mulberry32(player.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
        const skinTones = ['#f2d5b1', '#c68642', '#8d5524'];
        const hairColors = ['#090806', '#4a312c', '#b8a68b', '#f9e784'];
        const eyeColors = ['#3a5a8c', '#5a8c3a', '#8c3a5a'];
        
        const skinPalette = createColorPalette(prng() > 0.8 ? skinTones[0] : skinTones[1]);
        const hairPalette = createColorPalette(hairColors[Math.floor(prng() * hairColors.length)]);
        const eyePalette = { BLUE_LT: eyeColors[0], BLUE_DK: adjustHex(eyeColors[0], -20), BLACK: '#000000'};
        const primaryPalette = createColorPalette(club.palette[0]);

        const layers = [
            { assetKey: 'human_base', colors: { ...skinPalette } },
            { assetKey: 'eyes_neutral_blue', colors: { ...eyePalette } },
            { assetKey: 'hair_short_brown', colors: { ...hairPalette } },
            { assetKey: 'shirt_simple_primary', colors: { ...primaryPalette } },
        ];
        
        // Add random hair or armor
        if(prng() > 0.5) layers[2] = { assetKey: 'hair_long_blonde', colors: { ...hairPalette } };
        if(prng() > 0.7) layers.push({ assetKey: 'armor_leather_spaulders', colors: { ...createColorPalette('#6F4E37') } });
        
        const dataUrl = this.renderPixelArt(layers, 16, 16, 8);
        assetCache.set(cacheKey, dataUrl);
        return dataUrl;
    }
    
    public generateAnimatedSpriteSheet(player: Player, club: Club, type: 'idle' | 'walk'): string {
        // For simplicity, we'll just return the portrait for now.
        // A real implementation would render multiple frames.
        return this.generateModularPortrait(player, club);
    }
    
    public generateManagerCat(seed: string): string {
        const cacheKey = `cat-${seed}`;
        if (assetCache.has(cacheKey)) return assetCache.get(cacheKey)!;
        
        const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const prng = mulberry32(seedNum);

        const furPalettes = [
            createColorPalette('#D2691E'), // Ginger
            createColorPalette('#696969'), // Grey
            createColorPalette('#252525'), // Black
        ];
        const eyeColors = [{ BG: '#000000', CR: '#90EE90'}, { BG: '#000000', CR: '#1E90FF'}];
        const collarColors = { RED_DK: '#8B0000', RED_MD: '#FF0000', GOLD_LT: '#FFD700', GOLD_MD: '#DAA520', GOLD_DK: '#B8860B' };

        const furPalette = furPalettes[Math.floor(prng() * furPalettes.length)];
        const eyePalette = { EYE_BG: eyeColors[Math.floor(prng() * eyeColors.length)].BG, EYE_CR: eyeColors[Math.floor(prng() * eyeColors.length)].CR };
        const nosePalette = { NOSE_BG: '#FFC0CB' };

        // FIX: Explicitly type the `layers` array to prevent TypeScript from inferring
        // a too-specific type from the first element, which caused an error when pushing
        // the `collar_red_bell` layer with a different color palette shape.
        const layers: { assetKey: string; colors: { [key: string]: string } }[] = [
            { assetKey: 'cat_body_base', colors: { ...furPalette, ...eyePalette, ...nosePalette } }
        ];

        if (prng() > 0.3) { // 70% chance of a collar
            layers.push({ assetKey: 'collar_red_bell', colors: collarColors });
        }

        const dataUrl = this.renderPixelArt(layers, 64, 64, 2);
        assetCache.set(cacheKey, dataUrl);
        return dataUrl;
    }
}

export const assetManager = new AssetManager();
