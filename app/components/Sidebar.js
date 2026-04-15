"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const STAGES = ["brainstormed", "outlined", "drafting", "revising", "final"];
const STAGE_LABELS = { brainstormed: "Brainstorm", outlined: "Outline", drafting: "Draft", revising: "Revise", final: "Final" };

export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onSignOut, userName, isOpen, onToggle }) {
  const [newChatName, setNewChatName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hoveredStage, setHoveredStage] = useState(null);
  const brainstorm = chats.find((c) => c.chat_type === "brainstorm");
  const essays = chats.filter((c) => c.chat_type !== "brainstorm");
  const create = async () => { await onNewChat(newChatName.trim() || "New Essay"); setNewChatName(""); setShowNew(false); };
  const handleDelete = async (chatId) => {
    if (confirmDelete === chatId) { await onDeleteChat(chatId); setConfirmDelete(null); }
    else { setConfirmDelete(chatId); setTimeout(() => setConfirmDelete(null), 3000); }
  };
  const getStageIndex = (stage) => {
    const idx = STAGES.indexOf(stage);
    return idx === -1 ? 0 : idx;
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
            <button onClick={() => { onSelectChat(brainstorm.id); onToggle(); }} style={{ width: "100%", padding: "14px 14px", background: activeChatId === brainstorm.id ? "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.1))" : "rgba(34,197,94,0.05)", border: activeChatId === brainstorm.id ? "1px solid #22c55e" : "1px solid rgba(34,197,94,0.2)", color: activeChatId === brainstorm.id ? "#22c55e" : "#d4d4d8", borderRadius: "10px", fontSize: "14px", cursor: "pointer", textAlign: "left", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>🏠</span>
              <div>
                <div>Main</div>
                <div style={{ fontSize: "10px", color: "#71717a", fontWeight: "400", marginTop: "2px" }}>Home base & brainstorming</div>
              </div>
            </button>
          )}
          {essays.length > 0 && (
            <div style={{ fontSize: "10px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 12px 6px", fontWeight: "600" }}>Essays</div>
          )}
          {essays.map((chat) => {
            const stageIdx = getStageIndex(chat.stage);
            const isActive = activeChatId === chat.id;
            const tooltipKey = chat.id;
            return (
              <div key={chat.id} style={{ marginBottom: "6px", padding: "6px", borderRadius: "8px", background: isActive ? "#1e1e22" : "transparent", border: isActive ? "1px solid #2e2e33" : "1px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button onClick={() => { onSelectChat(chat.id); onToggle(); }} style={{ flex: 1, padding: "4px 6px", background: "transparent", border: "none", color: isActive ? "#22c55e" : "#a1a1aa", fontSize: "13px", cursor: "pointer", textAlign: "left", fontWeight: isActive ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title || "Untitled Essay"}</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }} style={{ background: "none", border: "none", color: confirmDelete === chat.id ? "#ef4444" : "#3f3f46", fontSize: "13px", cursor: "pointer", padding: "2px 4px", flexShrink: 0 }}>{confirmDelete === chat.id ? "Delete?" : "✕"}</button>
                </div>
                <div style={{ display: "flex", gap: "3px", padding: "4px 6px 2px", position: "relative" }}>
                  {STAGES.map((s, i) => (
                    <div key={s} onMouseEnter={() => setHoveredStage(`${tooltipKey}-${i}`)} onMouseLeave={() => setHoveredStage(null)} onClick={(e) => { e.stopPropagation(); setHoveredStage(`${tooltipKey}-${i}`); setTimeout(() => setHoveredStage(null), 1500); }} style={{ flex: 1, height: "6px", borderRadius: "2px", background: i <= stageIdx ? "#22c55e" : "#2e2e33", transition: "background 0.3s", cursor: "pointer", position: "relative" }}>
                      {hoveredStage === `${tooltipKey}-${i}` && (
                        <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", background: "#000", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", whiteSpace: "nowrap", zIndex: 100, pointerEvents: "none" }}>
                          {STAGE_LABELS[s]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e22", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "12px", color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{userName || "Student"}</div>
          <button onClick={onSignOut} style={{ background: "none", border: "none", color: "#52525b", fontSize: "11px", cursor: "pointer", padding: "4px 8px" }}>Sign out</button>
        </div>
      </div>
    </>
  );
}
