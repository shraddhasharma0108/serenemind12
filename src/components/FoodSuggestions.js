const FOODS = {
  Low: [
    { name: "Dark Chocolate (70%+)", icon: "🍫", benefit: "Boosts serotonin and endorphins", tip: "1-2 squares per day is enough" },
    { name: "Bananas", icon: "🍌", benefit: "Rich in tryptophan — converted to serotonin", tip: "Great as a morning snack" },
    { name: "Berries", icon: "🍓", benefit: "Antioxidants that protect brain cells", tip: "Add to yoghurt or oats" },
    { name: "Nuts & Seeds", icon: "🥜", benefit: "Magnesium and healthy fats for brain health", tip: "A small handful is ideal" },
    { name: "Green Tea", icon: "🍵", benefit: "L-theanine promotes calm alertness", tip: "Replace coffee in the afternoon" },
    { name: "Oats", icon: "🥣", benefit: "Slow-release carbs stabilise blood sugar & mood", tip: "Add honey and fruit for taste" },
  ],
  Moderate: [
    { name: "Fatty Fish (Salmon, Sardines)", icon: "🐟", benefit: "Omega-3s directly reduce depression markers", tip: "Aim for 2 servings per week" },
    { name: "Leafy Greens (Spinach, Kale)", icon: "🥬", benefit: "Folate reduces homocysteine linked to depression", tip: "Add to smoothies or dal" },
    { name: "Fermented Foods", icon: "🫙", benefit: "Probiotics improve gut-brain communication", tip: "Curd, idli, kanji are great options" },
    { name: "Eggs", icon: "🥚", benefit: "Choline and B12 support neurotransmitter production", tip: "Boiled or poached is healthiest" },
    { name: "Turmeric", icon: "🟡", benefit: "Curcumin has clinically shown antidepressant effects", tip: "Add to milk — golden milk at night" },
    { name: "Whole Grains", icon: "🌾", benefit: "B vitamins support nervous system function", tip: "Replace white rice with brown or millets" },
    { name: "Walnuts", icon: "🪨", benefit: "Highest plant-based omega-3 content", tip: "4-5 walnuts daily is optimal" },
    { name: "Avocado", icon: "🥑", benefit: "B6, folate, and healthy fats for brain function", tip: "Great on toast or in salads" },
  ],
  High: [
    { name: "Fatty Fish (Salmon, Sardines)", icon: "🐟", benefit: "Omega-3 EPA/DHA are evidence-based for reducing depression", tip: "Priority food — 3-4 times a week if possible" },
    { name: "Fermented Foods", icon: "🫙", benefit: "Gut health is directly linked to serotonin levels (90% made in gut)", tip: "Curd with every meal is a simple habit" },
    { name: "Leafy Greens", icon: "🥬", benefit: "Magnesium deficiency worsens depression symptoms", tip: "A large handful with lunch and dinner" },
    { name: "Turmeric + Black Pepper", icon: "🌿", benefit: "Curcumin + piperine = maximum antidepressant bioavailability", tip: "1 tsp turmeric + pinch of pepper in warm milk nightly" },
    { name: "Brazil Nuts", icon: "🌰", benefit: "Selenium deficiency is strongly linked to depression", tip: "Just 2-3 Brazil nuts meet your daily selenium need" },
    { name: "Dark Chocolate", icon: "🍫", benefit: "Rapid mood lift via serotonin — choose 70%+ cocoa", tip: "Do not skip — it is genuinely therapeutic" },
    { name: "Complex Carbs (Millets, Oats)", icon: "🌾", benefit: "Stabilises blood sugar fluctuations that worsen low mood", tip: "Never skip breakfast" },
    { name: "Eggs", icon: "🥚", benefit: "Choline precursor to acetylcholine, supports brain signalling", tip: "2 eggs daily is fine for most people" },
    { name: "Sunflower Seeds", icon: "🌻", benefit: "Highest plant source of tryptophan", tip: "Add to salads, yoghurt, or eat as a snack" },
  ],
};

const GENERAL = FOODS.Low;

const AVOID = [
  { name: "Processed Sugar", icon: "🍬", reason: "Causes blood sugar spikes and crashes that worsen mood" },
  { name: "Alcohol", icon: "🍺", reason: "A depressant — worsens anxiety and disrupts sleep" },
  { name: "Ultra-processed food", icon: "🍟", reason: "High in trans fats which are linked to increased depression risk" },
  { name: "Excessive caffeine", icon: "☕", reason: "Disrupts sleep and increases cortisol (stress hormone)" },
];

export default function FoodSuggestions({ testResult }) {
  const foods = testResult ? FOODS[testResult.level] : GENERAL;

  const s = {
    title: { color: "#f0eeff", fontSize: 24, fontWeight: "normal", marginBottom: 8 },
    sub: { color: "rgba(200,190,255,0.55)", fontSize: 15, marginBottom: 28 },
    sectionTitle: { color: "#e2deff", fontSize: 17, marginBottom: 16, marginTop: 28 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 },
    card: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px",
    },
    cardIcon: { fontSize: 30, marginBottom: 10, display: "block" },
    cardName: { color: "#e2deff", fontSize: 15, marginBottom: 4 },
    cardBenefit: { color: "rgba(200,190,255,0.65)", fontSize: 13, lineHeight: 1.5, marginBottom: 8 },
    cardTip: {
      color: "#c4b5fd", fontSize: 12, background: "rgba(124,58,237,0.12)",
      borderRadius: 6, padding: "6px 10px", display: "inline-block",
    },
    avoidCard: {
      background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
      borderRadius: 12, padding: "14px 18px", marginBottom: 10,
      display: "flex", alignItems: "flex-start", gap: 12,
    },
    avoidIcon: { fontSize: 22, flexShrink: 0 },
    avoidName: { color: "#fca5a5", fontSize: 14, marginBottom: 2 },
    avoidReason: { color: "rgba(200,190,255,0.5)", fontSize: 13 },
    noTestBanner: {
      background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)",
      borderRadius: 12, padding: "14px 18px", color: "#c4b5fd", fontSize: 14, lineHeight: 1.6, marginBottom: 24,
    },
  };

  return (
    <div>
      <h2 style={s.title}>🥗 Mood-Boosting Foods</h2>
      <p style={s.sub}>
        {testResult ? `Foods specifically chosen to support ${testResult.level} risk recovery.` : "General mood-boosting nutrition tips."}
      </p>

      {!testResult && (
        <div style={s.noTestBanner}>
          💡 Complete the Depression Test to unlock a personalised food plan matched to your mental health needs.
        </div>
      )}

      <h3 style={s.sectionTitle}>✅ Eat More Of These</h3>
      <div style={s.grid}>
        {foods.map((f, i) => (
          <div key={i} style={s.card}>
            <span style={s.cardIcon}>{f.icon}</span>
            <div style={s.cardName}>{f.name}</div>
            <div style={s.cardBenefit}>{f.benefit}</div>
            <div style={s.cardTip}>💡 {f.tip}</div>
          </div>
        ))}
      </div>

      <h3 style={s.sectionTitle}>❌ Limit or Avoid</h3>
      {AVOID.map((a, i) => (
        <div key={i} style={s.avoidCard}>
          <span style={s.avoidIcon}>{a.icon}</span>
          <div>
            <div style={s.avoidName}>{a.name}</div>
            <div style={s.avoidReason}>{a.reason}</div>
          </div>
        </div>
      ))}

      <div style={{ color: "rgba(200,190,255,0.35)", fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
        ⚠️ Food can support mental health but is not a replacement for professional treatment.
      </div>
    </div>
  );
}