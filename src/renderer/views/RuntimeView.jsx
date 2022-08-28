import ViewLayout from '../components/ViewLayout';
import OutputMessages from '../components/OutputMessages';

export default function ({ visible }) {
  return (
    <ViewLayout visible={visible}>
      <OutputMessages />
    </ViewLayout>
  );
}
