import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import WebBrowser from './WebBrowser';
import store from '../store';

export default function () {
  const jsCode = useSelector((state) => state.editor.preload.value);

  return (
    <WebBrowser
      defaultURL="https://google.com/"
      defaultTitle="New Tab "
      jsCode={jsCode}
    />
  );
}
