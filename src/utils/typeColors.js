// Type → color mapping for neon glow effects, badge backgrounds, and stat bars
// Each type has a primary color, a glow shadow value, and a gradient background

export const TYPE_COLORS = {
  normal: {
    color: '#a8a878',
    glow: 'rgba(168, 168, 120, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(168,168,120,0.15) 0%, rgba(168,168,120,0.05) 100%)',
  },
  fire: {
    color: '#f08030',
    glow: 'rgba(240, 128, 48, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(240,128,48,0.15) 0%, rgba(240,128,48,0.05) 100%)',
  },
  water: {
    color: '#6890f0',
    glow: 'rgba(104, 144, 240, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(104,144,240,0.15) 0%, rgba(104,144,240,0.05) 100%)',
  },
  electric: {
    color: '#ffd900',
    glow: 'rgba(255, 217, 0, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(255,217,0,0.15) 0%, rgba(255,217,0,0.05) 100%)',
  },
  grass: {
    color: '#78c850',
    glow: 'rgba(120, 200, 80, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(120,200,80,0.15) 0%, rgba(120,200,80,0.05) 100%)',
  },
  ice: {
    color: '#98d8d8',
    glow: 'rgba(152, 216, 216, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(152,216,216,0.15) 0%, rgba(152,216,216,0.05) 100%)',
  },
  fighting: {
    color: '#c03028',
    glow: 'rgba(192, 48, 40, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(192,48,40,0.15) 0%, rgba(192,48,40,0.05) 100%)',
  },
  poison: {
    color: '#b24bff',
    glow: 'rgba(178, 75, 255, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(178,75,255,0.15) 0%, rgba(178,75,255,0.05) 100%)',
  },
  ground: {
    color: '#e0c068',
    glow: 'rgba(224, 192, 104, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(224,192,104,0.15) 0%, rgba(224,192,104,0.05) 100%)',
  },
  flying: {
    color: '#a890f0',
    glow: 'rgba(168, 144, 240, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(168,144,240,0.15) 0%, rgba(168,144,240,0.05) 100%)',
  },
  psychic: {
    color: '#f85888',
    glow: 'rgba(248, 88, 136, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(248,88,136,0.15) 0%, rgba(248,88,136,0.05) 100%)',
  },
  bug: {
    color: '#a8b820',
    glow: 'rgba(168, 184, 32, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(168,184,32,0.15) 0%, rgba(168,184,32,0.05) 100%)',
  },
  rock: {
    color: '#b8a038',
    glow: 'rgba(184, 160, 56, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(184,160,56,0.15) 0%, rgba(184,160,56,0.05) 100%)',
  },
  ghost: {
    color: '#705898',
    glow: 'rgba(112, 88, 152, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(112,88,152,0.15) 0%, rgba(112,88,152,0.05) 100%)',
  },
  dragon: {
    color: '#7038f8',
    glow: 'rgba(112, 56, 248, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(112,56,248,0.15) 0%, rgba(112,56,248,0.05) 100%)',
  },
  dark: {
    color: '#705848',
    glow: 'rgba(112, 88, 72, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(112,88,72,0.15) 0%, rgba(112,88,72,0.05) 100%)',
  },
  steel: {
    color: '#b8b8d0',
    glow: 'rgba(184, 184, 208, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(184,184,208,0.15) 0%, rgba(184,184,208,0.05) 100%)',
  },
  fairy: {
    color: '#ee99ac',
    glow: 'rgba(238, 153, 172, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(238,153,172,0.15) 0%, rgba(238,153,172,0.05) 100%)',
  },
};

export const typeColors = TYPE_COLORS;

export const getTypeColor = (type) => {
  return TYPE_COLORS[type?.toLowerCase()] || TYPE_COLORS.normal;
};

export const allTypes = Object.keys(TYPE_COLORS);

export default TYPE_COLORS;
