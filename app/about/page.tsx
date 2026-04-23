import Link from "next/link";

export const metadata = { title: "About — AI Sequence Detector" };

export default function AboutPage() {
  return (
    <main
      className="min-h-screen text-white"
      style={{ background: "#0F0F1A", fontFamily: "Inter, sans-serif" }}
    >
      <nav className="border-b border-white/10 px-8 py-4 flex items-center gap-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Demo
        </Link>
        <span className="text-sm font-semibold text-[#E94560]">About the Engine</span>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold mb-2">How the Engine Works</h1>
        <div
          className="w-12 h-1 rounded mb-10"
          style={{ background: "#E94560" }}
        />

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-[#E94560]">What It Detects</h2>
          <p className="text-gray-300 leading-relaxed">
            The AI Sequence Detector classifies 4-minute windows of Indian film content into four
            categories: <strong className="text-white">Song</strong> (musical performance sequences
            including dance numbers), <strong className="text-white">Action</strong> (fight scenes,
            chases, stunts), <strong className="text-white">Dialogue/Neither</strong> (narrative
            scenes, exposition), and <strong className="text-white">QA Queue</strong> (ambiguous
            windows where both song and action signals are simultaneously strong, flagged for human
            review). The engine processes multimodal metadata — visual motion, audio spectral
            features, subtitle text patterns — extracted per window without requiring raw video
            frames, making it suitable for large-scale batch annotation pipelines.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-[#E94560]">Model Architecture</h2>
          <p className="text-gray-300 leading-relaxed">
            A scikit-learn Decision Tree classifier trained on 150 handcrafted multimodal features
            spanning visual (optical flow, pose estimation, shot-cut rate), audio (BPM, MFCC
            coefficients, vocal pitch regularity, beat onset strength), and subtitle/text (lyric
            pattern scores, rhyme density, song keyword presence). The tree was trained on 140
            labelled windows drawn from 20+ Indian films (Bollywood, Tamil, Telugu) and evaluated on
            a held-out test set of 60 windows. The QA Queue output is triggered when both{" "}
            <code className="text-sm bg-white/10 px-1 rounded">song_prob ≥ 0.9</code> and{" "}
            <code className="text-sm bg-white/10 px-1 rounded">action_prob ≥ 0.7</code> are
            simultaneously true, routing genuinely ambiguous action-song sequences (a common Indian
            cinema trope) to human annotators.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-5 text-[#E94560]">Model Performance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "F1 — Song", value: "0.964", color: "#27AE60" },
              { label: "F1 — Action", value: "0.815", color: "#E74C3C" },
              { label: "Train / Test", value: "140 / 60", color: "#2980B9" },
              { label: "Features", value: "150", color: "#F39C12" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 border border-white/10 flex flex-col gap-1"
                style={{ background: "#1A1A2E" }}
              >
                <span className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 p-4 rounded-lg border border-white/10 text-xs text-gray-500" style={{ background: "#1A1A2E" }}>
          <strong className="text-gray-400">Demo mode</strong> — predictions are pre-computed from
          the trained <code>sequence_detector.joblib</code> model. Full real-time inference requires
          a Python backend (FastAPI + scikit-learn). Feature extraction from raw video requires the
          full media processing pipeline.
        </div>
      </div>
    </main>
  );
}
