import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, Share2, ChevronDown } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);
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
  }, [messages, expanded]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [expanded]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    if (!expanded) setExpanded(true);

    const userMsg: Msg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

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
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        maxHeight: expanded ? "75%" : "auto",
        background: expanded ? "hsl(var(--glamora-cream))" : "transparent",
        borderTopLeftRadius: expanded ? 22 : 0,
        borderTopRightRadius: expanded ? 22 : 0,
        boxShadow: expanded ? "0 -8px 40px hsla(0 0% 0% / 0.4)" : "none",
      }}
    >
      {/* Expanded chat header + messages */}
      {expanded && (
        <>
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderBottom: "1px solid hsla(var(--glamora-gold) / 0.12)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                Gio — Master Stylist
              </div>
            </div>
            {messages.length > 1 && (
              <ShareMenu
                text={formatChatForShare(messages)}
                trigger={
                  <button
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      background: "hsla(var(--glamora-gray-light) / 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Share2 size={13} color="hsl(var(--glamora-gray))" />
                  </button>
                }
              />
            )}
            <button
              onClick={() => setExpanded(false)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "hsla(var(--glamora-gray-light) / 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronDown size={16} color="hsl(var(--glamora-gray))" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 16,
                    borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                    borderBottomLeftRadius: msg.role === "assistant" ? 4 : 16,
                    background:
                      msg.role === "user"
                        ? `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`
                        : "hsl(var(--glamora-cream2))",
                    color: msg.role === "user" ? "white" : "hsl(var(--glamora-char))",
                    fontSize: 13,
                    lineHeight: 1.55,
                    border:
                      msg.role === "assistant"
                        ? "1px solid hsla(var(--glamora-gold) / 0.1)"
                        : "none",
                  }}
                >
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
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  borderRadius: 16,
                  borderBottomLeftRadius: 4,
                  background: "hsl(var(--glamora-cream2))",
                  border: "1px solid hsla(var(--glamora-gold) / 0.1)",
                }}
              >
                <Loader2
                  size={18}
                  color={`hsl(${accentColor})`}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Prompt bar — always visible */}
      <div
        style={{
          padding: expanded ? "10px 14px 14px" : "10px 14px 18px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: expanded
            ? "hsl(var(--glamora-cream))"
            : "linear-gradient(to top, hsla(var(--background) / 1) 60%, hsla(var(--background) / 0))",
          borderTop: expanded ? "1px solid hsla(var(--glamora-gold) / 0.1)" : "none",
        }}
      >
        {!expanded && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} color="white" />
          </div>
        )}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          onFocus={() => {
            if (messages.length > 1 && !expanded) setExpanded(true);
          }}
          placeholder="Ask Gio anything about style..."
          style={{
            flex: 1,
            padding: "11px 16px",
            borderRadius: 22,
            background: expanded
              ? "hsl(var(--glamora-cream2))"
              : "hsla(0 0% 100% / 0.08)",
            border: "1.5px solid hsla(var(--glamora-gold) / 0.15)",
            color: "hsl(var(--glamora-char))",
            fontSize: 13,
            fontFamily: "'Jost', sans-serif",
            outline: "none",
            backdropFilter: expanded ? "none" : "blur(12px)",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: input.trim()
              ? `linear-gradient(135deg, hsl(${accentColor}), hsl(var(--glamora-gold)))`
              : "hsla(var(--glamora-gray-light) / 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            opacity: isLoading ? 0.5 : 1,
            flexShrink: 0,
          }}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
};

export default StylistChat;
