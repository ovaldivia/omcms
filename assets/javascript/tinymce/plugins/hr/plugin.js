(function () {
var hr = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var register = function (editor) {
    editor.addCommand('InsertHorizontalRule', function () {
      editor.execCommand('mceInsertContent', false, '<hr />');
    });
  };
  var $_3204h8bsjf3ft1ot = { register: register };

  var register$1 = function (editor) {
    editor.addButton('hr', {
      icon: 'hr',
      tooltip: 'Horizontal line',
      cmd: 'InsertHorizontalRule'
    });
    editor.addMenuItem('hr', {
      icon: 'hr',
      text: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      context: 'insert'
    });
  };
  var $_2ygwu0btjf3ft1ov = { register: register$1 };

  PluginManager.add('hr', function (editor) {
    $_3204h8bsjf3ft1ot.register(editor);
    $_2ygwu0btjf3ft1ov.register(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})();
