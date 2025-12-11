// src/components/PokemonCard.jsx
import React, { useState } from "react";

// Warna gradien berdasarkan tipe Pokémon
const TYPE_COLORS = {
  grass: "from-emerald-300 to-emerald-500",
  fire: "from-rose-300 to-rose-500",
  water: "from-sky-300 to-sky-500",
  electric: "from-yellow-300 to-yellow-500",
  bug: "from-lime-300 to-lime-600",
  normal: "from-stone-300 to-stone-400",
  poison: "from-violet-300 to-violet-500",
  ground: "from-amber-300 to-amber-500",
  fairy: "from-pink-300 to-pink-500",
  fighting: "from-orange-300 to-orange-600",
  psychic: "from-fuchsia-300 to-fuchsia-600",
  rock: "from-stone-400 to-stone-600",
  ice: "from-cyan-200 to-cyan-400",
  ghost: "from-violet-700 to-violet-900",
  dragon: "from-indigo-500 to-indigo-700",
  dark: "from-stone-700 to-stone-900",
  flying: "from-indigo-200 to-indigo-400",
  steel: "from-slate-300 to-slate-500",
};

// Inline SVG animated pokeball spinner
function PokeballSpinner({ size = 32 }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="block"
    >
      {/* outer circle */}
      <g transform="translate(50,50)">
        <g>
          <circle r="45" fill="#ffffff" stroke="#000" strokeWidth="4" />
          <path d="M-45 0 A45 45 0 0 1 45 0" fill="#f43f5e" stroke="none" />
          <circle r="14" fill="#fff" stroke="#000" strokeWidth="4" />
          <circle r="8" fill="#f8fafc" stroke="#000" strokeWidth="2" />
        </g>
        {/* rotate group */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </g>
      </g>
    </svg>
  );
}

// Static SVG Pokéball (fallback)
function PokeballStatic({ size = 56 }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="block"
    >
      <g transform="translate(50,50)">
        <circle r="45" fill="#fff" stroke="#000" strokeWidth="4" />
        <path d="M-45 0 A45 45 0 0 1 45 0" fill="#f43f5e" stroke="none" />
        <rect x="-45" y="-6" width="90" height="12" fill="#000" />
        <circle r="14" fill="#fff" stroke="#000" strokeWidth="4" />
        <circle r="8" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      </g>
    </svg>
  );
}

export default function PokemonCard({ pokemon, onSelect }) {
  const img =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    null;

  const primaryType = pokemon.types?.[0]?.type?.name || "normal";
  const gradient = TYPE_COLORS[primaryType] || TYPE_COLORS["normal"];

  const [loading, setLoading] = useState(Boolean(img)); // true if we have an img to load
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(pokemon.name)}
      className={`
        text-left block rounded-xl overflow-hidden shadow-md 
        bg-gradient-to-br ${gradient}
        p-4 hover:shadow-lg transition transform hover:-translate-y-1
      `}
    >
      <div className="flex items-center justify-between">
        {/* Left content */}
        <div className="flex-1 text-white drop-shadow-sm">
          <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
          <div className="text-xs opacity-80">#{String(pokemon.id).padStart(3, "0")}</div>

          {/* type badges */}
          <div className="flex gap-2 mt-2">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        {/* Artwork with SVG spinner and fade-in */}
        <div className="w-20 h-20 flex items-center justify-center relative">
          {/* Spinner while loading and no error */}
          {loading && !hasError && (
            <div className="absolute">
              <PokeballSpinner size={28} />
            </div>
          )}

          {/* If image exists and not errored, render it */}
          {img && !hasError ? (
            <img
              src={img}
              alt={pokemon.name}
              className={`w-full h-full object-contain transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setLoading(false)}
              onError={(e) => {
                setHasError(true);
                setLoading(false);
                // prevent infinite loop if fallback also fails
                e.currentTarget.onerror = null;
                e.currentTarget.src = ""; // blank to avoid showing broken image
              }}
            />
          ) : (
            // fallback static pokeball SVG
            <div className="w-full h-full flex items-center justify-center">
              <PokeballStatic size={44} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
