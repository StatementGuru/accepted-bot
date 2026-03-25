"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      setMessages([...updatedMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantMessage += parsed.text;
                setMessages([
                  ...updatedMessages,
                  { role: "assistant", content: assistantMessage },
                ]);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Something went wrong. Try again in a moment.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0b",
        fontFamily:
          "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#e4e4e7",
      }}
    >
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #1e1e22",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0f0f11",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Ted
          </div>
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "15px",
                color: "#f4f4f5",
              }}
            >
              accepted.bot
            </div>
            <div
              style={{ fontSize: "11px", color: "#71717a", marginTop: "1px" }}
            >
              UC Essay Coach
            </div>
          </div>
        </div>
        <button
          onClick={resetChat}
          style={{
            background: "#1e1e22",
            border: "1px solid #2e2e33",
            color: "#a1a1aa",
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          New Chat
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "16px",
              opacity: 0.6,
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Ted
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#f4f4f5",
              }}
            >
              accepted.bot
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#71717a",
                textAlign: "center",
                maxWidth: "420px",
                lineHeight: "1.5",
              }}
            >
              Your UC essay coach. Tell me about yourself and we'll find the
              stories that get you in.
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              {[
                "I'm applying to UCs this fall",
                "I'm a transfer student",
                "I already wrote some essays",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  style={{
                    background: "#1e1e22",
                    border: "1px solid #2e2e33",
                    color: "#a1a1aa",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: "10px",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: "700",
                  color: "#fff",
                  flexShrink: 0,
                  marginTop: "2px",
                  letterSpacing: "-0.02em",
                }}
              >
                Ted
              </div>
            )}
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius:
                  msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#22c55e" : "#1e1e22",
                color: msg.role === "user" ? "#fff" : "#d4d4d8",
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                fontWeight: "700",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              Ted
            </div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 4px",
                background: "#1e1e22",
                display: "flex",
                gap: "6px",
                alignItems: "center",
              }}
            >
              <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s ease-in-out infinite" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s ease-in-out 0.3s infinite" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s ease-in-out 0.6s infinite" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "16px 24px 20px",
          borderTop: "1px solid #1e1e22",
          background: "#0f0f11",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-end",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to Ted..."
            rows={1}
            style={{
              flex: 1,
              background: "#1e1e22",
              border: "1px solid #2e2e33",
              color: "#e4e4e7",
              padding: "12px 16px",
              borderRadius: "14px",
              fontSize: "14px",
              lineHeight: "1.5",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              minHeight: "44px",
              maxHeight: "120px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
            onBlur={(e) => (e.target.style.borderColor = "#2e2e33")}
            onInput={(e) => {
              e.target.style.height = "44px";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              background:
                !input.trim() || loading
                  ? "#1e1e22"
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
              border: "none",
              color: !input.trim() || loading ? "#52525b" : "#fff",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              cursor: !input.trim() || loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#3f3f46",
            marginTop: "10px",
          }}
        >
          accepted.bot — powered by Statement Guru methodology
        </div>
      </div>
    </div>
  );
}