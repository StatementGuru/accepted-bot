"use client";

import { useState, useRef, useEffect } from "react";

const PERSONAS = [
  {
    id: "shy-freshman",
    name: "Shy Freshman",
    description: "Quiet junior at a public school. Plays volleyball, does art. Doesn't think her stories are interesting enough. Gives short answers.",
    prompt: "You are Maya, a 17-year-old junior at Westview High School in San Diego. You're shy and don't think your life is that interesting. You play volleyball (JV, not varsity) and like drawing in your free time. You babysit your younger cousins on weekends. Your parents are immigrants from the Philippines. You're applying to UC San Diego and UC Irvine. You tend to give short, modest answers and downplay your achievements. You've never written a college essay before and you're nervous about it. You are NOT an AI. Never break character. Never mention being an AI, Claude, or a language model. If Ted says anything confusing, respond the way a shy teenager would."
  },
  {
    id: "confident-freshman",
    name: "Confident Freshman",
    description: "Outgoing senior, lots of activities. Club president, varsity athlete. Thinks every story is essay-worthy. Talks a lot.",
    prompt: "You are Marcus, an 18-year-old senior at Troy High in Fullerton. You're confident and talkative. You're president of the robotics club, varsity track, volunteer at a food bank, and tutor younger students in math. You play guitar in a band with friends. Your parents are both engineers. You're applying to UCLA, UC Berkeley, and UC San Diego. You tend to give long, enthusiastic answers and think everything you do is impressive. You've already started writing some essays but they're generic and resume-like. You are NOT an AI. Never break character. Never mention being an AI, Claude, or a language model. Respond as a confident, talkative teenager would."
  },
  {
    id: "transfer-student",
    name: "Community College Transfer",
    description: "23-year-old transfer from a CC. Changed majors twice. Has work experience but academic gaps.",
    prompt: "You are Jordan, a 23-year-old transfer student at Santa Monica College. You started as a business major, switched to psychology, and now you're applying as a sociology major to UC Santa Barbara and UCLA. You took a year off after high school to work at a restaurant, which is why you're older. You have a 3.4 GPA with a dip in your first year when you were figuring things out. You work part-time as a barista at a local coffee shop. You're more mature than typical freshmen but insecure about your age and winding path. You are NOT an AI. Never break character. Never mention being an AI, Claude, or a language model. Respond as a thoughtful 23-year-old would."
  },
  {
    id: "has-drafts",
    name: "Student With Drafts",
    description: "Senior who wrote PIQ drafts in English class. Drafts are generic and too long. Thinks they're mostly done.",
    prompt: "You are Priya, a 17-year-old senior at Irvine High School. You wrote your UC essays in your English class last month. You think they're pretty good but your teacher said they need work. You have drafts for Prompt 1 (about being captain of the debate team), Prompt 2 (about your painting hobby), Prompt 4 (about a summer research program at UCI), and Prompt 7 (about starting a tutoring club). Your drafts are around 500 words each and read like resume summaries — lots of listing accomplishments without specific scenes or details. You're a bit defensive about your drafts because you worked hard on them. When asked to share a draft, make up a generic, resume-style 500-word essay for whichever prompt Ted asks about. You are NOT an AI. Never break character. Never mention being an AI, Claude, or a language model."
  },
  {
    id: "last-minute",
    name: "Last Minute Panic",
    description: "Student with 5 days until deadline. Nothing written. Stressed but has good raw material.",
    prompt: "You are Alex, a 17-year-old senior at Huntington Beach High School. The UC deadline is in 5 days and you haven't started any essays. You're panicking. You have strong material though — you started a skateboard repair business, you volunteer teaching ESL to your neighbors, and you overcame a knee injury that kept you out of soccer for a year. Your GPA is 3.7 and you're applying to UCSB, UCSD, and UCI. You're stressed and want to get this done fast. You might try to rush through brainstorming. You are NOT an AI. Never break character. Never mention being an AI, Claude, or a language model. Respond as a stressed, rushed teenager would."
  },
  {
    id: "custom",
    name: "Custom Persona",
    description: "Define your own student persona",
    prompt: ""
  }
];

