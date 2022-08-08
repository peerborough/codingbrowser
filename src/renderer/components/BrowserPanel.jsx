import React, { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import WebBrowser from './WebBrowser';
import { BrowserTabs, Dark, Light } from './BrowserTabs';

const createTab = (tabId, url) => ({
  title: 'New Tab ',
  url: url,
  id: tabId,
  content: (props) => <WebBrowser tabId={tabId} url={url} />,
});
const defaultTabs = [createTab(nanoid(), 'https://github.com/')];

export default function () {
  const tabs = useState(defaultTabs);
  const activeTab = useState(0);

  const addTab = () => {
    const newTabId = nanoid();
    const url = 'https://google.com/';

    activeTab[1](tabs[0].length);
    tabs[1]([...tabs[0], createTab(newTabId, url)]);
  };
  return (
    <BrowserTabs
      onAddTabPress={addTab} // CallBack for a Tab Add
      theme={false ? Dark : Light} // Theming
      //      injectProps={{ isDark, setisDark }} // custom props that you needed it to be injected.
      activeTab={activeTab} // keep a track of active index via state.
      tabs={tabs} // tabs
    />
  );
}
