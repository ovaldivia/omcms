(function () {
var table = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var noop = function () {
    var x = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      x[_i] = arguments[_i];
    }
  };
  var noarg = function (f) {
    return function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
      return f();
    };
  };
  var compose = function (fa, fb) {
    return function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
      return fa(fb.apply(null, arguments));
    };
  };
  var constant = function (value) {
    return function () {
      return value;
    };
  };
  var identity = function (x) {
    return x;
  };
  var tripleEquals = function (a, b) {
    return a === b;
  };
  var curry = function (f) {
    var x = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      x[_i - 1] = arguments[_i];
    }
    var args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++)
      args[i - 1] = arguments[i];
    return function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
      var newArgs = new Array(arguments.length);
      for (var j = 0; j < newArgs.length; j++)
        newArgs[j] = arguments[j];
      var all = args.concat(newArgs);
      return f.apply(null, all);
    };
  };
  var not = function (f) {
    return function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
      return !f.apply(null, arguments);
    };
  };
  var die = function (msg) {
    return function () {
      throw new Error(msg);
    };
  };
  var apply = function (f) {
    return f();
  };
  var call = function (f) {
    f();
  };
  var never = constant(false);
  var always = constant(true);
  var $_6np0wpjsjf3ft34s = {
    noop: noop,
    noarg: noarg,
    compose: compose,
    constant: constant,
    identity: identity,
    tripleEquals: tripleEquals,
    curry: curry,
    not: not,
    die: die,
    apply: apply,
    call: call,
    never: never,
    always: always
  };

  var never$1 = $_6np0wpjsjf3ft34s.never;
  var always$1 = $_6np0wpjsjf3ft34s.always;
  var none = function () {
    return NONE;
  };
  var NONE = function () {
    var eq = function (o) {
      return o.isNone();
    };
    var call = function (thunk) {
      return thunk();
    };
    var id = function (n) {
      return n;
    };
    var noop = function () {
    };
    var me = {
      fold: function (n, s) {
        return n();
      },
      is: never$1,
      isSome: never$1,
      isNone: always$1,
      getOr: id,
      getOrThunk: call,
      getOrDie: function (msg) {
        throw new Error(msg || 'error: getOrDie called on none.');
      },
      or: id,
      orThunk: call,
      map: none,
      ap: none,
      each: noop,
      bind: none,
      flatten: none,
      exists: never$1,
      forall: always$1,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray: function () {
        return [];
      },
      toString: $_6np0wpjsjf3ft34s.constant('none()')
    };
    if (Object.freeze)
      Object.freeze(me);
    return me;
  }();
  var some = function (a) {
    var constant_a = function () {
      return a;
    };
    var self = function () {
      return me;
    };
    var map = function (f) {
      return some(f(a));
    };
    var bind = function (f) {
      return f(a);
    };
    var me = {
      fold: function (n, s) {
        return s(a);
      },
      is: function (v) {
        return a === v;
      },
      isSome: always$1,
      isNone: never$1,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      or: self,
      orThunk: self,
      map: map,
      ap: function (optfab) {
        return optfab.fold(none, function (fab) {
          return some(fab(a));
        });
      },
      each: function (f) {
        f(a);
      },
      bind: bind,
      flatten: constant_a,
      exists: bind,
      forall: bind,
      filter: function (f) {
        return f(a) ? me : NONE;
      },
      equals: function (o) {
        return o.is(a);
      },
      equals_: function (o, elementEq) {
        return o.fold(never$1, function (b) {
          return elementEq(a, b);
        });
      },
      toArray: function () {
        return [a];
      },
      toString: function () {
        return 'some(' + a + ')';
      }
    };
    return me;
  };
  var from = function (value) {
    return value === null || value === undefined ? NONE : some(value);
  };
  var Option = {
    some: some,
    none: none,
    from: from
  };

  var rawIndexOf = function () {
    var pIndexOf = Array.prototype.indexOf;
    var fastIndex = function (xs, x) {
      return pIndexOf.call(xs, x);
    };
    var slowIndex = function (xs, x) {
      return slowIndexOf(xs, x);
    };
    return pIndexOf === undefined ? slowIndex : fastIndex;
  }();
  var indexOf = function (xs, x) {
    var r = rawIndexOf(xs, x);
    return r === -1 ? Option.none() : Option.some(r);
  };
  var contains = function (xs, x) {
    return rawIndexOf(xs, x) > -1;
  };
  var exists = function (xs, pred) {
    return findIndex(xs, pred).isSome();
  };
  var range = function (num, f) {
    var r = [];
    for (var i = 0; i < num; i++) {
      r.push(f(i));
    }
    return r;
  };
  var chunk = function (array, size) {
    var r = [];
    for (var i = 0; i < array.length; i += size) {
      var s = array.slice(i, i + size);
      r.push(s);
    }
    return r;
  };
  var map = function (xs, f) {
    var len = xs.length;
    var r = new Array(len);
    for (var i = 0; i < len; i++) {
      var x = xs[i];
      r[i] = f(x, i, xs);
    }
    return r;
  };
  var each = function (xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var eachr = function (xs, f) {
    for (var i = xs.length - 1; i >= 0; i--) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var partition = function (xs, pred) {
    var pass = [];
    var fail = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      var arr = pred(x, i, xs) ? pass : fail;
      arr.push(x);
    }
    return {
      pass: pass,
      fail: fail
    };
  };
  var filter = function (xs, pred) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        r.push(x);
      }
    }
    return r;
  };
  var groupBy = function (xs, f) {
    if (xs.length === 0) {
      return [];
    } else {
      var wasType = f(xs[0]);
      var r = [];
      var group = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var type = f(x);
        if (type !== wasType) {
          r.push(group);
          group = [];
        }
        wasType = type;
        group.push(x);
      }
      if (group.length !== 0) {
        r.push(group);
      }
      return r;
    }
  };
  var foldr = function (xs, f, acc) {
    eachr(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var foldl = function (xs, f, acc) {
    each(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var find = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return Option.some(x);
      }
    }
    return Option.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return Option.some(i);
      }
    }
    return Option.none();
  };
  var slowIndexOf = function (xs, x) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (xs[i] === x) {
        return i;
      }
    }
    return -1;
  };
  var push = Array.prototype.push;
  var flatten = function (xs) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (!Array.prototype.isPrototypeOf(xs[i]))
        throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
      push.apply(r, xs[i]);
    }
    return r;
  };
  var bind = function (xs, f) {
    var output = map(xs, f);
    return flatten(output);
  };
  var forall = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      var x = xs[i];
      if (pred(x, i, xs) !== true) {
        return false;
      }
    }
    return true;
  };
  var equal = function (a1, a2) {
    return a1.length === a2.length && forall(a1, function (x, i) {
      return x === a2[i];
    });
  };
  var slice = Array.prototype.slice;
  var reverse = function (xs) {
    var r = slice.call(xs, 0);
    r.reverse();
    return r;
  };
  var difference = function (a1, a2) {
    return filter(a1, function (x) {
      return !contains(a2, x);
    });
  };
  var mapToObject = function (xs, f) {
    var r = {};
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      r[String(x)] = f(x, i);
    }
    return r;
  };
  var pure = function (x) {
    return [x];
  };
  var sort = function (xs, comparator) {
    var copy = slice.call(xs, 0);
    copy.sort(comparator);
    return copy;
  };
  var head = function (xs) {
    return xs.length === 0 ? Option.none() : Option.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1]);
  };
  var $_5qd2tsjqjf3ft34c = {
    map: map,
    each: each,
    eachr: eachr,
    partition: partition,
    filter: filter,
    groupBy: groupBy,
    indexOf: indexOf,
    foldr: foldr,
    foldl: foldl,
    find: find,
    findIndex: findIndex,
    flatten: flatten,
    bind: bind,
    forall: forall,
    exists: exists,
    contains: contains,
    equal: equal,
    reverse: reverse,
    chunk: chunk,
    difference: difference,
    mapToObject: mapToObject,
    pure: pure,
    sort: sort,
    range: range,
    head: head,
    last: last
  };

  var keys = function () {
    var fastKeys = Object.keys;
    var slowKeys = function (o) {
      var r = [];
      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          r.push(i);
        }
      }
      return r;
    };
    return fastKeys === undefined ? slowKeys : fastKeys;
  }();
  var each$1 = function (obj, f) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      f(x, i, obj);
    }
  };
  var objectMap = function (obj, f) {
    return tupleMap(obj, function (x, i, obj) {
      return {
        k: i,
        v: f(x, i, obj)
      };
    });
  };
  var tupleMap = function (obj, f) {
    var r = {};
    each$1(obj, function (x, i) {
      var tuple = f(x, i, obj);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  var bifilter = function (obj, pred) {
    var t = {};
    var f = {};
    each$1(obj, function (x, i) {
      var branch = pred(x, i) ? t : f;
      branch[i] = x;
    });
    return {
      t: t,
      f: f
    };
  };
  var mapToArray = function (obj, f) {
    var r = [];
    each$1(obj, function (value, name) {
      r.push(f(value, name));
    });
    return r;
  };
  var find$1 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return Option.some(x);
      }
    }
    return Option.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_6j7iurjujf3ft35n = {
    bifilter: bifilter,
    each: each$1,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$1,
    keys: keys,
    values: values,
    size: size
  };

  function Immutable () {
    var fields = arguments;
    return function () {
      var values = new Array(arguments.length);
      for (var i = 0; i < values.length; i++)
        values[i] = arguments[i];
      if (fields.length !== values.length)
        throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');
      var struct = {};
      $_5qd2tsjqjf3ft34c.each(fields, function (name, i) {
        struct[name] = $_6np0wpjsjf3ft34s.constant(values[i]);
      });
      return struct;
    };
  }

  var typeOf = function (x) {
    if (x === null)
      return 'null';
    var t = typeof x;
    if (t === 'object' && Array.prototype.isPrototypeOf(x))
      return 'array';
    if (t === 'object' && String.prototype.isPrototypeOf(x))
      return 'string';
    return t;
  };
  var isType = function (type) {
    return function (value) {
      return typeOf(value) === type;
    };
  };
  var $_424octjzjf3ft364 = {
    isString: isType('string'),
    isObject: isType('object'),
    isArray: isType('array'),
    isNull: isType('null'),
    isBoolean: isType('boolean'),
    isUndefined: isType('undefined'),
    isFunction: isType('function'),
    isNumber: isType('number')
  };

  var sort$1 = function (arr) {
    return arr.slice(0).sort();
  };
  var reqMessage = function (required, keys) {
    throw new Error('All required keys (' + sort$1(required).join(', ') + ') were not specified. Specified keys were: ' + sort$1(keys).join(', ') + '.');
  };
  var unsuppMessage = function (unsupported) {
    throw new Error('Unsupported keys for object: ' + sort$1(unsupported).join(', '));
  };
  var validateStrArr = function (label, array) {
    if (!$_424octjzjf3ft364.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_5qd2tsjqjf3ft34c.each(array, function (a) {
      if (!$_424octjzjf3ft364.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_5qd2tsjqjf3ft34c.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_4m4npujyjf3ft361 = {
    sort: sort$1,
    reqMessage: reqMessage,
    unsuppMessage: unsuppMessage,
    validateStrArr: validateStrArr,
    invalidTypeMessage: invalidTypeMessage,
    checkDupes: checkDupes
  };

  function MixedBag (required, optional) {
    var everything = required.concat(optional);
    if (everything.length === 0)
      throw new Error('You must specify at least one required or optional field.');
    $_4m4npujyjf3ft361.validateStrArr('required', required);
    $_4m4npujyjf3ft361.validateStrArr('optional', optional);
    $_4m4npujyjf3ft361.checkDupes(everything);
    return function (obj) {
      var keys = $_6j7iurjujf3ft35n.keys(obj);
      var allReqd = $_5qd2tsjqjf3ft34c.forall(required, function (req) {
        return $_5qd2tsjqjf3ft34c.contains(keys, req);
      });
      if (!allReqd)
        $_4m4npujyjf3ft361.reqMessage(required, keys);
      var unsupported = $_5qd2tsjqjf3ft34c.filter(keys, function (key) {
        return !$_5qd2tsjqjf3ft34c.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_4m4npujyjf3ft361.unsuppMessage(unsupported);
      var r = {};
      $_5qd2tsjqjf3ft34c.each(required, function (req) {
        r[req] = $_6np0wpjsjf3ft34s.constant(obj[req]);
      });
      $_5qd2tsjqjf3ft34c.each(optional, function (opt) {
        r[opt] = $_6np0wpjsjf3ft34s.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]) : Option.none());
      });
      return r;
    };
  }

  var $_4bo75gjvjf3ft35r = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var dimensions = $_4bo75gjvjf3ft35r.immutable('width', 'height');
  var grid = $_4bo75gjvjf3ft35r.immutable('rows', 'columns');
  var address = $_4bo75gjvjf3ft35r.immutable('row', 'column');
  var coords = $_4bo75gjvjf3ft35r.immutable('x', 'y');
  var detail = $_4bo75gjvjf3ft35r.immutable('element', 'rowspan', 'colspan');
  var detailnew = $_4bo75gjvjf3ft35r.immutable('element', 'rowspan', 'colspan', 'isNew');
  var extended = $_4bo75gjvjf3ft35r.immutable('element', 'rowspan', 'colspan', 'row', 'column');
  var rowdata = $_4bo75gjvjf3ft35r.immutable('element', 'cells', 'section');
  var elementnew = $_4bo75gjvjf3ft35r.immutable('element', 'isNew');
  var rowdatanew = $_4bo75gjvjf3ft35r.immutable('element', 'cells', 'section', 'isNew');
  var rowcells = $_4bo75gjvjf3ft35r.immutable('cells', 'section');
  var rowdetails = $_4bo75gjvjf3ft35r.immutable('details', 'section');
  var bounds = $_4bo75gjvjf3ft35r.immutable('startRow', 'startCol', 'finishRow', 'finishCol');
  var $_9kexg1k1jf3ft36h = {
    dimensions: dimensions,
    grid: grid,
    address: address,
    coords: coords,
    extended: extended,
    detail: detail,
    detailnew: detailnew,
    rowdata: rowdata,
    elementnew: elementnew,
    rowdatanew: rowdatanew,
    rowcells: rowcells,
    rowdetails: rowdetails,
    bounds: bounds
  };

  var fromHtml = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    if (!div.hasChildNodes() || div.childNodes.length > 1) {
      console.error('HTML does not have a single root node', html);
      throw 'HTML must have a single root node';
    }
    return fromDom(div.childNodes[0]);
  };
  var fromTag = function (tag, scope) {
    var doc = scope || document;
    var node = doc.createElement(tag);
    return fromDom(node);
  };
  var fromText = function (text, scope) {
    var doc = scope || document;
    var node = doc.createTextNode(text);
    return fromDom(node);
  };
  var fromDom = function (node) {
    if (node === null || node === undefined)
      throw new Error('Node cannot be null or undefined');
    return { dom: $_6np0wpjsjf3ft34s.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return Option.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_cjzqfhk5jf3ft37x = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_7t4t11k6jf3ft382 = {
    ATTRIBUTE: 2,
    CDATA_SECTION: 4,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    ELEMENT: 1,
    TEXT: 3,
    PROCESSING_INSTRUCTION: 7,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    NOTATION: 12
  };

  var ELEMENT = $_7t4t11k6jf3ft382.ELEMENT;
  var DOCUMENT = $_7t4t11k6jf3ft382.DOCUMENT;
  var is = function (element, selector) {
    var elem = element.dom();
    if (elem.nodeType !== ELEMENT)
      return false;
    else if (elem.matches !== undefined)
      return elem.matches(selector);
    else if (elem.msMatchesSelector !== undefined)
      return elem.msMatchesSelector(selector);
    else if (elem.webkitMatchesSelector !== undefined)
      return elem.webkitMatchesSelector(selector);
    else if (elem.mozMatchesSelector !== undefined)
      return elem.mozMatchesSelector(selector);
    else
      throw new Error('Browser lacks native selectors');
  };
  var bypassSelector = function (dom) {
    return dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT || dom.childElementCount === 0;
  };
  var all = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? [] : $_5qd2tsjqjf3ft34c.map(base.querySelectorAll(selector), $_cjzqfhk5jf3ft37x.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var $_31lswek4jf3ft37j = {
    all: all,
    is: is,
    one: one
  };

  var toArray = function (target, f) {
    var r = [];
    var recurse = function (e) {
      r.push(e);
      return f(e);
    };
    var cur = f(target);
    do {
      cur = cur.bind(recurse);
    } while (cur.isSome());
    return r;
  };
  var $_3y9ztlk8jf3ft38j = { toArray: toArray };

  var global = typeof window !== 'undefined' ? window : Function('return this;')();

  var path = function (parts, scope) {
    var o = scope !== undefined && scope !== null ? scope : global;
    for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
      o = o[parts[i]];
    return o;
  };
  var resolve = function (p, scope) {
    var parts = p.split('.');
    return path(parts, scope);
  };
  var step = function (o, part) {
    if (o[part] === undefined || o[part] === null)
      o[part] = {};
    return o[part];
  };
  var forge = function (parts, target) {
    var o = target !== undefined ? target : global;
    for (var i = 0; i < parts.length; ++i)
      o = step(o, parts[i]);
    return o;
  };
  var namespace = function (name, target) {
    var parts = name.split('.');
    return forge(parts, target);
  };
  var $_3q05pikcjf3ft394 = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_3q05pikcjf3ft394.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_35ue5dkbjf3ft390 = { getOrDie: getOrDie };

  var node = function () {
    var f = $_35ue5dkbjf3ft390.getOrDie('Node');
    return f;
  };
  var compareDocumentPosition = function (a, b, match) {
    return (a.compareDocumentPosition(b) & match) !== 0;
  };
  var documentPositionPreceding = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING);
  };
  var documentPositionContainedBy = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY);
  };
  var $_1mk7dekajf3ft38y = {
    documentPositionPreceding: documentPositionPreceding,
    documentPositionContainedBy: documentPositionContainedBy
  };

  var cached = function (f) {
    var called = false;
    var r;
    return function () {
      if (!called) {
        called = true;
        r = f.apply(null, arguments);
      }
      return r;
    };
  };
  var $_5lrs8rkfjf3ft39a = { cached: cached };

  var firstMatch = function (regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s))
        return x;
    }
    return undefined;
  };
  var find$2 = function (regexes, agent) {
    var r = firstMatch(regexes, agent);
    if (!r)
      return {
        major: 0,
        minor: 0
      };
    var group = function (i) {
      return Number(agent.replace(r, '$' + i));
    };
    return nu(group(1), group(2));
  };
  var detect = function (versionRegexes, agent) {
    var cleanedAgent = String(agent).toLowerCase();
    if (versionRegexes.length === 0)
      return unknown();
    return find$2(versionRegexes, cleanedAgent);
  };
  var unknown = function () {
    return nu(0, 0);
  };
  var nu = function (major, minor) {
    return {
      major: major,
      minor: minor
    };
  };
  var $_4bqh83kijf3ft39h = {
    nu: nu,
    detect: detect,
    unknown: unknown
  };

  var edge = 'Edge';
  var chrome = 'Chrome';
  var ie = 'IE';
  var opera = 'Opera';
  var firefox = 'Firefox';
  var safari = 'Safari';
  var isBrowser = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$1 = function () {
    return nu$1({
      current: undefined,
      version: $_4bqh83kijf3ft39h.unknown()
    });
  };
  var nu$1 = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isEdge: isBrowser(edge, current),
      isChrome: isBrowser(chrome, current),
      isIE: isBrowser(ie, current),
      isOpera: isBrowser(opera, current),
      isFirefox: isBrowser(firefox, current),
      isSafari: isBrowser(safari, current)
    };
  };
  var $_6w1hyzkhjf3ft39e = {
    unknown: unknown$1,
    nu: nu$1,
    edge: $_6np0wpjsjf3ft34s.constant(edge),
    chrome: $_6np0wpjsjf3ft34s.constant(chrome),
    ie: $_6np0wpjsjf3ft34s.constant(ie),
    opera: $_6np0wpjsjf3ft34s.constant(opera),
    firefox: $_6np0wpjsjf3ft34s.constant(firefox),
    safari: $_6np0wpjsjf3ft34s.constant(safari)
  };

  var windows = 'Windows';
  var ios = 'iOS';
  var android = 'Android';
  var linux = 'Linux';
  var osx = 'OSX';
  var solaris = 'Solaris';
  var freebsd = 'FreeBSD';
  var isOS = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$2 = function () {
    return nu$2({
      current: undefined,
      version: $_4bqh83kijf3ft39h.unknown()
    });
  };
  var nu$2 = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isWindows: isOS(windows, current),
      isiOS: isOS(ios, current),
      isAndroid: isOS(android, current),
      isOSX: isOS(osx, current),
      isLinux: isOS(linux, current),
      isSolaris: isOS(solaris, current),
      isFreeBSD: isOS(freebsd, current)
    };
  };
  var $_1kjde0kjjf3ft39j = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_6np0wpjsjf3ft34s.constant(windows),
    ios: $_6np0wpjsjf3ft34s.constant(ios),
    android: $_6np0wpjsjf3ft34s.constant(android),
    linux: $_6np0wpjsjf3ft34s.constant(linux),
    osx: $_6np0wpjsjf3ft34s.constant(osx),
    solaris: $_6np0wpjsjf3ft34s.constant(solaris),
    freebsd: $_6np0wpjsjf3ft34s.constant(freebsd)
  };

  function DeviceType (os, browser, userAgent) {
    var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
    var isiPhone = os.isiOS() && !isiPad;
    var isAndroid3 = os.isAndroid() && os.version.major === 3;
    var isAndroid4 = os.isAndroid() && os.version.major === 4;
    var isTablet = isiPad || isAndroid3 || isAndroid4 && /mobile/i.test(userAgent) === true;
    var isTouch = os.isiOS() || os.isAndroid();
    var isPhone = isTouch && !isTablet;
    var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
    return {
      isiPad: $_6np0wpjsjf3ft34s.constant(isiPad),
      isiPhone: $_6np0wpjsjf3ft34s.constant(isiPhone),
      isTablet: $_6np0wpjsjf3ft34s.constant(isTablet),
      isPhone: $_6np0wpjsjf3ft34s.constant(isPhone),
      isTouch: $_6np0wpjsjf3ft34s.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_6np0wpjsjf3ft34s.constant(iOSwebview)
    };
  }

  var detect$1 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_5qd2tsjqjf3ft34c.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$1(browsers, userAgent).map(function (browser) {
      var version = $_4bqh83kijf3ft39h.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$1(oses, userAgent).map(function (os) {
      var version = $_4bqh83kijf3ft39h.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_59bnyekljf3ft39v = {
    detectBrowser: detectBrowser,
    detectOs: detectOs
  };

  var addToStart = function (str, prefix) {
    return prefix + str;
  };
  var addToEnd = function (str, suffix) {
    return str + suffix;
  };
  var removeFromStart = function (str, numChars) {
    return str.substring(numChars);
  };
  var removeFromEnd = function (str, numChars) {
    return str.substring(0, str.length - numChars);
  };
  var $_b56z11kojf3ft3aa = {
    addToStart: addToStart,
    addToEnd: addToEnd,
    removeFromStart: removeFromStart,
    removeFromEnd: removeFromEnd
  };

  var first = function (str, count) {
    return str.substr(0, count);
  };
  var last$1 = function (str, count) {
    return str.substr(str.length - count, str.length);
  };
  var head$1 = function (str) {
    return str === '' ? Option.none() : Option.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? Option.none() : Option.some(str.substring(1));
  };
  var $_d5anlkkpjf3ft3ac = {
    first: first,
    last: last$1,
    head: head$1,
    tail: tail
  };

  var checkRange = function (str, substr, start) {
    if (substr === '')
      return true;
    if (str.length < substr.length)
      return false;
    var x = str.substr(start, start + substr.length);
    return x === substr;
  };
  var supplant = function (str, obj) {
    var isStringOrNumber = function (a) {
      var t = typeof a;
      return t === 'string' || t === 'number';
    };
    return str.replace(/\${([^{}]*)}/g, function (a, b) {
      var value = obj[b];
      return isStringOrNumber(value) ? value : a;
    });
  };
  var removeLeading = function (str, prefix) {
    return startsWith(str, prefix) ? $_b56z11kojf3ft3aa.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_b56z11kojf3ft3aa.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_b56z11kojf3ft3aa.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_b56z11kojf3ft3aa.addToEnd(str, prefix);
  };
  var contains$1 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_d5anlkkpjf3ft3ac.head(str).bind(function (head) {
      return $_d5anlkkpjf3ft3ac.tail(str).map(function (tail) {
        return head.toUpperCase() + tail;
      });
    }).getOr(str);
  };
  var startsWith = function (str, prefix) {
    return checkRange(str, prefix, 0);
  };
  var endsWith = function (str, suffix) {
    return checkRange(str, suffix, str.length - suffix.length);
  };
  var trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  };
  var lTrim = function (str) {
    return str.replace(/^\s+/g, '');
  };
  var rTrim = function (str) {
    return str.replace(/\s+$/g, '');
  };
  var $_65qcg9knjf3ft3a7 = {
    supplant: supplant,
    startsWith: startsWith,
    removeLeading: removeLeading,
    removeTrailing: removeTrailing,
    ensureLeading: ensureLeading,
    ensureTrailing: ensureTrailing,
    endsWith: endsWith,
    contains: contains$1,
    trim: trim,
    lTrim: lTrim,
    rTrim: rTrim,
    capitalize: capitalize
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function (target) {
    return function (uastring) {
      return $_65qcg9knjf3ft3a7.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_65qcg9knjf3ft3a7.contains(uastring, 'edge/') && $_65qcg9knjf3ft3a7.contains(uastring, 'chrome') && $_65qcg9knjf3ft3a7.contains(uastring, 'safari') && $_65qcg9knjf3ft3a7.contains(uastring, 'applewebkit');
        return monstrosity;
      }
    },
    {
      name: 'Chrome',
      versionRegexes: [
        /.*?chrome\/([0-9]+)\.([0-9]+).*/,
        normalVersionRegex
      ],
      search: function (uastring) {
        return $_65qcg9knjf3ft3a7.contains(uastring, 'chrome') && !$_65qcg9knjf3ft3a7.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_65qcg9knjf3ft3a7.contains(uastring, 'msie') || $_65qcg9knjf3ft3a7.contains(uastring, 'trident');
      }
    },
    {
      name: 'Opera',
      versionRegexes: [
        normalVersionRegex,
        /.*?opera\/([0-9]+)\.([0-9]+).*/
      ],
      search: checkContains('opera')
    },
    {
      name: 'Firefox',
      versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
      search: checkContains('firefox')
    },
    {
      name: 'Safari',
      versionRegexes: [
        normalVersionRegex,
        /.*?cpu os ([0-9]+)_([0-9]+).*/
      ],
      search: function (uastring) {
        return ($_65qcg9knjf3ft3a7.contains(uastring, 'safari') || $_65qcg9knjf3ft3a7.contains(uastring, 'mobile/')) && $_65qcg9knjf3ft3a7.contains(uastring, 'applewebkit');
      }
    }
  ];
  var oses = [
    {
      name: 'Windows',
      search: checkContains('win'),
      versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'iOS',
      search: function (uastring) {
        return $_65qcg9knjf3ft3a7.contains(uastring, 'iphone') || $_65qcg9knjf3ft3a7.contains(uastring, 'ipad');
      },
      versionRegexes: [
        /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
        /.*cpu os ([0-9]+)_([0-9]+).*/,
        /.*cpu iphone os ([0-9]+)_([0-9]+).*/
      ]
    },
    {
      name: 'Android',
      search: checkContains('android'),
      versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'OSX',
      search: checkContains('os x'),
      versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
    },
    {
      name: 'Linux',
      search: checkContains('linux'),
      versionRegexes: []
    },
    {
      name: 'Solaris',
      search: checkContains('sunos'),
      versionRegexes: []
    },
    {
      name: 'FreeBSD',
      search: checkContains('freebsd'),
      versionRegexes: []
    }
  ];
  var $_9jsbzfkmjf3ft3a0 = {
    browsers: $_6np0wpjsjf3ft34s.constant(browsers),
    oses: $_6np0wpjsjf3ft34s.constant(oses)
  };

  var detect$2 = function (userAgent) {
    var browsers = $_9jsbzfkmjf3ft3a0.browsers();
    var oses = $_9jsbzfkmjf3ft3a0.oses();
    var browser = $_59bnyekljf3ft39v.detectBrowser(browsers, userAgent).fold($_6w1hyzkhjf3ft39e.unknown, $_6w1hyzkhjf3ft39e.nu);
    var os = $_59bnyekljf3ft39v.detectOs(oses, userAgent).fold($_1kjde0kjjf3ft39j.unknown, $_1kjde0kjjf3ft39j.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_c9kwpzkgjf3ft39c = { detect: detect$2 };

  var detect$3 = $_5lrs8rkfjf3ft39a.cached(function () {
    var userAgent = navigator.userAgent;
    return $_c9kwpzkgjf3ft39c.detect(userAgent);
  });
  var $_8vnd6hkejf3ft397 = { detect: detect$3 };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_5qd2tsjqjf3ft34c.exists(elements, $_6np0wpjsjf3ft34s.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_1mk7dekajf3ft38y.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = $_8vnd6hkejf3ft397.detect().browser;
  var contains$2 = browser.isIE() ? ieContains : regularContains;
  var $_avffyek9jf3ft38l = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains$2,
    is: $_31lswek4jf3ft37j.is
  };

  var owner = function (element) {
    return $_cjzqfhk5jf3ft37x.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_cjzqfhk5jf3ft37x.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_cjzqfhk5jf3ft37x.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return Option.from(dom.parentNode).map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var findIndex$1 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_5qd2tsjqjf3ft34c.findIndex(kin, function (elem) {
        return $_avffyek9jf3ft38l.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_424octjzjf3ft364.isFunction(isRoot) ? isRoot : $_6np0wpjsjf3ft34s.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_cjzqfhk5jf3ft37x.fromDom(rawParent);
      ret.push(parent);
      if (stop(parent) === true)
        break;
      else
        dom = rawParent;
    }
    return ret;
  };
  var siblings = function (element) {
    var filterSelf = function (elements) {
      return $_5qd2tsjqjf3ft34c.filter(elements, function (x) {
        return !$_avffyek9jf3ft38l.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return Option.from(dom.offsetParent).map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return Option.from(dom.previousSibling).map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return Option.from(dom.nextSibling).map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var prevSiblings = function (element) {
    return $_5qd2tsjqjf3ft34c.reverse($_3y9ztlk8jf3ft38j.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_3y9ztlk8jf3ft38j.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_5qd2tsjqjf3ft34c.map(dom.childNodes, $_cjzqfhk5jf3ft37x.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return Option.from(children[index]).map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var firstChild = function (element) {
    return child(element, 0);
  };
  var lastChild = function (element) {
    return child(element, element.dom().childNodes.length - 1);
  };
  var childNodesCount = function (element) {
    return element.dom().childNodes.length;
  };
  var hasChildNodes = function (element) {
    return element.dom().hasChildNodes();
  };
  var spot = $_4bo75gjvjf3ft35r.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_a4gvewk7jf3ft384 = {
    owner: owner,
    defaultView: defaultView,
    documentElement: documentElement,
    parent: parent,
    findIndex: findIndex$1,
    parents: parents,
    siblings: siblings,
    prevSibling: prevSibling,
    offsetParent: offsetParent,
    prevSiblings: prevSiblings,
    nextSibling: nextSibling,
    nextSiblings: nextSiblings,
    children: children,
    child: child,
    firstChild: firstChild,
    lastChild: lastChild,
    childNodesCount: childNodesCount,
    hasChildNodes: hasChildNodes,
    leaf: leaf
  };

  var firstLayer = function (scope, selector) {
    return filterFirstLayer(scope, selector, $_6np0wpjsjf3ft34s.constant(true));
  };
  var filterFirstLayer = function (scope, selector, predicate) {
    return $_5qd2tsjqjf3ft34c.bind($_a4gvewk7jf3ft384.children(scope), function (x) {
      return $_31lswek4jf3ft37j.is(x, selector) ? predicate(x) ? [x] : [] : filterFirstLayer(x, selector, predicate);
    });
  };
  var $_5k7mtok3jf3ft377 = {
    firstLayer: firstLayer,
    filterFirstLayer: filterFirstLayer
  };

  var name = function (element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function (element) {
    return element.dom().nodeType;
  };
  var value = function (element) {
    return element.dom().nodeValue;
  };
  var isType$1 = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_7t4t11k6jf3ft382.COMMENT || name(element) === '#comment';
  };
  var isElement = isType$1($_7t4t11k6jf3ft382.ELEMENT);
  var isText = isType$1($_7t4t11k6jf3ft382.TEXT);
  var isDocument = isType$1($_7t4t11k6jf3ft382.DOCUMENT);
  var $_3seq30krjf3ft3as = {
    name: name,
    type: type,
    value: value,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var rawSet = function (dom, key, value) {
    if ($_424octjzjf3ft364.isString(value) || $_424octjzjf3ft364.isBoolean(value) || $_424octjzjf3ft364.isNumber(value)) {
      dom.setAttribute(key, value + '');
    } else {
      console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
      throw new Error('Attribute value was not simple');
    }
  };
  var set = function (element, key, value) {
    rawSet(element.dom(), key, value);
  };
  var setAll = function (element, attrs) {
    var dom = element.dom();
    $_6j7iurjujf3ft35n.each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get = function (element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has = function (element, key) {
    var dom = element.dom();
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
  };
  var remove = function (element, key) {
    element.dom().removeAttribute(key);
  };
  var hasNone = function (element) {
    var attrs = element.dom().attributes;
    return attrs === undefined || attrs === null || attrs.length === 0;
  };
  var clone = function (element) {
    return $_5qd2tsjqjf3ft34c.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne = function (source, destination, attr) {
    if (has(source, attr) && !has(destination, attr))
      set(destination, attr, get(source, attr));
  };
  var transfer = function (source, destination, attrs) {
    if (!$_3seq30krjf3ft3as.isElement(source) || !$_3seq30krjf3ft3as.isElement(destination))
      return;
    $_5qd2tsjqjf3ft34c.each(attrs, function (attr) {
      transferOne(source, destination, attr);
    });
  };
  var $_fcjbkgkqjf3ft3af = {
    clone: clone,
    set: set,
    setAll: setAll,
    get: get,
    has: has,
    remove: remove,
    hasNone: hasNone,
    transfer: transfer
  };

  var inBody = function (element) {
    var dom = $_3seq30krjf3ft3as.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_5lrs8rkfjf3ft39a.cached(function () {
    return getBody($_cjzqfhk5jf3ft37x.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_cjzqfhk5jf3ft37x.fromDom(body);
  };
  var $_5ev9q6kujf3ft3b4 = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var all$1 = function (predicate) {
    return descendants($_5ev9q6kujf3ft3b4.body(), predicate);
  };
  var ancestors = function (scope, predicate, isRoot) {
    return $_5qd2tsjqjf3ft34c.filter($_a4gvewk7jf3ft384.parents(scope, isRoot), predicate);
  };
  var siblings$1 = function (scope, predicate) {
    return $_5qd2tsjqjf3ft34c.filter($_a4gvewk7jf3ft384.siblings(scope), predicate);
  };
  var children$1 = function (scope, predicate) {
    return $_5qd2tsjqjf3ft34c.filter($_a4gvewk7jf3ft384.children(scope), predicate);
  };
  var descendants = function (scope, predicate) {
    var result = [];
    $_5qd2tsjqjf3ft34c.each($_a4gvewk7jf3ft384.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants(x, predicate));
    });
    return result;
  };
  var $_aisdkbktjf3ft3ay = {
    all: all$1,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var all$2 = function (selector) {
    return $_31lswek4jf3ft37j.all(selector);
  };
  var ancestors$1 = function (scope, selector, isRoot) {
    return $_aisdkbktjf3ft3ay.ancestors(scope, function (e) {
      return $_31lswek4jf3ft37j.is(e, selector);
    }, isRoot);
  };
  var siblings$2 = function (scope, selector) {
    return $_aisdkbktjf3ft3ay.siblings(scope, function (e) {
      return $_31lswek4jf3ft37j.is(e, selector);
    });
  };
  var children$2 = function (scope, selector) {
    return $_aisdkbktjf3ft3ay.children(scope, function (e) {
      return $_31lswek4jf3ft37j.is(e, selector);
    });
  };
  var descendants$1 = function (scope, selector) {
    return $_31lswek4jf3ft37j.all(selector, scope);
  };
  var $_6pynzqksjf3ft3aw = {
    all: all$2,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  function ClosestOrAncestor (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? Option.some(scope) : $_424octjzjf3ft364.isFunction(isRoot) && isRoot(scope) ? Option.none() : ancestor(scope, a, isRoot);
  }

  var first$1 = function (predicate) {
    return descendant($_5ev9q6kujf3ft3b4.body(), predicate);
  };
  var ancestor = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_424octjzjf3ft364.isFunction(isRoot) ? isRoot : $_6np0wpjsjf3ft34s.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_cjzqfhk5jf3ft37x.fromDom(element);
      if (predicate(el))
        return Option.some(el);
      else if (stop(el))
        break;
    }
    return Option.none();
  };
  var closest = function (scope, predicate, isRoot) {
    var is = function (scope) {
      return predicate(scope);
    };
    return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
  };
  var sibling = function (scope, predicate) {
    var element = scope.dom();
    if (!element.parentNode)
      return Option.none();
    return child$1($_cjzqfhk5jf3ft37x.fromDom(element.parentNode), function (x) {
      return !$_avffyek9jf3ft38l.eq(scope, x) && predicate(x);
    });
  };
  var child$1 = function (scope, predicate) {
    var result = $_5qd2tsjqjf3ft34c.find(scope.dom().childNodes, $_6np0wpjsjf3ft34s.compose(predicate, $_cjzqfhk5jf3ft37x.fromDom));
    return result.map($_cjzqfhk5jf3ft37x.fromDom);
  };
  var descendant = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_cjzqfhk5jf3ft37x.fromDom(element.childNodes[i])))
          return Option.some($_cjzqfhk5jf3ft37x.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return Option.none();
    };
    return descend(scope.dom());
  };
  var $_4np8xgkwjf3ft3bp = {
    first: first$1,
    ancestor: ancestor,
    closest: closest,
    sibling: sibling,
    child: child$1,
    descendant: descendant
  };

  var first$2 = function (selector) {
    return $_31lswek4jf3ft37j.one(selector);
  };
  var ancestor$1 = function (scope, selector, isRoot) {
    return $_4np8xgkwjf3ft3bp.ancestor(scope, function (e) {
      return $_31lswek4jf3ft37j.is(e, selector);
    }, isRoot);
  };
  var sibling$1 = function (scope, selector) {
    return $_4np8xgkwjf3ft3bp.sibling(scope, function (e) {
      return $_31lswek4jf3ft37j.is(e, selector);
    });
  };
  var child$2 = function (scope, selector) {
    return $_4np8xgkwjf3ft3bp.child(scope, function (e) {
      return $_31lswek4jf3ft37j.is(e, selector);
    });
  };
  var descendant$1 = function (scope, selector) {
    return $_31lswek4jf3ft37j.one(selector, scope);
  };
  var closest$1 = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_31lswek4jf3ft37j.is, ancestor$1, scope, selector, isRoot);
  };
  var $_fhotvakvjf3ft3bm = {
    first: first$2,
    ancestor: ancestor$1,
    sibling: sibling$1,
    child: child$2,
    descendant: descendant$1,
    closest: closest$1
  };

  var lookup = function (tags, element, _isRoot) {
    var isRoot = _isRoot !== undefined ? _isRoot : $_6np0wpjsjf3ft34s.constant(false);
    if (isRoot(element))
      return Option.none();
    if ($_5qd2tsjqjf3ft34c.contains(tags, $_3seq30krjf3ft3as.name(element)))
      return Option.some(element);
    var isRootOrUpperTable = function (element) {
      return $_31lswek4jf3ft37j.is(element, 'table') || isRoot(element);
    };
    return $_fhotvakvjf3ft3bm.ancestor(element, tags.join(','), isRootOrUpperTable);
  };
  var cell = function (element, isRoot) {
    return lookup([
      'td',
      'th'
    ], element, isRoot);
  };
  var cells = function (ancestor) {
    return $_5k7mtok3jf3ft377.firstLayer(ancestor, 'th,td');
  };
  var notCell = function (element, isRoot) {
    return lookup([
      'caption',
      'tr',
      'tbody',
      'tfoot',
      'thead'
    ], element, isRoot);
  };
  var neighbours = function (selector, element) {
    return $_a4gvewk7jf3ft384.parent(element).map(function (parent) {
      return $_6pynzqksjf3ft3aw.children(parent, selector);
    });
  };
  var neighbourCells = $_6np0wpjsjf3ft34s.curry(neighbours, 'th,td');
  var neighbourRows = $_6np0wpjsjf3ft34s.curry(neighbours, 'tr');
  var firstCell = function (ancestor) {
    return $_fhotvakvjf3ft3bm.descendant(ancestor, 'th,td');
  };
  var table = function (element, isRoot) {
    return $_fhotvakvjf3ft3bm.closest(element, 'table', isRoot);
  };
  var row = function (element, isRoot) {
    return lookup(['tr'], element, isRoot);
  };
  var rows = function (ancestor) {
    return $_5k7mtok3jf3ft377.firstLayer(ancestor, 'tr');
  };
  var attr = function (element, property) {
    return parseInt($_fcjbkgkqjf3ft3af.get(element, property), 10);
  };
  var grid$1 = function (element, rowProp, colProp) {
    var rows = attr(element, rowProp);
    var cols = attr(element, colProp);
    return $_9kexg1k1jf3ft36h.grid(rows, cols);
  };
  var $_3oodk9k2jf3ft36l = {
    cell: cell,
    firstCell: firstCell,
    cells: cells,
    neighbourCells: neighbourCells,
    table: table,
    row: row,
    rows: rows,
    notCell: notCell,
    neighbourRows: neighbourRows,
    attr: attr,
    grid: grid$1
  };

  var fromTable = function (table) {
    var rows = $_3oodk9k2jf3ft36l.rows(table);
    return $_5qd2tsjqjf3ft34c.map(rows, function (row) {
      var element = row;
      var parent = $_a4gvewk7jf3ft384.parent(element);
      var parentSection = parent.bind(function (parent) {
        var parentName = $_3seq30krjf3ft3as.name(parent);
        return parentName === 'tfoot' || parentName === 'thead' || parentName === 'tbody' ? parentName : 'tbody';
      });
      var cells = $_5qd2tsjqjf3ft34c.map($_3oodk9k2jf3ft36l.cells(row), function (cell) {
        var rowspan = $_fcjbkgkqjf3ft3af.has(cell, 'rowspan') ? parseInt($_fcjbkgkqjf3ft3af.get(cell, 'rowspan'), 10) : 1;
        var colspan = $_fcjbkgkqjf3ft3af.has(cell, 'colspan') ? parseInt($_fcjbkgkqjf3ft3af.get(cell, 'colspan'), 10) : 1;
        return $_9kexg1k1jf3ft36h.detail(cell, rowspan, colspan);
      });
      return $_9kexg1k1jf3ft36h.rowdata(element, cells, parentSection);
    });
  };
  var fromPastedRows = function (rows, example) {
    return $_5qd2tsjqjf3ft34c.map(rows, function (row) {
      var cells = $_5qd2tsjqjf3ft34c.map($_3oodk9k2jf3ft36l.cells(row), function (cell) {
        var rowspan = $_fcjbkgkqjf3ft3af.has(cell, 'rowspan') ? parseInt($_fcjbkgkqjf3ft3af.get(cell, 'rowspan'), 10) : 1;
        var colspan = $_fcjbkgkqjf3ft3af.has(cell, 'colspan') ? parseInt($_fcjbkgkqjf3ft3af.get(cell, 'colspan'), 10) : 1;
        return $_9kexg1k1jf3ft36h.detail(cell, rowspan, colspan);
      });
      return $_9kexg1k1jf3ft36h.rowdata(row, cells, example.section());
    });
  };
  var $_7r7n5rk0jf3ft367 = {
    fromTable: fromTable,
    fromPastedRows: fromPastedRows
  };

  var key = function (row, column) {
    return row + ',' + column;
  };
  var getAt = function (warehouse, row, column) {
    var raw = warehouse.access()[key(row, column)];
    return raw !== undefined ? Option.some(raw) : Option.none();
  };
  var findItem = function (warehouse, item, comparator) {
    var filtered = filterItems(warehouse, function (detail) {
      return comparator(item, detail.element());
    });
    return filtered.length > 0 ? Option.some(filtered[0]) : Option.none();
  };
  var filterItems = function (warehouse, predicate) {
    var all = $_5qd2tsjqjf3ft34c.bind(warehouse.all(), function (r) {
      return r.cells();
    });
    return $_5qd2tsjqjf3ft34c.filter(all, predicate);
  };
  var generate = function (list) {
    var access = {};
    var cells = [];
    var maxRows = list.length;
    var maxColumns = 0;
    $_5qd2tsjqjf3ft34c.each(list, function (details, r) {
      var currentRow = [];
      $_5qd2tsjqjf3ft34c.each(details.cells(), function (detail, c) {
        var start = 0;
        while (access[key(r, start)] !== undefined) {
          start++;
        }
        var current = $_9kexg1k1jf3ft36h.extended(detail.element(), detail.rowspan(), detail.colspan(), r, start);
        for (var i = 0; i < detail.colspan(); i++) {
          for (var j = 0; j < detail.rowspan(); j++) {
            var cr = r + j;
            var cc = start + i;
            var newpos = key(cr, cc);
            access[newpos] = current;
            maxColumns = Math.max(maxColumns, cc + 1);
          }
        }
        currentRow.push(current);
      });
      cells.push($_9kexg1k1jf3ft36h.rowdata(details.element(), currentRow, details.section()));
    });
    var grid = $_9kexg1k1jf3ft36h.grid(maxRows, maxColumns);
    return {
      grid: $_6np0wpjsjf3ft34s.constant(grid),
      access: $_6np0wpjsjf3ft34s.constant(access),
      all: $_6np0wpjsjf3ft34s.constant(cells)
    };
  };
  var justCells = function (warehouse) {
    var rows = $_5qd2tsjqjf3ft34c.map(warehouse.all(), function (w) {
      return w.cells();
    });
    return $_5qd2tsjqjf3ft34c.flatten(rows);
  };
  var $_50juipkyjf3ft3c6 = {
    generate: generate,
    getAt: getAt,
    findItem: findItem,
    filterItems: filterItems,
    justCells: justCells
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_88mxmkl0jf3ft3cy = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_424octjzjf3ft364.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_88mxmkl0jf3ft3cy.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_88mxmkl0jf3ft3cy.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set$1 = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function (element, css) {
    var dom = element.dom();
    $_6j7iurjujf3ft35n.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_6j7iurjujf3ft35n.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get$1 = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_5ev9q6kujf3ft3b4.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_88mxmkl0jf3ft3cy.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return Option.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_88mxmkl0jf3ft3cy.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_cjzqfhk5jf3ft37x.fromTag(tag);
    set$1(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove$1 = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_fcjbkgkqjf3ft3af.has(element, 'style') && $_65qcg9knjf3ft3a7.trim($_fcjbkgkqjf3ft3af.get(element, 'style')) === '') {
      $_fcjbkgkqjf3ft3af.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_fcjbkgkqjf3ft3af.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_fcjbkgkqjf3ft3af.remove : $_fcjbkgkqjf3ft3af.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_88mxmkl0jf3ft3cy.isSupported(sourceDom) && $_88mxmkl0jf3ft3cy.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne$1 = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set$1(destination, style, value);
    });
  };
  var transfer$1 = function (source, destination, styles) {
    if (!$_3seq30krjf3ft3as.isElement(source) || !$_3seq30krjf3ft3as.isElement(destination))
      return;
    $_5qd2tsjqjf3ft34c.each(styles, function (style) {
      transferOne$1(source, destination, style);
    });
  };
  var $_9hbdczkzjf3ft3ci = {
    copy: copy,
    set: set$1,
    preserve: preserve,
    setAll: setAll$1,
    setOptions: setOptions,
    remove: remove$1,
    get: get$1,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer$1
  };

  var before = function (marker, element) {
    var parent = $_a4gvewk7jf3ft384.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function (marker, element) {
    var sibling = $_a4gvewk7jf3ft384.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_a4gvewk7jf3ft384.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_a4gvewk7jf3ft384.firstChild(parent);
    firstChild.fold(function () {
      append(parent, element);
    }, function (v) {
      parent.dom().insertBefore(element.dom(), v.dom());
    });
  };
  var append = function (parent, element) {
    parent.dom().appendChild(element.dom());
  };
  var appendAt = function (parent, element, index) {
    $_a4gvewk7jf3ft384.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };
  var wrap = function (element, wrapper) {
    before(element, wrapper);
    append(wrapper, element);
  };
  var $_au51ntl1jf3ft3d0 = {
    before: before,
    after: after,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap
  };

  var before$1 = function (marker, elements) {
    $_5qd2tsjqjf3ft34c.each(elements, function (x) {
      $_au51ntl1jf3ft3d0.before(marker, x);
    });
  };
  var after$1 = function (marker, elements) {
    $_5qd2tsjqjf3ft34c.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_au51ntl1jf3ft3d0.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_5qd2tsjqjf3ft34c.each(elements.slice().reverse(), function (x) {
      $_au51ntl1jf3ft3d0.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_5qd2tsjqjf3ft34c.each(elements, function (x) {
      $_au51ntl1jf3ft3d0.append(parent, x);
    });
  };
  var $_e6z7itl3jf3ft3d9 = {
    before: before$1,
    after: after$1,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_5qd2tsjqjf3ft34c.each($_a4gvewk7jf3ft384.children(element), function (rogue) {
      remove$2(rogue);
    });
  };
  var remove$2 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_a4gvewk7jf3ft384.children(wrapper);
    if (children.length > 0)
      $_e6z7itl3jf3ft3d9.before(wrapper, children);
    remove$2(wrapper);
  };
  var $_1fts8il2jf3ft3d3 = {
    empty: empty,
    remove: remove$2,
    unwrap: unwrap
  };

  var stats = $_4bo75gjvjf3ft35r.immutable('minRow', 'minCol', 'maxRow', 'maxCol');
  var findSelectedStats = function (house, isSelected) {
    var totalColumns = house.grid().columns();
    var totalRows = house.grid().rows();
    var minRow = totalRows;
    var minCol = totalColumns;
    var maxRow = 0;
    var maxCol = 0;
    $_6j7iurjujf3ft35n.each(house.access(), function (detail) {
      if (isSelected(detail)) {
        var startRow = detail.row();
        var endRow = startRow + detail.rowspan() - 1;
        var startCol = detail.column();
        var endCol = startCol + detail.colspan() - 1;
        if (startRow < minRow)
          minRow = startRow;
        else if (endRow > maxRow)
          maxRow = endRow;
        if (startCol < minCol)
          minCol = startCol;
        else if (endCol > maxCol)
          maxCol = endCol;
      }
    });
    return stats(minRow, minCol, maxRow, maxCol);
  };
  var makeCell = function (list, seenSelected, rowIndex) {
    var row = list[rowIndex].element();
    var td = $_cjzqfhk5jf3ft37x.fromTag('td');
    $_au51ntl1jf3ft3d0.append(td, $_cjzqfhk5jf3ft37x.fromTag('br'));
    var f = seenSelected ? $_au51ntl1jf3ft3d0.append : $_au51ntl1jf3ft3d0.prepend;
    f(row, td);
  };
  var fillInGaps = function (list, house, stats, isSelected) {
    var totalColumns = house.grid().columns();
    var totalRows = house.grid().rows();
    for (var i = 0; i < totalRows; i++) {
      var seenSelected = false;
      for (var j = 0; j < totalColumns; j++) {
        if (!(i < stats.minRow() || i > stats.maxRow() || j < stats.minCol() || j > stats.maxCol())) {
          var needCell = $_50juipkyjf3ft3c6.getAt(house, i, j).filter(isSelected).isNone();
          if (needCell)
            makeCell(list, seenSelected, i);
          else
            seenSelected = true;
        }
      }
    }
  };
  var clean = function (table, stats) {
    var emptyRows = $_5qd2tsjqjf3ft34c.filter($_5k7mtok3jf3ft377.firstLayer(table, 'tr'), function (row) {
      return row.dom().childElementCount === 0;
    });
    $_5qd2tsjqjf3ft34c.each(emptyRows, $_1fts8il2jf3ft3d3.remove);
    if (stats.minCol() === stats.maxCol() || stats.minRow() === stats.maxRow()) {
      $_5qd2tsjqjf3ft34c.each($_5k7mtok3jf3ft377.firstLayer(table, 'th,td'), function (cell) {
        $_fcjbkgkqjf3ft3af.remove(cell, 'rowspan');
        $_fcjbkgkqjf3ft3af.remove(cell, 'colspan');
      });
    }
    $_fcjbkgkqjf3ft3af.remove(table, 'width');
    $_fcjbkgkqjf3ft3af.remove(table, 'height');
    $_9hbdczkzjf3ft3ci.remove(table, 'width');
    $_9hbdczkzjf3ft3ci.remove(table, 'height');
  };
  var extract = function (table, selectedSelector) {
    var isSelected = function (detail) {
      return $_31lswek4jf3ft37j.is(detail.element(), selectedSelector);
    };
    var list = $_7r7n5rk0jf3ft367.fromTable(table);
    var house = $_50juipkyjf3ft3c6.generate(list);
    var stats = findSelectedStats(house, isSelected);
    var selector = 'th:not(' + selectedSelector + ')' + ',td:not(' + selectedSelector + ')';
    var unselectedCells = $_5k7mtok3jf3ft377.filterFirstLayer(table, 'th,td', function (cell) {
      return $_31lswek4jf3ft37j.is(cell, selector);
    });
    $_5qd2tsjqjf3ft34c.each(unselectedCells, $_1fts8il2jf3ft3d3.remove);
    fillInGaps(list, house, stats, isSelected);
    clean(table, stats);
    return table;
  };
  var $_3gtbu2jtjf3ft34y = { extract: extract };

  var clone$1 = function (original, deep) {
    return $_cjzqfhk5jf3ft37x.fromDom(original.dom().cloneNode(deep));
  };
  var shallow = function (original) {
    return clone$1(original, false);
  };
  var deep = function (original) {
    return clone$1(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_cjzqfhk5jf3ft37x.fromTag(tag);
    var attributes = $_fcjbkgkqjf3ft3af.clone(original);
    $_fcjbkgkqjf3ft3af.setAll(nu, attributes);
    return nu;
  };
  var copy$1 = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_a4gvewk7jf3ft384.children(deep(original));
    $_e6z7itl3jf3ft3d9.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_au51ntl1jf3ft3d0.before(original, nu);
    var children = $_a4gvewk7jf3ft384.children(original);
    $_e6z7itl3jf3ft3d9.append(nu, children);
    $_1fts8il2jf3ft3d3.remove(original);
    return nu;
  };
  var $_3qbzp9l5jf3ft3e2 = {
    shallow: shallow,
    shallowAs: shallowAs,
    deep: deep,
    copy: copy$1,
    mutate: mutate
  };

  function NodeValue (is, name) {
    var get = function (element) {
      if (!is(element))
        throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
      return getOption(element).getOr('');
    };
    var getOptionIE10 = function (element) {
      try {
        return getOptionSafe(element);
      } catch (e) {
        return Option.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? Option.from(element.dom().nodeValue) : Option.none();
    };
    var browser = $_8vnd6hkejf3ft397.detect().browser;
    var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe;
    var set = function (element, value) {
      if (!is(element))
        throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
      element.dom().nodeValue = value;
    };
    return {
      get: get,
      getOption: getOption,
      set: set
    };
  }

  var api = NodeValue($_3seq30krjf3ft3as.isText, 'text');
  var get$2 = function (element) {
    return api.get(element);
  };
  var getOption = function (element) {
    return api.getOption(element);
  };
  var set$2 = function (element, value) {
    api.set(element, value);
  };
  var $_e4e6aul8jf3ft3ek = {
    get: get$2,
    getOption: getOption,
    set: set$2
  };

  var getEnd = function (element) {
    return $_3seq30krjf3ft3as.name(element) === 'img' ? 1 : $_e4e6aul8jf3ft3ek.getOption(element).fold(function () {
      return $_a4gvewk7jf3ft384.children(element).length;
    }, function (v) {
      return v.length;
    });
  };
  var isEnd = function (element, offset) {
    return getEnd(element) === offset;
  };
  var isStart = function (element, offset) {
    return offset === 0;
  };
  var NBSP = '\xA0';
  var isTextNodeWithCursorPosition = function (el) {
    return $_e4e6aul8jf3ft3ek.getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = [
    'img',
    'br'
  ];
  var isCursorPosition = function (elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || $_5qd2tsjqjf3ft34c.contains(elementsWithCursorPosition, $_3seq30krjf3ft3as.name(elem));
  };
  var $_eutj08l7jf3ft3e8 = {
    getEnd: getEnd,
    isEnd: isEnd,
    isStart: isStart,
    isCursorPosition: isCursorPosition
  };

  var first$3 = function (element) {
    return $_4np8xgkwjf3ft3bp.descendant(element, $_eutj08l7jf3ft3e8.isCursorPosition);
  };
  var last$2 = function (element) {
    return descendantRtl(element, $_eutj08l7jf3ft3e8.isCursorPosition);
  };
  var descendantRtl = function (scope, predicate) {
    var descend = function (element) {
      var children = $_a4gvewk7jf3ft384.children(element);
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (predicate(child))
          return Option.some(child);
        var res = descend(child);
        if (res.isSome())
          return res;
      }
      return Option.none();
    };
    return descend(scope);
  };
  var $_bksv9ol6jf3ft3e5 = {
    first: first$3,
    last: last$2
  };

  var cell$1 = function () {
    var td = $_cjzqfhk5jf3ft37x.fromTag('td');
    $_au51ntl1jf3ft3d0.append(td, $_cjzqfhk5jf3ft37x.fromTag('br'));
    return td;
  };
  var replace = function (cell, tag, attrs) {
    var replica = $_3qbzp9l5jf3ft3e2.copy(cell, tag);
    $_6j7iurjujf3ft35n.each(attrs, function (v, k) {
      if (v === null)
        $_fcjbkgkqjf3ft3af.remove(replica, k);
      else
        $_fcjbkgkqjf3ft3af.set(replica, k, v);
    });
    return replica;
  };
  var pasteReplace = function (cellContent) {
    return cellContent;
  };
  var newRow = function (doc) {
    return function () {
      return $_cjzqfhk5jf3ft37x.fromTag('tr', doc.dom());
    };
  };
  var cloneFormats = function (oldCell, newCell, formats) {
    var first = $_bksv9ol6jf3ft3e5.first(oldCell);
    return first.map(function (firstText) {
      var formatSelector = formats.join(',');
      var parents = $_6pynzqksjf3ft3aw.ancestors(firstText, formatSelector, function (element) {
        return $_avffyek9jf3ft38l.eq(element, oldCell);
      });
      return $_5qd2tsjqjf3ft34c.foldr(parents, function (last, parent) {
        var clonedFormat = $_3qbzp9l5jf3ft3e2.shallow(parent);
        $_au51ntl1jf3ft3d0.append(last, clonedFormat);
        return clonedFormat;
      }, newCell);
    }).getOr(newCell);
  };
  var cellOperations = function (mutate, doc, formatsToClone) {
    var newCell = function (prev) {
      var doc = $_a4gvewk7jf3ft384.owner(prev.element());
      var td = $_cjzqfhk5jf3ft37x.fromTag($_3seq30krjf3ft3as.name(prev.element()), doc.dom());
      var formats = formatsToClone.getOr([
        'strong',
        'em',
        'b',
        'i',
        'span',
        'font',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'div'
      ]);
      var lastNode = formats.length > 0 ? cloneFormats(prev.element(), td, formats) : td;
      $_au51ntl1jf3ft3d0.append(lastNode, $_cjzqfhk5jf3ft37x.fromTag('br'));
      $_9hbdczkzjf3ft3ci.copy(prev.element(), td);
      $_9hbdczkzjf3ft3ci.remove(td, 'height');
      if (prev.colspan() !== 1)
        $_9hbdczkzjf3ft3ci.remove(prev.element(), 'width');
      mutate(prev.element(), td);
      return td;
    };
    return {
      row: newRow(doc),
      cell: newCell,
      replace: replace,
      gap: cell$1
    };
  };
  var paste = function (doc) {
    return {
      row: newRow(doc),
      cell: cell$1,
      replace: pasteReplace,
      gap: cell$1
    };
  };
  var $_5zb0acl4jf3ft3de = {
    cellOperations: cellOperations,
    paste: paste
  };

  var fromHtml$1 = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return $_a4gvewk7jf3ft384.children($_cjzqfhk5jf3ft37x.fromDom(div));
  };
  var fromTags = function (tags, scope) {
    return $_5qd2tsjqjf3ft34c.map(tags, function (x) {
      return $_cjzqfhk5jf3ft37x.fromTag(x, scope);
    });
  };
  var fromText$1 = function (texts, scope) {
    return $_5qd2tsjqjf3ft34c.map(texts, function (x) {
      return $_cjzqfhk5jf3ft37x.fromText(x, scope);
    });
  };
  var fromDom$1 = function (nodes) {
    return $_5qd2tsjqjf3ft34c.map(nodes, $_cjzqfhk5jf3ft37x.fromDom);
  };
  var $_4abckllajf3ft3er = {
    fromHtml: fromHtml$1,
    fromTags: fromTags,
    fromText: fromText$1,
    fromDom: fromDom$1
  };

  var TagBoundaries = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'li',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ];

  function DomUniverse () {
    var clone = function (element) {
      return $_cjzqfhk5jf3ft37x.fromDom(element.dom().cloneNode(false));
    };
    var isBoundary = function (element) {
      if (!$_3seq30krjf3ft3as.isElement(element))
        return false;
      if ($_3seq30krjf3ft3as.name(element) === 'body')
        return true;
      return $_5qd2tsjqjf3ft34c.contains(TagBoundaries, $_3seq30krjf3ft3as.name(element));
    };
    var isEmptyTag = function (element) {
      if (!$_3seq30krjf3ft3as.isElement(element))
        return false;
      return $_5qd2tsjqjf3ft34c.contains([
        'br',
        'img',
        'hr',
        'input'
      ], $_3seq30krjf3ft3as.name(element));
    };
    var comparePosition = function (element, other) {
      return element.dom().compareDocumentPosition(other.dom());
    };
    var copyAttributesTo = function (source, destination) {
      var as = $_fcjbkgkqjf3ft3af.clone(source);
      $_fcjbkgkqjf3ft3af.setAll(destination, as);
    };
    return {
      up: $_6np0wpjsjf3ft34s.constant({
        selector: $_fhotvakvjf3ft3bm.ancestor,
        closest: $_fhotvakvjf3ft3bm.closest,
        predicate: $_4np8xgkwjf3ft3bp.ancestor,
        all: $_a4gvewk7jf3ft384.parents
      }),
      down: $_6np0wpjsjf3ft34s.constant({
        selector: $_6pynzqksjf3ft3aw.descendants,
        predicate: $_aisdkbktjf3ft3ay.descendants
      }),
      styles: $_6np0wpjsjf3ft34s.constant({
        get: $_9hbdczkzjf3ft3ci.get,
        getRaw: $_9hbdczkzjf3ft3ci.getRaw,
        set: $_9hbdczkzjf3ft3ci.set,
        remove: $_9hbdczkzjf3ft3ci.remove
      }),
      attrs: $_6np0wpjsjf3ft34s.constant({
        get: $_fcjbkgkqjf3ft3af.get,
        set: $_fcjbkgkqjf3ft3af.set,
        remove: $_fcjbkgkqjf3ft3af.remove,
        copyTo: copyAttributesTo
      }),
      insert: $_6np0wpjsjf3ft34s.constant({
        before: $_au51ntl1jf3ft3d0.before,
        after: $_au51ntl1jf3ft3d0.after,
        afterAll: $_e6z7itl3jf3ft3d9.after,
        append: $_au51ntl1jf3ft3d0.append,
        appendAll: $_e6z7itl3jf3ft3d9.append,
        prepend: $_au51ntl1jf3ft3d0.prepend,
        wrap: $_au51ntl1jf3ft3d0.wrap
      }),
      remove: $_6np0wpjsjf3ft34s.constant({
        unwrap: $_1fts8il2jf3ft3d3.unwrap,
        remove: $_1fts8il2jf3ft3d3.remove
      }),
      create: $_6np0wpjsjf3ft34s.constant({
        nu: $_cjzqfhk5jf3ft37x.fromTag,
        clone: clone,
        text: $_cjzqfhk5jf3ft37x.fromText
      }),
      query: $_6np0wpjsjf3ft34s.constant({
        comparePosition: comparePosition,
        prevSibling: $_a4gvewk7jf3ft384.prevSibling,
        nextSibling: $_a4gvewk7jf3ft384.nextSibling
      }),
      property: $_6np0wpjsjf3ft34s.constant({
        children: $_a4gvewk7jf3ft384.children,
        name: $_3seq30krjf3ft3as.name,
        parent: $_a4gvewk7jf3ft384.parent,
        isText: $_3seq30krjf3ft3as.isText,
        isComment: $_3seq30krjf3ft3as.isComment,
        isElement: $_3seq30krjf3ft3as.isElement,
        getText: $_e4e6aul8jf3ft3ek.get,
        setText: $_e4e6aul8jf3ft3ek.set,
        isBoundary: isBoundary,
        isEmptyTag: isEmptyTag
      }),
      eq: $_avffyek9jf3ft38l.eq,
      is: $_avffyek9jf3ft38l.is
    };
  }

  var leftRight = $_4bo75gjvjf3ft35r.immutable('left', 'right');
  var bisect = function (universe, parent, child) {
    var children = universe.property().children(parent);
    var index = $_5qd2tsjqjf3ft34c.findIndex(children, $_6np0wpjsjf3ft34s.curry(universe.eq, child));
    return index.map(function (ind) {
      return {
        before: $_6np0wpjsjf3ft34s.constant(children.slice(0, ind)),
        after: $_6np0wpjsjf3ft34s.constant(children.slice(ind + 1))
      };
    });
  };
  var breakToRight = function (universe, parent, child) {
    return bisect(universe, parent, child).map(function (parts) {
      var second = universe.create().clone(parent);
      universe.insert().appendAll(second, parts.after());
      universe.insert().after(parent, second);
      return leftRight(parent, second);
    });
  };
  var breakToLeft = function (universe, parent, child) {
    return bisect(universe, parent, child).map(function (parts) {
      var prior = universe.create().clone(parent);
      universe.insert().appendAll(prior, parts.before().concat([child]));
      universe.insert().appendAll(parent, parts.after());
      universe.insert().before(parent, prior);
      return leftRight(prior, parent);
    });
  };
  var breakPath = function (universe, item, isTop, breaker) {
    var result = $_4bo75gjvjf3ft35r.immutable('first', 'second', 'splits');
    var next = function (child, group, splits) {
      var fallback = result(child, Option.none(), splits);
      if (isTop(child))
        return result(child, group, splits);
      else {
        return universe.property().parent(child).bind(function (parent) {
          return breaker(universe, parent, child).map(function (breakage) {
            var extra = [{
                first: breakage.left,
                second: breakage.right
              }];
            var nextChild = isTop(parent) ? parent : breakage.left();
            return next(nextChild, Option.some(breakage.right()), splits.concat(extra));
          }).getOr(fallback);
        });
      }
    };
    return next(item, Option.none(), []);
  };
  var $_8g15pdljjf3ft3ha = {
    breakToLeft: breakToLeft,
    breakToRight: breakToRight,
    breakPath: breakPath
  };

  var all$3 = function (universe, look, elements, f) {
    var head = elements[0];
    var tail = elements.slice(1);
    return f(universe, look, head, tail);
  };
  var oneAll = function (universe, look, elements) {
    return elements.length > 0 ? all$3(universe, look, elements, unsafeOne) : Option.none();
  };
  var unsafeOne = function (universe, look, head, tail) {
    var start = look(universe, head);
    return $_5qd2tsjqjf3ft34c.foldr(tail, function (b, a) {
      var current = look(universe, a);
      return commonElement(universe, b, current);
    }, start);
  };
  var commonElement = function (universe, start, end) {
    return start.bind(function (s) {
      return end.filter($_6np0wpjsjf3ft34s.curry(universe.eq, s));
    });
  };
  var $_ezzpxtlkjf3ft3hq = { oneAll: oneAll };

  var eq$1 = function (universe, item) {
    return $_6np0wpjsjf3ft34s.curry(universe.eq, item);
  };
  var unsafeSubset = function (universe, common, ps1, ps2) {
    var children = universe.property().children(common);
    if (universe.eq(common, ps1[0]))
      return Option.some([ps1[0]]);
    if (universe.eq(common, ps2[0]))
      return Option.some([ps2[0]]);
    var finder = function (ps) {
      var topDown = $_5qd2tsjqjf3ft34c.reverse(ps);
      var index = $_5qd2tsjqjf3ft34c.findIndex(topDown, eq$1(universe, common)).getOr(-1);
      var item = index < topDown.length - 1 ? topDown[index + 1] : topDown[index];
      return $_5qd2tsjqjf3ft34c.findIndex(children, eq$1(universe, item));
    };
    var startIndex = finder(ps1);
    var endIndex = finder(ps2);
    return startIndex.bind(function (sIndex) {
      return endIndex.map(function (eIndex) {
        var first = Math.min(sIndex, eIndex);
        var last = Math.max(sIndex, eIndex);
        return children.slice(first, last + 1);
      });
    });
  };
  var ancestors$2 = function (universe, start, end, _isRoot) {
    var isRoot = _isRoot !== undefined ? _isRoot : $_6np0wpjsjf3ft34s.constant(false);
    var ps1 = [start].concat(universe.up().all(start));
    var ps2 = [end].concat(universe.up().all(end));
    var prune = function (path) {
      var index = $_5qd2tsjqjf3ft34c.findIndex(path, isRoot);
      return index.fold(function () {
        return path;
      }, function (ind) {
        return path.slice(0, ind + 1);
      });
    };
    var pruned1 = prune(ps1);
    var pruned2 = prune(ps2);
    var shared = $_5qd2tsjqjf3ft34c.find(pruned1, function (x) {
      return $_5qd2tsjqjf3ft34c.exists(pruned2, eq$1(universe, x));
    });
    return {
      firstpath: $_6np0wpjsjf3ft34s.constant(pruned1),
      secondpath: $_6np0wpjsjf3ft34s.constant(pruned2),
      shared: $_6np0wpjsjf3ft34s.constant(shared)
    };
  };
  var subset = function (universe, start, end) {
    var ancs = ancestors$2(universe, start, end);
    return ancs.shared().bind(function (shared) {
      return unsafeSubset(universe, shared, ancs.firstpath(), ancs.secondpath());
    });
  };
  var $_62rnlzlljf3ft3hw = {
    subset: subset,
    ancestors: ancestors$2
  };

  var sharedOne = function (universe, look, elements) {
    return $_ezzpxtlkjf3ft3hq.oneAll(universe, look, elements);
  };
  var subset$1 = function (universe, start, finish) {
    return $_62rnlzlljf3ft3hw.subset(universe, start, finish);
  };
  var ancestors$3 = function (universe, start, finish, _isRoot) {
    return $_62rnlzlljf3ft3hw.ancestors(universe, start, finish, _isRoot);
  };
  var breakToLeft$1 = function (universe, parent, child) {
    return $_8g15pdljjf3ft3ha.breakToLeft(universe, parent, child);
  };
  var breakToRight$1 = function (universe, parent, child) {
    return $_8g15pdljjf3ft3ha.breakToRight(universe, parent, child);
  };
  var breakPath$1 = function (universe, child, isTop, breaker) {
    return $_8g15pdljjf3ft3ha.breakPath(universe, child, isTop, breaker);
  };
  var $_dldbdflijf3ft3h8 = {
    sharedOne: sharedOne,
    subset: subset$1,
    ancestors: ancestors$3,
    breakToLeft: breakToLeft$1,
    breakToRight: breakToRight$1,
    breakPath: breakPath$1
  };

  var universe = DomUniverse();
  var sharedOne$1 = function (look, elements) {
    return $_dldbdflijf3ft3h8.sharedOne(universe, function (universe, element) {
      return look(element);
    }, elements);
  };
  var subset$2 = function (start, finish) {
    return $_dldbdflijf3ft3h8.subset(universe, start, finish);
  };
  var ancestors$4 = function (start, finish, _isRoot) {
    return $_dldbdflijf3ft3h8.ancestors(universe, start, finish, _isRoot);
  };
  var breakToLeft$2 = function (parent, child) {
    return $_dldbdflijf3ft3h8.breakToLeft(universe, parent, child);
  };
  var breakToRight$2 = function (parent, child) {
    return $_dldbdflijf3ft3h8.breakToRight(universe, parent, child);
  };
  var breakPath$2 = function (child, isTop, breaker) {
    return $_dldbdflijf3ft3h8.breakPath(universe, child, isTop, function (u, p, c) {
      return breaker(p, c);
    });
  };
  var $_a92wgplfjf3ft3g5 = {
    sharedOne: sharedOne$1,
    subset: subset$2,
    ancestors: ancestors$4,
    breakToLeft: breakToLeft$2,
    breakToRight: breakToRight$2,
    breakPath: breakPath$2
  };

  var inSelection = function (bounds, detail) {
    var leftEdge = detail.column();
    var rightEdge = detail.column() + detail.colspan() - 1;
    var topEdge = detail.row();
    var bottomEdge = detail.row() + detail.rowspan() - 1;
    return leftEdge <= bounds.finishCol() && rightEdge >= bounds.startCol() && (topEdge <= bounds.finishRow() && bottomEdge >= bounds.startRow());
  };
  var isWithin = function (bounds, detail) {
    return detail.column() >= bounds.startCol() && detail.column() + detail.colspan() - 1 <= bounds.finishCol() && detail.row() >= bounds.startRow() && detail.row() + detail.rowspan() - 1 <= bounds.finishRow();
  };
  var isRectangular = function (warehouse, bounds) {
    var isRect = true;
    var detailIsWithin = $_6np0wpjsjf3ft34s.curry(isWithin, bounds);
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        isRect = isRect && $_50juipkyjf3ft3c6.getAt(warehouse, i, j).exists(detailIsWithin);
      }
    }
    return isRect ? Option.some(bounds) : Option.none();
  };
  var $_986ttklojf3ft3id = {
    inSelection: inSelection,
    isWithin: isWithin,
    isRectangular: isRectangular
  };

  var getBounds = function (detailA, detailB) {
    return $_9kexg1k1jf3ft36h.bounds(Math.min(detailA.row(), detailB.row()), Math.min(detailA.column(), detailB.column()), Math.max(detailA.row() + detailA.rowspan() - 1, detailB.row() + detailB.rowspan() - 1), Math.max(detailA.column() + detailA.colspan() - 1, detailB.column() + detailB.colspan() - 1));
  };
  var getAnyBox = function (warehouse, startCell, finishCell) {
    var startCoords = $_50juipkyjf3ft3c6.findItem(warehouse, startCell, $_avffyek9jf3ft38l.eq);
    var finishCoords = $_50juipkyjf3ft3c6.findItem(warehouse, finishCell, $_avffyek9jf3ft38l.eq);
    return startCoords.bind(function (sc) {
      return finishCoords.map(function (fc) {
        return getBounds(sc, fc);
      });
    });
  };
  var getBox = function (warehouse, startCell, finishCell) {
    return getAnyBox(warehouse, startCell, finishCell).bind(function (bounds) {
      return $_986ttklojf3ft3id.isRectangular(warehouse, bounds);
    });
  };
  var $_f6ygdzlpjf3ft3ij = {
    getAnyBox: getAnyBox,
    getBox: getBox
  };

  var moveBy = function (warehouse, cell, row, column) {
    return $_50juipkyjf3ft3c6.findItem(warehouse, cell, $_avffyek9jf3ft38l.eq).bind(function (detail) {
      var startRow = row > 0 ? detail.row() + detail.rowspan() - 1 : detail.row();
      var startCol = column > 0 ? detail.column() + detail.colspan() - 1 : detail.column();
      var dest = $_50juipkyjf3ft3c6.getAt(warehouse, startRow + row, startCol + column);
      return dest.map(function (d) {
        return d.element();
      });
    });
  };
  var intercepts = function (warehouse, start, finish) {
    return $_f6ygdzlpjf3ft3ij.getAnyBox(warehouse, start, finish).map(function (bounds) {
      var inside = $_50juipkyjf3ft3c6.filterItems(warehouse, $_6np0wpjsjf3ft34s.curry($_986ttklojf3ft3id.inSelection, bounds));
      return $_5qd2tsjqjf3ft34c.map(inside, function (detail) {
        return detail.element();
      });
    });
  };
  var parentCell = function (warehouse, innerCell) {
    var isContainedBy = function (c1, c2) {
      return $_avffyek9jf3ft38l.contains(c2, c1);
    };
    return $_50juipkyjf3ft3c6.findItem(warehouse, innerCell, isContainedBy).bind(function (detail) {
      return detail.element();
    });
  };
  var $_6svssslnjf3ft3i6 = {
    moveBy: moveBy,
    intercepts: intercepts,
    parentCell: parentCell
  };

  var moveBy$1 = function (cell, deltaRow, deltaColumn) {
    return $_3oodk9k2jf3ft36l.table(cell).bind(function (table) {
      var warehouse = getWarehouse(table);
      return $_6svssslnjf3ft3i6.moveBy(warehouse, cell, deltaRow, deltaColumn);
    });
  };
  var intercepts$1 = function (table, first, last) {
    var warehouse = getWarehouse(table);
    return $_6svssslnjf3ft3i6.intercepts(warehouse, first, last);
  };
  var nestedIntercepts = function (table, first, firstTable, last, lastTable) {
    var warehouse = getWarehouse(table);
    var startCell = $_avffyek9jf3ft38l.eq(table, firstTable) ? first : $_6svssslnjf3ft3i6.parentCell(warehouse, first);
    var lastCell = $_avffyek9jf3ft38l.eq(table, lastTable) ? last : $_6svssslnjf3ft3i6.parentCell(warehouse, last);
    return $_6svssslnjf3ft3i6.intercepts(warehouse, startCell, lastCell);
  };
  var getBox$1 = function (table, first, last) {
    var warehouse = getWarehouse(table);
    return $_f6ygdzlpjf3ft3ij.getBox(warehouse, first, last);
  };
  var getWarehouse = function (table) {
    var list = $_7r7n5rk0jf3ft367.fromTable(table);
    return $_50juipkyjf3ft3c6.generate(list);
  };
  var $_2n3vnxlmjf3ft3i3 = {
    moveBy: moveBy$1,
    intercepts: intercepts$1,
    nestedIntercepts: nestedIntercepts,
    getBox: getBox$1
  };

  var lookupTable = function (container, isRoot) {
    return $_fhotvakvjf3ft3bm.ancestor(container, 'table');
  };
  var identified = $_4bo75gjvjf3ft35r.immutableBag([
    'boxes',
    'start',
    'finish'
  ], []);
  var identify = function (start, finish, isRoot) {
    var getIsRoot = function (rootTable) {
      return function (element) {
        return isRoot(element) || $_avffyek9jf3ft38l.eq(element, rootTable);
      };
    };
    if ($_avffyek9jf3ft38l.eq(start, finish)) {
      return Option.some(identified({
        boxes: Option.some([start]),
        start: start,
        finish: finish
      }));
    } else {
      return lookupTable(start, isRoot).bind(function (startTable) {
        return lookupTable(finish, isRoot).bind(function (finishTable) {
          if ($_avffyek9jf3ft38l.eq(startTable, finishTable)) {
            return Option.some(identified({
              boxes: $_2n3vnxlmjf3ft3i3.intercepts(startTable, start, finish),
              start: start,
              finish: finish
            }));
          } else if ($_avffyek9jf3ft38l.contains(startTable, finishTable)) {
            var ancestorCells = $_6pynzqksjf3ft3aw.ancestors(finish, 'td,th', getIsRoot(startTable));
            var finishCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : finish;
            return Option.some(identified({
              boxes: $_2n3vnxlmjf3ft3i3.nestedIntercepts(startTable, start, startTable, finish, finishTable),
              start: start,
              finish: finishCell
            }));
          } else if ($_avffyek9jf3ft38l.contains(finishTable, startTable)) {
            var ancestorCells = $_6pynzqksjf3ft3aw.ancestors(start, 'td,th', getIsRoot(finishTable));
            var startCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : start;
            return Option.some(identified({
              boxes: $_2n3vnxlmjf3ft3i3.nestedIntercepts(finishTable, start, startTable, finish, finishTable),
              start: start,
              finish: startCell
            }));
          } else {
            return $_a92wgplfjf3ft3g5.ancestors(start, finish).shared().bind(function (lca) {
              return $_fhotvakvjf3ft3bm.closest(lca, 'table', isRoot).bind(function (lcaTable) {
                var finishAncestorCells = $_6pynzqksjf3ft3aw.ancestors(finish, 'td,th', getIsRoot(lcaTable));
                var finishCell = finishAncestorCells.length > 0 ? finishAncestorCells[finishAncestorCells.length - 1] : finish;
                var startAncestorCells = $_6pynzqksjf3ft3aw.ancestors(start, 'td,th', getIsRoot(lcaTable));
                var startCell = startAncestorCells.length > 0 ? startAncestorCells[startAncestorCells.length - 1] : start;
                return Option.some(identified({
                  boxes: $_2n3vnxlmjf3ft3i3.nestedIntercepts(lcaTable, start, startTable, finish, finishTable),
                  start: startCell,
                  finish: finishCell
                }));
              });
            });
          }
        });
      });
    }
  };
  var retrieve = function (container, selector) {
    var sels = $_6pynzqksjf3ft3aw.descendants(container, selector);
    return sels.length > 0 ? Option.some(sels) : Option.none();
  };
  var getLast = function (boxes, lastSelectedSelector) {
    return $_5qd2tsjqjf3ft34c.find(boxes, function (box) {
      return $_31lswek4jf3ft37j.is(box, lastSelectedSelector);
    });
  };
  var getEdges = function (container, firstSelectedSelector, lastSelectedSelector) {
    return $_fhotvakvjf3ft3bm.descendant(container, firstSelectedSelector).bind(function (first) {
      return $_fhotvakvjf3ft3bm.descendant(container, lastSelectedSelector).bind(function (last) {
        return $_a92wgplfjf3ft3g5.sharedOne(lookupTable, [
          first,
          last
        ]).map(function (tbl) {
          return {
            first: $_6np0wpjsjf3ft34s.constant(first),
            last: $_6np0wpjsjf3ft34s.constant(last),
            table: $_6np0wpjsjf3ft34s.constant(tbl)
          };
        });
      });
    });
  };
  var expandTo = function (finish, firstSelectedSelector) {
    return $_fhotvakvjf3ft3bm.ancestor(finish, 'table').bind(function (table) {
      return $_fhotvakvjf3ft3bm.descendant(table, firstSelectedSelector).bind(function (start) {
        return identify(start, finish).bind(function (identified) {
          return identified.boxes().map(function (boxes) {
            return {
              boxes: $_6np0wpjsjf3ft34s.constant(boxes),
              start: $_6np0wpjsjf3ft34s.constant(identified.start()),
              finish: $_6np0wpjsjf3ft34s.constant(identified.finish())
            };
          });
        });
      });
    });
  };
  var shiftSelection = function (boxes, deltaRow, deltaColumn, firstSelectedSelector, lastSelectedSelector) {
    return getLast(boxes, lastSelectedSelector).bind(function (last) {
      return $_2n3vnxlmjf3ft3i3.moveBy(last, deltaRow, deltaColumn).bind(function (finish) {
        return expandTo(finish, firstSelectedSelector);
      });
    });
  };
  var $_cabca2lejf3ft3fj = {
    identify: identify,
    retrieve: retrieve,
    shiftSelection: shiftSelection,
    getEdges: getEdges
  };

  var retrieve$1 = function (container, selector) {
    return $_cabca2lejf3ft3fj.retrieve(container, selector);
  };
  var retrieveBox = function (container, firstSelectedSelector, lastSelectedSelector) {
    return $_cabca2lejf3ft3fj.getEdges(container, firstSelectedSelector, lastSelectedSelector).bind(function (edges) {
      var isRoot = function (ancestor) {
        return $_avffyek9jf3ft38l.eq(container, ancestor);
      };
      var firstAncestor = $_fhotvakvjf3ft3bm.ancestor(edges.first(), 'thead,tfoot,tbody,table', isRoot);
      var lastAncestor = $_fhotvakvjf3ft3bm.ancestor(edges.last(), 'thead,tfoot,tbody,table', isRoot);
      return firstAncestor.bind(function (fA) {
        return lastAncestor.bind(function (lA) {
          return $_avffyek9jf3ft38l.eq(fA, lA) ? $_2n3vnxlmjf3ft3i3.getBox(edges.table(), edges.first(), edges.last()) : Option.none();
        });
      });
    });
  };
  var $_8c1u7vldjf3ft3f9 = {
    retrieve: retrieve$1,
    retrieveBox: retrieveBox
  };

  var selected = 'data-mce-selected';
  var selectedSelector = 'td[' + selected + '],th[' + selected + ']';
  var attributeSelector = '[' + selected + ']';
  var firstSelected = 'data-mce-first-selected';
  var firstSelectedSelector = 'td[' + firstSelected + '],th[' + firstSelected + ']';
  var lastSelected = 'data-mce-last-selected';
  var lastSelectedSelector = 'td[' + lastSelected + '],th[' + lastSelected + ']';
  var $_43jdhslqjf3ft3in = {
    selected: $_6np0wpjsjf3ft34s.constant(selected),
    selectedSelector: $_6np0wpjsjf3ft34s.constant(selectedSelector),
    attributeSelector: $_6np0wpjsjf3ft34s.constant(attributeSelector),
    firstSelected: $_6np0wpjsjf3ft34s.constant(firstSelected),
    firstSelectedSelector: $_6np0wpjsjf3ft34s.constant(firstSelectedSelector),
    lastSelected: $_6np0wpjsjf3ft34s.constant(lastSelected),
    lastSelectedSelector: $_6np0wpjsjf3ft34s.constant(lastSelectedSelector)
  };

  var generate$1 = function (cases) {
    if (!$_424octjzjf3ft364.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_5qd2tsjqjf3ft34c.each(cases, function (acase, count) {
      var keys = $_6j7iurjujf3ft35n.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_424octjzjf3ft364.isArray(value)) {
        throw new Error('case arguments must be an array');
      }
      constructors.push(key);
      adt[key] = function () {
        var argLength = arguments.length;
        if (argLength !== value.length) {
          throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
        }
        var args = new Array(argLength);
        for (var i = 0; i < args.length; i++)
          args[i] = arguments[i];
        var match = function (branches) {
          var branchKeys = $_6j7iurjujf3ft35n.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_5qd2tsjqjf3ft34c.forall(constructors, function (reqKey) {
            return $_5qd2tsjqjf3ft34c.contains(branchKeys, reqKey);
          });
          if (!allReqd)
            throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
          return branches[key].apply(null, args);
        };
        return {
          fold: function () {
            if (arguments.length !== cases.length) {
              throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
            }
            var target = arguments[count];
            return target.apply(null, args);
          },
          match: match,
          log: function (label) {
            console.log(label, {
              constructors: constructors,
              constructor: key,
              params: args
            });
          }
        };
      };
    });
    return adt;
  };
  var $_7whrpglsjf3ft3it = { generate: generate$1 };

  var type$1 = $_7whrpglsjf3ft3it.generate([
    { none: [] },
    { multiple: ['elements'] },
    { single: ['selection'] }
  ]);
  var cata = function (subject, onNone, onMultiple, onSingle) {
    return subject.fold(onNone, onMultiple, onSingle);
  };
  var $_fbllh2lrjf3ft3iq = {
    cata: cata,
    none: type$1.none,
    multiple: type$1.multiple,
    single: type$1.single
  };

  var selection = function (cell, selections) {
    return $_fbllh2lrjf3ft3iq.cata(selections.get(), $_6np0wpjsjf3ft34s.constant([]), $_6np0wpjsjf3ft34s.identity, $_6np0wpjsjf3ft34s.constant([cell]));
  };
  var unmergable = function (cell, selections) {
    var hasSpan = function (elem) {
      return $_fcjbkgkqjf3ft3af.has(elem, 'rowspan') && parseInt($_fcjbkgkqjf3ft3af.get(elem, 'rowspan'), 10) > 1 || $_fcjbkgkqjf3ft3af.has(elem, 'colspan') && parseInt($_fcjbkgkqjf3ft3af.get(elem, 'colspan'), 10) > 1;
    };
    var candidates = selection(cell, selections);
    return candidates.length > 0 && $_5qd2tsjqjf3ft34c.forall(candidates, hasSpan) ? Option.some(candidates) : Option.none();
  };
  var mergable = function (table, selections) {
    return $_fbllh2lrjf3ft3iq.cata(selections.get(), Option.none, function (cells, _env) {
      if (cells.length === 0) {
        return Option.none();
      }
      return $_8c1u7vldjf3ft3f9.retrieveBox(table, $_43jdhslqjf3ft3in.firstSelectedSelector(), $_43jdhslqjf3ft3in.lastSelectedSelector()).bind(function (bounds) {
        return cells.length > 1 ? Option.some({
          bounds: $_6np0wpjsjf3ft34s.constant(bounds),
          cells: $_6np0wpjsjf3ft34s.constant(cells)
        }) : Option.none();
      });
    }, Option.none);
  };
  var $_5yktrelcjf3ft3f0 = {
    mergable: mergable,
    unmergable: unmergable,
    selection: selection
  };

  var noMenu = function (cell) {
    return {
      element: $_6np0wpjsjf3ft34s.constant(cell),
      mergable: Option.none,
      unmergable: Option.none,
      selection: $_6np0wpjsjf3ft34s.constant([cell])
    };
  };
  var forMenu = function (selections, table, cell) {
    return {
      element: $_6np0wpjsjf3ft34s.constant(cell),
      mergable: $_6np0wpjsjf3ft34s.constant($_5yktrelcjf3ft3f0.mergable(table, selections)),
      unmergable: $_6np0wpjsjf3ft34s.constant($_5yktrelcjf3ft3f0.unmergable(cell, selections)),
      selection: $_6np0wpjsjf3ft34s.constant($_5yktrelcjf3ft3f0.selection(cell, selections))
    };
  };
  var notCell$1 = function (element) {
    return noMenu(element);
  };
  var paste$1 = $_4bo75gjvjf3ft35r.immutable('element', 'clipboard', 'generators');
  var pasteRows = function (selections, table, cell, clipboard, generators) {
    return {
      element: $_6np0wpjsjf3ft34s.constant(cell),
      mergable: Option.none,
      unmergable: Option.none,
      selection: $_6np0wpjsjf3ft34s.constant($_5yktrelcjf3ft3f0.selection(cell, selections)),
      clipboard: $_6np0wpjsjf3ft34s.constant(clipboard),
      generators: $_6np0wpjsjf3ft34s.constant(generators)
    };
  };
  var $_ch69x3lbjf3ft3eu = {
    noMenu: noMenu,
    forMenu: forMenu,
    notCell: notCell$1,
    paste: paste$1,
    pasteRows: pasteRows
  };

  var extractSelected = function (cells) {
    return $_3oodk9k2jf3ft36l.table(cells[0]).map($_3qbzp9l5jf3ft3e2.deep).map(function (replica) {
      return [$_3gtbu2jtjf3ft34y.extract(replica, $_43jdhslqjf3ft3in.attributeSelector())];
    });
  };
  var serializeElement = function (editor, elm) {
    return editor.selection.serializer.serialize(elm.dom(), {});
  };
  var registerEvents = function (editor, selections, actions, cellSelection) {
    editor.on('BeforeGetContent', function (e) {
      var multiCellContext = function (cells) {
        e.preventDefault();
        extractSelected(cells).each(function (elements) {
          e.content = $_5qd2tsjqjf3ft34c.map(elements, function (elm) {
            return serializeElement(editor, elm);
          }).join('');
        });
      };
      if (e.selection === true) {
        $_fbllh2lrjf3ft3iq.cata(selections.get(), $_6np0wpjsjf3ft34s.noop, multiCellContext, $_6np0wpjsjf3ft34s.noop);
      }
    });
    editor.on('BeforeSetContent', function (e) {
      if (e.selection === true && e.paste === true) {
        var cellOpt = Option.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        cellOpt.each(function (domCell) {
          var cell = $_cjzqfhk5jf3ft37x.fromDom(domCell);
          var table = $_3oodk9k2jf3ft36l.table(cell);
          table.bind(function (table) {
            var elements = $_5qd2tsjqjf3ft34c.filter($_4abckllajf3ft3er.fromHtml(e.content), function (content) {
              return $_3seq30krjf3ft3as.name(content) !== 'meta';
            });
            if (elements.length === 1 && $_3seq30krjf3ft3as.name(elements[0]) === 'table') {
              e.preventDefault();
              var doc = $_cjzqfhk5jf3ft37x.fromDom(editor.getDoc());
              var generators = $_5zb0acl4jf3ft3de.paste(doc);
              var targets = $_ch69x3lbjf3ft3eu.paste(cell, elements[0], generators);
              actions.pasteCells(table, targets).each(function (rng) {
                editor.selection.setRng(rng);
                editor.focus();
                cellSelection.clear(table);
              });
            }
          });
        });
      }
    });
  };
  var $_bcrcgqjpjf3ft338 = { registerEvents: registerEvents };

  function Dimension (name, getOffset) {
    var set = function (element, h) {
      if (!$_424octjzjf3ft364.isNumber(h) && !h.match(/^[0-9]+$/))
        throw name + '.set accepts only positive integer values. Value was ' + h;
      var dom = element.dom();
      if ($_88mxmkl0jf3ft3cy.isSupported(dom))
        dom.style[name] = h + 'px';
    };
    var get = function (element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = $_9hbdczkzjf3ft3ci.get(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function (element, properties) {
      return $_5qd2tsjqjf3ft34c.foldl(properties, function (acc, property) {
        var val = $_9hbdczkzjf3ft3ci.get(element, property);
        var value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
    };
    var max = function (element, value, properties) {
      var cumulativeInclusions = aggregate(element, properties);
      var absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
      return absoluteMax;
    };
    return {
      set: set,
      get: get,
      getOuter: getOuter,
      aggregate: aggregate,
      max: max
    };
  }

  var api$1 = Dimension('height', function (element) {
    return $_5ev9q6kujf3ft3b4.inBody(element) ? element.dom().getBoundingClientRect().height : element.dom().offsetHeight;
  });
  var set$3 = function (element, h) {
    api$1.set(element, h);
  };
  var get$3 = function (element) {
    return api$1.get(element);
  };
  var getOuter = function (element) {
    return api$1.getOuter(element);
  };
  var setMax = function (element, value) {
    var inclusions = [
      'margin-top',
      'border-top-width',
      'padding-top',
      'padding-bottom',
      'border-bottom-width',
      'margin-bottom'
    ];
    var absMax = api$1.max(element, value, inclusions);
    $_9hbdczkzjf3ft3ci.set(element, 'max-height', absMax + 'px');
  };
  var $_65i6k8lxjf3ft3kj = {
    set: set$3,
    get: get$3,
    getOuter: getOuter,
    setMax: setMax
  };

  var api$2 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$4 = function (element, h) {
    api$2.set(element, h);
  };
  var get$4 = function (element) {
    return api$2.get(element);
  };
  var getOuter$1 = function (element) {
    return api$2.getOuter(element);
  };
  var setMax$1 = function (element, value) {
    var inclusions = [
      'margin-left',
      'border-left-width',
      'padding-left',
      'padding-right',
      'border-right-width',
      'margin-right'
    ];
    var absMax = api$2.max(element, value, inclusions);
    $_9hbdczkzjf3ft3ci.set(element, 'max-width', absMax + 'px');
  };
  var $_1rutitlzjf3ft3kr = {
    set: set$4,
    get: get$4,
    getOuter: getOuter$1,
    setMax: setMax$1
  };

  var platform = $_8vnd6hkejf3ft397.detect();
  var needManualCalc = function () {
    return platform.browser.isIE() || platform.browser.isEdge();
  };
  var toNumber = function (px, fallback) {
    var num = parseFloat(px);
    return isNaN(num) ? fallback : num;
  };
  var getProp = function (elm, name, fallback) {
    return toNumber($_9hbdczkzjf3ft3ci.get(elm, name), fallback);
  };
  var getCalculatedHeight = function (cell) {
    var paddingTop = getProp(cell, 'padding-top', 0);
    var paddingBottom = getProp(cell, 'padding-bottom', 0);
    var borderTop = getProp(cell, 'border-top-width', 0);
    var borderBottom = getProp(cell, 'border-bottom-width', 0);
    var height = cell.dom().getBoundingClientRect().height;
    var boxSizing = $_9hbdczkzjf3ft3ci.get(cell, 'box-sizing');
    var borders = borderTop + borderBottom;
    return boxSizing === 'border-box' ? height : height - paddingTop - paddingBottom - borders;
  };
  var getWidth = function (cell) {
    return getProp(cell, 'width', $_1rutitlzjf3ft3kr.get(cell));
  };
  var getHeight = function (cell) {
    return needManualCalc() ? getCalculatedHeight(cell) : getProp(cell, 'height', $_65i6k8lxjf3ft3kj.get(cell));
  };
  var $_49fus7lwjf3ft3kb = {
    getWidth: getWidth,
    getHeight: getHeight
  };

  var genericSizeRegex = /(\d+(\.\d+)?)(\w|%)*/;
  var percentageBasedSizeRegex = /(\d+(\.\d+)?)%/;
  var pixelBasedSizeRegex = /(\d+(\.\d+)?)px|em/;
  var setPixelWidth = function (cell, amount) {
    $_9hbdczkzjf3ft3ci.set(cell, 'width', amount + 'px');
  };
  var setPercentageWidth = function (cell, amount) {
    $_9hbdczkzjf3ft3ci.set(cell, 'width', amount + '%');
  };
  var setHeight = function (cell, amount) {
    $_9hbdczkzjf3ft3ci.set(cell, 'height', amount + 'px');
  };
  var getHeightValue = function (cell) {
    return $_9hbdczkzjf3ft3ci.getRaw(cell, 'height').getOrThunk(function () {
      return $_49fus7lwjf3ft3kb.getHeight(cell) + 'px';
    });
  };
  var convert = function (cell, number, getter, setter) {
    var newSize = $_3oodk9k2jf3ft36l.table(cell).map(function (table) {
      var total = getter(table);
      return Math.floor(number / 100 * total);
    }).getOr(number);
    setter(cell, newSize);
    return newSize;
  };
  var normalizePixelSize = function (value, cell, getter, setter) {
    var number = parseInt(value, 10);
    return $_65qcg9knjf3ft3a7.endsWith(value, '%') && $_3seq30krjf3ft3as.name(cell) !== 'table' ? convert(cell, number, getter, setter) : number;
  };
  var getTotalHeight = function (cell) {
    var value = getHeightValue(cell);
    if (!value)
      return $_65i6k8lxjf3ft3kj.get(cell);
    return normalizePixelSize(value, cell, $_65i6k8lxjf3ft3kj.get, setHeight);
  };
  var get$5 = function (cell, type, f) {
    var v = f(cell);
    var span = getSpan(cell, type);
    return v / span;
  };
  var getSpan = function (cell, type) {
    return $_fcjbkgkqjf3ft3af.has(cell, type) ? parseInt($_fcjbkgkqjf3ft3af.get(cell, type), 10) : 1;
  };
  var getRawWidth = function (element) {
    var cssWidth = $_9hbdczkzjf3ft3ci.getRaw(element, 'width');
    return cssWidth.fold(function () {
      return Option.from($_fcjbkgkqjf3ft3af.get(element, 'width'));
    }, function (width) {
      return Option.some(width);
    });
  };
  var normalizePercentageWidth = function (cellWidth, tableSize) {
    return cellWidth / tableSize.pixelWidth() * 100;
  };
  var choosePercentageSize = function (element, width, tableSize) {
    if (percentageBasedSizeRegex.test(width)) {
      var percentMatch = percentageBasedSizeRegex.exec(width);
      return parseFloat(percentMatch[1]);
    } else {
      var fallbackWidth = $_1rutitlzjf3ft3kr.get(element);
      var intWidth = parseInt(fallbackWidth, 10);
      return normalizePercentageWidth(intWidth, tableSize);
    }
  };
  var getPercentageWidth = function (cell, tableSize) {
    var width = getRawWidth(cell);
    return width.fold(function () {
      var width = $_1rutitlzjf3ft3kr.get(cell);
      var intWidth = parseInt(width, 10);
      return normalizePercentageWidth(intWidth, tableSize);
    }, function (width) {
      return choosePercentageSize(cell, width, tableSize);
    });
  };
  var normalizePixelWidth = function (cellWidth, tableSize) {
    return cellWidth / 100 * tableSize.pixelWidth();
  };
  var choosePixelSize = function (element, width, tableSize) {
    if (pixelBasedSizeRegex.test(width)) {
      var pixelMatch = pixelBasedSizeRegex.exec(width);
      return parseInt(pixelMatch[1], 10);
    } else if (percentageBasedSizeRegex.test(width)) {
      var percentMatch = percentageBasedSizeRegex.exec(width);
      var floatWidth = parseFloat(percentMatch[1]);
      return normalizePixelWidth(floatWidth, tableSize);
    } else {
      var fallbackWidth = $_1rutitlzjf3ft3kr.get(element);
      return parseInt(fallbackWidth, 10);
    }
  };
  var getPixelWidth = function (cell, tableSize) {
    var width = getRawWidth(cell);
    return width.fold(function () {
      var width = $_1rutitlzjf3ft3kr.get(cell);
      var intWidth = parseInt(width, 10);
      return intWidth;
    }, function (width) {
      return choosePixelSize(cell, width, tableSize);
    });
  };
  var getHeight$1 = function (cell) {
    return get$5(cell, 'rowspan', getTotalHeight);
  };
  var getGenericWidth = function (cell) {
    var width = getRawWidth(cell);
    return width.bind(function (width) {
      if (genericSizeRegex.test(width)) {
        var match = genericSizeRegex.exec(width);
        return Option.some({
          width: $_6np0wpjsjf3ft34s.constant(match[1]),
          unit: $_6np0wpjsjf3ft34s.constant(match[3])
        });
      } else {
        return Option.none();
      }
    });
  };
  var setGenericWidth = function (cell, amount, unit) {
    $_9hbdczkzjf3ft3ci.set(cell, 'width', amount + unit);
  };
  var $_29iclslvjf3ft3jg = {
    percentageBasedSizeRegex: $_6np0wpjsjf3ft34s.constant(percentageBasedSizeRegex),
    pixelBasedSizeRegex: $_6np0wpjsjf3ft34s.constant(pixelBasedSizeRegex),
    setPixelWidth: setPixelWidth,
    setPercentageWidth: setPercentageWidth,
    setHeight: setHeight,
    getPixelWidth: getPixelWidth,
    getPercentageWidth: getPercentageWidth,
    getGenericWidth: getGenericWidth,
    setGenericWidth: setGenericWidth,
    getHeight: getHeight$1,
    getRawWidth: getRawWidth
  };

  var halve = function (main, other) {
    var width = $_29iclslvjf3ft3jg.getGenericWidth(main);
    width.each(function (width) {
      var newWidth = width.width() / 2;
      $_29iclslvjf3ft3jg.setGenericWidth(main, newWidth, width.unit());
      $_29iclslvjf3ft3jg.setGenericWidth(other, newWidth, width.unit());
    });
  };
  var $_an3rg3lujf3ft3jc = { halve: halve };

  var attached = function (element, scope) {
    var doc = scope || $_cjzqfhk5jf3ft37x.fromDom(document.documentElement);
    return $_4np8xgkwjf3ft3bp.ancestor(element, $_6np0wpjsjf3ft34s.curry($_avffyek9jf3ft38l.eq, doc)).isSome();
  };
  var windowOf = function (element) {
    var dom = element.dom();
    if (dom === dom.window)
      return element;
    return $_3seq30krjf3ft3as.isDocument(element) ? dom.defaultView || dom.parentWindow : null;
  };
  var $_ajx8dzm4jf3ft3lb = {
    attached: attached,
    windowOf: windowOf
  };

  var r = function (left, top) {
    var translate = function (x, y) {
      return r(left + x, top + y);
    };
    return {
      left: $_6np0wpjsjf3ft34s.constant(left),
      top: $_6np0wpjsjf3ft34s.constant(top),
      translate: translate
    };
  };

  var boxPosition = function (dom) {
    var box = dom.getBoundingClientRect();
    return r(box.left, box.top);
  };
  var firstDefinedOrZero = function (a, b) {
    return a !== undefined ? a : b !== undefined ? b : 0;
  };
  var absolute = function (element) {
    var doc = element.dom().ownerDocument;
    var body = doc.body;
    var win = $_ajx8dzm4jf3ft3lb.windowOf($_cjzqfhk5jf3ft37x.fromDom(doc));
    var html = doc.documentElement;
    var scrollTop = firstDefinedOrZero(win.pageYOffset, html.scrollTop);
    var scrollLeft = firstDefinedOrZero(win.pageXOffset, html.scrollLeft);
    var clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
    var clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);
    return viewport(element).translate(scrollLeft - clientLeft, scrollTop - clientTop);
  };
  var relative = function (element) {
    var dom = element.dom();
    return r(dom.offsetLeft, dom.offsetTop);
  };
  var viewport = function (element) {
    var dom = element.dom();
    var doc = dom.ownerDocument;
    var body = doc.body;
    var html = $_cjzqfhk5jf3ft37x.fromDom(doc.documentElement);
    if (body === dom)
      return r(body.offsetLeft, body.offsetTop);
    if (!$_ajx8dzm4jf3ft3lb.attached(element, html))
      return r(0, 0);
    return boxPosition(dom);
  };
  var $_3hwkw8m3jf3ft3l9 = {
    absolute: absolute,
    relative: relative,
    viewport: viewport
  };

  var rowInfo = $_4bo75gjvjf3ft35r.immutable('row', 'y');
  var colInfo = $_4bo75gjvjf3ft35r.immutable('col', 'x');
  var rtlEdge = function (cell) {
    var pos = $_3hwkw8m3jf3ft3l9.absolute(cell);
    return pos.left() + $_1rutitlzjf3ft3kr.getOuter(cell);
  };
  var ltrEdge = function (cell) {
    return $_3hwkw8m3jf3ft3l9.absolute(cell).left();
  };
  var getLeftEdge = function (index, cell) {
    return colInfo(index, ltrEdge(cell));
  };
  var getRightEdge = function (index, cell) {
    return colInfo(index, rtlEdge(cell));
  };
  var getTop = function (cell) {
    return $_3hwkw8m3jf3ft3l9.absolute(cell).top();
  };
  var getTopEdge = function (index, cell) {
    return rowInfo(index, getTop(cell));
  };
  var getBottomEdge = function (index, cell) {
    return rowInfo(index, getTop(cell) + $_65i6k8lxjf3ft3kj.getOuter(cell));
  };
  var findPositions = function (getInnerEdge, getOuterEdge, array) {
    if (array.length === 0)
      return [];
    var lines = $_5qd2tsjqjf3ft34c.map(array.slice(1), function (cellOption, index) {
      return cellOption.map(function (cell) {
        return getInnerEdge(index, cell);
      });
    });
    var lastLine = array[array.length - 1].map(function (cell) {
      return getOuterEdge(array.length - 1, cell);
    });
    return lines.concat([lastLine]);
  };
  var negate = function (step, _table) {
    return -step;
  };
  var height = {
    delta: $_6np0wpjsjf3ft34s.identity,
    positions: $_6np0wpjsjf3ft34s.curry(findPositions, getTopEdge, getBottomEdge),
    edge: getTop
  };
  var ltr = {
    delta: $_6np0wpjsjf3ft34s.identity,
    edge: ltrEdge,
    positions: $_6np0wpjsjf3ft34s.curry(findPositions, getLeftEdge, getRightEdge)
  };
  var rtl = {
    delta: negate,
    edge: rtlEdge,
    positions: $_6np0wpjsjf3ft34s.curry(findPositions, getRightEdge, getLeftEdge)
  };
  var $_63tlbdm2jf3ft3kw = {
    height: height,
    rtl: rtl,
    ltr: ltr
  };

  var $_6qul3ym1jf3ft3ku = {
    ltr: $_63tlbdm2jf3ft3kw.ltr,
    rtl: $_63tlbdm2jf3ft3kw.rtl
  };

  function TableDirection (directionAt) {
    var auto = function (table) {
      return directionAt(table).isRtl() ? $_6qul3ym1jf3ft3ku.rtl : $_6qul3ym1jf3ft3ku.ltr;
    };
    var delta = function (amount, table) {
      return auto(table).delta(amount, table);
    };
    var positions = function (cols, table) {
      return auto(table).positions(cols, table);
    };
    var edge = function (cell) {
      return auto(cell).edge(cell);
    };
    return {
      delta: delta,
      edge: edge,
      positions: positions
    };
  }

  var getGridSize = function (table) {
    var input = $_7r7n5rk0jf3ft367.fromTable(table);
    var warehouse = $_50juipkyjf3ft3c6.generate(input);
    return warehouse.grid();
  };
  var $_fiaglmm6jf3ft3ll = { getGridSize: getGridSize };

  var Cell = function (initial) {
    var value = initial;
    var get = function () {
      return value;
    };
    var set = function (v) {
      value = v;
    };
    var clone = function () {
      return Cell(get());
    };
    return {
      get: get,
      set: set,
      clone: clone
    };
  };

  var base = function (handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: $_424octjzjf3ft364.isFunction,
      label: 'function'
    });
  };
  var baseWith = function (handleUnsupported, required, pred) {
    if (required.length === 0)
      throw new Error('You must specify at least one required field.');
    $_4m4npujyjf3ft361.validateStrArr('required', required);
    $_4m4npujyjf3ft361.checkDupes(required);
    return function (obj) {
      var keys = $_6j7iurjujf3ft35n.keys(obj);
      var allReqd = $_5qd2tsjqjf3ft34c.forall(required, function (req) {
        return $_5qd2tsjqjf3ft34c.contains(keys, req);
      });
      if (!allReqd)
        $_4m4npujyjf3ft361.reqMessage(required, keys);
      handleUnsupported(required, keys);
      var invalidKeys = $_5qd2tsjqjf3ft34c.filter(required, function (key) {
        return !pred.validate(obj[key], key);
      });
      if (invalidKeys.length > 0)
        $_4m4npujyjf3ft361.invalidTypeMessage(invalidKeys, pred.label);
      return obj;
    };
  };
  var handleExact = function (required, keys) {
    var unsupported = $_5qd2tsjqjf3ft34c.filter(keys, function (key) {
      return !$_5qd2tsjqjf3ft34c.contains(required, key);
    });
    if (unsupported.length > 0)
      $_4m4npujyjf3ft361.unsuppMessage(unsupported);
  };
  var allowExtra = $_6np0wpjsjf3ft34s.noop;
  var $_hmvgzmajf3ft3ms = {
    exactly: $_6np0wpjsjf3ft34s.curry(base, handleExact),
    ensure: $_6np0wpjsjf3ft34s.curry(base, allowExtra),
    ensureWith: $_6np0wpjsjf3ft34s.curry(baseWith, allowExtra)
  };

  var elementToData = function (element) {
    var colspan = $_fcjbkgkqjf3ft3af.has(element, 'colspan') ? parseInt($_fcjbkgkqjf3ft3af.get(element, 'colspan'), 10) : 1;
    var rowspan = $_fcjbkgkqjf3ft3af.has(element, 'rowspan') ? parseInt($_fcjbkgkqjf3ft3af.get(element, 'rowspan'), 10) : 1;
    return {
      element: $_6np0wpjsjf3ft34s.constant(element),
      colspan: $_6np0wpjsjf3ft34s.constant(colspan),
      rowspan: $_6np0wpjsjf3ft34s.constant(rowspan)
    };
  };
  var modification = function (generators, _toData) {
    contract(generators);
    var position = Cell(Option.none());
    var toData = _toData !== undefined ? _toData : elementToData;
    var nu = function (data) {
      return generators.cell(data);
    };
    var nuFrom = function (element) {
      var data = toData(element);
      return nu(data);
    };
    var add = function (element) {
      var replacement = nuFrom(element);
      if (position.get().isNone())
        position.set(Option.some(replacement));
      recent = Option.some({
        item: element,
        replacement: replacement
      });
      return replacement;
    };
    var recent = Option.none();
    var getOrInit = function (element, comparator) {
      return recent.fold(function () {
        return add(element);
      }, function (p) {
        return comparator(element, p.item) ? p.replacement : add(element);
      });
    };
    return {
      getOrInit: getOrInit,
      cursor: position.get
    };
  };
  var transform = function (scope, tag) {
    return function (generators) {
      var position = Cell(Option.none());
      contract(generators);
      var list = [];
      var find = function (element, comparator) {
        return $_5qd2tsjqjf3ft34c.find(list, function (x) {
          return comparator(x.item, element);
        });
      };
      var makeNew = function (element) {
        var cell = generators.replace(element, tag, { scope: scope });
        list.push({
          item: element,
          sub: cell
        });
        if (position.get().isNone())
          position.set(Option.some(cell));
        return cell;
      };
      var replaceOrInit = function (element, comparator) {
        return find(element, comparator).fold(function () {
          return makeNew(element);
        }, function (p) {
          return comparator(element, p.item) ? p.sub : makeNew(element);
        });
      };
      return {
        replaceOrInit: replaceOrInit,
        cursor: position.get
      };
    };
  };
  var merging = function (generators) {
    contract(generators);
    var position = Cell(Option.none());
    var combine = function (cell) {
      if (position.get().isNone())
        position.set(Option.some(cell));
      return function () {
        var raw = generators.cell({
          element: $_6np0wpjsjf3ft34s.constant(cell),
          colspan: $_6np0wpjsjf3ft34s.constant(1),
          rowspan: $_6np0wpjsjf3ft34s.constant(1)
        });
        $_9hbdczkzjf3ft3ci.remove(raw, 'width');
        $_9hbdczkzjf3ft3ci.remove(cell, 'width');
        return raw;
      };
    };
    return {
      combine: combine,
      cursor: position.get
    };
  };
  var contract = $_hmvgzmajf3ft3ms.exactly([
    'cell',
    'row',
    'replace',
    'gap'
  ]);
  var $_dlah8ym8jf3ft3m7 = {
    modification: modification,
    transform: transform,
    merging: merging
  };

  var blockList = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'table',
    'thead',
    'tfoot',
    'tbody',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ];
  var isList = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_5qd2tsjqjf3ft34c.contains([
      'ol',
      'ul'
    ], tagName);
  };
  var isBlock = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_5qd2tsjqjf3ft34c.contains(blockList, tagName);
  };
  var isFormatting = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_5qd2tsjqjf3ft34c.contains([
      'address',
      'pre',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ], tagName);
  };
  var isHeading = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_5qd2tsjqjf3ft34c.contains([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ], tagName);
  };
  var isContainer = function (universe, item) {
    return $_5qd2tsjqjf3ft34c.contains([
      'div',
      'li',
      'td',
      'th',
      'blockquote',
      'body',
      'caption'
    ], universe.property().name(item));
  };
  var isEmptyTag = function (universe, item) {
    return $_5qd2tsjqjf3ft34c.contains([
      'br',
      'img',
      'hr',
      'input'
    ], universe.property().name(item));
  };
  var isFrame = function (universe, item) {
    return universe.property().name(item) === 'iframe';
  };
  var isInline = function (universe, item) {
    return !(isBlock(universe, item) || isEmptyTag(universe, item)) && universe.property().name(item) !== 'li';
  };
  var $_7np3pxmdjf3ft3nv = {
    isBlock: isBlock,
    isList: isList,
    isFormatting: isFormatting,
    isHeading: isHeading,
    isContainer: isContainer,
    isEmptyTag: isEmptyTag,
    isFrame: isFrame,
    isInline: isInline
  };

  var universe$1 = DomUniverse();
  var isBlock$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isBlock(universe$1, element);
  };
  var isList$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isList(universe$1, element);
  };
  var isFormatting$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isFormatting(universe$1, element);
  };
  var isHeading$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isHeading(universe$1, element);
  };
  var isContainer$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isContainer(universe$1, element);
  };
  var isEmptyTag$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isEmptyTag(universe$1, element);
  };
  var isFrame$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isFrame(universe$1, element);
  };
  var isInline$1 = function (element) {
    return $_7np3pxmdjf3ft3nv.isInline(universe$1, element);
  };
  var $_5n8omdmcjf3ft3nq = {
    isBlock: isBlock$1,
    isList: isList$1,
    isFormatting: isFormatting$1,
    isHeading: isHeading$1,
    isContainer: isContainer$1,
    isEmptyTag: isEmptyTag$1,
    isFrame: isFrame$1,
    isInline: isInline$1
  };

  var merge = function (cells) {
    var isBr = function (el) {
      return $_3seq30krjf3ft3as.name(el) === 'br';
    };
    var advancedBr = function (children) {
      return $_5qd2tsjqjf3ft34c.forall(children, function (c) {
        return isBr(c) || $_3seq30krjf3ft3as.isText(c) && $_e4e6aul8jf3ft3ek.get(c).trim().length === 0;
      });
    };
    var isListItem = function (el) {
      return $_3seq30krjf3ft3as.name(el) === 'li' || $_4np8xgkwjf3ft3bp.ancestor(el, $_5n8omdmcjf3ft3nq.isList).isSome();
    };
    var siblingIsBlock = function (el) {
      return $_a4gvewk7jf3ft384.nextSibling(el).map(function (rightSibling) {
        if ($_5n8omdmcjf3ft3nq.isBlock(rightSibling))
          return true;
        if ($_5n8omdmcjf3ft3nq.isEmptyTag(rightSibling)) {
          return $_3seq30krjf3ft3as.name(rightSibling) === 'img' ? false : true;
        }
      }).getOr(false);
    };
    var markCell = function (cell) {
      return $_bksv9ol6jf3ft3e5.last(cell).bind(function (rightEdge) {
        var rightSiblingIsBlock = siblingIsBlock(rightEdge);
        return $_a4gvewk7jf3ft384.parent(rightEdge).map(function (parent) {
          return rightSiblingIsBlock === true || isListItem(parent) || isBr(rightEdge) || $_5n8omdmcjf3ft3nq.isBlock(parent) && !$_avffyek9jf3ft38l.eq(cell, parent) ? [] : [$_cjzqfhk5jf3ft37x.fromTag('br')];
        });
      }).getOr([]);
    };
    var markContent = function () {
      var content = $_5qd2tsjqjf3ft34c.bind(cells, function (cell) {
        var children = $_a4gvewk7jf3ft384.children(cell);
        return advancedBr(children) ? [] : children.concat(markCell(cell));
      });
      return content.length === 0 ? [$_cjzqfhk5jf3ft37x.fromTag('br')] : content;
    };
    var contents = markContent();
    $_1fts8il2jf3ft3d3.empty(cells[0]);
    $_e6z7itl3jf3ft3d9.append(cells[0], contents);
  };
  var $_ergxgwmbjf3ft3n5 = { merge: merge };

  var shallow$1 = function (old, nu) {
    return nu;
  };
  var deep$1 = function (old, nu) {
    var bothObjects = $_424octjzjf3ft364.isObject(old) && $_424octjzjf3ft364.isObject(nu);
    return bothObjects ? deepMerge(old, nu) : nu;
  };
  var baseMerge = function (merger) {
    return function () {
      var objects = new Array(arguments.length);
      for (var i = 0; i < objects.length; i++)
        objects[i] = arguments[i];
      if (objects.length === 0)
        throw new Error('Can\'t merge zero objects');
      var ret = {};
      for (var j = 0; j < objects.length; j++) {
        var curObject = objects[j];
        for (var key in curObject)
          if (curObject.hasOwnProperty(key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
      }
      return ret;
    };
  };
  var deepMerge = baseMerge(deep$1);
  var merge$1 = baseMerge(shallow$1);
  var $_18tx14mfjf3ft3on = {
    deepMerge: deepMerge,
    merge: merge$1
  };

  var cat = function (arr) {
    var r = [];
    var push = function (x) {
      r.push(x);
    };
    for (var i = 0; i < arr.length; i++) {
      arr[i].each(push);
    }
    return r;
  };
  var findMap = function (arr, f) {
    for (var i = 0; i < arr.length; i++) {
      var r = f(arr[i], i);
      if (r.isSome()) {
        return r;
      }
    }
    return Option.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return Option.none();
      }
    }
    return Option.some(f.apply(null, r));
  };
  var $_2wgl26mgjf3ft3op = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var addCell = function (gridRow, index, cell) {
    var cells = gridRow.cells();
    var before = cells.slice(0, index);
    var after = cells.slice(index);
    var newCells = before.concat([cell]).concat(after);
    return setCells(gridRow, newCells);
  };
  var mutateCell = function (gridRow, index, cell) {
    var cells = gridRow.cells();
    cells[index] = cell;
  };
  var setCells = function (gridRow, cells) {
    return $_9kexg1k1jf3ft36h.rowcells(cells, gridRow.section());
  };
  var mapCells = function (gridRow, f) {
    var cells = gridRow.cells();
    var r = $_5qd2tsjqjf3ft34c.map(cells, f);
    return $_9kexg1k1jf3ft36h.rowcells(r, gridRow.section());
  };
  var getCell = function (gridRow, index) {
    return gridRow.cells()[index];
  };
  var getCellElement = function (gridRow, index) {
    return getCell(gridRow, index).element();
  };
  var cellLength = function (gridRow) {
    return gridRow.cells().length;
  };
  var $_784qcsmjjf3ft3p5 = {
    addCell: addCell,
    setCells: setCells,
    mutateCell: mutateCell,
    getCell: getCell,
    getCellElement: getCellElement,
    mapCells: mapCells,
    cellLength: cellLength
  };

  var getColumn = function (grid, index) {
    return $_5qd2tsjqjf3ft34c.map(grid, function (row) {
      return $_784qcsmjjf3ft3p5.getCell(row, index);
    });
  };
  var getRow = function (grid, index) {
    return grid[index];
  };
  var findDiff = function (xs, comp) {
    if (xs.length === 0)
      return 0;
    var first = xs[0];
    var index = $_5qd2tsjqjf3ft34c.findIndex(xs, function (x) {
      return !comp(first.element(), x.element());
    });
    return index.fold(function () {
      return xs.length;
    }, function (ind) {
      return ind;
    });
  };
  var subgrid = function (grid, row, column, comparator) {
    var restOfRow = getRow(grid, row).cells().slice(column);
    var endColIndex = findDiff(restOfRow, comparator);
    var restOfColumn = getColumn(grid, column).slice(row);
    var endRowIndex = findDiff(restOfColumn, comparator);
    return {
      colspan: $_6np0wpjsjf3ft34s.constant(endColIndex),
      rowspan: $_6np0wpjsjf3ft34s.constant(endRowIndex)
    };
  };
  var $_8fjwvdmijf3ft3oz = { subgrid: subgrid };

  var toDetails = function (grid, comparator) {
    var seen = $_5qd2tsjqjf3ft34c.map(grid, function (row, ri) {
      return $_5qd2tsjqjf3ft34c.map(row.cells(), function (col, ci) {
        return false;
      });
    });
    var updateSeen = function (ri, ci, rowspan, colspan) {
      for (var r = ri; r < ri + rowspan; r++) {
        for (var c = ci; c < ci + colspan; c++) {
          seen[r][c] = true;
        }
      }
    };
    return $_5qd2tsjqjf3ft34c.map(grid, function (row, ri) {
      var details = $_5qd2tsjqjf3ft34c.bind(row.cells(), function (cell, ci) {
        if (seen[ri][ci] === false) {
          var result = $_8fjwvdmijf3ft3oz.subgrid(grid, ri, ci, comparator);
          updateSeen(ri, ci, result.rowspan(), result.colspan());
          return [$_9kexg1k1jf3ft36h.detailnew(cell.element(), result.rowspan(), result.colspan(), cell.isNew())];
        } else {
          return [];
        }
      });
      return $_9kexg1k1jf3ft36h.rowdetails(details, row.section());
    });
  };
  var toGrid = function (warehouse, generators, isNew) {
    var grid = [];
    for (var i = 0; i < warehouse.grid().rows(); i++) {
      var rowCells = [];
      for (var j = 0; j < warehouse.grid().columns(); j++) {
        var element = $_50juipkyjf3ft3c6.getAt(warehouse, i, j).map(function (item) {
          return $_9kexg1k1jf3ft36h.elementnew(item.element(), isNew);
        }).getOrThunk(function () {
          return $_9kexg1k1jf3ft36h.elementnew(generators.gap(), true);
        });
        rowCells.push(element);
      }
      var row = $_9kexg1k1jf3ft36h.rowcells(rowCells, warehouse.all()[i].section());
      grid.push(row);
    }
    return grid;
  };
  var $_8rv75imhjf3ft3or = {
    toDetails: toDetails,
    toGrid: toGrid
  };

  var setIfNot = function (element, property, value, ignore) {
    if (value === ignore)
      $_fcjbkgkqjf3ft3af.remove(element, property);
    else
      $_fcjbkgkqjf3ft3af.set(element, property, value);
  };
  var render = function (table, grid) {
    var newRows = [];
    var newCells = [];
    var renderSection = function (gridSection, sectionName) {
      var section = $_fhotvakvjf3ft3bm.child(table, sectionName).getOrThunk(function () {
        var tb = $_cjzqfhk5jf3ft37x.fromTag(sectionName, $_a4gvewk7jf3ft384.owner(table).dom());
        $_au51ntl1jf3ft3d0.append(table, tb);
        return tb;
      });
      $_1fts8il2jf3ft3d3.empty(section);
      var rows = $_5qd2tsjqjf3ft34c.map(gridSection, function (row) {
        if (row.isNew()) {
          newRows.push(row.element());
        }
        var tr = row.element();
        $_1fts8il2jf3ft3d3.empty(tr);
        $_5qd2tsjqjf3ft34c.each(row.cells(), function (cell) {
          if (cell.isNew()) {
            newCells.push(cell.element());
          }
          setIfNot(cell.element(), 'colspan', cell.colspan(), 1);
          setIfNot(cell.element(), 'rowspan', cell.rowspan(), 1);
          $_au51ntl1jf3ft3d0.append(tr, cell.element());
        });
        return tr;
      });
      $_e6z7itl3jf3ft3d9.append(section, rows);
    };
    var removeSection = function (sectionName) {
      $_fhotvakvjf3ft3bm.child(table, sectionName).bind($_1fts8il2jf3ft3d3.remove);
    };
    var renderOrRemoveSection = function (gridSection, sectionName) {
      if (gridSection.length > 0) {
        renderSection(gridSection, sectionName);
      } else {
        removeSection(sectionName);
      }
    };
    var headSection = [];
    var bodySection = [];
    var footSection = [];
    $_5qd2tsjqjf3ft34c.each(grid, function (row) {
      switch (row.section()) {
      case 'thead':
        headSection.push(row);
        break;
      case 'tbody':
        bodySection.push(row);
        break;
      case 'tfoot':
        footSection.push(row);
        break;
      }
    });
    renderOrRemoveSection(headSection, 'thead');
    renderOrRemoveSection(bodySection, 'tbody');
    renderOrRemoveSection(footSection, 'tfoot');
    return {
      newRows: $_6np0wpjsjf3ft34s.constant(newRows),
      newCells: $_6np0wpjsjf3ft34s.constant(newCells)
    };
  };
  var copy$2 = function (grid) {
    var rows = $_5qd2tsjqjf3ft34c.map(grid, function (row) {
      var tr = $_3qbzp9l5jf3ft3e2.shallow(row.element());
      $_5qd2tsjqjf3ft34c.each(row.cells(), function (cell) {
        var clonedCell = $_3qbzp9l5jf3ft3e2.deep(cell.element());
        setIfNot(clonedCell, 'colspan', cell.colspan(), 1);
        setIfNot(clonedCell, 'rowspan', cell.rowspan(), 1);
        $_au51ntl1jf3ft3d0.append(tr, clonedCell);
      });
      return tr;
    });
    return rows;
  };
  var $_8ppmr3mkjf3ft3pa = {
    render: render,
    copy: copy$2
  };

  var repeat = function (repititions, f) {
    var r = [];
    for (var i = 0; i < repititions; i++) {
      r.push(f(i));
    }
    return r;
  };
  var range$1 = function (start, end) {
    var r = [];
    for (var i = start; i < end; i++) {
      r.push(i);
    }
    return r;
  };
  var unique = function (xs, comparator) {
    var result = [];
    $_5qd2tsjqjf3ft34c.each(xs, function (x, i) {
      if (i < xs.length - 1 && !comparator(x, xs[i + 1])) {
        result.push(x);
      } else if (i === xs.length - 1) {
        result.push(x);
      }
    });
    return result;
  };
  var deduce = function (xs, index) {
    if (index < 0 || index >= xs.length - 1)
      return Option.none();
    var current = xs[index].fold(function () {
      var rest = $_5qd2tsjqjf3ft34c.reverse(xs.slice(0, index));
      return $_2wgl26mgjf3ft3op.findMap(rest, function (a, i) {
        return a.map(function (aa) {
          return {
            value: aa,
            delta: i + 1
          };
        });
      });
    }, function (c) {
      return Option.some({
        value: c,
        delta: 0
      });
    });
    var next = xs[index + 1].fold(function () {
      var rest = xs.slice(index + 1);
      return $_2wgl26mgjf3ft3op.findMap(rest, function (a, i) {
        return a.map(function (aa) {
          return {
            value: aa,
            delta: i + 1
          };
        });
      });
    }, function (n) {
      return Option.some({
        value: n,
        delta: 1
      });
    });
    return current.bind(function (c) {
      return next.map(function (n) {
        var extras = n.delta + c.delta;
        return Math.abs(n.value - c.value) / extras;
      });
    });
  };
  var $_94edh4mnjf3ft3r0 = {
    repeat: repeat,
    range: range$1,
    unique: unique,
    deduce: deduce
  };

  var columns = function (warehouse) {
    var grid = warehouse.grid();
    var cols = $_94edh4mnjf3ft3r0.range(0, grid.columns());
    var rows = $_94edh4mnjf3ft3r0.range(0, grid.rows());
    return $_5qd2tsjqjf3ft34c.map(cols, function (col) {
      var getBlock = function () {
        return $_5qd2tsjqjf3ft34c.bind(rows, function (r) {
          return $_50juipkyjf3ft3c6.getAt(warehouse, r, col).filter(function (detail) {
            return detail.column() === col;
          }).fold($_6np0wpjsjf3ft34s.constant([]), function (detail) {
            return [detail];
          });
        });
      };
      var isSingle = function (detail) {
        return detail.colspan() === 1;
      };
      var getFallback = function () {
        return $_50juipkyjf3ft3c6.getAt(warehouse, 0, col);
      };
      return decide(getBlock, isSingle, getFallback);
    });
  };
  var decide = function (getBlock, isSingle, getFallback) {
    var inBlock = getBlock();
    var singleInBlock = $_5qd2tsjqjf3ft34c.find(inBlock, isSingle);
    var detailOption = singleInBlock.orThunk(function () {
      return Option.from(inBlock[0]).orThunk(getFallback);
    });
    return detailOption.map(function (detail) {
      return detail.element();
    });
  };
  var rows$1 = function (warehouse) {
    var grid = warehouse.grid();
    var rows = $_94edh4mnjf3ft3r0.range(0, grid.rows());
    var cols = $_94edh4mnjf3ft3r0.range(0, grid.columns());
    return $_5qd2tsjqjf3ft34c.map(rows, function (row) {
      var getBlock = function () {
        return $_5qd2tsjqjf3ft34c.bind(cols, function (c) {
          return $_50juipkyjf3ft3c6.getAt(warehouse, row, c).filter(function (detail) {
            return detail.row() === row;
          }).fold($_6np0wpjsjf3ft34s.constant([]), function (detail) {
            return [detail];
          });
        });
      };
      var isSingle = function (detail) {
        return detail.rowspan() === 1;
      };
      var getFallback = function () {
        return $_50juipkyjf3ft3c6.getAt(warehouse, row, 0);
      };
      return decide(getBlock, isSingle, getFallback);
    });
  };
  var $_7qwwaxmmjf3ft3qp = {
    columns: columns,
    rows: rows$1
  };

  var col = function (column, x, y, w, h) {
    var blocker = $_cjzqfhk5jf3ft37x.fromTag('div');
    $_9hbdczkzjf3ft3ci.setAll(blocker, {
      position: 'absolute',
      left: x - w / 2 + 'px',
      top: y + 'px',
      height: h + 'px',
      width: w + 'px'
    });
    $_fcjbkgkqjf3ft3af.setAll(blocker, {
      'data-column': column,
      'role': 'presentation'
    });
    return blocker;
  };
  var row$1 = function (row, x, y, w, h) {
    var blocker = $_cjzqfhk5jf3ft37x.fromTag('div');
    $_9hbdczkzjf3ft3ci.setAll(blocker, {
      position: 'absolute',
      left: x + 'px',
      top: y - h / 2 + 'px',
      height: h + 'px',
      width: w + 'px'
    });
    $_fcjbkgkqjf3ft3af.setAll(blocker, {
      'data-row': row,
      'role': 'presentation'
    });
    return blocker;
  };
  var $_1auv2umojf3ft3ra = {
    col: col,
    row: row$1
  };

  var css = function (namespace) {
    var dashNamespace = namespace.replace(/\./g, '-');
    var resolve = function (str) {
      return dashNamespace + '-' + str;
    };
    return { resolve: resolve };
  };
  var $_9r2zzymqjf3ft3rj = { css: css };

  var styles = $_9r2zzymqjf3ft3rj.css('ephox-snooker');
  var $_dtzusgmpjf3ft3rg = { resolve: styles.resolve };

  function Toggler (turnOff, turnOn, initial) {
    var active = initial || false;
    var on = function () {
      turnOn();
      active = true;
    };
    var off = function () {
      turnOff();
      active = false;
    };
    var toggle = function () {
      var f = active ? off : on;
      f();
    };
    var isOn = function () {
      return active;
    };
    return {
      on: on,
      off: off,
      toggle: toggle,
      isOn: isOn
    };
  }

  var read = function (element, attr) {
    var value = $_fcjbkgkqjf3ft3af.get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add = function (element, attr, id) {
    var old = read(element, attr);
    var nu = old.concat([id]);
    $_fcjbkgkqjf3ft3af.set(element, attr, nu.join(' '));
  };
  var remove$3 = function (element, attr, id) {
    var nu = $_5qd2tsjqjf3ft34c.filter(read(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0)
      $_fcjbkgkqjf3ft3af.set(element, attr, nu.join(' '));
    else
      $_fcjbkgkqjf3ft3af.remove(element, attr);
  };
  var $_9oje7mujf3ft3rs = {
    read: read,
    add: add,
    remove: remove$3
  };

  var supports = function (element) {
    return element.dom().classList !== undefined;
  };
  var get$6 = function (element) {
    return $_9oje7mujf3ft3rs.read(element, 'class');
  };
  var add$1 = function (element, clazz) {
    return $_9oje7mujf3ft3rs.add(element, 'class', clazz);
  };
  var remove$4 = function (element, clazz) {
    return $_9oje7mujf3ft3rs.remove(element, 'class', clazz);
  };
  var toggle = function (element, clazz) {
    if ($_5qd2tsjqjf3ft34c.contains(get$6(element), clazz)) {
      remove$4(element, clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var $_2junsxmtjf3ft3rp = {
    get: get$6,
    add: add$1,
    remove: remove$4,
    toggle: toggle,
    supports: supports
  };

  var add$2 = function (element, clazz) {
    if ($_2junsxmtjf3ft3rp.supports(element))
      element.dom().classList.add(clazz);
    else
      $_2junsxmtjf3ft3rp.add(element, clazz);
  };
  var cleanClass = function (element) {
    var classList = $_2junsxmtjf3ft3rp.supports(element) ? element.dom().classList : $_2junsxmtjf3ft3rp.get(element);
    if (classList.length === 0) {
      $_fcjbkgkqjf3ft3af.remove(element, 'class');
    }
  };
  var remove$5 = function (element, clazz) {
    if ($_2junsxmtjf3ft3rp.supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else
      $_2junsxmtjf3ft3rp.remove(element, clazz);
    cleanClass(element);
  };
  var toggle$1 = function (element, clazz) {
    return $_2junsxmtjf3ft3rp.supports(element) ? element.dom().classList.toggle(clazz) : $_2junsxmtjf3ft3rp.toggle(element, clazz);
  };
  var toggler = function (element, clazz) {
    var hasClasslist = $_2junsxmtjf3ft3rp.supports(element);
    var classList = element.dom().classList;
    var off = function () {
      if (hasClasslist)
        classList.remove(clazz);
      else
        $_2junsxmtjf3ft3rp.remove(element, clazz);
    };
    var on = function () {
      if (hasClasslist)
        classList.add(clazz);
      else
        $_2junsxmtjf3ft3rp.add(element, clazz);
    };
    return Toggler(off, on, has$1(element, clazz));
  };
  var has$1 = function (element, clazz) {
    return $_2junsxmtjf3ft3rp.supports(element) && element.dom().classList.contains(clazz);
  };
  var $_8ycds3mrjf3ft3rl = {
    add: add$2,
    remove: remove$5,
    toggle: toggle$1,
    toggler: toggler,
    has: has$1
  };

  var resizeBar = $_dtzusgmpjf3ft3rg.resolve('resizer-bar');
  var resizeRowBar = $_dtzusgmpjf3ft3rg.resolve('resizer-rows');
  var resizeColBar = $_dtzusgmpjf3ft3rg.resolve('resizer-cols');
  var BAR_THICKNESS = 7;
  var clear = function (wire) {
    var previous = $_6pynzqksjf3ft3aw.descendants(wire.parent(), '.' + resizeBar);
    $_5qd2tsjqjf3ft34c.each(previous, $_1fts8il2jf3ft3d3.remove);
  };
  var drawBar = function (wire, positions, create) {
    var origin = wire.origin();
    $_5qd2tsjqjf3ft34c.each(positions, function (cpOption, i) {
      cpOption.each(function (cp) {
        var bar = create(origin, cp);
        $_8ycds3mrjf3ft3rl.add(bar, resizeBar);
        $_au51ntl1jf3ft3d0.append(wire.parent(), bar);
      });
    });
  };
  var refreshCol = function (wire, colPositions, position, tableHeight) {
    drawBar(wire, colPositions, function (origin, cp) {
      var colBar = $_1auv2umojf3ft3ra.col(cp.col(), cp.x() - origin.left(), position.top() - origin.top(), BAR_THICKNESS, tableHeight);
      $_8ycds3mrjf3ft3rl.add(colBar, resizeColBar);
      return colBar;
    });
  };
  var refreshRow = function (wire, rowPositions, position, tableWidth) {
    drawBar(wire, rowPositions, function (origin, cp) {
      var rowBar = $_1auv2umojf3ft3ra.row(cp.row(), position.left() - origin.left(), cp.y() - origin.top(), tableWidth, BAR_THICKNESS);
      $_8ycds3mrjf3ft3rl.add(rowBar, resizeRowBar);
      return rowBar;
    });
  };
  var refreshGrid = function (wire, table, rows, cols, hdirection, vdirection) {
    var position = $_3hwkw8m3jf3ft3l9.absolute(table);
    var rowPositions = rows.length > 0 ? hdirection.positions(rows, table) : [];
    refreshRow(wire, rowPositions, position, $_1rutitlzjf3ft3kr.getOuter(table));
    var colPositions = cols.length > 0 ? vdirection.positions(cols, table) : [];
    refreshCol(wire, colPositions, position, $_65i6k8lxjf3ft3kj.getOuter(table));
  };
  var refresh = function (wire, table, hdirection, vdirection) {
    clear(wire);
    var list = $_7r7n5rk0jf3ft367.fromTable(table);
    var warehouse = $_50juipkyjf3ft3c6.generate(list);
    var rows = $_7qwwaxmmjf3ft3qp.rows(warehouse);
    var cols = $_7qwwaxmmjf3ft3qp.columns(warehouse);
    refreshGrid(wire, table, rows, cols, hdirection, vdirection);
  };
  var each$2 = function (wire, f) {
    var bars = $_6pynzqksjf3ft3aw.descendants(wire.parent(), '.' + resizeBar);
    $_5qd2tsjqjf3ft34c.each(bars, f);
  };
  var hide = function (wire) {
    each$2(wire, function (bar) {
      $_9hbdczkzjf3ft3ci.set(bar, 'display', 'none');
    });
  };
  var show = function (wire) {
    each$2(wire, function (bar) {
      $_9hbdczkzjf3ft3ci.set(bar, 'display', 'block');
    });
  };
  var isRowBar = function (element) {
    return $_8ycds3mrjf3ft3rl.has(element, resizeRowBar);
  };
  var isColBar = function (element) {
    return $_8ycds3mrjf3ft3rl.has(element, resizeColBar);
  };
  var $_ez437umljf3ft3q1 = {
    refresh: refresh,
    hide: hide,
    show: show,
    destroy: clear,
    isRowBar: isRowBar,
    isColBar: isColBar
  };

  var fromWarehouse = function (warehouse, generators) {
    return $_8rv75imhjf3ft3or.toGrid(warehouse, generators, false);
  };
  var deriveRows = function (rendered, generators) {
    var findRow = function (details) {
      var rowOfCells = $_2wgl26mgjf3ft3op.findMap(details, function (detail) {
        return $_a4gvewk7jf3ft384.parent(detail.element()).map(function (row) {
          var isNew = $_a4gvewk7jf3ft384.parent(row).isNone();
          return $_9kexg1k1jf3ft36h.elementnew(row, isNew);
        });
      });
      return rowOfCells.getOrThunk(function () {
        return $_9kexg1k1jf3ft36h.elementnew(generators.row(), true);
      });
    };
    return $_5qd2tsjqjf3ft34c.map(rendered, function (details) {
      var row = findRow(details.details());
      return $_9kexg1k1jf3ft36h.rowdatanew(row.element(), details.details(), details.section(), row.isNew());
    });
  };
  var toDetailList = function (grid, generators) {
    var rendered = $_8rv75imhjf3ft3or.toDetails(grid, $_avffyek9jf3ft38l.eq);
    return deriveRows(rendered, generators);
  };
  var findInWarehouse = function (warehouse, element) {
    var all = $_5qd2tsjqjf3ft34c.flatten($_5qd2tsjqjf3ft34c.map(warehouse.all(), function (r) {
      return r.cells();
    }));
    return $_5qd2tsjqjf3ft34c.find(all, function (e) {
      return $_avffyek9jf3ft38l.eq(element, e.element());
    });
  };
  var run = function (operation, extract, adjustment, postAction, genWrappers) {
    return function (wire, table, target, generators, direction) {
      var input = $_7r7n5rk0jf3ft367.fromTable(table);
      var warehouse = $_50juipkyjf3ft3c6.generate(input);
      var output = extract(warehouse, target).map(function (info) {
        var model = fromWarehouse(warehouse, generators);
        var result = operation(model, info, $_avffyek9jf3ft38l.eq, genWrappers(generators));
        var grid = toDetailList(result.grid(), generators);
        return {
          grid: $_6np0wpjsjf3ft34s.constant(grid),
          cursor: result.cursor
        };
      });
      return output.fold(function () {
        return Option.none();
      }, function (out) {
        var newElements = $_8ppmr3mkjf3ft3pa.render(table, out.grid());
        adjustment(table, out.grid(), direction);
        postAction(table);
        $_ez437umljf3ft3q1.refresh(wire, table, $_63tlbdm2jf3ft3kw.height, direction);
        return Option.some({
          cursor: out.cursor,
          newRows: newElements.newRows,
          newCells: newElements.newCells
        });
      });
    };
  };
  var onCell = function (warehouse, target) {
    return $_3oodk9k2jf3ft36l.cell(target.element()).bind(function (cell) {
      return findInWarehouse(warehouse, cell);
    });
  };
  var onPaste = function (warehouse, target) {
    return $_3oodk9k2jf3ft36l.cell(target.element()).bind(function (cell) {
      return findInWarehouse(warehouse, cell).map(function (details) {
        return $_18tx14mfjf3ft3on.merge(details, {
          generators: target.generators,
          clipboard: target.clipboard
        });
      });
    });
  };
  var onPasteRows = function (warehouse, target) {
    var details = $_5qd2tsjqjf3ft34c.map(target.selection(), function (cell) {
      return $_3oodk9k2jf3ft36l.cell(cell).bind(function (lc) {
        return findInWarehouse(warehouse, lc);
      });
    });
    var cells = $_2wgl26mgjf3ft3op.cat(details);
    return cells.length > 0 ? Option.some($_18tx14mfjf3ft3on.merge({ cells: cells }, {
      generators: target.generators,
      clipboard: target.clipboard
    })) : Option.none();
  };
  var onMergable = function (warehouse, target) {
    return target.mergable();
  };
  var onUnmergable = function (warehouse, target) {
    return target.unmergable();
  };
  var onCells = function (warehouse, target) {
    var details = $_5qd2tsjqjf3ft34c.map(target.selection(), function (cell) {
      return $_3oodk9k2jf3ft36l.cell(cell).bind(function (lc) {
        return findInWarehouse(warehouse, lc);
      });
    });
    var cells = $_2wgl26mgjf3ft3op.cat(details);
    return cells.length > 0 ? Option.some(cells) : Option.none();
  };
  var $_86s04nmejf3ft3o4 = {
    run: run,
    toDetailList: toDetailList,
    onCell: onCell,
    onCells: onCells,
    onPaste: onPaste,
    onPasteRows: onPasteRows,
    onMergable: onMergable,
    onUnmergable: onUnmergable
  };

  var value$1 = function (o) {
    var is = function (v) {
      return o === v;
    };
    var or = function (opt) {
      return value$1(o);
    };
    var orThunk = function (f) {
      return value$1(o);
    };
    var map = function (f) {
      return value$1(f(o));
    };
    var each = function (f) {
      f(o);
    };
    var bind = function (f) {
      return f(o);
    };
    var fold = function (_, onValue) {
      return onValue(o);
    };
    var exists = function (f) {
      return f(o);
    };
    var forall = function (f) {
      return f(o);
    };
    var toOption = function () {
      return Option.some(o);
    };
    return {
      is: is,
      isValue: $_6np0wpjsjf3ft34s.always,
      isError: $_6np0wpjsjf3ft34s.never,
      getOr: $_6np0wpjsjf3ft34s.constant(o),
      getOrThunk: $_6np0wpjsjf3ft34s.constant(o),
      getOrDie: $_6np0wpjsjf3ft34s.constant(o),
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: each,
      bind: bind,
      exists: exists,
      forall: forall,
      toOption: toOption
    };
  };
  var error = function (message) {
    var getOrThunk = function (f) {
      return f();
    };
    var getOrDie = function () {
      return $_6np0wpjsjf3ft34s.die(String(message))();
    };
    var or = function (opt) {
      return opt;
    };
    var orThunk = function (f) {
      return f();
    };
    var map = function (f) {
      return error(message);
    };
    var bind = function (f) {
      return error(message);
    };
    var fold = function (onError, _) {
      return onError(message);
    };
    return {
      is: $_6np0wpjsjf3ft34s.never,
      isValue: $_6np0wpjsjf3ft34s.never,
      isError: $_6np0wpjsjf3ft34s.always,
      getOr: $_6np0wpjsjf3ft34s.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_6np0wpjsjf3ft34s.noop,
      bind: bind,
      exists: $_6np0wpjsjf3ft34s.never,
      forall: $_6np0wpjsjf3ft34s.always,
      toOption: Option.none
    };
  };
  var Result = {
    value: value$1,
    error: error
  };

  var measure = function (startAddress, gridA, gridB) {
    if (startAddress.row() >= gridA.length || startAddress.column() > $_784qcsmjjf3ft3p5.cellLength(gridA[0]))
      return Result.error('invalid start address out of table bounds, row: ' + startAddress.row() + ', column: ' + startAddress.column());
    var rowRemainder = gridA.slice(startAddress.row());
    var colRemainder = rowRemainder[0].cells().slice(startAddress.column());
    var colRequired = $_784qcsmjjf3ft3p5.cellLength(gridB[0]);
    var rowRequired = gridB.length;
    return Result.value({
      rowDelta: $_6np0wpjsjf3ft34s.constant(rowRemainder.length - rowRequired),
      colDelta: $_6np0wpjsjf3ft34s.constant(colRemainder.length - colRequired)
    });
  };
  var measureWidth = function (gridA, gridB) {
    var colLengthA = $_784qcsmjjf3ft3p5.cellLength(gridA[0]);
    var colLengthB = $_784qcsmjjf3ft3p5.cellLength(gridB[0]);
    return {
      rowDelta: $_6np0wpjsjf3ft34s.constant(0),
      colDelta: $_6np0wpjsjf3ft34s.constant(colLengthA - colLengthB)
    };
  };
  var fill = function (cells, generator) {
    return $_5qd2tsjqjf3ft34c.map(cells, function () {
      return $_9kexg1k1jf3ft36h.elementnew(generator.cell(), true);
    });
  };
  var rowFill = function (grid, amount, generator) {
    return grid.concat($_94edh4mnjf3ft3r0.repeat(amount, function (_row) {
      return $_784qcsmjjf3ft3p5.setCells(grid[grid.length - 1], fill(grid[grid.length - 1].cells(), generator));
    }));
  };
  var colFill = function (grid, amount, generator) {
    return $_5qd2tsjqjf3ft34c.map(grid, function (row) {
      return $_784qcsmjjf3ft3p5.setCells(row, row.cells().concat(fill($_94edh4mnjf3ft3r0.range(0, amount), generator)));
    });
  };
  var tailor = function (gridA, delta, generator) {
    var fillCols = delta.colDelta() < 0 ? colFill : $_6np0wpjsjf3ft34s.identity;
    var fillRows = delta.rowDelta() < 0 ? rowFill : $_6np0wpjsjf3ft34s.identity;
    var modifiedCols = fillCols(gridA, Math.abs(delta.colDelta()), generator);
    var tailoredGrid = fillRows(modifiedCols, Math.abs(delta.rowDelta()), generator);
    return tailoredGrid;
  };
  var $_7qus59mwjf3ft3s2 = {
    measure: measure,
    measureWidth: measureWidth,
    tailor: tailor
  };

  var merge$2 = function (grid, bounds, comparator, substitution) {
    if (grid.length === 0)
      return grid;
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        $_784qcsmjjf3ft3p5.mutateCell(grid[i], j, $_9kexg1k1jf3ft36h.elementnew(substitution(), false));
      }
    }
    return grid;
  };
  var unmerge = function (grid, target, comparator, substitution) {
    var first = true;
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < $_784qcsmjjf3ft3p5.cellLength(grid[0]); j++) {
        var current = $_784qcsmjjf3ft3p5.getCellElement(grid[i], j);
        var isToReplace = comparator(current, target);
        if (isToReplace === true && first === false) {
          $_784qcsmjjf3ft3p5.mutateCell(grid[i], j, $_9kexg1k1jf3ft36h.elementnew(substitution(), true));
        } else if (isToReplace === true) {
          first = false;
        }
      }
    }
    return grid;
  };
  var uniqueCells = function (row, comparator) {
    return $_5qd2tsjqjf3ft34c.foldl(row, function (rest, cell) {
      return $_5qd2tsjqjf3ft34c.exists(rest, function (currentCell) {
        return comparator(currentCell.element(), cell.element());
      }) ? rest : rest.concat([cell]);
    }, []);
  };
  var splitRows = function (grid, index, comparator, substitution) {
    if (index > 0 && index < grid.length) {
      var rowPrevCells = grid[index - 1].cells();
      var cells = uniqueCells(rowPrevCells, comparator);
      $_5qd2tsjqjf3ft34c.each(cells, function (cell) {
        var replacement = Option.none();
        for (var i = index; i < grid.length; i++) {
          for (var j = 0; j < $_784qcsmjjf3ft3p5.cellLength(grid[0]); j++) {
            var current = grid[i].cells()[j];
            var isToReplace = comparator(current.element(), cell.element());
            if (isToReplace) {
              if (replacement.isNone()) {
                replacement = Option.some(substitution());
              }
              replacement.each(function (sub) {
                $_784qcsmjjf3ft3p5.mutateCell(grid[i], j, $_9kexg1k1jf3ft36h.elementnew(sub, true));
              });
            }
          }
        }
      });
    }
    return grid;
  };
  var $_7kn4nimyjf3ft3sc = {
    merge: merge$2,
    unmerge: unmerge,
    splitRows: splitRows
  };

  var isSpanning = function (grid, row, col, comparator) {
    var candidate = $_784qcsmjjf3ft3p5.getCell(grid[row], col);
    var matching = $_6np0wpjsjf3ft34s.curry(comparator, candidate.element());
    var currentRow = grid[row];
    return grid.length > 1 && $_784qcsmjjf3ft3p5.cellLength(currentRow) > 1 && (col > 0 && matching($_784qcsmjjf3ft3p5.getCellElement(currentRow, col - 1)) || col < currentRow.length - 1 && matching($_784qcsmjjf3ft3p5.getCellElement(currentRow, col + 1)) || row > 0 && matching($_784qcsmjjf3ft3p5.getCellElement(grid[row - 1], col)) || row < grid.length - 1 && matching($_784qcsmjjf3ft3p5.getCellElement(grid[row + 1], col)));
  };
  var mergeTables = function (startAddress, gridA, gridB, generator, comparator) {
    var startRow = startAddress.row();
    var startCol = startAddress.column();
    var mergeHeight = gridB.length;
    var mergeWidth = $_784qcsmjjf3ft3p5.cellLength(gridB[0]);
    var endRow = startRow + mergeHeight;
    var endCol = startCol + mergeWidth;
    for (var r = startRow; r < endRow; r++) {
      for (var c = startCol; c < endCol; c++) {
        if (isSpanning(gridA, r, c, comparator)) {
          $_7kn4nimyjf3ft3sc.unmerge(gridA, $_784qcsmjjf3ft3p5.getCellElement(gridA[r], c), comparator, generator.cell);
        }
        var newCell = $_784qcsmjjf3ft3p5.getCellElement(gridB[r - startRow], c - startCol);
        var replacement = generator.replace(newCell);
        $_784qcsmjjf3ft3p5.mutateCell(gridA[r], c, $_9kexg1k1jf3ft36h.elementnew(replacement, true));
      }
    }
    return gridA;
  };
  var merge$3 = function (startAddress, gridA, gridB, generator, comparator) {
    var result = $_7qus59mwjf3ft3s2.measure(startAddress, gridA, gridB);
    return result.map(function (delta) {
      var fittedGrid = $_7qus59mwjf3ft3s2.tailor(gridA, delta, generator);
      return mergeTables(startAddress, fittedGrid, gridB, generator, comparator);
    });
  };
  var insert = function (index, gridA, gridB, generator, comparator) {
    $_7kn4nimyjf3ft3sc.splitRows(gridA, index, comparator, generator.cell);
    var delta = $_7qus59mwjf3ft3s2.measureWidth(gridB, gridA);
    var fittedNewGrid = $_7qus59mwjf3ft3s2.tailor(gridB, delta, generator);
    var secondDelta = $_7qus59mwjf3ft3s2.measureWidth(gridA, fittedNewGrid);
    var fittedOldGrid = $_7qus59mwjf3ft3s2.tailor(gridA, secondDelta, generator);
    return fittedOldGrid.slice(0, index).concat(fittedNewGrid).concat(fittedOldGrid.slice(index, fittedOldGrid.length));
  };
  var $_1rucukmvjf3ft3rx = {
    merge: merge$3,
    insert: insert
  };

  var insertRowAt = function (grid, index, example, comparator, substitution) {
    var before = grid.slice(0, index);
    var after = grid.slice(index);
    var between = $_784qcsmjjf3ft3p5.mapCells(grid[example], function (ex, c) {
      var withinSpan = index > 0 && index < grid.length && comparator($_784qcsmjjf3ft3p5.getCellElement(grid[index - 1], c), $_784qcsmjjf3ft3p5.getCellElement(grid[index], c));
      var ret = withinSpan ? $_784qcsmjjf3ft3p5.getCell(grid[index], c) : $_9kexg1k1jf3ft36h.elementnew(substitution(ex.element(), comparator), true);
      return ret;
    });
    return before.concat([between]).concat(after);
  };
  var insertColumnAt = function (grid, index, example, comparator, substitution) {
    return $_5qd2tsjqjf3ft34c.map(grid, function (row) {
      var withinSpan = index > 0 && index < $_784qcsmjjf3ft3p5.cellLength(row) && comparator($_784qcsmjjf3ft3p5.getCellElement(row, index - 1), $_784qcsmjjf3ft3p5.getCellElement(row, index));
      var sub = withinSpan ? $_784qcsmjjf3ft3p5.getCell(row, index) : $_9kexg1k1jf3ft36h.elementnew(substitution($_784qcsmjjf3ft3p5.getCellElement(row, example), comparator), true);
      return $_784qcsmjjf3ft3p5.addCell(row, index, sub);
    });
  };
  var splitCellIntoColumns = function (grid, exampleRow, exampleCol, comparator, substitution) {
    var index = exampleCol + 1;
    return $_5qd2tsjqjf3ft34c.map(grid, function (row, i) {
      var isTargetCell = i === exampleRow;
      var sub = isTargetCell ? $_9kexg1k1jf3ft36h.elementnew(substitution($_784qcsmjjf3ft3p5.getCellElement(row, exampleCol), comparator), true) : $_784qcsmjjf3ft3p5.getCell(row, exampleCol);
      return $_784qcsmjjf3ft3p5.addCell(row, index, sub);
    });
  };
  var splitCellIntoRows = function (grid, exampleRow, exampleCol, comparator, substitution) {
    var index = exampleRow + 1;
    var before = grid.slice(0, index);
    var after = grid.slice(index);
    var between = $_784qcsmjjf3ft3p5.mapCells(grid[exampleRow], function (ex, i) {
      var isTargetCell = i === exampleCol;
      return isTargetCell ? $_9kexg1k1jf3ft36h.elementnew(substitution(ex.element(), comparator), true) : ex;
    });
    return before.concat([between]).concat(after);
  };
  var deleteColumnsAt = function (grid, start, finish) {
    var rows = $_5qd2tsjqjf3ft34c.map(grid, function (row) {
      var cells = row.cells().slice(0, start).concat(row.cells().slice(finish + 1));
      return $_9kexg1k1jf3ft36h.rowcells(cells, row.section());
    });
    return $_5qd2tsjqjf3ft34c.filter(rows, function (row) {
      return row.cells().length > 0;
    });
  };
  var deleteRowsAt = function (grid, start, finish) {
    return grid.slice(0, start).concat(grid.slice(finish + 1));
  };
  var $_58n1bpmzjf3ft3sk = {
    insertRowAt: insertRowAt,
    insertColumnAt: insertColumnAt,
    splitCellIntoColumns: splitCellIntoColumns,
    splitCellIntoRows: splitCellIntoRows,
    deleteRowsAt: deleteRowsAt,
    deleteColumnsAt: deleteColumnsAt
  };

  var replaceIn = function (grid, targets, comparator, substitution) {
    var isTarget = function (cell) {
      return $_5qd2tsjqjf3ft34c.exists(targets, function (target) {
        return comparator(cell.element(), target.element());
      });
    };
    return $_5qd2tsjqjf3ft34c.map(grid, function (row) {
      return $_784qcsmjjf3ft3p5.mapCells(row, function (cell) {
        return isTarget(cell) ? $_9kexg1k1jf3ft36h.elementnew(substitution(cell.element(), comparator), true) : cell;
      });
    });
  };
  var notStartRow = function (grid, rowIndex, colIndex, comparator) {
    return $_784qcsmjjf3ft3p5.getCellElement(grid[rowIndex], colIndex) !== undefined && (rowIndex > 0 && comparator($_784qcsmjjf3ft3p5.getCellElement(grid[rowIndex - 1], colIndex), $_784qcsmjjf3ft3p5.getCellElement(grid[rowIndex], colIndex)));
  };
  var notStartColumn = function (row, index, comparator) {
    return index > 0 && comparator($_784qcsmjjf3ft3p5.getCellElement(row, index - 1), $_784qcsmjjf3ft3p5.getCellElement(row, index));
  };
  var replaceColumn = function (grid, index, comparator, substitution) {
    var targets = $_5qd2tsjqjf3ft34c.bind(grid, function (row, i) {
      var alreadyAdded = notStartRow(grid, i, index, comparator) || notStartColumn(row, index, comparator);
      return alreadyAdded ? [] : [$_784qcsmjjf3ft3p5.getCell(row, index)];
    });
    return replaceIn(grid, targets, comparator, substitution);
  };
  var replaceRow = function (grid, index, comparator, substitution) {
    var targetRow = grid[index];
    var targets = $_5qd2tsjqjf3ft34c.bind(targetRow.cells(), function (item, i) {
      var alreadyAdded = notStartRow(grid, index, i, comparator) || notStartColumn(targetRow, i, comparator);
      return alreadyAdded ? [] : [item];
    });
    return replaceIn(grid, targets, comparator, substitution);
  };
  var $_ep30ypn0jf3ft3su = {
    replaceColumn: replaceColumn,
    replaceRow: replaceRow
  };

  var none$1 = function () {
    return folder(function (n, o, l, m, r) {
      return n();
    });
  };
  var only = function (index) {
    return folder(function (n, o, l, m, r) {
      return o(index);
    });
  };
  var left = function (index, next) {
    return folder(function (n, o, l, m, r) {
      return l(index, next);
    });
  };
  var middle = function (prev, index, next) {
    return folder(function (n, o, l, m, r) {
      return m(prev, index, next);
    });
  };
  var right = function (prev, index) {
    return folder(function (n, o, l, m, r) {
      return r(prev, index);
    });
  };
  var folder = function (fold) {
    return { fold: fold };
  };
  var $_9ja1pkn3jf3ft3t9 = {
    none: none$1,
    only: only,
    left: left,
    middle: middle,
    right: right
  };

  var neighbours$1 = function (input, index) {
    if (input.length === 0)
      return $_9ja1pkn3jf3ft3t9.none();
    if (input.length === 1)
      return $_9ja1pkn3jf3ft3t9.only(0);
    if (index === 0)
      return $_9ja1pkn3jf3ft3t9.left(0, 1);
    if (index === input.length - 1)
      return $_9ja1pkn3jf3ft3t9.right(index - 1, index);
    if (index > 0 && index < input.length - 1)
      return $_9ja1pkn3jf3ft3t9.middle(index - 1, index, index + 1);
    return $_9ja1pkn3jf3ft3t9.none();
  };
  var determine = function (input, column, step, tableSize) {
    var result = input.slice(0);
    var context = neighbours$1(input, column);
    var zero = function (array) {
      return $_5qd2tsjqjf3ft34c.map(array, $_6np0wpjsjf3ft34s.constant(0));
    };
    var onNone = $_6np0wpjsjf3ft34s.constant(zero(result));
    var onOnly = function (index) {
      return tableSize.singleColumnWidth(result[index], step);
    };
    var onChange = function (index, next) {
      if (step >= 0) {
        var newNext = Math.max(tableSize.minCellWidth(), result[next] - step);
        return zero(result.slice(0, index)).concat([
          step,
          newNext - result[next]
        ]).concat(zero(result.slice(next + 1)));
      } else {
        var newThis = Math.max(tableSize.minCellWidth(), result[index] + step);
        var diffx = result[index] - newThis;
        return zero(result.slice(0, index)).concat([
          newThis - result[index],
          diffx
        ]).concat(zero(result.slice(next + 1)));
      }
    };
    var onLeft = onChange;
    var onMiddle = function (prev, index, next) {
      return onChange(index, next);
    };
    var onRight = function (prev, index) {
      if (step >= 0) {
        return zero(result.slice(0, index)).concat([step]);
      } else {
        var size = Math.max(tableSize.minCellWidth(), result[index] + step);
        return zero(result.slice(0, index)).concat([size - result[index]]);
      }
    };
    return context.fold(onNone, onOnly, onLeft, onMiddle, onRight);
  };
  var $_b0m4pzn2jf3ft3t4 = { determine: determine };

  var getSpan$1 = function (cell, type) {
    return $_fcjbkgkqjf3ft3af.has(cell, type) && parseInt($_fcjbkgkqjf3ft3af.get(cell, type), 10) > 1;
  };
  var hasColspan = function (cell) {
    return getSpan$1(cell, 'colspan');
  };
  var hasRowspan = function (cell) {
    return getSpan$1(cell, 'rowspan');
  };
  var getInt = function (element, property) {
    return parseInt($_9hbdczkzjf3ft3ci.get(element, property), 10);
  };
  var $_e3q4ahn5jf3ft3tj = {
    hasColspan: hasColspan,
    hasRowspan: hasRowspan,
    minWidth: $_6np0wpjsjf3ft34s.constant(10),
    minHeight: $_6np0wpjsjf3ft34s.constant(10),
    getInt: getInt
  };

  var getRaw$1 = function (cell, property, getter) {
    return $_9hbdczkzjf3ft3ci.getRaw(cell, property).fold(function () {
      return getter(cell) + 'px';
    }, function (raw) {
      return raw;
    });
  };
  var getRawW = function (cell) {
    return getRaw$1(cell, 'width', $_29iclslvjf3ft3jg.getPixelWidth);
  };
  var getRawH = function (cell) {
    return getRaw$1(cell, 'height', $_29iclslvjf3ft3jg.getHeight);
  };
  var getWidthFrom = function (warehouse, direction, getWidth, fallback, tableSize) {
    var columns = $_7qwwaxmmjf3ft3qp.columns(warehouse);
    var backups = $_5qd2tsjqjf3ft34c.map(columns, function (cellOption) {
      return cellOption.map(direction.edge);
    });
    return $_5qd2tsjqjf3ft34c.map(columns, function (cellOption, c) {
      var columnCell = cellOption.filter($_6np0wpjsjf3ft34s.not($_e3q4ahn5jf3ft3tj.hasColspan));
      return columnCell.fold(function () {
        var deduced = $_94edh4mnjf3ft3r0.deduce(backups, c);
        return fallback(deduced);
      }, function (cell) {
        return getWidth(cell, tableSize);
      });
    });
  };
  var getDeduced = function (deduced) {
    return deduced.map(function (d) {
      return d + 'px';
    }).getOr('');
  };
  var getRawWidths = function (warehouse, direction) {
    return getWidthFrom(warehouse, direction, getRawW, getDeduced);
  };
  var getPercentageWidths = function (warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, $_29iclslvjf3ft3jg.getPercentageWidth, function (deduced) {
      return deduced.fold(function () {
        return tableSize.minCellWidth();
      }, function (cellWidth) {
        return cellWidth / tableSize.pixelWidth() * 100;
      });
    }, tableSize);
  };
  var getPixelWidths = function (warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, $_29iclslvjf3ft3jg.getPixelWidth, function (deduced) {
      return deduced.getOrThunk(tableSize.minCellWidth);
    }, tableSize);
  };
  var getHeightFrom = function (warehouse, direction, getHeight, fallback) {
    var rows = $_7qwwaxmmjf3ft3qp.rows(warehouse);
    var backups = $_5qd2tsjqjf3ft34c.map(rows, function (cellOption) {
      return cellOption.map(direction.edge);
    });
    return $_5qd2tsjqjf3ft34c.map(rows, function (cellOption, c) {
      var rowCell = cellOption.filter($_6np0wpjsjf3ft34s.not($_e3q4ahn5jf3ft3tj.hasRowspan));
      return rowCell.fold(function () {
        var deduced = $_94edh4mnjf3ft3r0.deduce(backups, c);
        return fallback(deduced);
      }, function (cell) {
        return getHeight(cell);
      });
    });
  };
  var getPixelHeights = function (warehouse, direction) {
    return getHeightFrom(warehouse, direction, $_29iclslvjf3ft3jg.getHeight, function (deduced) {
      return deduced.getOrThunk($_e3q4ahn5jf3ft3tj.minHeight);
    });
  };
  var getRawHeights = function (warehouse, direction) {
    return getHeightFrom(warehouse, direction, getRawH, getDeduced);
  };
  var $_ab938in4jf3ft3tc = {
    getRawWidths: getRawWidths,
    getPixelWidths: getPixelWidths,
    getPercentageWidths: getPercentageWidths,
    getPixelHeights: getPixelHeights,
    getRawHeights: getRawHeights
  };

  var total = function (start, end, measures) {
    var r = 0;
    for (var i = start; i < end; i++) {
      r += measures[i] !== undefined ? measures[i] : 0;
    }
    return r;
  };
  var recalculateWidth = function (warehouse, widths) {
    var all = $_50juipkyjf3ft3c6.justCells(warehouse);
    return $_5qd2tsjqjf3ft34c.map(all, function (cell) {
      var width = total(cell.column(), cell.column() + cell.colspan(), widths);
      return {
        element: cell.element,
        width: $_6np0wpjsjf3ft34s.constant(width),
        colspan: cell.colspan
      };
    });
  };
  var recalculateHeight = function (warehouse, heights) {
    var all = $_50juipkyjf3ft3c6.justCells(warehouse);
    return $_5qd2tsjqjf3ft34c.map(all, function (cell) {
      var height = total(cell.row(), cell.row() + cell.rowspan(), heights);
      return {
        element: cell.element,
        height: $_6np0wpjsjf3ft34s.constant(height),
        rowspan: cell.rowspan
      };
    });
  };
  var matchRowHeight = function (warehouse, heights) {
    return $_5qd2tsjqjf3ft34c.map(warehouse.all(), function (row, i) {
      return {
        element: row.element,
        height: $_6np0wpjsjf3ft34s.constant(heights[i])
      };
    });
  };
  var $_9hkyc3n6jf3ft3tp = {
    recalculateWidth: recalculateWidth,
    recalculateHeight: recalculateHeight,
    matchRowHeight: matchRowHeight
  };

  var percentageSize = function (width, element) {
    var floatWidth = parseFloat(width);
    var pixelWidth = $_1rutitlzjf3ft3kr.get(element);
    var getCellDelta = function (delta) {
      return delta / pixelWidth * 100;
    };
    var singleColumnWidth = function (width, _delta) {
      return [100 - width];
    };
    var minCellWidth = function () {
      return $_e3q4ahn5jf3ft3tj.minWidth() / pixelWidth * 100;
    };
    var setTableWidth = function (table, _newWidths, delta) {
      var total = floatWidth + delta;
      $_29iclslvjf3ft3jg.setPercentageWidth(table, total);
    };
    return {
      width: $_6np0wpjsjf3ft34s.constant(floatWidth),
      pixelWidth: $_6np0wpjsjf3ft34s.constant(pixelWidth),
      getWidths: $_ab938in4jf3ft3tc.getPercentageWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: minCellWidth,
      setElementWidth: $_29iclslvjf3ft3jg.setPercentageWidth,
      setTableWidth: setTableWidth
    };
  };
  var pixelSize = function (width) {
    var intWidth = parseInt(width, 10);
    var getCellDelta = $_6np0wpjsjf3ft34s.identity;
    var singleColumnWidth = function (width, delta) {
      var newNext = Math.max($_e3q4ahn5jf3ft3tj.minWidth(), width + delta);
      return [newNext - width];
    };
    var setTableWidth = function (table, newWidths, _delta) {
      var total = $_5qd2tsjqjf3ft34c.foldr(newWidths, function (b, a) {
        return b + a;
      }, 0);
      $_29iclslvjf3ft3jg.setPixelWidth(table, total);
    };
    return {
      width: $_6np0wpjsjf3ft34s.constant(intWidth),
      pixelWidth: $_6np0wpjsjf3ft34s.constant(intWidth),
      getWidths: $_ab938in4jf3ft3tc.getPixelWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: $_e3q4ahn5jf3ft3tj.minWidth,
      setElementWidth: $_29iclslvjf3ft3jg.setPixelWidth,
      setTableWidth: setTableWidth
    };
  };
  var chooseSize = function (element, width) {
    if ($_29iclslvjf3ft3jg.percentageBasedSizeRegex().test(width)) {
      var percentMatch = $_29iclslvjf3ft3jg.percentageBasedSizeRegex().exec(width);
      return percentageSize(percentMatch[1], element);
    } else if ($_29iclslvjf3ft3jg.pixelBasedSizeRegex().test(width)) {
      var pixelMatch = $_29iclslvjf3ft3jg.pixelBasedSizeRegex().exec(width);
      return pixelSize(pixelMatch[1]);
    } else {
      var fallbackWidth = $_1rutitlzjf3ft3kr.get(element);
      return pixelSize(fallbackWidth);
    }
  };
  var getTableSize = function (element) {
    var width = $_29iclslvjf3ft3jg.getRawWidth(element);
    return width.fold(function () {
      var fallbackWidth = $_1rutitlzjf3ft3kr.get(element);
      return pixelSize(fallbackWidth);
    }, function (width) {
      return chooseSize(element, width);
    });
  };
  var $_gaybgzn7jf3ft3tv = { getTableSize: getTableSize };

  var getWarehouse$1 = function (list) {
    return $_50juipkyjf3ft3c6.generate(list);
  };
  var sumUp = function (newSize) {
    return $_5qd2tsjqjf3ft34c.foldr(newSize, function (b, a) {
      return b + a;
    }, 0);
  };
  var getTableWarehouse = function (table) {
    var list = $_7r7n5rk0jf3ft367.fromTable(table);
    return getWarehouse$1(list);
  };
  var adjustWidth = function (table, delta, index, direction) {
    var tableSize = $_gaybgzn7jf3ft3tv.getTableSize(table);
    var step = tableSize.getCellDelta(delta);
    var warehouse = getTableWarehouse(table);
    var widths = tableSize.getWidths(warehouse, direction, tableSize);
    var deltas = $_b0m4pzn2jf3ft3t4.determine(widths, index, step, tableSize);
    var newWidths = $_5qd2tsjqjf3ft34c.map(deltas, function (dx, i) {
      return dx + widths[i];
    });
    var newSizes = $_9hkyc3n6jf3ft3tp.recalculateWidth(warehouse, newWidths);
    $_5qd2tsjqjf3ft34c.each(newSizes, function (cell) {
      tableSize.setElementWidth(cell.element(), cell.width());
    });
    if (index === warehouse.grid().columns() - 1) {
      tableSize.setTableWidth(table, newWidths, step);
    }
  };
  var adjustHeight = function (table, delta, index, direction) {
    var warehouse = getTableWarehouse(table);
    var heights = $_ab938in4jf3ft3tc.getPixelHeights(warehouse, direction);
    var newHeights = $_5qd2tsjqjf3ft34c.map(heights, function (dy, i) {
      return index === i ? Math.max(delta + dy, $_e3q4ahn5jf3ft3tj.minHeight()) : dy;
    });
    var newCellSizes = $_9hkyc3n6jf3ft3tp.recalculateHeight(warehouse, newHeights);
    var newRowSizes = $_9hkyc3n6jf3ft3tp.matchRowHeight(warehouse, newHeights);
    $_5qd2tsjqjf3ft34c.each(newRowSizes, function (row) {
      $_29iclslvjf3ft3jg.setHeight(row.element(), row.height());
    });
    $_5qd2tsjqjf3ft34c.each(newCellSizes, function (cell) {
      $_29iclslvjf3ft3jg.setHeight(cell.element(), cell.height());
    });
    var total = sumUp(newHeights);
    $_29iclslvjf3ft3jg.setHeight(table, total);
  };
  var adjustWidthTo = function (table, list, direction) {
    var tableSize = $_gaybgzn7jf3ft3tv.getTableSize(table);
    var warehouse = getWarehouse$1(list);
    var widths = tableSize.getWidths(warehouse, direction, tableSize);
    var newSizes = $_9hkyc3n6jf3ft3tp.recalculateWidth(warehouse, widths);
    $_5qd2tsjqjf3ft34c.each(newSizes, function (cell) {
      tableSize.setElementWidth(cell.element(), cell.width());
    });
    var total = $_5qd2tsjqjf3ft34c.foldr(widths, function (b, a) {
      return a + b;
    }, 0);
    if (newSizes.length > 0) {
      tableSize.setElementWidth(table, total);
    }
  };
  var $_epa0djn1jf3ft3t0 = {
    adjustWidth: adjustWidth,
    adjustHeight: adjustHeight,
    adjustWidthTo: adjustWidthTo
  };

  var prune = function (table) {
    var cells = $_3oodk9k2jf3ft36l.cells(table);
    if (cells.length === 0)
      $_1fts8il2jf3ft3d3.remove(table);
  };
  var outcome = $_4bo75gjvjf3ft35r.immutable('grid', 'cursor');
  var elementFromGrid = function (grid, row, column) {
    return findIn(grid, row, column).orThunk(function () {
      return findIn(grid, 0, 0);
    });
  };
  var findIn = function (grid, row, column) {
    return Option.from(grid[row]).bind(function (r) {
      return Option.from(r.cells()[column]).bind(function (c) {
        return Option.from(c.element());
      });
    });
  };
  var bundle = function (grid, row, column) {
    return outcome(grid, findIn(grid, row, column));
  };
  var uniqueRows = function (details) {
    return $_5qd2tsjqjf3ft34c.foldl(details, function (rest, detail) {
      return $_5qd2tsjqjf3ft34c.exists(rest, function (currentDetail) {
        return currentDetail.row() === detail.row();
      }) ? rest : rest.concat([detail]);
    }, []).sort(function (detailA, detailB) {
      return detailA.row() - detailB.row();
    });
  };
  var uniqueColumns = function (details) {
    return $_5qd2tsjqjf3ft34c.foldl(details, function (rest, detail) {
      return $_5qd2tsjqjf3ft34c.exists(rest, function (currentDetail) {
        return currentDetail.column() === detail.column();
      }) ? rest : rest.concat([detail]);
    }, []).sort(function (detailA, detailB) {
      return detailA.column() - detailB.column();
    });
  };
  var insertRowBefore = function (grid, detail, comparator, genWrappers) {
    var example = detail.row();
    var targetIndex = detail.row();
    var newGrid = $_58n1bpmzjf3ft3sk.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, targetIndex, detail.column());
  };
  var insertRowsBefore = function (grid, details, comparator, genWrappers) {
    var example = details[0].row();
    var targetIndex = details[0].row();
    var rows = uniqueRows(details);
    var newGrid = $_5qd2tsjqjf3ft34c.foldl(rows, function (newGrid, _row) {
      return $_58n1bpmzjf3ft3sk.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, targetIndex, details[0].column());
  };
  var insertRowAfter = function (grid, detail, comparator, genWrappers) {
    var example = detail.row();
    var targetIndex = detail.row() + detail.rowspan();
    var newGrid = $_58n1bpmzjf3ft3sk.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, targetIndex, detail.column());
  };
  var insertRowsAfter = function (grid, details, comparator, genWrappers) {
    var rows = uniqueRows(details);
    var example = rows[rows.length - 1].row();
    var targetIndex = rows[rows.length - 1].row() + rows[rows.length - 1].rowspan();
    var newGrid = $_5qd2tsjqjf3ft34c.foldl(rows, function (newGrid, _row) {
      return $_58n1bpmzjf3ft3sk.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, targetIndex, details[0].column());
  };
  var insertColumnBefore = function (grid, detail, comparator, genWrappers) {
    var example = detail.column();
    var targetIndex = detail.column();
    var newGrid = $_58n1bpmzjf3ft3sk.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), targetIndex);
  };
  var insertColumnsBefore = function (grid, details, comparator, genWrappers) {
    var columns = uniqueColumns(details);
    var example = columns[0].column();
    var targetIndex = columns[0].column();
    var newGrid = $_5qd2tsjqjf3ft34c.foldl(columns, function (newGrid, _row) {
      return $_58n1bpmzjf3ft3sk.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, details[0].row(), targetIndex);
  };
  var insertColumnAfter = function (grid, detail, comparator, genWrappers) {
    var example = detail.column();
    var targetIndex = detail.column() + detail.colspan();
    var newGrid = $_58n1bpmzjf3ft3sk.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), targetIndex);
  };
  var insertColumnsAfter = function (grid, details, comparator, genWrappers) {
    var example = details[details.length - 1].column();
    var targetIndex = details[details.length - 1].column() + details[details.length - 1].colspan();
    var columns = uniqueColumns(details);
    var newGrid = $_5qd2tsjqjf3ft34c.foldl(columns, function (newGrid, _row) {
      return $_58n1bpmzjf3ft3sk.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, details[0].row(), targetIndex);
  };
  var makeRowHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_ep30ypn0jf3ft3su.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var makeColumnHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_ep30ypn0jf3ft3su.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var unmakeRowHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_ep30ypn0jf3ft3su.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var unmakeColumnHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_ep30ypn0jf3ft3su.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var splitCellIntoColumns$1 = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_58n1bpmzjf3ft3sk.splitCellIntoColumns(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var splitCellIntoRows$1 = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_58n1bpmzjf3ft3sk.splitCellIntoRows(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var eraseColumns = function (grid, details, comparator, _genWrappers) {
    var columns = uniqueColumns(details);
    var newGrid = $_58n1bpmzjf3ft3sk.deleteColumnsAt(grid, columns[0].column(), columns[columns.length - 1].column());
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column());
    return outcome(newGrid, cursor);
  };
  var eraseRows = function (grid, details, comparator, _genWrappers) {
    var rows = uniqueRows(details);
    var newGrid = $_58n1bpmzjf3ft3sk.deleteRowsAt(grid, rows[0].row(), rows[rows.length - 1].row());
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column());
    return outcome(newGrid, cursor);
  };
  var mergeCells = function (grid, mergable, comparator, _genWrappers) {
    var cells = mergable.cells();
    $_ergxgwmbjf3ft3n5.merge(cells);
    var newGrid = $_7kn4nimyjf3ft3sc.merge(grid, mergable.bounds(), comparator, $_6np0wpjsjf3ft34s.constant(cells[0]));
    return outcome(newGrid, Option.from(cells[0]));
  };
  var unmergeCells = function (grid, unmergable, comparator, genWrappers) {
    var newGrid = $_5qd2tsjqjf3ft34c.foldr(unmergable, function (b, cell) {
      return $_7kn4nimyjf3ft3sc.unmerge(b, cell, comparator, genWrappers.combine(cell));
    }, grid);
    return outcome(newGrid, Option.from(unmergable[0]));
  };
  var pasteCells = function (grid, pasteDetails, comparator, genWrappers) {
    var gridify = function (table, generators) {
      var list = $_7r7n5rk0jf3ft367.fromTable(table);
      var wh = $_50juipkyjf3ft3c6.generate(list);
      return $_8rv75imhjf3ft3or.toGrid(wh, generators, true);
    };
    var gridB = gridify(pasteDetails.clipboard(), pasteDetails.generators());
    var startAddress = $_9kexg1k1jf3ft36h.address(pasteDetails.row(), pasteDetails.column());
    var mergedGrid = $_1rucukmvjf3ft3rx.merge(startAddress, grid, gridB, pasteDetails.generators(), comparator);
    return mergedGrid.fold(function () {
      return outcome(grid, Option.some(pasteDetails.element()));
    }, function (nuGrid) {
      var cursor = elementFromGrid(nuGrid, pasteDetails.row(), pasteDetails.column());
      return outcome(nuGrid, cursor);
    });
  };
  var gridifyRows = function (rows, generators, example) {
    var pasteDetails = $_7r7n5rk0jf3ft367.fromPastedRows(rows, example);
    var wh = $_50juipkyjf3ft3c6.generate(pasteDetails);
    return $_8rv75imhjf3ft3or.toGrid(wh, generators, true);
  };
  var pasteRowsBefore = function (grid, pasteDetails, comparator, genWrappers) {
    var example = grid[pasteDetails.cells[0].row()];
    var index = pasteDetails.cells[0].row();
    var gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example);
    var mergedGrid = $_1rucukmvjf3ft3rx.insert(index, grid, gridB, pasteDetails.generators(), comparator);
    var cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column());
    return outcome(mergedGrid, cursor);
  };
  var pasteRowsAfter = function (grid, pasteDetails, comparator, genWrappers) {
    var example = grid[pasteDetails.cells[0].row()];
    var index = pasteDetails.cells[pasteDetails.cells.length - 1].row() + pasteDetails.cells[pasteDetails.cells.length - 1].rowspan();
    var gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example);
    var mergedGrid = $_1rucukmvjf3ft3rx.insert(index, grid, gridB, pasteDetails.generators(), comparator);
    var cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column());
    return outcome(mergedGrid, cursor);
  };
  var resize = $_epa0djn1jf3ft3t0.adjustWidthTo;
  var $_3gubn8m7jf3ft3lp = {
    insertRowBefore: $_86s04nmejf3ft3o4.run(insertRowBefore, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertRowsBefore: $_86s04nmejf3ft3o4.run(insertRowsBefore, $_86s04nmejf3ft3o4.onCells, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertRowAfter: $_86s04nmejf3ft3o4.run(insertRowAfter, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertRowsAfter: $_86s04nmejf3ft3o4.run(insertRowsAfter, $_86s04nmejf3ft3o4.onCells, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertColumnBefore: $_86s04nmejf3ft3o4.run(insertColumnBefore, $_86s04nmejf3ft3o4.onCell, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertColumnsBefore: $_86s04nmejf3ft3o4.run(insertColumnsBefore, $_86s04nmejf3ft3o4.onCells, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertColumnAfter: $_86s04nmejf3ft3o4.run(insertColumnAfter, $_86s04nmejf3ft3o4.onCell, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    insertColumnsAfter: $_86s04nmejf3ft3o4.run(insertColumnsAfter, $_86s04nmejf3ft3o4.onCells, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    splitCellIntoColumns: $_86s04nmejf3ft3o4.run(splitCellIntoColumns$1, $_86s04nmejf3ft3o4.onCell, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    splitCellIntoRows: $_86s04nmejf3ft3o4.run(splitCellIntoRows$1, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    eraseColumns: $_86s04nmejf3ft3o4.run(eraseColumns, $_86s04nmejf3ft3o4.onCells, resize, prune, $_dlah8ym8jf3ft3m7.modification),
    eraseRows: $_86s04nmejf3ft3o4.run(eraseRows, $_86s04nmejf3ft3o4.onCells, $_6np0wpjsjf3ft34s.noop, prune, $_dlah8ym8jf3ft3m7.modification),
    makeColumnHeader: $_86s04nmejf3ft3o4.run(makeColumnHeader, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.transform('row', 'th')),
    unmakeColumnHeader: $_86s04nmejf3ft3o4.run(unmakeColumnHeader, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.transform(null, 'td')),
    makeRowHeader: $_86s04nmejf3ft3o4.run(makeRowHeader, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.transform('col', 'th')),
    unmakeRowHeader: $_86s04nmejf3ft3o4.run(unmakeRowHeader, $_86s04nmejf3ft3o4.onCell, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.transform(null, 'td')),
    mergeCells: $_86s04nmejf3ft3o4.run(mergeCells, $_86s04nmejf3ft3o4.onMergable, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.merging),
    unmergeCells: $_86s04nmejf3ft3o4.run(unmergeCells, $_86s04nmejf3ft3o4.onUnmergable, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.merging),
    pasteCells: $_86s04nmejf3ft3o4.run(pasteCells, $_86s04nmejf3ft3o4.onPaste, resize, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    pasteRowsBefore: $_86s04nmejf3ft3o4.run(pasteRowsBefore, $_86s04nmejf3ft3o4.onPasteRows, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification),
    pasteRowsAfter: $_86s04nmejf3ft3o4.run(pasteRowsAfter, $_86s04nmejf3ft3o4.onPasteRows, $_6np0wpjsjf3ft34s.noop, $_6np0wpjsjf3ft34s.noop, $_dlah8ym8jf3ft3m7.modification)
  };

  var getBody$1 = function (editor) {
    return $_cjzqfhk5jf3ft37x.fromDom(editor.getBody());
  };
  var getIsRoot = function (editor) {
    return function (element) {
      return $_avffyek9jf3ft38l.eq(element, getBody$1(editor));
    };
  };
  var removePxSuffix = function (size) {
    return size ? size.replace(/px$/, '') : '';
  };
  var addSizeSuffix = function (size) {
    if (/^[0-9]+$/.test(size)) {
      size += 'px';
    }
    return size;
  };
  var $_bteipcn8jf3ft3u3 = {
    getBody: getBody$1,
    getIsRoot: getIsRoot,
    addSizeSuffix: addSizeSuffix,
    removePxSuffix: removePxSuffix
  };

  var onDirection = function (isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function (element) {
    return $_9hbdczkzjf3ft3ci.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };
  var $_fuvv41najf3ft3ua = {
    onDirection: onDirection,
    getDirection: getDirection
  };

  var ltr$1 = { isRtl: $_6np0wpjsjf3ft34s.constant(false) };
  var rtl$1 = { isRtl: $_6np0wpjsjf3ft34s.constant(true) };
  var directionAt = function (element) {
    var dir = $_fuvv41najf3ft3ua.getDirection(element);
    return dir === 'rtl' ? rtl$1 : ltr$1;
  };
  var $_1421mdn9jf3ft3u7 = { directionAt: directionAt };

  var defaultTableToolbar = [
    'tableprops',
    'tabledelete',
    '|',
    'tableinsertrowbefore',
    'tableinsertrowafter',
    'tabledeleterow',
    '|',
    'tableinsertcolbefore',
    'tableinsertcolafter',
    'tabledeletecol'
  ];
  var defaultStyles = {
    'border-collapse': 'collapse',
    'width': '100%'
  };
  var defaultAttributes = { border: '1' };
  var getDefaultAttributes = function (editor) {
    return editor.getParam('table_default_attributes', defaultAttributes, 'object');
  };
  var getDefaultStyles = function (editor) {
    return editor.getParam('table_default_styles', defaultStyles, 'object');
  };
  var hasTableResizeBars = function (editor) {
    return editor.getParam('table_resize_bars', true, 'boolean');
  };
  var hasTabNavigation = function (editor) {
    return editor.getParam('table_tab_navigation', true, 'boolean');
  };
  var getForcedRootBlock = function (editor) {
    return editor.getParam('forced_root_block', 'p', 'string');
  };
  var hasAdvancedCellTab = function (editor) {
    return editor.getParam('table_cell_advtab', true, 'boolean');
  };
  var hasAdvancedRowTab = function (editor) {
    return editor.getParam('table_row_advtab', true, 'boolean');
  };
  var hasAdvancedTableTab = function (editor) {
    return editor.getParam('table_advtab', true, 'boolean');
  };
  var hasAppearanceOptions = function (editor) {
    return editor.getParam('table_appearance_options', true, 'boolean');
  };
  var hasTableGrid = function (editor) {
    return editor.getParam('table_grid', true, 'boolean');
  };
  var shouldStyleWithCss = function (editor) {
    return editor.getParam('table_style_by_css', false, 'boolean');
  };
  var getForcedRootBlockAttrs = function (editor) {
    return editor.getParam('forced_block_attrs', {}, 'object');
  };
  var getCellClassList = function (editor) {
    return editor.getParam('table_cell_class_list', [], 'array');
  };
  var getRowClassList = function (editor) {
    return editor.getParam('table_row_class_list', [], 'array');
  };
  var getTableClassList = function (editor) {
    return editor.getParam('table_class_list', [], 'array');
  };
  var getColorPickerCallback = function (editor) {
    return editor.getParam('color_picker_callback');
  };
  var isPixelsForced = function (editor) {
    return editor.getParam('table_responsive_width') === false;
  };
  var getCloneElements = function (editor) {
    var cloneElements = editor.getParam('table_clone_elements');
    if ($_424octjzjf3ft364.isString(cloneElements)) {
      return Option.some(cloneElements.split(/[ ,]/));
    } else if (Array.isArray(cloneElements)) {
      return Option.some(cloneElements);
    } else {
      return Option.none();
    }
  };
  var hasObjectResizing = function (editor) {
    var objectResizing = editor.getParam('object_resizing', true);
    return objectResizing === 'table' || objectResizing;
  };
  var getToolbar = function (editor) {
    var toolbar = editor.getParam('table_toolbar', defaultTableToolbar);
    if (toolbar === '' || toolbar === false) {
      return [];
    } else if ($_424octjzjf3ft364.isString(toolbar)) {
      return toolbar.split(/[ ,]/);
    } else if ($_424octjzjf3ft364.isArray(toolbar)) {
      return toolbar;
    } else {
      return [];
    }
  };

  var fireNewRow = function (editor, row) {
    return editor.fire('newrow', { node: row });
  };
  var fireNewCell = function (editor, cell) {
    return editor.fire('newcell', { node: cell });
  };

  function TableActions (editor, lazyWire) {
    var isTableBody = function (editor) {
      return $_3seq30krjf3ft3as.name($_bteipcn8jf3ft3u3.getBody(editor)) === 'table';
    };
    var lastRowGuard = function (table) {
      var size = $_fiaglmm6jf3ft3ll.getGridSize(table);
      return isTableBody(editor) === false || size.rows() > 1;
    };
    var lastColumnGuard = function (table) {
      var size = $_fiaglmm6jf3ft3ll.getGridSize(table);
      return isTableBody(editor) === false || size.columns() > 1;
    };
    var cloneFormats = getCloneElements(editor);
    var execute = function (operation, guard, mutate, lazyWire) {
      return function (table, target) {
        var dataStyleCells = $_6pynzqksjf3ft3aw.descendants(table, 'td[data-mce-style],th[data-mce-style]');
        $_5qd2tsjqjf3ft34c.each(dataStyleCells, function (cell) {
          $_fcjbkgkqjf3ft3af.remove(cell, 'data-mce-style');
        });
        var wire = lazyWire();
        var doc = $_cjzqfhk5jf3ft37x.fromDom(editor.getDoc());
        var direction = TableDirection($_1421mdn9jf3ft3u7.directionAt);
        var generators = $_5zb0acl4jf3ft3de.cellOperations(mutate, doc, cloneFormats);
        return guard(table) ? operation(wire, table, target, generators, direction).bind(function (result) {
          $_5qd2tsjqjf3ft34c.each(result.newRows(), function (row) {
            fireNewRow(editor, row.dom());
          });
          $_5qd2tsjqjf3ft34c.each(result.newCells(), function (cell) {
            fireNewCell(editor, cell.dom());
          });
          return result.cursor().map(function (cell) {
            var rng = editor.dom.createRng();
            rng.setStart(cell.dom(), 0);
            rng.setEnd(cell.dom(), 0);
            return rng;
          });
        }) : Option.none();
      };
    };
    var deleteRow = execute($_3gubn8m7jf3ft3lp.eraseRows, lastRowGuard, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var deleteColumn = execute($_3gubn8m7jf3ft3lp.eraseColumns, lastColumnGuard, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var insertRowsBefore = execute($_3gubn8m7jf3ft3lp.insertRowsBefore, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var insertRowsAfter = execute($_3gubn8m7jf3ft3lp.insertRowsAfter, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var insertColumnsBefore = execute($_3gubn8m7jf3ft3lp.insertColumnsBefore, $_6np0wpjsjf3ft34s.always, $_an3rg3lujf3ft3jc.halve, lazyWire);
    var insertColumnsAfter = execute($_3gubn8m7jf3ft3lp.insertColumnsAfter, $_6np0wpjsjf3ft34s.always, $_an3rg3lujf3ft3jc.halve, lazyWire);
    var mergeCells = execute($_3gubn8m7jf3ft3lp.mergeCells, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var unmergeCells = execute($_3gubn8m7jf3ft3lp.unmergeCells, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var pasteRowsBefore = execute($_3gubn8m7jf3ft3lp.pasteRowsBefore, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var pasteRowsAfter = execute($_3gubn8m7jf3ft3lp.pasteRowsAfter, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    var pasteCells = execute($_3gubn8m7jf3ft3lp.pasteCells, $_6np0wpjsjf3ft34s.always, $_6np0wpjsjf3ft34s.noop, lazyWire);
    return {
      deleteRow: deleteRow,
      deleteColumn: deleteColumn,
      insertRowsBefore: insertRowsBefore,
      insertRowsAfter: insertRowsAfter,
      insertColumnsBefore: insertColumnsBefore,
      insertColumnsAfter: insertColumnsAfter,
      mergeCells: mergeCells,
      unmergeCells: unmergeCells,
      pasteRowsBefore: pasteRowsBefore,
      pasteRowsAfter: pasteRowsAfter,
      pasteCells: pasteCells
    };
  }

  var copyRows = function (table, target, generators) {
    var list = $_7r7n5rk0jf3ft367.fromTable(table);
    var house = $_50juipkyjf3ft3c6.generate(list);
    var details = $_86s04nmejf3ft3o4.onCells(house, target);
    return details.map(function (selectedCells) {
      var grid = $_8rv75imhjf3ft3or.toGrid(house, generators, false);
      var slicedGrid = grid.slice(selectedCells[0].row(), selectedCells[selectedCells.length - 1].row() + selectedCells[selectedCells.length - 1].rowspan());
      var slicedDetails = $_86s04nmejf3ft3o4.toDetailList(slicedGrid, generators);
      return $_8ppmr3mkjf3ft3pa.copy(slicedDetails);
    });
  };
  var $_bu90p4nejf3ft3v1 = { copyRows: copyRows };

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var getTDTHOverallStyle = function (dom, elm, name) {
    var cells = dom.select('td,th', elm);
    var firstChildStyle;
    var checkChildren = function (firstChildStyle, elms) {
      for (var i = 0; i < elms.length; i++) {
        var currentStyle = dom.getStyle(elms[i], name);
        if (typeof firstChildStyle === 'undefined') {
          firstChildStyle = currentStyle;
        }
        if (firstChildStyle !== currentStyle) {
          return '';
        }
      }
      return firstChildStyle;
    };
    firstChildStyle = checkChildren(firstChildStyle, cells);
    return firstChildStyle;
  };
  var applyAlign = function (editor, elm, name) {
    if (name) {
      editor.formatter.apply('align' + name, {}, elm);
    }
  };
  var applyVAlign = function (editor, elm, name) {
    if (name) {
      editor.formatter.apply('valign' + name, {}, elm);
    }
  };
  var unApplyAlign = function (editor, elm) {
    Tools.each('left center right'.split(' '), function (name) {
      editor.formatter.remove('align' + name, {}, elm);
    });
  };
  var unApplyVAlign = function (editor, elm) {
    Tools.each('top middle bottom'.split(' '), function (name) {
      editor.formatter.remove('valign' + name, {}, elm);
    });
  };
  var $_7nqhinnhjf3ft3vl = {
    applyAlign: applyAlign,
    applyVAlign: applyVAlign,
    unApplyAlign: unApplyAlign,
    unApplyVAlign: unApplyVAlign,
    getTDTHOverallStyle: getTDTHOverallStyle
  };

  var buildListItems = function (inputList, itemCallback, startItems) {
    var appendItems = function (values, output) {
      output = output || [];
      Tools.each(values, function (item) {
        var menuItem = { text: item.text || item.title };
        if (item.menu) {
          menuItem.menu = appendItems(item.menu);
        } else {
          menuItem.value = item.value;
          if (itemCallback) {
            itemCallback(menuItem);
          }
        }
        output.push(menuItem);
      });
      return output;
    };
    return appendItems(inputList, startItems || []);
  };
  var updateStyleField = function (editor, evt) {
    var dom = editor.dom;
    var rootControl = evt.control.rootControl;
    var data = rootControl.toJSON();
    var css = dom.parseStyle(data.style);
    if (evt.control.name() === 'style') {
      rootControl.find('#borderStyle').value(css['border-style'] || '')[0].fire('select');
      rootControl.find('#borderColor').value(css['border-color'] || '')[0].fire('change');
      rootControl.find('#backgroundColor').value(css['background-color'] || '')[0].fire('change');
      rootControl.find('#width').value(css.width || '').fire('change');
      rootControl.find('#height').value(css.height || '').fire('change');
    } else {
      css['border-style'] = data.borderStyle;
      css['border-color'] = data.borderColor;
      css['background-color'] = data.backgroundColor;
      css.width = data.width ? $_bteipcn8jf3ft3u3.addSizeSuffix(data.width) : '';
      css.height = data.height ? $_bteipcn8jf3ft3u3.addSizeSuffix(data.height) : '';
    }
    rootControl.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
  };
  var extractAdvancedStyles = function (dom, elm) {
    var css = dom.parseStyle(dom.getAttrib(elm, 'style'));
    var data = {};
    if (css['border-style']) {
      data.borderStyle = css['border-style'];
    }
    if (css['border-color']) {
      data.borderColor = css['border-color'];
    }
    if (css['background-color']) {
      data.backgroundColor = css['background-color'];
    }
    data.style = dom.serializeStyle(css);
    return data;
  };
  var createStyleForm = function (editor) {
    var createColorPickAction = function () {
      var colorPickerCallback = getColorPickerCallback(editor);
      if (colorPickerCallback) {
        return function (evt) {
          return colorPickerCallback.call(editor, function (value) {
            evt.control.value(value).fire('change');
          }, evt.control.value());
        };
      }
    };
    return {
      title: 'Advanced',
      type: 'form',
      defaults: { onchange: $_6np0wpjsjf3ft34s.curry(updateStyleField, editor) },
      items: [
        {
          label: 'Style',
          name: 'style',
          type: 'textbox'
        },
        {
          type: 'form',
          padding: 0,
          formItemDefaults: {
            layout: 'grid',
            alignH: [
              'start',
              'right'
            ]
          },
          defaults: { size: 7 },
          items: [
            {
              label: 'Border style',
              type: 'listbox',
              name: 'borderStyle',
              width: 90,
              onselect: $_6np0wpjsjf3ft34s.curry(updateStyleField, editor),
              values: [
                {
                  text: 'Select...',
                  value: ''
                },
                {
                  text: 'Solid',
                  value: 'solid'
                },
                {
                  text: 'Dotted',
                  value: 'dotted'
                },
                {
                  text: 'Dashed',
                  value: 'dashed'
                },
                {
                  text: 'Double',
                  value: 'double'
                },
                {
                  text: 'Groove',
                  value: 'groove'
                },
                {
                  text: 'Ridge',
                  value: 'ridge'
                },
                {
                  text: 'Inset',
                  value: 'inset'
                },
                {
                  text: 'Outset',
                  value: 'outset'
                },
                {
                  text: 'None',
                  value: 'none'
                },
                {
                  text: 'Hidden',
                  value: 'hidden'
                }
              ]
            },
            {
              label: 'Border color',
              type: 'colorbox',
              name: 'borderColor',
              onaction: createColorPickAction()
            },
            {
              label: 'Background color',
              type: 'colorbox',
              name: 'backgroundColor',
              onaction: createColorPickAction()
            }
          ]
        }
      ]
    };
  };
  var $_sx40vnijf3ft3vo = {
    createStyleForm: createStyleForm,
    buildListItems: buildListItems,
    updateStyleField: updateStyleField,
    extractAdvancedStyles: extractAdvancedStyles
  };

  var updateStyles = function (elm, cssText) {
    elm.style.cssText += ';' + cssText;
  };
  var extractDataFromElement = function (editor, elm) {
    var dom = editor.dom;
    var data = {
      width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
      height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
      scope: dom.getAttrib(elm, 'scope'),
      class: dom.getAttrib(elm, 'class')
    };
    data.type = elm.nodeName.toLowerCase();
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'align' + name)) {
        data.align = name;
      }
    });
    Tools.each('top middle bottom'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'valign' + name)) {
        data.valign = name;
      }
    });
    if (hasAdvancedCellTab(editor)) {
      Tools.extend(data, $_sx40vnijf3ft3vo.extractAdvancedStyles(dom, elm));
    }
    return data;
  };
  var onSubmitCellForm = function (editor, cells, evt) {
    var dom = editor.dom;
    var data;
    function setAttrib(elm, name, value) {
      if (value) {
        dom.setAttrib(elm, name, value);
      }
    }
    function setStyle(elm, name, value) {
      if (value) {
        dom.setStyle(elm, name, value);
      }
    }
    $_sx40vnijf3ft3vo.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    editor.undoManager.transact(function () {
      Tools.each(cells, function (cellElm) {
        setAttrib(cellElm, 'scope', data.scope);
        if (cells.length === 1) {
          setAttrib(cellElm, 'style', data.style);
        } else {
          updateStyles(cellElm, data.style);
        }
        setAttrib(cellElm, 'class', data.class);
        setStyle(cellElm, 'width', $_bteipcn8jf3ft3u3.addSizeSuffix(data.width));
        setStyle(cellElm, 'height', $_bteipcn8jf3ft3u3.addSizeSuffix(data.height));
        if (data.type && cellElm.nodeName.toLowerCase() !== data.type) {
          cellElm = dom.rename(cellElm, data.type);
        }
        if (cells.length === 1) {
          $_7nqhinnhjf3ft3vl.unApplyAlign(editor, cellElm);
          $_7nqhinnhjf3ft3vl.unApplyVAlign(editor, cellElm);
        }
        if (data.align) {
          $_7nqhinnhjf3ft3vl.applyAlign(editor, cellElm, data.align);
        }
        if (data.valign) {
          $_7nqhinnhjf3ft3vl.applyVAlign(editor, cellElm, data.valign);
        }
      });
      editor.focus();
    });
  };
  var open = function (editor) {
    var cellElm, data, classListCtrl, cells = [];
    cells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
    cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');
    if (!cells.length && cellElm) {
      cells.push(cellElm);
    }
    cellElm = cellElm || cells[0];
    if (!cellElm) {
      return;
    }
    if (cells.length > 1) {
      data = {
        width: '',
        height: '',
        scope: '',
        class: '',
        align: '',
        style: '',
        type: cellElm.nodeName.toLowerCase()
      };
    } else {
      data = extractDataFromElement(editor, cellElm);
    }
    if (getCellClassList(editor).length > 0) {
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_sx40vnijf3ft3vo.buildListItems(getCellClassList(editor), function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'td',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    var generalCellForm = {
      type: 'form',
      layout: 'flex',
      direction: 'column',
      labelGapCalc: 'children',
      padding: 0,
      items: [
        {
          type: 'form',
          layout: 'grid',
          columns: 2,
          labelGapCalc: false,
          padding: 0,
          defaults: {
            type: 'textbox',
            maxWidth: 50
          },
          items: [
            {
              label: 'Width',
              name: 'width',
              onchange: $_6np0wpjsjf3ft34s.curry($_sx40vnijf3ft3vo.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_6np0wpjsjf3ft34s.curry($_sx40vnijf3ft3vo.updateStyleField, editor)
            },
            {
              label: 'Cell type',
              name: 'type',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'Cell',
                  value: 'td'
                },
                {
                  text: 'Header cell',
                  value: 'th'
                }
              ]
            },
            {
              label: 'Scope',
              name: 'scope',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Row',
                  value: 'row'
                },
                {
                  text: 'Column',
                  value: 'col'
                },
                {
                  text: 'Row group',
                  value: 'rowgroup'
                },
                {
                  text: 'Column group',
                  value: 'colgroup'
                }
              ]
            },
            {
              label: 'H Align',
              name: 'align',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Left',
                  value: 'left'
                },
                {
                  text: 'Center',
                  value: 'center'
                },
                {
                  text: 'Right',
                  value: 'right'
                }
              ]
            },
            {
              label: 'V Align',
              name: 'valign',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Top',
                  value: 'top'
                },
                {
                  text: 'Middle',
                  value: 'middle'
                },
                {
                  text: 'Bottom',
                  value: 'bottom'
                }
              ]
            }
          ]
        },
        classListCtrl
      ]
    };
    if (hasAdvancedCellTab(editor)) {
      editor.windowManager.open({
        title: 'Cell properties',
        bodyType: 'tabpanel',
        data: data,
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalCellForm
          },
          $_sx40vnijf3ft3vo.createStyleForm(editor)
        ],
        onsubmit: $_6np0wpjsjf3ft34s.curry(onSubmitCellForm, editor, cells)
      });
    } else {
      editor.windowManager.open({
        title: 'Cell properties',
        data: data,
        body: generalCellForm,
        onsubmit: $_6np0wpjsjf3ft34s.curry(onSubmitCellForm, editor, cells)
      });
    }
  };
  var $_7qm9dqngjf3ft3vf = { open: open };

  var extractDataFromElement$1 = function (editor, elm) {
    var dom = editor.dom;
    var data = {
      height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
      scope: dom.getAttrib(elm, 'scope'),
      class: dom.getAttrib(elm, 'class')
    };
    data.type = elm.parentNode.nodeName.toLowerCase();
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'align' + name)) {
        data.align = name;
      }
    });
    if (hasAdvancedRowTab(editor)) {
      Tools.extend(data, $_sx40vnijf3ft3vo.extractAdvancedStyles(dom, elm));
    }
    return data;
  };
  var switchRowType = function (dom, rowElm, toType) {
    var tableElm = dom.getParent(rowElm, 'table');
    var oldParentElm = rowElm.parentNode;
    var parentElm = dom.select(toType, tableElm)[0];
    if (!parentElm) {
      parentElm = dom.create(toType);
      if (tableElm.firstChild) {
        if (tableElm.firstChild.nodeName === 'CAPTION') {
          dom.insertAfter(parentElm, tableElm.firstChild);
        } else {
          tableElm.insertBefore(parentElm, tableElm.firstChild);
        }
      } else {
        tableElm.appendChild(parentElm);
      }
    }
    parentElm.appendChild(rowElm);
    if (!oldParentElm.hasChildNodes()) {
      dom.remove(oldParentElm);
    }
  };
  function onSubmitRowForm(editor, rows, evt) {
    var dom = editor.dom;
    var data;
    function setAttrib(elm, name, value) {
      if (value) {
        dom.setAttrib(elm, name, value);
      }
    }
    function setStyle(elm, name, value) {
      if (value) {
        dom.setStyle(elm, name, value);
      }
    }
    $_sx40vnijf3ft3vo.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    editor.undoManager.transact(function () {
      Tools.each(rows, function (rowElm) {
        setAttrib(rowElm, 'scope', data.scope);
        setAttrib(rowElm, 'style', data.style);
        setAttrib(rowElm, 'class', data.class);
        setStyle(rowElm, 'height', $_bteipcn8jf3ft3u3.addSizeSuffix(data.height));
        if (data.type !== rowElm.parentNode.nodeName.toLowerCase()) {
          switchRowType(editor.dom, rowElm, data.type);
        }
        if (rows.length === 1) {
          $_7nqhinnhjf3ft3vl.unApplyAlign(editor, rowElm);
        }
        if (data.align) {
          $_7nqhinnhjf3ft3vl.applyAlign(editor, rowElm, data.align);
        }
      });
      editor.focus();
    });
  }
  var open$1 = function (editor) {
    var dom = editor.dom;
    var tableElm, cellElm, rowElm, classListCtrl, data;
    var rows = [];
    var generalRowForm;
    tableElm = dom.getParent(editor.selection.getStart(), 'table');
    cellElm = dom.getParent(editor.selection.getStart(), 'td,th');
    Tools.each(tableElm.rows, function (row) {
      Tools.each(row.cells, function (cell) {
        if (dom.getAttrib(cell, 'data-mce-selected') || cell === cellElm) {
          rows.push(row);
          return false;
        }
      });
    });
    rowElm = rows[0];
    if (!rowElm) {
      return;
    }
    if (rows.length > 1) {
      data = {
        height: '',
        scope: '',
        class: '',
        align: '',
        type: rowElm.parentNode.nodeName.toLowerCase()
      };
    } else {
      data = extractDataFromElement$1(editor, rowElm);
    }
    if (getRowClassList(editor).length > 0) {
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_sx40vnijf3ft3vo.buildListItems(getRowClassList(editor), function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'tr',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    generalRowForm = {
      type: 'form',
      columns: 2,
      padding: 0,
      defaults: { type: 'textbox' },
      items: [
        {
          type: 'listbox',
          name: 'type',
          label: 'Row type',
          text: 'Header',
          maxWidth: null,
          values: [
            {
              text: 'Header',
              value: 'thead'
            },
            {
              text: 'Body',
              value: 'tbody'
            },
            {
              text: 'Footer',
              value: 'tfoot'
            }
          ]
        },
        {
          type: 'listbox',
          name: 'align',
          label: 'Alignment',
          text: 'None',
          maxWidth: null,
          values: [
            {
              text: 'None',
              value: ''
            },
            {
              text: 'Left',
              value: 'left'
            },
            {
              text: 'Center',
              value: 'center'
            },
            {
              text: 'Right',
              value: 'right'
            }
          ]
        },
        {
          label: 'Height',
          name: 'height'
        },
        classListCtrl
      ]
    };
    if (hasAdvancedRowTab(editor)) {
      editor.windowManager.open({
        title: 'Row properties',
        data: data,
        bodyType: 'tabpanel',
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalRowForm
          },
          $_sx40vnijf3ft3vo.createStyleForm(editor)
        ],
        onsubmit: $_6np0wpjsjf3ft34s.curry(onSubmitRowForm, editor, rows)
      });
    } else {
      editor.windowManager.open({
        title: 'Row properties',
        data: data,
        body: generalRowForm,
        onsubmit: $_6np0wpjsjf3ft34s.curry(onSubmitRowForm, editor, rows)
      });
    }
  };
  var $_4nuwhlnjjf3ft3vv = { open: open$1 };

  var Env = tinymce.util.Tools.resolve('tinymce.Env');

  var DefaultRenderOptions = {
    styles: {
      'border-collapse': 'collapse',
      width: '100%'
    },
    attributes: { border: '1' },
    percentages: true
  };
  var makeTable = function () {
    return $_cjzqfhk5jf3ft37x.fromTag('table');
  };
  var tableBody = function () {
    return $_cjzqfhk5jf3ft37x.fromTag('tbody');
  };
  var tableRow = function () {
    return $_cjzqfhk5jf3ft37x.fromTag('tr');
  };
  var tableHeaderCell = function () {
    return $_cjzqfhk5jf3ft37x.fromTag('th');
  };
  var tableCell = function () {
    return $_cjzqfhk5jf3ft37x.fromTag('td');
  };
  var render$1 = function (rows, columns, rowHeaders, columnHeaders, renderOpts) {
    if (renderOpts === void 0) {
      renderOpts = DefaultRenderOptions;
    }
    var table = makeTable();
    $_9hbdczkzjf3ft3ci.setAll(table, renderOpts.styles);
    $_fcjbkgkqjf3ft3af.setAll(table, renderOpts.attributes);
    var tbody = tableBody();
    $_au51ntl1jf3ft3d0.append(table, tbody);
    var trs = [];
    for (var i = 0; i < rows; i++) {
      var tr = tableRow();
      for (var j = 0; j < columns; j++) {
        var td = i < rowHeaders || j < columnHeaders ? tableHeaderCell() : tableCell();
        if (j < columnHeaders) {
          $_fcjbkgkqjf3ft3af.set(td, 'scope', 'row');
        }
        if (i < rowHeaders) {
          $_fcjbkgkqjf3ft3af.set(td, 'scope', 'col');
        }
        $_au51ntl1jf3ft3d0.append(td, $_cjzqfhk5jf3ft37x.fromTag('br'));
        if (renderOpts.percentages) {
          $_9hbdczkzjf3ft3ci.set(td, 'width', 100 / columns + '%');
        }
        $_au51ntl1jf3ft3d0.append(tr, td);
      }
      trs.push(tr);
    }
    $_e6z7itl3jf3ft3d9.append(tbody, trs);
    return table;
  };

  var get$7 = function (element) {
    return element.dom().innerHTML;
  };
  var set$5 = function (element, content) {
    var owner = $_a4gvewk7jf3ft384.owner(element);
    var docDom = owner.dom();
    var fragment = $_cjzqfhk5jf3ft37x.fromDom(docDom.createDocumentFragment());
    var contentElements = $_4abckllajf3ft3er.fromHtml(content, docDom);
    $_e6z7itl3jf3ft3d9.append(fragment, contentElements);
    $_1fts8il2jf3ft3d3.empty(element);
    $_au51ntl1jf3ft3d0.append(element, fragment);
  };
  var getOuter$2 = function (element) {
    var container = $_cjzqfhk5jf3ft37x.fromTag('div');
    var clone = $_cjzqfhk5jf3ft37x.fromDom(element.dom().cloneNode(true));
    $_au51ntl1jf3ft3d0.append(container, clone);
    return get$7(container);
  };
  var $_cn9m41npjf3ft3wv = {
    get: get$7,
    set: set$5,
    getOuter: getOuter$2
  };

  var placeCaretInCell = function (editor, cell) {
    editor.selection.select(cell.dom(), true);
    editor.selection.collapse(true);
  };
  var selectFirstCellInTable = function (editor, tableElm) {
    $_fhotvakvjf3ft3bm.descendant(tableElm, 'td,th').each($_6np0wpjsjf3ft34s.curry(placeCaretInCell, editor));
  };
  var fireEvents = function (editor, table) {
    $_5qd2tsjqjf3ft34c.each($_6pynzqksjf3ft3aw.descendants(table, 'tr'), function (row) {
      fireNewRow(editor, row.dom());
      $_5qd2tsjqjf3ft34c.each($_6pynzqksjf3ft3aw.descendants(row, 'th,td'), function (cell) {
        fireNewCell(editor, cell.dom());
      });
    });
  };
  var isPercentage = function (width) {
    return $_424octjzjf3ft364.isString(width) && width.indexOf('%') !== -1;
  };
  var insert$1 = function (editor, columns, rows) {
    var defaultStyles = getDefaultStyles(editor);
    var options = {
      styles: defaultStyles,
      attributes: getDefaultAttributes(editor),
      percentages: isPercentage(defaultStyles.width) && !isPixelsForced(editor)
    };
    var table = render$1(rows, columns, 0, 0, options);
    $_fcjbkgkqjf3ft3af.set(table, 'data-mce-id', '__mce');
    var html = $_cn9m41npjf3ft3wv.getOuter(table);
    editor.insertContent(html);
    return $_fhotvakvjf3ft3bm.descendant($_bteipcn8jf3ft3u3.getBody(editor), 'table[data-mce-id="__mce"]').map(function (table) {
      if (isPixelsForced(editor)) {
        $_9hbdczkzjf3ft3ci.set(table, 'width', $_9hbdczkzjf3ft3ci.get(table, 'width'));
      }
      $_fcjbkgkqjf3ft3af.remove(table, 'data-mce-id');
      fireEvents(editor, table);
      selectFirstCellInTable(editor, table);
      return table.dom();
    }).getOr(null);
  };
  var $_fgnrflnmjf3ft3w7 = { insert: insert$1 };

  function styleTDTH(dom, elm, name, value) {
    if (elm.tagName === 'TD' || elm.tagName === 'TH') {
      dom.setStyle(elm, name, value);
    } else {
      if (elm.children) {
        for (var i = 0; i < elm.children.length; i++) {
          styleTDTH(dom, elm.children[i], name, value);
        }
      }
    }
  }
  var extractDataFromElement$2 = function (editor, tableElm) {
    var dom = editor.dom;
    var data = {
      width: dom.getStyle(tableElm, 'width') || dom.getAttrib(tableElm, 'width'),
      height: dom.getStyle(tableElm, 'height') || dom.getAttrib(tableElm, 'height'),
      cellspacing: dom.getStyle(tableElm, 'border-spacing') || dom.getAttrib(tableElm, 'cellspacing'),
      cellpadding: dom.getAttrib(tableElm, 'data-mce-cell-padding') || dom.getAttrib(tableElm, 'cellpadding') || $_7nqhinnhjf3ft3vl.getTDTHOverallStyle(editor.dom, tableElm, 'padding'),
      border: dom.getAttrib(tableElm, 'data-mce-border') || dom.getAttrib(tableElm, 'border') || $_7nqhinnhjf3ft3vl.getTDTHOverallStyle(editor.dom, tableElm, 'border'),
      borderColor: dom.getAttrib(tableElm, 'data-mce-border-color'),
      caption: !!dom.select('caption', tableElm)[0],
      class: dom.getAttrib(tableElm, 'class')
    };
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(tableElm, 'align' + name)) {
        data.align = name;
      }
    });
    if (hasAdvancedTableTab(editor)) {
      Tools.extend(data, $_sx40vnijf3ft3vo.extractAdvancedStyles(dom, tableElm));
    }
    return data;
  };
  var applyDataToElement = function (editor, tableElm, data) {
    var dom = editor.dom;
    var attrs = {};
    var styles = {};
    attrs.class = data.class;
    styles.height = $_bteipcn8jf3ft3u3.addSizeSuffix(data.height);
    if (dom.getAttrib(tableElm, 'width') && !shouldStyleWithCss(editor)) {
      attrs.width = $_bteipcn8jf3ft3u3.removePxSuffix(data.width);
    } else {
      styles.width = $_bteipcn8jf3ft3u3.addSizeSuffix(data.width);
    }
    if (shouldStyleWithCss(editor)) {
      styles['border-width'] = $_bteipcn8jf3ft3u3.addSizeSuffix(data.border);
      styles['border-spacing'] = $_bteipcn8jf3ft3u3.addSizeSuffix(data.cellspacing);
      Tools.extend(attrs, {
        'data-mce-border-color': data.borderColor,
        'data-mce-cell-padding': data.cellpadding,
        'data-mce-border': data.border
      });
    } else {
      Tools.extend(attrs, {
        border: data.border,
        cellpadding: data.cellpadding,
        cellspacing: data.cellspacing
      });
    }
    if (shouldStyleWithCss(editor)) {
      if (tableElm.children) {
        for (var i = 0; i < tableElm.children.length; i++) {
          styleTDTH(dom, tableElm.children[i], {
            'border-width': $_bteipcn8jf3ft3u3.addSizeSuffix(data.border),
            'border-color': data.borderColor,
            'padding': $_bteipcn8jf3ft3u3.addSizeSuffix(data.cellpadding)
          });
        }
      }
    }
    if (data.style) {
      Tools.extend(styles, dom.parseStyle(data.style));
    } else {
      styles = Tools.extend({}, dom.parseStyle(dom.getAttrib(tableElm, 'style')), styles);
    }
    attrs.style = dom.serializeStyle(styles);
    dom.setAttribs(tableElm, attrs);
  };
  var onSubmitTableForm = function (editor, tableElm, evt) {
    var dom = editor.dom;
    var captionElm;
    var data;
    $_sx40vnijf3ft3vo.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    if (data.class === false) {
      delete data.class;
    }
    editor.undoManager.transact(function () {
      if (!tableElm) {
        tableElm = $_fgnrflnmjf3ft3w7.insert(editor, data.cols || 1, data.rows || 1);
      }
      applyDataToElement(editor, tableElm, data);
      captionElm = dom.select('caption', tableElm)[0];
      if (captionElm && !data.caption) {
        dom.remove(captionElm);
      }
      if (!captionElm && data.caption) {
        captionElm = dom.create('caption');
        captionElm.innerHTML = !Env.ie ? '<br data-mce-bogus="1"/>' : '\xA0';
        tableElm.insertBefore(captionElm, tableElm.firstChild);
      }
      $_7nqhinnhjf3ft3vl.unApplyAlign(editor, tableElm);
      if (data.align) {
        $_7nqhinnhjf3ft3vl.applyAlign(editor, tableElm, data.align);
      }
      editor.focus();
      editor.addVisual();
    });
  };
  var open$2 = function (editor, isProps) {
    var dom = editor.dom;
    var tableElm, colsCtrl, rowsCtrl, classListCtrl, data = {}, generalTableForm;
    if (isProps === true) {
      tableElm = dom.getParent(editor.selection.getStart(), 'table');
      if (tableElm) {
        data = extractDataFromElement$2(editor, tableElm);
      }
    } else {
      colsCtrl = {
        label: 'Cols',
        name: 'cols'
      };
      rowsCtrl = {
        label: 'Rows',
        name: 'rows'
      };
    }
    if (getTableClassList(editor).length > 0) {
      if (data.class) {
        data.class = data.class.replace(/\s*mce\-item\-table\s*/g, '');
      }
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_sx40vnijf3ft3vo.buildListItems(getTableClassList(editor), function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'table',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    generalTableForm = {
      type: 'form',
      layout: 'flex',
      direction: 'column',
      labelGapCalc: 'children',
      padding: 0,
      items: [
        {
          type: 'form',
          labelGapCalc: false,
          padding: 0,
          layout: 'grid',
          columns: 2,
          defaults: {
            type: 'textbox',
            maxWidth: 50
          },
          items: hasAppearanceOptions(editor) ? [
            colsCtrl,
            rowsCtrl,
            {
              label: 'Width',
              name: 'width',
              onchange: $_6np0wpjsjf3ft34s.curry($_sx40vnijf3ft3vo.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_6np0wpjsjf3ft34s.curry($_sx40vnijf3ft3vo.updateStyleField, editor)
            },
            {
              label: 'Cell spacing',
              name: 'cellspacing'
            },
            {
              label: 'Cell padding',
              name: 'cellpadding'
            },
            {
              label: 'Border',
              name: 'border'
            },
            {
              label: 'Caption',
              name: 'caption',
              type: 'checkbox'
            }
          ] : [
            colsCtrl,
            rowsCtrl,
            {
              label: 'Width',
              name: 'width',
              onchange: $_6np0wpjsjf3ft34s.curry($_sx40vnijf3ft3vo.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_6np0wpjsjf3ft34s.curry($_sx40vnijf3ft3vo.updateStyleField, editor)
            }
          ]
        },
        {
          label: 'Alignment',
          name: 'align',
          type: 'listbox',
          text: 'None',
          values: [
            {
              text: 'None',
              value: ''
            },
            {
              text: 'Left',
              value: 'left'
            },
            {
              text: 'Center',
              value: 'center'
            },
            {
              text: 'Right',
              value: 'right'
            }
          ]
        },
        classListCtrl
      ]
    };
    if (hasAdvancedTableTab(editor)) {
      editor.windowManager.open({
        title: 'Table properties',
        data: data,
        bodyType: 'tabpanel',
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalTableForm
          },
          $_sx40vnijf3ft3vo.createStyleForm(editor)
        ],
        onsubmit: $_6np0wpjsjf3ft34s.curry(onSubmitTableForm, editor, tableElm)
      });
    } else {
      editor.windowManager.open({
        title: 'Table properties',
        data: data,
        body: generalTableForm,
        onsubmit: $_6np0wpjsjf3ft34s.curry(onSubmitTableForm, editor, tableElm)
      });
    }
  };
  var $_cwa99xnkjf3ft3w0 = { open: open$2 };

  var each$3 = Tools.each;
  var registerCommands = function (editor, actions, cellSelection, selections, clipboardRows) {
    var isRoot = $_bteipcn8jf3ft3u3.getIsRoot(editor);
    var eraseTable = function () {
      var cell = $_cjzqfhk5jf3ft37x.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
      var table = $_3oodk9k2jf3ft36l.table(cell, isRoot);
      table.filter($_6np0wpjsjf3ft34s.not(isRoot)).each(function (table) {
        var cursor = $_cjzqfhk5jf3ft37x.fromText('');
        $_au51ntl1jf3ft3d0.after(table, cursor);
        $_1fts8il2jf3ft3d3.remove(table);
        var rng = editor.dom.createRng();
        rng.setStart(cursor.dom(), 0);
        rng.setEnd(cursor.dom(), 0);
        editor.selection.setRng(rng);
      });
    };
    var getSelectionStartCell = function () {
      return $_cjzqfhk5jf3ft37x.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
    };
    var getTableFromCell = function (cell) {
      return $_3oodk9k2jf3ft36l.table(cell, isRoot);
    };
    var actOnSelection = function (execute) {
      var cell = getSelectionStartCell();
      var table = getTableFromCell(cell);
      table.each(function (table) {
        var targets = $_ch69x3lbjf3ft3eu.forMenu(selections, table, cell);
        execute(table, targets).each(function (rng) {
          editor.selection.setRng(rng);
          editor.focus();
          cellSelection.clear(table);
        });
      });
    };
    var copyRowSelection = function (execute) {
      var cell = getSelectionStartCell();
      var table = getTableFromCell(cell);
      return table.bind(function (table) {
        var doc = $_cjzqfhk5jf3ft37x.fromDom(editor.getDoc());
        var targets = $_ch69x3lbjf3ft3eu.forMenu(selections, table, cell);
        var generators = $_5zb0acl4jf3ft3de.cellOperations($_6np0wpjsjf3ft34s.noop, doc, Option.none());
        return $_bu90p4nejf3ft3v1.copyRows(table, targets, generators);
      });
    };
    var pasteOnSelection = function (execute) {
      clipboardRows.get().each(function (rows) {
        var clonedRows = $_5qd2tsjqjf3ft34c.map(rows, function (row) {
          return $_3qbzp9l5jf3ft3e2.deep(row);
        });
        var cell = getSelectionStartCell();
        var table = getTableFromCell(cell);
        table.bind(function (table) {
          var doc = $_cjzqfhk5jf3ft37x.fromDom(editor.getDoc());
          var generators = $_5zb0acl4jf3ft3de.paste(doc);
          var targets = $_ch69x3lbjf3ft3eu.pasteRows(selections, table, cell, clonedRows, generators);
          execute(table, targets).each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
            cellSelection.clear(table);
          });
        });
      });
    };
    each$3({
      mceTableSplitCells: function () {
        actOnSelection(actions.unmergeCells);
      },
      mceTableMergeCells: function () {
        actOnSelection(actions.mergeCells);
      },
      mceTableInsertRowBefore: function () {
        actOnSelection(actions.insertRowsBefore);
      },
      mceTableInsertRowAfter: function () {
        actOnSelection(actions.insertRowsAfter);
      },
      mceTableInsertColBefore: function () {
        actOnSelection(actions.insertColumnsBefore);
      },
      mceTableInsertColAfter: function () {
        actOnSelection(actions.insertColumnsAfter);
      },
      mceTableDeleteCol: function () {
        actOnSelection(actions.deleteColumn);
      },
      mceTableDeleteRow: function () {
        actOnSelection(actions.deleteRow);
      },
      mceTableCutRow: function (grid) {
        clipboardRows.set(copyRowSelection());
        actOnSelection(actions.deleteRow);
      },
      mceTableCopyRow: function (grid) {
        clipboardRows.set(copyRowSelection());
      },
      mceTablePasteRowBefore: function (grid) {
        pasteOnSelection(actions.pasteRowsBefore);
      },
      mceTablePasteRowAfter: function (grid) {
        pasteOnSelection(actions.pasteRowsAfter);
      },
      mceTableDelete: eraseTable
    }, function (func, name) {
      editor.addCommand(name, func);
    });
    each$3({
      mceInsertTable: $_6np0wpjsjf3ft34s.curry($_cwa99xnkjf3ft3w0.open, editor),
      mceTableProps: $_6np0wpjsjf3ft34s.curry($_cwa99xnkjf3ft3w0.open, editor, true),
      mceTableRowProps: $_6np0wpjsjf3ft34s.curry($_4nuwhlnjjf3ft3vv.open, editor),
      mceTableCellProps: $_6np0wpjsjf3ft34s.curry($_7qm9dqngjf3ft3vf.open, editor)
    }, function (func, name) {
      editor.addCommand(name, function (ui, val) {
        func(val);
      });
    });
  };
  var $_8ns4qundjf3ft3uk = { registerCommands: registerCommands };

  var only$1 = function (element) {
    var parent = Option.from(element.dom().documentElement).map($_cjzqfhk5jf3ft37x.fromDom).getOr(element);
    return {
      parent: $_6np0wpjsjf3ft34s.constant(parent),
      view: $_6np0wpjsjf3ft34s.constant(element),
      origin: $_6np0wpjsjf3ft34s.constant(r(0, 0))
    };
  };
  var detached = function (editable, chrome) {
    var origin = $_6np0wpjsjf3ft34s.curry($_3hwkw8m3jf3ft3l9.absolute, chrome);
    return {
      parent: $_6np0wpjsjf3ft34s.constant(chrome),
      view: $_6np0wpjsjf3ft34s.constant(editable),
      origin: origin
    };
  };
  var body$1 = function (editable, chrome) {
    return {
      parent: $_6np0wpjsjf3ft34s.constant(chrome),
      view: $_6np0wpjsjf3ft34s.constant(editable),
      origin: $_6np0wpjsjf3ft34s.constant(r(0, 0))
    };
  };
  var $_e42itcnrjf3ft3xa = {
    only: only$1,
    detached: detached,
    body: body$1
  };

  function Event (fields) {
    var struct = $_4bo75gjvjf3ft35r.immutable.apply(null, fields);
    var handlers = [];
    var bind = function (handler) {
      if (handler === undefined) {
        throw 'Event bind error: undefined handler';
      }
      handlers.push(handler);
    };
    var unbind = function (handler) {
      handlers = $_5qd2tsjqjf3ft34c.filter(handlers, function (h) {
        return h !== handler;
      });
    };
    var trigger = function () {
      var event = struct.apply(null, arguments);
      $_5qd2tsjqjf3ft34c.each(handlers, function (handler) {
        handler(event);
      });
    };
    return {
      bind: bind,
      unbind: unbind,
      trigger: trigger
    };
  }

  var create = function (typeDefs) {
    var registry = $_6j7iurjujf3ft35n.map(typeDefs, function (event) {
      return {
        bind: event.bind,
        unbind: event.unbind
      };
    });
    var trigger = $_6j7iurjujf3ft35n.map(typeDefs, function (event) {
      return event.trigger;
    });
    return {
      registry: registry,
      trigger: trigger
    };
  };
  var $_81kkbwnujf3ft3y8 = { create: create };

  var mode = $_hmvgzmajf3ft3ms.exactly([
    'compare',
    'extract',
    'mutate',
    'sink'
  ]);
  var sink = $_hmvgzmajf3ft3ms.exactly([
    'element',
    'start',
    'stop',
    'destroy'
  ]);
  var api$3 = $_hmvgzmajf3ft3ms.exactly([
    'forceDrop',
    'drop',
    'move',
    'delayDrop'
  ]);
  var $_2ftnxnnyjf3ft3zl = {
    mode: mode,
    sink: sink,
    api: api$3
  };

  var styles$1 = $_9r2zzymqjf3ft3rj.css('ephox-dragster');
  var $_3sgv8ao0jf3ft400 = { resolve: styles$1.resolve };

  function Blocker (options) {
    var settings = $_18tx14mfjf3ft3on.merge({ 'layerClass': $_3sgv8ao0jf3ft400.resolve('blocker') }, options);
    var div = $_cjzqfhk5jf3ft37x.fromTag('div');
    $_fcjbkgkqjf3ft3af.set(div, 'role', 'presentation');
    $_9hbdczkzjf3ft3ci.setAll(div, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%'
    });
    $_8ycds3mrjf3ft3rl.add(div, $_3sgv8ao0jf3ft400.resolve('blocker'));
    $_8ycds3mrjf3ft3rl.add(div, settings.layerClass);
    var element = function () {
      return div;
    };
    var destroy = function () {
      $_1fts8il2jf3ft3d3.remove(div);
    };
    return {
      element: element,
      destroy: destroy
    };
  }

  var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
    return {
      'target': $_6np0wpjsjf3ft34s.constant(target),
      'x': $_6np0wpjsjf3ft34s.constant(x),
      'y': $_6np0wpjsjf3ft34s.constant(y),
      'stop': stop,
      'prevent': prevent,
      'kill': kill,
      'raw': $_6np0wpjsjf3ft34s.constant(raw)
    };
  };
  var handle = function (filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent))
        return;
      var target = $_cjzqfhk5jf3ft37x.fromDom(rawEvent.target);
      var stop = function () {
        rawEvent.stopPropagation();
      };
      var prevent = function () {
        rawEvent.preventDefault();
      };
      var kill = $_6np0wpjsjf3ft34s.compose(prevent, stop);
      var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
      handler(evt);
    };
  };
  var binder = function (element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: $_6np0wpjsjf3ft34s.curry(unbind, element, event, wrapped, useCapture) };
  };
  var bind$1 = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, false);
  };
  var capture = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, true);
  };
  var unbind = function (element, event, handler, useCapture) {
    element.dom().removeEventListener(event, handler, useCapture);
  };
  var $_e0jl6so2jf3ft40c = {
    bind: bind$1,
    capture: capture
  };

  var filter$1 = $_6np0wpjsjf3ft34s.constant(true);
  var bind$2 = function (element, event, handler) {
    return $_e0jl6so2jf3ft40c.bind(element, event, filter$1, handler);
  };
  var capture$1 = function (element, event, handler) {
    return $_e0jl6so2jf3ft40c.capture(element, event, filter$1, handler);
  };
  var $_afgbc4o1jf3ft407 = {
    bind: bind$2,
    capture: capture$1
  };

  var compare = function (old, nu) {
    return r(nu.left() - old.left(), nu.top() - old.top());
  };
  var extract$1 = function (event) {
    return Option.some(r(event.x(), event.y()));
  };
  var mutate$1 = function (mutation, info) {
    mutation.mutate(info.left(), info.top());
  };
  var sink$1 = function (dragApi, settings) {
    var blocker = Blocker(settings);
    var mdown = $_afgbc4o1jf3ft407.bind(blocker.element(), 'mousedown', dragApi.forceDrop);
    var mup = $_afgbc4o1jf3ft407.bind(blocker.element(), 'mouseup', dragApi.drop);
    var mmove = $_afgbc4o1jf3ft407.bind(blocker.element(), 'mousemove', dragApi.move);
    var mout = $_afgbc4o1jf3ft407.bind(blocker.element(), 'mouseout', dragApi.delayDrop);
    var destroy = function () {
      blocker.destroy();
      mup.unbind();
      mmove.unbind();
      mout.unbind();
      mdown.unbind();
    };
    var start = function (parent) {
      $_au51ntl1jf3ft3d0.append(parent, blocker.element());
    };
    var stop = function () {
      $_1fts8il2jf3ft3d3.remove(blocker.element());
    };
    return $_2ftnxnnyjf3ft3zl.sink({
      element: blocker.element,
      start: start,
      stop: stop,
      destroy: destroy
    });
  };
  var MouseDrag = $_2ftnxnnyjf3ft3zl.mode({
    compare: compare,
    extract: extract$1,
    sink: sink$1,
    mutate: mutate$1
  });

  function InDrag () {
    var previous = Option.none();
    var reset = function () {
      previous = Option.none();
    };
    var update = function (mode, nu) {
      var result = previous.map(function (old) {
        return mode.compare(old, nu);
      });
      previous = Option.some(nu);
      return result;
    };
    var onEvent = function (event, mode) {
      var dataOption = mode.extract(event);
      dataOption.each(function (data) {
        var offset = update(mode, data);
        offset.each(function (d) {
          events.trigger.move(d);
        });
      });
    };
    var events = $_81kkbwnujf3ft3y8.create({ move: Event(['info']) });
    return {
      onEvent: onEvent,
      reset: reset,
      events: events.registry
    };
  }

  function NoDrag (anchor) {
    var onEvent = function (event, mode) {
    };
    return {
      onEvent: onEvent,
      reset: $_6np0wpjsjf3ft34s.noop
    };
  }

  function Movement () {
    var noDragState = NoDrag();
    var inDragState = InDrag();
    var dragState = noDragState;
    var on = function () {
      dragState.reset();
      dragState = inDragState;
    };
    var off = function () {
      dragState.reset();
      dragState = noDragState;
    };
    var onEvent = function (event, mode) {
      dragState.onEvent(event, mode);
    };
    var isOn = function () {
      return dragState === inDragState;
    };
    return {
      on: on,
      off: off,
      isOn: isOn,
      onEvent: onEvent,
      events: inDragState.events
    };
  }

  var adaptable = function (fn, rate) {
    var timer = null;
    var args = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        args = null;
      }
    };
    var throttle = function () {
      args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var first$4 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var last$3 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer !== null)
        clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
        timer = null;
        args = null;
      }, rate);
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var $_1g1w87o7jf3ft418 = {
    adaptable: adaptable,
    first: first$4,
    last: last$3
  };

  var setup = function (mutation, mode, settings) {
    var active = false;
    var events = $_81kkbwnujf3ft3y8.create({
      start: Event([]),
      stop: Event([])
    });
    var movement = Movement();
    var drop = function () {
      sink.stop();
      if (movement.isOn()) {
        movement.off();
        events.trigger.stop();
      }
    };
    var throttledDrop = $_1g1w87o7jf3ft418.last(drop, 200);
    var go = function (parent) {
      sink.start(parent);
      movement.on();
      events.trigger.start();
    };
    var mousemove = function (event, ui) {
      throttledDrop.cancel();
      movement.onEvent(event, mode);
    };
    movement.events.move.bind(function (event) {
      mode.mutate(mutation, event.info());
    });
    var on = function () {
      active = true;
    };
    var off = function () {
      active = false;
    };
    var runIfActive = function (f) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        if (active) {
          return f.apply(null, args);
        }
      };
    };
    var sink = mode.sink($_2ftnxnnyjf3ft3zl.api({
      forceDrop: drop,
      drop: runIfActive(drop),
      move: runIfActive(mousemove),
      delayDrop: runIfActive(throttledDrop.throttle)
    }), settings);
    var destroy = function () {
      sink.destroy();
    };
    return {
      element: sink.element,
      go: go,
      on: on,
      off: off,
      destroy: destroy,
      events: events.registry
    };
  };
  var $_8jiwzpo3jf3ft40h = { setup: setup };

  var transform$1 = function (mutation, options) {
    var settings = options !== undefined ? options : {};
    var mode = settings.mode !== undefined ? settings.mode : MouseDrag;
    return $_8jiwzpo3jf3ft40h.setup(mutation, mode, options);
  };
  var $_fmdazonwjf3ft3z7 = { transform: transform$1 };

  function Mutation () {
    var events = $_81kkbwnujf3ft3y8.create({
      'drag': Event([
        'xDelta',
        'yDelta'
      ])
    });
    var mutate = function (x, y) {
      events.trigger.drag(x, y);
    };
    return {
      mutate: mutate,
      events: events.registry
    };
  }

  function BarMutation () {
    var events = $_81kkbwnujf3ft3y8.create({
      drag: Event([
        'xDelta',
        'yDelta',
        'target'
      ])
    });
    var target = Option.none();
    var delegate = Mutation();
    delegate.events.drag.bind(function (event) {
      target.each(function (t) {
        events.trigger.drag(event.xDelta(), event.yDelta(), t);
      });
    });
    var assign = function (t) {
      target = Option.some(t);
    };
    var get = function () {
      return target;
    };
    return {
      assign: assign,
      get: get,
      mutate: delegate.mutate,
      events: events.registry
    };
  }

  var any = function (selector) {
    return $_fhotvakvjf3ft3bm.first(selector).isSome();
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_fhotvakvjf3ft3bm.ancestor(scope, selector, isRoot).isSome();
  };
  var sibling$2 = function (scope, selector) {
    return $_fhotvakvjf3ft3bm.sibling(scope, selector).isSome();
  };
  var child$3 = function (scope, selector) {
    return $_fhotvakvjf3ft3bm.child(scope, selector).isSome();
  };
  var descendant$2 = function (scope, selector) {
    return $_fhotvakvjf3ft3bm.descendant(scope, selector).isSome();
  };
  var closest$2 = function (scope, selector, isRoot) {
    return $_fhotvakvjf3ft3bm.closest(scope, selector, isRoot).isSome();
  };
  var $_7fzvl8oajf3ft41s = {
    any: any,
    ancestor: ancestor$2,
    sibling: sibling$2,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var resizeBarDragging = $_dtzusgmpjf3ft3rg.resolve('resizer-bar-dragging');
  function BarManager (wire, direction, hdirection) {
    var mutation = BarMutation();
    var resizing = $_fmdazonwjf3ft3z7.transform(mutation, {});
    var hoverTable = Option.none();
    var getResizer = function (element, type) {
      return Option.from($_fcjbkgkqjf3ft3af.get(element, type));
    };
    mutation.events.drag.bind(function (event) {
      getResizer(event.target(), 'data-row').each(function (_dataRow) {
        var currentRow = $_e3q4ahn5jf3ft3tj.getInt(event.target(), 'top');
        $_9hbdczkzjf3ft3ci.set(event.target(), 'top', currentRow + event.yDelta() + 'px');
      });
      getResizer(event.target(), 'data-column').each(function (_dataCol) {
        var currentCol = $_e3q4ahn5jf3ft3tj.getInt(event.target(), 'left');
        $_9hbdczkzjf3ft3ci.set(event.target(), 'left', currentCol + event.xDelta() + 'px');
      });
    });
    var getDelta = function (target, direction) {
      var newX = $_e3q4ahn5jf3ft3tj.getInt(target, direction);
      var oldX = parseInt($_fcjbkgkqjf3ft3af.get(target, 'data-initial-' + direction), 10);
      return newX - oldX;
    };
    resizing.events.stop.bind(function () {
      mutation.get().each(function (target) {
        hoverTable.each(function (table) {
          getResizer(target, 'data-row').each(function (row) {
            var delta = getDelta(target, 'top');
            $_fcjbkgkqjf3ft3af.remove(target, 'data-initial-top');
            events.trigger.adjustHeight(table, delta, parseInt(row, 10));
          });
          getResizer(target, 'data-column').each(function (column) {
            var delta = getDelta(target, 'left');
            $_fcjbkgkqjf3ft3af.remove(target, 'data-initial-left');
            events.trigger.adjustWidth(table, delta, parseInt(column, 10));
          });
          $_ez437umljf3ft3q1.refresh(wire, table, hdirection, direction);
        });
      });
    });
    var handler = function (target, direction) {
      events.trigger.startAdjust();
      mutation.assign(target);
      $_fcjbkgkqjf3ft3af.set(target, 'data-initial-' + direction, parseInt($_9hbdczkzjf3ft3ci.get(target, direction), 10));
      $_8ycds3mrjf3ft3rl.add(target, resizeBarDragging);
      $_9hbdczkzjf3ft3ci.set(target, 'opacity', '0.2');
      resizing.go(wire.parent());
    };
    var mousedown = $_afgbc4o1jf3ft407.bind(wire.parent(), 'mousedown', function (event) {
      if ($_ez437umljf3ft3q1.isRowBar(event.target()))
        handler(event.target(), 'top');
      if ($_ez437umljf3ft3q1.isColBar(event.target()))
        handler(event.target(), 'left');
    });
    var isRoot = function (e) {
      return $_avffyek9jf3ft38l.eq(e, wire.view());
    };
    var mouseover = $_afgbc4o1jf3ft407.bind(wire.view(), 'mouseover', function (event) {
      if ($_3seq30krjf3ft3as.name(event.target()) === 'table' || $_7fzvl8oajf3ft41s.closest(event.target(), 'table', isRoot)) {
        hoverTable = $_3seq30krjf3ft3as.name(event.target()) === 'table' ? Option.some(event.target()) : $_fhotvakvjf3ft3bm.ancestor(event.target(), 'table', isRoot);
        hoverTable.each(function (ht) {
          $_ez437umljf3ft3q1.refresh(wire, ht, hdirection, direction);
        });
      } else if ($_5ev9q6kujf3ft3b4.inBody(event.target())) {
        $_ez437umljf3ft3q1.destroy(wire);
      }
    });
    var destroy = function () {
      mousedown.unbind();
      mouseover.unbind();
      resizing.destroy();
      $_ez437umljf3ft3q1.destroy(wire);
    };
    var refresh = function (tbl) {
      $_ez437umljf3ft3q1.refresh(wire, tbl, hdirection, direction);
    };
    var events = $_81kkbwnujf3ft3y8.create({
      adjustHeight: Event([
        'table',
        'delta',
        'row'
      ]),
      adjustWidth: Event([
        'table',
        'delta',
        'column'
      ]),
      startAdjust: Event([])
    });
    return {
      destroy: destroy,
      refresh: refresh,
      on: resizing.on,
      off: resizing.off,
      hideBars: $_6np0wpjsjf3ft34s.curry($_ez437umljf3ft3q1.hide, wire),
      showBars: $_6np0wpjsjf3ft34s.curry($_ez437umljf3ft3q1.show, wire),
      events: events.registry
    };
  }

  function TableResize (wire, vdirection) {
    var hdirection = $_63tlbdm2jf3ft3kw.height;
    var manager = BarManager(wire, vdirection, hdirection);
    var events = $_81kkbwnujf3ft3y8.create({
      beforeResize: Event(['table']),
      afterResize: Event(['table']),
      startDrag: Event([])
    });
    manager.events.adjustHeight.bind(function (event) {
      events.trigger.beforeResize(event.table());
      var delta = hdirection.delta(event.delta(), event.table());
      $_epa0djn1jf3ft3t0.adjustHeight(event.table(), delta, event.row(), hdirection);
      events.trigger.afterResize(event.table());
    });
    manager.events.startAdjust.bind(function (event) {
      events.trigger.startDrag();
    });
    manager.events.adjustWidth.bind(function (event) {
      events.trigger.beforeResize(event.table());
      var delta = vdirection.delta(event.delta(), event.table());
      $_epa0djn1jf3ft3t0.adjustWidth(event.table(), delta, event.column(), vdirection);
      events.trigger.afterResize(event.table());
    });
    return {
      on: manager.on,
      off: manager.off,
      hideBars: manager.hideBars,
      showBars: manager.showBars,
      destroy: manager.destroy,
      events: events.registry
    };
  }

  var createContainer = function () {
    var container = $_cjzqfhk5jf3ft37x.fromTag('div');
    $_9hbdczkzjf3ft3ci.setAll(container, {
      position: 'static',
      height: '0',
      width: '0',
      padding: '0',
      margin: '0',
      border: '0'
    });
    $_au51ntl1jf3ft3d0.append($_5ev9q6kujf3ft3b4.body(), container);
    return container;
  };
  var get$8 = function (editor, container) {
    return editor.inline ? $_e42itcnrjf3ft3xa.body($_bteipcn8jf3ft3u3.getBody(editor), createContainer()) : $_e42itcnrjf3ft3xa.only($_cjzqfhk5jf3ft37x.fromDom(editor.getDoc()));
  };
  var remove$6 = function (editor, wire) {
    if (editor.inline) {
      $_1fts8il2jf3ft3d3.remove(wire.parent());
    }
  };
  var $_d6s762objf3ft41v = {
    get: get$8,
    remove: remove$6
  };

  function ResizeHandler (editor) {
    var selectionRng = Option.none();
    var resize = Option.none();
    var wire = Option.none();
    var percentageBasedSizeRegex = /(\d+(\.\d+)?)%/;
    var startW, startRawW;
    var isTable = function (elm) {
      return elm.nodeName === 'TABLE';
    };
    var getRawWidth = function (elm) {
      return editor.dom.getStyle(elm, 'width') || editor.dom.getAttrib(elm, 'width');
    };
    var lazyResize = function () {
      return resize;
    };
    var lazyWire = function () {
      return wire.getOr($_e42itcnrjf3ft3xa.only($_cjzqfhk5jf3ft37x.fromDom(editor.getBody())));
    };
    var destroy = function () {
      resize.each(function (sz) {
        sz.destroy();
      });
      wire.each(function (w) {
        $_d6s762objf3ft41v.remove(editor, w);
      });
    };
    editor.on('init', function () {
      var direction = TableDirection($_1421mdn9jf3ft3u7.directionAt);
      var rawWire = $_d6s762objf3ft41v.get(editor);
      wire = Option.some(rawWire);
      if (hasObjectResizing(editor) && hasTableResizeBars(editor)) {
        var sz = TableResize(rawWire, direction);
        sz.on();
        sz.events.startDrag.bind(function (event) {
          selectionRng = Option.some(editor.selection.getRng());
        });
        sz.events.afterResize.bind(function (event) {
          var table = event.table();
          var dataStyleCells = $_6pynzqksjf3ft3aw.descendants(table, 'td[data-mce-style],th[data-mce-style]');
          $_5qd2tsjqjf3ft34c.each(dataStyleCells, function (cell) {
            $_fcjbkgkqjf3ft3af.remove(cell, 'data-mce-style');
          });
          selectionRng.each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
          });
          editor.undoManager.add();
        });
        resize = Option.some(sz);
      }
    });
    editor.on('ObjectResizeStart', function (e) {
      if (isTable(e.target)) {
        startW = e.width;
        startRawW = getRawWidth(e.target);
      }
    });
    editor.on('ObjectResized', function (e) {
      if (isTable(e.target)) {
        var table = e.target;
        if (percentageBasedSizeRegex.test(startRawW)) {
          var percentW = parseFloat(percentageBasedSizeRegex.exec(startRawW)[1]);
          var targetPercentW = e.width * percentW / startW;
          editor.dom.setStyle(table, 'width', targetPercentW + '%');
        } else {
          var newCellSizes_1 = [];
          Tools.each(table.rows, function (row) {
            Tools.each(row.cells, function (cell) {
              var width = editor.dom.getStyle(cell, 'width', true);
              newCellSizes_1.push({
                cell: cell,
                width: width
              });
            });
          });
          Tools.each(newCellSizes_1, function (newCellSize) {
            editor.dom.setStyle(newCellSize.cell, 'width', newCellSize.width);
            editor.dom.setAttrib(newCellSize.cell, 'width', null);
          });
        }
      }
    });
    return {
      lazyResize: lazyResize,
      lazyWire: lazyWire,
      destroy: destroy
    };
  }

  var none$2 = function (current) {
    return folder$1(function (n, f, m, l) {
      return n(current);
    });
  };
  var first$5 = function (current) {
    return folder$1(function (n, f, m, l) {
      return f(current);
    });
  };
  var middle$1 = function (current, target) {
    return folder$1(function (n, f, m, l) {
      return m(current, target);
    });
  };
  var last$4 = function (current) {
    return folder$1(function (n, f, m, l) {
      return l(current);
    });
  };
  var folder$1 = function (fold) {
    return { fold: fold };
  };
  var $_em6d63oejf3ft42w = {
    none: none$2,
    first: first$5,
    middle: middle$1,
    last: last$4
  };

  var detect$4 = function (current, isRoot) {
    return $_3oodk9k2jf3ft36l.table(current, isRoot).bind(function (table) {
      var all = $_3oodk9k2jf3ft36l.cells(table);
      var index = $_5qd2tsjqjf3ft34c.findIndex(all, function (x) {
        return $_avffyek9jf3ft38l.eq(current, x);
      });
      return index.map(function (ind) {
        return {
          index: $_6np0wpjsjf3ft34s.constant(ind),
          all: $_6np0wpjsjf3ft34s.constant(all)
        };
      });
    });
  };
  var next = function (current, isRoot) {
    var detection = detect$4(current, isRoot);
    return detection.fold(function () {
      return $_em6d63oejf3ft42w.none(current);
    }, function (info) {
      return info.index() + 1 < info.all().length ? $_em6d63oejf3ft42w.middle(current, info.all()[info.index() + 1]) : $_em6d63oejf3ft42w.last(current);
    });
  };
  var prev = function (current, isRoot) {
    var detection = detect$4(current, isRoot);
    return detection.fold(function () {
      return $_em6d63oejf3ft42w.none();
    }, function (info) {
      return info.index() - 1 >= 0 ? $_em6d63oejf3ft42w.middle(current, info.all()[info.index() - 1]) : $_em6d63oejf3ft42w.first(current);
    });
  };
  var $_561qi4odjf3ft42p = {
    next: next,
    prev: prev
  };

  var adt = $_7whrpglsjf3ft3it.generate([
    { 'before': ['element'] },
    {
      'on': [
        'element',
        'offset'
      ]
    },
    { after: ['element'] }
  ]);
  var cata$1 = function (subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart = function (situ) {
    return situ.fold($_6np0wpjsjf3ft34s.identity, $_6np0wpjsjf3ft34s.identity, $_6np0wpjsjf3ft34s.identity);
  };
  var $_5o03fuogjf3ft434 = {
    before: adt.before,
    on: adt.on,
    after: adt.after,
    cata: cata$1,
    getStart: getStart
  };

  var type$2 = $_7whrpglsjf3ft3it.generate([
    { domRange: ['rng'] },
    {
      relative: [
        'startSitu',
        'finishSitu'
      ]
    },
    {
      exact: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var range$2 = $_4bo75gjvjf3ft35r.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$2.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart$1 = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_cjzqfhk5jf3ft37x.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_5o03fuogjf3ft434.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart$1(selection);
    return $_a4gvewk7jf3ft384.defaultView(start);
  };
  var $_3781muofjf3ft42z = {
    domRange: type$2.domRange,
    relative: type$2.relative,
    exact: type$2.exact,
    exactFromRange: exactFromRange,
    range: range$2,
    getWin: getWin
  };

  var makeRange = function (start, soffset, finish, foffset) {
    var doc = $_a4gvewk7jf3ft384.owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var commonAncestorContainer = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    return $_cjzqfhk5jf3ft37x.fromDom(r.commonAncestorContainer);
  };
  var after$2 = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = $_avffyek9jf3ft38l.eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };
  var $_43rib6oijf3ft43g = {
    after: after$2,
    commonAncestorContainer: commonAncestorContainer
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_5qd2tsjqjf3ft34c.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_cjzqfhk5jf3ft37x.fromDom(fragment);
  };
  var $_cduy7uojjf3ft43j = { fromElements: fromElements };

  var selectNodeContents = function (win, element) {
    var rng = win.document.createRange();
    selectNodeContentsUsing(rng, element);
    return rng;
  };
  var selectNodeContentsUsing = function (rng, element) {
    rng.selectNodeContents(element.dom());
  };
  var isWithin$1 = function (outerRange, innerRange) {
    return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 && innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
  };
  var create$1 = function (win) {
    return win.document.createRange();
  };
  var setStart = function (rng, situ) {
    situ.fold(function (e) {
      rng.setStartBefore(e.dom());
    }, function (e, o) {
      rng.setStart(e.dom(), o);
    }, function (e) {
      rng.setStartAfter(e.dom());
    });
  };
  var setFinish = function (rng, situ) {
    situ.fold(function (e) {
      rng.setEndBefore(e.dom());
    }, function (e, o) {
      rng.setEnd(e.dom(), o);
    }, function (e) {
      rng.setEndAfter(e.dom());
    });
  };
  var replaceWith = function (rng, fragment) {
    deleteContents(rng);
    rng.insertNode(fragment.dom());
  };
  var relativeToNative = function (win, startSitu, finishSitu) {
    var range = win.document.createRange();
    setStart(range, startSitu);
    setFinish(range, finishSitu);
    return range;
  };
  var exactToNative = function (win, start, soffset, finish, foffset) {
    var rng = win.document.createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var deleteContents = function (rng) {
    rng.deleteContents();
  };
  var cloneFragment = function (rng) {
    var fragment = rng.cloneContents();
    return $_cjzqfhk5jf3ft37x.fromDom(fragment);
  };
  var toRect = function (rect) {
    return {
      left: $_6np0wpjsjf3ft34s.constant(rect.left),
      top: $_6np0wpjsjf3ft34s.constant(rect.top),
      right: $_6np0wpjsjf3ft34s.constant(rect.right),
      bottom: $_6np0wpjsjf3ft34s.constant(rect.bottom),
      width: $_6np0wpjsjf3ft34s.constant(rect.width),
      height: $_6np0wpjsjf3ft34s.constant(rect.height)
    };
  };
  var getFirstRect = function (rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect) : Option.none();
  };
  var getBounds$1 = function (rng) {
    var rect = rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect) : Option.none();
  };
  var toString = function (rng) {
    return rng.toString();
  };
  var $_cjvuexokjf3ft43p = {
    create: create$1,
    replaceWith: replaceWith,
    selectNodeContents: selectNodeContents,
    selectNodeContentsUsing: selectNodeContentsUsing,
    relativeToNative: relativeToNative,
    exactToNative: exactToNative,
    deleteContents: deleteContents,
    cloneFragment: cloneFragment,
    getFirstRect: getFirstRect,
    getBounds: getBounds$1,
    isWithin: isWithin$1,
    toString: toString
  };

  var adt$1 = $_7whrpglsjf3ft3it.generate([
    {
      ltr: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    },
    {
      rtl: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var fromRange = function (win, type, range) {
    return type($_cjzqfhk5jf3ft37x.fromDom(range.startContainer), range.startOffset, $_cjzqfhk5jf3ft37x.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function (win, selection) {
    return selection.match({
      domRange: function (rng) {
        return {
          ltr: $_6np0wpjsjf3ft34s.constant(rng),
          rtl: Option.none
        };
      },
      relative: function (startSitu, finishSitu) {
        return {
          ltr: $_5lrs8rkfjf3ft39a.cached(function () {
            return $_cjvuexokjf3ft43p.relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: $_5lrs8rkfjf3ft39a.cached(function () {
            return Option.some($_cjvuexokjf3ft43p.relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function (start, soffset, finish, foffset) {
        return {
          ltr: $_5lrs8rkfjf3ft39a.cached(function () {
            return $_cjvuexokjf3ft43p.exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: $_5lrs8rkfjf3ft39a.cached(function () {
            return Option.some($_cjvuexokjf3ft43p.exactToNative(win, finish, foffset, start, soffset));
          })
        };
      }
    });
  };
  var doDiagnose = function (win, ranges) {
    var rng = ranges.ltr();
    if (rng.collapsed) {
      var reversed = ranges.rtl().filter(function (rev) {
        return rev.collapsed === false;
      });
      return reversed.map(function (rev) {
        return adt$1.rtl($_cjzqfhk5jf3ft37x.fromDom(rev.endContainer), rev.endOffset, $_cjzqfhk5jf3ft37x.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$1.ltr, rng);
      });
    } else {
      return fromRange(win, adt$1.ltr, rng);
    }
  };
  var diagnose = function (win, selection) {
    var ranges = getRanges(win, selection);
    return doDiagnose(win, ranges);
  };
  var asLtrRange = function (win, selection) {
    var diagnosis = diagnose(win, selection);
    return diagnosis.match({
      ltr: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
      },
      rtl: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(finish.dom(), foffset);
        rng.setEnd(start.dom(), soffset);
        return rng;
      }
    });
  };
  var $_d7mdauoljf3ft440 = {
    ltr: adt$1.ltr,
    rtl: adt$1.rtl,
    diagnose: diagnose,
    asLtrRange: asLtrRange
  };

  var searchForPoint = function (rectForOffset, x, y, maxX, length) {
    if (length === 0)
      return 0;
    else if (x === maxX)
      return length - 1;
    var xDelta = maxX;
    for (var i = 1; i < length; i++) {
      var rect = rectForOffset(i);
      var curDeltaX = Math.abs(x - rect.left);
      if (y > rect.bottom) {
      } else if (y < rect.top || curDeltaX > xDelta) {
        return i - 1;
      } else {
        xDelta = curDeltaX;
      }
    }
    return 0;
  };
  var inRect = function (rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  var $_epmh28oojf3ft44q = {
    inRect: inRect,
    searchForPoint: searchForPoint
  };

  var locateOffset = function (doc, textnode, x, y, rect) {
    var rangeForOffset = function (offset) {
      var r = doc.dom().createRange();
      r.setStart(textnode.dom(), offset);
      r.collapse(true);
      return r;
    };
    var rectForOffset = function (offset) {
      var r = rangeForOffset(offset);
      return r.getBoundingClientRect();
    };
    var length = $_e4e6aul8jf3ft3ek.get(textnode).length;
    var offset = $_epmh28oojf3ft44q.searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = $_2wgl26mgjf3ft3op.findMap(rects, function (rect) {
      return $_epmh28oojf3ft44q.inRect(rect, x, y) ? Option.some(rect) : Option.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };
  var $_35augfopjf3ft44s = { locate: locate };

  var searchInChildren = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = $_a4gvewk7jf3ft384.children(node);
    return $_2wgl26mgjf3ft3op.findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return $_epmh28oojf3ft44q.inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : Option.none();
    });
  };
  var locateNode = function (doc, node, x, y) {
    var locator = $_3seq30krjf3ft3as.isText(node) ? $_35augfopjf3ft44s.locate : searchInChildren;
    return locator(doc, node, x, y);
  };
  var locate$1 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };
  var $_ale3jronjf3ft44j = { locate: locate$1 };

  var COLLAPSE_TO_LEFT = true;
  var COLLAPSE_TO_RIGHT = false;
  var getCollapseDirection = function (rect, x) {
    return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT;
  };
  var createCollapsedNode = function (doc, target, collapseDirection) {
    var r = doc.dom().createRange();
    r.selectNode(target.dom());
    r.collapse(collapseDirection);
    return r;
  };
  var locateInElement = function (doc, node, x) {
    var cursorRange = doc.dom().createRange();
    cursorRange.selectNode(node.dom());
    var rect = cursorRange.getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    var f = collapseDirection === COLLAPSE_TO_LEFT ? $_bksv9ol6jf3ft3e5.first : $_bksv9ol6jf3ft3e5.last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function (doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return Option.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search = function (doc, node, x) {
    var f = $_a4gvewk7jf3ft384.children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };
  var $_ach6q8oqjf3ft44y = { search: search };

  var caretPositionFromPoint = function (doc, x, y) {
    return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null)
        return Option.none();
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return Option.some(r);
    });
  };
  var caretRangeFromPoint = function (doc, x, y) {
    return Option.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return $_ale3jronjf3ft44j.locate(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function (doc, x, y) {
    return $_cjzqfhk5jf3ft37x.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function () {
        return $_ach6q8oqjf3ft44y.search(doc, elem, x);
      };
      return $_a4gvewk7jf3ft384.children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;
  var fromPoint$1 = function (win, x, y) {
    var doc = $_cjzqfhk5jf3ft37x.fromDom(win.document);
    return availableSearch(doc, x, y).map(function (rng) {
      return $_3781muofjf3ft42z.range($_cjzqfhk5jf3ft37x.fromDom(rng.startContainer), rng.startOffset, $_cjzqfhk5jf3ft37x.fromDom(rng.endContainer), rng.endOffset);
    });
  };
  var $_31bjppomjf3ft44d = { fromPoint: fromPoint$1 };

  var withinContainer = function (win, ancestor, outerRange, selector) {
    var innerRange = $_cjvuexokjf3ft43p.create(win);
    var self = $_31lswek4jf3ft37j.is(ancestor, selector) ? [ancestor] : [];
    var elements = self.concat($_6pynzqksjf3ft3aw.descendants(ancestor, selector));
    return $_5qd2tsjqjf3ft34c.filter(elements, function (elem) {
      $_cjvuexokjf3ft43p.selectNodeContentsUsing(innerRange, elem);
      return $_cjvuexokjf3ft43p.isWithin(outerRange, innerRange);
    });
  };
  var find$3 = function (win, selection, selector) {
    var outerRange = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    var ancestor = $_cjzqfhk5jf3ft37x.fromDom(outerRange.commonAncestorContainer);
    return $_3seq30krjf3ft3as.isElement(ancestor) ? withinContainer(win, ancestor, outerRange, selector) : [];
  };
  var $_a6l0lcorjf3ft453 = { find: find$3 };

  var beforeSpecial = function (element, offset) {
    var name = $_3seq30krjf3ft3as.name(element);
    if ('input' === name)
      return $_5o03fuogjf3ft434.after(element);
    else if (!$_5qd2tsjqjf3ft34c.contains([
        'br',
        'img'
      ], name))
      return $_5o03fuogjf3ft434.on(element, offset);
    else
      return offset === 0 ? $_5o03fuogjf3ft434.before(element) : $_5o03fuogjf3ft434.after(element);
  };
  var preprocessRelative = function (startSitu, finishSitu) {
    var start = startSitu.fold($_5o03fuogjf3ft434.before, beforeSpecial, $_5o03fuogjf3ft434.after);
    var finish = finishSitu.fold($_5o03fuogjf3ft434.before, beforeSpecial, $_5o03fuogjf3ft434.after);
    return $_3781muofjf3ft42z.relative(start, finish);
  };
  var preprocessExact = function (start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return $_3781muofjf3ft42z.relative(startSitu, finishSitu);
  };
  var preprocess = function (selection) {
    return selection.match({
      domRange: function (rng) {
        var start = $_cjzqfhk5jf3ft37x.fromDom(rng.startContainer);
        var finish = $_cjzqfhk5jf3ft37x.fromDom(rng.endContainer);
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset);
      },
      relative: preprocessRelative,
      exact: preprocessExact
    });
  };
  var $_22w660osjf3ft458 = {
    beforeSpecial: beforeSpecial,
    preprocess: preprocess,
    preprocessRelative: preprocessRelative,
    preprocessExact: preprocessExact
  };

  var doSetNativeRange = function (win, rng) {
    Option.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function (win, start, soffset, finish, foffset) {
    var rng = $_cjvuexokjf3ft43p.exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var findWithin = function (win, selection, selector) {
    return $_a6l0lcorjf3ft453.find(win, selection, selector);
  };
  var setRangeFromRelative = function (win, relative) {
    return $_d7mdauoljf3ft440.diagnose(win, relative).match({
      ltr: function (start, soffset, finish, foffset) {
        doSetRange(win, start, soffset, finish, foffset);
      },
      rtl: function (start, soffset, finish, foffset) {
        var selection = win.getSelection();
        if (selection.setBaseAndExtent) {
          selection.setBaseAndExtent(start.dom(), soffset, finish.dom(), foffset);
        } else if (selection.extend) {
          selection.collapse(start.dom(), soffset);
          selection.extend(finish.dom(), foffset);
        } else {
          doSetRange(win, finish, foffset, start, soffset);
        }
      }
    });
  };
  var setExact = function (win, start, soffset, finish, foffset) {
    var relative = $_22w660osjf3ft458.preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var setRelative = function (win, startSitu, finishSitu) {
    var relative = $_22w660osjf3ft458.preprocessRelative(startSitu, finishSitu);
    setRangeFromRelative(win, relative);
  };
  var toNative = function (selection) {
    var win = $_3781muofjf3ft42z.getWin(selection).dom();
    var getDomRange = function (start, soffset, finish, foffset) {
      return $_cjvuexokjf3ft43p.exactToNative(win, start, soffset, finish, foffset);
    };
    var filtered = $_22w660osjf3ft458.preprocess(selection);
    return $_d7mdauoljf3ft440.diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    });
  };
  var readRange = function (selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return Option.some($_3781muofjf3ft42z.range($_cjzqfhk5jf3ft37x.fromDom(firstRng.startContainer), firstRng.startOffset, $_cjzqfhk5jf3ft37x.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return Option.none();
    }
  };
  var doGetExact = function (selection) {
    var anchorNode = $_cjzqfhk5jf3ft37x.fromDom(selection.anchorNode);
    var focusNode = $_cjzqfhk5jf3ft37x.fromDom(selection.focusNode);
    return $_43rib6oijf3ft43g.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? Option.some($_3781muofjf3ft42z.range($_cjzqfhk5jf3ft37x.fromDom(selection.anchorNode), selection.anchorOffset, $_cjzqfhk5jf3ft37x.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection);
  };
  var setToElement = function (win, element) {
    var rng = $_cjvuexokjf3ft43p.selectNodeContents(win, element);
    doSetNativeRange(win, rng);
  };
  var forElement = function (win, element) {
    var rng = $_cjvuexokjf3ft43p.selectNodeContents(win, element);
    return $_3781muofjf3ft42z.range($_cjzqfhk5jf3ft37x.fromDom(rng.startContainer), rng.startOffset, $_cjzqfhk5jf3ft37x.fromDom(rng.endContainer), rng.endOffset);
  };
  var getExact = function (win) {
    var selection = win.getSelection();
    return selection.rangeCount > 0 ? doGetExact(selection) : Option.none();
  };
  var get$9 = function (win) {
    return getExact(win).map(function (range) {
      return $_3781muofjf3ft42z.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect$1 = function (win, selection) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    return $_cjvuexokjf3ft43p.getFirstRect(rng);
  };
  var getBounds$2 = function (win, selection) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    return $_cjvuexokjf3ft43p.getBounds(rng);
  };
  var getAtPoint = function (win, x, y) {
    return $_31bjppomjf3ft44d.fromPoint(win, x, y);
  };
  var getAsString = function (win, selection) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    return $_cjvuexokjf3ft43p.toString(rng);
  };
  var clear$1 = function (win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };
  var clone$2 = function (win, selection) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    return $_cjvuexokjf3ft43p.cloneFragment(rng);
  };
  var replace$1 = function (win, selection, elements) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    var fragment = $_cduy7uojjf3ft43j.fromElements(elements, win.document);
    $_cjvuexokjf3ft43p.replaceWith(rng, fragment);
  };
  var deleteAt = function (win, selection) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    $_cjvuexokjf3ft43p.deleteContents(rng);
  };
  var isCollapsed = function (start, soffset, finish, foffset) {
    return $_avffyek9jf3ft38l.eq(start, finish) && soffset === foffset;
  };
  var $_622v73ohjf3ft43b = {
    setExact: setExact,
    getExact: getExact,
    get: get$9,
    setRelative: setRelative,
    toNative: toNative,
    setToElement: setToElement,
    clear: clear$1,
    clone: clone$2,
    replace: replace$1,
    deleteAt: deleteAt,
    forElement: forElement,
    getFirstRect: getFirstRect$1,
    getBounds: getBounds$2,
    getAtPoint: getAtPoint,
    findWithin: findWithin,
    getAsString: getAsString,
    isCollapsed: isCollapsed
  };

  var VK = tinymce.util.Tools.resolve('tinymce.util.VK');

  var forward = function (editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, $_561qi4odjf3ft42p.next(cell), lazyWire);
  };
  var backward = function (editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, $_561qi4odjf3ft42p.prev(cell), lazyWire);
  };
  var getCellFirstCursorPosition = function (editor, cell) {
    var selection = $_3781muofjf3ft42z.exact(cell, 0, cell, 0);
    return $_622v73ohjf3ft43b.toNative(selection);
  };
  var getNewRowCursorPosition = function (editor, table) {
    var rows = $_6pynzqksjf3ft3aw.descendants(table, 'tr');
    return $_5qd2tsjqjf3ft34c.last(rows).bind(function (last) {
      return $_fhotvakvjf3ft3bm.descendant(last, 'td,th').map(function (first) {
        return getCellFirstCursorPosition(editor, first);
      });
    });
  };
  var go = function (editor, isRoot, cell, actions, lazyWire) {
    return cell.fold(Option.none, Option.none, function (current, next) {
      return $_bksv9ol6jf3ft3e5.first(next).map(function (cell) {
        return getCellFirstCursorPosition(editor, cell);
      });
    }, function (current) {
      return $_3oodk9k2jf3ft36l.table(current, isRoot).bind(function (table) {
        var targets = $_ch69x3lbjf3ft3eu.noMenu(current);
        editor.undoManager.transact(function () {
          actions.insertRowsAfter(table, targets);
        });
        return getNewRowCursorPosition(editor, table);
      });
    });
  };
  var rootElements = [
    'table',
    'li',
    'dl'
  ];
  var handle$1 = function (event, editor, actions, lazyWire) {
    if (event.keyCode === VK.TAB) {
      var body_1 = $_bteipcn8jf3ft3u3.getBody(editor);
      var isRoot_1 = function (element) {
        var name = $_3seq30krjf3ft3as.name(element);
        return $_avffyek9jf3ft38l.eq(element, body_1) || $_5qd2tsjqjf3ft34c.contains(rootElements, name);
      };
      var rng = editor.selection.getRng();
      if (rng.collapsed) {
        var start = $_cjzqfhk5jf3ft37x.fromDom(rng.startContainer);
        $_3oodk9k2jf3ft36l.cell(start, isRoot_1).each(function (cell) {
          event.preventDefault();
          var navigation = event.shiftKey ? backward : forward;
          var rng = navigation(editor, isRoot_1, cell, actions, lazyWire);
          rng.each(function (range) {
            editor.selection.setRng(range);
          });
        });
      }
    }
  };
  var $_9the5iocjf3ft429 = { handle: handle$1 };

  var response = $_4bo75gjvjf3ft35r.immutable('selection', 'kill');
  var $_aq55xhowjf3ft46r = { response: response };

  var isKey = function (key) {
    return function (keycode) {
      return keycode === key;
    };
  };
  var isUp = isKey(38);
  var isDown = isKey(40);
  var isNavigation = function (keycode) {
    return keycode >= 37 && keycode <= 40;
  };
  var $_egv1paoxjf3ft46t = {
    ltr: {
      isBackward: isKey(37),
      isForward: isKey(39)
    },
    rtl: {
      isBackward: isKey(39),
      isForward: isKey(37)
    },
    isUp: isUp,
    isDown: isDown,
    isNavigation: isNavigation
  };

  var convertToRange = function (win, selection) {
    var rng = $_d7mdauoljf3ft440.asLtrRange(win, selection);
    return {
      start: $_6np0wpjsjf3ft34s.constant($_cjzqfhk5jf3ft37x.fromDom(rng.startContainer)),
      soffset: $_6np0wpjsjf3ft34s.constant(rng.startOffset),
      finish: $_6np0wpjsjf3ft34s.constant($_cjzqfhk5jf3ft37x.fromDom(rng.endContainer)),
      foffset: $_6np0wpjsjf3ft34s.constant(rng.endOffset)
    };
  };
  var makeSitus = function (start, soffset, finish, foffset) {
    return {
      start: $_6np0wpjsjf3ft34s.constant($_5o03fuogjf3ft434.on(start, soffset)),
      finish: $_6np0wpjsjf3ft34s.constant($_5o03fuogjf3ft434.on(finish, foffset))
    };
  };
  var $_5v16bdozjf3ft47g = {
    convertToRange: convertToRange,
    makeSitus: makeSitus
  };

  var isSafari = $_8vnd6hkejf3ft397.detect().browser.isSafari();
  var get$10 = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var x = doc.body.scrollLeft || doc.documentElement.scrollLeft;
    var y = doc.body.scrollTop || doc.documentElement.scrollTop;
    return r(x, y);
  };
  var to = function (x, y, _doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var win = doc.defaultView;
    win.scrollTo(x, y);
  };
  var by = function (x, y, _doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var win = doc.defaultView;
    win.scrollBy(x, y);
  };
  var setToElement$1 = function (win, element) {
    var pos = $_3hwkw8m3jf3ft3l9.absolute(element);
    var doc = $_cjzqfhk5jf3ft37x.fromDom(win.document);
    to(pos.left(), pos.top(), doc);
  };
  var preserve$1 = function (doc, f) {
    var before = get$10(doc);
    f();
    var after = get$10(doc);
    if (before.top() !== after.top() || before.left() !== after.left()) {
      to(before.left(), before.top(), doc);
    }
  };
  var capture$2 = function (doc) {
    var previous = Option.none();
    var save = function () {
      previous = Option.some(get$10(doc));
    };
    var restore = function () {
      previous.each(function (p) {
        to(p.left(), p.top(), doc);
      });
    };
    save();
    return {
      save: save,
      restore: restore
    };
  };
  var intoView = function (element, alignToTop) {
    if (isSafari && $_424octjzjf3ft364.isFunction(element.dom().scrollIntoViewIfNeeded)) {
      element.dom().scrollIntoViewIfNeeded(false);
    } else {
      element.dom().scrollIntoView(alignToTop);
    }
  };
  var intoViewIfNeeded = function (element, container) {
    var containerBox = container.dom().getBoundingClientRect();
    var elementBox = element.dom().getBoundingClientRect();
    if (elementBox.top < containerBox.top) {
      intoView(element, true);
    } else if (elementBox.bottom > containerBox.bottom) {
      intoView(element, false);
    }
  };
  var scrollBarWidth = function () {
    var scrollDiv = $_cjzqfhk5jf3ft37x.fromHtml('<div style="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;"></div>');
    $_au51ntl1jf3ft3d0.after($_5ev9q6kujf3ft3b4.body(), scrollDiv);
    var w = scrollDiv.dom().offsetWidth - scrollDiv.dom().clientWidth;
    $_1fts8il2jf3ft3d3.remove(scrollDiv);
    return w;
  };
  var $_9y0zx4p0jf3ft47s = {
    get: get$10,
    to: to,
    by: by,
    preserve: preserve$1,
    capture: capture$2,
    intoView: intoView,
    intoViewIfNeeded: intoViewIfNeeded,
    setToElement: setToElement$1,
    scrollBarWidth: scrollBarWidth
  };

  function WindowBridge (win) {
    var elementFromPoint = function (x, y) {
      return Option.from(win.document.elementFromPoint(x, y)).map($_cjzqfhk5jf3ft37x.fromDom);
    };
    var getRect = function (element) {
      return element.dom().getBoundingClientRect();
    };
    var getRangedRect = function (start, soffset, finish, foffset) {
      var sel = $_3781muofjf3ft42z.exact(start, soffset, finish, foffset);
      return $_622v73ohjf3ft43b.getFirstRect(win, sel).map(function (structRect) {
        return $_6j7iurjujf3ft35n.map(structRect, $_6np0wpjsjf3ft34s.apply);
      });
    };
    var getSelection = function () {
      return $_622v73ohjf3ft43b.get(win).map(function (exactAdt) {
        return $_5v16bdozjf3ft47g.convertToRange(win, exactAdt);
      });
    };
    var fromSitus = function (situs) {
      var relative = $_3781muofjf3ft42z.relative(situs.start(), situs.finish());
      return $_5v16bdozjf3ft47g.convertToRange(win, relative);
    };
    var situsFromPoint = function (x, y) {
      return $_622v73ohjf3ft43b.getAtPoint(win, x, y).map(function (exact) {
        return {
          start: $_6np0wpjsjf3ft34s.constant($_5o03fuogjf3ft434.on(exact.start(), exact.soffset())),
          finish: $_6np0wpjsjf3ft34s.constant($_5o03fuogjf3ft434.on(exact.finish(), exact.foffset()))
        };
      });
    };
    var clearSelection = function () {
      $_622v73ohjf3ft43b.clear(win);
    };
    var selectContents = function (element) {
      $_622v73ohjf3ft43b.setToElement(win, element);
    };
    var setSelection = function (sel) {
      $_622v73ohjf3ft43b.setExact(win, sel.start(), sel.soffset(), sel.finish(), sel.foffset());
    };
    var setRelativeSelection = function (start, finish) {
      $_622v73ohjf3ft43b.setRelative(win, start, finish);
    };
    var getInnerHeight = function () {
      return win.innerHeight;
    };
    var getScrollY = function () {
      var pos = $_9y0zx4p0jf3ft47s.get($_cjzqfhk5jf3ft37x.fromDom(win.document));
      return pos.top();
    };
    var scrollBy = function (x, y) {
      $_9y0zx4p0jf3ft47s.by(x, y, $_cjzqfhk5jf3ft37x.fromDom(win.document));
    };
    return {
      elementFromPoint: elementFromPoint,
      getRect: getRect,
      getRangedRect: getRangedRect,
      getSelection: getSelection,
      fromSitus: fromSitus,
      situsFromPoint: situsFromPoint,
      clearSelection: clearSelection,
      setSelection: setSelection,
      setRelativeSelection: setRelativeSelection,
      selectContents: selectContents,
      getInnerHeight: getInnerHeight,
      getScrollY: getScrollY,
      scrollBy: scrollBy
    };
  }

  var sync = function (container, isRoot, start, soffset, finish, foffset, selectRange) {
    if (!($_avffyek9jf3ft38l.eq(start, finish) && soffset === foffset)) {
      return $_fhotvakvjf3ft3bm.closest(start, 'td,th', isRoot).bind(function (s) {
        return $_fhotvakvjf3ft3bm.closest(finish, 'td,th', isRoot).bind(function (f) {
          return detect$5(container, isRoot, s, f, selectRange);
        });
      });
    } else {
      return Option.none();
    }
  };
  var detect$5 = function (container, isRoot, start, finish, selectRange) {
    if (!$_avffyek9jf3ft38l.eq(start, finish)) {
      return $_cabca2lejf3ft3fj.identify(start, finish, isRoot).bind(function (cellSel) {
        var boxes = cellSel.boxes().getOr([]);
        if (boxes.length > 0) {
          selectRange(container, boxes, cellSel.start(), cellSel.finish());
          return Option.some($_aq55xhowjf3ft46r.response(Option.some($_5v16bdozjf3ft47g.makeSitus(start, 0, start, $_eutj08l7jf3ft3e8.getEnd(start))), true));
        } else {
          return Option.none();
        }
      });
    } else {
      return Option.none();
    }
  };
  var update = function (rows, columns, container, selected, annotations) {
    var updateSelection = function (newSels) {
      annotations.clear(container);
      annotations.selectRange(container, newSels.boxes(), newSels.start(), newSels.finish());
      return newSels.boxes();
    };
    return $_cabca2lejf3ft3fj.shiftSelection(selected, rows, columns, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(updateSelection);
  };
  var $_6nq5f0p1jf3ft481 = {
    sync: sync,
    detect: detect$5,
    update: update
  };

  var nu$3 = $_4bo75gjvjf3ft35r.immutableBag([
    'left',
    'top',
    'right',
    'bottom'
  ], []);
  var moveDown = function (caret, amount) {
    return nu$3({
      left: caret.left(),
      top: caret.top() + amount,
      right: caret.right(),
      bottom: caret.bottom() + amount
    });
  };
  var moveUp = function (caret, amount) {
    return nu$3({
      left: caret.left(),
      top: caret.top() - amount,
      right: caret.right(),
      bottom: caret.bottom() - amount
    });
  };
  var moveBottomTo = function (caret, bottom) {
    var height = caret.bottom() - caret.top();
    return nu$3({
      left: caret.left(),
      top: bottom - height,
      right: caret.right(),
      bottom: bottom
    });
  };
  var moveTopTo = function (caret, top) {
    var height = caret.bottom() - caret.top();
    return nu$3({
      left: caret.left(),
      top: top,
      right: caret.right(),
      bottom: top + height
    });
  };
  var translate = function (caret, xDelta, yDelta) {
    return nu$3({
      left: caret.left() + xDelta,
      top: caret.top() + yDelta,
      right: caret.right() + xDelta,
      bottom: caret.bottom() + yDelta
    });
  };
  var getTop$1 = function (caret) {
    return caret.top();
  };
  var getBottom = function (caret) {
    return caret.bottom();
  };
  var toString$1 = function (caret) {
    return '(' + caret.left() + ', ' + caret.top() + ') -> (' + caret.right() + ', ' + caret.bottom() + ')';
  };
  var $_1joimvp4jf3ft49g = {
    nu: nu$3,
    moveUp: moveUp,
    moveDown: moveDown,
    moveBottomTo: moveBottomTo,
    moveTopTo: moveTopTo,
    getTop: getTop$1,
    getBottom: getBottom,
    translate: translate,
    toString: toString$1
  };

  var getPartialBox = function (bridge, element, offset) {
    if (offset >= 0 && offset < $_eutj08l7jf3ft3e8.getEnd(element))
      return bridge.getRangedRect(element, offset, element, offset + 1);
    else if (offset > 0)
      return bridge.getRangedRect(element, offset - 1, element, offset);
    return Option.none();
  };
  var toCaret = function (rect) {
    return $_1joimvp4jf3ft49g.nu({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    });
  };
  var getElemBox = function (bridge, element) {
    return Option.some(bridge.getRect(element));
  };
  var getBoxAt = function (bridge, element, offset) {
    if ($_3seq30krjf3ft3as.isElement(element))
      return getElemBox(bridge, element).map(toCaret);
    else if ($_3seq30krjf3ft3as.isText(element))
      return getPartialBox(bridge, element, offset).map(toCaret);
    else
      return Option.none();
  };
  var getEntireBox = function (bridge, element) {
    if ($_3seq30krjf3ft3as.isElement(element))
      return getElemBox(bridge, element).map(toCaret);
    else if ($_3seq30krjf3ft3as.isText(element))
      return bridge.getRangedRect(element, 0, element, $_eutj08l7jf3ft3e8.getEnd(element)).map(toCaret);
    else
      return Option.none();
  };
  var $_f04qw9p5jf3ft49j = {
    getBoxAt: getBoxAt,
    getEntireBox: getEntireBox
  };

  var traverse = $_4bo75gjvjf3ft35r.immutable('item', 'mode');
  var backtrack = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : sidestep;
    return universe.property().parent(item).map(function (p) {
      return traverse(p, transition);
    });
  };
  var sidestep = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : advance;
    return direction.sibling(universe, item).map(function (p) {
      return traverse(p, transition);
    });
  };
  var advance = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : advance;
    var children = universe.property().children(item);
    var result = direction.first(children);
    return result.map(function (r) {
      return traverse(r, transition);
    });
  };
  var successors = [
    {
      current: backtrack,
      next: sidestep,
      fallback: Option.none()
    },
    {
      current: sidestep,
      next: advance,
      fallback: Option.some(backtrack)
    },
    {
      current: advance,
      next: advance,
      fallback: Option.some(sidestep)
    }
  ];
  var go$1 = function (universe, item, mode, direction, rules) {
    var rules = rules !== undefined ? rules : successors;
    var ruleOpt = $_5qd2tsjqjf3ft34c.find(rules, function (succ) {
      return succ.current === mode;
    });
    return ruleOpt.bind(function (rule) {
      return rule.current(universe, item, direction, rule.next).orThunk(function () {
        return rule.fallback.bind(function (fb) {
          return go$1(universe, item, fb, direction);
        });
      });
    });
  };
  var $_bf27dupajf3ft4aw = {
    backtrack: backtrack,
    sidestep: sidestep,
    advance: advance,
    go: go$1
  };

  var left$1 = function () {
    var sibling = function (universe, item) {
      return universe.query().prevSibling(item);
    };
    var first = function (children) {
      return children.length > 0 ? Option.some(children[children.length - 1]) : Option.none();
    };
    return {
      sibling: sibling,
      first: first
    };
  };
  var right$1 = function () {
    var sibling = function (universe, item) {
      return universe.query().nextSibling(item);
    };
    var first = function (children) {
      return children.length > 0 ? Option.some(children[0]) : Option.none();
    };
    return {
      sibling: sibling,
      first: first
    };
  };
  var $_1oq7pnpbjf3ft4b4 = {
    left: left$1,
    right: right$1
  };

  var hone = function (universe, item, predicate, mode, direction, isRoot) {
    var next = $_bf27dupajf3ft4aw.go(universe, item, mode, direction);
    return next.bind(function (n) {
      if (isRoot(n.item()))
        return Option.none();
      else
        return predicate(n.item()) ? Option.some(n.item()) : hone(universe, n.item(), predicate, n.mode(), direction, isRoot);
    });
  };
  var left$2 = function (universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, $_bf27dupajf3ft4aw.sidestep, $_1oq7pnpbjf3ft4b4.left(), isRoot);
  };
  var right$2 = function (universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, $_bf27dupajf3ft4aw.sidestep, $_1oq7pnpbjf3ft4b4.right(), isRoot);
  };
  var $_anwiuqp9jf3ft4at = {
    left: left$2,
    right: right$2
  };

  var isLeaf = function (universe, element) {
    return universe.property().children(element).length === 0;
  };
  var before$2 = function (universe, item, isRoot) {
    return seekLeft(universe, item, $_6np0wpjsjf3ft34s.curry(isLeaf, universe), isRoot);
  };
  var after$3 = function (universe, item, isRoot) {
    return seekRight(universe, item, $_6np0wpjsjf3ft34s.curry(isLeaf, universe), isRoot);
  };
  var seekLeft = function (universe, item, predicate, isRoot) {
    return $_anwiuqp9jf3ft4at.left(universe, item, predicate, isRoot);
  };
  var seekRight = function (universe, item, predicate, isRoot) {
    return $_anwiuqp9jf3ft4at.right(universe, item, predicate, isRoot);
  };
  var walkers = function () {
    return {
      left: $_1oq7pnpbjf3ft4b4.left,
      right: $_1oq7pnpbjf3ft4b4.right
    };
  };
  var walk = function (universe, item, mode, direction, _rules) {
    return $_bf27dupajf3ft4aw.go(universe, item, mode, direction, _rules);
  };
  var $_el8xcxp8jf3ft4ap = {
    before: before$2,
    after: after$3,
    seekLeft: seekLeft,
    seekRight: seekRight,
    walkers: walkers,
    walk: walk,
    backtrack: $_bf27dupajf3ft4aw.backtrack,
    sidestep: $_bf27dupajf3ft4aw.sidestep,
    advance: $_bf27dupajf3ft4aw.advance
  };

  var universe$2 = DomUniverse();
  var gather = function (element, prune, transform) {
    return $_el8xcxp8jf3ft4ap.gather(universe$2, element, prune, transform);
  };
  var before$3 = function (element, isRoot) {
    return $_el8xcxp8jf3ft4ap.before(universe$2, element, isRoot);
  };
  var after$4 = function (element, isRoot) {
    return $_el8xcxp8jf3ft4ap.after(universe$2, element, isRoot);
  };
  var seekLeft$1 = function (element, predicate, isRoot) {
    return $_el8xcxp8jf3ft4ap.seekLeft(universe$2, element, predicate, isRoot);
  };
  var seekRight$1 = function (element, predicate, isRoot) {
    return $_el8xcxp8jf3ft4ap.seekRight(universe$2, element, predicate, isRoot);
  };
  var walkers$1 = function () {
    return $_el8xcxp8jf3ft4ap.walkers();
  };
  var walk$1 = function (item, mode, direction, _rules) {
    return $_el8xcxp8jf3ft4ap.walk(universe$2, item, mode, direction, _rules);
  };
  var $_ei0kyrp7jf3ft4am = {
    gather: gather,
    before: before$3,
    after: after$4,
    seekLeft: seekLeft$1,
    seekRight: seekRight$1,
    walkers: walkers$1,
    walk: walk$1
  };

  var JUMP_SIZE = 5;
  var NUM_RETRIES = 100;
  var adt$2 = $_7whrpglsjf3ft3it.generate([
    { 'none': [] },
    { 'retry': ['caret'] }
  ]);
  var isOutside = function (caret, box) {
    return caret.left() < box.left() || Math.abs(box.right() - caret.left()) < 1 || caret.left() > box.right();
  };
  var inOutsideBlock = function (bridge, element, caret) {
    return $_4np8xgkwjf3ft3bp.closest(element, $_5n8omdmcjf3ft3nq.isBlock).fold($_6np0wpjsjf3ft34s.constant(false), function (cell) {
      return $_f04qw9p5jf3ft49j.getEntireBox(bridge, cell).exists(function (box) {
        return isOutside(caret, box);
      });
    });
  };
  var adjustDown = function (bridge, element, guessBox, original, caret) {
    var lowerCaret = $_1joimvp4jf3ft49g.moveDown(caret, JUMP_SIZE);
    if (Math.abs(guessBox.bottom() - original.bottom()) < 1)
      return adt$2.retry(lowerCaret);
    else if (guessBox.top() > caret.bottom())
      return adt$2.retry(lowerCaret);
    else if (guessBox.top() === caret.bottom())
      return adt$2.retry($_1joimvp4jf3ft49g.moveDown(caret, 1));
    else
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry($_1joimvp4jf3ft49g.translate(lowerCaret, JUMP_SIZE, 0)) : adt$2.none();
  };
  var adjustUp = function (bridge, element, guessBox, original, caret) {
    var higherCaret = $_1joimvp4jf3ft49g.moveUp(caret, JUMP_SIZE);
    if (Math.abs(guessBox.top() - original.top()) < 1)
      return adt$2.retry(higherCaret);
    else if (guessBox.bottom() < caret.top())
      return adt$2.retry(higherCaret);
    else if (guessBox.bottom() === caret.top())
      return adt$2.retry($_1joimvp4jf3ft49g.moveUp(caret, 1));
    else
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry($_1joimvp4jf3ft49g.translate(higherCaret, JUMP_SIZE, 0)) : adt$2.none();
  };
  var upMovement = {
    point: $_1joimvp4jf3ft49g.getTop,
    adjuster: adjustUp,
    move: $_1joimvp4jf3ft49g.moveUp,
    gather: $_ei0kyrp7jf3ft4am.before
  };
  var downMovement = {
    point: $_1joimvp4jf3ft49g.getBottom,
    adjuster: adjustDown,
    move: $_1joimvp4jf3ft49g.moveDown,
    gather: $_ei0kyrp7jf3ft4am.after
  };
  var isAtTable = function (bridge, x, y) {
    return bridge.elementFromPoint(x, y).filter(function (elm) {
      return $_3seq30krjf3ft3as.name(elm) === 'table';
    }).isSome();
  };
  var adjustForTable = function (bridge, movement, original, caret, numRetries) {
    return adjustTil(bridge, movement, original, movement.move(caret, JUMP_SIZE), numRetries);
  };
  var adjustTil = function (bridge, movement, original, caret, numRetries) {
    if (numRetries === 0)
      return Option.some(caret);
    if (isAtTable(bridge, caret.left(), movement.point(caret)))
      return adjustForTable(bridge, movement, original, caret, numRetries - 1);
    return bridge.situsFromPoint(caret.left(), movement.point(caret)).bind(function (guess) {
      return guess.start().fold(Option.none, function (element, offset) {
        return $_f04qw9p5jf3ft49j.getEntireBox(bridge, element, offset).bind(function (guessBox) {
          return movement.adjuster(bridge, element, guessBox, original, caret).fold(Option.none, function (newCaret) {
            return adjustTil(bridge, movement, original, newCaret, numRetries - 1);
          });
        }).orThunk(function () {
          return Option.some(caret);
        });
      }, Option.none);
    });
  };
  var ieTryDown = function (bridge, caret) {
    return bridge.situsFromPoint(caret.left(), caret.bottom() + JUMP_SIZE);
  };
  var ieTryUp = function (bridge, caret) {
    return bridge.situsFromPoint(caret.left(), caret.top() - JUMP_SIZE);
  };
  var checkScroll = function (movement, adjusted, bridge) {
    if (movement.point(adjusted) > bridge.getInnerHeight())
      return Option.some(movement.point(adjusted) - bridge.getInnerHeight());
    else if (movement.point(adjusted) < 0)
      return Option.some(-movement.point(adjusted));
    else
      return Option.none();
  };
  var retry = function (movement, bridge, caret) {
    var moved = movement.move(caret, JUMP_SIZE);
    var adjusted = adjustTil(bridge, movement, caret, moved, NUM_RETRIES).getOr(moved);
    return checkScroll(movement, adjusted, bridge).fold(function () {
      return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted));
    }, function (delta) {
      bridge.scrollBy(0, delta);
      return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted) - delta);
    });
  };
  var $_fao0p3p6jf3ft4a0 = {
    tryUp: $_6np0wpjsjf3ft34s.curry(retry, upMovement),
    tryDown: $_6np0wpjsjf3ft34s.curry(retry, downMovement),
    ieTryUp: ieTryUp,
    ieTryDown: ieTryDown,
    getJumpSize: $_6np0wpjsjf3ft34s.constant(JUMP_SIZE)
  };

  var adt$3 = $_7whrpglsjf3ft3it.generate([
    { 'none': ['message'] },
    { 'success': [] },
    { 'failedUp': ['cell'] },
    { 'failedDown': ['cell'] }
  ]);
  var isOverlapping = function (bridge, before, after) {
    var beforeBounds = bridge.getRect(before);
    var afterBounds = bridge.getRect(after);
    return afterBounds.right > beforeBounds.left && afterBounds.left < beforeBounds.right;
  };
  var verify = function (bridge, before, beforeOffset, after, afterOffset, failure, isRoot) {
    return $_fhotvakvjf3ft3bm.closest(after, 'td,th', isRoot).bind(function (afterCell) {
      return $_fhotvakvjf3ft3bm.closest(before, 'td,th', isRoot).map(function (beforeCell) {
        if (!$_avffyek9jf3ft38l.eq(afterCell, beforeCell)) {
          return $_a92wgplfjf3ft3g5.sharedOne(isRow, [
            afterCell,
            beforeCell
          ]).fold(function () {
            return isOverlapping(bridge, beforeCell, afterCell) ? adt$3.success() : failure(beforeCell);
          }, function (sharedRow) {
            return failure(beforeCell);
          });
        } else {
          return $_avffyek9jf3ft38l.eq(after, afterCell) && $_eutj08l7jf3ft3e8.getEnd(afterCell) === afterOffset ? failure(beforeCell) : adt$3.none('in same cell');
        }
      });
    }).getOr(adt$3.none('default'));
  };
  var isRow = function (elem) {
    return $_fhotvakvjf3ft3bm.closest(elem, 'tr');
  };
  var cata$2 = function (subject, onNone, onSuccess, onFailedUp, onFailedDown) {
    return subject.fold(onNone, onSuccess, onFailedUp, onFailedDown);
  };
  var $_5ynl4mpcjf3ft4b9 = {
    verify: verify,
    cata: cata$2,
    adt: adt$3
  };

  var point = $_4bo75gjvjf3ft35r.immutable('element', 'offset');
  var delta = $_4bo75gjvjf3ft35r.immutable('element', 'deltaOffset');
  var range$3 = $_4bo75gjvjf3ft35r.immutable('element', 'start', 'finish');
  var points = $_4bo75gjvjf3ft35r.immutable('begin', 'end');
  var text = $_4bo75gjvjf3ft35r.immutable('element', 'text');
  var $_2eiqi6pejf3ft4c9 = {
    point: point,
    delta: delta,
    range: range$3,
    points: points,
    text: text
  };

  var inAncestor = $_4bo75gjvjf3ft35r.immutable('ancestor', 'descendants', 'element', 'index');
  var inParent = $_4bo75gjvjf3ft35r.immutable('parent', 'children', 'element', 'index');
  var childOf = function (element, ancestor) {
    return $_4np8xgkwjf3ft3bp.closest(element, function (elem) {
      return $_a4gvewk7jf3ft384.parent(elem).exists(function (parent) {
        return $_avffyek9jf3ft38l.eq(parent, ancestor);
      });
    });
  };
  var indexInParent = function (element) {
    return $_a4gvewk7jf3ft384.parent(element).bind(function (parent) {
      var children = $_a4gvewk7jf3ft384.children(parent);
      return indexOf$1(children, element).map(function (index) {
        return inParent(parent, children, element, index);
      });
    });
  };
  var indexOf$1 = function (elements, element) {
    return $_5qd2tsjqjf3ft34c.findIndex(elements, $_6np0wpjsjf3ft34s.curry($_avffyek9jf3ft38l.eq, element));
  };
  var selectorsInParent = function (element, selector) {
    return $_a4gvewk7jf3ft384.parent(element).bind(function (parent) {
      var children = $_6pynzqksjf3ft3aw.children(parent, selector);
      return indexOf$1(children, element).map(function (index) {
        return inParent(parent, children, element, index);
      });
    });
  };
  var descendantsInAncestor = function (element, ancestorSelector, descendantSelector) {
    return $_fhotvakvjf3ft3bm.closest(element, ancestorSelector).bind(function (ancestor) {
      var descendants = $_6pynzqksjf3ft3aw.descendants(ancestor, descendantSelector);
      return indexOf$1(descendants, element).map(function (index) {
        return inAncestor(ancestor, descendants, element, index);
      });
    });
  };
  var $_fzf7w9pfjf3ft4ce = {
    childOf: childOf,
    indexOf: indexOf$1,
    indexInParent: indexInParent,
    selectorsInParent: selectorsInParent,
    descendantsInAncestor: descendantsInAncestor
  };

  var isBr = function (elem) {
    return $_3seq30krjf3ft3as.name(elem) === 'br';
  };
  var gatherer = function (cand, gather, isRoot) {
    return gather(cand, isRoot).bind(function (target) {
      return $_3seq30krjf3ft3as.isText(target) && $_e4e6aul8jf3ft3ek.get(target).trim().length === 0 ? gatherer(target, gather, isRoot) : Option.some(target);
    });
  };
  var handleBr = function (isRoot, element, direction) {
    return direction.traverse(element).orThunk(function () {
      return gatherer(element, direction.gather, isRoot);
    }).map(direction.relative);
  };
  var findBr = function (element, offset) {
    return $_a4gvewk7jf3ft384.child(element, offset).filter(isBr).orThunk(function () {
      return $_a4gvewk7jf3ft384.child(element, offset - 1).filter(isBr);
    });
  };
  var handleParent = function (isRoot, element, offset, direction) {
    return findBr(element, offset).bind(function (br) {
      return direction.traverse(br).fold(function () {
        return gatherer(br, direction.gather, isRoot).map(direction.relative);
      }, function (adjacent) {
        return $_fzf7w9pfjf3ft4ce.indexInParent(adjacent).map(function (info) {
          return $_5o03fuogjf3ft434.on(info.parent(), info.index());
        });
      });
    });
  };
  var tryBr = function (isRoot, element, offset, direction) {
    var target = isBr(element) ? handleBr(isRoot, element, direction) : handleParent(isRoot, element, offset, direction);
    return target.map(function (tgt) {
      return {
        start: $_6np0wpjsjf3ft34s.constant(tgt),
        finish: $_6np0wpjsjf3ft34s.constant(tgt)
      };
    });
  };
  var process = function (analysis) {
    return $_5ynl4mpcjf3ft4b9.cata(analysis, function (message) {
      return Option.none();
    }, function () {
      return Option.none();
    }, function (cell) {
      return Option.some($_2eiqi6pejf3ft4c9.point(cell, 0));
    }, function (cell) {
      return Option.some($_2eiqi6pejf3ft4c9.point(cell, $_eutj08l7jf3ft3e8.getEnd(cell)));
    });
  };
  var $_c3303lpdjf3ft4bo = {
    tryBr: tryBr,
    process: process
  };

  var MAX_RETRIES = 20;
  var platform$1 = $_8vnd6hkejf3ft397.detect();
  var findSpot = function (bridge, isRoot, direction) {
    return bridge.getSelection().bind(function (sel) {
      return $_c3303lpdjf3ft4bo.tryBr(isRoot, sel.finish(), sel.foffset(), direction).fold(function () {
        return Option.some($_2eiqi6pejf3ft4c9.point(sel.finish(), sel.foffset()));
      }, function (brNeighbour) {
        var range = bridge.fromSitus(brNeighbour);
        var analysis = $_5ynl4mpcjf3ft4b9.verify(bridge, sel.finish(), sel.foffset(), range.finish(), range.foffset(), direction.failure, isRoot);
        return $_c3303lpdjf3ft4bo.process(analysis);
      });
    });
  };
  var scan = function (bridge, isRoot, element, offset, direction, numRetries) {
    if (numRetries === 0)
      return Option.none();
    return tryCursor(bridge, isRoot, element, offset, direction).bind(function (situs) {
      var range = bridge.fromSitus(situs);
      var analysis = $_5ynl4mpcjf3ft4b9.verify(bridge, element, offset, range.finish(), range.foffset(), direction.failure, isRoot);
      return $_5ynl4mpcjf3ft4b9.cata(analysis, function () {
        return Option.none();
      }, function () {
        return Option.some(situs);
      }, function (cell) {
        if ($_avffyek9jf3ft38l.eq(element, cell) && offset === 0)
          return tryAgain(bridge, element, offset, $_1joimvp4jf3ft49g.moveUp, direction);
        else
          return scan(bridge, isRoot, cell, 0, direction, numRetries - 1);
      }, function (cell) {
        if ($_avffyek9jf3ft38l.eq(element, cell) && offset === $_eutj08l7jf3ft3e8.getEnd(cell))
          return tryAgain(bridge, element, offset, $_1joimvp4jf3ft49g.moveDown, direction);
        else
          return scan(bridge, isRoot, cell, $_eutj08l7jf3ft3e8.getEnd(cell), direction, numRetries - 1);
      });
    });
  };
  var tryAgain = function (bridge, element, offset, move, direction) {
    return $_f04qw9p5jf3ft49j.getBoxAt(bridge, element, offset).bind(function (box) {
      return tryAt(bridge, direction, move(box, $_fao0p3p6jf3ft4a0.getJumpSize()));
    });
  };
  var tryAt = function (bridge, direction, box) {
    if (platform$1.browser.isChrome() || platform$1.browser.isSafari() || platform$1.browser.isFirefox() || platform$1.browser.isEdge())
      return direction.otherRetry(bridge, box);
    else if (platform$1.browser.isIE())
      return direction.ieRetry(bridge, box);
    else
      return Option.none();
  };
  var tryCursor = function (bridge, isRoot, element, offset, direction) {
    return $_f04qw9p5jf3ft49j.getBoxAt(bridge, element, offset).bind(function (box) {
      return tryAt(bridge, direction, box);
    });
  };
  var handle$2 = function (bridge, isRoot, direction) {
    return findSpot(bridge, isRoot, direction).bind(function (spot) {
      return scan(bridge, isRoot, spot.element(), spot.offset(), direction, MAX_RETRIES).map(bridge.fromSitus);
    });
  };
  var $_asrnd3p3jf3ft496 = { handle: handle$2 };

  var any$1 = function (predicate) {
    return $_4np8xgkwjf3ft3bp.first(predicate).isSome();
  };
  var ancestor$3 = function (scope, predicate, isRoot) {
    return $_4np8xgkwjf3ft3bp.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest$3 = function (scope, predicate, isRoot) {
    return $_4np8xgkwjf3ft3bp.closest(scope, predicate, isRoot).isSome();
  };
  var sibling$3 = function (scope, predicate) {
    return $_4np8xgkwjf3ft3bp.sibling(scope, predicate).isSome();
  };
  var child$4 = function (scope, predicate) {
    return $_4np8xgkwjf3ft3bp.child(scope, predicate).isSome();
  };
  var descendant$3 = function (scope, predicate) {
    return $_4np8xgkwjf3ft3bp.descendant(scope, predicate).isSome();
  };
  var $_d30fg2pgjf3ft4cp = {
    any: any$1,
    ancestor: ancestor$3,
    closest: closest$3,
    sibling: sibling$3,
    child: child$4,
    descendant: descendant$3
  };

  var detection = $_8vnd6hkejf3ft397.detect();
  var inSameTable = function (elem, table) {
    return $_d30fg2pgjf3ft4cp.ancestor(elem, function (e) {
      return $_a4gvewk7jf3ft384.parent(e).exists(function (p) {
        return $_avffyek9jf3ft38l.eq(p, table);
      });
    });
  };
  var simulate = function (bridge, isRoot, direction, initial, anchor) {
    return $_fhotvakvjf3ft3bm.closest(initial, 'td,th', isRoot).bind(function (start) {
      return $_fhotvakvjf3ft3bm.closest(start, 'table', isRoot).bind(function (table) {
        if (!inSameTable(anchor, table))
          return Option.none();
        return $_asrnd3p3jf3ft496.handle(bridge, isRoot, direction).bind(function (range) {
          return $_fhotvakvjf3ft3bm.closest(range.finish(), 'td,th', isRoot).map(function (finish) {
            return {
              start: $_6np0wpjsjf3ft34s.constant(start),
              finish: $_6np0wpjsjf3ft34s.constant(finish),
              range: $_6np0wpjsjf3ft34s.constant(range)
            };
          });
        });
      });
    });
  };
  var navigate = function (bridge, isRoot, direction, initial, anchor, precheck) {
    if (detection.browser.isIE()) {
      return Option.none();
    } else {
      return precheck(initial, isRoot).orThunk(function () {
        return simulate(bridge, isRoot, direction, initial, anchor).map(function (info) {
          var range = info.range();
          return $_aq55xhowjf3ft46r.response(Option.some($_5v16bdozjf3ft47g.makeSitus(range.start(), range.soffset(), range.finish(), range.foffset())), true);
        });
      });
    }
  };
  var firstUpCheck = function (initial, isRoot) {
    return $_fhotvakvjf3ft3bm.closest(initial, 'tr', isRoot).bind(function (startRow) {
      return $_fhotvakvjf3ft3bm.closest(startRow, 'table', isRoot).bind(function (table) {
        var rows = $_6pynzqksjf3ft3aw.descendants(table, 'tr');
        if ($_avffyek9jf3ft38l.eq(startRow, rows[0])) {
          return $_ei0kyrp7jf3ft4am.seekLeft(table, function (element) {
            return $_bksv9ol6jf3ft3e5.last(element).isSome();
          }, isRoot).map(function (last) {
            var lastOffset = $_eutj08l7jf3ft3e8.getEnd(last);
            return $_aq55xhowjf3ft46r.response(Option.some($_5v16bdozjf3ft47g.makeSitus(last, lastOffset, last, lastOffset)), true);
          });
        } else {
          return Option.none();
        }
      });
    });
  };
  var lastDownCheck = function (initial, isRoot) {
    return $_fhotvakvjf3ft3bm.closest(initial, 'tr', isRoot).bind(function (startRow) {
      return $_fhotvakvjf3ft3bm.closest(startRow, 'table', isRoot).bind(function (table) {
        var rows = $_6pynzqksjf3ft3aw.descendants(table, 'tr');
        if ($_avffyek9jf3ft38l.eq(startRow, rows[rows.length - 1])) {
          return $_ei0kyrp7jf3ft4am.seekRight(table, function (element) {
            return $_bksv9ol6jf3ft3e5.first(element).isSome();
          }, isRoot).map(function (first) {
            return $_aq55xhowjf3ft46r.response(Option.some($_5v16bdozjf3ft47g.makeSitus(first, 0, first, 0)), true);
          });
        } else {
          return Option.none();
        }
      });
    });
  };
  var select = function (bridge, container, isRoot, direction, initial, anchor, selectRange) {
    return simulate(bridge, isRoot, direction, initial, anchor).bind(function (info) {
      return $_6nq5f0p1jf3ft481.detect(container, isRoot, info.start(), info.finish(), selectRange);
    });
  };
  var $_7m9vtip2jf3ft48d = {
    navigate: navigate,
    select: select,
    firstUpCheck: firstUpCheck,
    lastDownCheck: lastDownCheck
  };

  var findCell = function (target, isRoot) {
    return $_fhotvakvjf3ft3bm.closest(target, 'td,th', isRoot);
  };
  function MouseSelection (bridge, container, isRoot, annotations) {
    var cursor = Option.none();
    var clearState = function () {
      cursor = Option.none();
    };
    var mousedown = function (event) {
      annotations.clear(container);
      cursor = findCell(event.target(), isRoot);
    };
    var mouseover = function (event) {
      cursor.each(function (start) {
        annotations.clear(container);
        findCell(event.target(), isRoot).each(function (finish) {
          $_cabca2lejf3ft3fj.identify(start, finish, isRoot).each(function (cellSel) {
            var boxes = cellSel.boxes().getOr([]);
            if (boxes.length > 1 || boxes.length === 1 && !$_avffyek9jf3ft38l.eq(start, finish)) {
              annotations.selectRange(container, boxes, cellSel.start(), cellSel.finish());
              bridge.selectContents(finish);
            }
          });
        });
      });
    };
    var mouseup = function () {
      cursor.each(clearState);
    };
    return {
      mousedown: mousedown,
      mouseover: mouseover,
      mouseup: mouseup
    };
  }

  var $_456210pijf3ft4dp = {
    down: {
      traverse: $_a4gvewk7jf3ft384.nextSibling,
      gather: $_ei0kyrp7jf3ft4am.after,
      relative: $_5o03fuogjf3ft434.before,
      otherRetry: $_fao0p3p6jf3ft4a0.tryDown,
      ieRetry: $_fao0p3p6jf3ft4a0.ieTryDown,
      failure: $_5ynl4mpcjf3ft4b9.adt.failedDown
    },
    up: {
      traverse: $_a4gvewk7jf3ft384.prevSibling,
      gather: $_ei0kyrp7jf3ft4am.before,
      relative: $_5o03fuogjf3ft434.before,
      otherRetry: $_fao0p3p6jf3ft4a0.tryUp,
      ieRetry: $_fao0p3p6jf3ft4a0.ieTryUp,
      failure: $_5ynl4mpcjf3ft4b9.adt.failedUp
    }
  };

  var rc = $_4bo75gjvjf3ft35r.immutable('rows', 'cols');
  var mouse = function (win, container, isRoot, annotations) {
    var bridge = WindowBridge(win);
    var handlers = MouseSelection(bridge, container, isRoot, annotations);
    return {
      mousedown: handlers.mousedown,
      mouseover: handlers.mouseover,
      mouseup: handlers.mouseup
    };
  };
  var keyboard = function (win, container, isRoot, annotations) {
    var bridge = WindowBridge(win);
    var clearToNavigate = function () {
      annotations.clear(container);
      return Option.none();
    };
    var keydown = function (event, start, soffset, finish, foffset, direction) {
      var keycode = event.raw().which;
      var shiftKey = event.raw().shiftKey === true;
      var handler = $_cabca2lejf3ft3fj.retrieve(container, annotations.selectedSelector()).fold(function () {
        if ($_egv1paoxjf3ft46t.isDown(keycode) && shiftKey) {
          return $_6np0wpjsjf3ft34s.curry($_7m9vtip2jf3ft48d.select, bridge, container, isRoot, $_456210pijf3ft4dp.down, finish, start, annotations.selectRange);
        } else if ($_egv1paoxjf3ft46t.isUp(keycode) && shiftKey) {
          return $_6np0wpjsjf3ft34s.curry($_7m9vtip2jf3ft48d.select, bridge, container, isRoot, $_456210pijf3ft4dp.up, finish, start, annotations.selectRange);
        } else if ($_egv1paoxjf3ft46t.isDown(keycode)) {
          return $_6np0wpjsjf3ft34s.curry($_7m9vtip2jf3ft48d.navigate, bridge, isRoot, $_456210pijf3ft4dp.down, finish, start, $_7m9vtip2jf3ft48d.lastDownCheck);
        } else if ($_egv1paoxjf3ft46t.isUp(keycode)) {
          return $_6np0wpjsjf3ft34s.curry($_7m9vtip2jf3ft48d.navigate, bridge, isRoot, $_456210pijf3ft4dp.up, finish, start, $_7m9vtip2jf3ft48d.firstUpCheck);
        } else {
          return Option.none;
        }
      }, function (selected) {
        var update = function (attempts) {
          return function () {
            var navigation = $_2wgl26mgjf3ft3op.findMap(attempts, function (delta) {
              return $_6nq5f0p1jf3ft481.update(delta.rows(), delta.cols(), container, selected, annotations);
            });
            return navigation.fold(function () {
              return $_cabca2lejf3ft3fj.getEdges(container, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(function (edges) {
                var relative = $_egv1paoxjf3ft46t.isDown(keycode) || direction.isForward(keycode) ? $_5o03fuogjf3ft434.after : $_5o03fuogjf3ft434.before;
                bridge.setRelativeSelection($_5o03fuogjf3ft434.on(edges.first(), 0), relative(edges.table()));
                annotations.clear(container);
                return $_aq55xhowjf3ft46r.response(Option.none(), true);
              });
            }, function (_) {
              return Option.some($_aq55xhowjf3ft46r.response(Option.none(), true));
            });
          };
        };
        if ($_egv1paoxjf3ft46t.isDown(keycode) && shiftKey)
          return update([rc(+1, 0)]);
        else if ($_egv1paoxjf3ft46t.isUp(keycode) && shiftKey)
          return update([rc(-1, 0)]);
        else if (direction.isBackward(keycode) && shiftKey)
          return update([
            rc(0, -1),
            rc(-1, 0)
          ]);
        else if (direction.isForward(keycode) && shiftKey)
          return update([
            rc(0, +1),
            rc(+1, 0)
          ]);
        else if ($_egv1paoxjf3ft46t.isNavigation(keycode) && shiftKey === false)
          return clearToNavigate;
        else
          return Option.none;
      });
      return handler();
    };
    var keyup = function (event, start, soffset, finish, foffset) {
      return $_cabca2lejf3ft3fj.retrieve(container, annotations.selectedSelector()).fold(function () {
        var keycode = event.raw().which;
        var shiftKey = event.raw().shiftKey === true;
        if (shiftKey === false)
          return Option.none();
        if ($_egv1paoxjf3ft46t.isNavigation(keycode))
          return $_6nq5f0p1jf3ft481.sync(container, isRoot, start, soffset, finish, foffset, annotations.selectRange);
        else
          return Option.none();
      }, Option.none);
    };
    return {
      keydown: keydown,
      keyup: keyup
    };
  };
  var $_d7owa5ovjf3ft466 = {
    mouse: mouse,
    keyboard: keyboard
  };

  var add$3 = function (element, classes) {
    $_5qd2tsjqjf3ft34c.each(classes, function (x) {
      $_8ycds3mrjf3ft3rl.add(element, x);
    });
  };
  var remove$7 = function (element, classes) {
    $_5qd2tsjqjf3ft34c.each(classes, function (x) {
      $_8ycds3mrjf3ft3rl.remove(element, x);
    });
  };
  var toggle$2 = function (element, classes) {
    $_5qd2tsjqjf3ft34c.each(classes, function (x) {
      $_8ycds3mrjf3ft3rl.toggle(element, x);
    });
  };
  var hasAll = function (element, classes) {
    return $_5qd2tsjqjf3ft34c.forall(classes, function (clazz) {
      return $_8ycds3mrjf3ft3rl.has(element, clazz);
    });
  };
  var hasAny = function (element, classes) {
    return $_5qd2tsjqjf3ft34c.exists(classes, function (clazz) {
      return $_8ycds3mrjf3ft3rl.has(element, clazz);
    });
  };
  var getNative = function (element) {
    var classList = element.dom().classList;
    var r = new Array(classList.length);
    for (var i = 0; i < classList.length; i++) {
      r[i] = classList.item(i);
    }
    return r;
  };
  var get$11 = function (element) {
    return $_2junsxmtjf3ft3rp.supports(element) ? getNative(element) : $_2junsxmtjf3ft3rp.get(element);
  };
  var $_xpeu4pljf3ft4ef = {
    add: add$3,
    remove: remove$7,
    toggle: toggle$2,
    hasAll: hasAll,
    hasAny: hasAny,
    get: get$11
  };

  var addClass = function (clazz) {
    return function (element) {
      $_8ycds3mrjf3ft3rl.add(element, clazz);
    };
  };
  var removeClass = function (clazz) {
    return function (element) {
      $_8ycds3mrjf3ft3rl.remove(element, clazz);
    };
  };
  var removeClasses = function (classes) {
    return function (element) {
      $_xpeu4pljf3ft4ef.remove(element, classes);
    };
  };
  var hasClass = function (clazz) {
    return function (element) {
      return $_8ycds3mrjf3ft3rl.has(element, clazz);
    };
  };
  var $_e33nzrpkjf3ft4ec = {
    addClass: addClass,
    removeClass: removeClass,
    removeClasses: removeClasses,
    hasClass: hasClass
  };

  var byClass = function (ephemera) {
    var addSelectionClass = $_e33nzrpkjf3ft4ec.addClass(ephemera.selected());
    var removeSelectionClasses = $_e33nzrpkjf3ft4ec.removeClasses([
      ephemera.selected(),
      ephemera.lastSelected(),
      ephemera.firstSelected()
    ]);
    var clear = function (container) {
      var sels = $_6pynzqksjf3ft3aw.descendants(container, ephemera.selectedSelector());
      $_5qd2tsjqjf3ft34c.each(sels, removeSelectionClasses);
    };
    var selectRange = function (container, cells, start, finish) {
      clear(container);
      $_5qd2tsjqjf3ft34c.each(cells, addSelectionClass);
      $_8ycds3mrjf3ft3rl.add(start, ephemera.firstSelected());
      $_8ycds3mrjf3ft3rl.add(finish, ephemera.lastSelected());
    };
    return {
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    };
  };
  var byAttr = function (ephemera) {
    var removeSelectionAttributes = function (element) {
      $_fcjbkgkqjf3ft3af.remove(element, ephemera.selected());
      $_fcjbkgkqjf3ft3af.remove(element, ephemera.firstSelected());
      $_fcjbkgkqjf3ft3af.remove(element, ephemera.lastSelected());
    };
    var addSelectionAttribute = function (element) {
      $_fcjbkgkqjf3ft3af.set(element, ephemera.selected(), '1');
    };
    var clear = function (container) {
      var sels = $_6pynzqksjf3ft3aw.descendants(container, ephemera.selectedSelector());
      $_5qd2tsjqjf3ft34c.each(sels, removeSelectionAttributes);
    };
    var selectRange = function (container, cells, start, finish) {
      clear(container);
      $_5qd2tsjqjf3ft34c.each(cells, addSelectionAttribute);
      $_fcjbkgkqjf3ft3af.set(start, ephemera.firstSelected(), '1');
      $_fcjbkgkqjf3ft3af.set(finish, ephemera.lastSelected(), '1');
    };
    return {
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    };
  };
  var $_arc31ppjjf3ft4dz = {
    byClass: byClass,
    byAttr: byAttr
  };

  function CellSelection$1 (editor, lazyResize) {
    var handlerStruct = $_4bo75gjvjf3ft35r.immutableBag([
      'mousedown',
      'mouseover',
      'mouseup',
      'keyup',
      'keydown'
    ], []);
    var handlers = Option.none();
    var annotations = $_arc31ppjjf3ft4dz.byAttr($_43jdhslqjf3ft3in);
    editor.on('init', function (e) {
      var win = editor.getWin();
      var body = $_bteipcn8jf3ft3u3.getBody(editor);
      var isRoot = $_bteipcn8jf3ft3u3.getIsRoot(editor);
      var syncSelection = function () {
        var sel = editor.selection;
        var start = $_cjzqfhk5jf3ft37x.fromDom(sel.getStart());
        var end = $_cjzqfhk5jf3ft37x.fromDom(sel.getEnd());
        var startTable = $_3oodk9k2jf3ft36l.table(start);
        var endTable = $_3oodk9k2jf3ft36l.table(end);
        var sameTable = startTable.bind(function (tableStart) {
          return endTable.bind(function (tableEnd) {
            return $_avffyek9jf3ft38l.eq(tableStart, tableEnd) ? Option.some(true) : Option.none();
          });
        });
        sameTable.fold(function () {
          annotations.clear(body);
        }, $_6np0wpjsjf3ft34s.noop);
      };
      var mouseHandlers = $_d7owa5ovjf3ft466.mouse(win, body, isRoot, annotations);
      var keyHandlers = $_d7owa5ovjf3ft466.keyboard(win, body, isRoot, annotations);
      var hasShiftKey = function (event) {
        return event.raw().shiftKey === true;
      };
      var handleResponse = function (event, response) {
        if (!hasShiftKey(event)) {
          return;
        }
        if (response.kill()) {
          event.kill();
        }
        response.selection().each(function (ns) {
          var relative = $_3781muofjf3ft42z.relative(ns.start(), ns.finish());
          var rng = $_d7mdauoljf3ft440.asLtrRange(win, relative);
          editor.selection.setRng(rng);
        });
      };
      var keyup = function (event) {
        var wrappedEvent = wrapEvent(event);
        if (wrappedEvent.raw().shiftKey && $_egv1paoxjf3ft46t.isNavigation(wrappedEvent.raw().which)) {
          var rng = editor.selection.getRng();
          var start = $_cjzqfhk5jf3ft37x.fromDom(rng.startContainer);
          var end = $_cjzqfhk5jf3ft37x.fromDom(rng.endContainer);
          keyHandlers.keyup(wrappedEvent, start, rng.startOffset, end, rng.endOffset).each(function (response) {
            handleResponse(wrappedEvent, response);
          });
        }
      };
      var checkLast = function (last) {
        return !$_fcjbkgkqjf3ft3af.has(last, 'data-mce-bogus') && $_3seq30krjf3ft3as.name(last) !== 'br' && !($_3seq30krjf3ft3as.isText(last) && $_e4e6aul8jf3ft3ek.get(last).length === 0);
      };
      var getLast = function () {
        var body = $_cjzqfhk5jf3ft37x.fromDom(editor.getBody());
        var lastChild = $_a4gvewk7jf3ft384.lastChild(body);
        var getPrevLast = function (last) {
          return $_a4gvewk7jf3ft384.prevSibling(last).bind(function (prevLast) {
            return checkLast(prevLast) ? Option.some(prevLast) : getPrevLast(prevLast);
          });
        };
        return lastChild.bind(function (last) {
          return checkLast(last) ? Option.some(last) : getPrevLast(last);
        });
      };
      var keydown = function (event) {
        var wrappedEvent = wrapEvent(event);
        lazyResize().each(function (resize) {
          resize.hideBars();
        });
        if (event.which === 40) {
          getLast().each(function (last) {
            if ($_3seq30krjf3ft3as.name(last) === 'table') {
              if (getForcedRootBlock(editor)) {
                editor.dom.add(editor.getBody(), getForcedRootBlock(editor), getForcedRootBlockAttrs(editor), '<br/>');
              } else {
                editor.dom.add(editor.getBody(), 'br');
              }
            }
          });
        }
        var rng = editor.selection.getRng();
        var startContainer = $_cjzqfhk5jf3ft37x.fromDom(editor.selection.getStart());
        var start = $_cjzqfhk5jf3ft37x.fromDom(rng.startContainer);
        var end = $_cjzqfhk5jf3ft37x.fromDom(rng.endContainer);
        var direction = $_1421mdn9jf3ft3u7.directionAt(startContainer).isRtl() ? $_egv1paoxjf3ft46t.rtl : $_egv1paoxjf3ft46t.ltr;
        keyHandlers.keydown(wrappedEvent, start, rng.startOffset, end, rng.endOffset, direction).each(function (response) {
          handleResponse(wrappedEvent, response);
        });
        lazyResize().each(function (resize) {
          resize.showBars();
        });
      };
      var wrapEvent = function (event) {
        var target = $_cjzqfhk5jf3ft37x.fromDom(event.target);
        var stop = function () {
          event.stopPropagation();
        };
        var prevent = function () {
          event.preventDefault();
        };
        var kill = $_6np0wpjsjf3ft34s.compose(prevent, stop);
        return {
          target: $_6np0wpjsjf3ft34s.constant(target),
          x: $_6np0wpjsjf3ft34s.constant(event.x),
          y: $_6np0wpjsjf3ft34s.constant(event.y),
          stop: stop,
          prevent: prevent,
          kill: kill,
          raw: $_6np0wpjsjf3ft34s.constant(event)
        };
      };
      var isLeftMouse = function (raw) {
        return raw.button === 0;
      };
      var isLeftButtonPressed = function (raw) {
        if (raw.buttons === undefined) {
          return true;
        }
        return (raw.buttons & 1) !== 0;
      };
      var mouseDown = function (e) {
        if (isLeftMouse(e)) {
          mouseHandlers.mousedown(wrapEvent(e));
        }
      };
      var mouseOver = function (e) {
        if (isLeftButtonPressed(e)) {
          mouseHandlers.mouseover(wrapEvent(e));
        }
      };
      var mouseUp = function (e) {
        if (isLeftMouse) {
          mouseHandlers.mouseup(wrapEvent(e));
        }
      };
      editor.on('mousedown', mouseDown);
      editor.on('mouseover', mouseOver);
      editor.on('mouseup', mouseUp);
      editor.on('keyup', keyup);
      editor.on('keydown', keydown);
      editor.on('nodechange', syncSelection);
      handlers = Option.some(handlerStruct({
        mousedown: mouseDown,
        mouseover: mouseOver,
        mouseup: mouseUp,
        keyup: keyup,
        keydown: keydown
      }));
    });
    var destroy = function () {
      handlers.each(function (handlers) {
      });
    };
    return {
      clear: annotations.clear,
      destroy: destroy
    };
  }

  function Selections (editor) {
    var get = function () {
      var body = $_bteipcn8jf3ft3u3.getBody(editor);
      return $_8c1u7vldjf3ft3f9.retrieve(body, $_43jdhslqjf3ft3in.selectedSelector()).fold(function () {
        if (editor.selection.getStart() === undefined) {
          return $_fbllh2lrjf3ft3iq.none();
        } else {
          return $_fbllh2lrjf3ft3iq.single(editor.selection);
        }
      }, function (cells) {
        return $_fbllh2lrjf3ft3iq.multiple(cells);
      });
    };
    return { get: get };
  }

  var each$4 = Tools.each;
  var addButtons = function (editor) {
    var menuItems = [];
    each$4('inserttable tableprops deletetable | cell row column'.split(' '), function (name) {
      if (name === '|') {
        menuItems.push({ text: '-' });
      } else {
        menuItems.push(editor.menuItems[name]);
      }
    });
    editor.addButton('table', {
      type: 'menubutton',
      title: 'Table',
      menu: menuItems
    });
    function cmd(command) {
      return function () {
        editor.execCommand(command);
      };
    }
    editor.addButton('tableprops', {
      title: 'Table properties',
      onclick: $_6np0wpjsjf3ft34s.curry($_cwa99xnkjf3ft3w0.open, editor, true),
      icon: 'table'
    });
    editor.addButton('tabledelete', {
      title: 'Delete table',
      onclick: cmd('mceTableDelete')
    });
    editor.addButton('tablecellprops', {
      title: 'Cell properties',
      onclick: cmd('mceTableCellProps')
    });
    editor.addButton('tablemergecells', {
      title: 'Merge cells',
      onclick: cmd('mceTableMergeCells')
    });
    editor.addButton('tablesplitcells', {
      title: 'Split cell',
      onclick: cmd('mceTableSplitCells')
    });
    editor.addButton('tableinsertrowbefore', {
      title: 'Insert row before',
      onclick: cmd('mceTableInsertRowBefore')
    });
    editor.addButton('tableinsertrowafter', {
      title: 'Insert row after',
      onclick: cmd('mceTableInsertRowAfter')
    });
    editor.addButton('tabledeleterow', {
      title: 'Delete row',
      onclick: cmd('mceTableDeleteRow')
    });
    editor.addButton('tablerowprops', {
      title: 'Row properties',
      onclick: cmd('mceTableRowProps')
    });
    editor.addButton('tablecutrow', {
      title: 'Cut row',
      onclick: cmd('mceTableCutRow')
    });
    editor.addButton('tablecopyrow', {
      title: 'Copy row',
      onclick: cmd('mceTableCopyRow')
    });
    editor.addButton('tablepasterowbefore', {
      title: 'Paste row before',
      onclick: cmd('mceTablePasteRowBefore')
    });
    editor.addButton('tablepasterowafter', {
      title: 'Paste row after',
      onclick: cmd('mceTablePasteRowAfter')
    });
    editor.addButton('tableinsertcolbefore', {
      title: 'Insert column before',
      onclick: cmd('mceTableInsertColBefore')
    });
    editor.addButton('tableinsertcolafter', {
      title: 'Insert column after',
      onclick: cmd('mceTableInsertColAfter')
    });
    editor.addButton('tabledeletecol', {
      title: 'Delete column',
      onclick: cmd('mceTableDeleteCol')
    });
  };
  var addToolbars = function (editor) {
    var isTable = function (table) {
      var selectorMatched = editor.dom.is(table, 'table') && editor.getBody().contains(table);
      return selectorMatched;
    };
    var toolbar = getToolbar(editor);
    if (toolbar.length > 0) {
      editor.addContextToolbar(isTable, toolbar.join(' '));
    }
  };
  var $_6z78qdpnjf3ft4er = {
    addButtons: addButtons,
    addToolbars: addToolbars
  };

  var addMenuItems = function (editor, selections) {
    var targets = Option.none();
    var tableCtrls = [];
    var cellCtrls = [];
    var mergeCtrls = [];
    var unmergeCtrls = [];
    var noTargetDisable = function (ctrl) {
      ctrl.disabled(true);
    };
    var ctrlEnable = function (ctrl) {
      ctrl.disabled(false);
    };
    var pushTable = function () {
      var self = this;
      tableCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        ctrlEnable(self);
      });
    };
    var pushCell = function () {
      var self = this;
      cellCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        ctrlEnable(self);
      });
    };
    var pushMerge = function () {
      var self = this;
      mergeCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        self.disabled(targets.mergable().isNone());
      });
    };
    var pushUnmerge = function () {
      var self = this;
      unmergeCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        self.disabled(targets.unmergable().isNone());
      });
    };
    var setDisabledCtrls = function () {
      targets.fold(function () {
        $_5qd2tsjqjf3ft34c.each(tableCtrls, noTargetDisable);
        $_5qd2tsjqjf3ft34c.each(cellCtrls, noTargetDisable);
        $_5qd2tsjqjf3ft34c.each(mergeCtrls, noTargetDisable);
        $_5qd2tsjqjf3ft34c.each(unmergeCtrls, noTargetDisable);
      }, function (targets) {
        $_5qd2tsjqjf3ft34c.each(tableCtrls, ctrlEnable);
        $_5qd2tsjqjf3ft34c.each(cellCtrls, ctrlEnable);
        $_5qd2tsjqjf3ft34c.each(mergeCtrls, function (mergeCtrl) {
          mergeCtrl.disabled(targets.mergable().isNone());
        });
        $_5qd2tsjqjf3ft34c.each(unmergeCtrls, function (unmergeCtrl) {
          unmergeCtrl.disabled(targets.unmergable().isNone());
        });
      });
    };
    editor.on('init', function () {
      editor.on('nodechange', function (e) {
        var cellOpt = Option.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        targets = cellOpt.bind(function (cellDom) {
          var cell = $_cjzqfhk5jf3ft37x.fromDom(cellDom);
          var table = $_3oodk9k2jf3ft36l.table(cell);
          return table.map(function (table) {
            return $_ch69x3lbjf3ft3eu.forMenu(selections, table, cell);
          });
        });
        setDisabledCtrls();
      });
    });
    var generateTableGrid = function () {
      var html = '';
      html = '<table role="grid" class="mce-grid mce-grid-border" aria-readonly="true">';
      for (var y = 0; y < 10; y++) {
        html += '<tr>';
        for (var x = 0; x < 10; x++) {
          html += '<td role="gridcell" tabindex="-1"><a id="mcegrid' + (y * 10 + x) + '" href="#" ' + 'data-mce-x="' + x + '" data-mce-y="' + y + '"></a></td>';
        }
        html += '</tr>';
      }
      html += '</table>';
      html += '<div class="mce-text-center" role="presentation">1 x 1</div>';
      return html;
    };
    var selectGrid = function (editor, tx, ty, control) {
      var table = control.getEl().getElementsByTagName('table')[0];
      var x, y, focusCell, cell, active;
      var rtl = control.isRtl() || control.parent().rel === 'tl-tr';
      table.nextSibling.innerHTML = tx + 1 + ' x ' + (ty + 1);
      if (rtl) {
        tx = 9 - tx;
      }
      for (y = 0; y < 10; y++) {
        for (x = 0; x < 10; x++) {
          cell = table.rows[y].childNodes[x].firstChild;
          active = (rtl ? x >= tx : x <= tx) && y <= ty;
          editor.dom.toggleClass(cell, 'mce-active', active);
          if (active) {
            focusCell = cell;
          }
        }
      }
      return focusCell.parentNode;
    };
    var insertTable = hasTableGrid(editor) === false ? {
      text: 'Table',
      icon: 'table',
      context: 'table',
      onclick: $_6np0wpjsjf3ft34s.curry($_cwa99xnkjf3ft3w0.open, editor)
    } : {
      text: 'Table',
      icon: 'table',
      context: 'table',
      ariaHideMenu: true,
      onclick: function (e) {
        if (e.aria) {
          this.parent().hideAll();
          e.stopImmediatePropagation();
          $_cwa99xnkjf3ft3w0.open(editor);
        }
      },
      onshow: function () {
        selectGrid(editor, 0, 0, this.menu.items()[0]);
      },
      onhide: function () {
        var elements = this.menu.items()[0].getEl().getElementsByTagName('a');
        editor.dom.removeClass(elements, 'mce-active');
        editor.dom.addClass(elements[0], 'mce-active');
      },
      menu: [{
          type: 'container',
          html: generateTableGrid(),
          onPostRender: function () {
            this.lastX = this.lastY = 0;
          },
          onmousemove: function (e) {
            var target = e.target;
            var x, y;
            if (target.tagName.toUpperCase() === 'A') {
              x = parseInt(target.getAttribute('data-mce-x'), 10);
              y = parseInt(target.getAttribute('data-mce-y'), 10);
              if (this.isRtl() || this.parent().rel === 'tl-tr') {
                x = 9 - x;
              }
              if (x !== this.lastX || y !== this.lastY) {
                selectGrid(editor, x, y, e.control);
                this.lastX = x;
                this.lastY = y;
              }
            }
          },
          onclick: function (e) {
            var self = this;
            if (e.target.tagName.toUpperCase() === 'A') {
              e.preventDefault();
              e.stopPropagation();
              self.parent().cancel();
              editor.undoManager.transact(function () {
                $_fgnrflnmjf3ft3w7.insert(editor, self.lastX + 1, self.lastY + 1);
              });
              editor.addVisual();
            }
          }
        }]
    };
    function cmd(command) {
      return function () {
        editor.execCommand(command);
      };
    }
    var tableProperties = {
      text: 'Table properties',
      context: 'table',
      onPostRender: pushTable,
      onclick: $_6np0wpjsjf3ft34s.curry($_cwa99xnkjf3ft3w0.open, editor, true)
    };
    var deleteTable = {
      text: 'Delete table',
      context: 'table',
      onPostRender: pushTable,
      cmd: 'mceTableDelete'
    };
    var row = {
      text: 'Row',
      context: 'table',
      menu: [
        {
          text: 'Insert row before',
          onclick: cmd('mceTableInsertRowBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Insert row after',
          onclick: cmd('mceTableInsertRowAfter'),
          onPostRender: pushCell
        },
        {
          text: 'Delete row',
          onclick: cmd('mceTableDeleteRow'),
          onPostRender: pushCell
        },
        {
          text: 'Row properties',
          onclick: cmd('mceTableRowProps'),
          onPostRender: pushCell
        },
        { text: '-' },
        {
          text: 'Cut row',
          onclick: cmd('mceTableCutRow'),
          onPostRender: pushCell
        },
        {
          text: 'Copy row',
          onclick: cmd('mceTableCopyRow'),
          onPostRender: pushCell
        },
        {
          text: 'Paste row before',
          onclick: cmd('mceTablePasteRowBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Paste row after',
          onclick: cmd('mceTablePasteRowAfter'),
          onPostRender: pushCell
        }
      ]
    };
    var column = {
      text: 'Column',
      context: 'table',
      menu: [
        {
          text: 'Insert column before',
          onclick: cmd('mceTableInsertColBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Insert column after',
          onclick: cmd('mceTableInsertColAfter'),
          onPostRender: pushCell
        },
        {
          text: 'Delete column',
          onclick: cmd('mceTableDeleteCol'),
          onPostRender: pushCell
        }
      ]
    };
    var cell = {
      separator: 'before',
      text: 'Cell',
      context: 'table',
      menu: [
        {
          text: 'Cell properties',
          onclick: cmd('mceTableCellProps'),
          onPostRender: pushCell
        },
        {
          text: 'Merge cells',
          onclick: cmd('mceTableMergeCells'),
          onPostRender: pushMerge
        },
        {
          text: 'Split cell',
          onclick: cmd('mceTableSplitCells'),
          onPostRender: pushUnmerge
        }
      ]
    };
    editor.addMenuItem('inserttable', insertTable);
    editor.addMenuItem('tableprops', tableProperties);
    editor.addMenuItem('deletetable', deleteTable);
    editor.addMenuItem('row', row);
    editor.addMenuItem('column', column);
    editor.addMenuItem('cell', cell);
  };
  var $_cpiwwxpojf3ft4ew = { addMenuItems: addMenuItems };

  var getClipboardRows = function (clipboardRows) {
    return clipboardRows.get().fold(function () {
      return;
    }, function (rows) {
      return $_5qd2tsjqjf3ft34c.map(rows, function (row) {
        return row.dom();
      });
    });
  };
  var setClipboardRows = function (rows, clipboardRows) {
    var sugarRows = $_5qd2tsjqjf3ft34c.map(rows, $_cjzqfhk5jf3ft37x.fromDom);
    clipboardRows.set(Option.from(sugarRows));
  };
  var getApi = function (editor, clipboardRows) {
    return {
      insertTable: function (columns, rows) {
        return $_fgnrflnmjf3ft3w7.insert(editor, columns, rows);
      },
      setClipboardRows: function (rows) {
        return setClipboardRows(rows, clipboardRows);
      },
      getClipboardRows: function () {
        return getClipboardRows(clipboardRows);
      }
    };
  };

  function Plugin(editor) {
    var resizeHandler = ResizeHandler(editor);
    var cellSelection = CellSelection$1(editor, resizeHandler.lazyResize);
    var actions = TableActions(editor, resizeHandler.lazyWire);
    var selections = Selections(editor);
    var clipboardRows = Cell(Option.none());
    $_8ns4qundjf3ft3uk.registerCommands(editor, actions, cellSelection, selections, clipboardRows);
    $_bcrcgqjpjf3ft338.registerEvents(editor, selections, actions, cellSelection);
    $_cpiwwxpojf3ft4ew.addMenuItems(editor, selections);
    $_6z78qdpnjf3ft4er.addButtons(editor);
    $_6z78qdpnjf3ft4er.addToolbars(editor);
    editor.on('PreInit', function () {
      editor.serializer.addTempAttr($_43jdhslqjf3ft3in.firstSelected());
      editor.serializer.addTempAttr($_43jdhslqjf3ft3in.lastSelected());
    });
    if (hasTabNavigation(editor)) {
      editor.on('keydown', function (e) {
        $_9the5iocjf3ft429.handle(e, editor, actions, resizeHandler.lazyWire);
      });
    }
    editor.on('remove', function () {
      resizeHandler.destroy();
      cellSelection.destroy();
    });
    return getApi(editor, clipboardRows);
  }
  PluginManager.add('table', Plugin);
  function Plugin$1 () {
  }

  return Plugin$1;

}());
})();
