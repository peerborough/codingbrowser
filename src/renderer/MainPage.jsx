import { useState } from 'react';
import { Allotment } from 'allotment';
import HomeView from './views/HomeView';
import DevView from './views/DevView';
import RuntimeView from './views/RuntimeView';
import { ActivityBar } from './components/ActivityBar';

export default function () {
  const [activity, setActivity] = useState(0);

  return (
    <Allotment proportionalLayout={false}>
      <Allotment.Pane>
        <HomeView visible={activity == 0} />
        <RuntimeView visible={activity === 1} />
        <DevView visible={activity === 2} />
      </Allotment.Pane>
      <Allotment.Pane
        key="activityBar"
        minSize={48}
        maxSize={48}
        visible={true}
      >
        <ActivityBar
          checked={activity}
          items={['home', 'play', 'files']}
          onClick={setActivity}
        />
      </Allotment.Pane>
    </Allotment>
  );
}
