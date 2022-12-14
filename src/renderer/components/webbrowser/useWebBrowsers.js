import { useEffect, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import WebBrowser from './WebBrowser';
import { createContext } from '../../hooks/context';

function makeId() {
  return nanoid();
}

export const [WebBrowsersProvider, useWebBrowsersContext] = createContext({
  name: 'WebBrowsersContext',
});

export function useWebBrowsers({ defaultURL, defaultTitle }) {
  const [browserTabs, setBrowserTabs] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [devTools, setDevTools] = useState(false);

  useEffect(() => {
    pushNewTab();
  }, []);

  const createBrowserTab = (url) => {
    const tabId = makeId();

    return {
      id: tabId,
      title: defaultTitle,
      defaultURL: url || defaultURL,
      url: url || defaultURL,
      loading: false,
      canGoBack: false,
      canGoForward: false,
      attached: false,
      content: (props) => <WebBrowser tabId={tabId} />,
    };
  };

  const insertNewTab = useCallback(
    (url) => {
      setBrowserTabs((tabs) => {
        tabs.splice(activeTabIndex + 1, 0, createBrowserTab(url));
        setActiveTabIndex(activeTabIndex + 1);
        return [...tabs];
      });
    },
    [activeTabIndex]
  );

  const updateTab = (
    tabId,
    { title, url, loading, canGoBack, canGoForward, attached }
  ) => {
    setBrowserTabs((tabs) => {
      return tabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              title: getValue(title, tab.title),
              url: getValue(url, tab.url),
              loading: getValue(loading, tab.loading),
              canGoBack: getValue(canGoBack, tab.canGoBack),
              canGoForward: getValue(canGoForward, tab.canGoForward),
              attached: getValue(attached, tab.attached),
            }
          : tab
      );
    });
  };

  const pushNewTab = (url) => {
    setBrowserTabs((tabs) => {
      setActiveTabIndex(tabs.length);
      return [...tabs, createBrowserTab(url)];
    });
  };

  return {
    browserTabs,
    activeTabIndex,
    defaultURL,
    defaultTitle,
    devTools,
    insertNewTab,
    pushNewTab,
    updateTab,
    setBrowserTabs,
    setActiveTabIndex,
    setDevTools,
  };
}

export function useAddressBar({ tabId }) {
  const { browserTabs } = useWebBrowsersContext();

  const browserTab = browserTabs.find((tab) => tab.id === tabId);
  return {
    title: getValue(browserTab?.title, ''),
    url: getValue(browserTab?.url, ''),
    loading: getValue(browserTab?.loading, false),
    canGoBack: getValue(browserTab?.canGoBack, false),
    canGoForward: getValue(browserTab?.canGoForward, false),
  };
}

export function useWebBrowser({ tabId }) {
  const { browserTabs, activeTabIndex, devTools, insertNewTab } =
    useWebBrowsersContext();
  const isActiveTab = browserTabs[activeTabIndex]?.id === tabId;
  const browserTab = browserTabs.find((tab) => tab.id === tabId);
  return {
    isActiveTab,
    loading: getValue(browserTab?.loading, false),
    attached: getValue(browserTab?.attached, false),
    devTools,
    insertNewTab,
  };
}

export function useWebView({ tabId }) {
  const { browserTabs, updateTab } = useWebBrowsersContext();
  const currentTab = browserTabs.find((tab) => tab.id === tabId);
  const defaultURL = currentTab?.defaultURL;

  return { defaultURL, updateTab };
}

function getValue(val1, val2) {
  return val1 === undefined ? val2 : val1;
}
