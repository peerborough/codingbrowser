import { useState } from 'react';
import { ChromiumStyleTabs, Dark, Light } from './ChromiumStyleTabs';
import { WebBrowsersProvider, useWebBrowsers } from './useWebBrowsers';

export default function ({ defaultURL, defaultTitle, jsCode, devTools }) {
  const context = useWebBrowsers({
    defaultURL,
    defaultTitle,
    jsCode,
    devTools,
  });
  const tabs = [context.browserTabs, context.setBrowserTabs];
  const activeTab = [context.activeTabIndex, context.setActiveTabIndex];
  const pushNewTab = context.pushNewTab;

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