import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { isAuthenticated } from '../middleware/authMiddleware';
import logger from '../utils/logger';

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { message, history } = req.body;

    const chatHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    }));

    chatHistory.push({ role: 'user', content: message });

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for an Incident Management SaaS application.' },
        ...chatHistory,
      ],
    });

    const assistantMessage = completion.data.choices[0].message?.content;

    res.json({ message: assistantMessage });
  } catch (error) {
    logger.error('Error in chatbot route:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

export default router;