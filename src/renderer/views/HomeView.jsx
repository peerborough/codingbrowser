import { Button, Empty, Space } from 'antd';
import ViewLayout from '../components/ViewLayout';
import { useWorkspace } from '../workspace/useWorkspace';

export default function ({ visible }) {
  return (
    <ViewLayout visible={visible}>
      <div style={{ width: '100%', height: '100%', paddingTop: '20%' }}>
        <Empty description={<span>Highly customizable browser</span>}>
          <Button type="primary">New Project</Button>
        </Empty>
      </div>
    </ViewLayout>
  );
}
