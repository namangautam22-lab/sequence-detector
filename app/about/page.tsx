import Link from "next/link";

export const metadata = { title: "About — AI Sequence Detector" };

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(13,13,26,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "#E94560" }}>
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 10V5l4-3 4 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <rect x="4" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Sequence Detector</span>
          </div>
        </div>
        <Link href="/" className="text-xs text-[#8888AA] hover:text-white transition-colors">
          ← Back to Demo
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16 flex-1">
        <div className="mb-12">
          <div className="text-[10px] uppercase tracking-widest text-[#E94560] font-semibold mb-3">
            Model Documentation
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">How the Engine Works</h1>
          <p className="text-[#8888AA] text-lg leading-relaxed">
            A multimodal Decision Tree that classifies 4-minute film windows into four
            categories without ever touching raw video frames.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { label: "F1 Score — Song", value: "0.964", color: "#22C55E", sub: "High precision" },
            { label: "F1 Score — Action", value: "0.815", color: "#EF4444", sub: "Strong recall" },
            { label: "Train / Test Split", value: "140 / 60", color: "#3B82F6", sub: "windows" },
            { label: "Feature Dimensions", value: "150", color: "#F59E0B", sub: "multimodal" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 flex flex-col gap-1"
              style={{
                background: `linear-gradient(135deg, ${s.color}0D 0%, rgba(13,13,26,0.5) 100%)`,
                border: `1px solid ${s.color}25`,
              }}
            >
              <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
              <span className="text-xs font-semibold text-[#C0C0D8]">{s.label}</span>
              <span className="text-[11px] text-[#8888AA]">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#E94560" }}>
              What It Detects
            </h2>
            <p className="text-[#C0C0D8] leading-relaxed">
              The engine classifies 4-minute windows of Indian film content into four categories:{" "}
              <strong className="text-white">Song</strong> (musical performance sequences including
              choreographed dance numbers),{" "}
              <strong className="text-white">Action</strong> (fight scenes, vehicle chases, stunts),{" "}
              <strong className="text-white">Dialogue / Neither</strong> (narrative scenes, exposition,
              emotional beats), and{" "}
              <strong className="text-white">QA Queue</strong> — windows where both song and action
              signals are simultaneously strong, flagged for human review. This last class is a common
              Indian cinema trope: action-choreographed musical sequences like the&nbsp;
              <em>Naatu Naatu</em> number in RRR.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#E94560" }}>
              Model Architecture
            </h2>
            <p className="text-[#C0C0D8] leading-relaxed mb-4">
              A scikit-learn <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded text-[#C0C0D8]">MultiOutputClassifier</code>{" "}
              wrapping a Decision Tree, trained on 150 handcrafted features spanning three modalities:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  title: "Visual", color: "#3B82F6",
                  items: ["Optical flow magnitude", "Dance / fight pose confidence", "Shot-cut rate", "Camera shake index", "Scene brightness variance"],
                },
                {
                  title: "Audio", color: "#22C55E",
                  items: ["BPM & beat onset strength", "MFCC coefficients (1–5)", "Vocal pitch regularity", "Singing vs speech score", "Harmonic change rate"],
                },
                {
                  title: "Subtitle / Text", color: "#F59E0B",
                  items: ["Lyric pattern score", "Rhyme & repetition density", "Song keyword (Hindi)", "Fight keyword score", "Subtitle reading ease"],
                },
              ].map((m) => (
                <div
                  key={m.title}
                  className="rounded-xl p-4"
                  style={{ background: `${m.color}0D`, border: `1px solid ${m.color}20` }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: m.color }}>
                    {m.title}
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {m.items.map((item) => (
                      <li key={item} className="text-xs text-[#8888AA] flex items-start gap-1.5">
                        <span style={{ color: m.color }} className="mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#E94560" }}>
              QA Queue Logic
            </h2>
            <p className="text-[#C0C0D8] leading-relaxed">
              When{" "}
              <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded text-[#C0C0D8]">song_prob ≥ 0.90</code>{" "}
              and{" "}
              <code className="text-xs bg-white/8 px-1.5 py-0.5 rounded text-[#C0C0D8]">action_prob ≥ 0.70</code>{" "}
              both hold simultaneously, the window is routed to QA Queue rather than forcing a single label.
              Confidence is reported as the average of both probabilities. These windows are genuine edge
              cases — an human annotator should review them with the raw footage before committing a label.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#E94560" }}>
              Data & Limitations
            </h2>
            <p className="text-[#C0C0D8] leading-relaxed">
              The model was trained on 10 Indian films (Bollywood, Telugu, Tamil) spanning 2009–2023. All
              features are metadata extracted from the media — no raw frames or audio waveforms are
              processed at inference time, making it fast and deployable. Limitations: performance may
              degrade on older films (&lt;1995) with different cinematographic norms, and on regional
              language films not represented in the training set.
            </p>
          </section>
        </div>

        <div
          className="mt-14 p-4 rounded-xl text-xs text-[#8888AA] flex items-start gap-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <svg className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M8 7v3M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>
            <strong className="text-[#C0C0D8]">Demo mode.</strong> Probabilities shown are real model
            outputs — inference was run on the held-out test set using{" "}
            <code className="text-[#C0C0D8]">sequence_detector.joblib</code> + scikit-learn. Full
            real-time inference on arbitrary feature vectors requires a Python / FastAPI backend.
          </span>
        </div>
      </div>

      <footer
        className="px-8 py-5 text-xs text-[#8888AA]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span>AI Sequence Detector — Indian Film Engine</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/namangautam22-lab/sequence-detector"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
            <Link href="/" className="hover:text-white transition-colors">
              Back to Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
