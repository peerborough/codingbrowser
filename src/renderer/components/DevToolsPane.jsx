import { useRef } from 'react';
import { Tabs, Button } from 'antd';
import DebugConsole from './DebugConsole';
import './DevToolsPane.css';

const { TabPane } = Tabs;

export default function () {
  const debugConsoleRef = useRef(null);

  const handleClearAll = () => {
    debugConsoleRef.current?.clearAll();
  };

  return (
    <div className="dev-tools-pane" style={{ height: '100%' }}>
      <Tabs
        defaultActiveKey="1"
        style={{ height: '100%' }}
        tabBarExtraContent={
          <Button
            type="text"
            shape="default"
            size="small"
            icon={<div className="codicon codicon-clear-all"></div>}
            onClick={handleClearAll}
          />
        }
      >
        <TabPane tab="DEBUG CONSOLE" key="1">
          <DebugConsole ref={debugConsoleRef} />
        </TabPane>
      </Tabs>
    </div>
  );
}
