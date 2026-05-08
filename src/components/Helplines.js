const HELPLINES = [
  { name: "iCall", number: "9152987821", type: "India — Free Counselling", desc: "TISS-based psychosocial helpline. Free, confidential counselling by trained professionals.", icon: "📞", color: "#7c3aed", urgent: false },
  { name: "Vandrevala Foundation", number: "1860-2662-345", type: "India — 24/7", desc: "24/7 mental health helpline. Free and confidential. Available in multiple languages.", icon: "🆘", color: "#ef4444", urgent: true },
  { name: "Snehi", number: "044-24640050", type: "India — Suicide Prevention", desc: "Emotional support for those in crisis. Open daily from 8am to 10pm.", icon: "💙", color: "#3b82f6", urgent: false },
  { name: "NIMHANS", number: "080-46110007", type: "National Institute", desc: "India's premier mental health institute. Provides tele-consultations and referrals.", icon: "🏥", color: "#22c55e", urgent: false },
  { name: "Fortis Mental Health", number: "8376804102", type: "India — 24/7", desc: "24/7 helpline for emotional distress, depression, and crisis support.", icon: "💊", color: "#f59e0b", urgent: false },
  { name: "AASRA", number: "9820466627", type: "India — Suicide Crisis", desc: "For those with suicidal thoughts. Trained volunteers available 24/7. Completely confidential.", icon: "🆘", color: "#ef4444", urgent: true },
];

const TIPS = [
  "If someone is in immediate danger, call 112 (Indian emergency services).",
  "All helplines are free and confidential unless there is a risk to life.",
  "You can also WhatsApp some helplines — ask when you call.",
  "If calling feels hard, texting or emailing a helpline is also an option.",
];

export default function Helplines() {
  const s = {
    title: { color: "#f0eeff", fontSize: 24, fontWeight: "normal", marginBottom: 8 },
    sub: { color: "rgba(200,190,255,0.55)", fontSize: 15, marginBottom: 12, lineHeight: 1.6 },
    emergency: {
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 12, padding: "14px 20px", color: "#fca5a5", fontSize: 14,
      lineHeight: 1.6, marginBottom: 28, display: "flex", alignItems: "center", gap: 12,
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 28 },
    card: (urgent) => ({
      background: urgent ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.04)",
      border: urgent ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "20px",
    }),
    cardTop: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 },
    cardIcon: (c) => ({
      width: 42, height: 42, borderRadius: "50%", background: `${c}22`,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
    }),
    cardName: { color: "#e2deff", fontSize: 16, marginBottom: 2 },
    cardType: { color: "rgba(200,190,255,0.5)", fontSize: 12 },
    number: (c) => ({
      color: c, fontSize: 22, fontFamily: "monospace", letterSpacing: 1,
      marginBottom: 8, fontWeight: "bold",
    }),
    cardDesc: { color: "rgba(200,190,255,0.65)", fontSize: 13, lineHeight: 1.6 },
    callBtn: (c) => ({
      display: "inline-block", marginTop: 12, background: `${c}22`, border: `1px solid ${c}44`,
      borderRadius: 8, padding: "7px 16px", color: c, fontSize: 13, cursor: "pointer",
      fontFamily: "Georgia,serif", textDecoration: "none",
    }),
    tipsSection: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "20px 24px",
    },
    tipsTitle: { color: "#e2deff", fontSize: 16, marginBottom: 14 },
    tip: { color: "rgba(200,190,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 8, paddingLeft: 16, borderLeft: "2px solid rgba(124,58,237,0.4)" },
  };

  return (
    <div>
      <h2 style={s.title}>📞 Mental Health Helplines</h2>
      <p style={s.sub}>You are not alone. Trained counsellors are available right now.</p>

      <div style={s.emergency}>
        <span style={{ fontSize: 24 }}>🚨</span>
        <div>
          <strong>In immediate danger?</strong> Call <strong>112</strong> (India Emergency) or go to your nearest hospital right away.
        </div>
      </div>

      <div style={s.grid}>
        {HELPLINES.map((h, i) => (
          <div key={i} style={s.card(h.urgent)}>
            <div style={s.cardTop}>
              <div style={s.cardIcon(h.color)}>{h.icon}</div>
              <div>
                <div style={s.cardName}>{h.name}</div>
                <div style={s.cardType}>{h.type}</div>
              </div>
            </div>
            <div style={s.number(h.color)}>{h.number}</div>
            <div style={s.cardDesc}>{h.desc}</div>
            <a href={`tel:${h.number.replace(/-/g,"")}`} style={s.callBtn(h.color)}>📞 Call Now</a>
          </div>
        ))}
      </div>

      <div style={s.tipsSection}>
        <div style={s.tipsTitle}>💡 Before you call — good to know</div>
        {TIPS.map((t, i) => <div key={i} style={s.tip}>{t}</div>)}
      </div>

      <div style={{ color: "rgba(200,190,255,0.35)", fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
        Numbers verified as of 2024. If a number is unreachable, please try another or visit the helpline's website.
      </div>
    </div>
  );
}