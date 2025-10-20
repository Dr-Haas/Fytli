"use client";

import React from "react";
import { config } from "@/lib/config";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-white/20">
      {/* Global styles for keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); filter: blur(0px); opacity: 0.95; }
          50% { transform: scale(1.06); filter: blur(1px); opacity: 1; }
        }
        @keyframes glowPulse {
          0% { opacity: .6; }
          50% { opacity: 1; }
          100% { opacity: .6; }
        }
        @keyframes orbitSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-16 pb-14 md:pb-20">
        {/* Ambient gradient haze */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-300/30 via-orange-500/20 to-rose-600/10 blur-3xl" />
          <div className="absolute bottom-[-18rem] right-[-6rem] size-[420px] rounded-full bg-gradient-to-tr from-amber-200/20 via-amber-400/10 to-transparent blur-3xl" />
        </div>

        {/* Logo / Nav minimal */}
        <header className="relative z-10 flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 animate-[glowPulse_3.6s_ease-in-out_infinite]" />
            <span className="text-lg tracking-tight font-semibold">Fytli</span>
          </div>
          <a href={config.appUrl} className="text-sm/none rounded-full border border-white/15 px-3 py-1.5 backdrop-blur hover:border-white/30 transition">Rejoindre</a>
        </header>

        {/* Hero copy */}
        <div className="relative z-10 mt-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl animate-[fadeInUp_0.8s_ease-out]">
            L&apos;app qui <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">respire</span> avec toi
          </h1>
          <p className="mx-auto mt-3 max-w-[36ch] text-pretty text-white/80 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Suis ta séance. Ressens le groupe. Plus on bouge ensemble,
            plus le soleil <span className="text-amber-300">brille</span>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <a href={config.appUrl} className="rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 active:opacity-80 transition">Commencer maintenant</a>
            <a href="#concept" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:border-white/40 transition">Voir le concept</a>
          </div>
        </div>

        {/* Animated SUN (SVG) */}
        <div className="relative z-10 mt-12 flex items-center justify-center animate-[fadeInUp_1s_ease-out_0.6s_both]">
          <div className="relative">
            <AnimatedSun users={28} intensity={0.72} />
            <p className="mt-3 text-center text-xs text-white/70">{`28 utilisateurs en session — intensité 72%`}</p>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative z-10 mt-12 flex justify-center animate-[fadeInUp_1s_ease-out_0.8s_both]">
          <Image 
            src="/assets/fytli-hero.png" 
            alt="Couple qui s'étire - Fytli" 
            width={600}
            height={400}
            className="rounded-2xl shadow-2xl border border-white/10 max-w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* CONCEPT */}
      <section id="concept" className="relative px-5 py-12 border-t border-white/10">
        <h2 className="text-2xl font-semibold">Pourquoi Fytli ?</h2>
        <p className="mt-2 text-white/80">
          Parce que la motivation n&apos;est pas un bouton <i>ON/OFF</i>. C&apos;est un souffle.
          Fytli transforme ton entraînement en expérience <b>vivante</b> : tu avances à ton rythme,
          porté·e par l&apos;énergie des autres.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              t: "Présence vivante",
              d: "Une sphère lumineuse qui respire avec toi et s'intensifie quand la communauté s'active.",
            },
            {
              t: "Sessions synchronisées",
              d: "Suis le programme seul ou avec tes amis. Les bulles autour du soleil, c'est eux.",
            },
            {
              t: "Challenge doux",
              d: "On se motive ensemble, sans comparaison toxique. Tes progrès comptent, point.",
            },
            {
              t: "Badges & progression",
              d: "Constance, Sérénité, Progression… Laisse une trace claire de tes efforts.",
            },
          ].map((c, i) => (
            <Card key={i} title={c.t} desc={c.d} />
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="relative px-5 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">La communauté Fytli</h2>
            <p className="text-white/80 mb-4">
              Chacun s&apos;entraîne dans son coin, mais personne n&apos;est seul.
              Les séances se synchronisent, les encouragements circulent,
              et la motivation devient collective.
            </p>
            <p className="text-white/70 text-sm">
              Connecte-toi avec tes amis, partage tes progrès, et ressentez ensemble l&apos;énergie du groupe.
            </p>
          </div>
          <div className="flex-1">
            <Image 
              src="/assets/fytli-community.png" 
              alt="Communauté Fytli" 
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl border border-white/10 max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative px-5 py-12 border-t border-white/10">
        <h2 className="text-2xl font-semibold">Comment ça marche</h2>
        <ol className="mt-6 space-y-5">
          <Step n={1} title="Choisis ta séance" desc="Renfo, cardio, mobilité — Fytli te guide et s'adapte à ton niveau." />
          <Step n={2} title="Lance la session" desc="La sphère s'illumine. Tes amis deviennent des bulles en orbite." />
          <Step n={3} title="Suis le flow" desc="Des phases courtes, claires, cadencées. Pas d'écran surchargé, juste l'essentiel." />
          <Step n={4} title="Ressens la cohorte" desc="Plus on est, plus ça rayonne. La motivation devient palpable." />
        </ol>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 p-5 bg-white/[.03]">
            <Image 
              src="/assets/fytli-dashboard.png" 
              alt="Dashboard Fytli" 
              width={500}
              height={300}
              className="rounded-xl mb-4 max-w-full h-auto"
            />
            <h3 className="font-semibold mb-2">Ton tableau de bord</h3>
            <p className="text-white/70 text-sm">
              Visualise tes progrès, tes badges et l&apos;activité de ta communauté en un coup d&apos;œil.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5 bg-white/[.03]">
            <Image 
              src="/assets/fytli-network.png" 
              alt="Réseau Fytli" 
              width={500}
              height={300}
              className="rounded-xl mb-4 max-w-full h-auto"
            />
            <h3 className="font-semibold mb-2">Ton réseau</h3>
            <p className="text-white/70 text-sm">
              Connecte-toi avec tes proches et motivez-vous mutuellement à chaque séance.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 p-5">
          <p className="text-white/80 text-sm">
            <span className="font-semibold text-white">Philosophie :</span> l&apos;effort n&apos;est pas une punition.
            C&apos;est un rendez‑vous avec toi‑même — et parfois, avec les autres.
          </p>
        </div>
      </section>

      {/* SHARE YOUR SUN */}
      <section className="relative px-5 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Partage ton soleil</h2>
            <p className="text-white/80 mb-4">
              Chaque séance fait briller ta sphère. Plus tu es régulier,
              plus ton soleil rayonne et inspire les autres.
            </p>
            <EnergyBar value={72} />
            <p className="mt-3 text-white/70 text-sm">Plus la barre se remplit, plus la sphère s&apos;embrase. Rejoins la session.</p>
          </div>
          <div className="flex-1">
            <Image 
              src="/assets/fytli-share-your-sun.png" 
              alt="Partage ton soleil" 
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl border border-white/10 max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* FOLLOW AND SHARE */}
      <section className="relative px-5 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Suis et partage</h2>
            <p className="text-white/80 mb-4">
              Découvre les progrès de tes amis, partage tes accomplissements,
              et créez ensemble une dynamique positive.
            </p>
            <div className="flex gap-3 mt-6">
              <a href={config.appUrl} className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition">
                Rejoindre maintenant
              </a>
            </div>
          </div>
          <div className="flex-1">
            <Image 
              src="/assets/fytli-follow-and-share.png" 
              alt="Suis et partage" 
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl border border-white/10 max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* BADGES */}
      <section className="relative px-5 py-12 border-t border-white/10">
        <h2 className="text-2xl font-semibold">Badges & récompenses</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <BadgeCard name="Constance" desc="7 jours d'entraînement" emoji="🔥" />
          <BadgeCard name="Progression" desc="+20% de perf" emoji="💪" />
          <BadgeCard name="Sérénité" desc="5 séances zen" emoji="🧘" />
          <BadgeCard name="Communauté" desc="10 amis actifs" emoji="👥" />
          <BadgeCard name="Détermination" desc="30 jours consécutifs" emoji="⚡" />
          <BadgeCard name="Explorateur" desc="Essaie tous les programmes" emoji="🌟" />
        </div>
      </section>

      {/* CTA */}
      <section id="telecharger" className="relative px-5 py-14 border-t border-white/10">
        <div className="rounded-3xl border border-white/15 p-6 bg-white/[.03] backdrop-blur">
          <h3 className="text-xl font-semibold">Prêt·e à faire briller le soleil ?</h3>
          <p className="mt-2 text-white/80">Rejoins les premières sessions, invite des amis, et sens la différence.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <a href={config.appUrl} className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90">
              Commencer maintenant
            </a>
            <a href={`${config.appUrl}/register`} className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:border-white/40">
              Créer un compte
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-10 border-t border-white/10 text-white/60 text-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-4 rounded-md bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500" />
          <span>Fytli · Ensemble, on respire mieux</span>
        </div>
        <p className="mb-4 text-white/80">
          Fytli, c&apos;est gratuit. Pour toi, pour tes proches, pour bouger ensemble ❤️
        </p>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-white/90 transition" href="#">Confidentialité</a>
          <a className="hover:text-white/90 transition" href="#">CGU</a>
          <a className="hover:text-white/90 transition" href="#">Contact</a>
        </div>
        <p className="mt-4 text-xs">© 2025 Fytli – L&apos;esprit du mouvement partagé</p>
      </footer>
    </main>
  );
}

