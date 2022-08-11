import {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useWebView } from './useWebBrowsers';

function WebView({ tabId }, ref) {
  const { defaultURL, jsCode, insertNewTab, updateTab } = useWebView({ tabId });
  const webviewRef = useRef();
  const jsCodeRef = useRef(jsCode);

  useEffect(() => {
    jsCodeRef.current = jsCode;
  }, [jsCode]);

  useImperativeHandle(ref, () => ({
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
  }));

  useEffect(() => {
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
        webviewRef.current.sendToFrame(
          frameId,
          'execute-script',
          jsCodeRef.current
        );
      }
    }

    function handleAddTab({ url }) {
      insertNewTab(url);
    }

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

    const handlePageTitleUpdated = ({ title }) => {
      updateTab(tabId, { title });
    };

    const handleDomReady = () => {
      //webviewRef.current.openDevTools();
    };

    if (webviewRef.current) {
      webviewRef.current.addEventListener('ipc-message', handleIpcMessage);
      webviewRef.current.addEventListener('dom-ready', handleDomReady);
      webviewRef.current.addEventListener('will-navigate', handleChangeURL);
      webviewRef.current.addEventListener(
        'did-start-loading',
        handleStartLoading
      );
      webviewRef.current.addEventListener(
        'did-stop-loading',
        handleStopLoading
      );
      webviewRef.current.addEventListener('did-finish-load', handleStopLoading);
      webviewRef.current.addEventListener(
        'did-start-navigation',
        handleDidStartNavigate
      );
      webviewRef.current.addEventListener('did-fail-load', handleFailure);
      webviewRef.current.addEventListener(
        'page-title-updated',
        handlePageTitleUpdated
      );
    }

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener('ipc-message', handleIpcMessage);
        webviewRef.current.removeEventListener('dom-ready', handleDomReady);
        webviewRef.current.removeEventListener(
          'will-navigate',
          handleChangeURL
        );
        webviewRef.current.removeEventListener(
          'did-start-loading',
          handleStartLoading
        );
        webviewRef.current.removeEventListener(
          'did-stop-loading',
          handleStopLoading
        );
        webviewRef.current.removeEventListener(
          'did-finish-load',
          handleStopLoading
        );
        webviewRef.current.removeEventListener('did-fail-load', handleFailure);
        webviewRef.current.removeEventListener(
          'did-start-navigation',
          handleDidStartNavigate
        );
        webviewRef.current.removeEventListener(
          'page-title-updated',
          handlePageTitleUpdated
        );
      }
    };
  }, []);

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
