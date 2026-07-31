import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_URL = 'https://pokeapi.co/api/v2';
const ITEMS_PER_PAGE = 20;

// Global cache shared across hook instances
const pokemonCache = new Map();
const typeCache = new Map();
let masterListCache = null;

async function getMasterList(signal) {
  if (masterListCache) return masterListCache;
  const res = await fetch(`${BASE_URL}/pokemon?limit=1500`, { signal });
  if (!res.ok) throw new Error('Failed to fetch Pokémon directory');
  const data = await res.json();
  masterListCache = data.results.map(item => {
    const parts = item.url.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return { ...item, id };
  });
  return masterListCache;
}

export function usePokemon({ page = 1, searchQuery = '', selectedType = null, showFavorites = false, favorites = [] }) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const abortRef = useRef(null);

  const fetchPokemonDetail = useCallback(async (url, signal) => {
    if (pokemonCache.has(url)) {
      return pokemonCache.get(url);
    }
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await response.json();
    pokemonCache.set(url, data);
    return data;
  }, []);

  useEffect(() => {
    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // FAVORITES VIEW
        if (showFavorites) {
          if (favorites.length === 0) {
            setPokemon([]);
            setTotalCount(0);
            setLoading(false);
            return;
          }
          const details = await Promise.all(
            favorites.map(id =>
              fetchPokemonDetail(`${BASE_URL}/pokemon/${id}`, controller.signal)
            )
          );
          setPokemon(details.sort((a, b) => a.id - b.id));
          setTotalCount(details.length);
          setLoading(false);
          return;
        }

        // SEARCH MODE
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const masterList = await getMasterList(controller.signal);

          const matches = masterList.filter(
            p => p.name.toLowerCase().includes(query) || p.id === query
          );

          if (matches.length === 0) {
            setPokemon([]);
            setTotalCount(0);
            setError(`No Pokémon found matching "${searchQuery}"`);
            setLoading(false);
            return;
          }

          const offset = (page - 1) * ITEMS_PER_PAGE;
          const pageSlice = matches.slice(offset, offset + ITEMS_PER_PAGE);

          const details = await Promise.all(
            pageSlice.map(p => fetchPokemonDetail(p.url, controller.signal))
          );

          setPokemon(details);
          setTotalCount(matches.length);
          setLoading(false);
          return;
        }

        // TYPE FILTER MODE
        if (selectedType) {
          const cacheKey = `type-${selectedType}`;
          let typeData;
          if (typeCache.has(cacheKey)) {
            typeData = typeCache.get(cacheKey);
          } else {
            const res = await fetch(`${BASE_URL}/type/${selectedType}`, { signal: controller.signal });
            if (!res.ok) throw new Error('Failed to fetch type data');
            typeData = await res.json();
            typeCache.set(cacheKey, typeData);
          }
          
          const allPokemonOfType = typeData.pokemon.map(p => p.pokemon);
          const totalOfType = allPokemonOfType.length;
          const offset = (page - 1) * ITEMS_PER_PAGE;
          const pageSlice = allPokemonOfType.slice(offset, offset + ITEMS_PER_PAGE);

          const details = await Promise.all(
            pageSlice.map(p => fetchPokemonDetail(p.url, controller.signal))
          );

          setPokemon(details);
          setTotalCount(totalOfType);
          setLoading(false);
          return;
        }

        // DEFAULT PAGINATED LIST
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const listRes = await fetch(
          `${BASE_URL}/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
          { signal: controller.signal }
        );
        if (!listRes.ok) throw new Error('Failed to fetch Pokémon list');
        const listData = await listRes.json();

        const details = await Promise.all(
          listData.results.map(p => fetchPokemonDetail(p.url, controller.signal))
        );

        setPokemon(details);
        setTotalCount(listData.count);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [page, searchQuery, selectedType, showFavorites, favorites, fetchPokemonDetail]);

  return {
    pokemon,
    loading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    itemsPerPage: ITEMS_PER_PAGE,
  };
}

