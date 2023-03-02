// @ts-nocheck
import mpService from '@binance/mp-service'

var sa: any = {
  is_first_launch: !1,
  launched: !1,
  _queue: [],
  mpshow_time: null,
  sa_referrer: '\u76f4\u63a5\u6253\u5f00',
  query_share_depth: 0,
  share_distinct_id: '',
  share_method: '',
  current_scene: '',
  inited: !1,
  para: {
    server_url: '',
    send_timeout: 1e3,
    show_log: !1,
    allow_amend_share_path: !0,
    max_string_length: 500,
    datasend_timeout: 3e3,
    source_channel: [],
    batch_send: { send_timeout: 6e3, max_length: 6 },
    preset_properties: {},
  },
  platform: '',
  lib: { version: '0.6.3', name: 'MiniGame', method: 'code' },
  properties: { $lib: 'MiniGame', $lib_version: '0.6.3' },
  source_channel_standard: 'utm_source utm_medium utm_campaign utm_content utm_term',
  latest_source_channel: [
    '$latest_utm_source',
    '$latest_utm_medium',
    '$latest_utm_campaign',
    '$latest_utm_content',
    '$latest_utm_term',
    '$latest_sa_utm',
  ],
  latest_share_info: [
    '$latest_share_distinct_id',
    '$latest_share_url_path',
    '$latest_share_depth',
    '$latest_share_method',
  ],
  currentProps: {},
}
const _toString = Object.prototype.toString,
  _hasOwnProperty = Object.prototype.hasOwnProperty,
  indexOf = Array.prototype.indexOf,
  slice = Array.prototype.slice,
  _isArray = Array.prototype.isArray,
  forEach = Array.prototype.forEach,
  bind = Function.prototype.bind
function isUndefined(t) {
  return void 0 === t
}
function isString(t) {
  return '[object String]' == _toString.call(t)
}
function isDate(t) {
  return '[object Date]' == _toString.call(t)
}
function isBoolean(t) {
  return '[object Boolean]' == _toString.call(t)
}
function isNumber(t) {
  return '[object Number]' == _toString.call(t) && /[\d\.]+/.test(String(t))
}
function isJSONString(t) {
  try {
    JSON.parse(t)
  } catch (t) {
    return !1
  }
  return !0
}
function isObject(t) {
  return null != t && '[object Object]' === _toString.call(t)
}
function isPlainObject(t) {
  return '[object Object]' === _toString.call(t)
}
function isArray(t) {
  return _isArray || '[object Array]' === _toString.call(t)
}
function isFuction(t) {
  try {
    return /^\s*\bfunction\b/.test(t)
  } catch (t) {
    return !1
  }
}
function isArguments(t) {
  return !(!t || !_hasOwnProperty.call(t, 'callee'))
}
function toString$1(t) {
  return null == t
    ? ''
    : isArray(t) || (isPlainObject(t) && t.toString === _toString)
    ? JSON.stringify(t, null, 2)
    : String(t)
}
function each(t, e, a) {
  if (null == t) return !1
  if (forEach && t.forEach === forEach) t.forEach(e, a)
  else if (t.length === +t.length) {
    for (var r = 0, n = t.length; r < n; r++) if (r in t && e.call(a, t[r], r, t) === {}) return !1
  } else for (var s in t) if (_hasOwnProperty.call(t, s) && e.call(a, t[s], s, t) === {}) return !1
}
function toArray(t, e) {
  if (!t) return []
  var a = []
  return (
    t.toArray && (a = t.toArray()),
    isArray(t) && (a = slice.call(t)),
    isArguments(t) && (a = slice.call(t)),
    (a = values(t)),
    e && isNumber(e) && (a = a.slice(e)),
    a
  )
}
function values(t) {
  var e = []
  return null == t
    ? e
    : (each(t, function (t) {
        e[e.length] = t
      }),
      e)
}
function include(t, e) {
  var a = !1
  return null == t
    ? a
    : indexOf && t.indexOf === indexOf
    ? -1 != t.indexOf(e)
    : (each(t, function (t) {
        if (a || (a = t === e)) return {}
      }),
      a)
}
function unique(t) {
  for (var e, a = [], r = {}, n = 0; n < t.length; n++) r[(e = t[n])] || ((r[e] = !0), a.push(e))
  return a
}
function formatDate(t) {
  function e(t) {
    return t < 10 ? '0' + t : t
  }
  return (
    t.getFullYear() +
    '-' +
    e(t.getMonth() + 1) +
    '-' +
    e(t.getDate()) +
    ' ' +
    e(t.getHours()) +
    ':' +
    e(t.getMinutes()) +
    ':' +
    e(t.getSeconds()) +
    '.' +
    e(t.getMilliseconds())
  )
}
function searchObjDate(t) {
  isObject(t) &&
    each(t, function (e, a) {
      isObject(e) ? searchObjDate(t[a]) : isDate(e) && (t[a] = formatDate(e))
    })
}
function trim(t) {
  return t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}
