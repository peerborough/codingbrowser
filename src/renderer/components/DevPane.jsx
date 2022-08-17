import { Allotment } from 'allotment';
import CodePane from './CodePane';
import DevToolsPane from './DevToolsPane';

export default function () {
  return (
    <Allotment defaultSizes={[300, 100]} vertical={true}>
      <CodePane />
      {/* <DevToolsPane /> */}
    </Allotment>
  );
}
