import { useRef, useEffect } from 'react';

export default function () {
  const webviewRef = useRef();

  return (
    <webview
      ref={webviewRef}
      src="https://www.github.com/"
      preload={`file://${window.electron.getWebviewPreloadPath()}`}
      style={{
        display: 'inline-flex',
        width: '100%',
        height: '100%',
      }}
    ></webview>
  );
}
