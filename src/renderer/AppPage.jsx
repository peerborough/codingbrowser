import React from 'react';
import { useSelector } from 'react-redux';
import WebBrowser from './components/WebBrowser';
import DevPane from './components/DevPane';

export default function () {
  return (
    <FullPage>
      <Browser></Browser>
    </FullPage>
  );
}

function FullPage({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {children}
    </div>
  );
}

function Browser() {
  const jsCode = useSelector((state) => state.workspace.preload);

  return (
    <WebBrowser
      defaultURL="https://google.com/"
      defaultTitle="New Tab "
      jsCode={jsCode}
    >
      <DevPane />
    </WebBrowser>
  );
}
