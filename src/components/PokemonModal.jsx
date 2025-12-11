// src/components/PokemonModal.jsx
import React, { useEffect, useRef, useState } from "react";

/* ---------- config / helpers ---------- */
const TYPE_COLORS = {
  grass: ["from-emerald-400", "to-emerald-500"],
  poison: ["from-violet-400", "to-violet-500"],
  fire: ["from-rose-400", "to-rose-500"],
  water: ["from-sky-400", "to-sky-500"],
  bug: ["from-lime-400", "to-lime-600"],
  flying: ["from-indigo-300", "to-indigo-500"],
  normal: ["from-stone-200", "to-stone-300"],
  electric: ["from-yellow-300", "to-yellow-400"],
  rock: ["from-stone-400", "to-stone-500"],
  ground: ["from-amber-400", "to-amber-500"],
  fairy: ["from-pink-300", "to-pink-400"],
  fighting: ["from-orange-400", "to-orange-500"],
  psychic: ["from-fuchsia-400", "to-fuchsia-600"],
  ghost: ["from-violet-700", "to-violet-800"],
  ice: ["from-cyan-200", "to-cyan-400"],
  dragon: ["from-indigo-600", "to-indigo-800"],
  dark: ["from-stone-700", "to-stone-800"],
  steel: ["from-slate-400", "to-slate-600"],
};

const STAT_COLOR = {
  hp: "bg-emerald-500",
  attack: "bg-rose-500",
  defense: "bg-yellow-500",
  "special-attack": "bg-purple-500",
  "special-defense": "bg-blue-500",
  speed: "bg-orange-500",
};

const TYPE_BADGE = {
  grass: "bg-emerald-600 text-white",
  poison: "bg-violet-600 text-white",
  fire: "bg-rose-600 text-white",
  water: "bg-sky-600 text-white",
  bug: "bg-lime-700 text-white",
  flying: "bg-indigo-400 text-white",
  normal: "bg-stone-300 text-black",
  electric: "bg-yellow-400 text-black",
  rock: "bg-stone-500 text-white",
  ground: "bg-amber-500 text-white",
  fairy: "bg-pink-400 text-white",
  fighting: "bg-orange-500 text-white",
  psychic: "bg-fuchsia-500 text-white",
  ghost: "bg-violet-800 text-white",
  ice: "bg-cyan-300 text-black",
  dragon: "bg-indigo-700 text-white",
  dark: "bg-stone-800 text-white",
  steel: "bg-slate-500 text-white",
};

const MAX_STAT = 255;

/* ---------- main component (no TTS, no artwork animation) ---------- */
export default function PokemonModal({ pokemon, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tab, setTab] = useState("about");
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null); // HTMLAudioElement

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // when modal opens or pokemon changes, attempt to play cry
    if (!pokemon) return;
    playCry().catch(() => {});
    return () => stopSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon, muted]);

  if (!pokemon) return null;

  const primaryType = pokemon.types?.[0]?.type?.name || "normal";
  const gradient = TYPE_COLORS[primaryType] || TYPE_COLORS["normal"];
  const artwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    "";

  function close() {
    setIsVisible(false);
    stopSound();
    setTimeout(() => onClose && onClose(), 300);
  }

  function getCryUrl() {
    const id = Number(pokemon.id) || null;
    if (!id) return null;
    return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
  }

  async function playCry() {
    const cryUrl = getCryUrl();
    stopSound();

    if (cryUrl) {
      try {
        audioRef.current = new Audio();
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.src = cryUrl;
        audioRef.current.loop = false;
        audioRef.current.muted = muted;
        audioRef.current.onplaying = () => setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          // if playback fails (404/CORS), just stop without TTS fallback
          setIsPlaying(false);
        };
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (err) {
        // playback blocked or failed — do nothing (no TTS fallback)
        setIsPlaying(false);
        return;
      }
    }

    // no cry URL available — do nothing (no TTS)
    setIsPlaying(false);
  }

  function stopSound() {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
      audioRef.current = null;
    }
    setIsPlaying(false);
  }

  async function handleReplay(e) {
    e.stopPropagation();
    stopSound();
    try {
      await playCry();
    } catch (e) {}
  }

  function toggleMute(e) {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
    if (next) {
      // muted — stop any playing audio
      stopSound();
    }
  }

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div
        onClick={close}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
      />

      <div className="fixed inset-0 flex items-start md:items-center justify-center pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            pointer-events-auto
            w-full h-full bg-white overflow-y-auto transition-all duration-300 transform
            ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"}
            md:max-w-4xl md:h-auto md:rounded-2xl md:shadow-xl md:mx-6
          `}
        >
          {/* HEADER */}
          <div
            className={`relative h-64 md:h-72 bg-gradient-to-r ${gradient[0]} ${gradient[1]} text-white md:rounded-t-2xl`}
          >
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={close}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                aria-label="Back"
              >
                ←
              </button>

              <button
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? "🔇" : "🔊"}
              </button>

              <button
                onClick={handleReplay}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                aria-label="Play cry"
              >
                {isPlaying ? "⏸" : "🔊▶"}
              </button>
            </div>

            <div className="absolute top-4 right-4">
              <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">♥</button>
            </div>

            <div className="absolute bottom-6 left-6 z-10">
              <h1 className="text-3xl md:text-4xl font-bold capitalize">{pokemon.name}</h1>
              <div className="flex gap-2 mt-2 items-center">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`px-3 py-1 ${TYPE_BADGE[t.type.name] || "bg-white/20"} rounded-full text-sm capitalize`}
                  >
                    {t.type.name}
                  </span>
                ))}
                <span className="text-white/90 ml-3">#{String(pokemon.id).padStart(3, "0")}</span>
              </div>
            </div>

            {/* Artwork — STATIC (no animation) */}
            <div className="absolute bottom-0 right-4 translate-y-10 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 z-10">
              {artwork ? (
                <img src={artwork} alt={pokemon.name} className="w-full h-full object-contain drop-shadow-2xl" />
              ) : null}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-48 h-48 md:w-64 md:h-64 opacity-5 rounded-full bg-white/10" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-16 px-6 pb-10 max-w-3xl mx-auto">
            {/* Tabs: About + Stats */}
            <div className="flex gap-6 border-b mb-5 pb-2">
              <button onClick={() => setTab("about")} className={`capitalize pb-2 ${tab === "about" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-500"}`}>About</button>
              <button onClick={() => setTab("stats")} className={`capitalize pb-2 ${tab === "stats" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-500"}`}>Base Stats</button>
            </div>

            {tab === "about" && (
              <div className="space-y-4 text-slate-700">
                <div>
                  <div className="text-sm text-slate-500">Species</div>
                  <div className="font-medium capitalize">{pokemon.species?.name || "-"}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-500">Height</div>
                    <div className="font-medium">{pokemon.height} dm</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Weight</div>
                    <div className="font-medium">{pokemon.weight} hg</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Abilities</div>
                  <div className="font-medium capitalize">{pokemon.abilities.map((a) => a.ability.name).join(", ")}</div>
                </div>
              </div>
            )}

            {tab === "stats" && (
              <div className="space-y-4">
                {pokemon.stats.map((s) => {
                  const key = s.stat.name;
                  const percent = Math.min(100, Math.round((s.base_stat / MAX_STAT) * 100));
                  const barColor = STAT_COLOR[key] || "bg-slate-400";
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1 capitalize">
                        <span>{key.replace("-", " ")}</span>
                        <span>{s.base_stat} <span className="text-slate-400 text-xs">({percent}%)</span></span>
                      </div>

                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={close} className="px-4 py-2 rounded-md border">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
