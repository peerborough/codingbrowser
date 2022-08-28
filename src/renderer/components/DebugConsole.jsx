import { Console } from 'console-feed';
import useConsoleLog from '../workspace/useConsoleLog';

export default function DebugConsole({ defaultScript }, ref) {
  const { consoleLogs } = useConsoleLog();

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Console logs={consoleLogs}></Console>
      </div>
    </div>
  );
}
