const app = require('./app');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Fatal error during server startup: ${error.message}`);
    process.exit(1);
  }
};

startServer();
