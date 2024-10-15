const { connectToMemoryDB, disconnectFromMemoryDB } = require('../src/utils/mongoMemoryServer');

async function setupDatabase() {
  try {
    await connectToMemoryDB();
    console.log('Connected to in-memory MongoDB');

    // Add any initial database setup here, such as creating indexes
    // For example:
    // await User.createIndexes();
    // await Case.createIndexes();

    console.log('Database setup complete');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromMemoryDB();
  }
}

setupDatabase();