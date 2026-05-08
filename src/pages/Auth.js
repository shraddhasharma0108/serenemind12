import { useState } from "react";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && !form.name) {
      setError("Please enter your name.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("mw_users") || "[]");

    if (mode === "signup") {
      if (users.find((u) => u.email === form.email)) {
        setError("Email already registered. Please log in.");
        return;
      }
      const newUser = { name: form.name, email: form.email, password: form.password, testResult: null };
      localStorage.setItem("mw_users", JSON.stringify([...users, newUser]));
      onLogin(newUser);
    } else {
      const found = users.find((u) => u.email === form.email && u.password === form.password);
      if (!found) {
        setError("Invalid email or password.");
        return;
      }
      onLogin(found);
    }
  };

  const s = {
    page: {
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, background: "linear-gradient(135deg,#0d0b1e 0%,#1a1040 50%,#0d0b1e 100%)",
    },
    card: {
      background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20,
      padding: "44px 40px", width: "100%", maxWidth: 440,
      boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
    },
    badge: {
      display: "inline-block", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)",
      color: "#c4b5fd", fontSize: 11, fontFamily: "monospace", letterSpacing: 2,
      padding: "4px 12px", borderRadius: 20, marginBottom: 20, textTransform: "uppercase",
    },
    title: { color: "#f0eeff", fontSize: 30, fontWeight: "normal", marginBottom: 6 },
    sub: { color: "rgba(200,190,255,0.5)", fontSize: 14, marginBottom: 32, lineHeight: 1.6 },
    label: { color: "rgba(200,190,255,0.7)", fontSize: 13, marginBottom: 6, display: "block" },
    input: {
      width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "12px 16px", color: "#f0eeff",
      fontFamily: "Georgia,serif", fontSize: 15, outline: "none", marginBottom: 16,
    },
    btn: {
      width: "100%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff",
      border: "none", borderRadius: 10, padding: "14px", fontSize: 15, cursor: "pointer",
      fontFamily: "Georgia,serif", marginTop: 8, boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
    },
    switch: {
      textAlign: "center", marginTop: 20, color: "rgba(200,190,255,0.55)", fontSize: 14,
    },
    switchLink: {
      color: "#a78bfa", cursor: "pointer", textDecoration: "underline", background: "none",
      border: "none", fontFamily: "Georgia,serif", fontSize: 14,
    },
    error: {
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
      color: "#fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16,
    },
    logo: { fontSize: 40, marginBottom: 12, display: "block" },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <span style={s.logo}>🧠</span>
        <div style={s.badge}>Mental Wellness AI</div>
        <h1 style={s.title}>{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p style={s.sub}>
          {mode === "login"
            ? "Sign in to access your mental wellness dashboard."
            : "Join to get personalised mental health support."}
        </p>

        {error && <div style={s.error}>⚠️ {error}</div>}

        {mode === "signup" && (
          <div>
            <label style={s.label}>Your name</label>
            <input
              style={s.input} placeholder="e.g. Ayesha"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        )}

        <label style={s.label}>Email address</label>
        <input
          style={s.input} type="email" placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label style={s.label}>Password</label>
        <input
          style={s.input} type="password" placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button style={s.btn} onClick={handleSubmit}>
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <div style={s.switch}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button style={s.switchLink} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}