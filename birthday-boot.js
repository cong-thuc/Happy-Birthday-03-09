(function () {
  var params = new URLSearchParams(window.location.search);
  if (params.get("preview") === "1" || params.get("preview") === "true") return;

  function getGiftId() {
    var id = params.get("id");
    if (id) return id;
    for (var key of params.keys()) {
      if (/^[a-f0-9]{24}$/i.test(key)) return key;
    }
    var m = (window.location.pathname || "").match(/\/([a-f0-9]{24})(?:\/|$)/i);
    return m ? m[1] : null;
  }

  var giftId = getGiftId();
  var ua = navigator.userAgent || "";
  var isIOS = /iP(hone|ad|od)/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isWebKit = /AppleWebKit/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  var USE_SESSION_CACHE = !(isIOS && isWebKit);

  var resolveReady;
  window.__PREVIEW_READY__ = new Promise(function (resolve) {
    resolveReady = resolve;
  });

  if (!giftId) {
    window.__BIRTHDAY_MODE__ = true;
    window.__PREVIEW_DATA__ = {
      letterTitle: "Dear Bé Thảo",
      letterBody: "Chúc mừng sinh nhật người con gái đặc biệt nhất lòng anh. Chúc em chuyện dữ hóa lành, bình an, thành công trong công việc. Chúc em tiếp tục mơ ước, vươn tới những mục tiêu lớn lao và luôn cảm thấy hạnh phúc với những gì mình có. Anh sẽ luôn ở bên em, hỗ trợ và yêu thương em, không chỉ trong những ngày vui mà còn trong những lúc khó khăn. Nếu có thể thì anh muốn cùng em, chúng ta cùng nhau vượt qua tất cả khó khăn. Hôm nay là ngày đặc biệt là năm đầu tiên anh đón sinh nhật cùng em, anh chỉ mong em cảm nhận được tình yêu anh dành cho em, không chỉ trong những lời nói mà còn trong từng hành động, từng cái nắm tay, từng cái ôm. Dù gặp anh hay không, anh đều thương em. Hy vọng trong năm tới, năm sau nữa và rất nhiều năm sau, người đón sinh nhật cùng em vẫn luôn là anh. Chúc em bốn mùa Xuân, Hạ, Thu, Đông đều hạnh phúc. Dù tụi mình có những lúc chưa hiểu hết nhau, có những khó khăn riêng nhưng mà anh vẫn muốn ở lại. Anh vẫn muốn kiên nhẫn lắng nghe và cùng em đi qua từng ngày bằng tất cả sự dịu dàng mà anh có và anh mong em sẽ luôn có những khoảnh khắc hạnh phúc, vui vẻ nhất. Cám ơn em vì đã ở đây, để anh được thương em và cảm ơn em đã đọc tới dòng này. \n\nYêu em ❤️",
      cakeInscription: "Happy Birthday!",
      musicType: "Sample",
      musicPath: "https://annibox.onrender.com/assets/musics/birthday/hppd_amee.mp3",
      customMusicUrl: null,
      photoBlobUrls: [
        './image/hinh1.jpg',
        './image/hinh9.jpg',
        './image/hinh7.jpg',
        './image/hinh5.jpg',
        './image/hinh6.jpg',
        './image/hinh8.jpg',
        './image/hinh3.jpg',
        './image/hinh4.jpg',
        './image/hinh2.jpg'
      ],
      isSavePermanent: true,
      finalGift: true
    };
    resolveReady(window.__PREVIEW_DATA__);
    return;
  }

  window.__BIRTHDAY_MODE__ = true;
  var CACHE_KEY = "bd_cache_" + giftId;
  var CACHE_TTL_MS = 5 * 60 * 1000;

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var entry = JSON.parse(raw);
      if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) {
        sessionStorage.removeItem(CACHE_KEY);
        return null;
      }
      return entry.data;
    } catch (e) { return null; }
  }

  function writeCache(data) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) { }
  }

  function mapRecord(json) {
    var record = (json && json.data) ? json.data : json;
    var cake = record.cake || {};
    var letter = record.letter || {};

    var mPath = record.musicPath || "/assets/musics/birthday/hppd_amee.mp3";
    if (mPath.indexOf("http") === -1) {
      if (mPath.indexOf("/") === 0) {
        mPath = "https://annibox.onrender.com" + mPath;
      } else {
        mPath = "https://annibox.onrender.com/" + mPath;
      }
    }

    window.__BIRTHDAY_DATA__ = record;
    window.__PREVIEW_DATA__ = {
      letterTitle: (letter.title || "").trim(),
      letterBody: (letter.body || "").trim(),
      cakeInscription: (cake.inscription || "").trim(),
      musicType: record.musicType || "Sample",
      musicPath: mPath,
      customMusicUrl: record.customMusic || null,
      photoBlobUrls: Array.isArray(cake.photos) ? cake.photos : [],
      isSavePermanent: !!record.isSavePermanent,
      finalGift: !!record.finalGift,
    };
    return window.__PREVIEW_DATA__;
  }

  var cached = USE_SESSION_CACHE ? readCache() : null;
  if (cached) {
    window.__BIRTHDAY_DATA__ = cached._raw || {};
    window.__PREVIEW_DATA__ = cached;
    resolveReady(cached);
    var API_URL = "https://giftorybee.onrender.com/api/birthdays/" + giftId;
    fetch(API_URL).then(function (r) { return r.ok ? r.json() : null; }).then(function (json) {
      if (!json) return;
      var pd = mapRecord(json);
      pd._raw = window.__BIRTHDAY_DATA__;
      if (USE_SESSION_CACHE) writeCache(pd);
    }).catch(function () { });
    return;
  }

  var API_URL = "https://giftorybee.onrender.com/api/birthdays/" + giftId;
  fetch(API_URL).then(function (res) {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }).then(function (json) {
    var pd = mapRecord(json);
    pd._raw = window.__BIRTHDAY_DATA__;
    if (USE_SESSION_CACHE) writeCache(pd);
    resolveReady(pd);
  }).catch(function (err) {
    resolveReady(null);
  });
})();