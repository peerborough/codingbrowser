import { useState } from 'react';
import { Allotment } from 'allotment';
import HomeView from './views/HomeView';
import DevView from './views/DevView';
import RuntimeView from './views/RuntimeView';
import { ActivityBar } from './components/ActivityBar';
import {
  activityItems,
  activeItemToIndex,
  useWorkspace,
} from './workspace/useWorkspace';

const activityItems = ['home', 'play', 'files'];
const activeItemToIndex = (name) => activityItems.indexOf(name);

export default function () {
  const { activityIndex, setActivityIndex } = useWorkspace();

  return (
    <Allotment proportionalLayout={false}>
      <Allotment.Pane>
        <HomeView visible={activityIndex == activeItemToIndex('home')} />
        <RuntimeView visible={activityIndex === activeItemToIndex('play')} />
        <DevView visible={activityIndex === activeItemToIndex('files')} />
      </Allotment.Pane>
      <Allotment.Pane
        key="activityBar"
        minSize={48}
        maxSize={48}
        visible={true}
      >
        <ActivityBar
          checked={activityIndex}
          items={activityItems}
          onClick={setActivityIndex}
        />
      </Allotment.Pane>
    </Allotment>
  );
}
