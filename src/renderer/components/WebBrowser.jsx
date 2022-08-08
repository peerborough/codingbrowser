import { useRef, useState } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';

export default function ({ tabId, url, onTitleUpdated }) {
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
  const handleSearchValueUpdated = (value) => {
    setSearchValue(value);
  };
  const handleTitleUpdate = (title) =>
    onTitleUpdated && onTitleUpdated(tabId, title);

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
        url={url}
        onStateChanged={refreshAddressBar}
        onSearchUpdated={handleSearchValueUpdated}
        onTitleUpdated={handleTitleUpdate}
      />
    </>
  );
}
