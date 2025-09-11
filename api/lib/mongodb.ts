// api/lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

// String koneksi yang Anda berikan, dengan password yang sudah diisi.
const MONGODB_URI = 'mongodb+srv://wiwitmikael_db_user:ZMuQly03QKhlWYCl@terracluster.euxfnd0.mongodb.net/?retryWrites=true&w=majority&appName=TerraCluster';
const DB_NAME = 'aetherium-chronicle';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Variabel global untuk menyimpan koneksi yang di-cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Jika koneksi sudah ada di cache, gunakan yang itu
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Jika tidak, buat koneksi baru
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  // Simpan koneksi baru ke cache untuk pemanggilan berikutnya
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
