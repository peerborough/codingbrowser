export default function () {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <webview
        src="data:text/html,<html><body>Hello World</body></html>"
        style={{ width: '100%', height: '100%' }}
        preload={`file://${window._codingbrowser.getWebviewUserAppPreloadPath()}`}
      ></webview>
    </div>
  );
}
