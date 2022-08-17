import { useState, useImperativeHandle, forwardRef } from 'react';
import { ChromiumStyleTabs, Dark, Light } from './ChromiumStyleTabs';
import { WebBrowsersProvider, useWebBrowsers } from './useWebBrowsers';

function WebBrowsers({ defaultURL, defaultTitle, jsCode, devTools }, ref) {
  const context = useWebBrowsers({
    defaultURL,
    defaultTitle,
    jsCode,
    devTools,
  });
  const tabs = [context.browserTabs, context.setBrowserTabs];
  const activeTab = [context.activeTabIndex, context.setActiveTabIndex];
  const pushNewTab = context.pushNewTab;

  useImperativeHandle(ref, () => ({
    pushNewTab: () => {
      pushNewTab();
    },
  }));

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

export default forwardRef(WebBrowsers);
