import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'path';
import { IpcEvents } from '../ipcEvents';

contextBridge.exposeInMainWorld('_codingbrowser', {
  getWebviewPreloadPath: () => {
    return path.join(__dirname, 'wvpreload.js');
  },
  getWebviewUserAppPreloadPath: () => {
    return path.join(__dirname, 'uapreload.js');
  },

  ipcRenderer: {
    send(channel: IpcEvents, ...args: Array<any>) {
      ipcRenderer.send(channel, ...args);
    },
    invoke(channel: IpcEvents, ...args: Array<any>) {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeAllListeners(channel: IpcEvents) {
      ipcRenderer.send(channel);
    },
    on(channel: IpcEvents, func: (...args: Array<any>) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: Array<any>) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: IpcEvents, func: (...args: Array<any>) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
