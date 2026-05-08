import { useState, useRef, useEffect } from "react";

const GENERAL_TIPS = [
  "💡 Try the 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.",
  "🌿 A 10-minute walk outside can lift your mood significantly.",
  "📝 Try journaling — write 3 things you're grateful for today.",
  "💧 Staying hydrated helps your brain function better!",
  "🎵 Listening to calming music can reduce cortisol levels.",
];

function buildSystemPrompt(testResult) {
  if (!testResult) {
    return `You are a compassionate mental wellness chatbot. You provide supportive, empathetic responses to help people with their feelings and mental health.

Since the user hasn't completed the depression screening test yet, give them general wellness tips and supportive messages. Gently encourage them to take the depression test for personalised support.

Guidelines:
- Be warm, non-judgmental, and supportive
- Give practical mental health tips
- Never diagnose or prescribe
- If someone mentions self-harm, always refer them to a professional helpline
- Keep responses concise (2-4 sentences) and kind`;
  }

  const levelGuidance = {
    Low: "The user has LOW depression risk. Focus on maintenance, positive reinforcement, and building resilience. Encourage keeping up good habits.",
    Moderate: "The user has MODERATE depression risk. Be more gentle and attentive. Suggest practical coping strategies. Gently encourage professional support.",
    High: "The user has HIGH depression risk. Be very caring and compassionate. Strongly encourage professional help. Provide crisis resources if needed. Focus on immediate coping.",
  };

  return `You are a compassionate mental wellness chatbot supporting someone with their mental health journey.

${levelGuidance[testResult.level]}

Guidelines:
- Be warm, empathetic, and non-judgmental
- Tailor advice to their depression risk level
- Give specific, actionable mental wellness tips
- Never diagnose or prescribe medication
- If someone mentions self-harm or crisis, always refer to a helpline immediately
- Keep responses concise (3-5 sentences) and caring`;
}

export default function Chatbot({ testResult }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: testResult
        ? `Hi there 💙 I can see you've completed the depression screening (${testResult.level} Risk). I'm here to support you. How are you feeling today?`
        : `Hello! 💙 I'm your mental wellness companion. I give general wellness tips right now, but completing the Depression Test will let me give you personalised support. How are you feeling?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("serenemind_token");
      const response = await fetch("http://localhost:8000/api/chat/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await response.json();
      const reply = data.reply || "Main yahan hun 💙";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having a moment — please try again. I'm still here for you. 💙" }]);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: { display: "flex", flexDirection: "column", height: "calc(100vh - 160px)", maxHeight: 700 },
    header: { marginBottom: 20 },
    title: { color: "#f0eeff", fontSize: 24, fontWeight: "normal", marginBottom: 6 },
    sub: { color: "rgba(200,190,255,0.55)", fontSize: 14 },
    tipRow: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
    tip: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "rgba(200,190,255,0.7)", cursor: "pointer",
    },
    chatBox: {
      flex: 1, overflowY: "auto", background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 16,
    },
    bubble: (role) => ({
      display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start", marginBottom: 14,
    }),
    bubbleInner: (role) => ({
      maxWidth: "75%", padding: "12px 16px", borderRadius: role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
      background: role === "user" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "rgba(255,255,255,0.06)",
      border: role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
      color: "#f0eeff", fontSize: 14, lineHeight: 1.7,
    }),
    inputRow: { display: "flex", gap: 10 },
    input: {
      flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "12px 16px", color: "#f0eeff", fontFamily: "Georgia,serif",
      fontSize: 14, outline: "none",
    },
    sendBtn: {
      background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", border: "none",
      borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontSize: 18,
    },
    typing: { color: "rgba(200,190,255,0.5)", fontSize: 13, fontStyle: "italic", padding: "8px 0" },
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h2 style={s.title}>💬 Mental Wellness Chatbot</h2>
        <p style={s.sub}>{testResult ? `Personalised for ${testResult.level} risk` : "General wellness support"}</p>
      </div>

      {!testResult && (
        <div style={s.tipRow}>
          {GENERAL_TIPS.map((t, i) => (
            <div key={i} style={s.tip} onClick={() => setInput(t.replace(/^[^\s]+ /, ""))}>
              {t}
            </div>
          ))}
        </div>
      )}

      <div style={s.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={s.bubble(m.role)}>
            <div style={s.bubbleInner(m.role)}>
              {m.role === "assistant" && <span style={{ marginRight: 6 }}>🤖</span>}
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={s.typing}>Thinking… 💙</div>}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputRow}>
        <input
          style={s.input}
          placeholder="Share how you're feeling…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={s.sendBtn} onClick={sendMessage} disabled={loading}>→</button>
      </div>
    </div>
  );
}