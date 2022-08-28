import React from 'react';
import WebBrowser from './components/WebBrowser';
import MainPage from './MainPage';
import {
  WorkspaceProvider,
  useWorkspaceProvider,
} from './workspace/useWorkspaceProvider';
import { useWorkspace } from './workspace/useWorkspace';

export default function () {
  const context = useWorkspaceProvider();

  return (
    <WorkspaceProvider value={context}>
      <FullPage>
        <Browser></Browser>
      </FullPage>
    </WorkspaceProvider>
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
  const { preloadScript } = useWorkspace();

  return (
    <WebBrowser
      defaultURL="https://google.com/"
      defaultTitle="New Tab "
      jsCode={preloadScript}
    >
      <MainPage />
    </WebBrowser>
  );
}
