import { useEffect, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import WebBrowser from './WebBrowser';
import { createContext } from '../hooks/context';

function makeId() {
  return nanoid();
}

export const [WebBrowsersProvider, useWebBrowsersContext] = createContext({
  name: 'WebBrowsersContext',
});

export function useWebBrowsers({ defaultURL, defaultTitle }) {
  const [browserTabs, setBrowserTabs] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
      content: (props) => (
        <WebBrowser tabId={tabId} defaultURL={url || defaultURL} />
      ),
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
    { title, url, loading, canGoBack, canGoForward }
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
    insertNewTab,
    pushNewTab,
    updateTab,
    setBrowserTabs,
    setActiveTabIndex,
    defaultURL,
    defaultTitle,
  };
}

export function useWebBrowser({ tabId }) {
  const { defaultURL } = useWebBrowsersContext();
  return { defaultURL };
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

export function useWebView({ tabId }) {
  const { insertNewTab, updateTab } = useWebBrowsersContext();
  return { insertNewTab, updateTab };
}

function getValue(val1, val2) {
  return val1 === undefined ? val2 : val1;
}
