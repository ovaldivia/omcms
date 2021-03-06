(function () {
var code = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var getMinWidth = function (editor) {
    return editor.getParam('code_dialog_width', 600);
  };
  var getMinHeight = function (editor) {
    return editor.getParam('code_dialog_height', Math.min(DOMUtils.DOM.getViewPort().h - 200, 500));
  };
  var $_erh8k19ajf3ft197 = {
    getMinWidth: getMinWidth,
    getMinHeight: getMinHeight
  };

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var $_2sb7d19cjf3ft19a = {
    setContent: setContent,
    getContent: getContent
  };

  var open = function (editor) {
    var minWidth = $_erh8k19ajf3ft197.getMinWidth(editor);
    var minHeight = $_erh8k19ajf3ft197.getMinHeight(editor);
    var win = editor.windowManager.open({
      title: 'Source code',
      body: {
        type: 'textbox',
        name: 'code',
        multiline: true,
        minWidth: minWidth,
        minHeight: minHeight,
        spellcheck: false,
        style: 'direction: ltr; text-align: left'
      },
      onSubmit: function (e) {
        $_2sb7d19cjf3ft19a.setContent(editor, e.data.code);
      }
    });
    win.find('#code').value($_2sb7d19cjf3ft19a.getContent(editor));
  };
  var $_3ieyi99jf3ft196 = { open: open };

  var register = function (editor) {
    editor.addCommand('mceCodeEditor', function () {
      $_3ieyi99jf3ft196.open(editor);
    });
  };
  var $_d6by2r98jf3ft194 = { register: register };

  var register$1 = function (editor) {
    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: function () {
        $_3ieyi99jf3ft196.open(editor);
      }
    });
    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      onclick: function () {
        $_3ieyi99jf3ft196.open(editor);
      }
    });
  };
  var $_fewbp39djf3ft19c = { register: register$1 };

  PluginManager.add('code', function (editor) {
    $_d6by2r98jf3ft194.register(editor);
    $_fewbp39djf3ft19c.register(editor);
    return {};
  });
  function Plugin () {
  }

  return Plugin;

}());
})();
