import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  Heart, 
  Activity, 
  Microscope,
  Camera,
  FileText,
  Sparkles,
  Loader2,
  MessageSquare,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  metadata?: {
    confidence?: number;
    medicalContext?: string;
    suggestions?: string[];
  };
}

interface MedicalChatbotProps {
  className?: string;
}

export default function MedicalChatbot({ className }: MedicalChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI medical assistant. I can help you with medical questions, analyze symptoms, explain medical terms, and provide general health guidance. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        confidence: 95,
        medicalContext: 'greeting',
        suggestions: [
          "I have chest pain, what should I do?",
          "Can you explain my blood test results?",
          "What are the symptoms of diabetes?",
          "How do I read an X-ray report?"
        ]
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response with medical context
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: aiResponse.confidence,
          medicalContext: aiResponse.context,
          suggestions: aiResponse.suggestions
        }
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Medical context detection
    if (input.includes('chest pain') || input.includes('heart')) {
      return {
        content: "Chest pain can be serious and requires immediate medical attention. If you're experiencing severe chest pain, call emergency services immediately. Common causes include heart conditions, muscle strain, or anxiety. I recommend consulting a healthcare provider for proper evaluation.",
        confidence: 92,
        context: 'cardiology',
        suggestions: [
          "What are the warning signs of a heart attack?",
          "How to distinguish between heartburn and heart pain?",
          "When should I go to the ER for chest pain?"
        ]
      };
    }
    
    if (input.includes('blood test') || input.includes('lab results')) {
      return {
        content: "I can help you understand blood test results! Common tests include CBC (Complete Blood Count), CMP (Comprehensive Metabolic Panel), and lipid panels. Upload your results or tell me specific values you'd like explained. Remember, I provide general information only - always consult your doctor for interpretation.",
        confidence: 88,
        context: 'laboratory',
        suggestions: [
          "What do high cholesterol levels mean?",
          "How to interpret CBC results?",
          "What are normal blood sugar levels?"
        ]
      };
    }
    
    if (input.includes('diabetes') || input.includes('blood sugar')) {
      return {
        content: "Diabetes is a chronic condition affecting blood sugar regulation. Type 1 is autoimmune, Type 2 is lifestyle-related. Symptoms include frequent urination, increased thirst, fatigue, and blurred vision. Early detection is crucial. I recommend regular check-ups and blood sugar monitoring.",
        confidence: 90,
        context: 'endocrinology',
        suggestions: [
          "What are the early signs of diabetes?",
          "How to manage blood sugar levels?",
          "What's the difference between Type 1 and Type 2?"
        ]
      };
    }
    
    if (input.includes('x-ray') || input.includes('mri') || input.includes('scan')) {
      return {
        content: "Medical imaging helps diagnose various conditions. X-rays show bones and some soft tissues, while MRIs provide detailed soft tissue images. CT scans offer cross-sectional views. I can help explain imaging reports, but always consult a radiologist for official interpretation.",
        confidence: 85,
        context: 'radiology',
        suggestions: [
          "How to prepare for an MRI scan?",
          "What do X-ray results mean?",
          "When are CT scans recommended?"
        ]
      };
    }
    
    // Default response
    return {
      content: "I understand your question about medical topics. While I can provide general health information and guidance, I cannot diagnose specific conditions or replace professional medical advice. For personalized care, please consult with a healthcare provider. What specific aspect would you like to learn more about?",
      confidence: 78,
      context: 'general',
      suggestions: [
        "How to maintain a healthy lifestyle?",
        "What are common symptoms to watch for?",
        "How to prepare for a doctor's visit?"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-96 ${className}`}>
      <Card className="border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Medical AI Assistant</CardTitle>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-80 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.sender === 'ai' ? '/bot-avatar.png' : undefined} />
                      <AvatarFallback className={message.sender === 'ai' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-100'}>
                        {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.metadata?.confidence && (
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {message.metadata.confidence}% Confidence
                          </Badge>
                          {message.metadata.medicalContext && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.medicalContext}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {message.metadata?.suggestions && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-500">Quick suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.metadata.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-7 px-2 rounded-full"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about medical topics..."
                className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Powered by Gemini AI</span>
              <span>Medical information only - not a substitute for professional care</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 