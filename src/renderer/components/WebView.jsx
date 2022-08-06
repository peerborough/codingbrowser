import { useRef, useEffect } from 'react';

export default function () {
  const webviewRef = useRef();

  useEffect(() => {
    const onIpcMessage = ({ frameId, channel, args }) => {
      switch (channel) {
        case 'preload-ready':
          onPreloadReady(webviewRef);
          break;
        default:
          console.error('Invalid channel', channel);
      }
    };

    const onDomReady = () => {
      //      webviewRef.current.openDevTools();
    };

    if (webviewRef.current) {
      webviewRef.current.addEventListener('ipc-message', onIpcMessage);
      webviewRef.current.addEventListener('dom-ready', onDomReady);
    }

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener('ipc-message', onIpcMessage);
        webviewRef.current.removeEventListener('dom-ready', onDomReady);
      }
    };
  }, []);

  return (
    <webview
      ref={webviewRef}
      src="https://www.github.com/"
      preload={`file://${window._codingbrowser.getWebviewPreloadPath()}`}
      style={{
        display: 'inline-flex',
        width: '100%',
        height: '100%',
      }}
    ></webview>
  );
}

function onPreloadReady(webviewRef) {
  webviewRef.current.send('execute-script', 'console.log("Injected");');
}
