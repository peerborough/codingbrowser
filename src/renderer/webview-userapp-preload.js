import { ipcRenderer } from 'electron';
import fs from 'fs';
import { Hook } from 'console-feed';
import { IpcEvents } from '../ipcEvents';
import * as mainAPI from '../api/main';

window._codingbrowser_console = { ...window.console };

Hook(
  window._codingbrowser_console,
  (log) => {
    ipcRenderer.sendToHost('console-message', log);
  },
  true
);

async function getCurrentWorkspace() {
  return await ipcRenderer.invoke(IpcEvents.GET_CURRENT_WORKSPACE);
}

getCurrentWorkspace().then((workspace) => {
  if (!workspace || !workspace.enabled) return null;

  const script = fs.readFileSync(workspace.mainPath, 'utf8');
  if (script) {
    mainAPI.workspace.setWorkspaceId(workspace.id);
    var F = new Function('console', 'codingbrowser', script);
    F(window._codingbrowser_console, {
      browser: mainAPI.browser,
    });
  }
});
