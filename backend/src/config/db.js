const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 12000
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
