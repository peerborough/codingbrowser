import { Allotment } from 'allotment';
import ViewLayout from '../components/ViewLayout';
import UserAppUI from '../components/UserAppUI';
import UserAppMessages from '../components/UserAppMessages';

export default function ({ visible }) {
  return (
    <ViewLayout visible={visible}>
      <Allotment
        defaultSizes={[500, 500]}
        vertical={true}
        proportionalLayout={false}
      >
        <UserAppUI />
        <UserAppMessages />
      </Allotment>
    </ViewLayout>
  );
}
