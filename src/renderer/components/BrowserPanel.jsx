import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import WebBrowser from './WebBrowser';
import { BrowserTabs, Dark, Light } from './BrowserTabs';

export default function () {
  const defaultURL = 'https://google.com/';
  const defaultTitle = 'New Tab ';

  const tabsState = useState([]);
  const [tabs, setTabs] = tabsState;

  const activeTabState = useState(0);
  const [activeTab, setActiveTab] = activeTabState;

  useEffect(() => {
    addTab();
  }, []);

  const onAddTabFromWebview = (tabId, { url }) => {
    addTab(tabId, url);
  };

  const onAddTabFromButton = () => {
    addTab();
  };

  const onUpdateTabs = (tabId, { title, url }) => {
    setTabs((tabs) =>
      tabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, title: title || tab.title, url: url || tab.url }
          : tab
      )
    );
  };

  const createTab = (url) => {
    const tabId = nanoid();
    const src = url || defaultURL;

    return {
      title: defaultTitle,
      defaultURL: src,
      url: src,
      id: tabId,
      content: (props) => (
        <WebBrowser
          tabId={tabId}
          defaultURL={src}
          onAddTab={onAddTabFromWebview}
          onUpdateTabs={onUpdateTabs}
        />
      ),
    };
  };

  const addTab = (tabAfter, url) => {
    setTabs((tabs) => {
      const index = tabAfter
        ? tabs.findIndex((tab) => tab.id === tabAfter)
        : -1;
      if (index === -1) {
        setActiveTab(tabs.length);
        return [...tabs, createTab(url)];
      } else {
        tabs.splice(index + 1, 0, createTab(url));
        setActiveTab(index + 1);
        return [...tabs];
      }
    });
  };

  return (
    <BrowserTabs
      onAddTabPress={onAddTabFromButton}
      theme={false ? Dark : Light}
      activeTab={activeTabState}
      tabs={tabsState}
      //      injectProps={}
    />
  );
}
