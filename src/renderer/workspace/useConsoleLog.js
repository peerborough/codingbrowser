import { useWorkspaceContext } from './useWorkspace';

export default function () {
  const { consoleLogs, addConsoleLog, clearAllConsoleLog } =
    useWorkspaceContext();
  return { consoleLogs, addConsoleLog, clearAllConsoleLog };
}
