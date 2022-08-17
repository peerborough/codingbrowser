import { useEffect, useRef } from 'react';
import { EventEmitter } from 'events';
import { IpcEvents, ipcRendererEvents } from '../ipcEvents';

class IpcRendererManager extends EventEmitter {
  constructor() {
    super();

    ipcRendererEvents.forEach((name) => {
      window._codingbrowser.ipcRenderer.removeAllListeners(name);
      window._codingbrowser.ipcRenderer.on(name, (...args: Array<any>) =>
        this.emit(name, ...args)
      );
    });
  }

  public send(channel: IpcEvents, ...args: Array<any>) {
    window._codingbrowser.ipcRenderer.send(channel, ...args);
  }

  public invoke(channel: IpcEvents, ...args: Array<any>) {
    return window._codingbrowser.ipcRenderer.invoke(channel, ...args);
  }
}

export const ipcRendererManager = new IpcRendererManager();

interface EventListener {
  (event: any): void;
}

export function useIpcRendererListener(channel: IpcEvents, handler: any) {
  const savedHandler = useRef<EventListener>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const eventListener = (event: any) =>
        savedHandler.current && savedHandler.current(event);
      ipcRendererManager.on(channel, eventListener);

      return () => {
        ipcRendererManager.removeListener(channel, eventListener);
      };
    },
    [channel] // Re-run if eventName or emitter changes
  );
}
