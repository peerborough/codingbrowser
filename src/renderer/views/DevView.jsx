import { Allotment } from 'allotment';
import ViewLayout from '../components/ViewLayout';
import CodePane from '../components/CodePane';
import DevToolsPane from '../components/DevToolsPane';
import { ActivityBar } from '../components/ActivityBar';

export default function ({ visible }) {
  return (
    <ViewLayout visible={visible}>
      <Allotment defaultSizes={[600, 400]} vertical={true}>
        <CodePane />
        <DevToolsPane />
      </Allotment>
    </ViewLayout>
  );
}
