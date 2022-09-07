import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import {
  getStoreValue,
  setStoreValue,
  deleteStoreKey,
  subscribeKey,
} from './store';
import { IpcEvents } from '../ipcEvents';
import { ipcMainManager } from './ipc';
import { getFileNameFromPath, getRelativePath } from './util';

const userDataPath = app.getPath('userData');

export function initializeWorkspace() {
  if (!getStoreValue('workspace')) {
    setStoreValue('workspace', {});
    const id = createWorkspace();
    setStoreValue('workspace.current', id);
  }

  subscribeKey(`workspace`, notifyWorkspaceChange);
}

export function createWorkspace() {
  const id = createId();
  const projectPath = path.join(userDataPath, 'workspaces', id, 'project');

  createWorkspaceDirectories(id);
  const file = createProjectFiles(projectPath);
  const openFiles = [
    getFileInfo(projectPath, file.injectJsPath),
    getFileInfo(projectPath, file.mainJsPath),
  ];

  setStoreValue(`workspace.${id}`, {
    id: id,
    enabled: true,
    projectPath: projectPath,
    openFiles: openFiles,
    mainPath: file.mainJsPath,
    injectPath: file.injectJsPath,
  });

  return id;
}

export function getCurrentWorkspace() {
  const workspaceId = getStoreValue('workspace.current');
  if (!workspaceId) return null;

  const workspace = getStoreValue(`workspace.${workspaceId}`);
  if (!workspace) return null;

  return workspace;
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

function createProjectFiles(projectPath) {
  const mainJsPath = path.join(projectPath, 'main.js');
  if (!fs.existsSync(mainJsPath)) {
    fs.writeFileSync(mainJsPath, mainjs);
  }

  const injectJsPath = path.join(projectPath, 'inject.js');
  if (!fs.existsSync(injectJsPath)) {
    fs.writeFileSync(injectJsPath, injectjs);
  }

  return { injectJsPath, mainJsPath };
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
  ipcMainManager.send(IpcEvents.WORKSPACE_CHANGED, [newValue]);
}

const mainjs = `/**
 *
 *  A script for the main application
 *
 */


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
