import { IpcEvents } from '../ipcEvents';

declare global {
  interface Window {
    _codingbrowser: {
      ipcRenderer: {
        send(channel: IpcEvents, ...args: Array<any>): void;
        invoke(channel: IpcEvents, ...args: Array<any>): Promise<any>;
        on(
          channel: string,
          func: (...args: Array<any>) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: Array<any>) => void): void;
        removeAllListeners(channel: IpcEvents): void;
      };
    };
  }
}

export {};
