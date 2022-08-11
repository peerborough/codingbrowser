import { ipcRenderer } from 'electron';

//console.info('Starts preloading...', process);

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
  var F = new Function(script);
  F();
});

ipcRenderer.sendToHost('preload-ready');
