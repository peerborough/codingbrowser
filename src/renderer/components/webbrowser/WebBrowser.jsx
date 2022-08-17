import { useRef, useState, useCallback, useEffect } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';
import { IpcEvents } from '../../../ipcEvents';
import { ipcRendererManager, useIpcRendererListener } from '../../ipc';
import { useWebBrowser } from './useWebBrowsers';

export default function ({ tabId }) {
  const webviewRef = useRef();
  const { isActiveTab, loading } = useWebBrowser({ tabId });

  const validateActiveTab = useCallback(
    (func) => {
      return isActiveTab ? func : null;
    },
    [isActiveTab]
  );

  const handleNavigation = (value) =>
    value && webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();
  const handleStop = () => webviewRef.current?.stop();

  const handleReloadBrowserTab = validateActiveTab(() => {
    webviewRef.current?.reload();
  });
  const handleStopLoadingBrowserTab = validateActiveTab(() => {
    webviewRef.current?.stop();
  });

  useIpcRendererListener(IpcEvents.RELOAD_BROWSER_TAB, handleReloadBrowserTab);
  useIpcRendererListener(
    IpcEvents.STOP_LOADING_BROWSER_TAB,
    handleStopLoadingBrowserTab
  );

  useEffect(() => {
    if (!isActiveTab) return;
    ipcRendererManager.send(IpcEvents.SET_MENU_ITEM_OPTIONS, [
      {
        label: 'Reload This Page',
        enabled: !loading,
      },
      {
        label: 'Stop',
        enabled: loading,
      },
    ]);
  }, [isActiveTab, loading]);

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
