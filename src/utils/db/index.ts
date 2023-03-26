import {ActionEnum, Dashboard, Datasource} from "./types";

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
      }
      if (!db.objectStoreNames.contains('datasource')) {
        const datasourceStore = db.createObjectStore('datasource', {keyPath: 'uid'});
        datasourceStore.createIndex('name', 'name', {unique: true});
        datasourceStore.createIndex('meta', 'meta', {unique: false});
        datasourceStore.createIndex('data', 'data', {unique: false});
      }
    }
    request.onerror = _ => {
      throw new Error('index DB is not available');
    }
  }

  data<T>(storeName: string, action: ActionEnum, payload?: string | Datasource | Dashboard) {
    switch (action) {
      case ActionEnum.ADD: {
        return new Promise(async (res, rej) => {
          const request = (await this.db).transaction([storeName], 'readwrite')
            .objectStore(storeName)
            .add(payload);
          request.onsuccess = event => {
            res(event);
          }
          request.onerror = event => {
            rej(event);
          }
        });
      }
      case ActionEnum.DEL: {
        return new Promise(async (res, rej) => {
          if (typeof payload === 'string') {
            const request = (await this.db).transaction([storeName], 'readwrite')
              .objectStore(storeName)
              .delete(payload);
            request.onsuccess = event => {
              res(event);
            }
            request.onerror = event => {
              rej();
            }
          } else {
            rej();
          }
        })
      }
      case ActionEnum.GET: {
        return new Promise<T>(async (res, rej) => {
          if (typeof payload === 'string') {
            const request = (await this.db).transaction([storeName])
              .objectStore(storeName)
              .get(payload);
            request.onsuccess = event => {
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
      case ActionEnum.PUT: {
        return new Promise(async (res, rej) => {
          const request = (await this.db).transaction([storeName], 'readwrite')
            .objectStore(storeName)
            .put(payload);
          request.onsuccess = event => {
            res(event);
          }
          request.onerror = event => {
            rej(event);
          }
        });
      }
      case ActionEnum.GET_ALL: {
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
    }
  }
}

const db = new DatabaseManager();
export default db;