import { app, BrowserWindow, shell } from 'electron';
//import { IpcEvents } from '../ipcEvents';
import { createContextMenu } from './contextMenu';
//import { ipcMainManager } from './ipc';
import { resolveHtmlPath } from './util';
import * as path from 'path';

// Keep a global reference of the window objects, if we don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let browserWindows: Array<BrowserWindow | null> = [];

/**
 * Gets default options for the main window
 *
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  // const HEADER_COMMANDS_HEIGHT = 50;
  // const MACOS_TRAFFIC_LIGHTS_HEIGHT = 16;

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  return {
    width: 1400,
    height: 900,
    minHeight: 600,
    minWidth: 600,
    // titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
    // titleBarOverlay: process.platform === 'darwin',
    // trafficLightPosition: {
    //   x: 20,
    //   y: HEADER_COMMANDS_HEIGHT / 2 - MACOS_TRAFFIC_LIGHTS_HEIGHT / 2,
    // },
    acceptFirstMouse: true,
    // backgroundColor: '#1d2427',
    show: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webviewTag: true,
      nodeIntegrationInSubFrames: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  };
}

/**
 * Creates a new main window.
 *
 * @export
 * @returns {Electron.BrowserWindow}
 */
export function createMainWindow(): Electron.BrowserWindow {
  console.log(`Creating main window`);
  let browserWindow: BrowserWindow | null;
  browserWindow = new BrowserWindow(getMainWindowOptions());
  browserWindow.loadURL(resolveHtmlPath('index.html'));

  browserWindow.on('ready-to-show', () => {
    if (!browserWindow) {
      throw new Error('"browserWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      browserWindow.minimize();
    } else {
      browserWindow.show();
    }

    createContextMenu(browserWindow);
  });

  browserWindow.on('closed', () => {
    browserWindows = browserWindows.filter((bw) => browserWindow !== bw);

    browserWindow = null;
  });

  // Open urls in the user's browser
  browserWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  browserWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // ipcMainManager.handle(IpcEvents.GET_APP_PATHS, () => {
  //   const paths = {};
  //   const pathsToQuery = [
  //     'home',
  //     'appData',
  //     'userData',
  //     'temp',
  //     'downloads',
  //     'desktop',
  //   ];
  //   for (const path of pathsToQuery) {
  //     paths[path] = app.getPath(path as any);
  //   }
  //   return paths;
  // });

  browserWindows.push(browserWindow);

  return browserWindow;
}

/**
 * Gets or creates the main window, returning it in both cases.
 *
 * @returns {Electron.BrowserWindow}
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  return (
    BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow()
  );
}
