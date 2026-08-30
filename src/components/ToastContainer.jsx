import { useState, useEffect } from 'react';
import { toast } from '../lib/toast';
import styles from './ToastContainer.module.css';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    });

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.type] || styles.info}`}
          role="alert"
        >
          <div className={styles.iconWrap}>
            {t.type === 'error' && '✕'}
            {t.type === 'success' && '✓'}
            {t.type === 'warning' && '⚠'}
            {t.type === 'info' && 'ℹ'}
          </div>
          <div className={styles.content}>
            {t.title && <h4 className={styles.title}>{t.title}</h4>}
            <p className={styles.message}>{t.message}</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
