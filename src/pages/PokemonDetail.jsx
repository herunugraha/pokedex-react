// src/pages/PokemonDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPokemonDetailByName } from '../api/poke'

export default function PokemonDetail() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPokemonDetailByName(name)
        if (!cancelled) setPokemon(data)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [name])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>
  if (!pokemon) return <div className="p-6">Not found</div>

  const image = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <Link to="/" className="text-sky-600 underline">← Back</Link>

        <div className="mt-4 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex items-center justify-center">
            {image ? (
              <img src={image} alt={pokemon.name} className="w-48 h-48 object-contain" />
            ) : (
              <div className="w-48 h-48 bg-slate-100" />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
            <div className="mt-2 text-sm text-slate-600">#{String(pokemon.id).padStart(3,'0')}</div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Height</h4>
                <div className="text-sm text-slate-700">{pokemon.height} (decimetres)</div>
              </div>
              <div>
                <h4 className="font-semibold">Weight</h4>
                <div className="text-sm text-slate-700">{pokemon.weight} (hectograms)</div>
              </div>

              <div>
                <h4 className="font-semibold">Types</h4>
                <div className="flex gap-2 mt-2">
                  {pokemon.types.map(t => (
                    <span key={t.type.name} className="px-3 py-1 bg-slate-100 rounded-full text-sm capitalize">
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Base stats</h4>
                <div className="mt-2 space-y-2">
                  {pokemon.stats.map(s => (
                    <div key={s.stat.name} className="flex items-center justify-between">
                      <div className="capitalize text-sm">{s.stat.name}</div>
                      <div className="font-medium">{s.base_stat}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
