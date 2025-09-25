import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseTarotSyntax, TarotCardRenderer } from './TarotCardRenderer';
import { JournalEntry, Category, DEFAULT_CATEGORIES, TAROT_CARDS } from '@/types/tarot';
import { Save, Eye, EyeOff } from 'lucide-react';

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
  const [category, setCategory] = useState(entry?.category || categories[0]?.name || '');
  const [showPreview, setShowPreview] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract card names from content
  const extractCards = (text: string): string[] => {
    const matches = text.match(/#(\w+)(-reverse)?/g) || [];
    return [...new Set(matches.map(match => match.replace('#', '').replace('-reverse', '')))];
  };

  const handleSave = () => {
    const cards = extractCards(content);
    onSave({
      title: title || '無標題日記',
      content,
      category,
      date: entry?.date || new Date().toISOString().split('T')[0],
      cards,
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCursorPosition(e.target.selectionStart);
    
    // Show suggestions if typing # followed by letters
    const textBeforeCursor = newContent.substring(0, e.target.selectionStart);
    const hashMatch = textBeforeCursor.match(/#(\w*)$/);
    setShowSuggestions(!!hashMatch);
  };

  const insertCardSyntax = (cardName: string, isReverse: boolean = false) => {
    const syntax = `#${cardName}${isReverse ? '-reverse' : ''}`;
    const newContent = content.substring(0, cursorPosition) + syntax + content.substring(cursorPosition);
    setContent(newContent);
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          cursorPosition + syntax.length,
          cursorPosition + syntax.length
        );
      }
    }, 0);
  };

  const availableCards = Object.keys(TAROT_CARDS);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {entry ? '編輯塔羅日記' : '新增塔羅日記'}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? '編輯' : '預覽'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">標題</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入日記標題..."
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">分類</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-2 block">
              內容 
              <span className="text-xs text-muted-foreground ml-2">
                使用 #cardname 插入牌卡，#cardname-reverse 插入逆位牌
              </span>
            </label>
            
            {!showPreview ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaChange}
                    placeholder="開始記錄你的塔羅日記... 使用 #fool 插入愚人牌，#fool-reverse 插入逆位愚人牌"
                    className="min-h-[300px] bg-background/50 resize-none"
                  />
                  
                  {showSuggestions && (
                    <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto">
                      <CardContent className="p-2">
                        <div className="text-xs text-muted-foreground mb-2">可用的塔羅牌:</div>
                        <div className="grid grid-cols-2 gap-1">
                          {availableCards.map((cardName) => (
                            <div key={cardName} className="space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-auto p-1"
                                onClick={() => insertCardSyntax(cardName)}
                              >
                                #{cardName}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-auto p-1 text-destructive"
                                onClick={() => insertCardSyntax(cardName, true)}
                              >
                                #{cardName}-reverse
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Real-time preview */}                <div className="min-h-[300px] p-4 border rounded-md bg-muted/30 overflow-auto">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">即時預覽</div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 leading-relaxed">
                        {parseTarotSyntax(line)}
                      </p>
                    ))}
                    {!content && (
                      <p className="text-muted-foreground italic">開始輸入以查看預覽...</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] p-4 border rounded-md bg-background/30 overflow-auto">
                <div className="prose prose-sm max-w-none text-foreground">
                  {content.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 leading-relaxed">
                      {parseTarotSyntax(line)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button variant="default" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              儲存日記
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick card reference */}      <Card>
        <CardHeader>
          <CardTitle className="text-lg">快速參考</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableCards.map((cardName) => (
              <div key={cardName} className="text-center space-y-2">
                <TarotCardRenderer cardName={cardName} size="small" />
                <div className="text-xs space-y-1">
                  <div className="font-mono bg-muted px-2 py-1 rounded">#{cardName}</div>
                  <div className="font-mono bg-destructive/20 px-2 py-1 rounded text-destructive">
                    #{cardName}-reverse
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
