export function on(eventName: string, eventListener: (...args: any[]) => void) {
  if (!eventName || !eventListener) return;
  handleEvent(eventName, eventListener, false);
}

export function once(
  eventName: string,
  eventListener: (...args: any[]) => void
) {
  if (!eventName || !eventListener) return;
  handleEvent(eventName, eventListener, true);
}

function handleEvent(
  eventName: string,
  eventListener: (...args: any[]) => void,
  isOnce: boolean
) {
  switch (eventName) {
    case 'ready':
      handleReady(eventListener, isOnce);
      break;
  }
}

function handleReady(handler: (...args: any[]) => void, isOnce: boolean) {
  document.addEventListener('DOMContentLoaded', handler, { once: isOnce });
}
