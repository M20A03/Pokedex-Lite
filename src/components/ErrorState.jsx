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
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: 'var(--neon-red)',
    textShadow: '0 0 20px rgba(255, 56, 96, 0.4), 0 0 40px rgba(255, 56, 96, 0.2)',
    animation: 'glitch 0.3s ease-in-out infinite alternate',
  },
  message: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    lineHeight: 1.6,
  },
  retryBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '10px 28px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 56, 96, 0.3)',
    background: 'rgba(255, 56, 96, 0.08)',
    color: 'var(--neon-red)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  },
  ghost: {
    fontSize: '3rem',
    opacity: 0.15,
    filter: 'blur(1px)',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    opacity: 0.2,
  },
};

export default function ErrorState({ message, onRetry, isEmpty = false }) {
  if (isEmpty) {
    return (
      <div style={errorStyles.wrapper} id="empty-state">
        <div style={errorStyles.emptyIcon}>🔍</div>
        <div style={errorStyles.code}>NO RESULTS</div>
        <p style={errorStyles.message}>
          {message || "We couldn't find any Pokémon matching your search. Try a different name or ID."}
        </p>
        {onRetry && (
          <button
            style={errorStyles.retryBtn}
            onClick={onRetry}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 56, 96, 0.15)';
              e.target.style.boxShadow = '0 0 16px rgba(255, 56, 96, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 56, 96, 0.08)';
              e.target.style.boxShadow = 'none';
            }}
            id="retry-button"
          >
            CLEAR SEARCH
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={errorStyles.wrapper} id="error-state">
      <div style={errorStyles.ghost}>👻</div>
      <div style={errorStyles.code}>ERROR 404</div>
      <p style={errorStyles.message}>
        {message || 'Something went wrong while fetching Pokémon data. The servers might be having a nap.'}
      </p>
      {onRetry && (
        <button
          style={errorStyles.retryBtn}
          onClick={onRetry}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 56, 96, 0.15)';
            e.target.style.boxShadow = '0 0 16px rgba(255, 56, 96, 0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 56, 96, 0.08)';
            e.target.style.boxShadow = 'none';
          }}
          id="retry-button"
        >
          RETRY
        </button>
      )}
    </div>
  );
}
