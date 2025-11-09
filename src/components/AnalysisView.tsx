import React from 'react';
import { JournalEntry } from '@/types/tarot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

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

  const allCards = entries.flatMap((entry) => entry.cards);

  const getCardType = (
    card: string
  ): 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | 'Unknown' => {
    if (card.includes('major_arcana')) return 'Major';
    if (card.includes('wands')) return 'Wands';
    if (card.includes('cups')) return 'Cups';
    if (card.includes('swords')) return 'Swords';
    if (card.includes('pentacles')) return 'Pentacles';
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
    },
    {
      name: t('analysisView.cups'),
      value: allCards.filter((card) => getCardType(card) === 'Cups').length,
      fill: '#3b82f6', // Water: Blue
    },
    {
      name: t('analysisView.swords'),
      value: allCards.filter((card) => getCardType(card) === 'Swords').length,
      fill: '#22c55e', // Air: Green
    },
    {
      name: t('analysisView.pentacles'),
      value: allCards.filter((card) => getCardType(card) === 'Pentacles')
        .length,
      fill: '#ca8a04', // Earth: Amber
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('analysisView.arcanaDistributionTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {arcanaData.length > 0 ? (
            <ChartContainer
              config={{}}
              className="mx-auto aspect-square h-[300px]"
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
                  outerRadius={100}
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
            <p className="text-muted-foreground">
              {t('analysisView.noDataAvailable')}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('analysisView.suitsDistributionTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {suitsData.length > 0 ? (
            <ChartContainer
              config={{}}
              className="mx-auto aspect-square h-[300px]"
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
                  outerRadius={100}
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
            <p className="text-muted-foreground">
              {t('analysisView.noDataAvailable')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
