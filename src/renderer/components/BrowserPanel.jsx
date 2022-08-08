import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import WebBrowser from './WebBrowser';
import { BrowserTabs, Dark, Light } from './BrowserTabs';

export default function () {
  const tabsState = useState([]);
  const [tabs, setTabs] = tabsState;

  const activeTabState = useState(0);
  const [activeTab, setActiveTab] = activeTabState;

  useEffect(() => {
    addTab();
  }, []);

  const onUpdateTitle = (tabId, title) => {
    setTabs((tabs) =>
      tabs.map((tab) => (tab.id === tabId ? { ...tab, title: title } : tab))
    );
  };

  const addTab = () => {
    const newTabId = nanoid();
    const url = 'https://google.com/';

    setActiveTab(tabs.length);
    setTabs([...tabs, createTab(newTabId, url, onUpdateTitle)]);
  };

  return (
    <BrowserTabs
      onAddTabPress={addTab} // CallBack for a Tab Add
      theme={false ? Dark : Light} // Theming
      //      injectProps={{ isDark, setisDark }} // custom props that you needed it to be injected.
      activeTab={activeTabState} // keep a track of active index via state.
      tabs={tabsState} // tabs
    />
  );
}

const createTab = (tabId, url, onTitleUpdated) => ({
  title: 'New Tab ',
  url: url,
  id: tabId,
  content: (props) => (
    <WebBrowser tabId={tabId} url={url} onTitleUpdated={onTitleUpdated} />
  ),
});
