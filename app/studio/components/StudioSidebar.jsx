"use client";

// app/studio/components/StudioSidebar.jsx
//
// Sidebar for studio.accepted.bot
// - Shows all studio chats (shared between director + producer)
// - "+ New Chat" creates a custom phase chat with user-provided name
// - No prompt-mapping logic, no "Main Chat" concept
// - Default chats (Writing, Visualization, Audio, Editing) are auto-created
//   in the parent page, not here

import { useState } from "react";

const CATEGORY_ICONS = {
  writing: "✍️",
  visualization: "🎨",
  audio: "🎙️",
  editing: "✂️",
};

const DEFAULT_ICON = "💬";

function chatIcon(category) {
  return CATEGORY_ICONS[category?.toLowerCase()] || DEFAULT_ICON;
}

export default function StudioSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onSignOut,
  userName,
  userRole,
  isOpen,
  onToggle,
}) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const handleCreateChat = async () => {
    const name = newChatName.trim();
    if (!name) return;
    await onNewChat(name, "custom");
    setNewChatName("");
    setShowNewChatModal(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            display: "block",
          }}
          className="mobile-backdrop"
        />
      )}

      <div
        style={{
          width: "260px",
          background: "#0f0f11",
          borderRight: "1px solid #1e1e22",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 50,
        }}
        className={`studio-sidebar ${isOpen ? "open" : ""}`}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid #1e1e22",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              letterSpacing: "0.5px",
              color: "#f4f4f5",
              lineHeight: "1.1",
            }}
          >
            STUDIO
          </div>
          <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>
            Real Monsters of Hollywood
          </div>
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                background:
                  chat.id === activeChatId ? "#1e1e22" : "transparent",
                color: chat.id === activeChatId ? "#f4f4f5" : "#a1a1aa",
                fontSize: "14px",
                marginBottom: "2px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (chat.id !== activeChatId)
                  e.currentTarget.style.background = "#16161a";
              }}
              onMouseLeave={(e) => {
                if (chat.id !== activeChatId)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "16px" }}>{chatIcon(chat.category)}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {chat.title}
              </span>
              {/* Only allow delete for custom chats — don't let users accidentally
                  delete one of the four phase chats. They can always create a new one. */}
              {chat.category === "custom" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${chat.title}"? Messages will be lost.`)) {
                      onDeleteChat(chat.id);
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#52525b",
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                  title="Delete chat"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setShowNewChatModal(true)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "transparent",
              border: "1px dashed #2e2e33",
              color: "#71717a",
              fontSize: "13px",
              cursor: "pointer",
              marginTop: "8px",
              textAlign: "left",
            }}
          >
            + New Chat
          </button>
        </div>

        {/* User footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #1e1e22",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", color: "#e4e4e7" }}>{userName}</div>
            <div style={{ fontSize: "11px", color: "#71717a", textTransform: "capitalize" }}>
              {userRole}
            </div>
          </div>
          <button
            onClick={onSignOut}
            style={{
              background: "none",
              border: "1px solid #2e2e33",
              color: "#a1a1aa",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div
          onClick={() => setShowNewChatModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f0f11",
              border: "1px solid #2e2e33",
              borderRadius: "12px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                color: "#f4f4f5",
                marginBottom: "8px",
                letterSpacing: "0.5px",
              }}
            >
              NEW CHAT
            </div>
            <div style={{ fontSize: "13px", color: "#71717a", marginBottom: "16px" }}>
              Name a new production chat (e.g. Casting, Continuity, Marketing).
            </div>
            <input
              autoFocus
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateChat();
                if (e.key === "Escape") setShowNewChatModal(false);
              }}
              placeholder="Chat name"
              style={{
                width: "100%",
                background: "#1e1e22",
                border: "1px solid #2e2e33",
                color: "#e4e4e7",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowNewChatModal(false)}
                style={{
                  background: "transparent",
                  border: "1px solid #2e2e33",
                  color: "#a1a1aa",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                disabled={!newChatName.trim()}
                style={{
                  background: !newChatName.trim()
                    ? "#1e1e22"
                    : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                  border: "none",
                  color: !newChatName.trim() ? "#52525b" : "#fff",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: !newChatName.trim() ? "default" : "pointer",
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .studio-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          transform: translateX(-100%);
          transition: transform 0.2s ease;
        }
        .studio-sidebar.open {
          transform: translateX(0);
        }
        @media (min-width: 769px) {
          .studio-sidebar {
            position: relative;
            transform: translateX(0);
            height: auto;
          }
          .mobile-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
