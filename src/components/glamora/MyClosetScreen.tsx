import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Plus, Camera, Trash2, Shirt, Sparkles, X, Loader2 } from "lucide-react";
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
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fixed = await fixImageOrientation(file);
      setPendingFile(fixed);
      const url = URL.createObjectURL(fixed);
      setPendingPreview(url);
      setShowAddForm(true);
    } catch {
      setPendingFile(file);
      setPendingPreview(URL.createObjectURL(file));
      setShowAddForm(true);
    }
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
    await supabase.storage.from("closet-items").remove([item.storage_path]);
    await supabase.from("closet_items").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
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

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />

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
              <button onClick={() => setShowOutfits(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={20} color="hsla(0 0% 100% / 0.5)" />
              </button>
            </div>

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
                    background: "hsla(0 0% 100% / 0.05)",
                    border: "1px solid hsla(var(--glamora-gold) / 0.15)",
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
                    <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.5)", lineHeight: 1.4 }}>
                      💡 {outfit.tips}
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
    </div>
  );
};

export default MyClosetScreen;
