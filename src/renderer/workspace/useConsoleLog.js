import { useWorkspaceContext } from './useWorkspaceProvider';

export default function () {
  const { consoleLogs, addConsoleLog } = useWorkspaceContext();
  return { consoleLogs, addConsoleLog };
}
