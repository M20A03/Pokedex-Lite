import { useState, useEffect } from 'react';
import { fetchWithRetry } from '../lib/fetcher';

const BASE_URL = 'https://pokeapi.co/api/v2';

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
        const pokemonData = await fetchWithRetry(`${BASE_URL}/pokemon/${pokemonId}`, {
          signal: controller.signal,
          cacheKey: `pokemon_modal_detail_${pokemonId}`,
        });
        setDetail(pokemonData);

        // Fetch species data for flavor text
        try {
          const speciesData = await fetchWithRetry(
            `${BASE_URL}/pokemon-species/${pokemonId}`,
            {
              signal: controller.signal,
              cacheKey: `pokemon_species_${pokemonId}`,
              silentError: true,
            }
          );
          setSpecies(speciesData || null);
        } catch {
          // Species failure is non-fatal
          setSpecies(null);
        }

        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load Pokémon specifications.');
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => controller.abort();
  }, [pokemonId]);

  // Extract English flavor text
  const flavorText =
    species?.flavor_text_entries
      ?.find((entry) => entry.language.name === 'en')
      ?.flavor_text?.replace(/[\f\n\r]/g, ' ') || '';

  const genus =
    species?.genera?.find((g) => g.language.name === 'en')?.genus || '';

  return {
    detail,
    species,
    flavorText,
    genus,
    loading,
    error,
  };
}

export default usePokemonDetail;
