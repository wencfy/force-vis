import {Actions, RetData} from "./types";

class DatabaseManager {
  private static dbName: string = 'database';
  _db: IDBDatabase | null = null;
  get db() {
    return new Promise<IDBDatabase>((res, rej) => {
      if (!this._db) {
        const request = window.indexedDB.open(DatabaseManager.dbName);
        request.onsuccess = _ => {
          res(request.result);
        }
        request.onerror = _ => {
          throw new Error('index DB is not available');
        }
      } else {
        res(this._db);
      }
    });
  }

  constructor() {
    const request = window.indexedDB.open(DatabaseManager.dbName);
    request.onupgradeneeded = event => {
      const db = request.result;
      if (!db.objectStoreNames.contains('dashboard')) {
        const dashboardsStore = db.createObjectStore('dashboard', {keyPath: 'uid'});
        dashboardsStore.createIndex('name', 'name', {unique: false});
        dashboardsStore.createIndex('url', 'url', {unique: true});
        dashboardsStore.createIndex('tags', 'tags', {unique: false});
        dashboardsStore.createIndex('data', 'data', {unique: false});
        dashboardsStore.createIndex('lastModified', 'lastModified', {unique: false});
      }
      if (!db.objectStoreNames.contains('datasource')) {
        const datasourceStore = db.createObjectStore('datasource', {keyPath: 'uid'});
        datasourceStore.createIndex('name', 'name', {unique: true});
        datasourceStore.createIndex('meta', 'meta', {unique: false});
        datasourceStore.createIndex('tags', 'tags', {unique: false});
        datasourceStore.createIndex('data', 'data', {unique: false});
        datasourceStore.createIndex('lastModified', 'lastModified', {unique: false});
      }
    }
    request.onerror = _ => {
      throw new Error('index DB is not available');
    }
  }

  // declaration of data function type
  data<T, Action extends Actions>(
    storeName: string,
    action: Action,
    payload?: string | T
  ): RetData<T>[Action]
  data<T, Action extends Actions>(
    storeName: string,
    action: Action,
    payload?: string | T
  ): unknown {
    switch (action) {
      case 'add': {
        return new Promise<null>(async (res, rej) => {
          const request = (await this.db).transaction([storeName], 'readwrite')
            .objectStore(storeName)
            .add(payload);
          request.onsuccess = _ => {
            res(null);
          }
          request.onerror = event => {
            rej(event);
          }
        });
      }
      case 'delete': {
        return new Promise<null>(async (res, rej) => {
          if (typeof payload === 'string') {
            const request = (await this.db).transaction([storeName], 'readwrite')
              .objectStore(storeName)
              .delete(payload);
            request.onsuccess = _ => {
              res(null);
            }
            request.onerror = event => {
              rej();
            }
          } else {
            rej();
          }
        })
      }
      case 'get': {
        return new Promise<T>(async (res, rej) => {
          if (typeof payload === 'string') {
            const request = (await this.db).transaction([storeName])
              .objectStore(storeName)
              .get(payload);
            request.onsuccess = _ => {
              res(request.result);
            }
            request.onerror = event => {
              rej();
            }
          } else {
            rej()
          }
        })
      }
      case 'put': {
        return new Promise<null>(async (res, rej) => {
          const request = (await this.db).transaction([storeName], 'readwrite')
            .objectStore(storeName)
            .put(payload);
          request.onsuccess = _ => {
            res(null);
          }
          request.onerror = event => {
            rej(event);
          }
        });
      }
      case 'getAll': {
        return new Promise<T[]>(async (res, rej) => {
          const store = (await this.db).transaction([storeName])
            .objectStore(storeName);
          const arr: Array<T> = [];
          store.openCursor().onsuccess = event => {
            const cursor = (event.target as EventTarget & { result: IDBCursorWithValue }).result;
            if (cursor) {
              arr.push(cursor.value);
              cursor.continue();
            } else {
              res(arr);
            }
          }
        });
      }
      default: {
        return new Promise<null>((_, rej) => {
          rej();
        });
      }
    }
  }
}

const db = new DatabaseManager();
export default db;