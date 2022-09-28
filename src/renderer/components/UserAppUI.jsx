import { useRef, useState, useCallback, useEffect, useRef } from 'react';
import { Decode } from 'console-feed';
import useEventListener from '../hooks/useEventListener';
import { useWorkspace } from '../workspace/useWorkspace';
import useConsoleLog from '../workspace/useConsoleLog';

export default function () {
  const { workspace, scriptVersionId } = useWorkspace();
  const webviewRef = useRef(null);
  const [attached, setAttached] = useState(false);
  const { addConsoleLog } = useConsoleLog();

  useEffect(() => {
    if (workspace?.enabled && webviewRef.current && attached) {
      webviewRef.current?.reload();
    }
  }, [scriptVersionId, workspace?.enabled, attached]);

  const handleIpcMessage = ({ frameId, channel, args }) => {
    switch (channel) {
      case 'console-message':
        handleConsoleMessage(...args);
        break;
      default:
        console.error('Invalid channel', channel);
    }
  };

  const handleDidAttach = () => {
    setAttached(true);
    //webviewRef.current.openDevTools();
  };

  function handleConsoleMessage(log) {
    addConsoleLog(Decode(log));
  }

  useEventListener(webviewRef, 'ipc-message', handleIpcMessage);
  useEventListener(webviewRef, 'did-attach', handleDidAttach);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <webview
        ref={webviewRef}
        src="data:text/html,<html><body>User APP</body></html>"
        partition="persist:codingbrowser"
        style={{ width: '100%', height: '100%' }}
        preload={`file://${window._codingbrowser.getWebviewUserAppPreloadPath()}`}
      ></webview>
    </div>
  );
}