function isFunction(t) {
  if (!t) return !1
  var e = Object.prototype.toString.call(t)
  return '[object Function]' == e || '[object AsyncFunction]' == e || '[object GeneratorFunction]' == e
}
function extend(t) {
  return (
    each(slice.call(arguments, 1), function (e) {
      for (var a in e) void 0 !== e[a] && (t[a] = e[a])
    }),
    t
  )
}
function extend2Lev(t) {
  return (
    each(slice.call(arguments, 1), function (e) {
      for (var a in e)
        void 0 !== e[a] && null !== e[a] && (isObject(e[a]) && isObject(t[a]) ? extend(t[a], e[a]) : (t[a] = e[a]))
    }),
    t
  )
}
function isEmptyObject(t) {
  if (isObject(t)) {
    for (var e in t) if (_hasOwnProperty.call(t, e)) return !1
    return !0
  }
  return !1
}
function formatString(t) {
  return t.length > sa.para.max_string_length
    ? (sa.log('\u5b57\u7b26\u4e32\u957f\u5ea6\u8d85\u8fc7\u9650\u5236\uff0c\u5df2\u7ecf\u505a\u622a\u53d6--' + t),
      t.slice(0, sa.para.max_string_length))
    : t
}
function searchObjString(t) {
  isObject(t) &&
    each(t, function (e, a) {
      isObject(e) ? searchObjString(t[a]) : isString(e) && (t[a] = formatString(e))
    })
}
function decodeURIComponent(t) {
  var e = ''
  try {
    e = decodeURIComponent(t)
  } catch (a) {
    e = t
  }
  return e
}
function encodeDates(t) {
  return (
    each(t, function (e, a) {
      isDate(e) ? (t[a] = formatDate(e)) : isObject(e) && (t[a] = encodeDates(e))
    }),
    t
  )
}
function utf8Encode(t) {
  var e,
    a,
    r,
    n,
    s = ''
  for (e = a = 0, r = (t = (t + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')).length, n = 0; n < r; n++) {
    var i = t.charCodeAt(n),
      o = null
    i < 128
      ? a++
      : (o =
          i > 127 && i < 2048
            ? String.fromCharCode((i >> 6) | 192, (63 & i) | 128)
            : String.fromCharCode((i >> 12) | 224, ((i >> 6) & 63) | 128, (63 & i) | 128)),
      null !== o && (a > e && (s += t.substring(e, a)), (s += o), (e = a = n + 1))
  }
  return a > e && (s += t.substring(e, t.length)), s
}
function base64Encode(t) {
  var e,
    a,
    r,
    n,
    s,
    i = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    o = 0,
    c = 0,
    p = '',
    u = []
  if (!t) return t
  t = utf8Encode(t)
  do {
    ;(e = ((s = (t.charCodeAt(o++) << 16) | (t.charCodeAt(o++) << 8) | t.charCodeAt(o++)) >> 18) & 63),
      (a = (s >> 12) & 63),
      (r = (s >> 6) & 63),
      (n = 63 & s),
      (u[c++] = i.charAt(e) + i.charAt(a) + i.charAt(r) + i.charAt(n))
  } while (o < t.length)
  switch (((p = u.join('')), t.length % 3)) {
    case 1:
      p = p.slice(0, -2) + '=='
      break
    case 2:
      p = p.slice(0, -1) + '='
  }
  return p
}
function formatSystem(t) {
  var e = t.toLowerCase()
  return 'ios' === e ? 'iOS' : 'android' === e ? 'Android' : t
}
var getRandomBasic = (function () {
  var t = new Date().getTime()
  return function (e) {
    return Math.ceil(((t = (9301 * t + 49297) % 233280) / 233280) * e)
  }
})()
function getRandom() {
  if ('function' == typeof Uint32Array) {
    var t = ''
    if (
      ('undefined' != typeof crypto ? (t = crypto) : 'undefined' != typeof msCrypto && (t = msCrypto),
      isObject(t) && t.getRandomValues)
    ) {
      var e = new Uint32Array(1)
      return t.getRandomValues(e)[0] / Math.pow(2, 32)
    }
  }
  return getRandomBasic(1e19) / 1e19
}
function getUUID() {
  return (
    Date.now() +
    '-' +
    Math.floor(1e7 * getRandom()) +
    '-' +
    getRandom().toString(16).replace('.', '') +
    '-' +
    String(31242 * getRandom())
      .replace('.', '')
      .slice(0, 8)
  )
}
const _ = {
  getUUID: getUUID,
  formatSystem: formatSystem,
  indexOf: indexOf,
  slice: slice,
  forEach: forEach,
  bind: bind,
  _hasOwnProperty: _hasOwnProperty,
  _toString: _toString,
  isUndefined: isUndefined,
  isString: isString,
  isDate: isDate,
  isBoolean: isBoolean,
  isNumber: isNumber,
  isJSONString: isJSONString,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isArray: isArray,
  isFuction: isFuction,
  isArguments: isArguments,
  toString: toString$1,
  unique: unique,
  include: include,
  values: values,
  toArray: toArray,
  each: each,
  formatDate: formatDate,
  searchObjDate: searchObjDate,
  utf8Encode: utf8Encode,
  decodeURIComponent: decodeURIComponent,
  encodeDates: encodeDates,
  base64Encode: base64Encode,
  trim: trim,
  isFunction: isFunction,
  extend: extend,
  extend2Lev: extend2Lev,
  isEmptyObject: isEmptyObject,
  searchObjString: searchObjString,
  formatString: formatString,
}
var hasOwnProperty = Object.prototype.hasOwnProperty
function isFunction$1(t) {
  if (!t) return !1
  var e = Object.prototype.toString.call(t)
  return '[object Function]' == e || '[object AsyncFunction]' == e
}
function isObject$1(t) {
  return null != t && '[object Object]' == Object.prototype.toString.call(t)
}
function isString$1(t) {
  return '[object String]' == toString.call(t)
}
function log() {
  if ('object' == typeof console && console.log) {
    isString$1(arguments[0]) && (arguments[0] = 'sensors registerProperties————' + arguments[0])
    try {
      return console.log.apply(console, arguments)
    } catch (t) {
      console.log('sensors registerProperties————', arguments[0])
    }
  }
}
function extend$1(t) {
  return (
    each$1(Array.prototype.slice.call(arguments, 1), function (e) {
      for (var a in e) void 0 !== e[a] && (t[a] = e[a])
    }),
    t
  )
}
function each$1(t, e, a) {
  var r = Array.prototype.forEach,
    n = {}
  if (null == t) return !1
  if (r && t.forEach === r) t.forEach(e, a)
  else if (t.length === +t.length) {
    for (var s = 0, i = t.length; s < i; s++) if (s in t && e.call(a, t[s], s, t) === n) return !1
  } else for (var o in t) if (hasOwnProperty.call(t, o) && e.call(a, t[o], o, t) === n) return !1
}
var _$1 = {
    isFunction: isFunction$1,
    isObject: isObject$1,
    extend: extend$1,
    log: log,
    each: each$1,
  },
  RegisterProperties = { status: !1, version: 'props_sdk_version' },
  register_list = []
function onEventSend(t) {
  var e = RegisterProperties._sa
  return _$1.isObject(t) && 'track' === t.type
    ? (e &&
        e.store &&
        _$1.isFunction(e.store.getProps) &&
        (t.properties = _$1.extend({}, e.properties, e.store.getProps(), e.currentProps, t.properties)),
      getRegisterProperties(t))
    : {}
}
function getRegisterProperties(t) {
  var e = {}
  return (
    _$1.each(register_list, function (a) {
      var r = {}
      if (_$1.isFunction(a)) r = a({ event: t.event, properties: t.properties, data: t })
      else -1 !== a.events.indexOf(t.event) && (r = a.properties)
      e = Object.assign(e, r)
    }),
    _$1.isObject(e) ? e : {}
  )
}
function stripProperties(t) {
  return isObject(t)
    ? (each(t, function (e, a) {
        if (isArray(e)) {
          var r = []
          each(e, function (t) {
            isString(t)
              ? r.push(t)
              : sa.log(
                  '\u60a8\u7684\u6570\u636e-',
                  e,
                  '\u7684\u6570\u7ec4\u91cc\u7684\u503c\u5fc5\u987b\u662f\u5b57\u7b26\u4e32,\u5df2\u7ecf\u5c06\u5176\u5220\u9664',
                )
          }),
            0 !== r.length ? (t[a] = r) : (delete t[a], sa.log('\u5df2\u7ecf\u5220\u9664\u7a7a\u7684\u6570\u7ec4'))
        }
        isString(e) ||
          isNumber(e) ||
          isDate(e) ||
          isBoolean(e) ||
          isArray(e) ||
          (sa.log(
            '\u60a8\u7684\u6570\u636e-',
            e,
            '-\u683c\u5f0f\u4e0d\u6ee1\u8db3\u8981\u6c42\uff0c\u6211\u4eec\u5df2\u7ecf\u5c06\u5176\u5220\u9664',
          ),
          delete t[a])
      }),
      t)
    : t
}
function batchSend() {
  if (sa.batch_state.sended) {
    var t = sa.batch_state.mem,
      e = t.length
    e > 0 && ((sa.batch_state.sended = !1), batchRequest({ data: t, len: e, success: batchRemove, fail: sendFail }))
  }
}
function batchRequest(t) {
  if (isArray(t.data) && t.data.length > 0) {
    var e = Date.now(),
      a = sa.para.datasend_timeout
    t.data.forEach(function (t) {
      t._flush_time = e
    }),
      (t.data = JSON.stringify(t.data))
    let r = {
      url: sa.para.server_url,
      method: 'POST',
      dataType: 'text',
      data: 'data_list=' + encodeURIComponent(base64Encode(t.data)),
      timeout: a,
      success: function () {
        t.success(t.len)
      },
      fail: function () {
        t.fail()
      },
    }
    sa.lib && 'KuaishouMini' === sa.lib.name && (r.header = { 'Content-Type': 'application/x-www-form-urlencoded' }),
      sa.system_api.request(r)
  } else t.success(t.len)
}
function sendFail() {
  ;(sa.batch_state.sended = !0), sa.batch_state.failTime++
}
function batchRemove(t) {
  sa.batch_state.clear(t),
    (sa.batch_state.sended = !0),
    (sa.batch_state.changed = !0),
    batchWrite(),
    (sa.batch_state.failTime = 0)
}
function batchWrite() {
  sa.batch_state.changed &&
    (sa.batch_state.is_first_batch_write &&
      ((sa.batch_state.is_first_batch_write = !1),
      setTimeout(function () {
        batchSend()
      }, 1e3)),
    sa.batch_state.syncStorage &&
      (sa.system_api.setStorageSync('sensors_prepare_data', sa.batch_state.mem), (sa.batch_state.changed = !1)))
}
function batchInterval() {
  !(function t() {
    setTimeout(function () {
      batchWrite(), t()
    }, 1e3)
  })(),
    (function t() {
      setTimeout(function () {
        batchSend(), t()
      }, sa.para.batch_send.send_timeout * Math.pow(2, sa.batch_state.failTime))
    })()
}
function singleSend(t) {
  t._flush_time = Date.now()
  var e = ''
  t = JSON.stringify(t)
  e =
    -1 !== sa.para.server_url.indexOf('?')
      ? sa.para.server_url + '&data=' + encodeURIComponent(base64Encode(t))
      : sa.para.server_url + '?data=' + encodeURIComponent(base64Encode(t))
  var a = sa.para.datasend_timeout
  sa.system_api.request({
    url: e,
    dataType: 'text',
    method: 'GET',
    timeout: a,
  })
}
function reportEvent(t) {
  var e = ''
  ;(t._flush_time = Date.now()),
    (e = t.event ? 'sensors_' + t.event : 'sensors_' + t.type),
    (t.dataSource = 'sensors'),
    sa.log('report_event, name: ', e, '-- key: ', t),
    (t.event_name = e),
    sa.platform_obj.call('private-sensors-track-event', {
      data: JSON.stringify(t),
    })
}
;(RegisterProperties.init = function (t) {
  if (!t || !_$1.isObject(t)) return _$1.log('\u8bf7\u4f20\u5165\u6b63\u786e\u7684 sensors \u5bf9\u8c61\uff01'), !1
  if (((RegisterProperties._sa = t), t.kit && _$1.isObject(t.kit))) {
    var e = t.kit.onEventSend
    t.kit.onEventSend = function (a) {
      var r = e(a),
        n = onEventSend(a)
      return t._.extend(r, n)
    }
  }
  RegisterProperties.status = !0
}),
  (RegisterProperties.register = function (t) {
    t && _$1.isObject(t)
      ? t.properties && _$1.isObject(t.properties) && t.events && t.events.length > 0 && register_list.push(t)
      : _$1.log('\u53c2\u6570\u9519\u8bef\uff01')
  }),
  (RegisterProperties.hookRegister = function (t) {
    _$1.isFunction(t) && register_list.push(t)
  }),
  (sa.batch_state = {
    mem: [],
    changed: !1,
    sended: !0,
    is_first_batch_write: !0,
    sync_storage: !1,
    failTime: 0,
    getLength: function () {
      return this.mem.length
    },
    add: function (t) {
      this.mem.push(t)
    },
    clear: function (t) {
      this.mem.splice(0, t)
    },
  }),
  (sa.prepareData = function (t, e) {
    var a = {
      distinct_id: sa.store.getDistinctId(),
      lib: {
        $lib: sa.lib.name,
        $lib_method: sa.lib.method,
        $lib_version: String(sa.lib.version),
      },
      properties: {},
    }
    a = extend(a, t)
    var r = sa._.extend2Lev(t),
      n = sa.kit.onEventSend(r)
    if (
      (isObject(t.properties) && !isEmptyObject(t.properties) && (a.properties = extend(a.properties, t.properties)),
      (t.type && 'profile' === t.type.slice(0, 7)) ||
        (sa.para.batch_send &&
          (a._track_id = Number(
            String(getRandom()).slice(2, 5) + String(getRandom()).slice(2, 4) + String(Date.now()).slice(-4),
          )),
        (a.properties = extend({}, sa.properties, sa.currentProps, n, a.properties)),
        'object' == typeof sa.store._state &&
        'number' == typeof sa.store._state.first_visit_day_time &&
        sa.store._state.first_visit_day_time > new Date().getTime()
          ? (a.properties.$is_first_day = !0)
          : (a.properties.$is_first_day = !1)),
      a.properties.$time && isDate(a.properties.$time)
        ? ((a.time = 1 * a.properties.$time), delete a.properties.$time)
        : (a.time = 1 * new Date()),
      stripProperties(a.properties),
      searchObjDate(a),
      searchObjString(a),
      !sa.para.server_url)
    )
      return !1
    sa.log(a), sa.send(a)
  }),
  (sa.send = function (t) {
    if (
      ((t._nocache = (String(getRandom()) + String(getRandom()) + String(getRandom())).slice(2, 15)),
      'sensorsdata2015_binance' === sa.storageName && 'native' === sa.para.data_report_type)
    )
      return reportEvent(t), !1
    if (sa.para.batch_send) {
      if (sa.batch_state.getLength() >= 300)
        return sa.log('\u6570\u636e\u91cf\u5b58\u50a8\u8fc7\u5927\uff0c\u6709\u5f02\u5e38'), !1
      sa.batch_state.add(t),
        (sa.batch_state.changed = !0),
        sa.batch_state.getLength() >= sa.para.batch_send.max_length && batchSend()
    } else singleSend(t)
  }),
  (sa.log = function () {
    if (sa.para.show_log && 'object' == typeof console && console.log)
      try {
        var t = Array.prototype.slice.call(arguments)
        return console.log.apply(console, t)
      } catch (t) {
        console.log(arguments[0])
      }
  }),
  (sa.track = function (t, e, a) {
    sa.prepareData({ type: 'track', event: t, properties: e }, a)
  }),
  (sa.setProfile = function (t) {
    sa.prepareData({ type: 'profile_set', properties: t })
  }),
  (sa.setOnceProfile = function (t, e) {
    sa.prepareData({ type: 'profile_set_once', properties: t }, e)
  }),
  (sa.login = function (t) {
    var e = sa.store.getFirstId(),
      a = sa.store.getDistinctId()
    t !== a && (e ? sa.trackSignup(t, '$SignUp') : (sa.store.set('first_id', a), sa.trackSignup(t, '$SignUp')))
  }),
  (sa.logout = function (t) {
    var e = sa.store.getFirstId()
    e
      ? (sa.store.set('first_id', ''),
        !0 === t ? sa.store.set('distinct_id', getUUID()) : sa.store.set('distinct_id', e))
      : sa.log('\u6ca1\u6709first_id\uff0clogout\u5931\u8d25')
  }),
  (sa.identify = function (t) {
    if ('number' == typeof t) t = String(t)
    else if ('string' != typeof t) return !1
    sa.store.getFirstId() ? sa.store.set('first_id', t) : sa.store.set('distinct_id', t)
  }),
  (sa.trackSignup = function (t, e, a) {
    sa.prepareData({
      original_id: sa.store.getFirstId() || sa.store.getDistinctId(),
      distinct_id: t,
      type: 'track_signup',
      event: e,
      properties: a,
    }),
      sa.store.set('distinct_id', t)
  }),
  (sa.registerApp = function (t) {
    isObject(t) && !isEmptyObject(t) && (sa.currentProps = extend(sa.currentProps, t))
  }),
  (sa.clearAppRegister = function (t) {
    isArray(t) &&
      each(sa.currentProps, function (e, a) {
        include(t, a) && delete sa.currentProps[a]
      })
  }),
  (sa.register = function (t) {
    RegisterProperties.register(t)
  }),
  (sa.hookRegister = function (t) {
    RegisterProperties.hookRegister(t)
  }),
  (sa.use = function (t) {
    const e = this._installedPlugins || (this._installedPlugins = [])
    if (e.indexOf(t) > -1) return this
    const a = toArray(arguments, 1)
    return (
      a.unshift(this),
      'function' == typeof t.init ? t.init.apply(t, a) : 'function' == typeof t && t.apply(null, a),
      e.push(t),
      this
    )
  }),
  (sa.init = function () {
    if (!0 === sa.hasExeInit) return !1
    ;(this.hasExeInit = !0),
      sa.store.init(),
      sa.system.init(),
      sa.para.batch_send &&
        (sa.system_api.getStorage('sensors_prepare_data', function (t) {
          var e = []
          t && t.data && isArray(t.data) && ((e = t.data), (sa.batch_state.mem = e.concat(sa.batch_state.mem))),
            (sa.batch_state.syncStorage = !0)
        }),
        batchInterval())
  }),
  (sa.setPara = function (t) {
    sa.para = extend2Lev(sa.para, t)
    var e = []
    if (isArray(sa.para.source_channel))
      for (var a = sa.para.source_channel.length, r = 0; r < a; r++)
        -1 ===
          ' utm_source utm_medium utm_campaign utm_content utm_term sa_utm '.indexOf(
            ' ' + sa.para.source_channel[r] + ' ',
          ) && e.push(sa.para.source_channel[r])
    ;(sa.para.source_channel = e), 'number' != typeof sa.para.send_timeout && (sa.para.send_timeout = 1e3)
    var n = { send_timeout: 6e3, max_length: 6 }
    ;(t && t.datasend_timeout) || (sa.para.batch_send && (sa.para.datasend_timeout = 1e4)),
      !0 === sa.para.batch_send
        ? (sa.para.batch_send = extend({}, n))
        : isObject(sa.para.batch_send) && (sa.para.batch_send = extend({}, n, sa.para.batch_send)),
      sa.para.server_url
        ? (sa.para.preset_properties = isObject(sa.para.preset_properties) ? sa.para.preset_properties : {})
        : sa.log(
            '\u8bf7\u4f7f\u7528 setPara() \u65b9\u6cd5\u8bbe\u7f6e server_url \u6570\u636e\u63a5\u6536\u5730\u5740,\u8be6\u60c5\u53ef\u67e5\u770bhttps://www.sensorsdata.cn/manual/mp_sdk_new.html#112-%E5%BC%95%E5%85%A5%E5%B9%B6%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0',
          )
  }),
  (sa.checkInit = function () {
    !0 === sa.system.inited &&
      !0 === sa.store.inited &&
      ((sa.inited = !0),
      sa._queue.length > 0 &&
        (each(sa._queue, function (t) {
          sa[t[0]].apply(sa, slice.call(t[1]))
        }),
        (sa._queue = [])))
  }),
  each(
    ['setProfile', 'setOnceProfile', 'track', 'login', 'logout', 'identify', 'registerApp', 'clearAppRegister'],
    function (t) {
      var e = sa[t]
      sa[t] = function () {
        sa.inited ? e.apply(sa, arguments) : sa._queue.push([t, arguments])
      }
    },
  )
var store = {
  inited: !1,
  storageInfo: null,
  _state: {},
  toState: function (t) {
    isObject(t) && t.distinct_id ? (this._state = t) : this.set('distinct_id', getUUID())
  },
  getFirstId: function () {
    return this._state.first_id
  },
  getDistinctId: function () {
    return this._state.distinct_id
  },
  getUnionId: function () {
    var t = {},
      e = this._state.first_id,
      a = this._state.distinct_id
    return e && a ? ((t.login_id = a), (t.anonymous_id = e)) : (t.anonymous_id = a), t
  },
  getProps: function () {
    return this._state.props || {}
  },
  setProps: function (t, e) {
    var a = this._state.props || {}
    e ? this.set('props', t) : (extend(a, t), this.set('props', a))
  },
  set: function (t, e) {
    var a = {}
    for (var r in ('string' == typeof t ? (a[t] = e) : 'object' == typeof t && (a = t),
    (this._state = this._state || {}),
    a))
      this._state[r] = a[r]
    this.save()
  },
  save: function () {
    sa.system_api.setStorage(sa.storageName, this._state)
  },
  init: function () {
    var t = this
    sa.system_api.getStorage(sa.storageName, function (e) {
      if (e && e.data) t.toState(e.data), sa.checkInit()
      else {
        sa.is_first_launch = !0
        var a = new Date(),
          r = a.getTime()
        a.setHours(23),
          a.setMinutes(59),
          a.setSeconds(60),
          sa.setOnceProfile({ $first_visit_time: new Date() }),
          t.set({
            distinct_id: getUUID(),
            first_visit_time: r,
            first_visit_day_time: a.getTime(),
          })
      }
      ;(t.inited = !0), sa.checkInit()
    })
  },
}
function getNetworkStatusChange() {
  return new Promise(function (t) {
    sa.platform_obj.canIUse('onNetworkStatusChange') &&
      sa.platform_obj.onNetworkStatusChange((t) => {
        sa.properties.$network_type = t.networkType
      }),
      sa.platform_obj.canIUse('getNetworkType')
        ? sa.platform_obj.getNetworkType({
            success(t) {
              sa.properties.$network_type = t.networkType
            },
            fail(t) {
              sa.log('\u83b7\u53d6\u7f51\u7edc\u72b6\u6001\u4fe1\u606f\u5931\u8d25\uff1a ', t)
            },
            complete() {
              t()
            },
          })
        : t()
  })
}
function getSystemInfo() {
  return new Promise((t, e) => {
    sa.platform_obj.getSystemInfo({
      success(t) {
        var e = sa.properties
        isObject(t) &&
          ((e.$manufacturer = t.brand),
          (e.$model = t.model),
          (e.$screen_width = Number(t.screenWidth)),
          (e.$screen_height = Number(t.screenHeight)),
          (e.$os = formatSystem(t.platform)),
          (e.$os_version = t.system.indexOf(' ') > -1 ? t.system.split(' ')[1] : t.system))
      },
      fail(t) {
        sa.log('\u83b7\u53d6\u7cfb\u7edf\u4fe1\u606f\u5931\u8d25: ', t)
      },
      complete() {
        t()
      },
    })
  })
}
function getIsLoginStatus() {
  return new Promise(function (t) {
    sa.platform_obj.canIUse('isLoggedIn')
      ? sa.platform_obj.isLoggedIn({
          success(t) {
            isObject(t) && (sa.properties.$is_login_id = t.result)
          },
          fail(t) {
            sa.log('\u83b7\u53d6\u7f51\u7edc\u72b6\u6001\u4fe1\u606f\u5931\u8d25\uff1a ', t)
          },
          complete() {
            t()
          },
        })
      : t()
  })
}
function getSystemInfoSync() {
  return new Promise((t, e) => {
    if (sa.platform_obj.canIUse('getSystemInfoSync')) {
      var a = sa.platform_obj.getSystemInfoSync(),
        r = sa.properties
      isObject(a) &&
        ((r.$app_version = a.host.hostAppVersion),
        (r.$app_name = a.host.hostAppName),
        (r.$app_id = a.host.appId),
        (r.$mp_client_basic_library_version = a.SDKVersion),
        (r.$mp_client_app_version = a.version))
    }
    t()
  })
}
sa.store = store
var system = {
  inited: !1,
  init: function () {
    var t = new Date().getTimezoneOffset()
    isNumber(t) && (sa.properties.$timezone_offset = t)
    var e = sa.para.app_id || sa.para.appid
    e && (sa.properties.$app_id = e)
    var a = getNetworkStatusChange(),
      r = getSystemInfo(),
      n = getSystemInfoSync(),
      s = getIsLoginStatus()
    Promise.all([r, n, a, s]).then(function () {
      ;(sa.system.inited = !0), sa.checkInit()
    })
  },
}
function request(t) {
  var e, a
  t.timeout && ((e = t.timeout), delete t.timeout)
  var r = sa.platform_obj.request({
    ...t,
    complete: function () {
      clearTimeout(a)
    },
  })
  a = setTimeout(function () {
    try {
      isObject(r) && isFunction(r.abort) && r.abort()
    } catch (t) {
      sa.log(t)
    }
  }, e)
}
function getStorage(t, e) {
  try {
    sa.platform_obj.getStorage({ key: t, success: a, fail: a })
  } catch (e) {
    try {
      sa.platform_obj.getStorage({ key: t, success: a, fail: a })
    } catch (t) {
      sa.log('\u83b7\u53d6 storage \u5931\u8d25\uff01', t)
    }
  }
  function a(t) {
    if (t && t.data && isJSONString(t.data))
      try {
        var a = JSON.parse(t.data)
        t.data = a
      } catch (t) {
        sa.log('parse res.data \u5931\u8d25\uff01', t)
      }
    e(t)
  }
}
function setStorage(t, e) {
  var a
  try {
    a = JSON.stringify(e)
  } catch (t) {
    sa.log('\u5e8f\u5217\u5316\u7f13\u5b58\u5bf9\u8c61\u5931\u8d25\uff01', t)
  }
  try {
    sa.platform_obj.setStorage({ key: t, data: a })
  } catch (e) {
    try {
      sa.platform_obj.setStorage({ key: t, data: a })
    } catch (t) {
      sa.log('\u8bbe\u7f6e storage \u5931\u8d25: ', t)
    }
  }
}
function getStorageSync(t) {
  var e = ''
  try {
    e = sa.platform_obj.getStorageSync(t)
  } catch (a) {
    try {
      e = sa.platform_obj.getStorageSync(t)
    } catch (t) {
      sa.log('\u83b7\u53d6 storage \u5931\u8d25\uff01')
    }
  }
  return isJSONString(e) && (e = JSON.parse(e)), e
}
function setStorageSync(t, e) {
  var a
  try {
    a = JSON.stringify(e)
  } catch (t) {
    sa.log('\u5e8f\u5217\u5316\u7f13\u5b58\u5bf9\u8c61\u5931\u8d25\uff01', t)
  }
  var r = function () {
    sa.platform_obj.setStorageSync(t, a)
  }
  try {
    r()
  } catch (t) {
    sa.log('set Storage fail --', t)
    try {
      r()
    } catch (t) {
      sa.log('set Storage fail again --', t)
    }
  }
}
var compose = {
  request: request,
  getStorage: getStorage,
  setStorage: setStorage,
  getStorageSync: getStorageSync,
  setStorageSync: setStorageSync,
}
let autoTrack = { _sa: null }
const forEach$1 = Array.prototype.forEach,
  slice$1 = Array.prototype.slice,
  _hasOwnProperty$1 = Object.prototype.hasOwnProperty,
  _toString$1 = Object.prototype.toString
function extend$2(t) {
  return (
    each$2(slice$1.call(arguments, 1), function (e) {
      for (var a in e) void 0 !== e[a] && (t[a] = e[a])
    }),
    t
  )
}
function isObject$2(t) {
  return null !== t && 'object' == typeof t
}
function isFunction$2(t) {
  if (!t) return !1
  var e = Object.prototype.toString.call(t)
  return '[object Function]' == e || '[object AsyncFunction]' == e || '[object GeneratorFunction]' == e
}
function isString$2(t) {
  return '[object String]' == _toString$1.call(t)
}
function each$2(t, e, a) {
  if (null == t) return !1
  if (forEach$1 && t.forEach === forEach$1) t.forEach(e, a)
  else if (t.length === +t.length) {
    for (var r = 0, n = t.length; r < n; r++) if (r in t && e.call(a, t[r], r, t) === {}) return !1
  } else for (var s in t) if (_hasOwnProperty$1.call(t, s) && e.call(a, t[s], s, t) === {}) return !1
}
function getPath(t) {
  return (t = 'string' == typeof t ? t.replace(/^\//, '') : '\u53d6\u503c\u5f02\u5e38')
}
function getCurrentPath() {
  var t = '\u672a\u53d6\u5230',
    e = getCurrentPage()
  return e && e.route && (t = e.route), t
}
function getCurrentPage() {
  var t,
    e = {}
  try {
    e = (t =
      'sensorsdata2015_binance' === autoTrack._sa.storageName
        ? autoTrack._sa.platform_obj.getCurrentPages()
        : getCurrentPages())[t.length - 1]
  } catch (t) {
    autoTrack._sa.log(t)
  }
  return e
}
function getScene(t) {
  return (
    !(!autoTrack._sa.scene_prefix || !isString$2(autoTrack._sa.scene_prefix)) &&
    ('number' == typeof t || ('string' == typeof t && '' !== t)
      ? (t = autoTrack._sa.scene_prefix + String(t))
      : '\u672a\u53d6\u5230\u503c')
  )
}
function appLaunch(t, e) {
  var a = {}
  if ((t && t.path && (a.$url_path = getPath(t.path)), t && t.scene)) {
    var r = getScene(t.scene)
    r && ((a.$scene = r), autoTrack._sa.registerApp({ $latest_scene: r }))
  }
  autoTrack._sa.is_first_launch ? (a.$is_first_time = !0) : (a.$is_first_time = !1),
    isObject$2(e) && (a = extend$2(a, e)),
    autoTrack._sa.para.autoTrack.appLaunch && autoTrack._sa.track('$MPLaunch', a)
}
function appShow(t, e) {
  var a = {}
  if (
    (isObject$2(e) && (a = extend$2(a, e)),
    (autoTrack._sa.mpshow_time = new Date().getTime()),
    t && t.path && (a.$url_path = getPath(t.path)),
    t && t.scene)
  ) {
    var r = getScene(t.scene)
    r && ((a.$scene = r), autoTrack._sa.registerApp({ $latest_scene: r }))
  }
  autoTrack._sa.para.autoTrack.appShow && autoTrack._sa.track('$MPShow', a)
}
function appHide(t) {
  var e = new Date().getTime(),
    a = {}
  isObject$2(t) && (a = extend$2(a, t)),
    (a.$url_path = getCurrentPath()),
    autoTrack._sa.mpshow_time &&
      e - autoTrack._sa.mpshow_time > 0 &&
      (e - autoTrack._sa.mpshow_time) / 36e5 < 24 &&
      (a.event_duration = (e - autoTrack._sa.mpshow_time) / 1e3),
    autoTrack._sa.para.autoTrack.appHide && autoTrack._sa.track('$MPHide', a)
}
function pageShow(t) {
  var e = {},
    a = getCurrentPath()
  isObject$2(t) && (e = extend$2(e, t)),
    (e.$url_path = a),
    (e.$referrer = autoTrack._sa.sa_referrer),
    autoTrack._sa.para.autoTrack.pageShow && autoTrack._sa.track('$MPViewScreen', e),
    (autoTrack._sa.sa_referrer = a)
}
function pageLoad(t) {}
function pageShare() {
  if (autoTrack._sa.para.autoTrack && autoTrack._sa.para.autoTrack.pageShare) {
    var t = {
      $url_path: getCurrentPath(),
      $share_method: '\u8f6c\u53d1\u6d88\u606f\u5361\u7247',
      $referrer: autoTrack._sa.sa_referrer,
      $share_depth: autoTrack._sa.query_share_depth,
    }
    autoTrack._sa.track('$MPShare', t)
  }
}
const MP_HOOKS = {
  data: 1,
  onLoad: 1,
  onShow: 1,
  onReady: 1,
  onPullDownRefresh: 1,
  onReachBottom: 1,
  onShareAppMessage: 1,
  onPageScroll: 1,
  onResize: 1,
  onTabItemTap: 1,
  onHide: 1,
  onUnload: 1,
}
function isClick(t) {
  return !!{ tap: 1, longtap: 1, longpress: 1 }[t]
}
function getMethods(t) {
  var e = []
  for (var a in t) 'function' != typeof t[a] || MP_HOOKS[a] || e.push(a)
  return e
}
function clickTrack(t) {
  var e,
    a = {},
    r = {},
    n = t.currentTarget || {},
    s = t.target || {}
  if (
    isObject$2(autoTrack._sa.para.framework) &&
    isObject$2(autoTrack._sa.para.framework.taro) &&
    !autoTrack._sa.para.framework.taro.createApp &&
    s.id &&
    n.id &&
    s.id !== n.id
  )
    return !1
  var i = n.dataset || {}
  if (
    ((e = t.type),
    (a.$element_id = n.id),
    (a.$element_type = i.type),
    (a.$element_content = i.content),
    (a.$element_name = i.name),
    isObject$2(t.event_prop) && (r = t.event_prop),
    e && isClick(e))
  ) {
    if (
      autoTrack._sa.para.preset_events &&
      autoTrack._sa.para.preset_events.collect_element &&
      !1 === autoTrack._sa.para.preset_events.collect_element(arguments[0])
    )
      return !1
    if (((a.$url_path = getCurrentPath()), binanceClickFilter(a))) return !1
    ;(a = extend$2(a, r)), autoTrack._sa.track('$MPClick', a)
  }
}
function binanceClickFilter(t) {
  var e = !1
  return t.$element_id.indexOf(t.$url_path) >= 0 && (e = !0), e
}
function clickProxy(t, e) {
  var a = t[e]
  t[e] = function () {
    var t = a.apply(this, arguments),
      e = arguments[0]
    return isObject$2(e) && clickTrack(e), t
  }
}
var preset_events = {
  appLaunch: !0,
  appShow: !0,
  appHide: !0,
  pageShow: !0,
  mpClick: !0,
}
;(autoTrack.init = function (t, e) {
  ;(autoTrack._sa = t),
    (t.appLaunch = appLaunch),
    (t.appShow = appShow),
    (t.appHide = appHide),
    (t.pageShow = pageShow),
    (t.pageShare = pageShare),
    t.platform_obj &&
      t.platform_obj.onShareAppMessage &&
      t.platform_obj.onShareAppMessage(() => {
        pageShare()
      }),
    this.setPresetEvents(t, e)
}),
  (autoTrack.setPresetEvents = function (t, e) {
    if (
      ((t.para.autoTrack = extend$2(preset_events, e)),
      isFunction$2(t.platform_obj.onAppShow) &&
        isFunction$2(t.platform_obj.onAppHide) &&
        isFunction$2(t.platform_obj.getLaunchOptionsSync))
    )
      t.platform_obj.onAppShow(function (e) {
        if (!t.para.launched) {
          var a = t.platform_obj.getLaunchOptionsSync() || {}
          t.appLaunch(a), (t.para.launched = !0)
        }
        t.appShow(e)
      }),
        t.platform_obj.onAppHide(function () {
          t.appHide()
        })
    else {
      var a = App
      try {
        App = function (e) {
          var r = e.onShow,
            n = e.onLaunch,
            s = e.onHide
          ;(e.onLaunch = function () {
            ;(this[t.para.name] = t), n && n.apply(this, arguments), t.appLaunch(arguments[0], {}, !0)
          }),
            (e.onShow = function () {
              r && r.apply(this, arguments), t.appShow(arguments[0], {}, !0)
            }),
            (e.onHide = function () {
              s && s.apply(this, arguments), t.appHide({}, !0)
            }),
            a.apply(this, arguments)
        }
      } catch (t) {
        a.apply(this, arguments)
      }
    }
    var r = Page,
      n = Component
    try {
      ;(Page = function (e) {
        try {
          var a
          if ((t.para.autoTrack && t.para.autoTrack.mpClick && (a = getMethods(e)), a))
            for (var n = 0, s = a.length; n < s; n++) clickProxy(e, a[n])
          var i = e.onLoad,
            o = e.onShow
          ;(e.onLoad = function () {
            i && i.apply(this, arguments), pageLoad.apply(this, arguments)
          }),
            (e.onShow = function () {
              o && o.apply(this), pageShow.apply(this)
            }),
            r.apply(this, arguments)
        } catch (t) {
          r.apply(this, arguments)
        }
      }),
        (Component = function (t) {
          try {
            var e = t.methods.onLoad,
              a = t.methods.onShow
            ;(t.methods.onLoad = function () {
              e && e.apply(this, arguments), pageLoad.apply(this, arguments)
            }),
              (t.methods.onShow = function () {
                a && a.apply(this), pageShow.apply(this)
              }),
              n.apply(this, arguments)
          } catch (t) {
            n.apply(this, arguments)
          }
        })
    } catch (t) {
      ;(Page = function () {
        r.apply(this, arguments)
      }),
        (Component = function () {
          n.apply(this, arguments)
        })
    }
  })
var kit = {
  onEventSend: function (t) {
    return {}
  },
}
Object.defineProperty(sa.para, 'batch_send', { value: !1, writable: !1 }),
  (sa._ = _),
  (sa.kit = kit),
  (sa.lib.name = 'MiniProgram'),
  (sa.properties.$lib = 'MiniProgram'),
  (sa.system = system),
  (sa.system_api = compose),
  (sa.storageName = 'sensorsdata2015_binance'),
  (sa.scene_prefix = 'bn-'),
  (sa.platform_obj = mpService),
  (sa.para.data_report_type = 'native'),
  (sa.setPara = function (t) {
    if (((sa.para = extend2Lev(sa.para, t)), 'native' !== sa.para.data_report_type && !sa.para.server_url))
      return (
        sa.log(
          '\u8bf7\u4f7f\u7528 setPara() \u65b9\u6cd5\u8bbe\u7f6e server_url \u6570\u636e\u63a5\u6536\u5730\u5740,\u8be6\u60c5\u53ef\u67e5\u770bhttps://www.sensorsdata.cn/manual/mp_sdk_new.html#112-%E5%BC%95%E5%85%A5%E5%B9%B6%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0',
        ),
        !1
      )
    'native' === sa.para.data_report_type && (sa.para.server_url = !0)
  }),
  RegisterProperties.init(sa),
  autoTrack.init(sa)
export default sa
