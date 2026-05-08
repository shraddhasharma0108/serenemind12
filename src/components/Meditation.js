import { useState } from "react";

const ALL_EXERCISES = [
  {
    id: 1, title: "4-7-8 Breathing", duration: "5 min", icon: "🌬️",
    tag: "breathing", risk: ["Low","Moderate","High"],
    steps: ["Sit comfortably and close your eyes.", "Inhale through your nose for 4 seconds.", "Hold your breath for 7 seconds.", "Exhale completely through your mouth for 8 seconds.", "Repeat 4 cycles. This activates the parasympathetic nervous system."],
    benefit: "Reduces anxiety and helps with sleep",
  },
  {
    id: 2, title: "Body Scan Relaxation", duration: "10 min", icon: "🧘",
    tag: "relaxation", risk: ["Moderate","High"],
    steps: ["Lie down comfortably and close your eyes.", "Take three deep breaths.", "Starting from your toes, notice any tension — then consciously relax each muscle.", "Slowly move attention up: feet → legs → hips → abdomen → chest → shoulders → face.", "Stay with each area for 30 seconds."],
    benefit: "Releases physical tension linked to stress",
  },
  {
    id: 3, title: "5-Minute Mindfulness", duration: "5 min", icon: "🌸",
    tag: "mindfulness", risk: ["Low","Moderate","High"],
    steps: ["Find a quiet place and sit comfortably.", "Focus on your breath — the sensation of air entering and leaving.", "When your mind wanders, gently bring it back. This is normal.", "Notice 5 things you can see, 4 you can touch, 3 you can hear.", "End with a moment of gratitude."],
    benefit: "Grounds you in the present moment",
  },
  {
    id: 4, title: "Loving-Kindness Meditation", duration: "8 min", icon: "💗",
    tag: "compassion", risk: ["Moderate","High"],
    steps: ["Sit quietly and close your eyes.", "Silently repeat: 'May I be happy. May I be healthy. May I be at peace.'", "Extend this to someone you love, then to a neutral person, then to all beings.", "Notice any warmth or openness in your chest.", "Return to yourself: 'May I be kind to myself today.'"],
    benefit: "Builds self-compassion and reduces negative self-talk",
  },
  {
    id: 5, title: "Progressive Muscle Relaxation", duration: "12 min", icon: "💪",
    tag: "relaxation", risk: ["High"],
    steps: ["Lie comfortably. Take 3 deep breaths.", "Tense your feet muscles for 5 seconds, then release completely.", "Move to calves, thighs, abdomen, hands, arms, shoulders, face.", "Notice the difference between tension and relaxation.", "End with full-body awareness and slow breathing."],
    benefit: "Directly counters physical symptoms of depression",
  },
  {
    id: 6, title: "Morning Intention Setting", duration: "3 min", icon: "☀️",
    tag: "mindfulness", risk: ["Low","Moderate"],
    steps: ["Upon waking, stay in bed for 3 minutes.", "Take 5 slow breaths.", "Set one intention for the day — something kind you'll do for yourself.", "Visualise your day going well.", "Write it in a journal if you can."],
    benefit: "Sets a positive tone for the day",
  },
];

const GENERAL = ALL_EXERCISES.filter(e => e.risk.includes("Low"));

export default function Meditation({ testResult }) {
  const [active, setActive] = useState(null);

  const exercises = testResult
    ? ALL_EXERCISES.filter(e => e.risk.includes(testResult.level))
    : GENERAL;

  const s = {
    title: { color: "#f0eeff", fontSize: 24, fontWeight: "normal", marginBottom: 8 },
    sub: { color: "rgba(200,190,255,0.55)", fontSize: 15, marginBottom: 28, lineHeight: 1.6 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 24 },
    card: (sel) => ({
      background: sel ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)",
      border: sel ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "20px", cursor: "pointer", transition: "all 0.2s",
    }),
    icon: { fontSize: 32, marginBottom: 12, display: "block" },
    cardTitle: { color: "#e2deff", fontSize: 16, marginBottom: 4 },
    meta: { color: "rgba(200,190,255,0.5)", fontSize: 12, marginBottom: 8 },
    benefit: { color: "rgba(200,190,255,0.65)", fontSize: 13, lineHeight: 1.5 },
    detail: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "28px",
    },
    stepNum: {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%", background: "rgba(124,58,237,0.3)",
      color: "#c4b5fd", fontSize: 13, marginRight: 12, flexShrink: 0,
    },
    step: { display: "flex", alignItems: "flex-start", marginBottom: 16, color: "rgba(200,190,255,0.8)", fontSize: 15, lineHeight: 1.6 },
    backBtn: {
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, padding: "9px 18px", color: "rgba(200,190,255,0.7)", cursor: "pointer",
      fontFamily: "Georgia,serif", fontSize: 13, marginBottom: 20,
    },
    noTestBanner: {
      background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)",
      borderRadius: 12, padding: "14px 18px", color: "#c4b5fd", fontSize: 14, lineHeight: 1.6, marginBottom: 24,
    },
  };

  if (active) {
    const ex = exercises.find(e => e.id === active);
    return (
      <div>
        <button style={s.backBtn} onClick={() => setActive(null)}>← Back to exercises</button>
        <div style={s.detail}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>{ex.icon}</span>
          <h3 style={{ color: "#f0eeff", fontSize: 22, fontWeight: "normal", marginBottom: 4 }}>{ex.title}</h3>
          <div style={{ color: "rgba(200,190,255,0.5)", fontSize: 13, marginBottom: 20 }}>⏱ {ex.duration} &nbsp;·&nbsp; ✨ {ex.benefit}</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
            {ex.steps.map((step, i) => (
              <div key={i} style={s.step}>
                <span style={s.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={s.title}>🧘 Meditation & Breathing</h2>
      <p style={s.sub}>
        {testResult ? `Exercises personalised for ${testResult.level} risk level.` : "General exercises for everyone."}
      </p>

      {!testResult && (
        <div style={s.noTestBanner}>
          💡 Complete the Depression Test to get exercises personalised to your mental health needs.
        </div>
      )}

      <div style={s.grid}>
        {exercises.map((ex) => (
          <div key={ex.id} style={s.card(active === ex.id)} onClick={() => setActive(ex.id)}>
            <span style={s.icon}>{ex.icon}</span>
            <div style={s.cardTitle}>{ex.title}</div>
            <div style={s.meta}>⏱ {ex.duration}</div>
            <div style={s.benefit}>{ex.benefit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}