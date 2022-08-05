import Split from 'react-split';
import FullPage from './components/FullPage';
import WebBrowser from './components/WebBrowser';
import DevPanel from './components/DevPanel';
import './MainPage.css';

export default function () {
  return (
    <FullPage>
      <Split className="split" gutterSize={4} sizes={[70, 30]}>
        <WebBrowser></WebBrowser>
        <DevPanel></DevPanel>
      </Split>
    </FullPage>
  );
}
