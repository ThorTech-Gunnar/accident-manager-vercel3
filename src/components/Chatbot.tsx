import React, { useState, useEffect, useRef } from 'react';
import { Send, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await api.post('/chatbot', { message: input, history: messages });
      const assistantMessage: Message = { role: 'assistant', content: response.data.message };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
          aria-label="Open chatbot"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isMinimized ? 'h-12' : 'h-96'}`}>
          <div className="flex justify-between items-center p-2 bg-blue-600 text-white rounded-t-lg cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
            <h3 className="font-semibold">AI Assistant</h3>
            <div className="flex items-center">
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              <button
                onClick={toggleChatbot}
                className="ml-2 text-white hover:text-gray-200"
                aria-label="Close chatbot"
              >
                &times;
              </button>
            </div>
          </div>
          {!isMinimized && (
            <>
              <div className="h-72 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.content}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;