import path from 'path';
import { ipcRenderer } from 'electron';
import { IpcEvents } from '../../ipcEvents';
import { getWorkspaceId, getProjectPath } from './workspace';

export function initialize({ browserScriptPath }) {
  if (!getWorkspaceId() || !getProjectPath() || !browserScriptPath) return;

  const fullPath = path.join(getProjectPath(), browserScriptPath);

  ipcRenderer.invoke(
    IpcEvents.SET_WORKSPACE_VALUE,
    getWorkspaceId(),
    'browserScriptPath',
    fullPath
  );
}
