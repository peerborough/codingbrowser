import { Allotment } from 'allotment';
import CodePane from '../components/CodePane';
import DevToolsPane from '../components/DevToolsPane';
import { ActivityBar } from '../components/ActivityBar';

export default function () {
  return (
    <Allotment
      defaultSizes={[600, 400]}
      vertical={true}
      proportionalLayout={false}
    >
      <CodePane />
      <DevToolsPane />
    </Allotment>
  );
}
