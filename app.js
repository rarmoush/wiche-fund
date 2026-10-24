(function () {
  "use strict";

  /* Breast cancer stays in view all year. No end date.
     No match line until a named donor confirms it in writing. */
  var BREAST_FOCUS = true;
  var CAMPAIGN = "wiche_share";

  var TEXT = {
    wa: "Breast cancer is the most common cancer in Lebanon, with 3,404 new cases in 2024. The WICHE Oncology Endowed Fund at AUBMC helps patients who can't pay. Gifts go to AUB's US 501(c)(3). ",
    ig: "Breast cancer is the most common cancer in Lebanon, with 3,404 new cases in 2024. The WICHE Oncology Endowed Fund at AUBMC helps patients who can't pay. Gifts go to AUB's US 501(c)(3). ",
    x: "Breast cancer is the most common cancer in Lebanon, with 3,404 new cases in 2024. WICHE Oncology Endowed Fund at AUBMC. Gifts go to AUB's US 501(c)(3). ",
    li: "Breast cancer is the most common cancer in Lebanon, with 3,404 new cases in 2024, 19.2% of all new cancers (IARC GLOBOCAN 2024). The WICHE Oncology Endowed Fund at AUBMC helps patients who can't pay. In July 2026 the fund assisted three Lebanese women in treatment for breast cancer. Gifts go to AUB's US 501(c)(3). "
  };

  var ASK_FRIENDS = "I'm asking friends to give to the WICHE Oncology Endowed Fund at AUBMC, for cancer patients in Lebanon. Breast cancer is the most common cancer in Lebanon. Gifts go to AUB's US 501(c)(3). ";

  document.body.classList.toggle("breast-focus", BREAST_FOCUS);

  function pageUrl() {
    if (window.location.protocol === "file:") return window.location.href.split("?")[0];
    return window.location.origin + window.location.pathname;
  }

  function withUtm(source) {
    return pageUrl() + "?utm_source=" + encodeURIComponent(source) + "&utm_medium=share&utm_campaign=" + encodeURIComponent(CAMPAIGN);
  }

  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(value);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(ta);
    });
  }

  function toast(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function setShareHrefs() {
    var wa = document.getElementById("share-wa");
    var x = document.getElementById("share-x");
    var li = document.getElementById("share-li");
    if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(TEXT.wa + withUtm("whatsapp"));
    if (x) x.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(TEXT.x + withUtm("x"));
    if (li) li.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(withUtm("linkedin"));
  }

  function on(id, type, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener(type, fn);
  }

  setShareHrefs();

  on("ask-copy", "click", function () {
    copyText(ASK_FRIENDS + withUtm("friends")).then(function () {
      toast("ask-toast", "Note copied. Paste it into a chat.");
    }).catch(function () {
      toast("ask-toast", "Could not copy. Select the note and copy it yourself.");
    });
  });

  on("share-copy", "click", function () {
    copyText(withUtm("copy")).then(function () {
      toast("share-toast", "Link copied.");
    }).catch(function () {
      toast("share-toast", "Could not copy. Select the address bar instead.");
    });
  });

  on("share-ig", "click", function () {
    copyText(TEXT.ig + withUtm("ig")).then(function () {
      toast("share-toast", "Instagram text copied. Paste it into a post or story.");
    }).catch(function () {
      toast("share-toast", "Could not copy the Instagram text.");
    });
  });

  on("share-li", "click", function () {
    copyText(TEXT.li + withUtm("linkedin")).then(function () {
      toast("share-toast", "LinkedIn text copied. Paste it after the share dialog opens.");
    });
  });

  var monthly = document.getElementById("amounts-monthly");
  var onetime = document.getElementById("amounts-onetime");
  var otherWrap = document.getElementById("other-wrap");

  function syncOther() {
    var other = document.querySelector('input[name="amt-onetime"][value="other"]');
    var show = !!(other && other.checked && onetime && !onetime.hidden);
    if (otherWrap) otherWrap.hidden = !show;
  }

  function showFreq(freq) {
    var isMonthly = freq === "monthly";
    if (monthly) monthly.hidden = !isMonthly;
    if (onetime) onetime.hidden = isMonthly;
    syncOther();
  }

  document.querySelectorAll('input[name="freq"]').forEach(function (r) {
    r.addEventListener("change", function () { showFreq(r.value); });
  });
  document.querySelectorAll('input[name="amt-onetime"]').forEach(function (r) {
    r.addEventListener("change", syncOther);
  });
  var selected = document.querySelector('input[name="freq"]:checked');
  showFreq(selected ? selected.value : "monthly");
})();
