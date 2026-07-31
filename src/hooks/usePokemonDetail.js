import { useState, useEffect } from 'react';

const BASE_URL = 'https://pokeapi.co/api/v2';
const speciesCache = new Map();

export function usePokemonDetail(pokemonId) {
  const [detail, setDetail] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonId) {
      setDetail(null);
      setSpecies(null);
      return;
    }

    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch pokemon detail
        const pokemonRes = await fetch(`${BASE_URL}/pokemon/${pokemonId}`, {
          signal: controller.signal,
        });
        if (!pokemonRes.ok) throw new Error('Failed to fetch Pokémon detail');
        const pokemonData = await pokemonRes.json();
        setDetail(pokemonData);

        // Fetch species data for flavor text
        const speciesKey = `species-${pokemonId}`;
        let speciesData;
        if (speciesCache.has(speciesKey)) {
          speciesData = speciesCache.get(speciesKey);
        } else {
          const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`, {
            signal: controller.signal,
          });
          if (speciesRes.ok) {
            speciesData = await speciesRes.json();
            speciesCache.set(speciesKey, speciesData);
          }
        }
        setSpecies(speciesData || null);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => controller.abort();
  }, [pokemonId]);

  // Extract English flavor text
  const flavorText = species?.flavor_text_entries
    ?.find(entry => entry.language.name === 'en')
    ?.flavor_text?.replace(/[\f\n\r]/g, ' ') || '';

  const genus = species?.genera
    ?.find(g => g.language.name === 'en')
    ?.genus || '';

  return {
    detail,
    species,
    flavorText,
    genus,
    loading,
    error,
  };
}
