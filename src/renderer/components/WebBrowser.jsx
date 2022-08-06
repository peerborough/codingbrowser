import { useRef } from 'react';
import AddressBar from './AddressBar';
import WebView from './WebView';

export default function () {
  const webviewRef = useRef();

  const handleNavigation = (value) => webviewRef.current?.loadURL(value);
  const handleGoBack = () => webviewRef.current?.goBack();
  const handleGoForward = () => webviewRef.current?.goForward();
  const handleReload = () => webviewRef.current?.reload();

  return (
    <>
      <AddressBar
        onNavigate={handleNavigation}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
      />
      <WebView ref={webviewRef} />
    </>
  );
}
