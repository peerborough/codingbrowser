import { useRef, useState } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';

export default function ({ tabId, defaultURL, onUpdateTabs }) {
  const webviewRef = useRef();

  const [searchValue, setSearchValue] = useState('');
  const [iconState, setIconState] = useState({
    canGoBack: false,
    canGoForward: false,
  });

  const handleNavigation = (value) => webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();

  const handleUpdateTabs = (value) => {
    onUpdateTabs(tabId, value);
  };

  const refreshAddressBar = ({ canGoBack, canGoForward }) => {
    setIconState({ canGoBack, canGoForward });
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
      />
      <WebView
        ref={webviewRef}
        defaultURL={defaultURL}
        onStateChanged={refreshAddressBar}
        onUpdateTabs={handleUpdateTabs}
      />
    </>
  );
}
