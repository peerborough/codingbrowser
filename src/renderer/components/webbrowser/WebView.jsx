import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useWebView } from './useWebBrowsers';
import usePrevious from 'renderer/hooks/usePrevious';
import useEventListener from 'renderer/hooks/useEventListener';
import { sleep } from '../../util';

function WebView({ tabId }, ref) {
  const { defaultURL, jsCode, devTools, isActiveTab, insertNewTab, updateTab } =
    useWebView({ tabId });
  const webviewRef = useRef();
  const jsCodeRef = useRef(jsCode);
  const prevJsCode = usePrevious(jsCode);
  const [isDomReady, setDomReady] = useState(false);

  useEffect(() => {
    jsCodeRef.current = jsCode;
    if (isActiveTab && prevJsCode !== undefined && jsCode) {
      console.log('force reload');
      webviewRef.current?.reload();
    }
  }, [jsCode, isActiveTab]);

  useEffect(() => {
    (async function () {
      if (isActiveTab && devTools) {
        // Todo: use message queue instead
        if (!isDomReady) await sleep(300);
        webviewRef.current?.openDevTools();
      } else {
        // Todo: use message queue instead
        if (!isDomReady) await sleep(300);
        webviewRef.current?.closeDevTools();
      }
    })();
  }, [devTools, isActiveTab]);

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
        webviewRef.current.sendToFrame(
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

  const handlePageTitleUpdated = ({ title }) => {
    updateTab(tabId, { title });
  };

  const webview = webviewRef.current;
  useEventListener(webview, 'ipc-message', handleIpcMessage);
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
