import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import { createMainWindow } from './windows';
import { IpcEvents } from '../ipcEvents';
import { ipcMainManager } from './ipc';
import { isDebug } from './util';
import { SetUpMenuOptions, MenuItemOptions } from '../interfaces';

/**
 * Is the passed object a constructor for an Electron Menu?
 *
 * @param {(Array<Electron.MenuItemConstructorOptions> | Electron.Menu)} [submenu]
 * @returns {submenu is Array<Electron.MenuItemConstructorOptions>}
 */
function isSubmenu(
  submenu?: Array<MenuItemConstructorOptions> | Menu
): submenu is Array<MenuItemConstructorOptions> {
  return !!submenu && Array.isArray(submenu);
}

/**
 * Returns additional items for the help menu
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getHelpItems(): Array<MenuItemConstructorOptions> {
  const items: MenuItemConstructorOptions[] = [];

  items.push(
    {
      type: 'separator',
    },
    {
      label: 'Report an Issue...',
      click() {
        shell.openExternal(
          'https://github.com/peerborough/codingbrowser/issues'
        );
      },
    },
    {
      label: 'Open CodingBrowser Repository...',
      click() {
        shell.openExternal('https://github.com/peerborough/codingbrowser');
      },
    }
  );

  // on macOS, there's already the About Electron Fiddle menu item
  // under the first submenu set by the electron-default-menu package
  if (process.platform !== 'darwin') {
    items.push(
      {
        type: 'separator',
      },
      {
        label: 'About CodingBrowser',
        click() {
          app.showAboutPanel();
        },
      }
    );
  }

  return items;
}

/**
 * Depending on the OS, the `Preferences` either go into the `Fiddle`
 * menu (macOS) or under `File` (Linux, Windows)
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getPreferencesItems(): Array<MenuItemConstructorOptions> {
  return [
    {
      type: 'separator',
    },
    {
      label: 'Preferences',
      accelerator: 'CmdOrCtrl+,',
      click() {
        ipcMainManager.send(IpcEvents.OPEN_SETTINGS);
      },
    },
    {
      type: 'separator',
    },
  ];
}

/**
 * Returns the Exit items
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getQuitItems(): Array<MenuItemConstructorOptions> {
  return [
    {
      type: 'separator',
    },
    {
      role: 'quit',
    },
  ];
}

/**
 * Returns the top-level "Debug" menu
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getDebugMenu(): MenuItemConstructorOptions {
  const debugMenu: Array<MenuItemConstructorOptions> = [
    {
      label: 'Reload',
      accelerator: 'Command+R',
      click: () => {
        const browserWindow = BrowserWindow.getFocusedWindow();
        if (browserWindow && !browserWindow.isDestroyed()) {
          browserWindow.webContents.reload();
        }
      },
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: 'Alt+Command+I',
      click: () => {
        const browserWindow = BrowserWindow.getFocusedWindow();
        if (browserWindow && !browserWindow.isDestroyed()) {
          browserWindow.webContents.toggleDevTools();
        }
      },
    },
  ];

  return {
    label: 'Debug',
    submenu: debugMenu,
  };
}

/**
 * Returns the top-level "File" menu
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getFileMenu(): MenuItemConstructorOptions {
  const fileMenu: Array<MenuItemConstructorOptions> = [
    {
      label: 'New Code',
      accelerator: 'CmdOrCtrl+N',
      enabled: false,
    },
    {
      label: 'New Browser Tab',
      click: () => {
        return ipcMainManager.send(IpcEvents.NEW_BROWSER_TAB);
      },
      accelerator: 'CmdOrCtrl+T',
    },
    {
      label: 'New Window',
      click: () => createMainWindow(),
      accelerator: 'CmdOrCtrl+Shift+N',
    },
  ];

  // macOS has these items in the "CodingBrowser" menu
  if (process.platform !== 'darwin') {
    fileMenu.splice(
      fileMenu.length,
      0,
      ...getPreferencesItems(),
      ...getQuitItems()
    );
  }

  return {
    label: 'File',
    submenu: fileMenu,
  };
}

/**
 * Creates the app's window menu.
 */
export function setupMenu(options?: SetUpMenuOptions) {
  const menuItemOptions = options?.menuItemOptions || null;

  // Get template for default menu
  const defaultMenu = require('electron-default-menu');
  const menu = (
    defaultMenu(app, shell) as Array<MenuItemConstructorOptions>
  ).map((item) => {
    const { label } = item;

    // Append the "Settings" item
    if (
      process.platform === 'darwin' &&
      label === app.name &&
      isSubmenu(item.submenu)
    ) {
      item.submenu.splice(2, 0, ...getPreferencesItems());
    }

    // Custom handler for "Select All" for Monaco
    if (label === 'Edit' && isSubmenu(item.submenu)) {
      const selectAll = item.submenu.find((i) => i.label === 'Select All')!;
      delete selectAll.role; // override default role
      selectAll.click = () => {
        ipcMainManager.send(IpcEvents.SELECT_ALL_IN_EDITOR);

        // Allow selection to occur in text fields outside the editors.
        if (process.platform === 'darwin') {
          Menu.sendActionToFirstResponder('selectAll:');
        }
      };
    }

    // Tweak "View" menu
    if (label === 'View' && isSubmenu(item.submenu)) {
      // remove "Reload" (has weird behaviour) and "Toggle Developer Tools"
      item.submenu = item.submenu.filter(
        (subItem) =>
          subItem.label !== 'Toggle Developer Tools' &&
          subItem.label !== 'Reload' &&
          subItem.label !== 'Toggle Full Screen'
      );

      item.submenu.push(
        {
          label: 'Reload This Page',
          accelerator: 'Command+R',
          click: () => {
            return ipcMainManager.send(IpcEvents.RELOAD_BROWSER_TAB);
          },
        },
        {
          label: 'Stop',
          accelerator: 'Command+.',
          click: () => {
            return ipcMainManager.send(IpcEvents.STOP_BROWSER_TAB);
          },
        }
      );
      item.submenu.push(
        { type: 'separator' },
        {
          label: 'Toggle Soft Wrap',
        },
        {
          label: 'Toggle Mini Map',
        }
      );

      item.submenu.push(
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' }
      ); // Add zooming actions

      item.submenu.push(
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            ipcMainManager.send(IpcEvents.TOGGLE_DEV_TOOLS);
          },
        }
      );
    }

    // Append items to "Help"
    if (label === 'Help' && isSubmenu(item.submenu)) {
      item.submenu = getHelpItems();
    }

    if (menuItemOptions) {
      if (isSubmenu(item.submenu)) {
        item.submenu = item.submenu.map((submenu) =>
          updateMenuItem(submenu, menuItemOptions)
        );
      }
    }

    return item;
  });

  menu.splice(process.platform === 'darwin' ? 1 : 0, 0, getFileMenu());

  if (isDebug()) {
    menu.splice(menu.length - 1, 0, getDebugMenu());
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

const updateMenuItem = (
  item: Electron.MenuItemConstructorOptions,
  options: MenuItemOptions[]
): Electron.MenuItemConstructorOptions => {
  const option = options.find((option) => option.label === item.label);
  if (option) {
    return {
      ...item,
      enabled: option.enabled !== undefined ? option.enabled : item.enabled,
    };
  } else {
    return item;
  }
};
