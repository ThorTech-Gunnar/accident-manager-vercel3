import express from 'express';
import cors from 'cors';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectToDB } from './utils/mongoMemoryServer';
import authRoutes from './routes/authRoutes';
import caseRoutes from './routes/caseRoutes';
import franchiseRoutes from './routes/franchiseRoutes';
import floorPlanRoutes from './routes/floorPlanRoutes';
import chatbotRoutes from './routes/chatbotRoutes';

const app = express();

// ... (keep existing middleware and routes)

app.use('/api/chatbot', csrfProtection, chatbotRoutes);

const startServer = async () => {
  try {
    await connectToDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();