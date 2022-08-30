import { useCallback, useEffect } from 'react';
import { useWorkspaceContext } from './useWorkspaceProvider';
import { ipcRendererManager } from '../ipc';
import { IpcEvents } from '../../ipcEvents';

export { activityViews, activeViewToIndex } from './useWorkspaceProvider';

export function useWorkspace() {
  const {
    workspace,
    scriptVersionId,
    activityIndex,
    setActivityIndex,
    setScriptVersionId,
  } = useWorkspaceContext();

  const restart = () => {
    setScriptVersionId((id) => id + 1);
  };

  const enableWorkspace = (value) => {
    ipcRendererManager.invoke(IpcEvents.ENABLE_WORKSPACE, workspace.id, value);
  };

  return {
    workspace,
    scriptVersionId,
    activityIndex,
    restart,
    enableWorkspace,
    setActivityIndex,
  };
}
