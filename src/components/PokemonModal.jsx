import { useEffect, useRef } from 'react';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useFavorites } from '../context/FavoritesContext';
import { getTypeColor } from '../utils/typeColors';
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
  if (value >= 150) return '#00ff88';
  if (value >= 100) return '#00d4ff';
  if (value >= 70) return '#ffd900';
  if (value >= 40) return '#f08030';
  return '#ff3860';
}

export default function PokemonModal({ pokemonId, onClose }) {
  const { detail, flavorText, genus, loading } = usePokemonDetail(pokemonId);
  const { isFavorite, toggleFavorite, isCaught, toggleCaught } = useFavorites();
  const overlayRef = useRef(null);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
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
    >
      <div
        className={styles.modal}
        style={{ '--modal-type-color': typeColor.color, '--modal-type-glow': typeColor.glow }}
      >
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} id="modal-close" aria-label="Close">
          ✕
        </button>

        {loading || !detail ? (
          <div className={styles.loadingWrap}>
            <Spinner />
          </div>
        ) : (
          <div className={styles.content}>
            {/* LEFT PANEL — Artwork */}
            <div className={styles.artworkPanel}>
              <div className={styles.artworkBg} style={{ background: typeColor.gradient }}>
                {spriteUrl && (
                  <img
                    src={spriteUrl}
                    alt={detail.name}
                    className={styles.artwork}
                  />
                )}
              </div>

              <div className={styles.idBadge}>
                #{String(detail.id).padStart(3, '0')}
              </div>

              <div className={styles.modalActions}>
                <button
                  className={`${styles.actionBtn} ${isFavorite(detail.id) ? styles.favActive : ''}`}
                  onClick={() => toggleFavorite(detail.id)}
                >
                  {isFavorite(detail.id) ? '♥' : '♡'} {isFavorite(detail.id) ? 'Favorited' : 'Favorite'}
                </button>
                <button
                  className={`${styles.actionBtn} ${isCaught(detail.id) ? styles.caughtActive : ''}`}
                  onClick={() => toggleCaught(detail.id)}
                >
                  ● {isCaught(detail.id) ? 'Caught' : 'Catch'}
                </button>
              </div>
            </div>

            {/* RIGHT PANEL — Details */}
            <div className={styles.detailsPanel}>
              <h2 className={styles.pokeName}>{detail.name}</h2>
              {genus && <span className={styles.genus}>{genus}</span>}

              {/* Type badges */}
              <div className={styles.typeBadges}>
                {detail.types.map(t => {
                  const tc = getTypeColor(t.type.name);
                  return (
                    <span
                      key={t.type.name}
                      className={styles.typeBadge}
                      style={{ '--badge-color': tc.color, '--badge-glow': tc.glow }}
                    >
                      {t.type.name}
                    </span>
                  );
                })}
              </div>

              {/* Physical stats */}
              <div className={styles.physicalStats}>
                <div className={styles.physStat}>
                  <span className={styles.physLabel}>Height</span>
                  <span className={styles.physValue}>{(detail.height / 10).toFixed(1)} m</span>
                </div>
                <div className={styles.physDivider} />
                <div className={styles.physStat}>
                  <span className={styles.physLabel}>Weight</span>
                  <span className={styles.physValue}>{(detail.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className={styles.physDivider} />
                <div className={styles.physStat}>
                  <span className={styles.physLabel}>Base XP</span>
                  <span className={styles.physValue}>{detail.base_experience || '—'}</span>
                </div>
              </div>

              {/* Flavor text */}
              {flavorText && (
                <p className={styles.flavorText}>&quot;{flavorText}&quot;</p>
              )}

              {/* Base Stats */}
              <div className={styles.statsSection}>
                <h4 className={styles.sectionTitle}>BASE STATS</h4>
                <div className={styles.statsGrid}>
                  {detail.stats.map(stat => {
                    const percentage = Math.min((stat.base_stat / MAX_STAT) * 100, 100);
                    const statColor = getStatColor(stat.base_stat);
                    const label = STAT_LABELS[stat.stat.name] || stat.stat.name.toUpperCase();
                    return (
                      <div key={stat.stat.name} className={styles.statRow}>
                        <span className={styles.statLabel}>{label}</span>
                        <div className={styles.statBarTrack}>
                          <div
                            className={styles.statBarFill}
                            style={{
                              '--fill-width': `${percentage}%`,
                              '--stat-color': statColor,
                            }}
                          />
                        </div>
                        <span className={styles.statValue}>{stat.base_stat}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.totalStat}>
                  <span className={styles.statLabel}>TOTAL</span>
                  <span className={styles.statValue}>
                    {detail.stats.reduce((sum, s) => sum + s.base_stat, 0)}
                  </span>
                </div>
              </div>

              {/* Abilities */}
              <div className={styles.abilitiesSection}>
                <h4 className={styles.sectionTitle}>ABILITIES</h4>
                <div className={styles.abilitiesList}>
                  {detail.abilities.map(a => (
                    <span
                      key={a.ability.name}
                      className={`${styles.abilityChip} ${a.is_hidden ? styles.hiddenAbility : ''}`}
                    >
                      {a.ability.name.replace('-', ' ')}
                      {a.is_hidden && <span className={styles.hiddenTag}>Hidden</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
