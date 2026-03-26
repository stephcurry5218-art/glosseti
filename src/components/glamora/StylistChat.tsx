import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ShareMenu from "./ShareMenu";
import { formatChatForShare } from "./shareUtils";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stylist-chat`;

const GREETING: Msg = {
  role: "assistant",
  content: "Hey there! ✨ I'm **Gio**, your personal Master Stylist. Whether you need outfit ideas, makeup tips, grooming advice, or help shopping on any budget — I've got you.\n\nWhat can I help you with today?",
};

interface Props {
  gender: "male" | "female";
}

const StylistChat = ({ gender }: Props) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMale = gender === "male";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Add gender context to first user message
    const apiMessages = updatedMessages
      .filter((m) => m !== GREETING)
      .map((m, i) => {
        if (i === 0 && m.role === "user") {
          return { ...m, content: `[User is ${gender}] ${m.content}` };
        }
        return m;
      });

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last !== GREETING) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, I hit a snag: ${e.message}. Try again? 💫` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const accentColor = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "absolute", bottom: 80, right: 16, zIndex: 100,
            width: 56, height: 56, borderRadius: "50%",
            background: `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`,
            border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px hsla(0 0% 0% / 0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse2 2.5s ease-in-out infinite",
          }}
        >
          <MessageCircle size={24} color="white" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 200,
          display: "flex", flexDirection: "column",
          background: "hsl(var(--glamora-cream))",
          animation: "fadeUp 0.3s ease both",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 18px", display: "flex", alignItems: "center", gap: 12,
            background: "hsl(var(--glamora-cream2))",
            borderBottom: "1px solid hsla(var(--glamora-gold) / 0.15)",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Gio — Master Stylist</div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>AI Fashion & Beauty Advisor</div>
            </div>
            {messages.length > 1 && (
              <ShareMenu
                text={formatChatForShare(messages)}
                trigger={
                  <button style={{
                    width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
                    background: "hsla(var(--glamora-gray-light) / 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Share2 size={14} color="hsl(var(--glamora-gray))" />
                  </button>
                }
              />
            )}
            <button onClick={() => setOpen(false)} style={{
              width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "hsla(var(--glamora-gray-light) / 0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={16} color="hsl(var(--glamora-gray))" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: "auto", padding: "16px 14px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}>
                <div style={{
                  padding: "12px 16px", borderRadius: 18,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 18,
                  borderBottomLeftRadius: msg.role === "assistant" ? 4 : 18,
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`
                    : "hsl(var(--glamora-cream2))",
                  color: msg.role === "user" ? "white" : "hsl(var(--glamora-char))",
                  fontSize: 13, lineHeight: 1.55,
                  border: msg.role === "assistant" ? "1px solid hsla(var(--glamora-gold) / 0.1)" : "none",
                }}>
                  {msg.role === "assistant" ? (
                    <div className="stylist-chat-md">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: 18, borderBottomLeftRadius: 4, background: "hsl(var(--glamora-cream2))", border: "1px solid hsla(var(--glamora-gold) / 0.1)" }}>
                <Loader2 size={18} color={`hsl(${accentColor})`} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px", display: "flex", gap: 8,
            background: "hsl(var(--glamora-cream2))",
            borderTop: "1px solid hsla(var(--glamora-gold) / 0.15)",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Gio anything about style..."
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 14,
                background: "hsl(var(--glamora-cream))",
                border: "1.5px solid hsla(var(--glamora-gold) / 0.15)",
                color: "hsl(var(--glamora-char))", fontSize: 13,
                fontFamily: "'Jost', sans-serif", outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                width: 44, height: 44, borderRadius: 14, border: "none", cursor: "pointer",
                background: input.trim()
                  ? `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`
                  : "hsla(var(--glamora-gray-light) / 0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", opacity: isLoading ? 0.5 : 1,
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StylistChat;
