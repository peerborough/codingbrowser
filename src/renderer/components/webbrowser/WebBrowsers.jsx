import { useState } from 'react';
import { ChromiumStyleTabs, Dark, Light } from './ChromiumStyleTabs';
import { WebBrowsersProvider, useWebBrowsers } from './useWebBrowsers';
import { useIpcRendererListener } from '../../ipc';
import { IpcEvents } from '../../../ipcEvents';

export default function WebBrowsers(
  { defaultURL, defaultTitle, jsCode, devTools },
  ref
) {
  const context = useWebBrowsers({
    defaultURL,
    defaultTitle,
    jsCode,
    devTools,
  });
  const tabs = [context.browserTabs, context.setBrowserTabs];
  const activeTab = [context.activeTabIndex, context.setActiveTabIndex];
  const pushNewTab = context.pushNewTab;

  useIpcRendererListener(IpcEvents.NEW_BROWSER_TAB, (_event) => {
    pushNewTab();
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
