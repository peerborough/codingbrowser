import { useState, useCallback } from 'react';
import { createContext } from '../hooks/context';
import { ipcRendererManager } from '../ipc';
import { IpcEvents } from '../../ipcEvents';

export const [WorkspaceProvider, useWorkspaceContext] = createContext({
  name: 'WorkspaceContext',
});

export function useWorkspaceProvider() {
  const [rootPath, setRootPath] = useState('memory://');
  const [preload, setPreload] = useState(null);
  const [execution, setExecution] = useState('stop'); // 'stop', 'start'

  const startWorkspace = (preload) => {
    setExecution('start');
    setPreload(preload);
  };

  const stopWorkspace = () => {
    setExecution('stop');
    setPreload(null);
  };

  return {
    rootPath,
    preload,
    execution,
    startWorkspace,
    stopWorkspace,
    setPreload,
  };
}

export function useWorkspace() {
  const { rootPath, preload, execution, startWorkspace, stopWorkspace } =
    useWorkspaceContext();

  const startAll = useCallback(async () => {
    await startMain(rootPath);
    await startPreload(rootPath);
  }, [rootPath]);

  const stopAll = async () => {
    stopWorkspace();
  };

  const startMain = async (rootPath) => {
    console.log('startMain');
    let main = await ipcRendererManager.invoke(
      IpcEvents.LOAD_USER_FILE,
      `${rootPath}main.js`
    );
  };

  const startPreload = async (rootPath) => {
    let preload = await ipcRendererManager.invoke(
      IpcEvents.LOAD_USER_FILE,
      `${rootPath}preload.js`
    );

    if (preload !== null) {
      preload = `${preload};${suffixScript}`;
    }
    startWorkspace(preload);
  };

  return {
    preload,
    execution,
    startAll,
    stopAll,
  };
}

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
