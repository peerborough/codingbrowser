import { useRef, useEffect, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';
import { createContext } from '../../hooks/context';
import { defaultOption, toggleEditorOption } from './manacoOption';
import { ipcRendererManager, useIpcRendererListener } from '../../ipc';
import { IpcEvents } from '../../../ipcEvents';
import { setPreloadScript } from '../../slices/workspaceSlice';

function getDefaultScript(filepath) {
  switch (filepath) {
    case 'preload.js':
      return `/**
 *
 *  A script that will be loaded for every frame
 *
 */

// Called whenever DOM content for each frame has been loaded
function onReady({ url }) {
  console.log(\`onReady( "\${ url }" )\`);

}
`;
    case 'main.js':
      return `/**
 *
 *  A script for the main application
 *
 */

const { output }  = window.codingbrowser;

`;
  }
}

const suffixScript = `
if (document.readyState === "complete" 
   || document.readyState === "loaded" 
   || document.readyState === "interactive") {
  if (onReady) onReady({url: window.location.href});
}
else {
  window.addEventListener('DOMContentLoaded', (event) => {
    if (onReady) onReady({url: window.location.href});
  });  
}
`;

function getCacheName(filepath) {
  let name = filepath
    .replaceAll('.', '_')
    .replaceAll('/', '_')
    .replaceAll('\\', '_');
  return `cache.${name}`;
}

function makeId() {
  return nanoid();
}

const createTab = ({ title, filepath }) => ({
  key: makeId(),
  dirty: false,
  title: title,
  filepath: filepath,
});

export const [CodeEditorsProvider, useCodeEditorsContext] = createContext({
  name: 'CodeEditorsContext',
});

export function useCodeEditors() {
  const editorRefs = useRef({});
  const [tabs, setTabs] = useState([]);
  const [monacoOption, setMonacoOption] = useState(defaultOption);
  const [activeTabKey, setActiveTabKey] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    initializeDefaultTabs();
  }, []);

  useIpcRendererListener(IpcEvents.MONACO_TOGGLE_OPTION, (cmd) => {
    const newOption = toggleEditorOption(monacoOption, cmd);
    if (newOption) {
      setMonacoOption(newOption);
    }
  });

  const initializeDefaultTabs = () => {
    const defaultTabs = [
      createTab({
        title: 'preload.js',
        filepath: 'preload.js',
      }),
      createTab({
        title: 'main.js',
        filepath: 'main.js',
      }),
    ];
    setTabs(defaultTabs);
    setActiveTabKey(defaultTabs[0].key);
  };

  const setDirty = (tabKey, value) => {
    setTabs((tabs) => {
      const updated = tabs.map((tab) =>
        tab.key === tabKey ? { ...tab, dirty: value } : tab
      );
      return updated;
    });
  };

  const save = useCallback(
    async (tabKey) => {
      const tab = tabs.find((tab) => tab.key === tabKey);
      if (!tab) return;
      if (!editorRefs.current || !editorRefs.current[tabKey]) return;

      const value = editorRefs.current[tabKey].getValue();

      await ipcRendererManager.invoke(
        IpcEvents.SET_STORE_VALUE,
        getCacheName(tab.filepath),
        value
      );
      dispatch(setPreloadScript(`${value};${suffixScript}`));
      setDirty(tabKey, false);
    },
    [tabs]
  );

  const load = useCallback(
    async (tabKey) => {
      const tab = tabs.find((tab) => tab.key === tabKey);
      if (!tab || !tab.filepath) return;

      return (
        (await ipcRendererManager.invoke(
          IpcEvents.GET_STORE_VALUE,
          getCacheName(tab.filepath)
        )) || getDefaultScript(tab.filepath)
      );
    },
    [tabs]
  );

  const register = (tabKey, ref) => {
    if (!tabKey || !ref) return;
    editorRefs.current[tabKey] = ref;
  };

  const unregister = (tabKey) => {
    if (!tabKey) return;
    delete editorRefs.current[tabKey];
  };

  return {
    tabs,
    monacoOption,
    activeTabKey,
    setActiveTabKey,
    setDirty,
    save,
    load,
    register,
    unregister,
  };
}

export function useToolbar() {
  const { tabs, activeTabKey, save } = useCodeEditorsContext();
  const activeTab = tabs.find((tab) => tab.key === activeTabKey);
  const dirty = !!activeTab?.dirty;

  const saveCallback = useCallback(() => {
    save(activeTabKey);
  }, [activeTabKey]);

  return { dirty, save: saveCallback };
}

export function useCodeEditorTabs() {
  const { tabs, setActiveTabKey } = useCodeEditorsContext();
  return { tabs, setActiveTabKey };
}

export function useCodeEditor({ tabKey, ref }) {
  const { monacoOption, setDirty, load, register, unregister } =
    useCodeEditorsContext();

  useEffect(() => {
    register(tabKey, ref);
    return () => {
      unregister(tabKey);
    };
  }, [tabKey, ref]);

  const setDirtyCallback = useCallback(
    (value) => setDirty(tabKey, value),
    [tabKey]
  );

  const loadCallback = useCallback(async () => await load(tabKey), [tabKey]);

  return {
    monacoOption,
    load: loadCallback,
    setDirty: setDirtyCallback,
  };
}
