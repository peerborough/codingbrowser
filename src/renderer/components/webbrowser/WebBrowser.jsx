import { useRef, useState, useCallback, useEffect, useRef } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';
import { IpcEvents } from '../../../ipcEvents';
import { ipcRendererManager, useIpcRendererListener } from '../../ipc';
import usePrevious from 'renderer/hooks/usePrevious';
import { useWebBrowser } from './useWebBrowsers';

export default function ({ tabId }) {
  const webviewRef = useRef();
  const { isActiveTab, loading, jsCode, devTools, insertNewTab } =
    useWebBrowser({ tabId });
  const jsCodeRef = useRef(jsCode);
  const prevJsCode = usePrevious(jsCode);

  const validateActiveTab = useCallback(
    (func) => {
      return isActiveTab ? func : null;
    },
    [isActiveTab]
  );

  const handleReloadBrowserTab = validateActiveTab(() => {
    webviewRef.current?.reload();
  });
  const handleStopLoadingBrowserTab = validateActiveTab(() => {
    webviewRef.current?.stop();
  });

  useIpcRendererListener(IpcEvents.RELOAD_BROWSER_TAB, handleReloadBrowserTab);
  useIpcRendererListener(
    IpcEvents.STOP_BROWSER_TAB,
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

  useEffect(() => {
    jsCodeRef.current = jsCode;
  }, [jsCode]);

  useEffect(() => {
    if (isActiveTab && prevJsCode !== undefined && jsCode) {
      console.log('force reload');
      webviewRef.current?.reload();
    }
  }, [jsCode, isActiveTab]);

  useEffect(() => {
    (async function () {
      if (isActiveTab && devTools) {
        webviewRef.current?.openDevTools();
      } else {
        webviewRef.current?.closeDevTools();
      }
    })();
  }, [devTools, isActiveTab]);

  const handleNavigation = (value) =>
    value && webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();
  const handleStop = () => webviewRef.current?.stop();

  const handleIpcMessage = ({ frameId, channel, args }) => {
    switch (channel) {
      case 'preload-ready':
        handlePreloadReady(frameId);
        break;
      case 'add-tab':
        handleAddTab(...args);
        break;
      default:
        console.error('Invalid channel', channel);
    }
  };

  function handlePreloadReady(frameId) {
    if (jsCodeRef.current) {
      setTimeout(() => {
        webviewRef.current?.sendToFrame(
          frameId,
          'execute-script',
          jsCodeRef.current
        );
      }, 0);
    }
  }

  function handleAddTab({ url }) {
    insertNewTab(url);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <AddressBar
        tabId={tabId}
        onNavigate={handleNavigation}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onStop={handleStop}
      />
      <WebView ref={webviewRef} tabId={tabId} onIpcMessage={handleIpcMessage} />
    </div>
  );
}
