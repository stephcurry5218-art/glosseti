// Social sharing utilities for Glosseti

const APP_URL = "https://glosseti.app";
const HASHTAGS = "Glosseti,AIStyle,FashionAI";

export type SharePlatform = "twitter" | "facebook" | "pinterest" | "whatsapp" | "copy" | "native";

interface ShareData {
  text: string;
  imageUrl?: string;
  url?: string;
}

const getShareUrl = (platform: SharePlatform, data: ShareData): string => {
  const text = encodeURIComponent(data.text);
  const url = encodeURIComponent(data.url || APP_URL);
  const hashtags = encodeURIComponent(HASHTAGS);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${url}&description=${text}${data.imageUrl ? `&media=${encodeURIComponent(data.imageUrl)}` : ""}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    default:
      return "";
  }
};

export const shareToSocial = async (platform: SharePlatform, data: ShareData): Promise<boolean> => {
  if (platform === "copy") {
    try {
      await navigator.clipboard.writeText(data.text + "\n" + (data.url || APP_URL));
      return true;
    } catch {
      return false;
    }
  }

  if (platform === "native" && navigator.share) {
    try {
      await navigator.share({
        title: "My Glamora Style",
        text: data.text,
        url: data.url || APP_URL,
      });
      return true;
    } catch {
      return false;
    }
  }

  const shareUrl = getShareUrl(platform, data);
  if (shareUrl) {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    return true;
  }
  return false;
};

export const formatChatForShare = (messages: { role: string; content: string }[]): string => {
  return messages
    .map((m) => (m.role === "user" ? `🗣️ You: ${m.content}` : `✨ Gio: ${m.content}`))
    .join("\n\n");
};
