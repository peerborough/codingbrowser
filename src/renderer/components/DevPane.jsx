import { Allotment } from 'allotment';
import CodePane from './CodePane';
import DevToolsPane from './DevToolsPane';

export default function () {
  return (
    <Allotment defaultSizes={[600, 400]} vertical={true}>
      <CodePane />
      <DevToolsPane />
    </Allotment>
  );
}
