
const AppStorageManager = {
  current: sessionStorageWrapper,
  currentStorageTypeName: 'Session',

  setStorageType(type) {
    switch (type) {
      case 'localStorage':
        this.current = localStorageWrapper;
        this.currentStorageTypeName = 'Local';
        break;
      case 'indexedDB':
        this.current = indexedDBWrapper;
        this.currentStorageTypeName = 'IndexedDB';
        break;
      case 'sessionStorage':
      default:
        this.current = sessionStorageWrapper;
        this.currentStorageTypeName = 'Session';
        break;
    }
  },

  getItem(key, callback) {
    this.current.getItem(key, callback);
  },

  setItem(key, value, callback) {
    this.current.setItem(key, value, callback);
  },

  removeItem(key, callback) {
    this.current.removeItem(key, callback);
  },

  clear(callback) {
    this.current.clear(callback);
  },

  getAllKeys(callback) {
    this.current.getAllKeys(callback);
  },
};
