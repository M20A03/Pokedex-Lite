import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'pokedex-favorites';
const CAUGHT_KEY = 'pokedex-caught';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [caught, setCaught] = useState(() => {
    try {
      const stored = localStorage.getItem(CAUGHT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(CAUGHT_KEY, JSON.stringify(caught));
  }, [caught]);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback((id) => {
    return favorites.includes(id);
  }, [favorites]);

  const toggleCaught = useCallback((id) => {
    setCaught(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  }, []);

  const isCaught = useCallback((id) => {
    return caught.includes(id);
  }, [caught]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoritesCount: favorites.length,
      toggleFavorite,
      isFavorite,
      caught,
      caughtCount: caught.length,
      toggleCaught,
      isCaught,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

export default FavoritesContext;
