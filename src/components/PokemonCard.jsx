import { memo } from 'react';
import { getTypeColor } from '../utils/typeColors';
import { useFavorites } from '../context/FavoritesContext';
import styles from './PokemonCard.module.css';

const PokemonCard = memo(function PokemonCard({ pokemon, index, onClick }) {
  const { isFavorite, toggleFavorite, isCaught, toggleCaught } = useFavorites();
  const primaryType = pokemon.types[0]?.type?.name || 'normal';
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
        '--delay': `${index * 60}ms`,
        background: typeColor.gradient,
      }}
      onClick={() => onClick(pokemon.id)}
      id={`pokemon-card-${pokemon.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(pokemon.id)}
    >
      {/* Caught overlay */}
      {caught && (
        <div className={styles.caughtOverlay} title="Caught!">
          <span className={styles.caughtBall}>●</span>
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          className={`${styles.catchBtn} ${caught ? styles.caught : ''}`}
          onClick={handleCatch}
          title={caught ? 'Release' : 'Catch!'}
          aria-label={caught ? 'Release' : 'Catch'}
        >
          ●
        </button>
        <button
          className={`${styles.favBtn} ${isFav ? styles.favorited : ''}`}
          onClick={handleFavorite}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      {/* Pokemon ID */}
      <span className={styles.pokeId}>
        #{String(pokemon.id).padStart(3, '0')}
      </span>

      {/* Sprite */}
      <div className={styles.spriteWrap}>
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className={styles.sprite}
          loading="lazy"
        />
      </div>

      {/* Name */}
      <h3 className={styles.name}>{pokemon.name}</h3>

      {/* Type badges */}
      <div className={styles.types}>
        {pokemon.types.map(t => {
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
