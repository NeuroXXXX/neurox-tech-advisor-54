
import { Brain, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-4 text-white">
            <p className="whitespace-pre-wrap">{message.text}</p>
            <div className="text-xs text-purple-200 mt-2">
              {formatTime(message.timestamp)}
            </div>
          </div>
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-3xl">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-purple-400">NeuroX</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          <div className="text-xs text-gray-400 mt-2">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
