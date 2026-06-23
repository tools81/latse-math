import { useState, useEffect, useRef, useCallback } from "react";

// ─── BASE64 IMAGES ─────────────────────────────────────────────────────
const IMAGES = {
  latse: "/latse-math/Latse_Speaks.png",
  breeze: "/latse-math/Breeze.png",
  hyperspace: "/latse-math/hyperspace.webm",
  planets: [
	"/latse-math/Planet1.webp",
	"/latse-math/Planet2.webp",
	"/latse-math/Planet3.webp",
	"/latse-math/Planet4.jpg",
	"/latse-math/Planet5.png",
	"/latse-math/Planet6.jpg"
  ], // Planet images array
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PLANET_NAMES = [
  "Naboo", "Tatooine", "Coruscant", "Endor", "Hoth",
  "Mustafar", "Dagobah", "Bespin", "Jakku", "Ahch-To"
];

const QUEST_THEMES = [
  { type: "rescue",      emoji: "🐾", label: "rescue mission" },
  { type: "delivery",    emoji: "📦", label: "supply delivery" },
  { type: "repair",      emoji: "🔧", label: "repair mission" },
  { type: "exploration", emoji: "🔭", label: "exploration" },
  { type: "healing",     emoji: "💊", label: "healing mission" },
];

const RESOURCE_SETS = [
  { name: "Kyber Crystals", emoji: "💎", color: "#7dd3fc" },
  { name: "Power Cells",    emoji: "🔋", color: "#86efac" },
  { name: "Stardust Vials", emoji: "✨", color: "#f9a8d4" },
  { name: "Fuel Canisters", emoji: "⚡", color: "#fde047" },
  { name: "Force Tokens",   emoji: "🌀", color: "#c4b5fd" },
  { name: "Reactor Cores",  emoji: "🔴", color: "#fca5a5" },
];

const PHASES = {
  INTRO: "intro",
  QUEST_REVEAL: "quest_reveal",
  FUEL_PUZZLE: "fuel_puzzle",
  HYPERSPACE: "hyperspace",
  PLANET_PUZZLE: "planet_puzzle",
  VICTORY: "victory",
};

// ─── PRE-WRITTEN DIALOGUE BANKS ──────────────────────────────────────────────

const GREETINGS = [
  "Amelia! I'm so glad you're here — Sharder and I were just warming up The Breeze's engines! Are you ready for an adventure today?",
  "There you are, Amelia! I've been checking the star charts and found the most amazing mission for us. Sharder is already buckled in — are you ready to fly?",
  "Amelia! The Force brought you here at exactly the right moment. We have a very important quest and I need my best co-pilot. That's you! Ready?",
  "Oh wow, perfect timing! I just got a distress signal on the comm and we're the only Jedi close enough to help. Sharder says hi! Shall we go?",
  "Good news, Amelia — The Breeze is fuelled up, Sharder is purring like a ship engine, and I have the coolest mission waiting for us. Want to see it?",
  "Amelia! I was hoping you'd show up today. I found something incredible on the galaxy map and I really need your brilliant brain to help me. Are you in?",
  "Guess what, Amelia? The Jedi Council just sent us a special mission — only the bravest Jedi get picked for this one. Sharder thinks you're brave enough. I do too!",
];

const QUEST_BRIEFINGS = [
  // rescue
  { theme: "rescue", planet: "Naboo", lines: ["The Breeze glides down through Naboo's shimmering purple clouds, and we can already see the problem — a family of glowing river-dolphins is trapped behind a broken waterfall gate!", "The gate has a lock that only opens if the right number of gems are placed inside. If we don't figure it out fast, the dolphins will miss their migration!"] },
  { theme: "rescue", planet: "Endor", lines: ["We land in a forest so thick with giant trees that the sky turns green! A young Ewok has climbed too high and is stuck on a mossy branch far above the ground.", "The Ewoks below are throwing up a rope net, but they need to know exactly how many hands to hold it or it won't be strong enough to catch him!"] },
  { theme: "rescue", planet: "Dagobah", lines: ["Dagobah is all swamp and fog — even The Breeze's landing struts are sinking a little! Somewhere out in the mist, a tiny creature is calling for help.", "I can hear it, Amelia! It's a baby bog-frog stuck in a tangle of floating vines. We need to count exactly how many vine loops to cut to set it free!"] },
  { theme: "rescue", planet: "Hoth", lines: ["Brrr! Hoth is SO cold — our breath makes little clouds in the air and Sharder's tail is puffed up like a snowball!", "A snow-lizard pup has fallen into an icy tunnel. The rescue team needs the exact number of ice blocks removed to make a safe path out — can you work it out?"] },
  { theme: "rescue", planet: "Jakku", lines: ["Jakku is all golden sand dunes stretching as far as we can see, with wrecked old ships half-buried everywhere.", "A little scavenger droid has rolled into a wreck and can't find its way out! It's sending a signal from inside — we need to count the correct number of exits to guide it safely home."] },

  // delivery
  { theme: "delivery", planet: "Tatooine", lines: ["Two suns beat down on Tatooine as we land with a thump on the dusty red ground! A market stall is waiting for us — the owner is waving both arms in the air.", "She's run out of water pouches and needs an exact delivery or the villagers will go thirsty before sunset. We have to count them out perfectly!"] },
  { theme: "delivery", planet: "Coruscant", lines: ["Coruscant is a whole planet covered in city — buildings taller than clouds, and speeders zooming everywhere! It's amazing and a little dizzying.", "A small medical clinic on level 47 is waiting for our medicine crates. The lift only works if we load the exact right number — too many and it jams!"] },
  { theme: "delivery", planet: "Bespin", lines: ["Bespin floats in the clouds — the whole city is up in the sky! The Breeze docks gently and a gust of warm wind makes Sharder's ears go flat.", "The cloud city's bakery needs exactly the right number of ingredient packs or the big feast tonight will be ruined. The chef is counting on us!"] },
  { theme: "delivery", planet: "Naboo", lines: ["Naboo looks like a painting — green hills, sparkling lakes, and little domed buildings everywhere. It's one of my favourite places to visit!", "The royal gardens need fresh seed packets delivered before the ceremony tomorrow. We have to hand over exactly the right count or the gardeners will plant the wrong flowers!"] },
  { theme: "delivery", planet: "Ahch-To", lines: ["Ahch-To is covered in steep rocky islands poking out of a cold grey sea. Seabirds screech as The Breeze hovers to find a landing spot!", "An old keeper at the top of the stairs is waiting for scrolls we're carrying — precious, ancient ones. We must hand over the exact right number or the collection will be incomplete forever."] },

  // repair
  { theme: "repair", planet: "Mustafar", lines: ["Mustafar glows orange and red — rivers of lava flow slowly past and the air shimmers with heat. Even through The Breeze's windows it feels warm!", "A lava-mining machine has broken down and the crew can't fix it without the right number of replacement parts. Get it wrong and the whole thing shuts down for a week!"] },
  { theme: "repair", planet: "Coruscant", lines: ["We've landed on a rooftop repair bay, high above Coruscant's twinkling city lights. Wind whips past and below us thousands of speeders zip around like fireflies.", "A comm tower is flickering — it connects this whole district! The engineer says it needs exactly the right number of signal boosters installed or it'll go dark."] },
  { theme: "repair", planet: "Tatooine", lines: ["A lonely moisture farm sits in the middle of the desert, its spinning vaporators creaking in the hot wind.", "The farmer's main vaporator is broken and she needs the exact number of filter rings replaced. Too few and it leaks — too many and it cracks. Only you can get this right, Amelia!"] },
  { theme: "repair", planet: "Hoth", lines: ["The blizzard outside is howling so loud we can barely hear each other! We're inside a rebel base carved into the glacier, and icicles hang from the ceiling.", "The base's heating system has a fault — some heat panels have gone out. The engineer needs the exact count of panels to switch back on or the base will freeze overnight!"] },
  { theme: "repair", planet: "Bespin", lines: ["The cloud city's famous sunset deck has a broken railing — tourists can't visit until it's fixed! The repair team is waiting below in their yellow jumpsuits.", "They need exactly the right number of bolts to make it safe. The city engineer keeps saying 'not too many, not too few!' — that's where your maths comes in!"] },

  // exploration
  { theme: "exploration", planet: "Dagobah", lines: ["Dagobah's swamp glows with bioluminescent plants at night — it's like the whole jungle is lit up with tiny green and blue lanterns. Sharder is wide-eyed!", "We've discovered a hidden cave entrance — but the stone door only opens when the right number of glowing crystals are placed in the slots. It's never been opened before, Amelia!"] },
  { theme: "exploration", planet: "Ahch-To", lines: ["We've climbed to the very top of the tallest island on Ahch-To and found something incredible — ancient stone steps leading into a hidden temple nobody knew was here!", "The temple entrance has a star-chart puzzle carved in the stone. We need to find the exact number of stars in one constellation to unlock the door. This is history, Amelia!"] },
  { theme: "exploration", planet: "Endor", lines: ["Deep in Endor's forest there's a ring of ancient stones that glow faintly when the moons rise. No map shows this place — we found it just by following Sharder!", "The stones have markings on them — and one stone is missing from the ring! We need to figure out the exact number of markings to know which stone belongs in the gap."] },
  { theme: "exploration", planet: "Jakku", lines: ["Buried under a sand dune we've found the entrance to an old starship graveyard — huge rusting hulks that crashed here hundreds of years ago!", "One ship still has its log computer running! It needs a number code to unlock the captain's records. We have to calculate the right number from the clues carved on the door."] },
  { theme: "exploration", planet: "Hoth", lines: ["Under the ice we've found something astonishing — a whole frozen city from thousands of years ago, perfectly preserved like a bug in amber!", "The city's gate mechanism still works! It needs the exact right number of ice-key turns to open. One too many and it re-freezes. This could be the discovery of the century!"] },

  // healing
  { theme: "healing", planet: "Naboo", lines: ["The beautiful meadows of Naboo have gone strangely quiet — no insects buzzing, no birds singing. We land near a pond and find a group of sick feather-deer lying in the grass.", "The local healer has a cure ready, but she needs exactly the right number of herb bundles mixed in or it won't work. The feather-deer are counting on you, Amelia!"] },
  { theme: "healing", planet: "Endor", lines: ["The Ewoks have called us here because their eldest Elder has a fever from a thorn-bug bite. The whole village is worried — you can hear them murmuring softly in the trees.", "The remedy requires exactly the right number of moonflower petals steeped in warm water. The village healer holds the bowl out to us. How many petals, Amelia?"] },
  { theme: "healing", planet: "Dagobah", lines: ["In a clearing in the swamp we find a nest of baby creatures — tiny, round, and sneezing in unison! They must have eaten something they shouldn't have.", "To make the soothing broth that will heal them, the swamp healer needs exactly the right number of golden root slices added. Not a single one more or less!"] },
  { theme: "healing", planet: "Tatooine", lines: ["Even in the desert there are living things that need help — we've found a travelling healer whose medicine cart lost some supplies in a sandstorm.", "She's missing exactly the right count of bandage rolls to treat everyone waiting in line. We have some on The Breeze — we just need to figure out the exact number to give her!"] },
  { theme: "healing", planet: "Bespin", lines: ["High in the cloud city, a whole wing of the hospital is waiting for a delivery of healing crystals that power the recovery beds.", "Each bed needs exactly one crystal — but some crystals were cracked in transit and can't be used. We need to count the good ones and make sure the number matches the beds that need them!"] },
  // bonus extras to reach 30
  { theme: "rescue", planet: "Bespin", lines: ["A young sky-dancer has drifted too far from the cloud city platform on a gust of wind — she's clinging to a floating light beacon and calling for help!", "The rescue cable only reaches if we attach exactly the right number of extension links. Too short and we can't reach her. Count carefully, Amelia!"] },
  { theme: "delivery", planet: "Hoth", lines: ["A rebel outpost on the far side of Hoth's glacier is completely cut off by a blizzard — they're running low on emergency ration packs!", "The supply drone can only carry a fixed weight. We need to load exactly the right number of packs or it won't lift off. The rebels are hungry — let's get this right!"] },
  { theme: "repair", planet: "Jakku", lines: ["A scavenger family has found a crashed escape pod that still works — except for one thing. The door seal is broken and sand keeps getting in.", "They need exactly the right number of seal strips to fix it properly. With a working pod they can finally leave Jakku and find a new home. This one really matters!"] },
  { theme: "exploration", planet: "Mustafar", lines: ["Even on a lava planet there are secrets — we've found a cool stone vault deep inside a cliff, untouched by the heat outside. Sharder sniffs the door curiously.", "The vault's combination is carved into the rock above it — but it's a maths puzzle! Solve it and we'll be the first people inside in five hundred years."] },
  { theme: "healing", planet: "Coruscant", lines: ["In Coruscant's lower levels where sunlight never reaches, a community garden is wilting — the grow-lights have been flickering and the plants are getting sick.", "The garden keeper needs exactly the right number of replacement light tubes installed today or the seedlings won't survive the night. You're their only hope, Amelia!"] },
];

const FUEL_CORRECT = [
  "Yes! Perfect fuelling, Amelia! The Breeze is ready — hold on tight, we're jumping to hyperspace!",
  "Brilliant! Exactly right! Sharder is already in his seat — let's GO!",
  "That's it! The engines are roaring! Hyperspace in three… two… one!",
  "Woohoo! You did it! The fuel gauge is full — next stop, adventure!",
  "Amazing maths, Amelia! The Breeze thanks you. Hyperspace jump in T-minus ten seconds!",
];

const PLANET_CORRECT = [
  "WE DID IT! Mission complete! Sharder is doing his happy spin — that only happens when something really wonderful has happened!",
  "YES! I knew you could do it, Amelia! The whole planet is grateful for your brilliant brain!",
  "Incredible! That was perfect! I couldn't have done this mission without you — you are a true Jedi partner!",
  "You're amazing, Amelia! Sharder is purring SO loudly right now. Mission accomplished!",
  "Outstanding! The Force was definitely with you on that one. Let's fly home heroes!",
];

const ARRIVAL_LINES = [
  "Look at this place, Amelia — it's even more incredible than on the star charts! I can already see the mission situation. Quick, I need your maths skills!",
  "We made it! Sharder's nose is twitching — he can sense something needs our help nearby. Use your brilliant brain, Amelia — I need you!",
  "Whoa! What a landing spot! I can see exactly what needs to be done, but I need you to solve one more calculation to save the day!",
  "We're here! The Force guided us right to the spot. One more maths problem stands between us and a successful mission — you've got this!",
  "Look out the window, Amelia! This place is incredible. I can see the situation right there — one calculation and we can fix everything!",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Pick a briefing that loosely matches the quest theme, or any if no match
function pickBriefing(theme) {
  const matching = QUEST_BRIEFINGS.filter(b => b.theme === theme);
  const pool = matching.length > 0 ? matching : QUEST_BRIEFINGS;
  return pick(pool);
}

// ─── MATH HELPERS ────────────────────────────────────────────────────────────
function generateAddSub(max = 20) {
  const op = Math.random() > 0.5 ? "+" : "-";
  if (op === "+") {
    const a = Math.floor(Math.random() * (max - 1)) + 1;
    const b = Math.floor(Math.random() * (max - a)) + 1;
    return { a, b, op, answer: a + b, display: `${a} + ${b}` };
  } else {
    const answer = Math.floor(Math.random() * (max - 1)) + 1;
    const a = answer + Math.floor(Math.random() * (max - answer)) + 1;
    const b = a - answer;
    return { a, b, op, answer, display: `${a} - ${b}` };
  }
}

function generateFuelProblem() {
  const answer = Math.floor(Math.random() * 14) + 3;
  const a = Math.floor(Math.random() * (answer - 1)) + 1;
  const b = answer - a;
  return { a, b, op: "+", answer, display: `${a} + ${b}` };
}

// ─── PLANET PLACEHOLDER SVG ──────────────────────────────────────────────────
const PlanetPlaceholder = ({ index, size = 120 }) => {
  const colors = [
    ["#1e3a5f", "#60a5fa"], ["#7c2d12", "#fb923c"],
    ["#1e1b4b", "#a78bfa"], ["#14532d", "#4ade80"],
    ["#1a1a2e", "#e2e8f0"], ["#7f1d1d", "#ef4444"],
  ];
  const [bg, ring] = colors[index % colors.length];
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill={bg} />
      <ellipse cx="60" cy="60" rx="75" ry="18" fill="none"
        stroke={ring} strokeWidth="6" opacity="0.6"
        transform="rotate(-20 60 60)" />
      <circle cx="40" cy="45" r="12" fill={ring} opacity="0.2" />
      <circle cx="75" cy="70" r="8" fill={ring} opacity="0.15" />
    </svg>
  );
};

const LatsePlaceholder = ({ size = 90 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: "linear-gradient(135deg, #312e81, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.4, border: "3px solid #a78bfa",
    boxShadow: "0 0 20px #7c3aed88", flexShrink: 0,
  }}>🧘</div>
);

