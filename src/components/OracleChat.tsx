
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage, OracleConfig } from '@/types/chat';
import { chatWithOracle } from '@/services/ai';
import { MarkdownRenderer } from './MarkdownRenderer';
import { toast } from '@/components/ui/use-toast';

interface OracleChatProps {
  cards: string[];
  context: string;
  journalId: string;
  initialMessage?: string;
}

export const OracleChat: React.FC<OracleChatProps> = ({ 
  cards, 
  context, 
  journalId,
  initialMessage 
}) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const personality = 'mystic'; // Default for now

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: initialMessage,
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [initialMessage, messages.length]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatWithOracle(
        newMessages,
        cards,
        context,
        { personality, language: i18n.language.startsWith('zh') ? 'zh-TW' : 'en' }
      );

      const botMessage: ChatMessage = {
        role: 'model',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Oracle Chat Error:', error);
      toast({
        title: t('common.error'),
        description: t('oracle.chatError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-purple-500/20 bg-background/50 backdrop-blur-sm shadow-xl overflow-hidden flex flex-col h-[600px]">
      <CardHeader className="bg-purple-900/10 border-b border-purple-500/10 py-4">
        <CardTitle className="flex items-center gap-2 text-purple-300">
          <Sparkles className="w-5 h-5 animate-pulse" />
          {t('oracle.title', 'The Oracle')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className={`w-8 h-8 border ${
                  msg.role === 'user' ? 'border-primary' : 'border-purple-500'
                }`}>
                  <AvatarFallback className={msg.role === 'user' ? 'bg-primary/20' : 'bg-purple-900/20'}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted/50 border border-purple-500/10 rounded-tl-none'
                }`}>
                  <MarkdownRenderer content={msg.content} />
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border border-purple-500">
                  <AvatarFallback className="bg-purple-900/20">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/50 border border-purple-500/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground animate-pulse">
                    {t('oracle.thinking', 'The Oracle is gazing into the abyss...')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t border-purple-500/10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex w-full items-center gap-2"
        >
          <Input
            placeholder={t('oracle.placeholder', 'Ask about your reading...')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="bg-muted/30 border-purple-500/20 focus-visible:ring-purple-500"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
