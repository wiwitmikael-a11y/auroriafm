// api/getWorld.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const { seed } = req.query;

    if (!seed || typeof seed !== 'string') {
        return res.status(400).json({ success: false, error: 'Seed is required.' });
    }

    try {
        const { db } = await connectToDatabase();
        const world = await db.collection('worlds').findOne({ seed: parseInt(seed, 10) });

        if (world) {
            // Hapus _id dari MongoDB sebelum mengirim ke klien
            const { _id, ...worldData } = world;
            return res.status(200).json({ success: true, world: worldData });
        } else {
            return res.status(404).json({ success: false, error: 'World not found.' });
        }
    } catch (error: any) {
        console.error('Error fetching world from DB:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch world data.' });
    }
}
