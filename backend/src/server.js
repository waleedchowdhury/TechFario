require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;
const retryMs = Number(process.env.DB_RETRY_MS || 30000);

async function connectWithRetry() {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error(
      'Set MONGO_URI to a MongoDB Atlas connection string and allow Render network access in Atlas.'
    );

    if (process.env.REQUIRE_DB_ON_START === 'true') {
      console.error('Stopping because REQUIRE_DB_ON_START=true');
      process.exit(1);
    }

    console.error(`Retrying MongoDB connection in ${Math.round(retryMs / 1000)} seconds...`);
    setTimeout(connectWithRetry, retryMs);
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectWithRetry();
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
