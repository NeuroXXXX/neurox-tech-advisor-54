
import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Brain, Cpu, Zap } from "lucide-react";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {!showChat ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-8 relative">
              <div className="absolute inset-0 blur-2xl bg-purple-500/30 rounded-full"></div>
              <Brain className="w-32 h-32 mx-auto text-purple-400 relative z-10" />
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NeuroX
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Uma Inteligência Artificial avançada projetada para responder perguntas técnicas, 
              resolver enigmas, auxiliar no desenvolvimento de software e fornecer soluções criativas.
            </p>
            
            <button
              onClick={() => setShowChat(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 
                       text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 
                       transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              Iniciar Conversa
            </button>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <Cpu className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-3">Análise Técnica</h3>
              <p className="text-gray-300">
                Resolvo problemas complexos de programação, hardware, redes e desenvolvimento de software.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <Brain className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-xl font-semibold mb-3">Soluções Criativas</h3>
              <p className="text-gray-300">
                Crio soluções inovadoras para desafios lógicos, enigmas e problemas matemáticos.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-3">Respostas Inteligentes</h3>
              <p className="text-gray-300">
                Adapto minhas explicações ao seu nível de conhecimento, sempre com exemplos práticos.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ChatInterface onBack={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default Index;
