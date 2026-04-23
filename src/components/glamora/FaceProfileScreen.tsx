import { useState, useEffect, useRef } from "react";
import { Camera, Trash2, Plus, ChevronLeft, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fixImageOrientation } from "./fixImageOrientation";
import { pickImage } from "./pickImage";
import { toast } from "sonner";
import type { Gender } from "./GlamoraApp";

interface Props {
  onBack: () => void;
  gender: Gender;
  userId: string;
}

const MAX_REFS = 5;

const FaceProfileScreen = ({ onBack, gender, userId }: Props) => {
  const isMale = gender === "male";
  const accent = "var(--glamora-gold)";
  const [photos, setPhotos] = useState<{ id: string; url: string; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, [userId]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const { data: refs, error } = await supabase
        .from("face_references")
        .select("id, storage_path")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const photosWithUrls = await Promise.all(
        (refs || []).map(async (ref) => {
          const { data } = supabase.storage.from("face-references").getPublicUrl(ref.storage_path);
          // For private buckets, use createSignedUrl instead
          const { data: signedData } = await supabase.storage
            .from("face-references")
            .createSignedUrl(ref.storage_path, 3600);
          return {
            id: ref.id,
            url: signedData?.signedUrl || data.publicUrl,
            path: ref.storage_path,
          };
        })
      );
      setPhotos(photosWithUrls);
    } catch (err) {
      console.error("Failed to load face refs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (photos.length >= MAX_REFS) {
      toast.error(`Maximum ${MAX_REFS} selfies allowed`);
      return;
    }
    setUploading(true);
    try {
      const base64 = await fixImageOrientation(file, 1024);
      // Convert base64 to blob
      const response = await fetch(base64);
      const blob = await response.blob();

      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("face-references")
        .upload(fileName, blob, { contentType: "image/jpeg", upsert: false });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("face_references").insert({
        user_id: userId,
        storage_path: fileName,
      });

      if (dbError) throw dbError;

      toast.success("Selfie added!");
      await loadPhotos();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload selfie");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      await supabase.storage.from("face-references").remove([path]);
      await supabase.from("face_references").delete().eq("id", id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Selfie removed");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to remove selfie");
    }
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">My Face Profile</div>
          <div className="header-sub">Upload selfies so AI can learn your face</div>
        </div>
      </div>

      <div style={{ padding: "16px 22px" }}>
        {/* Info card */}
        <div className="anim-fadeUp glamora-card" style={{
          padding: "14px 16px", marginBottom: 16,
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.1), hsla(0 0% 100% / 0.04))`,
          border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Sparkles size={18} color={`hsl(${accent})`} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)", marginBottom: 4 }}>
                Better Results with More Selfies
              </div>
              <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.55)", lineHeight: 1.5 }}>
                Upload 3–5 selfies from different angles (front, left, right, slight tilt). 
                The AI uses these to preserve your <strong style={{ color: "hsla(0 0% 100% / 0.75)" }}>exact facial features</strong> when generating styled looks.
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="anim-fadeUp d1" style={{
          display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap",
        }}>
          {["Front facing", "Left profile", "Right profile", "Natural light", "No filters"].map((tip, i) => (
            <div key={i} style={{
              fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 100,
              background: "hsla(var(--glamora-gold) / 0.08)",
              border: "1px solid hsla(var(--glamora-gold) / 0.15)",
              color: "hsla(0 0% 100% / 0.6)",
            }}>
              {tip}
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="anim-fadeUp d1" style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
          padding: "8px 12px", borderRadius: 10,
          background: "hsla(140 50% 50% / 0.06)",
          border: "1px solid hsla(140 50% 50% / 0.15)",
        }}>
          <ShieldCheck size={14} color="hsl(140 50% 50%)" />
          <span style={{ fontSize: 10.5, color: "hsla(0 0% 100% / 0.5)", lineHeight: 1.4 }}>
            Your selfies are stored securely and only used for styling. They are never shared or used for any other purpose.
          </span>
        </div>

        {/* Photo grid */}
        <div className="anim-fadeUp d2" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}>
          {photos.map((photo) => (
            <div key={photo.id} style={{
              position: "relative",
              aspectRatio: "1",
              borderRadius: 14,
              overflow: "hidden",
              border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
            }}>
              <img
                src={photo.url}
                alt="Face reference"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => handleDelete(photo.id, photo.path)}
                style={{
                  position: "absolute", top: 6, right: 6,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "hsla(0 72% 50% / 0.85)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Trash2 size={12} color="white" />
              </button>
            </div>
          ))}

          {/* Add button */}
          {photos.length < MAX_REFS && (
            <button
              onClick={async () => {
                const file = await pickImage(fileRef.current, "prompt");
                if (file) handleUpload(file);
              }}
              disabled={uploading}
              style={{
                aspectRatio: "1",
                borderRadius: 14,
                border: `2px dashed hsla(var(--glamora-gold) / 0.3)`,
                background: "hsla(var(--glamora-gold) / 0.04)",
                cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s",
              }}
            >
              {uploading ? (
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: "2px solid hsla(var(--glamora-gold) / 0.3)",
                  borderTopColor: `hsl(${accent})`,
                  animation: "spin 1s linear infinite",
                }} />
              ) : (
                <>
                  <Plus size={22} color={`hsl(${accent})`} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "hsla(0 0% 100% / 0.5)" }}>
                    Add Selfie
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Status */}
        <div style={{
          marginTop: 16, textAlign: "center",
          fontSize: 11, color: "hsla(0 0% 100% / 0.45)",
        }}>
          {photos.length === 0 && !loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <AlertCircle size={13} color="hsla(40 70% 55%)" />
              <span>No selfies yet — add some for better face accuracy</span>
            </div>
          )}
          {photos.length > 0 && photos.length < 3 && (
            <span>
              {photos.length}/{MAX_REFS} selfies · Add {3 - photos.length} more for best results
            </span>
          )}
          {photos.length >= 3 && (
            <span style={{ color: "hsl(140 50% 55%)" }}>
              ✓ {photos.length}/{MAX_REFS} selfies · Great for face accuracy!
            </span>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

export default FaceProfileScreen;
