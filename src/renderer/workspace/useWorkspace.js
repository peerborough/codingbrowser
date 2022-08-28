import { useCallback } from 'react';
import { useWorkspaceContext } from './useWorkspaceProvider';

export function useWorkspace() {
  const {
    rootPath,
    mainScript,
    preloadScript,
    execution,
    startWorkspace,
    stopWorkspace,
  } = useWorkspaceContext();

  const startAll = useCallback(async () => {
    const main = await getMainScript(rootPath);
    const preload = await getPreloadScript(rootPath);
    startWorkspace(main, preload);
  }, [rootPath]);

  const stopAll = async () => {
    stopWorkspace();
  };

  const getMainScript = async (rootPath) => {
    let main = await ipcRendererManager.invoke(
      IpcEvents.LOAD_USER_FILE,
      `${rootPath}main.js`
    );

    return main;
  };

  const getPreloadScript = async (rootPath) => {
    let preload = await ipcRendererManager.invoke(
      IpcEvents.LOAD_USER_FILE,
      `${rootPath}preload.js`
    );

    if (preload !== null) {
      preload = `${preload};${suffixScript}`;
    }

    return preload;
  };

  return {
    mainScript,
    preloadScript,
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
