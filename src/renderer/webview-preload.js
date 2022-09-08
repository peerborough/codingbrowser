import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import { Hook } from 'console-feed';
import { IpcEvents } from '../ipcEvents';
import * as browserAPI from '../api/browser';

const sourceFileName = 'webview-preload.js';

window._codingbrowser_console = { ...window.console };

Hook(
  window._codingbrowser_console,
  (log) => {
    ipcRenderer.sendToHost('console-message', log);
  },
  true
);

window.addEventListener('error', (error) => {
  window._codingbrowser_console.error(sourceFileName, error);
});

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

getCurrentWorkspace()
  .then((workspace) => {
    if (!workspace || !workspace.enabled) return;

    const script = fs.readFileSync(workspace.browserScriptPath, 'utf8');
    if (script) {
      try {
        var F = new Function(
          'console',
          'codingbrowser',
          `${script};${suffixScript}`
        );
        F(window._codingbrowser_console, browserAPI);
      } catch (error) {
        const filename = path.basename(workspace.browserScriptPath);
        window._codingbrowser_console.error(filename, error);
      }
    }
  })
  .catch((error) => {
    window._codingbrowser_console.error(sourceFileName, error);
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
