import { memo } from 'react';
import { TYPE_COLORS, getTypeColor } from '../utils/typeColors';
import styles from './TypeFilter.module.css';

const TYPES = Object.keys(TYPE_COLORS);

const TypeFilter = memo(function TypeFilter({ selectedType, onSelectType }) {
  return (
    <nav className={styles.container} aria-label="Filter by elemental type">
      <div className={styles.scrollWrap} role="toolbar">
        <button
          className={`${styles.typeBtn} ${!selectedType ? styles.active : ''}`}
          onClick={() => onSelectType(null)}
          aria-pressed={!selectedType}
          id="type-filter-all"
        >
          <span className={styles.typeIcon} aria-hidden="true">✦</span>
          ALL TYPES
        </button>

        {TYPES.map((type) => {
          const tc = getTypeColor(type);
          const isSelected = selectedType === type;

          return (
            <button
              key={type}
              className={`${styles.typeBtn} ${isSelected ? styles.active : ''}`}
              style={{
                '--type-color': tc.color,
                '--type-glow': tc.glow,
              }}
              onClick={() => onSelectType(isSelected ? null : type)}
              aria-pressed={isSelected}
              id={`type-filter-${type}`}
            >
              <span
                className={styles.typeDot}
                style={{ background: tc.color }}
                aria-hidden="true"
              />
              {type.toUpperCase()}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

export default TypeFilter;
