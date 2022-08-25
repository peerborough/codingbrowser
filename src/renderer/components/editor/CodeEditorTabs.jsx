import { Tabs } from 'antd';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';
import { useCodeEditorTabs } from './useCodeEditors';

const { TabPane } = Tabs;

export default function CodeEditorTabs() {
  const { tabs, setActiveTabKey } = useCodeEditorTabs();

  const handleChange = (activeKey) => {
    setActiveTabKey(activeKey);
  };

  return (
    <div
      className="code-pane"
      style={{ height: '100%', paddingBottom: '34px', background: '#f2f2f2' }}
    >
      <Tabs style={{ height: '100%' }} type="card" onChange={handleChange}>
        {tabs.map((tab) => (
          <TabPane tab={tab.title} key={tab.key}>
            <CodeEditor tabKey={tab.key} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
