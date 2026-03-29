"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage(
          "Check your email for a confirmation link, then come back and sign in."
        );
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
        fontFamily:
          "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center" }}>
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
              margin: "0 auto 12px",
            }}
          >
            Ted
          </div>
          <div style={{ fontSize: "22px", fontWeight: "600", color: "#f4f4f5" }}>
            accepted.bot
          </div>
          <div style={{ fontSize: "13px", color: "#71717a", marginTop: "4px" }}>
            Your UC essay coach
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {isSignUp && (
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "12px 16px",
                background: "#1e1e22",
                border: "1px solid #2e2e33",
                color: "#e4e4e7",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              background: "#1e1e22",
              border: "1px solid #2e2e33",
              color: "#e4e4e7",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
              fontFamily: "inherit",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              padding: "12px 16px",
              background: "#1e1e22",
              border: "1px solid #2e2e33",
              color: "#e4e4e7",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
              fontFamily: "inherit",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: loading
                ? "#1e1e22"
                : "linear-gradient(135deg, #22c55e, #16a34a)",
              border: "none",
              color: loading ? "#52525b" : "#fff",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "default" : "pointer",
              fontFamily: "inherit",
              marginTop: "4px",
            }}
          >
            {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {error && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "13px",
              textAlign: "center",
              padding: "8px",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              color: "#22c55e",
              fontSize: "13px",
              textAlign: "center",
              padding: "8px",
              lineHeight: "1.5",
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setMessage("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#71717a",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>

        <div style={{ fontSize: "11px", color: "#3f3f46", marginTop: "8px" }}>
          accepted.bot — powered by Statement Guru methodology
        </div>
      </div>
    </div>
  );
}
