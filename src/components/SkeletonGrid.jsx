import styles from './SkeletonGrid.module.css';

export default function SkeletonGrid({ count = 20 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading Pokémon data">
      {items.map((i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonId} />
          <div className={styles.skeletonSprite} />
          <div className={styles.skeletonName} />
          <div className={styles.skeletonTypes}>
            <div className={styles.skeletonBadge} />
            <div className={styles.skeletonBadge} />
          </div>
        </div>
      ))}
    </div>
  );
}
