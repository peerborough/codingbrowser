import { Col, Row, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useToolbar } from './useCodeEditors';

export default function () {
  const { dirty, save } = useToolbar();

  const onSave = async () => {
    save();
  };

  return (
    <div style={{ height: '34px' }}>
      <Row
        style={{
          background: '#e8e8e8',
        }}
      >
        <Col flex="100px" style={{ padding: 1 }}>
          <Button
            type="text"
            icon={<SaveOutlined />}
            size="middle"
            style={{ color: '#525252', fontWeight: 'normal' }}
            onClick={onSave}
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
