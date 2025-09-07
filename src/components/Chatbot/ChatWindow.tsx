import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  Minimize2,
  Maximize2,
  Wallet,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit-next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ChatMessage, ChatContext, Lead } from '../../types/chatbot';
import { chatbotService } from '../../lib/chatbot';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../lib/analytics';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm Farhan's AI assistant. I can help you learn about his skills, projects, and experience. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    previousTopics: [],
    userInterests: [],
    leadCaptured: false
  });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [sessionId, setSessionId] = useState<string>('');

  // Voice features
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      setInputValue(result);
      setIsListening(false);
    }
  });

  // Web3 integration
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      analytics.track('chatbot_opened');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    analytics.track('message_sent', { 
      message_length: userMessage.content.length,
      session_id: sessionId 
    });

    try {
      // Check if user is asking about hiring/connecting
      const connectKeywords = ['hire', 'contact', 'connect', 'work together', 'collaborate', 'project'];
      const isConnectIntent = connectKeywords.some(keyword => 
        userMessage.content.toLowerCase().includes(keyword)
      );

      if (isConnectIntent && !context.leadCaptured) {
        setShowLeadForm(true);
      }

      const response = await chatbotService.generateResponse([...messages, userMessage], context);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if voice is enabled
      if (isVoiceEnabled && !speaking) {
        speak({ text: response });
      }

      // Update context
      const newTopics = extractTopics(userMessage.content);
      setContext(prev => ({
        ...prev,
        previousTopics: [...new Set([...prev.previousTopics, ...newTopics])],
        userInterests: [...new Set([...prev.userInterests, ...extractInterests(userMessage.content)])]
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again or contact Farhan directly at farhankabir133@gmail.com",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.name.trim() || !leadForm.email.trim()) return;

    try {
      const lead: Omit<Lead, 'id' | 'createdAt'> = {
        name: leadForm.name,
        email: leadForm.email,
        walletAddress: address,
        source: 'chatbot',
        interests: context.userInterests,
        messages: messages.filter(m => m.role === 'user').map(m => m.content)
      };

      const { error } = await supabase
        .from('leads')
        .insert({
          name: lead.name,
          email: lead.email,
          wallet_address: lead.walletAddress,
          source: lead.source,
          interests: lead.interests,
          messages: lead.messages
        });

      if (error) throw error;

      setContext(prev => ({ 
        ...prev, 
        userName: leadForm.name,
        userEmail: leadForm.email,
        leadCaptured: true 
      }));
      
      setShowLeadForm(false);
      setLeadForm({ name: '', email: '' });

      analytics.track('lead_captured', {
        name: lead.name,
        email: lead.email,
        wallet_connected: !!address,
        session_id: sessionId
      });

      const thankYouMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Thank you ${leadForm.name}! I've saved your information. Farhan will get back to you soon. Is there anything else you'd like to know about his work?`,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, thankYouMessage]);

    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      listen();
      setIsListening(true);
      analytics.track('voice_used', { action: 'start_listening', session_id: sessionId });
    }
  };

  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      const connector = connectors[0]; // MetaMask or first available
      if (connector) {
        connect({ connector });
        analytics.track('wallet_connected', { session_id: sessionId });
      }
    }
  };

  const extractTopics = (message: string): string[] => {
    const topics = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) topics.push('projects');
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) topics.push('skills');
    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) topics.push('experience');
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) topics.push('contact');
    
    return topics;
  };

  const extractInterests = (message: string): string[] => {
    const interests = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('react') || lowerMessage.includes('frontend')) interests.push('Frontend Development');
    if (lowerMessage.includes('backend') || lowerMessage.includes('api')) interests.push('Backend Development');
    if (lowerMessage.includes('design') || lowerMessage.includes('ui')) interests.push('UI/UX Design');
    if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) interests.push('Mobile Development');
    
    return interests;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-24 right-6 z-40 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]`}
      >
        <div className={`w-full h-full rounded-2xl shadow-2xl backdrop-blur-md border overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-800/95 border-slate-700/50' 
            : 'bg-white/95 border-white/20'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Farhan's AI Assistant
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Online • Powered by GPT-4
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Voice Toggle */}
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  isVoiceEnabled
                    ? 'bg-blue-500 text-white'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Wallet Connect */}
              <button
                onClick={handleWalletConnect}
                className={`p-2 rounded-lg transition-colors ${
                  isConnected
                    ? 'bg-green-500 text-white'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Wallet className="w-4 h-4" />
              </button>

              {/* Minimize/Maximize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : isDarkMode
                          ? 'bg-slate-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Lead Form Modal */}
              <AnimatePresence>
                {showLeadForm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className={`w-full max-w-sm p-6 rounded-2xl ${
                        isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Let's Connect!
                      </h3>
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        I'd love to help you get in touch with Farhan. Please share your details:
                      </p>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                        />
                        <input
                          type="email"
                          placeholder="Your email"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                        />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setShowLeadForm(false)}
                          className={`flex-1 p-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleLeadSubmit}
                          disabled={!leadForm.name.trim() || !leadForm.email.trim()}
                          className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Connect
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about Farhan..."
                      className={`w-full p-3 pr-12 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                    />
                    
                    {/* Voice Input Button */}
                    <button
                      onClick={handleVoiceToggle}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        isListening
                          ? 'text-red-500 animate-pulse'
                          : isDarkMode 
                            ? 'text-slate-400 hover:text-white' 
                            : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center gap-4">
                    {isConnected && (
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Wallet Connected
                      </span>
                    )}
                    {isVoiceEnabled && (
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        <Volume2 className="w-3 h-3" />
                        Voice Enabled
                      </span>
                    )}
                  </div>
                  
                  <span className={isDarkMode ? 'text-slate-500' : 'text-gray-400'}>
                    Powered by OpenAI
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWindow;