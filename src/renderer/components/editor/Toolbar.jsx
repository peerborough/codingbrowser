import { Col, Row, Button } from 'antd';
import {
  SaveOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useToolbar } from './useCodeEditors';

export default function () {
  const { dirty, execution, save, start, stop } = useToolbar();

  const handleSave = async () => {
    save();
  };

  const hanedleStart = async () => {
    start();
  };

  const handleStop = async () => {
    stop();
  };

  return (
    <div style={{ height: '34px' }}>
      <Row
        style={{
          background: '#e8e8e8',
        }}
      >
        <Col flex="300px" style={{ padding: 1 }}>
          {execution === 'start' ? (
            <Button
              type="text"
              icon={<StopOutlined style={{ color: '#cc0000' }} />}
              size="middle"
              style={{ color: '#525252', fontWeight: 'normal' }}
              onClick={handleStop}
            >
              Stop
            </Button>
          ) : (
            <Button
              type="text"
              icon={<PlayCircleOutlined style={{ color: 'green' }} />}
              size="middle"
              style={{ color: '#525252', fontWeight: 'normal' }}
              onClick={hanedleStart}
            >
              Start
            </Button>
          )}
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
