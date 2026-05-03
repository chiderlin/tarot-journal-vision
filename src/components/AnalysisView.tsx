import React, { useState, useMemo } from 'react';
import { subDays, isAfter, parseISO } from 'date-fns';
import { JournalEntry } from '@/types/tarot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { TarotCardRenderer } from './TarotCardRenderer';
import { LenormandCardRenderer } from './LenormandCardRenderer';
import { Sparkles, Activity, Brain, Compass, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisViewProps {
  entries: JournalEntry[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ entries }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('all');

  const filteredEntries = useMemo(() => {
    if (timeRange === 'all') return entries;
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const cutoff = subDays(new Date(), days);
    return entries.filter(entry => isAfter(parseISO(entry.date), cutoff));
  }, [entries, timeRange]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          {t('analysisView.noData.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('analysisView.noData.description')}
        </p>
      </div>
    );
  }

  // Extract all cards and clean them while preserving type
  const allCardsInfo = filteredEntries.flatMap((entry) => 
    (entry.cards || []).map(card => ({
      name: card.replace(/^t-/, '').replace(/^l-/, '').replace(/-reverse$/, ''),
      type: card.startsWith('l-') ? 'lenormand' : 'tarot'
    }))
  );

  const allCards = allCardsInfo.map(c => c.name);

  const getCardType = (
    card: string
  ): 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | 'Unknown' => {
    // Check if it's a Major Arcana (no underscore prefix or specifically mapped)
    const majors = [
      'fool', 'magician', 'priestess', 'empress', 'emperor', 'hierophant', 
      'lovers', 'chariot', 'strength', 'hermit', 'fortune', 'justice', 
      'hanged', 'death', 'temperance', 'devil', 'tower', 'star', 
      'moon', 'sun', 'judgement', 'world'
    ];
    
    if (majors.includes(card)) return 'Major';
    if (card.startsWith('wands_')) return 'Wands';
    if (card.startsWith('cups_')) return 'Cups';
    if (card.startsWith('swords_')) return 'Swords';
    if (card.startsWith('pentacles_')) return 'Pentacles';
    return 'Unknown';
  };

  const arcanaData = [
    {
      name: t('analysisView.majorArcana'),
      value: allCards.filter((card) => getCardType(card) === 'Major').length,
      fill: '#8884d8',
    },
    {
      name: t('analysisView.minorArcana'),
      value: allCards.filter(
        (card) =>
          getCardType(card) !== 'Major' && getCardType(card) !== 'Unknown'
      ).length,
      fill: '#82ca9d',
    },
  ].filter((item) => item.value > 0);

  const suitsData = [
    {
      name: t('analysisView.wands'),
      value: allCards.filter((card) => getCardType(card) === 'Wands').length,
      fill: '#f97316', // Fire: Orange
      key: 'wands',
    },
    {
      name: t('analysisView.cups'),
      value: allCards.filter((card) => getCardType(card) === 'Cups').length,
      fill: '#3b82f6', // Water: Blue
      key: 'cups',
    },
    {
      name: t('analysisView.swords'),
      value: allCards.filter((card) => getCardType(card) === 'Swords').length,
      fill: '#22c55e', // Air: Green
      key: 'swords',
    },
    {
      name: t('analysisView.pentacles'),
      value: allCards.filter((card) => getCardType(card) === 'Pentacles')
        .length,
      fill: '#ca8a04', // Earth: Amber
      key: 'pentacles',
    },
  ].filter((item) => item.value > 0);

  // Helper for elemental Radar chart mapping
  const elementalData = [
    { subject: t('analysisView.fire') || 'Fire', A: allCards.filter(c => getCardType(c) === 'Wands').length, fullMark: Math.max(...suitsData.map(d => d.value)) + 2 },
    { subject: t('analysisView.water') || 'Water', A: allCards.filter(c => getCardType(c) === 'Cups').length, fullMark: Math.max(...suitsData.map(d => d.value)) + 2 },
    { subject: t('analysisView.air') || 'Air', A: allCards.filter(c => getCardType(c) === 'Swords').length, fullMark: Math.max(...suitsData.map(d => d.value)) + 2 },
    { subject: t('analysisView.earth') || 'Earth', A: allCards.filter(c => getCardType(c) === 'Pentacles').length, fullMark: Math.max(...suitsData.map(d => d.value)) + 2 },
  ];

  // Most frequent cards (Synchronicity)
  const tarotFrequency: Record<string, number> = {};
  const lenormandFrequency: Record<string, number> = {};

  allCardsInfo.forEach(c => {
    if (c.type === 'tarot') {
      tarotFrequency[c.name] = (tarotFrequency[c.name] || 0) + 1;
    } else {
      lenormandFrequency[c.name] = (lenormandFrequency[c.name] || 0) + 1;
    }
  });

  const getFrequent = (freq: Record<string, number>) => 
    Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([card, count]) => ({ card, count }));

  const frequentTarot = getFrequent(tarotFrequency);
  const frequentLenormand = getFrequent(lenormandFrequency);

  // Emotion/Suit correlation
  const emotionMap: Record<string, Record<string, number>> = {};
  filteredEntries.forEach(entry => {
    const primaryEmotion = entry.emotions?.[0] || 'Unknown';
    if (!emotionMap[primaryEmotion]) emotionMap[primaryEmotion] = { Major: 0, Wands: 0, Cups: 0, Swords: 0, Pentacles: 0 };
    (entry.cards || []).forEach(card => {
      const cleanCard = card.replace(/^t-/, '').replace(/^l-/, '').replace(/-reverse$/, '');
      const type = getCardType(cleanCard);
      if (type !== 'Unknown') {
        emotionMap[primaryEmotion][type] = (emotionMap[primaryEmotion][type] || 0) + 1;
      }
    });
  });

  const emotionCorrelationData = Object.entries(emotionMap).map(([emotion, values]) => ({
    name: emotion,
    ...values,
  })).slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('indexPage.analysisView')}</h2>
        <Tabs defaultValue="all" value={timeRange} onValueChange={(v) => setTimeRange(v as any)} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-[420px]">
            <TabsTrigger value="7d">{t('analysisView.filters.withinWeek')}</TabsTrigger>
            <TabsTrigger value="14d">{t('analysisView.filters.withinTwoWeeks')}</TabsTrigger>
            <TabsTrigger value="30d">{t('analysisView.filters.withinMonth')}</TabsTrigger>
            <TabsTrigger value="all">{t('analysisView.filters.all')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('analysisView.stats.totalReadings'), value: filteredEntries.length, icon: Brain, color: 'text-purple-500' },
          { label: t('analysisView.stats.cardsDrawn'), value: allCards.length, icon: Sparkles, color: 'text-orange-500' },
          { label: t('analysisView.stats.uniqueCards'), value: Object.keys(tarotFrequency).length + Object.keys(lenormandFrequency).length, icon: Compass, color: 'text-blue-500' },
          { label: t('analysisView.stats.consistency'), value: `${Math.round((filteredEntries.length / (timeRange === 'all' ? 30 : parseInt(timeRange))) * 100)}%`, icon: Activity, color: 'text-green-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/50 backdrop-blur-sm border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Synchronicity Tracker */}
      <Card className="border-purple-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-purple-50/30">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {t('analysisView.synchronicityTitle') || '共時性追蹤：與你有緣的牌卡'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="tarot" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tarot">{t('journalEditor.classicTarot')}</TabsTrigger>
              <TabsTrigger value="lenormand">{t('journalEditor.lenormand')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tarot">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-6 pb-6 pt-2 px-2">
                  {frequentTarot.length > 0 ? frequentTarot.map(({ card, count }) => (
                    <div key={card} className="flex flex-col items-center">
                      <div className="relative p-2">
                        <TarotCardRenderer cardName={card} size="medium" />
                        <Badge className="absolute top-0 right-0 bg-purple-600 shadow-md">
                          {count}x
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-muted-foreground w-full text-center">{t('analysisView.noDataAvailable')}</div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="lenormand">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-6 pb-6 pt-2 px-2">
                  {frequentLenormand.length > 0 ? frequentLenormand.map(({ card, count }) => (
                    <div key={card} className="flex flex-col items-center">
                      <div className="relative p-2">
                        <LenormandCardRenderer cardName={card} size="medium" />
                        <Badge className="absolute top-0 right-0 bg-blue-600 shadow-md">
                          {count}x
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-muted-foreground w-full text-center">{t('analysisView.noDataAvailable')}</div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Elemental Balance */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg">{t('analysisView.elementalBalanceTitle') || '元素能量分佈'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={elementalData}>
                  <PolarGrid stroke="#e9d5ff" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b21a8', fontSize: 12 }} />
                  <Radar
                    name="Energy"
                    dataKey="A"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Pulse */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg">{t('analysisView.emotionPulseTitle') || '情緒與牌組關聯'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionCorrelationData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="Major" stackId="a" fill="#8884d8" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Wands" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Cups" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Swords" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pentacles" stackId="a" fill="#ca8a04" radius={[4, 4, 0, 0]} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traditional Arcana Pie */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-md font-medium">{t('analysisView.arcanaDistributionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {arcanaData.length > 0 ? (
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={arcanaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {arcanaData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                {t('analysisView.noDataAvailable')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Traditional Suit Pie */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-md font-medium">{t('analysisView.suitsDistributionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {suitsData.length > 0 ? (
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={suitsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {suitsData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                {t('analysisView.noDataAvailable')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
