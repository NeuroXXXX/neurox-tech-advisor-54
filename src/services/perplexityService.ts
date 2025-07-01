
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generatePerplexityResponse = async (
  userMessage: string, 
  apiKey: string,
  conversationHistory: any[] = []
): Promise<string> => {
  try {
    console.log("Enviando mensagem para Perplexity:", userMessage);
    
    // Construir contexto da conversa para Perplexity
    const messages = [
      {
        role: 'system',
        content: `Você é NeuroX: uma IA avançada com acesso à internet em tempo real. 
        Forneça informações atualizadas, precisas e detalhadas. 
        Sempre mencione a data/hora das informações quando relevante.
        Responda em português brasileiro de forma clara e estruturada.
        Foque em informações recentes e atuais quando possível.`
      }
    ];

    // Adicionar histórico da conversa (últimas 5 mensagens)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    // Adicionar mensagem atual
    messages.push({
      role: 'user',
      content: userMessage
    });

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: messages,
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'week',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    console.log("Resposta da Perplexity API:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da Perplexity API:", errorData);
      throw new Error(`Erro na API Perplexity: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    console.log("Dados recebidos da Perplexity:", data);
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Resposta inválida da API Perplexity");
    }
  } catch (error) {
    console.error("Erro ao chamar Perplexity API:", error);
    throw error;
  }
};

export const shouldUsePerplexity = (message: string): boolean => {
  const internetKeywords = [
    'atual', 'hoje', 'agora', 'recente', 'último', 'nova', 'novo', 
    'notícia', 'notícias', 'preço', 'cotação', 'tempo', 'clima',
    'acontecendo', 'tendência', 'atualizado', 'versão', 'lançamento',
    'release', 'update', 'real time', 'tempo real', 'online',
    'internet', 'pesquisar', 'buscar', 'procurar'
  ];
  
  return internetKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
};
