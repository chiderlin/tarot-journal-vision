import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TarotCardRenderer } from './TarotCardRenderer';
import { LenormandCardRenderer } from './LenormandCardRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { parseSyntax } from './SyntaxRenderer';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  JournalEntry,
  Category,
  DEFAULT_CATEGORIES,
  TAROT_CARDS,
} from '@/types/tarot';
import { LENORMAND_CARDS } from '@/types/lenormand';
import { Save, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';

interface JournalEditorProps {
  entry?: JournalEntry;
  categories: Category[];
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  entry,
  categories = DEFAULT_CATEGORIES,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');

  const [showPreview, setShowPreview] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [category, setCategory] = useState(
    entry?.category || categories[0]?.name || ''
  );

  // Extract card names from content
  const extractCards = (text: string): string[] => {
    const regex = /#((?:t|l)-[\w-]+)/g;
    const matches = Array.from(text.matchAll(regex));
    const cardTags = matches.map((match) => match[1]);
    return [...new Set(cardTags)];
  };

  const handleSave = () => {
    const cards = extractCards(content);
    onSave({
      title: title || `${t('journalEditor.untitledJournal')}`,
      content,
      category,
      date: entry?.date || new Date().toISOString().split('T')[0],
      cards,
    });
  };

  // 顯示建議清單並追蹤游標位置
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCursorPosition(e.target.selectionStart);

    // Show suggestions if typing # followed by letters
    const textBeforeCursor = newContent.substring(0, e.target.selectionStart);
    const hashMatch = textBeforeCursor.match(/#([\w-]*)$/);
    setShowSuggestions(!!hashMatch);
  };

  const insertCardSyntax = (cardName: string, isReverse: boolean = false) => {
    const syntax = `#${cardName}${isReverse ? '-reverse' : ''} `;

    const textBeforeCursor = content.substring(0, cursorPosition);
    const hashMatch = textBeforeCursor.match(/#([\w-]*)$/);

    if (!hashMatch) {
      setShowSuggestions(false);
      return;
    }

    const startOfHash = cursorPosition - hashMatch[0].length;
    const newContent =
      content.substring(0, startOfHash) +
      syntax +
      content.substring(cursorPosition);

    const newCursorPosition = startOfHash + syntax.length;

    setContent(newContent);
    setShowSuggestions(false);

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const STORAGE_KEY = 'tarot_ai_usage';
    const storedUsage = localStorage.getItem(STORAGE_KEY);
    if (storedUsage) {
      const usage = JSON.parse(storedUsage);
      if (usage.date === today) {
        setUsageCount(usage.count);
      } else {
         setUsageCount(0);
      }
    }
  }, []);

  // AI 解牌功能
  const handleAIInterpretation = async () => {
    const cards = extractCards(content);
    console.log('Extracted cards for AI interpretation:', cards);
    if (cards.length === 0) {
      toast({
        title: t('journalEditor.toast.unableToInterpret'),
        description: t('journalEditor.toast.addTagsFirst'),
        variant: 'destructive',
      });
      return;
    }

    // Rate Limiting Check
    const today = new Date().toISOString().split('T')[0];
    const STORAGE_KEY = 'tarot_ai_usage';
    const storedUsage = localStorage.getItem(STORAGE_KEY);
    let usage = storedUsage ? JSON.parse(storedUsage) : { date: today, count: 0 };

    if (usage.date !== today) {
      usage = { date: today, count: 0 };
    }

    if (usage.count >= 3) {
       toast({
        title: t('journalEditor.toast.rateLimitExceeded') || 'Rate Limit Exceeded',
        description: t('journalEditor.toast.dailyLimitReached') || 'You have reached the daily limit of 3 AI interpretations.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingAI(true);
    try {
      // Dynamic import to avoid dependency cycle if any, though not expected here.
      // Better to import at top, but for replace_file_content clarity...
      // Actually, I should add the import at the top. 
      // I will assume I added the import in a separate step or I will use a dynamic import here if possible? 
      // No, let's just use the function, I'll add the import in a separate replace call.
      const { getTarotInterpretation } = await import('@/services/ai');

      const interpretation = await getTarotInterpretation({
        cards,
        context: category,
        question: title,
      });

      setAiInterpretation(interpretation);
      
      // Update usage count
      usage.count += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
      setUsageCount(usage.count);

      toast({
        title: t('journalEditor.toast.aiSuccessTitle'),
        description: t('journalEditor.toast.aiSuccessDescription'),
      });
      
    } catch (error) {
      console.error('AI interpretation error:', error);
      toast({
        title: t('journalEditor.toast.aiErrorTitle'),
        description:
          error instanceof Error
            ? error.message
            : t('journalEditor.toast.aiErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const tarotCardsWithPrefix = Object.keys(TAROT_CARDS).map((c) => `t-${c}`);
  const lenormandCardsWithPrefix = Object.keys(LENORMAND_CARDS).map(
    (c) => `l-${c}`
  );
  const availableCards = [...tarotCardsWithPrefix, ...lenormandCardsWithPrefix];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {entry ? t('journalEditor.editTitle') : t('journalEditor.addTitle')}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showPreview
                  ? t('journalEditor.edit')
                  : t('journalEditor.preview')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('journalEditor.titleLabel')}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('journalEditor.titlePlaceholder')}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('journalEditor.categoryLabel')}
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue
                    placeholder={t('journalEditor.categoryPlaceholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.icon} {t(`journalEditor.categories.${cat.name}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-2 block">
              {t('journalEditor.contentLabel')}
              <span className="text-xs text-muted-foreground ml-2">
                {t('journalEditor.contentHint')}
              </span>
            </label>

            {!showPreview ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaChange}
                    placeholder={t('journalEditor.contentPlaceholder')}
                    className="min-h-[300px] bg-background/50 resize-none"
                  />

                  {showSuggestions && (
                    <Card className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-48 overflow-y-auto">
                      <CardContent className="p-2">
                        <div className="text-xs text-muted-foreground mb-2">
                          {t('journalEditor.availableCards')}
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {availableCards
                            .filter((cardName) => {
                              const textBeforeCursor = content.substring(
                                0,
                                cursorPosition
                              );
                              const hashMatch =
                                textBeforeCursor.match(/#([\w-]*)$/);
                              if (hashMatch && hashMatch[1]) {
                                return cardName.startsWith(hashMatch[1]);
                              }
                              return true;
                            })
                            .map((cardName) => (
                              <div key={cardName} className="space-y-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start text-xs h-auto p-1"
                                  onClick={() => insertCardSyntax(cardName)}
                                >
                                  #{cardName}
                                </Button>
                                {cardName.startsWith('t-') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs h-auto p-1 text-destructive"
                                    onClick={() =>
                                      insertCardSyntax(cardName, true)
                                    }
                                  >
                                    #{cardName}-reverse
                                  </Button>
                                )}
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                {/* Real-time preview */}
                <div className="min-h-[300px] p-4 border rounded-md bg-muted/30 overflow-auto">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">
                    {t('journalEditor.realtimePreview')}
                  </div>
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      {t('journalEditor.startTyping')}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] p-4 border rounded-md bg-background/30 overflow-auto">
                <MarkdownRenderer content={content} />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center gap-2">
            <Button
              variant="outline"
              onClick={handleAIInterpretation}
              disabled={isLoadingAI || extractCards(content).length === 0}
              className="border-purple-500 text-purple-700 hover:bg-purple-50"
            >
              {isLoadingAI ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {t('journalEditor.aiInterpretation')} ({usageCount}/3)
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                {t('journalEditor.cancel')}
              </Button>
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                variant="default"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                {t('journalEditor.save')}
              </Button>
            </div>
          </div>

          {aiInterpretation && (
            <Card className="bg-purple-50/50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between text-purple-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t('journalEditor.aiInterpretation')}
                  </div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                    onClick={() => {
                        const newContent = `${content}\n\n🤖 AI 解牌：\n${aiInterpretation}`;
                        setContent(newContent);
                        toast({
                            title: "已加入日記",
                            description: "AI 解析內容已附加到您的日記中。",
                        });
                        // Smooth scroll to bottom of textarea
                        setTimeout(() => {
                           if (textareaRef.current) {
                               textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
                           }
                        }, 100);
                    }}
                  >
                    📝 {t('journalEditor.appendToJournal') || "加入日記"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/90 whitespace-pre-wrap pt-0">
                {aiInterpretation}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      {/* Quick card reference */}{' '}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('journalEditor.quickReference')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tarot" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tarot">
                {t('journalEditor.classicTarot')}
              </TabsTrigger>
              <TabsTrigger value="lenormand">
                {t('journalEditor.lenormand')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tarot">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {Object.keys(TAROT_CARDS).map((cardName) => (
                  <div key={cardName} className="text-center space-y-2">
                    <TarotCardRenderer cardName={cardName} size="small" />
                    <div className="text-xs space-y-1">
                      <div className="font-mono bg-muted px-2 py-1 rounded">
                        #t-{cardName}
                      </div>
                      <div className="font-mono bg-destructive/20 px-2 py-1 rounded text-destructive">
                        #t-{cardName}-reverse
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="lenormand">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {Object.keys(LENORMAND_CARDS).map((cardName) => (
                  <div key={cardName} className="text-center space-y-2">
                    <LenormandCardRenderer cardName={cardName} size="small" />
                    <div className="text-xs space-y-1">
                      <div className="font-mono bg-muted px-2 py-1 rounded">
                        #l-{cardName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