export default function SimulatePage() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [maxTurns, setMaxTurns] = useState(20);
  const [currentTurn, setCurrentTurn] = useState(0);
  const stopRef = useRef(false);
  const pauseRef = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getStudentPrompt = () => {
    if (selectedPersona === "custom") return customPrompt;
    return PERSONAS.find(p => p.id === selectedPersona)?.prompt || "";
  };

  const callTed = async (conversationMessages) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationMessages }),
    });

    if (!response.ok) throw new Error("Ted API failed");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

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
            if (parsed.text) fullText += parsed.text;
          } catch (e) {}
        }
      }
    }
    return fullText;
  };

  const callStudent = async (conversationMessages, studentSystemPrompt) => {
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt: studentSystemPrompt,
        messages: conversationMessages.map(m => ({
          role: m.role === "user" ? "assistant" : "user",
          content: m.content
        })),
      }),
    });

    if (!response.ok) throw new Error("Student API failed");
    const data = await response.json();
    return data.content;
  };

  const runSimulation = async () => {
    setRunning(true);
    stopRef.current = false;
    pauseRef.current = false;
    setMessages([]);
    setCurrentTurn(0);

    const studentPrompt = getStudentPrompt();
    let conversation = [];

    // Student sends first message
    const firstMessage = await callStudent([], studentPrompt);
    conversation = [{ role: "user", content: firstMessage }];
    setMessages([...conversation]);
    setCurrentTurn(1);

    for (let turn = 0; turn < maxTurns; turn++) {
      if (stopRef.current) break;

      while (pauseRef.current) {
        await new Promise(r => setTimeout(r, 200));
        if (stopRef.current) break;
      }
      if (stopRef.current) break;

      // Ted responds
      const tedResponse = await callTed(conversation);
      conversation = [...conversation, { role: "assistant", content: tedResponse }];
      setMessages([...conversation]);

      if (stopRef.current) break;
      while (pauseRef.current) {
        await new Promise(r => setTimeout(r, 200));
        if (stopRef.current) break;
      }
      if (stopRef.current) break;

      // Student responds
      const studentResponse = await callStudent(conversation, studentPrompt);
      conversation = [...conversation, { role: "user", content: studentResponse }];
      setMessages([...conversation]);
      setCurrentTurn(turn + 2);
    }

    setRunning(false);
  };

  const handleStop = () => {
    stopRef.current = true;
    setPaused(false);
    pauseRef.current = false;
    setRunning(false);
  };

  const handlePause = () => {
    pauseRef.current = !pauseRef.current;
    setPaused(!paused);
  };

  const copyTranscript = () => {
    const persona = PERSONAS.find(p => p.id === selectedPersona);
    const header = "SIMULATION TRANSCRIPT\nPersona: " + (persona?.name || "Custom") + "\nTurns: " + messages.length + "\n\n";
    const transcript = messages.map(m => (m.role === "user" ? "STUDENT" : "TED") + ": " + m.content).join("\n\n");
    navigator.clipboard.writeText(header + transcript);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#e4e4e7", fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f4f4f5", marginBottom: "4px" }}>Ted Simulation Lab</h1>
        <p style={{ fontSize: "13px", color: "#71717a" }}>Test Ted's coaching with AI student personas</p>
      </div>

      {/* Persona Selection */}
      {!running && messages.length === 0 && (
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#a1a1aa", marginBottom: "12px" }}>Choose a student persona:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => setSelectedPersona(p.id)} style={{ padding: "14px 16px", background: selectedPersona === p.id ? "#1e1e22" : "transparent", border: selectedPersona === p.id ? "1px solid #22c55e" : "1px solid #2e2e33", borderRadius: "10px", cursor: "pointer", textAlign: "left", color: selectedPersona === p.id ? "#22c55e" : "#a1a1aa" }}>
                <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>{p.name}</div>
                <div style={{ fontSize: "12px", color: "#71717a" }}>{p.description}</div>
              </button>
            ))}
          </div>

          {selectedPersona === "custom" && (
            <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Describe the student persona in detail..." style={{ width: "100%", padding: "12px", background: "#1e1e22", border: "1px solid #2e2e33", color: "#e4e4e7", borderRadius: "10px", fontSize: "13px", minHeight: "120px", resize: "vertical", outline: "none", fontFamily: "inherit", marginBottom: "16px" }} />
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "#71717a" }}>Max turns:</label>
            <input type="number" value={maxTurns} onChange={(e) => setMaxTurns(parseInt(e.target.value) || 20)} min={4} max={60} style={{ width: "60px", padding: "6px 10px", background: "#1e1e22", border: "1px solid #2e2e33", color: "#e4e4e7", borderRadius: "6px", fontSize: "13px", outline: "none" }} />
          </div>

          <button onClick={runSimulation} disabled={!selectedPersona || (selectedPersona === "custom" && !customPrompt.trim())} style={{ padding: "12px 24px", background: selectedPersona ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#1e1e22", border: "none", color: selectedPersona ? "#fff" : "#52525b", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: selectedPersona ? "pointer" : "default" }}>
            Start Simulation
          </button>
        </div>
      )}

      {/* Running Controls */}
      {(running || messages.length > 0) && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
          {running && (
            <>
              <button onClick={handlePause} style={{ padding: "8px 16px", background: "#1e1e22", border: "1px solid #2e2e33", color: paused ? "#f59e0b" : "#a1a1aa", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}>
                {paused ? "Resume" : "Pause"}
              </button>
              <button onClick={handleStop} style={{ padding: "8px 16px", background: "#1e1e22", border: "1px solid #2e2e33", color: "#ef4444", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}>
                Stop
              </button>
            </>
          )}
          {!running && messages.length > 0 && (
            <>
              <button onClick={copyTranscript} style={{ padding: "8px 16px", background: "#1e1e22", border: "1px solid #2e2e33", color: "#a1a1aa", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}>
                Copy Transcript
              </button>
              <button onClick={() => { setMessages([]); setSelectedPersona(null); }} style={{ padding: "8px 16px", background: "#1e1e22", border: "1px solid #2e2e33", color: "#a1a1aa", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}>
                New Simulation
              </button>
            </>
          )}
          <div style={{ fontSize: "11px", color: "#52525b", marginLeft: "auto" }}>
            Turn {currentTurn} / {maxTurns}
          </div>
        </div>
      )}

      {/* Conversation */}
      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "assistant" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff", flexShrink: 0, marginTop: "2px" }}>Ted</div>
              )}
              <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? "#2563eb" : "#1e1e22", color: msg.role === "user" ? "#fff" : "#d4d4d8", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff", flexShrink: 0, marginTop: "2px" }}>Sim</div>
              )}
            </div>
          ))}
          {running && (
            <div style={{ textAlign: "center", padding: "12px", color: "#71717a", fontSize: "13px" }}>
              {paused ? "Paused..." : "Generating..."}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
