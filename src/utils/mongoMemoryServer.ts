import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export const connectToDB = async () => {
  if (process.env.NODE_ENV === 'production') {
    // Use the real MongoDB URI in production
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to production MongoDB');
  } else {
    // Use in-memory MongoDB for development and testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB');
  }
};

export const disconnectFromDB = async () => {
  await mongoose.disconnect();
  if (process.env.NODE_ENV !== 'production' && mongoServer) {
    await mongoServer.stop();
  }
  console.log('Disconnected from MongoDB');
};