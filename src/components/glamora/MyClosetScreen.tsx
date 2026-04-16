import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Plus, Camera, Trash2, Shirt, Sparkles, X, Loader2, CalendarDays, Check, UserCircle, ChevronLeft, RotateCcw, Heart, ImageIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fixImageOrientation } from "./fixImageOrientation";
import type { Gender } from "./GlamoraApp";

const CATEGORIES = [
  { id: "tops", label: "Tops", emoji: "👕" },
  { id: "bottoms", label: "Bottoms", emoji: "👖" },
  { id: "dresses", label: "Dresses", emoji: "👗" },
  { id: "outerwear", label: "Outerwear", emoji: "🧥" },
  { id: "shoes", label: "Shoes", emoji: "👟" },
  { id: "accessories", label: "Accessories", emoji: "💍" },
  { id: "activewear", label: "Activewear", emoji: "🏃" },
  { id: "formal", label: "Formal", emoji: "🤵" },
  { id: "swimwear", label: "Swimwear", emoji: "🩱" },
  { id: "other", label: "Other", emoji: "🏷️" },
];

interface ClosetItem {
  id: string;
  storage_path: string;
  label: string | null;
  category: string;
  color: string | null;
  notes: string | null;
  created_at: string;
  imageUrl?: string;
}

interface OutfitResult {
  description: string;
  items: string[];
  occasion: string;
  tips: string;
}

interface SavedLook {
  id: string;
  image_url: string;
  outfit_description: string;
  occasion: string;
  outfit_items: string[];
  tips: string | null;
  created_at: string;
}

interface Props {
  onBack: () => void;
  gender: Gender;
  userId: string;
}

