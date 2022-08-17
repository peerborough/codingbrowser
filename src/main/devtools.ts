import { isDebug, isProduction } from './util';

/**
 * Installs developer tools if we're in dev mode.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function setupDevTools(): Promise<void> {
  if (isProduction()) {
    const sourceMapSupport = require('source-map-support');
    if (sourceMapSupport) {
      sourceMapSupport.install();
    }
  }

  if (isDebug()) {
    require('electron-debug')();
    await installExtensions();
  }
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};
