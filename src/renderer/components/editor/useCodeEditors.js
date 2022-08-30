import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { createContext } from '../../hooks/context';
import { defaultOption, toggleEditorOption } from './manacoOption';
import { ipcRendererManager, useIpcRendererListener } from '../../ipc';
import { IpcEvents } from '../../../ipcEvents';
import { activeViewToIndex, useWorkspace } from '../../workspace/useWorkspace';
import { useWorkspaceProvider } from '../../workspace/useWorkspaceProvider';

function makeId() {
  return nanoid();
}

const createTab = ({ title, language, ...props }) => ({
  key: makeId(),
  dirty: false,
  title: title,
  language: language,
  ...props,
});

export const [CodeEditorsProvider, useCodeEditorsContext] = createContext({
  name: 'CodeEditorsContext',
});

export function useCodeEditors() {
  const editorRefs = useRef({});
  const [tabs, setTabs] = useState([]);
  const [monacoOption, setMonacoOption] = useState(defaultOption);
  const [activeTabKey, setActiveTabKey] = useState('');
  const { workspace, restart, activityIndex } = useWorkspace();

  useEffect(() => {
    if (workspace?.id) {
      initializeDefaultTabs(workspace.openFiles);
    }
  }, [workspace?.id]);

  useIpcRendererListener(IpcEvents.MONACO_TOGGLE_OPTION, (cmd) => {
    const newOption = toggleEditorOption(monacoOption, cmd);
    if (newOption) {
      setMonacoOption(newOption);
    }
  });

  useIpcRendererListener(
    IpcEvents.MONACO_SAVE_FILE,
    useCallback(() => {
      if (activeViewToIndex('files') === activityIndex) {
        save(activeTabKey);
      }
    }, [activityIndex, activeTabKey])
  );

  const initializeDefaultTabs = (openFiles) => {
    const defaultTabs = openFiles.map((file) =>
      createTab({
        title: file.name,
        language: 'javascript',
        ...file,
      })
    );

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
        IpcEvents.SAVE_TEXT_FILE,
        tab.localPath,
        value
      );
      setDirty(tabKey, false);
      restart();
    },
    [tabs]
  );

  const saveAll = useCallback(async () => {
    for (const tab of tabs) {
      await save(tab.key);
    }
  }, [tabs]);

  const load = useCallback(
    async (tabKey) => {
      const tab = tabs.find((tab) => tab.key === tabKey);
      if (!tab || !tab.localPath) return;

      let value = await ipcRendererManager.invoke(
        IpcEvents.LOAD_TEXT_FILE,
        tab.localPath
      );
      setDirty(tabKey, false);
      return value;
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

export function useCodeEditor({ tabKey }) {
  const { tabs, monacoOption, setDirty, load, register, unregister } =
    useCodeEditorsContext();

  const { language } = useMemo(() => {
    const tab = tabs?.find((tab) => tab.key === tabKey);
    return { language: tab?.language || 'javascript' };
  }, [tabs, tabKey]);

  const setDirtyCallback = useCallback(
    (value) => setDirty(tabKey, value),
    [tabKey]
  );

  const loadCallback = useCallback(async () => await load(tabKey), [tabKey]);

  const isDifferentWithSavedValue = useCallback(
    async (value) => {
      const savedValue = await load(tabKey);
      return savedValue !== value;
    },
    [tabKey]
  );

  return {
    language,
    monacoOption,
    register,
    unregister,
    load: loadCallback,
    setDirty: setDirtyCallback,
    isDifferentWithSavedValue,
  };
}
