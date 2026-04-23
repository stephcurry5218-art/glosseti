/**
 * Unified image picker for web + native (iOS/Android).
 *
 * On native (Capacitor), uses @capacitor/camera which correctly anchors the
 * action sheet popover on iPad — preventing the NSInvalidArgumentException
 * crash that occurs when an unanchored UIImagePickerController is presented
 * on iPadOS.
 *
 * On web, falls back to a hidden <input type="file"> click.
 */
import { Capacitor } from "@capacitor/core";

export type PickSource = "camera" | "library" | "prompt";

/**
 * Returns a File object selected by the user, or null if cancelled.
 *
 * @param fileInput - Hidden <input type="file"> element used as the web fallback.
 * @param source - "camera", "library", or "prompt" (lets user choose). Default "prompt".
 */
export async function pickImage(
  fileInput: HTMLInputElement | null,
  source: PickSource = "prompt"
): Promise<File | null> {
  // Native path (iOS / Android) — safe on iPad
  if (Capacitor.isNativePlatform()) {
    try {
      const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");

      const cameraSource =
        source === "camera"
          ? CameraSource.Camera
          : source === "library"
          ? CameraSource.Photos
          : CameraSource.Prompt;

      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: cameraSource,
        // Promptless on iPad popover anchoring is handled internally by plugin
        promptLabelHeader: "Add Photo",
        promptLabelPhoto: "Choose from Library",
        promptLabelPicture: "Take Photo",
      });

      if (!photo.webPath) return null;

      const res = await fetch(photo.webPath);
      const blob = await res.blob();
      const ext = photo.format || "jpeg";
      return new File([blob], `photo_${Date.now()}.${ext}`, {
        type: blob.type || `image/${ext}`,
      });
    } catch (err: any) {
      // User cancelled — return null silently
      const msg = String(err?.message || err || "");
      if (msg.toLowerCase().includes("cancel") || msg.toLowerCase().includes("denied")) {
        return null;
      }
      console.error("Native image picker failed, falling back to file input:", err);
      // Fall through to web fallback
    }
  }

  // Web fallback
  return new Promise((resolve) => {
    if (!fileInput) {
      resolve(null);
      return;
    }
    const handler = () => {
      const f = fileInput.files?.[0] || null;
      fileInput.removeEventListener("change", handler);
      fileInput.value = "";
      resolve(f);
    };
    fileInput.addEventListener("change", handler);
    fileInput.click();
  });
}
