// src/pages/PokemonList.jsx
import React, { useEffect, useState, useRef } from 'react'
import { fetchPokemonList, fetchPokemonDetailByUrl, fetchPokemonDetailByName } from '../api/poke'
import PokemonCard from '../components/PokemonCard'
import PokemonModal from '../components/PokemonModal'

export default function PokemonList() {
  const PAGE_SIZE = 20
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([]) // detailed pokemon currently displayed
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState(null)

  // modal state
  const [selected, setSelected] = useState(null) // name string
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // cache of all names from the API (for searching)
  const allNamesRef = useRef(null)
  const searchTimer = useRef(null)

  // load default page (pagination)
  useEffect(() => {
    // if searching, don't fetch paginated page
    if (query.trim()) return

    let cancelled = false
    async function loadPage() {
      setLoading(true)
      setError(null)
      try {
        const offset = page * PAGE_SIZE
        const data = await fetchPokemonList(PAGE_SIZE, offset)
        setTotalCount(data.count)
        const details = await Promise.all(data.results.map(r => fetchPokemonDetailByUrl(r.url)))
        if (!cancelled) setResults(details)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load page')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadPage()
    return () => { cancelled = true }
  }, [page, query])

  // helper: fetch all names once
  async function ensureAllNames() {
    if (allNamesRef.current) return allNamesRef.current
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000`)
      const json = await res.json()
      allNamesRef.current = json.results || []
      return allNamesRef.current
    } catch (e) {
      throw new Error('Failed to fetch name list')
    }
  }

  // search handler with debounce + global search across PokeAPI names
  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current)
      searchTimer.current = null
    }

    const q = query.trim().toLowerCase()
    if (!q) {
      // switch back to paginated mode
      setPage(0)
      return
    }

    searchTimer.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        // fast path: exact name/id
        try {
          const detail = await fetchPokemonDetailByName(q)
          setResults([detail])
          setTotalCount(1)
          setLoading(false)
          return
        } catch (e) {
          // not found -> fallback
        }

        const all = await ensureAllNames()
        const matched = all.filter(item => item.name.includes(q))
        if (matched.length === 0) {
          setResults([])
          setTotalCount(0)
          setLoading(false)
          return
        }

        const slice = matched.slice(0, PAGE_SIZE)
        const details = await Promise.all(slice.map(r => fetchPokemonDetailByUrl(r.url)))
        setResults(details)
        setTotalCount(matched.length)
      } catch (e) {
        setError(e.message || 'Search failed')
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current)
        searchTimer.current = null
      }
    }
  }, [query])

  // -----------------------
  // Modal handlers
  // -----------------------
  async function handleSelect(name) {
    // called when a card is clicked; name is pokemon.name
    setSelected(name)
    setModalLoading(true)
    setSelectedDetail(null)
    try {
      // try to find in current results cache first
      const cached = results.find(r => r.name === name)
      if (cached) {
        setSelectedDetail(cached)
      } else {
        // fetch detail from API
        const detail = await fetchPokemonDetailByName(name)
        setSelectedDetail(detail)
      }
    } catch (e) {
      console.error('Failed to fetch detail', e)
    } finally {
      setModalLoading(false)
    }
  }

  function handleCloseModal() {
    setSelected(null)
    setSelectedDetail(null)
    setModalLoading(false)
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-sky-700">Pokédex</h1>
        </header>

        <div className="flex gap-3 mb-4 flex-col sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Pokémon by name or id"
            className="flex-1 rounded-full px-4 py-2 border"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { if (!query.trim()) setPage(p => Math.max(0, p - 1)) }}
              className="px-3 py-2 rounded-md border"
              disabled={!!query.trim() || page === 0}
            >
              Previous
            </button>

            <button
              onClick={() => { if (!query.trim()) setPage(p => p + 1) }}
              className="px-3 py-2 rounded-md border"
              disabled={!!query.trim() || (page + 1) * PAGE_SIZE >= totalCount}
            >
              Next
            </button>
          </div>
        </div>

        {error && <div className="mb-4 text-red-600">Error: {error}</div>}

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No Pokémon found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(p => (
              // Pass the real handler so modal opens on click
              <PokemonCard key={p.id} pokemon={p} onSelect={handleSelect} />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {query.trim() ? `Showing ${results.length} of ${totalCount} matching Pokémon` : `Page ${page + 1}`}
          </div>

          {!query.trim() && (
            <div>
              <button
                onClick={async () => {
                  const offset = (page + 1) * PAGE_SIZE
                  try {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`)
                    const json = await res.json()
                    const details = await Promise.all(json.results.map(r => fetch(r.url).then(x => x.json())))
                    setResults(prev => [...prev, ...details])
                    setPage(p => p + 1)
                    setTotalCount(json.count)
                  } catch (e) {
                    console.error(e)
                  }
                }}
                className="px-4 py-2 rounded-md border"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal rendering */}
      {selected && (
        modalLoading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 bg-white rounded-xl p-6 shadow">Loading...</div>
          </div>
        ) : (
          <PokemonModal pokemon={selectedDetail} onClose={handleCloseModal} />
        )
      )}
    </div>
  )
}
