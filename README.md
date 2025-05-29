# 🗂️ Browser Storage Manager (Callback Version)

![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![CSS](https://img.shields.io/badge/language-CSS-purple.svg)
![HTML](https://img.shields.io/badge/language-HTML-red.svg)

---

## 📘 Overview

**Browser Storage Manager (Callback Version)** provides a unified JavaScript interface for managing browser storage — `localStorage`, `sessionStorage`, and `IndexedDB` — using plain JavaScript and **callback-based control flow**, with **no Promises or async/await**.

This application demonstrates how to abstract storage logic into reusable wrappers, simplifying client-side code by hiding the complexity of different browser APIs. It includes a user-friendly UI (`app.js`) for testing and verifying the logic interactively.

---

## 🎯 Design Goals

- ✅ Plain JavaScript (no build tools or frameworks)
- ✅ **No Promises** and **no async/await**
- ✅ Stable and simple callback-based flow
- ✅ Common interface for all three browser storage types
- ✅ Zero external dependencies for runtime use
- ✅ Separation of logic and UI — `storageWrapper.js` and `appStorageManager.js` are standalone and reusable

---

## 🧱 Architecture

### 🔹 `storageWrapper.js`
Contains the core wrappers for:
- `localStorage`
- `sessionStorage`
- `IndexedDB`

Each wrapper implements the same interface:
```js
{
  getItem(key, callback)
  setItem(key, value, callback)
  removeItem(key, callback)
  clear(callback)
  getAllKeys(callback)
}

```
All methods use **Node-sytle callbacks:**
callback(error, result)

### 🔹 `appStorageWrapper.js`
- Holds the `AppStorageManager` object
- Exposes a single point of entry for the client (UI)
- Internally delegates calls to one of the three storage wrappers
- Client code does **not** track the storage type directly

### 🔹 `app.js`
- Manages the UI logic
- Uses jQuery for DOM interaction
- Demonstrates storage interactions through buttons and form inputs
- Displays status messages on success/failure

---

## 🗂️ Project Structure
```
browser-storage-manager-callbacks/
│
├── index.html                 # UI layout
├── styles.css                 # Styling for the UI
├── app.js                     # UI logic and event handling
│
├── storage/
│   └── storageWrapper.js      # Contains the 3 storage wrappers (local, session, IndexedDB)
│
├── managers/
│   └── appStorageManager.js   # Entry point for selecting active storage
│
└── README.md                  # You're here!
```

---

## 💻 Usage

1.  Clone or download the repository
2.  Open `index.html` in your browser
3.  Use the dropdown to select a storage type
4.  Set, get, remove, or clear key/value pairs
5.  Click any listed key to view its value

---

## 🧪 Testing the Logic
This version is focused on callback-based control flow and doesn't include test automation. However, the storage logic is written in a modular and reusable way and is easily testable.

---

## 📦 Reusability
You can extract and reuse the following files in your own projects:

- ✅ storageWrapper.js
- ✅ appStorageManager.js

Include these files in any application that requires an abstracted browser storage layer using callback-based interaction.

---

## 📌 Key Notes
- IndexedDB operations are asynchronous by nature, so callbacks are essential.
- All methods in all wrappers return an **empty** string (`''`) for success when there is no value to return (e.g., `setItem`, `clear`).
- If a key is not found, `getItem` returns `''`, not `null` or `undefined`.
