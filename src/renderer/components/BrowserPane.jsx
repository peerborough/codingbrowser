import React, { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import WebBrowser from './WebBrowser';
import { ChromiumStyleTabs, Dark, Light } from './ChromiumStyleTabs';

import WebBrowsers from './WebBrowsers';

export default function () {
  return (
    <WebBrowsers defaultURL="https://google.com/" defaultTitle="New Tab " />
  );
}
