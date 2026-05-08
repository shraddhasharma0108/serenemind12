import { useState } from "react";

const QUESTIONS = [
  { id: 1, text: "How often have you felt little interest or pleasure in doing things?", category: "mood" },
  { id: 2, text: "How often have you felt down, depressed, or hopeless?", category: "mood" },
  { id: 3, text: "How often have you had trouble falling or staying asleep, or sleeping too much?", category: "sleep" },
  { id: 4, text: "How often have you felt tired or had little energy?", category: "energy" },
  { id: 5, text: "How often have you had poor appetite or been overeating?", category: "mood" },
  { id: 6, text: "How often have you felt bad about yourself — like you're a failure?", category: "mood" },
  { id: 7, text: "How often have you had trouble concentrating on things?", category: "stress" },
  { id: 8, text: "How often have you felt nervous, anxious, or on edge?", category: "anxiety" },
  { id: 9, text: "How often have you not been able to stop or control worrying?", category: "anxiety" },
  { id: 10, text: "How often have you been easily annoyed or irritable?", category: "stress" },
  { id: 11, text: "How often have you felt afraid, as if something awful might happen?", category: "anxiety" },
  { id: 12, text: "How often have you avoided social situations because of how you feel?", category: "mood" },
  { id: 13, text: "How often have you had difficulty making decisions?", category: "stress" },
  { id: 14, text: "How often have you felt physically tense or had unexplained body pain?", category: "energy" },
  { id: 15, text: "How often have you had thoughts of being better off dead or of hurting yourself?", category: "critical" },
];

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const CATEGORY_ICONS = { mood: "😔", sleep: "🌙", energy: "⚡", stress: "😤", anxiety: "😰", critical: "❤️‍🩹" };

function getResult(score) {
  if (score <= 9) return { level: "Low", color: "#22c55e", emoji: "🌿", desc: "Your responses suggest minimal depression symptoms. Keep nurturing positive habits." };
  if (score <= 27) return { level: "Moderate", color: "#f59e0b", emoji: "🌤️", desc: "Your responses suggest moderate symptoms. Consider speaking with a counsellor or trusted person." };
  return { level: "High", color: "#ef4444", emoji: "🌩️", desc: "Your responses suggest significant symptoms. We strongly recommend reaching out to a mental health professional." };
}

