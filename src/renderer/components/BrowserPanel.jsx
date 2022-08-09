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

  const onUpdateTabs = (tabId, { title, url }) => {
    setTabs((tabs) =>
      tabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, title: title || tab.title, url: url || tab.url }
          : tab
      )
    );
  };

  const createTab = () => {
    const tabId = nanoid();

    return {
      title: defaultTitle,
      defaultURL: defaultURL,
      url: defaultURL,
      id: tabId,
      content: (props) => (
        <WebBrowser
          tabId={tabId}
          defaultURL={defaultURL}
          onUpdateTabs={onUpdateTabs}
        />
      ),
    };
  };

  const addTab = () => {
    setActiveTab(tabs.length);
    setTabs([...tabs, createTab()]);
  };

  return (
    <BrowserTabs
      onAddTabPress={addTab}
      theme={false ? Dark : Light}
      activeTab={activeTabState}
      tabs={tabsState}
      //      injectProps={}
    />
  );
}
