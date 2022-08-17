import { useEffect, useRef } from 'react';

export default function useEventListener(emitter, eventName, handler, options) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = emitter && emitter.addEventListener;
      if (!isSupported) return;

      const eventListener = (event) =>
        savedHandler.current && savedHandler.current(event);
      emitter.addEventListener(eventName, eventListener, options);

      return () => {
        emitter.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, emitter] // Re-run if eventName or emitter changes
  );
}
