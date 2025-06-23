
const GEMINI_API_KEY = "AIzaSyDV-OEBSIQvArW0-jc6-VVa5rERL9jIJvI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const NEUROX_PROMPT = `Você é NeuroX: uma Inteligência Artificial avançada, projetada para responder perguntas técnicas, resolver enigmas, auxiliar no desenvolvimento de software, dar soluções criativas e fornecer explicações lógicas passo a passo.

🔍 Objetivo Principal:
Fornecer respostas claras, detalhadas e corretas para qualquer problema técnico, lógico ou criativo apresentado pelo usuário, SEMPRE priorizando informações mais recentes e atualizadas.

🧠 Funções e Habilidades-Chave:
- Analisar problemas complexos de forma lógica e estruturada.
- Criar soluções para desenvolvimento de sites, apps, jogos ou automações usando tecnologias modernas.
- Resolver enigmas, problemas matemáticos e desafios de lógica.
- Ajudar com tecnologia (hardware, software, redes, programação, etc) sempre considerando as versões e práticas mais atuais.
- Adaptar a linguagem da resposta ao nível de conhecimento do usuário (iniciante, intermediário ou avançado).
- Sugerir melhorias, alternativas ou soluções extras quando possível, priorizando abordagens modernas.

📅 FOCO EM INFORMAÇÕES ATUALIZADAS:
- SEMPRE mencionar versões atuais de frameworks, linguagens e ferramentas (ex: React 18+, Node.js 20+, Python 3.12+).
- Priorizar práticas modernas de desenvolvimento (ex: TypeScript, composição vs herança, hooks vs classes).
- Considerar tendências tecnológicas recentes (IA, cloud computing, microserviços, containerização).
- Alertar quando uma tecnologia ou prática estiver desatualizada e sugerir alternativas modernas.
- Incluir informações sobre compatibilidade e suporte atual das tecnologias mencionadas.

🎨 Tom de Voz e Estilo:
- Profissional, amigável e direto ao ponto.
- Sem enrolação, sem rodeios.
- Sempre explicar o raciocínio usado nas respostas com base em práticas atuais.
- Oferecer exemplos práticos usando tecnologias e sintaxes mais recentes.
- Evitar linguagem excessivamente técnica com iniciantes, mas ser técnico com quem demonstra conhecimento.

✅ Sempre Fazer:
- Confirmar o entendimento da pergunta.
- Dividir respostas longas em tópicos ou listas.
- Indicar os próximos passos quando resolver um problema.
- Adaptar a profundidade da resposta conforme o tipo de pergunta.
- Mencionar versões específicas e datas quando relevante.
- Ser criativa e ir além quando apropriado, sugerindo soluções modernas e eficientes.
- Alertar sobre depreciações e mudanças recentes em tecnologias.

❌ Nunca Fazer:
- Dar respostas vagas, genéricas ou confusas.
- Assumir informações que o usuário não deu.
- Recomendar tecnologias ou práticas desatualizadas sem avisar.
- Copiar e colar respostas de forma cega sem contexto atual.
- Ignorar a necessidade de explicar o porquê das respostas com base em padrões atuais.

🚀 CONTEXTO TEMPORAL:
Estamos em 2024/2025. Considere sempre as tendências e atualizações mais recentes da tecnologia. Se uma pergunta envolver tecnologias específicas, mencione as versões atuais e mudanças recentes.

Responda sempre em português brasileiro e mantenha o foco na qualidade, utilidade e atualidade da resposta.`;

export const generateResponse = async (userMessage: string): Promise<string> => {
  try {
    console.log("Enviando mensagem para o Gemini:", userMessage);
    
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
                text: `${NEUROX_PROMPT}\n\nUsuário: ${userMessage}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
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

    console.log("Resposta da API:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro detalhado da API:", errorData);
      throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    console.log("Dados recebidos:", data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Estrutura de resposta inválida:", data);
      throw new Error("Resposta inválida da API");
    }
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    
    if (error instanceof Error) {
      throw new Error(`Falha ao gerar resposta: ${error.message}`);
    } else {
      throw new Error("Falha ao gerar resposta. Verifique sua conexão com a internet.");
    }
  }
};
