import { useState } from 'react';
import { createContext } from '../hooks/context';

export const [WorkspaceProvider, useWorkspaceContext] = createContext({
  name: 'WorkspaceContext',
});

export const activityItems = ['home', 'play', 'files'];
export const activeItemToIndex = (name) => activityItems.indexOf(name);

export function useWorkspaceProvider() {
  const [rootPath, setRootPath] = useState('memory://');
  const [preloadScript, setPreloadScript] = useState(null);
  const [mainScript, setMainScript] = useState(null);
  const [execution, setExecution] = useState('stop'); // 'stop', 'start'
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activityIndex, setActivityIndex] = useState(
    activeItemToIndex('files')
  );

  const startWorkspace = (main, preload) => {
    setMainScript(main);
    setPreloadScript(preload);
    setExecution('start');
  };

  const stopWorkspace = () => {
    setMainScript(null);
    setPreloadScript(null);
    setExecution('stop');
  };

  const addConsoleLog = (log) => {
    setConsoleLogs((logs) => [...logs, log]);
  };

  return {
    rootPath,
    mainScript,
    preloadScript,
    execution,
    consoleLogs,
    activityIndex,
    startWorkspace,
    stopWorkspace,
    addConsoleLog,
    setActivityIndex,
  };
}
