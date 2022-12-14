import { useState, useMemo, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { createContext } from '../hooks/context';
import { ipcRendererManager, useIpcRendererListener } from '../ipc';
import { IpcEvents } from '../../ipcEvents';

const { confirm } = Modal;

const showNewWorkspaceConfirm = () => {
  confirm({
    title: 'Do you want to create a new workspace?',
    icon: <ExclamationCircleOutlined />,
    content: 'Your changes will be lost.',
    onOk() {
      ipcRendererManager.invoke(IpcEvents.NEW_WORKSPACE);
    },
    onCancel() {},
  });
};

export const [WorkspaceProvider, useWorkspaceContext] = createContext({
  name: 'WorkspaceContext',
});

export const activityViews = ['files'];
export const activeViewToIndex = (name) => activityViews.indexOf(name);

export function useWorkspaceProvider() {
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    (async function () {
      const workspace = await ipcRendererManager.invoke(
        IpcEvents.GET_CURRENT_WORKSPACE
      );
      if (!workspace) return;
      setWorkspace(workspace);
    })();
  }, []);

  useIpcRendererListener(IpcEvents.WORKSPACE_CHANGE, (newValue) => {
    if (workspace && newValue[workspace.id]) {
      setWorkspace(newValue[workspace.id]);
    }
  });

  useIpcRendererListener(IpcEvents.WORKSPACE_SWITCH, (newValue) => {
    const currentWorkspaceId = newValue['current'];
    if (currentWorkspaceId) {
      setWorkspace(newValue[currentWorkspaceId]);
    }
  });

  useIpcRendererListener(IpcEvents.NEW_WORKSPACE_CONFIRM, () => {
    showNewWorkspaceConfirm();
  });

  const [scriptVersionId, setScriptVersionId] = useState(1);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activityIndex, setActivityIndex] = useState(
    activeViewToIndex('files')
  );

  const restart = () => {
    setScriptVersionId((id) => id + 1);
  };

  const enableWorkspace = (value) => {
    ipcRendererManager.invoke(IpcEvents.ENABLE_WORKSPACE, workspace.id, value);
  };

  const setWorkspaceValue = (key, value) => {
    ipcRendererManager.invoke(
      IpcEvents.SET_WORKSPACE_VALUE,
      workspace.id,
      key,
      value
    );
  };

  const addConsoleLog = (log) => {
    setConsoleLogs((logs) => [...logs, log]);
  };

  const clearAllConsoleLog = () => {
    setConsoleLogs([]);
  };

  return {
    workspace,
    scriptVersionId,
    consoleLogs,
    activityIndex,
    setScriptVersionId,
    restart,
    enableWorkspace,
    setWorkspaceValue,
    addConsoleLog,
    clearAllConsoleLog,
    setActivityIndex,
  };
}

export function useWorkspace() {
  const { ...props } = useWorkspaceContext();
  return { ...props };
}
