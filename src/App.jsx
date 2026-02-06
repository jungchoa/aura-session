import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Timer, Palette, Check, ArrowRight } from "lucide-react";
import { clampChroma, formatHex, oklch, parse } from "culori";

const moods = [
  { id: "clarity", label: "명료함", hint: "선명하고 차분한 흐름", seed: "#8AA3FF" },
  { id: "depth", label: "깊이", hint: "느리고 묵직한 집중", seed: "#5166B3" },
  { id: "warm", label: "온기", hint: "부드러운 에너지", seed: "#F49C6B" },
  { id: "fresh", label: "상쾌", hint: "가볍고 시원한 리듬", seed: "#7FC8A9" },
];

const defaultState = {
  intention: "오늘 가장 중요한 한 가지는 무엇인가요?",
  outcome: "끝났을 때 얻고 싶은 결과를 적어보세요.",
  constraint: "방해 요소를 한 줄로 정리해요.",
};

function buildPalette(seed) {
  const parsed = parse(seed);
  const base = parsed ? oklch(parsed) : oklch("#8AA3FF");
  const baseChroma = base?.c ?? 0.1;
  const baseHue = base?.h ?? 270;

  const tones = [0.92, 0.82, 0.72, 0.6, 0.48].map((lightness, index) => {
    const chroma = baseChroma * (0.9 + index * 0.12);
    return formatHex(
      clampChroma({
        l: lightness,
        c: chroma,
        h: baseHue,
        mode: "oklch",
      })
    );
  });

  const accent = formatHex(
    clampChroma({ l: 0.62, c: baseChroma * 1.4, h: (baseHue + 22) % 360, mode: "oklch" })
  );

  const ink = formatHex(
    clampChroma({ l: 0.22, c: baseChroma * 0.5, h: baseHue, mode: "oklch" })
  );

  return { tones, accent, ink };
}

function buildPlan(duration, sprints) {
  const breakMinutes = 5;
  const breaks = Math.max(0, sprints - 1) * breakMinutes;
  const sprintMinutes = Math.max(10, Math.floor((duration - breaks) / sprints));
  const used = sprintMinutes * sprints + breaks;
  const buffer = Math.max(0, duration - used);
  return { sprintMinutes, breakMinutes, breaks, used, buffer };
}

export default function App() {
  const [seedColor, setSeedColor] = useState(moods[0].seed);
  const [intention, setIntention] = useState(defaultState.intention);
  const [outcome, setOutcome] = useState(defaultState.outcome);
  const [constraint, setConstraint] = useState(defaultState.constraint);
  const [duration, setDuration] = useState(70);
  const [sprints, setSprints] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [ambience, setAmbience] = useState(4);

  const palette = useMemo(() => buildPalette(seedColor), [seedColor]);
  const plan = useMemo(() => buildPlan(duration, sprints), [duration, sprints]);

  return (
    <div className="page" style={{ "--accent": palette.accent, "--ink": palette.ink }}>
      <div className="glow" style={{ background: `radial-gradient(50% 50% at 20% 20%, ${palette.tones[1]} 0%, transparent 70%)` }} />
      <div className="glow" style={{ background: `radial-gradient(60% 60% at 80% 10%, ${palette.tones[2]} 0%, transparent 72%)` }} />
      <div className="glow" style={{ background: `radial-gradient(55% 55% at 80% 80%, ${palette.tones[3]} 0%, transparent 70%)` }} />

      <main className="shell">
        <header className="hero">
          <div className="badge">
            <Sparkles size={16} />
            집중 세션 설계
          </div>
          <h1>Aura Session</h1>
          <p>
            하루의 에너지를 가장 가치 있는 60~90분으로 바꾸는 마이크로 스튜디오. 당신의 분위기를
            색으로 설계하고, 짧은 스프린트로 완주하는 흐름을 만듭니다.
          </p>
        </header>

        <section className="grid">
          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="panel-title">
              <Palette size={18} />
              분위기 설계
            </div>
            <div className="mood-row">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  className={`mood ${seedColor === mood.seed ? "active" : ""}`}
                  style={{ "--tone": mood.seed }}
                  onClick={() => setSeedColor(mood.seed)}
                >
                  <span>{mood.label}</span>
                  <small>{mood.hint}</small>
                </button>
              ))}
            </div>
            <div className="field">
              <label>시드 컬러</label>
              <div className="row">
                <input type="color" value={seedColor} onChange={(event) => setSeedColor(event.target.value)} />
                <input
                  className="text"
                  value={seedColor.toUpperCase()}
                  onChange={(event) => setSeedColor(event.target.value)}
                />
              </div>
            </div>
            <div className="palette">
              {palette.tones.map((tone) => (
                <div key={tone} className="swatch" style={{ background: tone }}>
                  <span>{tone.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="panel-title">
              <Timer size={18} />
              세션 구조
            </div>
            <div className="field">
              <label>총 세션 길이: {duration}분</label>
              <input type="range" min="45" max="120" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>스프린트 개수: {sprints}회</label>
              <input type="range" min="2" max="5" value={sprints} onChange={(e) => setSprints(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>에너지 레벨: {energy}/5</label>
              <input type="range" min="1" max="5" value={energy} onChange={(e) => setEnergy(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>앰비언스 강도: {ambience}/5</label>
              <input type="range" min="1" max="5" value={ambience} onChange={(e) => setAmbience(Number(e.target.value))} />
            </div>
            <div className="plan">
              <div>
                <strong>{plan.sprintMinutes}분</strong>
                <span>집중 스프린트</span>
              </div>
              <div>
                <strong>{plan.breakMinutes}분</strong>
                <span>리듬 브레이크</span>
              </div>
              <div>
                <strong>{plan.buffer}분</strong>
                <span>완충 버퍼</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="panel wide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="panel-title">
              <Check size={18} />
              집중 카드
            </div>
            <div className="field">
              <label>의도</label>
              <textarea value={intention} onChange={(e) => setIntention(e.target.value)} />
            </div>
            <div className="field">
              <label>기대 결과</label>
              <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} />
            </div>
            <div className="field">
              <label>방해 요소</label>
              <textarea value={constraint} onChange={(e) => setConstraint(e.target.value)} />
            </div>
          </motion.div>

          <motion.div
            className="preview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              background: `linear-gradient(140deg, ${palette.tones[0]}, ${palette.tones[2]}, ${palette.tones[4]})`,
            }}
          >
            <div className="preview-header">
              <div>
                <h2>{duration}분 집중 루틴</h2>
                <p>{sprints}개의 스프린트로 에너지를 분배합니다.</p>
              </div>
              <button className="cta">
                세션 시작
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="preview-grid">
              <div className="preview-card">
                <h3>의도</h3>
                <p>{intention}</p>
              </div>
              <div className="preview-card">
                <h3>결과</h3>
                <p>{outcome}</p>
              </div>
              <div className="preview-card">
                <h3>방해 차단</h3>
                <p>{constraint}</p>
              </div>
            </div>
            <div className="timeline">
              {Array.from({ length: sprints }).map((_, index) => (
                <div key={index} className="timeline-block">
                  <div className="dot" />
                  <div>
                    <span>스프린트 {index + 1}</span>
                    <strong>{plan.sprintMinutes}분 집중</strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="metrics">
              <div>
                <small>에너지 톤</small>
                <strong>{energy}/5</strong>
              </div>
              <div>
                <small>앰비언스</small>
                <strong>{ambience}/5</strong>
              </div>
              <div>
                <small>완충 버퍼</small>
                <strong>{plan.buffer}분</strong>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
