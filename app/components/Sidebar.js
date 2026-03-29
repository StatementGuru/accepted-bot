"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onSignOut,
  userName,
  isOpen,
  onToggle,
}) {
  const [newChatName, setNewChatName] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  const brainstormChat = chats.find((c) => c.chat_type === "brainstorm");
  const essayChats = chats.filter((c) => c.chat_type !== "brainstorm");

  const handleCreateChat = async () => {
    const title = newChatName.trim() || "New Essay";
    await onNewChat(title);
    setNewChatName("");
    setShowNewChat(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      <div
        style={{
          width: "260px",
          height: "100vh",
          background: "#0f0f11",
          borderRight: "1px solid #1e1e22",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: isOpen ? "fixed" : "relative",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : undefined,
          transition: "transform 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #1e1e22",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Ted
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#f4f4f5" }}>
              accepted.bot
            </div>
          </div>

          <button
            onClick={() => setShowNewChat(!showNewChat)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1e1e22",
              border: "1px solid #2e2e33",
              color: "#a1a1aa",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: "500",
              textAlign: "left",
            }}
          >
            + New Essay Chat
          </button>

          {showNewChat && (
            <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
              <input
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="e.g. UC1 — Leadership"
                onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: "#1a1a1d",
                  border: "1px solid #2e2e33",
                  color: "#e4e4e7",
                  borderRadius: "6px",
                  fontSize: "12px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleCreateChat}
                style={{
                  padding: "8px 12px",
                  background: "#22c55e",
                  border: "none",
                  color: "#fff",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Go
              </button>
            </div>
          )}
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {/* Brainstorm - always first */}
          {brainstormChat && (
            <button
              onClick={() => onSelectChat(brainstormChat.id)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background:
                  activeChatId === brainstormChat.id ? "#1e1e22" : "transparent",
                border:
                  activeChatId === brainstormChat.id
                    ? "1px solid #2e2e33"
                    : "1px solid transparent",
                color:
                  activeChatId === brainstormChat.id ? "#22c55e" : "#a1a1aa",
                borderRadius: "8px",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: activeChatId === brainstormChat.id ? "600" : "400",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>💡</span>
              Brainstorm
            </button>
          )}

          {/* Divider */}
          {essayChats.length > 0 && (
            <div
              style={{
                fontSize: "10px",
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "12px 12px 6px",
                fontWeight: "600",
              }}
            >
              Essays
            </div>
          )}

          {/* Essay chats */}
          {essayChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
