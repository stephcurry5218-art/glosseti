
DROP POLICY IF EXISTS "Users can update own closet items" ON public.closet_items;
CREATE POLICY "Users can update own closet items"
ON public.closet_items FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own style plans" ON public.closet_style_plans;
CREATE POLICY "Users can update own style plans"
ON public.closet_style_plans FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
