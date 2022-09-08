import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import { Hook } from 'console-feed';
import { IpcEvents } from '../ipcEvents';
import * as mainAPI from '../api/main';

const sourceFileName = 'webview-userapp-preload.js';

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

async function getCurrentWorkspace() {
  return await ipcRenderer.invoke(IpcEvents.GET_CURRENT_WORKSPACE);
}

getCurrentWorkspace()
  .then((workspace) => {
    if (!workspace || !workspace.enabled) return null;

    const script = fs.readFileSync(workspace.mainScriptPath, 'utf8');
    if (script) {
      try {
        mainAPI.workspace.setWorkspaceId(workspace.id);
        mainAPI.workspace.setProjectPath(workspace.projectPath);

        var F = new Function('console', 'codingbrowser', script);
        F(window._codingbrowser_console, {
          browser: mainAPI.browser,
        });
      } catch (error) {
        const filename = path.basename(workspace.mainScriptPath);
        window._codingbrowser_console.error(filename, error);
      }
    }
  })
  .catch((error) => {
    window._codingbrowser_console.error(sourceFileName, error);
  });
