import { ipcRenderer } from 'electron';
import fs from 'fs';
import { Hook } from 'console-feed';
import { IpcEvents } from '../ipcEvents';
import * as preloadAPI from '../api/preload';

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

async function getCurrentWorkspace() {
  return await ipcRenderer.invoke(IpcEvents.GET_CURRENT_WORKSPACE);
}

getCurrentWorkspace().then((workspace) => {
  if (!workspace || !workspace.enabled) return;

  const script = fs.readFileSync(workspace.preloadPath, 'utf8');
  if (script) {
    var F = new Function(
      'console',
      'codingbrowser',
      `${script};${suffixScript}`
    );
    F(window._codingbrowser_console, preloadAPI);
  }
});

const suffixScript = `
if (document.readyState === "complete" 
   || document.readyState === "loaded" 
   || document.readyState === "interactive") {
  if (onReady) onReady({url: window.location.href});
}
else {
  window.addEventListener('DOMContentLoaded', (event) => {
    if (onReady) onReady({url: window.location.href});
  });  
}
`;
