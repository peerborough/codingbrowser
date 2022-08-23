import { VscChevronUp, VscClose } from 'react-icons/vsc';
import DebugConsole from './DebugConsole';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

import './DevToolsPane.css';

export default function () {
  return (
    <div className="dev-tools-pane" style={{ height: '100%' }}>
      <Tabs defaultActiveKey="1" style={{ height: '100%' }}>
        <TabPane tab="DEBUG CONSOLE" key="1">
          <DebugConsole />
        </TabPane>
      </Tabs>
    </div>
  );
}
