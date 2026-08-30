import { useEffect, useCallback } from 'react';

/**
 * Global Keyboard Shortcut Hook (Phase 3.6 & 6)
 * Supports Cmd+K / Ctrl+K, Escape, Slash, and custom handlers.
 */
export function useKeyboardShortcut(keyCombo, callback, options = {}) {
  const {
    metaKey = false,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    ignoreInputs = true,
    preventDefault = true,
  } = options;

  const handleKeyDown = useCallback(
    (event) => {
      // Check if focus is on form inputs
      if (ignoreInputs) {
        const target = event.target;
        const isInputField =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable;

        // Allow Escape even when inside input
        if (isInputField && event.key !== 'Escape') {
          return;
        }
      }

      // Support "CmdOrCtrl" shorthand
      const isCmdOrCtrlRequested = metaKey || ctrlKey;
      const hasCmdOrCtrl = event.metaKey || event.ctrlKey;
      const cmdOrCtrlMatch = isCmdOrCtrlRequested ? hasCmdOrCtrl : true;

      const altMatch = altKey ? event.altKey : !event.altKey;
      const shiftMatch = shiftKey ? event.shiftKey : !event.shiftKey;

      if (
        event.key.toLowerCase() === keyCombo.toLowerCase() &&
        cmdOrCtrlMatch &&
        altMatch &&
        shiftMatch
      ) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [keyCombo, callback, metaKey, ctrlKey, altKey, shiftKey, ignoreInputs, preventDefault]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcut;
