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
  const [webview, setWebview] = useState();

  useImperativeHandle(
    ref,
    () => ({
      loadURL: async (url, options) => {
        try {
          return await webview?.loadURL(url, options);
        } catch (e) {
          console.info(e);
        }
      },
      goBack: () => {
        return webview?.goBack();
      },
      goForward: () => {
        return webview?.goForward();
      },
      reload: () => {
        return webview?.reload();
      },
      stop: () => {
        return webview?.stop();
      },
      canGoBack: () => {
        return webview?.canGoBack();
      },
      canGoForward: () => {
        return webview?.canGoForward();
      },
      openDevTools: async () => {
        // TODO: use message queue instead
        if (!isDomReady) await sleep(300);
        webview?.openDevTools();
      },
      closeDevTools: async () => {
        // TODO: use message queue instead
        if (!isDomReady) await sleep(300);
        webview?.closeDevTools();
      },
      sendToFrame: (frameId, channel, ...args) => {
        return webview?.sendToFrame(frameId, channel, ...args);
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
    updateTab(tabId, { url: webview.getURL(), loading: false });
  };

  const handleFailure = (event) => {
    if (event.errorCode !== '-3') {
      // Incase not a manual stop loadding
      console.error(event);
    }
  };

  const handleDidStartNavigate = () => {
    updateTab(tabId, {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
    });
  };

  const handlePageTitleUpdated = ({ title }) => {
    updateTab(tabId, { title });
  };

  const webviewRef = useCallback((node) => {
    setWebview(node);
  }, []);

  useEventListener(webview, 'ipc-message', onIpcMessage);
  useEventListener(webview, 'dom-ready', handleDomReady);
  useEventListener(webview, 'will-navigate', handleChangeURL);
  useEventListener(webview, 'did-start-loading', handleStartLoading);
  useEventListener(webview, 'did-stop-loading', handleStopLoading);
  useEventListener(webview, 'did-finish-load', handleStopLoading);
  useEventListener(webview, 'did-start-navigation', handleDidStartNavigate);
  useEventListener(webview, 'did-fail-load', handleFailure);
  useEventListener(webview, 'page-title-updated', handlePageTitleUpdated);

  return (
    <webview
      ref={webviewRef}
      src={defaultURL}
      allowpopups="true"
      nodeintegrationinsubframes="true"
      webpreferences="nativeWindowOpen=yes"
      preload={`file://${window._codingbrowser.getWebviewPreloadPath()}`}
      style={{
        display: 'inline-flex',
        width: '100%',
        height: '100%',
      }}
    ></webview>
  );
}

export default forwardRef(WebView);
