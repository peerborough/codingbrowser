import { Allotment } from 'allotment';
import FullPage from './components/FullPage';
import BrowserPane from './components/BrowserPane';
import DevPane from './components/DevPane';

export default function () {
  return (
    <FullPage>
      <Allotment>
        <BrowserPane></BrowserPane>
        <DevPane></DevPane>
      </Allotment>
    </FullPage>
  );
}
