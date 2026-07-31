import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, searchQuery = '' }) {
  const [value, setValue] = useState(searchQuery);
  const timerRef = useRef(null);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSearch(newValue);
    }, 300);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputGroup}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className={styles.input}
          placeholder="Search Pokémon by name or ID..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          id="search-input"
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search"
            id="search-clear"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

