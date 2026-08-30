import { useEffect, useRef } from 'react';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useFavorites } from '../context/FavoritesContext';
import { getTypeColor } from '../utils/typeColors';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import Spinner from './Spinner';
import styles from './PokemonModal.module.css';

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
};

const MAX_STAT = 255;

function getStatColor(value) {
  if (value >= 150) return 'var(--color-brand-green, #00ff88)';
  if (value >= 100) return 'var(--color-brand-secondary, #00d4ff)';
  if (value >= 70) return 'var(--color-brand-accent, #ffd900)';
  if (value >= 40) return '#f08030';
  return 'var(--color-brand-primary, #ff3860)';
}

export default function PokemonModal({ pokemonId, onClose }) {
  const { detail, flavorText, genus, loading } = usePokemonDetail(pokemonId);
  const { isFavorite, toggleFavorite, isCaught, toggleCaught } = useFavorites();
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Global Escape key handler
  useKeyboardShortcut('Escape', () => {
    onClose();
  }, { ignoreInputs: false });

  // Body scroll lock & focus trap
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!pokemonId) return null;

  const primaryType = detail?.types?.[0]?.type?.name || 'normal';
  const typeColor = getTypeColor(primaryType);

  const spriteUrl =
    detail?.sprites?.other?.['official-artwork']?.front_default ||
    detail?.sprites?.other?.home?.front_default ||
    detail?.sprites?.other?.dream_world?.front_default ||
    detail?.sprites?.front_default;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      id="pokemon-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pokemon-name"
    >
      <div
        className={styles.modal}
        style={{
          '--modal-type-color': typeColor.color,
          '--modal-type-glow': typeColor.glow,
        }}
      >
        {/* Close Button with 44px Hit Target */}
        <button
          ref={closeBtnRef}
          className={styles.closeBtn}
          onClick={onClose}
          id="modal-close-btn"
          aria-label="Close modal dialog"
          title="Close (ESC)"
        >
          ✕
        </button>

        {loading || !detail ? (
          <div className={styles.loadingWrap}>
            <Spinner />
          </div>
        ) : (
          <div className={styles.content}>
            {/* LEFT / HERO PANEL */}
            <div className={styles.artworkPanel}>
              <div
                className={styles.artworkBg}
                style={{ background: typeColor.gradient }}
              >
                {spriteUrl && (
                  <img
                    src={spriteUrl}
                    alt={`${detail.name} official full artwork`}
                    className={styles.artwork}
                    width="260"
                    height="260"
                  />
                )}
              </div>

              <div className={styles.idBadge}>
                #{String(detail.id).padStart(3, '0')}
              </div>

              {/* Action Buttons */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${isFavorite(detail.id) ? styles.favActive : ''}`}
                  onClick={() => toggleFavorite(detail.id)}
                  aria-label={isFavorite(detail.id) ? 'Remove favorite' : 'Add favorite'}
                >
                  <span aria-hidden="true">{isFavorite(detail.id) ? '♥' : '♡'}</span>
                  <span>{isFavorite(detail.id) ? 'Favorited' : 'Favorite'}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${isCaught(detail.id) ? styles.caughtActive : ''}`}
                  onClick={() => toggleCaught(detail.id)}
                  aria-label={isCaught(detail.id) ? 'Release Pokémon' : 'Catch Pokémon'}
                >
                  <span aria-hidden="true">●</span>
                  <span>{isCaught(detail.id) ? 'Captured' : 'Catch'}</span>
                </button>
              </div>
            </div>

            {/* RIGHT / STATS & DATA PANEL */}
            <div className={styles.detailsPanel}>
              <h2 className={styles.pokeName} id="modal-pokemon-name">{detail.name}</h2>
              {genus && <span className={styles.genus}>{genus}</span>}

              {/* Elemental Type Badges */}
              <div className={styles.typeBadges} aria-label="Types">
                {detail.types?.map((t) => {
                  const tc = getTypeColor(t.type.name);
                  return (
                    <span
                      key={t.type.name}
                      className={styles.modalTypeBadge}
                      style={{
                        '--badge-color': tc.color,
                        '--badge-glow': tc.glow,
                      }}
                    >
                      {t.type.name}
                    </span>
                  );
                })}
              </div>

              {/* Flavor Text / Pokédex Entry */}
              {flavorText && (
                <div className={styles.flavorBox}>
                  <p className={styles.flavorText}>&ldquo;{flavorText}&rdquo;</p>
                </div>
              )}

              {/* Physical Metrics */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>HEIGHT</span>
                  <span className={styles.metricVal}>{(detail.height / 10).toFixed(1)} m</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>WEIGHT</span>
                  <span className={styles.metricVal}>{(detail.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>BASE EXP</span>
                  <span className={styles.metricVal}>{detail.base_experience || '—'}</span>
                </div>
              </div>

              {/* Base Combat Statistics */}
              <div className={styles.statsSection}>
                <h3 className={styles.statsTitle}>BASE COMBAT METRICS</h3>
                <div className={styles.statList}>
                  {detail.stats?.map((s) => {
                    const label = STAT_LABELS[s.stat.name] || s.stat.name.toUpperCase();
                    const value = s.base_stat;
                    const percent = Math.min(100, Math.round((value / MAX_STAT) * 100));
                    const barColor = getStatColor(value);

                    return (
                      <div key={s.stat.name} className={styles.statRow}>
                        <span className={styles.statLabel}>{label}</span>
                        <span className={styles.statValue}>{value}</span>
                        <div className={styles.statTrack}>
                          <div
                            className={styles.statFill}
                            style={{
                              width: `${percent}%`,
                              background: barColor,
                              boxShadow: `0 0 8px ${barColor}`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
