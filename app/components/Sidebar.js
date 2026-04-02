"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onSignOut, userName, isOpen, onToggle }) {
  const [newChatName, setNewChatName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const brainstorm = chats.find((c) => c.chat_type === "brainstorm");
  const essays = chats.filter((c) => c.chat_type !== "brainstorm");
  const create = async () => { await onNewChat(newChatName.trim() || "New Essay"); setNewChatName(""); setShowNew(false); };
  const handleDelete = async (chatId) => {
    if (confirmDelete === chatId) {
      await onDeleteChat(chatId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(chatId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };
  const sidebarStyle = {
    width: "85vw", maxWidth: "260px", height: "100vh", background: "#0f0f11", borderRight: "1px solid #1e1e22",
    display: "flex", flexDirection: "column", flexShrink: 0, transition: "transform 0.2s ease", zIndex: 50,
    position: "fixed", left: 0, top: 0, transform: isOpen ? "translateX(0)" : "translateX(-100%)"
  };
  return (
    <>
      {isOpen && <div onClick={onToggle} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}
      <div style={sidebarStyle}>
        <div style={{ padding: "16px", borderBottom: "1px solid #1e1e22" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#fff" }}>Ted</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f4f4f5" }}>accepted.bot</div>
            </div>
            <button onClick={onToggle} style={{ background: "none", border: "none", color: "#71717a", fontSize: "20px", cursor: "pointer", padding: "4px" }}>✕</button>
          </div>
          <button onClick={() => setShowNew(!showNew)} style={{ width: "100%", padding: "10px", background: "#1e1e22", border: "1px solid #2e2e33", color: "#a1a1aa", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "500", textAlign: "left" }}>+ New Essay Chat</button>
          {showNew && (
            <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
              <input value={newChatName} onChange={(e) => setNewChatName(e.target.value)} placeholder="e.g. UC1 Leadership" onKeyDown={(e) => e.key === "Enter" && create()} style={{ flex: 1, padding: "8px 10px", background: "#1a1a1d", border: "1px solid #2e2e33", color: "#e4e4e7", borderRadius: "6px", fontSize: "12px", outline: "none" }} />
              <button onClick={create} style={{ padding: "8px 12px", background: "#22c55e", border: "none", color: "#fff", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>Go</button>
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {brainstorm && (
            <button onClick={() => { onSelectChat(brainstorm.id); onToggle(); }} style={{ width: "100%", padding: "10px 12px", background: activeChatId === brainstorm.id ? "#1e1e22" : "transparent", border: activeChatId === brainstorm.id ? "1px solid #2e2e33" : "1px solid transparent", color: activeChatId === brainstorm.id ? "#22c55e" : "#a1a1aa", borderRadius: "8px", fontSize: "13px", cursor: "pointer", textAlign: "left", fontWeight: activeChatId === brainstorm.id ? "600" : "400", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>Brainstorm</button>
          )}
          {essays.length > 0 && (
            <div style={{ fontSize: "10px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 12px 6px", fontWeight: "600" }}>Essays</div>
          )}
          {essays.map((chat) => (
            <div key={chat.id} style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
              <button onClick={() => { onSelectChat(chat.id); onToggle(); }} style={{ flex: 1, padding: "10px 12px", background: activeChatId === chat.id ? "#1e1e22" : "transparent", border: activeChatId === chat.id ? "1px solid #2e2e33" : "1px solid transparent", color: activeChatId === chat.id ? "#22c55e" : "#a1a1aa", borderRadius: "8px", fontSize: "13px", cursor: "pointer", textAlign: "left", fontWeight: activeChatId === chat.id ? "600" : "400", display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title || "Untitled Essay"}</button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }} style={{ background: "none", border: "none", color: confirmDelete === chat.id ? "#ef4444" : "#3f3f46", fontSize: "14px", cursor: "pointer", padding: "4px 6px", flexShrink: 0 }}>{confirmDelete === chat.id ? "Sure?" : "✕"}</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e22", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "12px", color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{userName || "Student"}</div>
          <button onClick={onSignOut} style={{ background: "none", border: "none", color: "#52525b", fontSize: "11px", cursor: "pointer", padding: "4px 8px" }}>Sign out</button>
        </div>
      </div>
    </>
  );
}
