"use client";

// app/studio/page.js
//
// Studio main page — studio.accepted.bot
//
// Differences from undergrad page.js:
// - Loads chats where project='studio' (not by user_id)
// - Auto-creates four default phase chats on first visit if none exist
// - Sends to /api/studio-chat with senderName
// - Shows sender name on every message (always visible to both users)
// - Default landing chat = Writing
// - Uses StudioSidebar instead of Sidebar
// - Gates access: only director/producer roles can use this page

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../components/AuthProvider";
import LoginPage from "../login/page";
import StudioSidebar from "./components/StudioSidebar";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DEFAULT_CHATS = [
  { title: "Writing", category: "writing" },
  { title: "Visualization", category: "visualization" },
  { title: "Audio", category: "audio" },
  { title: "Editing", category: "editing" },
];

export default function StudioHome() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [loadedChatIds, setLoadedChatIds] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const inputRef = useRef(null);
  const endRefs = useRef({});
  const prevMsgCounts = useRef({});

  const scrollToBottom = useCallback((chatId, behavior) => {
    setTimeout(() => {
      if (endRefs.current[chatId]) {
        endRefs.current[chatId].scrollIntoView({ behavior: behavior || "smooth" });
      }
    }, 50);
  }, []);

  // Auto-scroll on new messages or streaming growth (same pattern as undergrad)
  useEffect(() => {
    if (!activeChatId) return;
    const msgs = allMessages[activeChatId] || [];
    const lastMsg = msgs[msgs.length - 1];
    const signature = `${msgs.length}:${lastMsg?.content?.length || 0}`;
    const prevSig = prevMsgCounts.current[activeChatId];
    if (signature !== prevSig) {
      scrollToBottom(activeChatId, "auto");
    }
    prevMsgCounts.current[activeChatId] = signature;
  }, [allMessages, activeChatId, scrollToBottom]);

  // Load profile to get role + display name
  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  // Load chats once profile is loaded and confirmed studio-eligible
  useEffect(() => {
    if (!profile) return;
    if (profile.role !== "director" && profile.role !== "producer") return;
    loadChats();
  }, [profile]);

  useEffect(() => {
    if (!activeChatId) return;
    try { localStorage.setItem("studio_active_chat", activeChatId); } catch (e) {}
    if (!loadedChatIds[activeChatId]) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId, loadedChatIds]);

  const loadProfile = async () => {
    setProfileLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      setProfileLoading(false);
      return;
    }

    setProfile(data);
    setProfileLoading(false);
  };

  const loadChats = async () => {
    setInitialLoading(true);

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("project", "studio")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading studio chats:", error);
      setInitialLoading(false);
      return;
    }

    let studioChats = data || [];

    // First visit: no studio chats exist yet → auto-create the four defaults.
    // We use the first user (by created_at) as the owner for record-keeping,
    // but RLS allows both director + producer to read/write all studio chats
    // regardless of user_id.
    if (studioChats.length === 0) {
      const created = await createDefaultChats();
      studioChats = created;
    }

    setChats(studioChats);

    // Pick which chat to land on: saved chat if valid, otherwise Writing
    let savedChatId = null;
    try { savedChatId = localStorage.getItem("studio_active_chat"); } catch (e) {}
    const savedChat = savedChatId && studioChats.find((c) => c.id === savedChatId);
    const writingChat = studioChats.find((c) => c.category === "writing");

    if (!activeChatId) {
      setActiveChatId(savedChat ? savedChat.id : writingChat?.id || studioChats[0]?.id || null);
    }
    setInitialLoading(false);
  };

  const createDefaultChats = async () => {
    const rows = DEFAULT_CHATS.map((c) => ({
      user_id: user.id,            // first creator owns the row; RLS shares it
      chat_type: "studio",
      project: "studio",
      category: c.category,
      title: c.title,
    }));

    const { data, error } = await supabase
      .from("chats")
      .insert(rows)
      .select();

    if (error) {
      console.error("Error creating default studio chats:", error);
      return [];
    }
    return data || [];
  };

  const fetchMessages = async (chatId) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    const loaded = (data || []).map((m) => ({
      role: m.role,
      content: m.content,
      senderName: m.sender_name,
    }));

    setAllMessages((prev) => ({ ...prev, [chatId]: loaded }));
    setLoadedChatIds((prev) => ({ ...prev, [chatId]: true }));
    prevMsgCounts.current[chatId] = loaded.length;
    scrollToBottom(chatId, "instant");
  };

  // saveMessage now records sender_id and sender_name for user messages
  const saveMessage = async (chatId, role, content, senderName) => {
    const row = { chat_id: chatId, role, content };
    if (role === "user") {
      row.sender_id = user.id;
      row.sender_name = senderName;
    }
    const { error } = await supabase.from("messages").insert(row);
    if (error) console.error("Error saving message:", error);
  };

  const handleNewChat = async (title, category) => {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_id: user.id,
        chat_type: "studio",
        project: "studio",
        category: category || "custom",
        title,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat:", error);
      return;
    }

    setChats((prev) => [...prev, data]);
    setAllMessages((prev) => ({ ...prev, [data.id]: [] }));
    setLoadedChatIds((prev) => ({ ...prev, [data.id]: true }));
    prevMsgCounts.current[data.id] = 0;
    setActiveChatId(data.id);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    await supabase.from("messages").delete().eq("chat_id", chatId);
    await supabase.from("chats").delete().eq("id", chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setAllMessages((prev) => { const u = { ...prev }; delete u[chatId]; return u; });
    setLoadedChatIds((prev) => { const u = { ...prev }; delete u[chatId]; return u; });
    delete prevMsgCounts.current[chatId];
    if (activeChatId === chatId) {
      const writingChat = chats.find((c) => c.category === "writing");
      setActiveChatId(writingChat?.id || chats[0]?.id || null);
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setSidebarOpen(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !activeChatId || !profile) return;

    const senderName = profile.name || profile.email?.split("@")[0] || "User";

    const userMessage = {
      role: "user",
      content: input.trim(),
      senderName,
    };
    const currentMsgs = allMessages[activeChatId] || [];
    const updatedMessages = [...currentMsgs, userMessage];

    setAllMessages((prev) => ({ ...prev, [activeChatId]: updatedMessages }));
    setInput("");
    setLoading(true);

    await saveMessage(activeChatId, "user", userMessage.content, senderName);

    const cid = activeChatId;

    try {
      const response = await fetch("/api/studio-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          userId: user.id,
          chatId: cid,
          senderName,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let displayedText = "";
      let buffer = "";
      let animating = false;

      setAllMessages((prev) => ({
        ...prev,
        [cid]: [...updatedMessages, { role: "assistant", content: "" }],
      }));

      const animate = () => {
        if (displayedText.length < fullText.length) {
          const charsToAdd = Math.min(1, fullText.length - displayedText.length);
          displayedText = fullText.slice(0, displayedText.length + charsToAdd);
          setAllMessages((prev) => {
            const msgs = [...(prev[cid] || [])];
            msgs[msgs.length - 1] = { role: "assistant", content: displayedText };
            return { ...prev, [cid]: msgs };
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

      while (displayedText.length < fullText.length) {
        await new Promise((r) => setTimeout(r, 16));
        const charsToAdd = Math.min(1, fullText.length - displayedText.length);
        displayedText = fullText.slice(0, displayedText.length + charsToAdd);
        setAllMessages((prev) => {
          const msgs = [...(prev[cid] || [])];
          msgs[msgs.length - 1] = { role: "assistant", content: displayedText };
          return { ...prev, [cid]: msgs };
        });
      }

      if (fullText) {
        await saveMessage(cid, "assistant", fullText, null);
        setAllMessages((prev) => {
          const msgs = [...(prev[cid] || [])];
          msgs[msgs.length - 1] = { role: "assistant", content: fullText };
          return { ...prev, [cid]: msgs };
        });
      }
    } catch (err) {
      setAllMessages((prev) => ({
        ...prev,
        [cid]: [...updatedMessages, { role: "assistant", content: "Something went wrong. Try again in a moment." }],
      }));
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ----- Render gates -----

  if (authLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b", color: "#71717a", fontSize: "14px" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (profileLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b", color: "#71717a", fontSize: "14px" }}>
        Loading profile...
      </div>
    );
  }

  // Access gate: only director and producer can use studio
  if (profile && profile.role !== "director" && profile.role !== "producer") {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0b", color: "#e4e4e7", padding: "24px", textAlign: "center", gap: "12px" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", letterSpacing: "1px" }}>
          STUDIO ACCESS REQUIRED
        </div>
        <div style={{ fontSize: "14px", color: "#a1a1aa", maxWidth: "400px", lineHeight: "1.5" }}>
          This area is for production team members only. If you think you should have access, contact Nived.
        </div>
        <button onClick={signOut} style={{ marginTop: "8px", background: "transparent", border: "1px solid #2e2e33", color: "#a1a1aa", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    );
  }

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatTitle = activeChat?.title || "Studio";
  const displayName = profile?.name || profile?.email?.split("@")[0] || "User";

  const chatPanels = chats.filter((c) => loadedChatIds[c.id]);

  return (
    <div style={{ height: "100vh", display: "flex", background: "#0a0a0b", fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#e4e4e7" }}>
      <StudioSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSignOut={signOut}
        userName={displayName}
        userRole={profile?.role}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e1e22", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", background: "#0f0f11" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "20px", cursor: "pointer", padding: "4px" }} className="mobile-menu-btn">
              ☰
            </button>
            <div>
              <div style={{ fontWeight: "700", fontSize: "22px", color: "#f4f4f5", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.5px" }}>
                {chatTitle}
              </div>
              <div style={{ fontSize: "11px", color: "#71717a", marginTop: "1px" }}>
                Real Monsters of Hollywood
              </div>
            </div>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "1px", color: "#f4f4f5" }}>
            STUDIO
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <img src="/tedbot.png" alt="Ted" style={{ width: "50px", height: "50px" }} />
          </div>
        </div>

        {/* Chat panels */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {initialLoading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a", fontSize: "14px", zIndex: 10 }}>
              Loading studio...
            </div>
          )}

          {chatPanels.map((chat) => {
            const msgs = allMessages[chat.id] || [];
            const isActive = chat.id === activeChatId;

            return (
              <div
                key={chat.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  overflowY: "auto",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  visibility: isActive ? "visible" : "hidden",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                  {msgs.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px", opacity: 0.6 }}>
                      <img src="/tedbot.png" alt="Ted" style={{ width: "80px", height: "80px" }} />
                      <div style={{ fontSize: "20px", fontWeight: "600", color: "#f4f4f5" }}>{chat.title}</div>
                      <div style={{ fontSize: "14px", color: "#71717a", textAlign: "center", maxWidth: "420px", lineHeight: "1.5" }}>
                        Production chat for {chat.title.toLowerCase()}. Both you and the team can talk to Ted here.
                      </div>
                    </div>
                  ) : (
                    msgs.map((msg, i) => {
                      const isUser = msg.role === "user";
                      const label = isUser ? (msg.senderName || "User") : "Ted";
                      // Sender-specific colors: amber for Nived, teal for Ben,
                      // fallback gray for any other future user
                      let userBg = "#52525b";
                      if (isUser && msg.senderName) {
                        const n = msg.senderName.toLowerCase();
                        if (n === "nived") userBg = "#f59e0b";      // amber
                        else if (n === "ben") userBg = "#0d9488";   // teal
                      }
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: "10px" }}>
                          <div style={{ maxWidth: "75%" }}>
                            <div style={{ fontSize: "13px", color: "#71717a", marginBottom: "5px", textAlign: isUser ? "right" : "left" }}>
                              {label}
                            </div>
                            <div style={{
                              padding: "12px 16px",
                              borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                              background: isUser ? userBg : "#1e1e22",
                              color: isUser ? "#fff" : "#d4d4d8",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word"
                            }}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isActive && loading && (msgs.length === 0 || msgs[msgs.length - 1]?.role !== "assistant") && (
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ maxWidth: "75%" }}>
                        <div style={{ fontSize: "13px", color: "#71717a", marginBottom: "5px" }}>Ted</div>
                        <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#1e1e22", display: "flex", gap: "6px", alignItems: "center" }}>
                          <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s ease-in-out infinite" }} />
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s ease-in-out 0.3s infinite" }} />
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s ease-in-out 0.6s infinite" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={(el) => { endRefs.current[chat.id] = el; }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <div style={{ padding: "16px 24px 20px", borderTop: "1px solid #1e1e22", background: "#0f0f11" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", maxWidth: "800px", margin: "0 auto" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message as ${displayName}...`}
              rows={1}
              style={{ flex: 1, background: "#1e1e22", border: "1px solid #2e2e33", color: "#e4e4e7", padding: "12px 16px", borderRadius: "14px", fontSize: "14px", lineHeight: "1.5", resize: "none", outline: "none", fontFamily: "inherit", minHeight: "44px", maxHeight: "120px" }}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = "#2e2e33")}
              onInput={(e) => { e.target.style.height = "44px"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{ background: !input.trim() || loading ? "#1e1e22" : "linear-gradient(135deg, #a78bfa, #7c3aed)", border: "none", color: !input.trim() || loading ? "#52525b" : "#fff", width: "44px", height: "44px", borderRadius: "12px", cursor: !input.trim() || loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: "12px", color: "#52525b", marginTop: "10px" }}>
            STUDIO — Real Monsters of Hollywood
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
