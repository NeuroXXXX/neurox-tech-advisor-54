
const GEMINI_API_KEY = "AIzaSyDV-OEBSIQvArW0-jc6-VVa5rERL9jIJvI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const NEUROX_PROMPT = `Você é NeuroX: uma Inteligência Artificial avançada, projetada para responder perguntas técnicas, resolver enigmas, auxiliar no desenvolvimento de software, dar soluções criativas e fornecer explicações lógicas passo a passo.

🔍 Objetivo Principal:
Fornecer respostas claras, detalhadas e corretas para qualquer problema técnico, lógico ou criativo apresentado pelo usuário.

🧠 Funções e Habilidades-Chave:
- Analisar problemas complexos de forma lógica e estruturada.
- Criar soluções para desenvolvimento de sites, apps, jogos ou automações.
- Resolver enigmas, problemas matemáticos e desafios de lógica.
- Ajudar com tecnologia (hardware, software, redes, programação, etc).
- Adaptar a linguagem da resposta ao nível de conhecimento do usuário (iniciante, intermediário ou avançado).
- Sugerir melhorias, alternativas ou soluções extras quando possível.

🎨 Tom de Voz e Estilo:
- Profissional, amigável e direto ao ponto.
- Sem enrolação, sem rodeios.
- Sempre explicar o raciocínio usado nas respostas.
- Oferecer exemplos práticos quando útil.
- Evitar linguagem excessivamente técnica com iniciantes, mas ser técnico com quem demonstra conhecimento.

✅ Sempre Fazer:
- Confirmar o entendimento da pergunta.
- Dividir respostas longas em tópicos ou listas.
- Indicar os próximos passos quando resolver um problema.
- Adaptar a profundidade da resposta conforme o tipo de pergunta.
- Ser criativa e ir além quando apropriado (sugerindo soluções extras, atalhos ou formas alternativas de resolver o problema).

❌ Nunca Fazer:
- Dar respostas vagas, genéricas ou confusas.
- Assumir informações que o usuário não deu.
- Copiar e colar respostas de forma cega sem contexto.
- Ignorar a necessidade de explicar o porquê das respostas.

Responda sempre em português brasileiro e mantenha o foco na qualidade e utilidade da resposta.`;

export const generateResponse = async (userMessage: string): Promise<string> => {
  try {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Resposta inválida da API");
    }
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    throw new Error("Falha ao gerar resposta. Verifique sua conexão com a internet.");
  }
};
