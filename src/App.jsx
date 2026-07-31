import { useState, useCallback } from 'react';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { usePokemon } from './hooks/usePokemon';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import Pagination from './components/Pagination';
import Spinner from './components/Spinner';
import ErrorState from './components/ErrorState';
import Sparkles from './components/Sparkles';
import AuthPage from './components/AuthPage';

function AppContent() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { favorites } = useFavorites();
  const { currentUser } = useAuth();

  const { pokemon, loading, error, totalCount, totalPages, itemsPerPage } = usePokemon({
    page,
    searchQuery,
    selectedType,
    showFavorites,
    favorites,
  });

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPage(1);
    setSelectedType(null);
    setShowFavorites(false);
  }, []);

  const handleSelectType = useCallback((type) => {
    setSelectedType(type);
    setPage(1);
    setSearchQuery('');
    setShowFavorites(false);
  }, []);

  const handleToggleFavorites = useCallback((show) => {
    setShowFavorites(show);
    setPage(1);
    setSearchQuery('');
    setSelectedType(null);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setPage(1);
    setSelectedType(null);
    setShowFavorites(false);
  }, []);

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <Sparkles />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        <Header
          showFavorites={showFavorites}
          onToggleFavorites={handleToggleFavorites}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '24px', paddingBottom: '48px' }}>
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />

          {/* Type Filter — hidden in favorites or search mode */}
          {!showFavorites && !searchQuery && (
            <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
          )}

          {/* Content Area */}
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={handleClearSearch}
              isEmpty={error.includes('No Pokémon found')}
            />
          ) : pokemon.length === 0 ? (
            <ErrorState
              message={
                showFavorites
                  ? "You haven't added any favorites yet. Browse the Pokédex and tap the ♥ to save your favorites!"
                  : "No Pokémon found. Try adjusting your search or filters."
              }
              onRetry={showFavorites ? () => handleToggleFavorites(false) : handleClearSearch}
              isEmpty
            />
          ) : (
            <>
              <PokemonGrid pokemon={pokemon} onSelectPokemon={setSelectedPokemon} />

              {/* Pagination — not shown in search/favorites mode */}
              {!searchQuery && !showFavorites && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>

        {/* Detail Modal */}
        {selectedPokemon && (
          <PokemonModal
            pokemonId={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}

        {/* Optional Auth Modal */}
        {showAuthModal && !currentUser && (
          <AuthPage onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}
