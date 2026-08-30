import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, searchQuery = '', onOpenCommandPalette }) {
  const [value, setValue] = useState(searchQuery);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <div className={styles.inputWrap}>
        <span className={styles.searchIcon} aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search Pokémon by name or National Dex # (e.g. Pikachu, 25)..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Instant real-time filtering if cleared
            if (!e.target.value.trim() && searchQuery) {
              onSearch('');
            }
          }}
          inputMode="search"
          enterKeyHint="search"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Search Pokémon database"
          id="pokedex-search-input"
        />

        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search input"
            title="Clear search"
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          aria-label="Submit search"
        >
          <span>SEARCH</span>
        </button>

        {onOpenCommandPalette && (
          <button
            type="button"
            className={styles.cmdBadge}
            onClick={onOpenCommandPalette}
            title="Open Command Palette"
            aria-label="Open Command Palette"
          >
            ⌘K
          </button>
        )}
      </div>
    </form>
  );
}
