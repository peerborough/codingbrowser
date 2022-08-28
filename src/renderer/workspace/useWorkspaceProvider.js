import { useState } from 'react';
import { createContext } from '../hooks/context';

export const [WorkspaceProvider, useWorkspaceContext] = createContext({
  name: 'WorkspaceContext',
});

export function useWorkspaceProvider() {
  const [rootPath, setRootPath] = useState('memory://');
  const [preloadScript, setPreloadScript] = useState(null);
  const [mainScript, setMainScript] = useState(null);
  const [execution, setExecution] = useState('stop'); // 'stop', 'start'
  const [consoleLogs, setConsoleLogs] = useState([]);

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
    startWorkspace,
    stopWorkspace,
    addConsoleLog,
  };
}
