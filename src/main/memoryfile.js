import Store from 'electron-store';

const store = new Store();

export function loadMemoryFile(path) {
  if (path) {
    return store.get(getCacheName(path), null);
  }
}

export function saveMemoryFile(path, value) {
  if (path) {
    store.set(getCacheName(path), value || '');
  }
}

function getCacheName(filepath) {
  let name = filepath
    .replaceAll('.', '_')
    .replaceAll('/', '_')
    .replaceAll('\\', '_');
  return `memoryfile.${name}`;
}
