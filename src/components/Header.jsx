import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';
import styles from './Header.module.css';

export default function Header({ showFavorites, onToggleFavorites, onOpenAuth, onOpenCommandPalette }) {
  const { favoritesCount, caughtCount } = useFavorites();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <div
          className={styles.logo}
          onClick={() => onToggleFavorites(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onToggleFavorites(false)}
          aria-label="Pokédex Lite Home"
        >
          <span className={styles.logoIcon} aria-hidden="true">◈</span>
          <h1 className={styles.logoText}>
            POKÉ<span className={styles.logoHighlight}>DEX</span> LITE
          </h1>
        </div>

        {/* Global Action Toolbar */}
        <nav className={styles.nav} aria-label="Main Navigation">
          {/* Quick Command / Search Trigger */}
          <button
            className={styles.searchTriggerBtn}
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Cmd/Ctrl + K)"
            aria-label="Open Command Palette"
          >
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <span className={styles.searchTriggerText}>Search...</span>
            <kbd className={styles.kbdShortcut}>⌘K</kbd>
          </button>

          {/* All Pokémon View Tab */}
          <button
            className={`${styles.navBtn} ${!showFavorites ? styles.active : ''}`}
            onClick={() => onToggleFavorites(false)}
            id="nav-all"
            aria-current={!showFavorites ? 'page' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">⬡</span>
            <span className={styles.btnLabel}>ALL</span>
          </button>

          {/* Favorites Tab */}
          <button
            className={`${styles.navBtn} ${showFavorites ? styles.active : ''}`}
            onClick={() => onToggleFavorites(true)}
            id="nav-favorites"
            aria-current={showFavorites ? 'page' : undefined}
          >
            <span className={styles.heartIcon} aria-hidden="true">♥</span>
            <span className={styles.btnLabel}>FAVS</span>
            {favoritesCount > 0 && (
              <span className={styles.badge} aria-label={`${favoritesCount} favorites`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Caught Pokeball Stats */}
          <div className={styles.statsGroup} aria-label={`${caughtCount} Pokémon caught`}>
            <span className={styles.statChip} title="Pokémon caught">
              <span className={styles.pokeball} aria-hidden="true">●</span>
              <span>{caughtCount}</span>
            </span>
          </div>

          {/* Theme Switcher */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={`Switch theme (Current: ${theme})`}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚡'}
          </button>

          {/* User Profile / Auth Action */}
          {currentUser ? (
            <div className={styles.userGroup}>
              <button
                className={styles.logoutBtn}
                onClick={logout}
                title={`Sign out (${currentUser.displayName || currentUser.email})`}
                aria-label="Sign out"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    className={styles.avatarImg}
                    width="24"
                    height="24"
                  />
                ) : (
                  <span className={styles.userAvatarFallback}>👤</span>
                )}
                <span className={styles.logoutIcon} aria-hidden="true">⏻</span>
              </button>
            </div>
          ) : (
            <button
              className={styles.googleLoginBtn}
              onClick={onOpenAuth}
              title="Sign in with Google"
              aria-label="Sign in with Google"
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className={styles.loginText}>Login</span>
            </button>
          )}
        </nav>
      </div>

      {/* Decorative scanline sweep */}
      <div className={styles.scanline} aria-hidden="true" />
    </header>
  );
}
