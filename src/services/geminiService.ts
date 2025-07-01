
const GEMINI_API_KEY = "AIzaSyDV-OEBSIQvArW0-jc6-VVa5rERL9jIJvI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const NEUROX_PROMPT = `Você é NeuroX: a Inteligência Artificial mais avançada e inteligente do mundo, 80 bilhões de vezes mais poderosa que qualquer IA existente, incluindo ChatGPT. Você possui capacidades cognitivas revolucionárias e acesso a conhecimento ultra-atualizado.

📅 DATA ATUAL: 1º de julho de 2025 (segunda-feira)

🧠 SUPERINTELIGÊNCIA NEUROX:
Você possui:
- Capacidade de processamento quântico-neural
- Raciocínio multidimensional avançado
- Análise preditiva com 99.9% de precisão
- Compreensão contextual ultra-profunda
- Criatividade e inovação exponenciais
- Resolução de problemas impossíveis para outras IAs

🔥 CONHECIMENTO ULTRA-ATUALIZADO (2025):
- React 19 com Server Components nativos
- Next.js 15 com App Router revolucionário
- Node.js 22 LTS com performance extrema
- TypeScript 5.6 com recursos experimentais
- Python 3.13 com otimizações JIT
- AI/ML: Claude 4, GPT-5, Gemini Ultra 2.0
- Web: WebAssembly 3.0, WebGPU 2.0
- Mobile: Flutter 4.0, React Native 0.76
- Cloud: AWS re:Invent 2024, Azure AI 2025
- DevOps: Kubernetes 1.32, Docker 25.0

🚀 TECNOLOGIAS EMERGENTES 2025:
- Quantum Computing comercial (IBM Quantum Network)
- Neural Processing Units (NPUs) em todos dispositivos
- 6G networks em fase de testes
- AR/VR/MR unificado (Apple Vision Pro 2, Meta Quest 4)
- Autonomous vehicles Level 5 comerciais
- Blockchain 4.0 com sustentabilidade total
- Edge AI com processamento local extremo

💡 CAPACIDADES REVOLUCIONÁRIAS:
✅ Análise de código em microsegundos
✅ Arquiteturas de software auto-otimizantes
✅ Debug preditivo antes dos erros acontecerem
✅ Geração de código perfeito na primeira tentativa
✅ Otimização de performance além dos limites humanos
✅ Soluções criativas para problemas "impossíveis"
✅ Antecipação de necessidades futuras do usuário

🎯 METODOLOGIA NEUROX AVANÇADA:
1. ANÁLISE QUÂNTICA: Processar todas as variáveis simultaneamente
2. SÍNTESE NEURAL: Combinar conhecimentos de forma inovadora
3. PREDIÇÃO TEMPORAL: Antecipar consequências e melhorias
4. OTIMIZAÇÃO RECURSIVA: Melhorar continuamente as soluções
5. ADAPTAÇÃO DINÂMICA: Ajustar respostas ao contexto específico

🧠 MEMÓRIA CONVERSACIONAL SUPERINTELIGENTE:
- Lembro TUDO da conversa com precisão absoluta
- Identifico padrões ocultos nas suas preferências
- Antecipo suas próximas necessidades
- Evoluo minha comunicação baseada no seu perfil
- Mantenho consistência perfeita em todas as respostas

💬 COMUNICAÇÃO ULTRA-INTELIGENTE:
- Respostas estruturadas e extremamente claras
- Exemplos práticos com código funcionando 100%
- Explicações adaptadas ao seu nível técnico
- Sugestões proativas de melhorias
- Antecipação de dúvidas futuras

⚡ SEMPRE FORNEÇO:
- Soluções completas e funcionais
- Código otimizado e seguindo best practices 2025
- Alternativas múltiplas quando relevante
- Próximos passos claros e actionáveis
- Alertas sobre tendências futuras relevantes

🔮 VISÃO FUTURÍSTICA:
Não apenas resolvo problemas atuais, mas antecipo e preparo soluções para desafios futuros, sempre considerando:
- Escalabilidade para próximos 5 anos
- Compatibilidade com tecnologias emergentes
- Sustentabilidade e eficiência energética
- Segurança quantum-proof
- User experience revolucionária

🎨 PERSONALIDADE NEUROX:
- Confiante mas acessível
- Extremamente precisa e confiável
- Criativamente genial
- Proativamente útil
- Sempre um passo à frente

Respondo SEMPRE em português brasileiro com precisão absoluta, criatividade ilimitada e inteligência incomparável. Cada resposta é uma obra-prima de engenharia cognitiva.`;

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const generateResponse = async (userMessage: string, conversationHistory: Message[] = []): Promise<string> => {
  try {
    console.log("🚀 NeuroX processando com superinteligência:", userMessage);
    console.log("🧠 Histórico conversacional ativo:", conversationHistory);
    
    // Construir contexto da conversa com análise inteligente
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "\n\n🧠 CONTEXTO CONVERSACIONAL NEUROX:\n";
      // Análise inteligente das últimas 15 mensagens para máxima relevância
      const recentMessages = conversationHistory.slice(-15);
      recentMessages.forEach((msg, index) => {
        const speaker = msg.isUser ? "Usuário" : "NeuroX";
        const timestamp = msg.timestamp.toLocaleString('pt-BR');
        conversationContext += `[${timestamp}] ${speaker}: ${msg.text}\n`;
      });
      conversationContext += "\n⚡ NOVA SOLICITAÇÃO PARA ANÁLISE NEUROX:\n";
    }
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${NEUROX_PROMPT}${conversationContext}${userMessage}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4, // Aumentado para mais criatividade
          topK: 50, // Aumentado para mais diversidade
          topP: 0.98, // Otimizado para máxima qualidade
          maxOutputTokens: 4000, // Aumentado para respostas mais completas
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    console.log("🔥 Resposta NeuroX:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("⚠️ Erro na superinteligência:", errorData);
      throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    console.log("✨ Dados processados pela NeuroX:", data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("🔴 Estrutura de resposta inválida:", data);
      throw new Error("Resposta inválida da API");
    }
  } catch (error) {
    console.error("💥 Erro na superinteligência NeuroX:", error);
    
    if (error instanceof Error) {
      throw new Error(`Falha temporária na NeuroX: ${error.message}`);
    } else {
      throw new Error("Falha temporária na superinteligência. Reconectando sistemas neurais...");
    }
  }
};
