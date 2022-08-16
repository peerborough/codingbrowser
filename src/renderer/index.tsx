import { createRoot } from 'react-dom/client';
import App from './App';
import { IpcEvents } from '../ipcEvents';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

window._codingbrowser.ipcRenderer.send(
  IpcEvents.WEBCONTENTS_READY_FOR_IPC_SIGNAL
);
