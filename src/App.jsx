import { useState, useEffect, useCallback } from 'react';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { usePokemon } from './hooks/usePokemon';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { parseUrlState, syncUrlState } from './router/guards';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import Pagination from './components/Pagination';
import SkeletonGrid from './components/SkeletonGrid';
import ErrorState from './components/ErrorState';
import Sparkles from './components/Sparkles';
import AuthPage from './components/AuthPage';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import CommandPalette from './components/CommandPalette';

function AppContent() {
  // Initialize state from URL Query Parameters
  const initialParams = parseUrlState();
  const [page, setPage] = useState(initialParams.page);
  const [searchQuery, setSearchQuery] = useState(initialParams.search);
  const [selectedType, setSelectedType] = useState(initialParams.type);
  const [selectedPokemon, setSelectedPokemon] = useState(initialParams.modal);
  const [showFavorites, setShowFavorites] = useState(initialParams.tab === 'favorites');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const { favorites } = useFavorites();
  const { currentUser } = useAuth();

  const { pokemon, loading, error, totalCount, totalPages, itemsPerPage } = usePokemon({
    page,
    searchQuery,
    selectedType,
    showFavorites,
    favorites,
  });

  // Sync state to URL Query Parameters
  useEffect(() => {
    syncUrlState({
      page,
      search: searchQuery,
      type: selectedType,
      modal: selectedPokemon,
      tab: showFavorites ? 'favorites' : 'all',
    });
  }, [page, searchQuery, selectedType, selectedPokemon, showFavorites]);

  // Handle Browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const state = parseUrlState();
      setPage(state.page);
      setSearchQuery(state.search);
      setSelectedType(state.type);
      setSelectedPokemon(state.modal);
      setShowFavorites(state.tab === 'favorites');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K opens Command Palette
  useKeyboardShortcut('k', () => {
    setShowCommandPalette((prev) => !prev);
  }, { metaKey: true, ctrlKey: true, ignoreInputs: false });

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
        aria-hidden="true"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <Sparkles />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        <Header
          showFavorites={showFavorites}
          onToggleFavorites={handleToggleFavorites}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '24px', paddingBottom: '48px' }}>
          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
          />

          {/* Type Filter — hidden in favorites or active search */}
          {!showFavorites && !searchQuery && (
            <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
          )}

          {/* Content Area with SRE Zero-CLS Skeleton Loading */}
          {loading ? (
            <SkeletonGrid count={itemsPerPage} />
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
                  ? "You haven't registered any favorites yet. Browse the Pokédex and tap the ♥ badge to save your team!"
                  : "No Pokémon matched your current search parameters."
              }
              onRetry={showFavorites ? () => handleToggleFavorites(false) : handleClearSearch}
              isEmpty
            />
          ) : (
            <>
              <PokemonGrid pokemon={pokemon} onSelectPokemon={setSelectedPokemon} />

              {/* Pagination — active in standard paginated directory mode */}
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

        {/* Detail Modal (Parallel Intercepted Route via URL) */}
        {selectedPokemon && (
          <PokemonModal
            pokemonId={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}

        {/* Auth Modal */}
        {showAuthModal && !currentUser && (
          <AuthPage onClose={() => setShowAuthModal(false)} />
        )}

        {/* Global Command Palette */}
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onSelectPokemon={(id) => {
            setSelectedPokemon(id);
            setShowCommandPalette(false);
          }}
          onSearch={handleSearch}
          onToggleFavorites={handleToggleFavorites}
        />

        {/* Toast Notification Container */}
        <ToastContainer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
