import { useState, useEffect, useRef } from 'react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useTheme } from './ThemeProvider';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import styles from './CommandPalette.module.css';

export default function CommandPalette({ isOpen, onClose, onSearch, onToggleFavorites }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { favoritesCount } = useFavorites();
  const { currentUser, logout } = useAuth();
  const inputRef = useRef(null);

  // Close on Escape
  useKeyboardShortcut('Escape', () => {
    if (isOpen) onClose();
  }, { ignoreInputs: false });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'all',
      title: 'View All Pokémon',
      category: 'Navigation',
      icon: '⬡',
      action: () => {
        onToggleFavorites(false);
        onSearch('');
        onClose();
      },
    },
    {
      id: 'favorites',
      title: `View Favorites (${favoritesCount})`,
      category: 'Navigation',
      icon: '♥',
      action: () => {
        onToggleFavorites(true);
        onClose();
      },
    },
    {
      id: 'theme',
      title: `Cycle Theme (Current: ${theme.toUpperCase()})`,
      category: 'Preferences',
      icon: '🎨',
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    ...(currentUser
      ? [
          {
            id: 'logout',
            title: `Sign Out (${currentUser.displayName || currentUser.email})`,
            category: 'Account',
            icon: '⏻',
            action: () => {
              logout();
              onClose();
            },
          },
        ]
      : []),
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % quickActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + quickActions.length) % quickActions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
        onClose();
      } else if (quickActions[selectedIndex]) {
        quickActions[selectedIndex].action();
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} id="command-palette-overlay">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <span className={styles.searchIcon}>⌘</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Type a command or search Pokémon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Command Palette Search"
          />
          <kbd className={styles.escBadge} onClick={onClose}>ESC</kbd>
        </div>

        <div className={styles.actionList}>
          {query.trim() ? (
            <div
              className={`${styles.actionItem} ${styles.active}`}
              onClick={() => {
                onSearch(query.trim());
                onClose();
              }}
            >
              <span className={styles.actionIcon}>🔍</span>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Search Pokédex for &quot;{query}&quot;</span>
                <span className={styles.actionCategory}>Query</span>
              </div>
              <span className={styles.enterKey}>↵ Enter</span>
            </div>
          ) : (
            quickActions.map((action, index) => (
              <div
                key={action.id}
                className={`${styles.actionItem} ${selectedIndex === index ? styles.active : ''}`}
                onClick={action.action}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className={styles.actionIcon}>{action.icon}</span>
                <div className={styles.actionContent}>
                  <span className={styles.actionTitle}>{action.title}</span>
                  <span className={styles.actionCategory}>{action.category}</span>
                </div>
                {selectedIndex === index && <span className={styles.enterKey}>↵</span>}
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span>Use <strong>↑</strong> <strong>↓</strong> to navigate</span>
          <span><strong>↵</strong> to select</span>
          <span><strong>ESC</strong> to close</span>
        </div>
      </div>
    </div>
  );
}
