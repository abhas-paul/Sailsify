'use client';  // Ensure this is a client-side component

import { useEffect } from 'react';

export default function DisableRightClick() {
  useEffect(() => {
    // Disable right-click (context menu)
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, and other dev tool related shortcuts
    const disableDevToolsShortcuts = (e) => {
      // Disable F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+I or Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+J or Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
      }
      // Disable Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    // Attach event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevToolsShortcuts);

    // Clean up listeners on component unmount
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevToolsShortcuts);
    };
  }, []); // Empty dependency array means this will run only once when the component is mounted

  return null; // No UI rendered, it's purely for functionality
}
