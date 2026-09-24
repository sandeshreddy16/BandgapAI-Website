import { useState } from "react";

function App() {
  const [formula, setFormula] = useState("");
  const [prediction, setPrediction] = useState(null);

const handlePredict = async () => {
  if (!formula.trim()) {
    alert("Please enter a chemical formula.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formula: formula.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Prediction failed");
    }

    setPrediction({
      value: data.band_gap,
      model: "XGBoost (Tuned)",
      mae: "0.487 ± 0.035 eV",
    });

  } catch (error) {
    alert(`Prediction failed: ${error.message}`);
  }
};
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <h1 className="text-2xl font-bold">
            BandGap<span className="text-cyan-400">AI</span>
          </h1>

          <span className="text-sm text-slate-400">
            Materials Science × Machine Learning
          </span>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-16">

        {/* Hero */}
        <section className="text-center">

          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-400">
            Machine Learning for Materials
          </p>

          <h2 className="text-5xl font-bold tracking-tight">
            Predict Material
            <span className="text-cyan-400"> Band Gap</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Predict the electronic band gap of semiconductor materials in the 0.5–3.5 eV range using chemical composition and machine learning.
          </p>

        </section>

        {/* Prediction Card */}
        <section className="mx-auto mt-12 max-w-2xl">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

            <label className="mb-3 block text-sm font-medium text-slate-300">
              Chemical Formula
            </label>

            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. Fe2O3"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
            />

            <button
              onClick={handlePredict}
              className="mt-6 w-full rounded-xl bg-cyan-400 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Predict Band Gap
            </button>

          </div>

        </section>

        {/* Prediction Result */}
        {prediction && (
          <section className="mx-auto mt-8 max-w-2xl">

            <div className="rounded-2xl border border-cyan-400/30 bg-slate-900 p-8 text-center shadow-2xl">

              <p className="text-sm uppercase tracking-widest text-slate-400">
                Predicted Band Gap
              </p>

              <h3 className="mt-3 text-5xl font-bold text-cyan-400">
                {prediction.value} eV
              </h3>

              <p className="mt-4 text-lg text-white">
                {formula}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Model
                  </p>

                  <p className="mt-1 font-semibold">
                    {prediction.model}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Cross-Validation MAE
                  </p>

                  <p className="mt-1 font-semibold">
                    {prediction.mae}
                  </p>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* Model Performance */}
        <section className="mt-20">

          <h3 className="text-center text-2xl font-bold">
            Model Performance
          </h3>

          <p className="mt-3 text-center text-slate-400">
            5-fold cross-validation results
          </p>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-4">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Baseline
              </p>

              <p className="mt-2 text-2xl font-bold">
                0.7072 eV
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Linear Regression
              </p>

              <p className="mt-2 text-2xl font-bold">
                0.5919 eV
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
              XGBoost
              </p>
              <p className="mt-3 text-2xl font-bold">
                0.487 ± 0.035 eV
              </p>
              <p className="text-sm text-slate-500">
                5-Fold CV MAE
              </p>
            </div>

            <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-5">

              <p className="text-sm text-cyan-400">
                Selected Model
              </p>

              <p className="mt-2 text-2xl font-bold">
                0.487 ± 0.035 eV
              </p>

              <p className="mt-1 text-sm text-slate-400">
                XGBoost (Tuned)
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        BandGapAI • Machine Learning Materials Project
      </footer>

    </div>
  );
}

export default App;