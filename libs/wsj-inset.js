/*
    WSJ Dynamic Inset renderer v2.0.0
*/

var WSJInset = function(data, opts){

    opts = opts || {};
    opts.escape = (opts.escape === undefined) ? true : false;

    var template = data.serverside.template.template;
    var context = data.serverside.data.data;
    var insetHashFuncName = getRandom();

    var mustacheEscape = Mustache.escape;
    if (opts.escape === false) {
        // override default Mustache escape function
        Mustache.escape = function escapeHtml (string) {
            return String(string).replace(/[]/g, function fromEntityMap (s) {
                return entityMap[s];
            });
        }
    }

    data.serverside.data.data['insetData'] = insetHashFuncName;

    var rendered = Mustache.render(template, context);

    if (data.serverside.data.data['includeData']) {
        rendered = "<script>var " + insetHashFuncName + " = function() {return " + JSON.stringify(data.serverside.data.data) + ";}</script> "+rendered;
    }

    // return Mustache escape to default
    Mustache.escape = mustacheEscape;


    // random number generation functions
    function getRandom() {
        var numbers = "";
        for (var i = 0; i < 6; i++) {
            numbers += randomIntInc(1,10);
        }
        return "insetData_"+numbers;
    }
    function randomIntInc (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    return {
        output: rendered,
        appendTo: function(el){
            var wrapperEl = document.createElement('div');
            wrapperEl.innerHTML = rendered;
            $(el).append(wrapperEl);
        }
    }
}
WSJInset.setBreakpoints = function(wrapperEl){
    var classes = 'at4units at8units at12units at16units';
    var width = $(window).width();
    var wrapperEl = wrapperEl || 'body';
    var $wrapper = $(wrapperEl);
    if (width < 450) {
        $wrapper.removeClass(classes).addClass('at4units');
    } else if (width < 1201) {
        $wrapper.removeClass(classes).addClass('at8units');
    } else if (width < 5000) {
        $wrapper.removeClass(classes).addClass('at12units');
    } else {
        $wrapper.removeClass(classes).addClass('at16units');
    }
}

;(function($){
    $.fn.wsjInset = function(data, opts){
        var $this = this;
        var inset = WSJInset(data, opts);
        inset.appendTo($this);

        WSJInset.setBreakpoints($this);
        $(window).on('resize',function(){
            WSJInset.setBreakpoints($this)
        });

    }
}(jQuery));
