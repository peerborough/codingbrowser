import { Row } from 'antd';

export default function ({ children }) {
  return (
    <div style={{ height: '34px' }}>
      <Row
        style={{
          height: '100%',
          background: '#e8e8e8',
          paddingLeft: '7px',
          paddingRight: '7px',
        }}
      >
        {children}
      </Row>
    </div>
  );
}
