(function () {
var toc = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var I18n = tinymce.util.Tools.resolve('tinymce.util.I18n');

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var getTocClass = function (editor) {
    return editor.getParam('toc_class', 'mce-toc');
  };
  var getTocHeader = function (editor) {
    var tagName = editor.getParam('toc_header', 'h2');
    return /^h[1-6]$/.test(tagName) ? tagName : 'h2';
  };
  var getTocDepth = function (editor) {
    var depth = parseInt(editor.getParam('toc_depth', '3'), 10);
    return depth >= 1 && depth <= 9 ? depth : 3;
  };
  var $_8t05s3qxjf3ft5bj = {
    getTocClass: getTocClass,
    getTocHeader: getTocHeader,
    getTocDepth: getTocDepth
  };

  var create = function (prefix) {
    var counter = 0;
    return function () {
      var guid = new Date().getTime().toString(32);
      return prefix + guid + (counter++).toString(32);
    };
  };
  var $_59c5rbqyjf3ft5bk = { create: create };

  var tocId = $_59c5rbqyjf3ft5bk.create('mcetoc_');
  var generateSelector = function generateSelector(depth) {
    var i;
    var selector = [];
    for (i = 1; i <= depth; i++) {
      selector.push('h' + i);
    }
    return selector.join(',');
  };
  var hasHeaders = function (editor) {
    return readHeaders(editor).length > 0;
  };
  var readHeaders = function (editor) {
    var tocClass = $_8t05s3qxjf3ft5bj.getTocClass(editor);
    var headerTag = $_8t05s3qxjf3ft5bj.getTocHeader(editor);
    var selector = generateSelector($_8t05s3qxjf3ft5bj.getTocDepth(editor));
    var headers = editor.$(selector);
    if (headers.length && /^h[1-9]$/i.test(headerTag)) {
      headers = headers.filter(function (i, el) {
        return !editor.dom.hasClass(el.parentNode, tocClass);
      });
    }
    return Tools.map(headers, function (h) {
      return {
        id: h.id ? h.id : tocId(),
        level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
        title: editor.$.text(h),
        element: h
      };
    });
  };
  var getMinLevel = function (headers) {
    var i, minLevel = 9;
    for (i = 0; i < headers.length; i++) {
      if (headers[i].level < minLevel) {
        minLevel = headers[i].level;
      }
      if (minLevel === 1) {
        return minLevel;
      }
    }
    return minLevel;
  };
  var generateTitle = function (tag, title) {
    var openTag = '<' + tag + ' contenteditable="true">';
    var closeTag = '</' + tag + '>';
    return openTag + DOMUtils.DOM.encode(title) + closeTag;
  };
  var generateTocHtml = function (editor) {
    var html = generateTocContentHtml(editor);
    return '<div class="' + editor.dom.encode($_8t05s3qxjf3ft5bj.getTocClass(editor)) + '" contenteditable="false">' + html + '</div>';
  };
  var generateTocContentHtml = function (editor) {
    var html = '';
    var headers = readHeaders(editor);
    var prevLevel = getMinLevel(headers) - 1;
    var i, ii, h, nextLevel;
    if (!headers.length) {
      return '';
    }
    html += generateTitle($_8t05s3qxjf3ft5bj.getTocHeader(editor), I18n.translate('Table of Contents'));
    for (i = 0; i < headers.length; i++) {
      h = headers[i];
      h.element.id = h.id;
      nextLevel = headers[i + 1] && headers[i + 1].level;
      if (prevLevel === h.level) {
        html += '<li>';
      } else {
        for (ii = prevLevel; ii < h.level; ii++) {
          html += '<ul><li>';
        }
      }
      html += '<a href="#' + h.id + '">' + h.title + '</a>';
      if (nextLevel === h.level || !nextLevel) {
        html += '</li>';
        if (!nextLevel) {
          html += '</ul>';
        }
      } else {
        for (ii = h.level; ii > nextLevel; ii--) {
          html += '</li></ul><li>';
        }
      }
      prevLevel = h.level;
    }
    return html;
  };
  var isEmptyOrOffscren = function (editor, nodes) {
    return !nodes.length || editor.dom.getParents(nodes[0], '.mce-offscreen-selection').length > 0;
  };
  var insertToc = function (editor) {
    var tocClass = $_8t05s3qxjf3ft5bj.getTocClass(editor);
    var $tocElm = editor.$('.' + tocClass);
    if (isEmptyOrOffscren(editor, $tocElm)) {
      editor.insertContent(generateTocHtml(editor));
    } else {
      updateToc(editor);
    }
  };
  var updateToc = function (editor) {
    var tocClass = $_8t05s3qxjf3ft5bj.getTocClass(editor);
    var $tocElm = editor.$('.' + tocClass);
    if ($tocElm.length) {
      editor.undoManager.transact(function () {
        $tocElm.html(generateTocContentHtml(editor));
      });
    }
  };
  var $_gjddn7qtjf3ft5ba = {
    hasHeaders: hasHeaders,
    insertToc: insertToc,
    updateToc: updateToc
  };

  var register = function (editor) {
    editor.addCommand('mceInsertToc', function () {
      $_gjddn7qtjf3ft5ba.insertToc(editor);
    });
    editor.addCommand('mceUpdateToc', function () {
      $_gjddn7qtjf3ft5ba.updateToc(editor);
    });
  };
  var $_gejqicqsjf3ft5b7 = { register: register };

  var setup = function (editor) {
    var $ = editor.$, tocClass = $_8t05s3qxjf3ft5bj.getTocClass(editor);
    editor.on('PreProcess', function (e) {
      var $tocElm = $('.' + tocClass, e.node);
      if ($tocElm.length) {
        $tocElm.removeAttr('contentEditable');
        $tocElm.find('[contenteditable]').removeAttr('contentEditable');
      }
    });
    editor.on('SetContent', function () {
      var $tocElm = $('.' + tocClass);
      if ($tocElm.length) {
        $tocElm.attr('contentEditable', false);
        $tocElm.children(':first-child').attr('contentEditable', true);
      }
    });
  };
  var $_20zqe7qzjf3ft5bm = { setup: setup };

  var toggleState = function (editor) {
    return function (e) {
      var ctrl = e.control;
      editor.on('LoadContent SetContent change', function () {
        ctrl.disabled(editor.readonly || !$_gjddn7qtjf3ft5ba.hasHeaders(editor));
      });
    };
  };
  var isToc = function (editor) {
    return function (elm) {
      return elm && editor.dom.is(elm, '.' + $_8t05s3qxjf3ft5bj.getTocClass(editor)) && editor.getBody().contains(elm);
    };
  };
  var register$1 = function (editor) {
    editor.addButton('toc', {
      tooltip: 'Table of Contents',
      cmd: 'mceInsertToc',
      icon: 'toc',
      onPostRender: toggleState(editor)
    });
    editor.addButton('tocupdate', {
      tooltip: 'Update',
      cmd: 'mceUpdateToc',
      icon: 'reload'
    });
    editor.addMenuItem('toc', {
      text: 'Table of Contents',
      context: 'insert',
      cmd: 'mceInsertToc',
      onPostRender: toggleState(editor)
    });
    editor.addContextToolbar(isToc(editor), 'tocupdate');
  };
  var $_1h931yr0jf3ft5bp = { register: register$1 };

  PluginManager.add('toc', function (editor) {
    $_gejqicqsjf3ft5b7.register(editor);
    $_1h931yr0jf3ft5bp.register(editor);
    $_20zqe7qzjf3ft5bm.setup(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})();
