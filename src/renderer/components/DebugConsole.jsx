import { useEffect, useRef } from 'react';
import { Console } from 'console-feed';
import useConsoleLog from '../workspace/useConsoleLog';

export default function DebugConsole({ defaultScript }, ref) {
  const { consoleLogs } = useConsoleLog();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [consoleLogs]);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Console logs={consoleLogs}></Console>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
