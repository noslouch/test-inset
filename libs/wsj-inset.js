/*
    WSJ Dynamic Inset renderer v4.0.0
    UMD template from: https://raw.githubusercontent.com/chilts/umd-template/master/template.js
*/

;(function (f) {
  // module name and requires
  var name = 'WSJInset';
  var requires = ['Mustache'];

  // CommonJS
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f.apply(null, [require('mustache')]);

  // RequireJS
  } else if (typeof define === "function" && define.amd) {
    define(requires, f);

  // <script>
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      // works providing we're not in "use strict";
      // needed for Java 8 Nashorn
      // seee https://github.com/facebook/react/issues/3037
      g = this;
    }
    g[name] = f.apply(null, requires.map(function(r) { return g[r]; }));
  }

})(function (Mustache) {
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
              var isJqueryEl = !!(el && el.jquery);
              var isSelector = (typeof el === 'string');
              if (isSelector) {
                  el = document.querySelector(el);
              } else if (isJqueryEl) {
                  el = el[0];
              }
              if (el === null || el === undefined) {
                  throw(el + ' is not a valid element');
              }
              var wrapperEl = document.createElement('div');
              var fragment = document.createRange().createContextualFragment(rendered);
              el.appendChild(fragment);
          }
      }
  }
  WSJInset.setBreakpoints = function(opts){
      opts = opts || {};
      var breakpoints = opts.breakpoints || [660, 980, 1300];
      var wrapperEl = opts.element || 'body';

      var classes = 'at4units at8units at12units at16units';
      var width = $(window).width();
      var $wrapper = $(wrapperEl);
      if (width <= breakpoints[0]) {
          $wrapper.removeClass(classes).addClass('at4units');
      } else if (width <= breakpoints[1]) {
          $wrapper.removeClass(classes).addClass('at8units');
      } else if (width <= breakpoints[2]) {
          $wrapper.removeClass(classes).addClass('at12units');
      } else {
          $wrapper.removeClass(classes).addClass('at16units');
      }
  }
  return WSJInset;
});

if ('$' in window) {
  (function($){
      $.fn.wsjInset = function(data, opts){
          var inset = WSJInset(data, opts);
          inset.appendTo(this[0]);
      }
  }(jQuery));
}
