import Split from 'react-split';
import FullPage from './components/FullPage';
import BrowserPanel from './components/BrowserPanel';
import DevPanel from './components/DevPanel';
import './MainPage.css';

export default function () {
  return (
    <FullPage>
      <Split className="split" gutterSize={1} sizes={[60, 40]}>
        <BrowserPanel></BrowserPanel>
        <DevPanel></DevPanel>
      </Split>
    </FullPage>
  );
}
