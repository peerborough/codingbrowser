export enum IpcEvents {
  TOGGLE_DEV_TOOLS = 'TOGGLE_DEV_TOOLS',
  RELOAD_WINDOW = 'RELOAD_WINDOW',
  WEBCONTENTS_READY_FOR_IPC_SIGNAL = 'WEBCONTENTS_READY_FOR_IPC_SIGNAL',
}

export const ipcMainEvents = [IpcEvents.RELOAD_WINDOW];

export const ipcRendererEvents = [IpcEvents.TOGGLE_DEV_TOOLS];
