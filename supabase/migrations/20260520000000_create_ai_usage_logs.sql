-- Create AI Usage Logs Table to track AI request limits
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own AI usage logs."
    ON public.ai_usage_logs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage logs."
    ON public.ai_usage_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
