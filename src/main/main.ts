/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import { app, ipcMain } from 'electron';
//import { autoUpdater } from 'electron-updater';
//import log from 'electron-log';
import { IpcEvents } from '../ipcEvents';
import { ipcMainManager } from './ipc';
import { setupDevTools } from './devtools';
import { getOrCreateMainWindow } from './windows';
import {
  initializeWorkspace,
  newWorkspace,
  getCurrentWorkspace,
  enableWorkspace,
  setWorkspaceValue,
} from './workspace';
import { loadTextFile, saveTextFile } from './util';

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let argv: string[] = [];

async function onReady() {
  //  await onFirstRunMaybe();
  getOrCreateMainWindow();
  //  setupAboutPanel();
  const { setupMenu } = await import('./menu');
  //  const { setupFileListeners } = await import('./files');
  setupMenu();
  setupMenuHandler();
  setupWorkspaceHandler();
  //  setupProtocolHandler();
  //  setupFileListeners();
  // eslint-disable-next-line
  //new AppUpdater();
  //  setupDialogs();
  setupDevTools();
  //  setupTitleBarClickMac();

  //  processCommandLine(argv);
}

function onBeforeQuit() {
  // ipcMainManager.send(IpcEvents.BEFORE_QUIT);
  // ipcMainManager.on(IpcEvents.CONFIRM_QUIT, app.quit);
}

function setupMenuHandler() {
  ipcMainManager.on(
    IpcEvents.SET_MENU_ITEM_OPTIONS,
    async (_, menuItemOptions) => {
      (await import('./menu')).setupMenu({ menuItemOptions });
    }
  );
}

function setupWorkspaceHandler() {
  initializeWorkspace();

  ipcMainManager.handle(IpcEvents.LOAD_TEXT_FILE, async (_, filePath) => {
    return loadTextFile(filePath);
  });
  ipcMainManager.handle(
    IpcEvents.SAVE_TEXT_FILE,
    async (_, filePath, value) => {
      saveTextFile(filePath, value);
    }
  );

  ipcMainManager.handle(IpcEvents.NEW_WORKSPACE, async (_) => {
    newWorkspace();
  });

  ipcMainManager.handle(IpcEvents.GET_CURRENT_WORKSPACE, async (_) => {
    return getCurrentWorkspace();
  });

  ipcMainManager.handle(
    IpcEvents.ENABLE_WORKSPACE,
    async (_, workspaceId, value) => {
      return enableWorkspace(workspaceId, value);
    }
  );

  ipcMainManager.handle(
    IpcEvents.SET_WORKSPACE_VALUE,
    async (_, workspaceId, key, value) => {
      return setWorkspaceValue(workspaceId, key, value);
    }
  );
}

/**
 * All windows have been closed, quit on anything but
 * macOS.
 */
function onWindowsAllClosed() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

export function main(argv_in: string[]) {
  argv = argv_in;

  // Handle creating/removing shortcuts on Windows when
  // installing/uninstalling.
  // if (shouldQuit()) {
  //   app.quit();
  //   return;
  // }

  // Set the app's name
  app.name = 'CodingBrowser';

  // Ensure that there's only ever one Fiddle running
  //  listenForProtocolHandler();

  // Launch
  app.whenReady().then(onReady);
  app.on('before-quit', onBeforeQuit);
  app.on('window-all-closed', onWindowsAllClosed);
  app.on('activate', () => {
    app.whenReady().then(getOrCreateMainWindow);
  });
}

// only call main() if this is the main module
if (typeof module !== 'undefined' && require.main === module) {
  main(process.argv);
}
