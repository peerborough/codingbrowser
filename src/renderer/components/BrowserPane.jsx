import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import WebBrowser from './WebBrowser';
import { ipcRendererManager, useIpcRendererListener } from '../ipc';
import { IpcEvents } from '../../ipcEvents';
import store from '../store';

export default function () {
  const webBrowserRef = useRef();
  const jsCode = useSelector((state) => state.editor.preload.value);
  const [devTools, setDevTools] = useState(false);

  useIpcRendererListener(IpcEvents.NEW_BROWSER_TAB, (_event) => {
    webBrowserRef.current?.pushNewTab();
  });

  useEffect(() => {
    stopListening();

    ipcRendererManager.on(IpcEvents.TOGGLE_DEV_TOOLS, (_event) => {
      setDevTools((value) => !value);
    });
  }, []);

  return (
    <WebBrowser
      ref={webBrowserRef}
      defaultURL="https://google.com/"
      defaultTitle="New Tab "
      jsCode={jsCode}
      devTools={devTools}
    />
  );
}

function stopListening() {
  ipcRendererManager.removeAllListeners(IpcEvents.TOGGLE_DEV_TOOLS);
}
