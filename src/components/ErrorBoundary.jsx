import React from 'react';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('CRITICAL: React Error Boundary caught an unhandled exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container} role="alert">
          <div className={styles.panel}>
            <div className={styles.glitchIcon}>⚠️</div>
            <h2 className={styles.title}>SYSTEM MALFUNCTION DETECTED</h2>
            <p className={styles.subtitle}>
              A runtime anomaly was isolated by the SRE boundary to protect session integrity.
            </p>

            <div className={styles.errorBox}>
              <code>{this.state.error?.message || 'Unknown runtime exception'}</code>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={this.handleReload}
                id="error-boundary-reload"
              >
                ↻ Reboot System
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={this.handleReset}
                id="error-boundary-reset"
              >
                ⌧ Clear Storage & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
