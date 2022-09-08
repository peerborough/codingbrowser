import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import {
  getStoreValue,
  setStoreValue,
  deleteStoreValue,
  subscribeKey,
} from './store';
import { IpcEvents } from '../ipcEvents';
import { ipcMainManager } from './ipc';
import { getFileNameFromPath, getRelativePath } from './util';

const userDataPath = app.getPath('userData');

export function initializeWorkspace() {
  //deleteStoreValue('workspace'); // DEBUGGING
  if (!getStoreValue('workspace')) {
    setStoreValue('workspace', {});
    const id = createWorkspace();
    setStoreValue('workspace.current', id);
  }

  subscribeKey(`workspace`, notifyWorkspaceChange);
}

export function createWorkspace() {
  const id = createId();
  const workspacePath = path.join(userDataPath, 'workspaces', id);
  const projectPath = path.join(workspacePath, 'project');

  createWorkspaceDirectories(id);
  const file = createProjectFiles(projectPath);
  const openFiles = [
    getFileInfo(projectPath, file.mainJsPath),
    getFileInfo(projectPath, file.browserScriptPath),
  ];

  setStoreValue(`workspace.${id}`, {
    id: id,
    enabled: true,
    workspacePath: workspacePath,
    projectPath: projectPath,
    openFiles: openFiles,
    mainPath: file.mainJsPath,
    browserScriptPath: file.browserScriptPath,
  });

  return id;
}

export function newWorkspace() {
  const oldWorkspaceId = getCurrentWorkspaceId();

  const newWorkspaceId = createWorkspace();
  if (getWorkspace(newWorkspaceId)) {
    setCurrentWorkspaceId(newWorkspaceId);
  }
  setTimeout(() => {
    deleteWorkspace(oldWorkspaceId);
  }, 0);
}

export function deleteWorkspace(id) {
  if (!id) return;

  const currentWorkspaceId = getCurrentWorkspaceId();
  if (currentWorkspaceId === id) {
    setStoreValue(`workspace.current`, null);
  }
  deleteStoreValue(`workspace.${id}`);
  setTimeout(() => {
    deleteWorkspaceDirectories(id);
  }, 1000);
}

export function getWorkspace(workspaceId) {
  if (!workspaceId) return null;

  const workspace = getStoreValue(`workspace.${workspaceId}`);
  if (!workspace) return null;

  return workspace;
}

export function getCurrentWorkspace() {
  const workspaceId = getCurrentWorkspaceId();
  return getWorkspace(workspaceId);
}

export function getCurrentWorkspaceId() {
  const workspaceId = getStoreValue('workspace.current');
  return workspaceId || null;
}

export function setCurrentWorkspaceId(id) {
  if (!id) return;
  setStoreValue('workspace.current', id);
}

export function enableWorkspace(workspaceId, value) {
  if (!workspaceId) return;
  setStoreValue(`workspace.${workspaceId}.enabled`, value);
}

export function setWorkspaceValue(workspaceId, key, value) {
  if (!workspaceId) return;
  setStoreValue(`workspace.${workspaceId}.${key}`, value);
}

function createId() {
  return `u${uuidv4().replaceAll('-', '')}`;
}

function createWorkspaceDirectories(workspaceId) {
  const workspaces = path.join(userDataPath, 'workspaces');
  createDirectory(workspaces);

  const home = path.join(workspaces, workspaceId);
  createDirectory(home);

  const project = path.join(home, 'project');
  createDirectory(project);
}

function deleteWorkspaceDirectories(workspaceId) {
  if (!workspaceId) return;

  const home = path.join(userDataPath, 'workspaces', workspaceId);
  fs.remove(home).catch((err) => console.error(err));
}

function createProjectFiles(projectPath) {
  const mainJsPath = path.join(projectPath, 'main.js');
  if (!fs.existsSync(mainJsPath)) {
    fs.writeFileSync(mainJsPath, mainjs);
  }

  const browserScriptPath = path.join(projectPath, 'browser.js');
  if (!fs.existsSync(browserScriptPath)) {
    fs.writeFileSync(browserScriptPath, injectjs);
  }

  return { browserScriptPath, mainJsPath };
}

function createDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function getFileInfo(projectPath, localPath, remotePath) {
  return {
    localPath: localPath,
    remotePath: remotePath || null,
    name: getFileNameFromPath(localPath),
    relativePath: getRelativePath(projectPath, localPath),
  };
}

function notifyWorkspaceChange(newValue, oldValue) {
  if (oldValue['current'] !== newValue['current']) {
    ipcMainManager.send(IpcEvents.WORKSPACE_SWITCH, [newValue]);
  } else {
    ipcMainManager.send(IpcEvents.WORKSPACE_CHANGE, [newValue]);
  }
}

const mainjs = `/**
*
*  Main application
*
*/

const { browser } = codingbrowser;

browser.initialize({ browserScriptPath: 'browser.js' })
`;

const injectjs = `/**
*
*  A script that is injected into every frame on webpage
*
*/

// Called when DOM content for each frame is loaded
function onReady({ url }) {
  console.log(\`onReady( "\${ url }" )\`);

}
`;
