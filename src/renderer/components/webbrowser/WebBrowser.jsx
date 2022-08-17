import { useRef, useState, useCallback } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';
import { IpcEvents } from '../../../ipcEvents';
import { useIpcRendererListener } from '../../ipc';
import { useWebBrowser } from './useWebBrowsers';

export default function ({ tabId }) {
  const webviewRef = useRef();
  const { isActiveTab } = useWebBrowser({ tabId });

  const handleNavigation = (value) =>
    value && webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();
  const handleStop = () => webviewRef.current?.stop();

  const handleReloadBrowserTab = useCallback(() => {
    if (!isActiveTab) {
      return;
    }
    webviewRef.current?.reload();
  }, [isActiveTab]);

  useIpcRendererListener(IpcEvents.RELOAD_BROWSER_TAB, handleReloadBrowserTab);

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
      <WebView tabId={tabId} ref={webviewRef} />
    </>
  );
}
