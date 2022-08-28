import { Allotment } from 'allotment';
import ViewLayout from '../components/ViewLayout';
import OutputUI from '../components/OutputUI';
import OutputMessages from '../components/OutputMessages';

export default function ({ visible }) {
  return (
    <ViewLayout visible={visible}>
      <Allotment
        defaultSizes={[500, 500]}
        vertical={true}
        proportionalLayout={false}
      >
        <OutputUI />
        <OutputMessages />
      </Allotment>
    </ViewLayout>
  );
}
