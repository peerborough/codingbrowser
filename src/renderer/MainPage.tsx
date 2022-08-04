import { Layout } from 'antd';

const { Footer, Content } = Layout;

export default function () {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
