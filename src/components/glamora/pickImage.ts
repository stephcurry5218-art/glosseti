/**
 * Unified image picker for web + native (iOS/Android).
 *
 * On native (Capacitor), uses @capacitor/camera which correctly anchors the
 * action sheet popover on iPad — preventing the NSInvalidArgumentException
 * crash that occurs when an unanchored UIImagePickerController is presented
 * on iPadOS.
 *
 * Permission flow:
 *  1. Check current permission state (`Camera.checkPermissions`).
 *  2. If "prompt" / "prompt-with-rationale", request it (`Camera.requestPermissions`).
 *  3. If still "denied", surface a friendly message asking the user to open
 *     Settings → Glosseti → Camera/Photos. Apple App Review specifically tests
 *     this fallback path.
 *
 * On web, falls back to a hidden <input type="file"> click.
 */
import { Capacitor } from "@capacitor/core";

export type PickSource = "camera" | "library" | "prompt";

export type PickError =
  | { kind: "cancelled" }
  | { kind: "permission_denied"; permission: "camera" | "photos" }
  | { kind: "unknown"; message: string };

export interface PickResult {
  file: File | null;
  error?: PickError;
}

/**
 * Returns a File object selected by the user, or null if cancelled.
 * For richer error handling (permission denied, etc.) use `pickImageEx`.
 */
export async function pickImage(
  fileInput: HTMLInputElement | null,
  source: PickSource = "prompt"
): Promise<File | null> {
  const result = await pickImageEx(fileInput, source);
  return result.file;
}

/** Extended picker that returns structured errors for proper UX handling. */
export async function pickImageEx(
  fileInput: HTMLInputElement | null,
  source: PickSource = "prompt"
): Promise<PickResult> {
  // Native path (iOS / Android) — safe on iPad
  if (Capacitor.isNativePlatform()) {
    try {
      const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");

      // ── Permission flow ────────────────────────────────────────────
      const needsCamera = source === "camera" || source === "prompt";
      const needsPhotos = source === "library" || source === "prompt";

      const status = await Camera.checkPermissions();

      const cameraNeedsRequest =
        needsCamera && (status.camera === "prompt" || status.camera === "prompt-with-rationale");
      const photosNeedsRequest =
        needsPhotos && (status.photos === "prompt" || status.photos === "prompt-with-rationale");

      if (cameraNeedsRequest || photosNeedsRequest) {
        const requestList: ("camera" | "photos")[] = [];
        if (cameraNeedsRequest) requestList.push("camera");
        if (photosNeedsRequest) requestList.push("photos");
        await Camera.requestPermissions({ permissions: requestList });
      }

      // Re-check after the prompt
      const finalStatus = await Camera.checkPermissions();
      if (needsCamera && finalStatus.camera === "denied" && source === "camera") {
        return { file: null, error: { kind: "permission_denied", permission: "camera" } };
      }
      if (needsPhotos && finalStatus.photos === "denied" && source === "library") {
        return { file: null, error: { kind: "permission_denied", permission: "photos" } };
      }
      // For "prompt" mode, only fail if BOTH are denied (user might still pick the other)
      if (
        source === "prompt" &&
        finalStatus.camera === "denied" &&
        finalStatus.photos === "denied"
      ) {
        return { file: null, error: { kind: "permission_denied", permission: "photos" } };
      }

      // ── Take / pick the photo ──────────────────────────────────────
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
        // iPad popover anchoring is handled internally by the plugin
        promptLabelHeader: "Add Photo",
        promptLabelPhoto: "Choose from Library",
        promptLabelPicture: "Take Photo",
      });

      if (!photo.webPath) return { file: null, error: { kind: "cancelled" } };

      const res = await fetch(photo.webPath);
      const blob = await res.blob();
      const ext = photo.format || "jpeg";
      const file = new File([blob], `photo_${Date.now()}.${ext}`, {
        type: blob.type || `image/${ext}`,
      });
      return { file };
    } catch (err: unknown) {
      const msg = String((err as { message?: string })?.message || err || "");
      const lower = msg.toLowerCase();

      // User cancelled — silent
      if (lower.includes("cancel") || lower.includes("user denied access")) {
        return { file: null, error: { kind: "cancelled" } };
      }
      // Permission denied surfaced as exception
      if (lower.includes("permission") || lower.includes("denied") || lower.includes("not authorized")) {
        const perm: "camera" | "photos" = lower.includes("camera") ? "camera" : "photos";
        return { file: null, error: { kind: "permission_denied", permission: perm } };
      }
      console.error("Native image picker failed, falling back to file input:", err);
      // Fall through to web fallback for any other error
    }
  }

  // Web fallback
  return new Promise((resolve) => {
    if (!fileInput) {
      resolve({ file: null, error: { kind: "cancelled" } });
      return;
    }
    const handler = () => {
      const f = fileInput.files?.[0] || null;
      fileInput.removeEventListener("change", handler);
      fileInput.value = "";
      resolve({ file: f, error: f ? undefined : { kind: "cancelled" } });
    };
    fileInput.addEventListener("change", handler);
    fileInput.click();
  });
}

/** User-friendly message for a permission-denied error. Pair with toast.error(). */
export function permissionDeniedMessage(permission: "camera" | "photos"): string {
  const what = permission === "camera" ? "Camera" : "Photo Library";
  return `${what} access is off. Open Settings → Glosseti → ${what} to enable it.`;
}
