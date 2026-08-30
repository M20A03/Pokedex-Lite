const errorStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '60px 24px',
    textAlign: 'center',
    animation: 'fadeIn 0.4s ease',
  },
  code: {
    fontFamily: 'var(--font-display, sans-serif)',
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: 'var(--color-brand-primary, #ff3860)',
    textShadow: '0 0 20px rgba(255, 56, 96, 0.4)',
  },
  message: {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
    fontWeight: 500,
    color: 'var(--text-secondary, rgba(255, 255, 255, 0.8))',
    maxWidth: '440px',
    lineHeight: 1.6,
  },
  retryBtn: {
    fontFamily: 'var(--font-display, sans-serif)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '12px 28px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 56, 96, 0.4)',
    background: 'rgba(255, 56, 96, 0.12)',
    color: 'var(--color-brand-primary, #ff3860)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
    minHeight: '44px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    fontSize: '3rem',
    opacity: 0.3,
  },
  emptyIcon: {
    fontSize: '2.5rem',
    opacity: 0.3,
  },
};

export default function ErrorState({ message, onRetry, isEmpty = false }) {
  if (isEmpty) {
    return (
      <div style={errorStyles.wrapper} id="empty-state" role="status">
        <div style={errorStyles.emptyIcon} aria-hidden="true">🔍</div>
        <div style={errorStyles.code}>NO RESULTS</div>
        <p style={errorStyles.message}>
          {message || "We couldn't find any Pokémon matching your search. Try adjusting your query or filters."}
        </p>
        {onRetry && (
          <button
            style={errorStyles.retryBtn}
            onClick={onRetry}
            id="retry-button"
            type="button"
          >
            RESET SEARCH / FILTERS
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={errorStyles.wrapper} id="error-state" role="alert">
      <div style={errorStyles.ghost} aria-hidden="true">⚠️</div>
      <div style={errorStyles.code}>GATEWAY ANOMALY</div>
      <p style={errorStyles.message}>
        {message || 'Unable to establish link with Pokémon database servers.'}
      </p>
      {onRetry && (
        <button
          style={errorStyles.retryBtn}
          onClick={onRetry}
          id="retry-button"
          type="button"
        >
          RETRY CONNECTION
        </button>
      )}
    </div>
  );
}
