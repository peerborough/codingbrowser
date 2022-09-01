import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Console } from 'console-feed';
import useConsoleLog from '../workspace/useConsoleLog';

function DebugConsole({ defaultScript }, ref) {
  const { consoleLogs, clearAllConsoleLog } = useConsoleLog();
  const messagesEndRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      clearAll: () => {
        clearAllConsoleLog();
      },
    }),
    []
  );

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

export default forwardRef(DebugConsole);
