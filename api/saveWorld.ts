// api/saveWorld.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const worldData = req.body;
    
    if (!worldData || typeof worldData.seed === 'undefined') {
        return res.status(400).json({ success: false, error: 'World data with a seed is required.' });
    }

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('worlds');
        
        // Menggunakan upsert:true untuk membuat atau memperbarui dokumen
        const result = await collection.updateOne(
            { seed: worldData.seed },
            { $set: worldData },
            { upsert: true }
        );

        return res.status(200).json({ success: true, message: 'World saved successfully.', result });
    } catch (error: any) {
        console.error('Error saving world to DB:', error);
        return res.status(500).json({ success: false, error: 'Failed to save world data.' });
    }
}
