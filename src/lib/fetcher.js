// ========================================================
// POKÉDEX LITE — Resilient HTTP Fetcher & Network Layer
// SRE-grade: Retries with Exponential Backoff, SWR Caching & Timeouts
// ========================================================

import { toast } from './toast';

const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;
const CACHE_PREFIX = 'pokedex_api_cache_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours for Pokemon static data

// In-memory memory cache
const memoryCache = new Map();

/**
 * Sleep helper with promise
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with random jitter
 */
function getBackoffDelay(attempt) {
  const baseDelay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
  const jitter = Math.random() * 200;
  return baseDelay + jitter;
}

/**
 * Cache helpers for offline resilience
 */
function getCachedData(key) {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (Date.now() - record.timestamp < CACHE_TTL_MS) {
      memoryCache.set(key, record.data);
      return record.data;
    }
  } catch {
    // Ignore localStorage failures
  }
  return null;
}

function setCachedData(key, data) {
  memoryCache.set(key, data);
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // LocalStorage full or private browsing quota
  }
}

/**
 * Fetch wrapper with timeout, exponential backoff retries, and offline cache
 */
export async function fetchWithRetry(url, options = {}) {
  const {
    timeout = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES,
    useCache = true,
    cacheKey = url,
    signal: userSignal,
    silentError = false,
    ...fetchOptions
  } = options;

  // Check cache first
  if (useCache) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Check if parent signal is already aborted
    if (userSignal?.aborted) {
      const abortErr = new Error('Request aborted');
      abortErr.name = 'AbortError';
      throw abortErr;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // Link userSignal to controller if provided
    const onUserAbort = () => controller.abort();
    if (userSignal) {
      userSignal.addEventListener('abort', onUserAbort);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (userSignal) {
        userSignal.removeEventListener('abort', onUserAbort);
      }

      // Handle HTTP status codes
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.body = errorText;

        // Specific HTTP status handling
        if (response.status === 401) {
          if (!silentError) toast.error('Session expired. Please sign in again.', 'Authentication');
          throw error;
        } else if (response.status === 403) {
          if (!silentError) toast.warning('Access denied to requested resource.', 'Forbidden');
          throw error;
        } else if (response.status >= 500 && attempt === retries) {
          if (!silentError) toast.error(`Server error encountered (${response.status}). Retrying failed.`, 'API Gateway');
          throw error;
        }

        // Retry on 429 (Rate Limit) or 5xx (Server error)
        if ((response.status === 429 || response.status >= 500) && attempt < retries) {
          const delay = getBackoffDelay(attempt);
          await sleep(delay);
          continue;
        }

        throw error;
      }

      const data = await response.json();

      if (useCache) {
        setCachedData(cacheKey, data);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (userSignal) {
        userSignal.removeEventListener('abort', onUserAbort);
      }

      if (err.name === 'AbortError') {
        if (userSignal?.aborted) {
          throw err;
        }
        // Timeout triggered
        lastError = new Error(`Request timed out after ${timeout}ms: ${url}`);
      } else {
        lastError = err;
      }

      // If offline or network error, attempt cache fallback even if expired
      if (!navigator.onLine) {
        try {
          const raw = localStorage.getItem(CACHE_PREFIX + cacheKey);
          if (raw) {
            const record = JSON.parse(raw);
            if (!silentError) toast.info('Displaying cached offline data.', 'Offline Mode');
            return record.data;
          }
        } catch {
          // Ignore
        }
      }

      if (attempt < retries) {
        const delay = getBackoffDelay(attempt);
        await sleep(delay);
      }
    }
  }

  // All retries failed
  if (!silentError && lastError && lastError.name !== 'AbortError') {
    toast.error(lastError.message || 'Network communication failure', 'Network Error');
  }

  throw lastError;
}

export default fetchWithRetry;
