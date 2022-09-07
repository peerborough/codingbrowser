import { ipcRenderer } from 'electron';
import { IpcEvents } from '../../ipcEvents';
import { getWorkspaceId } from './workspace';

export function initialize({ browserScriptPath }) {
  if (!getWorkspaceId()) return;

  ipcRenderer.invoke(
    IpcEvents.SET_WORKSPACE_VALUE,
    getWorkspaceId(),
    'injectPath',
    browserScriptPath
  );
}
