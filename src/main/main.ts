/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import { app } from 'electron';
//import { autoUpdater } from 'electron-updater';
//import log from 'electron-log';
import Store from 'electron-store';
import { IpcEvents } from '../ipcEvents';
import { ipcMainManager } from './ipc';
import { setupDevTools } from './devtools';
import { getOrCreateMainWindow } from './windows';
import { saveMemoryFile, loadMemoryFile } from './memoryfile';

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let argv: string[] = [];
const store = new Store();

async function onReady() {
  //  await onFirstRunMaybe();
  getOrCreateMainWindow();
  //  setupAboutPanel();
  const { setupMenu } = await import('./menu');
  //  const { setupFileListeners } = await import('./files');
  setupMenu();
  setupMenuHandler();
  setupStoreHandler();
  setupUserFileHandler();
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

function setupStoreHandler() {
  ipcMainManager.handle(IpcEvents.GET_STORE_VALUE, async (_, key) => {
    const value = store.get(key);
    return value;
  });
  ipcMainManager.handle(IpcEvents.SET_STORE_VALUE, async (_, key, value) => {
    store.set(key, value);
  });
}

function setupUserFileHandler() {
  ipcMainManager.handle(IpcEvents.LOAD_USER_FILE, async (_, filepath) => {
    if (filepath.startsWith('memory://')) {
      return loadMemoryFile(filepath);
    } else {
      console.error('Not impmemented protocol');
    }
  });
  ipcMainManager.handle(
    IpcEvents.SAVE_USER_FILE,
    async (_, filepath, value) => {
      if (filepath.startsWith('memory://')) {
        return saveMemoryFile(filepath, value);
      } else {
        console.error('Not impmemented protocol');
      }
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
