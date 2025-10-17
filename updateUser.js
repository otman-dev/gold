require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

async function updateUser() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId('68f02bec3affcb858234f27b') },
      { $set: { role: 'admin', approved: true } }
    );

    console.log('Update result:', result);
  } finally {
    await client.close();
  }
}

updateUser().catch(console.error);