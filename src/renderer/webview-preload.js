import { ipcRenderer } from 'electron';
import { Hook } from 'console-feed';
import * as preloadAPI from '../api/preload';

//console.info('Starts preloading...', process);
window._codingbrowser_console = { ...window.console };

Hook(
  window._codingbrowser_console,
  (log) => {
    ipcRenderer.sendToHost('console-message', log);
  },
  true
);

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('click', (e) => {
    const anchor = e.srcElement.closest('a');
    if (!anchor) return;

    const ctrlKeyPressed = e.ctrlKey || e.metaKey;
    if (ctrlKeyPressed || anchor.getAttribute('target') == '_blank') {
      const href = anchor.href;
      ipcRenderer.sendToHost('add-tab', { url: href });
      e.preventDefault();
    }
  });
});

ipcRenderer.on('execute-script', (event, script) => {
  var F = new Function('console', 'codingbrowser', script);
  F(window._codingbrowser_console, preloadAPI);
});

ipcRenderer.sendToHost('preload-ready');
