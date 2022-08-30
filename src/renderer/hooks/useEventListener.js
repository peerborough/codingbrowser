import { useEffect, useRef } from 'react';

export default function useEventListener(emitter, eventName, handler, options) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      let localEmitter = emitter?.current;
      let isSupported = localEmitter && localEmitter.addEventListener;
      if (!isSupported) {
        localEmitter = emitter;
        isSupported = localEmitter && localEmitter.addEventListener;
      }
      if (!isSupported) {
        return;
      }

      const eventListener = (event) =>
        savedHandler.current && savedHandler.current(event);
      localEmitter.addEventListener(eventName, eventListener, options);

      return () => {
        localEmitter.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, emitter] // Re-run if eventName or emitter changes
  );
}
