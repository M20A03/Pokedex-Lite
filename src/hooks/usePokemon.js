import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchWithRetry } from '../lib/fetcher';

const BASE_URL = 'https://pokeapi.co/api/v2';
const ITEMS_PER_PAGE = 20;

let masterListCache = null;

async function getMasterList(signal) {
  if (masterListCache) return masterListCache;
  const data = await fetchWithRetry(`${BASE_URL}/pokemon?limit=1500`, {
    signal,
    cacheKey: 'master_pokemon_directory',
  });
  masterListCache = data.results.map((item) => {
    const parts = item.url.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return { ...item, id: String(id) };
  });
  return masterListCache;
}

export function usePokemon({
  page = 1,
  searchQuery = '',
  selectedType = null,
  showFavorites = false,
  favorites = [],
}) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const abortRef = useRef(null);

  const fetchPokemonDetail = useCallback(async (url, signal) => {
    return fetchWithRetry(url, { signal, cacheKey: `detail_${url}` });
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
        // ── FAVORITES VIEW ─────────────────────────────────
        if (showFavorites) {
          if (!favorites || favorites.length === 0) {
            setPokemon([]);
            setTotalCount(0);
            setLoading(false);
            return;
          }
          const details = await Promise.all(
            favorites.map((id) =>
              fetchPokemonDetail(`${BASE_URL}/pokemon/${id}`, controller.signal)
            )
          );
          setPokemon(details.sort((a, b) => a.id - b.id));
          setTotalCount(details.length);
          setLoading(false);
          return;
        }

        // ── SEARCH MODE ────────────────────────────────────
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const masterList = await getMasterList(controller.signal);

          const matches = masterList.filter(
            (p) => p.name.toLowerCase().includes(query) || p.id === query
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
            pageSlice.map((p) => fetchPokemonDetail(p.url, controller.signal))
          );

          setPokemon(details);
          setTotalCount(matches.length);
          setLoading(false);
          return;
        }

        // ── TYPE FILTER MODE ───────────────────────────────
        if (selectedType) {
          const typeData = await fetchWithRetry(`${BASE_URL}/type/${selectedType}`, {
            signal: controller.signal,
            cacheKey: `type_filter_${selectedType}`,
          });

          const allPokemonOfType = typeData.pokemon.map((p) => p.pokemon);
          const totalOfType = allPokemonOfType.length;
          const offset = (page - 1) * ITEMS_PER_PAGE;
          const pageSlice = allPokemonOfType.slice(offset, offset + ITEMS_PER_PAGE);

          const details = await Promise.all(
            pageSlice.map((p) => fetchPokemonDetail(p.url, controller.signal))
          );

          setPokemon(details);
          setTotalCount(totalOfType);
          setLoading(false);
          return;
        }

        // ── DEFAULT PAGINATED LIST ─────────────────────────
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const listData = await fetchWithRetry(
          `${BASE_URL}/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
          { signal: controller.signal, cacheKey: `list_p${page}_o${offset}` }
        );

        const details = await Promise.all(
          listData.results.map((p) => fetchPokemonDetail(p.url, controller.signal))
        );

        setPokemon(details);
        setTotalCount(listData.count);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to retrieve Pokémon data.');
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

export default usePokemon;
