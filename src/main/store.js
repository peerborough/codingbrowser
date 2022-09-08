import Store from 'electron-store';

const store = new Store();

export function getStoreValue(key) {
  return store.get(key);
}

export function setStoreValue(key, value) {
  store.set(key, value);
}

export function deleteStoreValue(key) {
  store.delete(key);
}

export function subscribeKey(key, callback) {
  return store.onDidChange(key, callback);
}
