(function () {
  "use strict";

  /* Breast cancer stays in view all year. No end date.
     No match line until a named donor confirms it in writing. */
  var BREAST_FOCUS = true;
  var CAMPAIGN = "wiche_share";

  var TEXT = {
    wa: "Cancer can’t wait! In 2024 Lebanon’s registry recorded 3,754 new breast cancer cases in women. The WICHE Cancer Fund helps AUBMC patients keep their treatment going. Gifts go to AUB's US 501(c)(3). ",
    ig: "Breast cancer care at AUBMC, all year. The WICHE Cancer Fund. In 2024 Lebanon’s registry recorded 3,754 new breast cancer cases in women. Gifts go to AUB's US 501(c)(3). ",
    x: "WICHE Cancer Fund: breast cancer care at AUBMC, all year. 3,754 new cases in women in 2024, Lebanon’s national registry. ",
    li: "Breast cancer care at AUBMC, all year. The WICHE Cancer Fund helps patients get the cancer treatment they can't afford. Lebanon’s registry recorded 3,754 new breast cancer cases in women in 2024, up from 2,252 in 2012. GLOBOCAN 2024: 978 breast cancer deaths, and 38.7% of new cancers in women. Gifts go to AUB's US 501(c)(3). "
  };

  var ASK_FRIENDS = "I'm asking friends to give to the WICHE Cancer Fund at AUBMC. We help patients get the cancer treatment they can't afford. Gifts go to AUB's US 501(c)(3). ";

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
})();
