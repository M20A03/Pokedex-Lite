import { memo } from 'react';
import { getTypeColor } from '../utils/typeColors';
import { useFavorites } from '../context/FavoritesContext';
import styles from './PokemonCard.module.css';

const PokemonCard = memo(function PokemonCard({ pokemon, index, onClick }) {
  const { isFavorite, toggleFavorite, isCaught, toggleCaught } = useFavorites();
  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const typeColor = getTypeColor(primaryType);
  const isFav = isFavorite(pokemon.id);
  const caught = isCaught(pokemon.id);

  const spriteUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default;

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const handleCatch = (e) => {
    e.stopPropagation();
    toggleCaught(pokemon.id);
  };

  return (
    <article
      className={styles.card}
      style={{
        '--type-color': typeColor.color,
        '--type-glow': typeColor.glow,
        '--delay': `${Math.min(index, 20) * 40}ms`,
        background: typeColor.gradient,
      }}
      onClick={() => onClick(pokemon.id)}
      id={`pokemon-card-${pokemon.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(pokemon.id)}
      aria-label={`View details for ${pokemon.name}, Pokémon number ${pokemon.id}`}
    >
      {/* Caught Overlay Badge */}
      {caught && (
        <div className={styles.caughtOverlay} title="Pokémon Captured" aria-label="Captured">
          <span className={styles.caughtBall} aria-hidden="true">●</span>
        </div>
      )}

      {/* Action Buttons with 44px Touch Targets */}
      <div className={styles.actions}>
        <button
          className={`${styles.catchBtn} ${caught ? styles.caught : ''}`}
          onClick={handleCatch}
          title={caught ? 'Release Pokémon' : 'Capture Pokémon'}
          aria-label={caught ? `Release ${pokemon.name}` : `Catch ${pokemon.name}`}
          type="button"
        >
          <span className={styles.actionIcon} aria-hidden="true">●</span>
        </button>
        <button
          className={`${styles.favBtn} ${isFav ? styles.favorited : ''}`}
          onClick={handleFavorite}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
          type="button"
        >
          <span className={styles.actionIcon} aria-hidden="true">{isFav ? '♥' : '♡'}</span>
        </button>
      </div>

      {/* Pokemon Numerical Index */}
      <span className={styles.pokeId}>
        #{String(pokemon.id).padStart(3, '0')}
      </span>

      {/* Artwork Sprite with explicit width/height to eliminate CLS */}
      <div className={styles.spriteWrap}>
        <img
          src={spriteUrl}
          alt={`${pokemon.name} official artwork`}
          className={styles.sprite}
          loading="lazy"
          width="120"
          height="120"
        />
      </div>

      {/* Name */}
      <h3 className={styles.name}>{pokemon.name}</h3>

      {/* Elemental Type Badges */}
      <div className={styles.types} aria-label="Elemental types">
        {pokemon.types?.map((t) => {
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
    </article>
  );
});

export default PokemonCard;
