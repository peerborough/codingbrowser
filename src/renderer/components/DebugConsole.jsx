import { useSelector } from 'react-redux';
import { Console } from 'console-feed';

export default function DebugConsole({ defaultScript }, ref) {
  const logs = useSelector((state) => state.console.values);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Console logs={logs}></Console>
      </div>
    </div>
  );
}
