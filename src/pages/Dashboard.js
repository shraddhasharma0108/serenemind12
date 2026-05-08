import { useState } from "react";
import DepressionTest from "../components/DepressionTest";
import Chatbot from "../components/Chatbot";
import Meditation from "../components/Meditation";
import FoodSuggestions from "../components/FoodSuggestions";
import Helplines from "../components/Helplines";

const NAV = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "test", icon: "📋", label: "Depression Test" },
  { id: "chatbot", icon: "💬", label: "Chatbot" },
  { id: "meditation", icon: "🧘", label: "Meditation" },
  { id: "food", icon: "🥗", label: "Food Tips" },
  { id: "helplines", icon: "📞", label: "Helplines" },
];

const RISK_COLORS = {
  Low: "#22c55e", Moderate: "#f59e0b", High: "#ef4444",
};
const RISK_EMOJIS = { Low: "🟢", Moderate: "🟡", High: "🔴" };

export default function Dashboard({ user, onLogout }) {
  const [active, setActive] = useState("home");
  const [testResult, setTestResult] = useState(user.testResult || null);

  const saveResult = (result) => {
    const updatedUser = { ...user, testResult: result };
    const users = JSON.parse(localStorage.getItem("mw_users") || "[]");
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx !== -1) { users[idx] = updatedUser; localStorage.setItem("mw_users", JSON.stringify(users)); }
    localStorage.setItem("mw_user", JSON.stringify(updatedUser));
    setTestResult(result);
  };

  const s = {
    layout: { display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#0d0b1e 0%,#160f30 100%)" },
    sidebar: {
      width: 220, background: "rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex", flexDirection: "column", padding: "24px 16px", flexShrink: 0,
    },
    logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 8 },
    logoIcon: { fontSize: 26 },
    logoText: { color: "#f0eeff", fontSize: 16, lineHeight: 1.2 },
    navItem: (isActive) => ({
      display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
      borderRadius: 10, marginBottom: 4, cursor: "pointer", transition: "all 0.2s",
      background: isActive ? "rgba(124,58,237,0.25)" : "transparent",
      border: isActive ? "1px solid rgba(124,58,237,0.4)" : "1px solid transparent",
      color: isActive ? "#c4b5fd" : "rgba(200,190,255,0.6)",
      fontSize: 14,
    }),
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    topbar: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    greeting: { color: "#f0eeff", fontSize: 18 },
    greetingSub: { color: "rgba(200,190,255,0.5)", fontSize: 13, marginTop: 2 },
    topRight: { display: "flex", alignItems: "center", gap: 12 },
    riskPill: (r) => ({
      background: `${RISK_COLORS[r]}18`,
      border: `1px solid ${RISK_COLORS[r]}44`,
      color: RISK_COLORS[r],
      padding: "6px 14px", borderRadius: 20, fontSize: 13,
    }),
    logoutBtn: {
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
      color: "#fca5a5", borderRadius: 8, padding: "8px 16px", cursor: "pointer",
      fontFamily: "Georgia,serif", fontSize: 13,
    },
    content: { flex: 1, padding: "32px", overflowY: "auto" },
  };

  const renderHome = () => (
    <div>
      <h2 style={{ color: "#f0eeff", fontSize: 26, fontWeight: "normal", marginBottom: 8 }}>
        Good day, {user.name} 🌿
      </h2>
      <p style={{ color: "rgba(200,190,255,0.55)", marginBottom: 32, fontSize: 15 }}>
        Your mental wellness hub. Everything in one place.
      </p>

      {!testResult && (
        <div style={{
          background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 28, display: "flex",
          alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ color: "#c4b5fd", fontWeight: "bold", marginBottom: 4 }}>📋 Complete your Depression Test</div>
            <div style={{ color: "rgba(200,190,255,0.6)", fontSize: 14 }}>
              Unlock personalised chatbot, food & meditation advice.
            </div>
          </div>
          <button
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14 }}
            onClick={() => setActive("test")}
          >
            Take Test →
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        {NAV.filter(n => n.id !== "home").map((n) => (
          <div key={n.id}
            onClick={() => setActive(n.id)}
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "24px 20px", cursor: "pointer", transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>{n.icon}</div>
            <div style={{ color: "#e2deff", fontSize: 14 }}>{n.label}</div>
          </div>
        ))}
      </div>

      {testResult && (
        <div style={{ marginTop: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 24px" }}>
          <div style={{ color: "rgba(200,190,255,0.55)", fontSize: 13, marginBottom: 4 }}>YOUR LAST TEST RESULT</div>
          <div style={{ color: RISK_COLORS[testResult.level], fontSize: 22 }}>
            {RISK_EMOJIS[testResult.level]} {testResult.level} Risk
          </div>
          <div style={{ color: "rgba(200,190,255,0.5)", fontSize: 13, marginTop: 4 }}>Score: {testResult.score}/45</div>
        </div>
      )}
    </div>
  );

  return (
    <div style={s.layout}>
      <div style={s.sidebar}>
        <div style={s.logo}>
          <span style={s.logoIcon}>🧠</span>
          <span style={s.logoText}>Mental<br />Wellness AI</span>
        </div>
        {NAV.map((n) => (
          <div key={n.id} style={s.navItem(active === n.id)} onClick={() => setActive(n.id)}>
            <span>{n.icon}</span> {n.label}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <button style={s.logoutBtn} onClick={onLogout}>← Log out</button>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={s.greeting}>{NAV.find(n => n.id === active)?.label || "Home"}</div>
            <div style={s.greetingSub}>Mental Wellness Dashboard</div>
          </div>
          <div style={s.topRight}>
            {testResult && <div style={s.riskPill(testResult.level)}>{RISK_EMOJIS[testResult.level]} {testResult.level} Risk</div>}
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={s.content}>
          {active === "home" && renderHome()}
          {active === "test" && <DepressionTest testResult={testResult} onComplete={saveResult} />}
          {active === "chatbot" && <Chatbot testResult={testResult} />}
          {active === "meditation" && <Meditation testResult={testResult} />}
          {active === "food" && <FoodSuggestions testResult={testResult} />}
          {active === "helplines" && <Helplines />}
        </div>
      </div>
    </div>
  );
}