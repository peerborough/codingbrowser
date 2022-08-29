import { Col, Typography, Switch, Space } from 'antd';
import { Allotment } from 'allotment';
import ViewLayout from '../components/ViewLayout';
import UserAppUI from '../components/UserAppUI';
import UserAppMessages from '../components/UserAppMessages';
import Toolbar from '../components/Toolbar';
import { useWorkspace } from '../workspace/useWorkspace';

const { Text } = Typography;

export default function ({ visible }) {
  return (
    <ViewLayout visible={visible}>
      <Allotment vertical={true}>
        <Allotment.Pane maxSize={34} minSize={34}>
          <RuntimeViewToolbar />
        </Allotment.Pane>
        <Allotment.Pane maxSize={0} minSize={0}>
          <UserAppUI />
        </Allotment.Pane>
        <Allotment.Pane>
          <UserAppMessages />
        </Allotment.Pane>
      </Allotment>
    </ViewLayout>
  );
}

function RuntimeViewToolbar() {
  const { startAll, stopAll } = useWorkspace();

  const handleSwitch = (checked) => {
    if (checked) {
      startAll();
    } else {
      stopAll();
    }
  };

  return (
    <Toolbar>
      <Col>
        <Space align="center" style={{ height: '100%' }}>
          <Text>My Awesome App</Text>
        </Space>
      </Col>
      <Col flex="auto"></Col>
      <Col>
        <Space align="center" style={{ height: '100%' }}>
          <Switch defaultChecked onChange={handleSwitch}></Switch>
        </Space>
      </Col>
    </Toolbar>
  );
}