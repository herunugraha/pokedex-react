import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PokemonList from './pages/PokemonList'
import PokemonDetail from './pages/PokemonDetail'


export default function App(){
return (
<Routes>
<Route path="/" element={<PokemonList />} />
<Route path="/pokemon/:name" element={<PokemonDetail />} />
</Routes>
)
}