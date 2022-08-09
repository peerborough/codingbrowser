import { useRef, useState } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';

export default function ({ tabId, defaultURL, onAddTab, onUpdateTabs }) {
  const webviewRef = useRef();

  const [searchValue, setSearchValue] = useState('');
  const [iconState, setIconState] = useState({
    canGoBack: false,
    canGoForward: false,
    loading: false,
  });

  const handleNavigation = (value) =>
    value && webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();
  const handleStop = () => webviewRef.current?.stop();

  const handleAddTab = ({ url }) => {
    onAddTab(tabId, { url });
  };

  const handleUpdateTabs = (value) => {
    onUpdateTabs(tabId, value);

    if (value.url !== undefined) {
      setSearchValue(value.url);
    }

    if (value.canGoBack !== undefined || value.canGoForward !== undefined) {
      setIconState((iconState) => ({
        ...iconState,
        canGoBack:
          value.canGoBack !== undefined ? value.canGoBack : iconState.canGoBack,
        canGoForward:
          value.canGoForward !== undefined
            ? value.canGoForward
            : iconState.canGoForward,
      }));
    }

    if (value.loading !== undefined) {
      setIconState((iconState) => ({
        ...iconState,
        loading: value.loading,
      }));
    }
  };

  return (
    <>
      <AddressBar
        searchValue={searchValue}
        iconState={iconState}
        onNavigate={handleNavigation}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onStop={handleStop}
      />
      <WebView
        ref={webviewRef}
        defaultURL={defaultURL}
        onAddTab={handleAddTab}
        onUpdateTabs={handleUpdateTabs}
      />
    </>
  );
}
