
import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Brain, Globe, Wifi } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ApiKeyInput from "./ApiKeyInput";
import { generateResponse } from "@/services/geminiService";
import { generatePerplexityResponse, shouldUsePerplexity } from "@/services/perplexityService";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  source?: 'gemini' | 'perplexity';
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou a NeuroX, sua IA avançada com acesso à internet em tempo real! 🌐\n\nAgora posso:\n• Buscar informações atualizadas da internet\n• Fornecer notícias e dados em tempo real\n• Acessar informações sobre preços, clima, tecnologia\n• Manter memória conversacional aprimorada\n\nPara ativar o acesso à internet, você precisará configurar uma chave API Perplexity (gratuita). Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
      source: 'gemini'
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [perplexityApiKey, setPerplexityApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar chave API salva
    const savedApiKey = localStorage.getItem('perplexity_api_key');
    if (savedApiKey) {
      setPerplexityApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleApiKeySet = (apiKey: string) => {
    setPerplexityApiKey(apiKey);
    setShowApiKeyInput(false);
    toast.success("Chave API configurada! Acesso à internet ativado! 🌐");
  };

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

      let response: string;
      let source: 'gemini' | 'perplexity' = 'gemini';

      // Decidir qual API usar baseado na mensagem e disponibilidade da chave
      const needsInternet = shouldUsePerplexity(currentInput);
      
      if (needsInternet && perplexityApiKey) {
        console.log("Usando Perplexity para busca na internet");
        try {
          response = await generatePerplexityResponse(currentInput, perplexityApiKey, conversationHistory);
          source = 'perplexity';
        } catch (error) {
          console.error("Erro na Perplexity, usando Gemini como fallback:", error);
          response = await generateResponse(currentInput, conversationHistory);
          toast.error("Erro no acesso à internet. Usando modo offline.");
        }
      } else {
        console.log("Usando Gemini para resposta offline");
        response = await generateResponse(currentInput, conversationHistory);
        
        if (needsInternet && !perplexityApiKey) {
          response += "\n\n⚠️ Esta pergunta seria melhor respondida com acesso à internet. Configure sua chave API Perplexity para informações em tempo real.";
        }
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        source: source
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      toast.error("Erro ao processar sua mensagem. Tente novamente.");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
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
            <Brain className="w-8 h-8 text-purple-400" />
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                NeuroX
              </h1>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-green-400" />
                  <span className={perplexityApiKey ? "text-green-400" : "text-red-400"}>
                    {perplexityApiKey ? "Internet ON" : "Internet OFF"}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Memória Ativada</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <Wifi className="w-5 h-5" />
            <span className="hidden sm:block">Internet</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {showApiKeyInput && (
            <ApiKeyInput 
              onApiKeySet={handleApiKeySet}
              currentApiKey={perplexityApiKey}
            />
          )}
          
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <span className="text-xs text-gray-400 ml-2">
                    {shouldUsePerplexity(inputValue) && perplexityApiKey ? "Buscando na internet..." : "Analisando contexto..."}
                  </span>
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
              placeholder={`Digite sua pergunta para a NeuroX... ${perplexityApiKey ? '(Com acesso à internet!)' : '(Configure API para acesso à internet)'}`}
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
            {perplexityApiKey ? (
              <>🌐 NeuroX com acesso à internet em tempo real + memória conversacional</>
            ) : (
              <>🔄 NeuroX offline com memória conversacional - Configure API para acesso à internet</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