export default function DepressionTest({ testResult, onComplete }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const handleAnswer = (value) => {
    const updated = { ...answers, [QUESTIONS[current].id]: value };
    setAnswers(updated);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(current + 1), 280);
    } else {
      const score = Object.values(updated).reduce((a, b) => a + b, 0);
      const result = getResult(score);
      setTimeout(() => { setDone(true); onComplete({ ...result, score }); }, 280);
    }
  };

  const restart = () => { setStarted(false); setCurrent(0); setAnswers({}); setDone(false); };
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  const s = {
    title: { color: "#f0eeff", fontSize: 24, fontWeight: "normal", marginBottom: 8 },
    sub: { color: "rgba(200,190,255,0.55)", fontSize: 15, marginBottom: 28, lineHeight: 1.6 },
    card: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "32px",
    },
    progressBar: { background: "rgba(255,255,255,0.06)", borderRadius: 10, height: 5, marginBottom: 28, overflow: "hidden" },
    progressFill: { height: "100%", background: "linear-gradient(90deg,#7c3aed,#818cf8)", borderRadius: 10, width: `${progress}%`, transition: "width 0.4s" },
    qNum: { color: "rgba(200,190,255,0.5)", fontSize: 12, fontFamily: "monospace", letterSpacing: 2, marginBottom: 10 },
    qText: { color: "#e2deff", fontSize: 18, lineHeight: 1.6, marginBottom: 28, fontWeight: "normal" },
    optBtn: (sel) => ({
      display: "block", width: "100%", textAlign: "left", padding: "13px 18px", marginBottom: 10,
      borderRadius: 10, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14, transition: "all 0.2s",
      background: sel ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)",
      border: sel ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.08)",
      color: sel ? "#d8b4fe" : "rgba(200,190,255,0.8)",
    }),
    startBtn: {
      background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", border: "none",
      borderRadius: 10, padding: "14px 32px", fontSize: 15, cursor: "pointer", fontFamily: "Georgia,serif",
    },
    resultLevel: (c) => ({ fontSize: 32, color: c, textAlign: "center", marginBottom: 4 }),
    resultDesc: {
      color: "rgba(200,190,255,0.75)", fontSize: 15, lineHeight: 1.7, textAlign: "center",
      background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "18px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24,
    },
    retakeBtn: {
      display: "block", width: "100%", background: "rgba(124,58,237,0.15)",
      border: "1px solid rgba(124,58,237,0.35)", borderRadius: 10, padding: "13px",
      color: "#c4b5fd", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14,
    },
    crisisBox: {
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 12, padding: "14px 18px", color: "#fca5a5", fontSize: 13, lineHeight: 1.6, marginBottom: 20,
    },
    existResult: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "20px 24px", marginBottom: 24,
    },
  };

  if (!started) {
    return (
      <div>
        <h2 style={s.title}>Depression Screening Test</h2>
        <p style={s.sub}>15 questions covering mood, sleep, energy, stress, and anxiety. Takes about 3 minutes.</p>

        {testResult && (
          <div style={s.existResult}>
            <div style={{ color: "rgba(200,190,255,0.5)", fontSize: 12, fontFamily: "monospace", marginBottom: 6 }}>PREVIOUS RESULT</div>
            <div style={{ color: { Low:"#22c55e", Moderate:"#f59e0b", High:"#ef4444" }[testResult.level], fontSize: 20 }}>
              {testResult.emoji} {testResult.level} Risk — Score {testResult.score}/45
            </div>
          </div>
        )}

        <div style={s.card}>
          <p style={{ color: "rgba(200,190,255,0.7)", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
            This screening is based on PHQ-9 and GAD-7 frameworks.
            Answer honestly — your responses are stored only on this device and are never shared.
          </p>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
            ⚠️ This is a screening tool, not a medical diagnosis. Please consult a professional if you have concerns.
          </div>
          <button style={s.startBtn} onClick={() => setStarted(true)}>Begin Test →</button>
        </div>
      </div>
    );
  }

  if (done) {
    const res = getResult(Object.values(answers).reduce((a, b) => a + b, 0));
    const score = Object.values(answers).reduce((a, b) => a + b, 0);
    return (
      <div style={s.card}>
        <div style={{ fontSize: 52, textAlign: "center", marginBottom: 12 }}>{res.emoji}</div>
        <div style={s.resultLevel(res.color)}>{res.level} Risk</div>
        <div style={{ color: "rgba(200,190,255,0.5)", textAlign: "center", fontSize: 13, marginBottom: 20 }}>
          Score: {score} / 45
        </div>
        {score >= 28 && (
          <div style={s.crisisBox}>
            🆘 If you are in crisis or experiencing thoughts of self-harm, please reach out to a helpline immediately.
            Go to the <strong>Helplines</strong> section for emergency numbers.
          </div>
        )}
        <div style={s.resultDesc}>{res.desc}</div>
        <div style={{ color: "rgba(200,190,255,0.55)", fontSize: 13, marginBottom: 20, textAlign: "center" }}>
          ✅ Your chatbot, meditation, and food suggestions are now personalised.
        </div>
        <button style={s.retakeBtn} onClick={restart}>Retake Test</button>
      </div>
    );
  }

  const q = QUESTIONS[current];
  return (
    <div>
      <h2 style={s.title}>Depression Screening Test</h2>
      <div style={s.card}>
        <div style={s.progressBar}><div style={s.progressFill} /></div>
        <div style={s.qNum}>QUESTION {current + 1} OF {QUESTIONS.length} &nbsp;·&nbsp; {CATEGORY_ICONS[q.category]} {q.category.toUpperCase()}</div>
        <p style={s.qText}>{q.text}</p>
        {OPTIONS.map((opt) => (
          <button key={opt.value} style={s.optBtn(answers[q.id] === opt.value)} onClick={() => handleAnswer(opt.value)}>
            {opt.label}
          </button>
        ))}
        {current > 0 && (
          <button style={{ ...s.retakeBtn, marginTop: 12 }} onClick={() => setCurrent(current - 1)}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}