/* ——— Reusable UI ——— */
function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/[.03] backdrop-blur">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/80">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[.04] text-sm font-semibold">
        {n}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-white/75 text-sm mt-0.5">{desc}</p>
      </div>
    </li>
  );
}

function BadgeCard({ name, desc, emoji }: { name: string; desc: string; emoji: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/[.03] text-center backdrop-blur hover:bg-white/[.06] transition-all">
      <div className="text-2xl" aria-hidden="true">{emoji}</div>
      <div className="mt-1 font-semibold">{name}</div>
      <div className="text-xs text-white/70">{desc}</div>
    </div>
  );
}

function EnergyBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-4">
      <div className="w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
        <div
          className="h-3 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400"
          style={{ width: `${clamped}%`, transition: "width .6s ease" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-white/70">
        <span>Calme</span>
        <span>{clamped}%</span>
        <span>Brasier</span>
      </div>
    </div>
  );
}

/* Animated Sun with orbiting bubbles */
function AnimatedSun({ users = 12, intensity = 0.5 }: { users?: number; intensity?: number }) {
  const bubbles = Array.from({ length: users }).map((_, i) => ({
    r: 110 + (i % 6) * 6,               // orbit radius
    size: 6 + (i % 3) * 2,              // bubble size
    speed: 16 + (i % 5) * 3,            // seconds per revolution
    delay: i * 0.35,                    // start offset
  }));

  // Clamp intensity for glow layers (0..1)
  const k = Math.max(0, Math.min(1, intensity));

  return (
    <div className="relative" style={{ width: 320, height: 320 }}>
      {/* Sun core + glow (SVG) */}
      <svg width="320" height="320" viewBox="0 0 320 320" className="[animation:breathe_5s_ease-in-out_infinite]">
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE6A3" />
            <stop offset="55%" stopColor="#FFB45A" />
            <stop offset="100%" stopColor="#FF7A3A" />
          </radialGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,214,130,0.9)" />
            <stop offset="60%" stopColor="rgba(255,170,80,0.35)" />
            <stop offset="100%" stopColor="rgba(255,120,58,0)" />
          </radialGradient>
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {/* Halo layers scale with intensity */}
        <g opacity={0.7 + k * 0.3}>
          <circle cx="160" cy="160" r={120 + 20 * k} fill="url(#halo)" filter="url(#softBlur)" />
          <circle cx="160" cy="160" r={90 + 18 * k} fill="url(#halo)" filter="url(#softBlur)" />
        </g>
        {/* Core */}
        <circle cx="160" cy="160" r={70 + 10 * k} fill="url(#sunCore)" />
      </svg>

      {/* Orbiting bubbles (users) */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: 0,
            height: 0,
            transform: `translate(-50%, -50%) rotate(${(360 / bubbles.length) * i}deg)`,
            animation: `orbitSlow ${b.speed}s linear ${b.delay}s infinite`,
          }}
        >
          <div
            className="absolute -left-1/2 -top-1/2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,200,150,.6)]"
            style={{
              width: b.size,
              height: b.size,
              transform: `translate(${b.r}px, 0)`,
              animation: `float ${4 + (i % 3)}s ease-in-out ${b.delay}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

