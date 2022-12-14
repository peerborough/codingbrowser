import { useState } from 'react';
import { Allotment } from 'allotment';
import HomeView from './views/HomeView';
import DevView from './views/DevView';
import RuntimeView from './views/RuntimeView';
import { ActivityBar } from './components/ActivityBar';
import {
  activityViews,
  activeViewToIndex,
  useWorkspace,
} from './workspace/useWorkspace';

export default function () {
  const { activityIndex, setActivityIndex } = useWorkspace();

  return (
    <Allotment proportionalLayout={false}>
      <Allotment.Pane>
        <HomeView visible={activityIndex == activeViewToIndex('home')} />
        <RuntimeView visible={activityIndex === activeViewToIndex('play')} />
        <DevView visible={activityIndex === activeViewToIndex('files')} />
      </Allotment.Pane>
      <Allotment.Pane
        key="activityBar"
        minSize={48}
        maxSize={48}
        visible={true}
      >
        <ActivityBar
          checked={activityIndex}
          items={activityViews}
          onClick={setActivityIndex}
        />
      </Allotment.Pane>
    </Allotment>
  );
}
