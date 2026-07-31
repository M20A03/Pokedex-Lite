import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles.wrapper} id="loading-spinner">
      <div className={styles.pokeball}>
        <div className={styles.pokeballTop} />
        <div className={styles.pokeballCenter}>
          <div className={styles.pokeballButton} />
        </div>
        <div className={styles.pokeballBottom} />
      </div>
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <span className={styles.text}>LOADING</span>
    </div>
  );
}
