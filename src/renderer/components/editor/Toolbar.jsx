import { Col, Row, Button } from 'antd';
import {
  SaveOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useToolbar } from './useCodeEditors';

export default function () {
  const { dirty, save } = useToolbar();

  const handleSave = async () => {
    save();
  };

  return (
    <div style={{ height: '34px' }}>
      <Row
        style={{
          background: '#e8e8e8',
        }}
      >
        <Col flex="300px" style={{ padding: 1 }}>
          <Button
            type="text"
            icon={<SaveOutlined />}
            size="middle"
            style={{ color: '#525252', fontWeight: 'normal' }}
            onClick={handleSave}
            disabled={!dirty}
          >
            Save
          </Button>
        </Col>
        <Col flex="auto"></Col>
      </Row>
    </div>
  );
}
