"use strict";

var PageInits = {
  getDebounce: function getDebounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
  init: function init() {
    var self = this;
    var resizeDebounce = self.getDebounce(function () {// Code...
    }, 250);
    window.addEventListener("resize", resizeDebounce);
  }
};

(function ($) {
  "use strict";

  $(document).ready(function () {
    PageInits.init();
  });
  $(window).on("load", function () {
    var resizeDebounce = PageInits.getDebounce(function () {// Code...
    }, 250);
    window.addEventListener("resize", resizeDebounce);
  });
})(jQuery);
//# sourceMappingURL=maps/all.bundle.js.map
