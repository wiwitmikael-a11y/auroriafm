// src/services/assetManager.ts
import { Player, Club, PlayerAssetIds, CharacterAsset } from '../types';
import { generateCrest as createCrest } from './crestGenerator';
import { characterAssets } from '../data/characterAssets';

// A simple in-memory cache to avoid re-generating assets constantly
const crestCache = new Map<string, string>();
const portraitCache = new Map<string, string>();

// FIX: The index signature key type was `char`, which is not a valid TypeScript type. It has been corrected to `string`.
const PIXEL_ART_PALETTE: { [key: string]: string } = {
    'B': '#1a1c2c', // Black
    'W': '#ffffff', // White
    'w': '#c2c3c7', // light grey (steel highlight)
    'G': '#5d6673', // Grey (steel base)
    'g': '#94e344', // Green
    'Y': '#f3ef7d', // Blonde Yellow
    'y': '#e3a14a', // Blonde Shadow
    'H': '#694f62', // Brown Hair
    'h': '#463547', // Brown Hair Shadow / Brown trousers
    'c': '#e3a14a', // skin tone 1
    'b': '#9b6a4A', // skin tone 1 shadow / mouth
    'R': '#a80000', // Red
};

const drawPixelArt = (ctx: CanvasRenderingContext2D, data: string, size: number) => {
    const pixelData = data.trim().split('\n').map(row => row.trim());
    const rows = pixelData.length;
    const cols = rows > 0 ? pixelData[0].length : 0;
    const pixelSize = size / cols;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const char = pixelData[y][x];
            if (char !== '.') {
                ctx.fillStyle = PIXEL_ART_PALETTE[char] || '#ff00ff'; // Default to magenta for errors
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
};


class AssetManager {

    public generateCrest(club: Club): string {
        const cacheKey = `${club.id}-${club.palette.join('-')}`;
        if (crestCache.has(cacheKey)) {
            return crestCache.get(cacheKey)!;
        }

        const dataUrl = createCrest(club);
        crestCache.set(cacheKey, dataUrl);
        return dataUrl;
    }

    public generateModularPortrait(player: Player, club: Club): string {
        const assetVersion = 'v1.2-semantic'; // Bump version to invalidate cache on asset changes
        const cacheKey = `${player.id}-${Object.values(player.assetIds).join('-')}-${assetVersion}`;
        if (portraitCache.has(cacheKey)) {
            return portraitCache.get(cacheKey)!;
        }

        const canvas = document.createElement('canvas');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        ctx.imageSmoothingEnabled = false;

        const assetIds = player.assetIds;
        const assetsToRender: CharacterAsset[] = [];
        
        // Collect all assigned assets from the player object dynamically
        Object.values(assetIds).forEach(assetId => {
            if (assetId && characterAssets[assetId]) {
                assetsToRender.push(characterAssets[assetId]);
            }
        });
        
        // Sort assets by their zIndex to ensure correct layering
        assetsToRender.sort((a, b) => a.zIndex - b.zIndex);

        // Draw each layer in order
        assetsToRender.forEach(asset => {
            drawPixelArt(ctx, asset.data, size);
        });
        
        const dataUrl = canvas.toDataURL();
        portraitCache.set(cacheKey, dataUrl);
        return dataUrl;
    }
}

export const assetManager = new AssetManager();
