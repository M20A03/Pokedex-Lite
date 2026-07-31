import PokemonCard from './PokemonCard';
import styles from './PokemonGrid.module.css';

export default function PokemonGrid({ pokemon, onSelectPokemon }) {
  if (pokemon.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {pokemon.map((p, index) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          index={index}
          onClick={onSelectPokemon}
        />
      ))}
    </div>
  );
}
