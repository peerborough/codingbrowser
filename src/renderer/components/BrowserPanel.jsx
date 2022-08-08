import React, { useRef, useState } from 'react';
import { Tabs, Button, Popconfirm, Space, Upload } from 'antd';
import WebBrowser from './WebBrowser';
import './BrowserPanel.css';

const { TabPane } = Tabs;
const initialPanes = [
  {
    title: 'Tab 1',
    content: <WebBrowser />,
    key: '1',
    closable: false,
  },
  {
    title: 'Tab 2',
    content: 'Content of Tab 2',
    key: '2',
  },
  {
    title: 'Tab 3',
    content: 'Content of Tab 3',
    key: '3',
  },
];

export default function () {
  const [activeKey, setActiveKey] = useState(initialPanes[0].key);
  const [panes, setPanes] = useState(initialPanes);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...panes];
    newPanes.push({
      title: 'New Tab',
      content: 'Content of new Tab',
      key: newActiveKey,
    });
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);

    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }

    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const updateTitle = (tabId, title) => {
    console.log(tabId, title);
    setPanes((value) => {
      return value.map((tab) => {
        if (tab.key === tabId) {
          return { ...tab, title };
        } else {
          return tab;
        }
      });
    });
  };

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
    >
      {panes.map((pane) => (
        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          <WebBrowser tabId={pane.key} onTitleUpdated={updateTitle} />
        </TabPane>
      ))}
    </Tabs>
  );

  return <WebView />;
}
