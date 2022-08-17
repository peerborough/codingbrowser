import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import WebBrowser from './WebBrowser';
import { useIpcRendererListener } from '../ipc';
import { IpcEvents } from '../../ipcEvents';
import store from '../store';

export default function () {
  const jsCode = useSelector((state) => state.editor.preload.value);
  const [devTools, setDevTools] = useState(false);

  useIpcRendererListener(IpcEvents.TOGGLE_DEV_TOOLS, (_event) => {
    setDevTools((value) => !value);
  });

  return (
    <WebBrowser
      defaultURL="https://google.com/"
      defaultTitle="New Tab "
      jsCode={jsCode}
      devTools={devTools}
    />
  );
}
