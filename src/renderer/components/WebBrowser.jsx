import { useRef, useState } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';
import { useWebBrowser } from './useWebBrowsers';

export default function ({ tabId }) {
  const webviewRef = useRef();
  const { defaultURL } = useWebBrowser({ tabId });

  const handleNavigation = (value) =>
    value && webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();
  const handleStop = () => webviewRef.current?.stop();

  return (
    <>
      <AddressBar
        tabId={tabId}
        onNavigate={handleNavigation}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onStop={handleStop}
      />
      <WebView tabId={tabId} ref={webviewRef} defaultURL={defaultURL} />
    </>
  );
}
