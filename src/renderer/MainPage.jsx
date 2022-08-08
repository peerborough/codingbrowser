import { Allotment } from 'allotment';
import FullPage from './components/FullPage';
import BrowserPanel from './components/BrowserPanel';
import DevPanel from './components/DevPanel';
import 'allotment/dist/style.css';

export default function () {
  return (
    <FullPage>
      <Allotment>
        <BrowserPanel></BrowserPanel>
        <DevPanel></DevPanel>
      </Allotment>
    </FullPage>
  );
}
