/**
 * preview-boot.js â€” cháº¡y sá»›m, trÆ°á»›c cake.js / letter-index.js / gift-box.js
 * Náº¿u URL cÃ³ ?preview=1 thÃ¬ load dá»¯ liá»‡u tá»« previewDB (IndexedDB),
 * táº¡o Blob URL cho áº£nh/nháº¡c vÃ  Ä‘áº·t vÃ o window.__PREVIEW_DATA__.
 * CÃ¡c script chÃ­nh kiá»ƒm tra window.__PREVIEW_DATA__ trÆ°á»›c khi dÃ¹ng háº±ng sá»‘ cá»©ng.
 * YÃªu cáº§u: previewDB.js pháº£i Ä‘Æ°á»£c load trÆ°á»›c script nÃ y.
 */
(function () {
  var search = location.search;
  var isPreview =
    search.indexOf("preview=1") !== -1 || search.indexOf("preview=true") !== -1;
  if (!isPreview) return;

  window.__PREVIEW_MODE__ = true;

  var resolveReady;
  window.__PREVIEW_READY__ = new Promise(function (resolve) {
    resolveReady = resolve;
  });

  function filesToBlobUrls(files) {
    if (!Array.isArray(files)) return [];
    return files
      .filter(function (f) { return f && f instanceof File; })
      .map(function (f) { return URL.createObjectURL(f); });
  }

  /* loadPreviewData() Ä‘áº¿n tá»« previewDB.js (Ä‘Ã£ load trÆ°á»›c) */
  if (typeof loadPreviewData !== "function") {
    console.warn("[preview-boot] previewDB.js chÆ°a load â€” khÃ´ng cÃ³ preview data.");
    resolveReady(null);
    return;
  }

  loadPreviewData()
    .then(function (data) {
      if (!data) { resolveReady(null); return; }

      var photoBlobUrls = filesToBlobUrls(data.photoFiles);
      var customMusicUrl = null;
      if (data.customMusicFile && data.customMusicFile instanceof File) {
        customMusicUrl = URL.createObjectURL(data.customMusicFile);
      }

      var v = data.values || {};
      window.__PREVIEW_DATA__ = {
        letterTitle:     v.letterTitle     || "",
        letterBody:      v.letterBody      || "",
        cakeInscription: v.cakeInscription || "",
        musicType:       v.musicType       || "Sample",
        musicPath:       v.musicPath       || "",
        isSavePermanent: !!v.isSavePermanent,
        finalGift:       !!v.finalGift,
        photoBlobUrls:   photoBlobUrls,
        customMusicUrl:  customMusicUrl,
      };

      resolveReady(window.__PREVIEW_DATA__);
    })
    .catch(function () {
      resolveReady(null);
    });
})();
