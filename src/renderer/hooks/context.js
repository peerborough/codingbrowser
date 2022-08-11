import {
  createContext as createReactContext,
  useContext as useReactContext,
} from 'react';

export function createContext(options) {
  const { name } = options;
  const Context = createReactContext(undefined);

  Context.displayName = name;

  function useContext() {
    return useReactContext(Context);
  }

  return [Context.Provider, useContext, Context];
}
