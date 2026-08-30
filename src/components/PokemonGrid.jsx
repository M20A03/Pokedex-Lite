import PokemonCard from './PokemonCard';
import styles from './PokemonGrid.module.css';

export default function PokemonGrid({ pokemon, onSelectPokemon }) {
  if (!pokemon || pokemon.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.grid}
      aria-label="Pokémon Directory Grid"
      role="feed"
    >
      {pokemon.map((p, index) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          index={index}
          onClick={onSelectPokemon}
        />
      ))}
    </section>
  );
}
