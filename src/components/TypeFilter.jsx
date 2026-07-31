import { allTypes, getTypeColor } from '../utils/typeColors';
import styles from './TypeFilter.module.css';

export default function TypeFilter({ selectedType, onSelectType }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <button
          className={`${styles.pill} ${!selectedType ? styles.active : ''}`}
          onClick={() => onSelectType(null)}
          id="type-filter-all"
          style={!selectedType ? {
            '--pill-color': 'var(--neon-red)',
            '--pill-glow': 'rgba(255, 56, 96, 0.4)',
          } : undefined}
        >
          ALL
        </button>
        {allTypes.map(type => {
          const typeColor = getTypeColor(type);
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              className={`${styles.pill} ${isActive ? styles.active : ''}`}
              onClick={() => onSelectType(isActive ? null : type)}
              id={`type-filter-${type}`}
              style={{
                '--pill-color': typeColor.color,
                '--pill-glow': typeColor.glow,
              }}
            >
              {type.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
