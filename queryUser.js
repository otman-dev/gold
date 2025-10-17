require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

async function queryUser() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId('68f02bec3affcb858234f27b') });

    console.log('User document:', JSON.stringify(user, null, 2));
  } finally {
    await client.close();
  }
}

queryUser().catch(console.error);