import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import store from '../store';

function WebView({ url, onStateChanged, onTitleUpdated }, ref) {
  const webviewRef = useRef();
  const jsValue = useSelector((state) => state.editor.preload.value);

  useImperativeHandle(ref, () => ({
    loadURL: (url, options) => {
      return webviewRef.current?.loadURL(url, options);
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
          onPreloadReady(webviewRef);
          break;
        default:
          console.error('Invalid channel', channel);
      }
    };

    const handleDidStartNavigate = () => {
      onStateChanged({
        canGoBack: webviewRef.current.canGoBack(),
        canGoForward: webviewRef.current.canGoForward(),
      });
    };

    const handlePageTitleUpdated = ({ title }) => {
      onTitleUpdated(title);
    };

    const handleDomReady = () => {
      //webviewRef.current.openDevTools();
    };

    if (webviewRef.current) {
      webviewRef.current.addEventListener('ipc-message', handleIpcMessage);
      webviewRef.current.addEventListener(
        'did-start-navigation',
        handleDidStartNavigate
      );
      webviewRef.current.addEventListener(
        'page-title-updated',
        handlePageTitleUpdated
      );
      webviewRef.current.addEventListener('dom-ready', handleDomReady);
    }

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener('ipc-message', handleIpcMessage);
        webviewRef.current.removeEventListener(
          'did-start-navigation',
          handleDidStartNavigate
        );
        webviewRef.current.removeEventListener(
          'page-title-updated',
          handlePageTitleUpdated
        );
        webviewRef.current.removeEventListener('dom-ready', handleDomReady);
      }
    };
  }, []);

  useEffect(() => {
    if (jsValue) {
      webviewRef.current?.reload();
    }
  }, [jsValue]);

  return (
    <webview
      ref={webviewRef}
      src={url}
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
  const jsValue = store.getState().editor.preload.value;
  if (jsValue) {
    webviewRef.current.send('execute-script', jsValue);
  }
}

export default forwardRef(WebView);
