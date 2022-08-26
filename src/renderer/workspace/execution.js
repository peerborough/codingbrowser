import { ipcRendererManager } from '../ipc';
import { IpcEvents } from '../../ipcEvents';
import {
  start as startSlice,
  stop as stopSlice,
  setPreloadScript,
} from '../slices/workspaceSlice';
import store from '../store';

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

export async function start() {
  const rootPath = store.getState().workspace.rootPath;

  let preload = await ipcRendererManager.invoke(
    IpcEvents.LOAD_USER_FILE,
    `${rootPath}preload.js`
  );

  if (preload !== null) {
    preload = `${preload};${suffixScript}`;
  }

  store.dispatch(startSlice({ preload }));
}

export function stop() {
  store.dispatch(stopSlice());
}
