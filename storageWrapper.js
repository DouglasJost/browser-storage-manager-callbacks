
const localStorageWrapper = {
  getItem(key, callback) {
    try {
      if (!key) {
        callback('Key is required to Get local storage value.', '');
        return;
      }

      const value = localStorage.getItem(key);
      callback(null, value ?? '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  setItem(key, value, callback) {
    try {
      if (!key) {
        callback('Key is required to Set local storage value.', '');
        return;
      }

      localStorage.setItem(key, value);
      callback(null, '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  removeItem(key, callback) {
    try {
      if (!key) {
        callback('Key is required to Remove an item from local storage.');
        return;
      }

      localStorage.removeItem(key);
      callback(null, '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  clear(callback) {
    try {
      localStorage.clear();
      callback(null, '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  getAllKeys(callback) {
    try {
      const keys = Object.keys(localStorage);
      callback(null, keys);
    } catch (err) {
      console.error(err);
      callback(err, []);
    }
  },
};

const sessionStorageWrapper = {
  getItem(key, callback) {
    try {
      if (!key) {
        callback('Key is required to Get session storage value.', '');
        return;
      }

      const value = sessionStorage.getItem(key);
      callback(null, value ?? '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  setItem(key, value, callback) {
    try {
      if (!key) {
        callback('Key is required to Set session storage value.', '');
        return;
      }

      sessionStorage.setItem(key, value);
      callback(null, '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  removeItem(key, callback) {
    try {
      if (!key) {
        callback('Key is required to Remove an item from session storage.');
        return;
      }

      sessionStorage.removeItem(key);
      callback(null, '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  clear(callback) {
    try {
      sessionStorage.clear();
      callback(null, '');
    } catch (err) {
      console.error(err);
      callback(err, '');
    }
  },

  getAllKeys(callback) {
    try {
      const keys = Object.keys(sessionStorage);
      callback(null, keys);
    } catch (err) {
      console.error(err);
      callback(err, []);
    }
  },
};

const indexedDBWrapper = (() => {
  const dbName = 'StorageWrapperDB';
  const storeName = 'keyval';
  const dbVersion = 1;
  let db;

  function openDB(callback) {
    if (db) return callback(null, db);

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      callback(null, db);
    };

    request.onerror = function (e) {
      console.error(`IndexedDB error: ${e.target.errorCode}`);
      callback(new Error(`IndexedDB error: ${e.target.errorCode}`));
    };
  }

  function withStore(mode, action, callback) {
    openDB((err, db) => {
      if (err) return callback(err, '');
      try {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        action(store, callback);
      } catch (err) {
        console.error(err);
        callback(err, '');
      }
    });
  }

  return {
    getItem(key, callback) {
      if (!key) {
        callback('Key is required to Get IndexedDB value.', '');
        return;
      }

      withStore('readonly', (store, done) => {
        const req = store.get(key);
        req.onsuccess = () => done(null, req.result ?? '');
        req.onerror = () => {
          console.error(req.error);
          done(req.error);
        };
      }, callback);
    },

    setItem(key, value, callback) {
      if (!key) {
        callback('Key is required to Set IndexedDB value.', '');
        return;
      }

      withStore('readwrite', (store, done) => {
        const req = store.put(value, key);
        req.onsuccess = () => done(null, '');
        req.onerror = () => {
          console.error(req.error);
          done(new Error(`Failed to store key "${key}"`), '');
        };
      }, callback);
    },

    removeItem(key, callback) {
      if (!key) {
        callback('Key is required to Remove an item from IndexedDB.', '');
        return;
      }

      withStore('readwrite', (store, done) => {
        const req = store.delete(key);
        req.onsuccess = () => done(null, '');
        req.onerror = () => {
          console.error(req.error);
          done(req.error, '');
        };
      }, callback);
    },

    clear(callback) {
      withStore('readwrite', (store, done) => {
        const req = store.clear();
        req.onsuccess = () => done(null, '');
        req.onerror = () => {
          console.error(req.error);
          done(req.error, '');
        }
      }, callback);
    },

    getAllKeys(callback) {
      withStore('readonly', (store, done) => {
        const req = store.getAllKeys();
        req.onsuccess = () => done(null, req.result);
        req.onerror = () => {
          console.error(req.error);
          done(req.error, []);
        };
      }, callback);
    }
  };
})();
