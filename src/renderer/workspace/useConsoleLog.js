import { useWorkspaceContext } from './useWorkspace';

export default function () {
  const { consoleLogs, addConsoleLog } = useWorkspaceContext();
  return { consoleLogs, addConsoleLog };
}
