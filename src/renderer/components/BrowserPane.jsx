import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import WebBrowser from './WebBrowser';
import { ChromiumStyleTabs, Dark, Light } from './ChromiumStyleTabs';
import WebBrowsers from './WebBrowsers';
import store from '../store';

export default function () {
  const jsCode = useSelector((state) => state.editor.preload.value);

  return (
    <WebBrowsers
      defaultURL="https://google.com/"
      defaultTitle="New Tab "
      jsCode={jsCode}
    />
  );
}