// ─── STAR FIELD ──────────────────────────────────────────────────────────────
const StarField = () => {
  const stars = useRef(
    Array.from({ length: 80 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5, delay: Math.random() * 3,
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "white", opacity: 0.6,
          animation: `twinkle ${2 + s.delay}s ease-in-out infinite alternate`,
          animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
};

// ─── SPEECH BUBBLE ───────────────────────────────────────────────────────────
const SpeechBubble = ({ text }) => (
  <div style={{
    background: "rgba(15,10,40,0.92)", border: "2px solid #7c3aed",
    borderRadius: 18, padding: "18px 22px", maxWidth: 480,
    boxShadow: "0 0 24px #7c3aed44", color: "#e2e8f0",
    fontFamily: "'Nunito', sans-serif", fontSize: 17, lineHeight: 1.6, minHeight: 60,
  }}>
    {text}
  </div>
);

// ─── TAP-TO-LOAD FUEL PUZZLE (touch-friendly) ────────────────────────────────
const FuelPuzzle = ({ problem, resource, onCorrect, onWrong }) => {
  const [loaded, setLoaded] = useState(0);
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const [done, setDone] = useState(false);

  const addOne = () => {
    if (done) return;
    setLoaded(l => l + 1);
  };

  const removeOne = () => {
    if (done || loaded === 0) return;
    setLoaded(l => l - 1);
  };

  const submit = () => {
    if (done || loaded === 0) return;
    if (loaded === problem.answer) {
      setGlow(true);
      setDone(true);
      setTimeout(() => onCorrect(), 900);
    } else {
      setShake(true);
      setTimeout(() => { setShake(false); setLoaded(0); onWrong(); }, 800);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      {/* Equation card */}
      <div style={{
        background: "rgba(15,10,40,0.7)", border: "2px solid #4c1d95",
        borderRadius: 16, padding: "20px 24px", marginBottom: 16, textAlign: "center",
      }}>
        <div style={{ color: "#c4b5fd", fontSize: 15, marginBottom: 6 }}>
          The Breeze needs exactly this many {resource.name}:
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: "#f9fafb", fontFamily: "'Nunito', sans-serif", letterSpacing: 2 }}>
          {problem.display} = <span style={{ color: "#fde047" }}>?</span>
        </div>
      </div>

      {/* Fuel bay — shows loaded emojis, no fixed slots */}
      <div style={{
        minHeight: 90, borderRadius: 14, padding: "14px 16px", marginBottom: 16,
        border: `2px dashed ${glow ? "#4ade80" : shake ? "#ef4444" : "#7c3aed"}`,
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 10,
        background: glow ? "rgba(74,222,128,0.1)" : shake ? "rgba(239,68,68,0.1)" : "rgba(124,58,237,0.08)",
        transition: "all 0.3s",
        animation: shake ? "shake 0.4s ease" : "none",
      }}>
        {loaded === 0
          ? <div style={{ color: "#6b7280", fontSize: 15 }}>Tap + to load {resource.name}</div>
          : Array.from({ length: loaded }).map((_, i) => (
            <div key={i} style={{
              fontSize: 32,
              filter: glow ? "drop-shadow(0 0 8px #4ade80)" : "none",
              transition: "filter 0.3s",
            }}>{resource.emoji}</div>
          ))
        }
      </div>

      {/* Tap buttons — large for little fingers */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <button
          onPointerDown={e => { e.preventDefault(); addOne(); }}
          disabled={done}
          style={{
            ...btnStyle(done ? "#374151" : "#7c3aed"),
            fontSize: 24, padding: "18px 32px",
            opacity: done ? 0.5 : 1,
            boxShadow: done ? "none" : "0 0 20px #7c3aed55",
            userSelect: "none", touchAction: "manipulation",
          }}
        >
          + {resource.emoji}
        </button>
        <button
          onPointerDown={e => { e.preventDefault(); removeOne(); }}
          disabled={done || loaded === 0}
          style={{
            ...btnStyle("#4c1d95"),
            fontSize: 24, padding: "18px 28px",
            opacity: (done || loaded === 0) ? 0.35 : 1,
            userSelect: "none", touchAction: "manipulation",
          }}
        >
          ✕
        </button>
        <button
          onPointerDown={e => { e.preventDefault(); submit(); }}
          disabled={done || loaded === 0}
          style={{
            ...btnStyle(done || loaded === 0 ? "#374151" : "#059669"),
            fontSize: 20, padding: "18px 28px",
            opacity: (done || loaded === 0) ? 0.4 : 1,
            boxShadow: (done || loaded === 0) ? "none" : "0 0 20px #05966955",
            userSelect: "none", touchAction: "manipulation",
          }}
        >
          ✓ Done!
        </button>
      </div>

      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
        {loaded} loaded &nbsp;•&nbsp; tap <b style={{color:"#e2e8f0"}}>+</b> to add, <b style={{color:"#e2e8f0"}}>✕</b> to remove one
      </div>
    </div>
  );
};

// ─── NUMBER LINE PUZZLE ───────────────────────────────────────────────────────
const NumberLinePuzzle = ({ problem, onCorrect, onWrong }) => {
  const [markerPos, setMarkerPos] = useState(problem.a);
  const [steps, setSteps] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const max = Math.max(problem.a + problem.b + 2, 12);
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);

  const move = (dir) => {
    if (submitted) return;
    setMarkerPos(p => { const n = p + dir; return (n < 0 || n > max) ? p : n; });
    setSteps(s => s + 1);
  };

  const check = () => {
    setSubmitted(true);
    if (markerPos === problem.answer) {
      setResult("correct");
      setTimeout(() => onCorrect(), 900);
    } else {
      setResult("wrong");
      setTimeout(() => { setSubmitted(false); setResult(null); setMarkerPos(problem.a); setSteps(0); onWrong(); }, 1200);
    }
  };

  const glowColor = result === "correct" ? "#4ade80" : result === "wrong" ? "#ef4444" : "#7dd3fc";

  return (
    <div style={{ width: "100%", maxWidth: 570 }}>
      <div style={{
        background: "rgba(15,10,40,0.7)", border: "2px solid #4c1d95",
        borderRadius: 16, padding: "20px 24px", marginBottom: 20, textAlign: "center",
      }}>
        <div style={{ color: "#c4b5fd", fontSize: 15, marginBottom: 6 }}>
          Start at <b style={{ color: "#fde047" }}>{problem.a}</b>
          {problem.op === "+" ? " and hop forward " : " and hop back "}
          <b style={{ color: "#fde047" }}>{problem.b}</b> spaces!
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#f9fafb", fontFamily: "'Nunito', sans-serif" }}>
          {problem.display} = <span style={{ color: "#fde047" }}>?</span>
        </div>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ position: "relative", minWidth: (max + 1) * 44, height: 100 }}>
          <div style={{ position: "absolute", top: 58, left: 20, right: 20, height: 4, background: "#4c1d95", borderRadius: 2 }} />
          {numbers.map(n => (
            <div key={n} style={{ position: "absolute", left: 20 + n * 44 - 14, top: 46, width: 28, textAlign: "center" }}>
              <div style={{ width: 2, height: 16, background: n === problem.a ? "#fde047" : "#6b21a8", margin: "0 auto" }} />
              <div style={{
                fontSize: 14, marginTop: 2,
                fontWeight: (n === problem.a || n === markerPos) ? 900 : 400,
                color: n === markerPos ? "#7dd3fc" : n === problem.a ? "#fde047" : "#9ca3af",
              }}>{n}</div>
            </div>
          ))}
          {/* The Breeze marker */}
          <div style={{
            position: "absolute", left: 20 + markerPos * 44 - 20, top: 8,
            width: 40, height: 40,
            transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            filter: `drop-shadow(0 0 8px ${glowColor})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {IMAGES.breeze
              ? <img src={IMAGES.breeze} alt="The Breeze" style={{ width: 40, height: 40, objectFit: "contain" }} />
              : <span style={{ fontSize: 28 }}>🚀</span>
            }
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
        <button onClick={() => move(-1)} disabled={submitted || markerPos === 0} style={btnStyle("#7c3aed")}>← Back</button>
        <button onClick={() => move(1)} disabled={submitted || markerPos === max} style={btnStyle("#7c3aed")}>Forward →</button>
        <button onClick={check} disabled={submitted || steps === 0} style={btnStyle("#059669")}>✓ That's my answer!</button>
      </div>
      <div style={{ textAlign: "center", marginTop: 10, color: "#9ca3af", fontSize: 14 }}>
        The Breeze is at: <b style={{ color: "#7dd3fc" }}>{markerPos}</b>
      </div>
    </div>
  );
};

const btnStyle = (bg) => ({
  background: bg, color: "white", border: "none", borderRadius: 10,
  padding: "10px 20px", fontSize: 15, fontFamily: "'Nunito', sans-serif",
  fontWeight: 700, cursor: "pointer",
});

// ─── HYPERSPACE SCREEN ───────────────────────────────────────────────────────
const HyperspaceScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, background: "#000",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      {IMAGES.hyperspace ? (
        <video src={IMAGES.hyperspace} autoPlay loop muted playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 80, animation: "spin 1.5s linear infinite" }}>🌀</div>
          <div style={{
            color: "#7dd3fc", fontSize: 28, marginTop: 24,
            fontFamily: "'Nunito', sans-serif", fontWeight: 900, letterSpacing: 4,
            animation: "pulse 0.6s ease-in-out infinite alternate",
          }}>Jumping to Hyperspace!</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 20 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{
                width: 2, height: 40 + Math.random() * 60,
                background: `hsl(${200 + i * 8}, 80%, 70%)`, borderRadius: 1,
                animation: `stretch 0.3s ease ${i * 0.05}s infinite alternate`,
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── VICTORY SCREEN ──────────────────────────────────────────────────────────
const VictoryScreen = ({ score, onPlayAgain }) => (
  <div style={{ textAlign: "center", padding: 40 }}>
    <div style={{ fontSize: 80, marginBottom: 16 }}>🏆</div>
    <div style={{ fontSize: 36, fontWeight: 900, color: "#fde047", fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>
      Quest Complete, Amelia!
    </div>
    <div style={{ color: "#c4b5fd", fontSize: 18, marginBottom: 32 }}>
      Lats'e is so proud of you! You solved {score} problems!
    </div>
    <button onClick={onPlayAgain} style={{ ...btnStyle("#7c3aed"), fontSize: 20, padding: "16px 40px", boxShadow: "0 0 30px #7c3aed66" }}>
      🚀 New Quest!
    </button>
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LatseMathApp() {
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [dialogue, setDialogue] = useState("");
  const [quest, setQuest] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [fuelProblem, setFuelProblem] = useState(null);
  const [planetProblem, setPlanetProblem] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [planetIndex, setPlanetIndex] = useState(0);
  const [resource, setResource] = useState(RESOURCE_SETS[0]);
  const [showHyperspace, setShowHyperspace] = useState(false);
  const [puzzleType, setPuzzleType] = useState("drag");

  // Greeting on mount
  useEffect(() => {
    setDialogue(pick(GREETINGS));
  }, []);

  const startQuest = () => {
    const theme = QUEST_THEMES[Math.floor(Math.random() * QUEST_THEMES.length)];
    const pIndex = Math.floor(Math.random() * Math.max(IMAGES.planets.length, 6));
    const res = RESOURCE_SETS[Math.floor(Math.random() * RESOURCE_SETS.length)];
    const fuel = generateFuelProblem();
    const planet2 = generateAddSub(10);
    const pType = Math.random() > 0.5 ? "drag" : "numberline";
    const b = pickBriefing(theme.type);

    const planet = b.planet;

    setQuest({ theme, planet });
    setBriefing(b);
    setFuelProblem(fuel);
    setPlanetProblem(planet2);
    setPlanetIndex(pIndex);
    setResource(res);
    setPuzzleType(pType);

    setDialogue(`We've got a ${theme.label} on planet ${planet}! ${b.lines[0]}`);
    setPhase(PHASES.QUEST_REVEAL);
  };

  const handleFuelCorrect = () => {
    setScore(s => s + 1);
    setDialogue(pick(FUEL_CORRECT));
    setTimeout(() => setShowHyperspace(true), 1400);
    setPhase(PHASES.HYPERSPACE);
  };

  const handleHyperspaceDone = () => {
    setShowHyperspace(false);
    setDialogue(pick(ARRIVAL_LINES));
    setPhase(PHASES.PLANET_PUZZLE);
  };

  const handlePlanetCorrect = () => {
    setScore(s => s + 1);
    setDialogue(pick(PLANET_CORRECT));
    setTimeout(() => setPhase(PHASES.VICTORY), 2200);
  };

  const handleWrong = () => setWrongCount(w => w + 1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Orbitron:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; }
        @keyframes twinkle { from{opacity:0.2} to{opacity:0.9} }
        @keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-8px)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { from{opacity:0.7} to{opacity:1} }
        @keyframes stretch { from{transform:scaleY(1)} to{transform:scaleY(1.8)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px #7c3aed44} 50%{box-shadow:0 0 40px #7c3aed99} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <StarField />
      {showHyperspace && <HyperspaceScreen onDone={handleHyperspaceDone} />}

      <div style={{
        position: "relative", zIndex: 1, minHeight: "100vh",
        fontFamily: "'Nunito', sans-serif", color: "#f1f5f9",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "24px 16px 40px",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28, animation: "slideIn 0.6s ease" }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, letterSpacing: 6, color: "#7c3aed", textTransform: "uppercase", marginBottom: 4 }}>
            Jedi Academy
          </div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: "#f1f5f9", textShadow: "0 0 20px #7c3aed" }}>
            Lats'e's Math Missions
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
            {[...Array(score)].map((_, i) => <span key={i} style={{ fontSize: 18 }}>⭐</span>)}
          </div>
        </div>

        {/* Lats'e + speech bubble */}
        {phase !== PHASES.VICTORY && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28, maxWidth: 600, width: "100%", animation: "slideIn 0.5s ease" }}>
            <div style={{ flexShrink: 0, animation: "float 3s ease-in-out infinite" }}>
              {IMAGES.latse
                ? <img src={IMAGES.latse} alt="Lats'e" style={{ width: 90, height: 90, borderRadius: "50%", border: "3px solid #7c3aed", objectFit: "cover" }} />
                : <LatsePlaceholder size={90} />
              }
            </div>
            <SpeechBubble text={dialogue} />
          </div>
        )}

        {/* ── INTRO ── */}
        {phase === PHASES.INTRO && (
          <button onClick={startQuest} style={{ ...btnStyle("#7c3aed"), fontSize: 20, padding: "16px 44px", boxShadow: "0 0 30px #7c3aed55", animation: "glow 2s ease-in-out infinite", marginTop: 8 }}>
            🚀 Start the Mission!
          </button>
        )}

        {/* ── QUEST REVEAL ── */}
        {phase === PHASES.QUEST_REVEAL && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", maxWidth: 560, animation: "slideIn 0.5s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(15,10,40,0.7)", borderRadius: 16, padding: "20px 28px", border: "2px solid #4c1d95", width: "100%" }}>
              <div style={{ fontSize: 48 }}>{quest?.theme.emoji}</div>
              <div>
                <div style={{ color: "#9ca3af", fontSize: 13, textTransform: "uppercase", letterSpacing: 2 }}>Destination</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9" }}>{quest?.planet}</div>
                <div style={{ color: "#c4b5fd", fontSize: 14 }}>{quest?.theme.label}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                {IMAGES.planets[planetIndex % IMAGES.planets.length]
                  ? <img src={IMAGES.planets[planetIndex % IMAGES.planets.length]} alt="Planet" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
                  : <PlanetPlaceholder index={planetIndex} size={80} />
                }
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(15,10,40,0.7)", borderRadius: 16, padding: "16px 24px", border: "2px solid #4c1d95", width: "100%" }}>
              {IMAGES.breeze
                ? <img src={IMAGES.breeze} alt="The Breeze" style={{ height: 60, objectFit: "contain" }} />
                : <span style={{ fontSize: 48 }}>🚀</span>
              }
              <div>
                <div style={{ color: "#9ca3af", fontSize: 13 }}>The Breeze needs fuel!</div>
                <div style={{ fontSize: 16, color: "#f1f5f9", fontWeight: 700 }}>
                  Drag the correct number of {resource.emoji} {resource.name}
                </div>
              </div>
            </div>
            <button onClick={() => setPhase(PHASES.FUEL_PUZZLE)} style={{ ...btnStyle("#7c3aed"), fontSize: 18, padding: "14px 36px" }}>
              ⛽ Fuel The Breeze!
            </button>
          </div>
        )}

        {/* ── FUEL PUZZLE ── */}
        {phase === PHASES.FUEL_PUZZLE && (
          <div style={{ width: "100%", maxWidth: 560, animation: "slideIn 0.4s ease" }}>
            <FuelPuzzle
              problem={fuelProblem} resource={resource}
              onCorrect={handleFuelCorrect}
              onWrong={handleWrong}
            />
          </div>
        )}

        {/* ── HYPERSPACE WAITING ── */}
        {phase === PHASES.HYPERSPACE && !showHyperspace && (
          <div style={{ textAlign: "center", color: "#c4b5fd", fontSize: 18, padding: 40 }}>Preparing to jump...</div>
        )}

        {/* ── PLANET PUZZLE ── */}
        {phase === PHASES.PLANET_PUZZLE && (
          <center>
            <div style={{ width: "100%", maxWidth: 570, animation: "slideIn 0.4s ease" }}>
              {/* Planet header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, background: "rgba(15,10,40,0.7)", borderRadius: 16, padding: "14px 20px", border: "2px solid #4c1d95" }}>
                {IMAGES.planets[planetIndex % IMAGES.planets.length]
                  ? <img src={IMAGES.planets[planetIndex % IMAGES.planets.length]} alt="Planet" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  : <PlanetPlaceholder index={planetIndex} size={60} />
                }
                <div>
                  <div style={{ color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>You've arrived at</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9" }}>{quest?.planet}</div>
                  <div style={{ color: "#c4b5fd", fontSize: 13 }}>{quest?.theme.emoji} {quest?.theme.label}</div>
                </div>
              </div>

              {/* Mission briefing */}
              {briefing && (
                <div style={{ background: "rgba(10,6,30,0.85)", border: "2px solid #4c1d95", borderRadius: 14, padding: "16px 20px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #7c3aed, #7dd3fc, #7c3aed)" }} />
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "#7dd3fc", fontWeight: 700, marginBottom: 8 }}>📖 Mission Briefing</div>
                  <div style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.7, fontFamily: "'Nunito', sans-serif", fontStyle: "italic" }}>
                    {briefing.lines[1]}
                  </div>
                </div>
              )}

              {puzzleType === "drag"
                ? <FuelPuzzle problem={planetProblem} resource={resource} onCorrect={handlePlanetCorrect} onWrong={handleWrong} />
                : <NumberLinePuzzle problem={planetProblem} onCorrect={handlePlanetCorrect} onWrong={handleWrong} />
              }
            </div>
          </center>
        )}

        {/* ── VICTORY ── */}
        {phase === PHASES.VICTORY && (
          <VictoryScreen score={score} onPlayAgain={() => {
            setPhase(PHASES.INTRO);
            setScore(0);
            setWrongCount(0);
            setBriefing(null);
            setDialogue(pick(GREETINGS));
          }} />
        )}

      </div>
    </>
  );
}
