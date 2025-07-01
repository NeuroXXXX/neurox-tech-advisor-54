
import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || "");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('perplexity_api_key', apiKey);
      onApiKeySet(apiKey);
    }
  };

  return (
    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-5 h-5 text-yellow-400" />
        <h3 className="text-yellow-400 font-semibold">Acesso à Internet em Tempo Real</h3>
      </div>
      
      <p className="text-yellow-200 text-sm mb-4">
        Para acessar informações da internet em tempo real, insira sua chave da API Perplexity.
        Você pode obter uma chave gratuita em{" "}
        <a 
          href="https://www.perplexity.ai/settings/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-yellow-400 hover:underline"
        >
          perplexity.ai/settings/api
        </a>
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Salvar
        </button>
      </form>
      
      {currentApiKey && (
        <p className="text-green-400 text-xs mt-2">
          ✓ Chave API configurada - Acesso à internet ativado!
        </p>
      )}
    </div>
  );
};

export default ApiKeyInput;
