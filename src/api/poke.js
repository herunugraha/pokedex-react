const BASE = 'https://pokeapi.co/api/v2'


export async function fetchPokemonList(limit = 20, offset = 0) {
const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`)
if (!res.ok) throw new Error('Failed to fetch list')
return res.json()
}


export async function fetchPokemonDetailByUrl(url) {
const res = await fetch(url)
if (!res.ok) throw new Error('Failed to fetch detail')
return res.json()
}


export async function fetchPokemonDetailByName(name) {
const res = await fetch(`${BASE}/pokemon/${name}`)
if (!res.ok) throw new Error('Failed to fetch detail')
return res.json()
}