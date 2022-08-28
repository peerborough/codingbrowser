import { useRef, useState, useCallback, useEffect, useRef } from 'react';
import useEventListener from '../hooks/useEventListener';
import { useWorkspace } from '../workspace/useWorkspace';

export default function () {
  const { mainScript } = useWorkspace();
  const jsCodeRef = useRef(mainScript);
  const [webview, setWebview] = useState();

  useEffect(() => {
    jsCodeRef.current = mainScript;
    if (mainScript !== null) {
      webview?.reload();
    }
  }, [mainScript]);

  const handleIpcMessage = ({ frameId, channel, args }) => {
    switch (channel) {
      case 'preload-ready':
        handlePreloadReady(frameId);
        break;
      default:
        console.error('Invalid channel', channel);
    }
  };

  const handlePreloadReady = useCallback(
    (frameId) => {
      if (jsCodeRef.current) {
        const _webview = webview;
        setTimeout(() => {
          _webview?.sendToFrame(frameId, 'execute-script', jsCodeRef.current);
        }, 0);
      }
    },
    [webview]
  );

  const webviewRef = useCallback((node) => {
    setWebview(node);
  }, []);

  useEventListener(webview, 'ipc-message', handleIpcMessage);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <webview
        ref={webviewRef}
        src="data:text/html,<html><body>Hello World</body></html>"
        style={{ width: '100%', height: '100%' }}
        preload={`file://${window._codingbrowser.getWebviewUserAppPreloadPath()}`}
      ></webview>
    </div>
  );
}
