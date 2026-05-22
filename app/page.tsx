import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import RecommendationShell from "./components/RecommendationShell";

const bodyFont = Space_Grotesk({ variable: "--font-body", subsets: ["latin"] });
const displayFont = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <header className="mb-14 max-w-3xl">
          {/* <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Smart Time Advisor
          </p> */}
          <h1 className="mt-5 text-4xl font-serif leading-tight text-ink md:text-5xl">
            Find the calmest, cleanest time to step outside.
          </h1>
          <p className="mt-4 text-lg text-ink-muted">
            Weather and air quality, scored into a single recommendation you can trust.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-ink/10 bg-surface/80 p-6 shadow-soft backdrop-blur">
            <div>
              <p className="text-sm text-ink-muted">Search city</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Find the best time for your location</h3>

              <div className="mt-4">
                {/* Client search component */}
                <RecommendationShell />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink/10 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Best time</p>
                  <p className="mt-2 text-lg font-semibold text-ink">—</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Comfort</p>
                  <p className="mt-2 text-lg font-semibold text-ink">—</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Air quality</p>
                  <p className="mt-2 text-lg font-semibold text-ink">—</p>
                </div>
              </div>

              
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-ink/10 bg-surface/80 p-6 shadow-soft">
              <p className="text-sm text-ink-muted">Recommendation</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Best time today</h2>
              <p className="mt-4 text-sm text-ink-muted">
                Low rain chance, comfortable temperature, and cleaner air combine here.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-ink-muted">
                <span className="rounded-full border border-ink/10 bg-white/70 px-3 py-1">
                  Low wind
                </span>
                <span className="rounded-full border border-ink/10 bg-white/70 px-3 py-1">
                  UV mild
                </span>
                <span className="rounded-full border border-ink/10 bg-white/70 px-3 py-1">
                  AQI 42
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-surface/80 p-6 shadow-soft">
              <p className="text-sm text-ink-muted">Hourly timeline</p>
              <div className="mt-4 h-36 rounded-2xl border border-dashed border-ink/20 bg-surface-alt/70 flex items-center justify-center">
                <div className="text-sm text-ink-muted">Search a city to see the hourly timeline here.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
 
    </main>
  );
}