const MyClosetScreen = ({ onBack, gender, userId }: Props) => {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("tops");
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [outfits, setOutfits] = useState<OutfitResult[] | null>(null);
  const [showOutfits, setShowOutfits] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [showPlanSetup, setShowPlanSetup] = useState(false);
  const [planDays, setPlanDays] = useState(7);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [tryOnPhoto, setTryOnPhoto] = useState<string | null>(null);
  const [tryOnGenerating, setTryOnGenerating] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [tryOnOutfitIdx, setTryOnOutfitIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"closet" | "looks">("closet");
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [loadingLooks, setLoadingLooks] = useState(false);
  const [savingLook, setSavingLook] = useState(false);
  const [lookSaved, setLookSaved] = useState(false);
  const [expandedLook, setExpandedLook] = useState<SavedLook | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const tryOnFileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("closet_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      const withUrls = await Promise.all(
        data.map(async (item) => {
          const { data: urlData } = await supabase.storage
            .from("closet-items")
            .createSignedUrl(item.storage_path, 3600);
          return { ...item, imageUrl: urlData?.signedUrl || "" };
        })
      );
      setItems(withUrls);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Fetch saved looks
  const fetchSavedLooks = useCallback(async () => {
    setLoadingLooks(true);
    const { data } = await supabase
      .from("closet_looks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setSavedLooks((data as SavedLook[]) || []);
    setLoadingLooks(false);
  }, [userId]);

  useEffect(() => { if (activeTab === "looks") fetchSavedLooks(); }, [activeTab, fetchSavedLooks]);

  const handleSaveLook = async () => {
    if (!tryOnResult || tryOnOutfitIdx === null || !outfits?.[tryOnOutfitIdx]) return;
    setSavingLook(true);
    try {
      const outfit = outfits[tryOnOutfitIdx];
      await supabase.from("closet_looks").insert({
        user_id: userId,
        image_url: tryOnResult,
        outfit_description: outfit.description,
        occasion: outfit.occasion,
        outfit_items: outfit.items,
        tips: outfit.tips,
      } as any);
      setLookSaved(true);
      setTimeout(() => setLookSaved(false), 2000);
    } catch (err) {
      console.error("Save look error:", err);
    }
    setSavingLook(false);
  };

  const handleDeleteLook = async (lookId: string) => {
    try {
      await supabase.from("closet_looks").delete().eq("id", lookId);
      setSavedLooks(prev => prev.filter(l => l.id !== lookId));
      if (expandedLook?.id === lookId) setExpandedLook(null);
    } catch (err) {
      console.error("Delete look error:", err);
    }
  };

  // Fetch active style plan
  const fetchActivePlan = useCallback(async () => {
    const { data } = await supabase
      .from("closet_style_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
    setActivePlan(data?.[0] || null);
  }, [userId]);

  useEffect(() => { fetchActivePlan(); }, [fetchActivePlan]);

  const handleCreatePlan = async () => {
    if (items.length < 3) return;
    setCreatingPlan(true);
    try {
      const itemDescriptions = items.map(
        (i) => `${i.category}${i.color ? ` (${i.color})` : ""}${i.label ? `: ${i.label}` : ""}`
      );
      const { data, error } = await supabase.functions.invoke("closet-style-plan", {
        body: { items: itemDescriptions, gender, days: planDays },
      });
      if (error) throw error;

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + planDays - 1);

      await supabase.from("closet_style_plans").insert({
        user_id: userId,
        days: planDays,
        end_date: endDate.toISOString().split("T")[0],
        daily_outfits: data?.outfits || [],
        gender,
      });

      setShowPlanSetup(false);
      await fetchActivePlan();
    } catch (err) {
      console.error("Plan creation error:", err);
    }
    setCreatingPlan(false);
  };

  const handleCancelPlan = async () => {
    if (!activePlan) return;
    try {
      await supabase.from("closet_style_plans")
        .update({ status: "cancelled" })
        .eq("id", activePlan.id);
      setActivePlan(null);
    } catch (err) {
      console.error("Cancel plan error:", err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    try {
      const base64 = await fixImageOrientation(file);
      setPendingPreview(base64);
    } catch {
      // Fallback — track URL for cleanup
      const fallbackUrl = URL.createObjectURL(file);
      setPendingPreview(fallbackUrl);
    }
    setShowAddForm(true);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const ext = pendingFile.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("closet-items")
        .upload(path, pendingFile, { contentType: pendingFile.type });
      if (uploadErr) throw uploadErr;

      await supabase.from("closet_items").insert({
        user_id: userId,
        storage_path: path,
        label: newLabel || null,
        category: newCategory,
        color: newColor || null,
      });

      setShowAddForm(false);
      setPendingFile(null);
      setPendingPreview(null);
      setNewLabel("");
      setNewColor("");
      setNewCategory("tops");
      await fetchItems();
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  const handleDelete = async (item: ClosetItem) => {
    try {
      await supabase.storage.from("closet-items").remove([item.storage_path]);
      await supabase.from("closet_items").delete().eq("id", item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Delete closet item error:", err);
    }
  };

  const handleGenerateOutfits = async () => {
    if (items.length < 2) return;
    setGenerating(true);
    setOutfits(null);
    setShowOutfits(true);
    try {
      const itemDescriptions = items.map(
        (i) => `${i.category}${i.color ? ` (${i.color})` : ""}${i.label ? `: ${i.label}` : ""}`
      );
      const { data, error } = await supabase.functions.invoke("closet-outfits", {
        body: { items: itemDescriptions, gender, count: 3 },
      });
      if (error) throw error;
      setOutfits(data?.outfits || []);
    } catch (err) {
      console.error("Outfit generation error:", err);
      setOutfits([]);
    }
    setGenerating(false);
  };

  const handleTryOnFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fixImageOrientation(file);
      setTryOnPhoto(base64);
    } catch {
      const reader = new FileReader();
      reader.onload = () => setTryOnPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleTryOn = async (outfitIdx: number) => {
    if (!outfits || !outfits[outfitIdx]) return;

    // If no photo yet, prompt for one
    if (!tryOnPhoto) {
      setTryOnOutfitIdx(outfitIdx);
      tryOnFileRef.current?.click();
      return;
    }

    setTryOnOutfitIdx(outfitIdx);
    setTryOnGenerating(true);
    setTryOnResult(null);
    try {
      const outfit = outfits[outfitIdx];
      const { data, error } = await supabase.functions.invoke("closet-try-on", {
        body: { imageBase64: tryOnPhoto, items: items.map(i => i.label || i.category), gender, outfit },
      });
      if (error) throw error;
      setTryOnResult(data?.generatedImage || null);
    } catch (err) {
      console.error("Try-on error:", err);
      setTryOnResult(null);
    }
    setTryOnGenerating(false);
  };

  // Trigger try-on after photo is selected
  useEffect(() => {
    if (tryOnPhoto && tryOnOutfitIdx !== null && !tryOnGenerating && !tryOnResult) {
      handleTryOn(tryOnOutfitIdx);
    }
  }, [tryOnPhoto]);

  const filtered = activeFilter === "all" ? items : items.filter((i) => i.category === activeFilter);
  

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingTop: 0 }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        padding: "env(safe-area-inset-top, 12px) 16px 12px",
        background: "hsla(20 18% 6% / 0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid hsla(0 0% 100% / 0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <ArrowLeft size={20} color="hsla(0 0% 100% / 0.7)" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shirt size={18} color="hsl(var(--glamora-gold))" />
          <span className="serif" style={{ fontSize: 18, fontWeight: 700, color: "white" }}>My Closet</span>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: "pointer",
          }}
        >
          <Plus size={18} color="white" />
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
      <input ref={tryOnFileRef} type="file" accept="image/*" capture="environment" onChange={handleTryOnFileSelect} style={{ display: "none" }} />

      {/* Tab switcher: Closet / My Looks */}
      <div style={{
        display: "flex", gap: 0, padding: "8px 16px",
        borderBottom: "1px solid hsla(0 0% 100% / 0.06)",
      }}>
        {([{ id: "closet", label: "Wardrobe", icon: Shirt }, { id: "looks", label: "My Looks", icon: ImageIcon }] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 0,
              background: "none", cursor: "pointer",
              borderBottom: `2px solid ${activeTab === tab.id ? "hsl(var(--glamora-gold))" : "transparent"}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontSize: 12, fontWeight: 700, border: "none",
              borderBottomWidth: 2, borderBottomStyle: "solid",
              borderBottomColor: activeTab === tab.id ? "hsl(var(--glamora-gold))" : "transparent",
              color: activeTab === tab.id ? "hsl(var(--glamora-gold))" : "hsla(0 0% 100% / 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.id === "looks" && savedLooks.length > 0 && (
              <span style={{
                fontSize: 9, padding: "1px 5px", borderRadius: 100,
                background: "hsla(var(--glamora-gold) / 0.15)",
                color: "hsl(var(--glamora-gold))",
                fontWeight: 700,
              }}>
                {savedLooks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "closet" ? (
      <>
      {/* Category filter pills */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px",
        WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
      }}>
        <button
          onClick={() => setActiveFilter("all")}
          style={{
            flexShrink: 0, padding: "6px 14px", borderRadius: 100,
            background: activeFilter === "all" ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))" : "hsla(0 0% 100% / 0.06)",
            border: `1px solid ${activeFilter === "all" ? "hsla(var(--glamora-gold) / 0.3)" : "hsla(0 0% 100% / 0.1)"}`,
            color: activeFilter === "all" ? "white" : "hsla(0 0% 100% / 0.6)",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}
        >
          All ({items.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: 100,
                background: activeFilter === cat.id ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))" : "hsla(0 0% 100% / 0.06)",
                border: `1px solid ${activeFilter === cat.id ? "hsla(var(--glamora-gold) / 0.3)" : "hsla(0 0% 100% / 0.1)"}`,
                color: activeFilter === cat.id ? "white" : "hsla(0 0% 100% / 0.6)",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* AI Outfit Generator CTA */}
      {items.length >= 2 && (
        <div style={{ padding: "0 16px 12px" }}>
          <button
            onClick={handleGenerateOutfits}
            disabled={generating}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 16, cursor: "pointer",
              background: "linear-gradient(135deg, hsla(280 55% 55% / 0.15), hsla(var(--glamora-gold) / 0.1))",
              border: "1.5px solid hsla(280 55% 55% / 0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: "0 4px 20px hsla(280 55% 55% / 0.15)",
            }}
          >
            {generating ? (
              <Loader2 size={18} color="hsl(280 55% 60%)" className="animate-spin" />
            ) : (
              <Sparkles size={18} color="hsl(280 55% 60%)" />
            )}
            <span style={{ fontSize: 13, fontWeight: 700, color: "hsla(0 0% 100% / 0.9)" }}>
              {generating ? "Creating Outfits…" : "✨ AI Style My Closet"}
            </span>
          </button>
        </div>
      )}

      {/* 7-Day Style Plan */}
      {items.length >= 3 && (
        <div style={{ padding: "0 16px 12px" }}>
          {activePlan ? (
            <div style={{
              padding: 16, borderRadius: 16,
              background: "linear-gradient(135deg, hsla(160 50% 45% / 0.12), hsla(var(--glamora-gold) / 0.08))",
              border: "1.5px solid hsla(160 50% 45% / 0.25)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CalendarDays size={16} color="hsl(160 50% 55%)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                    {activePlan.days}-Day Style Plan
                  </span>
                </div>
                <button onClick={handleCancelPlan} style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 100,
                  background: "hsla(0 60% 50% / 0.15)", border: "1px solid hsla(0 60% 50% / 0.2)",
                  color: "hsl(0 60% 65%)", cursor: "pointer", fontWeight: 600,
                }}>
                  Cancel
                </button>
              </div>

              <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.5)", marginBottom: 10 }}>
                {new Date(activePlan.start_date).toLocaleDateString()} → {new Date(activePlan.end_date).toLocaleDateString()}
              </div>

              {/* Daily outfit cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(activePlan.daily_outfits as any[]).map((outfit: any, i: number) => {
                  const dayDate = new Date(activePlan.start_date);
                  dayDate.setDate(dayDate.getDate() + i);
                  const isToday = dayDate.toDateString() === new Date().toDateString();
                  const isPast = dayDate < new Date() && !isToday;

                  return (
                    <div key={i} style={{
                      padding: "10px 12px", borderRadius: 12,
                      background: isToday ? "hsla(160 50% 45% / 0.15)" : "hsla(0 0% 100% / 0.04)",
                      border: `1px solid ${isToday ? "hsla(160 50% 45% / 0.3)" : "hsla(0 0% 100% / 0.06)"}`,
                      opacity: isPast ? 0.5 : 1,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {isPast && <Check size={12} color="hsl(160 50% 55%)" />}
                          <span style={{
                            fontSize: 11, fontWeight: 700,
                            color: isToday ? "hsl(160 50% 55%)" : "hsla(0 0% 100% / 0.7)",
                          }}>
                            {isToday ? "📍 Today" : `Day ${i + 1}`}
                          </span>
                          <span style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.4)" }}>
                            {dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <span style={{ fontSize: 9, color: "hsla(0 0% 100% / 0.4)", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
                          {outfit.occasion}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "white", fontWeight: 600, marginTop: 4 }}>
                        {outfit.description}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {outfit.items?.map((item: string, j: number) => (
                          <span key={j} style={{
                            padding: "2px 8px", borderRadius: 100, fontSize: 9,
                            background: "hsla(0 0% 100% / 0.06)",
                            color: "hsla(0 0% 100% / 0.6)",
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                      {outfit.tips && (
                        <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.4)", marginTop: 4 }}>
                          💡 {outfit.tips}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPlanSetup(true)}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 16, cursor: "pointer",
                background: "linear-gradient(135deg, hsla(160 50% 45% / 0.12), hsla(var(--glamora-gold) / 0.08))",
                border: "1.5px solid hsla(160 50% 45% / 0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 4px 16px hsla(160 50% 45% / 0.12)",
              }}
            >
              <CalendarDays size={18} color="hsl(160 50% 55%)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "hsla(0 0% 100% / 0.9)" }}>
                📅 AI Style Me for Up to 7 Days
              </span>
            </button>
          )}
        </div>
      )}

      {/* Items grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Loader2 size={28} color="hsl(var(--glamora-gold))" className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 30px" }}>
          <Shirt size={48} color="hsla(0 0% 100% / 0.15)" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: "hsla(0 0% 100% / 0.7)", marginBottom: 8 }}>
            Your closet is empty
          </div>
          <div style={{ fontSize: 12, color: "hsla(0 0% 100% / 0.4)", marginBottom: 20 }}>
            Take photos of your clothes and the AI will create outfits from what you already own
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: "12px 24px", borderRadius: 100,
              background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
              color: "white", fontSize: 13, fontWeight: 700,
              border: "none", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            <Camera size={16} /> Add Your First Item
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4,
          padding: "0 4px 100px",
        }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: 10 }}>
              <img
                src={item.imageUrl}
                alt={item.label || item.category}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "20px 8px 6px",
                background: "linear-gradient(transparent, hsla(0 0% 0% / 0.8))",
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "white" }}>
                  {item.label || CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                </div>
                {item.color && (
                  <div style={{ fontSize: 9, color: "hsla(0 0% 100% / 0.5)" }}>{item.color}</div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                style={{
                  position: "absolute", top: 4, right: 4,
                  width: 24, height: 24, borderRadius: 8,
                  background: "hsla(0 0% 0% / 0.6)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={12} color="hsla(0 70% 60% / 0.9)" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add item form modal */}
      {showAddForm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "hsla(0 0% 0% / 0.7)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div style={{
            width: "100%", maxWidth: 500,
            background: "hsl(20 18% 8%)",
            borderRadius: "24px 24px 0 0",
            padding: "20px 20px env(safe-area-inset-bottom, 20px)",
            border: "1px solid hsla(0 0% 100% / 0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Add to Closet</span>
              <button onClick={() => { setShowAddForm(false); setPendingFile(null); setPendingPreview(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={20} color="hsla(0 0% 100% / 0.5)" />
              </button>
            </div>

            {pendingPreview && (
              <img src={pendingPreview} alt="Preview" style={{
                width: "100%", height: 180, objectFit: "cover", borderRadius: 14, marginBottom: 14,
              }} />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: "hsla(0 0% 100% / 0.06)",
                  border: "1px solid hsla(0 0% 100% / 0.1)",
                  color: "white", fontSize: 13,
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>

              <input
                placeholder="Label (optional)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: "hsla(0 0% 100% / 0.06)",
                  border: "1px solid hsla(0 0% 100% / 0.1)",
                  color: "white", fontSize: 13,
                }}
              />

              <input
                placeholder="Color (optional)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: "hsla(0 0% 100% / 0.06)",
                  border: "1px solid hsla(0 0% 100% / 0.1)",
                  color: "white", fontSize: 13,
                }}
              />

              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  padding: "14px", borderRadius: 14, cursor: "pointer",
                  background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
                  color: "white", fontSize: 14, fontWeight: 700,
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {uploading ? "Uploading…" : "Add to Closet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Outfit Results overlay */}
      {showOutfits && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "hsla(0 0% 0% / 0.8)", backdropFilter: "blur(12px)",
          overflowY: "auto",
        }}>
          <div style={{
            maxWidth: 500, margin: "0 auto",
            padding: "env(safe-area-inset-top, 16px) 16px env(safe-area-inset-bottom, 16px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} color="hsl(var(--glamora-gold))" />
                <span className="serif" style={{ fontSize: 18, fontWeight: 700, color: "white" }}>AI Outfit Ideas</span>
              </div>
              <button onClick={() => { setShowOutfits(false); setTryOnResult(null); setTryOnOutfitIdx(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={20} color="hsla(0 0% 100% / 0.5)" />
              </button>
            </div>

            {/* Full-body photo upload strip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
              padding: "10px 14px", borderRadius: 14,
              background: "hsla(0 0% 100% / 0.04)",
              border: "1px solid hsla(0 0% 100% / 0.08)",
            }}>
              {tryOnPhoto ? (
                <img src={tryOnPhoto} alt="Your photo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "hsla(0 0% 100% / 0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <UserCircle size={22} color="hsla(0 0% 100% / 0.3)" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.8)" }}>
                  {tryOnPhoto ? "Your Photo" : "Upload Full-Body Photo"}
                </div>
                <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.4)" }}>
                  {tryOnPhoto ? "Tap an outfit to try it on you" : "Required to try outfits on you"}
                </div>
              </div>
              <button
                onClick={() => tryOnFileRef.current?.click()}
                style={{
                  padding: "6px 12px", borderRadius: 10,
                  background: tryOnPhoto ? "hsla(0 0% 100% / 0.06)" : "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
                  border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 600,
                  color: tryOnPhoto ? "hsla(0 0% 100% / 0.6)" : "white",
                }}
              >
                {tryOnPhoto ? "Change" : "Upload"}
              </button>
            </div>

            {/* Try-on result display (inline) */}
            {(tryOnGenerating || tryOnResult) && (
              <div style={{
                marginBottom: 16, borderRadius: 18, overflow: "hidden",
                border: "1.5px solid hsla(var(--glamora-gold) / 0.25)",
                background: "hsla(0 0% 0% / 0.4)",
              }}>
                {tryOnGenerating ? (
                  <div style={{ padding: "50px 20px", textAlign: "center" }}>
                    <Loader2 size={36} color="hsl(var(--glamora-gold))" className="animate-spin" />
                    <div style={{ fontSize: 13, color: "hsla(0 0% 100% / 0.6)", marginTop: 14, fontWeight: 600 }}>
                      Styling you in this outfit…
                    </div>
                    <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.35)", marginTop: 4 }}>
                      This may take 20-30 seconds
                    </div>
                  </div>
                ) : tryOnResult ? (
                  <div>
                    <img src={tryOnResult} alt="Try-on result" style={{ width: "100%", borderRadius: "16px 16px 0 0" }} />
                    <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-gold))" }}>
                        ✨ {outfits && tryOnOutfitIdx !== null ? outfits[tryOnOutfitIdx]?.description : "Your Look"}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => { if (tryOnOutfitIdx !== null) { setTryOnResult(null); handleTryOn(tryOnOutfitIdx); } }}
                          style={{
                            padding: "5px 10px", borderRadius: 8,
                            background: "hsla(0 0% 100% / 0.06)", border: "1px solid hsla(0 0% 100% / 0.1)",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                            fontSize: 10, fontWeight: 600, color: "hsla(0 0% 100% / 0.6)",
                          }}
                        >
                          <RotateCcw size={10} /> Redo
                        </button>
                        <button
                          onClick={() => { setTryOnResult(null); setTryOnOutfitIdx(null); }}
                          style={{
                            padding: "5px 10px", borderRadius: 8,
                            background: "hsla(0 0% 100% / 0.06)", border: "1px solid hsla(0 0% 100% / 0.1)",
                            cursor: "pointer", fontSize: 10, fontWeight: 600, color: "hsla(0 0% 100% / 0.6)",
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {generating ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Loader2 size={32} color="hsl(var(--glamora-gold))" className="animate-spin" />
                <div style={{ fontSize: 13, color: "hsla(0 0% 100% / 0.6)", marginTop: 12 }}>
                  Styling your wardrobe…
                </div>
              </div>
            ) : outfits && outfits.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {outfits.map((outfit, i) => (
                  <div key={i} style={{
                    padding: 16, borderRadius: 18,
                    background: tryOnOutfitIdx === i ? "hsla(var(--glamora-gold) / 0.08)" : "hsla(0 0% 100% / 0.05)",
                    border: `1px solid ${tryOnOutfitIdx === i ? "hsla(var(--glamora-gold) / 0.3)" : "hsla(var(--glamora-gold) / 0.15)"}`,
                    transition: "all 0.2s ease",
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "hsl(var(--glamora-gold))",
                      textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
                    }}>
                      {outfit.occasion}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 8 }}>
                      {outfit.description}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      {outfit.items.map((item, j) => (
                        <span key={j} style={{
                          padding: "4px 10px", borderRadius: 100,
                          background: "hsla(var(--glamora-gold) / 0.1)",
                          border: "1px solid hsla(var(--glamora-gold) / 0.15)",
                          fontSize: 11, color: "hsla(0 0% 100% / 0.8)",
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.5)", lineHeight: 1.4, flex: 1 }}>
                        💡 {outfit.tips}
                      </div>
                      <button
                        onClick={() => handleTryOn(i)}
                        disabled={tryOnGenerating}
                        style={{
                          flexShrink: 0, marginLeft: 10,
                          padding: "8px 14px", borderRadius: 12,
                          background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
                          border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 11, fontWeight: 700, color: "white",
                          opacity: tryOnGenerating ? 0.5 : 1,
                        }}
                      >
                        <Camera size={12} /> Try On
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleGenerateOutfits}
                  style={{
                    padding: "12px", borderRadius: 14, cursor: "pointer",
                    background: "hsla(0 0% 100% / 0.06)",
                    border: "1px solid hsla(0 0% 100% / 0.1)",
                    color: "hsla(0 0% 100% / 0.7)", fontSize: 12, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <Sparkles size={14} /> Generate More Outfits
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 30, color: "hsla(0 0% 100% / 0.5)", fontSize: 13 }}>
                Couldn't generate outfits. Try adding more items to your closet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan setup modal */}
      {showPlanSetup && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "hsla(0 0% 0% / 0.7)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 360, borderRadius: 24,
            background: "hsl(20 18% 8%)",
            border: "1px solid hsla(160 50% 45% / 0.2)",
            padding: 24, textAlign: "center",
          }}>
            <CalendarDays size={32} color="hsl(160 50% 55%)" style={{ marginBottom: 12 }} />
            <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>
              AI Style Plan
            </div>
            <div style={{ fontSize: 12, color: "hsla(0 0% 100% / 0.55)", lineHeight: 1.5, marginBottom: 20 }}>
              The AI will create a unique outfit from your closet for each day. Get a full week of styled looks using what you already own.
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.5)", marginBottom: 8, fontWeight: 600 }}>
                HOW MANY DAYS?
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {[3, 5, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setPlanDays(d)}
                    style={{
                      width: 56, height: 56, borderRadius: 14, cursor: "pointer",
                      background: planDays === d
                        ? "linear-gradient(135deg, hsl(160 50% 45%), hsl(160 50% 55%))"
                        : "hsla(0 0% 100% / 0.06)",
                      border: `1.5px solid ${planDays === d ? "hsla(160 50% 55% / 0.4)" : "hsla(0 0% 100% / 0.1)"}`,
                      color: planDays === d ? "white" : "hsla(0 0% 100% / 0.6)",
                      fontSize: 18, fontWeight: 700,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {d}
                    <span style={{ fontSize: 8, fontWeight: 600, marginTop: -2 }}>days</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreatePlan}
              disabled={creatingPlan}
              style={{
                width: "100%", padding: "14px", borderRadius: 14, cursor: "pointer",
                background: "linear-gradient(135deg, hsl(160 50% 45%), hsl(160 50% 55%))",
                color: "white", fontSize: 14, fontWeight: 700,
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: creatingPlan ? 0.6 : 1,
              }}
            >
              {creatingPlan ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {creatingPlan ? "Creating Plan…" : "Generate My Plan"}
            </button>

            <button
              onClick={() => setShowPlanSetup(false)}
              style={{
                marginTop: 10, background: "none", border: "none", cursor: "pointer",
                color: "hsla(0 0% 100% / 0.4)", fontSize: 12,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClosetScreen;
