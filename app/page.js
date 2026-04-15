"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./components/AuthProvider";
import Sidebar from "./components/Sidebar";
import LoginPage from "./login/page";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    loadChats();
  }, [user]);

  useEffect(() => {
    if (!activeChatId) return;
    loadMessages(activeChatId);
  }, [activeChatId]);

  const loadChats = async () => {
    setInitialLoading(true);
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading chats:", error);
      setInitialLoading(false);
      return;
    }

    setChats(data || []);
    const brainstorm = data?.find((c) => c.chat_type === "brainstorm");
    if (brainstorm && !activeChatId) {
      setActiveChatId(brainstorm.id);
    }
    setInitialLoading(false);
  };

  const loadMessages = async (chatId) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    setMessages(
      (data || []).map((m) => ({
        role: m.role,
        content: m.content,
      }))
    );
  };

  const saveMessage = async (chatId, role, content) => {
    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      role,
      content,
    });
    if (error) console.error("Error saving message:", error);
  };

  const handleNewChat = async (title) => {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_id: user.id,
        chat_type: "essay",
        title,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat:", error);
      return;
    }

   setChats((prev) => [...prev, data]);
    setActiveChatId(data.id);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    await supabase.from("messages").delete().eq("chat_id", chatId);
    await supabase.from("chats").delete().eq("id", chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      const brainstorm = chats.find((c) => c.chat_type === "brainstorm");
      setActiveChatId(brainstorm?.id || null);
      setMessages([]);
    }
  };

 const sendMessage = async () => {
    if (!input.trim() || loading || !activeChatId) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    await saveMessage(activeChatId, "user", userMessage.content);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, userId: user.id, chatType: activeChat?.chat_type, chatTitle: activeChat?.title, chatId: activeChatId }),
             });
        
      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let displayedText = "";
      let buffer = "";
      let animating = false;

      setMessages([...updatedMessages, { role: "assistant", content: "" }]);

      const animate = () => {
        if (displayedText.length < fullText.length) {
          const charsToAdd = Math.min(3, fullText.length - displayedText.length);
          displayedText = fullText.slice(0, displayedText.length + charsToAdd);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: displayedText };
            return updated;
          });
          requestAnimationFrame(animate);
        } else {
          animating = false;
        }
      };

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
                fullText += parsed.text;
                if (!animating) {
                  animating = true;
                  requestAnimationFrame(animate);
                }
              }
            } catch (e) {}
          }
        }
      }

      // Finish any remaining animation
      while (displayedText.length < fullText.length) {
        await new Promise((r) => setTimeout(r, 16));
        const charsToAdd = Math.min(3, fullText.length - displayedText.length);
        displayedText = fullText.slice(0, displayedText.length + charsToAdd);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: displayedText };
          return updated;
        });
      }

      if (fullText) {
        await saveMessage(activeChatId, "assistant", fullText);
      }
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Something went wrong. Try again in a moment." },
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

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatTitle = activeChat?.title || "Brainstorm";
  const chatSubtitle = activeChat?.chat_type === "brainstorm" ? "UC Essay Coach" : "Essay Workshop";

  if (authLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b", color: "#71717a", fontSize: "14px" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }
return (
    <div style={{ height: "100vh", display: "flex", background: "#0a0a0b", fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#e4e4e7" }}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSignOut={signOut}
        userName={user.user_metadata?.name || user.email}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e1e22", display: "flex", alignItems: "center", gap: "12px", background: "#0f0f11" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "20px", cursor: "pointer", padding: "4px", display: "block" }} className="mobile-menu-btn">
            ☰
          </button>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "-0.02em", flexShrink: 0 }}>
            Ted
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "15px", color: "#f4f4f5" }}>{chatTitle}</div>
            <div style={{ fontSize: "11px", color: "#71717a", marginTop: "1px" }}>{chatSubtitle}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px", width: "100%", margin: "0 auto" }}>
          {initialLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#71717a", fontSize: "14px" }}>
              Loading your chats...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px", opacity: 0.6 }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "700", color: "#fff" }}>
                Ted
              </div>
              <div style={{ fontSize: "20px", fontWeight: "600", color: "#f4f4f5" }}>{chatTitle}</div>
              <div style={{ fontSize: "14px", color: "#71717a", textAlign: "center", maxWidth: "420px", lineHeight: "1.5" }}>
                {activeChat?.chat_type === "brainstorm"
                  ? "Your UC essay coach. Tell me about yourself and we'll find the stories that get you in."
                  : "Let's work on your " + chatTitle + " essay. Share your outline or draft when you're ready."}
              </div>
              {activeChat?.chat_type === "brainstorm" && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
                  {["I'm applying to UCs this fall", "I'm a transfer student", "I already wrote some essays"].map((s) => (
                    <button key={s} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }} style={{ background: "#1e1e22", border: "1px solid #2e2e33", color: "#a1a1aa", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", cursor: "pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "10px" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff", flexShrink: 0, marginTop: "2px", letterSpacing: "-0.02em" }}>
                    Ted
                  </div>
                )}
                <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? "#22c55e" : "#1e1e22", color: msg.role === "user" ? "#fff" : "#d4d4d8", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
{loading && messages[messages.length - 1]?.role !== "assistant" && (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
                Ted
              </div>
              <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#1e1e22", display: "flex", gap: "6px", alignItems: "center" }}>
                <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s ease-in-out infinite" }} />
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s ease-in-out 0.3s infinite" }} />
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.2s ease-in-out 0.6s infinite" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: "16px 24px 20px", borderTop: "1px solid #1e1e22", background: "#0f0f11" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", maxWidth: "800px", margin: "0 auto" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to Ted..."
              rows={1}
              style={{ flex: 1, background: "#1e1e22", border: "1px solid #2e2e33", color: "#e4e4e7", padding: "12px 16px", borderRadius: "14px", fontSize: "14px", lineHeight: "1.5", resize: "none", outline: "none", fontFamily: "inherit", minHeight: "44px", maxHeight: "120px" }}
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#2e2e33")}
              onInput={(e) => { e.target.style.height = "44px"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{ background: !input.trim() || loading ? "#1e1e22" : "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", color: !input.trim() || loading ? "#52525b" : "#fff", width: "44px", height: "44px", borderRadius: "12px", cursor: !input.trim() || loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: "11px", color: "#3f3f46", marginTop: "10px" }}>
            accepted.bot — powered by Statement Guru methodology
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
