import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useWebView } from './useWebBrowsers';
import useEventListener from 'renderer/hooks/useEventListener';
import { sleep } from '../../util';

function WebView({ tabId, onIpcMessage }, ref) {
  const { defaultURL, updateTab } = useWebView({ tabId });
  const [isDomReady, setDomReady] = useState(false);
  const webviewRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      loadURL: async (url, options) => {
        try {
          return await webviewRef.current?.loadURL(url, options);
        } catch (e) {
          console.info(e);
        }
      },
      goBack: () => {
        return webviewRef.current?.goBack();
      },
      goForward: () => {
        return webviewRef.current?.goForward();
      },
      reload: () => {
        return webviewRef.current?.reload();
      },
      stop: () => {
        return webviewRef.current?.stop();
      },
      canGoBack: () => {
        return webviewRef.current?.canGoBack();
      },
      canGoForward: () => {
        return webviewRef.current?.canGoForward();
      },
      openDevTools: async () => {
        // TODO: use message queue instead
        if (!isDomReady) await sleep(300);
        webviewRef.current?.openDevTools();
      },
      closeDevTools: async () => {
        // TODO: use message queue instead
        if (!isDomReady) await sleep(300);
        webviewRef.current?.closeDevTools();
      },
      sendToFrame: (frameId, channel, ...args) => {
        return webviewRef.current?.sendToFrame(frameId, channel, ...args);
      },
    }),
    [isDomReady]
  );

  const handleDomReady = () => {
    setDomReady(true);
  };

  const handleChangeURL = ({ url }) => {
    updateTab(tabId, { url });
  };

  const handleStartLoading = () => {
    updateTab(tabId, { loading: true });
  };

  const handleStopLoading = () => {
    updateTab(tabId, { url: webviewRef.current.getURL(), loading: false });
  };

  const handleFailure = (event) => {
    if (event.errorCode !== '-3') {
      // Incase not a manual stop loadding
      console.error(event);
    }
  };

  const handleDidStartNavigate = () => {
    updateTab(tabId, {
      canGoBack: webviewRef.current.canGoBack(),
      canGoForward: webviewRef.current.canGoForward(),
    });
  };

  const handleDidAttach = () => {
    updateTab(tabId, { attached: true });
  };

  const handlePageTitleUpdated = ({ title }) => {
    updateTab(tabId, { title });
  };

  useEventListener(webviewRef, 'ipc-message', onIpcMessage);
  useEventListener(webviewRef, 'dom-ready', handleDomReady);
  useEventListener(webviewRef, 'will-navigate', handleChangeURL);
  useEventListener(webviewRef, 'did-start-loading', handleStartLoading);
  useEventListener(webviewRef, 'did-stop-loading', handleStopLoading);
  useEventListener(webviewRef, 'did-finish-load', handleStopLoading);
  useEventListener(webviewRef, 'did-start-navigation', handleDidStartNavigate);
  useEventListener(webviewRef, 'did-fail-load', handleFailure);
  useEventListener(webviewRef, 'did-attach', handleDidAttach);
  useEventListener(webviewRef, 'page-title-updated', handlePageTitleUpdated);

  return (
    <webview
      ref={webviewRef}
      src={defaultURL}
      allowpopups="true"
      nodeintegrationinsubframes="true"
      webpreferences="nativeWindowOpen=yes"
      preload={`file://${window._codingbrowser.getWebviewPreloadPath()}`}
      style={{ flex: 1 }}
    ></webview>
  );
}

export default forwardRef(WebView);
