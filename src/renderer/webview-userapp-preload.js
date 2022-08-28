import { ipcRenderer } from 'electron';
import { Hook } from 'console-feed';
import * as mainAPI from '../api/main';

window._codingbrowser_console = { ...window.console };

Hook(
  window._codingbrowser_console,
  (log) => {
    ipcRenderer.sendToHost('console-message', log);
  },
  true
);

ipcRenderer.on('execute-script', (event, script) => {
  var F = new Function('console', 'codingbrowser', script);
  F(window._codingbrowser_console, mainAPI);
});

ipcRenderer.sendToHost('preload-ready');
