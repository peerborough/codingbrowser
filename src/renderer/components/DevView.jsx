import { Allotment } from 'allotment';
import CodePane from './CodePane';
import DevToolsPane from './DevToolsPane';
import { ActivityBar } from './ActivityBar';

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
