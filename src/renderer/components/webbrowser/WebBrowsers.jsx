import { useState } from 'react';
import { ChromiumStyleTabs, Dark, Light } from './ChromiumStyleTabs';
import { WebBrowsersProvider, useWebBrowsers } from './useWebBrowsers';
import { useIpcRendererListener } from '../../ipc';
import { IpcEvents } from '../../../ipcEvents';

export default function WebBrowsers({ defaultURL, defaultTitle, jsCode }, ref) {
  const context = useWebBrowsers({
    defaultURL,
    defaultTitle,
    jsCode,
  });
  const tabs = [context.browserTabs, context.setBrowserTabs];
  const activeTab = [context.activeTabIndex, context.setActiveTabIndex];
  const pushNewTab = context.pushNewTab;
  const setDevTools = context.setDevTools;

  useIpcRendererListener(IpcEvents.NEW_BROWSER_TAB, () => {
    pushNewTab();
  });

  useIpcRendererListener(IpcEvents.TOGGLE_DEV_TOOLS, () => {
    setDevTools((value) => !value);
  });

  return (
    <WebBrowsersProvider value={context}>
      <ChromiumStyleTabs
        tabs={tabs}
        activeTab={activeTab}
        theme={Light}
        onAddTabPress={() => pushNewTab()}
      />
    </WebBrowsersProvider>
  );
}
