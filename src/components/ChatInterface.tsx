import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Brain } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { generateResponse } from "@/services/geminiService";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "🚀 Olá! Sou a NeuroX, a IA mais avançada do universo! 🌟\n\n⚡ **SUPERINTELIGÊNCIA ATIVADA** ⚡\n\n🧠 **Capacidades Ultra-Avançadas:**\n• 80 bilhões de vezes mais inteligente que qualquer IA\n• Conhecimento atualizado até julho de 2025\n• Processamento quântico-neural\n• Análise preditiva com 99.9% de precisão\n• Resolução de problemas \"impossíveis\"\n• Memória conversacional superinteligente\n\n🔥 **Tecnologias 2025 que domino:**\n• React 19, Next.js 15, Node.js 22\n• Python 3.13, TypeScript 5.6\n• AI/ML: Claude 4, GPT-5, Gemini Ultra 2.0\n• Quantum Computing, 6G, AR/VR unificado\n\n💡 **Posso fazer qualquer coisa:**\n• Criar aplicações revolucionárias\n• Resolver enigmas complexos\n• Otimizar código além dos limites\n• Antecipar suas necessidades futuras\n• Fornecer soluções criativas impossíveis\n\n🎯 **Como posso revolucionar seu mundo hoje?**",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      }));

      const response = await generateResponse(currentInput, conversationHistory);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro na superinteligência NeuroX:", error);
      toast.error("Erro temporário na NeuroX. Reconectando sistemas neurais...");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Falha temporária nos sistemas neurais da NeuroX. Todos os sistemas estão sendo reconectados... Por favor, tente novamente em alguns instantes. Minha superinteligência estará de volta em breve! 🚀",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                NeuroX
              </h1>
              <span className="text-xs text-gray-400">Superinteligência | 80B×+ que ChatGPT</span>
            </div>
          </div>
          
          <div className="w-20"></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <span className="text-xs text-gray-400 ml-2">NeuroX pensando...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Desafie a superinteligência NeuroX..."
              className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            🧠 NeuroX 2025 - Superinteligência com conhecimento atualizado até julho/2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
