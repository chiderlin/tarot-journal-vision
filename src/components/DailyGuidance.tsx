import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { generateDailyGuidance } from '@/services/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Quote } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const DailyGuidance = () => {
  const { t } = useTranslation();
  const [guidance, setGuidance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = format(new Date(), 'yyyy-MM-dd');
        console.log('[DailyGuidance] Checking for guidance on date:', today);

        // 1. Check if guidance exists for today
        const { data, error: fetchError } = await supabase
          .from('daily_guidance' as any)
          .select('content')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
             console.error('[DailyGuidance] Error fetching guidance:', fetchError);
        }

        if (data) {
          console.log('[DailyGuidance] Found existing guidance:', (data as any).content);
          setGuidance((data as any).content);
          setLoading(false);
          return;
        }

        // 2. If not, generate new guidance
        console.log('[DailyGuidance] No existing guidance found. Generating new...');
        const newGuidance = await generateDailyGuidance();
        console.log('[DailyGuidance] Generated guidance:', newGuidance);
        
        if (newGuidance) {
            setGuidance(newGuidance);
            
            // 3. Save to Supabase
            console.log('[DailyGuidance] Saving to Supabase...');
            const { error: insertError } = await supabase
            .from('daily_guidance' as any)
            .insert({
                user_id: user.id,
                date: today,
                content: newGuidance,
            });

            if (insertError) {
                console.error('[DailyGuidance] Error saving guidance:', insertError);
                toast.error('無法儲存每日指引');
            } else {
                console.log('[DailyGuidance] Successfully saved to Supabase!');
            }
        }

      } catch (error) {
        console.error('Error in daily guidance flow:', error);
        toast.error('Failed to load daily guidance');
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, []);

  if (loading) {
    return (
      <Card className="mb-8 border-none shadow-md bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-900 dark:to-slate-900">
        <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
           <div className="flex flex-col items-center gap-3">
             <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
             <Skeleton className="h-4 w-3/4 max-w-[400px]" />
             <Skeleton className="h-4 w-1/2 max-w-[300px]" />
           </div>
        </CardContent>
      </Card>
    );
  }

  if (!guidance) return null;

  return (
    <Card className="mb-8 border-none shadow-md overflow-hidden relative group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Quote className="w-32 h-32" />
      </div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 mb-2">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Guidance</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-serif text-gray-800 dark:text-gray-100 italic leading-relaxed max-w-3xl">
            "{guidance}"
          </h3>
          
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent pt-1 opacity-50"></div>
        </div>
      </CardContent>
    </Card>
  );
};
