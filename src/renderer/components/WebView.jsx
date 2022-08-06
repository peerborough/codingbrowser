import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import store from '../store';

function WebView(props, ref) {
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
  }));

  useEffect(() => {
    const onIpcMessage = ({ frameId, channel, args }) => {
      switch (channel) {
        case 'preload-ready':
          onPreloadReady(webviewRef);
          break;
        default:
          console.error('Invalid channel', channel);
      }
    };

    const onDomReady = () => {
      //webviewRef.current.openDevTools();
    };

    if (webviewRef.current) {
      webviewRef.current.addEventListener('ipc-message', onIpcMessage);
      webviewRef.current.addEventListener('dom-ready', onDomReady);
    }

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener('ipc-message', onIpcMessage);
        webviewRef.current.removeEventListener('dom-ready', onDomReady);
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
      src="https://www.github.com/"
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
