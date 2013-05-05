// Only works on inline elements!
;(function($) {
    'use strict';

    $.fn.truncate = function(size) {
        return this.each(function () {
            var elem = $(this), text = elem.text(), mid = Math.round(text.length/2), i = 0;
            while(elem.width() > size) {
                i++;
                var newText = text.substr(0,mid - 1 * i) + '…' + text.substr(mid + 1 * i, text.length);
                elem.text(newText);
            }
        });
    };
})(jQuery);