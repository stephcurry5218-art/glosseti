
-- Create usage_tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast daily/monthly lookups
CREATE INDEX idx_usage_tracking_user_date ON public.usage_tracking (user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can only view their own usage
CREATE POLICY "Users can view their own usage"
ON public.usage_tracking
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can only insert their own usage
CREATE POLICY "Users can insert their own usage"
ON public.usage_tracking
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies — usage records are immutable
