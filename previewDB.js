// previewDB.js â€” LÆ°u/Ä‘á»c preview data qua IndexedDB (khÃ´ng giá»›i háº¡n ~5MB nhÆ° localStorage)

var PREVIEW_DB_NAME = 'giftPreviewDB';
var PREVIEW_STORE = 'previewStore';
var PREVIEW_KEY = 'giftPreviewData';
var PREVIEW_DB_VERSION = 1;

function openPreviewDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open(PREVIEW_DB_NAME, PREVIEW_DB_VERSION);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(PREVIEW_STORE)) {
        db.createObjectStore(PREVIEW_STORE);
      }
    };
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror = function(e) { reject(e.target.error); };
  });
}

function savePreviewData(data) {
  return openPreviewDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(PREVIEW_STORE, 'readwrite');
      var store = tx.objectStore(PREVIEW_STORE);
      var req = store.put(data, PREVIEW_KEY);
      req.onsuccess = function() { resolve(); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function loadPreviewData() {
  return openPreviewDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(PREVIEW_STORE, 'readonly');
      var store = tx.objectStore(PREVIEW_STORE);
      var req = store.get(PREVIEW_KEY);
      req.onsuccess = function(e) { resolve(e.target.result || null); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function clearPreviewData() {
  return openPreviewDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(PREVIEW_STORE, 'readwrite');
      var store = tx.objectStore(PREVIEW_STORE);
      var req = store.delete(PREVIEW_KEY);
      req.onsuccess = function() { resolve(); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

// Báº£n nhÃ¡p form táº¡o quÃ  (text + áº£nh VIP + nháº¡c tÃ¹y chá»n) â€” key dÃ¹ng chung
var DRAFT_KEY = 'birthdaypro_create_draft';

function saveDraftData(data) {
  return openPreviewDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(PREVIEW_STORE, 'readwrite');
      var store = tx.objectStore(PREVIEW_STORE);
      var req = store.put(data, DRAFT_KEY);
      req.onsuccess = function() { resolve(); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function loadDraftData() {
  return openPreviewDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(PREVIEW_STORE, 'readonly');
      var store = tx.objectStore(PREVIEW_STORE);
      var req = store.get(DRAFT_KEY);
      req.onsuccess = function(e) { resolve(e.target.result || null); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}

function clearDraftData() {
  return openPreviewDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(PREVIEW_STORE, 'readwrite');
      var store = tx.objectStore(PREVIEW_STORE);
      var req = store.delete(DRAFT_KEY);
      req.onsuccess = function() { resolve(); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  });
}
