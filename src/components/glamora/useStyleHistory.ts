import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StyleCategory, Gender, GenerationMode } from "./GlamoraApp";

interface RecordStyleParams {
  styleCategory: StyleCategory;
  styleName?: string;
  gender: Gender;
  generationMode: GenerationMode;
  metadata?: Record<string, any>;
}

export function useStyleHistory() {
  const recordStyle = useCallback(async (params: RecordStyleParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Only record for logged-in users

      await supabase.from("style_history" as any).insert({
        user_id: user.id,
        style_category: params.styleCategory,
        style_name: params.styleName || null,
        celebrity_inspiration: params.celebrityInspiration || null,
        gender: params.gender,
        generation_mode: params.generationMode,
        metadata: params.metadata || {},
      } as any);
    } catch (e) {
      console.error("Failed to record style history:", e);
    }
  }, []);

  return { recordStyle };
}
