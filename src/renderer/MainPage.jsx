import { Allotment } from 'allotment';
import DevView from './components/DevView';
import { ActivityBar } from './components/ActivityBar';

export default function () {
  return (
    <Allotment proportionalLayout={false}>
      <Allotment.Pane>
        <DevView />
      </Allotment.Pane>
      <Allotment.Pane
        key="activityBar"
        minSize={48}
        maxSize={48}
        visible={true}
      >
        <ActivityBar
          checked={2}
          items={['home', 'extensions', 'files']}
          onClick={(index) => {}}
        />
      </Allotment.Pane>
    </Allotment>
  );
}
