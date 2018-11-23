const PageInits = {
  getDebounce: function (func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  init: function () {
    let self = this;
    let resizeDebounce = self.getDebounce(function () {
      // Code...
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

    let resizeDebounce = PageInits.getDebounce(function() {
      // Code...
    }, 250);

    window.addEventListener("resize", resizeDebounce);
  });
})(jQuery);
