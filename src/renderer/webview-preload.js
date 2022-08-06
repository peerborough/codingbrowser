import { ipcRenderer } from 'electron';

//console.info('Starts preloading...', process);

ipcRenderer.on('execute-script', (event, script) => {
  var F = new Function(script);
  F();
});

ipcRenderer.sendToHost('preload-ready');
