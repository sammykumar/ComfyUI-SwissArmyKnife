import { app as Dh } from "../../../scripts/app.js";
import { ComponentWidgetImpl as wh, addWidget as kh } from "../../../scripts/domWidget.js";
import { defineComponent as Yl, toRaw as Ph, shallowRef as Oa, computed as qn, ref as hr, readonly as Ih, onMounted as Oh, watch as Rn, normalizeClass as Li, onBeforeUnmount as Ql, h as _u, createElementBlock as qr, openBlock as Ar, createElementVNode as _t, Fragment as Lh, renderList as Fh, toDisplayString as Dr, createBlock as Rh, unref as Ei, createVNode as xn } from "vue";
import La from "primevue/button";
import Mh from "primevue/slider";
var jn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vr(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function Nh(s) {
  if (Object.prototype.hasOwnProperty.call(s, "__esModule")) return s;
  var r = s.default;
  if (typeof r == "function") {
    var n = function i() {
      return this instanceof i ? Reflect.construct(r, arguments, this.constructor) : r.apply(this, arguments);
    };
    n.prototype = r.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(s).forEach(function(i) {
    var e = Object.getOwnPropertyDescriptor(s, i);
    Object.defineProperty(n, i, e.get ? e : {
      enumerable: !0,
      get: function() {
        return s[i];
      }
    });
  }), n;
}
var Fa, Tu;
function ua() {
  if (Tu) return Fa;
  Tu = 1;
  var s;
  return typeof window < "u" ? s = window : typeof jn < "u" ? s = jn : typeof self < "u" ? s = self : s = {}, Fa = s, Fa;
}
var Bh = ua();
const P = /* @__PURE__ */ vr(Bh), Uh = {}, Vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Uh
}, Symbol.toStringTag, { value: "Module" })), qh = /* @__PURE__ */ Nh(Vh);
var Ra, bu;
function Jl() {
  if (bu) return Ra;
  bu = 1;
  var s = typeof jn < "u" ? jn : typeof window < "u" ? window : {}, r = qh, n;
  return typeof document < "u" ? n = document : (n = s["__GLOBAL_DOCUMENT_CACHE@4"], n || (n = s["__GLOBAL_DOCUMENT_CACHE@4"] = r)), Ra = n, Ra;
}
var jh = Jl();
const ae = /* @__PURE__ */ vr(jh);
function Ot() {
  return Ot = Object.assign ? Object.assign.bind() : function(s) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var i in n) ({}).hasOwnProperty.call(n, i) && (s[i] = n[i]);
    }
    return s;
  }, Ot.apply(null, arguments);
}
var Sn = { exports: {} }, xu;
function Hh() {
  return xu || (xu = 1, (function(s, r) {
    function n(u) {
      if (u && typeof u == "object") {
        var l = u.which || u.keyCode || u.charCode;
        l && (u = l);
      }
      if (typeof u == "number") return a[u];
      var c = String(u), m = i[c.toLowerCase()];
      if (m) return m;
      var m = e[c.toLowerCase()];
      if (m) return m;
      if (c.length === 1) return c.charCodeAt(0);
    }
    n.isEventKey = function(l, c) {
      if (l && typeof l == "object") {
        var m = l.which || l.keyCode || l.charCode;
        if (m == null)
          return !1;
        if (typeof c == "string") {
          var g = i[c.toLowerCase()];
          if (g)
            return g === m;
          var g = e[c.toLowerCase()];
          if (g)
            return g === m;
        } else if (typeof c == "number")
          return c === m;
        return !1;
      }
    }, r = s.exports = n;
    var i = r.code = r.codes = {
      backspace: 8,
      tab: 9,
      enter: 13,
      shift: 16,
      ctrl: 17,
      alt: 18,
      "pause/break": 19,
      "caps lock": 20,
      esc: 27,
      space: 32,
      "page up": 33,
      "page down": 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      insert: 45,
      delete: 46,
      command: 91,
      "left command": 91,
      "right command": 93,
      "numpad *": 106,
      "numpad +": 107,
      "numpad -": 109,
      "numpad .": 110,
      "numpad /": 111,
      "num lock": 144,
      "scroll lock": 145,
      "my computer": 182,
      "my calculator": 183,
      ";": 186,
      "=": 187,
      ",": 188,
      "-": 189,
      ".": 190,
      "/": 191,
      "`": 192,
      "[": 219,
      "\\": 220,
      "]": 221,
      "'": 222
    }, e = r.aliases = {
      windows: 91,
      "⇧": 16,
      "⌥": 18,
      "⌃": 17,
      "⌘": 91,
      ctl: 17,
      control: 17,
      option: 18,
      pause: 19,
      break: 19,
      caps: 20,
      return: 13,
      escape: 27,
      spc: 32,
      spacebar: 32,
      pgup: 33,
      pgdn: 34,
      ins: 45,
      del: 46,
      cmd: 91
    };
    /*!
     * Programatically add the following
     */
    for (t = 97; t < 123; t++) i[String.fromCharCode(t)] = t - 32;
    for (var t = 48; t < 58; t++) i[t - 48] = t;
    for (t = 1; t < 13; t++) i["f" + t] = t + 111;
    for (t = 0; t < 10; t++) i["numpad " + t] = t + 96;
    var a = r.names = r.title = {};
    for (t in i) a[i[t]] = t;
    for (var o in e)
      i[o] = e[o];
  })(Sn, Sn.exports)), Sn.exports;
}
var Wh = Hh();
const _e = /* @__PURE__ */ vr(Wh);
function ye(s) {
  if (s === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return s;
}
function Jr(s, r) {
  return Jr = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, Jr(s, r);
}
function oe(s, r) {
  s.prototype = Object.create(r.prototype), s.prototype.constructor = s, Jr(s, r);
}
var Ma, Su;
function Gh() {
  if (Su) return Ma;
  Su = 1, Ma = s;
  function s(r, n) {
    var i, e = null;
    try {
      i = JSON.parse(r, n);
    } catch (t) {
      e = t;
    }
    return [e, i];
  }
  return Ma;
}
var zh = Gh();
const Kh = /* @__PURE__ */ vr(zh);
var En = { exports: {} }, Na = { exports: {} }, Eu;
function $h() {
  return Eu || (Eu = 1, (function(s) {
    function r() {
      return s.exports = r = Object.assign ? Object.assign.bind() : function(n) {
        for (var i = 1; i < arguments.length; i++) {
          var e = arguments[i];
          for (var t in e) ({}).hasOwnProperty.call(e, t) && (n[t] = e[t]);
        }
        return n;
      }, s.exports.__esModule = !0, s.exports.default = s.exports, r.apply(null, arguments);
    }
    s.exports = r, s.exports.__esModule = !0, s.exports.default = s.exports;
  })(Na)), Na.exports;
}
var Ba, Cu;
function Xh() {
  if (Cu) return Ba;
  Cu = 1, Ba = r;
  var s = Object.prototype.toString;
  function r(n) {
    if (!n)
      return !1;
    var i = s.call(n);
    return i === "[object Function]" || typeof n == "function" && i !== "[object RegExp]" || typeof window < "u" && // IE8 and below
    (n === window.setTimeout || n === window.alert || n === window.confirm || n === window.prompt);
  }
  return Ba;
}
var Ua, Au;
function Yh() {
  if (Au) return Ua;
  Au = 1;
  var s = ua(), r = function(e, t) {
    return t === void 0 && (t = !1), function(a, o, u) {
      if (a) {
        e(a);
        return;
      }
      if (o.statusCode >= 400 && o.statusCode <= 599) {
        var l = u;
        if (t)
          if (s.TextDecoder) {
            var c = n(o.headers && o.headers["content-type"]);
            try {
              l = new TextDecoder(c).decode(u);
            } catch {
            }
          } else
            l = String.fromCharCode.apply(null, new Uint8Array(u));
        e({
          cause: l
        });
        return;
      }
      e(null, u);
    };
  };
  function n(i) {
    return i === void 0 && (i = ""), i.toLowerCase().split(";").reduce(function(e, t) {
      var a = t.split("="), o = a[0], u = a[1];
      return o.trim() === "charset" ? u.trim() : e;
    }, "utf-8");
  }
  return Ua = r, Ua;
}
var Du;
function Qh() {
  if (Du) return En.exports;
  Du = 1;
  var s = ua(), r = $h(), n = Xh();
  o.httpHandler = Yh();
  /**
   * @license
   * slighly modified parse-headers 2.0.2 <https://github.com/kesla/parse-headers/>
   * Copyright (c) 2014 David Björklund
   * Available under the MIT license
   * <https://github.com/kesla/parse-headers/blob/master/LICENCE>
   */
  var i = function(g) {
    var _ = {};
    return g && g.trim().split(`
`).forEach(function(C) {
      var w = C.indexOf(":"), E = C.slice(0, w).trim().toLowerCase(), M = C.slice(w + 1).trim();
      typeof _[E] > "u" ? _[E] = M : Array.isArray(_[E]) ? _[E].push(M) : _[E] = [_[E], M];
    }), _;
  };
  En.exports = o, En.exports.default = o, o.XMLHttpRequest = s.XMLHttpRequest || c, o.XDomainRequest = "withCredentials" in new o.XMLHttpRequest() ? o.XMLHttpRequest : s.XDomainRequest, e(["get", "put", "post", "patch", "head", "delete"], function(m) {
    o[m === "delete" ? "del" : m] = function(g, _, C) {
      return _ = a(g, _, C), _.method = m.toUpperCase(), u(_);
    };
  });
  function e(m, g) {
    for (var _ = 0; _ < m.length; _++)
      g(m[_]);
  }
  function t(m) {
    for (var g in m)
      if (m.hasOwnProperty(g)) return !1;
    return !0;
  }
  function a(m, g, _) {
    var C = m;
    return n(g) ? (_ = g, typeof m == "string" && (C = {
      uri: m
    })) : C = r({}, g, {
      uri: m
    }), C.callback = _, C;
  }
  function o(m, g, _) {
    return g = a(m, g, _), u(g);
  }
  function u(m) {
    if (typeof m.callback > "u")
      throw new Error("callback argument missing");
    var g = !1, _ = function(K, Y, re) {
      g || (g = !0, m.callback(K, Y, re));
    };
    function C() {
      B.readyState === 4 && setTimeout(M, 0);
    }
    function w() {
      var j = void 0;
      if (B.response ? j = B.response : j = B.responseText || l(B), b)
        try {
          j = JSON.parse(j);
        } catch {
        }
      return j;
    }
    function E(j) {
      return clearTimeout(L), j instanceof Error || (j = new Error("" + (j || "Unknown XMLHttpRequest Error"))), j.statusCode = 0, _(j, R);
    }
    function M() {
      if (!W) {
        var j;
        clearTimeout(L), m.useXDR && B.status === void 0 ? j = 200 : j = B.status === 1223 ? 204 : B.status;
        var K = R, Y = null;
        return j !== 0 ? (K = {
          body: w(),
          statusCode: j,
          method: $,
          headers: {},
          url: H,
          rawRequest: B
        }, B.getAllResponseHeaders && (K.headers = i(B.getAllResponseHeaders()))) : Y = new Error("Internal XMLHttpRequest Error"), _(Y, K, K.body);
      }
    }
    var B = m.xhr || null;
    B || (m.cors || m.useXDR ? B = new o.XDomainRequest() : B = new o.XMLHttpRequest());
    var z, W, H = B.url = m.uri || m.url, $ = B.method = m.method || "GET", N = m.body || m.data, q = B.headers = m.headers || {}, T = !!m.sync, b = !1, L, R = {
      body: void 0,
      headers: {},
      statusCode: 0,
      method: $,
      url: H,
      rawRequest: B
    };
    if ("json" in m && m.json !== !1 && (b = !0, q.accept || q.Accept || (q.Accept = "application/json"), $ !== "GET" && $ !== "HEAD" && (q["content-type"] || q["Content-Type"] || (q["Content-Type"] = "application/json"), N = JSON.stringify(m.json === !0 ? N : m.json))), B.onreadystatechange = C, B.onload = M, B.onerror = E, B.onprogress = function() {
    }, B.onabort = function() {
      W = !0;
    }, B.ontimeout = E, B.open($, H, !T, m.username, m.password), T || (B.withCredentials = !!m.withCredentials), !T && m.timeout > 0 && (L = setTimeout(function() {
      if (!W) {
        W = !0, B.abort("timeout");
        var j = new Error("XMLHttpRequest timeout");
        j.code = "ETIMEDOUT", E(j);
      }
    }, m.timeout)), B.setRequestHeader)
      for (z in q)
        q.hasOwnProperty(z) && B.setRequestHeader(z, q[z]);
    else if (m.headers && !t(m.headers))
      throw new Error("Headers cannot be set on an XDomainRequest object");
    return "responseType" in m && (B.responseType = m.responseType), "beforeSend" in m && typeof m.beforeSend == "function" && m.beforeSend(B), B.send(N || null), B;
  }
  function l(m) {
    try {
      if (m.responseType === "document")
        return m.responseXML;
      var g = m.responseXML && m.responseXML.documentElement.nodeName === "parsererror";
      if (m.responseType === "" && !g)
        return m.responseXML;
    } catch {
    }
    return null;
  }
  function c() {
  }
  return En.exports;
}
var Jh = Qh();
const Zl = /* @__PURE__ */ vr(Jh);
var Va = { exports: {} }, qa, wu;
function Zh() {
  if (wu) return qa;
  wu = 1;
  var s = Jl(), r = Object.create || /* @__PURE__ */ (function() {
    function T() {
    }
    return function(b) {
      if (arguments.length !== 1)
        throw new Error("Object.create shim only accepts one parameter.");
      return T.prototype = b, new T();
    };
  })();
  function n(T, b) {
    this.name = "ParsingError", this.code = T.code, this.message = b || T.message;
  }
  n.prototype = r(Error.prototype), n.prototype.constructor = n, n.Errors = {
    BadSignature: {
      code: 0,
      message: "Malformed WebVTT signature."
    },
    BadTimeStamp: {
      code: 1,
      message: "Malformed time stamp."
    }
  };
  function i(T) {
    function b(R, j, K, Y) {
      return (R | 0) * 3600 + (j | 0) * 60 + (K | 0) + (Y | 0) / 1e3;
    }
    var L = T.match(/^(\d+):(\d{1,2})(:\d{1,2})?\.(\d{3})/);
    return L ? L[3] ? b(L[1], L[2], L[3].replace(":", ""), L[4]) : L[1] > 59 ? b(L[1], L[2], 0, L[4]) : b(0, L[1], L[2], L[4]) : null;
  }
  function e() {
    this.values = r(null);
  }
  e.prototype = {
    // Only accept the first assignment to any key.
    set: function(T, b) {
      !this.get(T) && b !== "" && (this.values[T] = b);
    },
    // Return the value for a key, or a default value.
    // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
    // a number of possible default values as properties where 'defaultKey' is
    // the key of the property that will be chosen; otherwise it's assumed to be
    // a single value.
    get: function(T, b, L) {
      return L ? this.has(T) ? this.values[T] : b[L] : this.has(T) ? this.values[T] : b;
    },
    // Check whether we have a value for a key.
    has: function(T) {
      return T in this.values;
    },
    // Accept a setting if its one of the given alternatives.
    alt: function(T, b, L) {
      for (var R = 0; R < L.length; ++R)
        if (b === L[R]) {
          this.set(T, b);
          break;
        }
    },
    // Accept a setting if its a valid (signed) integer.
    integer: function(T, b) {
      /^-?\d+$/.test(b) && this.set(T, parseInt(b, 10));
    },
    // Accept a setting if its a valid percentage.
    percent: function(T, b) {
      return b.match(/^([\d]{1,3})(\.[\d]*)?%$/) && (b = parseFloat(b), b >= 0 && b <= 100) ? (this.set(T, b), !0) : !1;
    }
  };
  function t(T, b, L, R) {
    var j = R ? T.split(R) : [T];
    for (var K in j)
      if (typeof j[K] == "string") {
        var Y = j[K].split(L);
        if (Y.length === 2) {
          var re = Y[0].trim(), J = Y[1].trim();
          b(re, J);
        }
      }
  }
  function a(T, b, L) {
    var R = T;
    function j() {
      var re = i(T);
      if (re === null)
        throw new n(
          n.Errors.BadTimeStamp,
          "Malformed timestamp: " + R
        );
      return T = T.replace(/^[^\sa-zA-Z-]+/, ""), re;
    }
    function K(re, J) {
      var ee = new e();
      t(re, function(Z, Q) {
        switch (Z) {
          case "region":
            for (var ie = L.length - 1; ie >= 0; ie--)
              if (L[ie].id === Q) {
                ee.set(Z, L[ie].region);
                break;
              }
            break;
          case "vertical":
            ee.alt(Z, Q, ["rl", "lr"]);
            break;
          case "line":
            var he = Q.split(","), me = he[0];
            ee.integer(Z, me), ee.percent(Z, me) && ee.set("snapToLines", !1), ee.alt(Z, me, ["auto"]), he.length === 2 && ee.alt("lineAlign", he[1], ["start", "center", "end"]);
            break;
          case "position":
            he = Q.split(","), ee.percent(Z, he[0]), he.length === 2 && ee.alt("positionAlign", he[1], ["start", "center", "end"]);
            break;
          case "size":
            ee.percent(Z, Q);
            break;
          case "align":
            ee.alt(Z, Q, ["start", "center", "end", "left", "right"]);
            break;
        }
      }, /:/, /\s/), J.region = ee.get("region", null), J.vertical = ee.get("vertical", "");
      try {
        J.line = ee.get("line", "auto");
      } catch {
      }
      J.lineAlign = ee.get("lineAlign", "start"), J.snapToLines = ee.get("snapToLines", !0), J.size = ee.get("size", 100);
      try {
        J.align = ee.get("align", "center");
      } catch {
        J.align = ee.get("align", "middle");
      }
      try {
        J.position = ee.get("position", "auto");
      } catch {
        J.position = ee.get("position", {
          start: 0,
          left: 0,
          center: 50,
          middle: 50,
          end: 100,
          right: 100
        }, J.align);
      }
      J.positionAlign = ee.get("positionAlign", {
        start: "start",
        left: "start",
        center: "center",
        middle: "center",
        end: "end",
        right: "end"
      }, J.align);
    }
    function Y() {
      T = T.replace(/^\s+/, "");
    }
    if (Y(), b.startTime = j(), Y(), T.substr(0, 3) !== "-->")
      throw new n(
        n.Errors.BadTimeStamp,
        "Malformed time stamp (time stamps must be separated by '-->'): " + R
      );
    T = T.substr(3), Y(), b.endTime = j(), Y(), K(T, b);
  }
  var o = s.createElement && s.createElement("textarea"), u = {
    c: "span",
    i: "i",
    b: "b",
    u: "u",
    ruby: "ruby",
    rt: "rt",
    v: "span",
    lang: "span"
  }, l = {
    white: "rgba(255,255,255,1)",
    lime: "rgba(0,255,0,1)",
    cyan: "rgba(0,255,255,1)",
    red: "rgba(255,0,0,1)",
    yellow: "rgba(255,255,0,1)",
    magenta: "rgba(255,0,255,1)",
    blue: "rgba(0,0,255,1)",
    black: "rgba(0,0,0,1)"
  }, c = {
    v: "title",
    lang: "lang"
  }, m = {
    rt: "ruby"
  };
  function g(T, b) {
    function L() {
      if (!b)
        return null;
      function me(ce) {
        return b = b.substr(ce.length), ce;
      }
      var ge = b.match(/^([^<]*)(<[^>]*>?)?/);
      return me(ge[1] ? ge[1] : ge[2]);
    }
    function R(me) {
      return o.innerHTML = me, me = o.textContent, o.textContent = "", me;
    }
    function j(me, ge) {
      return !m[ge.localName] || m[ge.localName] === me.localName;
    }
    function K(me, ge) {
      var ce = u[me];
      if (!ce)
        return null;
      var Pe = T.document.createElement(ce), Ve = c[me];
      return Ve && ge && (Pe[Ve] = ge.trim()), Pe;
    }
    for (var Y = T.document.createElement("div"), re = Y, J, ee = []; (J = L()) !== null; ) {
      if (J[0] === "<") {
        if (J[1] === "/") {
          ee.length && ee[ee.length - 1] === J.substr(2).replace(">", "") && (ee.pop(), re = re.parentNode);
          continue;
        }
        var Z = i(J.substr(1, J.length - 2)), Q;
        if (Z) {
          Q = T.document.createProcessingInstruction("timestamp", Z), re.appendChild(Q);
          continue;
        }
        var ie = J.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
        if (!ie || (Q = K(ie[1], ie[3]), !Q) || !j(re, Q))
          continue;
        if (ie[2]) {
          var he = ie[2].split(".");
          he.forEach(function(me) {
            var ge = /^bg_/.test(me), ce = ge ? me.slice(3) : me;
            if (l.hasOwnProperty(ce)) {
              var Pe = ge ? "background-color" : "color", Ve = l[ce];
              Q.style[Pe] = Ve;
            }
          }), Q.className = he.join(" ");
        }
        ee.push(ie[1]), re.appendChild(Q), re = Q;
        continue;
      }
      re.appendChild(T.document.createTextNode(R(J)));
    }
    return Y;
  }
  var _ = [
    [1470, 1470],
    [1472, 1472],
    [1475, 1475],
    [1478, 1478],
    [1488, 1514],
    [1520, 1524],
    [1544, 1544],
    [1547, 1547],
    [1549, 1549],
    [1563, 1563],
    [1566, 1610],
    [1645, 1647],
    [1649, 1749],
    [1765, 1766],
    [1774, 1775],
    [1786, 1805],
    [1807, 1808],
    [1810, 1839],
    [1869, 1957],
    [1969, 1969],
    [1984, 2026],
    [2036, 2037],
    [2042, 2042],
    [2048, 2069],
    [2074, 2074],
    [2084, 2084],
    [2088, 2088],
    [2096, 2110],
    [2112, 2136],
    [2142, 2142],
    [2208, 2208],
    [2210, 2220],
    [8207, 8207],
    [64285, 64285],
    [64287, 64296],
    [64298, 64310],
    [64312, 64316],
    [64318, 64318],
    [64320, 64321],
    [64323, 64324],
    [64326, 64449],
    [64467, 64829],
    [64848, 64911],
    [64914, 64967],
    [65008, 65020],
    [65136, 65140],
    [65142, 65276],
    [67584, 67589],
    [67592, 67592],
    [67594, 67637],
    [67639, 67640],
    [67644, 67644],
    [67647, 67669],
    [67671, 67679],
    [67840, 67867],
    [67872, 67897],
    [67903, 67903],
    [67968, 68023],
    [68030, 68031],
    [68096, 68096],
    [68112, 68115],
    [68117, 68119],
    [68121, 68147],
    [68160, 68167],
    [68176, 68184],
    [68192, 68223],
    [68352, 68405],
    [68416, 68437],
    [68440, 68466],
    [68472, 68479],
    [68608, 68680],
    [126464, 126467],
    [126469, 126495],
    [126497, 126498],
    [126500, 126500],
    [126503, 126503],
    [126505, 126514],
    [126516, 126519],
    [126521, 126521],
    [126523, 126523],
    [126530, 126530],
    [126535, 126535],
    [126537, 126537],
    [126539, 126539],
    [126541, 126543],
    [126545, 126546],
    [126548, 126548],
    [126551, 126551],
    [126553, 126553],
    [126555, 126555],
    [126557, 126557],
    [126559, 126559],
    [126561, 126562],
    [126564, 126564],
    [126567, 126570],
    [126572, 126578],
    [126580, 126583],
    [126585, 126588],
    [126590, 126590],
    [126592, 126601],
    [126603, 126619],
    [126625, 126627],
    [126629, 126633],
    [126635, 126651],
    [1114109, 1114109]
  ];
  function C(T) {
    for (var b = 0; b < _.length; b++) {
      var L = _[b];
      if (T >= L[0] && T <= L[1])
        return !0;
    }
    return !1;
  }
  function w(T) {
    var b = [], L = "", R;
    if (!T || !T.childNodes)
      return "ltr";
    function j(re, J) {
      for (var ee = J.childNodes.length - 1; ee >= 0; ee--)
        re.push(J.childNodes[ee]);
    }
    function K(re) {
      if (!re || !re.length)
        return null;
      var J = re.pop(), ee = J.textContent || J.innerText;
      if (ee) {
        var Z = ee.match(/^.*(\n|\r)/);
        return Z ? (re.length = 0, Z[0]) : ee;
      }
      if (J.tagName === "ruby")
        return K(re);
      if (J.childNodes)
        return j(re, J), K(re);
    }
    for (j(b, T); L = K(b); )
      for (var Y = 0; Y < L.length; Y++)
        if (R = L.charCodeAt(Y), C(R))
          return "rtl";
    return "ltr";
  }
  function E(T) {
    if (typeof T.line == "number" && (T.snapToLines || T.line >= 0 && T.line <= 100))
      return T.line;
    if (!T.track || !T.track.textTrackList || !T.track.textTrackList.mediaElement)
      return -1;
    for (var b = T.track, L = b.textTrackList, R = 0, j = 0; j < L.length && L[j] !== b; j++)
      L[j].mode === "showing" && R++;
    return ++R * -1;
  }
  function M() {
  }
  M.prototype.applyStyles = function(T, b) {
    b = b || this.div;
    for (var L in T)
      T.hasOwnProperty(L) && (b.style[L] = T[L]);
  }, M.prototype.formatStyle = function(T, b) {
    return T === 0 ? 0 : T + b;
  };
  function B(T, b, L) {
    M.call(this), this.cue = b, this.cueDiv = g(T, b.text);
    var R = {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      position: "relative",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "inline",
      writingMode: b.vertical === "" ? "horizontal-tb" : b.vertical === "lr" ? "vertical-lr" : "vertical-rl",
      unicodeBidi: "plaintext"
    };
    this.applyStyles(R, this.cueDiv), this.div = T.document.createElement("div"), R = {
      direction: w(this.cueDiv),
      writingMode: b.vertical === "" ? "horizontal-tb" : b.vertical === "lr" ? "vertical-lr" : "vertical-rl",
      unicodeBidi: "plaintext",
      textAlign: b.align === "middle" ? "center" : b.align,
      font: L.font,
      whiteSpace: "pre-line",
      position: "absolute"
    }, this.applyStyles(R), this.div.appendChild(this.cueDiv);
    var j = 0;
    switch (b.positionAlign) {
      case "start":
      case "line-left":
        j = b.position;
        break;
      case "center":
        j = b.position - b.size / 2;
        break;
      case "end":
      case "line-right":
        j = b.position - b.size;
        break;
    }
    b.vertical === "" ? this.applyStyles({
      left: this.formatStyle(j, "%"),
      width: this.formatStyle(b.size, "%")
    }) : this.applyStyles({
      top: this.formatStyle(j, "%"),
      height: this.formatStyle(b.size, "%")
    }), this.move = function(K) {
      this.applyStyles({
        top: this.formatStyle(K.top, "px"),
        bottom: this.formatStyle(K.bottom, "px"),
        left: this.formatStyle(K.left, "px"),
        right: this.formatStyle(K.right, "px"),
        height: this.formatStyle(K.height, "px"),
        width: this.formatStyle(K.width, "px")
      });
    };
  }
  B.prototype = r(M.prototype), B.prototype.constructor = B;
  function z(T) {
    var b, L, R, j;
    if (T.div) {
      L = T.div.offsetHeight, R = T.div.offsetWidth, j = T.div.offsetTop;
      var K = (K = T.div.childNodes) && (K = K[0]) && K.getClientRects && K.getClientRects();
      T = T.div.getBoundingClientRect(), b = K ? Math.max(K[0] && K[0].height || 0, T.height / K.length) : 0;
    }
    this.left = T.left, this.right = T.right, this.top = T.top || j, this.height = T.height || L, this.bottom = T.bottom || j + (T.height || L), this.width = T.width || R, this.lineHeight = b !== void 0 ? b : T.lineHeight;
  }
  z.prototype.move = function(T, b) {
    switch (b = b !== void 0 ? b : this.lineHeight, T) {
      case "+x":
        this.left += b, this.right += b;
        break;
      case "-x":
        this.left -= b, this.right -= b;
        break;
      case "+y":
        this.top += b, this.bottom += b;
        break;
      case "-y":
        this.top -= b, this.bottom -= b;
        break;
    }
  }, z.prototype.overlaps = function(T) {
    return this.left < T.right && this.right > T.left && this.top < T.bottom && this.bottom > T.top;
  }, z.prototype.overlapsAny = function(T) {
    for (var b = 0; b < T.length; b++)
      if (this.overlaps(T[b]))
        return !0;
    return !1;
  }, z.prototype.within = function(T) {
    return this.top >= T.top && this.bottom <= T.bottom && this.left >= T.left && this.right <= T.right;
  }, z.prototype.overlapsOppositeAxis = function(T, b) {
    switch (b) {
      case "+x":
        return this.left < T.left;
      case "-x":
        return this.right > T.right;
      case "+y":
        return this.top < T.top;
      case "-y":
        return this.bottom > T.bottom;
    }
  }, z.prototype.intersectPercentage = function(T) {
    var b = Math.max(0, Math.min(this.right, T.right) - Math.max(this.left, T.left)), L = Math.max(0, Math.min(this.bottom, T.bottom) - Math.max(this.top, T.top)), R = b * L;
    return R / (this.height * this.width);
  }, z.prototype.toCSSCompatValues = function(T) {
    return {
      top: this.top - T.top,
      bottom: T.bottom - this.bottom,
      left: this.left - T.left,
      right: T.right - this.right,
      height: this.height,
      width: this.width
    };
  }, z.getSimpleBoxPosition = function(T) {
    var b = T.div ? T.div.offsetHeight : T.tagName ? T.offsetHeight : 0, L = T.div ? T.div.offsetWidth : T.tagName ? T.offsetWidth : 0, R = T.div ? T.div.offsetTop : T.tagName ? T.offsetTop : 0;
    T = T.div ? T.div.getBoundingClientRect() : T.tagName ? T.getBoundingClientRect() : T;
    var j = {
      left: T.left,
      right: T.right,
      top: T.top || R,
      height: T.height || b,
      bottom: T.bottom || R + (T.height || b),
      width: T.width || L
    };
    return j;
  };
  function W(T, b, L, R) {
    function j(ce, Pe) {
      for (var Ve, Ie = new z(ce), qe = 1, St = 0; St < Pe.length; St++) {
        for (; ce.overlapsOppositeAxis(L, Pe[St]) || ce.within(L) && ce.overlapsAny(R); )
          ce.move(Pe[St]);
        if (ce.within(L))
          return ce;
        var Xe = ce.intersectPercentage(L);
        qe > Xe && (Ve = new z(ce), qe = Xe), ce = new z(Ie);
      }
      return Ve || Ie;
    }
    var K = new z(b), Y = b.cue, re = E(Y), J = [];
    if (Y.snapToLines) {
      var ee;
      switch (Y.vertical) {
        case "":
          J = ["+y", "-y"], ee = "height";
          break;
        case "rl":
          J = ["+x", "-x"], ee = "width";
          break;
        case "lr":
          J = ["-x", "+x"], ee = "width";
          break;
      }
      var Z = K.lineHeight, Q = Z * Math.round(re), ie = L[ee] + Z, he = J[0];
      Math.abs(Q) > ie && (Q = Q < 0 ? -1 : 1, Q *= Math.ceil(ie / Z) * Z), re < 0 && (Q += Y.vertical === "" ? L.height : L.width, J = J.reverse()), K.move(he, Q);
    } else {
      var me = K.lineHeight / L.height * 100;
      switch (Y.lineAlign) {
        case "center":
          re -= me / 2;
          break;
        case "end":
          re -= me;
          break;
      }
      switch (Y.vertical) {
        case "":
          b.applyStyles({
            top: b.formatStyle(re, "%")
          });
          break;
        case "rl":
          b.applyStyles({
            left: b.formatStyle(re, "%")
          });
          break;
        case "lr":
          b.applyStyles({
            right: b.formatStyle(re, "%")
          });
          break;
      }
      J = ["+y", "-x", "+x", "-y"], K = new z(b);
    }
    var ge = j(K, J);
    b.move(ge.toCSSCompatValues(L));
  }
  function H() {
  }
  H.StringDecoder = function() {
    return {
      decode: function(T) {
        if (!T)
          return "";
        if (typeof T != "string")
          throw new Error("Error - expected string data.");
        return decodeURIComponent(encodeURIComponent(T));
      }
    };
  }, H.convertCueToDOMTree = function(T, b) {
    return !T || !b ? null : g(T, b);
  };
  var $ = 0.05, N = "sans-serif", q = "1.5%";
  return H.processCues = function(T, b, L) {
    if (!T || !b || !L)
      return null;
    for (; L.firstChild; )
      L.removeChild(L.firstChild);
    var R = T.document.createElement("div");
    R.style.position = "absolute", R.style.left = "0", R.style.right = "0", R.style.top = "0", R.style.bottom = "0", R.style.margin = q, L.appendChild(R);
    function j(Z) {
      for (var Q = 0; Q < Z.length; Q++)
        if (Z[Q].hasBeenReset || !Z[Q].displayState)
          return !0;
      return !1;
    }
    if (!j(b)) {
      for (var K = 0; K < b.length; K++)
        R.appendChild(b[K].displayState);
      return;
    }
    var Y = [], re = z.getSimpleBoxPosition(R), J = Math.round(re.height * $ * 100) / 100, ee = {
      font: J + "px " + N
    };
    (function() {
      for (var Z, Q, ie = 0; ie < b.length; ie++)
        Q = b[ie], Z = new B(T, Q, ee), R.appendChild(Z.div), W(T, Z, re, Y), Q.displayState = Z.div, Y.push(z.getSimpleBoxPosition(Z));
    })();
  }, H.Parser = function(T, b, L) {
    L || (L = b, b = {}), b || (b = {}), this.window = T, this.vttjs = b, this.state = "INITIAL", this.buffer = "", this.decoder = L || new TextDecoder("utf8"), this.regionList = [];
  }, H.Parser.prototype = {
    // If the error is a ParsingError then report it to the consumer if
    // possible. If it's not a ParsingError then throw it like normal.
    reportOrThrowError: function(T) {
      if (T instanceof n)
        this.onparsingerror && this.onparsingerror(T);
      else
        throw T;
    },
    parse: function(T) {
      var b = this;
      T && (b.buffer += b.decoder.decode(T, { stream: !0 }));
      function L() {
        for (var Z = b.buffer, Q = 0; Q < Z.length && Z[Q] !== "\r" && Z[Q] !== `
`; )
          ++Q;
        var ie = Z.substr(0, Q);
        return Z[Q] === "\r" && ++Q, Z[Q] === `
` && ++Q, b.buffer = Z.substr(Q), ie;
      }
      function R(Z) {
        var Q = new e();
        if (t(Z, function(he, me) {
          switch (he) {
            case "id":
              Q.set(he, me);
              break;
            case "width":
              Q.percent(he, me);
              break;
            case "lines":
              Q.integer(he, me);
              break;
            case "regionanchor":
            case "viewportanchor":
              var ge = me.split(",");
              if (ge.length !== 2)
                break;
              var ce = new e();
              if (ce.percent("x", ge[0]), ce.percent("y", ge[1]), !ce.has("x") || !ce.has("y"))
                break;
              Q.set(he + "X", ce.get("x")), Q.set(he + "Y", ce.get("y"));
              break;
            case "scroll":
              Q.alt(he, me, ["up"]);
              break;
          }
        }, /=/, /\s/), Q.has("id")) {
          var ie = new (b.vttjs.VTTRegion || b.window.VTTRegion)();
          ie.width = Q.get("width", 100), ie.lines = Q.get("lines", 3), ie.regionAnchorX = Q.get("regionanchorX", 0), ie.regionAnchorY = Q.get("regionanchorY", 100), ie.viewportAnchorX = Q.get("viewportanchorX", 0), ie.viewportAnchorY = Q.get("viewportanchorY", 100), ie.scroll = Q.get("scroll", ""), b.onregion && b.onregion(ie), b.regionList.push({
            id: Q.get("id"),
            region: ie
          });
        }
      }
      function j(Z) {
        var Q = new e();
        t(Z, function(ie, he) {
          switch (ie) {
            case "MPEGT":
              Q.integer(ie + "S", he);
              break;
            case "LOCA":
              Q.set(ie + "L", i(he));
              break;
          }
        }, /[^\d]:/, /,/), b.ontimestampmap && b.ontimestampmap({
          MPEGTS: Q.get("MPEGTS"),
          LOCAL: Q.get("LOCAL")
        });
      }
      function K(Z) {
        Z.match(/X-TIMESTAMP-MAP/) ? t(Z, function(Q, ie) {
          switch (Q) {
            case "X-TIMESTAMP-MAP":
              j(ie);
              break;
          }
        }, /=/) : t(Z, function(Q, ie) {
          switch (Q) {
            case "Region":
              R(ie);
              break;
          }
        }, /:/);
      }
      try {
        var Y;
        if (b.state === "INITIAL") {
          if (!/\r\n|\n/.test(b.buffer))
            return this;
          Y = L();
          var re = Y.match(/^WEBVTT([ \t].*)?$/);
          if (!re || !re[0])
            throw new n(n.Errors.BadSignature);
          b.state = "HEADER";
        }
        for (var J = !1; b.buffer; ) {
          if (!/\r\n|\n/.test(b.buffer))
            return this;
          switch (J ? J = !1 : Y = L(), b.state) {
            case "HEADER":
              /:/.test(Y) ? K(Y) : Y || (b.state = "ID");
              continue;
            case "NOTE":
              Y || (b.state = "ID");
              continue;
            case "ID":
              if (/^NOTE($|[ \t])/.test(Y)) {
                b.state = "NOTE";
                break;
              }
              if (!Y)
                continue;
              b.cue = new (b.vttjs.VTTCue || b.window.VTTCue)(0, 0, "");
              try {
                b.cue.align = "center";
              } catch {
                b.cue.align = "middle";
              }
              if (b.state = "CUE", Y.indexOf("-->") === -1) {
                b.cue.id = Y;
                continue;
              }
            // Process line as start of a cue.
            /*falls through*/
            case "CUE":
              try {
                a(Y, b.cue, b.regionList);
              } catch (Z) {
                b.reportOrThrowError(Z), b.cue = null, b.state = "BADCUE";
                continue;
              }
              b.state = "CUETEXT";
              continue;
            case "CUETEXT":
              var ee = Y.indexOf("-->") !== -1;
              if (!Y || ee && (J = !0)) {
                b.oncue && b.oncue(b.cue), b.cue = null, b.state = "ID";
                continue;
              }
              b.cue.text && (b.cue.text += `
`), b.cue.text += Y.replace(/\u2028/g, `
`).replace(/u2029/g, `
`);
              continue;
            case "BADCUE":
              Y || (b.state = "ID");
              continue;
          }
        }
      } catch (Z) {
        b.reportOrThrowError(Z), b.state === "CUETEXT" && b.cue && b.oncue && b.oncue(b.cue), b.cue = null, b.state = b.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
      }
      return this;
    },
    flush: function() {
      var T = this;
      try {
        if (T.buffer += T.decoder.decode(), (T.cue || T.state === "HEADER") && (T.buffer += `

`, T.parse()), T.state === "INITIAL")
          throw new n(n.Errors.BadSignature);
      } catch (b) {
        T.reportOrThrowError(b);
      }
      return T.onflush && T.onflush(), this;
    }
  }, qa = H, qa;
}
var ja, ku;
function ep() {
  if (ku) return ja;
  ku = 1;
  var s = "auto", r = {
    "": 1,
    lr: 1,
    rl: 1
  }, n = {
    start: 1,
    center: 1,
    end: 1,
    left: 1,
    right: 1,
    auto: 1,
    "line-left": 1,
    "line-right": 1
  };
  function i(a) {
    if (typeof a != "string")
      return !1;
    var o = r[a.toLowerCase()];
    return o ? a.toLowerCase() : !1;
  }
  function e(a) {
    if (typeof a != "string")
      return !1;
    var o = n[a.toLowerCase()];
    return o ? a.toLowerCase() : !1;
  }
  function t(a, o, u) {
    this.hasBeenReset = !1;
    var l = "", c = !1, m = a, g = o, _ = u, C = null, w = "", E = !0, M = "auto", B = "start", z = "auto", W = "auto", H = 100, $ = "center";
    Object.defineProperties(this, {
      id: {
        enumerable: !0,
        get: function() {
          return l;
        },
        set: function(N) {
          l = "" + N;
        }
      },
      pauseOnExit: {
        enumerable: !0,
        get: function() {
          return c;
        },
        set: function(N) {
          c = !!N;
        }
      },
      startTime: {
        enumerable: !0,
        get: function() {
          return m;
        },
        set: function(N) {
          if (typeof N != "number")
            throw new TypeError("Start time must be set to a number.");
          m = N, this.hasBeenReset = !0;
        }
      },
      endTime: {
        enumerable: !0,
        get: function() {
          return g;
        },
        set: function(N) {
          if (typeof N != "number")
            throw new TypeError("End time must be set to a number.");
          g = N, this.hasBeenReset = !0;
        }
      },
      text: {
        enumerable: !0,
        get: function() {
          return _;
        },
        set: function(N) {
          _ = "" + N, this.hasBeenReset = !0;
        }
      },
      region: {
        enumerable: !0,
        get: function() {
          return C;
        },
        set: function(N) {
          C = N, this.hasBeenReset = !0;
        }
      },
      vertical: {
        enumerable: !0,
        get: function() {
          return w;
        },
        set: function(N) {
          var q = i(N);
          if (q === !1)
            throw new SyntaxError("Vertical: an invalid or illegal direction string was specified.");
          w = q, this.hasBeenReset = !0;
        }
      },
      snapToLines: {
        enumerable: !0,
        get: function() {
          return E;
        },
        set: function(N) {
          E = !!N, this.hasBeenReset = !0;
        }
      },
      line: {
        enumerable: !0,
        get: function() {
          return M;
        },
        set: function(N) {
          if (typeof N != "number" && N !== s)
            throw new SyntaxError("Line: an invalid number or illegal string was specified.");
          M = N, this.hasBeenReset = !0;
        }
      },
      lineAlign: {
        enumerable: !0,
        get: function() {
          return B;
        },
        set: function(N) {
          var q = e(N);
          q ? (B = q, this.hasBeenReset = !0) : console.warn("lineAlign: an invalid or illegal string was specified.");
        }
      },
      position: {
        enumerable: !0,
        get: function() {
          return z;
        },
        set: function(N) {
          if (N < 0 || N > 100)
            throw new Error("Position must be between 0 and 100.");
          z = N, this.hasBeenReset = !0;
        }
      },
      positionAlign: {
        enumerable: !0,
        get: function() {
          return W;
        },
        set: function(N) {
          var q = e(N);
          q ? (W = q, this.hasBeenReset = !0) : console.warn("positionAlign: an invalid or illegal string was specified.");
        }
      },
      size: {
        enumerable: !0,
        get: function() {
          return H;
        },
        set: function(N) {
          if (N < 0 || N > 100)
            throw new Error("Size must be between 0 and 100.");
          H = N, this.hasBeenReset = !0;
        }
      },
      align: {
        enumerable: !0,
        get: function() {
          return $;
        },
        set: function(N) {
          var q = e(N);
          if (!q)
            throw new SyntaxError("align: an invalid or illegal alignment string was specified.");
          $ = q, this.hasBeenReset = !0;
        }
      }
    }), this.displayState = void 0;
  }
  return t.prototype.getCueAsHTML = function() {
    return WebVTT.convertCueToDOMTree(window, this.text);
  }, ja = t, ja;
}
var Ha, Pu;
function tp() {
  if (Pu) return Ha;
  Pu = 1;
  var s = {
    "": !0,
    up: !0
  };
  function r(e) {
    if (typeof e != "string")
      return !1;
    var t = s[e.toLowerCase()];
    return t ? e.toLowerCase() : !1;
  }
  function n(e) {
    return typeof e == "number" && e >= 0 && e <= 100;
  }
  function i() {
    var e = 100, t = 3, a = 0, o = 100, u = 0, l = 100, c = "";
    Object.defineProperties(this, {
      width: {
        enumerable: !0,
        get: function() {
          return e;
        },
        set: function(m) {
          if (!n(m))
            throw new Error("Width must be between 0 and 100.");
          e = m;
        }
      },
      lines: {
        enumerable: !0,
        get: function() {
          return t;
        },
        set: function(m) {
          if (typeof m != "number")
            throw new TypeError("Lines must be set to a number.");
          t = m;
        }
      },
      regionAnchorY: {
        enumerable: !0,
        get: function() {
          return o;
        },
        set: function(m) {
          if (!n(m))
            throw new Error("RegionAnchorX must be between 0 and 100.");
          o = m;
        }
      },
      regionAnchorX: {
        enumerable: !0,
        get: function() {
          return a;
        },
        set: function(m) {
          if (!n(m))
            throw new Error("RegionAnchorY must be between 0 and 100.");
          a = m;
        }
      },
      viewportAnchorY: {
        enumerable: !0,
        get: function() {
          return l;
        },
        set: function(m) {
          if (!n(m))
            throw new Error("ViewportAnchorY must be between 0 and 100.");
          l = m;
        }
      },
      viewportAnchorX: {
        enumerable: !0,
        get: function() {
          return u;
        },
        set: function(m) {
          if (!n(m))
            throw new Error("ViewportAnchorX must be between 0 and 100.");
          u = m;
        }
      },
      scroll: {
        enumerable: !0,
        get: function() {
          return c;
        },
        set: function(m) {
          var g = r(m);
          g === !1 ? console.warn("Scroll: an invalid or illegal string was specified.") : c = g;
        }
      }
    });
  }
  return Ha = i, Ha;
}
var Iu;
function rp() {
  if (Iu) return Va.exports;
  Iu = 1;
  var s = ua(), r = Va.exports = {
    WebVTT: Zh(),
    VTTCue: ep(),
    VTTRegion: tp()
  };
  s.vttjs = r, s.WebVTT = r.WebVTT;
  var n = r.VTTCue, i = r.VTTRegion, e = s.VTTCue, t = s.VTTRegion;
  return r.shim = function() {
    s.VTTCue = n, s.VTTRegion = i;
  }, r.restore = function() {
    s.VTTCue = e, s.VTTRegion = t;
  }, s.VTTCue || r.shim(), Va.exports;
}
var ip = rp();
const Ou = /* @__PURE__ */ vr(ip);
function ed() {
  try {
    var s = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (ed = function() {
    return !!s;
  })();
}
function td(s, r, n) {
  if (ed()) return Reflect.construct.apply(null, arguments);
  var i = [null];
  i.push.apply(i, r);
  var e = new (s.bind.apply(s, i))();
  return n && Jr(e, n.prototype), e;
}
function np(s, r) {
  if (typeof r != "function" && r !== null) throw new TypeError("Super expression must either be null or a function");
  s.prototype = Object.create(r && r.prototype, {
    constructor: {
      value: s,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(s, "prototype", {
    writable: !1
  }), r && Jr(s, r);
}
var Wa = { exports: {} }, Lu;
function ap() {
  return Lu || (Lu = 1, (function(s, r) {
    (function(n) {
      var i = /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/, e = /^(?=([^\/?#]*))\1([^]*)$/, t = /(?:\/|^)\.(?=\/)/g, a = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g, o = {
        // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
        // E.g
        // With opts.alwaysNormalize = false (default, spec compliant)
        // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
        // With opts.alwaysNormalize = true (not spec compliant)
        // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
        buildAbsoluteURL: function(u, l, c) {
          if (c = c || {}, u = u.trim(), l = l.trim(), !l) {
            if (!c.alwaysNormalize)
              return u;
            var m = o.parseURL(u);
            if (!m)
              throw new Error("Error trying to parse base URL.");
            return m.path = o.normalizePath(
              m.path
            ), o.buildURLFromParts(m);
          }
          var g = o.parseURL(l);
          if (!g)
            throw new Error("Error trying to parse relative URL.");
          if (g.scheme)
            return c.alwaysNormalize ? (g.path = o.normalizePath(g.path), o.buildURLFromParts(g)) : l;
          var _ = o.parseURL(u);
          if (!_)
            throw new Error("Error trying to parse base URL.");
          if (!_.netLoc && _.path && _.path[0] !== "/") {
            var C = e.exec(_.path);
            _.netLoc = C[1], _.path = C[2];
          }
          _.netLoc && !_.path && (_.path = "/");
          var w = {
            // 2c) Otherwise, the embedded URL inherits the scheme of
            // the base URL.
            scheme: _.scheme,
            netLoc: g.netLoc,
            path: null,
            params: g.params,
            query: g.query,
            fragment: g.fragment
          };
          if (!g.netLoc && (w.netLoc = _.netLoc, g.path[0] !== "/"))
            if (!g.path)
              w.path = _.path, g.params || (w.params = _.params, g.query || (w.query = _.query));
            else {
              var E = _.path, M = E.substring(0, E.lastIndexOf("/") + 1) + g.path;
              w.path = o.normalizePath(M);
            }
          return w.path === null && (w.path = c.alwaysNormalize ? o.normalizePath(g.path) : g.path), o.buildURLFromParts(w);
        },
        parseURL: function(u) {
          var l = i.exec(u);
          return l ? {
            scheme: l[1] || "",
            netLoc: l[2] || "",
            path: l[3] || "",
            params: l[4] || "",
            query: l[5] || "",
            fragment: l[6] || ""
          } : null;
        },
        normalizePath: function(u) {
          for (u = u.split("").reverse().join("").replace(t, ""); u.length !== (u = u.replace(a, "")).length; )
            ;
          return u.split("").reverse().join("");
        },
        buildURLFromParts: function(u) {
          return u.scheme + u.netLoc + u.path + u.params + u.query + u.fragment;
        }
      };
      s.exports = o;
    })();
  })(Wa)), Wa.exports;
}
var sp = ap();
const Fu = /* @__PURE__ */ vr(sp);
var Ru = "http://example.com", la = function(r, n) {
  if (/^[a-z]+:/i.test(n))
    return n;
  /^data:/.test(r) && (r = P.location && P.location.href || "");
  var i = typeof P.URL == "function", e = /^\/\//.test(r), t = !P.location && !/\/\//i.test(r);
  if (i ? r = new P.URL(r, P.location || Ru) : /\/\//i.test(r) || (r = Fu.buildAbsoluteURL(P.location && P.location.href || "", r)), i) {
    var a = new URL(n, r);
    return t ? a.href.slice(Ru.length) : e ? a.href.slice(a.protocol.length) : a.href;
  }
  return Fu.buildAbsoluteURL(r, n);
}, Ws = /* @__PURE__ */ (function() {
  function s() {
    this.listeners = {};
  }
  var r = s.prototype;
  return r.on = function(i, e) {
    this.listeners[i] || (this.listeners[i] = []), this.listeners[i].push(e);
  }, r.off = function(i, e) {
    if (!this.listeners[i])
      return !1;
    var t = this.listeners[i].indexOf(e);
    return this.listeners[i] = this.listeners[i].slice(0), this.listeners[i].splice(t, 1), t > -1;
  }, r.trigger = function(i) {
    var e = this.listeners[i];
    if (e)
      if (arguments.length === 2)
        for (var t = e.length, a = 0; a < t; ++a)
          e[a].call(this, arguments[1]);
      else
        for (var o = Array.prototype.slice.call(arguments, 1), u = e.length, l = 0; l < u; ++l)
          e[l].apply(this, o);
  }, r.dispose = function() {
    this.listeners = {};
  }, r.pipe = function(i) {
    this.on("data", function(e) {
      i.push(e);
    });
  }, s;
})(), op = function(r) {
  return P.atob ? P.atob(r) : Buffer.from(r, "base64").toString("binary");
};
function rd(s) {
  for (var r = op(s), n = new Uint8Array(r.length), i = 0; i < r.length; i++)
    n[i] = r.charCodeAt(i);
  return n;
}
/*! @name m3u8-parser @version 4.8.0 @license Apache-2.0 */
var up = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    var i;
    return i = s.call(this) || this, i.buffer = "", i;
  }
  var n = r.prototype;
  return n.push = function(e) {
    var t;
    for (this.buffer += e, t = this.buffer.indexOf(`
`); t > -1; t = this.buffer.indexOf(`
`))
      this.trigger("data", this.buffer.substring(0, t)), this.buffer = this.buffer.substring(t + 1);
  }, r;
})(Ws), lp = "	", Ga = function(r) {
  var n = /([0-9.]*)?@?([0-9.]*)?/.exec(r || ""), i = {};
  return n[1] && (i.length = parseInt(n[1], 10)), n[2] && (i.offset = parseInt(n[2], 10)), i;
}, dp = function() {
  var r = "[^=]*", n = '"[^"]*"|[^,]*', i = "(?:" + r + ")=(?:" + n + ")";
  return new RegExp("(?:^|,)(" + i + ")");
}, kt = function(r) {
  for (var n = r.split(dp()), i = {}, e = n.length, t; e--; )
    n[e] !== "" && (t = /([^=]*)=(.*)/.exec(n[e]).slice(1), t[0] = t[0].replace(/^\s+|\s+$/g, ""), t[1] = t[1].replace(/^\s+|\s+$/g, ""), t[1] = t[1].replace(/^['"](.*)['"]$/g, "$1"), i[t[0]] = t[1]);
  return i;
}, cp = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    var i;
    return i = s.call(this) || this, i.customParsers = [], i.tagMappers = [], i;
  }
  var n = r.prototype;
  return n.push = function(e) {
    var t = this, a, o;
    if (e = e.trim(), e.length !== 0) {
      if (e[0] !== "#") {
        this.trigger("data", {
          type: "uri",
          uri: e
        });
        return;
      }
      var u = this.tagMappers.reduce(function(l, c) {
        var m = c(e);
        return m === e ? l : l.concat([m]);
      }, [e]);
      u.forEach(function(l) {
        for (var c = 0; c < t.customParsers.length; c++)
          if (t.customParsers[c].call(t, l))
            return;
        if (l.indexOf("#EXT") !== 0) {
          t.trigger("data", {
            type: "comment",
            text: l.slice(1)
          });
          return;
        }
        if (l = l.replace("\r", ""), a = /^#EXTM3U/.exec(l), a) {
          t.trigger("data", {
            type: "tag",
            tagType: "m3u"
          });
          return;
        }
        if (a = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "inf"
          }, a[1] && (o.duration = parseFloat(a[1])), a[2] && (o.title = a[2]), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "targetduration"
          }, a[1] && (o.duration = parseInt(a[1], 10)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "version"
          }, a[1] && (o.version = parseInt(a[1], 10)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "media-sequence"
          }, a[1] && (o.number = parseInt(a[1], 10)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "discontinuity-sequence"
          }, a[1] && (o.number = parseInt(a[1], 10)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "playlist-type"
          }, a[1] && (o.playlistType = a[1]), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-BYTERANGE:?(.*)?$/.exec(l), a) {
          o = Ot(Ga(a[1]), {
            type: "tag",
            tagType: "byterange"
          }), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "allow-cache"
          }, a[1] && (o.allowed = !/NO/.test(a[1])), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-MAP:?(.*)$/.exec(l), a) {
          if (o = {
            type: "tag",
            tagType: "map"
          }, a[1]) {
            var m = kt(a[1]);
            m.URI && (o.uri = m.URI), m.BYTERANGE && (o.byterange = Ga(m.BYTERANGE));
          }
          t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-STREAM-INF:?(.*)$/.exec(l), a) {
          if (o = {
            type: "tag",
            tagType: "stream-inf"
          }, a[1]) {
            if (o.attributes = kt(a[1]), o.attributes.RESOLUTION) {
              var g = o.attributes.RESOLUTION.split("x"), _ = {};
              g[0] && (_.width = parseInt(g[0], 10)), g[1] && (_.height = parseInt(g[1], 10)), o.attributes.RESOLUTION = _;
            }
            o.attributes.BANDWIDTH && (o.attributes.BANDWIDTH = parseInt(o.attributes.BANDWIDTH, 10)), o.attributes["FRAME-RATE"] && (o.attributes["FRAME-RATE"] = parseFloat(o.attributes["FRAME-RATE"])), o.attributes["PROGRAM-ID"] && (o.attributes["PROGRAM-ID"] = parseInt(o.attributes["PROGRAM-ID"], 10));
          }
          t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-MEDIA:?(.*)$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "media"
          }, a[1] && (o.attributes = kt(a[1])), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-ENDLIST/.exec(l), a) {
          t.trigger("data", {
            type: "tag",
            tagType: "endlist"
          });
          return;
        }
        if (a = /^#EXT-X-DISCONTINUITY/.exec(l), a) {
          t.trigger("data", {
            type: "tag",
            tagType: "discontinuity"
          });
          return;
        }
        if (a = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "program-date-time"
          }, a[1] && (o.dateTimeString = a[1], o.dateTimeObject = new Date(a[1])), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-KEY:?(.*)$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "key"
          }, a[1] && (o.attributes = kt(a[1]), o.attributes.IV && (o.attributes.IV.substring(0, 2).toLowerCase() === "0x" && (o.attributes.IV = o.attributes.IV.substring(2)), o.attributes.IV = o.attributes.IV.match(/.{8}/g), o.attributes.IV[0] = parseInt(o.attributes.IV[0], 16), o.attributes.IV[1] = parseInt(o.attributes.IV[1], 16), o.attributes.IV[2] = parseInt(o.attributes.IV[2], 16), o.attributes.IV[3] = parseInt(o.attributes.IV[3], 16), o.attributes.IV = new Uint32Array(o.attributes.IV))), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-START:?(.*)$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "start"
          }, a[1] && (o.attributes = kt(a[1]), o.attributes["TIME-OFFSET"] = parseFloat(o.attributes["TIME-OFFSET"]), o.attributes.PRECISE = /YES/.test(o.attributes.PRECISE)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "cue-out-cont"
          }, a[1] ? o.data = a[1] : o.data = "", t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "cue-out"
          }, a[1] ? o.data = a[1] : o.data = "", t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-CUE-IN:?(.*)?$/.exec(l), a) {
          o = {
            type: "tag",
            tagType: "cue-in"
          }, a[1] ? o.data = a[1] : o.data = "", t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-SKIP:(.*)$/.exec(l), a && a[1]) {
          o = {
            type: "tag",
            tagType: "skip"
          }, o.attributes = kt(a[1]), o.attributes.hasOwnProperty("SKIPPED-SEGMENTS") && (o.attributes["SKIPPED-SEGMENTS"] = parseInt(o.attributes["SKIPPED-SEGMENTS"], 10)), o.attributes.hasOwnProperty("RECENTLY-REMOVED-DATERANGES") && (o.attributes["RECENTLY-REMOVED-DATERANGES"] = o.attributes["RECENTLY-REMOVED-DATERANGES"].split(lp)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-PART:(.*)$/.exec(l), a && a[1]) {
          o = {
            type: "tag",
            tagType: "part"
          }, o.attributes = kt(a[1]), ["DURATION"].forEach(function(C) {
            o.attributes.hasOwnProperty(C) && (o.attributes[C] = parseFloat(o.attributes[C]));
          }), ["INDEPENDENT", "GAP"].forEach(function(C) {
            o.attributes.hasOwnProperty(C) && (o.attributes[C] = /YES/.test(o.attributes[C]));
          }), o.attributes.hasOwnProperty("BYTERANGE") && (o.attributes.byterange = Ga(o.attributes.BYTERANGE)), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(l), a && a[1]) {
          o = {
            type: "tag",
            tagType: "server-control"
          }, o.attributes = kt(a[1]), ["CAN-SKIP-UNTIL", "PART-HOLD-BACK", "HOLD-BACK"].forEach(function(C) {
            o.attributes.hasOwnProperty(C) && (o.attributes[C] = parseFloat(o.attributes[C]));
          }), ["CAN-SKIP-DATERANGES", "CAN-BLOCK-RELOAD"].forEach(function(C) {
            o.attributes.hasOwnProperty(C) && (o.attributes[C] = /YES/.test(o.attributes[C]));
          }), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-PART-INF:(.*)$/.exec(l), a && a[1]) {
          o = {
            type: "tag",
            tagType: "part-inf"
          }, o.attributes = kt(a[1]), ["PART-TARGET"].forEach(function(C) {
            o.attributes.hasOwnProperty(C) && (o.attributes[C] = parseFloat(o.attributes[C]));
          }), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(l), a && a[1]) {
          o = {
            type: "tag",
            tagType: "preload-hint"
          }, o.attributes = kt(a[1]), ["BYTERANGE-START", "BYTERANGE-LENGTH"].forEach(function(C) {
            if (o.attributes.hasOwnProperty(C)) {
              o.attributes[C] = parseInt(o.attributes[C], 10);
              var w = C === "BYTERANGE-LENGTH" ? "length" : "offset";
              o.attributes.byterange = o.attributes.byterange || {}, o.attributes.byterange[w] = o.attributes[C], delete o.attributes[C];
            }
          }), t.trigger("data", o);
          return;
        }
        if (a = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(l), a && a[1]) {
          o = {
            type: "tag",
            tagType: "rendition-report"
          }, o.attributes = kt(a[1]), ["LAST-MSN", "LAST-PART"].forEach(function(C) {
            o.attributes.hasOwnProperty(C) && (o.attributes[C] = parseInt(o.attributes[C], 10));
          }), t.trigger("data", o);
          return;
        }
        t.trigger("data", {
          type: "tag",
          data: l.slice(4)
        });
      });
    }
  }, n.addParser = function(e) {
    var t = this, a = e.expression, o = e.customType, u = e.dataParser, l = e.segment;
    typeof u != "function" && (u = function(m) {
      return m;
    }), this.customParsers.push(function(c) {
      var m = a.exec(c);
      if (m)
        return t.trigger("data", {
          type: "custom",
          data: u(c),
          customType: o,
          segment: l
        }), !0;
    });
  }, n.addTagMapper = function(e) {
    var t = e.expression, a = e.map, o = function(l) {
      return t.test(l) ? a(l) : l;
    };
    this.tagMappers.push(o);
  }, r;
})(Ws), fp = function(r) {
  return r.toLowerCase().replace(/-(\w)/g, function(n) {
    return n[1].toUpperCase();
  });
}, jr = function(r) {
  var n = {};
  return Object.keys(r).forEach(function(i) {
    n[fp(i)] = r[i];
  }), n;
}, za = function(r) {
  var n = r.serverControl, i = r.targetDuration, e = r.partTargetDuration;
  if (n) {
    var t = "#EXT-X-SERVER-CONTROL", a = "holdBack", o = "partHoldBack", u = i && i * 3, l = e && e * 2;
    i && !n.hasOwnProperty(a) && (n[a] = u, this.trigger("info", {
      message: t + " defaulting HOLD-BACK to targetDuration * 3 (" + u + ")."
    })), u && n[a] < u && (this.trigger("warn", {
      message: t + " clamping HOLD-BACK (" + n[a] + ") to targetDuration * 3 (" + u + ")"
    }), n[a] = u), e && !n.hasOwnProperty(o) && (n[o] = e * 3, this.trigger("info", {
      message: t + " defaulting PART-HOLD-BACK to partTargetDuration * 3 (" + n[o] + ")."
    })), e && n[o] < l && (this.trigger("warn", {
      message: t + " clamping PART-HOLD-BACK (" + n[o] + ") to partTargetDuration * 2 (" + l + ")."
    }), n[o] = l);
  }
}, hp = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    var i;
    i = s.call(this) || this, i.lineStream = new up(), i.parseStream = new cp(), i.lineStream.pipe(i.parseStream);
    var e = ye(i), t = [], a = {}, o, u, l = !1, c = function() {
    }, m = {
      AUDIO: {},
      VIDEO: {},
      "CLOSED-CAPTIONS": {},
      SUBTITLES: {}
    }, g = "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed", _ = 0;
    i.manifest = {
      allowCache: !0,
      discontinuityStarts: [],
      segments: []
    };
    var C = 0, w = 0;
    return i.on("end", function() {
      a.uri || !a.parts && !a.preloadHints || (!a.map && o && (a.map = o), !a.key && u && (a.key = u), !a.timeline && typeof _ == "number" && (a.timeline = _), i.manifest.preloadSegment = a);
    }), i.parseStream.on("data", function(E) {
      var M, B;
      ({
        tag: function() {
          ({
            version: function() {
              E.version && (this.manifest.version = E.version);
            },
            "allow-cache": function() {
              this.manifest.allowCache = E.allowed, "allowed" in E || (this.trigger("info", {
                message: "defaulting allowCache to YES"
              }), this.manifest.allowCache = !0);
            },
            byterange: function() {
              var H = {};
              "length" in E && (a.byterange = H, H.length = E.length, "offset" in E || (E.offset = C)), "offset" in E && (a.byterange = H, H.offset = E.offset), C = H.offset + H.length;
            },
            endlist: function() {
              this.manifest.endList = !0;
            },
            inf: function() {
              "mediaSequence" in this.manifest || (this.manifest.mediaSequence = 0, this.trigger("info", {
                message: "defaulting media sequence to zero"
              })), "discontinuitySequence" in this.manifest || (this.manifest.discontinuitySequence = 0, this.trigger("info", {
                message: "defaulting discontinuity sequence to zero"
              })), E.duration > 0 && (a.duration = E.duration), E.duration === 0 && (a.duration = 0.01, this.trigger("info", {
                message: "updating zero segment duration to a small value"
              })), this.manifest.segments = t;
            },
            key: function() {
              if (!E.attributes) {
                this.trigger("warn", {
                  message: "ignoring key declaration without attribute list"
                });
                return;
              }
              if (E.attributes.METHOD === "NONE") {
                u = null;
                return;
              }
              if (!E.attributes.URI) {
                this.trigger("warn", {
                  message: "ignoring key declaration without URI"
                });
                return;
              }
              if (E.attributes.KEYFORMAT === "com.apple.streamingkeydelivery") {
                this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.apple.fps.1_0"] = {
                  attributes: E.attributes
                };
                return;
              }
              if (E.attributes.KEYFORMAT === "com.microsoft.playready") {
                this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.microsoft.playready"] = {
                  uri: E.attributes.URI
                };
                return;
              }
              if (E.attributes.KEYFORMAT === g) {
                var H = ["SAMPLE-AES", "SAMPLE-AES-CTR", "SAMPLE-AES-CENC"];
                if (H.indexOf(E.attributes.METHOD) === -1) {
                  this.trigger("warn", {
                    message: "invalid key method provided for Widevine"
                  });
                  return;
                }
                if (E.attributes.METHOD === "SAMPLE-AES-CENC" && this.trigger("warn", {
                  message: "SAMPLE-AES-CENC is deprecated, please use SAMPLE-AES-CTR instead"
                }), E.attributes.URI.substring(0, 23) !== "data:text/plain;base64,") {
                  this.trigger("warn", {
                    message: "invalid key URI provided for Widevine"
                  });
                  return;
                }
                if (!(E.attributes.KEYID && E.attributes.KEYID.substring(0, 2) === "0x")) {
                  this.trigger("warn", {
                    message: "invalid key ID provided for Widevine"
                  });
                  return;
                }
                this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.widevine.alpha"] = {
                  attributes: {
                    schemeIdUri: E.attributes.KEYFORMAT,
                    // remove '0x' from the key id string
                    keyId: E.attributes.KEYID.substring(2)
                  },
                  // decode the base64-encoded PSSH box
                  pssh: rd(E.attributes.URI.split(",")[1])
                };
                return;
              }
              E.attributes.METHOD || this.trigger("warn", {
                message: "defaulting key method to AES-128"
              }), u = {
                method: E.attributes.METHOD || "AES-128",
                uri: E.attributes.URI
              }, typeof E.attributes.IV < "u" && (u.iv = E.attributes.IV);
            },
            "media-sequence": function() {
              if (!isFinite(E.number)) {
                this.trigger("warn", {
                  message: "ignoring invalid media sequence: " + E.number
                });
                return;
              }
              this.manifest.mediaSequence = E.number;
            },
            "discontinuity-sequence": function() {
              if (!isFinite(E.number)) {
                this.trigger("warn", {
                  message: "ignoring invalid discontinuity sequence: " + E.number
                });
                return;
              }
              this.manifest.discontinuitySequence = E.number, _ = E.number;
            },
            "playlist-type": function() {
              if (!/VOD|EVENT/.test(E.playlistType)) {
                this.trigger("warn", {
                  message: "ignoring unknown playlist type: " + E.playlist
                });
                return;
              }
              this.manifest.playlistType = E.playlistType;
            },
            map: function() {
              o = {}, E.uri && (o.uri = E.uri), E.byterange && (o.byterange = E.byterange), u && (o.key = u);
            },
            "stream-inf": function() {
              if (this.manifest.playlists = t, this.manifest.mediaGroups = this.manifest.mediaGroups || m, !E.attributes) {
                this.trigger("warn", {
                  message: "ignoring empty stream-inf attributes"
                });
                return;
              }
              a.attributes || (a.attributes = {}), Ot(a.attributes, E.attributes);
            },
            media: function() {
              if (this.manifest.mediaGroups = this.manifest.mediaGroups || m, !(E.attributes && E.attributes.TYPE && E.attributes["GROUP-ID"] && E.attributes.NAME)) {
                this.trigger("warn", {
                  message: "ignoring incomplete or missing media group"
                });
                return;
              }
              var H = this.manifest.mediaGroups[E.attributes.TYPE];
              H[E.attributes["GROUP-ID"]] = H[E.attributes["GROUP-ID"]] || {}, M = H[E.attributes["GROUP-ID"]], B = {
                default: /yes/i.test(E.attributes.DEFAULT)
              }, B.default ? B.autoselect = !0 : B.autoselect = /yes/i.test(E.attributes.AUTOSELECT), E.attributes.LANGUAGE && (B.language = E.attributes.LANGUAGE), E.attributes.URI && (B.uri = E.attributes.URI), E.attributes["INSTREAM-ID"] && (B.instreamId = E.attributes["INSTREAM-ID"]), E.attributes.CHARACTERISTICS && (B.characteristics = E.attributes.CHARACTERISTICS), E.attributes.FORCED && (B.forced = /yes/i.test(E.attributes.FORCED)), M[E.attributes.NAME] = B;
            },
            discontinuity: function() {
              _ += 1, a.discontinuity = !0, this.manifest.discontinuityStarts.push(t.length);
            },
            "program-date-time": function() {
              typeof this.manifest.dateTimeString > "u" && (this.manifest.dateTimeString = E.dateTimeString, this.manifest.dateTimeObject = E.dateTimeObject), a.dateTimeString = E.dateTimeString, a.dateTimeObject = E.dateTimeObject;
            },
            targetduration: function() {
              if (!isFinite(E.duration) || E.duration < 0) {
                this.trigger("warn", {
                  message: "ignoring invalid target duration: " + E.duration
                });
                return;
              }
              this.manifest.targetDuration = E.duration, za.call(this, this.manifest);
            },
            start: function() {
              if (!E.attributes || isNaN(E.attributes["TIME-OFFSET"])) {
                this.trigger("warn", {
                  message: "ignoring start declaration without appropriate attribute list"
                });
                return;
              }
              this.manifest.start = {
                timeOffset: E.attributes["TIME-OFFSET"],
                precise: E.attributes.PRECISE
              };
            },
            "cue-out": function() {
              a.cueOut = E.data;
            },
            "cue-out-cont": function() {
              a.cueOutCont = E.data;
            },
            "cue-in": function() {
              a.cueIn = E.data;
            },
            skip: function() {
              this.manifest.skip = jr(E.attributes), this.warnOnMissingAttributes_("#EXT-X-SKIP", E.attributes, ["SKIPPED-SEGMENTS"]);
            },
            part: function() {
              var H = this;
              l = !0;
              var $ = this.manifest.segments.length, N = jr(E.attributes);
              a.parts = a.parts || [], a.parts.push(N), N.byterange && (N.byterange.hasOwnProperty("offset") || (N.byterange.offset = w), w = N.byterange.offset + N.byterange.length);
              var q = a.parts.length - 1;
              this.warnOnMissingAttributes_("#EXT-X-PART #" + q + " for segment #" + $, E.attributes, ["URI", "DURATION"]), this.manifest.renditionReports && this.manifest.renditionReports.forEach(function(T, b) {
                T.hasOwnProperty("lastPart") || H.trigger("warn", {
                  message: "#EXT-X-RENDITION-REPORT #" + b + " lacks required attribute(s): LAST-PART"
                });
              });
            },
            "server-control": function() {
              var H = this.manifest.serverControl = jr(E.attributes);
              H.hasOwnProperty("canBlockReload") || (H.canBlockReload = !1, this.trigger("info", {
                message: "#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false"
              })), za.call(this, this.manifest), H.canSkipDateranges && !H.hasOwnProperty("canSkipUntil") && this.trigger("warn", {
                message: "#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set"
              });
            },
            "preload-hint": function() {
              var H = this.manifest.segments.length, $ = jr(E.attributes), N = $.type && $.type === "PART";
              a.preloadHints = a.preloadHints || [], a.preloadHints.push($), $.byterange && ($.byterange.hasOwnProperty("offset") || ($.byterange.offset = N ? w : 0, N && (w = $.byterange.offset + $.byterange.length)));
              var q = a.preloadHints.length - 1;
              if (this.warnOnMissingAttributes_("#EXT-X-PRELOAD-HINT #" + q + " for segment #" + H, E.attributes, ["TYPE", "URI"]), !!$.type)
                for (var T = 0; T < a.preloadHints.length - 1; T++) {
                  var b = a.preloadHints[T];
                  b.type && b.type === $.type && this.trigger("warn", {
                    message: "#EXT-X-PRELOAD-HINT #" + q + " for segment #" + H + " has the same TYPE " + $.type + " as preload hint #" + T
                  });
                }
            },
            "rendition-report": function() {
              var H = jr(E.attributes);
              this.manifest.renditionReports = this.manifest.renditionReports || [], this.manifest.renditionReports.push(H);
              var $ = this.manifest.renditionReports.length - 1, N = ["LAST-MSN", "URI"];
              l && N.push("LAST-PART"), this.warnOnMissingAttributes_("#EXT-X-RENDITION-REPORT #" + $, E.attributes, N);
            },
            "part-inf": function() {
              this.manifest.partInf = jr(E.attributes), this.warnOnMissingAttributes_("#EXT-X-PART-INF", E.attributes, ["PART-TARGET"]), this.manifest.partInf.partTarget && (this.manifest.partTargetDuration = this.manifest.partInf.partTarget), za.call(this, this.manifest);
            }
          }[E.tagType] || c).call(e);
        },
        uri: function() {
          a.uri = E.uri, t.push(a), this.manifest.targetDuration && !("duration" in a) && (this.trigger("warn", {
            message: "defaulting segment duration to the target duration"
          }), a.duration = this.manifest.targetDuration), u && (a.key = u), a.timeline = _, o && (a.map = o), w = 0, a = {};
        },
        comment: function() {
        },
        custom: function() {
          E.segment ? (a.custom = a.custom || {}, a.custom[E.customType] = E.data) : (this.manifest.custom = this.manifest.custom || {}, this.manifest.custom[E.customType] = E.data);
        }
      })[E.type].call(e);
    }), i;
  }
  var n = r.prototype;
  return n.warnOnMissingAttributes_ = function(e, t, a) {
    var o = [];
    a.forEach(function(u) {
      t.hasOwnProperty(u) || o.push(u);
    }), o.length && this.trigger("warn", {
      message: e + " lacks required attribute(s): " + o.join(", ")
    });
  }, n.push = function(e) {
    this.lineStream.push(e);
  }, n.end = function() {
    this.lineStream.push(`
`), this.trigger("end");
  }, n.addParser = function(e) {
    this.parseStream.addParser(e);
  }, n.addTagMapper = function(e) {
    this.parseStream.addTagMapper(e);
  }, r;
})(Ws), Lr = {
  // to determine mime types
  mp4: /^(av0?1|avc0?[1234]|vp0?9|flac|opus|mp3|mp4a|mp4v|stpp.ttml.im1t)/,
  webm: /^(vp0?[89]|av0?1|opus|vorbis)/,
  ogg: /^(vp0?[89]|theora|flac|opus|vorbis)/,
  // to determine if a codec is audio or video
  video: /^(av0?1|avc0?[1234]|vp0?[89]|hvc1|hev1|theora|mp4v)/,
  audio: /^(mp4a|flac|vorbis|opus|ac-[34]|ec-3|alac|mp3|speex|aac)/,
  text: /^(stpp.ttml.im1t)/,
  // mux.js support regex
  muxerVideo: /^(avc0?1)/,
  muxerAudio: /^(mp4a)/,
  // match nothing as muxer does not support text right now.
  // there cannot never be a character before the start of a string
  // so this matches nothing.
  muxerText: /a^/
}, pp = ["video", "audio", "text"], Mu = ["Video", "Audio", "Text"], id = function(r) {
  return r && r.replace(/avc1\.(\d+)\.(\d+)/i, function(n, i, e) {
    var t = ("00" + Number(i).toString(16)).slice(-2), a = ("00" + Number(e).toString(16)).slice(-2);
    return "avc1." + t + "00" + a;
  });
}, Vt = function(r) {
  r === void 0 && (r = "");
  var n = r.split(","), i = [];
  return n.forEach(function(e) {
    e = e.trim();
    var t;
    pp.forEach(function(a) {
      var o = Lr[a].exec(e.toLowerCase());
      if (!(!o || o.length <= 1)) {
        t = a;
        var u = e.substring(0, o[1].length), l = e.replace(u, "");
        i.push({
          type: u,
          details: l,
          mediaType: a
        });
      }
    }), t || i.push({
      type: e,
      details: "",
      mediaType: "unknown"
    });
  }), i;
}, mp = function(r, n) {
  if (!r.mediaGroups.AUDIO || !n)
    return null;
  var i = r.mediaGroups.AUDIO[n];
  if (!i)
    return null;
  for (var e in i) {
    var t = i[e];
    if (t.default && t.playlists)
      return Vt(t.playlists[0].attributes.CODECS);
  }
  return null;
}, nd = function(r) {
  return r === void 0 && (r = ""), Lr.audio.test(r.trim().toLowerCase());
}, gp = function(r) {
  return r === void 0 && (r = ""), Lr.text.test(r.trim().toLowerCase());
}, Ni = function(r) {
  if (!(!r || typeof r != "string")) {
    var n = r.toLowerCase().split(",").map(function(t) {
      return id(t.trim());
    }), i = "video";
    n.length === 1 && nd(n[0]) ? i = "audio" : n.length === 1 && gp(n[0]) && (i = "application");
    var e = "mp4";
    return n.every(function(t) {
      return Lr.mp4.test(t);
    }) ? e = "mp4" : n.every(function(t) {
      return Lr.webm.test(t);
    }) ? e = "webm" : n.every(function(t) {
      return Lr.ogg.test(t);
    }) && (e = "ogg"), i + "/" + e + ';codecs="' + r + '"';
  }
}, Mn = function(r) {
  return r === void 0 && (r = ""), P.MediaSource && P.MediaSource.isTypeSupported && P.MediaSource.isTypeSupported(Ni(r)) || !1;
}, Ka = function(r) {
  return r === void 0 && (r = ""), r.toLowerCase().split(",").every(function(n) {
    n = n.trim();
    for (var i = 0; i < Mu.length; i++) {
      var e = Mu[i];
      if (Lr["muxer" + e].test(n))
        return !0;
    }
    return !1;
  });
}, Nu = "mp4a.40.2", vp = "avc1.4d400d", yp = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i, _p = /^application\/dash\+xml/i, ad = function(r) {
  return yp.test(r) ? "hls" : _p.test(r) ? "dash" : r === "application/vnd.videojs.vhs+json" ? "vhs-json" : null;
}, Tp = function(r) {
  return r.toString(2).length;
}, bp = function(r) {
  return Math.ceil(Tp(r) / 8);
}, sd = function(r) {
  return ArrayBuffer.isView === "function" ? ArrayBuffer.isView(r) : r && r.buffer instanceof ArrayBuffer;
}, xp = function(r) {
  return sd(r);
}, fe = function(r) {
  return r instanceof Uint8Array ? r : (!Array.isArray(r) && !xp(r) && !(r instanceof ArrayBuffer) && (typeof r != "number" || typeof r == "number" && r !== r ? r = 0 : r = [r]), new Uint8Array(r && r.buffer || r, r && r.byteOffset || 0, r && r.byteLength || 0));
}, rt = P.BigInt || Number, ys = [rt("0x1"), rt("0x100"), rt("0x10000"), rt("0x1000000"), rt("0x100000000"), rt("0x10000000000"), rt("0x1000000000000"), rt("0x100000000000000"), rt("0x10000000000000000")];
(function() {
  var s = new Uint16Array([65484]), r = new Uint8Array(s.buffer, s.byteOffset, s.byteLength);
  return r[0] === 255 ? "big" : r[0] === 204 ? "little" : "unknown";
})();
var Sp = function(r, n) {
  var i = n === void 0 ? {} : n, e = i.signed, t = e === void 0 ? !1 : e, a = i.le, o = a === void 0 ? !1 : a;
  r = fe(r);
  var u = o ? "reduce" : "reduceRight", l = r[u] ? r[u] : Array.prototype[u], c = l.call(r, function(g, _, C) {
    var w = o ? C : Math.abs(C + 1 - r.length);
    return g + rt(_) * ys[w];
  }, rt(0));
  if (t) {
    var m = ys[r.length] / rt(2) - rt(1);
    c = rt(c), c > m && (c -= m, c -= m, c -= rt(2));
  }
  return Number(c);
}, Ep = function(r, n) {
  var i = {}, e = i.le, t = e === void 0 ? !1 : e;
  (typeof r != "bigint" && typeof r != "number" || typeof r == "number" && r !== r) && (r = 0), r = rt(r);
  for (var a = bp(r), o = new Uint8Array(new ArrayBuffer(a)), u = 0; u < a; u++) {
    var l = t ? u : Math.abs(u + 1 - o.length);
    o[l] = Number(r / ys[u] & rt(255)), r < 0 && (o[l] = Math.abs(~o[l]), o[l] -= u === 0 ? 1 : 2);
  }
  return o;
}, od = function(r, n) {
  if (typeof r != "string" && r && typeof r.toString == "function" && (r = r.toString()), typeof r != "string")
    return new Uint8Array();
  n || (r = unescape(encodeURIComponent(r)));
  for (var i = new Uint8Array(r.length), e = 0; e < r.length; e++)
    i[e] = r.charCodeAt(e);
  return i;
}, Cp = function() {
  for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++)
    n[i] = arguments[i];
  if (n = n.filter(function(o) {
    return o && (o.byteLength || o.length) && typeof o != "string";
  }), n.length <= 1)
    return fe(n[0]);
  var e = n.reduce(function(o, u, l) {
    return o + (u.byteLength || u.length);
  }, 0), t = new Uint8Array(e), a = 0;
  return n.forEach(function(o) {
    o = fe(o), t.set(o, a), a += o.byteLength;
  }), t;
}, Me = function(r, n, i) {
  var e = i === void 0 ? {} : i, t = e.offset, a = t === void 0 ? 0 : t, o = e.mask, u = o === void 0 ? [] : o;
  r = fe(r), n = fe(n);
  var l = n.every ? n.every : Array.prototype.every;
  return n.length && r.length - a >= n.length && // ie 11 doesn't support every on uin8
  l.call(n, function(c, m) {
    var g = u[m] ? u[m] & r[a + m] : r[a + m];
    return c === g;
  });
}, Ap = function(r, n, i) {
  n.forEach(function(e) {
    for (var t in r.mediaGroups[e])
      for (var a in r.mediaGroups[e][t]) {
        var o = r.mediaGroups[e][t][a];
        i(o, e, t, a);
      }
  });
}, Ci = {}, Xt = {}, wr = {}, Bu;
function da() {
  if (Bu) return wr;
  Bu = 1;
  function s(t, a, o) {
    if (o === void 0 && (o = Array.prototype), t && typeof o.find == "function")
      return o.find.call(t, a);
    for (var u = 0; u < t.length; u++)
      if (Object.prototype.hasOwnProperty.call(t, u)) {
        var l = t[u];
        if (a.call(void 0, l, u, t))
          return l;
      }
  }
  function r(t, a) {
    return a === void 0 && (a = Object), a && typeof a.freeze == "function" ? a.freeze(t) : t;
  }
  function n(t, a) {
    if (t === null || typeof t != "object")
      throw new TypeError("target is not an object");
    for (var o in a)
      Object.prototype.hasOwnProperty.call(a, o) && (t[o] = a[o]);
    return t;
  }
  var i = r({
    /**
     * `text/html`, the only mime type that triggers treating an XML document as HTML.
     *
     * @see DOMParser.SupportedType.isHTML
     * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
     * @see https://en.wikipedia.org/wiki/HTML Wikipedia
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
     */
    HTML: "text/html",
    /**
     * Helper method to check a mime type if it indicates an HTML document
     *
     * @param {string} [value]
     * @returns {boolean}
     *
     * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
     * @see https://en.wikipedia.org/wiki/HTML Wikipedia
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
    isHTML: function(t) {
      return t === i.HTML;
    },
    /**
     * `application/xml`, the standard mime type for XML documents.
     *
     * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
     * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
     * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
     */
    XML_APPLICATION: "application/xml",
    /**
     * `text/html`, an alias for `application/xml`.
     *
     * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
     * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
     * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
     */
    XML_TEXT: "text/xml",
    /**
     * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
     * but is parsed as an XML document.
     *
     * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
     * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
     */
    XML_XHTML_APPLICATION: "application/xhtml+xml",
    /**
     * `image/svg+xml`,
     *
     * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
     * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
     * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
     */
    XML_SVG_IMAGE: "image/svg+xml"
  }), e = r({
    /**
     * The XHTML namespace.
     *
     * @see http://www.w3.org/1999/xhtml
     */
    HTML: "http://www.w3.org/1999/xhtml",
    /**
     * Checks if `uri` equals `NAMESPACE.HTML`.
     *
     * @param {string} [uri]
     *
     * @see NAMESPACE.HTML
     */
    isHTML: function(t) {
      return t === e.HTML;
    },
    /**
     * The SVG namespace.
     *
     * @see http://www.w3.org/2000/svg
     */
    SVG: "http://www.w3.org/2000/svg",
    /**
     * The `xml:` namespace.
     *
     * @see http://www.w3.org/XML/1998/namespace
     */
    XML: "http://www.w3.org/XML/1998/namespace",
    /**
     * The `xmlns:` namespace
     *
     * @see https://www.w3.org/2000/xmlns/
     */
    XMLNS: "http://www.w3.org/2000/xmlns/"
  });
  return wr.assign = n, wr.find = s, wr.freeze = r, wr.MIME_TYPE = i, wr.NAMESPACE = e, wr;
}
var Uu;
function ud() {
  if (Uu) return Xt;
  Uu = 1;
  var s = da(), r = s.find, n = s.NAMESPACE;
  function i(S) {
    return S !== "";
  }
  function e(S) {
    return S ? S.split(/[\t\n\f\r ]+/).filter(i) : [];
  }
  function t(S, A) {
    return S.hasOwnProperty(A) || (S[A] = !0), S;
  }
  function a(S) {
    if (!S) return [];
    var A = e(S);
    return Object.keys(A.reduce(t, {}));
  }
  function o(S) {
    return function(A) {
      return S && S.indexOf(A) !== -1;
    };
  }
  function u(S, A) {
    for (var I in S)
      Object.prototype.hasOwnProperty.call(S, I) && (A[I] = S[I]);
  }
  function l(S, A) {
    var I = S.prototype;
    if (!(I instanceof A)) {
      let G = function() {
      };
      G.prototype = A.prototype, G = new G(), u(I, G), S.prototype = I = G;
    }
    I.constructor != S && (typeof S != "function" && console.error("unknown Class:" + S), I.constructor = S);
  }
  var c = {}, m = c.ELEMENT_NODE = 1, g = c.ATTRIBUTE_NODE = 2, _ = c.TEXT_NODE = 3, C = c.CDATA_SECTION_NODE = 4, w = c.ENTITY_REFERENCE_NODE = 5, E = c.ENTITY_NODE = 6, M = c.PROCESSING_INSTRUCTION_NODE = 7, B = c.COMMENT_NODE = 8, z = c.DOCUMENT_NODE = 9, W = c.DOCUMENT_TYPE_NODE = 10, H = c.DOCUMENT_FRAGMENT_NODE = 11, $ = c.NOTATION_NODE = 12, N = {}, q = {};
  N.INDEX_SIZE_ERR = (q[1] = "Index size error", 1), N.DOMSTRING_SIZE_ERR = (q[2] = "DOMString size error", 2);
  var T = N.HIERARCHY_REQUEST_ERR = (q[3] = "Hierarchy request error", 3);
  N.WRONG_DOCUMENT_ERR = (q[4] = "Wrong document", 4), N.INVALID_CHARACTER_ERR = (q[5] = "Invalid character", 5), N.NO_DATA_ALLOWED_ERR = (q[6] = "No data allowed", 6), N.NO_MODIFICATION_ALLOWED_ERR = (q[7] = "No modification allowed", 7);
  var b = N.NOT_FOUND_ERR = (q[8] = "Not found", 8);
  N.NOT_SUPPORTED_ERR = (q[9] = "Not supported", 9);
  var L = N.INUSE_ATTRIBUTE_ERR = (q[10] = "Attribute in use", 10);
  N.INVALID_STATE_ERR = (q[11] = "Invalid state", 11), N.SYNTAX_ERR = (q[12] = "Syntax error", 12), N.INVALID_MODIFICATION_ERR = (q[13] = "Invalid modification", 13), N.NAMESPACE_ERR = (q[14] = "Invalid namespace", 14), N.INVALID_ACCESS_ERR = (q[15] = "Invalid access", 15);
  function R(S, A) {
    if (A instanceof Error)
      var I = A;
    else
      I = this, Error.call(this, q[S]), this.message = q[S], Error.captureStackTrace && Error.captureStackTrace(this, R);
    return I.code = S, A && (this.message = this.message + ": " + A), I;
  }
  R.prototype = Error.prototype, u(N, R);
  function j() {
  }
  j.prototype = {
    /**
     * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
     * @standard level1
     */
    length: 0,
    /**
     * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
     * @standard level1
     * @param index  unsigned long
     *   Index into the collection.
     * @return Node
     * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
     */
    item: function(S) {
      return S >= 0 && S < this.length ? this[S] : null;
    },
    toString: function(S, A) {
      for (var I = [], G = 0; G < this.length; G++)
        fr(this[G], I, S, A);
      return I.join("");
    },
    /**
     * @private
     * @param {function (Node):boolean} predicate
     * @returns {Node[]}
     */
    filter: function(S) {
      return Array.prototype.filter.call(this, S);
    },
    /**
     * @private
     * @param {Node} item
     * @returns {number}
     */
    indexOf: function(S) {
      return Array.prototype.indexOf.call(this, S);
    }
  };
  function K(S, A) {
    this._node = S, this._refresh = A, Y(this);
  }
  function Y(S) {
    var A = S._node._inc || S._node.ownerDocument._inc;
    if (S._inc !== A) {
      var I = S._refresh(S._node);
      if (rn(S, "length", I.length), !S.$$length || I.length < S.$$length)
        for (var G = I.length; G in S; G++)
          Object.prototype.hasOwnProperty.call(S, G) && delete S[G];
      u(I, S), S._inc = A;
    }
  }
  K.prototype.item = function(S) {
    return Y(this), this[S] || null;
  }, l(K, j);
  function re() {
  }
  function J(S, A) {
    for (var I = S.length; I--; )
      if (S[I] === A)
        return I;
  }
  function ee(S, A, I, G) {
    if (G ? A[J(A, G)] = I : A[A.length++] = I, S) {
      I.ownerElement = S;
      var se = S.ownerDocument;
      se && (G && Pe(se, S, G), ce(se, S, I));
    }
  }
  function Z(S, A, I) {
    var G = J(A, I);
    if (G >= 0) {
      for (var se = A.length - 1; G < se; )
        A[G] = A[++G];
      if (A.length = se, S) {
        var pe = S.ownerDocument;
        pe && (Pe(pe, S, I), I.ownerElement = null);
      }
    } else
      throw new R(b, new Error(S.tagName + "@" + I));
  }
  re.prototype = {
    length: 0,
    item: j.prototype.item,
    getNamedItem: function(S) {
      for (var A = this.length; A--; ) {
        var I = this[A];
        if (I.nodeName == S)
          return I;
      }
    },
    setNamedItem: function(S) {
      var A = S.ownerElement;
      if (A && A != this._ownerElement)
        throw new R(L);
      var I = this.getNamedItem(S.nodeName);
      return ee(this._ownerElement, this, S, I), I;
    },
    /* returns Node */
    setNamedItemNS: function(S) {
      var A = S.ownerElement, I;
      if (A && A != this._ownerElement)
        throw new R(L);
      return I = this.getNamedItemNS(S.namespaceURI, S.localName), ee(this._ownerElement, this, S, I), I;
    },
    /* returns Node */
    removeNamedItem: function(S) {
      var A = this.getNamedItem(S);
      return Z(this._ownerElement, this, A), A;
    },
    // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
    //for level2
    removeNamedItemNS: function(S, A) {
      var I = this.getNamedItemNS(S, A);
      return Z(this._ownerElement, this, I), I;
    },
    getNamedItemNS: function(S, A) {
      for (var I = this.length; I--; ) {
        var G = this[I];
        if (G.localName == A && G.namespaceURI == S)
          return G;
      }
      return null;
    }
  };
  function Q() {
  }
  Q.prototype = {
    /**
     * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
     * The different implementations fairly diverged in what kind of features were reported.
     * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
     *
     * @deprecated It is deprecated and modern browsers return true in all cases.
     *
     * @param {string} feature
     * @param {string} [version]
     * @returns {boolean} always true
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
     * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
     */
    hasFeature: function(S, A) {
      return !0;
    },
    /**
     * Creates an XML Document object of the specified type with its document element.
     *
     * __It behaves slightly different from the description in the living standard__:
     * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
     * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
     * - this implementation is not validating names or qualified names
     *   (when parsing XML strings, the SAX parser takes care of that)
     *
     * @param {string|null} namespaceURI
     * @param {string} qualifiedName
     * @param {DocumentType=null} doctype
     * @returns {Document}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
     *
     * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
     * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
     * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
     */
    createDocument: function(S, A, I) {
      var G = new ge();
      if (G.implementation = this, G.childNodes = new j(), G.doctype = I || null, I && G.appendChild(I), A) {
        var se = G.createElementNS(S, A);
        G.appendChild(se);
      }
      return G;
    },
    /**
     * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
     *
     * __This behavior is slightly different from the in the specs__:
     * - this implementation is not validating names or qualified names
     *   (when parsing XML strings, the SAX parser takes care of that)
     *
     * @param {string} qualifiedName
     * @param {string} [publicId]
     * @param {string} [systemId]
     * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
     * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
     *
     * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
     * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
     * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
     */
    createDocumentType: function(S, A, I) {
      var G = new Tr();
      return G.name = S, G.nodeName = S, G.publicId = A || "", G.systemId = I || "", G;
    }
  };
  function ie() {
  }
  ie.prototype = {
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibling: null,
    attributes: null,
    parentNode: null,
    childNodes: null,
    ownerDocument: null,
    nodeValue: null,
    namespaceURI: null,
    prefix: null,
    localName: null,
    // Modified in DOM Level 2:
    insertBefore: function(S, A) {
      return be(this, S, A);
    },
    replaceChild: function(S, A) {
      be(this, S, A, lr), A && this.removeChild(A);
    },
    removeChild: function(S) {
      return Ie(this, S);
    },
    appendChild: function(S) {
      return this.insertBefore(S, null);
    },
    hasChildNodes: function() {
      return this.firstChild != null;
    },
    cloneNode: function(S) {
      return yi(this.ownerDocument || this, this, S);
    },
    // Modified in DOM Level 2:
    normalize: function() {
      for (var S = this.firstChild; S; ) {
        var A = S.nextSibling;
        A && A.nodeType == _ && S.nodeType == _ ? (this.removeChild(A), S.appendData(A.data)) : (S.normalize(), S = A);
      }
    },
    // Introduced in DOM Level 2:
    isSupported: function(S, A) {
      return this.ownerDocument.implementation.hasFeature(S, A);
    },
    // Introduced in DOM Level 2:
    hasAttributes: function() {
      return this.attributes.length > 0;
    },
    /**
     * Look up the prefix associated to the given namespace URI, starting from this node.
     * **The default namespace declarations are ignored by this method.**
     * See Namespace Prefix Lookup for details on the algorithm used by this method.
     *
     * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
     *
     * @param {string | null} namespaceURI
     * @returns {string | null}
     * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
     * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
     * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
     * @see https://github.com/xmldom/xmldom/issues/322
     */
    lookupPrefix: function(S) {
      for (var A = this; A; ) {
        var I = A._nsMap;
        if (I) {
          for (var G in I)
            if (Object.prototype.hasOwnProperty.call(I, G) && I[G] === S)
              return G;
        }
        A = A.nodeType == g ? A.ownerDocument : A.parentNode;
      }
      return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI: function(S) {
      for (var A = this; A; ) {
        var I = A._nsMap;
        if (I && Object.prototype.hasOwnProperty.call(I, S))
          return I[S];
        A = A.nodeType == g ? A.ownerDocument : A.parentNode;
      }
      return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace: function(S) {
      var A = this.lookupPrefix(S);
      return A == null;
    }
  };
  function he(S) {
    return S == "<" && "&lt;" || S == ">" && "&gt;" || S == "&" && "&amp;" || S == '"' && "&quot;" || "&#" + S.charCodeAt() + ";";
  }
  u(c, ie), u(c, ie.prototype);
  function me(S, A) {
    if (A(S))
      return !0;
    if (S = S.firstChild)
      do
        if (me(S, A))
          return !0;
      while (S = S.nextSibling);
  }
  function ge() {
    this.ownerDocument = this;
  }
  function ce(S, A, I) {
    S && S._inc++;
    var G = I.namespaceURI;
    G === n.XMLNS && (A._nsMap[I.prefix ? I.localName : ""] = I.value);
  }
  function Pe(S, A, I, G) {
    S && S._inc++;
    var se = I.namespaceURI;
    se === n.XMLNS && delete A._nsMap[I.prefix ? I.localName : ""];
  }
  function Ve(S, A, I) {
    if (S && S._inc) {
      S._inc++;
      var G = A.childNodes;
      if (I)
        G[G.length++] = I;
      else {
        for (var se = A.firstChild, pe = 0; se; )
          G[pe++] = se, se = se.nextSibling;
        G.length = pe, delete G[G.length];
      }
    }
  }
  function Ie(S, A) {
    var I = A.previousSibling, G = A.nextSibling;
    return I ? I.nextSibling = G : S.firstChild = G, G ? G.previousSibling = I : S.lastChild = I, A.parentNode = null, A.previousSibling = null, A.nextSibling = null, Ve(S.ownerDocument, S), A;
  }
  function qe(S) {
    return S && (S.nodeType === ie.DOCUMENT_NODE || S.nodeType === ie.DOCUMENT_FRAGMENT_NODE || S.nodeType === ie.ELEMENT_NODE);
  }
  function St(S) {
    return S && (pt(S) || or(S) || Xe(S) || S.nodeType === ie.DOCUMENT_FRAGMENT_NODE || S.nodeType === ie.COMMENT_NODE || S.nodeType === ie.PROCESSING_INSTRUCTION_NODE);
  }
  function Xe(S) {
    return S && S.nodeType === ie.DOCUMENT_TYPE_NODE;
  }
  function pt(S) {
    return S && S.nodeType === ie.ELEMENT_NODE;
  }
  function or(S) {
    return S && S.nodeType === ie.TEXT_NODE;
  }
  function Ye(S, A) {
    var I = S.childNodes || [];
    if (r(I, pt) || Xe(A))
      return !1;
    var G = r(I, Xe);
    return !(A && G && I.indexOf(G) > I.indexOf(A));
  }
  function ur(S, A) {
    var I = S.childNodes || [];
    function G(pe) {
      return pt(pe) && pe !== A;
    }
    if (r(I, G))
      return !1;
    var se = r(I, Xe);
    return !(A && se && I.indexOf(se) > I.indexOf(A));
  }
  function Ne(S, A, I) {
    if (!qe(S))
      throw new R(T, "Unexpected parent node type " + S.nodeType);
    if (I && I.parentNode !== S)
      throw new R(b, "child not in parent");
    if (
      // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
      !St(A) || // 5. If either `node` is a Text node and `parent` is a document,
      // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
      // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
      // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
      Xe(A) && S.nodeType !== ie.DOCUMENT_NODE
    )
      throw new R(
        T,
        "Unexpected node type " + A.nodeType + " for parent node type " + S.nodeType
      );
  }
  function yt(S, A, I) {
    var G = S.childNodes || [], se = A.childNodes || [];
    if (A.nodeType === ie.DOCUMENT_FRAGMENT_NODE) {
      var pe = se.filter(pt);
      if (pe.length > 1 || r(se, or))
        throw new R(T, "More than one element or text in fragment");
      if (pe.length === 1 && !Ye(S, I))
        throw new R(T, "Element in fragment can not be inserted before doctype");
    }
    if (pt(A) && !Ye(S, I))
      throw new R(T, "Only one element can be added and only after doctype");
    if (Xe(A)) {
      if (r(G, Xe))
        throw new R(T, "Only one doctype is allowed");
      var De = r(G, pt);
      if (I && G.indexOf(De) < G.indexOf(I))
        throw new R(T, "Doctype can only be inserted before an element");
      if (!I && De)
        throw new R(T, "Doctype can not be appended since element is present");
    }
  }
  function lr(S, A, I) {
    var G = S.childNodes || [], se = A.childNodes || [];
    if (A.nodeType === ie.DOCUMENT_FRAGMENT_NODE) {
      var pe = se.filter(pt);
      if (pe.length > 1 || r(se, or))
        throw new R(T, "More than one element or text in fragment");
      if (pe.length === 1 && !ur(S, I))
        throw new R(T, "Element in fragment can not be inserted before doctype");
    }
    if (pt(A) && !ur(S, I))
      throw new R(T, "Only one element can be added and only after doctype");
    if (Xe(A)) {
      if (r(G, function(Oe) {
        return Xe(Oe) && Oe !== I;
      }))
        throw new R(T, "Only one doctype is allowed");
      var De = r(G, pt);
      if (I && G.indexOf(De) < G.indexOf(I))
        throw new R(T, "Doctype can only be inserted before an element");
    }
  }
  function be(S, A, I, G) {
    Ne(S, A, I), S.nodeType === ie.DOCUMENT_NODE && (G || yt)(S, A, I);
    var se = A.parentNode;
    if (se && se.removeChild(A), A.nodeType === H) {
      var pe = A.firstChild;
      if (pe == null)
        return A;
      var De = A.lastChild;
    } else
      pe = De = A;
    var ze = I ? I.previousSibling : S.lastChild;
    pe.previousSibling = ze, De.nextSibling = I, ze ? ze.nextSibling = pe : S.firstChild = pe, I == null ? S.lastChild = De : I.previousSibling = De;
    do {
      pe.parentNode = S;
      var Oe = S.ownerDocument || S;
      Rt(pe, Oe);
    } while (pe !== De && (pe = pe.nextSibling));
    return Ve(S.ownerDocument || S, S), A.nodeType == H && (A.firstChild = A.lastChild = null), A;
  }
  function Rt(S, A) {
    if (S.ownerDocument !== A) {
      if (S.ownerDocument = A, S.nodeType === m && S.attributes)
        for (var I = 0; I < S.attributes.length; I++) {
          var G = S.attributes.item(I);
          G && (G.ownerDocument = A);
        }
      for (var se = S.firstChild; se; )
        Rt(se, A), se = se.nextSibling;
    }
  }
  function Ae(S, A) {
    A.parentNode && A.parentNode.removeChild(A), A.parentNode = S, A.previousSibling = S.lastChild, A.nextSibling = null, A.previousSibling ? A.previousSibling.nextSibling = A : S.firstChild = A, S.lastChild = A, Ve(S.ownerDocument, S, A);
    var I = S.ownerDocument || S;
    return Rt(A, I), A;
  }
  ge.prototype = {
    //implementation : null,
    nodeName: "#document",
    nodeType: z,
    /**
     * The DocumentType node of the document.
     *
     * @readonly
     * @type DocumentType
     */
    doctype: null,
    documentElement: null,
    _inc: 1,
    insertBefore: function(S, A) {
      if (S.nodeType == H) {
        for (var I = S.firstChild; I; ) {
          var G = I.nextSibling;
          this.insertBefore(I, A), I = G;
        }
        return S;
      }
      return be(this, S, A), Rt(S, this), this.documentElement === null && S.nodeType === m && (this.documentElement = S), S;
    },
    removeChild: function(S) {
      return this.documentElement == S && (this.documentElement = null), Ie(this, S);
    },
    replaceChild: function(S, A) {
      be(this, S, A, lr), Rt(S, this), A && this.removeChild(A), pt(S) && (this.documentElement = S);
    },
    // Introduced in DOM Level 2:
    importNode: function(S, A) {
      return tn(this, S, A);
    },
    // Introduced in DOM Level 2:
    getElementById: function(S) {
      var A = null;
      return me(this.documentElement, function(I) {
        if (I.nodeType == m && I.getAttribute("id") == S)
          return A = I, !0;
      }), A;
    },
    /**
     * The `getElementsByClassName` method of `Document` interface returns an array-like object
     * of all child elements which have **all** of the given class name(s).
     *
     * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
     *
     *
     * Warning: This is a live LiveNodeList.
     * Changes in the DOM will reflect in the array as the changes occur.
     * If an element selected by this array no longer qualifies for the selector,
     * it will automatically be removed. Be aware of this for iteration purposes.
     *
     * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
     * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
     */
    getElementsByClassName: function(S) {
      var A = a(S);
      return new K(this, function(I) {
        var G = [];
        return A.length > 0 && me(I.documentElement, function(se) {
          if (se !== I && se.nodeType === m) {
            var pe = se.getAttribute("class");
            if (pe) {
              var De = S === pe;
              if (!De) {
                var ze = a(pe);
                De = A.every(o(ze));
              }
              De && G.push(se);
            }
          }
        }), G;
      });
    },
    //document factory method:
    createElement: function(S) {
      var A = new Be();
      A.ownerDocument = this, A.nodeName = S, A.tagName = S, A.localName = S, A.childNodes = new j();
      var I = A.attributes = new re();
      return I._ownerElement = A, A;
    },
    createDocumentFragment: function() {
      var S = new Br();
      return S.ownerDocument = this, S.childNodes = new j(), S;
    },
    createTextNode: function(S) {
      var A = new yr();
      return A.ownerDocument = this, A.appendData(S), A;
    },
    createComment: function(S) {
      var A = new dr();
      return A.ownerDocument = this, A.appendData(S), A;
    },
    createCDATASection: function(S) {
      var A = new _r();
      return A.ownerDocument = this, A.appendData(S), A;
    },
    createProcessingInstruction: function(S, A) {
      var I = new vi();
      return I.ownerDocument = this, I.tagName = I.nodeName = I.target = S, I.nodeValue = I.data = A, I;
    },
    createAttribute: function(S) {
      var A = new Mt();
      return A.ownerDocument = this, A.name = S, A.nodeName = S, A.localName = S, A.specified = !0, A;
    },
    createEntityReference: function(S) {
      var A = new Se();
      return A.ownerDocument = this, A.nodeName = S, A;
    },
    // Introduced in DOM Level 2:
    createElementNS: function(S, A) {
      var I = new Be(), G = A.split(":"), se = I.attributes = new re();
      return I.childNodes = new j(), I.ownerDocument = this, I.nodeName = A, I.tagName = A, I.namespaceURI = S, G.length == 2 ? (I.prefix = G[0], I.localName = G[1]) : I.localName = A, se._ownerElement = I, I;
    },
    // Introduced in DOM Level 2:
    createAttributeNS: function(S, A) {
      var I = new Mt(), G = A.split(":");
      return I.ownerDocument = this, I.nodeName = A, I.name = A, I.namespaceURI = S, I.specified = !0, G.length == 2 ? (I.prefix = G[0], I.localName = G[1]) : I.localName = A, I;
    }
  }, l(ge, ie);
  function Be() {
    this._nsMap = {};
  }
  Be.prototype = {
    nodeType: m,
    hasAttribute: function(S) {
      return this.getAttributeNode(S) != null;
    },
    getAttribute: function(S) {
      var A = this.getAttributeNode(S);
      return A && A.value || "";
    },
    getAttributeNode: function(S) {
      return this.attributes.getNamedItem(S);
    },
    setAttribute: function(S, A) {
      var I = this.ownerDocument.createAttribute(S);
      I.value = I.nodeValue = "" + A, this.setAttributeNode(I);
    },
    removeAttribute: function(S) {
      var A = this.getAttributeNode(S);
      A && this.removeAttributeNode(A);
    },
    //four real opeartion method
    appendChild: function(S) {
      return S.nodeType === H ? this.insertBefore(S, null) : Ae(this, S);
    },
    setAttributeNode: function(S) {
      return this.attributes.setNamedItem(S);
    },
    setAttributeNodeNS: function(S) {
      return this.attributes.setNamedItemNS(S);
    },
    removeAttributeNode: function(S) {
      return this.attributes.removeNamedItem(S.nodeName);
    },
    //get real attribute name,and remove it by removeAttributeNode
    removeAttributeNS: function(S, A) {
      var I = this.getAttributeNodeNS(S, A);
      I && this.removeAttributeNode(I);
    },
    hasAttributeNS: function(S, A) {
      return this.getAttributeNodeNS(S, A) != null;
    },
    getAttributeNS: function(S, A) {
      var I = this.getAttributeNodeNS(S, A);
      return I && I.value || "";
    },
    setAttributeNS: function(S, A, I) {
      var G = this.ownerDocument.createAttributeNS(S, A);
      G.value = G.nodeValue = "" + I, this.setAttributeNode(G);
    },
    getAttributeNodeNS: function(S, A) {
      return this.attributes.getNamedItemNS(S, A);
    },
    getElementsByTagName: function(S) {
      return new K(this, function(A) {
        var I = [];
        return me(A, function(G) {
          G !== A && G.nodeType == m && (S === "*" || G.tagName == S) && I.push(G);
        }), I;
      });
    },
    getElementsByTagNameNS: function(S, A) {
      return new K(this, function(I) {
        var G = [];
        return me(I, function(se) {
          se !== I && se.nodeType === m && (S === "*" || se.namespaceURI === S) && (A === "*" || se.localName == A) && G.push(se);
        }), G;
      });
    }
  }, ge.prototype.getElementsByTagName = Be.prototype.getElementsByTagName, ge.prototype.getElementsByTagNameNS = Be.prototype.getElementsByTagNameNS, l(Be, ie);
  function Mt() {
  }
  Mt.prototype.nodeType = g, l(Mt, ie);
  function zt() {
  }
  zt.prototype = {
    data: "",
    substringData: function(S, A) {
      return this.data.substring(S, S + A);
    },
    appendData: function(S) {
      S = this.data + S, this.nodeValue = this.data = S, this.length = S.length;
    },
    insertData: function(S, A) {
      this.replaceData(S, 0, A);
    },
    appendChild: function(S) {
      throw new Error(q[T]);
    },
    deleteData: function(S, A) {
      this.replaceData(S, A, "");
    },
    replaceData: function(S, A, I) {
      var G = this.data.substring(0, S), se = this.data.substring(S + A);
      I = G + I + se, this.nodeValue = this.data = I, this.length = I.length;
    }
  }, l(zt, ie);
  function yr() {
  }
  yr.prototype = {
    nodeName: "#text",
    nodeType: _,
    splitText: function(S) {
      var A = this.data, I = A.substring(S);
      A = A.substring(0, S), this.data = this.nodeValue = A, this.length = A.length;
      var G = this.ownerDocument.createTextNode(I);
      return this.parentNode && this.parentNode.insertBefore(G, this.nextSibling), G;
    }
  }, l(yr, zt);
  function dr() {
  }
  dr.prototype = {
    nodeName: "#comment",
    nodeType: B
  }, l(dr, zt);
  function _r() {
  }
  _r.prototype = {
    nodeName: "#cdata-section",
    nodeType: C
  }, l(_r, zt);
  function Tr() {
  }
  Tr.prototype.nodeType = W, l(Tr, ie);
  function mi() {
  }
  mi.prototype.nodeType = $, l(mi, ie);
  function gi() {
  }
  gi.prototype.nodeType = E, l(gi, ie);
  function Se() {
  }
  Se.prototype.nodeType = w, l(Se, ie);
  function Br() {
  }
  Br.prototype.nodeName = "#document-fragment", Br.prototype.nodeType = H, l(Br, ie);
  function vi() {
  }
  vi.prototype.nodeType = M, l(vi, ie);
  function Ji() {
  }
  Ji.prototype.serializeToString = function(S, A, I) {
    return Zi.call(S, A, I);
  }, ie.prototype.toString = Zi;
  function Zi(S, A) {
    var I = [], G = this.nodeType == 9 && this.documentElement || this, se = G.prefix, pe = G.namespaceURI;
    if (pe && se == null) {
      var se = G.lookupPrefix(pe);
      if (se == null)
        var De = [
          { namespace: pe, prefix: null }
          //{namespace:uri,prefix:''}
        ];
    }
    return fr(this, I, S, A, De), I.join("");
  }
  function en(S, A, I) {
    var G = S.prefix || "", se = S.namespaceURI;
    if (!se || G === "xml" && se === n.XML || se === n.XMLNS)
      return !1;
    for (var pe = I.length; pe--; ) {
      var De = I[pe];
      if (De.prefix === G)
        return De.namespace !== se;
    }
    return !0;
  }
  function cr(S, A, I) {
    S.push(" ", A, '="', I.replace(/[<>&"\t\n\r]/g, he), '"');
  }
  function fr(S, A, I, G, se) {
    if (se || (se = []), G)
      if (S = G(S), S) {
        if (typeof S == "string") {
          A.push(S);
          return;
        }
      } else
        return;
    switch (S.nodeType) {
      case m:
        var pe = S.attributes, De = pe.length, je = S.firstChild, ze = S.tagName;
        I = n.isHTML(S.namespaceURI) || I;
        var Oe = ze;
        if (!I && !S.prefix && S.namespaceURI) {
          for (var Nt, wt = 0; wt < pe.length; wt++)
            if (pe.item(wt).name === "xmlns") {
              Nt = pe.item(wt).value;
              break;
            }
          if (!Nt)
            for (var Et = se.length - 1; Et >= 0; Et--) {
              var et = se[Et];
              if (et.prefix === "" && et.namespace === S.namespaceURI) {
                Nt = et.namespace;
                break;
              }
            }
          if (Nt !== S.namespaceURI)
            for (var Et = se.length - 1; Et >= 0; Et--) {
              var et = se[Et];
              if (et.namespace === S.namespaceURI) {
                et.prefix && (Oe = et.prefix + ":" + ze);
                break;
              }
            }
        }
        A.push("<", Oe);
        for (var Ct = 0; Ct < De; Ct++) {
          var xe = pe.item(Ct);
          xe.prefix == "xmlns" ? se.push({ prefix: xe.localName, namespace: xe.value }) : xe.nodeName == "xmlns" && se.push({ prefix: "", namespace: xe.value });
        }
        for (var Ct = 0; Ct < De; Ct++) {
          var xe = pe.item(Ct);
          if (en(xe, I, se)) {
            var Kt = xe.prefix || "", Bt = xe.namespaceURI;
            cr(A, Kt ? "xmlns:" + Kt : "xmlns", Bt), se.push({ prefix: Kt, namespace: Bt });
          }
          fr(xe, A, I, G, se);
        }
        if (ze === Oe && en(S, I, se)) {
          var Kt = S.prefix || "", Bt = S.namespaceURI;
          cr(A, Kt ? "xmlns:" + Kt : "xmlns", Bt), se.push({ prefix: Kt, namespace: Bt });
        }
        if (je || I && !/^(?:meta|link|img|br|hr|input)$/i.test(ze)) {
          if (A.push(">"), I && /^script$/i.test(ze))
            for (; je; )
              je.data ? A.push(je.data) : fr(je, A, I, G, se.slice()), je = je.nextSibling;
          else
            for (; je; )
              fr(je, A, I, G, se.slice()), je = je.nextSibling;
          A.push("</", Oe, ">");
        } else
          A.push("/>");
        return;
      case z:
      case H:
        for (var je = S.firstChild; je; )
          fr(je, A, I, G, se.slice()), je = je.nextSibling;
        return;
      case g:
        return cr(A, S.name, S.value);
      case _:
        return A.push(
          S.data.replace(/[<&>]/g, he)
        );
      case C:
        return A.push("<![CDATA[", S.data, "]]>");
      case B:
        return A.push("<!--", S.data, "-->");
      case W:
        var nn = S.publicId, mt = S.systemId;
        if (A.push("<!DOCTYPE ", S.name), nn)
          A.push(" PUBLIC ", nn), mt && mt != "." && A.push(" ", mt), A.push(">");
        else if (mt && mt != ".")
          A.push(" SYSTEM ", mt, ">");
        else {
          var ke = S.internalSubset;
          ke && A.push(" [", ke, "]"), A.push(">");
        }
        return;
      case M:
        return A.push("<?", S.target, " ", S.data, "?>");
      case w:
        return A.push("&", S.nodeName, ";");
      //case ENTITY_NODE:
      //case NOTATION_NODE:
      default:
        A.push("??", S.nodeName);
    }
  }
  function tn(S, A, I) {
    var G;
    switch (A.nodeType) {
      case m:
        G = A.cloneNode(!1), G.ownerDocument = S;
      //var attrs = node2.attributes;
      //var len = attrs.length;
      //for(var i=0;i<len;i++){
      //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
      //}
      case H:
        break;
      case g:
        I = !0;
        break;
    }
    if (G || (G = A.cloneNode(!1)), G.ownerDocument = S, G.parentNode = null, I)
      for (var se = A.firstChild; se; )
        G.appendChild(tn(S, se, I)), se = se.nextSibling;
    return G;
  }
  function yi(S, A, I) {
    var G = new A.constructor();
    for (var se in A)
      if (Object.prototype.hasOwnProperty.call(A, se)) {
        var pe = A[se];
        typeof pe != "object" && pe != G[se] && (G[se] = pe);
      }
    switch (A.childNodes && (G.childNodes = new j()), G.ownerDocument = S, G.nodeType) {
      case m:
        var De = A.attributes, ze = G.attributes = new re(), Oe = De.length;
        ze._ownerElement = G;
        for (var Nt = 0; Nt < Oe; Nt++)
          G.setAttributeNode(yi(S, De.item(Nt), !0));
        break;
      case g:
        I = !0;
    }
    if (I)
      for (var wt = A.firstChild; wt; )
        G.appendChild(yi(S, wt, I)), wt = wt.nextSibling;
    return G;
  }
  function rn(S, A, I) {
    S[A] = I;
  }
  try {
    if (Object.defineProperty) {
      let S = function(A) {
        switch (A.nodeType) {
          case m:
          case H:
            var I = [];
            for (A = A.firstChild; A; )
              A.nodeType !== 7 && A.nodeType !== 8 && I.push(S(A)), A = A.nextSibling;
            return I.join("");
          default:
            return A.nodeValue;
        }
      };
      Object.defineProperty(K.prototype, "length", {
        get: function() {
          return Y(this), this.$$length;
        }
      }), Object.defineProperty(ie.prototype, "textContent", {
        get: function() {
          return S(this);
        },
        set: function(A) {
          switch (this.nodeType) {
            case m:
            case H:
              for (; this.firstChild; )
                this.removeChild(this.firstChild);
              (A || String(A)) && this.appendChild(this.ownerDocument.createTextNode(A));
              break;
            default:
              this.data = A, this.value = A, this.nodeValue = A;
          }
        }
      }), rn = function(A, I, G) {
        A["$$" + I] = G;
      };
    }
  } catch {
  }
  return Xt.DocumentType = Tr, Xt.DOMException = R, Xt.DOMImplementation = Q, Xt.Element = Be, Xt.Node = ie, Xt.NodeList = j, Xt.XMLSerializer = Ji, Xt;
}
var Ai = {}, $a = {}, Vu;
function Dp() {
  return Vu || (Vu = 1, (function(s) {
    var r = da().freeze;
    s.XML_ENTITIES = r({
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    }), s.HTML_ENTITIES = r({
      Aacute: "Á",
      aacute: "á",
      Abreve: "Ă",
      abreve: "ă",
      ac: "∾",
      acd: "∿",
      acE: "∾̳",
      Acirc: "Â",
      acirc: "â",
      acute: "´",
      Acy: "А",
      acy: "а",
      AElig: "Æ",
      aelig: "æ",
      af: "⁡",
      Afr: "𝔄",
      afr: "𝔞",
      Agrave: "À",
      agrave: "à",
      alefsym: "ℵ",
      aleph: "ℵ",
      Alpha: "Α",
      alpha: "α",
      Amacr: "Ā",
      amacr: "ā",
      amalg: "⨿",
      AMP: "&",
      amp: "&",
      And: "⩓",
      and: "∧",
      andand: "⩕",
      andd: "⩜",
      andslope: "⩘",
      andv: "⩚",
      ang: "∠",
      ange: "⦤",
      angle: "∠",
      angmsd: "∡",
      angmsdaa: "⦨",
      angmsdab: "⦩",
      angmsdac: "⦪",
      angmsdad: "⦫",
      angmsdae: "⦬",
      angmsdaf: "⦭",
      angmsdag: "⦮",
      angmsdah: "⦯",
      angrt: "∟",
      angrtvb: "⊾",
      angrtvbd: "⦝",
      angsph: "∢",
      angst: "Å",
      angzarr: "⍼",
      Aogon: "Ą",
      aogon: "ą",
      Aopf: "𝔸",
      aopf: "𝕒",
      ap: "≈",
      apacir: "⩯",
      apE: "⩰",
      ape: "≊",
      apid: "≋",
      apos: "'",
      ApplyFunction: "⁡",
      approx: "≈",
      approxeq: "≊",
      Aring: "Å",
      aring: "å",
      Ascr: "𝒜",
      ascr: "𝒶",
      Assign: "≔",
      ast: "*",
      asymp: "≈",
      asympeq: "≍",
      Atilde: "Ã",
      atilde: "ã",
      Auml: "Ä",
      auml: "ä",
      awconint: "∳",
      awint: "⨑",
      backcong: "≌",
      backepsilon: "϶",
      backprime: "‵",
      backsim: "∽",
      backsimeq: "⋍",
      Backslash: "∖",
      Barv: "⫧",
      barvee: "⊽",
      Barwed: "⌆",
      barwed: "⌅",
      barwedge: "⌅",
      bbrk: "⎵",
      bbrktbrk: "⎶",
      bcong: "≌",
      Bcy: "Б",
      bcy: "б",
      bdquo: "„",
      becaus: "∵",
      Because: "∵",
      because: "∵",
      bemptyv: "⦰",
      bepsi: "϶",
      bernou: "ℬ",
      Bernoullis: "ℬ",
      Beta: "Β",
      beta: "β",
      beth: "ℶ",
      between: "≬",
      Bfr: "𝔅",
      bfr: "𝔟",
      bigcap: "⋂",
      bigcirc: "◯",
      bigcup: "⋃",
      bigodot: "⨀",
      bigoplus: "⨁",
      bigotimes: "⨂",
      bigsqcup: "⨆",
      bigstar: "★",
      bigtriangledown: "▽",
      bigtriangleup: "△",
      biguplus: "⨄",
      bigvee: "⋁",
      bigwedge: "⋀",
      bkarow: "⤍",
      blacklozenge: "⧫",
      blacksquare: "▪",
      blacktriangle: "▴",
      blacktriangledown: "▾",
      blacktriangleleft: "◂",
      blacktriangleright: "▸",
      blank: "␣",
      blk12: "▒",
      blk14: "░",
      blk34: "▓",
      block: "█",
      bne: "=⃥",
      bnequiv: "≡⃥",
      bNot: "⫭",
      bnot: "⌐",
      Bopf: "𝔹",
      bopf: "𝕓",
      bot: "⊥",
      bottom: "⊥",
      bowtie: "⋈",
      boxbox: "⧉",
      boxDL: "╗",
      boxDl: "╖",
      boxdL: "╕",
      boxdl: "┐",
      boxDR: "╔",
      boxDr: "╓",
      boxdR: "╒",
      boxdr: "┌",
      boxH: "═",
      boxh: "─",
      boxHD: "╦",
      boxHd: "╤",
      boxhD: "╥",
      boxhd: "┬",
      boxHU: "╩",
      boxHu: "╧",
      boxhU: "╨",
      boxhu: "┴",
      boxminus: "⊟",
      boxplus: "⊞",
      boxtimes: "⊠",
      boxUL: "╝",
      boxUl: "╜",
      boxuL: "╛",
      boxul: "┘",
      boxUR: "╚",
      boxUr: "╙",
      boxuR: "╘",
      boxur: "└",
      boxV: "║",
      boxv: "│",
      boxVH: "╬",
      boxVh: "╫",
      boxvH: "╪",
      boxvh: "┼",
      boxVL: "╣",
      boxVl: "╢",
      boxvL: "╡",
      boxvl: "┤",
      boxVR: "╠",
      boxVr: "╟",
      boxvR: "╞",
      boxvr: "├",
      bprime: "‵",
      Breve: "˘",
      breve: "˘",
      brvbar: "¦",
      Bscr: "ℬ",
      bscr: "𝒷",
      bsemi: "⁏",
      bsim: "∽",
      bsime: "⋍",
      bsol: "\\",
      bsolb: "⧅",
      bsolhsub: "⟈",
      bull: "•",
      bullet: "•",
      bump: "≎",
      bumpE: "⪮",
      bumpe: "≏",
      Bumpeq: "≎",
      bumpeq: "≏",
      Cacute: "Ć",
      cacute: "ć",
      Cap: "⋒",
      cap: "∩",
      capand: "⩄",
      capbrcup: "⩉",
      capcap: "⩋",
      capcup: "⩇",
      capdot: "⩀",
      CapitalDifferentialD: "ⅅ",
      caps: "∩︀",
      caret: "⁁",
      caron: "ˇ",
      Cayleys: "ℭ",
      ccaps: "⩍",
      Ccaron: "Č",
      ccaron: "č",
      Ccedil: "Ç",
      ccedil: "ç",
      Ccirc: "Ĉ",
      ccirc: "ĉ",
      Cconint: "∰",
      ccups: "⩌",
      ccupssm: "⩐",
      Cdot: "Ċ",
      cdot: "ċ",
      cedil: "¸",
      Cedilla: "¸",
      cemptyv: "⦲",
      cent: "¢",
      CenterDot: "·",
      centerdot: "·",
      Cfr: "ℭ",
      cfr: "𝔠",
      CHcy: "Ч",
      chcy: "ч",
      check: "✓",
      checkmark: "✓",
      Chi: "Χ",
      chi: "χ",
      cir: "○",
      circ: "ˆ",
      circeq: "≗",
      circlearrowleft: "↺",
      circlearrowright: "↻",
      circledast: "⊛",
      circledcirc: "⊚",
      circleddash: "⊝",
      CircleDot: "⊙",
      circledR: "®",
      circledS: "Ⓢ",
      CircleMinus: "⊖",
      CirclePlus: "⊕",
      CircleTimes: "⊗",
      cirE: "⧃",
      cire: "≗",
      cirfnint: "⨐",
      cirmid: "⫯",
      cirscir: "⧂",
      ClockwiseContourIntegral: "∲",
      CloseCurlyDoubleQuote: "”",
      CloseCurlyQuote: "’",
      clubs: "♣",
      clubsuit: "♣",
      Colon: "∷",
      colon: ":",
      Colone: "⩴",
      colone: "≔",
      coloneq: "≔",
      comma: ",",
      commat: "@",
      comp: "∁",
      compfn: "∘",
      complement: "∁",
      complexes: "ℂ",
      cong: "≅",
      congdot: "⩭",
      Congruent: "≡",
      Conint: "∯",
      conint: "∮",
      ContourIntegral: "∮",
      Copf: "ℂ",
      copf: "𝕔",
      coprod: "∐",
      Coproduct: "∐",
      COPY: "©",
      copy: "©",
      copysr: "℗",
      CounterClockwiseContourIntegral: "∳",
      crarr: "↵",
      Cross: "⨯",
      cross: "✗",
      Cscr: "𝒞",
      cscr: "𝒸",
      csub: "⫏",
      csube: "⫑",
      csup: "⫐",
      csupe: "⫒",
      ctdot: "⋯",
      cudarrl: "⤸",
      cudarrr: "⤵",
      cuepr: "⋞",
      cuesc: "⋟",
      cularr: "↶",
      cularrp: "⤽",
      Cup: "⋓",
      cup: "∪",
      cupbrcap: "⩈",
      CupCap: "≍",
      cupcap: "⩆",
      cupcup: "⩊",
      cupdot: "⊍",
      cupor: "⩅",
      cups: "∪︀",
      curarr: "↷",
      curarrm: "⤼",
      curlyeqprec: "⋞",
      curlyeqsucc: "⋟",
      curlyvee: "⋎",
      curlywedge: "⋏",
      curren: "¤",
      curvearrowleft: "↶",
      curvearrowright: "↷",
      cuvee: "⋎",
      cuwed: "⋏",
      cwconint: "∲",
      cwint: "∱",
      cylcty: "⌭",
      Dagger: "‡",
      dagger: "†",
      daleth: "ℸ",
      Darr: "↡",
      dArr: "⇓",
      darr: "↓",
      dash: "‐",
      Dashv: "⫤",
      dashv: "⊣",
      dbkarow: "⤏",
      dblac: "˝",
      Dcaron: "Ď",
      dcaron: "ď",
      Dcy: "Д",
      dcy: "д",
      DD: "ⅅ",
      dd: "ⅆ",
      ddagger: "‡",
      ddarr: "⇊",
      DDotrahd: "⤑",
      ddotseq: "⩷",
      deg: "°",
      Del: "∇",
      Delta: "Δ",
      delta: "δ",
      demptyv: "⦱",
      dfisht: "⥿",
      Dfr: "𝔇",
      dfr: "𝔡",
      dHar: "⥥",
      dharl: "⇃",
      dharr: "⇂",
      DiacriticalAcute: "´",
      DiacriticalDot: "˙",
      DiacriticalDoubleAcute: "˝",
      DiacriticalGrave: "`",
      DiacriticalTilde: "˜",
      diam: "⋄",
      Diamond: "⋄",
      diamond: "⋄",
      diamondsuit: "♦",
      diams: "♦",
      die: "¨",
      DifferentialD: "ⅆ",
      digamma: "ϝ",
      disin: "⋲",
      div: "÷",
      divide: "÷",
      divideontimes: "⋇",
      divonx: "⋇",
      DJcy: "Ђ",
      djcy: "ђ",
      dlcorn: "⌞",
      dlcrop: "⌍",
      dollar: "$",
      Dopf: "𝔻",
      dopf: "𝕕",
      Dot: "¨",
      dot: "˙",
      DotDot: "⃜",
      doteq: "≐",
      doteqdot: "≑",
      DotEqual: "≐",
      dotminus: "∸",
      dotplus: "∔",
      dotsquare: "⊡",
      doublebarwedge: "⌆",
      DoubleContourIntegral: "∯",
      DoubleDot: "¨",
      DoubleDownArrow: "⇓",
      DoubleLeftArrow: "⇐",
      DoubleLeftRightArrow: "⇔",
      DoubleLeftTee: "⫤",
      DoubleLongLeftArrow: "⟸",
      DoubleLongLeftRightArrow: "⟺",
      DoubleLongRightArrow: "⟹",
      DoubleRightArrow: "⇒",
      DoubleRightTee: "⊨",
      DoubleUpArrow: "⇑",
      DoubleUpDownArrow: "⇕",
      DoubleVerticalBar: "∥",
      DownArrow: "↓",
      Downarrow: "⇓",
      downarrow: "↓",
      DownArrowBar: "⤓",
      DownArrowUpArrow: "⇵",
      DownBreve: "̑",
      downdownarrows: "⇊",
      downharpoonleft: "⇃",
      downharpoonright: "⇂",
      DownLeftRightVector: "⥐",
      DownLeftTeeVector: "⥞",
      DownLeftVector: "↽",
      DownLeftVectorBar: "⥖",
      DownRightTeeVector: "⥟",
      DownRightVector: "⇁",
      DownRightVectorBar: "⥗",
      DownTee: "⊤",
      DownTeeArrow: "↧",
      drbkarow: "⤐",
      drcorn: "⌟",
      drcrop: "⌌",
      Dscr: "𝒟",
      dscr: "𝒹",
      DScy: "Ѕ",
      dscy: "ѕ",
      dsol: "⧶",
      Dstrok: "Đ",
      dstrok: "đ",
      dtdot: "⋱",
      dtri: "▿",
      dtrif: "▾",
      duarr: "⇵",
      duhar: "⥯",
      dwangle: "⦦",
      DZcy: "Џ",
      dzcy: "џ",
      dzigrarr: "⟿",
      Eacute: "É",
      eacute: "é",
      easter: "⩮",
      Ecaron: "Ě",
      ecaron: "ě",
      ecir: "≖",
      Ecirc: "Ê",
      ecirc: "ê",
      ecolon: "≕",
      Ecy: "Э",
      ecy: "э",
      eDDot: "⩷",
      Edot: "Ė",
      eDot: "≑",
      edot: "ė",
      ee: "ⅇ",
      efDot: "≒",
      Efr: "𝔈",
      efr: "𝔢",
      eg: "⪚",
      Egrave: "È",
      egrave: "è",
      egs: "⪖",
      egsdot: "⪘",
      el: "⪙",
      Element: "∈",
      elinters: "⏧",
      ell: "ℓ",
      els: "⪕",
      elsdot: "⪗",
      Emacr: "Ē",
      emacr: "ē",
      empty: "∅",
      emptyset: "∅",
      EmptySmallSquare: "◻",
      emptyv: "∅",
      EmptyVerySmallSquare: "▫",
      emsp: " ",
      emsp13: " ",
      emsp14: " ",
      ENG: "Ŋ",
      eng: "ŋ",
      ensp: " ",
      Eogon: "Ę",
      eogon: "ę",
      Eopf: "𝔼",
      eopf: "𝕖",
      epar: "⋕",
      eparsl: "⧣",
      eplus: "⩱",
      epsi: "ε",
      Epsilon: "Ε",
      epsilon: "ε",
      epsiv: "ϵ",
      eqcirc: "≖",
      eqcolon: "≕",
      eqsim: "≂",
      eqslantgtr: "⪖",
      eqslantless: "⪕",
      Equal: "⩵",
      equals: "=",
      EqualTilde: "≂",
      equest: "≟",
      Equilibrium: "⇌",
      equiv: "≡",
      equivDD: "⩸",
      eqvparsl: "⧥",
      erarr: "⥱",
      erDot: "≓",
      Escr: "ℰ",
      escr: "ℯ",
      esdot: "≐",
      Esim: "⩳",
      esim: "≂",
      Eta: "Η",
      eta: "η",
      ETH: "Ð",
      eth: "ð",
      Euml: "Ë",
      euml: "ë",
      euro: "€",
      excl: "!",
      exist: "∃",
      Exists: "∃",
      expectation: "ℰ",
      ExponentialE: "ⅇ",
      exponentiale: "ⅇ",
      fallingdotseq: "≒",
      Fcy: "Ф",
      fcy: "ф",
      female: "♀",
      ffilig: "ﬃ",
      fflig: "ﬀ",
      ffllig: "ﬄ",
      Ffr: "𝔉",
      ffr: "𝔣",
      filig: "ﬁ",
      FilledSmallSquare: "◼",
      FilledVerySmallSquare: "▪",
      fjlig: "fj",
      flat: "♭",
      fllig: "ﬂ",
      fltns: "▱",
      fnof: "ƒ",
      Fopf: "𝔽",
      fopf: "𝕗",
      ForAll: "∀",
      forall: "∀",
      fork: "⋔",
      forkv: "⫙",
      Fouriertrf: "ℱ",
      fpartint: "⨍",
      frac12: "½",
      frac13: "⅓",
      frac14: "¼",
      frac15: "⅕",
      frac16: "⅙",
      frac18: "⅛",
      frac23: "⅔",
      frac25: "⅖",
      frac34: "¾",
      frac35: "⅗",
      frac38: "⅜",
      frac45: "⅘",
      frac56: "⅚",
      frac58: "⅝",
      frac78: "⅞",
      frasl: "⁄",
      frown: "⌢",
      Fscr: "ℱ",
      fscr: "𝒻",
      gacute: "ǵ",
      Gamma: "Γ",
      gamma: "γ",
      Gammad: "Ϝ",
      gammad: "ϝ",
      gap: "⪆",
      Gbreve: "Ğ",
      gbreve: "ğ",
      Gcedil: "Ģ",
      Gcirc: "Ĝ",
      gcirc: "ĝ",
      Gcy: "Г",
      gcy: "г",
      Gdot: "Ġ",
      gdot: "ġ",
      gE: "≧",
      ge: "≥",
      gEl: "⪌",
      gel: "⋛",
      geq: "≥",
      geqq: "≧",
      geqslant: "⩾",
      ges: "⩾",
      gescc: "⪩",
      gesdot: "⪀",
      gesdoto: "⪂",
      gesdotol: "⪄",
      gesl: "⋛︀",
      gesles: "⪔",
      Gfr: "𝔊",
      gfr: "𝔤",
      Gg: "⋙",
      gg: "≫",
      ggg: "⋙",
      gimel: "ℷ",
      GJcy: "Ѓ",
      gjcy: "ѓ",
      gl: "≷",
      gla: "⪥",
      glE: "⪒",
      glj: "⪤",
      gnap: "⪊",
      gnapprox: "⪊",
      gnE: "≩",
      gne: "⪈",
      gneq: "⪈",
      gneqq: "≩",
      gnsim: "⋧",
      Gopf: "𝔾",
      gopf: "𝕘",
      grave: "`",
      GreaterEqual: "≥",
      GreaterEqualLess: "⋛",
      GreaterFullEqual: "≧",
      GreaterGreater: "⪢",
      GreaterLess: "≷",
      GreaterSlantEqual: "⩾",
      GreaterTilde: "≳",
      Gscr: "𝒢",
      gscr: "ℊ",
      gsim: "≳",
      gsime: "⪎",
      gsiml: "⪐",
      Gt: "≫",
      GT: ">",
      gt: ">",
      gtcc: "⪧",
      gtcir: "⩺",
      gtdot: "⋗",
      gtlPar: "⦕",
      gtquest: "⩼",
      gtrapprox: "⪆",
      gtrarr: "⥸",
      gtrdot: "⋗",
      gtreqless: "⋛",
      gtreqqless: "⪌",
      gtrless: "≷",
      gtrsim: "≳",
      gvertneqq: "≩︀",
      gvnE: "≩︀",
      Hacek: "ˇ",
      hairsp: " ",
      half: "½",
      hamilt: "ℋ",
      HARDcy: "Ъ",
      hardcy: "ъ",
      hArr: "⇔",
      harr: "↔",
      harrcir: "⥈",
      harrw: "↭",
      Hat: "^",
      hbar: "ℏ",
      Hcirc: "Ĥ",
      hcirc: "ĥ",
      hearts: "♥",
      heartsuit: "♥",
      hellip: "…",
      hercon: "⊹",
      Hfr: "ℌ",
      hfr: "𝔥",
      HilbertSpace: "ℋ",
      hksearow: "⤥",
      hkswarow: "⤦",
      hoarr: "⇿",
      homtht: "∻",
      hookleftarrow: "↩",
      hookrightarrow: "↪",
      Hopf: "ℍ",
      hopf: "𝕙",
      horbar: "―",
      HorizontalLine: "─",
      Hscr: "ℋ",
      hscr: "𝒽",
      hslash: "ℏ",
      Hstrok: "Ħ",
      hstrok: "ħ",
      HumpDownHump: "≎",
      HumpEqual: "≏",
      hybull: "⁃",
      hyphen: "‐",
      Iacute: "Í",
      iacute: "í",
      ic: "⁣",
      Icirc: "Î",
      icirc: "î",
      Icy: "И",
      icy: "и",
      Idot: "İ",
      IEcy: "Е",
      iecy: "е",
      iexcl: "¡",
      iff: "⇔",
      Ifr: "ℑ",
      ifr: "𝔦",
      Igrave: "Ì",
      igrave: "ì",
      ii: "ⅈ",
      iiiint: "⨌",
      iiint: "∭",
      iinfin: "⧜",
      iiota: "℩",
      IJlig: "Ĳ",
      ijlig: "ĳ",
      Im: "ℑ",
      Imacr: "Ī",
      imacr: "ī",
      image: "ℑ",
      ImaginaryI: "ⅈ",
      imagline: "ℐ",
      imagpart: "ℑ",
      imath: "ı",
      imof: "⊷",
      imped: "Ƶ",
      Implies: "⇒",
      in: "∈",
      incare: "℅",
      infin: "∞",
      infintie: "⧝",
      inodot: "ı",
      Int: "∬",
      int: "∫",
      intcal: "⊺",
      integers: "ℤ",
      Integral: "∫",
      intercal: "⊺",
      Intersection: "⋂",
      intlarhk: "⨗",
      intprod: "⨼",
      InvisibleComma: "⁣",
      InvisibleTimes: "⁢",
      IOcy: "Ё",
      iocy: "ё",
      Iogon: "Į",
      iogon: "į",
      Iopf: "𝕀",
      iopf: "𝕚",
      Iota: "Ι",
      iota: "ι",
      iprod: "⨼",
      iquest: "¿",
      Iscr: "ℐ",
      iscr: "𝒾",
      isin: "∈",
      isindot: "⋵",
      isinE: "⋹",
      isins: "⋴",
      isinsv: "⋳",
      isinv: "∈",
      it: "⁢",
      Itilde: "Ĩ",
      itilde: "ĩ",
      Iukcy: "І",
      iukcy: "і",
      Iuml: "Ï",
      iuml: "ï",
      Jcirc: "Ĵ",
      jcirc: "ĵ",
      Jcy: "Й",
      jcy: "й",
      Jfr: "𝔍",
      jfr: "𝔧",
      jmath: "ȷ",
      Jopf: "𝕁",
      jopf: "𝕛",
      Jscr: "𝒥",
      jscr: "𝒿",
      Jsercy: "Ј",
      jsercy: "ј",
      Jukcy: "Є",
      jukcy: "є",
      Kappa: "Κ",
      kappa: "κ",
      kappav: "ϰ",
      Kcedil: "Ķ",
      kcedil: "ķ",
      Kcy: "К",
      kcy: "к",
      Kfr: "𝔎",
      kfr: "𝔨",
      kgreen: "ĸ",
      KHcy: "Х",
      khcy: "х",
      KJcy: "Ќ",
      kjcy: "ќ",
      Kopf: "𝕂",
      kopf: "𝕜",
      Kscr: "𝒦",
      kscr: "𝓀",
      lAarr: "⇚",
      Lacute: "Ĺ",
      lacute: "ĺ",
      laemptyv: "⦴",
      lagran: "ℒ",
      Lambda: "Λ",
      lambda: "λ",
      Lang: "⟪",
      lang: "⟨",
      langd: "⦑",
      langle: "⟨",
      lap: "⪅",
      Laplacetrf: "ℒ",
      laquo: "«",
      Larr: "↞",
      lArr: "⇐",
      larr: "←",
      larrb: "⇤",
      larrbfs: "⤟",
      larrfs: "⤝",
      larrhk: "↩",
      larrlp: "↫",
      larrpl: "⤹",
      larrsim: "⥳",
      larrtl: "↢",
      lat: "⪫",
      lAtail: "⤛",
      latail: "⤙",
      late: "⪭",
      lates: "⪭︀",
      lBarr: "⤎",
      lbarr: "⤌",
      lbbrk: "❲",
      lbrace: "{",
      lbrack: "[",
      lbrke: "⦋",
      lbrksld: "⦏",
      lbrkslu: "⦍",
      Lcaron: "Ľ",
      lcaron: "ľ",
      Lcedil: "Ļ",
      lcedil: "ļ",
      lceil: "⌈",
      lcub: "{",
      Lcy: "Л",
      lcy: "л",
      ldca: "⤶",
      ldquo: "“",
      ldquor: "„",
      ldrdhar: "⥧",
      ldrushar: "⥋",
      ldsh: "↲",
      lE: "≦",
      le: "≤",
      LeftAngleBracket: "⟨",
      LeftArrow: "←",
      Leftarrow: "⇐",
      leftarrow: "←",
      LeftArrowBar: "⇤",
      LeftArrowRightArrow: "⇆",
      leftarrowtail: "↢",
      LeftCeiling: "⌈",
      LeftDoubleBracket: "⟦",
      LeftDownTeeVector: "⥡",
      LeftDownVector: "⇃",
      LeftDownVectorBar: "⥙",
      LeftFloor: "⌊",
      leftharpoondown: "↽",
      leftharpoonup: "↼",
      leftleftarrows: "⇇",
      LeftRightArrow: "↔",
      Leftrightarrow: "⇔",
      leftrightarrow: "↔",
      leftrightarrows: "⇆",
      leftrightharpoons: "⇋",
      leftrightsquigarrow: "↭",
      LeftRightVector: "⥎",
      LeftTee: "⊣",
      LeftTeeArrow: "↤",
      LeftTeeVector: "⥚",
      leftthreetimes: "⋋",
      LeftTriangle: "⊲",
      LeftTriangleBar: "⧏",
      LeftTriangleEqual: "⊴",
      LeftUpDownVector: "⥑",
      LeftUpTeeVector: "⥠",
      LeftUpVector: "↿",
      LeftUpVectorBar: "⥘",
      LeftVector: "↼",
      LeftVectorBar: "⥒",
      lEg: "⪋",
      leg: "⋚",
      leq: "≤",
      leqq: "≦",
      leqslant: "⩽",
      les: "⩽",
      lescc: "⪨",
      lesdot: "⩿",
      lesdoto: "⪁",
      lesdotor: "⪃",
      lesg: "⋚︀",
      lesges: "⪓",
      lessapprox: "⪅",
      lessdot: "⋖",
      lesseqgtr: "⋚",
      lesseqqgtr: "⪋",
      LessEqualGreater: "⋚",
      LessFullEqual: "≦",
      LessGreater: "≶",
      lessgtr: "≶",
      LessLess: "⪡",
      lesssim: "≲",
      LessSlantEqual: "⩽",
      LessTilde: "≲",
      lfisht: "⥼",
      lfloor: "⌊",
      Lfr: "𝔏",
      lfr: "𝔩",
      lg: "≶",
      lgE: "⪑",
      lHar: "⥢",
      lhard: "↽",
      lharu: "↼",
      lharul: "⥪",
      lhblk: "▄",
      LJcy: "Љ",
      ljcy: "љ",
      Ll: "⋘",
      ll: "≪",
      llarr: "⇇",
      llcorner: "⌞",
      Lleftarrow: "⇚",
      llhard: "⥫",
      lltri: "◺",
      Lmidot: "Ŀ",
      lmidot: "ŀ",
      lmoust: "⎰",
      lmoustache: "⎰",
      lnap: "⪉",
      lnapprox: "⪉",
      lnE: "≨",
      lne: "⪇",
      lneq: "⪇",
      lneqq: "≨",
      lnsim: "⋦",
      loang: "⟬",
      loarr: "⇽",
      lobrk: "⟦",
      LongLeftArrow: "⟵",
      Longleftarrow: "⟸",
      longleftarrow: "⟵",
      LongLeftRightArrow: "⟷",
      Longleftrightarrow: "⟺",
      longleftrightarrow: "⟷",
      longmapsto: "⟼",
      LongRightArrow: "⟶",
      Longrightarrow: "⟹",
      longrightarrow: "⟶",
      looparrowleft: "↫",
      looparrowright: "↬",
      lopar: "⦅",
      Lopf: "𝕃",
      lopf: "𝕝",
      loplus: "⨭",
      lotimes: "⨴",
      lowast: "∗",
      lowbar: "_",
      LowerLeftArrow: "↙",
      LowerRightArrow: "↘",
      loz: "◊",
      lozenge: "◊",
      lozf: "⧫",
      lpar: "(",
      lparlt: "⦓",
      lrarr: "⇆",
      lrcorner: "⌟",
      lrhar: "⇋",
      lrhard: "⥭",
      lrm: "‎",
      lrtri: "⊿",
      lsaquo: "‹",
      Lscr: "ℒ",
      lscr: "𝓁",
      Lsh: "↰",
      lsh: "↰",
      lsim: "≲",
      lsime: "⪍",
      lsimg: "⪏",
      lsqb: "[",
      lsquo: "‘",
      lsquor: "‚",
      Lstrok: "Ł",
      lstrok: "ł",
      Lt: "≪",
      LT: "<",
      lt: "<",
      ltcc: "⪦",
      ltcir: "⩹",
      ltdot: "⋖",
      lthree: "⋋",
      ltimes: "⋉",
      ltlarr: "⥶",
      ltquest: "⩻",
      ltri: "◃",
      ltrie: "⊴",
      ltrif: "◂",
      ltrPar: "⦖",
      lurdshar: "⥊",
      luruhar: "⥦",
      lvertneqq: "≨︀",
      lvnE: "≨︀",
      macr: "¯",
      male: "♂",
      malt: "✠",
      maltese: "✠",
      Map: "⤅",
      map: "↦",
      mapsto: "↦",
      mapstodown: "↧",
      mapstoleft: "↤",
      mapstoup: "↥",
      marker: "▮",
      mcomma: "⨩",
      Mcy: "М",
      mcy: "м",
      mdash: "—",
      mDDot: "∺",
      measuredangle: "∡",
      MediumSpace: " ",
      Mellintrf: "ℳ",
      Mfr: "𝔐",
      mfr: "𝔪",
      mho: "℧",
      micro: "µ",
      mid: "∣",
      midast: "*",
      midcir: "⫰",
      middot: "·",
      minus: "−",
      minusb: "⊟",
      minusd: "∸",
      minusdu: "⨪",
      MinusPlus: "∓",
      mlcp: "⫛",
      mldr: "…",
      mnplus: "∓",
      models: "⊧",
      Mopf: "𝕄",
      mopf: "𝕞",
      mp: "∓",
      Mscr: "ℳ",
      mscr: "𝓂",
      mstpos: "∾",
      Mu: "Μ",
      mu: "μ",
      multimap: "⊸",
      mumap: "⊸",
      nabla: "∇",
      Nacute: "Ń",
      nacute: "ń",
      nang: "∠⃒",
      nap: "≉",
      napE: "⩰̸",
      napid: "≋̸",
      napos: "ŉ",
      napprox: "≉",
      natur: "♮",
      natural: "♮",
      naturals: "ℕ",
      nbsp: " ",
      nbump: "≎̸",
      nbumpe: "≏̸",
      ncap: "⩃",
      Ncaron: "Ň",
      ncaron: "ň",
      Ncedil: "Ņ",
      ncedil: "ņ",
      ncong: "≇",
      ncongdot: "⩭̸",
      ncup: "⩂",
      Ncy: "Н",
      ncy: "н",
      ndash: "–",
      ne: "≠",
      nearhk: "⤤",
      neArr: "⇗",
      nearr: "↗",
      nearrow: "↗",
      nedot: "≐̸",
      NegativeMediumSpace: "​",
      NegativeThickSpace: "​",
      NegativeThinSpace: "​",
      NegativeVeryThinSpace: "​",
      nequiv: "≢",
      nesear: "⤨",
      nesim: "≂̸",
      NestedGreaterGreater: "≫",
      NestedLessLess: "≪",
      NewLine: `
`,
      nexist: "∄",
      nexists: "∄",
      Nfr: "𝔑",
      nfr: "𝔫",
      ngE: "≧̸",
      nge: "≱",
      ngeq: "≱",
      ngeqq: "≧̸",
      ngeqslant: "⩾̸",
      nges: "⩾̸",
      nGg: "⋙̸",
      ngsim: "≵",
      nGt: "≫⃒",
      ngt: "≯",
      ngtr: "≯",
      nGtv: "≫̸",
      nhArr: "⇎",
      nharr: "↮",
      nhpar: "⫲",
      ni: "∋",
      nis: "⋼",
      nisd: "⋺",
      niv: "∋",
      NJcy: "Њ",
      njcy: "њ",
      nlArr: "⇍",
      nlarr: "↚",
      nldr: "‥",
      nlE: "≦̸",
      nle: "≰",
      nLeftarrow: "⇍",
      nleftarrow: "↚",
      nLeftrightarrow: "⇎",
      nleftrightarrow: "↮",
      nleq: "≰",
      nleqq: "≦̸",
      nleqslant: "⩽̸",
      nles: "⩽̸",
      nless: "≮",
      nLl: "⋘̸",
      nlsim: "≴",
      nLt: "≪⃒",
      nlt: "≮",
      nltri: "⋪",
      nltrie: "⋬",
      nLtv: "≪̸",
      nmid: "∤",
      NoBreak: "⁠",
      NonBreakingSpace: " ",
      Nopf: "ℕ",
      nopf: "𝕟",
      Not: "⫬",
      not: "¬",
      NotCongruent: "≢",
      NotCupCap: "≭",
      NotDoubleVerticalBar: "∦",
      NotElement: "∉",
      NotEqual: "≠",
      NotEqualTilde: "≂̸",
      NotExists: "∄",
      NotGreater: "≯",
      NotGreaterEqual: "≱",
      NotGreaterFullEqual: "≧̸",
      NotGreaterGreater: "≫̸",
      NotGreaterLess: "≹",
      NotGreaterSlantEqual: "⩾̸",
      NotGreaterTilde: "≵",
      NotHumpDownHump: "≎̸",
      NotHumpEqual: "≏̸",
      notin: "∉",
      notindot: "⋵̸",
      notinE: "⋹̸",
      notinva: "∉",
      notinvb: "⋷",
      notinvc: "⋶",
      NotLeftTriangle: "⋪",
      NotLeftTriangleBar: "⧏̸",
      NotLeftTriangleEqual: "⋬",
      NotLess: "≮",
      NotLessEqual: "≰",
      NotLessGreater: "≸",
      NotLessLess: "≪̸",
      NotLessSlantEqual: "⩽̸",
      NotLessTilde: "≴",
      NotNestedGreaterGreater: "⪢̸",
      NotNestedLessLess: "⪡̸",
      notni: "∌",
      notniva: "∌",
      notnivb: "⋾",
      notnivc: "⋽",
      NotPrecedes: "⊀",
      NotPrecedesEqual: "⪯̸",
      NotPrecedesSlantEqual: "⋠",
      NotReverseElement: "∌",
      NotRightTriangle: "⋫",
      NotRightTriangleBar: "⧐̸",
      NotRightTriangleEqual: "⋭",
      NotSquareSubset: "⊏̸",
      NotSquareSubsetEqual: "⋢",
      NotSquareSuperset: "⊐̸",
      NotSquareSupersetEqual: "⋣",
      NotSubset: "⊂⃒",
      NotSubsetEqual: "⊈",
      NotSucceeds: "⊁",
      NotSucceedsEqual: "⪰̸",
      NotSucceedsSlantEqual: "⋡",
      NotSucceedsTilde: "≿̸",
      NotSuperset: "⊃⃒",
      NotSupersetEqual: "⊉",
      NotTilde: "≁",
      NotTildeEqual: "≄",
      NotTildeFullEqual: "≇",
      NotTildeTilde: "≉",
      NotVerticalBar: "∤",
      npar: "∦",
      nparallel: "∦",
      nparsl: "⫽⃥",
      npart: "∂̸",
      npolint: "⨔",
      npr: "⊀",
      nprcue: "⋠",
      npre: "⪯̸",
      nprec: "⊀",
      npreceq: "⪯̸",
      nrArr: "⇏",
      nrarr: "↛",
      nrarrc: "⤳̸",
      nrarrw: "↝̸",
      nRightarrow: "⇏",
      nrightarrow: "↛",
      nrtri: "⋫",
      nrtrie: "⋭",
      nsc: "⊁",
      nsccue: "⋡",
      nsce: "⪰̸",
      Nscr: "𝒩",
      nscr: "𝓃",
      nshortmid: "∤",
      nshortparallel: "∦",
      nsim: "≁",
      nsime: "≄",
      nsimeq: "≄",
      nsmid: "∤",
      nspar: "∦",
      nsqsube: "⋢",
      nsqsupe: "⋣",
      nsub: "⊄",
      nsubE: "⫅̸",
      nsube: "⊈",
      nsubset: "⊂⃒",
      nsubseteq: "⊈",
      nsubseteqq: "⫅̸",
      nsucc: "⊁",
      nsucceq: "⪰̸",
      nsup: "⊅",
      nsupE: "⫆̸",
      nsupe: "⊉",
      nsupset: "⊃⃒",
      nsupseteq: "⊉",
      nsupseteqq: "⫆̸",
      ntgl: "≹",
      Ntilde: "Ñ",
      ntilde: "ñ",
      ntlg: "≸",
      ntriangleleft: "⋪",
      ntrianglelefteq: "⋬",
      ntriangleright: "⋫",
      ntrianglerighteq: "⋭",
      Nu: "Ν",
      nu: "ν",
      num: "#",
      numero: "№",
      numsp: " ",
      nvap: "≍⃒",
      nVDash: "⊯",
      nVdash: "⊮",
      nvDash: "⊭",
      nvdash: "⊬",
      nvge: "≥⃒",
      nvgt: ">⃒",
      nvHarr: "⤄",
      nvinfin: "⧞",
      nvlArr: "⤂",
      nvle: "≤⃒",
      nvlt: "<⃒",
      nvltrie: "⊴⃒",
      nvrArr: "⤃",
      nvrtrie: "⊵⃒",
      nvsim: "∼⃒",
      nwarhk: "⤣",
      nwArr: "⇖",
      nwarr: "↖",
      nwarrow: "↖",
      nwnear: "⤧",
      Oacute: "Ó",
      oacute: "ó",
      oast: "⊛",
      ocir: "⊚",
      Ocirc: "Ô",
      ocirc: "ô",
      Ocy: "О",
      ocy: "о",
      odash: "⊝",
      Odblac: "Ő",
      odblac: "ő",
      odiv: "⨸",
      odot: "⊙",
      odsold: "⦼",
      OElig: "Œ",
      oelig: "œ",
      ofcir: "⦿",
      Ofr: "𝔒",
      ofr: "𝔬",
      ogon: "˛",
      Ograve: "Ò",
      ograve: "ò",
      ogt: "⧁",
      ohbar: "⦵",
      ohm: "Ω",
      oint: "∮",
      olarr: "↺",
      olcir: "⦾",
      olcross: "⦻",
      oline: "‾",
      olt: "⧀",
      Omacr: "Ō",
      omacr: "ō",
      Omega: "Ω",
      omega: "ω",
      Omicron: "Ο",
      omicron: "ο",
      omid: "⦶",
      ominus: "⊖",
      Oopf: "𝕆",
      oopf: "𝕠",
      opar: "⦷",
      OpenCurlyDoubleQuote: "“",
      OpenCurlyQuote: "‘",
      operp: "⦹",
      oplus: "⊕",
      Or: "⩔",
      or: "∨",
      orarr: "↻",
      ord: "⩝",
      order: "ℴ",
      orderof: "ℴ",
      ordf: "ª",
      ordm: "º",
      origof: "⊶",
      oror: "⩖",
      orslope: "⩗",
      orv: "⩛",
      oS: "Ⓢ",
      Oscr: "𝒪",
      oscr: "ℴ",
      Oslash: "Ø",
      oslash: "ø",
      osol: "⊘",
      Otilde: "Õ",
      otilde: "õ",
      Otimes: "⨷",
      otimes: "⊗",
      otimesas: "⨶",
      Ouml: "Ö",
      ouml: "ö",
      ovbar: "⌽",
      OverBar: "‾",
      OverBrace: "⏞",
      OverBracket: "⎴",
      OverParenthesis: "⏜",
      par: "∥",
      para: "¶",
      parallel: "∥",
      parsim: "⫳",
      parsl: "⫽",
      part: "∂",
      PartialD: "∂",
      Pcy: "П",
      pcy: "п",
      percnt: "%",
      period: ".",
      permil: "‰",
      perp: "⊥",
      pertenk: "‱",
      Pfr: "𝔓",
      pfr: "𝔭",
      Phi: "Φ",
      phi: "φ",
      phiv: "ϕ",
      phmmat: "ℳ",
      phone: "☎",
      Pi: "Π",
      pi: "π",
      pitchfork: "⋔",
      piv: "ϖ",
      planck: "ℏ",
      planckh: "ℎ",
      plankv: "ℏ",
      plus: "+",
      plusacir: "⨣",
      plusb: "⊞",
      pluscir: "⨢",
      plusdo: "∔",
      plusdu: "⨥",
      pluse: "⩲",
      PlusMinus: "±",
      plusmn: "±",
      plussim: "⨦",
      plustwo: "⨧",
      pm: "±",
      Poincareplane: "ℌ",
      pointint: "⨕",
      Popf: "ℙ",
      popf: "𝕡",
      pound: "£",
      Pr: "⪻",
      pr: "≺",
      prap: "⪷",
      prcue: "≼",
      prE: "⪳",
      pre: "⪯",
      prec: "≺",
      precapprox: "⪷",
      preccurlyeq: "≼",
      Precedes: "≺",
      PrecedesEqual: "⪯",
      PrecedesSlantEqual: "≼",
      PrecedesTilde: "≾",
      preceq: "⪯",
      precnapprox: "⪹",
      precneqq: "⪵",
      precnsim: "⋨",
      precsim: "≾",
      Prime: "″",
      prime: "′",
      primes: "ℙ",
      prnap: "⪹",
      prnE: "⪵",
      prnsim: "⋨",
      prod: "∏",
      Product: "∏",
      profalar: "⌮",
      profline: "⌒",
      profsurf: "⌓",
      prop: "∝",
      Proportion: "∷",
      Proportional: "∝",
      propto: "∝",
      prsim: "≾",
      prurel: "⊰",
      Pscr: "𝒫",
      pscr: "𝓅",
      Psi: "Ψ",
      psi: "ψ",
      puncsp: " ",
      Qfr: "𝔔",
      qfr: "𝔮",
      qint: "⨌",
      Qopf: "ℚ",
      qopf: "𝕢",
      qprime: "⁗",
      Qscr: "𝒬",
      qscr: "𝓆",
      quaternions: "ℍ",
      quatint: "⨖",
      quest: "?",
      questeq: "≟",
      QUOT: '"',
      quot: '"',
      rAarr: "⇛",
      race: "∽̱",
      Racute: "Ŕ",
      racute: "ŕ",
      radic: "√",
      raemptyv: "⦳",
      Rang: "⟫",
      rang: "⟩",
      rangd: "⦒",
      range: "⦥",
      rangle: "⟩",
      raquo: "»",
      Rarr: "↠",
      rArr: "⇒",
      rarr: "→",
      rarrap: "⥵",
      rarrb: "⇥",
      rarrbfs: "⤠",
      rarrc: "⤳",
      rarrfs: "⤞",
      rarrhk: "↪",
      rarrlp: "↬",
      rarrpl: "⥅",
      rarrsim: "⥴",
      Rarrtl: "⤖",
      rarrtl: "↣",
      rarrw: "↝",
      rAtail: "⤜",
      ratail: "⤚",
      ratio: "∶",
      rationals: "ℚ",
      RBarr: "⤐",
      rBarr: "⤏",
      rbarr: "⤍",
      rbbrk: "❳",
      rbrace: "}",
      rbrack: "]",
      rbrke: "⦌",
      rbrksld: "⦎",
      rbrkslu: "⦐",
      Rcaron: "Ř",
      rcaron: "ř",
      Rcedil: "Ŗ",
      rcedil: "ŗ",
      rceil: "⌉",
      rcub: "}",
      Rcy: "Р",
      rcy: "р",
      rdca: "⤷",
      rdldhar: "⥩",
      rdquo: "”",
      rdquor: "”",
      rdsh: "↳",
      Re: "ℜ",
      real: "ℜ",
      realine: "ℛ",
      realpart: "ℜ",
      reals: "ℝ",
      rect: "▭",
      REG: "®",
      reg: "®",
      ReverseElement: "∋",
      ReverseEquilibrium: "⇋",
      ReverseUpEquilibrium: "⥯",
      rfisht: "⥽",
      rfloor: "⌋",
      Rfr: "ℜ",
      rfr: "𝔯",
      rHar: "⥤",
      rhard: "⇁",
      rharu: "⇀",
      rharul: "⥬",
      Rho: "Ρ",
      rho: "ρ",
      rhov: "ϱ",
      RightAngleBracket: "⟩",
      RightArrow: "→",
      Rightarrow: "⇒",
      rightarrow: "→",
      RightArrowBar: "⇥",
      RightArrowLeftArrow: "⇄",
      rightarrowtail: "↣",
      RightCeiling: "⌉",
      RightDoubleBracket: "⟧",
      RightDownTeeVector: "⥝",
      RightDownVector: "⇂",
      RightDownVectorBar: "⥕",
      RightFloor: "⌋",
      rightharpoondown: "⇁",
      rightharpoonup: "⇀",
      rightleftarrows: "⇄",
      rightleftharpoons: "⇌",
      rightrightarrows: "⇉",
      rightsquigarrow: "↝",
      RightTee: "⊢",
      RightTeeArrow: "↦",
      RightTeeVector: "⥛",
      rightthreetimes: "⋌",
      RightTriangle: "⊳",
      RightTriangleBar: "⧐",
      RightTriangleEqual: "⊵",
      RightUpDownVector: "⥏",
      RightUpTeeVector: "⥜",
      RightUpVector: "↾",
      RightUpVectorBar: "⥔",
      RightVector: "⇀",
      RightVectorBar: "⥓",
      ring: "˚",
      risingdotseq: "≓",
      rlarr: "⇄",
      rlhar: "⇌",
      rlm: "‏",
      rmoust: "⎱",
      rmoustache: "⎱",
      rnmid: "⫮",
      roang: "⟭",
      roarr: "⇾",
      robrk: "⟧",
      ropar: "⦆",
      Ropf: "ℝ",
      ropf: "𝕣",
      roplus: "⨮",
      rotimes: "⨵",
      RoundImplies: "⥰",
      rpar: ")",
      rpargt: "⦔",
      rppolint: "⨒",
      rrarr: "⇉",
      Rrightarrow: "⇛",
      rsaquo: "›",
      Rscr: "ℛ",
      rscr: "𝓇",
      Rsh: "↱",
      rsh: "↱",
      rsqb: "]",
      rsquo: "’",
      rsquor: "’",
      rthree: "⋌",
      rtimes: "⋊",
      rtri: "▹",
      rtrie: "⊵",
      rtrif: "▸",
      rtriltri: "⧎",
      RuleDelayed: "⧴",
      ruluhar: "⥨",
      rx: "℞",
      Sacute: "Ś",
      sacute: "ś",
      sbquo: "‚",
      Sc: "⪼",
      sc: "≻",
      scap: "⪸",
      Scaron: "Š",
      scaron: "š",
      sccue: "≽",
      scE: "⪴",
      sce: "⪰",
      Scedil: "Ş",
      scedil: "ş",
      Scirc: "Ŝ",
      scirc: "ŝ",
      scnap: "⪺",
      scnE: "⪶",
      scnsim: "⋩",
      scpolint: "⨓",
      scsim: "≿",
      Scy: "С",
      scy: "с",
      sdot: "⋅",
      sdotb: "⊡",
      sdote: "⩦",
      searhk: "⤥",
      seArr: "⇘",
      searr: "↘",
      searrow: "↘",
      sect: "§",
      semi: ";",
      seswar: "⤩",
      setminus: "∖",
      setmn: "∖",
      sext: "✶",
      Sfr: "𝔖",
      sfr: "𝔰",
      sfrown: "⌢",
      sharp: "♯",
      SHCHcy: "Щ",
      shchcy: "щ",
      SHcy: "Ш",
      shcy: "ш",
      ShortDownArrow: "↓",
      ShortLeftArrow: "←",
      shortmid: "∣",
      shortparallel: "∥",
      ShortRightArrow: "→",
      ShortUpArrow: "↑",
      shy: "­",
      Sigma: "Σ",
      sigma: "σ",
      sigmaf: "ς",
      sigmav: "ς",
      sim: "∼",
      simdot: "⩪",
      sime: "≃",
      simeq: "≃",
      simg: "⪞",
      simgE: "⪠",
      siml: "⪝",
      simlE: "⪟",
      simne: "≆",
      simplus: "⨤",
      simrarr: "⥲",
      slarr: "←",
      SmallCircle: "∘",
      smallsetminus: "∖",
      smashp: "⨳",
      smeparsl: "⧤",
      smid: "∣",
      smile: "⌣",
      smt: "⪪",
      smte: "⪬",
      smtes: "⪬︀",
      SOFTcy: "Ь",
      softcy: "ь",
      sol: "/",
      solb: "⧄",
      solbar: "⌿",
      Sopf: "𝕊",
      sopf: "𝕤",
      spades: "♠",
      spadesuit: "♠",
      spar: "∥",
      sqcap: "⊓",
      sqcaps: "⊓︀",
      sqcup: "⊔",
      sqcups: "⊔︀",
      Sqrt: "√",
      sqsub: "⊏",
      sqsube: "⊑",
      sqsubset: "⊏",
      sqsubseteq: "⊑",
      sqsup: "⊐",
      sqsupe: "⊒",
      sqsupset: "⊐",
      sqsupseteq: "⊒",
      squ: "□",
      Square: "□",
      square: "□",
      SquareIntersection: "⊓",
      SquareSubset: "⊏",
      SquareSubsetEqual: "⊑",
      SquareSuperset: "⊐",
      SquareSupersetEqual: "⊒",
      SquareUnion: "⊔",
      squarf: "▪",
      squf: "▪",
      srarr: "→",
      Sscr: "𝒮",
      sscr: "𝓈",
      ssetmn: "∖",
      ssmile: "⌣",
      sstarf: "⋆",
      Star: "⋆",
      star: "☆",
      starf: "★",
      straightepsilon: "ϵ",
      straightphi: "ϕ",
      strns: "¯",
      Sub: "⋐",
      sub: "⊂",
      subdot: "⪽",
      subE: "⫅",
      sube: "⊆",
      subedot: "⫃",
      submult: "⫁",
      subnE: "⫋",
      subne: "⊊",
      subplus: "⪿",
      subrarr: "⥹",
      Subset: "⋐",
      subset: "⊂",
      subseteq: "⊆",
      subseteqq: "⫅",
      SubsetEqual: "⊆",
      subsetneq: "⊊",
      subsetneqq: "⫋",
      subsim: "⫇",
      subsub: "⫕",
      subsup: "⫓",
      succ: "≻",
      succapprox: "⪸",
      succcurlyeq: "≽",
      Succeeds: "≻",
      SucceedsEqual: "⪰",
      SucceedsSlantEqual: "≽",
      SucceedsTilde: "≿",
      succeq: "⪰",
      succnapprox: "⪺",
      succneqq: "⪶",
      succnsim: "⋩",
      succsim: "≿",
      SuchThat: "∋",
      Sum: "∑",
      sum: "∑",
      sung: "♪",
      Sup: "⋑",
      sup: "⊃",
      sup1: "¹",
      sup2: "²",
      sup3: "³",
      supdot: "⪾",
      supdsub: "⫘",
      supE: "⫆",
      supe: "⊇",
      supedot: "⫄",
      Superset: "⊃",
      SupersetEqual: "⊇",
      suphsol: "⟉",
      suphsub: "⫗",
      suplarr: "⥻",
      supmult: "⫂",
      supnE: "⫌",
      supne: "⊋",
      supplus: "⫀",
      Supset: "⋑",
      supset: "⊃",
      supseteq: "⊇",
      supseteqq: "⫆",
      supsetneq: "⊋",
      supsetneqq: "⫌",
      supsim: "⫈",
      supsub: "⫔",
      supsup: "⫖",
      swarhk: "⤦",
      swArr: "⇙",
      swarr: "↙",
      swarrow: "↙",
      swnwar: "⤪",
      szlig: "ß",
      Tab: "	",
      target: "⌖",
      Tau: "Τ",
      tau: "τ",
      tbrk: "⎴",
      Tcaron: "Ť",
      tcaron: "ť",
      Tcedil: "Ţ",
      tcedil: "ţ",
      Tcy: "Т",
      tcy: "т",
      tdot: "⃛",
      telrec: "⌕",
      Tfr: "𝔗",
      tfr: "𝔱",
      there4: "∴",
      Therefore: "∴",
      therefore: "∴",
      Theta: "Θ",
      theta: "θ",
      thetasym: "ϑ",
      thetav: "ϑ",
      thickapprox: "≈",
      thicksim: "∼",
      ThickSpace: "  ",
      thinsp: " ",
      ThinSpace: " ",
      thkap: "≈",
      thksim: "∼",
      THORN: "Þ",
      thorn: "þ",
      Tilde: "∼",
      tilde: "˜",
      TildeEqual: "≃",
      TildeFullEqual: "≅",
      TildeTilde: "≈",
      times: "×",
      timesb: "⊠",
      timesbar: "⨱",
      timesd: "⨰",
      tint: "∭",
      toea: "⤨",
      top: "⊤",
      topbot: "⌶",
      topcir: "⫱",
      Topf: "𝕋",
      topf: "𝕥",
      topfork: "⫚",
      tosa: "⤩",
      tprime: "‴",
      TRADE: "™",
      trade: "™",
      triangle: "▵",
      triangledown: "▿",
      triangleleft: "◃",
      trianglelefteq: "⊴",
      triangleq: "≜",
      triangleright: "▹",
      trianglerighteq: "⊵",
      tridot: "◬",
      trie: "≜",
      triminus: "⨺",
      TripleDot: "⃛",
      triplus: "⨹",
      trisb: "⧍",
      tritime: "⨻",
      trpezium: "⏢",
      Tscr: "𝒯",
      tscr: "𝓉",
      TScy: "Ц",
      tscy: "ц",
      TSHcy: "Ћ",
      tshcy: "ћ",
      Tstrok: "Ŧ",
      tstrok: "ŧ",
      twixt: "≬",
      twoheadleftarrow: "↞",
      twoheadrightarrow: "↠",
      Uacute: "Ú",
      uacute: "ú",
      Uarr: "↟",
      uArr: "⇑",
      uarr: "↑",
      Uarrocir: "⥉",
      Ubrcy: "Ў",
      ubrcy: "ў",
      Ubreve: "Ŭ",
      ubreve: "ŭ",
      Ucirc: "Û",
      ucirc: "û",
      Ucy: "У",
      ucy: "у",
      udarr: "⇅",
      Udblac: "Ű",
      udblac: "ű",
      udhar: "⥮",
      ufisht: "⥾",
      Ufr: "𝔘",
      ufr: "𝔲",
      Ugrave: "Ù",
      ugrave: "ù",
      uHar: "⥣",
      uharl: "↿",
      uharr: "↾",
      uhblk: "▀",
      ulcorn: "⌜",
      ulcorner: "⌜",
      ulcrop: "⌏",
      ultri: "◸",
      Umacr: "Ū",
      umacr: "ū",
      uml: "¨",
      UnderBar: "_",
      UnderBrace: "⏟",
      UnderBracket: "⎵",
      UnderParenthesis: "⏝",
      Union: "⋃",
      UnionPlus: "⊎",
      Uogon: "Ų",
      uogon: "ų",
      Uopf: "𝕌",
      uopf: "𝕦",
      UpArrow: "↑",
      Uparrow: "⇑",
      uparrow: "↑",
      UpArrowBar: "⤒",
      UpArrowDownArrow: "⇅",
      UpDownArrow: "↕",
      Updownarrow: "⇕",
      updownarrow: "↕",
      UpEquilibrium: "⥮",
      upharpoonleft: "↿",
      upharpoonright: "↾",
      uplus: "⊎",
      UpperLeftArrow: "↖",
      UpperRightArrow: "↗",
      Upsi: "ϒ",
      upsi: "υ",
      upsih: "ϒ",
      Upsilon: "Υ",
      upsilon: "υ",
      UpTee: "⊥",
      UpTeeArrow: "↥",
      upuparrows: "⇈",
      urcorn: "⌝",
      urcorner: "⌝",
      urcrop: "⌎",
      Uring: "Ů",
      uring: "ů",
      urtri: "◹",
      Uscr: "𝒰",
      uscr: "𝓊",
      utdot: "⋰",
      Utilde: "Ũ",
      utilde: "ũ",
      utri: "▵",
      utrif: "▴",
      uuarr: "⇈",
      Uuml: "Ü",
      uuml: "ü",
      uwangle: "⦧",
      vangrt: "⦜",
      varepsilon: "ϵ",
      varkappa: "ϰ",
      varnothing: "∅",
      varphi: "ϕ",
      varpi: "ϖ",
      varpropto: "∝",
      vArr: "⇕",
      varr: "↕",
      varrho: "ϱ",
      varsigma: "ς",
      varsubsetneq: "⊊︀",
      varsubsetneqq: "⫋︀",
      varsupsetneq: "⊋︀",
      varsupsetneqq: "⫌︀",
      vartheta: "ϑ",
      vartriangleleft: "⊲",
      vartriangleright: "⊳",
      Vbar: "⫫",
      vBar: "⫨",
      vBarv: "⫩",
      Vcy: "В",
      vcy: "в",
      VDash: "⊫",
      Vdash: "⊩",
      vDash: "⊨",
      vdash: "⊢",
      Vdashl: "⫦",
      Vee: "⋁",
      vee: "∨",
      veebar: "⊻",
      veeeq: "≚",
      vellip: "⋮",
      Verbar: "‖",
      verbar: "|",
      Vert: "‖",
      vert: "|",
      VerticalBar: "∣",
      VerticalLine: "|",
      VerticalSeparator: "❘",
      VerticalTilde: "≀",
      VeryThinSpace: " ",
      Vfr: "𝔙",
      vfr: "𝔳",
      vltri: "⊲",
      vnsub: "⊂⃒",
      vnsup: "⊃⃒",
      Vopf: "𝕍",
      vopf: "𝕧",
      vprop: "∝",
      vrtri: "⊳",
      Vscr: "𝒱",
      vscr: "𝓋",
      vsubnE: "⫋︀",
      vsubne: "⊊︀",
      vsupnE: "⫌︀",
      vsupne: "⊋︀",
      Vvdash: "⊪",
      vzigzag: "⦚",
      Wcirc: "Ŵ",
      wcirc: "ŵ",
      wedbar: "⩟",
      Wedge: "⋀",
      wedge: "∧",
      wedgeq: "≙",
      weierp: "℘",
      Wfr: "𝔚",
      wfr: "𝔴",
      Wopf: "𝕎",
      wopf: "𝕨",
      wp: "℘",
      wr: "≀",
      wreath: "≀",
      Wscr: "𝒲",
      wscr: "𝓌",
      xcap: "⋂",
      xcirc: "◯",
      xcup: "⋃",
      xdtri: "▽",
      Xfr: "𝔛",
      xfr: "𝔵",
      xhArr: "⟺",
      xharr: "⟷",
      Xi: "Ξ",
      xi: "ξ",
      xlArr: "⟸",
      xlarr: "⟵",
      xmap: "⟼",
      xnis: "⋻",
      xodot: "⨀",
      Xopf: "𝕏",
      xopf: "𝕩",
      xoplus: "⨁",
      xotime: "⨂",
      xrArr: "⟹",
      xrarr: "⟶",
      Xscr: "𝒳",
      xscr: "𝓍",
      xsqcup: "⨆",
      xuplus: "⨄",
      xutri: "△",
      xvee: "⋁",
      xwedge: "⋀",
      Yacute: "Ý",
      yacute: "ý",
      YAcy: "Я",
      yacy: "я",
      Ycirc: "Ŷ",
      ycirc: "ŷ",
      Ycy: "Ы",
      ycy: "ы",
      yen: "¥",
      Yfr: "𝔜",
      yfr: "𝔶",
      YIcy: "Ї",
      yicy: "ї",
      Yopf: "𝕐",
      yopf: "𝕪",
      Yscr: "𝒴",
      yscr: "𝓎",
      YUcy: "Ю",
      yucy: "ю",
      Yuml: "Ÿ",
      yuml: "ÿ",
      Zacute: "Ź",
      zacute: "ź",
      Zcaron: "Ž",
      zcaron: "ž",
      Zcy: "З",
      zcy: "з",
      Zdot: "Ż",
      zdot: "ż",
      zeetrf: "ℨ",
      ZeroWidthSpace: "​",
      Zeta: "Ζ",
      zeta: "ζ",
      Zfr: "ℨ",
      zfr: "𝔷",
      ZHcy: "Ж",
      zhcy: "ж",
      zigrarr: "⇝",
      Zopf: "ℤ",
      zopf: "𝕫",
      Zscr: "𝒵",
      zscr: "𝓏",
      zwj: "‍",
      zwnj: "‌"
    }), s.entityMap = s.HTML_ENTITIES;
  })($a)), $a;
}
var Cn = {}, qu;
function wp() {
  if (qu) return Cn;
  qu = 1;
  var s = da().NAMESPACE, r = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, n = new RegExp("[\\-\\.0-9" + r.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]"), i = new RegExp("^" + r.source + n.source + "*(?::" + r.source + n.source + "*)?$"), e = 0, t = 1, a = 2, o = 3, u = 4, l = 5, c = 6, m = 7;
  function g(T, b) {
    this.message = T, this.locator = b, Error.captureStackTrace && Error.captureStackTrace(this, g);
  }
  g.prototype = new Error(), g.prototype.name = g.name;
  function _() {
  }
  _.prototype = {
    parse: function(T, b, L) {
      var R = this.domBuilder;
      R.startDocument(), W(b, b = {}), C(
        T,
        b,
        L,
        R,
        this.errorHandler
      ), R.endDocument();
    }
  };
  function C(T, b, L, R, j) {
    function K(Ae) {
      if (Ae > 65535) {
        Ae -= 65536;
        var Be = 55296 + (Ae >> 10), Mt = 56320 + (Ae & 1023);
        return String.fromCharCode(Be, Mt);
      } else
        return String.fromCharCode(Ae);
    }
    function Y(Ae) {
      var Be = Ae.slice(1, -1);
      return Object.hasOwnProperty.call(L, Be) ? L[Be] : Be.charAt(0) === "#" ? K(parseInt(Be.substr(1).replace("x", "0x"))) : (j.error("entity not found:" + Ae), Ae);
    }
    function re(Ae) {
      if (Ae > ge) {
        var Be = T.substring(ge, Ae).replace(/&#?\w+;/g, Y);
        ie && J(ge), R.characters(Be, 0, Ae - ge), ge = Ae;
      }
    }
    function J(Ae, Be) {
      for (; Ae >= Z && (Be = Q.exec(T)); )
        ee = Be.index, Z = ee + Be[0].length, ie.lineNumber++;
      ie.columnNumber = Ae - ee + 1;
    }
    for (var ee = 0, Z = 0, Q = /.*(?:\r\n?|\n)|.*$/g, ie = R.locator, he = [{ currentNSMap: b }], me = {}, ge = 0; ; ) {
      try {
        var ce = T.indexOf("<", ge);
        if (ce < 0) {
          if (!T.substr(ge).match(/^\s*$/)) {
            var Pe = R.doc, Ve = Pe.createTextNode(T.substr(ge));
            Pe.appendChild(Ve), R.currentElement = Ve;
          }
          return;
        }
        switch (ce > ge && re(ce), T.charAt(ce + 1)) {
          case "/":
            var Ne = T.indexOf(">", ce + 3), Ie = T.substring(ce + 2, Ne).replace(/[ \t\n\r]+$/g, ""), qe = he.pop();
            Ne < 0 ? (Ie = T.substring(ce + 2).replace(/[\s<].*/, ""), j.error("end tag name: " + Ie + " is not complete:" + qe.tagName), Ne = ce + 1 + Ie.length) : Ie.match(/\s</) && (Ie = Ie.replace(/[\s<].*/, ""), j.error("end tag name: " + Ie + " maybe not complete"), Ne = ce + 1 + Ie.length);
            var St = qe.localNSMap, Xe = qe.tagName == Ie, pt = Xe || qe.tagName && qe.tagName.toLowerCase() == Ie.toLowerCase();
            if (pt) {
              if (R.endElement(qe.uri, qe.localName, Ie), St)
                for (var or in St)
                  Object.prototype.hasOwnProperty.call(St, or) && R.endPrefixMapping(or);
              Xe || j.fatalError("end tag name: " + Ie + " is not match the current start tagName:" + qe.tagName);
            } else
              he.push(qe);
            Ne++;
            break;
          // end elment
          case "?":
            ie && J(ce), Ne = $(T, ce, R);
            break;
          case "!":
            ie && J(ce), Ne = H(T, ce, R, j);
            break;
          default:
            ie && J(ce);
            var Ye = new N(), ur = he[he.length - 1].currentNSMap, Ne = E(T, ce, Ye, ur, Y, j), yt = Ye.length;
            if (!Ye.closed && z(T, Ne, Ye.tagName, me) && (Ye.closed = !0, L.nbsp || j.warning("unclosed xml attribute")), ie && yt) {
              for (var lr = w(ie, {}), be = 0; be < yt; be++) {
                var Rt = Ye[be];
                J(Rt.offset), Rt.locator = w(ie, {});
              }
              R.locator = lr, M(Ye, R, ur) && he.push(Ye), R.locator = ie;
            } else
              M(Ye, R, ur) && he.push(Ye);
            s.isHTML(Ye.uri) && !Ye.closed ? Ne = B(T, Ne, Ye.tagName, Y, R) : Ne++;
        }
      } catch (Ae) {
        if (Ae instanceof g)
          throw Ae;
        j.error("element parse error: " + Ae), Ne = -1;
      }
      Ne > ge ? ge = Ne : re(Math.max(ce, ge) + 1);
    }
  }
  function w(T, b) {
    return b.lineNumber = T.lineNumber, b.columnNumber = T.columnNumber, b;
  }
  function E(T, b, L, R, j, K) {
    function Y(ie, he, me) {
      L.attributeNames.hasOwnProperty(ie) && K.fatalError("Attribute " + ie + " redefined"), L.addValue(
        ie,
        // @see https://www.w3.org/TR/xml/#AVNormalize
        // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
        // - recursive replacement of (DTD) entity references
        // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
        he.replace(/[\t\n\r]/g, " ").replace(/&#?\w+;/g, j),
        me
      );
    }
    for (var re, J, ee = ++b, Z = e; ; ) {
      var Q = T.charAt(ee);
      switch (Q) {
        case "=":
          if (Z === t)
            re = T.slice(b, ee), Z = o;
          else if (Z === a)
            Z = o;
          else
            throw new Error("attribute equal must after attrName");
          break;
        case "'":
        case '"':
          if (Z === o || Z === t)
            if (Z === t && (K.warning('attribute value must after "="'), re = T.slice(b, ee)), b = ee + 1, ee = T.indexOf(Q, b), ee > 0)
              J = T.slice(b, ee), Y(re, J, b - 1), Z = l;
            else
              throw new Error("attribute value no end '" + Q + "' match");
          else if (Z == u)
            J = T.slice(b, ee), Y(re, J, b), K.warning('attribute "' + re + '" missed start quot(' + Q + ")!!"), b = ee + 1, Z = l;
          else
            throw new Error('attribute value must after "="');
          break;
        case "/":
          switch (Z) {
            case e:
              L.setTagName(T.slice(b, ee));
            case l:
            case c:
            case m:
              Z = m, L.closed = !0;
            case u:
            case t:
              break;
            case a:
              L.closed = !0;
              break;
            //case S_EQ:
            default:
              throw new Error("attribute invalid close char('/')");
          }
          break;
        case "":
          return K.error("unexpected end of input"), Z == e && L.setTagName(T.slice(b, ee)), ee;
        case ">":
          switch (Z) {
            case e:
              L.setTagName(T.slice(b, ee));
            case l:
            case c:
            case m:
              break;
            //normal
            case u:
            //Compatible state
            case t:
              J = T.slice(b, ee), J.slice(-1) === "/" && (L.closed = !0, J = J.slice(0, -1));
            case a:
              Z === a && (J = re), Z == u ? (K.warning('attribute "' + J + '" missed quot(")!'), Y(re, J, b)) : ((!s.isHTML(R[""]) || !J.match(/^(?:disabled|checked|selected)$/i)) && K.warning('attribute "' + J + '" missed value!! "' + J + '" instead!!'), Y(J, J, b));
              break;
            case o:
              throw new Error("attribute value missed!!");
          }
          return ee;
        /*xml space '\x20' | #x9 | #xD | #xA; */
        case "":
          Q = " ";
        default:
          if (Q <= " ")
            switch (Z) {
              case e:
                L.setTagName(T.slice(b, ee)), Z = c;
                break;
              case t:
                re = T.slice(b, ee), Z = a;
                break;
              case u:
                var J = T.slice(b, ee);
                K.warning('attribute "' + J + '" missed quot(")!!'), Y(re, J, b);
              case l:
                Z = c;
                break;
            }
          else
            switch (Z) {
              //case S_TAG:void();break;
              //case S_ATTR:void();break;
              //case S_ATTR_NOQUOT_VALUE:void();break;
              case a:
                L.tagName, (!s.isHTML(R[""]) || !re.match(/^(?:disabled|checked|selected)$/i)) && K.warning('attribute "' + re + '" missed value!! "' + re + '" instead2!!'), Y(re, re, b), b = ee, Z = t;
                break;
              case l:
                K.warning('attribute space is required"' + re + '"!!');
              case c:
                Z = t, b = ee;
                break;
              case o:
                Z = u, b = ee;
                break;
              case m:
                throw new Error("elements closed character '/' and '>' must be connected to");
            }
      }
      ee++;
    }
  }
  function M(T, b, L) {
    for (var R = T.tagName, j = null, Q = T.length; Q--; ) {
      var K = T[Q], Y = K.qName, re = K.value, ie = Y.indexOf(":");
      if (ie > 0)
        var J = K.prefix = Y.slice(0, ie), ee = Y.slice(ie + 1), Z = J === "xmlns" && ee;
      else
        ee = Y, J = null, Z = Y === "xmlns" && "";
      K.localName = ee, Z !== !1 && (j == null && (j = {}, W(L, L = {})), L[Z] = j[Z] = re, K.uri = s.XMLNS, b.startPrefixMapping(Z, re));
    }
    for (var Q = T.length; Q--; ) {
      K = T[Q];
      var J = K.prefix;
      J && (J === "xml" && (K.uri = s.XML), J !== "xmlns" && (K.uri = L[J || ""]));
    }
    var ie = R.indexOf(":");
    ie > 0 ? (J = T.prefix = R.slice(0, ie), ee = T.localName = R.slice(ie + 1)) : (J = null, ee = T.localName = R);
    var he = T.uri = L[J || ""];
    if (b.startElement(he, ee, R, T), T.closed) {
      if (b.endElement(he, ee, R), j)
        for (J in j)
          Object.prototype.hasOwnProperty.call(j, J) && b.endPrefixMapping(J);
    } else
      return T.currentNSMap = L, T.localNSMap = j, !0;
  }
  function B(T, b, L, R, j) {
    if (/^(?:script|textarea)$/i.test(L)) {
      var K = T.indexOf("</" + L + ">", b), Y = T.substring(b + 1, K);
      if (/[&<]/.test(Y))
        return /^script$/i.test(L) ? (j.characters(Y, 0, Y.length), K) : (Y = Y.replace(/&#?\w+;/g, R), j.characters(Y, 0, Y.length), K);
    }
    return b + 1;
  }
  function z(T, b, L, R) {
    var j = R[L];
    return j == null && (j = T.lastIndexOf("</" + L + ">"), j < b && (j = T.lastIndexOf("</" + L)), R[L] = j), j < b;
  }
  function W(T, b) {
    for (var L in T)
      Object.prototype.hasOwnProperty.call(T, L) && (b[L] = T[L]);
  }
  function H(T, b, L, R) {
    var j = T.charAt(b + 2);
    switch (j) {
      case "-":
        if (T.charAt(b + 3) === "-") {
          var K = T.indexOf("-->", b + 4);
          return K > b ? (L.comment(T, b + 4, K - b - 4), K + 3) : (R.error("Unclosed comment"), -1);
        } else
          return -1;
      default:
        if (T.substr(b + 3, 6) == "CDATA[") {
          var K = T.indexOf("]]>", b + 9);
          return L.startCDATA(), L.characters(T, b + 9, K - b - 9), L.endCDATA(), K + 3;
        }
        var Y = q(T, b), re = Y.length;
        if (re > 1 && /!doctype/i.test(Y[0][0])) {
          var J = Y[1][0], ee = !1, Z = !1;
          re > 3 && (/^public$/i.test(Y[2][0]) ? (ee = Y[3][0], Z = re > 4 && Y[4][0]) : /^system$/i.test(Y[2][0]) && (Z = Y[3][0]));
          var Q = Y[re - 1];
          return L.startDTD(J, ee, Z), L.endDTD(), Q.index + Q[0].length;
        }
    }
    return -1;
  }
  function $(T, b, L) {
    var R = T.indexOf("?>", b);
    if (R) {
      var j = T.substring(b, R).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
      return j ? (j[0].length, L.processingInstruction(j[1], j[2]), R + 2) : -1;
    }
    return -1;
  }
  function N() {
    this.attributeNames = {};
  }
  N.prototype = {
    setTagName: function(T) {
      if (!i.test(T))
        throw new Error("invalid tagName:" + T);
      this.tagName = T;
    },
    addValue: function(T, b, L) {
      if (!i.test(T))
        throw new Error("invalid attribute:" + T);
      this.attributeNames[T] = this.length, this[this.length++] = { qName: T, value: b, offset: L };
    },
    length: 0,
    getLocalName: function(T) {
      return this[T].localName;
    },
    getLocator: function(T) {
      return this[T].locator;
    },
    getQName: function(T) {
      return this[T].qName;
    },
    getURI: function(T) {
      return this[T].uri;
    },
    getValue: function(T) {
      return this[T].value;
    }
    //	,getIndex:function(uri, localName)){
    //		if(localName){
    //
    //		}else{
    //			var qName = uri
    //		}
    //	},
    //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
    //	getType:function(uri,localName){}
    //	getType:function(i){},
  };
  function q(T, b) {
    var L, R = [], j = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
    for (j.lastIndex = b, j.exec(T); L = j.exec(T); )
      if (R.push(L), L[1]) return R;
  }
  return Cn.XMLReader = _, Cn.ParseError = g, Cn;
}
var ju;
function kp() {
  if (ju) return Ai;
  ju = 1;
  var s = da(), r = ud(), n = Dp(), i = wp(), e = r.DOMImplementation, t = s.NAMESPACE, a = i.ParseError, o = i.XMLReader;
  function u(E) {
    return E.replace(/\r[\n\u0085]/g, `
`).replace(/[\r\u0085\u2028]/g, `
`);
  }
  function l(E) {
    this.options = E || { locator: {} };
  }
  l.prototype.parseFromString = function(E, M) {
    var B = this.options, z = new o(), W = B.domBuilder || new m(), H = B.errorHandler, $ = B.locator, N = B.xmlns || {}, q = /\/x?html?$/.test(M), T = q ? n.HTML_ENTITIES : n.XML_ENTITIES;
    $ && W.setDocumentLocator($), z.errorHandler = c(H, W, $), z.domBuilder = B.domBuilder || W, q && (N[""] = t.HTML), N.xml = N.xml || t.XML;
    var b = B.normalizeLineEndings || u;
    return E && typeof E == "string" ? z.parse(
      b(E),
      N,
      T
    ) : z.errorHandler.error("invalid doc source"), W.doc;
  };
  function c(E, M, B) {
    if (!E) {
      if (M instanceof m)
        return M;
      E = M;
    }
    var z = {}, W = E instanceof Function;
    B = B || {};
    function H($) {
      var N = E[$];
      !N && W && (N = E.length == 2 ? function(q) {
        E($, q);
      } : E), z[$] = N && function(q) {
        N("[xmldom " + $ + "]	" + q + _(B));
      } || function() {
      };
    }
    return H("warning"), H("error"), H("fatalError"), z;
  }
  function m() {
    this.cdata = !1;
  }
  function g(E, M) {
    M.lineNumber = E.lineNumber, M.columnNumber = E.columnNumber;
  }
  m.prototype = {
    startDocument: function() {
      this.doc = new e().createDocument(null, null, null), this.locator && (this.doc.documentURI = this.locator.systemId);
    },
    startElement: function(E, M, B, z) {
      var W = this.doc, H = W.createElementNS(E, B || M), $ = z.length;
      w(this, H), this.currentElement = H, this.locator && g(this.locator, H);
      for (var N = 0; N < $; N++) {
        var E = z.getURI(N), q = z.getValue(N), B = z.getQName(N), T = W.createAttributeNS(E, B);
        this.locator && g(z.getLocator(N), T), T.value = T.nodeValue = q, H.setAttributeNode(T);
      }
    },
    endElement: function(E, M, B) {
      var z = this.currentElement;
      z.tagName, this.currentElement = z.parentNode;
    },
    startPrefixMapping: function(E, M) {
    },
    endPrefixMapping: function(E) {
    },
    processingInstruction: function(E, M) {
      var B = this.doc.createProcessingInstruction(E, M);
      this.locator && g(this.locator, B), w(this, B);
    },
    ignorableWhitespace: function(E, M, B) {
    },
    characters: function(E, M, B) {
      if (E = C.apply(this, arguments), E) {
        if (this.cdata)
          var z = this.doc.createCDATASection(E);
        else
          var z = this.doc.createTextNode(E);
        this.currentElement ? this.currentElement.appendChild(z) : /^\s*$/.test(E) && this.doc.appendChild(z), this.locator && g(this.locator, z);
      }
    },
    skippedEntity: function(E) {
    },
    endDocument: function() {
      this.doc.normalize();
    },
    setDocumentLocator: function(E) {
      (this.locator = E) && (E.lineNumber = 0);
    },
    //LexicalHandler
    comment: function(E, M, B) {
      E = C.apply(this, arguments);
      var z = this.doc.createComment(E);
      this.locator && g(this.locator, z), w(this, z);
    },
    startCDATA: function() {
      this.cdata = !0;
    },
    endCDATA: function() {
      this.cdata = !1;
    },
    startDTD: function(E, M, B) {
      var z = this.doc.implementation;
      if (z && z.createDocumentType) {
        var W = z.createDocumentType(E, M, B);
        this.locator && g(this.locator, W), w(this, W), this.doc.doctype = W;
      }
    },
    /**
     * @see org.xml.sax.ErrorHandler
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
     */
    warning: function(E) {
      console.warn("[xmldom warning]	" + E, _(this.locator));
    },
    error: function(E) {
      console.error("[xmldom error]	" + E, _(this.locator));
    },
    fatalError: function(E) {
      throw new a(E, this.locator);
    }
  };
  function _(E) {
    if (E)
      return `
@` + (E.systemId || "") + "#[line:" + E.lineNumber + ",col:" + E.columnNumber + "]";
  }
  function C(E, M, B) {
    return typeof E == "string" ? E.substr(M, B) : E.length >= M + B || M ? new java.lang.String(E, M, B) + "" : E;
  }
  "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(E) {
    m.prototype[E] = function() {
      return null;
    };
  });
  function w(E, M) {
    E.currentElement ? E.currentElement.appendChild(M) : E.doc.appendChild(M);
  }
  return Ai.__DOMHandler = m, Ai.normalizeLineEndings = u, Ai.DOMParser = l, Ai;
}
var Hu;
function Pp() {
  if (Hu) return Ci;
  Hu = 1;
  var s = ud();
  return Ci.DOMImplementation = s.DOMImplementation, Ci.XMLSerializer = s.XMLSerializer, Ci.DOMParser = kp().DOMParser, Ci;
}
var Ip = Pp();
/*! @name mpd-parser @version 0.22.1 @license Apache-2.0 */
var Wu = function(r) {
  return !!r && typeof r == "object";
}, dt = function s() {
  for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++)
    n[i] = arguments[i];
  return n.reduce(function(e, t) {
    return typeof t != "object" || Object.keys(t).forEach(function(a) {
      Array.isArray(e[a]) && Array.isArray(t[a]) ? e[a] = e[a].concat(t[a]) : Wu(e[a]) && Wu(t[a]) ? e[a] = s(e[a], t[a]) : e[a] = t[a];
    }), e;
  }, {});
}, ld = function(r) {
  return Object.keys(r).map(function(n) {
    return r[n];
  });
}, Op = function(r, n) {
  for (var i = [], e = r; e < n; e++)
    i.push(e);
  return i;
}, ca = function(r) {
  return r.reduce(function(n, i) {
    return n.concat(i);
  }, []);
}, dd = function(r) {
  if (!r.length)
    return [];
  for (var n = [], i = 0; i < r.length; i++)
    n.push(r[i]);
  return n;
}, Lp = function(r, n) {
  return r.reduce(function(i, e, t) {
    return e[n] && i.push(t), i;
  }, []);
}, _s = function(r, n) {
  for (var i = 0; i < r.length; i++)
    if (n(r[i]))
      return i;
  return -1;
}, Fp = function(r, n) {
  return ld(r.reduce(function(i, e) {
    return e.forEach(function(t) {
      i[n(t)] = t;
    }), i;
  }, {}));
}, Zr = {
  INVALID_NUMBER_OF_PERIOD: "INVALID_NUMBER_OF_PERIOD",
  DASH_EMPTY_MANIFEST: "DASH_EMPTY_MANIFEST",
  DASH_INVALID_XML: "DASH_INVALID_XML",
  NO_BASE_URL: "NO_BASE_URL",
  SEGMENT_TIME_UNSPECIFIED: "SEGMENT_TIME_UNSPECIFIED",
  UNSUPPORTED_UTC_TIMING_SCHEME: "UNSUPPORTED_UTC_TIMING_SCHEME"
}, Bi = function(r) {
  var n = r.baseUrl, i = n === void 0 ? "" : n, e = r.source, t = e === void 0 ? "" : e, a = r.range, o = a === void 0 ? "" : a, u = r.indexRange, l = u === void 0 ? "" : u, c = {
    uri: t,
    resolvedUri: la(i || "", t)
  };
  if (o || l) {
    var m = o || l, g = m.split("-"), _ = P.BigInt ? P.BigInt(g[0]) : parseInt(g[0], 10), C = P.BigInt ? P.BigInt(g[1]) : parseInt(g[1], 10);
    _ < Number.MAX_SAFE_INTEGER && typeof _ == "bigint" && (_ = Number(_)), C < Number.MAX_SAFE_INTEGER && typeof C == "bigint" && (C = Number(C));
    var w;
    typeof C == "bigint" || typeof _ == "bigint" ? w = P.BigInt(C) - P.BigInt(_) + P.BigInt(1) : w = C - _ + 1, typeof w == "bigint" && w < Number.MAX_SAFE_INTEGER && (w = Number(w)), c.byterange = {
      length: w,
      offset: _
    };
  }
  return c;
}, Rp = function(r) {
  var n;
  return typeof r.offset == "bigint" || typeof r.length == "bigint" ? n = P.BigInt(r.offset) + P.BigInt(r.length) - P.BigInt(1) : n = r.offset + r.length - 1, r.offset + "-" + n;
}, Gu = function(r) {
  return r && typeof r != "number" && (r = parseInt(r, 10)), isNaN(r) ? null : r;
}, Mp = {
  /**
   * Returns the entire range of available segments for a static MPD
   *
   * @param {Object} attributes
   *        Inheritied MPD attributes
   * @return {{ start: number, end: number }}
   *         The start and end numbers for available segments
   */
  static: function(r) {
    var n = r.duration, i = r.timescale, e = i === void 0 ? 1 : i, t = r.sourceDuration, a = r.periodDuration, o = Gu(r.endNumber), u = n / e;
    return typeof o == "number" ? {
      start: 0,
      end: o
    } : typeof a == "number" ? {
      start: 0,
      end: a / u
    } : {
      start: 0,
      end: t / u
    };
  },
  /**
   * Returns the current live window range of available segments for a dynamic MPD
   *
   * @param {Object} attributes
   *        Inheritied MPD attributes
   * @return {{ start: number, end: number }}
   *         The start and end numbers for available segments
   */
  dynamic: function(r) {
    var n = r.NOW, i = r.clientOffset, e = r.availabilityStartTime, t = r.timescale, a = t === void 0 ? 1 : t, o = r.duration, u = r.periodStart, l = u === void 0 ? 0 : u, c = r.minimumUpdatePeriod, m = c === void 0 ? 0 : c, g = r.timeShiftBufferDepth, _ = g === void 0 ? 1 / 0 : g, C = Gu(r.endNumber), w = (n + i) / 1e3, E = e + l, M = w + m, B = M - E, z = Math.ceil(B * a / o), W = Math.floor((w - E - _) * a / o), H = Math.floor((w - E) * a / o);
    return {
      start: Math.max(0, W),
      end: typeof C == "number" ? C : Math.min(z, H)
    };
  }
}, Np = function(r) {
  return function(n) {
    var i = r.duration, e = r.timescale, t = e === void 0 ? 1 : e, a = r.periodStart, o = r.startNumber, u = o === void 0 ? 1 : o;
    return {
      number: u + n,
      duration: i / t,
      timeline: a,
      time: n * i
    };
  };
}, Gs = function(r) {
  var n = r.type, i = r.duration, e = r.timescale, t = e === void 0 ? 1 : e, a = r.periodDuration, o = r.sourceDuration, u = Mp[n](r), l = u.start, c = u.end, m = Op(l, c).map(Np(r));
  if (n === "static") {
    var g = m.length - 1, _ = typeof a == "number" ? a : o;
    m[g].duration = _ - i / t * g;
  }
  return m;
}, cd = function(r) {
  var n = r.baseUrl, i = r.initialization, e = i === void 0 ? {} : i, t = r.sourceDuration, a = r.indexRange, o = a === void 0 ? "" : a, u = r.periodStart, l = r.presentationTime, c = r.number, m = c === void 0 ? 0 : c, g = r.duration;
  if (!n)
    throw new Error(Zr.NO_BASE_URL);
  var _ = Bi({
    baseUrl: n,
    source: e.sourceURL,
    range: e.range
  }), C = Bi({
    baseUrl: n,
    source: n,
    indexRange: o
  });
  if (C.map = _, g) {
    var w = Gs(r);
    w.length && (C.duration = w[0].duration, C.timeline = w[0].timeline);
  } else t && (C.duration = t, C.timeline = u);
  return C.presentationTime = l || u, C.number = m, [C];
}, zs = function(r, n, i) {
  var e = r.sidx.map ? r.sidx.map : null, t = r.sidx.duration, a = r.timeline || 0, o = r.sidx.byterange, u = o.offset + o.length, l = n.timescale, c = n.references.filter(function(T) {
    return T.referenceType !== 1;
  }), m = [], g = r.endList ? "static" : "dynamic", _ = r.sidx.timeline, C = _, w = r.mediaSequence || 0, E;
  typeof n.firstOffset == "bigint" ? E = P.BigInt(u) + n.firstOffset : E = u + n.firstOffset;
  for (var M = 0; M < c.length; M++) {
    var B = n.references[M], z = B.referencedSize, W = B.subsegmentDuration, H = void 0;
    typeof E == "bigint" ? H = E + P.BigInt(z) - P.BigInt(1) : H = E + z - 1;
    var $ = E + "-" + H, N = {
      baseUrl: i,
      timescale: l,
      timeline: a,
      periodStart: _,
      presentationTime: C,
      number: w,
      duration: W,
      sourceDuration: t,
      indexRange: $,
      type: g
    }, q = cd(N)[0];
    e && (q.map = e), m.push(q), typeof E == "bigint" ? E += P.BigInt(z) : E += z, C += W / l, w++;
  }
  return r.segments = m, r;
}, Bp = ["AUDIO", "SUBTITLES"], Up = 1 / 60, fd = function(r) {
  return Fp(r, function(n) {
    var i = n.timeline;
    return i;
  }).sort(function(n, i) {
    return n.timeline > i.timeline ? 1 : -1;
  });
}, Vp = function(r, n) {
  for (var i = 0; i < r.length; i++)
    if (r[i].attributes.NAME === n)
      return r[i];
  return null;
}, zu = function(r) {
  var n = [];
  return Ap(r, Bp, function(i, e, t, a) {
    n = n.concat(i.playlists || []);
  }), n;
}, Ku = function(r) {
  var n = r.playlist, i = r.mediaSequence;
  n.mediaSequence = i, n.segments.forEach(function(e, t) {
    e.number = n.mediaSequence + t;
  });
}, qp = function(r) {
  var n = r.oldPlaylists, i = r.newPlaylists, e = r.timelineStarts;
  i.forEach(function(t) {
    t.discontinuitySequence = _s(e, function(c) {
      var m = c.timeline;
      return m === t.timeline;
    });
    var a = Vp(n, t.attributes.NAME);
    if (a && !t.sidx) {
      var o = t.segments[0], u = _s(a.segments, function(c) {
        return Math.abs(c.presentationTime - o.presentationTime) < Up;
      });
      if (u === -1) {
        Ku({
          playlist: t,
          mediaSequence: a.mediaSequence + a.segments.length
        }), t.segments[0].discontinuity = !0, t.discontinuityStarts.unshift(0), (!a.segments.length && t.timeline > a.timeline || a.segments.length && t.timeline > a.segments[a.segments.length - 1].timeline) && t.discontinuitySequence--;
        return;
      }
      var l = a.segments[u];
      l.discontinuity && !o.discontinuity && (o.discontinuity = !0, t.discontinuityStarts.unshift(0), t.discontinuitySequence--), Ku({
        playlist: t,
        mediaSequence: a.segments[u].number
      });
    }
  });
}, jp = function(r) {
  var n = r.oldManifest, i = r.newManifest, e = n.playlists.concat(zu(n)), t = i.playlists.concat(zu(i));
  return i.timelineStarts = fd([n.timelineStarts, i.timelineStarts]), qp({
    oldPlaylists: e,
    newPlaylists: t,
    timelineStarts: i.timelineStarts
  }), i;
}, fa = function(r) {
  return r && r.uri + "-" + Rp(r.byterange);
}, Xa = function(r) {
  var n = ld(r.reduce(function(i, e) {
    var t = e.attributes.id + (e.attributes.lang || "");
    if (!i[t])
      i[t] = e, i[t].attributes.timelineStarts = [];
    else {
      if (e.segments) {
        var a;
        e.segments[0] && (e.segments[0].discontinuity = !0), (a = i[t].segments).push.apply(a, e.segments);
      }
      e.attributes.contentProtection && (i[t].attributes.contentProtection = e.attributes.contentProtection);
    }
    return i[t].attributes.timelineStarts.push({
      // Although they represent the same number, it's important to have both to make it
      // compatible with HLS potentially having a similar attribute.
      start: e.attributes.periodStart,
      timeline: e.attributes.periodStart
    }), i;
  }, {}));
  return n.map(function(i) {
    return i.discontinuityStarts = Lp(i.segments || [], "discontinuity"), i;
  });
}, Ks = function(r, n) {
  var i = fa(r.sidx), e = i && n[i] && n[i].sidx;
  return e && zs(r, e, r.sidx.resolvedUri), r;
}, Hp = function(r, n) {
  if (n === void 0 && (n = {}), !Object.keys(n).length)
    return r;
  for (var i in r)
    r[i] = Ks(r[i], n);
  return r;
}, Wp = function(r, n) {
  var i, e = r.attributes, t = r.segments, a = r.sidx, o = r.mediaSequence, u = r.discontinuitySequence, l = r.discontinuityStarts, c = {
    attributes: (i = {
      NAME: e.id,
      BANDWIDTH: e.bandwidth,
      CODECS: e.codecs
    }, i["PROGRAM-ID"] = 1, i),
    uri: "",
    endList: e.type === "static",
    timeline: e.periodStart,
    resolvedUri: "",
    targetDuration: e.duration,
    discontinuitySequence: u,
    discontinuityStarts: l,
    timelineStarts: e.timelineStarts,
    mediaSequence: o,
    segments: t
  };
  return e.contentProtection && (c.contentProtection = e.contentProtection), a && (c.sidx = a), n && (c.attributes.AUDIO = "audio", c.attributes.SUBTITLES = "subs"), c;
}, Gp = function(r) {
  var n, i = r.attributes, e = r.segments, t = r.mediaSequence, a = r.discontinuityStarts, o = r.discontinuitySequence;
  typeof e > "u" && (e = [{
    uri: i.baseUrl,
    timeline: i.periodStart,
    resolvedUri: i.baseUrl || "",
    duration: i.sourceDuration,
    number: 0
  }], i.duration = i.sourceDuration);
  var u = (n = {
    NAME: i.id,
    BANDWIDTH: i.bandwidth
  }, n["PROGRAM-ID"] = 1, n);
  return i.codecs && (u.CODECS = i.codecs), {
    attributes: u,
    uri: "",
    endList: i.type === "static",
    timeline: i.periodStart,
    resolvedUri: i.baseUrl || "",
    targetDuration: i.duration,
    timelineStarts: i.timelineStarts,
    discontinuityStarts: a,
    discontinuitySequence: o,
    mediaSequence: t,
    segments: e
  };
}, zp = function(r, n, i) {
  n === void 0 && (n = {}), i === void 0 && (i = !1);
  var e, t = r.reduce(function(o, u) {
    var l = u.attributes.role && u.attributes.role.value || "", c = u.attributes.lang || "", m = u.attributes.label || "main";
    if (c && !u.attributes.label) {
      var g = l ? " (" + l + ")" : "";
      m = "" + u.attributes.lang + g;
    }
    o[m] || (o[m] = {
      language: c,
      autoselect: !0,
      default: l === "main",
      playlists: [],
      uri: ""
    });
    var _ = Ks(Wp(u, i), n);
    return o[m].playlists.push(_), typeof e > "u" && l === "main" && (e = u, e.default = !0), o;
  }, {});
  if (!e) {
    var a = Object.keys(t)[0];
    t[a].default = !0;
  }
  return t;
}, Kp = function(r, n) {
  return n === void 0 && (n = {}), r.reduce(function(i, e) {
    var t = e.attributes.lang || "text";
    return i[t] || (i[t] = {
      language: t,
      default: !1,
      autoselect: !1,
      playlists: [],
      uri: ""
    }), i[t].playlists.push(Ks(Gp(e), n)), i;
  }, {});
}, $p = function(r) {
  return r.reduce(function(n, i) {
    return i && i.forEach(function(e) {
      var t = e.channel, a = e.language;
      n[a] = {
        autoselect: !1,
        default: !1,
        instreamId: t,
        language: a
      }, e.hasOwnProperty("aspectRatio") && (n[a].aspectRatio = e.aspectRatio), e.hasOwnProperty("easyReader") && (n[a].easyReader = e.easyReader), e.hasOwnProperty("3D") && (n[a]["3D"] = e["3D"]);
    }), n;
  }, {});
}, Xp = function(r) {
  var n, i = r.attributes, e = r.segments, t = r.sidx, a = r.discontinuityStarts, o = {
    attributes: (n = {
      NAME: i.id,
      AUDIO: "audio",
      SUBTITLES: "subs",
      RESOLUTION: {
        width: i.width,
        height: i.height
      },
      CODECS: i.codecs,
      BANDWIDTH: i.bandwidth
    }, n["PROGRAM-ID"] = 1, n),
    uri: "",
    endList: i.type === "static",
    timeline: i.periodStart,
    resolvedUri: "",
    targetDuration: i.duration,
    discontinuityStarts: a,
    timelineStarts: i.timelineStarts,
    segments: e
  };
  return i.frameRate && (o.attributes["FRAME-RATE"] = i.frameRate), i.contentProtection && (o.contentProtection = i.contentProtection), t && (o.sidx = t), o;
}, Yp = function(r) {
  var n = r.attributes;
  return n.mimeType === "video/mp4" || n.mimeType === "video/webm" || n.contentType === "video";
}, Qp = function(r) {
  var n = r.attributes;
  return n.mimeType === "audio/mp4" || n.mimeType === "audio/webm" || n.contentType === "audio";
}, Jp = function(r) {
  var n = r.attributes;
  return n.mimeType === "text/vtt" || n.contentType === "text";
}, Zp = function(r, n) {
  r.forEach(function(i) {
    i.mediaSequence = 0, i.discontinuitySequence = _s(n, function(e) {
      var t = e.timeline;
      return t === i.timeline;
    }), i.segments && i.segments.forEach(function(e, t) {
      e.number = t;
    });
  });
}, $u = function(r) {
  return r ? Object.keys(r).reduce(function(n, i) {
    var e = r[i];
    return n.concat(e.playlists);
  }, []) : [];
}, em = function(r) {
  var n, i = r.dashPlaylists, e = r.locations, t = r.sidxMapping, a = t === void 0 ? {} : t, o = r.previousManifest;
  if (!i.length)
    return {};
  var u = i[0].attributes, l = u.sourceDuration, c = u.type, m = u.suggestedPresentationDelay, g = u.minimumUpdatePeriod, _ = Xa(i.filter(Yp)).map(Xp), C = Xa(i.filter(Qp)), w = Xa(i.filter(Jp)), E = i.map(function(N) {
    return N.attributes.captionServices;
  }).filter(Boolean), M = {
    allowCache: !0,
    discontinuityStarts: [],
    segments: [],
    endList: !0,
    mediaGroups: (n = {
      AUDIO: {},
      VIDEO: {}
    }, n["CLOSED-CAPTIONS"] = {}, n.SUBTITLES = {}, n),
    uri: "",
    duration: l,
    playlists: Hp(_, a)
  };
  g >= 0 && (M.minimumUpdatePeriod = g * 1e3), e && (M.locations = e), c === "dynamic" && (M.suggestedPresentationDelay = m);
  var B = M.playlists.length === 0, z = C.length ? zp(C, a, B) : null, W = w.length ? Kp(w, a) : null, H = _.concat($u(z), $u(W)), $ = H.map(function(N) {
    var q = N.timelineStarts;
    return q;
  });
  return M.timelineStarts = fd($), Zp(H, M.timelineStarts), z && (M.mediaGroups.AUDIO.audio = z), W && (M.mediaGroups.SUBTITLES.subs = W), E.length && (M.mediaGroups["CLOSED-CAPTIONS"].cc = $p(E)), o ? jp({
    oldManifest: o,
    newManifest: M
  }) : M;
}, tm = function(r, n, i) {
  var e = r.NOW, t = r.clientOffset, a = r.availabilityStartTime, o = r.timescale, u = o === void 0 ? 1 : o, l = r.periodStart, c = l === void 0 ? 0 : l, m = r.minimumUpdatePeriod, g = m === void 0 ? 0 : m, _ = (e + t) / 1e3, C = a + c, w = _ + g, E = w - C;
  return Math.ceil((E * u - n) / i);
}, hd = function(r, n) {
  for (var i = r.type, e = r.minimumUpdatePeriod, t = e === void 0 ? 0 : e, a = r.media, o = a === void 0 ? "" : a, u = r.sourceDuration, l = r.timescale, c = l === void 0 ? 1 : l, m = r.startNumber, g = m === void 0 ? 1 : m, _ = r.periodStart, C = [], w = -1, E = 0; E < n.length; E++) {
    var M = n[E], B = M.d, z = M.r || 0, W = M.t || 0;
    w < 0 && (w = W), W && W > w && (w = W);
    var H = void 0;
    if (z < 0) {
      var $ = E + 1;
      $ === n.length ? i === "dynamic" && t > 0 && o.indexOf("$Number$") > 0 ? H = tm(r, w, B) : H = (u * c - w) / B : H = (n[$].t - w) / B;
    } else
      H = z + 1;
    for (var N = g + C.length + H, q = g + C.length; q < N; )
      C.push({
        number: q,
        duration: B / c,
        time: w,
        timeline: _
      }), w += B, q++;
  }
  return C;
}, rm = /\$([A-z]*)(?:(%0)([0-9]+)d)?\$/g, im = function(r) {
  return function(n, i, e, t) {
    if (n === "$$")
      return "$";
    if (typeof r[i] > "u")
      return n;
    var a = "" + r[i];
    return i === "RepresentationID" || (e ? t = parseInt(t, 10) : t = 1, a.length >= t) ? a : "" + new Array(t - a.length + 1).join("0") + a;
  };
}, Xu = function(r, n) {
  return r.replace(rm, im(n));
}, nm = function(r, n) {
  return !r.duration && !n ? [{
    number: r.startNumber || 1,
    duration: r.sourceDuration,
    time: 0,
    timeline: r.periodStart
  }] : r.duration ? Gs(r) : hd(r, n);
}, am = function(r, n) {
  var i = {
    RepresentationID: r.id,
    Bandwidth: r.bandwidth || 0
  }, e = r.initialization, t = e === void 0 ? {
    sourceURL: "",
    range: ""
  } : e, a = Bi({
    baseUrl: r.baseUrl,
    source: Xu(t.sourceURL, i),
    range: t.range
  }), o = nm(r, n);
  return o.map(function(u) {
    i.Number = u.number, i.Time = u.time;
    var l = Xu(r.media || "", i), c = r.timescale || 1, m = r.presentationTimeOffset || 0, g = (
      // Even if the @t attribute is not specified for the segment, segment.time is
      // calculated in mpd-parser prior to this, so it's assumed to be available.
      r.periodStart + (u.time - m) / c
    ), _ = {
      uri: l,
      timeline: u.timeline,
      duration: u.duration,
      resolvedUri: la(r.baseUrl || "", l),
      map: a,
      number: u.number,
      presentationTime: g
    };
    return _;
  });
}, sm = function(r, n) {
  var i = r.baseUrl, e = r.initialization, t = e === void 0 ? {} : e, a = Bi({
    baseUrl: i,
    source: t.sourceURL,
    range: t.range
  }), o = Bi({
    baseUrl: i,
    source: n.media,
    range: n.mediaRange
  });
  return o.map = a, o;
}, om = function(r, n) {
  var i = r.duration, e = r.segmentUrls, t = e === void 0 ? [] : e, a = r.periodStart;
  if (!i && !n || i && n)
    throw new Error(Zr.SEGMENT_TIME_UNSPECIFIED);
  var o = t.map(function(c) {
    return sm(r, c);
  }), u;
  i && (u = Gs(r)), n && (u = hd(r, n));
  var l = u.map(function(c, m) {
    if (o[m]) {
      var g = o[m], _ = r.timescale || 1, C = r.presentationTimeOffset || 0;
      return g.timeline = c.timeline, g.duration = c.duration, g.number = c.number, g.presentationTime = a + (c.time - C) / _, g;
    }
  }).filter(function(c) {
    return c;
  });
  return l;
}, um = function(r) {
  var n = r.attributes, i = r.segmentInfo, e, t;
  i.template ? (t = am, e = dt(n, i.template)) : i.base ? (t = cd, e = dt(n, i.base)) : i.list && (t = om, e = dt(n, i.list));
  var a = {
    attributes: n
  };
  if (!t)
    return a;
  var o = t(e, i.segmentTimeline);
  if (e.duration) {
    var u = e, l = u.duration, c = u.timescale, m = c === void 0 ? 1 : c;
    e.duration = l / m;
  } else o.length ? e.duration = o.reduce(function(g, _) {
    return Math.max(g, Math.ceil(_.duration));
  }, 0) : e.duration = 0;
  return a.attributes = e, a.segments = o, i.base && e.indexRange && (a.sidx = o[0], a.segments = []), a;
}, lm = function(r) {
  return r.map(um);
}, We = function(r, n) {
  return dd(r.childNodes).filter(function(i) {
    var e = i.tagName;
    return e === n;
  });
}, $s = function(r) {
  return r.textContent.trim();
}, dm = function(r) {
  return parseFloat(r.split("/").reduce(function(n, i) {
    return n / i;
  }));
}, Hr = function(r) {
  var n = 31536e3, i = 720 * 60 * 60, e = 1440 * 60, t = 3600, a = 60, o = /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)D)?(?:T(?:(\d*)H)?(?:(\d*)M)?(?:([\d.]*)S)?)?/, u = o.exec(r);
  if (!u)
    return 0;
  var l = u.slice(1), c = l[0], m = l[1], g = l[2], _ = l[3], C = l[4], w = l[5];
  return parseFloat(c || 0) * n + parseFloat(m || 0) * i + parseFloat(g || 0) * e + parseFloat(_ || 0) * t + parseFloat(C || 0) * a + parseFloat(w || 0);
}, cm = function(r) {
  var n = /^\d+-\d+-\d+T\d+:\d+:\d+(\.\d+)?$/;
  return n.test(r) && (r += "Z"), Date.parse(r);
}, Yu = {
  /**
   * Specifies the duration of the entire Media Presentation. Format is a duration string
   * as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  mediaPresentationDuration: function(r) {
    return Hr(r);
  },
  /**
   * Specifies the Segment availability start time for all Segments referred to in this
   * MPD. For a dynamic manifest, it specifies the anchor for the earliest availability
   * time. Format is a date string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The date as seconds from unix epoch
   */
  availabilityStartTime: function(r) {
    return cm(r) / 1e3;
  },
  /**
   * Specifies the smallest period between potential changes to the MPD. Format is a
   * duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  minimumUpdatePeriod: function(r) {
    return Hr(r);
  },
  /**
   * Specifies the suggested presentation delay. Format is a
   * duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  suggestedPresentationDelay: function(r) {
    return Hr(r);
  },
  /**
   * specifices the type of mpd. Can be either "static" or "dynamic"
   *
   * @param {string} value
   *        value of attribute as a string
   *
   * @return {string}
   *         The type as a string
   */
  type: function(r) {
    return r;
  },
  /**
   * Specifies the duration of the smallest time shifting buffer for any Representation
   * in the MPD. Format is a duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  timeShiftBufferDepth: function(r) {
    return Hr(r);
  },
  /**
   * Specifies the PeriodStart time of the Period relative to the availabilityStarttime.
   * Format is a duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  start: function(r) {
    return Hr(r);
  },
  /**
   * Specifies the width of the visual presentation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed width
   */
  width: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the height of the visual presentation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed height
   */
  height: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the bitrate of the representation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed bandwidth
   */
  bandwidth: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the frame rate of the representation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed frame rate
   */
  frameRate: function(r) {
    return dm(r);
  },
  /**
   * Specifies the number of the first Media Segment in this Representation in the Period
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed number
   */
  startNumber: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the timescale in units per seconds
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed timescale
   */
  timescale: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the presentationTimeOffset.
   *
   * @param {string} value
   *        value of the attribute as a string
   *
   * @return {number}
   *         The parsed presentationTimeOffset
   */
  presentationTimeOffset: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the constant approximate Segment duration
   * NOTE: The <Period> element also contains an @duration attribute. This duration
   *       specifies the duration of the Period. This attribute is currently not
   *       supported by the rest of the parser, however we still check for it to prevent
   *       errors.
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed duration
   */
  duration: function(r) {
    var n = parseInt(r, 10);
    return isNaN(n) ? Hr(r) : n;
  },
  /**
   * Specifies the Segment duration, in units of the value of the @timescale.
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed duration
   */
  d: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the MPD start time, in @timescale units, the first Segment in the series
   * starts relative to the beginning of the Period
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed time
   */
  t: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Specifies the repeat count of the number of following contiguous Segments with the
   * same duration expressed by the value of @d
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed number
   */
  r: function(r) {
    return parseInt(r, 10);
  },
  /**
   * Default parser for all other attributes. Acts as a no-op and just returns the value
   * as a string
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {string}
   *         Unparsed value
   */
  DEFAULT: function(r) {
    return r;
  }
}, nt = function(r) {
  return r && r.attributes ? dd(r.attributes).reduce(function(n, i) {
    var e = Yu[i.name] || Yu.DEFAULT;
    return n[i.name] = e(i.value), n;
  }, {}) : {};
}, fm = {
  "urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b": "org.w3.clearkey",
  "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed": "com.widevine.alpha",
  "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95": "com.microsoft.playready",
  "urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb": "com.adobe.primetime"
}, ha = function(r, n) {
  return n.length ? ca(r.map(function(i) {
    return n.map(function(e) {
      return la(i, $s(e));
    });
  })) : r;
}, Xs = function(r) {
  var n = We(r, "SegmentTemplate")[0], i = We(r, "SegmentList")[0], e = i && We(i, "SegmentURL").map(function(g) {
    return dt({
      tag: "SegmentURL"
    }, nt(g));
  }), t = We(r, "SegmentBase")[0], a = i || n, o = a && We(a, "SegmentTimeline")[0], u = i || t || n, l = u && We(u, "Initialization")[0], c = n && nt(n);
  c && l ? c.initialization = l && nt(l) : c && c.initialization && (c.initialization = {
    sourceURL: c.initialization
  });
  var m = {
    template: c,
    segmentTimeline: o && We(o, "S").map(function(g) {
      return nt(g);
    }),
    list: i && dt(nt(i), {
      segmentUrls: e,
      initialization: nt(l)
    }),
    base: t && dt(nt(t), {
      initialization: nt(l)
    })
  };
  return Object.keys(m).forEach(function(g) {
    m[g] || delete m[g];
  }), m;
}, hm = function(r, n, i) {
  return function(e) {
    var t = We(e, "BaseURL"), a = ha(n, t), o = dt(r, nt(e)), u = Xs(e);
    return a.map(function(l) {
      return {
        segmentInfo: dt(i, u),
        attributes: dt(o, {
          baseUrl: l
        })
      };
    });
  };
}, pm = function(r) {
  return r.reduce(function(n, i) {
    var e = nt(i);
    e.schemeIdUri && (e.schemeIdUri = e.schemeIdUri.toLowerCase());
    var t = fm[e.schemeIdUri];
    if (t) {
      n[t] = {
        attributes: e
      };
      var a = We(i, "cenc:pssh")[0];
      if (a) {
        var o = $s(a);
        n[t].pssh = o && rd(o);
      }
    }
    return n;
  }, {});
}, mm = function(r) {
  if (r.schemeIdUri === "urn:scte:dash:cc:cea-608:2015") {
    var n = typeof r.value != "string" ? [] : r.value.split(";");
    return n.map(function(e) {
      var t, a;
      if (a = e, /^CC\d=/.test(e)) {
        var o = e.split("=");
        t = o[0], a = o[1];
      } else /^CC\d$/.test(e) && (t = e);
      return {
        channel: t,
        language: a
      };
    });
  } else if (r.schemeIdUri === "urn:scte:dash:cc:cea-708:2015") {
    var i = typeof r.value != "string" ? [] : r.value.split(";");
    return i.map(function(e) {
      var t = {
        // service or channel number 1-63
        channel: void 0,
        // language is a 3ALPHA per ISO 639.2/B
        // field is required
        language: void 0,
        // BIT 1/0 or ?
        // default value is 1, meaning 16:9 aspect ratio, 0 is 4:3, ? is unknown
        aspectRatio: 1,
        // BIT 1/0
        // easy reader flag indicated the text is tailed to the needs of beginning readers
        // default 0, or off
        easyReader: 0,
        // BIT 1/0
        // If 3d metadata is present (CEA-708.1) then 1
        // default 0
        "3D": 0
      };
      if (/=/.test(e)) {
        var a = e.split("="), o = a[0], u = a[1], l = u === void 0 ? "" : u;
        t.channel = o, t.language = e, l.split(",").forEach(function(c) {
          var m = c.split(":"), g = m[0], _ = m[1];
          g === "lang" ? t.language = _ : g === "er" ? t.easyReader = Number(_) : g === "war" ? t.aspectRatio = Number(_) : g === "3D" && (t["3D"] = Number(_));
        });
      } else
        t.language = e;
      return t.channel && (t.channel = "SERVICE" + t.channel), t;
    });
  }
}, gm = function(r, n, i) {
  return function(e) {
    var t = nt(e), a = ha(n, We(e, "BaseURL")), o = We(e, "Role")[0], u = {
      role: nt(o)
    }, l = dt(r, t, u), c = We(e, "Accessibility")[0], m = mm(nt(c));
    m && (l = dt(l, {
      captionServices: m
    }));
    var g = We(e, "Label")[0];
    if (g && g.childNodes.length) {
      var _ = g.childNodes[0].nodeValue.trim();
      l = dt(l, {
        label: _
      });
    }
    var C = pm(We(e, "ContentProtection"));
    Object.keys(C).length && (l = dt(l, {
      contentProtection: C
    }));
    var w = Xs(e), E = We(e, "Representation"), M = dt(i, w);
    return ca(E.map(hm(l, a, M)));
  };
}, vm = function(r, n) {
  return function(i, e) {
    var t = ha(n, We(i.node, "BaseURL")), a = dt(r, {
      periodStart: i.attributes.start
    });
    typeof i.attributes.duration == "number" && (a.periodDuration = i.attributes.duration);
    var o = We(i.node, "AdaptationSet"), u = Xs(i.node);
    return ca(o.map(gm(a, t, u)));
  };
}, ym = function(r) {
  var n = r.attributes, i = r.priorPeriodAttributes, e = r.mpdType;
  return typeof n.start == "number" ? n.start : i && typeof i.start == "number" && typeof i.duration == "number" ? i.start + i.duration : !i && e === "static" ? 0 : null;
}, _m = function(r, n) {
  n === void 0 && (n = {});
  var i = n, e = i.manifestUri, t = e === void 0 ? "" : e, a = i.NOW, o = a === void 0 ? Date.now() : a, u = i.clientOffset, l = u === void 0 ? 0 : u, c = We(r, "Period");
  if (!c.length)
    throw new Error(Zr.INVALID_NUMBER_OF_PERIOD);
  var m = We(r, "Location"), g = nt(r), _ = ha([t], We(r, "BaseURL"));
  g.type = g.type || "static", g.sourceDuration = g.mediaPresentationDuration || 0, g.NOW = o, g.clientOffset = l, m.length && (g.locations = m.map($s));
  var C = [];
  return c.forEach(function(w, E) {
    var M = nt(w), B = C[E - 1];
    M.start = ym({
      attributes: M,
      priorPeriodAttributes: B ? B.attributes : null,
      mpdType: g.type
    }), C.push({
      node: w,
      attributes: M
    });
  }), {
    locations: g.locations,
    representationInfo: ca(C.map(vm(g, _)))
  };
}, pd = function(r) {
  if (r === "")
    throw new Error(Zr.DASH_EMPTY_MANIFEST);
  var n = new Ip.DOMParser(), i, e;
  try {
    i = n.parseFromString(r, "application/xml"), e = i && i.documentElement.tagName === "MPD" ? i.documentElement : null;
  } catch {
  }
  if (!e || e && e.getElementsByTagName("parsererror").length > 0)
    throw new Error(Zr.DASH_INVALID_XML);
  return e;
}, Tm = function(r) {
  var n = We(r, "UTCTiming")[0];
  if (!n)
    return null;
  var i = nt(n);
  switch (i.schemeIdUri) {
    case "urn:mpeg:dash:utc:http-head:2014":
    case "urn:mpeg:dash:utc:http-head:2012":
      i.method = "HEAD";
      break;
    case "urn:mpeg:dash:utc:http-xsdate:2014":
    case "urn:mpeg:dash:utc:http-iso:2014":
    case "urn:mpeg:dash:utc:http-xsdate:2012":
    case "urn:mpeg:dash:utc:http-iso:2012":
      i.method = "GET";
      break;
    case "urn:mpeg:dash:utc:direct:2014":
    case "urn:mpeg:dash:utc:direct:2012":
      i.method = "DIRECT", i.value = Date.parse(i.value);
      break;
    case "urn:mpeg:dash:utc:http-ntp:2014":
    case "urn:mpeg:dash:utc:ntp:2014":
    case "urn:mpeg:dash:utc:sntp:2014":
    default:
      throw new Error(Zr.UNSUPPORTED_UTC_TIMING_SCHEME);
  }
  return i;
}, bm = function(r, n) {
  n === void 0 && (n = {});
  var i = _m(pd(r), n), e = lm(i.representationInfo);
  return em({
    dashPlaylists: e,
    locations: i.locations,
    sidxMapping: n.sidxMapping,
    previousManifest: n.previousManifest
  });
}, xm = function(r) {
  return Tm(pd(r));
}, Ya, Qu;
function Sm() {
  if (Qu) return Ya;
  Qu = 1;
  var s = Math.pow(2, 32), r = function(n) {
    var i = new DataView(n.buffer, n.byteOffset, n.byteLength), e;
    return i.getBigUint64 ? (e = i.getBigUint64(0), e < Number.MAX_SAFE_INTEGER ? Number(e) : e) : i.getUint32(0) * s + i.getUint32(4);
  };
  return Ya = {
    getUint64: r,
    MAX_UINT32: s
  }, Ya;
}
var Qa, Ju;
function Em() {
  if (Ju) return Qa;
  Ju = 1;
  var s = Sm().getUint64, r = function(n) {
    var i = new DataView(n.buffer, n.byteOffset, n.byteLength), e = {
      version: n[0],
      flags: new Uint8Array(n.subarray(1, 4)),
      references: [],
      referenceId: i.getUint32(4),
      timescale: i.getUint32(8)
    }, t = 12;
    e.version === 0 ? (e.earliestPresentationTime = i.getUint32(t), e.firstOffset = i.getUint32(t + 4), t += 8) : (e.earliestPresentationTime = s(n.subarray(t)), e.firstOffset = s(n.subarray(t + 8)), t += 16), t += 2;
    var a = i.getUint16(t);
    for (t += 2; a > 0; t += 12, a--)
      e.references.push({
        referenceType: (n[t] & 128) >>> 7,
        referencedSize: i.getUint32(t) & 2147483647,
        subsegmentDuration: i.getUint32(t + 4),
        startsWithSap: !!(n[t + 8] & 128),
        sapType: (n[t + 8] & 112) >>> 4,
        sapDeltaTime: i.getUint32(t + 8) & 268435455
      });
    return e;
  };
  return Qa = r, Qa;
}
var Cm = Em();
const Am = /* @__PURE__ */ vr(Cm);
var Dm = fe([73, 68, 51]), wm = function(r, n) {
  n === void 0 && (n = 0), r = fe(r);
  var i = r[n + 5], e = r[n + 6] << 21 | r[n + 7] << 14 | r[n + 8] << 7 | r[n + 9], t = (i & 16) >> 4;
  return t ? e + 20 : e + 10;
}, Pi = function s(r, n) {
  return n === void 0 && (n = 0), r = fe(r), r.length - n < 10 || !Me(r, Dm, {
    offset: n
  }) ? n : (n += wm(r, n), s(r, n));
}, Zu = function(r) {
  return typeof r == "string" ? od(r) : r;
}, km = function(r) {
  return Array.isArray(r) ? r.map(function(n) {
    return Zu(n);
  }) : [Zu(r)];
}, Pm = function s(r, n, i) {
  i === void 0 && (i = !1), n = km(n), r = fe(r);
  var e = [];
  if (!n.length)
    return e;
  for (var t = 0; t < r.length; ) {
    var a = (r[t] << 24 | r[t + 1] << 16 | r[t + 2] << 8 | r[t + 3]) >>> 0, o = r.subarray(t + 4, t + 8);
    if (a === 0)
      break;
    var u = t + a;
    if (u > r.length) {
      if (i)
        break;
      u = r.length;
    }
    var l = r.subarray(t + 8, u);
    Me(o, n[0]) && (n.length === 1 ? e.push(l) : e.push.apply(e, s(l, n.slice(1), i))), t = u;
  }
  return e;
}, An = {
  EBML: fe([26, 69, 223, 163]),
  DocType: fe([66, 130]),
  Segment: fe([24, 83, 128, 103]),
  SegmentInfo: fe([21, 73, 169, 102]),
  Tracks: fe([22, 84, 174, 107]),
  Track: fe([174]),
  TrackNumber: fe([215]),
  DefaultDuration: fe([35, 227, 131]),
  TrackEntry: fe([174]),
  TrackType: fe([131]),
  FlagDefault: fe([136]),
  CodecID: fe([134]),
  CodecPrivate: fe([99, 162]),
  VideoTrack: fe([224]),
  AudioTrack: fe([225]),
  // Not used yet, but will be used for live webm/mkv
  // see https://www.matroska.org/technical/basics.html#block-structure
  // see https://www.matroska.org/technical/basics.html#simpleblock-structure
  Cluster: fe([31, 67, 182, 117]),
  Timestamp: fe([231]),
  TimestampScale: fe([42, 215, 177]),
  BlockGroup: fe([160]),
  BlockDuration: fe([155]),
  Block: fe([161]),
  SimpleBlock: fe([163])
}, Ts = [128, 64, 32, 16, 8, 4, 2, 1], Im = function(r) {
  for (var n = 1, i = 0; i < Ts.length && !(r & Ts[i]); i++)
    n++;
  return n;
}, Hn = function(r, n, i, e) {
  i === void 0 && (i = !0), e === void 0 && (e = !1);
  var t = Im(r[n]), a = r.subarray(n, n + t);
  return i && (a = Array.prototype.slice.call(r, n, n + t), a[0] ^= Ts[t - 1]), {
    length: t,
    value: Sp(a, {
      signed: e
    }),
    bytes: a
  };
}, el = function s(r) {
  return typeof r == "string" ? r.match(/.{1,2}/g).map(function(n) {
    return s(n);
  }) : typeof r == "number" ? Ep(r) : r;
}, Om = function(r) {
  return Array.isArray(r) ? r.map(function(n) {
    return el(n);
  }) : [el(r)];
}, Lm = function s(r, n, i) {
  if (i >= n.length)
    return n.length;
  var e = Hn(n, i, !1);
  if (Me(r.bytes, e.bytes))
    return i;
  var t = Hn(n, i + e.length);
  return s(r, n, i + t.length + t.value + e.length);
}, tl = function s(r, n) {
  n = Om(n), r = fe(r);
  var i = [];
  if (!n.length)
    return i;
  for (var e = 0; e < r.length; ) {
    var t = Hn(r, e, !1), a = Hn(r, e + t.length), o = e + t.length + a.length;
    a.value === 127 && (a.value = Lm(t, r, o), a.value !== r.length && (a.value -= o));
    var u = o + a.value > r.length ? r.length : o + a.value, l = r.subarray(o, u);
    Me(n[0], t.bytes) && (n.length === 1 ? i.push(l) : i = i.concat(s(l, n.slice(1))));
    var c = t.length + a.length + l.length;
    e += c;
  }
  return i;
}, Fm = fe([0, 0, 0, 1]), Rm = fe([0, 0, 1]), Mm = fe([0, 0, 3]), Nm = function(r) {
  for (var n = [], i = 1; i < r.length - 2; )
    Me(r.subarray(i, i + 3), Mm) && (n.push(i + 2), i++), i++;
  if (n.length === 0)
    return r;
  var e = r.length - n.length, t = new Uint8Array(e), a = 0;
  for (i = 0; i < e; a++, i++)
    a === n[0] && (a++, n.shift()), t[i] = r[a];
  return t;
}, md = function(r, n, i, e) {
  r = fe(r), i = [].concat(i);
  for (var t = 0, a, o = 0; t < r.length && (o < e || a); ) {
    var u = void 0;
    if (Me(r.subarray(t), Fm) ? u = 4 : Me(r.subarray(t), Rm) && (u = 3), !u) {
      t++;
      continue;
    }
    if (o++, a)
      return Nm(r.subarray(a, t));
    var l = void 0;
    n === "h264" ? l = r[t + u] & 31 : n === "h265" && (l = r[t + u] >> 1 & 63), i.indexOf(l) !== -1 && (a = t + u), t += u + (n === "h264" ? 1 : 2);
  }
  return r.subarray(0, 0);
}, Bm = function(r, n, i) {
  return md(r, "h264", n, i);
}, Um = function(r, n, i) {
  return md(r, "h265", n, i);
}, ut = {
  // "webm" string literal in hex
  webm: fe([119, 101, 98, 109]),
  // "matroska" string literal in hex
  matroska: fe([109, 97, 116, 114, 111, 115, 107, 97]),
  // "fLaC" string literal in hex
  flac: fe([102, 76, 97, 67]),
  // "OggS" string literal in hex
  ogg: fe([79, 103, 103, 83]),
  // ac-3 sync byte, also works for ec-3 as that is simply a codec
  // of ac-3
  ac3: fe([11, 119]),
  // "RIFF" string literal in hex used for wav and avi
  riff: fe([82, 73, 70, 70]),
  // "AVI" string literal in hex
  avi: fe([65, 86, 73]),
  // "WAVE" string literal in hex
  wav: fe([87, 65, 86, 69]),
  // "ftyp3g" string literal in hex
  "3gp": fe([102, 116, 121, 112, 51, 103]),
  // "ftyp" string literal in hex
  mp4: fe([102, 116, 121, 112]),
  // "styp" string literal in hex
  fmp4: fe([115, 116, 121, 112]),
  // "ftypqt" string literal in hex
  mov: fe([102, 116, 121, 112, 113, 116]),
  // moov string literal in hex
  moov: fe([109, 111, 111, 118]),
  // moof string literal in hex
  moof: fe([109, 111, 111, 102])
}, ei = {
  aac: function(r) {
    var n = Pi(r);
    return Me(r, [255, 16], {
      offset: n,
      mask: [255, 22]
    });
  },
  mp3: function(r) {
    var n = Pi(r);
    return Me(r, [255, 2], {
      offset: n,
      mask: [255, 6]
    });
  },
  webm: function(r) {
    var n = tl(r, [An.EBML, An.DocType])[0];
    return Me(n, ut.webm);
  },
  mkv: function(r) {
    var n = tl(r, [An.EBML, An.DocType])[0];
    return Me(n, ut.matroska);
  },
  mp4: function(r) {
    if (ei["3gp"](r) || ei.mov(r))
      return !1;
    if (Me(r, ut.mp4, {
      offset: 4
    }) || Me(r, ut.fmp4, {
      offset: 4
    }) || Me(r, ut.moof, {
      offset: 4
    }) || Me(r, ut.moov, {
      offset: 4
    }))
      return !0;
  },
  mov: function(r) {
    return Me(r, ut.mov, {
      offset: 4
    });
  },
  "3gp": function(r) {
    return Me(r, ut["3gp"], {
      offset: 4
    });
  },
  ac3: function(r) {
    var n = Pi(r);
    return Me(r, ut.ac3, {
      offset: n
    });
  },
  ts: function(r) {
    if (r.length < 189 && r.length >= 1)
      return r[0] === 71;
    for (var n = 0; n + 188 < r.length && n < 188; ) {
      if (r[n] === 71 && r[n + 188] === 71)
        return !0;
      n += 1;
    }
    return !1;
  },
  flac: function(r) {
    var n = Pi(r);
    return Me(r, ut.flac, {
      offset: n
    });
  },
  ogg: function(r) {
    return Me(r, ut.ogg);
  },
  avi: function(r) {
    return Me(r, ut.riff) && Me(r, ut.avi, {
      offset: 8
    });
  },
  wav: function(r) {
    return Me(r, ut.riff) && Me(r, ut.wav, {
      offset: 8
    });
  },
  h264: function(r) {
    return Bm(r, 7, 3).length;
  },
  h265: function(r) {
    return Um(r, [32, 33], 3).length;
  }
}, bs = Object.keys(ei).filter(function(s) {
  return s !== "ts" && s !== "h264" && s !== "h265";
}).concat(["ts", "h264", "h265"]);
bs.forEach(function(s) {
  var r = ei[s];
  ei[s] = function(n) {
    return r(fe(n));
  };
});
var Vm = ei, Ys = function(r) {
  r = fe(r);
  for (var n = 0; n < bs.length; n++) {
    var i = bs[n];
    if (Vm[i](r))
      return i;
  }
  return "";
}, qm = function(r) {
  return Pm(r, ["moof"]).length > 0;
}, Ja, rl;
function jm() {
  if (rl) return Ja;
  rl = 1;
  var s = 9e4, r, n, i, e, t, a, o;
  return r = function(u) {
    return u * s;
  }, n = function(u, l) {
    return u * l;
  }, i = function(u) {
    return u / s;
  }, e = function(u, l) {
    return u / l;
  }, t = function(u, l) {
    return r(e(u, l));
  }, a = function(u, l) {
    return n(i(u), l);
  }, o = function(u, l, c) {
    return i(c ? u : u - l);
  }, Ja = {
    ONE_SECOND_IN_TS: s,
    secondsToVideoTs: r,
    secondsToAudioTs: n,
    videoTsToSeconds: i,
    audioTsToSeconds: e,
    audioTsToVideoTs: t,
    videoTsToAudioTs: a,
    metadataTsToSeconds: o
  }, Ja;
}
var Wn = jm();
function xs(s) {
  return xs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, xs(s);
}
function Hm(s) {
  try {
    return Function.toString.call(s).indexOf("[native code]") !== -1;
  } catch {
    return typeof s == "function";
  }
}
function Ss(s) {
  var r = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
  return Ss = function(i) {
    if (i === null || !Hm(i)) return i;
    if (typeof i != "function") throw new TypeError("Super expression must either be null or a function");
    if (r !== void 0) {
      if (r.has(i)) return r.get(i);
      r.set(i, e);
    }
    function e() {
      return td(i, arguments, xs(this).constructor);
    }
    return e.prototype = Object.create(i.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), Jr(e, i);
  }, Ss(s);
}
/**
 * @license
 * Video.js 7.21.7 <http://videojs.com/>
 * Copyright Brightcove, Inc. <https://www.brightcove.com/>
 * Available under Apache License Version 2.0
 * <https://github.com/videojs/video.js/blob/main/LICENSE>
 *
 * Includes vtt.js <https://github.com/mozilla/vtt.js>
 * Available under Apache License Version 2.0
 * <https://github.com/mozilla/vtt.js/blob/main/LICENSE>
 */
var gd = "7.21.7", Jt = {}, pr = function(r, n) {
  return Jt[r] = Jt[r] || [], n && (Jt[r] = Jt[r].concat(n)), Jt[r];
}, Wm = function(r, n) {
  pr(r, n);
}, vd = function(r, n) {
  var i = pr(r).indexOf(n);
  return i <= -1 ? !1 : (Jt[r] = Jt[r].slice(), Jt[r].splice(i, 1), !0);
}, Gm = function(r, n) {
  pr(r, [].concat(n).map(function(i) {
    var e = function t() {
      return vd(r, t), i.apply(void 0, arguments);
    };
    return e;
  }));
}, Gn = {
  prefixed: !0
}, Nn = [
  ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror", "fullscreen"],
  // WebKit
  ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "-webkit-full-screen"],
  // Mozilla
  ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror", "-moz-full-screen"],
  // Microsoft
  ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError", "-ms-fullscreen"]
], il = Nn[0], Ii;
for (var Dn = 0; Dn < Nn.length; Dn++)
  if (Nn[Dn][1] in ae) {
    Ii = Nn[Dn];
    break;
  }
if (Ii) {
  for (var wn = 0; wn < Ii.length; wn++)
    Gn[il[wn]] = Ii[wn];
  Gn.prefixed = Ii[0] !== il[0];
}
var gt = [], zm = function(r, n) {
  return function(i, e, t) {
    var a = n.levels[e], o = new RegExp("^(" + a + ")$");
    if (i !== "log" && t.unshift(i.toUpperCase() + ":"), t.unshift(r + ":"), gt) {
      gt.push([].concat(t));
      var u = gt.length - 1e3;
      gt.splice(0, u > 0 ? u : 0);
    }
    if (P.console) {
      var l = P.console[i];
      !l && i === "debug" && (l = P.console.info || P.console.log), !(!l || !a || !o.test(i)) && l[Array.isArray(t) ? "apply" : "call"](P.console, t);
    }
  };
};
function yd(s) {
  var r = "info", n, i = function() {
    for (var t = arguments.length, a = new Array(t), o = 0; o < t; o++)
      a[o] = arguments[o];
    n("log", r, a);
  };
  return n = zm(s, i), i.createLogger = function(e) {
    return yd(s + ": " + e);
  }, i.levels = {
    all: "debug|log|warn|error",
    off: "",
    debug: "debug|log|warn|error",
    info: "log|warn|error",
    warn: "warn|error",
    error: "error",
    DEFAULT: r
  }, i.level = function(e) {
    if (typeof e == "string") {
      if (!i.levels.hasOwnProperty(e))
        throw new Error('"' + e + '" in not a valid log level');
      r = e;
    }
    return r;
  }, i.history = function() {
    return gt ? [].concat(gt) : [];
  }, i.history.filter = function(e) {
    return (gt || []).filter(function(t) {
      return new RegExp(".*" + e + ".*").test(t[0]);
    });
  }, i.history.clear = function() {
    gt && (gt.length = 0);
  }, i.history.disable = function() {
    gt !== null && (gt.length = 0, gt = null);
  }, i.history.enable = function() {
    gt === null && (gt = []);
  }, i.error = function() {
    for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++)
      t[a] = arguments[a];
    return n("error", r, t);
  }, i.warn = function() {
    for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++)
      t[a] = arguments[a];
    return n("warn", r, t);
  }, i.debug = function() {
    for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++)
      t[a] = arguments[a];
    return n("debug", r, t);
  }, i;
}
var Te = yd("VIDEOJS"), _d = Te.createLogger, Km = Object.prototype.toString, Td = function(r) {
  return rr(r) ? Object.keys(r) : [];
};
function Xr(s, r) {
  Td(s).forEach(function(n) {
    return r(s[n], n);
  });
}
function $m(s, r, n) {
  return n === void 0 && (n = 0), Td(s).reduce(function(i, e) {
    return r(i, s[e], e);
  }, n);
}
function Ue(s) {
  for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
    n[i - 1] = arguments[i];
  return Object.assign ? Ot.apply(void 0, [s].concat(n)) : (n.forEach(function(e) {
    e && Xr(e, function(t, a) {
      s[a] = t;
    });
  }), s);
}
function rr(s) {
  return !!s && typeof s == "object";
}
function Ui(s) {
  return rr(s) && Km.call(s) === "[object Object]" && s.constructor === Object;
}
function Vi(s, r) {
  if (!s || !r)
    return "";
  if (typeof P.getComputedStyle == "function") {
    var n;
    try {
      n = P.getComputedStyle(s);
    } catch {
      return "";
    }
    return n ? n.getPropertyValue(r) || n[r] : "";
  }
  return "";
}
var Je = P.navigator && P.navigator.userAgent || "", nl = /AppleWebKit\/([\d.]+)/i.exec(Je), Xm = nl ? parseFloat(nl.pop()) : null, bd = /iPod/i.test(Je), Ym = (function() {
  var s = Je.match(/OS (\d+)_/i);
  return s && s[1] ? s[1] : null;
})(), nr = /Android/i.test(Je), Qs = (function() {
  var s = Je.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
  if (!s)
    return null;
  var r = s[1] && parseFloat(s[1]), n = s[2] && parseFloat(s[2]);
  return r && n ? parseFloat(s[1] + "." + s[2]) : r || null;
})(), xd = nr && Qs < 5 && Xm < 537, Sd = /Firefox/i.test(Je), Gi = /Edg/i.test(Je), ar = !Gi && (/Chrome/i.test(Je) || /CriOS/i.test(Je)), Ed = (function() {
  var s = Je.match(/(Chrome|CriOS)\/(\d+)/);
  return s && s[2] ? parseFloat(s[2]) : null;
})(), zi = (function() {
  var s = /MSIE\s(\d+)\.\d/.exec(Je), r = s && parseFloat(s[1]);
  return !r && /Trident\/7.0/i.test(Je) && /rv:11.0/.test(Je) && (r = 11), r;
})(), Js = /Safari/i.test(Je) && !ar && !nr && !Gi, Cd = /Windows/i.test(Je), ti = !!(oi() && ("ontouchstart" in P || P.navigator.maxTouchPoints || P.DocumentTouch && P.document instanceof P.DocumentTouch)), Zs = /iPad/i.test(Je) || Js && ti && !/iPhone/i.test(Je), eo = /iPhone/i.test(Je) && !Zs, ht = eo || Zs || bd, pa = (Js || ht) && !ar, Qm = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  IS_IPOD: bd,
  IOS_VERSION: Ym,
  IS_ANDROID: nr,
  ANDROID_VERSION: Qs,
  IS_NATIVE_ANDROID: xd,
  IS_FIREFOX: Sd,
  IS_EDGE: Gi,
  IS_CHROME: ar,
  CHROME_VERSION: Ed,
  IE_VERSION: zi,
  IS_SAFARI: Js,
  IS_WINDOWS: Cd,
  TOUCH_ENABLED: ti,
  IS_IPAD: Zs,
  IS_IPHONE: eo,
  IS_IOS: ht,
  IS_ANY_SAFARI: pa
});
function al(s) {
  return typeof s == "string" && !!s.trim();
}
function Ad(s) {
  if (s.indexOf(" ") >= 0)
    throw new Error("class has illegal whitespace characters");
}
function Jm(s) {
  return new RegExp("(^|\\s)" + s + "($|\\s)");
}
function oi() {
  return ae === P.document;
}
function ui(s) {
  return rr(s) && s.nodeType === 1;
}
function Dd() {
  try {
    return P.parent !== P.self;
  } catch {
    return !0;
  }
}
function wd(s) {
  return function(r, n) {
    if (!al(r))
      return ae[s](null);
    al(n) && (n = ae.querySelector(n));
    var i = ui(n) ? n : ae;
    return i[s] && i[s](r);
  };
}
function Ee(s, r, n, i) {
  s === void 0 && (s = "div"), r === void 0 && (r = {}), n === void 0 && (n = {});
  var e = ae.createElement(s);
  return Object.getOwnPropertyNames(r).forEach(function(t) {
    var a = r[t];
    t.indexOf("aria-") !== -1 || t === "role" || t === "type" ? (Te.warn(`Setting attributes in the second argument of createEl()
has been deprecated. Use the third argument instead.
` + ("createEl(type, properties, attributes). Attempting to set " + t + " to " + a + ".")), e.setAttribute(t, a)) : t === "textContent" ? Nr(e, a) : (e[t] !== a || t === "tabIndex") && (e[t] = a);
  }), Object.getOwnPropertyNames(n).forEach(function(t) {
    e.setAttribute(t, n[t]);
  }), i && ro(e, i), e;
}
function Nr(s, r) {
  return typeof s.textContent > "u" ? s.innerText = r : s.textContent = r, s;
}
function Es(s, r) {
  r.firstChild ? r.insertBefore(s, r.firstChild) : r.appendChild(s);
}
function Fr(s, r) {
  return Ad(r), s.classList ? s.classList.contains(r) : Jm(r).test(s.className);
}
function er(s, r) {
  return s.classList ? s.classList.add(r) : Fr(s, r) || (s.className = (s.className + " " + r).trim()), s;
}
function Ki(s, r) {
  return s ? (s.classList ? s.classList.remove(r) : (Ad(r), s.className = s.className.split(/\s+/).filter(function(n) {
    return n !== r;
  }).join(" ")), s) : (Te.warn("removeClass was called with an element that doesn't exist"), null);
}
function kd(s, r, n) {
  var i = Fr(s, r);
  if (typeof n == "function" && (n = n(s, r)), typeof n != "boolean" && (n = !i), n !== i)
    return n ? er(s, r) : Ki(s, r), s;
}
function Pd(s, r) {
  Object.getOwnPropertyNames(r).forEach(function(n) {
    var i = r[n];
    i === null || typeof i > "u" || i === !1 ? s.removeAttribute(n) : s.setAttribute(n, i === !0 ? "" : i);
  });
}
function Qt(s) {
  var r = {}, n = ",autoplay,controls,playsinline,loop,muted,default,defaultMuted,";
  if (s && s.attributes && s.attributes.length > 0)
    for (var i = s.attributes, e = i.length - 1; e >= 0; e--) {
      var t = i[e].name, a = i[e].value;
      (typeof s[t] == "boolean" || n.indexOf("," + t + ",") !== -1) && (a = a !== null), r[t] = a;
    }
  return r;
}
function Id(s, r) {
  return s.getAttribute(r);
}
function ri(s, r, n) {
  s.setAttribute(r, n);
}
function ma(s, r) {
  s.removeAttribute(r);
}
function Od() {
  ae.body.focus(), ae.onselectstart = function() {
    return !1;
  };
}
function Ld() {
  ae.onselectstart = function() {
    return !0;
  };
}
function ii(s) {
  if (s && s.getBoundingClientRect && s.parentNode) {
    var r = s.getBoundingClientRect(), n = {};
    return ["bottom", "height", "left", "right", "top", "width"].forEach(function(i) {
      r[i] !== void 0 && (n[i] = r[i]);
    }), n.height || (n.height = parseFloat(Vi(s, "height"))), n.width || (n.width = parseFloat(Vi(s, "width"))), n;
  }
}
function qi(s) {
  if (!s || s && !s.offsetParent)
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
  for (var r = s.offsetWidth, n = s.offsetHeight, i = 0, e = 0; s.offsetParent && s !== ae[Gn.fullscreenElement]; )
    i += s.offsetLeft, e += s.offsetTop, s = s.offsetParent;
  return {
    left: i,
    top: e,
    width: r,
    height: n
  };
}
function ga(s, r) {
  var n = {
    x: 0,
    y: 0
  };
  if (ht)
    for (var i = s; i && i.nodeName.toLowerCase() !== "html"; ) {
      var e = Vi(i, "transform");
      if (/^matrix/.test(e)) {
        var t = e.slice(7, -1).split(/,\s/).map(Number);
        n.x += t[4], n.y += t[5];
      } else if (/^matrix3d/.test(e)) {
        var a = e.slice(9, -1).split(/,\s/).map(Number);
        n.x += a[12], n.y += a[13];
      }
      i = i.parentNode;
    }
  var o = {}, u = qi(r.target), l = qi(s), c = l.width, m = l.height, g = r.offsetY - (l.top - u.top), _ = r.offsetX - (l.left - u.left);
  return r.changedTouches && (_ = r.changedTouches[0].pageX - l.left, g = r.changedTouches[0].pageY + l.top, ht && (_ -= n.x, g -= n.y)), o.y = 1 - Math.max(0, Math.min(1, g / m)), o.x = Math.max(0, Math.min(1, _ / c)), o;
}
function Fd(s) {
  return rr(s) && s.nodeType === 3;
}
function to(s) {
  for (; s.firstChild; )
    s.removeChild(s.firstChild);
  return s;
}
function Rd(s) {
  return typeof s == "function" && (s = s()), (Array.isArray(s) ? s : [s]).map(function(r) {
    if (typeof r == "function" && (r = r()), ui(r) || Fd(r))
      return r;
    if (typeof r == "string" && /\S/.test(r))
      return ae.createTextNode(r);
  }).filter(function(r) {
    return r;
  });
}
function ro(s, r) {
  return Rd(r).forEach(function(n) {
    return s.appendChild(n);
  }), s;
}
function Md(s, r) {
  return ro(to(s), r);
}
function ji(s) {
  return s.button === void 0 && s.buttons === void 0 || s.button === 0 && s.buttons === void 0 || s.type === "mouseup" && s.button === 0 && s.buttons === 0 ? !0 : !(s.button !== 0 || s.buttons !== 1);
}
var mr = wd("querySelector"), Nd = wd("querySelectorAll"), Bd = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  isReal: oi,
  isEl: ui,
  isInFrame: Dd,
  createEl: Ee,
  textContent: Nr,
  prependTo: Es,
  hasClass: Fr,
  addClass: er,
  removeClass: Ki,
  toggleClass: kd,
  setAttributes: Pd,
  getAttributes: Qt,
  getAttribute: Id,
  setAttribute: ri,
  removeAttribute: ma,
  blockTextSelection: Od,
  unblockTextSelection: Ld,
  getBoundingClientRect: ii,
  findPosition: qi,
  getPointerPosition: ga,
  isTextNode: Fd,
  emptyEl: to,
  normalizeContent: Rd,
  appendContent: ro,
  insertContent: Md,
  isSingleLeftClick: ji,
  $: mr,
  $$: Nd
}), Ud = !1, Cs, Zm = function() {
  if (Cs.options.autoSetup !== !1) {
    var r = Array.prototype.slice.call(ae.getElementsByTagName("video")), n = Array.prototype.slice.call(ae.getElementsByTagName("audio")), i = Array.prototype.slice.call(ae.getElementsByTagName("video-js")), e = r.concat(n, i);
    if (e && e.length > 0)
      for (var t = 0, a = e.length; t < a; t++) {
        var o = e[t];
        if (o && o.getAttribute) {
          if (o.player === void 0) {
            var u = o.getAttribute("data-setup");
            u !== null && Cs(o);
          }
        } else {
          As(1);
          break;
        }
      }
    else Ud || As(1);
  }
};
function As(s, r) {
  oi() && (r && (Cs = r), P.setTimeout(Zm, s));
}
function Ds() {
  Ud = !0, P.removeEventListener("load", Ds);
}
oi() && (ae.readyState === "complete" ? Ds() : P.addEventListener("load", Ds));
var Vd = function(r) {
  var n = ae.createElement("style");
  return n.className = r, n;
}, qd = function(r, n) {
  r.styleSheet ? r.styleSheet.cssText = n : r.textContent = n;
}, eg = 3, tg = eg;
function sr() {
  return tg++;
}
var jd;
P.WeakMap || (jd = /* @__PURE__ */ (function() {
  function s() {
    this.vdata = "vdata" + Math.floor(P.performance && P.performance.now() || Date.now()), this.data = {};
  }
  var r = s.prototype;
  return r.set = function(i, e) {
    var t = i[this.vdata] || sr();
    return i[this.vdata] || (i[this.vdata] = t), this.data[t] = e, this;
  }, r.get = function(i) {
    var e = i[this.vdata];
    if (e)
      return this.data[e];
    Te("We have no data for this element", i);
  }, r.has = function(i) {
    var e = i[this.vdata];
    return e in this.data;
  }, r.delete = function(i) {
    var e = i[this.vdata];
    e && (delete this.data[e], delete i[this.vdata]);
  }, s;
})());
var ct = P.WeakMap ? /* @__PURE__ */ new WeakMap() : new jd();
function sl(s, r) {
  if (ct.has(s)) {
    var n = ct.get(s);
    n.handlers[r].length === 0 && (delete n.handlers[r], s.removeEventListener ? s.removeEventListener(r, n.dispatcher, !1) : s.detachEvent && s.detachEvent("on" + r, n.dispatcher)), Object.getOwnPropertyNames(n.handlers).length <= 0 && (delete n.handlers, delete n.dispatcher, delete n.disabled), Object.getOwnPropertyNames(n).length === 0 && ct.delete(s);
  }
}
function io(s, r, n, i) {
  n.forEach(function(e) {
    s(r, e, i);
  });
}
function va(s) {
  if (s.fixed_)
    return s;
  function r() {
    return !0;
  }
  function n() {
    return !1;
  }
  if (!s || !s.isPropagationStopped || !s.isImmediatePropagationStopped) {
    var i = s || P.event;
    s = {};
    for (var e in i)
      e !== "layerX" && e !== "layerY" && e !== "keyLocation" && e !== "webkitMovementX" && e !== "webkitMovementY" && e !== "path" && (e === "returnValue" && i.preventDefault || (s[e] = i[e]));
    if (s.target || (s.target = s.srcElement || ae), s.relatedTarget || (s.relatedTarget = s.fromElement === s.target ? s.toElement : s.fromElement), s.preventDefault = function() {
      i.preventDefault && i.preventDefault(), s.returnValue = !1, i.returnValue = !1, s.defaultPrevented = !0;
    }, s.defaultPrevented = !1, s.stopPropagation = function() {
      i.stopPropagation && i.stopPropagation(), s.cancelBubble = !0, i.cancelBubble = !0, s.isPropagationStopped = r;
    }, s.isPropagationStopped = n, s.stopImmediatePropagation = function() {
      i.stopImmediatePropagation && i.stopImmediatePropagation(), s.isImmediatePropagationStopped = r, s.stopPropagation();
    }, s.isImmediatePropagationStopped = n, s.clientX !== null && s.clientX !== void 0) {
      var t = ae.documentElement, a = ae.body;
      s.pageX = s.clientX + (t && t.scrollLeft || a && a.scrollLeft || 0) - (t && t.clientLeft || a && a.clientLeft || 0), s.pageY = s.clientY + (t && t.scrollTop || a && a.scrollTop || 0) - (t && t.clientTop || a && a.clientTop || 0);
    }
    s.which = s.charCode || s.keyCode, s.button !== null && s.button !== void 0 && (s.button = s.button & 1 ? 0 : s.button & 4 ? 1 : s.button & 2 ? 2 : 0);
  }
  return s.fixed_ = !0, s;
}
var kn, rg = function() {
  if (typeof kn != "boolean") {
    kn = !1;
    try {
      var r = Object.defineProperty({}, "passive", {
        get: function() {
          kn = !0;
        }
      });
      P.addEventListener("test", null, r), P.removeEventListener("test", null, r);
    } catch {
    }
  }
  return kn;
}, ig = ["touchstart", "touchmove"];
function xt(s, r, n) {
  if (Array.isArray(r))
    return io(xt, s, r, n);
  ct.has(s) || ct.set(s, {});
  var i = ct.get(s);
  if (i.handlers || (i.handlers = {}), i.handlers[r] || (i.handlers[r] = []), n.guid || (n.guid = sr()), i.handlers[r].push(n), i.dispatcher || (i.disabled = !1, i.dispatcher = function(t, a) {
    if (!i.disabled) {
      t = va(t);
      var o = i.handlers[t.type];
      if (o)
        for (var u = o.slice(0), l = 0, c = u.length; l < c && !t.isImmediatePropagationStopped(); l++)
          try {
            u[l].call(s, t, a);
          } catch (m) {
            Te.error(m);
          }
    }
  }), i.handlers[r].length === 1)
    if (s.addEventListener) {
      var e = !1;
      rg() && ig.indexOf(r) > -1 && (e = {
        passive: !0
      }), s.addEventListener(r, i.dispatcher, e);
    } else s.attachEvent && s.attachEvent("on" + r, i.dispatcher);
}
function at(s, r, n) {
  if (ct.has(s)) {
    var i = ct.get(s);
    if (i.handlers) {
      if (Array.isArray(r))
        return io(at, s, r, n);
      var e = function(l, c) {
        i.handlers[c] = [], sl(l, c);
      };
      if (r === void 0) {
        for (var t in i.handlers)
          Object.prototype.hasOwnProperty.call(i.handlers || {}, t) && e(s, t);
        return;
      }
      var a = i.handlers[r];
      if (a) {
        if (!n) {
          e(s, r);
          return;
        }
        if (n.guid)
          for (var o = 0; o < a.length; o++)
            a[o].guid === n.guid && a.splice(o--, 1);
        sl(s, r);
      }
    }
  }
}
function li(s, r, n) {
  var i = ct.has(s) ? ct.get(s) : {}, e = s.parentNode || s.ownerDocument;
  if (typeof r == "string" ? r = {
    type: r,
    target: s
  } : r.target || (r.target = s), r = va(r), i.dispatcher && i.dispatcher.call(s, r, n), e && !r.isPropagationStopped() && r.bubbles === !0)
    li.call(null, e, r, n);
  else if (!e && !r.defaultPrevented && r.target && r.target[r.type]) {
    ct.has(r.target) || ct.set(r.target, {});
    var t = ct.get(r.target);
    r.target[r.type] && (t.disabled = !0, typeof r.target[r.type] == "function" && r.target[r.type](), t.disabled = !1);
  }
  return !r.defaultPrevented;
}
function ya(s, r, n) {
  if (Array.isArray(r))
    return io(ya, s, r, n);
  var i = function e() {
    at(s, r, e), n.apply(this, arguments);
  };
  i.guid = n.guid = n.guid || sr(), xt(s, r, i);
}
function Hd(s, r, n) {
  var i = function e() {
    at(s, r, e), n.apply(this, arguments);
  };
  i.guid = n.guid = n.guid || sr(), xt(s, r, i);
}
var ng = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  fixEvent: va,
  on: xt,
  off: at,
  trigger: li,
  one: ya,
  any: Hd
}), Lt = 30, Re = function(r, n, i) {
  n.guid || (n.guid = sr());
  var e = n.bind(r);
  return e.guid = i ? i + "_" + n.guid : n.guid, e;
}, ir = function(r, n) {
  var i = P.performance.now(), e = function() {
    var a = P.performance.now();
    a - i >= n && (r.apply(void 0, arguments), i = a);
  };
  return e;
}, ag = function(r, n, i, e) {
  e === void 0 && (e = P);
  var t, a = function() {
    e.clearTimeout(t), t = null;
  }, o = function() {
    var l = this, c = arguments, m = function() {
      t = null, m = null, r.apply(l, c);
    };
    e.clearTimeout(t), t = e.setTimeout(m, n);
  };
  return o.cancel = a, o;
}, Ze = function() {
};
Ze.prototype.allowedEvents_ = {};
Ze.prototype.on = function(s, r) {
  var n = this.addEventListener;
  this.addEventListener = function() {
  }, xt(this, s, r), this.addEventListener = n;
};
Ze.prototype.addEventListener = Ze.prototype.on;
Ze.prototype.off = function(s, r) {
  at(this, s, r);
};
Ze.prototype.removeEventListener = Ze.prototype.off;
Ze.prototype.one = function(s, r) {
  var n = this.addEventListener;
  this.addEventListener = function() {
  }, ya(this, s, r), this.addEventListener = n;
};
Ze.prototype.any = function(s, r) {
  var n = this.addEventListener;
  this.addEventListener = function() {
  }, Hd(this, s, r), this.addEventListener = n;
};
Ze.prototype.trigger = function(s) {
  var r = s.type || s;
  typeof s == "string" && (s = {
    type: r
  }), s = va(s), this.allowedEvents_[r] && this["on" + r] && this["on" + r](s), li(this, s);
};
Ze.prototype.dispatchEvent = Ze.prototype.trigger;
var Di;
Ze.prototype.queueTrigger = function(s) {
  var r = this;
  Di || (Di = /* @__PURE__ */ new Map());
  var n = s.type || s, i = Di.get(this);
  i || (i = /* @__PURE__ */ new Map(), Di.set(this, i));
  var e = i.get(n);
  i.delete(n), P.clearTimeout(e);
  var t = P.setTimeout(function() {
    i.delete(n), i.size === 0 && (i = null, Di.delete(r)), r.trigger(s);
  }, 0);
  i.set(n, t);
};
var _a = function(r) {
  return typeof r.name == "function" ? r.name() : typeof r.name == "string" ? r.name : r.name_ ? r.name_ : r.constructor && r.constructor.name ? r.constructor.name : typeof r;
}, tr = function(r) {
  return r instanceof Ze || !!r.eventBusEl_ && ["on", "one", "off", "trigger"].every(function(n) {
    return typeof r[n] == "function";
  });
}, sg = function(r, n) {
  tr(r) ? n() : (r.eventedCallbacks || (r.eventedCallbacks = []), r.eventedCallbacks.push(n));
}, ws = function(r) {
  return (
    // The regex here verifies that the `type` contains at least one non-
    // whitespace character.
    typeof r == "string" && /\S/.test(r) || Array.isArray(r) && !!r.length
  );
}, zn = function(r, n, i) {
  if (!r || !r.nodeName && !tr(r))
    throw new Error("Invalid target for " + _a(n) + "#" + i + "; must be a DOM node or evented object.");
}, Wd = function(r, n, i) {
  if (!ws(r))
    throw new Error("Invalid event type for " + _a(n) + "#" + i + "; must be a non-empty string or array.");
}, Gd = function(r, n, i) {
  if (typeof r != "function")
    throw new Error("Invalid listener for " + _a(n) + "#" + i + "; must be a function.");
}, Za = function(r, n, i) {
  var e = n.length < 3 || n[0] === r || n[0] === r.eventBusEl_, t, a, o;
  return e ? (t = r.eventBusEl_, n.length >= 3 && n.shift(), a = n[0], o = n[1]) : (t = n[0], a = n[1], o = n[2]), zn(t, r, i), Wd(a, r, i), Gd(o, r, i), o = Re(r, o), {
    isTargetingSelf: e,
    target: t,
    type: a,
    listener: o
  };
}, kr = function(r, n, i, e) {
  zn(r, r, n), r.nodeName ? ng[n](r, i, e) : r[n](i, e);
}, og = {
  /**
   * Add a listener to an event (or events) on this object or another evented
   * object.
   *
   * @param  {string|Array|Element|Object} targetOrType
   *         If this is a string or array, it represents the event type(s)
   *         that will trigger the listener.
   *
   *         Another evented object can be passed here instead, which will
   *         cause the listener to listen for events on _that_ object.
   *
   *         In either case, the listener's `this` value will be bound to
   *         this object.
   *
   * @param  {string|Array|Function} typeOrListener
   *         If the first argument was a string or array, this should be the
   *         listener function. Otherwise, this is a string or array of event
   *         type(s).
   *
   * @param  {Function} [listener]
   *         If the first argument was another evented object, this will be
   *         the listener function.
   */
  on: function() {
    for (var r = this, n = arguments.length, i = new Array(n), e = 0; e < n; e++)
      i[e] = arguments[e];
    var t = Za(this, i, "on"), a = t.isTargetingSelf, o = t.target, u = t.type, l = t.listener;
    if (kr(o, "on", u, l), !a) {
      var c = function() {
        return r.off(o, u, l);
      };
      c.guid = l.guid;
      var m = function() {
        return r.off("dispose", c);
      };
      m.guid = l.guid, kr(this, "on", "dispose", c), kr(o, "on", "dispose", m);
    }
  },
  /**
   * Add a listener to an event (or events) on this object or another evented
   * object. The listener will be called once per event and then removed.
   *
   * @param  {string|Array|Element|Object} targetOrType
   *         If this is a string or array, it represents the event type(s)
   *         that will trigger the listener.
   *
   *         Another evented object can be passed here instead, which will
   *         cause the listener to listen for events on _that_ object.
   *
   *         In either case, the listener's `this` value will be bound to
   *         this object.
   *
   * @param  {string|Array|Function} typeOrListener
   *         If the first argument was a string or array, this should be the
   *         listener function. Otherwise, this is a string or array of event
   *         type(s).
   *
   * @param  {Function} [listener]
   *         If the first argument was another evented object, this will be
   *         the listener function.
   */
  one: function() {
    for (var r = this, n = arguments.length, i = new Array(n), e = 0; e < n; e++)
      i[e] = arguments[e];
    var t = Za(this, i, "one"), a = t.isTargetingSelf, o = t.target, u = t.type, l = t.listener;
    if (a)
      kr(o, "one", u, l);
    else {
      var c = function m() {
        r.off(o, u, m);
        for (var g = arguments.length, _ = new Array(g), C = 0; C < g; C++)
          _[C] = arguments[C];
        l.apply(null, _);
      };
      c.guid = l.guid, kr(o, "one", u, c);
    }
  },
  /**
   * Add a listener to an event (or events) on this object or another evented
   * object. The listener will only be called once for the first event that is triggered
   * then removed.
   *
   * @param  {string|Array|Element|Object} targetOrType
   *         If this is a string or array, it represents the event type(s)
   *         that will trigger the listener.
   *
   *         Another evented object can be passed here instead, which will
   *         cause the listener to listen for events on _that_ object.
   *
   *         In either case, the listener's `this` value will be bound to
   *         this object.
   *
   * @param  {string|Array|Function} typeOrListener
   *         If the first argument was a string or array, this should be the
   *         listener function. Otherwise, this is a string or array of event
   *         type(s).
   *
   * @param  {Function} [listener]
   *         If the first argument was another evented object, this will be
   *         the listener function.
   */
  any: function() {
    for (var r = this, n = arguments.length, i = new Array(n), e = 0; e < n; e++)
      i[e] = arguments[e];
    var t = Za(this, i, "any"), a = t.isTargetingSelf, o = t.target, u = t.type, l = t.listener;
    if (a)
      kr(o, "any", u, l);
    else {
      var c = function m() {
        r.off(o, u, m);
        for (var g = arguments.length, _ = new Array(g), C = 0; C < g; C++)
          _[C] = arguments[C];
        l.apply(null, _);
      };
      c.guid = l.guid, kr(o, "any", u, c);
    }
  },
  /**
   * Removes listener(s) from event(s) on an evented object.
   *
   * @param  {string|Array|Element|Object} [targetOrType]
   *         If this is a string or array, it represents the event type(s).
   *
   *         Another evented object can be passed here instead, in which case
   *         ALL 3 arguments are _required_.
   *
   * @param  {string|Array|Function} [typeOrListener]
   *         If the first argument was a string or array, this may be the
   *         listener function. Otherwise, this is a string or array of event
   *         type(s).
   *
   * @param  {Function} [listener]
   *         If the first argument was another evented object, this will be
   *         the listener function; otherwise, _all_ listeners bound to the
   *         event type(s) will be removed.
   */
  off: function(r, n, i) {
    if (!r || ws(r))
      at(this.eventBusEl_, r, n);
    else {
      var e = r, t = n;
      zn(e, this, "off"), Wd(t, this, "off"), Gd(i, this, "off"), i = Re(this, i), this.off("dispose", i), e.nodeName ? (at(e, t, i), at(e, "dispose", i)) : tr(e) && (e.off(t, i), e.off("dispose", i));
    }
  },
  /**
   * Fire an event on this evented object, causing its listeners to be called.
   *
   * @param   {string|Object} event
   *          An event type or an object with a type property.
   *
   * @param   {Object} [hash]
   *          An additional object to pass along to listeners.
   *
   * @return {boolean}
   *          Whether or not the default behavior was prevented.
   */
  trigger: function(r, n) {
    zn(this.eventBusEl_, this, "trigger");
    var i = r && typeof r != "string" ? r.type : r;
    if (!ws(i)) {
      var e = "Invalid event type for " + _a(this) + "#trigger; must be a non-empty string or object with a type key that has a non-empty value.";
      if (r)
        (this.log || Te).error(e);
      else
        throw new Error(e);
    }
    return li(this.eventBusEl_, r, n);
  }
};
function no(s, r) {
  r === void 0 && (r = {});
  var n = r, i = n.eventBusKey;
  if (i) {
    if (!s[i].nodeName)
      throw new Error('The eventBusKey "' + i + '" does not refer to an element.');
    s.eventBusEl_ = s[i];
  } else
    s.eventBusEl_ = Ee("span", {
      className: "vjs-event-bus"
    });
  return Ue(s, og), s.eventedCallbacks && s.eventedCallbacks.forEach(function(e) {
    e();
  }), s.on("dispose", function() {
    s.off(), [s, s.el_, s.eventBusEl_].forEach(function(e) {
      e && ct.has(e) && ct.delete(e);
    }), P.setTimeout(function() {
      s.eventBusEl_ = null;
    }, 0);
  }), s;
}
var ug = {
  /**
   * A hash containing arbitrary keys and values representing the state of
   * the object.
   *
   * @type {Object}
   */
  state: {},
  /**
   * Set the state of an object by mutating its
   * {@link module:stateful~StatefulMixin.state|state} object in place.
   *
   * @fires   module:stateful~StatefulMixin#statechanged
   * @param   {Object|Function} stateUpdates
   *          A new set of properties to shallow-merge into the plugin state.
   *          Can be a plain object or a function returning a plain object.
   *
   * @return {Object|undefined}
   *          An object containing changes that occurred. If no changes
   *          occurred, returns `undefined`.
   */
  setState: function(r) {
    var n = this;
    typeof r == "function" && (r = r());
    var i;
    return Xr(r, function(e, t) {
      n.state[t] !== e && (i = i || {}, i[t] = {
        from: n.state[t],
        to: e
      }), n.state[t] = e;
    }), i && tr(this) && this.trigger({
      changes: i,
      type: "statechanged"
    }), i;
  }
};
function zd(s, r) {
  return Ue(s, ug), s.state = Ue({}, s.state, r), typeof s.handleStateChanged == "function" && tr(s) && s.on("statechanged", s.handleStateChanged), s;
}
var Bn = function(r) {
  return typeof r != "string" ? r : r.replace(/./, function(n) {
    return n.toLowerCase();
  });
}, Ge = function(r) {
  return typeof r != "string" ? r : r.replace(/./, function(n) {
    return n.toUpperCase();
  });
}, lg = function(r, n) {
  return Ge(r) === Ge(n);
};
function Fe() {
  for (var s = {}, r = arguments.length, n = new Array(r), i = 0; i < r; i++)
    n[i] = arguments[i];
  return n.forEach(function(e) {
    e && Xr(e, function(t, a) {
      if (!Ui(t)) {
        s[a] = t;
        return;
      }
      Ui(s[a]) || (s[a] = {}), s[a] = Fe(s[a], t);
    });
  }), s;
}
var dg = /* @__PURE__ */ (function() {
  function s() {
    this.map_ = {};
  }
  var r = s.prototype;
  return r.has = function(i) {
    return i in this.map_;
  }, r.delete = function(i) {
    var e = this.has(i);
    return delete this.map_[i], e;
  }, r.set = function(i, e) {
    return this.map_[i] = e, this;
  }, r.forEach = function(i, e) {
    for (var t in this.map_)
      i.call(e, this.map_[t], t, this);
  }, s;
})(), cg = P.Map ? P.Map : dg, fg = /* @__PURE__ */ (function() {
  function s() {
    this.set_ = {};
  }
  var r = s.prototype;
  return r.has = function(i) {
    return i in this.set_;
  }, r.delete = function(i) {
    var e = this.has(i);
    return delete this.set_[i], e;
  }, r.add = function(i) {
    return this.set_[i] = 1, this;
  }, r.forEach = function(i, e) {
    for (var t in this.set_)
      i.call(e, t, t, this);
  }, s;
})(), es = P.Set ? P.Set : fg, te = /* @__PURE__ */ (function() {
  function s(n, i, e) {
    var t = this;
    if (!n && this.play ? this.player_ = n = this : this.player_ = n, this.isDisposed_ = !1, this.parentComponent_ = null, this.options_ = Fe({}, this.options_), i = this.options_ = Fe(this.options_, i), this.id_ = i.id || i.el && i.el.id, !this.id_) {
      var a = n && n.id && n.id() || "no_player";
      this.id_ = a + "_component_" + sr();
    }
    this.name_ = i.name || null, i.el ? this.el_ = i.el : i.createEl !== !1 && (this.el_ = this.createEl()), i.className && this.el_ && i.className.split(" ").forEach(function(o) {
      return t.addClass(o);
    }), i.evented !== !1 && (no(this, {
      eventBusKey: this.el_ ? "el_" : null
    }), this.handleLanguagechange = this.handleLanguagechange.bind(this), this.on(this.player_, "languagechange", this.handleLanguagechange)), zd(this, this.constructor.defaultState), this.children_ = [], this.childIndex_ = {}, this.childNameIndex_ = {}, this.setTimeoutIds_ = new es(), this.setIntervalIds_ = new es(), this.rafIds_ = new es(), this.namedRafs_ = new cg(), this.clearingTimersOnDispose_ = !1, i.initChildren !== !1 && this.initChildren(), this.ready(e), i.reportTouchActivity !== !1 && this.enableTouchActivity();
  }
  var r = s.prototype;
  return r.dispose = function(i) {
    if (i === void 0 && (i = {}), !this.isDisposed_) {
      if (this.readyQueue_ && (this.readyQueue_.length = 0), this.trigger({
        type: "dispose",
        bubbles: !1
      }), this.isDisposed_ = !0, this.children_)
        for (var e = this.children_.length - 1; e >= 0; e--)
          this.children_[e].dispose && this.children_[e].dispose();
      this.children_ = null, this.childIndex_ = null, this.childNameIndex_ = null, this.parentComponent_ = null, this.el_ && (this.el_.parentNode && (i.restoreEl ? this.el_.parentNode.replaceChild(i.restoreEl, this.el_) : this.el_.parentNode.removeChild(this.el_)), this.el_ = null), this.player_ = null;
    }
  }, r.isDisposed = function() {
    return !!this.isDisposed_;
  }, r.player = function() {
    return this.player_;
  }, r.options = function(i) {
    return i ? (this.options_ = Fe(this.options_, i), this.options_) : this.options_;
  }, r.el = function() {
    return this.el_;
  }, r.createEl = function(i, e, t) {
    return Ee(i, e, t);
  }, r.localize = function(i, e, t) {
    t === void 0 && (t = i);
    var a = this.player_.language && this.player_.language(), o = this.player_.languages && this.player_.languages(), u = o && o[a], l = a && a.split("-")[0], c = o && o[l], m = t;
    return u && u[i] ? m = u[i] : c && c[i] && (m = c[i]), e && (m = m.replace(/\{(\d+)\}/g, function(g, _) {
      var C = e[_ - 1], w = C;
      return typeof C > "u" && (w = g), w;
    })), m;
  }, r.handleLanguagechange = function() {
  }, r.contentEl = function() {
    return this.contentEl_ || this.el_;
  }, r.id = function() {
    return this.id_;
  }, r.name = function() {
    return this.name_;
  }, r.children = function() {
    return this.children_;
  }, r.getChildById = function(i) {
    return this.childIndex_[i];
  }, r.getChild = function(i) {
    if (i)
      return this.childNameIndex_[i];
  }, r.getDescendant = function() {
    for (var i = arguments.length, e = new Array(i), t = 0; t < i; t++)
      e[t] = arguments[t];
    e = e.reduce(function(u, l) {
      return u.concat(l);
    }, []);
    for (var a = this, o = 0; o < e.length; o++)
      if (a = a.getChild(e[o]), !a || !a.getChild)
        return;
    return a;
  }, r.addChild = function(i, e, t) {
    e === void 0 && (e = {}), t === void 0 && (t = this.children_.length);
    var a, o;
    if (typeof i == "string") {
      o = Ge(i);
      var u = e.componentClass || o;
      e.name = o;
      var l = s.getComponent(u);
      if (!l)
        throw new Error("Component " + u + " does not exist");
      if (typeof l != "function")
        return null;
      a = new l(this.player_ || this, e);
    } else
      a = i;
    if (a.parentComponent_ && a.parentComponent_.removeChild(a), this.children_.splice(t, 0, a), a.parentComponent_ = this, typeof a.id == "function" && (this.childIndex_[a.id()] = a), o = o || a.name && Ge(a.name()), o && (this.childNameIndex_[o] = a, this.childNameIndex_[Bn(o)] = a), typeof a.el == "function" && a.el()) {
      var c = null;
      this.children_[t + 1] && (this.children_[t + 1].el_ ? c = this.children_[t + 1].el_ : ui(this.children_[t + 1]) && (c = this.children_[t + 1])), this.contentEl().insertBefore(a.el(), c);
    }
    return a;
  }, r.removeChild = function(i) {
    if (typeof i == "string" && (i = this.getChild(i)), !(!i || !this.children_)) {
      for (var e = !1, t = this.children_.length - 1; t >= 0; t--)
        if (this.children_[t] === i) {
          e = !0, this.children_.splice(t, 1);
          break;
        }
      if (e) {
        i.parentComponent_ = null, this.childIndex_[i.id()] = null, this.childNameIndex_[Ge(i.name())] = null, this.childNameIndex_[Bn(i.name())] = null;
        var a = i.el();
        a && a.parentNode === this.contentEl() && this.contentEl().removeChild(i.el());
      }
    }
  }, r.initChildren = function() {
    var i = this, e = this.options_.children;
    if (e) {
      var t = this.options_, a = function(c) {
        var m = c.name, g = c.opts;
        if (t[m] !== void 0 && (g = t[m]), g !== !1) {
          g === !0 && (g = {}), g.playerOptions = i.options_.playerOptions;
          var _ = i.addChild(m, g);
          _ && (i[m] = _);
        }
      }, o, u = s.getComponent("Tech");
      Array.isArray(e) ? o = e : o = Object.keys(e), o.concat(Object.keys(this.options_).filter(function(l) {
        return !o.some(function(c) {
          return typeof c == "string" ? l === c : l === c.name;
        });
      })).map(function(l) {
        var c, m;
        return typeof l == "string" ? (c = l, m = e[c] || i.options_[c] || {}) : (c = l.name, m = l), {
          name: c,
          opts: m
        };
      }).filter(function(l) {
        var c = s.getComponent(l.opts.componentClass || Ge(l.name));
        return c && !u.isTech(c);
      }).forEach(a);
    }
  }, r.buildCSSClass = function() {
    return "";
  }, r.ready = function(i, e) {
    if (e === void 0 && (e = !1), !!i) {
      if (!this.isReady_) {
        this.readyQueue_ = this.readyQueue_ || [], this.readyQueue_.push(i);
        return;
      }
      e ? i.call(this) : this.setTimeout(i, 1);
    }
  }, r.triggerReady = function() {
    this.isReady_ = !0, this.setTimeout(function() {
      var i = this.readyQueue_;
      this.readyQueue_ = [], i && i.length > 0 && i.forEach(function(e) {
        e.call(this);
      }, this), this.trigger("ready");
    }, 1);
  }, r.$ = function(i, e) {
    return mr(i, e || this.contentEl());
  }, r.$$ = function(i, e) {
    return Nd(i, e || this.contentEl());
  }, r.hasClass = function(i) {
    return Fr(this.el_, i);
  }, r.addClass = function(i) {
    er(this.el_, i);
  }, r.removeClass = function(i) {
    Ki(this.el_, i);
  }, r.toggleClass = function(i, e) {
    kd(this.el_, i, e);
  }, r.show = function() {
    this.removeClass("vjs-hidden");
  }, r.hide = function() {
    this.addClass("vjs-hidden");
  }, r.lockShowing = function() {
    this.addClass("vjs-lock-showing");
  }, r.unlockShowing = function() {
    this.removeClass("vjs-lock-showing");
  }, r.getAttribute = function(i) {
    return Id(this.el_, i);
  }, r.setAttribute = function(i, e) {
    ri(this.el_, i, e);
  }, r.removeAttribute = function(i) {
    ma(this.el_, i);
  }, r.width = function(i, e) {
    return this.dimension("width", i, e);
  }, r.height = function(i, e) {
    return this.dimension("height", i, e);
  }, r.dimensions = function(i, e) {
    this.width(i, !0), this.height(e);
  }, r.dimension = function(i, e, t) {
    if (e !== void 0) {
      (e === null || e !== e) && (e = 0), ("" + e).indexOf("%") !== -1 || ("" + e).indexOf("px") !== -1 ? this.el_.style[i] = e : e === "auto" ? this.el_.style[i] = "" : this.el_.style[i] = e + "px", t || this.trigger("componentresize");
      return;
    }
    if (!this.el_)
      return 0;
    var a = this.el_.style[i], o = a.indexOf("px");
    return parseInt(o !== -1 ? a.slice(0, o) : this.el_["offset" + Ge(i)], 10);
  }, r.currentDimension = function(i) {
    var e = 0;
    if (i !== "width" && i !== "height")
      throw new Error("currentDimension only accepts width or height value");
    if (e = Vi(this.el_, i), e = parseFloat(e), e === 0 || isNaN(e)) {
      var t = "offset" + Ge(i);
      e = this.el_[t];
    }
    return e;
  }, r.currentDimensions = function() {
    return {
      width: this.currentDimension("width"),
      height: this.currentDimension("height")
    };
  }, r.currentWidth = function() {
    return this.currentDimension("width");
  }, r.currentHeight = function() {
    return this.currentDimension("height");
  }, r.focus = function() {
    this.el_.focus();
  }, r.blur = function() {
    this.el_.blur();
  }, r.handleKeyDown = function(i) {
    this.player_ && (_e.isEventKey(i, "Tab") || i.stopPropagation(), this.player_.handleKeyDown(i));
  }, r.handleKeyPress = function(i) {
    this.handleKeyDown(i);
  }, r.emitTapEvents = function() {
    var i = 0, e = null, t = 10, a = 200, o;
    this.on("touchstart", function(l) {
      l.touches.length === 1 && (e = {
        pageX: l.touches[0].pageX,
        pageY: l.touches[0].pageY
      }, i = P.performance.now(), o = !0);
    }), this.on("touchmove", function(l) {
      if (l.touches.length > 1)
        o = !1;
      else if (e) {
        var c = l.touches[0].pageX - e.pageX, m = l.touches[0].pageY - e.pageY, g = Math.sqrt(c * c + m * m);
        g > t && (o = !1);
      }
    });
    var u = function() {
      o = !1;
    };
    this.on("touchleave", u), this.on("touchcancel", u), this.on("touchend", function(l) {
      if (e = null, o === !0) {
        var c = P.performance.now() - i;
        c < a && (l.preventDefault(), this.trigger("tap"));
      }
    });
  }, r.enableTouchActivity = function() {
    if (!(!this.player() || !this.player().reportUserActivity)) {
      var i = Re(this.player(), this.player().reportUserActivity), e;
      this.on("touchstart", function() {
        i(), this.clearInterval(e), e = this.setInterval(i, 250);
      });
      var t = function(o) {
        i(), this.clearInterval(e);
      };
      this.on("touchmove", i), this.on("touchend", t), this.on("touchcancel", t);
    }
  }, r.setTimeout = function(i, e) {
    var t = this, a;
    return i = Re(this, i), this.clearTimersOnDispose_(), a = P.setTimeout(function() {
      t.setTimeoutIds_.has(a) && t.setTimeoutIds_.delete(a), i();
    }, e), this.setTimeoutIds_.add(a), a;
  }, r.clearTimeout = function(i) {
    return this.setTimeoutIds_.has(i) && (this.setTimeoutIds_.delete(i), P.clearTimeout(i)), i;
  }, r.setInterval = function(i, e) {
    i = Re(this, i), this.clearTimersOnDispose_();
    var t = P.setInterval(i, e);
    return this.setIntervalIds_.add(t), t;
  }, r.clearInterval = function(i) {
    return this.setIntervalIds_.has(i) && (this.setIntervalIds_.delete(i), P.clearInterval(i)), i;
  }, r.requestAnimationFrame = function(i) {
    var e = this;
    if (!this.supportsRaf_)
      return this.setTimeout(i, 1e3 / 60);
    this.clearTimersOnDispose_();
    var t;
    return i = Re(this, i), t = P.requestAnimationFrame(function() {
      e.rafIds_.has(t) && e.rafIds_.delete(t), i();
    }), this.rafIds_.add(t), t;
  }, r.requestNamedAnimationFrame = function(i, e) {
    var t = this;
    if (!this.namedRafs_.has(i)) {
      this.clearTimersOnDispose_(), e = Re(this, e);
      var a = this.requestAnimationFrame(function() {
        e(), t.namedRafs_.has(i) && t.namedRafs_.delete(i);
      });
      return this.namedRafs_.set(i, a), i;
    }
  }, r.cancelNamedAnimationFrame = function(i) {
    this.namedRafs_.has(i) && (this.cancelAnimationFrame(this.namedRafs_.get(i)), this.namedRafs_.delete(i));
  }, r.cancelAnimationFrame = function(i) {
    return this.supportsRaf_ ? (this.rafIds_.has(i) && (this.rafIds_.delete(i), P.cancelAnimationFrame(i)), i) : this.clearTimeout(i);
  }, r.clearTimersOnDispose_ = function() {
    var i = this;
    this.clearingTimersOnDispose_ || (this.clearingTimersOnDispose_ = !0, this.one("dispose", function() {
      [["namedRafs_", "cancelNamedAnimationFrame"], ["rafIds_", "cancelAnimationFrame"], ["setTimeoutIds_", "clearTimeout"], ["setIntervalIds_", "clearInterval"]].forEach(function(e) {
        var t = e[0], a = e[1];
        i[t].forEach(function(o, u) {
          return i[a](u);
        });
      }), i.clearingTimersOnDispose_ = !1;
    }));
  }, s.registerComponent = function(i, e) {
    if (typeof i != "string" || !i)
      throw new Error('Illegal component name, "' + i + '"; must be a non-empty string.');
    var t = s.getComponent("Tech"), a = t && t.isTech(e), o = s === e || s.prototype.isPrototypeOf(e.prototype);
    if (a || !o) {
      var u;
      throw a ? u = "techs must be registered using Tech.registerTech()" : u = "must be a Component subclass", new Error('Illegal component, "' + i + '"; ' + u + ".");
    }
    i = Ge(i), s.components_ || (s.components_ = {});
    var l = s.getComponent("Player");
    if (i === "Player" && l && l.players) {
      var c = l.players, m = Object.keys(c);
      if (c && m.length > 0 && m.map(function(g) {
        return c[g];
      }).every(Boolean))
        throw new Error("Can not register Player component after player has been created.");
    }
    return s.components_[i] = e, s.components_[Bn(i)] = e, e;
  }, s.getComponent = function(i) {
    if (!(!i || !s.components_))
      return s.components_[i];
  }, s;
})();
te.prototype.supportsRaf_ = typeof P.requestAnimationFrame == "function" && typeof P.cancelAnimationFrame == "function";
te.registerComponent("Component", te);
function hg(s, r, n) {
  if (typeof r != "number" || r < 0 || r > n)
    throw new Error("Failed to execute '" + s + "' on 'TimeRanges': The index provided (" + r + ") is non-numeric or out of bounds (0-" + n + ").");
}
function ol(s, r, n, i) {
  return hg(s, i, n.length - 1), n[i][r];
}
function ts(s) {
  var r;
  return s === void 0 || s.length === 0 ? r = {
    length: 0,
    start: function() {
      throw new Error("This TimeRanges object is empty");
    },
    end: function() {
      throw new Error("This TimeRanges object is empty");
    }
  } : r = {
    length: s.length,
    start: ol.bind(null, "start", 0, s),
    end: ol.bind(null, "end", 1, s)
  }, P.Symbol && P.Symbol.iterator && (r[P.Symbol.iterator] = function() {
    return (s || []).values();
  }), r;
}
function Rr(s, r) {
  return Array.isArray(s) ? ts(s) : s === void 0 || r === void 0 ? ts() : ts([[s, r]]);
}
function Kd(s, r) {
  var n = 0, i, e;
  if (!r)
    return 0;
  (!s || !s.length) && (s = Rr(0, 0));
  for (var t = 0; t < s.length; t++)
    i = s.start(t), e = s.end(t), e > r && (e = r), n += e - i;
  return n / r;
}
function ft(s) {
  if (s instanceof ft)
    return s;
  typeof s == "number" ? this.code = s : typeof s == "string" ? this.message = s : rr(s) && (typeof s.code == "number" && (this.code = s.code), Ue(this, s)), this.message || (this.message = ft.defaultMessages[this.code] || "");
}
ft.prototype.code = 0;
ft.prototype.message = "";
ft.prototype.status = null;
ft.errorTypes = ["MEDIA_ERR_CUSTOM", "MEDIA_ERR_ABORTED", "MEDIA_ERR_NETWORK", "MEDIA_ERR_DECODE", "MEDIA_ERR_SRC_NOT_SUPPORTED", "MEDIA_ERR_ENCRYPTED"];
ft.defaultMessages = {
  1: "You aborted the media playback",
  2: "A network error caused the media download to fail part-way.",
  3: "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.",
  4: "The media could not be loaded, either because the server or network failed or because the format is not supported.",
  5: "The media is encrypted and we do not have the keys to decrypt it."
};
for (var Wr = 0; Wr < ft.errorTypes.length; Wr++)
  ft[ft.errorTypes[Wr]] = Wr, ft.prototype[ft.errorTypes[Wr]] = Wr;
function Fi(s) {
  return s != null && typeof s.then == "function";
}
function jt(s) {
  Fi(s) && s.then(null, function(r) {
  });
}
var ks = function(r) {
  var n = ["kind", "label", "language", "id", "inBandMetadataTrackDispatchType", "mode", "src"].reduce(function(i, e, t) {
    return r[e] && (i[e] = r[e]), i;
  }, {
    cues: r.cues && Array.prototype.map.call(r.cues, function(i) {
      return {
        startTime: i.startTime,
        endTime: i.endTime,
        text: i.text,
        id: i.id
      };
    })
  });
  return n;
}, pg = function(r) {
  var n = r.$$("track"), i = Array.prototype.map.call(n, function(t) {
    return t.track;
  }), e = Array.prototype.map.call(n, function(t) {
    var a = ks(t.track);
    return t.src && (a.src = t.src), a;
  });
  return e.concat(Array.prototype.filter.call(r.textTracks(), function(t) {
    return i.indexOf(t) === -1;
  }).map(ks));
}, mg = function(r, n) {
  return r.forEach(function(i) {
    var e = n.addRemoteTextTrack(i).track;
    !i.src && i.cues && i.cues.forEach(function(t) {
      return e.addCue(t);
    });
  }), n.textTracks();
}, ul = {
  textTracksToJson: pg,
  jsonToTextTracks: mg,
  trackToJson_: ks
}, rs = "vjs-modal-dialog", di = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.handleKeyDown_ = function(a) {
      return t.handleKeyDown(a);
    }, t.close_ = function(a) {
      return t.close(a);
    }, t.opened_ = t.hasBeenOpened_ = t.hasBeenFilled_ = !1, t.closeable(!t.options_.uncloseable), t.content(t.options_.content), t.contentEl_ = Ee("div", {
      className: rs + "-content"
    }, {
      role: "document"
    }), t.descEl_ = Ee("p", {
      className: rs + "-description vjs-control-text",
      id: t.el().getAttribute("aria-describedby")
    }), Nr(t.descEl_, t.description()), t.el_.appendChild(t.descEl_), t.el_.appendChild(t.contentEl_), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: this.buildCSSClass(),
      tabIndex: -1
    }, {
      "aria-describedby": this.id() + "_description",
      "aria-hidden": "true",
      "aria-label": this.label(),
      role: "dialog"
    });
  }, n.dispose = function() {
    this.contentEl_ = null, this.descEl_ = null, this.previouslyActiveEl_ = null, s.prototype.dispose.call(this);
  }, n.buildCSSClass = function() {
    return rs + " vjs-hidden " + s.prototype.buildCSSClass.call(this);
  }, n.label = function() {
    return this.localize(this.options_.label || "Modal Window");
  }, n.description = function() {
    var e = this.options_.description || this.localize("This is a modal window.");
    return this.closeable() && (e += " " + this.localize("This modal can be closed by pressing the Escape key or activating the close button.")), e;
  }, n.open = function() {
    if (!this.opened_) {
      var e = this.player();
      this.trigger("beforemodalopen"), this.opened_ = !0, (this.options_.fillAlways || !this.hasBeenOpened_ && !this.hasBeenFilled_) && this.fill(), this.wasPlaying_ = !e.paused(), this.options_.pauseOnOpen && this.wasPlaying_ && e.pause(), this.on("keydown", this.handleKeyDown_), this.hadControls_ = e.controls(), e.controls(!1), this.show(), this.conditionalFocus_(), this.el().setAttribute("aria-hidden", "false"), this.trigger("modalopen"), this.hasBeenOpened_ = !0;
    }
  }, n.opened = function(e) {
    return typeof e == "boolean" && this[e ? "open" : "close"](), this.opened_;
  }, n.close = function() {
    if (this.opened_) {
      var e = this.player();
      this.trigger("beforemodalclose"), this.opened_ = !1, this.wasPlaying_ && this.options_.pauseOnOpen && e.play(), this.off("keydown", this.handleKeyDown_), this.hadControls_ && e.controls(!0), this.hide(), this.el().setAttribute("aria-hidden", "true"), this.trigger("modalclose"), this.conditionalBlur_(), this.options_.temporary && this.dispose();
    }
  }, n.closeable = function(e) {
    if (typeof e == "boolean") {
      var t = this.closeable_ = !!e, a = this.getChild("closeButton");
      if (t && !a) {
        var o = this.contentEl_;
        this.contentEl_ = this.el_, a = this.addChild("closeButton", {
          controlText: "Close Modal Dialog"
        }), this.contentEl_ = o, this.on(a, "close", this.close_);
      }
      !t && a && (this.off(a, "close", this.close_), this.removeChild(a), a.dispose());
    }
    return this.closeable_;
  }, n.fill = function() {
    this.fillWith(this.content());
  }, n.fillWith = function(e) {
    var t = this.contentEl(), a = t.parentNode, o = t.nextSibling;
    this.trigger("beforemodalfill"), this.hasBeenFilled_ = !0, a.removeChild(t), this.empty(), Md(t, e), this.trigger("modalfill"), o ? a.insertBefore(t, o) : a.appendChild(t);
    var u = this.getChild("closeButton");
    u && a.appendChild(u.el_);
  }, n.empty = function() {
    this.trigger("beforemodalempty"), to(this.contentEl()), this.trigger("modalempty");
  }, n.content = function(e) {
    return typeof e < "u" && (this.content_ = e), this.content_;
  }, n.conditionalFocus_ = function() {
    var e = ae.activeElement, t = this.player_.el_;
    this.previouslyActiveEl_ = null, (t.contains(e) || t === e) && (this.previouslyActiveEl_ = e, this.focus());
  }, n.conditionalBlur_ = function() {
    this.previouslyActiveEl_ && (this.previouslyActiveEl_.focus(), this.previouslyActiveEl_ = null);
  }, n.handleKeyDown = function(e) {
    if (e.stopPropagation(), _e.isEventKey(e, "Escape") && this.closeable()) {
      e.preventDefault(), this.close();
      return;
    }
    if (_e.isEventKey(e, "Tab")) {
      for (var t = this.focusableEls_(), a = this.el_.querySelector(":focus"), o, u = 0; u < t.length; u++)
        if (a === t[u]) {
          o = u;
          break;
        }
      ae.activeElement === this.el_ && (o = 0), e.shiftKey && o === 0 ? (t[t.length - 1].focus(), e.preventDefault()) : !e.shiftKey && o === t.length - 1 && (t[0].focus(), e.preventDefault());
    }
  }, n.focusableEls_ = function() {
    var e = this.el_.querySelectorAll("*");
    return Array.prototype.filter.call(e, function(t) {
      return (t instanceof P.HTMLAnchorElement || t instanceof P.HTMLAreaElement) && t.hasAttribute("href") || (t instanceof P.HTMLInputElement || t instanceof P.HTMLSelectElement || t instanceof P.HTMLTextAreaElement || t instanceof P.HTMLButtonElement) && !t.hasAttribute("disabled") || t instanceof P.HTMLIFrameElement || t instanceof P.HTMLObjectElement || t instanceof P.HTMLEmbedElement || t.hasAttribute("tabindex") && t.getAttribute("tabindex") !== -1 || t.hasAttribute("contenteditable");
    });
  }, r;
})(te);
di.prototype.options_ = {
  pauseOnOpen: !0,
  temporary: !0
};
te.registerComponent("ModalDialog", di);
var ni = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    i === void 0 && (i = []), e = s.call(this) || this, e.tracks_ = [], Object.defineProperty(ye(e), "length", {
      get: function() {
        return this.tracks_.length;
      }
    });
    for (var t = 0; t < i.length; t++)
      e.addTrack(i[t]);
    return e;
  }
  var n = r.prototype;
  return n.addTrack = function(e) {
    var t = this, a = this.tracks_.length;
    "" + a in this || Object.defineProperty(this, a, {
      get: function() {
        return this.tracks_[a];
      }
    }), this.tracks_.indexOf(e) === -1 && (this.tracks_.push(e), this.trigger({
      track: e,
      type: "addtrack",
      target: this
    })), e.labelchange_ = function() {
      t.trigger({
        track: e,
        type: "labelchange",
        target: t
      });
    }, tr(e) && e.addEventListener("labelchange", e.labelchange_);
  }, n.removeTrack = function(e) {
    for (var t, a = 0, o = this.length; a < o; a++)
      if (this[a] === e) {
        t = this[a], t.off && t.off(), this.tracks_.splice(a, 1);
        break;
      }
    t && this.trigger({
      track: t,
      type: "removetrack",
      target: this
    });
  }, n.getTrackById = function(e) {
    for (var t = null, a = 0, o = this.length; a < o; a++) {
      var u = this[a];
      if (u.id === e) {
        t = u;
        break;
      }
    }
    return t;
  }, r;
})(Ze);
ni.prototype.allowedEvents_ = {
  change: "change",
  addtrack: "addtrack",
  removetrack: "removetrack",
  labelchange: "labelchange"
};
for (var gg in ni.prototype.allowedEvents_)
  ni.prototype["on" + gg] = null;
var is = function(r, n) {
  for (var i = 0; i < r.length; i++)
    !Object.keys(r[i]).length || n.id === r[i].id || (r[i].enabled = !1);
}, vg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    i === void 0 && (i = []);
    for (var t = i.length - 1; t >= 0; t--)
      if (i[t].enabled) {
        is(i, i[t]);
        break;
      }
    return e = s.call(this, i) || this, e.changing_ = !1, e;
  }
  var n = r.prototype;
  return n.addTrack = function(e) {
    var t = this;
    e.enabled && is(this, e), s.prototype.addTrack.call(this, e), e.addEventListener && (e.enabledChange_ = function() {
      t.changing_ || (t.changing_ = !0, is(t, e), t.changing_ = !1, t.trigger("change"));
    }, e.addEventListener("enabledchange", e.enabledChange_));
  }, n.removeTrack = function(e) {
    s.prototype.removeTrack.call(this, e), e.removeEventListener && e.enabledChange_ && (e.removeEventListener("enabledchange", e.enabledChange_), e.enabledChange_ = null);
  }, r;
})(ni), ns = function(r, n) {
  for (var i = 0; i < r.length; i++)
    !Object.keys(r[i]).length || n.id === r[i].id || (r[i].selected = !1);
}, yg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    i === void 0 && (i = []);
    for (var t = i.length - 1; t >= 0; t--)
      if (i[t].selected) {
        ns(i, i[t]);
        break;
      }
    return e = s.call(this, i) || this, e.changing_ = !1, Object.defineProperty(ye(e), "selectedIndex", {
      get: function() {
        for (var o = 0; o < this.length; o++)
          if (this[o].selected)
            return o;
        return -1;
      },
      set: function() {
      }
    }), e;
  }
  var n = r.prototype;
  return n.addTrack = function(e) {
    var t = this;
    e.selected && ns(this, e), s.prototype.addTrack.call(this, e), e.addEventListener && (e.selectedChange_ = function() {
      t.changing_ || (t.changing_ = !0, ns(t, e), t.changing_ = !1, t.trigger("change"));
    }, e.addEventListener("selectedchange", e.selectedChange_));
  }, n.removeTrack = function(e) {
    s.prototype.removeTrack.call(this, e), e.removeEventListener && e.selectedChange_ && (e.removeEventListener("selectedchange", e.selectedChange_), e.selectedChange_ = null);
  }, r;
})(ni), $d = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.addTrack = function(e) {
    var t = this;
    s.prototype.addTrack.call(this, e), this.queueChange_ || (this.queueChange_ = function() {
      return t.queueTrigger("change");
    }), this.triggerSelectedlanguagechange || (this.triggerSelectedlanguagechange_ = function() {
      return t.trigger("selectedlanguagechange");
    }), e.addEventListener("modechange", this.queueChange_);
    var a = ["metadata", "chapters"];
    a.indexOf(e.kind) === -1 && e.addEventListener("modechange", this.triggerSelectedlanguagechange_);
  }, n.removeTrack = function(e) {
    s.prototype.removeTrack.call(this, e), e.removeEventListener && (this.queueChange_ && e.removeEventListener("modechange", this.queueChange_), this.selectedlanguagechange_ && e.removeEventListener("modechange", this.triggerSelectedlanguagechange_));
  }, r;
})(ni), _g = /* @__PURE__ */ (function() {
  function s(n) {
    n === void 0 && (n = []), this.trackElements_ = [], Object.defineProperty(this, "length", {
      get: function() {
        return this.trackElements_.length;
      }
    });
    for (var i = 0, e = n.length; i < e; i++)
      this.addTrackElement_(n[i]);
  }
  var r = s.prototype;
  return r.addTrackElement_ = function(i) {
    var e = this.trackElements_.length;
    "" + e in this || Object.defineProperty(this, e, {
      get: function() {
        return this.trackElements_[e];
      }
    }), this.trackElements_.indexOf(i) === -1 && this.trackElements_.push(i);
  }, r.getTrackElementByTrack_ = function(i) {
    for (var e, t = 0, a = this.trackElements_.length; t < a; t++)
      if (i === this.trackElements_[t].track) {
        e = this.trackElements_[t];
        break;
      }
    return e;
  }, r.removeTrackElement_ = function(i) {
    for (var e = 0, t = this.trackElements_.length; e < t; e++)
      if (i === this.trackElements_[e]) {
        this.trackElements_[e].track && typeof this.trackElements_[e].track.off == "function" && this.trackElements_[e].track.off(), typeof this.trackElements_[e].off == "function" && this.trackElements_[e].off(), this.trackElements_.splice(e, 1);
        break;
      }
  }, s;
})(), ll = /* @__PURE__ */ (function() {
  function s(n) {
    s.prototype.setCues_.call(this, n), Object.defineProperty(this, "length", {
      get: function() {
        return this.length_;
      }
    });
  }
  var r = s.prototype;
  return r.setCues_ = function(i) {
    var e = this.length || 0, t = 0, a = i.length;
    this.cues_ = i, this.length_ = i.length;
    var o = function(l) {
      "" + l in this || Object.defineProperty(this, "" + l, {
        get: function() {
          return this.cues_[l];
        }
      });
    };
    if (e < a)
      for (t = e; t < a; t++)
        o.call(this, t);
  }, r.getCueById = function(i) {
    for (var e = null, t = 0, a = this.length; t < a; t++) {
      var o = this[t];
      if (o.id === i) {
        e = o;
        break;
      }
    }
    return e;
  }, s;
})(), Tg = {
  alternative: "alternative",
  captions: "captions",
  main: "main",
  sign: "sign",
  subtitles: "subtitles",
  commentary: "commentary"
}, bg = {
  alternative: "alternative",
  descriptions: "descriptions",
  main: "main",
  "main-desc": "main-desc",
  translation: "translation",
  commentary: "commentary"
}, xg = {
  subtitles: "subtitles",
  captions: "captions",
  descriptions: "descriptions",
  chapters: "chapters",
  metadata: "metadata"
}, dl = {
  disabled: "disabled",
  hidden: "hidden",
  showing: "showing"
}, ao = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(n) {
    var i;
    n === void 0 && (n = {}), i = s.call(this) || this;
    var e = {
      id: n.id || "vjs_track_" + sr(),
      kind: n.kind || "",
      language: n.language || ""
    }, t = n.label || "", a = function(l) {
      Object.defineProperty(ye(i), l, {
        get: function() {
          return e[l];
        },
        set: function() {
        }
      });
    };
    for (var o in e)
      a(o);
    return Object.defineProperty(ye(i), "label", {
      get: function() {
        return t;
      },
      set: function(l) {
        l !== t && (t = l, this.trigger("labelchange"));
      }
    }), i;
  }
  return r;
})(Ze), so = function(r) {
  var n = ["protocol", "hostname", "port", "pathname", "search", "hash", "host"], i = ae.createElement("a");
  i.href = r;
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t]] = i[n[t]];
  return e.protocol === "http:" && (e.host = e.host.replace(/:80$/, "")), e.protocol === "https:" && (e.host = e.host.replace(/:443$/, "")), e.protocol || (e.protocol = P.location.protocol), e.host || (e.host = P.location.host), e;
}, Xd = function(r) {
  if (!r.match(/^https?:\/\//)) {
    var n = ae.createElement("a");
    n.href = r, r = n.href;
  }
  return r;
}, oo = function(r) {
  if (typeof r == "string") {
    var n = /^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/, i = n.exec(r);
    if (i)
      return i.pop().toLowerCase();
  }
  return "";
}, Ta = function(r, n) {
  n === void 0 && (n = P.location);
  var i = so(r), e = i.protocol === ":" ? n.protocol : i.protocol, t = e + i.host !== n.protocol + n.host;
  return t;
}, Sg = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  parseUrl: so,
  getAbsoluteURL: Xd,
  getFileExtension: oo,
  isCrossOrigin: Ta
}), cl = function(r, n) {
  var i = new P.WebVTT.Parser(P, P.vttjs, P.WebVTT.StringDecoder()), e = [];
  i.oncue = function(t) {
    n.addCue(t);
  }, i.onparsingerror = function(t) {
    e.push(t);
  }, i.onflush = function() {
    n.trigger({
      type: "loadeddata",
      target: n
    });
  }, i.parse(r), e.length > 0 && (P.console && P.console.groupCollapsed && P.console.groupCollapsed("Text Track parsing errors for " + n.src), e.forEach(function(t) {
    return Te.error(t);
  }), P.console && P.console.groupEnd && P.console.groupEnd()), i.flush();
}, fl = function(r, n) {
  var i = {
    uri: r
  }, e = Ta(r);
  e && (i.cors = e);
  var t = n.tech_.crossOrigin() === "use-credentials";
  t && (i.withCredentials = t), Zl(i, Re(this, function(a, o, u) {
    if (a)
      return Te.error(a, o);
    n.loaded_ = !0, typeof P.WebVTT != "function" ? n.tech_ && n.tech_.any(["vttjsloaded", "vttjserror"], function(l) {
      if (l.type === "vttjserror") {
        Te.error("vttjs failed to load, stopping trying to process " + n.src);
        return;
      }
      return cl(u, n);
    }) : cl(u, n);
  }));
}, $i = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    if (i === void 0 && (i = {}), !i.tech)
      throw new Error("A tech was not provided.");
    var t = Fe(i, {
      kind: xg[i.kind] || "subtitles",
      language: i.language || i.srclang || ""
    }), a = dl[t.mode] || "disabled", o = t.default;
    (t.kind === "metadata" || t.kind === "chapters") && (a = "hidden"), e = s.call(this, t) || this, e.tech_ = t.tech, e.cues_ = [], e.activeCues_ = [], e.preload_ = e.tech_.preloadTextTracks !== !1;
    var u = new ll(e.cues_), l = new ll(e.activeCues_), c = !1;
    e.timeupdateHandler = Re(ye(e), function(g) {
      if (g === void 0 && (g = {}), !this.tech_.isDisposed()) {
        if (!this.tech_.isReady_) {
          g.type !== "timeupdate" && (this.rvf_ = this.tech_.requestVideoFrameCallback(this.timeupdateHandler));
          return;
        }
        this.activeCues = this.activeCues, c && (this.trigger("cuechange"), c = !1), g.type !== "timeupdate" && (this.rvf_ = this.tech_.requestVideoFrameCallback(this.timeupdateHandler));
      }
    });
    var m = function() {
      e.stopTracking();
    };
    return e.tech_.one("dispose", m), a !== "disabled" && e.startTracking(), Object.defineProperties(ye(e), {
      /**
       * @memberof TextTrack
       * @member {boolean} default
       *         If this track was set to be on or off by default. Cannot be changed after
       *         creation.
       * @instance
       *
       * @readonly
       */
      default: {
        get: function() {
          return o;
        },
        set: function() {
        }
      },
      /**
       * @memberof TextTrack
       * @member {string} mode
       *         Set the mode of this TextTrack to a valid {@link TextTrack~Mode}. Will
       *         not be set if setting to an invalid mode.
       * @instance
       *
       * @fires TextTrack#modechange
       */
      mode: {
        get: function() {
          return a;
        },
        set: function(_) {
          dl[_] && a !== _ && (a = _, !this.preload_ && a !== "disabled" && this.cues.length === 0 && fl(this.src, this), this.stopTracking(), a !== "disabled" && this.startTracking(), this.trigger("modechange"));
        }
      },
      /**
       * @memberof TextTrack
       * @member {TextTrackCueList} cues
       *         The text track cue list for this TextTrack.
       * @instance
       */
      cues: {
        get: function() {
          return this.loaded_ ? u : null;
        },
        set: function() {
        }
      },
      /**
       * @memberof TextTrack
       * @member {TextTrackCueList} activeCues
       *         The list text track cues that are currently active for this TextTrack.
       * @instance
       */
      activeCues: {
        get: function() {
          if (!this.loaded_)
            return null;
          if (this.cues.length === 0)
            return l;
          for (var _ = this.tech_.currentTime(), C = [], w = 0, E = this.cues.length; w < E; w++) {
            var M = this.cues[w];
            (M.startTime <= _ && M.endTime >= _ || M.startTime === M.endTime && M.startTime <= _ && M.startTime + 0.5 >= _) && C.push(M);
          }
          if (c = !1, C.length !== this.activeCues_.length)
            c = !0;
          else
            for (var B = 0; B < C.length; B++)
              this.activeCues_.indexOf(C[B]) === -1 && (c = !0);
          return this.activeCues_ = C, l.setCues_(this.activeCues_), l;
        },
        // /!\ Keep this setter empty (see the timeupdate handler above)
        set: function() {
        }
      }
    }), t.src ? (e.src = t.src, e.preload_ || (e.loaded_ = !0), (e.preload_ || t.kind !== "subtitles" && t.kind !== "captions") && fl(e.src, ye(e))) : e.loaded_ = !0, e;
  }
  var n = r.prototype;
  return n.startTracking = function() {
    this.rvf_ = this.tech_.requestVideoFrameCallback(this.timeupdateHandler), this.tech_.on("timeupdate", this.timeupdateHandler);
  }, n.stopTracking = function() {
    this.rvf_ && (this.tech_.cancelVideoFrameCallback(this.rvf_), this.rvf_ = void 0), this.tech_.off("timeupdate", this.timeupdateHandler);
  }, n.addCue = function(e) {
    var t = e;
    if (!("getCueAsHTML" in t)) {
      t = new P.vttjs.VTTCue(e.startTime, e.endTime, e.text);
      for (var a in e)
        a in t || (t[a] = e[a]);
      t.id = e.id, t.originalCue_ = e;
    }
    for (var o = this.tech_.textTracks(), u = 0; u < o.length; u++)
      o[u] !== this && o[u].removeCue(t);
    this.cues_.push(t), this.cues.setCues_(this.cues_);
  }, n.removeCue = function(e) {
    for (var t = this.cues_.length; t--; ) {
      var a = this.cues_[t];
      if (a === e || a.originalCue_ && a.originalCue_ === e) {
        this.cues_.splice(t, 1), this.cues.setCues_(this.cues_);
        break;
      }
    }
  }, r;
})(ao);
$i.prototype.allowedEvents_ = {
  cuechange: "cuechange"
};
var Yd = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(n) {
    var i;
    n === void 0 && (n = {});
    var e = Fe(n, {
      kind: bg[n.kind] || ""
    });
    i = s.call(this, e) || this;
    var t = !1;
    return Object.defineProperty(ye(i), "enabled", {
      get: function() {
        return t;
      },
      set: function(o) {
        typeof o != "boolean" || o === t || (t = o, this.trigger("enabledchange"));
      }
    }), e.enabled && (i.enabled = e.enabled), i.loaded_ = !0, i;
  }
  return r;
})(ao), Qd = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(n) {
    var i;
    n === void 0 && (n = {});
    var e = Fe(n, {
      kind: Tg[n.kind] || ""
    });
    i = s.call(this, e) || this;
    var t = !1;
    return Object.defineProperty(ye(i), "selected", {
      get: function() {
        return t;
      },
      set: function(o) {
        typeof o != "boolean" || o === t || (t = o, this.trigger("selectedchange"));
      }
    }), e.selected && (i.selected = e.selected), i;
  }
  return r;
})(ao), Jd = 0, Eg = 1, Zd = 2, Cg = 3, ci = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(n) {
    var i;
    n === void 0 && (n = {}), i = s.call(this) || this;
    var e, t = new $i(n);
    return i.kind = t.kind, i.src = t.src, i.srclang = t.language, i.label = t.label, i.default = t.default, Object.defineProperties(ye(i), {
      /**
       * @memberof HTMLTrackElement
       * @member {HTMLTrackElement~ReadyState} readyState
       *         The current ready state of the track element.
       * @instance
       */
      readyState: {
        get: function() {
          return e;
        }
      },
      /**
       * @memberof HTMLTrackElement
       * @member {TextTrack} track
       *         The underlying TextTrack object.
       * @instance
       *
       */
      track: {
        get: function() {
          return t;
        }
      }
    }), e = Jd, t.addEventListener("loadeddata", function() {
      e = Zd, i.trigger({
        type: "load",
        target: ye(i)
      });
    }), i;
  }
  return r;
})(Ze);
ci.prototype.allowedEvents_ = {
  load: "load"
};
ci.NONE = Jd;
ci.LOADING = Eg;
ci.LOADED = Zd;
ci.ERROR = Cg;
var Dt = {
  audio: {
    ListClass: vg,
    TrackClass: Yd,
    capitalName: "Audio"
  },
  video: {
    ListClass: yg,
    TrackClass: Qd,
    capitalName: "Video"
  },
  text: {
    ListClass: $d,
    TrackClass: $i,
    capitalName: "Text"
  }
};
Object.keys(Dt).forEach(function(s) {
  Dt[s].getterName = s + "Tracks", Dt[s].privateName = s + "Tracks_";
});
var ai = {
  remoteText: {
    ListClass: $d,
    TrackClass: $i,
    capitalName: "RemoteText",
    getterName: "remoteTextTracks",
    privateName: "remoteTextTracks_"
  },
  remoteTextEl: {
    ListClass: _g,
    TrackClass: ci,
    capitalName: "RemoteTextTrackEls",
    getterName: "remoteTextTrackEls",
    privateName: "remoteTextTrackEls_"
  }
}, lt = Ot({}, Dt, ai);
ai.names = Object.keys(ai);
Dt.names = Object.keys(Dt);
lt.names = [].concat(ai.names).concat(Dt.names);
function Ag(s, r, n, i, e) {
  e === void 0 && (e = {});
  var t = s.textTracks();
  e.kind = r, n && (e.label = n), i && (e.language = i), e.tech = s;
  var a = new lt.text.TrackClass(e);
  return t.addTrack(a), a;
}
var we = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return i === void 0 && (i = {}), e === void 0 && (e = function() {
    }), i.reportTouchActivity = !1, t = s.call(this, null, i, e) || this, t.onDurationChange_ = function(a) {
      return t.onDurationChange(a);
    }, t.trackProgress_ = function(a) {
      return t.trackProgress(a);
    }, t.trackCurrentTime_ = function(a) {
      return t.trackCurrentTime(a);
    }, t.stopTrackingCurrentTime_ = function(a) {
      return t.stopTrackingCurrentTime(a);
    }, t.disposeSourceHandler_ = function(a) {
      return t.disposeSourceHandler(a);
    }, t.queuedHanders_ = /* @__PURE__ */ new Set(), t.hasStarted_ = !1, t.on("playing", function() {
      this.hasStarted_ = !0;
    }), t.on("loadstart", function() {
      this.hasStarted_ = !1;
    }), lt.names.forEach(function(a) {
      var o = lt[a];
      i && i[o.getterName] && (t[o.privateName] = i[o.getterName]);
    }), t.featuresProgressEvents || t.manualProgressOn(), t.featuresTimeupdateEvents || t.manualTimeUpdatesOn(), ["Text", "Audio", "Video"].forEach(function(a) {
      i["native" + a + "Tracks"] === !1 && (t["featuresNative" + a + "Tracks"] = !1);
    }), i.nativeCaptions === !1 || i.nativeTextTracks === !1 ? t.featuresNativeTextTracks = !1 : (i.nativeCaptions === !0 || i.nativeTextTracks === !0) && (t.featuresNativeTextTracks = !0), t.featuresNativeTextTracks || t.emulateTextTracks(), t.preloadTextTracks = i.preloadTextTracks !== !1, t.autoRemoteTextTracks_ = new lt.text.ListClass(), t.initTrackListeners(), i.nativeControlsForTouch || t.emitTapEvents(), t.constructor && (t.name_ = t.constructor.name || "Unknown Tech"), t;
  }
  var n = r.prototype;
  return n.triggerSourceset = function(e) {
    var t = this;
    this.isReady_ || this.one("ready", function() {
      return t.setTimeout(function() {
        return t.triggerSourceset(e);
      }, 1);
    }), this.trigger({
      src: e,
      type: "sourceset"
    });
  }, n.manualProgressOn = function() {
    this.on("durationchange", this.onDurationChange_), this.manualProgress = !0, this.one("ready", this.trackProgress_);
  }, n.manualProgressOff = function() {
    this.manualProgress = !1, this.stopTrackingProgress(), this.off("durationchange", this.onDurationChange_);
  }, n.trackProgress = function(e) {
    this.stopTrackingProgress(), this.progressInterval = this.setInterval(Re(this, function() {
      var t = this.bufferedPercent();
      this.bufferedPercent_ !== t && this.trigger("progress"), this.bufferedPercent_ = t, t === 1 && this.stopTrackingProgress();
    }), 500);
  }, n.onDurationChange = function(e) {
    this.duration_ = this.duration();
  }, n.buffered = function() {
    return Rr(0, 0);
  }, n.bufferedPercent = function() {
    return Kd(this.buffered(), this.duration_);
  }, n.stopTrackingProgress = function() {
    this.clearInterval(this.progressInterval);
  }, n.manualTimeUpdatesOn = function() {
    this.manualTimeUpdates = !0, this.on("play", this.trackCurrentTime_), this.on("pause", this.stopTrackingCurrentTime_);
  }, n.manualTimeUpdatesOff = function() {
    this.manualTimeUpdates = !1, this.stopTrackingCurrentTime(), this.off("play", this.trackCurrentTime_), this.off("pause", this.stopTrackingCurrentTime_);
  }, n.trackCurrentTime = function() {
    this.currentTimeInterval && this.stopTrackingCurrentTime(), this.currentTimeInterval = this.setInterval(function() {
      this.trigger({
        type: "timeupdate",
        target: this,
        manuallyTriggered: !0
      });
    }, 250);
  }, n.stopTrackingCurrentTime = function() {
    this.clearInterval(this.currentTimeInterval), this.trigger({
      type: "timeupdate",
      target: this,
      manuallyTriggered: !0
    });
  }, n.dispose = function() {
    this.clearTracks(Dt.names), this.manualProgress && this.manualProgressOff(), this.manualTimeUpdates && this.manualTimeUpdatesOff(), s.prototype.dispose.call(this);
  }, n.clearTracks = function(e) {
    var t = this;
    e = [].concat(e), e.forEach(function(a) {
      for (var o = t[a + "Tracks"]() || [], u = o.length; u--; ) {
        var l = o[u];
        a === "text" && t.removeRemoteTextTrack(l), o.removeTrack(l);
      }
    });
  }, n.cleanupAutoTextTracks = function() {
    for (var e = this.autoRemoteTextTracks_ || [], t = e.length; t--; ) {
      var a = e[t];
      this.removeRemoteTextTrack(a);
    }
  }, n.reset = function() {
  }, n.crossOrigin = function() {
  }, n.setCrossOrigin = function() {
  }, n.error = function(e) {
    return e !== void 0 && (this.error_ = new ft(e), this.trigger("error")), this.error_;
  }, n.played = function() {
    return this.hasStarted_ ? Rr(0, 0) : Rr();
  }, n.play = function() {
  }, n.setScrubbing = function() {
  }, n.scrubbing = function() {
  }, n.setCurrentTime = function() {
    this.manualTimeUpdates && this.trigger({
      type: "timeupdate",
      target: this,
      manuallyTriggered: !0
    });
  }, n.initTrackListeners = function() {
    var e = this;
    Dt.names.forEach(function(t) {
      var a = Dt[t], o = function() {
        e.trigger(t + "trackchange");
      }, u = e[a.getterName]();
      u.addEventListener("removetrack", o), u.addEventListener("addtrack", o), e.on("dispose", function() {
        u.removeEventListener("removetrack", o), u.removeEventListener("addtrack", o);
      });
    });
  }, n.addWebVttScript_ = function() {
    var e = this;
    if (!P.WebVTT)
      if (ae.body.contains(this.el())) {
        if (!this.options_["vtt.js"] && Ui(Ou) && Object.keys(Ou).length > 0) {
          this.trigger("vttjsloaded");
          return;
        }
        var t = ae.createElement("script");
        t.src = this.options_["vtt.js"] || "https://vjs.zencdn.net/vttjs/0.14.1/vtt.min.js", t.onload = function() {
          e.trigger("vttjsloaded");
        }, t.onerror = function() {
          e.trigger("vttjserror");
        }, this.on("dispose", function() {
          t.onload = null, t.onerror = null;
        }), P.WebVTT = !0, this.el().parentNode.appendChild(t);
      } else
        this.ready(this.addWebVttScript_);
  }, n.emulateTextTracks = function() {
    var e = this, t = this.textTracks(), a = this.remoteTextTracks(), o = function(g) {
      return t.addTrack(g.track);
    }, u = function(g) {
      return t.removeTrack(g.track);
    };
    a.on("addtrack", o), a.on("removetrack", u), this.addWebVttScript_();
    var l = function() {
      return e.trigger("texttrackchange");
    }, c = function() {
      l();
      for (var g = 0; g < t.length; g++) {
        var _ = t[g];
        _.removeEventListener("cuechange", l), _.mode === "showing" && _.addEventListener("cuechange", l);
      }
    };
    c(), t.addEventListener("change", c), t.addEventListener("addtrack", c), t.addEventListener("removetrack", c), this.on("dispose", function() {
      a.off("addtrack", o), a.off("removetrack", u), t.removeEventListener("change", c), t.removeEventListener("addtrack", c), t.removeEventListener("removetrack", c);
      for (var m = 0; m < t.length; m++) {
        var g = t[m];
        g.removeEventListener("cuechange", l);
      }
    });
  }, n.addTextTrack = function(e, t, a) {
    if (!e)
      throw new Error("TextTrack kind is required but was not provided");
    return Ag(this, e, t, a);
  }, n.createRemoteTextTrack = function(e) {
    var t = Fe(e, {
      tech: this
    });
    return new ai.remoteTextEl.TrackClass(t);
  }, n.addRemoteTextTrack = function(e, t) {
    var a = this;
    e === void 0 && (e = {});
    var o = this.createRemoteTextTrack(e);
    return t !== !0 && t !== !1 && (Te.warn('Calling addRemoteTextTrack without explicitly setting the "manualCleanup" parameter to `true` is deprecated and default to `false` in future version of video.js'), t = !0), this.remoteTextTrackEls().addTrackElement_(o), this.remoteTextTracks().addTrack(o.track), t !== !0 && this.ready(function() {
      return a.autoRemoteTextTracks_.addTrack(o.track);
    }), o;
  }, n.removeRemoteTextTrack = function(e) {
    var t = this.remoteTextTrackEls().getTrackElementByTrack_(e);
    this.remoteTextTrackEls().removeTrackElement_(t), this.remoteTextTracks().removeTrack(e), this.autoRemoteTextTracks_.removeTrack(e);
  }, n.getVideoPlaybackQuality = function() {
    return {};
  }, n.requestPictureInPicture = function() {
    var e = this.options_.Promise || P.Promise;
    if (e)
      return e.reject();
  }, n.disablePictureInPicture = function() {
    return !0;
  }, n.setDisablePictureInPicture = function() {
  }, n.requestVideoFrameCallback = function(e) {
    var t = this, a = sr();
    return !this.isReady_ || this.paused() ? (this.queuedHanders_.add(a), this.one("playing", function() {
      t.queuedHanders_.has(a) && (t.queuedHanders_.delete(a), e());
    })) : this.requestNamedAnimationFrame(a, e), a;
  }, n.cancelVideoFrameCallback = function(e) {
    this.queuedHanders_.has(e) ? this.queuedHanders_.delete(e) : this.cancelNamedAnimationFrame(e);
  }, n.setPoster = function() {
  }, n.playsinline = function() {
  }, n.setPlaysinline = function() {
  }, n.overrideNativeAudioTracks = function() {
  }, n.overrideNativeVideoTracks = function() {
  }, n.canPlayType = function() {
    return "";
  }, r.canPlayType = function() {
    return "";
  }, r.canPlaySource = function(e, t) {
    return r.canPlayType(e.type);
  }, r.isTech = function(e) {
    return e.prototype instanceof r || e instanceof r || e === r;
  }, r.registerTech = function(e, t) {
    if (r.techs_ || (r.techs_ = {}), !r.isTech(t))
      throw new Error("Tech " + e + " must be a Tech");
    if (!r.canPlayType)
      throw new Error("Techs must have a static canPlayType method on them");
    if (!r.canPlaySource)
      throw new Error("Techs must have a static canPlaySource method on them");
    return e = Ge(e), r.techs_[e] = t, r.techs_[Bn(e)] = t, e !== "Tech" && r.defaultTechOrder_.push(e), t;
  }, r.getTech = function(e) {
    if (e) {
      if (r.techs_ && r.techs_[e])
        return r.techs_[e];
      if (e = Ge(e), P && P.videojs && P.videojs[e])
        return Te.warn("The " + e + " tech was added to the videojs object when it should be registered using videojs.registerTech(name, tech)"), P.videojs[e];
    }
  }, r;
})(te);
lt.names.forEach(function(s) {
  var r = lt[s];
  we.prototype[r.getterName] = function() {
    return this[r.privateName] = this[r.privateName] || new r.ListClass(), this[r.privateName];
  };
});
we.prototype.featuresVolumeControl = !0;
we.prototype.featuresMuteControl = !0;
we.prototype.featuresFullscreenResize = !1;
we.prototype.featuresPlaybackRate = !1;
we.prototype.featuresProgressEvents = !1;
we.prototype.featuresSourceset = !1;
we.prototype.featuresTimeupdateEvents = !1;
we.prototype.featuresNativeTextTracks = !1;
we.prototype.featuresVideoFrameCallback = !1;
we.withSourceHandlers = function(s) {
  s.registerSourceHandler = function(n, i) {
    var e = s.sourceHandlers;
    e || (e = s.sourceHandlers = []), i === void 0 && (i = e.length), e.splice(i, 0, n);
  }, s.canPlayType = function(n) {
    for (var i = s.sourceHandlers || [], e, t = 0; t < i.length; t++)
      if (e = i[t].canPlayType(n), e)
        return e;
    return "";
  }, s.selectSourceHandler = function(n, i) {
    for (var e = s.sourceHandlers || [], t, a = 0; a < e.length; a++)
      if (t = e[a].canHandleSource(n, i), t)
        return e[a];
    return null;
  }, s.canPlaySource = function(n, i) {
    var e = s.selectSourceHandler(n, i);
    return e ? e.canHandleSource(n, i) : "";
  };
  var r = ["seekable", "seeking", "duration"];
  r.forEach(function(n) {
    var i = this[n];
    typeof i == "function" && (this[n] = function() {
      return this.sourceHandler_ && this.sourceHandler_[n] ? this.sourceHandler_[n].apply(this.sourceHandler_, arguments) : i.apply(this, arguments);
    });
  }, s.prototype), s.prototype.setSource = function(n) {
    var i = s.selectSourceHandler(n, this.options_);
    i || (s.nativeSourceHandler ? i = s.nativeSourceHandler : Te.error("No source handler found for the current source.")), this.disposeSourceHandler(), this.off("dispose", this.disposeSourceHandler_), i !== s.nativeSourceHandler && (this.currentSource_ = n), this.sourceHandler_ = i.handleSource(n, this, this.options_), this.one("dispose", this.disposeSourceHandler_);
  }, s.prototype.disposeSourceHandler = function() {
    this.currentSource_ && (this.clearTracks(["audio", "video"]), this.currentSource_ = null), this.cleanupAutoTextTracks(), this.sourceHandler_ && (this.sourceHandler_.dispose && this.sourceHandler_.dispose(), this.sourceHandler_ = null);
  };
};
te.registerComponent("Tech", we);
we.registerTech("Tech", we);
we.defaultTechOrder_ = [];
var Mr = {}, Ps = {}, Kn = {};
function Dg(s, r) {
  Mr[s] = Mr[s] || [], Mr[s].push(r);
}
function wg(s, r, n) {
  s.setTimeout(function() {
    return Pr(r, Mr[r.type], n, s);
  }, 1);
}
function kg(s, r) {
  s.forEach(function(n) {
    return n.setTech && n.setTech(r);
  });
}
function Pg(s, r, n) {
  return s.reduceRight(uo(n), r[n]());
}
function Ig(s, r, n, i) {
  return r[n](s.reduce(uo(n), i));
}
function hl(s, r, n, i) {
  i === void 0 && (i = null);
  var e = "call" + Ge(n), t = s.reduce(uo(e), i), a = t === Kn, o = a ? null : r[n](t);
  return Fg(s, n, o, a), o;
}
var Og = {
  buffered: 1,
  currentTime: 1,
  duration: 1,
  muted: 1,
  played: 1,
  paused: 1,
  seekable: 1,
  volume: 1,
  ended: 1
}, Lg = {
  setCurrentTime: 1,
  setMuted: 1,
  setVolume: 1
}, pl = {
  play: 1,
  pause: 1
};
function uo(s) {
  return function(r, n) {
    return r === Kn ? Kn : n[s] ? n[s](r) : r;
  };
}
function Fg(s, r, n, i) {
  for (var e = s.length - 1; e >= 0; e--) {
    var t = s[e];
    t[r] && t[r](i, n);
  }
}
function Rg(s) {
  Ps[s.id()] = null;
}
function Mg(s, r) {
  var n = Ps[s.id()], i = null;
  if (n == null)
    return i = r(s), Ps[s.id()] = [[r, i]], i;
  for (var e = 0; e < n.length; e++) {
    var t = n[e], a = t[0], o = t[1];
    a === r && (i = o);
  }
  return i === null && (i = r(s), n.push([r, i])), i;
}
function Pr(s, r, n, i, e, t) {
  s === void 0 && (s = {}), r === void 0 && (r = []), e === void 0 && (e = []), t === void 0 && (t = !1);
  var a = r, o = a[0], u = a.slice(1);
  if (typeof o == "string")
    Pr(s, Mr[o], n, i, e, t);
  else if (o) {
    var l = Mg(i, o);
    if (!l.setSource)
      return e.push(l), Pr(s, u, n, i, e, t);
    l.setSource(Ue({}, s), function(c, m) {
      if (c)
        return Pr(s, u, n, i, e, t);
      e.push(l), Pr(m, s.type === m.type ? u : Mr[m.type], n, i, e, t);
    });
  } else u.length ? Pr(s, u, n, i, e, t) : t ? n(s, e) : Pr(s, Mr["*"], n, i, e, !0);
}
var Ng = {
  opus: "video/ogg",
  ogv: "video/ogg",
  mp4: "video/mp4",
  mov: "video/mp4",
  m4v: "video/mp4",
  mkv: "video/x-matroska",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  aac: "audio/aac",
  caf: "audio/x-caf",
  flac: "audio/flac",
  oga: "audio/ogg",
  wav: "audio/wav",
  m3u8: "application/x-mpegURL",
  mpd: "application/dash+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp"
}, $n = function(r) {
  r === void 0 && (r = "");
  var n = oo(r), i = Ng[n.toLowerCase()];
  return i || "";
}, Bg = function(r, n) {
  if (!n)
    return "";
  if (r.cache_.source.src === n && r.cache_.source.type)
    return r.cache_.source.type;
  var i = r.cache_.sources.filter(function(o) {
    return o.src === n;
  });
  if (i.length)
    return i[0].type;
  for (var e = r.$$("source"), t = 0; t < e.length; t++) {
    var a = e[t];
    if (a.type && a.src && a.src === n)
      return a.type;
  }
  return $n(n);
}, Ug = function s(r) {
  if (Array.isArray(r)) {
    var n = [];
    r.forEach(function(i) {
      i = s(i), Array.isArray(i) ? n = n.concat(i) : rr(i) && n.push(i);
    }), r = n;
  } else typeof r == "string" && r.trim() ? r = [ml({
    src: r
  })] : rr(r) && typeof r.src == "string" && r.src && r.src.trim() ? r = [ml(r)] : r = [];
  return r;
};
function ml(s) {
  if (!s.type) {
    var r = $n(s.src);
    r && (s.type = r);
  }
  return s;
}
var Vg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(n, i, e) {
    var t, a = Fe({
      createEl: !1
    }, i);
    if (t = s.call(this, n, a, e) || this, !i.playerOptions.sources || i.playerOptions.sources.length === 0)
      for (var o = 0, u = i.playerOptions.techOrder; o < u.length; o++) {
        var l = Ge(u[o]), c = we.getTech(l);
        if (l || (c = te.getComponent(l)), c && c.isSupported()) {
          n.loadTech_(l);
          break;
        }
      }
    else
      n.src(i.playerOptions.sources);
    return t;
  }
  return r;
})(te);
te.registerComponent("MediaLoader", Vg);
var ba = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.options_.controlText && t.controlText(t.options_.controlText), t.handleMouseOver_ = function(a) {
      return t.handleMouseOver(a);
    }, t.handleMouseOut_ = function(a) {
      return t.handleMouseOut(a);
    }, t.handleClick_ = function(a) {
      return t.handleClick(a);
    }, t.handleKeyDown_ = function(a) {
      return t.handleKeyDown(a);
    }, t.emitTapEvents(), t.enable(), t;
  }
  var n = r.prototype;
  return n.createEl = function(e, t, a) {
    e === void 0 && (e = "div"), t === void 0 && (t = {}), a === void 0 && (a = {}), t = Ue({
      className: this.buildCSSClass(),
      tabIndex: 0
    }, t), e === "button" && Te.error("Creating a ClickableComponent with an HTML element of " + e + " is not supported; use a Button instead."), a = Ue({
      role: "button"
    }, a), this.tabIndex_ = t.tabIndex;
    var o = Ee(e, t, a);
    return o.appendChild(Ee("span", {
      className: "vjs-icon-placeholder"
    }, {
      "aria-hidden": !0
    })), this.createControlTextEl(o), o;
  }, n.dispose = function() {
    this.controlTextEl_ = null, s.prototype.dispose.call(this);
  }, n.createControlTextEl = function(e) {
    return this.controlTextEl_ = Ee("span", {
      className: "vjs-control-text"
    }, {
      // let the screen reader user know that the text of the element may change
      "aria-live": "polite"
    }), e && e.appendChild(this.controlTextEl_), this.controlText(this.controlText_, e), this.controlTextEl_;
  }, n.controlText = function(e, t) {
    if (t === void 0 && (t = this.el()), e === void 0)
      return this.controlText_ || "Need Text";
    var a = this.localize(e);
    this.controlText_ = e, Nr(this.controlTextEl_, a), !this.nonIconControl && !this.player_.options_.noUITitleAttributes && t.setAttribute("title", a);
  }, n.buildCSSClass = function() {
    return "vjs-control vjs-button " + s.prototype.buildCSSClass.call(this);
  }, n.enable = function() {
    this.enabled_ || (this.enabled_ = !0, this.removeClass("vjs-disabled"), this.el_.setAttribute("aria-disabled", "false"), typeof this.tabIndex_ < "u" && this.el_.setAttribute("tabIndex", this.tabIndex_), this.on(["tap", "click"], this.handleClick_), this.on("keydown", this.handleKeyDown_));
  }, n.disable = function() {
    this.enabled_ = !1, this.addClass("vjs-disabled"), this.el_.setAttribute("aria-disabled", "true"), typeof this.tabIndex_ < "u" && this.el_.removeAttribute("tabIndex"), this.off("mouseover", this.handleMouseOver_), this.off("mouseout", this.handleMouseOut_), this.off(["tap", "click"], this.handleClick_), this.off("keydown", this.handleKeyDown_);
  }, n.handleLanguagechange = function() {
    this.controlText(this.controlText_);
  }, n.handleClick = function(e) {
    this.options_.clickHandler && this.options_.clickHandler.call(this, arguments);
  }, n.handleKeyDown = function(e) {
    _e.isEventKey(e, "Space") || _e.isEventKey(e, "Enter") ? (e.preventDefault(), e.stopPropagation(), this.trigger("click")) : s.prototype.handleKeyDown.call(this, e);
  }, r;
})(te);
te.registerComponent("ClickableComponent", ba);
var qg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.update(), t.update_ = function(a) {
      return t.update(a);
    }, i.on("posterchange", t.update_), t;
  }
  var n = r.prototype;
  return n.dispose = function() {
    this.player().off("posterchange", this.update_), s.prototype.dispose.call(this);
  }, n.createEl = function() {
    var e = Ee("div", {
      className: "vjs-poster",
      // Don't want poster to be tabbable.
      tabIndex: -1
    });
    return e;
  }, n.update = function(e) {
    var t = this.player().poster();
    this.setSrc(t), t ? this.show() : this.hide();
  }, n.setSrc = function(e) {
    var t = "";
    e && (t = 'url("' + e + '")'), this.el_.style.backgroundImage = t;
  }, n.handleClick = function(e) {
    if (this.player_.controls()) {
      var t = this.player_.usingPlugin("eme") && this.player_.eme.sessions && this.player_.eme.sessions.length > 0;
      this.player_.tech(!0) && // We've observed a bug in IE and Edge when playing back DRM content where
      // calling .focus() on the video element causes the video to go black,
      // so we avoid it in that specific case
      !((zi || Gi) && t) && this.player_.tech(!0).focus(), this.player_.paused() ? jt(this.player_.play()) : this.player_.pause();
    }
  }, r;
})(ba);
te.registerComponent("PosterImage", qg);
var At = "#222", gl = "#ccc", jg = {
  monospace: "monospace",
  sansSerif: "sans-serif",
  serif: "serif",
  monospaceSansSerif: '"Andale Mono", "Lucida Console", monospace',
  monospaceSerif: '"Courier New", monospace',
  proportionalSansSerif: "sans-serif",
  proportionalSerif: "serif",
  casual: '"Comic Sans MS", Impact, fantasy',
  script: '"Monotype Corsiva", cursive',
  smallcaps: '"Andale Mono", "Lucida Console", monospace, sans-serif'
};
function as(s, r) {
  var n;
  if (s.length === 4)
    n = s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  else if (s.length === 7)
    n = s.slice(1);
  else
    throw new Error("Invalid color code provided, " + s + "; must be formatted as e.g. #f0e or #f604e2.");
  return "rgba(" + parseInt(n.slice(0, 2), 16) + "," + parseInt(n.slice(2, 4), 16) + "," + parseInt(n.slice(4, 6), 16) + "," + r + ")";
}
function ss(s, r, n) {
  try {
    s.style[r] = n;
  } catch {
    return;
  }
}
var Hg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    var a;
    a = s.call(this, i, e, t) || this;
    var o = function(l) {
      return a.updateDisplay(l);
    };
    return i.on("loadstart", function(u) {
      return a.toggleDisplay(u);
    }), i.on("texttrackchange", o), i.on("loadedmetadata", function(u) {
      return a.preselectTrack(u);
    }), i.ready(Re(ye(a), function() {
      if (i.tech_ && i.tech_.featuresNativeTextTracks) {
        this.hide();
        return;
      }
      i.on("fullscreenchange", o), i.on("playerresize", o), P.addEventListener("orientationchange", o), i.on("dispose", function() {
        return P.removeEventListener("orientationchange", o);
      });
      for (var u = this.options_.playerOptions.tracks || [], l = 0; l < u.length; l++)
        this.player_.addRemoteTextTrack(u[l], !0);
      this.preselectTrack();
    })), a;
  }
  var n = r.prototype;
  return n.preselectTrack = function() {
    for (var e = {
      captions: 1,
      subtitles: 1
    }, t = this.player_.textTracks(), a = this.player_.cache_.selectedLanguage, o, u, l, c = 0; c < t.length; c++) {
      var m = t[c];
      a && a.enabled && a.language && a.language === m.language && m.kind in e ? m.kind === a.kind ? l = m : l || (l = m) : a && !a.enabled ? (l = null, o = null, u = null) : m.default && (m.kind === "descriptions" && !o ? o = m : m.kind in e && !u && (u = m));
    }
    l ? l.mode = "showing" : u ? u.mode = "showing" : o && (o.mode = "showing");
  }, n.toggleDisplay = function() {
    this.player_.tech_ && this.player_.tech_.featuresNativeTextTracks ? this.hide() : this.show();
  }, n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-text-track-display"
    }, {
      translate: "yes",
      "aria-live": "off",
      "aria-atomic": "true"
    });
  }, n.clearDisplay = function() {
    typeof P.WebVTT == "function" && P.WebVTT.processCues(P, [], this.el_);
  }, n.updateDisplay = function() {
    var e = this.player_.textTracks(), t = this.options_.allowMultipleShowingTracks;
    if (this.clearDisplay(), t) {
      for (var a = [], o = 0; o < e.length; ++o) {
        var u = e[o];
        u.mode === "showing" && a.push(u);
      }
      this.updateForTrack(a);
      return;
    }
    for (var l = null, c = null, m = e.length; m--; ) {
      var g = e[m];
      g.mode === "showing" && (g.kind === "descriptions" ? l = g : c = g);
    }
    c ? (this.getAttribute("aria-live") !== "off" && this.setAttribute("aria-live", "off"), this.updateForTrack(c)) : l && (this.getAttribute("aria-live") !== "assertive" && this.setAttribute("aria-live", "assertive"), this.updateForTrack(l));
  }, n.updateDisplayState = function(e) {
    for (var t = this.player_.textTrackSettings.getValues(), a = e.activeCues, o = a.length; o--; ) {
      var u = a[o];
      if (u) {
        var l = u.displayState;
        if (t.color && (l.firstChild.style.color = t.color), t.textOpacity && ss(l.firstChild, "color", as(t.color || "#fff", t.textOpacity)), t.backgroundColor && (l.firstChild.style.backgroundColor = t.backgroundColor), t.backgroundOpacity && ss(l.firstChild, "backgroundColor", as(t.backgroundColor || "#000", t.backgroundOpacity)), t.windowColor && (t.windowOpacity ? ss(l, "backgroundColor", as(t.windowColor, t.windowOpacity)) : l.style.backgroundColor = t.windowColor), t.edgeStyle && (t.edgeStyle === "dropshadow" ? l.firstChild.style.textShadow = "2px 2px 3px " + At + ", 2px 2px 4px " + At + ", 2px 2px 5px " + At : t.edgeStyle === "raised" ? l.firstChild.style.textShadow = "1px 1px " + At + ", 2px 2px " + At + ", 3px 3px " + At : t.edgeStyle === "depressed" ? l.firstChild.style.textShadow = "1px 1px " + gl + ", 0 1px " + gl + ", -1px -1px " + At + ", 0 -1px " + At : t.edgeStyle === "uniform" && (l.firstChild.style.textShadow = "0 0 4px " + At + ", 0 0 4px " + At + ", 0 0 4px " + At + ", 0 0 4px " + At)), t.fontPercent && t.fontPercent !== 1) {
          var c = P.parseFloat(l.style.fontSize);
          l.style.fontSize = c * t.fontPercent + "px", l.style.height = "auto", l.style.top = "auto";
        }
        t.fontFamily && t.fontFamily !== "default" && (t.fontFamily === "small-caps" ? l.firstChild.style.fontVariant = "small-caps" : l.firstChild.style.fontFamily = jg[t.fontFamily]);
      }
    }
  }, n.updateForTrack = function(e) {
    if (Array.isArray(e) || (e = [e]), !(typeof P.WebVTT != "function" || e.every(function(_) {
      return !_.activeCues;
    }))) {
      for (var t = [], a = 0; a < e.length; ++a)
        for (var o = e[a], u = 0; u < o.activeCues.length; ++u)
          t.push(o.activeCues[u]);
      P.WebVTT.processCues(P, t, this.el_);
      for (var l = 0; l < e.length; ++l) {
        for (var c = e[l], m = 0; m < c.activeCues.length; ++m) {
          var g = c.activeCues[m].displayState;
          er(g, "vjs-text-track-cue"), er(g, "vjs-text-track-cue-" + (c.language ? c.language : l)), c.language && ri(g, "lang", c.language);
        }
        this.player_.textTrackSettings && this.updateDisplayState(c);
      }
    }
  }, r;
})(te);
te.registerComponent("TextTrackDisplay", Hg);
var Wg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = this.player_.isAudio(), t = this.localize(e ? "Audio Player" : "Video Player"), a = Ee("span", {
      className: "vjs-control-text",
      textContent: this.localize("{1} is loading.", [t])
    }), o = s.prototype.createEl.call(this, "div", {
      className: "vjs-loading-spinner",
      dir: "ltr"
    });
    return o.appendChild(a), o;
  }, r;
})(te);
te.registerComponent("LoadingSpinner", Wg);
var It = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.createEl = function(e, t, a) {
    t === void 0 && (t = {}), a === void 0 && (a = {}), e = "button", t = Ue({
      className: this.buildCSSClass()
    }, t), a = Ue({
      // Necessary since the default button type is "submit"
      type: "button"
    }, a);
    var o = Ee(e, t, a);
    return o.appendChild(Ee("span", {
      className: "vjs-icon-placeholder"
    }, {
      "aria-hidden": !0
    })), this.createControlTextEl(o), o;
  }, n.addChild = function(e, t) {
    t === void 0 && (t = {});
    var a = this.constructor.name;
    return Te.warn("Adding an actionable (user controllable) child to a Button (" + a + ") is not supported; use a ClickableComponent instead."), te.prototype.addChild.call(this, e, t);
  }, n.enable = function() {
    s.prototype.enable.call(this), this.el_.removeAttribute("disabled");
  }, n.disable = function() {
    s.prototype.disable.call(this), this.el_.setAttribute("disabled", "disabled");
  }, n.handleKeyDown = function(e) {
    if (_e.isEventKey(e, "Space") || _e.isEventKey(e, "Enter")) {
      e.stopPropagation();
      return;
    }
    s.prototype.handleKeyDown.call(this, e);
  }, r;
})(ba);
te.registerComponent("Button", It);
var ec = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.mouseused_ = !1, t.on("mousedown", function(a) {
      return t.handleMouseDown(a);
    }), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-big-play-button";
  }, n.handleClick = function(e) {
    var t = this.player_.play();
    if (this.mouseused_ && e.clientX && e.clientY) {
      var a = this.player_.usingPlugin("eme") && this.player_.eme.sessions && this.player_.eme.sessions.length > 0;
      jt(t), this.player_.tech(!0) && // We've observed a bug in IE and Edge when playing back DRM content where
      // calling .focus() on the video element causes the video to go black,
      // so we avoid it in that specific case
      !((zi || Gi) && a) && this.player_.tech(!0).focus();
      return;
    }
    var o = this.player_.getChild("controlBar"), u = o && o.getChild("playToggle");
    if (!u) {
      this.player_.tech(!0).focus();
      return;
    }
    var l = function() {
      return u.focus();
    };
    Fi(t) ? t.then(l, function() {
    }) : this.setTimeout(l, 1);
  }, n.handleKeyDown = function(e) {
    this.mouseused_ = !1, s.prototype.handleKeyDown.call(this, e);
  }, n.handleMouseDown = function(e) {
    this.mouseused_ = !0;
  }, r;
})(It);
ec.prototype.controlText_ = "Play Video";
te.registerComponent("BigPlayButton", ec);
var Gg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.controlText(e && e.controlText || t.localize("Close")), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-close-button " + s.prototype.buildCSSClass.call(this);
  }, n.handleClick = function(e) {
    this.trigger({
      type: "close",
      bubbles: !1
    });
  }, n.handleKeyDown = function(e) {
    _e.isEventKey(e, "Esc") ? (e.preventDefault(), e.stopPropagation(), this.trigger("click")) : s.prototype.handleKeyDown.call(this, e);
  }, r;
})(It);
te.registerComponent("CloseButton", Gg);
var tc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e === void 0 && (e = {}), t = s.call(this, i, e) || this, e.replay = e.replay === void 0 || e.replay, t.on(i, "play", function(a) {
      return t.handlePlay(a);
    }), t.on(i, "pause", function(a) {
      return t.handlePause(a);
    }), e.replay && t.on(i, "ended", function(a) {
      return t.handleEnded(a);
    }), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-play-control " + s.prototype.buildCSSClass.call(this);
  }, n.handleClick = function(e) {
    this.player_.paused() ? jt(this.player_.play()) : this.player_.pause();
  }, n.handleSeeked = function(e) {
    this.removeClass("vjs-ended"), this.player_.paused() ? this.handlePause(e) : this.handlePlay(e);
  }, n.handlePlay = function(e) {
    this.removeClass("vjs-ended"), this.removeClass("vjs-paused"), this.addClass("vjs-playing"), this.controlText("Pause");
  }, n.handlePause = function(e) {
    this.removeClass("vjs-playing"), this.addClass("vjs-paused"), this.controlText("Play");
  }, n.handleEnded = function(e) {
    var t = this;
    this.removeClass("vjs-playing"), this.addClass("vjs-ended"), this.controlText("Replay"), this.one(this.player_, "seeked", function(a) {
      return t.handleSeeked(a);
    });
  }, r;
})(It);
tc.prototype.controlText_ = "Play";
te.registerComponent("PlayToggle", tc);
var rc = function(r, n) {
  r = r < 0 ? 0 : r;
  var i = Math.floor(r % 60), e = Math.floor(r / 60 % 60), t = Math.floor(r / 3600), a = Math.floor(n / 60 % 60), o = Math.floor(n / 3600);
  return (isNaN(r) || r === 1 / 0) && (t = e = i = "-"), t = t > 0 || o > 0 ? t + ":" : "", e = ((t || a >= 10) && e < 10 ? "0" + e : e) + ":", i = i < 10 ? "0" + i : i, t + e + i;
}, lo = rc;
function zg(s) {
  lo = s;
}
function Kg() {
  lo = rc;
}
function si(s, r) {
  return r === void 0 && (r = s), lo(s, r);
}
var fi = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.on(i, ["timeupdate", "ended"], function(a) {
      return t.updateContent(a);
    }), t.updateTextNode_(), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = this.buildCSSClass(), t = s.prototype.createEl.call(this, "div", {
      className: e + " vjs-time-control vjs-control"
    }), a = Ee("span", {
      className: "vjs-control-text",
      textContent: this.localize(this.labelText_) + " "
    }, {
      role: "presentation"
    });
    return t.appendChild(a), this.contentEl_ = Ee("span", {
      className: e + "-display"
    }, {
      // tell screen readers not to automatically read the time as it changes
      "aria-live": "off",
      // span elements have no implicit role, but some screen readers (notably VoiceOver)
      // treat them as a break between items in the DOM when using arrow keys
      // (or left-to-right swipes on iOS) to read contents of a page. Using
      // role='presentation' causes VoiceOver to NOT treat this span as a break.
      role: "presentation"
    }), t.appendChild(this.contentEl_), t;
  }, n.dispose = function() {
    this.contentEl_ = null, this.textNode_ = null, s.prototype.dispose.call(this);
  }, n.updateTextNode_ = function(e) {
    var t = this;
    e === void 0 && (e = 0), e = si(e), this.formattedTime_ !== e && (this.formattedTime_ = e, this.requestNamedAnimationFrame("TimeDisplay#updateTextNode_", function() {
      if (t.contentEl_) {
        var a = t.textNode_;
        a && t.contentEl_.firstChild !== a && (a = null, Te.warn("TimeDisplay#updateTextnode_: Prevented replacement of text node element since it was no longer a child of this node. Appending a new node instead.")), t.textNode_ = ae.createTextNode(t.formattedTime_), t.textNode_ && (a ? t.contentEl_.replaceChild(t.textNode_, a) : t.contentEl_.appendChild(t.textNode_));
      }
    }));
  }, n.updateContent = function(e) {
  }, r;
})(te);
fi.prototype.labelText_ = "Time";
fi.prototype.controlText_ = "Time";
te.registerComponent("TimeDisplay", fi);
var co = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-current-time";
  }, n.updateContent = function(e) {
    var t;
    this.player_.ended() ? t = this.player_.duration() : t = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime(), this.updateTextNode_(t);
  }, r;
})(fi);
co.prototype.labelText_ = "Current Time";
co.prototype.controlText_ = "Current Time";
te.registerComponent("CurrentTimeDisplay", co);
var fo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    t = s.call(this, i, e) || this;
    var a = function(u) {
      return t.updateContent(u);
    };
    return t.on(i, "durationchange", a), t.on(i, "loadstart", a), t.on(i, "loadedmetadata", a), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-duration";
  }, n.updateContent = function(e) {
    var t = this.player_.duration();
    this.updateTextNode_(t);
  }, r;
})(fi);
fo.prototype.labelText_ = "Duration";
fo.prototype.controlText_ = "Duration";
te.registerComponent("DurationDisplay", fo);
var $g = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = s.prototype.createEl.call(this, "div", {
      className: "vjs-time-control vjs-time-divider"
    }, {
      // this element and its contents can be hidden from assistive techs since
      // it is made extraneous by the announcement of the control text
      // for the current time and duration displays
      "aria-hidden": !0
    }), t = s.prototype.createEl.call(this, "div"), a = s.prototype.createEl.call(this, "span", {
      textContent: "/"
    });
    return t.appendChild(a), e.appendChild(t), e;
  }, r;
})(te);
te.registerComponent("TimeDivider", $g);
var ho = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.on(i, "durationchange", function(a) {
      return t.updateContent(a);
    }), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-remaining-time";
  }, n.createEl = function() {
    var e = s.prototype.createEl.call(this);
    return this.options_.displayNegative !== !1 && e.insertBefore(Ee("span", {}, {
      "aria-hidden": !0
    }, "-"), this.contentEl_), e;
  }, n.updateContent = function(e) {
    if (typeof this.player_.duration() == "number") {
      var t;
      this.player_.ended() ? t = 0 : this.player_.remainingTimeDisplay ? t = this.player_.remainingTimeDisplay() : t = this.player_.remainingTime(), this.updateTextNode_(t);
    }
  }, r;
})(fi);
ho.prototype.labelText_ = "Remaining Time";
ho.prototype.controlText_ = "Remaining Time";
te.registerComponent("RemainingTimeDisplay", ho);
var Xg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.updateShowing(), t.on(t.player(), "durationchange", function(a) {
      return t.updateShowing(a);
    }), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = s.prototype.createEl.call(this, "div", {
      className: "vjs-live-control vjs-control"
    });
    return this.contentEl_ = Ee("div", {
      className: "vjs-live-display"
    }, {
      "aria-live": "off"
    }), this.contentEl_.appendChild(Ee("span", {
      className: "vjs-control-text",
      textContent: this.localize("Stream Type") + " "
    })), this.contentEl_.appendChild(ae.createTextNode(this.localize("LIVE"))), e.appendChild(this.contentEl_), e;
  }, n.dispose = function() {
    this.contentEl_ = null, s.prototype.dispose.call(this);
  }, n.updateShowing = function(e) {
    this.player().duration() === 1 / 0 ? this.show() : this.hide();
  }, r;
})(te);
te.registerComponent("LiveDisplay", Xg);
var ic = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.updateLiveEdgeStatus(), t.player_.liveTracker && (t.updateLiveEdgeStatusHandler_ = function(a) {
      return t.updateLiveEdgeStatus(a);
    }, t.on(t.player_.liveTracker, "liveedgechange", t.updateLiveEdgeStatusHandler_)), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = s.prototype.createEl.call(this, "button", {
      className: "vjs-seek-to-live-control vjs-control"
    });
    return this.textEl_ = Ee("span", {
      className: "vjs-seek-to-live-text",
      textContent: this.localize("LIVE")
    }, {
      "aria-hidden": "true"
    }), e.appendChild(this.textEl_), e;
  }, n.updateLiveEdgeStatus = function() {
    !this.player_.liveTracker || this.player_.liveTracker.atLiveEdge() ? (this.setAttribute("aria-disabled", !0), this.addClass("vjs-at-live-edge"), this.controlText("Seek to live, currently playing live")) : (this.setAttribute("aria-disabled", !1), this.removeClass("vjs-at-live-edge"), this.controlText("Seek to live, currently behind live"));
  }, n.handleClick = function() {
    this.player_.liveTracker.seekToLiveEdge();
  }, n.dispose = function() {
    this.player_.liveTracker && this.off(this.player_.liveTracker, "liveedgechange", this.updateLiveEdgeStatusHandler_), this.textEl_ = null, s.prototype.dispose.call(this);
  }, r;
})(It);
ic.prototype.controlText_ = "Seek to live, currently playing live";
te.registerComponent("SeekToLive", ic);
var xa = function(r, n, i) {
  return r = Number(r), Math.min(i, Math.max(n, isNaN(r) ? n : r));
}, po = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.handleMouseDown_ = function(a) {
      return t.handleMouseDown(a);
    }, t.handleMouseUp_ = function(a) {
      return t.handleMouseUp(a);
    }, t.handleKeyDown_ = function(a) {
      return t.handleKeyDown(a);
    }, t.handleClick_ = function(a) {
      return t.handleClick(a);
    }, t.handleMouseMove_ = function(a) {
      return t.handleMouseMove(a);
    }, t.update_ = function(a) {
      return t.update(a);
    }, t.bar = t.getChild(t.options_.barName), t.vertical(!!t.options_.vertical), t.enable(), t;
  }
  var n = r.prototype;
  return n.enabled = function() {
    return this.enabled_;
  }, n.enable = function() {
    this.enabled() || (this.on("mousedown", this.handleMouseDown_), this.on("touchstart", this.handleMouseDown_), this.on("keydown", this.handleKeyDown_), this.on("click", this.handleClick_), this.on(this.player_, "controlsvisible", this.update), this.playerEvent && this.on(this.player_, this.playerEvent, this.update), this.removeClass("disabled"), this.setAttribute("tabindex", 0), this.enabled_ = !0);
  }, n.disable = function() {
    if (this.enabled()) {
      var e = this.bar.el_.ownerDocument;
      this.off("mousedown", this.handleMouseDown_), this.off("touchstart", this.handleMouseDown_), this.off("keydown", this.handleKeyDown_), this.off("click", this.handleClick_), this.off(this.player_, "controlsvisible", this.update_), this.off(e, "mousemove", this.handleMouseMove_), this.off(e, "mouseup", this.handleMouseUp_), this.off(e, "touchmove", this.handleMouseMove_), this.off(e, "touchend", this.handleMouseUp_), this.removeAttribute("tabindex"), this.addClass("disabled"), this.playerEvent && this.off(this.player_, this.playerEvent, this.update), this.enabled_ = !1;
    }
  }, n.createEl = function(e, t, a) {
    return t === void 0 && (t = {}), a === void 0 && (a = {}), t.className = t.className + " vjs-slider", t = Ue({
      tabIndex: 0
    }, t), a = Ue({
      role: "slider",
      "aria-valuenow": 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      tabIndex: 0
    }, a), s.prototype.createEl.call(this, e, t, a);
  }, n.handleMouseDown = function(e) {
    var t = this.bar.el_.ownerDocument;
    e.type === "mousedown" && e.preventDefault(), e.type === "touchstart" && !ar && e.preventDefault(), Od(), this.addClass("vjs-sliding"), this.trigger("slideractive"), this.on(t, "mousemove", this.handleMouseMove_), this.on(t, "mouseup", this.handleMouseUp_), this.on(t, "touchmove", this.handleMouseMove_), this.on(t, "touchend", this.handleMouseUp_), this.handleMouseMove(e, !0);
  }, n.handleMouseMove = function(e) {
  }, n.handleMouseUp = function() {
    var e = this.bar.el_.ownerDocument;
    Ld(), this.removeClass("vjs-sliding"), this.trigger("sliderinactive"), this.off(e, "mousemove", this.handleMouseMove_), this.off(e, "mouseup", this.handleMouseUp_), this.off(e, "touchmove", this.handleMouseMove_), this.off(e, "touchend", this.handleMouseUp_), this.update();
  }, n.update = function() {
    var e = this;
    if (!(!this.el_ || !this.bar)) {
      var t = this.getProgress();
      return t === this.progress_ || (this.progress_ = t, this.requestNamedAnimationFrame("Slider#update", function() {
        var a = e.vertical() ? "height" : "width";
        e.bar.el().style[a] = (t * 100).toFixed(2) + "%";
      })), t;
    }
  }, n.getProgress = function() {
    return Number(xa(this.getPercent(), 0, 1).toFixed(4));
  }, n.calculateDistance = function(e) {
    var t = ga(this.el_, e);
    return this.vertical() ? t.y : t.x;
  }, n.handleKeyDown = function(e) {
    _e.isEventKey(e, "Left") || _e.isEventKey(e, "Down") ? (e.preventDefault(), e.stopPropagation(), this.stepBack()) : _e.isEventKey(e, "Right") || _e.isEventKey(e, "Up") ? (e.preventDefault(), e.stopPropagation(), this.stepForward()) : s.prototype.handleKeyDown.call(this, e);
  }, n.handleClick = function(e) {
    e.stopPropagation(), e.preventDefault();
  }, n.vertical = function(e) {
    if (e === void 0)
      return this.vertical_ || !1;
    this.vertical_ = !!e, this.vertical_ ? this.addClass("vjs-slider-vertical") : this.addClass("vjs-slider-horizontal");
  }, r;
})(te);
te.registerComponent("Slider", po);
var os = function(r, n) {
  return xa(r / n * 100, 0, 100).toFixed(2) + "%";
}, Yg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.partEls_ = [], t.on(i, "progress", function(a) {
      return t.update(a);
    }), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = s.prototype.createEl.call(this, "div", {
      className: "vjs-load-progress"
    }), t = Ee("span", {
      className: "vjs-control-text"
    }), a = Ee("span", {
      textContent: this.localize("Loaded")
    }), o = ae.createTextNode(": ");
    return this.percentageEl_ = Ee("span", {
      className: "vjs-control-text-loaded-percentage",
      textContent: "0%"
    }), e.appendChild(t), t.appendChild(a), t.appendChild(o), t.appendChild(this.percentageEl_), e;
  }, n.dispose = function() {
    this.partEls_ = null, this.percentageEl_ = null, s.prototype.dispose.call(this);
  }, n.update = function(e) {
    var t = this;
    this.requestNamedAnimationFrame("LoadProgressBar#update", function() {
      var a = t.player_.liveTracker, o = t.player_.buffered(), u = a && a.isLive() ? a.seekableEnd() : t.player_.duration(), l = t.player_.bufferedEnd(), c = t.partEls_, m = os(l, u);
      t.percent_ !== m && (t.el_.style.width = m, Nr(t.percentageEl_, m), t.percent_ = m);
      for (var g = 0; g < o.length; g++) {
        var _ = o.start(g), C = o.end(g), w = c[g];
        w || (w = t.el_.appendChild(Ee()), c[g] = w), !(w.dataset.start === _ && w.dataset.end === C) && (w.dataset.start = _, w.dataset.end = C, w.style.left = os(_, l), w.style.width = os(C - _, l));
      }
      for (var E = c.length; E > o.length; E--)
        t.el_.removeChild(c[E - 1]);
      c.length = o.length;
    });
  }, r;
})(te);
te.registerComponent("LoadProgressBar", Yg);
var Qg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.update = ir(Re(ye(t), t.update), Lt), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-time-tooltip"
    }, {
      "aria-hidden": "true"
    });
  }, n.update = function(e, t, a) {
    var o = qi(this.el_), u = ii(this.player_.el()), l = e.width * t;
    if (!(!u || !o)) {
      var c = e.left - u.left + l, m = e.width - l + (u.right - e.right), g = o.width / 2;
      c < g ? g += g - c : m < g && (g = m), g < 0 ? g = 0 : g > o.width && (g = o.width), g = Math.round(g), this.el_.style.right = "-" + g + "px", this.write(a);
    }
  }, n.write = function(e) {
    Nr(this.el_, e);
  }, n.updateTime = function(e, t, a, o) {
    var u = this;
    this.requestNamedAnimationFrame("TimeTooltip#updateTime", function() {
      var l, c = u.player_.duration();
      if (u.player_.liveTracker && u.player_.liveTracker.isLive()) {
        var m = u.player_.liveTracker.liveWindow(), g = m - t * m;
        l = (g < 1 ? "" : "-") + si(g, m);
      } else
        l = si(a, c);
      u.update(e, t, l), o && o();
    });
  }, r;
})(te);
te.registerComponent("TimeTooltip", Qg);
var mo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.update = ir(Re(ye(t), t.update), Lt), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-play-progress vjs-slider-bar"
    }, {
      "aria-hidden": "true"
    });
  }, n.update = function(e, t) {
    var a = this.getChild("timeTooltip");
    if (a) {
      var o = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();
      a.updateTime(e, t, o);
    }
  }, r;
})(te);
mo.prototype.options_ = {
  children: []
};
!ht && !nr && mo.prototype.options_.children.push("timeTooltip");
te.registerComponent("PlayProgressBar", mo);
var nc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.update = ir(Re(ye(t), t.update), Lt), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-mouse-display"
    });
  }, n.update = function(e, t) {
    var a = this, o = t * this.player_.duration();
    this.getChild("timeTooltip").updateTime(e, t, o, function() {
      a.el_.style.left = e.width * t + "px";
    });
  }, r;
})(te);
nc.prototype.options_ = {
  children: ["timeTooltip"]
};
te.registerComponent("MouseTimeDisplay", nc);
var Pn = 5, vl = 12, go = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.setEventHandlers_(), t;
  }
  var n = r.prototype;
  return n.setEventHandlers_ = function() {
    var e = this;
    this.update_ = Re(this, this.update), this.update = ir(this.update_, Lt), this.on(this.player_, ["ended", "durationchange", "timeupdate"], this.update), this.player_.liveTracker && this.on(this.player_.liveTracker, "liveedgechange", this.update), this.updateInterval = null, this.enableIntervalHandler_ = function(t) {
      return e.enableInterval_(t);
    }, this.disableIntervalHandler_ = function(t) {
      return e.disableInterval_(t);
    }, this.on(this.player_, ["playing"], this.enableIntervalHandler_), this.on(this.player_, ["ended", "pause", "waiting"], this.disableIntervalHandler_), "hidden" in ae && "visibilityState" in ae && this.on(ae, "visibilitychange", this.toggleVisibility_);
  }, n.toggleVisibility_ = function(e) {
    ae.visibilityState === "hidden" ? (this.cancelNamedAnimationFrame("SeekBar#update"), this.cancelNamedAnimationFrame("Slider#update"), this.disableInterval_(e)) : (!this.player_.ended() && !this.player_.paused() && this.enableInterval_(), this.update());
  }, n.enableInterval_ = function() {
    this.updateInterval || (this.updateInterval = this.setInterval(this.update, Lt));
  }, n.disableInterval_ = function(e) {
    this.player_.liveTracker && this.player_.liveTracker.isLive() && e && e.type !== "ended" || this.updateInterval && (this.clearInterval(this.updateInterval), this.updateInterval = null);
  }, n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-progress-holder"
    }, {
      "aria-label": this.localize("Progress Bar")
    });
  }, n.update = function(e) {
    var t = this;
    if (ae.visibilityState !== "hidden") {
      var a = s.prototype.update.call(this);
      return this.requestNamedAnimationFrame("SeekBar#update", function() {
        var o = t.player_.ended() ? t.player_.duration() : t.getCurrentTime_(), u = t.player_.liveTracker, l = t.player_.duration();
        u && u.isLive() && (l = t.player_.liveTracker.liveCurrentTime()), t.percent_ !== a && (t.el_.setAttribute("aria-valuenow", (a * 100).toFixed(2)), t.percent_ = a), (t.currentTime_ !== o || t.duration_ !== l) && (t.el_.setAttribute("aria-valuetext", t.localize("progress bar timing: currentTime={1} duration={2}", [si(o, l), si(l, l)], "{1} of {2}")), t.currentTime_ = o, t.duration_ = l), t.bar && t.bar.update(ii(t.el()), t.getProgress());
      }), a;
    }
  }, n.userSeek_ = function(e) {
    this.player_.liveTracker && this.player_.liveTracker.isLive() && this.player_.liveTracker.nextSeekedFromUser(), this.player_.currentTime(e);
  }, n.getCurrentTime_ = function() {
    return this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();
  }, n.getPercent = function() {
    var e = this.getCurrentTime_(), t, a = this.player_.liveTracker;
    return a && a.isLive() ? (t = (e - a.seekableStart()) / a.liveWindow(), a.atLiveEdge() && (t = 1)) : t = e / this.player_.duration(), t;
  }, n.handleMouseDown = function(e) {
    ji(e) && (e.stopPropagation(), this.videoWasPlaying = !this.player_.paused(), this.player_.pause(), s.prototype.handleMouseDown.call(this, e));
  }, n.handleMouseMove = function(e, t) {
    if (t === void 0 && (t = !1), !!ji(e)) {
      !t && !this.player_.scrubbing() && this.player_.scrubbing(!0);
      var a, o = this.calculateDistance(e), u = this.player_.liveTracker;
      if (!u || !u.isLive())
        a = o * this.player_.duration(), a === this.player_.duration() && (a = a - 0.1);
      else {
        if (o >= 0.99) {
          u.seekToLiveEdge();
          return;
        }
        var l = u.seekableStart(), c = u.liveCurrentTime();
        if (a = l + o * u.liveWindow(), a >= c && (a = c), a <= l && (a = l + 0.1), a === 1 / 0)
          return;
      }
      this.userSeek_(a);
    }
  }, n.enable = function() {
    s.prototype.enable.call(this);
    var e = this.getChild("mouseTimeDisplay");
    e && e.show();
  }, n.disable = function() {
    s.prototype.disable.call(this);
    var e = this.getChild("mouseTimeDisplay");
    e && e.hide();
  }, n.handleMouseUp = function(e) {
    s.prototype.handleMouseUp.call(this, e), e && e.stopPropagation(), this.player_.scrubbing(!1), this.player_.trigger({
      type: "timeupdate",
      target: this,
      manuallyTriggered: !0
    }), this.videoWasPlaying ? jt(this.player_.play()) : this.update_();
  }, n.stepForward = function() {
    this.userSeek_(this.player_.currentTime() + Pn);
  }, n.stepBack = function() {
    this.userSeek_(this.player_.currentTime() - Pn);
  }, n.handleAction = function(e) {
    this.player_.paused() ? this.player_.play() : this.player_.pause();
  }, n.handleKeyDown = function(e) {
    var t = this.player_.liveTracker;
    if (_e.isEventKey(e, "Space") || _e.isEventKey(e, "Enter"))
      e.preventDefault(), e.stopPropagation(), this.handleAction(e);
    else if (_e.isEventKey(e, "Home"))
      e.preventDefault(), e.stopPropagation(), this.userSeek_(0);
    else if (_e.isEventKey(e, "End"))
      e.preventDefault(), e.stopPropagation(), t && t.isLive() ? this.userSeek_(t.liveCurrentTime()) : this.userSeek_(this.player_.duration());
    else if (/^[0-9]$/.test(_e(e))) {
      e.preventDefault(), e.stopPropagation();
      var a = (_e.codes[_e(e)] - _e.codes[0]) * 10 / 100;
      t && t.isLive() ? this.userSeek_(t.seekableStart() + t.liveWindow() * a) : this.userSeek_(this.player_.duration() * a);
    } else _e.isEventKey(e, "PgDn") ? (e.preventDefault(), e.stopPropagation(), this.userSeek_(this.player_.currentTime() - Pn * vl)) : _e.isEventKey(e, "PgUp") ? (e.preventDefault(), e.stopPropagation(), this.userSeek_(this.player_.currentTime() + Pn * vl)) : s.prototype.handleKeyDown.call(this, e);
  }, n.dispose = function() {
    this.disableInterval_(), this.off(this.player_, ["ended", "durationchange", "timeupdate"], this.update), this.player_.liveTracker && this.off(this.player_.liveTracker, "liveedgechange", this.update), this.off(this.player_, ["playing"], this.enableIntervalHandler_), this.off(this.player_, ["ended", "pause", "waiting"], this.disableIntervalHandler_), "hidden" in ae && "visibilityState" in ae && this.off(ae, "visibilitychange", this.toggleVisibility_), s.prototype.dispose.call(this);
  }, r;
})(po);
go.prototype.options_ = {
  children: ["loadProgressBar", "playProgressBar"],
  barName: "playProgressBar"
};
!ht && !nr && go.prototype.options_.children.splice(1, 0, "mouseTimeDisplay");
te.registerComponent("SeekBar", go);
var ac = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.handleMouseMove = ir(Re(ye(t), t.handleMouseMove), Lt), t.throttledHandleMouseSeek = ir(Re(ye(t), t.handleMouseSeek), Lt), t.handleMouseUpHandler_ = function(a) {
      return t.handleMouseUp(a);
    }, t.handleMouseDownHandler_ = function(a) {
      return t.handleMouseDown(a);
    }, t.enable(), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-progress-control vjs-control"
    });
  }, n.handleMouseMove = function(e) {
    var t = this.getChild("seekBar");
    if (t) {
      var a = t.getChild("playProgressBar"), o = t.getChild("mouseTimeDisplay");
      if (!(!a && !o)) {
        var u = t.el(), l = qi(u), c = ga(u, e).x;
        c = xa(c, 0, 1), o && o.update(l, c), a && a.update(l, t.getProgress());
      }
    }
  }, n.handleMouseSeek = function(e) {
    var t = this.getChild("seekBar");
    t && t.handleMouseMove(e);
  }, n.enabled = function() {
    return this.enabled_;
  }, n.disable = function() {
    if (this.children().forEach(function(t) {
      return t.disable && t.disable();
    }), !!this.enabled() && (this.off(["mousedown", "touchstart"], this.handleMouseDownHandler_), this.off(this.el_, "mousemove", this.handleMouseMove), this.removeListenersAddedOnMousedownAndTouchstart(), this.addClass("disabled"), this.enabled_ = !1, this.player_.scrubbing())) {
      var e = this.getChild("seekBar");
      this.player_.scrubbing(!1), e.videoWasPlaying && jt(this.player_.play());
    }
  }, n.enable = function() {
    this.children().forEach(function(e) {
      return e.enable && e.enable();
    }), !this.enabled() && (this.on(["mousedown", "touchstart"], this.handleMouseDownHandler_), this.on(this.el_, "mousemove", this.handleMouseMove), this.removeClass("disabled"), this.enabled_ = !0);
  }, n.removeListenersAddedOnMousedownAndTouchstart = function() {
    var e = this.el_.ownerDocument;
    this.off(e, "mousemove", this.throttledHandleMouseSeek), this.off(e, "touchmove", this.throttledHandleMouseSeek), this.off(e, "mouseup", this.handleMouseUpHandler_), this.off(e, "touchend", this.handleMouseUpHandler_);
  }, n.handleMouseDown = function(e) {
    var t = this.el_.ownerDocument, a = this.getChild("seekBar");
    a && a.handleMouseDown(e), this.on(t, "mousemove", this.throttledHandleMouseSeek), this.on(t, "touchmove", this.throttledHandleMouseSeek), this.on(t, "mouseup", this.handleMouseUpHandler_), this.on(t, "touchend", this.handleMouseUpHandler_);
  }, n.handleMouseUp = function(e) {
    var t = this.getChild("seekBar");
    t && t.handleMouseUp(e), this.removeListenersAddedOnMousedownAndTouchstart();
  }, r;
})(te);
ac.prototype.options_ = {
  children: ["seekBar"]
};
te.registerComponent("ProgressControl", ac);
var sc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.on(i, ["enterpictureinpicture", "leavepictureinpicture"], function(a) {
      return t.handlePictureInPictureChange(a);
    }), t.on(i, ["disablepictureinpicturechanged", "loadedmetadata"], function(a) {
      return t.handlePictureInPictureEnabledChange(a);
    }), t.on(i, ["loadedmetadata", "audioonlymodechange", "audiopostermodechange"], function() {
      var a = i.currentType().substring(0, 5) === "audio";
      a || i.audioPosterMode() || i.audioOnlyMode() ? (i.isInPictureInPicture() && i.exitPictureInPicture(), t.hide()) : t.show();
    }), t.disable(), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-picture-in-picture-control " + s.prototype.buildCSSClass.call(this);
  }, n.handlePictureInPictureEnabledChange = function() {
    ae.pictureInPictureEnabled && this.player_.disablePictureInPicture() === !1 ? this.enable() : this.disable();
  }, n.handlePictureInPictureChange = function(e) {
    this.player_.isInPictureInPicture() ? this.controlText("Exit Picture-in-Picture") : this.controlText("Picture-in-Picture"), this.handlePictureInPictureEnabledChange();
  }, n.handleClick = function(e) {
    this.player_.isInPictureInPicture() ? this.player_.exitPictureInPicture() : this.player_.requestPictureInPicture();
  }, r;
})(It);
sc.prototype.controlText_ = "Picture-in-Picture";
te.registerComponent("PictureInPictureToggle", sc);
var oc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.on(i, "fullscreenchange", function(a) {
      return t.handleFullscreenChange(a);
    }), ae[i.fsApi_.fullscreenEnabled] === !1 && t.disable(), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-fullscreen-control " + s.prototype.buildCSSClass.call(this);
  }, n.handleFullscreenChange = function(e) {
    this.player_.isFullscreen() ? this.controlText("Non-Fullscreen") : this.controlText("Fullscreen");
  }, n.handleClick = function(e) {
    this.player_.isFullscreen() ? this.player_.exitFullscreen() : this.player_.requestFullscreen();
  }, r;
})(It);
oc.prototype.controlText_ = "Fullscreen";
te.registerComponent("FullscreenToggle", oc);
var Jg = function(r, n) {
  n.tech_ && !n.tech_.featuresVolumeControl && r.addClass("vjs-hidden"), r.on(n, "loadstart", function() {
    n.tech_.featuresVolumeControl ? r.removeClass("vjs-hidden") : r.addClass("vjs-hidden");
  });
}, Zg = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = s.prototype.createEl.call(this, "div", {
      className: "vjs-volume-level"
    });
    return e.appendChild(s.prototype.createEl.call(this, "span", {
      className: "vjs-control-text"
    })), e;
  }, r;
})(te);
te.registerComponent("VolumeLevel", Zg);
var ev = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.update = ir(Re(ye(t), t.update), Lt), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-volume-tooltip"
    }, {
      "aria-hidden": "true"
    });
  }, n.update = function(e, t, a, o) {
    if (!a) {
      var u = ii(this.el_), l = ii(this.player_.el()), c = e.width * t;
      if (!l || !u)
        return;
      var m = e.left - l.left + c, g = e.width - c + (l.right - e.right), _ = u.width / 2;
      m < _ ? _ += _ - m : g < _ && (_ = g), _ < 0 ? _ = 0 : _ > u.width && (_ = u.width), this.el_.style.right = "-" + _ + "px";
    }
    this.write(o + "%");
  }, n.write = function(e) {
    Nr(this.el_, e);
  }, n.updateVolume = function(e, t, a, o, u) {
    var l = this;
    this.requestNamedAnimationFrame("VolumeLevelTooltip#updateVolume", function() {
      l.update(e, t, a, o.toFixed(0)), u && u();
    });
  }, r;
})(te);
te.registerComponent("VolumeLevelTooltip", ev);
var uc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.update = ir(Re(ye(t), t.update), Lt), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-mouse-display"
    });
  }, n.update = function(e, t, a) {
    var o = this, u = 100 * t;
    this.getChild("volumeLevelTooltip").updateVolume(e, t, a, u, function() {
      a ? o.el_.style.bottom = e.height * t + "px" : o.el_.style.left = e.width * t + "px";
    });
  }, r;
})(te);
uc.prototype.options_ = {
  children: ["volumeLevelTooltip"]
};
te.registerComponent("MouseVolumeLevelDisplay", uc);
var Sa = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.on("slideractive", function(a) {
      return t.updateLastVolume_(a);
    }), t.on(i, "volumechange", function(a) {
      return t.updateARIAAttributes(a);
    }), i.ready(function() {
      return t.updateARIAAttributes();
    }), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-volume-bar vjs-slider-bar"
    }, {
      "aria-label": this.localize("Volume Level"),
      "aria-live": "polite"
    });
  }, n.handleMouseDown = function(e) {
    ji(e) && s.prototype.handleMouseDown.call(this, e);
  }, n.handleMouseMove = function(e) {
    var t = this.getChild("mouseVolumeLevelDisplay");
    if (t) {
      var a = this.el(), o = ii(a), u = this.vertical(), l = ga(a, e);
      l = u ? l.y : l.x, l = xa(l, 0, 1), t.update(o, l, u);
    }
    ji(e) && (this.checkMuted(), this.player_.volume(this.calculateDistance(e)));
  }, n.checkMuted = function() {
    this.player_.muted() && this.player_.muted(!1);
  }, n.getPercent = function() {
    return this.player_.muted() ? 0 : this.player_.volume();
  }, n.stepForward = function() {
    this.checkMuted(), this.player_.volume(this.player_.volume() + 0.1);
  }, n.stepBack = function() {
    this.checkMuted(), this.player_.volume(this.player_.volume() - 0.1);
  }, n.updateARIAAttributes = function(e) {
    var t = this.player_.muted() ? 0 : this.volumeAsPercentage_();
    this.el_.setAttribute("aria-valuenow", t), this.el_.setAttribute("aria-valuetext", t + "%");
  }, n.volumeAsPercentage_ = function() {
    return Math.round(this.player_.volume() * 100);
  }, n.updateLastVolume_ = function() {
    var e = this, t = this.player_.volume();
    this.one("sliderinactive", function() {
      e.player_.volume() === 0 && e.player_.lastVolume_(t);
    });
  }, r;
})(po);
Sa.prototype.options_ = {
  children: ["volumeLevel"],
  barName: "volumeLevel"
};
!ht && !nr && Sa.prototype.options_.children.splice(0, 0, "mouseVolumeLevelDisplay");
Sa.prototype.playerEvent = "volumechange";
te.registerComponent("VolumeBar", Sa);
var lc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e === void 0 && (e = {}), e.vertical = e.vertical || !1, (typeof e.volumeBar > "u" || Ui(e.volumeBar)) && (e.volumeBar = e.volumeBar || {}, e.volumeBar.vertical = e.vertical), t = s.call(this, i, e) || this, Jg(ye(t), i), t.throttledHandleMouseMove = ir(Re(ye(t), t.handleMouseMove), Lt), t.handleMouseUpHandler_ = function(a) {
      return t.handleMouseUp(a);
    }, t.on("mousedown", function(a) {
      return t.handleMouseDown(a);
    }), t.on("touchstart", function(a) {
      return t.handleMouseDown(a);
    }), t.on("mousemove", function(a) {
      return t.handleMouseMove(a);
    }), t.on(t.volumeBar, ["focus", "slideractive"], function() {
      t.volumeBar.addClass("vjs-slider-active"), t.addClass("vjs-slider-active"), t.trigger("slideractive");
    }), t.on(t.volumeBar, ["blur", "sliderinactive"], function() {
      t.volumeBar.removeClass("vjs-slider-active"), t.removeClass("vjs-slider-active"), t.trigger("sliderinactive");
    }), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = "vjs-volume-horizontal";
    return this.options_.vertical && (e = "vjs-volume-vertical"), s.prototype.createEl.call(this, "div", {
      className: "vjs-volume-control vjs-control " + e
    });
  }, n.handleMouseDown = function(e) {
    var t = this.el_.ownerDocument;
    this.on(t, "mousemove", this.throttledHandleMouseMove), this.on(t, "touchmove", this.throttledHandleMouseMove), this.on(t, "mouseup", this.handleMouseUpHandler_), this.on(t, "touchend", this.handleMouseUpHandler_);
  }, n.handleMouseUp = function(e) {
    var t = this.el_.ownerDocument;
    this.off(t, "mousemove", this.throttledHandleMouseMove), this.off(t, "touchmove", this.throttledHandleMouseMove), this.off(t, "mouseup", this.handleMouseUpHandler_), this.off(t, "touchend", this.handleMouseUpHandler_);
  }, n.handleMouseMove = function(e) {
    this.volumeBar.handleMouseMove(e);
  }, r;
})(te);
lc.prototype.options_ = {
  children: ["volumeBar"]
};
te.registerComponent("VolumeControl", lc);
var tv = function(r, n) {
  n.tech_ && !n.tech_.featuresMuteControl && r.addClass("vjs-hidden"), r.on(n, "loadstart", function() {
    n.tech_.featuresMuteControl ? r.removeClass("vjs-hidden") : r.addClass("vjs-hidden");
  });
}, dc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, tv(ye(t), i), t.on(i, ["loadstart", "volumechange"], function(a) {
      return t.update(a);
    }), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-mute-control " + s.prototype.buildCSSClass.call(this);
  }, n.handleClick = function(e) {
    var t = this.player_.volume(), a = this.player_.lastVolume_();
    if (t === 0) {
      var o = a < 0.1 ? 0.1 : a;
      this.player_.volume(o), this.player_.muted(!1);
    } else
      this.player_.muted(!this.player_.muted());
  }, n.update = function(e) {
    this.updateIcon_(), this.updateControlText_();
  }, n.updateIcon_ = function() {
    var e = this.player_.volume(), t = 3;
    ht && this.player_.tech_ && this.player_.tech_.el_ && this.player_.muted(this.player_.tech_.el_.muted), e === 0 || this.player_.muted() ? t = 0 : e < 0.33 ? t = 1 : e < 0.67 && (t = 2);
    for (var a = 0; a < 4; a++)
      Ki(this.el_, "vjs-vol-" + a);
    er(this.el_, "vjs-vol-" + t);
  }, n.updateControlText_ = function() {
    var e = this.player_.muted() || this.player_.volume() === 0, t = e ? "Unmute" : "Mute";
    this.controlText() !== t && this.controlText(t);
  }, r;
})(It);
dc.prototype.controlText_ = "Mute";
te.registerComponent("MuteToggle", dc);
var cc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e === void 0 && (e = {}), typeof e.inline < "u" ? e.inline = e.inline : e.inline = !0, (typeof e.volumeControl > "u" || Ui(e.volumeControl)) && (e.volumeControl = e.volumeControl || {}, e.volumeControl.vertical = !e.inline), t = s.call(this, i, e) || this, t.handleKeyPressHandler_ = function(a) {
      return t.handleKeyPress(a);
    }, t.on(i, ["loadstart"], function(a) {
      return t.volumePanelState_(a);
    }), t.on(t.muteToggle, "keyup", function(a) {
      return t.handleKeyPress(a);
    }), t.on(t.volumeControl, "keyup", function(a) {
      return t.handleVolumeControlKeyUp(a);
    }), t.on("keydown", function(a) {
      return t.handleKeyPress(a);
    }), t.on("mouseover", function(a) {
      return t.handleMouseOver(a);
    }), t.on("mouseout", function(a) {
      return t.handleMouseOut(a);
    }), t.on(t.volumeControl, ["slideractive"], t.sliderActive_), t.on(t.volumeControl, ["sliderinactive"], t.sliderInactive_), t;
  }
  var n = r.prototype;
  return n.sliderActive_ = function() {
    this.addClass("vjs-slider-active");
  }, n.sliderInactive_ = function() {
    this.removeClass("vjs-slider-active");
  }, n.volumePanelState_ = function() {
    this.volumeControl.hasClass("vjs-hidden") && this.muteToggle.hasClass("vjs-hidden") && this.addClass("vjs-hidden"), this.volumeControl.hasClass("vjs-hidden") && !this.muteToggle.hasClass("vjs-hidden") && this.addClass("vjs-mute-toggle-only");
  }, n.createEl = function() {
    var e = "vjs-volume-panel-horizontal";
    return this.options_.inline || (e = "vjs-volume-panel-vertical"), s.prototype.createEl.call(this, "div", {
      className: "vjs-volume-panel vjs-control " + e
    });
  }, n.dispose = function() {
    this.handleMouseOut(), s.prototype.dispose.call(this);
  }, n.handleVolumeControlKeyUp = function(e) {
    _e.isEventKey(e, "Esc") && this.muteToggle.focus();
  }, n.handleMouseOver = function(e) {
    this.addClass("vjs-hover"), xt(ae, "keyup", this.handleKeyPressHandler_);
  }, n.handleMouseOut = function(e) {
    this.removeClass("vjs-hover"), at(ae, "keyup", this.handleKeyPressHandler_);
  }, n.handleKeyPress = function(e) {
    _e.isEventKey(e, "Esc") && this.handleMouseOut();
  }, r;
})(te);
cc.prototype.options_ = {
  children: ["muteToggle", "volumeControl"]
};
te.registerComponent("VolumePanel", cc);
var fc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, e && (t.menuButton_ = e.menuButton), t.focusedChild_ = -1, t.on("keydown", function(a) {
      return t.handleKeyDown(a);
    }), t.boundHandleBlur_ = function(a) {
      return t.handleBlur(a);
    }, t.boundHandleTapClick_ = function(a) {
      return t.handleTapClick(a);
    }, t;
  }
  var n = r.prototype;
  return n.addEventListenerForItem = function(e) {
    e instanceof te && (this.on(e, "blur", this.boundHandleBlur_), this.on(e, ["tap", "click"], this.boundHandleTapClick_));
  }, n.removeEventListenerForItem = function(e) {
    e instanceof te && (this.off(e, "blur", this.boundHandleBlur_), this.off(e, ["tap", "click"], this.boundHandleTapClick_));
  }, n.removeChild = function(e) {
    typeof e == "string" && (e = this.getChild(e)), this.removeEventListenerForItem(e), s.prototype.removeChild.call(this, e);
  }, n.addItem = function(e) {
    var t = this.addChild(e);
    t && this.addEventListenerForItem(t);
  }, n.createEl = function() {
    var e = this.options_.contentElType || "ul";
    this.contentEl_ = Ee(e, {
      className: "vjs-menu-content"
    }), this.contentEl_.setAttribute("role", "menu");
    var t = s.prototype.createEl.call(this, "div", {
      append: this.contentEl_,
      className: "vjs-menu"
    });
    return t.appendChild(this.contentEl_), xt(t, "click", function(a) {
      a.preventDefault(), a.stopImmediatePropagation();
    }), t;
  }, n.dispose = function() {
    this.contentEl_ = null, this.boundHandleBlur_ = null, this.boundHandleTapClick_ = null, s.prototype.dispose.call(this);
  }, n.handleBlur = function(e) {
    var t = e.relatedTarget || ae.activeElement;
    if (!this.children().some(function(o) {
      return o.el() === t;
    })) {
      var a = this.menuButton_;
      a && a.buttonPressed_ && t !== a.el().firstChild && a.unpressButton();
    }
  }, n.handleTapClick = function(e) {
    if (this.menuButton_) {
      this.menuButton_.unpressButton();
      var t = this.children();
      if (!Array.isArray(t))
        return;
      var a = t.filter(function(o) {
        return o.el() === e.target;
      })[0];
      if (!a)
        return;
      a.name() !== "CaptionSettingsMenuItem" && this.menuButton_.focus();
    }
  }, n.handleKeyDown = function(e) {
    _e.isEventKey(e, "Left") || _e.isEventKey(e, "Down") ? (e.preventDefault(), e.stopPropagation(), this.stepForward()) : (_e.isEventKey(e, "Right") || _e.isEventKey(e, "Up")) && (e.preventDefault(), e.stopPropagation(), this.stepBack());
  }, n.stepForward = function() {
    var e = 0;
    this.focusedChild_ !== void 0 && (e = this.focusedChild_ + 1), this.focus(e);
  }, n.stepBack = function() {
    var e = 0;
    this.focusedChild_ !== void 0 && (e = this.focusedChild_ - 1), this.focus(e);
  }, n.focus = function(e) {
    e === void 0 && (e = 0);
    var t = this.children().slice(), a = t.length && t[0].hasClass("vjs-menu-title");
    a && t.shift(), t.length > 0 && (e < 0 ? e = 0 : e >= t.length && (e = t.length - 1), this.focusedChild_ = e, t[e].el_.focus());
  }, r;
})(te);
te.registerComponent("Menu", fc);
var vo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    e === void 0 && (e = {}), t = s.call(this, i, e) || this, t.menuButton_ = new It(i, e), t.menuButton_.controlText(t.controlText_), t.menuButton_.el_.setAttribute("aria-haspopup", "true");
    var a = It.prototype.buildCSSClass();
    t.menuButton_.el_.className = t.buildCSSClass() + " " + a, t.menuButton_.removeClass("vjs-control"), t.addChild(t.menuButton_), t.update(), t.enabled_ = !0;
    var o = function(l) {
      return t.handleClick(l);
    };
    return t.handleMenuKeyUp_ = function(u) {
      return t.handleMenuKeyUp(u);
    }, t.on(t.menuButton_, "tap", o), t.on(t.menuButton_, "click", o), t.on(t.menuButton_, "keydown", function(u) {
      return t.handleKeyDown(u);
    }), t.on(t.menuButton_, "mouseenter", function() {
      t.addClass("vjs-hover"), t.menu.show(), xt(ae, "keyup", t.handleMenuKeyUp_);
    }), t.on("mouseleave", function(u) {
      return t.handleMouseLeave(u);
    }), t.on("keydown", function(u) {
      return t.handleSubmenuKeyDown(u);
    }), t;
  }
  var n = r.prototype;
  return n.update = function() {
    var e = this.createMenu();
    this.menu && (this.menu.dispose(), this.removeChild(this.menu)), this.menu = e, this.addChild(e), this.buttonPressed_ = !1, this.menuButton_.el_.setAttribute("aria-expanded", "false"), this.items && this.items.length <= this.hideThreshold_ ? (this.hide(), this.menu.contentEl_.removeAttribute("role")) : (this.show(), this.menu.contentEl_.setAttribute("role", "menu"));
  }, n.createMenu = function() {
    var e = new fc(this.player_, {
      menuButton: this
    });
    if (this.hideThreshold_ = 0, this.options_.title) {
      var t = Ee("li", {
        className: "vjs-menu-title",
        textContent: Ge(this.options_.title),
        tabIndex: -1
      }), a = new te(this.player_, {
        el: t
      });
      e.addItem(a);
    }
    if (this.items = this.createItems(), this.items)
      for (var o = 0; o < this.items.length; o++)
        e.addItem(this.items[o]);
    return e;
  }, n.createItems = function() {
  }, n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: this.buildWrapperCSSClass()
    }, {});
  }, n.buildWrapperCSSClass = function() {
    var e = "vjs-menu-button";
    this.options_.inline === !0 ? e += "-inline" : e += "-popup";
    var t = It.prototype.buildCSSClass();
    return "vjs-menu-button " + e + " " + t + " " + s.prototype.buildCSSClass.call(this);
  }, n.buildCSSClass = function() {
    var e = "vjs-menu-button";
    return this.options_.inline === !0 ? e += "-inline" : e += "-popup", "vjs-menu-button " + e + " " + s.prototype.buildCSSClass.call(this);
  }, n.controlText = function(e, t) {
    return t === void 0 && (t = this.menuButton_.el()), this.menuButton_.controlText(e, t);
  }, n.dispose = function() {
    this.handleMouseLeave(), s.prototype.dispose.call(this);
  }, n.handleClick = function(e) {
    this.buttonPressed_ ? this.unpressButton() : this.pressButton();
  }, n.handleMouseLeave = function(e) {
    this.removeClass("vjs-hover"), at(ae, "keyup", this.handleMenuKeyUp_);
  }, n.focus = function() {
    this.menuButton_.focus();
  }, n.blur = function() {
    this.menuButton_.blur();
  }, n.handleKeyDown = function(e) {
    _e.isEventKey(e, "Esc") || _e.isEventKey(e, "Tab") ? (this.buttonPressed_ && this.unpressButton(), _e.isEventKey(e, "Tab") || (e.preventDefault(), this.menuButton_.focus())) : (_e.isEventKey(e, "Up") || _e.isEventKey(e, "Down")) && (this.buttonPressed_ || (e.preventDefault(), this.pressButton()));
  }, n.handleMenuKeyUp = function(e) {
    (_e.isEventKey(e, "Esc") || _e.isEventKey(e, "Tab")) && this.removeClass("vjs-hover");
  }, n.handleSubmenuKeyPress = function(e) {
    this.handleSubmenuKeyDown(e);
  }, n.handleSubmenuKeyDown = function(e) {
    (_e.isEventKey(e, "Esc") || _e.isEventKey(e, "Tab")) && (this.buttonPressed_ && this.unpressButton(), _e.isEventKey(e, "Tab") || (e.preventDefault(), this.menuButton_.focus()));
  }, n.pressButton = function() {
    if (this.enabled_) {
      if (this.buttonPressed_ = !0, this.menu.show(), this.menu.lockShowing(), this.menuButton_.el_.setAttribute("aria-expanded", "true"), ht && Dd())
        return;
      this.menu.focus();
    }
  }, n.unpressButton = function() {
    this.enabled_ && (this.buttonPressed_ = !1, this.menu.unlockShowing(), this.menu.hide(), this.menuButton_.el_.setAttribute("aria-expanded", "false"));
  }, n.disable = function() {
    this.unpressButton(), this.enabled_ = !1, this.addClass("vjs-disabled"), this.menuButton_.disable();
  }, n.enable = function() {
    this.enabled_ = !0, this.removeClass("vjs-disabled"), this.menuButton_.enable();
  }, r;
})(te);
te.registerComponent("MenuButton", vo);
var yo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(n, i) {
    var e, t = i.tracks;
    if (e = s.call(this, n, i) || this, e.items.length <= 1 && e.hide(), !t)
      return ye(e);
    var a = Re(ye(e), e.update);
    return t.addEventListener("removetrack", a), t.addEventListener("addtrack", a), t.addEventListener("labelchange", a), e.player_.on("ready", a), e.player_.on("dispose", function() {
      t.removeEventListener("removetrack", a), t.removeEventListener("addtrack", a), t.removeEventListener("labelchange", a);
    }), e;
  }
  return r;
})(vo);
te.registerComponent("TrackButton", yo);
var rv = ["Tab", "Esc", "Up", "Down", "Right", "Left"], Xi = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.selectable = e.selectable, t.isSelected_ = e.selected || !1, t.multiSelectable = e.multiSelectable, t.selected(t.isSelected_), t.selectable ? t.multiSelectable ? t.el_.setAttribute("role", "menuitemcheckbox") : t.el_.setAttribute("role", "menuitemradio") : t.el_.setAttribute("role", "menuitem"), t;
  }
  var n = r.prototype;
  return n.createEl = function(e, t, a) {
    this.nonIconControl = !0;
    var o = s.prototype.createEl.call(this, "li", Ue({
      className: "vjs-menu-item",
      tabIndex: -1
    }, t), a);
    return o.replaceChild(Ee("span", {
      className: "vjs-menu-item-text",
      textContent: this.localize(this.options_.label)
    }), o.querySelector(".vjs-icon-placeholder")), o;
  }, n.handleKeyDown = function(e) {
    rv.some(function(t) {
      return _e.isEventKey(e, t);
    }) || s.prototype.handleKeyDown.call(this, e);
  }, n.handleClick = function(e) {
    this.selected(!0);
  }, n.selected = function(e) {
    this.selectable && (e ? (this.addClass("vjs-selected"), this.el_.setAttribute("aria-checked", "true"), this.controlText(", selected"), this.isSelected_ = !0) : (this.removeClass("vjs-selected"), this.el_.setAttribute("aria-checked", "false"), this.controlText(""), this.isSelected_ = !1));
  }, r;
})(ba);
te.registerComponent("MenuItem", Xi);
var Yi = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t, a = e.track, o = i.textTracks();
    e.label = a.label || a.language || "Unknown", e.selected = a.mode === "showing", t = s.call(this, i, e) || this, t.track = a, t.kinds = (e.kinds || [e.kind || t.track.kind]).filter(Boolean);
    var u = function() {
      for (var g = arguments.length, _ = new Array(g), C = 0; C < g; C++)
        _[C] = arguments[C];
      t.handleTracksChange.apply(ye(t), _);
    }, l = function() {
      for (var g = arguments.length, _ = new Array(g), C = 0; C < g; C++)
        _[C] = arguments[C];
      t.handleSelectedLanguageChange.apply(ye(t), _);
    };
    if (i.on(["loadstart", "texttrackchange"], u), o.addEventListener("change", u), o.addEventListener("selectedlanguagechange", l), t.on("dispose", function() {
      i.off(["loadstart", "texttrackchange"], u), o.removeEventListener("change", u), o.removeEventListener("selectedlanguagechange", l);
    }), o.onchange === void 0) {
      var c;
      t.on(["tap", "click"], function() {
        if (typeof P.Event != "object")
          try {
            c = new P.Event("change");
          } catch {
          }
        c || (c = ae.createEvent("Event"), c.initEvent("change", !0, !0)), o.dispatchEvent(c);
      });
    }
    return t.handleTracksChange(), t;
  }
  var n = r.prototype;
  return n.handleClick = function(e) {
    var t = this.track, a = this.player_.textTracks();
    if (s.prototype.handleClick.call(this, e), !!a)
      for (var o = 0; o < a.length; o++) {
        var u = a[o];
        this.kinds.indexOf(u.kind) !== -1 && (u === t ? u.mode !== "showing" && (u.mode = "showing") : u.mode !== "disabled" && (u.mode = "disabled"));
      }
  }, n.handleTracksChange = function(e) {
    var t = this.track.mode === "showing";
    t !== this.isSelected_ && this.selected(t);
  }, n.handleSelectedLanguageChange = function(e) {
    if (this.track.mode === "showing") {
      var t = this.player_.cache_.selectedLanguage;
      if (t && t.enabled && t.language === this.track.language && t.kind !== this.track.kind)
        return;
      this.player_.cache_.selectedLanguage = {
        enabled: !0,
        language: this.track.language,
        kind: this.track.kind
      };
    }
  }, n.dispose = function() {
    this.track = null, s.prototype.dispose.call(this);
  }, r;
})(Xi);
te.registerComponent("TextTrackMenuItem", Yi);
var hc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    return e.track = {
      player: i,
      // it is no longer necessary to store `kind` or `kinds` on the track itself
      // since they are now stored in the `kinds` property of all instances of
      // TextTrackMenuItem, but this will remain for backwards compatibility
      kind: e.kind,
      kinds: e.kinds,
      default: !1,
      mode: "disabled"
    }, e.kinds || (e.kinds = [e.kind]), e.label ? e.track.label = e.label : e.track.label = e.kinds.join(" and ") + " off", e.selectable = !0, e.multiSelectable = !1, s.call(this, i, e) || this;
  }
  var n = r.prototype;
  return n.handleTracksChange = function(e) {
    for (var t = this.player().textTracks(), a = !0, o = 0, u = t.length; o < u; o++) {
      var l = t[o];
      if (this.options_.kinds.indexOf(l.kind) > -1 && l.mode === "showing") {
        a = !1;
        break;
      }
    }
    a !== this.isSelected_ && this.selected(a);
  }, n.handleSelectedLanguageChange = function(e) {
    for (var t = this.player().textTracks(), a = !0, o = 0, u = t.length; o < u; o++) {
      var l = t[o];
      if (["captions", "descriptions", "subtitles"].indexOf(l.kind) > -1 && l.mode === "showing") {
        a = !1;
        break;
      }
    }
    a && (this.player_.cache_.selectedLanguage = {
      enabled: !1
    });
  }, r;
})(Yi);
te.registerComponent("OffTextTrackMenuItem", hc);
var hi = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    return e === void 0 && (e = {}), e.tracks = i.textTracks(), s.call(this, i, e) || this;
  }
  var n = r.prototype;
  return n.createItems = function(e, t) {
    e === void 0 && (e = []), t === void 0 && (t = Yi);
    var a;
    this.label_ && (a = this.label_ + " off"), e.push(new hc(this.player_, {
      kinds: this.kinds_,
      kind: this.kind_,
      label: a
    })), this.hideThreshold_ += 1;
    var o = this.player_.textTracks();
    Array.isArray(this.kinds_) || (this.kinds_ = [this.kind_]);
    for (var u = 0; u < o.length; u++) {
      var l = o[u];
      if (this.kinds_.indexOf(l.kind) > -1) {
        var c = new t(this.player_, {
          track: l,
          kinds: this.kinds_,
          kind: this.kind_,
          // MenuItem is selectable
          selectable: !0,
          // MenuItem is NOT multiSelectable (i.e. only one can be marked "selected" at a time)
          multiSelectable: !1
        });
        c.addClass("vjs-" + l.kind + "-menu-item"), e.push(c);
      }
    }
    return e;
  }, r;
})(yo);
te.registerComponent("TextTrackButton", hi);
var pc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t, a = e.track, o = e.cue, u = i.currentTime();
    return e.selectable = !0, e.multiSelectable = !1, e.label = o.text, e.selected = o.startTime <= u && u < o.endTime, t = s.call(this, i, e) || this, t.track = a, t.cue = o, t;
  }
  var n = r.prototype;
  return n.handleClick = function(e) {
    s.prototype.handleClick.call(this), this.player_.currentTime(this.cue.startTime);
  }, r;
})(Xi);
te.registerComponent("ChaptersTrackMenuItem", pc);
var _o = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    var a;
    return a = s.call(this, i, e, t) || this, a.selectCurrentItem_ = function() {
      a.items.forEach(function(o) {
        o.selected(a.track_.activeCues[0] === o.cue);
      });
    }, a;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-chapters-button " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-chapters-button " + s.prototype.buildWrapperCSSClass.call(this);
  }, n.update = function(e) {
    if (!(e && e.track && e.track.kind !== "chapters")) {
      var t = this.findChaptersTrack();
      t !== this.track_ ? (this.setTrack(t), s.prototype.update.call(this)) : (!this.items || t && t.cues && t.cues.length !== this.items.length) && s.prototype.update.call(this);
    }
  }, n.setTrack = function(e) {
    if (this.track_ !== e) {
      if (this.updateHandler_ || (this.updateHandler_ = this.update.bind(this)), this.track_) {
        var t = this.player_.remoteTextTrackEls().getTrackElementByTrack_(this.track_);
        t && t.removeEventListener("load", this.updateHandler_), this.track_.removeEventListener("cuechange", this.selectCurrentItem_), this.track_ = null;
      }
      if (this.track_ = e, this.track_) {
        this.track_.mode = "hidden";
        var a = this.player_.remoteTextTrackEls().getTrackElementByTrack_(this.track_);
        a && a.addEventListener("load", this.updateHandler_), this.track_.addEventListener("cuechange", this.selectCurrentItem_);
      }
    }
  }, n.findChaptersTrack = function() {
    for (var e = this.player_.textTracks() || [], t = e.length - 1; t >= 0; t--) {
      var a = e[t];
      if (a.kind === this.kind_)
        return a;
    }
  }, n.getMenuCaption = function() {
    return this.track_ && this.track_.label ? this.track_.label : this.localize(Ge(this.kind_));
  }, n.createMenu = function() {
    return this.options_.title = this.getMenuCaption(), s.prototype.createMenu.call(this);
  }, n.createItems = function() {
    var e = [];
    if (!this.track_)
      return e;
    var t = this.track_.cues;
    if (!t)
      return e;
    for (var a = 0, o = t.length; a < o; a++) {
      var u = t[a], l = new pc(this.player_, {
        track: this.track_,
        cue: u
      });
      e.push(l);
    }
    return e;
  }, r;
})(hi);
_o.prototype.kind_ = "chapters";
_o.prototype.controlText_ = "Chapters";
te.registerComponent("ChaptersButton", _o);
var To = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    var a;
    a = s.call(this, i, e, t) || this;
    var o = i.textTracks(), u = Re(ye(a), a.handleTracksChange);
    return o.addEventListener("change", u), a.on("dispose", function() {
      o.removeEventListener("change", u);
    }), a;
  }
  var n = r.prototype;
  return n.handleTracksChange = function(e) {
    for (var t = this.player().textTracks(), a = !1, o = 0, u = t.length; o < u; o++) {
      var l = t[o];
      if (l.kind !== this.kind_ && l.mode === "showing") {
        a = !0;
        break;
      }
    }
    a ? this.disable() : this.enable();
  }, n.buildCSSClass = function() {
    return "vjs-descriptions-button " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-descriptions-button " + s.prototype.buildWrapperCSSClass.call(this);
  }, r;
})(hi);
To.prototype.kind_ = "descriptions";
To.prototype.controlText_ = "Descriptions";
te.registerComponent("DescriptionsButton", To);
var bo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    return s.call(this, i, e, t) || this;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-subtitles-button " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-subtitles-button " + s.prototype.buildWrapperCSSClass.call(this);
  }, r;
})(hi);
bo.prototype.kind_ = "subtitles";
bo.prototype.controlText_ = "Subtitles";
te.registerComponent("SubtitlesButton", bo);
var xo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e.track = {
      player: i,
      kind: e.kind,
      label: e.kind + " settings",
      selectable: !1,
      default: !1,
      mode: "disabled"
    }, e.selectable = !1, e.name = "CaptionSettingsMenuItem", t = s.call(this, i, e) || this, t.addClass("vjs-texttrack-settings"), t.controlText(", opens " + e.kind + " settings dialog"), t;
  }
  var n = r.prototype;
  return n.handleClick = function(e) {
    this.player().getChild("textTrackSettings").open();
  }, r;
})(Yi);
te.registerComponent("CaptionSettingsMenuItem", xo);
var So = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    return s.call(this, i, e, t) || this;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-captions-button " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-captions-button " + s.prototype.buildWrapperCSSClass.call(this);
  }, n.createItems = function() {
    var e = [];
    return !(this.player().tech_ && this.player().tech_.featuresNativeTextTracks) && this.player().getChild("textTrackSettings") && (e.push(new xo(this.player_, {
      kind: this.kind_
    })), this.hideThreshold_ += 1), s.prototype.createItems.call(this, e);
  }, r;
})(hi);
So.prototype.kind_ = "captions";
So.prototype.controlText_ = "Captions";
te.registerComponent("CaptionsButton", So);
var mc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.createEl = function(e, t, a) {
    var o = s.prototype.createEl.call(this, e, t, a), u = o.querySelector(".vjs-menu-item-text");
    return this.options_.track.kind === "captions" && (u.appendChild(Ee("span", {
      className: "vjs-icon-placeholder"
    }, {
      "aria-hidden": !0
    })), u.appendChild(Ee("span", {
      className: "vjs-control-text",
      // space added as the text will visually flow with the
      // label
      textContent: " " + this.localize("Captions")
    }))), o;
  }, r;
})(Yi);
te.registerComponent("SubsCapsMenuItem", mc);
var Eo = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e === void 0 && (e = {}), t = s.call(this, i, e) || this, t.label_ = "subtitles", ["en", "en-us", "en-ca", "fr-ca"].indexOf(t.player_.language_) > -1 && (t.label_ = "captions"), t.menuButton_.controlText(Ge(t.label_)), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-subs-caps-button " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-subs-caps-button " + s.prototype.buildWrapperCSSClass.call(this);
  }, n.createItems = function() {
    var e = [];
    return !(this.player().tech_ && this.player().tech_.featuresNativeTextTracks) && this.player().getChild("textTrackSettings") && (e.push(new xo(this.player_, {
      kind: this.label_
    })), this.hideThreshold_ += 1), e = s.prototype.createItems.call(this, e, mc), e;
  }, r;
})(hi);
Eo.prototype.kinds_ = ["captions", "subtitles"];
Eo.prototype.controlText_ = "Subtitles";
te.registerComponent("SubsCapsButton", Eo);
var gc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t, a = e.track, o = i.audioTracks();
    e.label = a.label || a.language || "Unknown", e.selected = a.enabled, t = s.call(this, i, e) || this, t.track = a, t.addClass("vjs-" + a.kind + "-menu-item");
    var u = function() {
      for (var c = arguments.length, m = new Array(c), g = 0; g < c; g++)
        m[g] = arguments[g];
      t.handleTracksChange.apply(ye(t), m);
    };
    return o.addEventListener("change", u), t.on("dispose", function() {
      o.removeEventListener("change", u);
    }), t;
  }
  var n = r.prototype;
  return n.createEl = function(e, t, a) {
    var o = s.prototype.createEl.call(this, e, t, a), u = o.querySelector(".vjs-menu-item-text");
    return this.options_.track.kind === "main-desc" && (u.appendChild(Ee("span", {
      className: "vjs-icon-placeholder"
    }, {
      "aria-hidden": !0
    })), u.appendChild(Ee("span", {
      className: "vjs-control-text",
      textContent: " " + this.localize("Descriptions")
    }))), o;
  }, n.handleClick = function(e) {
    if (s.prototype.handleClick.call(this, e), this.track.enabled = !0, this.player_.tech_.featuresNativeAudioTracks)
      for (var t = this.player_.audioTracks(), a = 0; a < t.length; a++) {
        var o = t[a];
        o !== this.track && (o.enabled = o === this.track);
      }
  }, n.handleTracksChange = function(e) {
    this.selected(this.track.enabled);
  }, r;
})(Xi);
te.registerComponent("AudioTrackMenuItem", gc);
var vc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    return e === void 0 && (e = {}), e.tracks = i.audioTracks(), s.call(this, i, e) || this;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-audio-button " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-audio-button " + s.prototype.buildWrapperCSSClass.call(this);
  }, n.createItems = function(e) {
    e === void 0 && (e = []), this.hideThreshold_ = 1;
    for (var t = this.player_.audioTracks(), a = 0; a < t.length; a++) {
      var o = t[a];
      e.push(new gc(this.player_, {
        track: o,
        // MenuItem is selectable
        selectable: !0,
        // MenuItem is NOT multiSelectable (i.e. only one can be marked "selected" at a time)
        multiSelectable: !1
      }));
    }
    return e;
  }, r;
})(yo);
vc.prototype.controlText_ = "Audio Track";
te.registerComponent("AudioTrackButton", vc);
var Co = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t, a = e.rate, o = parseFloat(a, 10);
    return e.label = a, e.selected = o === i.playbackRate(), e.selectable = !0, e.multiSelectable = !1, t = s.call(this, i, e) || this, t.label = a, t.rate = o, t.on(i, "ratechange", function(u) {
      return t.update(u);
    }), t;
  }
  var n = r.prototype;
  return n.handleClick = function(e) {
    s.prototype.handleClick.call(this), this.player().playbackRate(this.rate);
  }, n.update = function(e) {
    this.selected(this.player().playbackRate() === this.rate);
  }, r;
})(Xi);
Co.prototype.contentElType = "button";
te.registerComponent("PlaybackRateMenuItem", Co);
var yc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.menuButton_.el_.setAttribute("aria-describedby", t.labelElId_), t.updateVisibility(), t.updateLabel(), t.on(i, "loadstart", function(a) {
      return t.updateVisibility(a);
    }), t.on(i, "ratechange", function(a) {
      return t.updateLabel(a);
    }), t.on(i, "playbackrateschange", function(a) {
      return t.handlePlaybackRateschange(a);
    }), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    var e = s.prototype.createEl.call(this);
    return this.labelElId_ = "vjs-playback-rate-value-label-" + this.id_, this.labelEl_ = Ee("div", {
      className: "vjs-playback-rate-value",
      id: this.labelElId_,
      textContent: "1x"
    }), e.appendChild(this.labelEl_), e;
  }, n.dispose = function() {
    this.labelEl_ = null, s.prototype.dispose.call(this);
  }, n.buildCSSClass = function() {
    return "vjs-playback-rate " + s.prototype.buildCSSClass.call(this);
  }, n.buildWrapperCSSClass = function() {
    return "vjs-playback-rate " + s.prototype.buildWrapperCSSClass.call(this);
  }, n.createItems = function() {
    for (var e = this.playbackRates(), t = [], a = e.length - 1; a >= 0; a--)
      t.push(new Co(this.player(), {
        rate: e[a] + "x"
      }));
    return t;
  }, n.updateARIAAttributes = function() {
    this.el().setAttribute("aria-valuenow", this.player().playbackRate());
  }, n.handleClick = function(e) {
    var t = this.player().playbackRate(), a = this.playbackRates(), o = a.indexOf(t), u = (o + 1) % a.length;
    this.player().playbackRate(a[u]);
  }, n.handlePlaybackRateschange = function(e) {
    this.update();
  }, n.playbackRates = function() {
    var e = this.player();
    return e.playbackRates && e.playbackRates() || [];
  }, n.playbackRateSupported = function() {
    return this.player().tech_ && this.player().tech_.featuresPlaybackRate && this.playbackRates() && this.playbackRates().length > 0;
  }, n.updateVisibility = function(e) {
    this.playbackRateSupported() ? this.removeClass("vjs-hidden") : this.addClass("vjs-hidden");
  }, n.updateLabel = function(e) {
    this.playbackRateSupported() && (this.labelEl_.textContent = this.player().playbackRate() + "x");
  }, r;
})(vo);
yc.prototype.controlText_ = "Playback Rate";
te.registerComponent("PlaybackRateMenuButton", yc);
var _c = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-spacer " + s.prototype.buildCSSClass.call(this);
  }, n.createEl = function(e, t, a) {
    return e === void 0 && (e = "div"), t === void 0 && (t = {}), a === void 0 && (a = {}), t.className || (t.className = this.buildCSSClass()), s.prototype.createEl.call(this, e, t, a);
  }, r;
})(te);
te.registerComponent("Spacer", _c);
var iv = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-custom-control-spacer " + s.prototype.buildCSSClass.call(this);
  }, n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: this.buildCSSClass(),
      // No-flex/table-cell mode requires there be some content
      // in the cell to fill the remaining space of the table.
      textContent: " "
    });
  }, r;
})(_c);
te.registerComponent("CustomControlSpacer", iv);
var Xn = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.apply(this, arguments) || this;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "div", {
      className: "vjs-control-bar",
      dir: "ltr"
    });
  }, r;
})(te);
Xn.prototype.options_ = {
  children: ["playToggle", "volumePanel", "currentTimeDisplay", "timeDivider", "durationDisplay", "progressControl", "liveDisplay", "seekToLive", "remainingTimeDisplay", "customControlSpacer", "playbackRateMenuButton", "chaptersButton", "descriptionsButton", "subsCapsButton", "audioTrackButton", "fullscreenToggle"]
};
"exitPictureInPicture" in ae && Xn.prototype.options_.children.splice(Xn.prototype.options_.children.length - 1, 0, "pictureInPictureToggle");
te.registerComponent("ControlBar", Xn);
var Tc = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return t = s.call(this, i, e) || this, t.on(i, "error", function(a) {
      return t.open(a);
    }), t;
  }
  var n = r.prototype;
  return n.buildCSSClass = function() {
    return "vjs-error-display " + s.prototype.buildCSSClass.call(this);
  }, n.content = function() {
    var e = this.player().error();
    return e ? this.localize(e.message) : "";
  }, r;
})(di);
Tc.prototype.options_ = Ot({}, di.prototype.options_, {
  pauseOnOpen: !1,
  fillAlways: !0,
  temporary: !1,
  uncloseable: !0
});
te.registerComponent("ErrorDisplay", Tc);
var us = "vjs-text-track-settings", yl = ["#000", "Black"], _l = ["#00F", "Blue"], Tl = ["#0FF", "Cyan"], bl = ["#0F0", "Green"], xl = ["#F0F", "Magenta"], Sl = ["#F00", "Red"], El = ["#FFF", "White"], Cl = ["#FF0", "Yellow"], ls = ["1", "Opaque"], ds = ["0.5", "Semi-Transparent"], Al = ["0", "Transparent"], Ir = {
  backgroundColor: {
    selector: ".vjs-bg-color > select",
    id: "captions-background-color-%s",
    label: "Color",
    options: [yl, El, Sl, bl, _l, Cl, xl, Tl]
  },
  backgroundOpacity: {
    selector: ".vjs-bg-opacity > select",
    id: "captions-background-opacity-%s",
    label: "Transparency",
    options: [ls, ds, Al]
  },
  color: {
    selector: ".vjs-fg-color > select",
    id: "captions-foreground-color-%s",
    label: "Color",
    options: [El, yl, Sl, bl, _l, Cl, xl, Tl]
  },
  edgeStyle: {
    selector: ".vjs-edge-style > select",
    id: "%s",
    label: "Text Edge Style",
    options: [["none", "None"], ["raised", "Raised"], ["depressed", "Depressed"], ["uniform", "Uniform"], ["dropshadow", "Dropshadow"]]
  },
  fontFamily: {
    selector: ".vjs-font-family > select",
    id: "captions-font-family-%s",
    label: "Font Family",
    options: [["proportionalSansSerif", "Proportional Sans-Serif"], ["monospaceSansSerif", "Monospace Sans-Serif"], ["proportionalSerif", "Proportional Serif"], ["monospaceSerif", "Monospace Serif"], ["casual", "Casual"], ["script", "Script"], ["small-caps", "Small Caps"]]
  },
  fontPercent: {
    selector: ".vjs-font-percent > select",
    id: "captions-font-size-%s",
    label: "Font Size",
    options: [["0.50", "50%"], ["0.75", "75%"], ["1.00", "100%"], ["1.25", "125%"], ["1.50", "150%"], ["1.75", "175%"], ["2.00", "200%"], ["3.00", "300%"], ["4.00", "400%"]],
    default: 2,
    parser: function(r) {
      return r === "1.00" ? null : Number(r);
    }
  },
  textOpacity: {
    selector: ".vjs-text-opacity > select",
    id: "captions-foreground-opacity-%s",
    label: "Transparency",
    options: [ls, ds]
  },
  // Options for this object are defined below.
  windowColor: {
    selector: ".vjs-window-color > select",
    id: "captions-window-color-%s",
    label: "Color"
  },
  // Options for this object are defined below.
  windowOpacity: {
    selector: ".vjs-window-opacity > select",
    id: "captions-window-opacity-%s",
    label: "Transparency",
    options: [Al, ds, ls]
  }
};
Ir.windowColor.options = Ir.backgroundColor.options;
function bc(s, r) {
  if (r && (s = r(s)), s && s !== "none")
    return s;
}
function nv(s, r) {
  var n = s.options[s.options.selectedIndex].value;
  return bc(n, r);
}
function av(s, r, n) {
  if (r) {
    for (var i = 0; i < s.options.length; i++)
      if (bc(s.options[i].value, n) === r) {
        s.selectedIndex = i;
        break;
      }
  }
}
var sv = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e.temporary = !1, t = s.call(this, i, e) || this, t.updateDisplay = t.updateDisplay.bind(ye(t)), t.fill(), t.hasBeenOpened_ = t.hasBeenFilled_ = !0, t.endDialog = Ee("p", {
      className: "vjs-control-text",
      textContent: t.localize("End of dialog window.")
    }), t.el().appendChild(t.endDialog), t.setDefaults(), e.persistTextTrackSettings === void 0 && (t.options_.persistTextTrackSettings = t.options_.playerOptions.persistTextTrackSettings), t.on(t.$(".vjs-done-button"), "click", function() {
      t.saveSettings(), t.close();
    }), t.on(t.$(".vjs-default-button"), "click", function() {
      t.setDefaults(), t.updateDisplay();
    }), Xr(Ir, function(a) {
      t.on(t.$(a.selector), "change", t.updateDisplay);
    }), t.options_.persistTextTrackSettings && t.restoreSettings(), t;
  }
  var n = r.prototype;
  return n.dispose = function() {
    this.endDialog = null, s.prototype.dispose.call(this);
  }, n.createElSelect_ = function(e, t, a) {
    var o = this;
    t === void 0 && (t = ""), a === void 0 && (a = "label");
    var u = Ir[e], l = u.id.replace("%s", this.id_), c = [t, l].join(" ").trim();
    return ["<" + a + ' id="' + l + '" class="' + (a === "label" ? "vjs-label" : "") + '">', this.localize(u.label), "</" + a + ">", '<select aria-labelledby="' + c + '">'].concat(u.options.map(function(m) {
      var g = l + "-" + m[1].replace(/\W+/g, "");
      return ['<option id="' + g + '" value="' + m[0] + '" ', 'aria-labelledby="' + c + " " + g + '">', o.localize(m[1]), "</option>"].join("");
    })).concat("</select>").join("");
  }, n.createElFgColor_ = function() {
    var e = "captions-text-legend-" + this.id_;
    return ['<fieldset class="vjs-fg-color vjs-track-setting">', '<legend id="' + e + '">', this.localize("Text"), "</legend>", this.createElSelect_("color", e), '<span class="vjs-text-opacity vjs-opacity">', this.createElSelect_("textOpacity", e), "</span>", "</fieldset>"].join("");
  }, n.createElBgColor_ = function() {
    var e = "captions-background-" + this.id_;
    return ['<fieldset class="vjs-bg-color vjs-track-setting">', '<legend id="' + e + '">', this.localize("Background"), "</legend>", this.createElSelect_("backgroundColor", e), '<span class="vjs-bg-opacity vjs-opacity">', this.createElSelect_("backgroundOpacity", e), "</span>", "</fieldset>"].join("");
  }, n.createElWinColor_ = function() {
    var e = "captions-window-" + this.id_;
    return ['<fieldset class="vjs-window-color vjs-track-setting">', '<legend id="' + e + '">', this.localize("Window"), "</legend>", this.createElSelect_("windowColor", e), '<span class="vjs-window-opacity vjs-opacity">', this.createElSelect_("windowOpacity", e), "</span>", "</fieldset>"].join("");
  }, n.createElColors_ = function() {
    return Ee("div", {
      className: "vjs-track-settings-colors",
      innerHTML: [this.createElFgColor_(), this.createElBgColor_(), this.createElWinColor_()].join("")
    });
  }, n.createElFont_ = function() {
    return Ee("div", {
      className: "vjs-track-settings-font",
      innerHTML: ['<fieldset class="vjs-font-percent vjs-track-setting">', this.createElSelect_("fontPercent", "", "legend"), "</fieldset>", '<fieldset class="vjs-edge-style vjs-track-setting">', this.createElSelect_("edgeStyle", "", "legend"), "</fieldset>", '<fieldset class="vjs-font-family vjs-track-setting">', this.createElSelect_("fontFamily", "", "legend"), "</fieldset>"].join("")
    });
  }, n.createElControls_ = function() {
    var e = this.localize("restore all settings to the default values");
    return Ee("div", {
      className: "vjs-track-settings-controls",
      innerHTML: ['<button type="button" class="vjs-default-button" title="' + e + '">', this.localize("Reset"), '<span class="vjs-control-text"> ' + e + "</span>", "</button>", '<button type="button" class="vjs-done-button">' + this.localize("Done") + "</button>"].join("")
    });
  }, n.content = function() {
    return [this.createElColors_(), this.createElFont_(), this.createElControls_()];
  }, n.label = function() {
    return this.localize("Caption Settings Dialog");
  }, n.description = function() {
    return this.localize("Beginning of dialog window. Escape will cancel and close the window.");
  }, n.buildCSSClass = function() {
    return s.prototype.buildCSSClass.call(this) + " vjs-text-track-settings";
  }, n.getValues = function() {
    var e = this;
    return $m(Ir, function(t, a, o) {
      var u = nv(e.$(a.selector), a.parser);
      return u !== void 0 && (t[o] = u), t;
    }, {});
  }, n.setValues = function(e) {
    var t = this;
    Xr(Ir, function(a, o) {
      av(t.$(a.selector), e[o], a.parser);
    });
  }, n.setDefaults = function() {
    var e = this;
    Xr(Ir, function(t) {
      var a = t.hasOwnProperty("default") ? t.default : 0;
      e.$(t.selector).selectedIndex = a;
    });
  }, n.restoreSettings = function() {
    var e;
    try {
      e = JSON.parse(P.localStorage.getItem(us));
    } catch (t) {
      Te.warn(t);
    }
    e && this.setValues(e);
  }, n.saveSettings = function() {
    if (this.options_.persistTextTrackSettings) {
      var e = this.getValues();
      try {
        Object.keys(e).length ? P.localStorage.setItem(us, JSON.stringify(e)) : P.localStorage.removeItem(us);
      } catch (t) {
        Te.warn(t);
      }
    }
  }, n.updateDisplay = function() {
    var e = this.player_.getChild("textTrackDisplay");
    e && e.updateDisplay();
  }, n.conditionalBlur_ = function() {
    this.previouslyActiveEl_ = null;
    var e = this.player_.controlBar, t = e && e.subsCapsButton, a = e && e.captionsButton;
    t ? t.focus() : a && a.focus();
  }, r;
})(di);
te.registerComponent("TextTrackSettings", sv);
var ov = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t, a = e.ResizeObserver || P.ResizeObserver;
    e.ResizeObserver === null && (a = !1);
    var o = Fe({
      createEl: !a,
      reportTouchActivity: !1
    }, e);
    return t = s.call(this, i, o) || this, t.ResizeObserver = e.ResizeObserver || P.ResizeObserver, t.loadListener_ = null, t.resizeObserver_ = null, t.debouncedHandler_ = ag(function() {
      t.resizeHandler();
    }, 100, !1, ye(t)), a ? (t.resizeObserver_ = new t.ResizeObserver(t.debouncedHandler_), t.resizeObserver_.observe(i.el())) : (t.loadListener_ = function() {
      if (!(!t.el_ || !t.el_.contentWindow)) {
        var u = t.debouncedHandler_, l = t.unloadListener_ = function() {
          at(this, "resize", u), at(this, "unload", l), l = null;
        };
        xt(t.el_.contentWindow, "unload", l), xt(t.el_.contentWindow, "resize", u);
      }
    }, t.one("load", t.loadListener_)), t;
  }
  var n = r.prototype;
  return n.createEl = function() {
    return s.prototype.createEl.call(this, "iframe", {
      className: "vjs-resize-manager",
      tabIndex: -1,
      title: this.localize("No content")
    }, {
      "aria-hidden": "true"
    });
  }, n.resizeHandler = function() {
    !this.player_ || !this.player_.trigger || this.player_.trigger("playerresize");
  }, n.dispose = function() {
    this.debouncedHandler_ && this.debouncedHandler_.cancel(), this.resizeObserver_ && (this.player_.el() && this.resizeObserver_.unobserve(this.player_.el()), this.resizeObserver_.disconnect()), this.loadListener_ && this.off("load", this.loadListener_), this.el_ && this.el_.contentWindow && this.unloadListener_ && this.unloadListener_.call(this.el_.contentWindow), this.ResizeObserver = null, this.resizeObserver = null, this.debouncedHandler_ = null, this.loadListener_ = null, s.prototype.dispose.call(this);
  }, r;
})(te);
te.registerComponent("ResizeManager", ov);
var uv = {
  trackingThreshold: 20,
  liveTolerance: 15
}, lv = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t, a = Fe(uv, e, {
      createEl: !1
    });
    return t = s.call(this, i, a) || this, t.handleVisibilityChange_ = function(o) {
      return t.handleVisibilityChange(o);
    }, t.trackLiveHandler_ = function() {
      return t.trackLive_();
    }, t.handlePlay_ = function(o) {
      return t.handlePlay(o);
    }, t.handleFirstTimeupdate_ = function(o) {
      return t.handleFirstTimeupdate(o);
    }, t.handleSeeked_ = function(o) {
      return t.handleSeeked(o);
    }, t.seekToLiveEdge_ = function(o) {
      return t.seekToLiveEdge(o);
    }, t.reset_(), t.on(t.player_, "durationchange", function(o) {
      return t.handleDurationchange(o);
    }), t.on(t.player_, "canplay", function() {
      return t.toggleTracking();
    }), zi && "hidden" in ae && "visibilityState" in ae && t.on(ae, "visibilitychange", t.handleVisibilityChange_), t;
  }
  var n = r.prototype;
  return n.handleVisibilityChange = function() {
    this.player_.duration() === 1 / 0 && (ae.hidden ? this.stopTracking() : this.startTracking());
  }, n.trackLive_ = function() {
    var e = this.player_.seekable();
    if (!(!e || !e.length)) {
      var t = Number(P.performance.now().toFixed(4)), a = this.lastTime_ === -1 ? 0 : (t - this.lastTime_) / 1e3;
      this.lastTime_ = t, this.pastSeekEnd_ = this.pastSeekEnd() + a;
      var o = this.liveCurrentTime(), u = this.player_.currentTime(), l = this.player_.paused() || this.seekedBehindLive_ || Math.abs(o - u) > this.options_.liveTolerance;
      (!this.timeupdateSeen_ || o === 1 / 0) && (l = !1), l !== this.behindLiveEdge_ && (this.behindLiveEdge_ = l, this.trigger("liveedgechange"));
    }
  }, n.handleDurationchange = function() {
    this.toggleTracking();
  }, n.toggleTracking = function() {
    this.player_.duration() === 1 / 0 && this.liveWindow() >= this.options_.trackingThreshold ? (this.player_.options_.liveui && this.player_.addClass("vjs-liveui"), this.startTracking()) : (this.player_.removeClass("vjs-liveui"), this.stopTracking());
  }, n.startTracking = function() {
    this.isTracking() || (this.timeupdateSeen_ || (this.timeupdateSeen_ = this.player_.hasStarted()), this.trackingInterval_ = this.setInterval(this.trackLiveHandler_, Lt), this.trackLive_(), this.on(this.player_, ["play", "pause"], this.trackLiveHandler_), this.timeupdateSeen_ ? this.on(this.player_, "seeked", this.handleSeeked_) : (this.one(this.player_, "play", this.handlePlay_), this.one(this.player_, "timeupdate", this.handleFirstTimeupdate_)));
  }, n.handleFirstTimeupdate = function() {
    this.timeupdateSeen_ = !0, this.on(this.player_, "seeked", this.handleSeeked_);
  }, n.handleSeeked = function() {
    var e = Math.abs(this.liveCurrentTime() - this.player_.currentTime());
    this.seekedBehindLive_ = this.nextSeekedFromUser_ && e > 2, this.nextSeekedFromUser_ = !1, this.trackLive_();
  }, n.handlePlay = function() {
    this.one(this.player_, "timeupdate", this.seekToLiveEdge_);
  }, n.reset_ = function() {
    this.lastTime_ = -1, this.pastSeekEnd_ = 0, this.lastSeekEnd_ = -1, this.behindLiveEdge_ = !0, this.timeupdateSeen_ = !1, this.seekedBehindLive_ = !1, this.nextSeekedFromUser_ = !1, this.clearInterval(this.trackingInterval_), this.trackingInterval_ = null, this.off(this.player_, ["play", "pause"], this.trackLiveHandler_), this.off(this.player_, "seeked", this.handleSeeked_), this.off(this.player_, "play", this.handlePlay_), this.off(this.player_, "timeupdate", this.handleFirstTimeupdate_), this.off(this.player_, "timeupdate", this.seekToLiveEdge_);
  }, n.nextSeekedFromUser = function() {
    this.nextSeekedFromUser_ = !0;
  }, n.stopTracking = function() {
    this.isTracking() && (this.reset_(), this.trigger("liveedgechange"));
  }, n.seekableEnd = function() {
    for (var e = this.player_.seekable(), t = [], a = e ? e.length : 0; a--; )
      t.push(e.end(a));
    return t.length ? t.sort()[t.length - 1] : 1 / 0;
  }, n.seekableStart = function() {
    for (var e = this.player_.seekable(), t = [], a = e ? e.length : 0; a--; )
      t.push(e.start(a));
    return t.length ? t.sort()[0] : 0;
  }, n.liveWindow = function() {
    var e = this.liveCurrentTime();
    return e === 1 / 0 ? 0 : e - this.seekableStart();
  }, n.isLive = function() {
    return this.isTracking();
  }, n.atLiveEdge = function() {
    return !this.behindLiveEdge();
  }, n.liveCurrentTime = function() {
    return this.pastSeekEnd() + this.seekableEnd();
  }, n.pastSeekEnd = function() {
    var e = this.seekableEnd();
    return this.lastSeekEnd_ !== -1 && e !== this.lastSeekEnd_ && (this.pastSeekEnd_ = 0), this.lastSeekEnd_ = e, this.pastSeekEnd_;
  }, n.behindLiveEdge = function() {
    return this.behindLiveEdge_;
  }, n.isTracking = function() {
    return typeof this.trackingInterval_ == "number";
  }, n.seekToLiveEdge = function() {
    this.seekedBehindLive_ = !1, !this.atLiveEdge() && (this.nextSeekedFromUser_ = !1, this.player_.currentTime(this.liveCurrentTime()));
  }, n.dispose = function() {
    this.off(ae, "visibilitychange", this.handleVisibilityChange_), this.stopTracking(), s.prototype.dispose.call(this);
  }, r;
})(te);
te.registerComponent("LiveTracker", lv);
var Is = function(r) {
  var n = r.el();
  if (n.hasAttribute("src"))
    return r.triggerSourceset(n.src), !0;
  var i = r.$$("source"), e = [], t = "";
  if (!i.length)
    return !1;
  for (var a = 0; a < i.length; a++) {
    var o = i[a].src;
    o && e.indexOf(o) === -1 && e.push(o);
  }
  return e.length ? (e.length === 1 && (t = e[0]), r.triggerSourceset(t), !0) : !1;
}, dv = Object.defineProperty({}, "innerHTML", {
  get: function() {
    return this.cloneNode(!0).innerHTML;
  },
  set: function(r) {
    var n = ae.createElement(this.nodeName.toLowerCase());
    n.innerHTML = r;
    for (var i = ae.createDocumentFragment(); n.childNodes.length; )
      i.appendChild(n.childNodes[0]);
    return this.innerText = "", P.Element.prototype.appendChild.call(this, i), this.innerHTML;
  }
}), xc = function(r, n) {
  for (var i = {}, e = 0; e < r.length && (i = Object.getOwnPropertyDescriptor(r[e], n), !(i && i.set && i.get)); e++)
    ;
  return i.enumerable = !0, i.configurable = !0, i;
}, cv = function(r) {
  return xc([r.el(), P.HTMLMediaElement.prototype, P.Element.prototype, dv], "innerHTML");
}, Dl = function(r) {
  var n = r.el();
  if (!n.resetSourceWatch_) {
    var i = {}, e = cv(r), t = function(o) {
      return function() {
        for (var u = arguments.length, l = new Array(u), c = 0; c < u; c++)
          l[c] = arguments[c];
        var m = o.apply(n, l);
        return Is(r), m;
      };
    };
    ["append", "appendChild", "insertAdjacentHTML"].forEach(function(a) {
      n[a] && (i[a] = n[a], n[a] = t(i[a]));
    }), Object.defineProperty(n, "innerHTML", Fe(e, {
      set: t(e.set)
    })), n.resetSourceWatch_ = function() {
      n.resetSourceWatch_ = null, Object.keys(i).forEach(function(a) {
        n[a] = i[a];
      }), Object.defineProperty(n, "innerHTML", e);
    }, r.one("sourceset", n.resetSourceWatch_);
  }
}, fv = Object.defineProperty({}, "src", {
  get: function() {
    return this.hasAttribute("src") ? Xd(P.Element.prototype.getAttribute.call(this, "src")) : "";
  },
  set: function(r) {
    return P.Element.prototype.setAttribute.call(this, "src", r), r;
  }
}), hv = function(r) {
  return xc([r.el(), P.HTMLMediaElement.prototype, fv], "src");
}, pv = function(r) {
  if (r.featuresSourceset) {
    var n = r.el();
    if (!n.resetSourceset_) {
      var i = hv(r), e = n.setAttribute, t = n.load;
      Object.defineProperty(n, "src", Fe(i, {
        set: function(o) {
          var u = i.set.call(n, o);
          return r.triggerSourceset(n.src), u;
        }
      })), n.setAttribute = function(a, o) {
        var u = e.call(n, a, o);
        return /src/i.test(a) && r.triggerSourceset(n.src), u;
      }, n.load = function() {
        var a = t.call(n);
        return Is(r) || (r.triggerSourceset(""), Dl(r)), a;
      }, n.currentSrc ? r.triggerSourceset(n.currentSrc) : Is(r) || Dl(r), n.resetSourceset_ = function() {
        n.resetSourceset_ = null, n.load = t, n.setAttribute = e, Object.defineProperty(n, "src", i), n.resetSourceWatch_ && n.resetSourceWatch_();
      };
    }
  }
}, Ao = function(r, n, i, e) {
  e === void 0 && (e = !0);
  var t = function(u) {
    return Object.defineProperty(r, n, {
      value: u,
      enumerable: !0,
      writable: !0
    });
  }, a = {
    configurable: !0,
    enumerable: !0,
    get: function() {
      var u = i();
      return t(u), u;
    }
  };
  return e && (a.set = t), Object.defineProperty(r, n, a);
}, le = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    t = s.call(this, i, e) || this;
    var a = i.source, o = !1;
    if (t.featuresVideoFrameCallback = t.featuresVideoFrameCallback && t.el_.tagName === "VIDEO", a && (t.el_.currentSrc !== a.src || i.tag && i.tag.initNetworkState_ === 3) ? t.setSource(a) : t.handleLateInit_(t.el_), i.enableSourceset && t.setupSourcesetHandling_(), t.isScrubbing_ = !1, t.el_.hasChildNodes()) {
      for (var u = t.el_.childNodes, l = u.length, c = []; l--; ) {
        var m = u[l], g = m.nodeName.toLowerCase();
        g === "track" && (t.featuresNativeTextTracks ? (t.remoteTextTrackEls().addTrackElement_(m), t.remoteTextTracks().addTrack(m.track), t.textTracks().addTrack(m.track), !o && !t.el_.hasAttribute("crossorigin") && Ta(m.src) && (o = !0)) : c.push(m));
      }
      for (var _ = 0; _ < c.length; _++)
        t.el_.removeChild(c[_]);
    }
    return t.proxyNativeTracks_(), t.featuresNativeTextTracks && o && Te.warn(`Text Tracks are being loaded from another origin but the crossorigin attribute isn't used.
This may prevent text tracks from loading.`), t.restoreMetadataTracksInIOSNativePlayer_(), (ti || eo || xd) && i.nativeControlsForTouch === !0 && t.setControls(!0), t.proxyWebkitFullscreen_(), t.triggerReady(), t;
  }
  var n = r.prototype;
  return n.dispose = function() {
    this.el_ && this.el_.resetSourceset_ && this.el_.resetSourceset_(), r.disposeMediaElement(this.el_), this.options_ = null, s.prototype.dispose.call(this);
  }, n.setupSourcesetHandling_ = function() {
    pv(this);
  }, n.restoreMetadataTracksInIOSNativePlayer_ = function() {
    var e = this.textTracks(), t, a = function() {
      t = [];
      for (var l = 0; l < e.length; l++) {
        var c = e[l];
        c.kind === "metadata" && t.push({
          track: c,
          storedMode: c.mode
        });
      }
    };
    a(), e.addEventListener("change", a), this.on("dispose", function() {
      return e.removeEventListener("change", a);
    });
    var o = function u() {
      for (var l = 0; l < t.length; l++) {
        var c = t[l];
        c.track.mode === "disabled" && c.track.mode !== c.storedMode && (c.track.mode = c.storedMode);
      }
      e.removeEventListener("change", u);
    };
    this.on("webkitbeginfullscreen", function() {
      e.removeEventListener("change", a), e.removeEventListener("change", o), e.addEventListener("change", o);
    }), this.on("webkitendfullscreen", function() {
      e.removeEventListener("change", a), e.addEventListener("change", a), e.removeEventListener("change", o);
    });
  }, n.overrideNative_ = function(e, t) {
    var a = this;
    if (t === this["featuresNative" + e + "Tracks"]) {
      var o = e.toLowerCase();
      this[o + "TracksListeners_"] && Object.keys(this[o + "TracksListeners_"]).forEach(function(u) {
        var l = a.el()[o + "Tracks"];
        l.removeEventListener(u, a[o + "TracksListeners_"][u]);
      }), this["featuresNative" + e + "Tracks"] = !t, this[o + "TracksListeners_"] = null, this.proxyNativeTracksForType_(o);
    }
  }, n.overrideNativeAudioTracks = function(e) {
    this.overrideNative_("Audio", e);
  }, n.overrideNativeVideoTracks = function(e) {
    this.overrideNative_("Video", e);
  }, n.proxyNativeTracksForType_ = function(e) {
    var t = this, a = Dt[e], o = this.el()[a.getterName], u = this[a.getterName]();
    if (!(!this["featuresNative" + a.capitalName + "Tracks"] || !o || !o.addEventListener)) {
      var l = {
        change: function(g) {
          var _ = {
            type: "change",
            target: u,
            currentTarget: u,
            srcElement: u
          };
          u.trigger(_), e === "text" && t[ai.remoteText.getterName]().trigger(_);
        },
        addtrack: function(g) {
          u.addTrack(g.track);
        },
        removetrack: function(g) {
          u.removeTrack(g.track);
        }
      }, c = function() {
        for (var g = [], _ = 0; _ < u.length; _++) {
          for (var C = !1, w = 0; w < o.length; w++)
            if (o[w] === u[_]) {
              C = !0;
              break;
            }
          C || g.push(u[_]);
        }
        for (; g.length; )
          u.removeTrack(g.shift());
      };
      this[a.getterName + "Listeners_"] = l, Object.keys(l).forEach(function(m) {
        var g = l[m];
        o.addEventListener(m, g), t.on("dispose", function(_) {
          return o.removeEventListener(m, g);
        });
      }), this.on("loadstart", c), this.on("dispose", function(m) {
        return t.off("loadstart", c);
      });
    }
  }, n.proxyNativeTracks_ = function() {
    var e = this;
    Dt.names.forEach(function(t) {
      e.proxyNativeTracksForType_(t);
    });
  }, n.createEl = function() {
    var e = this.options_.tag;
    if (!e || !(this.options_.playerElIngest || this.movingMediaElementInDOM)) {
      if (e) {
        var t = e.cloneNode(!0);
        e.parentNode && e.parentNode.insertBefore(t, e), r.disposeMediaElement(e), e = t;
      } else {
        e = ae.createElement("video");
        var a = this.options_.tag && Qt(this.options_.tag), o = Fe({}, a);
        (!ti || this.options_.nativeControlsForTouch !== !0) && delete o.controls, Pd(e, Ue(o, {
          id: this.options_.techId,
          class: "vjs-tech"
        }));
      }
      e.playerId = this.options_.playerId;
    }
    typeof this.options_.preload < "u" && ri(e, "preload", this.options_.preload), this.options_.disablePictureInPicture !== void 0 && (e.disablePictureInPicture = this.options_.disablePictureInPicture);
    for (var u = ["loop", "muted", "playsinline", "autoplay"], l = 0; l < u.length; l++) {
      var c = u[l], m = this.options_[c];
      typeof m < "u" && (m ? ri(e, c, c) : ma(e, c), e[c] = m);
    }
    return e;
  }, n.handleLateInit_ = function(e) {
    if (!(e.networkState === 0 || e.networkState === 3)) {
      if (e.readyState === 0) {
        var t = !1, a = function() {
          t = !0;
        };
        this.on("loadstart", a);
        var o = function() {
          t || this.trigger("loadstart");
        };
        this.on("loadedmetadata", o), this.ready(function() {
          this.off("loadstart", a), this.off("loadedmetadata", o), t || this.trigger("loadstart");
        });
        return;
      }
      var u = ["loadstart"];
      u.push("loadedmetadata"), e.readyState >= 2 && u.push("loadeddata"), e.readyState >= 3 && u.push("canplay"), e.readyState >= 4 && u.push("canplaythrough"), this.ready(function() {
        u.forEach(function(l) {
          this.trigger(l);
        }, this);
      });
    }
  }, n.setScrubbing = function(e) {
    this.isScrubbing_ = e;
  }, n.scrubbing = function() {
    return this.isScrubbing_;
  }, n.setCurrentTime = function(e) {
    try {
      this.isScrubbing_ && this.el_.fastSeek && pa ? this.el_.fastSeek(e) : this.el_.currentTime = e;
    } catch (t) {
      Te(t, "Video is not ready. (Video.js)");
    }
  }, n.duration = function() {
    var e = this;
    if (this.el_.duration === 1 / 0 && nr && ar && this.el_.currentTime === 0) {
      var t = function a() {
        e.el_.currentTime > 0 && (e.el_.duration === 1 / 0 && e.trigger("durationchange"), e.off("timeupdate", a));
      };
      return this.on("timeupdate", t), NaN;
    }
    return this.el_.duration || NaN;
  }, n.width = function() {
    return this.el_.offsetWidth;
  }, n.height = function() {
    return this.el_.offsetHeight;
  }, n.proxyWebkitFullscreen_ = function() {
    var e = this;
    if ("webkitDisplayingFullscreen" in this.el_) {
      var t = function() {
        this.trigger("fullscreenchange", {
          isFullscreen: !1
        }), this.el_.controls && !this.options_.nativeControlsForTouch && this.controls() && (this.el_.controls = !1);
      }, a = function() {
        "webkitPresentationMode" in this.el_ && this.el_.webkitPresentationMode !== "picture-in-picture" && (this.one("webkitendfullscreen", t), this.trigger("fullscreenchange", {
          isFullscreen: !0,
          // set a flag in case another tech triggers fullscreenchange
          nativeIOSFullscreen: !0
        }));
      };
      this.on("webkitbeginfullscreen", a), this.on("dispose", function() {
        e.off("webkitbeginfullscreen", a), e.off("webkitendfullscreen", t);
      });
    }
  }, n.supportsFullScreen = function() {
    if (typeof this.el_.webkitEnterFullScreen == "function") {
      var e = P.navigator && P.navigator.userAgent || "";
      if (/Android/.test(e) || !/Chrome|Mac OS X 10.5/.test(e))
        return !0;
    }
    return !1;
  }, n.enterFullScreen = function() {
    var e = this.el_;
    if (e.paused && e.networkState <= e.HAVE_METADATA)
      jt(this.el_.play()), this.setTimeout(function() {
        e.pause();
        try {
          e.webkitEnterFullScreen();
        } catch (t) {
          this.trigger("fullscreenerror", t);
        }
      }, 0);
    else
      try {
        e.webkitEnterFullScreen();
      } catch (t) {
        this.trigger("fullscreenerror", t);
      }
  }, n.exitFullScreen = function() {
    if (!this.el_.webkitDisplayingFullscreen) {
      this.trigger("fullscreenerror", new Error("The video is not fullscreen"));
      return;
    }
    this.el_.webkitExitFullScreen();
  }, n.requestPictureInPicture = function() {
    return this.el_.requestPictureInPicture();
  }, n.requestVideoFrameCallback = function(e) {
    return this.featuresVideoFrameCallback && !this.el_.webkitKeys ? this.el_.requestVideoFrameCallback(e) : s.prototype.requestVideoFrameCallback.call(this, e);
  }, n.cancelVideoFrameCallback = function(e) {
    this.featuresVideoFrameCallback && !this.el_.webkitKeys ? this.el_.cancelVideoFrameCallback(e) : s.prototype.cancelVideoFrameCallback.call(this, e);
  }, n.src = function(e) {
    if (e === void 0)
      return this.el_.src;
    this.setSrc(e);
  }, n.reset = function() {
    r.resetMediaElement(this.el_);
  }, n.currentSrc = function() {
    return this.currentSource_ ? this.currentSource_.src : this.el_.currentSrc;
  }, n.setControls = function(e) {
    this.el_.controls = !!e;
  }, n.addTextTrack = function(e, t, a) {
    return this.featuresNativeTextTracks ? this.el_.addTextTrack(e, t, a) : s.prototype.addTextTrack.call(this, e, t, a);
  }, n.createRemoteTextTrack = function(e) {
    if (!this.featuresNativeTextTracks)
      return s.prototype.createRemoteTextTrack.call(this, e);
    var t = ae.createElement("track");
    return e.kind && (t.kind = e.kind), e.label && (t.label = e.label), (e.language || e.srclang) && (t.srclang = e.language || e.srclang), e.default && (t.default = e.default), e.id && (t.id = e.id), e.src && (t.src = e.src), t;
  }, n.addRemoteTextTrack = function(e, t) {
    var a = s.prototype.addRemoteTextTrack.call(this, e, t);
    return this.featuresNativeTextTracks && this.el().appendChild(a), a;
  }, n.removeRemoteTextTrack = function(e) {
    if (s.prototype.removeRemoteTextTrack.call(this, e), this.featuresNativeTextTracks)
      for (var t = this.$$("track"), a = t.length; a--; )
        (e === t[a] || e === t[a].track) && this.el().removeChild(t[a]);
  }, n.getVideoPlaybackQuality = function() {
    if (typeof this.el().getVideoPlaybackQuality == "function")
      return this.el().getVideoPlaybackQuality();
    var e = {};
    return typeof this.el().webkitDroppedFrameCount < "u" && typeof this.el().webkitDecodedFrameCount < "u" && (e.droppedVideoFrames = this.el().webkitDroppedFrameCount, e.totalVideoFrames = this.el().webkitDecodedFrameCount), P.performance && typeof P.performance.now == "function" ? e.creationTime = P.performance.now() : P.performance && P.performance.timing && typeof P.performance.timing.navigationStart == "number" && (e.creationTime = P.Date.now() - P.performance.timing.navigationStart), e;
  }, r;
})(we);
Ao(le, "TEST_VID", function() {
  if (oi()) {
    var s = ae.createElement("video"), r = ae.createElement("track");
    return r.kind = "captions", r.srclang = "en", r.label = "English", s.appendChild(r), s;
  }
});
le.isSupported = function() {
  try {
    le.TEST_VID.volume = 0.5;
  } catch {
    return !1;
  }
  return !!(le.TEST_VID && le.TEST_VID.canPlayType);
};
le.canPlayType = function(s) {
  return le.TEST_VID.canPlayType(s);
};
le.canPlaySource = function(s, r) {
  return le.canPlayType(s.type);
};
le.canControlVolume = function() {
  try {
    var s = le.TEST_VID.volume;
    le.TEST_VID.volume = s / 2 + 0.1;
    var r = s !== le.TEST_VID.volume;
    return r && ht ? (P.setTimeout(function() {
      le && le.prototype && (le.prototype.featuresVolumeControl = s !== le.TEST_VID.volume);
    }), !1) : r;
  } catch {
    return !1;
  }
};
le.canMuteVolume = function() {
  try {
    var s = le.TEST_VID.muted;
    return le.TEST_VID.muted = !s, le.TEST_VID.muted ? ri(le.TEST_VID, "muted", "muted") : ma(le.TEST_VID, "muted", "muted"), s !== le.TEST_VID.muted;
  } catch {
    return !1;
  }
};
le.canControlPlaybackRate = function() {
  if (nr && ar && Ed < 58)
    return !1;
  try {
    var s = le.TEST_VID.playbackRate;
    return le.TEST_VID.playbackRate = s / 2 + 0.1, s !== le.TEST_VID.playbackRate;
  } catch {
    return !1;
  }
};
le.canOverrideAttributes = function() {
  try {
    var s = function() {
    };
    Object.defineProperty(ae.createElement("video"), "src", {
      get: s,
      set: s
    }), Object.defineProperty(ae.createElement("audio"), "src", {
      get: s,
      set: s
    }), Object.defineProperty(ae.createElement("video"), "innerHTML", {
      get: s,
      set: s
    }), Object.defineProperty(ae.createElement("audio"), "innerHTML", {
      get: s,
      set: s
    });
  } catch {
    return !1;
  }
  return !0;
};
le.supportsNativeTextTracks = function() {
  return pa || ht && ar;
};
le.supportsNativeVideoTracks = function() {
  return !!(le.TEST_VID && le.TEST_VID.videoTracks);
};
le.supportsNativeAudioTracks = function() {
  return !!(le.TEST_VID && le.TEST_VID.audioTracks);
};
le.Events = ["loadstart", "suspend", "abort", "error", "emptied", "stalled", "loadedmetadata", "loadeddata", "canplay", "canplaythrough", "playing", "waiting", "seeking", "seeked", "ended", "durationchange", "timeupdate", "progress", "play", "pause", "ratechange", "resize", "volumechange"];
[["featuresMuteControl", "canMuteVolume"], ["featuresPlaybackRate", "canControlPlaybackRate"], ["featuresSourceset", "canOverrideAttributes"], ["featuresNativeTextTracks", "supportsNativeTextTracks"], ["featuresNativeVideoTracks", "supportsNativeVideoTracks"], ["featuresNativeAudioTracks", "supportsNativeAudioTracks"]].forEach(function(s) {
  var r = s[0], n = s[1];
  Ao(le.prototype, r, function() {
    return le[n]();
  }, !0);
});
le.prototype.featuresVolumeControl = le.canControlVolume();
le.prototype.movingMediaElementInDOM = !ht;
le.prototype.featuresFullscreenResize = !0;
le.prototype.featuresProgressEvents = !0;
le.prototype.featuresTimeupdateEvents = !0;
le.prototype.featuresVideoFrameCallback = !!(le.TEST_VID && le.TEST_VID.requestVideoFrameCallback);
var Yn;
le.patchCanPlayType = function() {
  Qs >= 4 && !Sd && !ar && (Yn = le.TEST_VID && le.TEST_VID.constructor.prototype.canPlayType, le.TEST_VID.constructor.prototype.canPlayType = function(s) {
    var r = /^application\/(?:x-|vnd\.apple\.)mpegurl/i;
    return s && r.test(s) ? "maybe" : Yn.call(this, s);
  });
};
le.unpatchCanPlayType = function() {
  var s = le.TEST_VID.constructor.prototype.canPlayType;
  return Yn && (le.TEST_VID.constructor.prototype.canPlayType = Yn), s;
};
le.patchCanPlayType();
le.disposeMediaElement = function(s) {
  if (s) {
    for (s.parentNode && s.parentNode.removeChild(s); s.hasChildNodes(); )
      s.removeChild(s.firstChild);
    s.removeAttribute("src"), typeof s.load == "function" && (function() {
      try {
        s.load();
      } catch {
      }
    })();
  }
};
le.resetMediaElement = function(s) {
  if (s) {
    for (var r = s.querySelectorAll("source"), n = r.length; n--; )
      s.removeChild(r[n]);
    s.removeAttribute("src"), typeof s.load == "function" && (function() {
      try {
        s.load();
      } catch {
      }
    })();
  }
};
[
  /**
   * Get the value of `muted` from the media element. `muted` indicates
   * that the volume for the media should be set to silent. This does not actually change
   * the `volume` attribute.
   *
   * @method Html5#muted
   * @return {boolean}
   *         - True if the value of `volume` should be ignored and the audio set to silent.
   *         - False if the value of `volume` should be used.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-muted}
   */
  "muted",
  /**
   * Get the value of `defaultMuted` from the media element. `defaultMuted` indicates
   * whether the media should start muted or not. Only changes the default state of the
   * media. `muted` and `defaultMuted` can have different values. {@link Html5#muted} indicates the
   * current state.
   *
   * @method Html5#defaultMuted
   * @return {boolean}
   *         - The value of `defaultMuted` from the media element.
   *         - True indicates that the media should start muted.
   *         - False indicates that the media should not start muted
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-defaultmuted}
   */
  "defaultMuted",
  /**
   * Get the value of `autoplay` from the media element. `autoplay` indicates
   * that the media should start to play as soon as the page is ready.
   *
   * @method Html5#autoplay
   * @return {boolean}
   *         - The value of `autoplay` from the media element.
   *         - True indicates that the media should start as soon as the page loads.
   *         - False indicates that the media should not start as soon as the page loads.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-autoplay}
   */
  "autoplay",
  /**
   * Get the value of `controls` from the media element. `controls` indicates
   * whether the native media controls should be shown or hidden.
   *
   * @method Html5#controls
   * @return {boolean}
   *         - The value of `controls` from the media element.
   *         - True indicates that native controls should be showing.
   *         - False indicates that native controls should be hidden.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-controls}
   */
  "controls",
  /**
   * Get the value of `loop` from the media element. `loop` indicates
   * that the media should return to the start of the media and continue playing once
   * it reaches the end.
   *
   * @method Html5#loop
   * @return {boolean}
   *         - The value of `loop` from the media element.
   *         - True indicates that playback should seek back to start once
   *           the end of a media is reached.
   *         - False indicates that playback should not loop back to the start when the
   *           end of the media is reached.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-loop}
   */
  "loop",
  /**
   * Get the value of `playsinline` from the media element. `playsinline` indicates
   * to the browser that non-fullscreen playback is preferred when fullscreen
   * playback is the native default, such as in iOS Safari.
   *
   * @method Html5#playsinline
   * @return {boolean}
   *         - The value of `playsinline` from the media element.
   *         - True indicates that the media should play inline.
   *         - False indicates that the media should not play inline.
   *
   * @see [Spec]{@link https://html.spec.whatwg.org/#attr-video-playsinline}
   */
  "playsinline"
].forEach(function(s) {
  le.prototype[s] = function() {
    return this.el_[s] || this.el_.hasAttribute(s);
  };
});
[
  /**
   * Set the value of `muted` on the media element. `muted` indicates that the current
   * audio level should be silent.
   *
   * @method Html5#setMuted
   * @param {boolean} muted
   *        - True if the audio should be set to silent
   *        - False otherwise
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-muted}
   */
  "muted",
  /**
   * Set the value of `defaultMuted` on the media element. `defaultMuted` indicates that the current
   * audio level should be silent, but will only effect the muted level on initial playback..
   *
   * @method Html5.prototype.setDefaultMuted
   * @param {boolean} defaultMuted
   *        - True if the audio should be set to silent
   *        - False otherwise
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-defaultmuted}
   */
  "defaultMuted",
  /**
   * Set the value of `autoplay` on the media element. `autoplay` indicates
   * that the media should start to play as soon as the page is ready.
   *
   * @method Html5#setAutoplay
   * @param {boolean} autoplay
   *         - True indicates that the media should start as soon as the page loads.
   *         - False indicates that the media should not start as soon as the page loads.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-autoplay}
   */
  "autoplay",
  /**
   * Set the value of `loop` on the media element. `loop` indicates
   * that the media should return to the start of the media and continue playing once
   * it reaches the end.
   *
   * @method Html5#setLoop
   * @param {boolean} loop
   *         - True indicates that playback should seek back to start once
   *           the end of a media is reached.
   *         - False indicates that playback should not loop back to the start when the
   *           end of the media is reached.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-loop}
   */
  "loop",
  /**
   * Set the value of `playsinline` from the media element. `playsinline` indicates
   * to the browser that non-fullscreen playback is preferred when fullscreen
   * playback is the native default, such as in iOS Safari.
   *
   * @method Html5#setPlaysinline
   * @param {boolean} playsinline
   *         - True indicates that the media should play inline.
   *         - False indicates that the media should not play inline.
   *
   * @see [Spec]{@link https://html.spec.whatwg.org/#attr-video-playsinline}
   */
  "playsinline"
].forEach(function(s) {
  le.prototype["set" + Ge(s)] = function(r) {
    this.el_[s] = r, r ? this.el_.setAttribute(s, s) : this.el_.removeAttribute(s);
  };
});
[
  /**
   * Get the value of `paused` from the media element. `paused` indicates whether the media element
   * is currently paused or not.
   *
   * @method Html5#paused
   * @return {boolean}
   *         The value of `paused` from the media element.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-paused}
   */
  "paused",
  /**
   * Get the value of `currentTime` from the media element. `currentTime` indicates
   * the current second that the media is at in playback.
   *
   * @method Html5#currentTime
   * @return {number}
   *         The value of `currentTime` from the media element.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-currenttime}
   */
  "currentTime",
  /**
   * Get the value of `buffered` from the media element. `buffered` is a `TimeRange`
   * object that represents the parts of the media that are already downloaded and
   * available for playback.
   *
   * @method Html5#buffered
   * @return {TimeRange}
   *         The value of `buffered` from the media element.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-buffered}
   */
  "buffered",
  /**
   * Get the value of `volume` from the media element. `volume` indicates
   * the current playback volume of audio for a media. `volume` will be a value from 0
   * (silent) to 1 (loudest and default).
   *
   * @method Html5#volume
   * @return {number}
   *         The value of `volume` from the media element. Value will be between 0-1.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-a-volume}
   */
  "volume",
  /**
   * Get the value of `poster` from the media element. `poster` indicates
   * that the url of an image file that can/will be shown when no media data is available.
   *
   * @method Html5#poster
   * @return {string}
   *         The value of `poster` from the media element. Value will be a url to an
   *         image.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-video-poster}
   */
  "poster",
  /**
   * Get the value of `preload` from the media element. `preload` indicates
   * what should download before the media is interacted with. It can have the following
   * values:
   * - none: nothing should be downloaded
   * - metadata: poster and the first few frames of the media may be downloaded to get
   *   media dimensions and other metadata
   * - auto: allow the media and metadata for the media to be downloaded before
   *    interaction
   *
   * @method Html5#preload
   * @return {string}
   *         The value of `preload` from the media element. Will be 'none', 'metadata',
   *         or 'auto'.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-preload}
   */
  "preload",
  /**
   * Get the value of the `error` from the media element. `error` indicates any
   * MediaError that may have occurred during playback. If error returns null there is no
   * current error.
   *
   * @method Html5#error
   * @return {MediaError|null}
   *         The value of `error` from the media element. Will be `MediaError` if there
   *         is a current error and null otherwise.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-error}
   */
  "error",
  /**
   * Get the value of `seeking` from the media element. `seeking` indicates whether the
   * media is currently seeking to a new position or not.
   *
   * @method Html5#seeking
   * @return {boolean}
   *         - The value of `seeking` from the media element.
   *         - True indicates that the media is currently seeking to a new position.
   *         - False indicates that the media is not seeking to a new position at this time.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-seeking}
   */
  "seeking",
  /**
   * Get the value of `seekable` from the media element. `seekable` returns a
   * `TimeRange` object indicating ranges of time that can currently be `seeked` to.
   *
   * @method Html5#seekable
   * @return {TimeRange}
   *         The value of `seekable` from the media element. A `TimeRange` object
   *         indicating the current ranges of time that can be seeked to.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-seekable}
   */
  "seekable",
  /**
   * Get the value of `ended` from the media element. `ended` indicates whether
   * the media has reached the end or not.
   *
   * @method Html5#ended
   * @return {boolean}
   *         - The value of `ended` from the media element.
   *         - True indicates that the media has ended.
   *         - False indicates that the media has not ended.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-ended}
   */
  "ended",
  /**
   * Get the value of `playbackRate` from the media element. `playbackRate` indicates
   * the rate at which the media is currently playing back. Examples:
   *   - if playbackRate is set to 2, media will play twice as fast.
   *   - if playbackRate is set to 0.5, media will play half as fast.
   *
   * @method Html5#playbackRate
   * @return {number}
   *         The value of `playbackRate` from the media element. A number indicating
   *         the current playback speed of the media, where 1 is normal speed.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-playbackrate}
   */
  "playbackRate",
  /**
   * Get the value of `defaultPlaybackRate` from the media element. `defaultPlaybackRate` indicates
   * the rate at which the media is currently playing back. This value will not indicate the current
   * `playbackRate` after playback has started, use {@link Html5#playbackRate} for that.
   *
   * Examples:
   *   - if defaultPlaybackRate is set to 2, media will play twice as fast.
   *   - if defaultPlaybackRate is set to 0.5, media will play half as fast.
   *
   * @method Html5.prototype.defaultPlaybackRate
   * @return {number}
   *         The value of `defaultPlaybackRate` from the media element. A number indicating
   *         the current playback speed of the media, where 1 is normal speed.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-playbackrate}
   */
  "defaultPlaybackRate",
  /**
   * Get the value of 'disablePictureInPicture' from the video element.
   *
   * @method Html5#disablePictureInPicture
   * @return {boolean} value
   *         - The value of `disablePictureInPicture` from the video element.
   *         - True indicates that the video can't be played in Picture-In-Picture mode
   *         - False indicates that the video can be played in Picture-In-Picture mode
   *
   * @see [Spec]{@link https://w3c.github.io/picture-in-picture/#disable-pip}
   */
  "disablePictureInPicture",
  /**
   * Get the value of `played` from the media element. `played` returns a `TimeRange`
   * object representing points in the media timeline that have been played.
   *
   * @method Html5#played
   * @return {TimeRange}
   *         The value of `played` from the media element. A `TimeRange` object indicating
   *         the ranges of time that have been played.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-played}
   */
  "played",
  /**
   * Get the value of `networkState` from the media element. `networkState` indicates
   * the current network state. It returns an enumeration from the following list:
   * - 0: NETWORK_EMPTY
   * - 1: NETWORK_IDLE
   * - 2: NETWORK_LOADING
   * - 3: NETWORK_NO_SOURCE
   *
   * @method Html5#networkState
   * @return {number}
   *         The value of `networkState` from the media element. This will be a number
   *         from the list in the description.
   *
   * @see [Spec] {@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-networkstate}
   */
  "networkState",
  /**
   * Get the value of `readyState` from the media element. `readyState` indicates
   * the current state of the media element. It returns an enumeration from the
   * following list:
   * - 0: HAVE_NOTHING
   * - 1: HAVE_METADATA
   * - 2: HAVE_CURRENT_DATA
   * - 3: HAVE_FUTURE_DATA
   * - 4: HAVE_ENOUGH_DATA
   *
   * @method Html5#readyState
   * @return {number}
   *         The value of `readyState` from the media element. This will be a number
   *         from the list in the description.
   *
   * @see [Spec] {@link https://www.w3.org/TR/html5/embedded-content-0.html#ready-states}
   */
  "readyState",
  /**
   * Get the value of `videoWidth` from the video element. `videoWidth` indicates
   * the current width of the video in css pixels.
   *
   * @method Html5#videoWidth
   * @return {number}
   *         The value of `videoWidth` from the video element. This will be a number
   *         in css pixels.
   *
   * @see [Spec] {@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-video-videowidth}
   */
  "videoWidth",
  /**
   * Get the value of `videoHeight` from the video element. `videoHeight` indicates
   * the current height of the video in css pixels.
   *
   * @method Html5#videoHeight
   * @return {number}
   *         The value of `videoHeight` from the video element. This will be a number
   *         in css pixels.
   *
   * @see [Spec] {@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-video-videowidth}
   */
  "videoHeight",
  /**
   * Get the value of `crossOrigin` from the media element. `crossOrigin` indicates
   * to the browser that should sent the cookies along with the requests for the
   * different assets/playlists
   *
   * @method Html5#crossOrigin
   * @return {string}
   *         - anonymous indicates that the media should not sent cookies.
   *         - use-credentials indicates that the media should sent cookies along the requests.
   *
   * @see [Spec]{@link https://html.spec.whatwg.org/#attr-media-crossorigin}
   */
  "crossOrigin"
].forEach(function(s) {
  le.prototype[s] = function() {
    return this.el_[s];
  };
});
[
  /**
   * Set the value of `volume` on the media element. `volume` indicates the current
   * audio level as a percentage in decimal form. This means that 1 is 100%, 0.5 is 50%, and
   * so on.
   *
   * @method Html5#setVolume
   * @param {number} percentAsDecimal
   *        The volume percent as a decimal. Valid range is from 0-1.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-a-volume}
   */
  "volume",
  /**
   * Set the value of `src` on the media element. `src` indicates the current
   * {@link Tech~SourceObject} for the media.
   *
   * @method Html5#setSrc
   * @param {Tech~SourceObject} src
   *        The source object to set as the current source.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-src}
   */
  "src",
  /**
   * Set the value of `poster` on the media element. `poster` is the url to
   * an image file that can/will be shown when no media data is available.
   *
   * @method Html5#setPoster
   * @param {string} poster
   *        The url to an image that should be used as the `poster` for the media
   *        element.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-poster}
   */
  "poster",
  /**
   * Set the value of `preload` on the media element. `preload` indicates
   * what should download before the media is interacted with. It can have the following
   * values:
   * - none: nothing should be downloaded
   * - metadata: poster and the first few frames of the media may be downloaded to get
   *   media dimensions and other metadata
   * - auto: allow the media and metadata for the media to be downloaded before
   *    interaction
   *
   * @method Html5#setPreload
   * @param {string} preload
   *         The value of `preload` to set on the media element. Must be 'none', 'metadata',
   *         or 'auto'.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-preload}
   */
  "preload",
  /**
   * Set the value of `playbackRate` on the media element. `playbackRate` indicates
   * the rate at which the media should play back. Examples:
   *   - if playbackRate is set to 2, media will play twice as fast.
   *   - if playbackRate is set to 0.5, media will play half as fast.
   *
   * @method Html5#setPlaybackRate
   * @return {number}
   *         The value of `playbackRate` from the media element. A number indicating
   *         the current playback speed of the media, where 1 is normal speed.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-playbackrate}
   */
  "playbackRate",
  /**
   * Set the value of `defaultPlaybackRate` on the media element. `defaultPlaybackRate` indicates
   * the rate at which the media should play back upon initial startup. Changing this value
   * after a video has started will do nothing. Instead you should used {@link Html5#setPlaybackRate}.
   *
   * Example Values:
   *   - if playbackRate is set to 2, media will play twice as fast.
   *   - if playbackRate is set to 0.5, media will play half as fast.
   *
   * @method Html5.prototype.setDefaultPlaybackRate
   * @return {number}
   *         The value of `defaultPlaybackRate` from the media element. A number indicating
   *         the current playback speed of the media, where 1 is normal speed.
   *
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-defaultplaybackrate}
   */
  "defaultPlaybackRate",
  /**
   * Prevents the browser from suggesting a Picture-in-Picture context menu
   * or to request Picture-in-Picture automatically in some cases.
   *
   * @method Html5#setDisablePictureInPicture
   * @param {boolean} value
   *         The true value will disable Picture-in-Picture mode.
   *
   * @see [Spec]{@link https://w3c.github.io/picture-in-picture/#disable-pip}
   */
  "disablePictureInPicture",
  /**
   * Set the value of `crossOrigin` from the media element. `crossOrigin` indicates
   * to the browser that should sent the cookies along with the requests for the
   * different assets/playlists
   *
   * @method Html5#setCrossOrigin
   * @param {string} crossOrigin
   *         - anonymous indicates that the media should not sent cookies.
   *         - use-credentials indicates that the media should sent cookies along the requests.
   *
   * @see [Spec]{@link https://html.spec.whatwg.org/#attr-media-crossorigin}
   */
  "crossOrigin"
].forEach(function(s) {
  le.prototype["set" + Ge(s)] = function(r) {
    this.el_[s] = r;
  };
});
[
  /**
   * A wrapper around the media elements `pause` function. This will call the `HTML5`
   * media elements `pause` function.
   *
   * @method Html5#pause
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-pause}
   */
  "pause",
  /**
   * A wrapper around the media elements `load` function. This will call the `HTML5`s
   * media element `load` function.
   *
   * @method Html5#load
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-load}
   */
  "load",
  /**
   * A wrapper around the media elements `play` function. This will call the `HTML5`s
   * media element `play` function.
   *
   * @method Html5#play
   * @see [Spec]{@link https://www.w3.org/TR/html5/embedded-content-0.html#dom-media-play}
   */
  "play"
].forEach(function(s) {
  le.prototype[s] = function() {
    return this.el_[s]();
  };
});
we.withSourceHandlers(le);
le.nativeSourceHandler = {};
le.nativeSourceHandler.canPlayType = function(s) {
  try {
    return le.TEST_VID.canPlayType(s);
  } catch {
    return "";
  }
};
le.nativeSourceHandler.canHandleSource = function(s, r) {
  if (s.type)
    return le.nativeSourceHandler.canPlayType(s.type);
  if (s.src) {
    var n = oo(s.src);
    return le.nativeSourceHandler.canPlayType("video/" + n);
  }
  return "";
};
le.nativeSourceHandler.handleSource = function(s, r, n) {
  r.setSrc(s.src);
};
le.nativeSourceHandler.dispose = function() {
};
le.registerSourceHandler(le.nativeSourceHandler);
we.registerTech("Html5", le);
var Sc = [
  /**
   * Fired while the user agent is downloading media data.
   *
   * @event Player#progress
   * @type {EventTarget~Event}
   */
  /**
   * Retrigger the `progress` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechProgress_
   * @fires Player#progress
   * @listens Tech#progress
   */
  "progress",
  /**
   * Fires when the loading of an audio/video is aborted.
   *
   * @event Player#abort
   * @type {EventTarget~Event}
   */
  /**
   * Retrigger the `abort` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechAbort_
   * @fires Player#abort
   * @listens Tech#abort
   */
  "abort",
  /**
   * Fires when the browser is intentionally not getting media data.
   *
   * @event Player#suspend
   * @type {EventTarget~Event}
   */
  /**
   * Retrigger the `suspend` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechSuspend_
   * @fires Player#suspend
   * @listens Tech#suspend
   */
  "suspend",
  /**
   * Fires when the current playlist is empty.
   *
   * @event Player#emptied
   * @type {EventTarget~Event}
   */
  /**
   * Retrigger the `emptied` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechEmptied_
   * @fires Player#emptied
   * @listens Tech#emptied
   */
  "emptied",
  /**
   * Fires when the browser is trying to get media data, but data is not available.
   *
   * @event Player#stalled
   * @type {EventTarget~Event}
   */
  /**
   * Retrigger the `stalled` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechStalled_
   * @fires Player#stalled
   * @listens Tech#stalled
   */
  "stalled",
  /**
   * Fires when the browser has loaded meta data for the audio/video.
   *
   * @event Player#loadedmetadata
   * @type {EventTarget~Event}
   */
  /**
   * Retrigger the `loadedmetadata` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechLoadedmetadata_
   * @fires Player#loadedmetadata
   * @listens Tech#loadedmetadata
   */
  "loadedmetadata",
  /**
   * Fires when the browser has loaded the current frame of the audio/video.
   *
   * @event Player#loadeddata
   * @type {event}
   */
  /**
   * Retrigger the `loadeddata` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechLoaddeddata_
   * @fires Player#loadeddata
   * @listens Tech#loadeddata
   */
  "loadeddata",
  /**
   * Fires when the current playback position has changed.
   *
   * @event Player#timeupdate
   * @type {event}
   */
  /**
   * Retrigger the `timeupdate` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechTimeUpdate_
   * @fires Player#timeupdate
   * @listens Tech#timeupdate
   */
  "timeupdate",
  /**
   * Fires when the video's intrinsic dimensions change
   *
   * @event Player#resize
   * @type {event}
   */
  /**
   * Retrigger the `resize` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechResize_
   * @fires Player#resize
   * @listens Tech#resize
   */
  "resize",
  /**
   * Fires when the volume has been changed
   *
   * @event Player#volumechange
   * @type {event}
   */
  /**
   * Retrigger the `volumechange` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechVolumechange_
   * @fires Player#volumechange
   * @listens Tech#volumechange
   */
  "volumechange",
  /**
   * Fires when the text track has been changed
   *
   * @event Player#texttrackchange
   * @type {event}
   */
  /**
   * Retrigger the `texttrackchange` event that was triggered by the {@link Tech}.
   *
   * @private
   * @method Player#handleTechTexttrackchange_
   * @fires Player#texttrackchange
   * @listens Tech#texttrackchange
   */
  "texttrackchange"
], cs = {
  canplay: "CanPlay",
  canplaythrough: "CanPlayThrough",
  playing: "Playing",
  seeked: "Seeked"
}, Os = ["tiny", "xsmall", "small", "medium", "large", "xlarge", "huge"], Un = {};
Os.forEach(function(s) {
  var r = s.charAt(0) === "x" ? "x-" + s.substring(1) : s;
  Un[s] = "vjs-layout-" + r;
});
var mv = {
  tiny: 210,
  xsmall: 320,
  small: 425,
  medium: 768,
  large: 1440,
  xlarge: 2560,
  huge: 1 / 0
}, Ke = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    var a;
    if (i.id = i.id || e.id || "vjs_video_" + sr(), e = Ue(r.getTagSettings(i), e), e.initChildren = !1, e.createEl = !1, e.evented = !1, e.reportTouchActivity = !1, !e.language)
      if (typeof i.closest == "function") {
        var o = i.closest("[lang]");
        o && o.getAttribute && (e.language = o.getAttribute("lang"));
      } else
        for (var u = i; u && u.nodeType === 1; ) {
          if (Qt(u).hasOwnProperty("lang")) {
            e.language = u.getAttribute("lang");
            break;
          }
          u = u.parentNode;
        }
    if (a = s.call(this, null, e, t) || this, a.boundDocumentFullscreenChange_ = function(g) {
      return a.documentFullscreenChange_(g);
    }, a.boundFullWindowOnEscKey_ = function(g) {
      return a.fullWindowOnEscKey(g);
    }, a.boundUpdateStyleEl_ = function(g) {
      return a.updateStyleEl_(g);
    }, a.boundApplyInitTime_ = function(g) {
      return a.applyInitTime_(g);
    }, a.boundUpdateCurrentBreakpoint_ = function(g) {
      return a.updateCurrentBreakpoint_(g);
    }, a.boundHandleTechClick_ = function(g) {
      return a.handleTechClick_(g);
    }, a.boundHandleTechDoubleClick_ = function(g) {
      return a.handleTechDoubleClick_(g);
    }, a.boundHandleTechTouchStart_ = function(g) {
      return a.handleTechTouchStart_(g);
    }, a.boundHandleTechTouchMove_ = function(g) {
      return a.handleTechTouchMove_(g);
    }, a.boundHandleTechTouchEnd_ = function(g) {
      return a.handleTechTouchEnd_(g);
    }, a.boundHandleTechTap_ = function(g) {
      return a.handleTechTap_(g);
    }, a.isFullscreen_ = !1, a.log = _d(a.id_), a.fsApi_ = Gn, a.isPosterFromTech_ = !1, a.queuedCallbacks_ = [], a.isReady_ = !1, a.hasStarted_ = !1, a.userActive_ = !1, a.debugEnabled_ = !1, a.audioOnlyMode_ = !1, a.audioPosterMode_ = !1, a.audioOnlyCache_ = {
      playerHeight: null,
      hiddenChildren: []
    }, !a.options_ || !a.options_.techOrder || !a.options_.techOrder.length)
      throw new Error("No techOrder specified. Did you overwrite videojs.options instead of just changing the properties you want to override?");
    if (a.tag = i, a.tagAttributes = i && Qt(i), a.language(a.options_.language), e.languages) {
      var l = {};
      Object.getOwnPropertyNames(e.languages).forEach(function(g) {
        l[g.toLowerCase()] = e.languages[g];
      }), a.languages_ = l;
    } else
      a.languages_ = r.prototype.options_.languages;
    a.resetCache_(), a.poster_ = e.poster || "", a.controls_ = !!e.controls, i.controls = !1, i.removeAttribute("controls"), a.changingSrc_ = !1, a.playCallbacks_ = [], a.playTerminatedQueue_ = [], i.hasAttribute("autoplay") ? a.autoplay(!0) : a.autoplay(a.options_.autoplay), e.plugins && Object.keys(e.plugins).forEach(function(g) {
      if (typeof a[g] != "function")
        throw new Error('plugin "' + g + '" does not exist');
    }), a.scrubbing_ = !1, a.el_ = a.createEl(), no(ye(a), {
      eventBusKey: "el_"
    }), a.fsApi_.requestFullscreen && (xt(ae, a.fsApi_.fullscreenchange, a.boundDocumentFullscreenChange_), a.on(a.fsApi_.fullscreenchange, a.boundDocumentFullscreenChange_)), a.fluid_ && a.on(["playerreset", "resize"], a.boundUpdateStyleEl_);
    var c = Fe(a.options_);
    e.plugins && Object.keys(e.plugins).forEach(function(g) {
      a[g](e.plugins[g]);
    }), e.debug && a.debug(!0), a.options_.playerOptions = c, a.middleware_ = [], a.playbackRates(e.playbackRates), a.initChildren(), a.isAudio(i.nodeName.toLowerCase() === "audio"), a.controls() ? a.addClass("vjs-controls-enabled") : a.addClass("vjs-controls-disabled"), a.el_.setAttribute("role", "region"), a.isAudio() ? a.el_.setAttribute("aria-label", a.localize("Audio Player")) : a.el_.setAttribute("aria-label", a.localize("Video Player")), a.isAudio() && a.addClass("vjs-audio"), a.flexNotSupported_() && a.addClass("vjs-no-flex"), ti && a.addClass("vjs-touch-enabled"), ht || a.addClass("vjs-workinghover"), r.players[a.id_] = ye(a);
    var m = gd.split(".")[0];
    return a.addClass("vjs-v" + m), a.userActive(!0), a.reportUserActivity(), a.one("play", function(g) {
      return a.listenForUserActivity_(g);
    }), a.on("stageclick", function(g) {
      return a.handleStageClick_(g);
    }), a.on("keydown", function(g) {
      return a.handleKeyDown(g);
    }), a.on("languagechange", function(g) {
      return a.handleLanguagechange(g);
    }), a.breakpoints(a.options_.breakpoints), a.responsive(a.options_.responsive), a.on("ready", function() {
      a.audioPosterMode(a.options_.audioPosterMode), a.audioOnlyMode(a.options_.audioOnlyMode);
    }), a;
  }
  var n = r.prototype;
  return n.dispose = function() {
    var e = this;
    this.trigger("dispose"), this.off("dispose"), at(ae, this.fsApi_.fullscreenchange, this.boundDocumentFullscreenChange_), at(ae, "keydown", this.boundFullWindowOnEscKey_), this.styleEl_ && this.styleEl_.parentNode && (this.styleEl_.parentNode.removeChild(this.styleEl_), this.styleEl_ = null), r.players[this.id_] = null, this.tag && this.tag.player && (this.tag.player = null), this.el_ && this.el_.player && (this.el_.player = null), this.tech_ && (this.tech_.dispose(), this.isPosterFromTech_ = !1, this.poster_ = ""), this.playerElIngest_ && (this.playerElIngest_ = null), this.tag && (this.tag = null), Rg(this), lt.names.forEach(function(t) {
      var a = lt[t], o = e[a.getterName]();
      o && o.off && o.off();
    }), s.prototype.dispose.call(this, {
      restoreEl: this.options_.restoreEl
    });
  }, n.createEl = function() {
    var e = this.tag, t, a = this.playerElIngest_ = e.parentNode && e.parentNode.hasAttribute && e.parentNode.hasAttribute("data-vjs-player"), o = this.tag.tagName.toLowerCase() === "video-js";
    a ? t = this.el_ = e.parentNode : o || (t = this.el_ = s.prototype.createEl.call(this, "div"));
    var u = Qt(e);
    if (o) {
      for (t = this.el_ = e, e = this.tag = ae.createElement("video"); t.children.length; )
        e.appendChild(t.firstChild);
      Fr(t, "video-js") || er(t, "video-js"), t.appendChild(e), a = this.playerElIngest_ = t, Object.keys(t).forEach(function(C) {
        try {
          e[C] = t[C];
        } catch {
        }
      });
    }
    if (e.setAttribute("tabindex", "-1"), u.tabindex = "-1", (zi || ar && Cd) && (e.setAttribute("role", "application"), u.role = "application"), e.removeAttribute("width"), e.removeAttribute("height"), "width" in u && delete u.width, "height" in u && delete u.height, Object.getOwnPropertyNames(u).forEach(function(C) {
      o && C === "class" || t.setAttribute(C, u[C]), o && e.setAttribute(C, u[C]);
    }), e.playerId = e.id, e.id += "_html5_api", e.className = "vjs-tech", e.player = t.player = this, this.addClass("vjs-paused"), P.VIDEOJS_NO_DYNAMIC_STYLE !== !0) {
      this.styleEl_ = Vd("vjs-styles-dimensions");
      var l = mr(".vjs-styles-defaults"), c = mr("head");
      c.insertBefore(this.styleEl_, l ? l.nextSibling : c.firstChild);
    }
    this.fill_ = !1, this.fluid_ = !1, this.width(this.options_.width), this.height(this.options_.height), this.fill(this.options_.fill), this.fluid(this.options_.fluid), this.aspectRatio(this.options_.aspectRatio), this.crossOrigin(this.options_.crossOrigin || this.options_.crossorigin);
    for (var m = e.getElementsByTagName("a"), g = 0; g < m.length; g++) {
      var _ = m.item(g);
      er(_, "vjs-hidden"), _.setAttribute("hidden", "hidden");
    }
    return e.initNetworkState_ = e.networkState, e.parentNode && !a && e.parentNode.insertBefore(t, e), Es(e, t), this.children_.unshift(e), this.el_.setAttribute("lang", this.language_), this.el_.setAttribute("translate", "no"), this.el_ = t, t;
  }, n.crossOrigin = function(e) {
    if (!e)
      return this.techGet_("crossOrigin");
    if (e !== "anonymous" && e !== "use-credentials") {
      Te.warn('crossOrigin must be "anonymous" or "use-credentials", given "' + e + '"');
      return;
    }
    this.techCall_("setCrossOrigin", e);
  }, n.width = function(e) {
    return this.dimension("width", e);
  }, n.height = function(e) {
    return this.dimension("height", e);
  }, n.dimension = function(e, t) {
    var a = e + "_";
    if (t === void 0)
      return this[a] || 0;
    if (t === "" || t === "auto") {
      this[a] = void 0, this.updateStyleEl_();
      return;
    }
    var o = parseFloat(t);
    if (isNaN(o)) {
      Te.error('Improper value "' + t + '" supplied for for ' + e);
      return;
    }
    this[a] = o, this.updateStyleEl_();
  }, n.fluid = function(e) {
    var t = this;
    if (e === void 0)
      return !!this.fluid_;
    this.fluid_ = !!e, tr(this) && this.off(["playerreset", "resize"], this.boundUpdateStyleEl_), e ? (this.addClass("vjs-fluid"), this.fill(!1), sg(this, function() {
      t.on(["playerreset", "resize"], t.boundUpdateStyleEl_);
    })) : this.removeClass("vjs-fluid"), this.updateStyleEl_();
  }, n.fill = function(e) {
    if (e === void 0)
      return !!this.fill_;
    this.fill_ = !!e, e ? (this.addClass("vjs-fill"), this.fluid(!1)) : this.removeClass("vjs-fill");
  }, n.aspectRatio = function(e) {
    if (e === void 0)
      return this.aspectRatio_;
    if (!/^\d+\:\d+$/.test(e))
      throw new Error("Improper value supplied for aspect ratio. The format should be width:height, for example 16:9.");
    this.aspectRatio_ = e, this.fluid(!0), this.updateStyleEl_();
  }, n.updateStyleEl_ = function() {
    if (P.VIDEOJS_NO_DYNAMIC_STYLE === !0) {
      var e = typeof this.width_ == "number" ? this.width_ : this.options_.width, t = typeof this.height_ == "number" ? this.height_ : this.options_.height, a = this.tech_ && this.tech_.el();
      a && (e >= 0 && (a.width = e), t >= 0 && (a.height = t));
      return;
    }
    var o, u, l, c;
    this.aspectRatio_ !== void 0 && this.aspectRatio_ !== "auto" ? l = this.aspectRatio_ : this.videoWidth() > 0 ? l = this.videoWidth() + ":" + this.videoHeight() : l = "16:9";
    var m = l.split(":"), g = m[1] / m[0];
    this.width_ !== void 0 ? o = this.width_ : this.height_ !== void 0 ? o = this.height_ / g : o = this.videoWidth() || 300, this.height_ !== void 0 ? u = this.height_ : u = o * g, /^[^a-zA-Z]/.test(this.id()) ? c = "dimensions-" + this.id() : c = this.id() + "-dimensions", this.addClass(c), qd(this.styleEl_, `
      .` + c + ` {
        width: ` + o + `px;
        height: ` + u + `px;
      }

      .` + c + `.vjs-fluid:not(.vjs-audio-only-mode) {
        padding-top: ` + g * 100 + `%;
      }
    `);
  }, n.loadTech_ = function(e, t) {
    var a = this;
    this.tech_ && this.unloadTech_();
    var o = Ge(e), u = e.charAt(0).toLowerCase() + e.slice(1);
    o !== "Html5" && this.tag && (we.getTech("Html5").disposeMediaElement(this.tag), this.tag.player = null, this.tag = null), this.techName_ = o, this.isReady_ = !1;
    var l = this.autoplay();
    (typeof this.autoplay() == "string" || this.autoplay() === !0 && this.options_.normalizeAutoplay) && (l = !1);
    var c = {
      source: t,
      autoplay: l,
      nativeControlsForTouch: this.options_.nativeControlsForTouch,
      playerId: this.id(),
      techId: this.id() + "_" + u + "_api",
      playsinline: this.options_.playsinline,
      preload: this.options_.preload,
      loop: this.options_.loop,
      disablePictureInPicture: this.options_.disablePictureInPicture,
      muted: this.options_.muted,
      poster: this.poster(),
      language: this.language(),
      playerElIngest: this.playerElIngest_ || !1,
      "vtt.js": this.options_["vtt.js"],
      canOverridePoster: !!this.options_.techCanOverridePoster,
      enableSourceset: this.options_.enableSourceset,
      Promise: this.options_.Promise
    };
    lt.names.forEach(function(g) {
      var _ = lt[g];
      c[_.getterName] = a[_.privateName];
    }), Ue(c, this.options_[o]), Ue(c, this.options_[u]), Ue(c, this.options_[e.toLowerCase()]), this.tag && (c.tag = this.tag), t && t.src === this.cache_.src && this.cache_.currentTime > 0 && (c.startTime = this.cache_.currentTime);
    var m = we.getTech(e);
    if (!m)
      throw new Error("No Tech named '" + o + "' exists! '" + o + "' should be registered using videojs.registerTech()'");
    this.tech_ = new m(c), this.tech_.ready(Re(this, this.handleTechReady_), !0), ul.jsonToTextTracks(this.textTracksJson_ || [], this.tech_), Sc.forEach(function(g) {
      a.on(a.tech_, g, function(_) {
        return a["handleTech" + Ge(g) + "_"](_);
      });
    }), Object.keys(cs).forEach(function(g) {
      a.on(a.tech_, g, function(_) {
        if (a.tech_.playbackRate() === 0 && a.tech_.seeking()) {
          a.queuedCallbacks_.push({
            callback: a["handleTech" + cs[g] + "_"].bind(a),
            event: _
          });
          return;
        }
        a["handleTech" + cs[g] + "_"](_);
      });
    }), this.on(this.tech_, "loadstart", function(g) {
      return a.handleTechLoadStart_(g);
    }), this.on(this.tech_, "sourceset", function(g) {
      return a.handleTechSourceset_(g);
    }), this.on(this.tech_, "waiting", function(g) {
      return a.handleTechWaiting_(g);
    }), this.on(this.tech_, "ended", function(g) {
      return a.handleTechEnded_(g);
    }), this.on(this.tech_, "seeking", function(g) {
      return a.handleTechSeeking_(g);
    }), this.on(this.tech_, "play", function(g) {
      return a.handleTechPlay_(g);
    }), this.on(this.tech_, "firstplay", function(g) {
      return a.handleTechFirstPlay_(g);
    }), this.on(this.tech_, "pause", function(g) {
      return a.handleTechPause_(g);
    }), this.on(this.tech_, "durationchange", function(g) {
      return a.handleTechDurationChange_(g);
    }), this.on(this.tech_, "fullscreenchange", function(g, _) {
      return a.handleTechFullscreenChange_(g, _);
    }), this.on(this.tech_, "fullscreenerror", function(g, _) {
      return a.handleTechFullscreenError_(g, _);
    }), this.on(this.tech_, "enterpictureinpicture", function(g) {
      return a.handleTechEnterPictureInPicture_(g);
    }), this.on(this.tech_, "leavepictureinpicture", function(g) {
      return a.handleTechLeavePictureInPicture_(g);
    }), this.on(this.tech_, "error", function(g) {
      return a.handleTechError_(g);
    }), this.on(this.tech_, "posterchange", function(g) {
      return a.handleTechPosterChange_(g);
    }), this.on(this.tech_, "textdata", function(g) {
      return a.handleTechTextData_(g);
    }), this.on(this.tech_, "ratechange", function(g) {
      return a.handleTechRateChange_(g);
    }), this.on(this.tech_, "loadedmetadata", this.boundUpdateStyleEl_), this.usingNativeControls(this.techGet_("controls")), this.controls() && !this.usingNativeControls() && this.addTechControlsListeners_(), this.tech_.el().parentNode !== this.el() && (o !== "Html5" || !this.tag) && Es(this.tech_.el(), this.el()), this.tag && (this.tag.player = null, this.tag = null);
  }, n.unloadTech_ = function() {
    var e = this;
    lt.names.forEach(function(t) {
      var a = lt[t];
      e[a.privateName] = e[a.getterName]();
    }), this.textTracksJson_ = ul.textTracksToJson(this.tech_), this.isReady_ = !1, this.tech_.dispose(), this.tech_ = !1, this.isPosterFromTech_ && (this.poster_ = "", this.trigger("posterchange")), this.isPosterFromTech_ = !1;
  }, n.tech = function(e) {
    return e === void 0 && Te.warn(`Using the tech directly can be dangerous. I hope you know what you're doing.
See https://github.com/videojs/video.js/issues/2617 for more info.
`), this.tech_;
  }, n.addTechControlsListeners_ = function() {
    this.removeTechControlsListeners_(), this.on(this.tech_, "click", this.boundHandleTechClick_), this.on(this.tech_, "dblclick", this.boundHandleTechDoubleClick_), this.on(this.tech_, "touchstart", this.boundHandleTechTouchStart_), this.on(this.tech_, "touchmove", this.boundHandleTechTouchMove_), this.on(this.tech_, "touchend", this.boundHandleTechTouchEnd_), this.on(this.tech_, "tap", this.boundHandleTechTap_);
  }, n.removeTechControlsListeners_ = function() {
    this.off(this.tech_, "tap", this.boundHandleTechTap_), this.off(this.tech_, "touchstart", this.boundHandleTechTouchStart_), this.off(this.tech_, "touchmove", this.boundHandleTechTouchMove_), this.off(this.tech_, "touchend", this.boundHandleTechTouchEnd_), this.off(this.tech_, "click", this.boundHandleTechClick_), this.off(this.tech_, "dblclick", this.boundHandleTechDoubleClick_);
  }, n.handleTechReady_ = function() {
    this.triggerReady(), this.cache_.volume && this.techCall_("setVolume", this.cache_.volume), this.handleTechPosterChange_(), this.handleTechDurationChange_();
  }, n.handleTechLoadStart_ = function() {
    this.removeClass("vjs-ended"), this.removeClass("vjs-seeking"), this.error(null), this.handleTechDurationChange_(), this.paused() ? (this.hasStarted(!1), this.trigger("loadstart")) : (this.trigger("loadstart"), this.trigger("firstplay")), this.manualAutoplay_(this.autoplay() === !0 && this.options_.normalizeAutoplay ? "play" : this.autoplay());
  }, n.manualAutoplay_ = function(e) {
    var t = this;
    if (!(!this.tech_ || typeof e != "string")) {
      var a = function() {
        var l = t.muted();
        t.muted(!0);
        var c = function() {
          t.muted(l);
        };
        t.playTerminatedQueue_.push(c);
        var m = t.play();
        if (Fi(m))
          return m.catch(function(g) {
            throw c(), new Error("Rejection at manualAutoplay. Restoring muted value. " + (g || ""));
          });
      }, o;
      if (e === "any" && !this.muted() ? (o = this.play(), Fi(o) && (o = o.catch(a))) : e === "muted" && !this.muted() ? o = a() : o = this.play(), !!Fi(o))
        return o.then(function() {
          t.trigger({
            type: "autoplay-success",
            autoplay: e
          });
        }).catch(function() {
          t.trigger({
            type: "autoplay-failure",
            autoplay: e
          });
        });
    }
  }, n.updateSourceCaches_ = function(e) {
    e === void 0 && (e = "");
    var t = e, a = "";
    typeof t != "string" && (t = e.src, a = e.type), this.cache_.source = this.cache_.source || {}, this.cache_.sources = this.cache_.sources || [], t && !a && (a = Bg(this, t)), this.cache_.source = Fe({}, e, {
      src: t,
      type: a
    });
    for (var o = this.cache_.sources.filter(function(_) {
      return _.src && _.src === t;
    }), u = [], l = this.$$("source"), c = [], m = 0; m < l.length; m++) {
      var g = Qt(l[m]);
      u.push(g), g.src && g.src === t && c.push(g.src);
    }
    c.length && !o.length ? this.cache_.sources = u : o.length || (this.cache_.sources = [this.cache_.source]), this.cache_.src = t;
  }, n.handleTechSourceset_ = function(e) {
    var t = this;
    if (!this.changingSrc_) {
      var a = function(c) {
        return t.updateSourceCaches_(c);
      }, o = this.currentSource().src, u = e.src;
      o && !/^blob:/.test(o) && /^blob:/.test(u) && (!this.lastSource_ || this.lastSource_.tech !== u && this.lastSource_.player !== o) && (a = function() {
      }), a(u), e.src || this.tech_.any(["sourceset", "loadstart"], function(l) {
        if (l.type !== "sourceset") {
          var c = t.techGet("currentSrc");
          t.lastSource_.tech = c, t.updateSourceCaches_(c);
        }
      });
    }
    this.lastSource_ = {
      player: this.currentSource().src,
      tech: e.src
    }, this.trigger({
      src: e.src,
      type: "sourceset"
    });
  }, n.hasStarted = function(e) {
    if (e === void 0)
      return this.hasStarted_;
    e !== this.hasStarted_ && (this.hasStarted_ = e, this.hasStarted_ ? (this.addClass("vjs-has-started"), this.trigger("firstplay")) : this.removeClass("vjs-has-started"));
  }, n.handleTechPlay_ = function() {
    this.removeClass("vjs-ended"), this.removeClass("vjs-paused"), this.addClass("vjs-playing"), this.hasStarted(!0), this.trigger("play");
  }, n.handleTechRateChange_ = function() {
    this.tech_.playbackRate() > 0 && this.cache_.lastPlaybackRate === 0 && (this.queuedCallbacks_.forEach(function(e) {
      return e.callback(e.event);
    }), this.queuedCallbacks_ = []), this.cache_.lastPlaybackRate = this.tech_.playbackRate(), this.trigger("ratechange");
  }, n.handleTechWaiting_ = function() {
    var e = this;
    this.addClass("vjs-waiting"), this.trigger("waiting");
    var t = this.currentTime(), a = function o() {
      t !== e.currentTime() && (e.removeClass("vjs-waiting"), e.off("timeupdate", o));
    };
    this.on("timeupdate", a);
  }, n.handleTechCanPlay_ = function() {
    this.removeClass("vjs-waiting"), this.trigger("canplay");
  }, n.handleTechCanPlayThrough_ = function() {
    this.removeClass("vjs-waiting"), this.trigger("canplaythrough");
  }, n.handleTechPlaying_ = function() {
    this.removeClass("vjs-waiting"), this.trigger("playing");
  }, n.handleTechSeeking_ = function() {
    this.addClass("vjs-seeking"), this.trigger("seeking");
  }, n.handleTechSeeked_ = function() {
    this.removeClass("vjs-seeking"), this.removeClass("vjs-ended"), this.trigger("seeked");
  }, n.handleTechFirstPlay_ = function() {
    this.options_.starttime && (Te.warn("Passing the `starttime` option to the player will be deprecated in 6.0"), this.currentTime(this.options_.starttime)), this.addClass("vjs-has-started"), this.trigger("firstplay");
  }, n.handleTechPause_ = function() {
    this.removeClass("vjs-playing"), this.addClass("vjs-paused"), this.trigger("pause");
  }, n.handleTechEnded_ = function() {
    this.addClass("vjs-ended"), this.removeClass("vjs-waiting"), this.options_.loop ? (this.currentTime(0), this.play()) : this.paused() || this.pause(), this.trigger("ended");
  }, n.handleTechDurationChange_ = function() {
    this.duration(this.techGet_("duration"));
  }, n.handleTechClick_ = function(e) {
    this.controls_ && (this.options_ === void 0 || this.options_.userActions === void 0 || this.options_.userActions.click === void 0 || this.options_.userActions.click !== !1) && (this.options_ !== void 0 && this.options_.userActions !== void 0 && typeof this.options_.userActions.click == "function" ? this.options_.userActions.click.call(this, e) : this.paused() ? jt(this.play()) : this.pause());
  }, n.handleTechDoubleClick_ = function(e) {
    if (this.controls_) {
      var t = Array.prototype.some.call(this.$$(".vjs-control-bar, .vjs-modal-dialog"), function(a) {
        return a.contains(e.target);
      });
      t || (this.options_ === void 0 || this.options_.userActions === void 0 || this.options_.userActions.doubleClick === void 0 || this.options_.userActions.doubleClick !== !1) && (this.options_ !== void 0 && this.options_.userActions !== void 0 && typeof this.options_.userActions.doubleClick == "function" ? this.options_.userActions.doubleClick.call(this, e) : this.isFullscreen() ? this.exitFullscreen() : this.requestFullscreen());
    }
  }, n.handleTechTap_ = function() {
    this.userActive(!this.userActive());
  }, n.handleTechTouchStart_ = function() {
    this.userWasActive = this.userActive();
  }, n.handleTechTouchMove_ = function() {
    this.userWasActive && this.reportUserActivity();
  }, n.handleTechTouchEnd_ = function(e) {
    e.cancelable && e.preventDefault();
  }, n.handleStageClick_ = function() {
    this.reportUserActivity();
  }, n.toggleFullscreenClass_ = function() {
    this.isFullscreen() ? this.addClass("vjs-fullscreen") : this.removeClass("vjs-fullscreen");
  }, n.documentFullscreenChange_ = function(e) {
    var t = e.target.player;
    if (!(t && t !== this)) {
      var a = this.el(), o = ae[this.fsApi_.fullscreenElement] === a;
      !o && a.matches ? o = a.matches(":" + this.fsApi_.fullscreen) : !o && a.msMatchesSelector && (o = a.msMatchesSelector(":" + this.fsApi_.fullscreen)), this.isFullscreen(o);
    }
  }, n.handleTechFullscreenChange_ = function(e, t) {
    var a = this;
    t && (t.nativeIOSFullscreen && (this.addClass("vjs-ios-native-fs"), this.tech_.one("webkitendfullscreen", function() {
      a.removeClass("vjs-ios-native-fs");
    })), this.isFullscreen(t.isFullscreen));
  }, n.handleTechFullscreenError_ = function(e, t) {
    this.trigger("fullscreenerror", t);
  }, n.togglePictureInPictureClass_ = function() {
    this.isInPictureInPicture() ? this.addClass("vjs-picture-in-picture") : this.removeClass("vjs-picture-in-picture");
  }, n.handleTechEnterPictureInPicture_ = function(e) {
    this.isInPictureInPicture(!0);
  }, n.handleTechLeavePictureInPicture_ = function(e) {
    this.isInPictureInPicture(!1);
  }, n.handleTechError_ = function() {
    var e = this.tech_.error();
    this.error(e);
  }, n.handleTechTextData_ = function() {
    var e = null;
    arguments.length > 1 && (e = arguments[1]), this.trigger("textdata", e);
  }, n.getCache = function() {
    return this.cache_;
  }, n.resetCache_ = function() {
    this.cache_ = {
      // Right now, the currentTime is not _really_ cached because it is always
      // retrieved from the tech (see: currentTime). However, for completeness,
      // we set it to zero here to ensure that if we do start actually caching
      // it, we reset it along with everything else.
      currentTime: 0,
      initTime: 0,
      inactivityTimeout: this.options_.inactivityTimeout,
      duration: NaN,
      lastVolume: 1,
      lastPlaybackRate: this.defaultPlaybackRate(),
      media: null,
      src: "",
      source: {},
      sources: [],
      playbackRates: [],
      volume: 1
    };
  }, n.techCall_ = function(e, t) {
    this.ready(function() {
      if (e in Lg)
        return Ig(this.middleware_, this.tech_, e, t);
      if (e in pl)
        return hl(this.middleware_, this.tech_, e, t);
      try {
        this.tech_ && this.tech_[e](t);
      } catch (a) {
        throw Te(a), a;
      }
    }, !0);
  }, n.techGet_ = function(e) {
    if (!(!this.tech_ || !this.tech_.isReady_)) {
      if (e in Og)
        return Pg(this.middleware_, this.tech_, e);
      if (e in pl)
        return hl(this.middleware_, this.tech_, e);
      try {
        return this.tech_[e]();
      } catch (t) {
        throw this.tech_[e] === void 0 ? (Te("Video.js: " + e + " method not defined for " + this.techName_ + " playback technology.", t), t) : t.name === "TypeError" ? (Te("Video.js: " + e + " unavailable on " + this.techName_ + " playback technology element.", t), this.tech_.isReady_ = !1, t) : (Te(t), t);
      }
    }
  }, n.play = function() {
    var e = this, t = this.options_.Promise || P.Promise;
    return t ? new t(function(a) {
      e.play_(a);
    }) : this.play_();
  }, n.play_ = function(e) {
    var t = this;
    e === void 0 && (e = jt), this.playCallbacks_.push(e);
    var a = !!(!this.changingSrc_ && (this.src() || this.currentSrc())), o = !!(pa || ht);
    if (this.waitToPlay_ && (this.off(["ready", "loadstart"], this.waitToPlay_), this.waitToPlay_ = null), !this.isReady_ || !a) {
      this.waitToPlay_ = function(c) {
        t.play_();
      }, this.one(["ready", "loadstart"], this.waitToPlay_), !a && o && this.load();
      return;
    }
    var u = this.techGet_("play"), l = o && this.hasClass("vjs-ended");
    l && this.resetProgressBar_(), u === null ? this.runPlayTerminatedQueue_() : this.runPlayCallbacks_(u);
  }, n.runPlayTerminatedQueue_ = function() {
    var e = this.playTerminatedQueue_.slice(0);
    this.playTerminatedQueue_ = [], e.forEach(function(t) {
      t();
    });
  }, n.runPlayCallbacks_ = function(e) {
    var t = this.playCallbacks_.slice(0);
    this.playCallbacks_ = [], this.playTerminatedQueue_ = [], t.forEach(function(a) {
      a(e);
    });
  }, n.pause = function() {
    this.techCall_("pause");
  }, n.paused = function() {
    return this.techGet_("paused") !== !1;
  }, n.played = function() {
    return this.techGet_("played") || Rr(0, 0);
  }, n.scrubbing = function(e) {
    if (typeof e > "u")
      return this.scrubbing_;
    this.scrubbing_ = !!e, this.techCall_("setScrubbing", this.scrubbing_), e ? this.addClass("vjs-scrubbing") : this.removeClass("vjs-scrubbing");
  }, n.currentTime = function(e) {
    if (typeof e < "u") {
      if (e < 0 && (e = 0), !this.isReady_ || this.changingSrc_ || !this.tech_ || !this.tech_.isReady_) {
        this.cache_.initTime = e, this.off("canplay", this.boundApplyInitTime_), this.one("canplay", this.boundApplyInitTime_);
        return;
      }
      this.techCall_("setCurrentTime", e), this.cache_.initTime = 0;
      return;
    }
    return this.cache_.currentTime = this.techGet_("currentTime") || 0, this.cache_.currentTime;
  }, n.applyInitTime_ = function() {
    this.currentTime(this.cache_.initTime);
  }, n.duration = function(e) {
    if (e === void 0)
      return this.cache_.duration !== void 0 ? this.cache_.duration : NaN;
    e = parseFloat(e), e < 0 && (e = 1 / 0), e !== this.cache_.duration && (this.cache_.duration = e, e === 1 / 0 ? this.addClass("vjs-live") : this.removeClass("vjs-live"), isNaN(e) || this.trigger("durationchange"));
  }, n.remainingTime = function() {
    return this.duration() - this.currentTime();
  }, n.remainingTimeDisplay = function() {
    return Math.floor(this.duration()) - Math.floor(this.currentTime());
  }, n.buffered = function() {
    var e = this.techGet_("buffered");
    return (!e || !e.length) && (e = Rr(0, 0)), e;
  }, n.bufferedPercent = function() {
    return Kd(this.buffered(), this.duration());
  }, n.bufferedEnd = function() {
    var e = this.buffered(), t = this.duration(), a = e.end(e.length - 1);
    return a > t && (a = t), a;
  }, n.volume = function(e) {
    var t;
    if (e !== void 0) {
      t = Math.max(0, Math.min(1, parseFloat(e))), this.cache_.volume = t, this.techCall_("setVolume", t), t > 0 && this.lastVolume_(t);
      return;
    }
    return t = parseFloat(this.techGet_("volume")), isNaN(t) ? 1 : t;
  }, n.muted = function(e) {
    if (e !== void 0) {
      this.techCall_("setMuted", e);
      return;
    }
    return this.techGet_("muted") || !1;
  }, n.defaultMuted = function(e) {
    return e !== void 0 ? this.techCall_("setDefaultMuted", e) : this.techGet_("defaultMuted") || !1;
  }, n.lastVolume_ = function(e) {
    if (e !== void 0 && e !== 0) {
      this.cache_.lastVolume = e;
      return;
    }
    return this.cache_.lastVolume;
  }, n.supportsFullScreen = function() {
    return this.techGet_("supportsFullScreen") || !1;
  }, n.isFullscreen = function(e) {
    if (e !== void 0) {
      var t = this.isFullscreen_;
      this.isFullscreen_ = !!e, this.isFullscreen_ !== t && this.fsApi_.prefixed && this.trigger("fullscreenchange"), this.toggleFullscreenClass_();
      return;
    }
    return this.isFullscreen_;
  }, n.requestFullscreen = function(e) {
    var t = this.options_.Promise || P.Promise;
    if (t) {
      var a = this;
      return new t(function(o, u) {
        function l() {
          a.off("fullscreenerror", m), a.off("fullscreenchange", c);
        }
        function c() {
          l(), o();
        }
        function m(_, C) {
          l(), u(C);
        }
        a.one("fullscreenchange", c), a.one("fullscreenerror", m);
        var g = a.requestFullscreenHelper_(e);
        g && (g.then(l, l), g.then(o, u));
      });
    }
    return this.requestFullscreenHelper_();
  }, n.requestFullscreenHelper_ = function(e) {
    var t = this, a;
    if (this.fsApi_.prefixed || (a = this.options_.fullscreen && this.options_.fullscreen.options || {}, e !== void 0 && (a = e)), this.fsApi_.requestFullscreen) {
      var o = this.el_[this.fsApi_.requestFullscreen](a);
      return o && o.then(function() {
        return t.isFullscreen(!0);
      }, function() {
        return t.isFullscreen(!1);
      }), o;
    } else this.tech_.supportsFullScreen() && !this.options_.preferFullWindow ? this.techCall_("enterFullScreen") : this.enterFullWindow();
  }, n.exitFullscreen = function() {
    var e = this.options_.Promise || P.Promise;
    if (e) {
      var t = this;
      return new e(function(a, o) {
        function u() {
          t.off("fullscreenerror", c), t.off("fullscreenchange", l);
        }
        function l() {
          u(), a();
        }
        function c(g, _) {
          u(), o(_);
        }
        t.one("fullscreenchange", l), t.one("fullscreenerror", c);
        var m = t.exitFullscreenHelper_();
        m && (m.then(u, u), m.then(a, o));
      });
    }
    return this.exitFullscreenHelper_();
  }, n.exitFullscreenHelper_ = function() {
    var e = this;
    if (this.fsApi_.requestFullscreen) {
      var t = ae[this.fsApi_.exitFullscreen]();
      return t && jt(t.then(function() {
        return e.isFullscreen(!1);
      })), t;
    } else this.tech_.supportsFullScreen() && !this.options_.preferFullWindow ? this.techCall_("exitFullScreen") : this.exitFullWindow();
  }, n.enterFullWindow = function() {
    this.isFullscreen(!0), this.isFullWindow = !0, this.docOrigOverflow = ae.documentElement.style.overflow, xt(ae, "keydown", this.boundFullWindowOnEscKey_), ae.documentElement.style.overflow = "hidden", er(ae.body, "vjs-full-window"), this.trigger("enterFullWindow");
  }, n.fullWindowOnEscKey = function(e) {
    _e.isEventKey(e, "Esc") && this.isFullscreen() === !0 && (this.isFullWindow ? this.exitFullWindow() : this.exitFullscreen());
  }, n.exitFullWindow = function() {
    this.isFullscreen(!1), this.isFullWindow = !1, at(ae, "keydown", this.boundFullWindowOnEscKey_), ae.documentElement.style.overflow = this.docOrigOverflow, Ki(ae.body, "vjs-full-window"), this.trigger("exitFullWindow");
  }, n.disablePictureInPicture = function(e) {
    if (e === void 0)
      return this.techGet_("disablePictureInPicture");
    this.techCall_("setDisablePictureInPicture", e), this.options_.disablePictureInPicture = e, this.trigger("disablepictureinpicturechanged");
  }, n.isInPictureInPicture = function(e) {
    if (e !== void 0) {
      this.isInPictureInPicture_ = !!e, this.togglePictureInPictureClass_();
      return;
    }
    return !!this.isInPictureInPicture_;
  }, n.requestPictureInPicture = function() {
    if ("pictureInPictureEnabled" in ae && this.disablePictureInPicture() === !1)
      return this.techGet_("requestPictureInPicture");
  }, n.exitPictureInPicture = function() {
    if ("pictureInPictureEnabled" in ae)
      return ae.exitPictureInPicture();
  }, n.handleKeyDown = function(e) {
    var t = this.options_.userActions;
    if (!(!t || !t.hotkeys)) {
      var a = function(u) {
        var l = u.tagName.toLowerCase();
        if (u.isContentEditable)
          return !0;
        var c = ["button", "checkbox", "hidden", "radio", "reset", "submit"];
        if (l === "input")
          return c.indexOf(u.type) === -1;
        var m = ["textarea"];
        return m.indexOf(l) !== -1;
      };
      a(this.el_.ownerDocument.activeElement) || (typeof t.hotkeys == "function" ? t.hotkeys.call(this, e) : this.handleHotkeys(e));
    }
  }, n.handleHotkeys = function(e) {
    var t = this.options_.userActions ? this.options_.userActions.hotkeys : {}, a = t.fullscreenKey, o = a === void 0 ? function(w) {
      return _e.isEventKey(w, "f");
    } : a, u = t.muteKey, l = u === void 0 ? function(w) {
      return _e.isEventKey(w, "m");
    } : u, c = t.playPauseKey, m = c === void 0 ? function(w) {
      return _e.isEventKey(w, "k") || _e.isEventKey(w, "Space");
    } : c;
    if (o.call(this, e)) {
      e.preventDefault(), e.stopPropagation();
      var g = te.getComponent("FullscreenToggle");
      ae[this.fsApi_.fullscreenEnabled] !== !1 && g.prototype.handleClick.call(this, e);
    } else if (l.call(this, e)) {
      e.preventDefault(), e.stopPropagation();
      var _ = te.getComponent("MuteToggle");
      _.prototype.handleClick.call(this, e);
    } else if (m.call(this, e)) {
      e.preventDefault(), e.stopPropagation();
      var C = te.getComponent("PlayToggle");
      C.prototype.handleClick.call(this, e);
    }
  }, n.canPlayType = function(e) {
    for (var t, a = 0, o = this.options_.techOrder; a < o.length; a++) {
      var u = o[a], l = we.getTech(u);
      if (l || (l = te.getComponent(u)), !l) {
        Te.error('The "' + u + '" tech is undefined. Skipped browser support check for that tech.');
        continue;
      }
      if (l.isSupported() && (t = l.canPlayType(e), t))
        return t;
    }
    return "";
  }, n.selectSource = function(e) {
    var t = this, a = this.options_.techOrder.map(function(m) {
      return [m, we.getTech(m)];
    }).filter(function(m) {
      var g = m[0], _ = m[1];
      return _ ? _.isSupported() : (Te.error('The "' + g + '" tech is undefined. Skipped browser support check for that tech.'), !1);
    }), o = function(g, _, C) {
      var w;
      return g.some(function(E) {
        return _.some(function(M) {
          if (w = C(E, M), w)
            return !0;
        });
      }), w;
    }, u, l = function(g) {
      return function(_, C) {
        return g(C, _);
      };
    }, c = function(g, _) {
      var C = g[0], w = g[1];
      if (w.canPlaySource(_, t.options_[C.toLowerCase()]))
        return {
          source: _,
          tech: C
        };
    };
    return this.options_.sourceOrder ? u = o(e, a, l(c)) : u = o(a, e, c), u || !1;
  }, n.handleSrc_ = function(e, t) {
    var a = this;
    if (typeof e > "u")
      return this.cache_.src || "";
    this.resetRetryOnError_ && this.resetRetryOnError_();
    var o = Ug(e);
    if (!o.length) {
      this.setTimeout(function() {
        this.error({
          code: 4,
          message: this.options_.notSupportedMessage
        });
      }, 0);
      return;
    }
    if (this.changingSrc_ = !0, t || (this.cache_.sources = o), this.updateSourceCaches_(o[0]), wg(this, o[0], function(c, m) {
      a.middleware_ = m, t || (a.cache_.sources = o), a.updateSourceCaches_(c);
      var g = a.src_(c);
      if (g) {
        if (o.length > 1)
          return a.handleSrc_(o.slice(1));
        a.changingSrc_ = !1, a.setTimeout(function() {
          this.error({
            code: 4,
            message: this.options_.notSupportedMessage
          });
        }, 0), a.triggerReady();
        return;
      }
      kg(m, a.tech_);
    }), this.options_.retryOnError && o.length > 1) {
      var u = function() {
        a.error(null), a.handleSrc_(o.slice(1), !0);
      }, l = function() {
        a.off("error", u);
      };
      this.one("error", u), this.one("playing", l), this.resetRetryOnError_ = function() {
        a.off("error", u), a.off("playing", l);
      };
    }
  }, n.src = function(e) {
    return this.handleSrc_(e, !1);
  }, n.src_ = function(e) {
    var t = this, a = this.selectSource([e]);
    return a ? lg(a.tech, this.techName_) ? (this.ready(function() {
      this.tech_.constructor.prototype.hasOwnProperty("setSource") ? this.techCall_("setSource", e) : this.techCall_("src", e.src), this.changingSrc_ = !1;
    }, !0), !1) : (this.changingSrc_ = !0, this.loadTech_(a.tech, a.source), this.tech_.ready(function() {
      t.changingSrc_ = !1;
    }), !1) : !0;
  }, n.load = function() {
    this.techCall_("load");
  }, n.reset = function() {
    var e = this, t = this.options_.Promise || P.Promise;
    if (this.paused() || !t)
      this.doReset_();
    else {
      var a = this.play();
      jt(a.then(function() {
        return e.doReset_();
      }));
    }
  }, n.doReset_ = function() {
    this.tech_ && this.tech_.clearTracks("text"), this.resetCache_(), this.poster(""), this.loadTech_(this.options_.techOrder[0], null), this.techCall_("reset"), this.resetControlBarUI_(), tr(this) && this.trigger("playerreset");
  }, n.resetControlBarUI_ = function() {
    this.resetProgressBar_(), this.resetPlaybackRate_(), this.resetVolumeBar_();
  }, n.resetProgressBar_ = function() {
    this.currentTime(0);
    var e = this.controlBar || {}, t = e.durationDisplay, a = e.remainingTimeDisplay;
    t && t.updateContent(), a && a.updateContent();
  }, n.resetPlaybackRate_ = function() {
    this.playbackRate(this.defaultPlaybackRate()), this.handleTechRateChange_();
  }, n.resetVolumeBar_ = function() {
    this.volume(1), this.trigger("volumechange");
  }, n.currentSources = function() {
    var e = this.currentSource(), t = [];
    return Object.keys(e).length !== 0 && t.push(e), this.cache_.sources || t;
  }, n.currentSource = function() {
    return this.cache_.source || {};
  }, n.currentSrc = function() {
    return this.currentSource() && this.currentSource().src || "";
  }, n.currentType = function() {
    return this.currentSource() && this.currentSource().type || "";
  }, n.preload = function(e) {
    if (e !== void 0) {
      this.techCall_("setPreload", e), this.options_.preload = e;
      return;
    }
    return this.techGet_("preload");
  }, n.autoplay = function(e) {
    if (e === void 0)
      return this.options_.autoplay || !1;
    var t;
    typeof e == "string" && /(any|play|muted)/.test(e) || e === !0 && this.options_.normalizeAutoplay ? (this.options_.autoplay = e, this.manualAutoplay_(typeof e == "string" ? e : "play"), t = !1) : e ? this.options_.autoplay = !0 : this.options_.autoplay = !1, t = typeof t > "u" ? this.options_.autoplay : t, this.tech_ && this.techCall_("setAutoplay", t);
  }, n.playsinline = function(e) {
    return e !== void 0 ? (this.techCall_("setPlaysinline", e), this.options_.playsinline = e, this) : this.techGet_("playsinline");
  }, n.loop = function(e) {
    if (e !== void 0) {
      this.techCall_("setLoop", e), this.options_.loop = e;
      return;
    }
    return this.techGet_("loop");
  }, n.poster = function(e) {
    if (e === void 0)
      return this.poster_;
    e || (e = ""), e !== this.poster_ && (this.poster_ = e, this.techCall_("setPoster", e), this.isPosterFromTech_ = !1, this.trigger("posterchange"));
  }, n.handleTechPosterChange_ = function() {
    if ((!this.poster_ || this.options_.techCanOverridePoster) && this.tech_ && this.tech_.poster) {
      var e = this.tech_.poster() || "";
      e !== this.poster_ && (this.poster_ = e, this.isPosterFromTech_ = !0, this.trigger("posterchange"));
    }
  }, n.controls = function(e) {
    if (e === void 0)
      return !!this.controls_;
    e = !!e, this.controls_ !== e && (this.controls_ = e, this.usingNativeControls() && this.techCall_("setControls", e), this.controls_ ? (this.removeClass("vjs-controls-disabled"), this.addClass("vjs-controls-enabled"), this.trigger("controlsenabled"), this.usingNativeControls() || this.addTechControlsListeners_()) : (this.removeClass("vjs-controls-enabled"), this.addClass("vjs-controls-disabled"), this.trigger("controlsdisabled"), this.usingNativeControls() || this.removeTechControlsListeners_()));
  }, n.usingNativeControls = function(e) {
    if (e === void 0)
      return !!this.usingNativeControls_;
    e = !!e, this.usingNativeControls_ !== e && (this.usingNativeControls_ = e, this.usingNativeControls_ ? (this.addClass("vjs-using-native-controls"), this.trigger("usingnativecontrols")) : (this.removeClass("vjs-using-native-controls"), this.trigger("usingcustomcontrols")));
  }, n.error = function(e) {
    var t = this;
    if (e === void 0)
      return this.error_ || null;
    if (pr("beforeerror").forEach(function(o) {
      var u = o(t, e);
      if (!(rr(u) && !Array.isArray(u) || typeof u == "string" || typeof u == "number" || u === null)) {
        t.log.error("please return a value that MediaError expects in beforeerror hooks");
        return;
      }
      e = u;
    }), this.options_.suppressNotSupportedError && e && e.code === 4) {
      var a = function() {
        this.error(e);
      };
      this.options_.suppressNotSupportedError = !1, this.any(["click", "touchstart"], a), this.one("loadstart", function() {
        this.off(["click", "touchstart"], a);
      });
      return;
    }
    if (e === null) {
      this.error_ = e, this.removeClass("vjs-error"), this.errorDisplay && this.errorDisplay.close();
      return;
    }
    this.error_ = new ft(e), this.addClass("vjs-error"), Te.error("(CODE:" + this.error_.code + " " + ft.errorTypes[this.error_.code] + ")", this.error_.message, this.error_), this.trigger("error"), pr("error").forEach(function(o) {
      return o(t, t.error_);
    });
  }, n.reportUserActivity = function(e) {
    this.userActivity_ = !0;
  }, n.userActive = function(e) {
    if (e === void 0)
      return this.userActive_;
    if (e = !!e, e !== this.userActive_) {
      if (this.userActive_ = e, this.userActive_) {
        this.userActivity_ = !0, this.removeClass("vjs-user-inactive"), this.addClass("vjs-user-active"), this.trigger("useractive");
        return;
      }
      this.tech_ && this.tech_.one("mousemove", function(t) {
        t.stopPropagation(), t.preventDefault();
      }), this.userActivity_ = !1, this.removeClass("vjs-user-active"), this.addClass("vjs-user-inactive"), this.trigger("userinactive");
    }
  }, n.listenForUserActivity_ = function() {
    var e, t, a, o = Re(this, this.reportUserActivity), u = function(C) {
      (C.screenX !== t || C.screenY !== a) && (t = C.screenX, a = C.screenY, o());
    }, l = function() {
      o(), this.clearInterval(e), e = this.setInterval(o, 250);
    }, c = function(C) {
      o(), this.clearInterval(e);
    };
    this.on("mousedown", l), this.on("mousemove", u), this.on("mouseup", c), this.on("mouseleave", c);
    var m = this.getChild("controlBar");
    m && !ht && !nr && (m.on("mouseenter", function(_) {
      this.player().options_.inactivityTimeout !== 0 && (this.player().cache_.inactivityTimeout = this.player().options_.inactivityTimeout), this.player().options_.inactivityTimeout = 0;
    }), m.on("mouseleave", function(_) {
      this.player().options_.inactivityTimeout = this.player().cache_.inactivityTimeout;
    })), this.on("keydown", o), this.on("keyup", o);
    var g;
    this.setInterval(function() {
      if (this.userActivity_) {
        this.userActivity_ = !1, this.userActive(!0), this.clearTimeout(g);
        var _ = this.options_.inactivityTimeout;
        _ <= 0 || (g = this.setTimeout(function() {
          this.userActivity_ || this.userActive(!1);
        }, _));
      }
    }, 250);
  }, n.playbackRate = function(e) {
    if (e !== void 0) {
      this.techCall_("setPlaybackRate", e);
      return;
    }
    return this.tech_ && this.tech_.featuresPlaybackRate ? this.cache_.lastPlaybackRate || this.techGet_("playbackRate") : 1;
  }, n.defaultPlaybackRate = function(e) {
    return e !== void 0 ? this.techCall_("setDefaultPlaybackRate", e) : this.tech_ && this.tech_.featuresPlaybackRate ? this.techGet_("defaultPlaybackRate") : 1;
  }, n.isAudio = function(e) {
    if (e !== void 0) {
      this.isAudio_ = !!e;
      return;
    }
    return !!this.isAudio_;
  }, n.enableAudioOnlyUI_ = function() {
    var e = this;
    this.addClass("vjs-audio-only-mode");
    var t = this.children(), a = this.getChild("ControlBar"), o = a && a.currentHeight();
    t.forEach(function(u) {
      u !== a && u.el_ && !u.hasClass("vjs-hidden") && (u.hide(), e.audioOnlyCache_.hiddenChildren.push(u));
    }), this.audioOnlyCache_.playerHeight = this.currentHeight(), this.height(o), this.trigger("audioonlymodechange");
  }, n.disableAudioOnlyUI_ = function() {
    this.removeClass("vjs-audio-only-mode"), this.audioOnlyCache_.hiddenChildren.forEach(function(e) {
      return e.show();
    }), this.height(this.audioOnlyCache_.playerHeight), this.trigger("audioonlymodechange");
  }, n.audioOnlyMode = function(e) {
    var t = this;
    if (typeof e != "boolean" || e === this.audioOnlyMode_)
      return this.audioOnlyMode_;
    this.audioOnlyMode_ = e;
    var a = this.options_.Promise || P.Promise;
    if (a) {
      if (e) {
        var o = [];
        return this.isInPictureInPicture() && o.push(this.exitPictureInPicture()), this.isFullscreen() && o.push(this.exitFullscreen()), this.audioPosterMode() && o.push(this.audioPosterMode(!1)), a.all(o).then(function() {
          return t.enableAudioOnlyUI_();
        });
      }
      return a.resolve().then(function() {
        return t.disableAudioOnlyUI_();
      });
    }
    e ? (this.isInPictureInPicture() && this.exitPictureInPicture(), this.isFullscreen() && this.exitFullscreen(), this.enableAudioOnlyUI_()) : this.disableAudioOnlyUI_();
  }, n.enablePosterModeUI_ = function() {
    var e = this.tech_ && this.tech_;
    e.hide(), this.addClass("vjs-audio-poster-mode"), this.trigger("audiopostermodechange");
  }, n.disablePosterModeUI_ = function() {
    var e = this.tech_ && this.tech_;
    e.show(), this.removeClass("vjs-audio-poster-mode"), this.trigger("audiopostermodechange");
  }, n.audioPosterMode = function(e) {
    var t = this;
    if (typeof e != "boolean" || e === this.audioPosterMode_)
      return this.audioPosterMode_;
    this.audioPosterMode_ = e;
    var a = this.options_.Promise || P.Promise;
    if (a) {
      if (e) {
        if (this.audioOnlyMode()) {
          var o = this.audioOnlyMode(!1);
          return o.then(function() {
            t.enablePosterModeUI_();
          });
        }
        return a.resolve().then(function() {
          t.enablePosterModeUI_();
        });
      }
      return a.resolve().then(function() {
        t.disablePosterModeUI_();
      });
    }
    if (e) {
      this.audioOnlyMode() && this.audioOnlyMode(!1), this.enablePosterModeUI_();
      return;
    }
    this.disablePosterModeUI_();
  }, n.addTextTrack = function(e, t, a) {
    if (this.tech_)
      return this.tech_.addTextTrack(e, t, a);
  }, n.addRemoteTextTrack = function(e, t) {
    if (this.tech_)
      return this.tech_.addRemoteTextTrack(e, t);
  }, n.removeRemoteTextTrack = function(e) {
    e === void 0 && (e = {});
    var t = e, a = t.track;
    if (a || (a = e), this.tech_)
      return this.tech_.removeRemoteTextTrack(a);
  }, n.getVideoPlaybackQuality = function() {
    return this.techGet_("getVideoPlaybackQuality");
  }, n.videoWidth = function() {
    return this.tech_ && this.tech_.videoWidth && this.tech_.videoWidth() || 0;
  }, n.videoHeight = function() {
    return this.tech_ && this.tech_.videoHeight && this.tech_.videoHeight() || 0;
  }, n.language = function(e) {
    if (e === void 0)
      return this.language_;
    this.language_ !== String(e).toLowerCase() && (this.language_ = String(e).toLowerCase(), tr(this) && this.trigger("languagechange"));
  }, n.languages = function() {
    return Fe(r.prototype.options_.languages, this.languages_);
  }, n.toJSON = function() {
    var e = Fe(this.options_), t = e.tracks;
    e.tracks = [];
    for (var a = 0; a < t.length; a++) {
      var o = t[a];
      o = Fe(o), o.player = void 0, e.tracks[a] = o;
    }
    return e;
  }, n.createModal = function(e, t) {
    var a = this;
    t = t || {}, t.content = e || "";
    var o = new di(this, t);
    return this.addChild(o), o.on("dispose", function() {
      a.removeChild(o);
    }), o.open(), o;
  }, n.updateCurrentBreakpoint_ = function() {
    if (this.responsive())
      for (var e = this.currentBreakpoint(), t = this.currentWidth(), a = 0; a < Os.length; a++) {
        var o = Os[a], u = this.breakpoints_[o];
        if (t <= u) {
          if (e === o)
            return;
          e && this.removeClass(Un[e]), this.addClass(Un[o]), this.breakpoint_ = o;
          break;
        }
      }
  }, n.removeCurrentBreakpoint_ = function() {
    var e = this.currentBreakpointClass();
    this.breakpoint_ = "", e && this.removeClass(e);
  }, n.breakpoints = function(e) {
    return e === void 0 ? Ue(this.breakpoints_) : (this.breakpoint_ = "", this.breakpoints_ = Ue({}, mv, e), this.updateCurrentBreakpoint_(), Ue(this.breakpoints_));
  }, n.responsive = function(e) {
    if (e === void 0)
      return this.responsive_;
    e = !!e;
    var t = this.responsive_;
    if (e !== t)
      return this.responsive_ = e, e ? (this.on("playerresize", this.boundUpdateCurrentBreakpoint_), this.updateCurrentBreakpoint_()) : (this.off("playerresize", this.boundUpdateCurrentBreakpoint_), this.removeCurrentBreakpoint_()), e;
  }, n.currentBreakpoint = function() {
    return this.breakpoint_;
  }, n.currentBreakpointClass = function() {
    return Un[this.breakpoint_] || "";
  }, n.loadMedia = function(e, t) {
    var a = this;
    if (!(!e || typeof e != "object")) {
      this.reset(), this.cache_.media = Fe(e);
      var o = this.cache_.media, u = o.artwork, l = o.poster, c = o.src, m = o.textTracks;
      !u && l && (this.cache_.media.artwork = [{
        src: l,
        type: $n(l)
      }]), c && this.src(c), l && this.poster(l), Array.isArray(m) && m.forEach(function(g) {
        return a.addRemoteTextTrack(g, !1);
      }), this.ready(t);
    }
  }, n.getMedia = function() {
    if (!this.cache_.media) {
      var e = this.poster(), t = this.currentSources(), a = Array.prototype.map.call(this.remoteTextTracks(), function(u) {
        return {
          kind: u.kind,
          label: u.label,
          language: u.language,
          src: u.src
        };
      }), o = {
        src: t,
        textTracks: a
      };
      return e && (o.poster = e, o.artwork = [{
        src: o.poster,
        type: $n(o.poster)
      }]), o;
    }
    return Fe(this.cache_.media);
  }, r.getTagSettings = function(e) {
    var t = {
      sources: [],
      tracks: []
    }, a = Qt(e), o = a["data-setup"];
    if (Fr(e, "vjs-fill") && (a.fill = !0), Fr(e, "vjs-fluid") && (a.fluid = !0), o !== null) {
      var u = Kh(o || "{}"), l = u[0], c = u[1];
      l && Te.error(l), Ue(a, c);
    }
    if (Ue(t, a), e.hasChildNodes())
      for (var m = e.childNodes, g = 0, _ = m.length; g < _; g++) {
        var C = m[g], w = C.nodeName.toLowerCase();
        w === "source" ? t.sources.push(Qt(C)) : w === "track" && t.tracks.push(Qt(C));
      }
    return t;
  }, n.flexNotSupported_ = function() {
    var e = ae.createElement("i");
    return !("flexBasis" in e.style || "webkitFlexBasis" in e.style || "mozFlexBasis" in e.style || "msFlexBasis" in e.style || // IE10-specific (2012 flex spec), available for completeness
    "msFlexOrder" in e.style);
  }, n.debug = function(e) {
    if (e === void 0)
      return this.debugEnabled_;
    e ? (this.trigger("debugon"), this.previousLogLevel_ = this.log.level, this.log.level("debug"), this.debugEnabled_ = !0) : (this.trigger("debugoff"), this.log.level(this.previousLogLevel_), this.previousLogLevel_ = void 0, this.debugEnabled_ = !1);
  }, n.playbackRates = function(e) {
    if (e === void 0)
      return this.cache_.playbackRates;
    Array.isArray(e) && e.every(function(t) {
      return typeof t == "number";
    }) && (this.cache_.playbackRates = e, this.trigger("playbackrateschange"));
  }, r;
})(te);
lt.names.forEach(function(s) {
  var r = lt[s];
  Ke.prototype[r.getterName] = function() {
    return this.tech_ ? this.tech_[r.getterName]() : (this[r.privateName] = this[r.privateName] || new r.ListClass(), this[r.privateName]);
  };
});
Ke.prototype.crossorigin = Ke.prototype.crossOrigin;
Ke.players = {};
var wi = P.navigator;
Ke.prototype.options_ = {
  // Default order of fallback technology
  techOrder: we.defaultTechOrder_,
  html5: {},
  // default inactivity timeout
  inactivityTimeout: 2e3,
  // default playback rates
  playbackRates: [],
  // Add playback rate selection by adding rates
  // 'playbackRates': [0.5, 1, 1.5, 2],
  liveui: !1,
  // Included control sets
  children: ["mediaLoader", "posterImage", "textTrackDisplay", "loadingSpinner", "bigPlayButton", "liveTracker", "controlBar", "errorDisplay", "textTrackSettings", "resizeManager"],
  language: wi && (wi.languages && wi.languages[0] || wi.userLanguage || wi.language) || "en",
  // locales and their language translations
  languages: {},
  // Default message to show when a video cannot be played.
  notSupportedMessage: "No compatible source was found for this media.",
  normalizeAutoplay: !1,
  fullscreen: {
    options: {
      navigationUI: "hide"
    }
  },
  breakpoints: {},
  responsive: !1,
  audioOnlyMode: !1,
  audioPosterMode: !1
};
[
  /**
   * Returns whether or not the player is in the "ended" state.
   *
   * @return {Boolean} True if the player is in the ended state, false if not.
   * @method Player#ended
   */
  "ended",
  /**
   * Returns whether or not the player is in the "seeking" state.
   *
   * @return {Boolean} True if the player is in the seeking state, false if not.
   * @method Player#seeking
   */
  "seeking",
  /**
   * Returns the TimeRanges of the media that are currently available
   * for seeking to.
   *
   * @return {TimeRanges} the seekable intervals of the media timeline
   * @method Player#seekable
   */
  "seekable",
  /**
   * Returns the current state of network activity for the element, from
   * the codes in the list below.
   * - NETWORK_EMPTY (numeric value 0)
   *   The element has not yet been initialised. All attributes are in
   *   their initial states.
   * - NETWORK_IDLE (numeric value 1)
   *   The element's resource selection algorithm is active and has
   *   selected a resource, but it is not actually using the network at
   *   this time.
   * - NETWORK_LOADING (numeric value 2)
   *   The user agent is actively trying to download data.
   * - NETWORK_NO_SOURCE (numeric value 3)
   *   The element's resource selection algorithm is active, but it has
   *   not yet found a resource to use.
   *
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#network-states
   * @return {number} the current network activity state
   * @method Player#networkState
   */
  "networkState",
  /**
   * Returns a value that expresses the current state of the element
   * with respect to rendering the current playback position, from the
   * codes in the list below.
   * - HAVE_NOTHING (numeric value 0)
   *   No information regarding the media resource is available.
   * - HAVE_METADATA (numeric value 1)
   *   Enough of the resource has been obtained that the duration of the
   *   resource is available.
   * - HAVE_CURRENT_DATA (numeric value 2)
   *   Data for the immediate current playback position is available.
   * - HAVE_FUTURE_DATA (numeric value 3)
   *   Data for the immediate current playback position is available, as
   *   well as enough data for the user agent to advance the current
   *   playback position in the direction of playback.
   * - HAVE_ENOUGH_DATA (numeric value 4)
   *   The user agent estimates that enough data is available for
   *   playback to proceed uninterrupted.
   *
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-readystate
   * @return {number} the current playback rendering state
   * @method Player#readyState
   */
  "readyState"
].forEach(function(s) {
  Ke.prototype[s] = function() {
    return this.techGet_(s);
  };
});
Sc.forEach(function(s) {
  Ke.prototype["handleTech" + Ge(s) + "_"] = function() {
    return this.trigger(s);
  };
});
te.registerComponent("Player", Ke);
var Qn = "plugin", Yr = "activePlugins_", zr = {}, Jn = function(r) {
  return zr.hasOwnProperty(r);
}, Vn = function(r) {
  return Jn(r) ? zr[r] : void 0;
}, Ec = function(r, n) {
  r[Yr] = r[Yr] || {}, r[Yr][n] = !0;
}, Zn = function(r, n, i) {
  var e = (i ? "before" : "") + "pluginsetup";
  r.trigger(e, n), r.trigger(e + ":" + n.name, n);
}, gv = function(r, n) {
  var i = function() {
    Zn(this, {
      name: r,
      plugin: n,
      instance: null
    }, !0);
    var t = n.apply(this, arguments);
    return Ec(this, r), Zn(this, {
      name: r,
      plugin: n,
      instance: t
    }), t;
  };
  return Object.keys(n).forEach(function(e) {
    i[e] = n[e];
  }), i;
}, wl = function(r, n) {
  return n.prototype.name = r, function() {
    Zn(this, {
      name: r,
      plugin: n,
      instance: null
    }, !0);
    for (var i = arguments.length, e = new Array(i), t = 0; t < i; t++)
      e[t] = arguments[t];
    var a = td(n, [this].concat(e));
    return this[r] = function() {
      return a;
    }, Zn(this, a.getEventHash()), a;
  };
}, Gt = /* @__PURE__ */ (function() {
  function s(n) {
    if (this.constructor === s)
      throw new Error("Plugin must be sub-classed; not directly instantiated.");
    this.player = n, this.log || (this.log = this.player.log.createLogger(this.name)), no(this), delete this.trigger, zd(this, this.constructor.defaultState), Ec(n, this.name), this.dispose = this.dispose.bind(this), n.on("dispose", this.dispose);
  }
  var r = s.prototype;
  return r.version = function() {
    return this.constructor.VERSION;
  }, r.getEventHash = function(i) {
    return i === void 0 && (i = {}), i.name = this.name, i.plugin = this.constructor, i.instance = this, i;
  }, r.trigger = function(i, e) {
    return e === void 0 && (e = {}), li(this.eventBusEl_, i, this.getEventHash(e));
  }, r.handleStateChanged = function(i) {
  }, r.dispose = function() {
    var i = this.name, e = this.player;
    this.trigger("dispose"), this.off(), e.off("dispose", this.dispose), e[Yr][i] = !1, this.player = this.state = null, e[i] = wl(i, zr[i]);
  }, s.isBasic = function(i) {
    var e = typeof i == "string" ? Vn(i) : i;
    return typeof e == "function" && !s.prototype.isPrototypeOf(e.prototype);
  }, s.registerPlugin = function(i, e) {
    if (typeof i != "string")
      throw new Error('Illegal plugin name, "' + i + '", must be a string, was ' + typeof i + ".");
    if (Jn(i))
      Te.warn('A plugin named "' + i + '" already exists. You may want to avoid re-registering plugins!');
    else if (Ke.prototype.hasOwnProperty(i))
      throw new Error('Illegal plugin name, "' + i + '", cannot share a name with an existing player method!');
    if (typeof e != "function")
      throw new Error('Illegal plugin for "' + i + '", must be a function, was ' + typeof e + ".");
    return zr[i] = e, i !== Qn && (s.isBasic(e) ? Ke.prototype[i] = gv(i, e) : Ke.prototype[i] = wl(i, e)), e;
  }, s.deregisterPlugin = function(i) {
    if (i === Qn)
      throw new Error("Cannot de-register base plugin.");
    Jn(i) && (delete zr[i], delete Ke.prototype[i]);
  }, s.getPlugins = function(i) {
    i === void 0 && (i = Object.keys(zr));
    var e;
    return i.forEach(function(t) {
      var a = Vn(t);
      a && (e = e || {}, e[t] = a);
    }), e;
  }, s.getPluginVersion = function(i) {
    var e = Vn(i);
    return e && e.VERSION || "";
  }, s;
})();
Gt.getPlugin = Vn;
Gt.BASE_PLUGIN_NAME = Qn;
Gt.registerPlugin(Qn, Gt);
Ke.prototype.usingPlugin = function(s) {
  return !!this[Yr] && this[Yr][s] === !0;
};
Ke.prototype.hasPlugin = function(s) {
  return !!Jn(s);
};
var kl = !1, vv = function(r, n) {
  n === void 0 && (n = {}), kl || (Te.warn("videojs.extend is deprecated as of Video.js 7.22.0 and will be removed in Video.js 8.0.0"), kl = !0);
  var i = function() {
    r.apply(this, arguments);
  }, e = {};
  typeof n == "object" ? (n.constructor !== Object.prototype.constructor && (i = n.constructor), e = n) : typeof n == "function" && (i = n), np(i, r), r && (i.super_ = r);
  for (var t in e)
    e.hasOwnProperty(t) && (i.prototype[t] = e[t]);
  return i;
}, Cc = function(r) {
  return r.indexOf("#") === 0 ? r.slice(1) : r;
};
function V(s, r, n) {
  var i = V.getPlayer(s);
  if (i)
    return r && Te.warn('Player "' + s + '" is already initialised. Options will not be applied.'), n && i.ready(n), i;
  var e = typeof s == "string" ? mr("#" + Cc(s)) : s;
  if (!ui(e))
    throw new TypeError("The element or ID supplied is not valid. (videojs)");
  (!e.ownerDocument.defaultView || !e.ownerDocument.body.contains(e)) && Te.warn("The element supplied is not included in the DOM"), r = r || {}, r.restoreEl === !0 && (r.restoreEl = (e.parentNode && e.parentNode.hasAttribute("data-vjs-player") ? e.parentNode : e).cloneNode(!0)), pr("beforesetup").forEach(function(a) {
    var o = a(e, Fe(r));
    if (!rr(o) || Array.isArray(o)) {
      Te.error("please return an object in beforesetup hooks");
      return;
    }
    r = Fe(r, o);
  });
  var t = te.getComponent("Player");
  return i = new t(e, r, n), pr("setup").forEach(function(a) {
    return a(i);
  }), i;
}
V.hooks_ = Jt;
V.hooks = pr;
V.hook = Wm;
V.hookOnce = Gm;
V.removeHook = vd;
if (P.VIDEOJS_NO_DYNAMIC_STYLE !== !0 && oi()) {
  var In = mr(".vjs-styles-defaults");
  if (!In) {
    In = Vd("vjs-styles-defaults");
    var fs = mr("head");
    fs && fs.insertBefore(In, fs.firstChild), qd(In, `
      .video-js {
        width: 300px;
        height: 150px;
      }

      .vjs-fluid:not(.vjs-audio-only-mode) {
        padding-top: 56.25%
      }
    `);
  }
}
As(1, V);
V.VERSION = gd;
V.options = Ke.prototype.options_;
V.getPlayers = function() {
  return Ke.players;
};
V.getPlayer = function(s) {
  var r = Ke.players, n;
  if (typeof s == "string") {
    var i = Cc(s), e = r[i];
    if (e)
      return e;
    n = mr("#" + i);
  } else
    n = s;
  if (ui(n)) {
    var t = n, a = t.player, o = t.playerId;
    if (a || r[o])
      return a || r[o];
  }
};
V.getAllPlayers = function() {
  return (
    // Disposed players leave a key with a `null` value, so we need to make sure
    // we filter those out.
    Object.keys(Ke.players).map(function(s) {
      return Ke.players[s];
    }).filter(Boolean)
  );
};
V.players = Ke.players;
V.getComponent = te.getComponent;
V.registerComponent = function(s, r) {
  we.isTech(r) && Te.warn("The " + s + " tech was registered as a component. It should instead be registered using videojs.registerTech(name, tech)"), te.registerComponent.call(te, s, r);
};
V.getTech = we.getTech;
V.registerTech = we.registerTech;
V.use = Dg;
Object.defineProperty(V, "middleware", {
  value: {},
  writeable: !1,
  enumerable: !0
});
Object.defineProperty(V.middleware, "TERMINATOR", {
  value: Kn,
  writeable: !1,
  enumerable: !0
});
V.browser = Qm;
V.TOUCH_ENABLED = ti;
V.extend = vv;
V.mergeOptions = Fe;
V.bind = Re;
V.registerPlugin = Gt.registerPlugin;
V.deregisterPlugin = Gt.deregisterPlugin;
V.plugin = function(s, r) {
  return Te.warn("videojs.plugin() is deprecated; use videojs.registerPlugin() instead"), Gt.registerPlugin(s, r);
};
V.getPlugins = Gt.getPlugins;
V.getPlugin = Gt.getPlugin;
V.getPluginVersion = Gt.getPluginVersion;
V.addLanguage = function(s, r) {
  var n;
  return s = ("" + s).toLowerCase(), V.options.languages = Fe(V.options.languages, (n = {}, n[s] = r, n)), V.options.languages[s];
};
V.log = Te;
V.createLogger = _d;
V.createTimeRange = V.createTimeRanges = Rr;
V.formatTime = si;
V.setFormatTime = zg;
V.resetFormatTime = Kg;
V.parseUrl = so;
V.isCrossOrigin = Ta;
V.EventTarget = Ze;
V.on = xt;
V.one = ya;
V.off = at;
V.trigger = li;
V.xhr = Zl;
V.TextTrack = $i;
V.AudioTrack = Yd;
V.VideoTrack = Qd;
["isEl", "isTextNode", "createEl", "hasClass", "addClass", "removeClass", "toggleClass", "setAttributes", "getAttributes", "emptyEl", "appendContent", "insertContent"].forEach(function(s) {
  V[s] = function() {
    return Te.warn("videojs." + s + "() is deprecated; use videojs.dom." + s + "() instead"), Bd[s].apply(null, arguments);
  };
});
V.computedStyle = Vi;
V.dom = Bd;
V.url = Sg;
V.defineLazyProperty = Ao;
V.addLanguage("en", {
  "Non-Fullscreen": "Exit Fullscreen"
});
/*! @name @videojs/http-streaming @version 2.16.3 @license Apache-2.0 */
var Pt = la, ea = function(r, n, i) {
  return r && i && i.responseURL && n !== i.responseURL ? i.responseURL : n;
}, Ft = function(r) {
  return V.log.debug ? V.log.debug.bind(V, "VHS:", r + " >") : function() {
  };
}, gr = 1 / 30, Ht = gr * 3, Ac = function(r, n) {
  var i = [], e;
  if (r && r.length)
    for (e = 0; e < r.length; e++)
      n(r.start(e), r.end(e)) && i.push([r.start(e), r.end(e)]);
  return V.createTimeRanges(i);
}, Kr = function(r, n) {
  return Ac(r, function(i, e) {
    return i - Ht <= n && e + Ht >= n;
  });
}, On = function(r, n) {
  return Ac(r, function(i) {
    return i - gr >= n;
  });
}, yv = function(r) {
  if (r.length < 2)
    return V.createTimeRanges();
  for (var n = [], i = 1; i < r.length; i++) {
    var e = r.end(i - 1), t = r.start(i);
    n.push([e, t]);
  }
  return V.createTimeRanges(n);
}, _v = function(r, n) {
  var i = null, e = null, t = 0, a = [], o = [];
  if (!r || !r.length || !n || !n.length)
    return V.createTimeRange();
  for (var u = r.length; u--; )
    a.push({
      time: r.start(u),
      type: "start"
    }), a.push({
      time: r.end(u),
      type: "end"
    });
  for (u = n.length; u--; )
    a.push({
      time: n.start(u),
      type: "start"
    }), a.push({
      time: n.end(u),
      type: "end"
    });
  for (a.sort(function(l, c) {
    return l.time - c.time;
  }), u = 0; u < a.length; u++)
    a[u].type === "start" ? (t++, t === 2 && (i = a[u].time)) : a[u].type === "end" && (t--, t === 1 && (e = a[u].time)), i !== null && e !== null && (o.push([i, e]), i = null, e = null);
  return V.createTimeRanges(o);
}, Dc = function(r) {
  var n = [];
  if (!r || !r.length)
    return "";
  for (var i = 0; i < r.length; i++)
    n.push(r.start(i) + " => " + r.end(i));
  return n.join(", ");
}, Tv = function(r, n, i) {
  i === void 0 && (i = 1);
  var e = r.length ? r.end(r.length - 1) : 0;
  return (e - n) / i;
}, Or = function(r) {
  for (var n = [], i = 0; i < r.length; i++)
    n.push({
      start: r.start(i),
      end: r.end(i)
    });
  return n;
}, bv = function(r, n) {
  if (r === n)
    return !1;
  if (!r && n || !n && r || r.length !== n.length)
    return !0;
  for (var i = 0; i < r.length; i++)
    if (r.start(i) !== n.start(i) || r.end(i) !== n.end(i))
      return !0;
  return !1;
}, Pl = function(r) {
  if (!(!r || !r.length || !r.end))
    return r.end(r.length - 1);
}, Do = function(r, n) {
  var i = 0;
  if (!r || !r.length)
    return i;
  for (var e = 0; e < r.length; e++) {
    var t = r.start(e), a = r.end(e);
    if (!(n > a)) {
      if (n > t && n <= a) {
        i += a - n;
        continue;
      }
      i += a - t;
    }
  }
  return i;
}, Il = V.createTimeRange, wo = function(r, n) {
  if (!n.preload)
    return n.duration;
  var i = 0;
  return (n.parts || []).forEach(function(e) {
    i += e.duration;
  }), (n.preloadHints || []).forEach(function(e) {
    e.type === "PART" && (i += r.partTargetDuration);
  }), i;
}, Ls = function(r) {
  return (r.segments || []).reduce(function(n, i, e) {
    return i.parts ? i.parts.forEach(function(t, a) {
      n.push({
        duration: t.duration,
        segmentIndex: e,
        partIndex: a,
        part: t,
        segment: i
      });
    }) : n.push({
      duration: i.duration,
      segmentIndex: e,
      partIndex: null,
      segment: i,
      part: null
    }), n;
  }, []);
}, wc = function(r) {
  var n = r.segments && r.segments.length && r.segments[r.segments.length - 1];
  return n && n.parts || [];
}, kc = function(r) {
  var n = r.preloadSegment;
  if (n) {
    var i = n.parts, e = n.preloadHints, t = (e || []).reduce(function(a, o) {
      return a + (o.type === "PART" ? 1 : 0);
    }, 0);
    return t += i && i.length ? i.length : 0, t;
  }
}, Pc = function(r, n) {
  if (n.endList)
    return 0;
  if (r && r.suggestedPresentationDelay)
    return r.suggestedPresentationDelay;
  var i = wc(n).length > 0;
  return i && n.serverControl && n.serverControl.partHoldBack ? n.serverControl.partHoldBack : i && n.partTargetDuration ? n.partTargetDuration * 3 : n.serverControl && n.serverControl.holdBack ? n.serverControl.holdBack : n.targetDuration ? n.targetDuration * 3 : 0;
}, xv = function(r, n) {
  var i = 0, e = n - r.mediaSequence, t = r.segments[e];
  if (t) {
    if (typeof t.start < "u")
      return {
        result: t.start,
        precise: !0
      };
    if (typeof t.end < "u")
      return {
        result: t.end - t.duration,
        precise: !0
      };
  }
  for (; e--; ) {
    if (t = r.segments[e], typeof t.end < "u")
      return {
        result: i + t.end,
        precise: !0
      };
    if (i += wo(r, t), typeof t.start < "u")
      return {
        result: i + t.start,
        precise: !0
      };
  }
  return {
    result: i,
    precise: !1
  };
}, Sv = function(r, n) {
  for (var i = 0, e, t = n - r.mediaSequence; t < r.segments.length; t++) {
    if (e = r.segments[t], typeof e.start < "u")
      return {
        result: e.start - i,
        precise: !0
      };
    if (i += wo(r, e), typeof e.end < "u")
      return {
        result: e.end - i,
        precise: !0
      };
  }
  return {
    result: -1,
    precise: !1
  };
}, Ic = function(r, n, i) {
  if (typeof n > "u" && (n = r.mediaSequence + r.segments.length), n < r.mediaSequence)
    return 0;
  var e = xv(r, n);
  if (e.precise)
    return e.result;
  var t = Sv(r, n);
  return t.precise ? t.result : e.result + i;
}, Oc = function(r, n, i) {
  if (!r)
    return 0;
  if (typeof i != "number" && (i = 0), typeof n > "u") {
    if (r.totalDuration)
      return r.totalDuration;
    if (!r.endList)
      return P.Infinity;
  }
  return Ic(r, n, i);
}, Ri = function(r) {
  var n = r.defaultDuration, i = r.durationList, e = r.startIndex, t = r.endIndex, a = 0;
  if (e > t) {
    var o = [t, e];
    e = o[0], t = o[1];
  }
  if (e < 0) {
    for (var u = e; u < Math.min(0, t); u++)
      a += n;
    e = 0;
  }
  for (var l = e; l < t; l++)
    a += i[l].duration;
  return a;
}, Lc = function(r, n, i, e) {
  if (!r || !r.segments)
    return null;
  if (r.endList)
    return Oc(r);
  if (n === null)
    return null;
  n = n || 0;
  var t = Ic(r, r.mediaSequence + r.segments.length, n);
  return i && (e = typeof e == "number" ? e : Pc(null, r), t -= e), Math.max(0, t);
}, Ev = function(r, n, i) {
  var e = !0, t = n || 0, a = Lc(r, n, e, i);
  return a === null ? Il() : Il(t, a);
}, Cv = function(r) {
  for (var n = r.playlist, i = r.currentTime, e = r.startingSegmentIndex, t = r.startingPartIndex, a = r.startTime, o = r.experimentalExactManifestTimings, u = i - a, l = Ls(n), c = 0, m = 0; m < l.length; m++) {
    var g = l[m];
    if (e === g.segmentIndex && !(typeof t == "number" && typeof g.partIndex == "number" && t !== g.partIndex)) {
      c = m;
      break;
    }
  }
  if (u < 0) {
    if (c > 0)
      for (var _ = c - 1; _ >= 0; _--) {
        var C = l[_];
        if (u += C.duration, o) {
          if (u < 0)
            continue;
        } else if (u + gr <= 0)
          continue;
        return {
          partIndex: C.partIndex,
          segmentIndex: C.segmentIndex,
          startTime: a - Ri({
            defaultDuration: n.targetDuration,
            durationList: l,
            startIndex: c,
            endIndex: _
          })
        };
      }
    return {
      partIndex: l[0] && l[0].partIndex || null,
      segmentIndex: l[0] && l[0].segmentIndex || 0,
      startTime: i
    };
  }
  if (c < 0) {
    for (var w = c; w < 0; w++)
      if (u -= n.targetDuration, u < 0)
        return {
          partIndex: l[0] && l[0].partIndex || null,
          segmentIndex: l[0] && l[0].segmentIndex || 0,
          startTime: i
        };
    c = 0;
  }
  for (var E = c; E < l.length; E++) {
    var M = l[E];
    if (u -= M.duration, o) {
      if (u > 0)
        continue;
    } else if (u - gr >= 0)
      continue;
    return {
      partIndex: M.partIndex,
      segmentIndex: M.segmentIndex,
      startTime: a + Ri({
        defaultDuration: n.targetDuration,
        durationList: l,
        startIndex: c,
        endIndex: E
      })
    };
  }
  return {
    segmentIndex: l[l.length - 1].segmentIndex,
    partIndex: l[l.length - 1].partIndex,
    startTime: i
  };
}, Fc = function(r) {
  return r.excludeUntil && r.excludeUntil > Date.now();
}, ko = function(r) {
  return r.excludeUntil && r.excludeUntil === 1 / 0;
}, Ea = function(r) {
  var n = Fc(r);
  return !r.disabled && !n;
}, Av = function(r) {
  return r.disabled;
}, Dv = function(r) {
  for (var n = 0; n < r.segments.length; n++)
    if (r.segments[n].key)
      return !0;
  return !1;
}, Rc = function(r, n) {
  return n.attributes && n.attributes[r];
}, wv = function(r, n, i, e) {
  if (e === void 0 && (e = 0), !Rc("BANDWIDTH", i))
    return NaN;
  var t = r * i.attributes.BANDWIDTH;
  return (t - e * 8) / n;
}, Fs = function(r, n) {
  if (r.playlists.length === 1)
    return !0;
  var i = n.attributes.BANDWIDTH || Number.MAX_VALUE;
  return r.playlists.filter(function(e) {
    return Ea(e) ? (e.attributes.BANDWIDTH || 0) < i : !1;
  }).length === 0;
}, Po = function(r, n) {
  return !r && !n || !r && n || r && !n ? !1 : !!(r === n || r.id && n.id && r.id === n.id || r.resolvedUri && n.resolvedUri && r.resolvedUri === n.resolvedUri || r.uri && n.uri && r.uri === n.uri);
}, Ol = function(r, n) {
  var i = r && r.mediaGroups && r.mediaGroups.AUDIO || {}, e = !1;
  for (var t in i) {
    for (var a in i[t])
      if (e = n(i[t][a]), e)
        break;
    if (e)
      break;
  }
  return !!e;
}, Qi = function(r) {
  if (!r || !r.playlists || !r.playlists.length) {
    var n = Ol(r, function(a) {
      return a.playlists && a.playlists.length || a.uri;
    });
    return n;
  }
  for (var i = function(o) {
    var u = r.playlists[o], l = u.attributes && u.attributes.CODECS;
    if (l && l.split(",").every(function(m) {
      return nd(m);
    }))
      return "continue";
    var c = Ol(r, function(m) {
      return Po(u, m);
    });
    return c ? "continue" : {
      v: !1
    };
  }, e = 0; e < r.playlists.length; e++) {
    var t = i(e);
    if (t !== "continue" && typeof t == "object")
      return t.v;
  }
  return !0;
}, vt = {
  liveEdgeDelay: Pc,
  duration: Oc,
  seekable: Ev,
  getMediaInfoForTime: Cv,
  isEnabled: Ea,
  isDisabled: Av,
  isBlacklisted: Fc,
  isIncompatible: ko,
  playlistEnd: Lc,
  isAes: Dv,
  hasAttribute: Rc,
  estimateSegmentRequestTime: wv,
  isLowestEnabledRendition: Fs,
  isAudioOnly: Qi,
  playlistMatch: Po,
  segmentDurationWithParts: wo
}, Mc = V.log, Io = function(r, n) {
  return r + "-" + n;
}, kv = function(r, n, i) {
  return "placeholder-uri-" + r + "-" + n + "-" + i;
}, Pv = function(r) {
  var n = r.onwarn, i = r.oninfo, e = r.manifestString, t = r.customTagParsers, a = t === void 0 ? [] : t, o = r.customTagMappers, u = o === void 0 ? [] : o, l = r.experimentalLLHLS, c = new hp();
  n && c.on("warn", n), i && c.on("info", i), a.forEach(function(w) {
    return c.addParser(w);
  }), u.forEach(function(w) {
    return c.addTagMapper(w);
  }), c.push(e), c.end();
  var m = c.manifest;
  if (l || (["preloadSegment", "skip", "serverControl", "renditionReports", "partInf", "partTargetDuration"].forEach(function(w) {
    m.hasOwnProperty(w) && delete m[w];
  }), m.segments && m.segments.forEach(function(w) {
    ["parts", "preloadHints"].forEach(function(E) {
      w.hasOwnProperty(E) && delete w[E];
    });
  })), !m.targetDuration) {
    var g = 10;
    m.segments && m.segments.length && (g = m.segments.reduce(function(w, E) {
      return Math.max(w, E.duration);
    }, 0)), n && n("manifest has no targetDuration defaulting to " + g), m.targetDuration = g;
  }
  var _ = wc(m);
  if (_.length && !m.partTargetDuration) {
    var C = _.reduce(function(w, E) {
      return Math.max(w, E.duration);
    }, 0);
    n && (n("manifest has no partTargetDuration defaulting to " + C), Mc.error("LL-HLS manifest has parts but lacks required #EXT-X-PART-INF:PART-TARGET value. See https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis-09#section-4.4.3.7. Playback is not guaranteed.")), m.partTargetDuration = C;
  }
  return m;
}, pi = function(r, n) {
  r.mediaGroups && ["AUDIO", "SUBTITLES"].forEach(function(i) {
    if (r.mediaGroups[i])
      for (var e in r.mediaGroups[i])
        for (var t in r.mediaGroups[i][e]) {
          var a = r.mediaGroups[i][e][t];
          n(a, i, e, t);
        }
  });
}, Nc = function(r) {
  var n = r.playlist, i = r.uri, e = r.id;
  n.id = e, n.playlistErrors_ = 0, i && (n.uri = i), n.attributes = n.attributes || {};
}, Iv = function(r) {
  for (var n = r.playlists.length; n--; ) {
    var i = r.playlists[n];
    Nc({
      playlist: i,
      id: Io(n, i.uri)
    }), i.resolvedUri = Pt(r.uri, i.uri), r.playlists[i.id] = i, r.playlists[i.uri] = i, i.attributes.BANDWIDTH || Mc.warn("Invalid playlist STREAM-INF detected. Missing BANDWIDTH attribute.");
  }
}, Ov = function(r) {
  pi(r, function(n) {
    n.uri && (n.resolvedUri = Pt(r.uri, n.uri));
  });
}, Lv = function(r, n) {
  var i = Io(0, n), e = {
    mediaGroups: {
      AUDIO: {},
      VIDEO: {},
      "CLOSED-CAPTIONS": {},
      SUBTITLES: {}
    },
    uri: P.location.href,
    resolvedUri: P.location.href,
    playlists: [{
      uri: n,
      id: i,
      resolvedUri: n,
      // m3u8-parser does not attach an attributes property to media playlists so make
      // sure that the property is attached to avoid undefined reference errors
      attributes: {}
    }]
  };
  return e.playlists[i] = e.playlists[0], e.playlists[n] = e.playlists[0], e;
}, Bc = function(r, n, i) {
  i === void 0 && (i = kv), r.uri = n;
  for (var e = 0; e < r.playlists.length; e++)
    if (!r.playlists[e].uri) {
      var t = "placeholder-uri-" + e;
      r.playlists[e].uri = t;
    }
  var a = Qi(r);
  pi(r, function(o, u, l, c) {
    if (!o.playlists || !o.playlists.length) {
      if (a && u === "AUDIO" && !o.uri)
        for (var m = 0; m < r.playlists.length; m++) {
          var g = r.playlists[m];
          if (g.attributes && g.attributes.AUDIO && g.attributes.AUDIO === l)
            return;
        }
      o.playlists = [Ot({}, o)];
    }
    o.playlists.forEach(function(_, C) {
      var w = i(u, l, c, _), E = Io(C, w);
      _.uri ? _.resolvedUri = _.resolvedUri || Pt(r.uri, _.uri) : (_.uri = C === 0 ? w : E, _.resolvedUri = _.uri), _.id = _.id || E, _.attributes = _.attributes || {}, r.playlists[_.id] = _, r.playlists[_.uri] = _;
    });
  }), Iv(r), Ov(r);
}, ta = V.mergeOptions, Fv = V.EventTarget, Rv = function(r, n) {
  if (n.endList || !n.serverControl)
    return r;
  var i = {};
  if (n.serverControl.canBlockReload) {
    var e = n.preloadSegment, t = n.mediaSequence + n.segments.length;
    if (e) {
      var a = e.parts || [], o = kc(n) - 1;
      o > -1 && o !== a.length - 1 && (i._HLS_part = o), (o > -1 || a.length) && t--;
    }
    i._HLS_msn = t;
  }
  if (n.serverControl && n.serverControl.canSkipUntil && (i._HLS_skip = n.serverControl.canSkipDateranges ? "v2" : "YES"), Object.keys(i).length) {
    var u = new P.URL(r);
    ["_HLS_skip", "_HLS_msn", "_HLS_part"].forEach(function(l) {
      i.hasOwnProperty(l) && u.searchParams.set(l, i[l]);
    }), r = u.toString();
  }
  return r;
}, Mv = function(r, n) {
  if (!r)
    return n;
  var i = ta(r, n);
  if (r.preloadHints && !n.preloadHints && delete i.preloadHints, r.parts && !n.parts)
    delete i.parts;
  else if (r.parts && n.parts)
    for (var e = 0; e < n.parts.length; e++)
      r.parts && r.parts[e] && (i.parts[e] = ta(r.parts[e], n.parts[e]));
  return !r.skipped && n.skipped && (i.skipped = !1), r.preload && !n.preload && (i.preload = !1), i;
}, Nv = function(r, n, i) {
  var e = r.slice(), t = n.slice();
  i = i || 0;
  for (var a = [], o, u = 0; u < t.length; u++) {
    var l = e[u + i], c = t[u];
    l ? (o = l.map || o, a.push(Mv(l, c))) : (o && !c.map && (c.map = o), a.push(c));
  }
  return a;
}, Uc = function(r, n) {
  !r.resolvedUri && r.uri && (r.resolvedUri = Pt(n, r.uri)), r.key && !r.key.resolvedUri && (r.key.resolvedUri = Pt(n, r.key.uri)), r.map && !r.map.resolvedUri && (r.map.resolvedUri = Pt(n, r.map.uri)), r.map && r.map.key && !r.map.key.resolvedUri && (r.map.key.resolvedUri = Pt(n, r.map.key.uri)), r.parts && r.parts.length && r.parts.forEach(function(i) {
    i.resolvedUri || (i.resolvedUri = Pt(n, i.uri));
  }), r.preloadHints && r.preloadHints.length && r.preloadHints.forEach(function(i) {
    i.resolvedUri || (i.resolvedUri = Pt(n, i.uri));
  });
}, Vc = function(r) {
  var n = r.segments || [], i = r.preloadSegment;
  if (i && i.parts && i.parts.length) {
    if (i.preloadHints) {
      for (var e = 0; e < i.preloadHints.length; e++)
        if (i.preloadHints[e].type === "MAP")
          return n;
    }
    i.duration = r.targetDuration, i.preload = !0, n.push(i);
  }
  return n;
}, qc = function(r, n) {
  return r === n || r.segments && n.segments && r.segments.length === n.segments.length && r.endList === n.endList && r.mediaSequence === n.mediaSequence && r.preloadSegment === n.preloadSegment;
}, Rs = function(r, n, i) {
  i === void 0 && (i = qc);
  var e = ta(r, {}), t = e.playlists[n.id];
  if (!t || i(t, n))
    return null;
  n.segments = Vc(n);
  var a = ta(t, n);
  if (a.preloadSegment && !n.preloadSegment && delete a.preloadSegment, t.segments) {
    if (n.skip) {
      n.segments = n.segments || [];
      for (var o = 0; o < n.skip.skippedSegments; o++)
        n.segments.unshift({
          skipped: !0
        });
    }
    a.segments = Nv(t.segments, n.segments, n.mediaSequence - t.mediaSequence);
  }
  a.segments.forEach(function(l) {
    Uc(l, a.resolvedUri);
  });
  for (var u = 0; u < e.playlists.length; u++)
    e.playlists[u].id === n.id && (e.playlists[u] = a);
  return e.playlists[n.id] = a, e.playlists[n.uri] = a, pi(r, function(l, c, m, g) {
    if (l.playlists)
      for (var _ = 0; _ < l.playlists.length; _++)
        n.id === l.playlists[_].id && (l.playlists[_] = a);
  }), e;
}, Ms = function(r, n) {
  var i = r.segments || [], e = i[i.length - 1], t = e && e.parts && e.parts[e.parts.length - 1], a = t && t.duration || e && e.duration;
  return n && a ? a * 1e3 : (r.partTargetDuration || r.targetDuration || 10) * 500;
}, $r = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    var a;
    if (t === void 0 && (t = {}), a = s.call(this) || this, !i)
      throw new Error("A non-empty playlist URL or object is required");
    a.logger_ = Ft("PlaylistLoader");
    var o = t, u = o.withCredentials, l = u === void 0 ? !1 : u, c = o.handleManifestRedirects, m = c === void 0 ? !1 : c;
    a.src = i, a.vhs_ = e, a.withCredentials = l, a.handleManifestRedirects = m;
    var g = e.options_;
    return a.customTagParsers = g && g.customTagParsers || [], a.customTagMappers = g && g.customTagMappers || [], a.experimentalLLHLS = g && g.experimentalLLHLS || !1, V.browser.IE_VERSION && (a.experimentalLLHLS = !1), a.state = "HAVE_NOTHING", a.handleMediaupdatetimeout_ = a.handleMediaupdatetimeout_.bind(ye(a)), a.on("mediaupdatetimeout", a.handleMediaupdatetimeout_), a;
  }
  var n = r.prototype;
  return n.handleMediaupdatetimeout_ = function() {
    var e = this;
    if (this.state === "HAVE_METADATA") {
      var t = this.media(), a = Pt(this.master.uri, t.uri);
      this.experimentalLLHLS && (a = Rv(a, t)), this.state = "HAVE_CURRENT_METADATA", this.request = this.vhs_.xhr({
        uri: a,
        withCredentials: this.withCredentials
      }, function(o, u) {
        if (e.request) {
          if (o)
            return e.playlistRequestError(e.request, e.media(), "HAVE_METADATA");
          e.haveMetadata({
            playlistString: e.request.responseText,
            url: e.media().uri,
            id: e.media().id
          });
        }
      });
    }
  }, n.playlistRequestError = function(e, t, a) {
    var o = t.uri, u = t.id;
    this.request = null, a && (this.state = a), this.error = {
      playlist: this.master.playlists[u],
      status: e.status,
      message: "HLS playlist request error at URL: " + o + ".",
      responseText: e.responseText,
      code: e.status >= 500 ? 4 : 2
    }, this.trigger("error");
  }, n.parseManifest_ = function(e) {
    var t = this, a = e.url, o = e.manifestString;
    return Pv({
      onwarn: function(l) {
        var c = l.message;
        return t.logger_("m3u8-parser warn for " + a + ": " + c);
      },
      oninfo: function(l) {
        var c = l.message;
        return t.logger_("m3u8-parser info for " + a + ": " + c);
      },
      manifestString: o,
      customTagParsers: this.customTagParsers,
      customTagMappers: this.customTagMappers,
      experimentalLLHLS: this.experimentalLLHLS
    });
  }, n.haveMetadata = function(e) {
    var t = e.playlistString, a = e.playlistObject, o = e.url, u = e.id;
    this.request = null, this.state = "HAVE_METADATA";
    var l = a || this.parseManifest_({
      url: o,
      manifestString: t
    });
    l.lastRequest = Date.now(), Nc({
      playlist: l,
      uri: o,
      id: u
    });
    var c = Rs(this.master, l);
    this.targetDuration = l.partTargetDuration || l.targetDuration, this.pendingMedia_ = null, c ? (this.master = c, this.media_ = this.master.playlists[u]) : this.trigger("playlistunchanged"), this.updateMediaUpdateTimeout_(Ms(this.media(), !!c)), this.trigger("loadedplaylist");
  }, n.dispose = function() {
    this.trigger("dispose"), this.stopRequest(), P.clearTimeout(this.mediaUpdateTimeout), P.clearTimeout(this.finalRenditionTimeout), this.off();
  }, n.stopRequest = function() {
    if (this.request) {
      var e = this.request;
      this.request = null, e.onreadystatechange = null, e.abort();
    }
  }, n.media = function(e, t) {
    var a = this;
    if (!e)
      return this.media_;
    if (this.state === "HAVE_NOTHING")
      throw new Error("Cannot switch media playlist from " + this.state);
    if (typeof e == "string") {
      if (!this.master.playlists[e])
        throw new Error("Unknown playlist URI: " + e);
      e = this.master.playlists[e];
    }
    if (P.clearTimeout(this.finalRenditionTimeout), t) {
      var o = (e.partTargetDuration || e.targetDuration) / 2 * 1e3 || 5e3;
      this.finalRenditionTimeout = P.setTimeout(this.media.bind(this, e, !1), o);
      return;
    }
    var u = this.state, l = !this.media_ || e.id !== this.media_.id, c = this.master.playlists[e.id];
    if (c && c.endList || // handle the case of a playlist object (e.g., if using vhs-json with a resolved
    // media playlist or, for the case of demuxed audio, a resolved audio media group)
    e.endList && e.segments.length) {
      this.request && (this.request.onreadystatechange = null, this.request.abort(), this.request = null), this.state = "HAVE_METADATA", this.media_ = e, l && (this.trigger("mediachanging"), u === "HAVE_MASTER" ? this.trigger("loadedmetadata") : this.trigger("mediachange"));
      return;
    }
    if (this.updateMediaUpdateTimeout_(Ms(e, !0)), !!l) {
      if (this.state = "SWITCHING_MEDIA", this.request) {
        if (e.resolvedUri === this.request.url)
          return;
        this.request.onreadystatechange = null, this.request.abort(), this.request = null;
      }
      this.media_ && this.trigger("mediachanging"), this.pendingMedia_ = e, this.request = this.vhs_.xhr({
        uri: e.resolvedUri,
        withCredentials: this.withCredentials
      }, function(m, g) {
        if (a.request) {
          if (e.lastRequest = Date.now(), e.resolvedUri = ea(a.handleManifestRedirects, e.resolvedUri, g), m)
            return a.playlistRequestError(a.request, e, u);
          a.haveMetadata({
            playlistString: g.responseText,
            url: e.uri,
            id: e.id
          }), u === "HAVE_MASTER" ? a.trigger("loadedmetadata") : a.trigger("mediachange");
        }
      });
    }
  }, n.pause = function() {
    this.mediaUpdateTimeout && (P.clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = null), this.stopRequest(), this.state === "HAVE_NOTHING" && (this.started = !1), this.state === "SWITCHING_MEDIA" ? this.media_ ? this.state = "HAVE_METADATA" : this.state = "HAVE_MASTER" : this.state === "HAVE_CURRENT_METADATA" && (this.state = "HAVE_METADATA");
  }, n.load = function(e) {
    var t = this;
    this.mediaUpdateTimeout && (P.clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = null);
    var a = this.media();
    if (e) {
      var o = a ? (a.partTargetDuration || a.targetDuration) / 2 * 1e3 : 5e3;
      this.mediaUpdateTimeout = P.setTimeout(function() {
        t.mediaUpdateTimeout = null, t.load();
      }, o);
      return;
    }
    if (!this.started) {
      this.start();
      return;
    }
    a && !a.endList ? this.trigger("mediaupdatetimeout") : this.trigger("loadedplaylist");
  }, n.updateMediaUpdateTimeout_ = function(e) {
    var t = this;
    this.mediaUpdateTimeout && (P.clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = null), !(!this.media() || this.media().endList) && (this.mediaUpdateTimeout = P.setTimeout(function() {
      t.mediaUpdateTimeout = null, t.trigger("mediaupdatetimeout"), t.updateMediaUpdateTimeout_(e);
    }, e));
  }, n.start = function() {
    var e = this;
    if (this.started = !0, typeof this.src == "object") {
      this.src.uri || (this.src.uri = P.location.href), this.src.resolvedUri = this.src.uri, setTimeout(function() {
        e.setupInitialPlaylist(e.src);
      }, 0);
      return;
    }
    this.request = this.vhs_.xhr({
      uri: this.src,
      withCredentials: this.withCredentials
    }, function(t, a) {
      if (e.request) {
        if (e.request = null, t)
          return e.error = {
            status: a.status,
            message: "HLS playlist request error at URL: " + e.src + ".",
            responseText: a.responseText,
            // MEDIA_ERR_NETWORK
            code: 2
          }, e.state === "HAVE_NOTHING" && (e.started = !1), e.trigger("error");
        e.src = ea(e.handleManifestRedirects, e.src, a);
        var o = e.parseManifest_({
          manifestString: a.responseText,
          url: e.src
        });
        e.setupInitialPlaylist(o);
      }
    });
  }, n.srcUri = function() {
    return typeof this.src == "string" ? this.src : this.src.uri;
  }, n.setupInitialPlaylist = function(e) {
    if (this.state = "HAVE_MASTER", e.playlists) {
      this.master = e, Bc(this.master, this.srcUri()), e.playlists.forEach(function(a) {
        a.segments = Vc(a), a.segments.forEach(function(o) {
          Uc(o, a.resolvedUri);
        });
      }), this.trigger("loadedplaylist"), this.request || this.media(this.master.playlists[0]);
      return;
    }
    var t = this.srcUri() || P.location.href;
    this.master = Lv(e, t), this.haveMetadata({
      playlistObject: e,
      url: t,
      id: this.master.playlists[0].id
    }), this.trigger("loadedmetadata");
  }, r;
})(Fv), Bv = V.xhr, Uv = V.mergeOptions, Ns = function(r, n, i, e) {
  var t = r.responseType === "arraybuffer" ? r.response : r.responseText;
  !n && t && (r.responseTime = Date.now(), r.roundTripTime = r.responseTime - r.requestTime, r.bytesReceived = t.byteLength || t.length, r.bandwidth || (r.bandwidth = Math.floor(r.bytesReceived / r.roundTripTime * 8 * 1e3))), i.headers && (r.responseHeaders = i.headers), n && n.code === "ETIMEDOUT" && (r.timedout = !0), !n && !r.aborted && i.statusCode !== 200 && i.statusCode !== 206 && i.statusCode !== 0 && (n = new Error("XHR Failed with a response of: " + (r && (t || r.responseText)))), e(n, r);
}, jc = function() {
  var r = function n(i, e) {
    i = Uv({
      timeout: 45e3
    }, i);
    var t = n.beforeRequest || V.Vhs.xhr.beforeRequest;
    if (t && typeof t == "function") {
      var a = t(i);
      a && (i = a);
    }
    var o = V.Vhs.xhr.original === !0 ? Bv : V.Vhs.xhr, u = o(i, function(c, m) {
      return Ns(u, c, m, e);
    }), l = u.abort;
    return u.abort = function() {
      return u.aborted = !0, l.apply(u, arguments);
    }, u.uri = i.uri, u.requestTime = Date.now(), u;
  };
  return r.original = !0, r;
}, Vv = function(r) {
  var n, i = r.offset;
  return typeof r.offset == "bigint" || typeof r.length == "bigint" ? n = P.BigInt(r.offset) + P.BigInt(r.length) - P.BigInt(1) : n = r.offset + r.length - 1, "bytes=" + i + "-" + n;
}, Bs = function(r) {
  var n = {};
  return r.byterange && (n.Range = Vv(r.byterange)), n;
}, qv = function(r, n) {
  return r.start(n) + "-" + r.end(n);
}, jv = function(r, n) {
  var i = r.toString(16);
  return "00".substring(0, 2 - i.length) + i + (n % 2 ? " " : "");
}, Hv = function(r) {
  return r >= 32 && r < 126 ? String.fromCharCode(r) : ".";
}, Hc = function(r) {
  var n = {};
  return Object.keys(r).forEach(function(i) {
    var e = r[i];
    sd(e) ? n[i] = {
      bytes: e.buffer,
      byteOffset: e.byteOffset,
      byteLength: e.byteLength
    } : n[i] = e;
  }), n;
}, ra = function(r) {
  var n = r.byterange || {
    length: 1 / 0,
    offset: 0
  };
  return [n.length, n.offset, r.resolvedUri].join(",");
}, Wc = function(r) {
  return r.resolvedUri;
}, Gc = function(r) {
  for (var n = Array.prototype.slice.call(r), i = 16, e = "", t, a, o = 0; o < n.length / i; o++)
    t = n.slice(o * i, o * i + i).map(jv).join(""), a = n.slice(o * i, o * i + i).map(Hv).join(""), e += t + " " + a + `
`;
  return e;
}, Wv = function(r) {
  var n = r.bytes;
  return Gc(n);
}, Gv = function(r) {
  var n = "", i;
  for (i = 0; i < r.length; i++)
    n += qv(r, i) + " ";
  return n;
}, zv = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createTransferableMessage: Hc,
  initSegmentId: ra,
  segmentKeyId: Wc,
  hexDump: Gc,
  tagDump: Wv,
  textRanges: Gv
}), zc = 0.25, Kv = function(r, n) {
  if (!n.dateTimeObject)
    return null;
  var i = n.videoTimingInfo.transmuxerPrependedSeconds, e = n.videoTimingInfo.transmuxedPresentationStart, t = e + i, a = r - t;
  return new Date(n.dateTimeObject.getTime() + a * 1e3);
}, $v = function(r) {
  return r.transmuxedPresentationEnd - r.transmuxedPresentationStart - r.transmuxerPrependedSeconds;
}, Xv = function(r, n) {
  var i;
  try {
    i = new Date(r);
  } catch {
    return null;
  }
  if (!n || !n.segments || n.segments.length === 0)
    return null;
  var e = n.segments[0];
  if (i < e.dateTimeObject)
    return null;
  for (var t = 0; t < n.segments.length - 1; t++) {
    e = n.segments[t];
    var a = n.segments[t + 1].dateTimeObject;
    if (i < a)
      break;
  }
  var o = n.segments[n.segments.length - 1], u = o.dateTimeObject, l = o.videoTimingInfo ? $v(o.videoTimingInfo) : o.duration + o.duration * zc, c = new Date(u.getTime() + l * 1e3);
  return i > c ? null : (i > u && (e = o), {
    segment: e,
    estimatedStart: e.videoTimingInfo ? e.videoTimingInfo.transmuxedPresentationStart : vt.duration(n, n.mediaSequence + n.segments.indexOf(e)),
    // Although, given that all segments have accurate date time objects, the segment
    // selected should be accurate, unless the video has been transmuxed at some point
    // (determined by the presence of the videoTimingInfo object), the segment's "player
    // time" (the start time in the player) can't be considered accurate.
    type: e.videoTimingInfo ? "accurate" : "estimate"
  });
}, Yv = function(r, n) {
  if (!n || !n.segments || n.segments.length === 0)
    return null;
  for (var i = 0, e, t = 0; t < n.segments.length && (e = n.segments[t], i = e.videoTimingInfo ? e.videoTimingInfo.transmuxedPresentationEnd : i + e.duration, !(r <= i)); t++)
    ;
  var a = n.segments[n.segments.length - 1];
  if (a.videoTimingInfo && a.videoTimingInfo.transmuxedPresentationEnd < r)
    return null;
  if (r > i) {
    if (r > i + a.duration * zc)
      return null;
    e = a;
  }
  return {
    segment: e,
    estimatedStart: e.videoTimingInfo ? e.videoTimingInfo.transmuxedPresentationStart : i - e.duration,
    // Because videoTimingInfo is only set after transmux, it is the only way to get
    // accurate timing values.
    type: e.videoTimingInfo ? "accurate" : "estimate"
  };
}, Qv = function(r, n) {
  var i, e;
  try {
    i = new Date(r), e = new Date(n);
  } catch {
  }
  var t = i.getTime(), a = e.getTime();
  return (a - t) / 1e3;
}, Jv = function(r) {
  if (!r.segments || r.segments.length === 0)
    return !1;
  for (var n = 0; n < r.segments.length; n++) {
    var i = r.segments[n];
    if (!i.dateTimeObject)
      return !1;
  }
  return !0;
}, Zv = function(r) {
  var n = r.playlist, i = r.time, e = i === void 0 ? void 0 : i, t = r.callback;
  if (!t)
    throw new Error("getProgramTime: callback must be provided");
  if (!n || e === void 0)
    return t({
      message: "getProgramTime: playlist and time must be provided"
    });
  var a = Yv(e, n);
  if (!a)
    return t({
      message: "valid programTime was not found"
    });
  if (a.type === "estimate")
    return t({
      message: "Accurate programTime could not be determined. Please seek to e.seekTime and try again",
      seekTime: a.estimatedStart
    });
  var o = {
    mediaSeconds: e
  }, u = Kv(e, a.segment);
  return u && (o.programDateTime = u.toISOString()), t(null, o);
}, e0 = function s(r) {
  var n = r.programTime, i = r.playlist, e = r.retryCount, t = e === void 0 ? 2 : e, a = r.seekTo, o = r.pauseAfterSeek, u = o === void 0 ? !0 : o, l = r.tech, c = r.callback;
  if (!c)
    throw new Error("seekToProgramTime: callback must be provided");
  if (typeof n > "u" || !i || !a)
    return c({
      message: "seekToProgramTime: programTime, seekTo and playlist must be provided"
    });
  if (!i.endList && !l.hasStarted_)
    return c({
      message: "player must be playing a live stream to start buffering"
    });
  if (!Jv(i))
    return c({
      message: "programDateTime tags must be provided in the manifest " + i.resolvedUri
    });
  var m = Xv(n, i);
  if (!m)
    return c({
      message: n + " was not found in the stream"
    });
  var g = m.segment, _ = Qv(g.dateTimeObject, n);
  if (m.type === "estimate") {
    if (t === 0)
      return c({
        message: n + " is not buffered yet. Try again"
      });
    a(m.estimatedStart + _), l.one("seeked", function() {
      s({
        programTime: n,
        playlist: i,
        retryCount: t - 1,
        seekTo: a,
        pauseAfterSeek: u,
        tech: l,
        callback: c
      });
    });
    return;
  }
  var C = g.start + _, w = function() {
    return c(null, l.currentTime());
  };
  l.one("seeked", w), u && l.pause(), a(C);
}, hs = function(r, n) {
  if (r.readyState === 4)
    return n();
}, t0 = function(r, n, i) {
  var e = [], t, a = !1, o = function(g, _, C, w) {
    return _.abort(), a = !0, i(g, _, C, w);
  }, u = function(g, _) {
    if (!a) {
      if (g)
        return o(g, _, "", e);
      var C = _.responseText.substring(e && e.byteLength || 0, _.responseText.length);
      if (e = Cp(e, od(C, !0)), t = t || Pi(e), e.length < 10 || t && e.length < t + 2)
        return hs(_, function() {
          return o(g, _, "", e);
        });
      var w = Ys(e);
      return w === "ts" && e.length < 188 ? hs(_, function() {
        return o(g, _, "", e);
      }) : !w && e.length < 376 ? hs(_, function() {
        return o(g, _, "", e);
      }) : o(null, _, w, e);
    }
  }, l = {
    uri: r,
    beforeSend: function(g) {
      g.overrideMimeType("text/plain; charset=x-user-defined"), g.addEventListener("progress", function(_) {
        return _.total, _.loaded, Ns(g, null, {
          statusCode: g.status
        }, u);
      });
    }
  }, c = n(l, function(m, g) {
    return Ns(c, m, g, u);
  });
  return c;
}, r0 = V.EventTarget, Kc = V.mergeOptions, Ll = function(r, n) {
  if (!qc(r, n) || r.sidx && n.sidx && (r.sidx.offset !== n.sidx.offset || r.sidx.length !== n.sidx.length))
    return !1;
  if (!r.sidx && n.sidx || r.sidx && !n.sidx || r.segments && !n.segments || !r.segments && n.segments)
    return !1;
  if (!r.segments && !n.segments)
    return !0;
  for (var i = 0; i < r.segments.length; i++) {
    var e = r.segments[i], t = n.segments[i];
    if (e.uri !== t.uri)
      return !1;
    if (!(!e.byterange && !t.byterange)) {
      var a = e.byterange, o = t.byterange;
      if (a && !o || !a && o || a.offset !== o.offset || a.length !== o.length)
        return !1;
    }
  }
  return !0;
}, i0 = function(r, n, i, e) {
  var t = e.attributes.NAME || i;
  return "placeholder-uri-" + r + "-" + n + "-" + t;
}, n0 = function(r) {
  var n = r.masterXml, i = r.srcUrl, e = r.clientOffset, t = r.sidxMapping, a = r.previousManifest, o = bm(n, {
    manifestUri: i,
    clientOffset: e,
    sidxMapping: t,
    previousManifest: a
  });
  return Bc(o, i, i0), o;
}, a0 = function(r, n) {
  pi(r, function(i, e, t, a) {
    a in n.mediaGroups[e][t] || delete r.mediaGroups[e][t][a];
  });
}, s0 = function(r, n, i) {
  for (var e = !0, t = Kc(r, {
    // These are top level properties that can be updated
    duration: n.duration,
    minimumUpdatePeriod: n.minimumUpdatePeriod,
    timelineStarts: n.timelineStarts
  }), a = 0; a < n.playlists.length; a++) {
    var o = n.playlists[a];
    if (o.sidx) {
      var u = fa(o.sidx);
      i && i[u] && i[u].sidx && zs(o, i[u].sidx, o.sidx.resolvedUri);
    }
    var l = Rs(t, o, Ll);
    l && (t = l, e = !1);
  }
  return pi(n, function(c, m, g, _) {
    if (c.playlists && c.playlists.length) {
      var C = c.playlists[0].id, w = Rs(t, c.playlists[0], Ll);
      w && (t = w, _ in t.mediaGroups[m][g] || (t.mediaGroups[m][g][_] = c), t.mediaGroups[m][g][_].playlists[0] = t.playlists[C], e = !1);
    }
  }), a0(t, n), n.minimumUpdatePeriod !== r.minimumUpdatePeriod && (e = !1), e ? null : t;
}, o0 = function(r, n) {
  var i = !r.map && !n.map, e = i || !!(r.map && n.map && r.map.byterange.offset === n.map.byterange.offset && r.map.byterange.length === n.map.byterange.length);
  return e && r.uri === n.uri && r.byterange.offset === n.byterange.offset && r.byterange.length === n.byterange.length;
}, Fl = function(r, n) {
  var i = {};
  for (var e in r) {
    var t = r[e], a = t.sidx;
    if (a) {
      var o = fa(a);
      if (!n[o])
        break;
      var u = n[o].sidxInfo;
      o0(u, a) && (i[o] = n[o]);
    }
  }
  return i;
}, u0 = function(r, n) {
  var i = Fl(r.playlists, n), e = i;
  return pi(r, function(t, a, o, u) {
    if (t.playlists && t.playlists.length) {
      var l = t.playlists;
      e = Kc(e, Fl(l, n));
    }
  }), e;
}, Us = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t, a) {
    var o;
    t === void 0 && (t = {}), o = s.call(this) || this, o.masterPlaylistLoader_ = a || ye(o), a || (o.isMaster_ = !0);
    var u = t, l = u.withCredentials, c = l === void 0 ? !1 : l, m = u.handleManifestRedirects, g = m === void 0 ? !1 : m;
    if (o.vhs_ = e, o.withCredentials = c, o.handleManifestRedirects = g, !i)
      throw new Error("A non-empty playlist URL or object is required");
    return o.on("minimumUpdatePeriod", function() {
      o.refreshXml_();
    }), o.on("mediaupdatetimeout", function() {
      o.refreshMedia_(o.media().id);
    }), o.state = "HAVE_NOTHING", o.loadedPlaylists_ = {}, o.logger_ = Ft("DashPlaylistLoader"), o.isMaster_ ? (o.masterPlaylistLoader_.srcUrl = i, o.masterPlaylistLoader_.sidxMapping_ = {}) : o.childPlaylist_ = i, o;
  }
  var n = r.prototype;
  return n.requestErrored_ = function(e, t, a) {
    if (!this.request)
      return !0;
    if (this.request = null, e)
      return this.error = typeof e == "object" && !(e instanceof Error) ? e : {
        status: t.status,
        message: "DASH request error at URL: " + t.uri,
        response: t.response,
        // MEDIA_ERR_NETWORK
        code: 2
      }, a && (this.state = a), this.trigger("error"), !0;
  }, n.addSidxSegments_ = function(e, t, a) {
    var o = this, u = e.sidx && fa(e.sidx);
    if (!e.sidx || !u || this.masterPlaylistLoader_.sidxMapping_[u]) {
      this.mediaRequest_ = P.setTimeout(function() {
        return a(!1);
      }, 0);
      return;
    }
    var l = ea(this.handleManifestRedirects, e.sidx.resolvedUri), c = function(g, _) {
      if (!o.requestErrored_(g, _, t)) {
        var C = o.masterPlaylistLoader_.sidxMapping_, w;
        try {
          w = Am(fe(_.response).subarray(8));
        } catch (E) {
          o.requestErrored_(E, _, t);
          return;
        }
        return C[u] = {
          sidxInfo: e.sidx,
          sidx: w
        }, zs(e, w, e.sidx.resolvedUri), a(!0);
      }
    };
    this.request = t0(l, this.vhs_.xhr, function(m, g, _, C) {
      if (m)
        return c(m, g);
      if (!_ || _ !== "mp4")
        return c({
          status: g.status,
          message: "Unsupported " + (_ || "unknown") + " container type for sidx segment at URL: " + l,
          // response is just bytes in this case
          // but we really don't want to return that.
          response: "",
          playlist: e,
          internal: !0,
          blacklistDuration: 1 / 0,
          // MEDIA_ERR_NETWORK
          code: 2
        }, g);
      var w = e.sidx.byterange, E = w.offset, M = w.length;
      if (C.length >= M + E)
        return c(m, {
          response: C.subarray(E, E + M),
          status: g.status,
          uri: g.uri
        });
      o.request = o.vhs_.xhr({
        uri: l,
        responseType: "arraybuffer",
        headers: Bs({
          byterange: e.sidx.byterange
        })
      }, c);
    });
  }, n.dispose = function() {
    this.trigger("dispose"), this.stopRequest(), this.loadedPlaylists_ = {}, P.clearTimeout(this.minimumUpdatePeriodTimeout_), P.clearTimeout(this.mediaRequest_), P.clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = null, this.mediaRequest_ = null, this.minimumUpdatePeriodTimeout_ = null, this.masterPlaylistLoader_.createMupOnMedia_ && (this.off("loadedmetadata", this.masterPlaylistLoader_.createMupOnMedia_), this.masterPlaylistLoader_.createMupOnMedia_ = null), this.off();
  }, n.hasPendingRequest = function() {
    return this.request || this.mediaRequest_;
  }, n.stopRequest = function() {
    if (this.request) {
      var e = this.request;
      this.request = null, e.onreadystatechange = null, e.abort();
    }
  }, n.media = function(e) {
    var t = this;
    if (!e)
      return this.media_;
    if (this.state === "HAVE_NOTHING")
      throw new Error("Cannot switch media playlist from " + this.state);
    var a = this.state;
    if (typeof e == "string") {
      if (!this.masterPlaylistLoader_.master.playlists[e])
        throw new Error("Unknown playlist URI: " + e);
      e = this.masterPlaylistLoader_.master.playlists[e];
    }
    var o = !this.media_ || e.id !== this.media_.id;
    if (o && this.loadedPlaylists_[e.id] && this.loadedPlaylists_[e.id].endList) {
      this.state = "HAVE_METADATA", this.media_ = e, o && (this.trigger("mediachanging"), this.trigger("mediachange"));
      return;
    }
    o && (this.media_ && this.trigger("mediachanging"), this.addSidxSegments_(e, a, function(u) {
      t.haveMetadata({
        startingState: a,
        playlist: e
      });
    }));
  }, n.haveMetadata = function(e) {
    var t = e.startingState, a = e.playlist;
    this.state = "HAVE_METADATA", this.loadedPlaylists_[a.id] = a, this.mediaRequest_ = null, this.refreshMedia_(a.id), t === "HAVE_MASTER" ? this.trigger("loadedmetadata") : this.trigger("mediachange");
  }, n.pause = function() {
    this.masterPlaylistLoader_.createMupOnMedia_ && (this.off("loadedmetadata", this.masterPlaylistLoader_.createMupOnMedia_), this.masterPlaylistLoader_.createMupOnMedia_ = null), this.stopRequest(), P.clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = null, this.isMaster_ && (P.clearTimeout(this.masterPlaylistLoader_.minimumUpdatePeriodTimeout_), this.masterPlaylistLoader_.minimumUpdatePeriodTimeout_ = null), this.state === "HAVE_NOTHING" && (this.started = !1);
  }, n.load = function(e) {
    var t = this;
    P.clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = null;
    var a = this.media();
    if (e) {
      var o = a ? a.targetDuration / 2 * 1e3 : 5e3;
      this.mediaUpdateTimeout = P.setTimeout(function() {
        return t.load();
      }, o);
      return;
    }
    if (!this.started) {
      this.start();
      return;
    }
    a && !a.endList ? (this.isMaster_ && !this.minimumUpdatePeriodTimeout_ && (this.trigger("minimumUpdatePeriod"), this.updateMinimumUpdatePeriodTimeout_()), this.trigger("mediaupdatetimeout")) : this.trigger("loadedplaylist");
  }, n.start = function() {
    var e = this;
    if (this.started = !0, !this.isMaster_) {
      this.mediaRequest_ = P.setTimeout(function() {
        return e.haveMaster_();
      }, 0);
      return;
    }
    this.requestMaster_(function(t, a) {
      e.haveMaster_(), !e.hasPendingRequest() && !e.media_ && e.media(e.masterPlaylistLoader_.master.playlists[0]);
    });
  }, n.requestMaster_ = function(e) {
    var t = this;
    this.request = this.vhs_.xhr({
      uri: this.masterPlaylistLoader_.srcUrl,
      withCredentials: this.withCredentials
    }, function(a, o) {
      if (t.requestErrored_(a, o)) {
        t.state === "HAVE_NOTHING" && (t.started = !1);
        return;
      }
      var u = o.responseText !== t.masterPlaylistLoader_.masterXml_;
      if (t.masterPlaylistLoader_.masterXml_ = o.responseText, o.responseHeaders && o.responseHeaders.date ? t.masterLoaded_ = Date.parse(o.responseHeaders.date) : t.masterLoaded_ = Date.now(), t.masterPlaylistLoader_.srcUrl = ea(t.handleManifestRedirects, t.masterPlaylistLoader_.srcUrl, o), u) {
        t.handleMaster_(), t.syncClientServerClock_(function() {
          return e(o, u);
        });
        return;
      }
      return e(o, u);
    });
  }, n.syncClientServerClock_ = function(e) {
    var t = this, a = xm(this.masterPlaylistLoader_.masterXml_);
    if (a === null)
      return this.masterPlaylistLoader_.clientOffset_ = this.masterLoaded_ - Date.now(), e();
    if (a.method === "DIRECT")
      return this.masterPlaylistLoader_.clientOffset_ = a.value - Date.now(), e();
    this.request = this.vhs_.xhr({
      uri: Pt(this.masterPlaylistLoader_.srcUrl, a.value),
      method: a.method,
      withCredentials: this.withCredentials
    }, function(o, u) {
      if (t.request) {
        if (o)
          return t.masterPlaylistLoader_.clientOffset_ = t.masterLoaded_ - Date.now(), e();
        var l;
        a.method === "HEAD" ? !u.responseHeaders || !u.responseHeaders.date ? l = t.masterLoaded_ : l = Date.parse(u.responseHeaders.date) : l = Date.parse(u.responseText), t.masterPlaylistLoader_.clientOffset_ = l - Date.now(), e();
      }
    });
  }, n.haveMaster_ = function() {
    this.state = "HAVE_MASTER", this.isMaster_ ? this.trigger("loadedplaylist") : this.media_ || this.media(this.childPlaylist_);
  }, n.handleMaster_ = function() {
    this.mediaRequest_ = null;
    var e = this.masterPlaylistLoader_.master, t = n0({
      masterXml: this.masterPlaylistLoader_.masterXml_,
      srcUrl: this.masterPlaylistLoader_.srcUrl,
      clientOffset: this.masterPlaylistLoader_.clientOffset_,
      sidxMapping: this.masterPlaylistLoader_.sidxMapping_,
      previousManifest: e
    });
    e && (t = s0(e, t, this.masterPlaylistLoader_.sidxMapping_)), this.masterPlaylistLoader_.master = t || e;
    var a = this.masterPlaylistLoader_.master.locations && this.masterPlaylistLoader_.master.locations[0];
    return a && a !== this.masterPlaylistLoader_.srcUrl && (this.masterPlaylistLoader_.srcUrl = a), (!e || t && t.minimumUpdatePeriod !== e.minimumUpdatePeriod) && this.updateMinimumUpdatePeriodTimeout_(), !!t;
  }, n.updateMinimumUpdatePeriodTimeout_ = function() {
    var e = this.masterPlaylistLoader_;
    e.createMupOnMedia_ && (e.off("loadedmetadata", e.createMupOnMedia_), e.createMupOnMedia_ = null), e.minimumUpdatePeriodTimeout_ && (P.clearTimeout(e.minimumUpdatePeriodTimeout_), e.minimumUpdatePeriodTimeout_ = null);
    var t = e.master && e.master.minimumUpdatePeriod;
    if (t === 0 && (e.media() ? t = e.media().targetDuration * 1e3 : (e.createMupOnMedia_ = e.updateMinimumUpdatePeriodTimeout_, e.one("loadedmetadata", e.createMupOnMedia_))), typeof t != "number" || t <= 0) {
      t < 0 && this.logger_("found invalid minimumUpdatePeriod of " + t + ", not setting a timeout");
      return;
    }
    this.createMUPTimeout_(t);
  }, n.createMUPTimeout_ = function(e) {
    var t = this.masterPlaylistLoader_;
    t.minimumUpdatePeriodTimeout_ = P.setTimeout(function() {
      t.minimumUpdatePeriodTimeout_ = null, t.trigger("minimumUpdatePeriod"), t.createMUPTimeout_(e);
    }, e);
  }, n.refreshXml_ = function() {
    var e = this;
    this.requestMaster_(function(t, a) {
      a && (e.media_ && (e.media_ = e.masterPlaylistLoader_.master.playlists[e.media_.id]), e.masterPlaylistLoader_.sidxMapping_ = u0(e.masterPlaylistLoader_.master, e.masterPlaylistLoader_.sidxMapping_), e.addSidxSegments_(e.media(), e.state, function(o) {
        e.refreshMedia_(e.media().id);
      }));
    });
  }, n.refreshMedia_ = function(e) {
    var t = this;
    if (!e)
      throw new Error("refreshMedia_ must take a media id");
    this.media_ && this.isMaster_ && this.handleMaster_();
    var a = this.masterPlaylistLoader_.master.playlists, o = !this.media_ || this.media_ !== a[e];
    if (o ? this.media_ = a[e] : this.trigger("playlistunchanged"), !this.mediaUpdateTimeout) {
      var u = function l() {
        t.media().endList || (t.mediaUpdateTimeout = P.setTimeout(function() {
          t.trigger("mediaupdatetimeout"), l();
        }, Ms(t.media(), !!o)));
      };
      u();
    }
    this.trigger("loadedplaylist");
  }, r;
})(r0), Qe = {
  GOAL_BUFFER_LENGTH: 30,
  MAX_GOAL_BUFFER_LENGTH: 60,
  BACK_BUFFER_LENGTH: 30,
  GOAL_BUFFER_LENGTH_RATE: 1,
  // 0.5 MB/s
  INITIAL_BANDWIDTH: 4194304,
  // A fudge factor to apply to advertised playlist bitrates to account for
  // temporary flucations in client bandwidth
  BANDWIDTH_VARIANCE: 1.2,
  // How much of the buffer must be filled before we consider upswitching
  BUFFER_LOW_WATER_LINE: 0,
  MAX_BUFFER_LOW_WATER_LINE: 30,
  // TODO: Remove this when experimentalBufferBasedABR is removed
  EXPERIMENTAL_MAX_BUFFER_LOW_WATER_LINE: 16,
  BUFFER_LOW_WATER_LINE_RATE: 1,
  // If the buffer is greater than the high water line, we won't switch down
  BUFFER_HIGH_WATER_LINE: 30
}, l0 = function(r) {
  for (var n = new Uint8Array(new ArrayBuffer(r.length)), i = 0; i < r.length; i++)
    n[i] = r.charCodeAt(i);
  return n.buffer;
}, $c = function(r) {
  return r.on = r.addEventListener, r.off = r.removeEventListener, r;
}, d0 = function(r) {
  try {
    return URL.createObjectURL(new Blob([r], {
      type: "application/javascript"
    }));
  } catch {
    var n = new BlobBuilder();
    return n.append(r), URL.createObjectURL(n.getBlob());
  }
}, Xc = function(r) {
  return function() {
    var n = d0(r), i = $c(new Worker(n));
    i.objURL = n;
    var e = i.terminate;
    return i.on = i.addEventListener, i.off = i.removeEventListener, i.terminate = function() {
      return URL.revokeObjectURL(n), e.call(this);
    }, i;
  };
}, Yc = function(r) {
  return "var browserWorkerPolyFill = " + $c.toString() + `;
browserWorkerPolyFill(self);
` + r;
}, Qc = function(r) {
  return r.toString().replace(/^function.+?{/, "").slice(0, -1);
}, c0 = Yc(Qc(function() {
  var s = function() {
    this.init = function() {
      var d = {};
      this.on = function(h, f) {
        d[h] || (d[h] = []), d[h] = d[h].concat(f);
      }, this.off = function(h, f) {
        var p;
        return d[h] ? (p = d[h].indexOf(f), d[h] = d[h].slice(), d[h].splice(p, 1), p > -1) : !1;
      }, this.trigger = function(h) {
        var f, p, v, y;
        if (f = d[h], !!f)
          if (arguments.length === 2)
            for (v = f.length, p = 0; p < v; ++p)
              f[p].call(this, arguments[1]);
          else {
            for (y = [], p = arguments.length, p = 1; p < arguments.length; ++p)
              y.push(arguments[p]);
            for (v = f.length, p = 0; p < v; ++p)
              f[p].apply(this, y);
          }
      }, this.dispose = function() {
        d = {};
      };
    };
  };
  s.prototype.pipe = function(x) {
    return this.on("data", function(d) {
      x.push(d);
    }), this.on("done", function(d) {
      x.flush(d);
    }), this.on("partialdone", function(d) {
      x.partialFlush(d);
    }), this.on("endedtimeline", function(d) {
      x.endTimeline(d);
    }), this.on("reset", function(d) {
      x.reset(d);
    }), x;
  }, s.prototype.push = function(x) {
    this.trigger("data", x);
  }, s.prototype.flush = function(x) {
    this.trigger("done", x);
  }, s.prototype.partialFlush = function(x) {
    this.trigger("partialdone", x);
  }, s.prototype.endTimeline = function(x) {
    this.trigger("endedtimeline", x);
  }, s.prototype.reset = function(x) {
    this.trigger("reset", x);
  };
  var r = s, n = Math.pow(2, 32), i = function(d) {
    var h = new DataView(d.buffer, d.byteOffset, d.byteLength), f;
    return h.getBigUint64 ? (f = h.getBigUint64(0), f < Number.MAX_SAFE_INTEGER ? Number(f) : f) : h.getUint32(0) * n + h.getUint32(4);
  }, e = {
    getUint64: i,
    MAX_UINT32: n
  }, t = e.MAX_UINT32, a, o, u, l, c, m, g, _, C, w, E, M, B, z, W, H, $, N, q, T, b, L, R, j, K, Y, re, J, ee, Z, Q, ie, he, me, ge, ce;
  (function() {
    var x;
    if (R = {
      avc1: [],
      // codingname
      avcC: [],
      btrt: [],
      dinf: [],
      dref: [],
      esds: [],
      ftyp: [],
      hdlr: [],
      mdat: [],
      mdhd: [],
      mdia: [],
      mfhd: [],
      minf: [],
      moof: [],
      moov: [],
      mp4a: [],
      // codingname
      mvex: [],
      mvhd: [],
      pasp: [],
      sdtp: [],
      smhd: [],
      stbl: [],
      stco: [],
      stsc: [],
      stsd: [],
      stsz: [],
      stts: [],
      styp: [],
      tfdt: [],
      tfhd: [],
      traf: [],
      trak: [],
      trun: [],
      trex: [],
      tkhd: [],
      vmhd: []
    }, !(typeof Uint8Array > "u")) {
      for (x in R)
        R.hasOwnProperty(x) && (R[x] = [x.charCodeAt(0), x.charCodeAt(1), x.charCodeAt(2), x.charCodeAt(3)]);
      j = new Uint8Array([105, 115, 111, 109]), Y = new Uint8Array([97, 118, 99, 49]), K = new Uint8Array([0, 0, 0, 1]), re = new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        0,
        0,
        0,
        0,
        // pre_defined
        118,
        105,
        100,
        101,
        // handler_type: 'vide'
        0,
        0,
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        // reserved
        86,
        105,
        100,
        101,
        111,
        72,
        97,
        110,
        100,
        108,
        101,
        114,
        0
        // name: 'VideoHandler'
      ]), J = new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        0,
        0,
        0,
        0,
        // pre_defined
        115,
        111,
        117,
        110,
        // handler_type: 'soun'
        0,
        0,
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        // reserved
        83,
        111,
        117,
        110,
        100,
        72,
        97,
        110,
        100,
        108,
        101,
        114,
        0
        // name: 'SoundHandler'
      ]), ee = {
        video: re,
        audio: J
      }, ie = new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        0,
        0,
        0,
        1,
        // entry_count
        0,
        0,
        0,
        12,
        // entry_size
        117,
        114,
        108,
        32,
        // 'url' type
        0,
        // version 0
        0,
        0,
        1
        // entry_flags
      ]), Q = new Uint8Array([
        0,
        // version
        0,
        0,
        0,
        // flags
        0,
        0,
        // balance, 0 means centered
        0,
        0
        // reserved
      ]), he = new Uint8Array([
        0,
        // version
        0,
        0,
        0,
        // flags
        0,
        0,
        0,
        0
        // entry_count
      ]), me = he, ge = new Uint8Array([
        0,
        // version
        0,
        0,
        0,
        // flags
        0,
        0,
        0,
        0,
        // sample_size
        0,
        0,
        0,
        0
        // sample_count
      ]), ce = he, Z = new Uint8Array([
        0,
        // version
        0,
        0,
        1,
        // flags
        0,
        0,
        // graphicsmode
        0,
        0,
        0,
        0,
        0,
        0
        // opcolor
      ]);
    }
  })(), a = function(d) {
    var h = [], f = 0, p, v, y;
    for (p = 1; p < arguments.length; p++)
      h.push(arguments[p]);
    for (p = h.length; p--; )
      f += h[p].byteLength;
    for (v = new Uint8Array(f + 8), y = new DataView(v.buffer, v.byteOffset, v.byteLength), y.setUint32(0, v.byteLength), v.set(d, 4), p = 0, f = 8; p < h.length; p++)
      v.set(h[p], f), f += h[p].byteLength;
    return v;
  }, o = function() {
    return a(R.dinf, a(R.dref, ie));
  }, u = function(d) {
    return a(R.esds, new Uint8Array([
      0,
      // version
      0,
      0,
      0,
      // flags
      // ES_Descriptor
      3,
      // tag, ES_DescrTag
      25,
      // length
      0,
      0,
      // ES_ID
      0,
      // streamDependenceFlag, URL_flag, reserved, streamPriority
      // DecoderConfigDescriptor
      4,
      // tag, DecoderConfigDescrTag
      17,
      // length
      64,
      // object type
      21,
      // streamType
      0,
      6,
      0,
      // bufferSizeDB
      0,
      0,
      218,
      192,
      // maxBitrate
      0,
      0,
      218,
      192,
      // avgBitrate
      // DecoderSpecificInfo
      5,
      // tag, DecoderSpecificInfoTag
      2,
      // length
      // ISO/IEC 14496-3, AudioSpecificConfig
      // for samplingFrequencyIndex see ISO/IEC 13818-7:2006, 8.1.3.2.2, Table 35
      d.audioobjecttype << 3 | d.samplingfrequencyindex >>> 1,
      d.samplingfrequencyindex << 7 | d.channelcount << 3,
      6,
      1,
      2
      // GASpecificConfig
    ]));
  }, l = function() {
    return a(R.ftyp, j, K, j, Y);
  }, H = function(d) {
    return a(R.hdlr, ee[d]);
  }, c = function(d) {
    return a(R.mdat, d);
  }, W = function(d) {
    var h = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      2,
      // creation_time
      0,
      0,
      0,
      3,
      // modification_time
      0,
      1,
      95,
      144,
      // timescale, 90,000 "ticks" per second
      d.duration >>> 24 & 255,
      d.duration >>> 16 & 255,
      d.duration >>> 8 & 255,
      d.duration & 255,
      // duration
      85,
      196,
      // 'und' language (undetermined)
      0,
      0
    ]);
    return d.samplerate && (h[12] = d.samplerate >>> 24 & 255, h[13] = d.samplerate >>> 16 & 255, h[14] = d.samplerate >>> 8 & 255, h[15] = d.samplerate & 255), a(R.mdhd, h);
  }, z = function(d) {
    return a(R.mdia, W(d), H(d.type), g(d));
  }, m = function(d) {
    return a(R.mfhd, new Uint8Array([
      0,
      0,
      0,
      0,
      // flags
      (d & 4278190080) >> 24,
      (d & 16711680) >> 16,
      (d & 65280) >> 8,
      d & 255
      // sequence_number
    ]));
  }, g = function(d) {
    return a(R.minf, d.type === "video" ? a(R.vmhd, Z) : a(R.smhd, Q), o(), N(d));
  }, _ = function(d, h) {
    for (var f = [], p = h.length; p--; )
      f[p] = T(h[p]);
    return a.apply(null, [R.moof, m(d)].concat(f));
  }, C = function(d) {
    for (var h = d.length, f = []; h--; )
      f[h] = M(d[h]);
    return a.apply(null, [R.moov, E(4294967295)].concat(f).concat(w(d)));
  }, w = function(d) {
    for (var h = d.length, f = []; h--; )
      f[h] = b(d[h]);
    return a.apply(null, [R.mvex].concat(f));
  }, E = function(d) {
    var h = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      1,
      // creation_time
      0,
      0,
      0,
      2,
      // modification_time
      0,
      1,
      95,
      144,
      // timescale, 90,000 "ticks" per second
      (d & 4278190080) >> 24,
      (d & 16711680) >> 16,
      (d & 65280) >> 8,
      d & 255,
      // duration
      0,
      1,
      0,
      0,
      // 1.0 rate
      1,
      0,
      // 1.0 volume
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      0,
      0,
      0,
      // transformation: unity matrix
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // pre_defined
      255,
      255,
      255,
      255
      // next_track_ID
    ]);
    return a(R.mvhd, h);
  }, $ = function(d) {
    var h = d.samples || [], f = new Uint8Array(4 + h.length), p, v;
    for (v = 0; v < h.length; v++)
      p = h[v].flags, f[v + 4] = p.dependsOn << 4 | p.isDependedOn << 2 | p.hasRedundancy;
    return a(R.sdtp, f);
  }, N = function(d) {
    return a(R.stbl, q(d), a(R.stts, ce), a(R.stsc, me), a(R.stsz, ge), a(R.stco, he));
  }, (function() {
    var x, d;
    q = function(f) {
      return a(R.stsd, new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        0,
        0,
        0,
        1
      ]), f.type === "video" ? x(f) : d(f));
    }, x = function(f) {
      var p = f.sps || [], v = f.pps || [], y = [], D = [], k, F;
      for (k = 0; k < p.length; k++)
        y.push((p[k].byteLength & 65280) >>> 8), y.push(p[k].byteLength & 255), y = y.concat(Array.prototype.slice.call(p[k]));
      for (k = 0; k < v.length; k++)
        D.push((v[k].byteLength & 65280) >>> 8), D.push(v[k].byteLength & 255), D = D.concat(Array.prototype.slice.call(v[k]));
      if (F = [R.avc1, new Uint8Array([
        0,
        0,
        0,
        0,
        0,
        0,
        // reserved
        0,
        1,
        // data_reference_index
        0,
        0,
        // pre_defined
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // pre_defined
        (f.width & 65280) >> 8,
        f.width & 255,
        // width
        (f.height & 65280) >> 8,
        f.height & 255,
        // height
        0,
        72,
        0,
        0,
        // horizresolution
        0,
        72,
        0,
        0,
        // vertresolution
        0,
        0,
        0,
        0,
        // reserved
        0,
        1,
        // frame_count
        19,
        118,
        105,
        100,
        101,
        111,
        106,
        115,
        45,
        99,
        111,
        110,
        116,
        114,
        105,
        98,
        45,
        104,
        108,
        115,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // compressorname
        0,
        24,
        // depth = 24
        17,
        17
        // pre_defined = -1
      ]), a(R.avcC, new Uint8Array([
        1,
        // configurationVersion
        f.profileIdc,
        // AVCProfileIndication
        f.profileCompatibility,
        // profile_compatibility
        f.levelIdc,
        // AVCLevelIndication
        255
        // lengthSizeMinusOne, hard-coded to 4 bytes
      ].concat(
        [p.length],
        // numOfSequenceParameterSets
        y,
        // "SPS"
        [v.length],
        // numOfPictureParameterSets
        D
        // "PPS"
      ))), a(R.btrt, new Uint8Array([
        0,
        28,
        156,
        128,
        // bufferSizeDB
        0,
        45,
        198,
        192,
        // maxBitrate
        0,
        45,
        198,
        192
        // avgBitrate
      ]))], f.sarRatio) {
        var O = f.sarRatio[0], U = f.sarRatio[1];
        F.push(a(R.pasp, new Uint8Array([(O & 4278190080) >> 24, (O & 16711680) >> 16, (O & 65280) >> 8, O & 255, (U & 4278190080) >> 24, (U & 16711680) >> 16, (U & 65280) >> 8, U & 255])));
      }
      return a.apply(null, F);
    }, d = function(f) {
      return a(R.mp4a, new Uint8Array([
        // SampleEntry, ISO/IEC 14496-12
        0,
        0,
        0,
        0,
        0,
        0,
        // reserved
        0,
        1,
        // data_reference_index
        // AudioSampleEntry, ISO/IEC 14496-12
        0,
        0,
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        // reserved
        (f.channelcount & 65280) >> 8,
        f.channelcount & 255,
        // channelcount
        (f.samplesize & 65280) >> 8,
        f.samplesize & 255,
        // samplesize
        0,
        0,
        // pre_defined
        0,
        0,
        // reserved
        (f.samplerate & 65280) >> 8,
        f.samplerate & 255,
        0,
        0
        // samplerate, 16.16
        // MP4AudioSampleEntry, ISO/IEC 14496-14
      ]), u(f));
    };
  })(), B = function(d) {
    var h = new Uint8Array([
      0,
      // version 0
      0,
      0,
      7,
      // flags
      0,
      0,
      0,
      0,
      // creation_time
      0,
      0,
      0,
      0,
      // modification_time
      (d.id & 4278190080) >> 24,
      (d.id & 16711680) >> 16,
      (d.id & 65280) >> 8,
      d.id & 255,
      // track_ID
      0,
      0,
      0,
      0,
      // reserved
      (d.duration & 4278190080) >> 24,
      (d.duration & 16711680) >> 16,
      (d.duration & 65280) >> 8,
      d.duration & 255,
      // duration
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      // layer
      0,
      0,
      // alternate_group
      1,
      0,
      // non-audio track volume
      0,
      0,
      // reserved
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      0,
      0,
      0,
      // transformation: unity matrix
      (d.width & 65280) >> 8,
      d.width & 255,
      0,
      0,
      // width
      (d.height & 65280) >> 8,
      d.height & 255,
      0,
      0
      // height
    ]);
    return a(R.tkhd, h);
  }, T = function(d) {
    var h, f, p, v, y, D, k;
    return h = a(R.tfhd, new Uint8Array([
      0,
      // version 0
      0,
      0,
      58,
      // flags
      (d.id & 4278190080) >> 24,
      (d.id & 16711680) >> 16,
      (d.id & 65280) >> 8,
      d.id & 255,
      // track_ID
      0,
      0,
      0,
      1,
      // sample_description_index
      0,
      0,
      0,
      0,
      // default_sample_duration
      0,
      0,
      0,
      0,
      // default_sample_size
      0,
      0,
      0,
      0
      // default_sample_flags
    ])), D = Math.floor(d.baseMediaDecodeTime / t), k = Math.floor(d.baseMediaDecodeTime % t), f = a(R.tfdt, new Uint8Array([
      1,
      // version 1
      0,
      0,
      0,
      // flags
      // baseMediaDecodeTime
      D >>> 24 & 255,
      D >>> 16 & 255,
      D >>> 8 & 255,
      D & 255,
      k >>> 24 & 255,
      k >>> 16 & 255,
      k >>> 8 & 255,
      k & 255
    ])), y = 92, d.type === "audio" ? (p = L(d, y), a(R.traf, h, f, p)) : (v = $(d), p = L(d, v.length + y), a(R.traf, h, f, p, v));
  }, M = function(d) {
    return d.duration = d.duration || 4294967295, a(R.trak, B(d), z(d));
  }, b = function(d) {
    var h = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      (d.id & 4278190080) >> 24,
      (d.id & 16711680) >> 16,
      (d.id & 65280) >> 8,
      d.id & 255,
      // track_ID
      0,
      0,
      0,
      1,
      // default_sample_description_index
      0,
      0,
      0,
      0,
      // default_sample_duration
      0,
      0,
      0,
      0,
      // default_sample_size
      0,
      1,
      0,
      1
      // default_sample_flags
    ]);
    return d.type !== "video" && (h[h.length - 1] = 0), a(R.trex, h);
  }, (function() {
    var x, d, h;
    h = function(p, v) {
      var y = 0, D = 0, k = 0, F = 0;
      return p.length && (p[0].duration !== void 0 && (y = 1), p[0].size !== void 0 && (D = 2), p[0].flags !== void 0 && (k = 4), p[0].compositionTimeOffset !== void 0 && (F = 8)), [
        0,
        // version 0
        0,
        y | D | k | F,
        1,
        // flags
        (p.length & 4278190080) >>> 24,
        (p.length & 16711680) >>> 16,
        (p.length & 65280) >>> 8,
        p.length & 255,
        // sample_count
        (v & 4278190080) >>> 24,
        (v & 16711680) >>> 16,
        (v & 65280) >>> 8,
        v & 255
        // data_offset
      ];
    }, d = function(p, v) {
      var y, D, k, F, O, U;
      for (F = p.samples || [], v += 20 + 16 * F.length, k = h(F, v), D = new Uint8Array(k.length + F.length * 16), D.set(k), y = k.length, U = 0; U < F.length; U++)
        O = F[U], D[y++] = (O.duration & 4278190080) >>> 24, D[y++] = (O.duration & 16711680) >>> 16, D[y++] = (O.duration & 65280) >>> 8, D[y++] = O.duration & 255, D[y++] = (O.size & 4278190080) >>> 24, D[y++] = (O.size & 16711680) >>> 16, D[y++] = (O.size & 65280) >>> 8, D[y++] = O.size & 255, D[y++] = O.flags.isLeading << 2 | O.flags.dependsOn, D[y++] = O.flags.isDependedOn << 6 | O.flags.hasRedundancy << 4 | O.flags.paddingValue << 1 | O.flags.isNonSyncSample, D[y++] = O.flags.degradationPriority & 61440, D[y++] = O.flags.degradationPriority & 15, D[y++] = (O.compositionTimeOffset & 4278190080) >>> 24, D[y++] = (O.compositionTimeOffset & 16711680) >>> 16, D[y++] = (O.compositionTimeOffset & 65280) >>> 8, D[y++] = O.compositionTimeOffset & 255;
      return a(R.trun, D);
    }, x = function(p, v) {
      var y, D, k, F, O, U;
      for (F = p.samples || [], v += 20 + 8 * F.length, k = h(F, v), y = new Uint8Array(k.length + F.length * 8), y.set(k), D = k.length, U = 0; U < F.length; U++)
        O = F[U], y[D++] = (O.duration & 4278190080) >>> 24, y[D++] = (O.duration & 16711680) >>> 16, y[D++] = (O.duration & 65280) >>> 8, y[D++] = O.duration & 255, y[D++] = (O.size & 4278190080) >>> 24, y[D++] = (O.size & 16711680) >>> 16, y[D++] = (O.size & 65280) >>> 8, y[D++] = O.size & 255;
      return a(R.trun, y);
    }, L = function(p, v) {
      return p.type === "audio" ? x(p, v) : d(p, v);
    };
  })();
  var Pe = {
    ftyp: l,
    mdat: c,
    moof: _,
    moov: C,
    initSegment: function(d) {
      var h = l(), f = C(d), p;
      return p = new Uint8Array(h.byteLength + f.byteLength), p.set(h), p.set(f, h.byteLength), p;
    }
  }, Ve = function(d) {
    var h, f, p = [], v = [];
    for (v.byteLength = 0, v.nalCount = 0, v.duration = 0, p.byteLength = 0, h = 0; h < d.length; h++)
      f = d[h], f.nalUnitType === "access_unit_delimiter_rbsp" ? (p.length && (p.duration = f.dts - p.dts, v.byteLength += p.byteLength, v.nalCount += p.length, v.duration += p.duration, v.push(p)), p = [f], p.byteLength = f.data.byteLength, p.pts = f.pts, p.dts = f.dts) : (f.nalUnitType === "slice_layer_without_partitioning_rbsp_idr" && (p.keyFrame = !0), p.duration = f.dts - p.dts, p.byteLength += f.data.byteLength, p.push(f));
    return v.length && (!p.duration || p.duration <= 0) && (p.duration = v[v.length - 1].duration), v.byteLength += p.byteLength, v.nalCount += p.length, v.duration += p.duration, v.push(p), v;
  }, Ie = function(d) {
    var h, f, p = [], v = [];
    for (p.byteLength = 0, p.nalCount = 0, p.duration = 0, p.pts = d[0].pts, p.dts = d[0].dts, v.byteLength = 0, v.nalCount = 0, v.duration = 0, v.pts = d[0].pts, v.dts = d[0].dts, h = 0; h < d.length; h++)
      f = d[h], f.keyFrame ? (p.length && (v.push(p), v.byteLength += p.byteLength, v.nalCount += p.nalCount, v.duration += p.duration), p = [f], p.nalCount = f.length, p.byteLength = f.byteLength, p.pts = f.pts, p.dts = f.dts, p.duration = f.duration) : (p.duration += f.duration, p.nalCount += f.length, p.byteLength += f.byteLength, p.push(f));
    return v.length && p.duration <= 0 && (p.duration = v[v.length - 1].duration), v.byteLength += p.byteLength, v.nalCount += p.nalCount, v.duration += p.duration, v.push(p), v;
  }, qe = function(d) {
    var h;
    return !d[0][0].keyFrame && d.length > 1 && (h = d.shift(), d.byteLength -= h.byteLength, d.nalCount -= h.nalCount, d[0][0].dts = h.dts, d[0][0].pts = h.pts, d[0][0].duration += h.duration), d;
  }, St = function() {
    return {
      size: 0,
      flags: {
        isLeading: 0,
        dependsOn: 1,
        isDependedOn: 0,
        hasRedundancy: 0,
        degradationPriority: 0,
        isNonSyncSample: 1
      }
    };
  }, Xe = function(d, h) {
    var f = St();
    return f.dataOffset = h, f.compositionTimeOffset = d.pts - d.dts, f.duration = d.duration, f.size = 4 * d.length, f.size += d.byteLength, d.keyFrame && (f.flags.dependsOn = 2, f.flags.isNonSyncSample = 0), f;
  }, pt = function(d, h) {
    var f, p, v, y, D, k = h || 0, F = [];
    for (f = 0; f < d.length; f++)
      for (y = d[f], p = 0; p < y.length; p++)
        D = y[p], v = Xe(D, k), k += v.size, F.push(v);
    return F;
  }, or = function(d) {
    var h, f, p, v, y, D, k = 0, F = d.byteLength, O = d.nalCount, U = F + 4 * O, X = new Uint8Array(U), ue = new DataView(X.buffer);
    for (h = 0; h < d.length; h++)
      for (v = d[h], f = 0; f < v.length; f++)
        for (y = v[f], p = 0; p < y.length; p++)
          D = y[p], ue.setUint32(k, D.data.byteLength), k += 4, X.set(D.data, k), k += D.data.byteLength;
    return X;
  }, Ye = function(d, h) {
    var f, p = h || 0, v = [];
    return f = Xe(d, p), v.push(f), v;
  }, ur = function(d) {
    var h, f, p = 0, v = d.byteLength, y = d.length, D = v + 4 * y, k = new Uint8Array(D), F = new DataView(k.buffer);
    for (h = 0; h < d.length; h++)
      f = d[h], F.setUint32(p, f.data.byteLength), p += 4, k.set(f.data, p), p += f.data.byteLength;
    return k;
  }, Ne = {
    groupNalsIntoFrames: Ve,
    groupFramesIntoGops: Ie,
    extendFirstKeyFrame: qe,
    generateSampleTable: pt,
    concatenateNalData: or,
    generateSampleTableForFrame: Ye,
    concatenateNalDataForFrame: ur
  }, yt = [33, 16, 5, 32, 164, 27], lr = [33, 65, 108, 84, 1, 2, 4, 8, 168, 2, 4, 8, 17, 191, 252], be = function(d) {
    for (var h = []; d--; )
      h.push(0);
    return h;
  }, Rt = function(d) {
    return Object.keys(d).reduce(function(h, f) {
      return h[f] = new Uint8Array(d[f].reduce(function(p, v) {
        return p.concat(v);
      }, [])), h;
    }, {});
  }, Ae, Be = function() {
    if (!Ae) {
      var d = {
        96e3: [yt, [227, 64], be(154), [56]],
        88200: [yt, [231], be(170), [56]],
        64e3: [yt, [248, 192], be(240), [56]],
        48e3: [yt, [255, 192], be(268), [55, 148, 128], be(54), [112]],
        44100: [yt, [255, 192], be(268), [55, 163, 128], be(84), [112]],
        32e3: [yt, [255, 192], be(268), [55, 234], be(226), [112]],
        24e3: [yt, [255, 192], be(268), [55, 255, 128], be(268), [111, 112], be(126), [224]],
        16e3: [yt, [255, 192], be(268), [55, 255, 128], be(268), [111, 255], be(269), [223, 108], be(195), [1, 192]],
        12e3: [lr, be(268), [3, 127, 248], be(268), [6, 255, 240], be(268), [13, 255, 224], be(268), [27, 253, 128], be(259), [56]],
        11025: [lr, be(268), [3, 127, 248], be(268), [6, 255, 240], be(268), [13, 255, 224], be(268), [27, 255, 192], be(268), [55, 175, 128], be(108), [112]],
        8e3: [lr, be(268), [3, 121, 16], be(47), [7]]
      };
      Ae = Rt(d);
    }
    return Ae;
  }, Mt = 9e4, zt, yr, dr, _r, Tr, mi, gi;
  zt = function(d) {
    return d * Mt;
  }, yr = function(d, h) {
    return d * h;
  }, dr = function(d) {
    return d / Mt;
  }, _r = function(d, h) {
    return d / h;
  }, Tr = function(d, h) {
    return zt(_r(d, h));
  }, mi = function(d, h) {
    return yr(dr(d), h);
  }, gi = function(d, h, f) {
    return dr(f ? d : d - h);
  };
  var Se = {
    ONE_SECOND_IN_TS: Mt,
    secondsToVideoTs: zt,
    secondsToAudioTs: yr,
    videoTsToSeconds: dr,
    audioTsToSeconds: _r,
    audioTsToVideoTs: Tr,
    videoTsToAudioTs: mi,
    metadataTsToSeconds: gi
  }, Br = function(d) {
    var h, f, p = 0;
    for (h = 0; h < d.length; h++)
      f = d[h], p += f.data.byteLength;
    return p;
  }, vi = function(d, h, f, p) {
    var v, y = 0, D = 0, k = 0, F = 0, O, U, X;
    if (h.length && (v = Se.audioTsToVideoTs(d.baseMediaDecodeTime, d.samplerate), y = Math.ceil(Se.ONE_SECOND_IN_TS / (d.samplerate / 1024)), f && p && (D = v - Math.max(f, p), k = Math.floor(D / y), F = k * y), !(k < 1 || F > Se.ONE_SECOND_IN_TS / 2))) {
      for (O = Be()[d.samplerate], O || (O = h[0].data), U = 0; U < k; U++)
        X = h[0], h.splice(0, 0, {
          data: O,
          dts: X.dts - y,
          pts: X.pts - y
        });
      return d.baseMediaDecodeTime -= Math.floor(Se.videoTsToAudioTs(F, d.samplerate)), F;
    }
  }, Ji = function(d, h, f) {
    return h.minSegmentDts >= f ? d : (h.minSegmentDts = 1 / 0, d.filter(function(p) {
      return p.dts >= f ? (h.minSegmentDts = Math.min(h.minSegmentDts, p.dts), h.minSegmentPts = h.minSegmentDts, !0) : !1;
    }));
  }, Zi = function(d) {
    var h, f, p = [];
    for (h = 0; h < d.length; h++)
      f = d[h], p.push({
        size: f.data.byteLength,
        duration: 1024
        // For AAC audio, all samples contain 1024 samples
      });
    return p;
  }, en = function(d) {
    var h, f, p = 0, v = new Uint8Array(Br(d));
    for (h = 0; h < d.length; h++)
      f = d[h], v.set(f.data, p), p += f.data.byteLength;
    return v;
  }, cr = {
    prefixWithSilence: vi,
    trimAdtsFramesByEarliestDts: Ji,
    generateSampleTable: Zi,
    concatenateFrameData: en
  }, fr = Se.ONE_SECOND_IN_TS, tn = function(d, h) {
    typeof h.pts == "number" && (d.timelineStartInfo.pts === void 0 && (d.timelineStartInfo.pts = h.pts), d.minSegmentPts === void 0 ? d.minSegmentPts = h.pts : d.minSegmentPts = Math.min(d.minSegmentPts, h.pts), d.maxSegmentPts === void 0 ? d.maxSegmentPts = h.pts : d.maxSegmentPts = Math.max(d.maxSegmentPts, h.pts)), typeof h.dts == "number" && (d.timelineStartInfo.dts === void 0 && (d.timelineStartInfo.dts = h.dts), d.minSegmentDts === void 0 ? d.minSegmentDts = h.dts : d.minSegmentDts = Math.min(d.minSegmentDts, h.dts), d.maxSegmentDts === void 0 ? d.maxSegmentDts = h.dts : d.maxSegmentDts = Math.max(d.maxSegmentDts, h.dts));
  }, yi = function(d) {
    delete d.minSegmentDts, delete d.maxSegmentDts, delete d.minSegmentPts, delete d.maxSegmentPts;
  }, rn = function(d, h) {
    var f, p, v = d.minSegmentDts;
    return h || (v -= d.timelineStartInfo.dts), f = d.timelineStartInfo.baseMediaDecodeTime, f += v, f = Math.max(0, f), d.type === "audio" && (p = d.samplerate / fr, f *= p, f = Math.floor(f)), f;
  }, S = {
    clearDtsInfo: yi,
    calculateTrackBaseMediaDecodeTime: rn,
    collectDtsInfo: tn
  }, A = 4, I = 128, G = function(d) {
    for (var h = 0, f = {
      payloadType: -1,
      payloadSize: 0
    }, p = 0, v = 0; h < d.byteLength && d[h] !== I; ) {
      for (; d[h] === 255; )
        p += 255, h++;
      for (p += d[h++]; d[h] === 255; )
        v += 255, h++;
      if (v += d[h++], !f.payload && p === A) {
        var y = String.fromCharCode(d[h + 3], d[h + 4], d[h + 5], d[h + 6]);
        if (y === "GA94") {
          f.payloadType = p, f.payloadSize = v, f.payload = d.subarray(h, h + v);
          break;
        } else
          f.payload = void 0;
      }
      h += v, p = 0, v = 0;
    }
    return f;
  }, se = function(d) {
    return d.payload[0] !== 181 || (d.payload[1] << 8 | d.payload[2]) !== 49 || String.fromCharCode(d.payload[3], d.payload[4], d.payload[5], d.payload[6]) !== "GA94" || d.payload[7] !== 3 ? null : d.payload.subarray(8, d.payload.length - 1);
  }, pe = function(d, h) {
    var f = [], p, v, y, D;
    if (!(h[0] & 64))
      return f;
    for (v = h[0] & 31, p = 0; p < v; p++)
      y = p * 3, D = {
        type: h[y + 2] & 3,
        pts: d
      }, h[y + 2] & 4 && (D.ccData = h[y + 3] << 8 | h[y + 4], f.push(D));
    return f;
  }, De = function(d) {
    for (var h = d.byteLength, f = [], p = 1, v, y; p < h - 2; )
      d[p] === 0 && d[p + 1] === 0 && d[p + 2] === 3 ? (f.push(p + 2), p += 2) : p++;
    if (f.length === 0)
      return d;
    v = h - f.length, y = new Uint8Array(v);
    var D = 0;
    for (p = 0; p < v; D++, p++)
      D === f[0] && (D++, f.shift()), y[p] = d[D];
    return y;
  }, ze = {
    parseSei: G,
    parseUserData: se,
    parseCaptionPackets: pe,
    discardEmulationPreventionBytes: De,
    USER_DATA_REGISTERED_ITU_T_T35: A
  }, Oe = function x(d) {
    d = d || {}, x.prototype.init.call(this), this.parse708captions_ = typeof d.parse708captions == "boolean" ? d.parse708captions : !0, this.captionPackets_ = [], this.ccStreams_ = [
      new ke(0, 0),
      // eslint-disable-line no-use-before-define
      new ke(0, 1),
      // eslint-disable-line no-use-before-define
      new ke(1, 0),
      // eslint-disable-line no-use-before-define
      new ke(1, 1)
      // eslint-disable-line no-use-before-define
    ], this.parse708captions_ && (this.cc708Stream_ = new xe({
      captionServices: d.captionServices
    })), this.reset(), this.ccStreams_.forEach(function(h) {
      h.on("data", this.trigger.bind(this, "data")), h.on("partialdone", this.trigger.bind(this, "partialdone")), h.on("done", this.trigger.bind(this, "done"));
    }, this), this.parse708captions_ && (this.cc708Stream_.on("data", this.trigger.bind(this, "data")), this.cc708Stream_.on("partialdone", this.trigger.bind(this, "partialdone")), this.cc708Stream_.on("done", this.trigger.bind(this, "done")));
  };
  Oe.prototype = new r(), Oe.prototype.push = function(x) {
    var d, h, f;
    if (x.nalUnitType === "sei_rbsp" && (d = ze.parseSei(x.escapedRBSP), !!d.payload && d.payloadType === ze.USER_DATA_REGISTERED_ITU_T_T35 && (h = ze.parseUserData(d), !!h))) {
      if (x.dts < this.latestDts_) {
        this.ignoreNextEqualDts_ = !0;
        return;
      } else if (x.dts === this.latestDts_ && this.ignoreNextEqualDts_) {
        this.numSameDts_--, this.numSameDts_ || (this.ignoreNextEqualDts_ = !1);
        return;
      }
      f = ze.parseCaptionPackets(x.pts, h), this.captionPackets_ = this.captionPackets_.concat(f), this.latestDts_ !== x.dts && (this.numSameDts_ = 0), this.numSameDts_++, this.latestDts_ = x.dts;
    }
  }, Oe.prototype.flushCCStreams = function(x) {
    this.ccStreams_.forEach(function(d) {
      return x === "flush" ? d.flush() : d.partialFlush();
    }, this);
  }, Oe.prototype.flushStream = function(x) {
    if (!this.captionPackets_.length) {
      this.flushCCStreams(x);
      return;
    }
    this.captionPackets_.forEach(function(d, h) {
      d.presortIndex = h;
    }), this.captionPackets_.sort(function(d, h) {
      return d.pts === h.pts ? d.presortIndex - h.presortIndex : d.pts - h.pts;
    }), this.captionPackets_.forEach(function(d) {
      d.type < 2 ? this.dispatchCea608Packet(d) : this.dispatchCea708Packet(d);
    }, this), this.captionPackets_.length = 0, this.flushCCStreams(x);
  }, Oe.prototype.flush = function() {
    return this.flushStream("flush");
  }, Oe.prototype.partialFlush = function() {
    return this.flushStream("partialFlush");
  }, Oe.prototype.reset = function() {
    this.latestDts_ = null, this.ignoreNextEqualDts_ = !1, this.numSameDts_ = 0, this.activeCea608Channel_ = [null, null], this.ccStreams_.forEach(function(x) {
      x.reset();
    });
  }, Oe.prototype.dispatchCea608Packet = function(x) {
    this.setsTextOrXDSActive(x) ? this.activeCea608Channel_[x.type] = null : this.setsChannel1Active(x) ? this.activeCea608Channel_[x.type] = 0 : this.setsChannel2Active(x) && (this.activeCea608Channel_[x.type] = 1), this.activeCea608Channel_[x.type] !== null && this.ccStreams_[(x.type << 1) + this.activeCea608Channel_[x.type]].push(x);
  }, Oe.prototype.setsChannel1Active = function(x) {
    return (x.ccData & 30720) === 4096;
  }, Oe.prototype.setsChannel2Active = function(x) {
    return (x.ccData & 30720) === 6144;
  }, Oe.prototype.setsTextOrXDSActive = function(x) {
    return (x.ccData & 28928) === 256 || (x.ccData & 30974) === 4138 || (x.ccData & 30974) === 6186;
  }, Oe.prototype.dispatchCea708Packet = function(x) {
    this.parse708captions_ && this.cc708Stream_.push(x);
  };
  var Nt = {
    127: 9834,
    // ♪
    4128: 32,
    // Transparent Space
    4129: 160,
    // Nob-breaking Transparent Space
    4133: 8230,
    // …
    4138: 352,
    // Š
    4140: 338,
    // Œ
    4144: 9608,
    // █
    4145: 8216,
    // ‘
    4146: 8217,
    // ’
    4147: 8220,
    // “
    4148: 8221,
    // ”
    4149: 8226,
    // •
    4153: 8482,
    // ™
    4154: 353,
    // š
    4156: 339,
    // œ
    4157: 8480,
    // ℠
    4159: 376,
    // Ÿ
    4214: 8539,
    // ⅛
    4215: 8540,
    // ⅜
    4216: 8541,
    // ⅝
    4217: 8542,
    // ⅞
    4218: 9168,
    // ⏐
    4219: 9124,
    // ⎤
    4220: 9123,
    // ⎣
    4221: 9135,
    // ⎯
    4222: 9126,
    // ⎦
    4223: 9121,
    // ⎡
    4256: 12600
    // ㄸ (CC char)
  }, wt = function(d) {
    var h = Nt[d] || d;
    return d & 4096 && d === h ? "" : String.fromCharCode(h);
  }, Et = function(d) {
    return 32 <= d && d <= 127 || 160 <= d && d <= 255;
  }, et = function(d) {
    this.windowNum = d, this.reset();
  };
  et.prototype.reset = function() {
    this.clearText(), this.pendingNewLine = !1, this.winAttr = {}, this.penAttr = {}, this.penLoc = {}, this.penColor = {}, this.visible = 0, this.rowLock = 0, this.columnLock = 0, this.priority = 0, this.relativePositioning = 0, this.anchorVertical = 0, this.anchorHorizontal = 0, this.anchorPoint = 0, this.rowCount = 1, this.virtualRowCount = this.rowCount + 1, this.columnCount = 41, this.windowStyle = 0, this.penStyle = 0;
  }, et.prototype.getText = function() {
    return this.rows.join(`
`);
  }, et.prototype.clearText = function() {
    this.rows = [""], this.rowIdx = 0;
  }, et.prototype.newLine = function(x) {
    for (this.rows.length >= this.virtualRowCount && typeof this.beforeRowOverflow == "function" && this.beforeRowOverflow(x), this.rows.length > 0 && (this.rows.push(""), this.rowIdx++); this.rows.length > this.virtualRowCount; )
      this.rows.shift(), this.rowIdx--;
  }, et.prototype.isEmpty = function() {
    return this.rows.length === 0 ? !0 : this.rows.length === 1 ? this.rows[0] === "" : !1;
  }, et.prototype.addText = function(x) {
    this.rows[this.rowIdx] += x;
  }, et.prototype.backspace = function() {
    if (!this.isEmpty()) {
      var x = this.rows[this.rowIdx];
      this.rows[this.rowIdx] = x.substr(0, x.length - 1);
    }
  };
  var Ct = function(d, h, f) {
    this.serviceNum = d, this.text = "", this.currentWindow = new et(-1), this.windows = [], this.stream = f, typeof h == "string" && this.createTextDecoder(h);
  };
  Ct.prototype.init = function(x, d) {
    this.startPts = x;
    for (var h = 0; h < 8; h++)
      this.windows[h] = new et(h), typeof d == "function" && (this.windows[h].beforeRowOverflow = d);
  }, Ct.prototype.setCurrentWindow = function(x) {
    this.currentWindow = this.windows[x];
  }, Ct.prototype.createTextDecoder = function(x) {
    if (typeof TextDecoder > "u")
      this.stream.trigger("log", {
        level: "warn",
        message: "The `encoding` option is unsupported without TextDecoder support"
      });
    else
      try {
        this.textDecoder_ = new TextDecoder(x);
      } catch (d) {
        this.stream.trigger("log", {
          level: "warn",
          message: "TextDecoder could not be created with " + x + " encoding. " + d
        });
      }
  };
  var xe = function x(d) {
    d = d || {}, x.prototype.init.call(this);
    var h = this, f = d.captionServices || {}, p = {}, v;
    Object.keys(f).forEach(function(y) {
      v = f[y], /^SERVICE/.test(y) && (p[y] = v.encoding);
    }), this.serviceEncodings = p, this.current708Packet = null, this.services = {}, this.push = function(y) {
      y.type === 3 ? (h.new708Packet(), h.add708Bytes(y)) : (h.current708Packet === null && h.new708Packet(), h.add708Bytes(y));
    };
  };
  xe.prototype = new r(), xe.prototype.new708Packet = function() {
    this.current708Packet !== null && this.push708Packet(), this.current708Packet = {
      data: [],
      ptsVals: []
    };
  }, xe.prototype.add708Bytes = function(x) {
    var d = x.ccData, h = d >>> 8, f = d & 255;
    this.current708Packet.ptsVals.push(x.pts), this.current708Packet.data.push(h), this.current708Packet.data.push(f);
  }, xe.prototype.push708Packet = function() {
    var x = this.current708Packet, d = x.data, h = null, f = null, p = 0, v = d[p++];
    for (x.seq = v >> 6, x.sizeCode = v & 63; p < d.length; p++)
      v = d[p++], h = v >> 5, f = v & 31, h === 7 && f > 0 && (v = d[p++], h = v), this.pushServiceBlock(h, p, f), f > 0 && (p += f - 1);
  }, xe.prototype.pushServiceBlock = function(x, d, h) {
    var f, p = d, v = this.current708Packet.data, y = this.services[x];
    for (y || (y = this.initService(x, p)); p < d + h && p < v.length; p++)
      f = v[p], Et(f) ? p = this.handleText(p, y) : f === 24 ? p = this.multiByteCharacter(p, y) : f === 16 ? p = this.extendedCommands(p, y) : 128 <= f && f <= 135 ? p = this.setCurrentWindow(p, y) : 152 <= f && f <= 159 ? p = this.defineWindow(p, y) : f === 136 ? p = this.clearWindows(p, y) : f === 140 ? p = this.deleteWindows(p, y) : f === 137 ? p = this.displayWindows(p, y) : f === 138 ? p = this.hideWindows(p, y) : f === 139 ? p = this.toggleWindows(p, y) : f === 151 ? p = this.setWindowAttributes(p, y) : f === 144 ? p = this.setPenAttributes(p, y) : f === 145 ? p = this.setPenColor(p, y) : f === 146 ? p = this.setPenLocation(p, y) : f === 143 ? y = this.reset(p, y) : f === 8 ? y.currentWindow.backspace() : f === 12 ? y.currentWindow.clearText() : f === 13 ? y.currentWindow.pendingNewLine = !0 : f === 14 ? y.currentWindow.clearText() : f === 141 && p++;
  }, xe.prototype.extendedCommands = function(x, d) {
    var h = this.current708Packet.data, f = h[++x];
    return Et(f) && (x = this.handleText(x, d, {
      isExtended: !0
    })), x;
  }, xe.prototype.getPts = function(x) {
    return this.current708Packet.ptsVals[Math.floor(x / 2)];
  }, xe.prototype.initService = function(x, d) {
    var f = "SERVICE" + x, h = this, f, p;
    return f in this.serviceEncodings && (p = this.serviceEncodings[f]), this.services[x] = new Ct(x, p, h), this.services[x].init(this.getPts(d), function(v) {
      h.flushDisplayed(v, h.services[x]);
    }), this.services[x];
  }, xe.prototype.handleText = function(x, d, h) {
    var f = h && h.isExtended, p = h && h.isMultiByte, v = this.current708Packet.data, y = f ? 4096 : 0, D = v[x], k = v[x + 1], F = d.currentWindow, O, U;
    return d.textDecoder_ && !f ? (p ? (U = [D, k], x++) : U = [D], O = d.textDecoder_.decode(new Uint8Array(U))) : O = wt(y | D), F.pendingNewLine && !F.isEmpty() && F.newLine(this.getPts(x)), F.pendingNewLine = !1, F.addText(O), x;
  }, xe.prototype.multiByteCharacter = function(x, d) {
    var h = this.current708Packet.data, f = h[x + 1], p = h[x + 2];
    return Et(f) && Et(p) && (x = this.handleText(++x, d, {
      isMultiByte: !0
    })), x;
  }, xe.prototype.setCurrentWindow = function(x, d) {
    var h = this.current708Packet.data, f = h[x], p = f & 7;
    return d.setCurrentWindow(p), x;
  }, xe.prototype.defineWindow = function(x, d) {
    var h = this.current708Packet.data, f = h[x], p = f & 7;
    d.setCurrentWindow(p);
    var v = d.currentWindow;
    return f = h[++x], v.visible = (f & 32) >> 5, v.rowLock = (f & 16) >> 4, v.columnLock = (f & 8) >> 3, v.priority = f & 7, f = h[++x], v.relativePositioning = (f & 128) >> 7, v.anchorVertical = f & 127, f = h[++x], v.anchorHorizontal = f, f = h[++x], v.anchorPoint = (f & 240) >> 4, v.rowCount = f & 15, f = h[++x], v.columnCount = f & 63, f = h[++x], v.windowStyle = (f & 56) >> 3, v.penStyle = f & 7, v.virtualRowCount = v.rowCount + 1, x;
  }, xe.prototype.setWindowAttributes = function(x, d) {
    var h = this.current708Packet.data, f = h[x], p = d.currentWindow.winAttr;
    return f = h[++x], p.fillOpacity = (f & 192) >> 6, p.fillRed = (f & 48) >> 4, p.fillGreen = (f & 12) >> 2, p.fillBlue = f & 3, f = h[++x], p.borderType = (f & 192) >> 6, p.borderRed = (f & 48) >> 4, p.borderGreen = (f & 12) >> 2, p.borderBlue = f & 3, f = h[++x], p.borderType += (f & 128) >> 5, p.wordWrap = (f & 64) >> 6, p.printDirection = (f & 48) >> 4, p.scrollDirection = (f & 12) >> 2, p.justify = f & 3, f = h[++x], p.effectSpeed = (f & 240) >> 4, p.effectDirection = (f & 12) >> 2, p.displayEffect = f & 3, x;
  }, xe.prototype.flushDisplayed = function(x, d) {
    for (var h = [], f = 0; f < 8; f++)
      d.windows[f].visible && !d.windows[f].isEmpty() && h.push(d.windows[f].getText());
    d.endPts = x, d.text = h.join(`

`), this.pushCaption(d), d.startPts = x;
  }, xe.prototype.pushCaption = function(x) {
    x.text !== "" && (this.trigger("data", {
      startPts: x.startPts,
      endPts: x.endPts,
      text: x.text,
      stream: "cc708_" + x.serviceNum
    }), x.text = "", x.startPts = x.endPts);
  }, xe.prototype.displayWindows = function(x, d) {
    var h = this.current708Packet.data, f = h[++x], p = this.getPts(x);
    this.flushDisplayed(p, d);
    for (var v = 0; v < 8; v++)
      f & 1 << v && (d.windows[v].visible = 1);
    return x;
  }, xe.prototype.hideWindows = function(x, d) {
    var h = this.current708Packet.data, f = h[++x], p = this.getPts(x);
    this.flushDisplayed(p, d);
    for (var v = 0; v < 8; v++)
      f & 1 << v && (d.windows[v].visible = 0);
    return x;
  }, xe.prototype.toggleWindows = function(x, d) {
    var h = this.current708Packet.data, f = h[++x], p = this.getPts(x);
    this.flushDisplayed(p, d);
    for (var v = 0; v < 8; v++)
      f & 1 << v && (d.windows[v].visible ^= 1);
    return x;
  }, xe.prototype.clearWindows = function(x, d) {
    var h = this.current708Packet.data, f = h[++x], p = this.getPts(x);
    this.flushDisplayed(p, d);
    for (var v = 0; v < 8; v++)
      f & 1 << v && d.windows[v].clearText();
    return x;
  }, xe.prototype.deleteWindows = function(x, d) {
    var h = this.current708Packet.data, f = h[++x], p = this.getPts(x);
    this.flushDisplayed(p, d);
    for (var v = 0; v < 8; v++)
      f & 1 << v && d.windows[v].reset();
    return x;
  }, xe.prototype.setPenAttributes = function(x, d) {
    var h = this.current708Packet.data, f = h[x], p = d.currentWindow.penAttr;
    return f = h[++x], p.textTag = (f & 240) >> 4, p.offset = (f & 12) >> 2, p.penSize = f & 3, f = h[++x], p.italics = (f & 128) >> 7, p.underline = (f & 64) >> 6, p.edgeType = (f & 56) >> 3, p.fontStyle = f & 7, x;
  }, xe.prototype.setPenColor = function(x, d) {
    var h = this.current708Packet.data, f = h[x], p = d.currentWindow.penColor;
    return f = h[++x], p.fgOpacity = (f & 192) >> 6, p.fgRed = (f & 48) >> 4, p.fgGreen = (f & 12) >> 2, p.fgBlue = f & 3, f = h[++x], p.bgOpacity = (f & 192) >> 6, p.bgRed = (f & 48) >> 4, p.bgGreen = (f & 12) >> 2, p.bgBlue = f & 3, f = h[++x], p.edgeRed = (f & 48) >> 4, p.edgeGreen = (f & 12) >> 2, p.edgeBlue = f & 3, x;
  }, xe.prototype.setPenLocation = function(x, d) {
    var h = this.current708Packet.data, f = h[x], p = d.currentWindow.penLoc;
    return d.currentWindow.pendingNewLine = !0, f = h[++x], p.row = f & 15, f = h[++x], p.column = f & 63, x;
  }, xe.prototype.reset = function(x, d) {
    var h = this.getPts(x);
    return this.flushDisplayed(h, d), this.initService(d.serviceNum, x);
  };
  var Kt = {
    42: 225,
    // á
    92: 233,
    // é
    94: 237,
    // í
    95: 243,
    // ó
    96: 250,
    // ú
    123: 231,
    // ç
    124: 247,
    // ÷
    125: 209,
    // Ñ
    126: 241,
    // ñ
    127: 9608,
    // █
    304: 174,
    // ®
    305: 176,
    // °
    306: 189,
    // ½
    307: 191,
    // ¿
    308: 8482,
    // ™
    309: 162,
    // ¢
    310: 163,
    // £
    311: 9834,
    // ♪
    312: 224,
    // à
    313: 160,
    //
    314: 232,
    // è
    315: 226,
    // â
    316: 234,
    // ê
    317: 238,
    // î
    318: 244,
    // ô
    319: 251,
    // û
    544: 193,
    // Á
    545: 201,
    // É
    546: 211,
    // Ó
    547: 218,
    // Ú
    548: 220,
    // Ü
    549: 252,
    // ü
    550: 8216,
    // ‘
    551: 161,
    // ¡
    552: 42,
    // *
    553: 39,
    // '
    554: 8212,
    // —
    555: 169,
    // ©
    556: 8480,
    // ℠
    557: 8226,
    // •
    558: 8220,
    // “
    559: 8221,
    // ”
    560: 192,
    // À
    561: 194,
    // Â
    562: 199,
    // Ç
    563: 200,
    // È
    564: 202,
    // Ê
    565: 203,
    // Ë
    566: 235,
    // ë
    567: 206,
    // Î
    568: 207,
    // Ï
    569: 239,
    // ï
    570: 212,
    // Ô
    571: 217,
    // Ù
    572: 249,
    // ù
    573: 219,
    // Û
    574: 171,
    // «
    575: 187,
    // »
    800: 195,
    // Ã
    801: 227,
    // ã
    802: 205,
    // Í
    803: 204,
    // Ì
    804: 236,
    // ì
    805: 210,
    // Ò
    806: 242,
    // ò
    807: 213,
    // Õ
    808: 245,
    // õ
    809: 123,
    // {
    810: 125,
    // }
    811: 92,
    // \
    812: 94,
    // ^
    813: 95,
    // _
    814: 124,
    // |
    815: 126,
    // ~
    816: 196,
    // Ä
    817: 228,
    // ä
    818: 214,
    // Ö
    819: 246,
    // ö
    820: 223,
    // ß
    821: 165,
    // ¥
    822: 164,
    // ¤
    823: 9474,
    // │
    824: 197,
    // Å
    825: 229,
    // å
    826: 216,
    // Ø
    827: 248,
    // ø
    828: 9484,
    // ┌
    829: 9488,
    // ┐
    830: 9492,
    // └
    831: 9496
    // ┘
  }, Bt = function(d) {
    return d === null ? "" : (d = Kt[d] || d, String.fromCharCode(d));
  }, je = 14, nn = [4352, 4384, 4608, 4640, 5376, 5408, 5632, 5664, 5888, 5920, 4096, 4864, 4896, 5120, 5152], mt = function() {
    for (var d = [], h = je + 1; h--; )
      d.push("");
    return d;
  }, ke = function x(d, h) {
    x.prototype.init.call(this), this.field_ = d || 0, this.dataChannel_ = h || 0, this.name_ = "CC" + ((this.field_ << 1 | this.dataChannel_) + 1), this.setConstants(), this.reset(), this.push = function(f) {
      var p, v, y, D, k;
      if (p = f.ccData & 32639, p === this.lastControlCode_) {
        this.lastControlCode_ = null;
        return;
      }
      if ((p & 61440) === 4096 ? this.lastControlCode_ = p : p !== this.PADDING_ && (this.lastControlCode_ = null), y = p >>> 8, D = p & 255, p !== this.PADDING_)
        if (p === this.RESUME_CAPTION_LOADING_)
          this.mode_ = "popOn";
        else if (p === this.END_OF_CAPTION_)
          this.mode_ = "popOn", this.clearFormatting(f.pts), this.flushDisplayed(f.pts), v = this.displayed_, this.displayed_ = this.nonDisplayed_, this.nonDisplayed_ = v, this.startPts_ = f.pts;
        else if (p === this.ROLL_UP_2_ROWS_)
          this.rollUpRows_ = 2, this.setRollUp(f.pts);
        else if (p === this.ROLL_UP_3_ROWS_)
          this.rollUpRows_ = 3, this.setRollUp(f.pts);
        else if (p === this.ROLL_UP_4_ROWS_)
          this.rollUpRows_ = 4, this.setRollUp(f.pts);
        else if (p === this.CARRIAGE_RETURN_)
          this.clearFormatting(f.pts), this.flushDisplayed(f.pts), this.shiftRowsUp_(), this.startPts_ = f.pts;
        else if (p === this.BACKSPACE_)
          this.mode_ === "popOn" ? this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, -1) : this.displayed_[this.row_] = this.displayed_[this.row_].slice(0, -1);
        else if (p === this.ERASE_DISPLAYED_MEMORY_)
          this.flushDisplayed(f.pts), this.displayed_ = mt();
        else if (p === this.ERASE_NON_DISPLAYED_MEMORY_)
          this.nonDisplayed_ = mt();
        else if (p === this.RESUME_DIRECT_CAPTIONING_)
          this.mode_ !== "paintOn" && (this.flushDisplayed(f.pts), this.displayed_ = mt()), this.mode_ = "paintOn", this.startPts_ = f.pts;
        else if (this.isSpecialCharacter(y, D))
          y = (y & 3) << 8, k = Bt(y | D), this[this.mode_](f.pts, k), this.column_++;
        else if (this.isExtCharacter(y, D))
          this.mode_ === "popOn" ? this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, -1) : this.displayed_[this.row_] = this.displayed_[this.row_].slice(0, -1), y = (y & 3) << 8, k = Bt(y | D), this[this.mode_](f.pts, k), this.column_++;
        else if (this.isMidRowCode(y, D))
          this.clearFormatting(f.pts), this[this.mode_](f.pts, " "), this.column_++, (D & 14) === 14 && this.addFormatting(f.pts, ["i"]), (D & 1) === 1 && this.addFormatting(f.pts, ["u"]);
        else if (this.isOffsetControlCode(y, D))
          this.column_ += D & 3;
        else if (this.isPAC(y, D)) {
          var F = nn.indexOf(p & 7968);
          this.mode_ === "rollUp" && (F - this.rollUpRows_ + 1 < 0 && (F = this.rollUpRows_ - 1), this.setRollUp(f.pts, F)), F !== this.row_ && (this.clearFormatting(f.pts), this.row_ = F), D & 1 && this.formatting_.indexOf("u") === -1 && this.addFormatting(f.pts, ["u"]), (p & 16) === 16 && (this.column_ = ((p & 14) >> 1) * 4), this.isColorPAC(D) && (D & 14) === 14 && this.addFormatting(f.pts, ["i"]);
        } else this.isNormalChar(y) && (D === 0 && (D = null), k = Bt(y), k += Bt(D), this[this.mode_](f.pts, k), this.column_ += k.length);
    };
  };
  ke.prototype = new r(), ke.prototype.flushDisplayed = function(x) {
    var d = this.displayed_.map(function(h, f) {
      try {
        return h.trim();
      } catch {
        return this.trigger("log", {
          level: "warn",
          message: "Skipping a malformed 608 caption at index " + f + "."
        }), "";
      }
    }, this).join(`
`).replace(/^\n+|\n+$/g, "");
    d.length && this.trigger("data", {
      startPts: this.startPts_,
      endPts: x,
      text: d,
      stream: this.name_
    });
  }, ke.prototype.reset = function() {
    this.mode_ = "popOn", this.topRow_ = 0, this.startPts_ = 0, this.displayed_ = mt(), this.nonDisplayed_ = mt(), this.lastControlCode_ = null, this.column_ = 0, this.row_ = je, this.rollUpRows_ = 2, this.formatting_ = [];
  }, ke.prototype.setConstants = function() {
    this.dataChannel_ === 0 ? (this.BASE_ = 16, this.EXT_ = 17, this.CONTROL_ = (20 | this.field_) << 8, this.OFFSET_ = 23) : this.dataChannel_ === 1 && (this.BASE_ = 24, this.EXT_ = 25, this.CONTROL_ = (28 | this.field_) << 8, this.OFFSET_ = 31), this.PADDING_ = 0, this.RESUME_CAPTION_LOADING_ = this.CONTROL_ | 32, this.END_OF_CAPTION_ = this.CONTROL_ | 47, this.ROLL_UP_2_ROWS_ = this.CONTROL_ | 37, this.ROLL_UP_3_ROWS_ = this.CONTROL_ | 38, this.ROLL_UP_4_ROWS_ = this.CONTROL_ | 39, this.CARRIAGE_RETURN_ = this.CONTROL_ | 45, this.RESUME_DIRECT_CAPTIONING_ = this.CONTROL_ | 41, this.BACKSPACE_ = this.CONTROL_ | 33, this.ERASE_DISPLAYED_MEMORY_ = this.CONTROL_ | 44, this.ERASE_NON_DISPLAYED_MEMORY_ = this.CONTROL_ | 46;
  }, ke.prototype.isSpecialCharacter = function(x, d) {
    return x === this.EXT_ && d >= 48 && d <= 63;
  }, ke.prototype.isExtCharacter = function(x, d) {
    return (x === this.EXT_ + 1 || x === this.EXT_ + 2) && d >= 32 && d <= 63;
  }, ke.prototype.isMidRowCode = function(x, d) {
    return x === this.EXT_ && d >= 32 && d <= 47;
  }, ke.prototype.isOffsetControlCode = function(x, d) {
    return x === this.OFFSET_ && d >= 33 && d <= 35;
  }, ke.prototype.isPAC = function(x, d) {
    return x >= this.BASE_ && x < this.BASE_ + 8 && d >= 64 && d <= 127;
  }, ke.prototype.isColorPAC = function(x) {
    return x >= 64 && x <= 79 || x >= 96 && x <= 127;
  }, ke.prototype.isNormalChar = function(x) {
    return x >= 32 && x <= 127;
  }, ke.prototype.setRollUp = function(x, d) {
    if (this.mode_ !== "rollUp" && (this.row_ = je, this.mode_ = "rollUp", this.flushDisplayed(x), this.nonDisplayed_ = mt(), this.displayed_ = mt()), d !== void 0 && d !== this.row_)
      for (var h = 0; h < this.rollUpRows_; h++)
        this.displayed_[d - h] = this.displayed_[this.row_ - h], this.displayed_[this.row_ - h] = "";
    d === void 0 && (d = this.row_), this.topRow_ = d - this.rollUpRows_ + 1;
  }, ke.prototype.addFormatting = function(x, d) {
    this.formatting_ = this.formatting_.concat(d);
    var h = d.reduce(function(f, p) {
      return f + "<" + p + ">";
    }, "");
    this[this.mode_](x, h);
  }, ke.prototype.clearFormatting = function(x) {
    if (this.formatting_.length) {
      var d = this.formatting_.reverse().reduce(function(h, f) {
        return h + "</" + f + ">";
      }, "");
      this.formatting_ = [], this[this.mode_](x, d);
    }
  }, ke.prototype.popOn = function(x, d) {
    var h = this.nonDisplayed_[this.row_];
    h += d, this.nonDisplayed_[this.row_] = h;
  }, ke.prototype.rollUp = function(x, d) {
    var h = this.displayed_[this.row_];
    h += d, this.displayed_[this.row_] = h;
  }, ke.prototype.shiftRowsUp_ = function() {
    var x;
    for (x = 0; x < this.topRow_; x++)
      this.displayed_[x] = "";
    for (x = this.row_ + 1; x < je + 1; x++)
      this.displayed_[x] = "";
    for (x = this.topRow_; x < this.row_; x++)
      this.displayed_[x] = this.displayed_[x + 1];
    this.displayed_[this.row_] = "";
  }, ke.prototype.paintOn = function(x, d) {
    var h = this.displayed_[this.row_];
    h += d, this.displayed_[this.row_] = h;
  };
  var an = {
    CaptionStream: Oe,
    Cea608Stream: ke,
    Cea708Stream: xe
  }, tt = {
    H264_STREAM_TYPE: 27,
    ADTS_STREAM_TYPE: 15,
    METADATA_STREAM_TYPE: 21
  }, Tf = 8589934592, bf = 4294967296, No = "shared", Ca = function(d, h) {
    var f = 1;
    for (d > h && (f = -1); Math.abs(h - d) > bf; )
      d += f * Tf;
    return d;
  }, Bo = function x(d) {
    var h, f;
    x.prototype.init.call(this), this.type_ = d || No, this.push = function(p) {
      this.type_ !== No && p.type !== this.type_ || (f === void 0 && (f = p.dts), p.dts = Ca(p.dts, f), p.pts = Ca(p.pts, f), h = p.dts, this.trigger("data", p));
    }, this.flush = function() {
      f = h, this.trigger("done");
    }, this.endTimeline = function() {
      this.flush(), this.trigger("endedtimeline");
    }, this.discontinuity = function() {
      f = void 0, h = void 0;
    }, this.reset = function() {
      this.discontinuity(), this.trigger("reset");
    };
  };
  Bo.prototype = new r();
  var Uo = {
    TimestampRolloverStream: Bo,
    handleRollover: Ca
  }, Vo = function(d, h, f) {
    var p, v = "";
    for (p = h; p < f; p++)
      v += "%" + ("00" + d[p].toString(16)).slice(-2);
    return v;
  }, sn = function(d, h, f) {
    return decodeURIComponent(Vo(d, h, f));
  }, xf = function(d, h, f) {
    return unescape(Vo(d, h, f));
  }, on = function(d) {
    return d[0] << 21 | d[1] << 14 | d[2] << 7 | d[3];
  }, qo = {
    TXXX: function(d) {
      var h;
      if (d.data[0] === 3) {
        for (h = 1; h < d.data.length; h++)
          if (d.data[h] === 0) {
            d.description = sn(d.data, 1, h), d.value = sn(d.data, h + 1, d.data.length).replace(/\0*$/, "");
            break;
          }
        d.data = d.value;
      }
    },
    WXXX: function(d) {
      var h;
      if (d.data[0] === 3) {
        for (h = 1; h < d.data.length; h++)
          if (d.data[h] === 0) {
            d.description = sn(d.data, 1, h), d.url = sn(d.data, h + 1, d.data.length);
            break;
          }
      }
    },
    PRIV: function(d) {
      var h;
      for (h = 0; h < d.data.length; h++)
        if (d.data[h] === 0) {
          d.owner = xf(d.data, 0, h);
          break;
        }
      d.privateData = d.data.subarray(h + 1), d.data = d.privateData;
    }
  }, un;
  un = function(d) {
    var h = {
      // the bytes of the program-level descriptor field in MP2T
      // see ISO/IEC 13818-1:2013 (E), section 2.6 "Program and
      // program element descriptors"
      descriptor: d && d.descriptor
    }, f = 0, p = [], v = 0, y;
    if (un.prototype.init.call(this), this.dispatchType = tt.METADATA_STREAM_TYPE.toString(16), h.descriptor)
      for (y = 0; y < h.descriptor.length; y++)
        this.dispatchType += ("00" + h.descriptor[y].toString(16)).slice(-2);
    this.push = function(D) {
      var k, F, O, U, X, ue;
      if (D.type === "timed-metadata") {
        if (D.dataAlignmentIndicator && (v = 0, p.length = 0), p.length === 0 && (D.data.length < 10 || D.data[0] !== 73 || D.data[1] !== 68 || D.data[2] !== 51)) {
          this.trigger("log", {
            level: "warn",
            message: "Skipping unrecognized metadata packet"
          });
          return;
        }
        if (p.push(D), v += D.data.byteLength, p.length === 1 && (f = on(D.data.subarray(6, 10)), f += 10), !(v < f)) {
          for (k = {
            data: new Uint8Array(f),
            frames: [],
            pts: p[0].pts,
            dts: p[0].dts
          }, X = 0; X < f; )
            k.data.set(p[0].data.subarray(0, f - X), X), X += p[0].data.byteLength, v -= p[0].data.byteLength, p.shift();
          F = 10, k.data[5] & 64 && (F += 4, F += on(k.data.subarray(10, 14)), f -= on(k.data.subarray(16, 20)));
          do {
            if (O = on(k.data.subarray(F + 4, F + 8)), O < 1) {
              this.trigger("log", {
                level: "warn",
                message: "Malformed ID3 frame encountered. Skipping metadata parsing."
              });
              return;
            }
            if (ue = String.fromCharCode(k.data[F], k.data[F + 1], k.data[F + 2], k.data[F + 3]), U = {
              id: ue,
              data: k.data.subarray(F + 10, F + O + 10)
            }, U.key = U.id, qo[U.id] && (qo[U.id](U), U.owner === "com.apple.streaming.transportStreamTimestamp")) {
              var de = U.data, ne = (de[3] & 1) << 30 | de[4] << 22 | de[5] << 14 | de[6] << 6 | de[7] >>> 2;
              ne *= 4, ne += de[7] & 3, U.timeStamp = ne, k.pts === void 0 && k.dts === void 0 && (k.pts = U.timeStamp, k.dts = U.timeStamp), this.trigger("timestamp", U);
            }
            k.frames.push(U), F += 10, F += O;
          } while (F < f);
          this.trigger("data", k);
        }
      }
    };
  }, un.prototype = new r();
  var Sf = un, Ef = Uo.TimestampRolloverStream, ln, _i, dn, Ur = 188, Aa = 71;
  ln = function() {
    var d = new Uint8Array(Ur), h = 0;
    ln.prototype.init.call(this), this.push = function(f) {
      var p = 0, v = Ur, y;
      for (h ? (y = new Uint8Array(f.byteLength + h), y.set(d.subarray(0, h)), y.set(f, h), h = 0) : y = f; v < y.byteLength; ) {
        if (y[p] === Aa && y[v] === Aa) {
          this.trigger("data", y.subarray(p, v)), p += Ur, v += Ur;
          continue;
        }
        p++, v++;
      }
      p < y.byteLength && (d.set(y.subarray(p), 0), h = y.byteLength - p);
    }, this.flush = function() {
      h === Ur && d[0] === Aa && (this.trigger("data", d), h = 0), this.trigger("done");
    }, this.endTimeline = function() {
      this.flush(), this.trigger("endedtimeline");
    }, this.reset = function() {
      h = 0, this.trigger("reset");
    };
  }, ln.prototype = new r(), _i = function() {
    var d, h, f, p;
    _i.prototype.init.call(this), p = this, this.packetsWaitingForPmt = [], this.programMapTable = void 0, d = function(y, D) {
      var k = 0;
      D.payloadUnitStartIndicator && (k += y[k] + 1), D.type === "pat" ? h(y.subarray(k), D) : f(y.subarray(k), D);
    }, h = function(y, D) {
      D.section_number = y[7], D.last_section_number = y[8], p.pmtPid = (y[10] & 31) << 8 | y[11], D.pmtPid = p.pmtPid;
    }, f = function(y, D) {
      var k, F, O, U;
      if (y[5] & 1) {
        for (p.programMapTable = {
          video: null,
          audio: null,
          "timed-metadata": {}
        }, k = (y[1] & 15) << 8 | y[2], F = 3 + k - 4, O = (y[10] & 15) << 8 | y[11], U = 12 + O; U < F; ) {
          var X = y[U], ue = (y[U + 1] & 31) << 8 | y[U + 2];
          X === tt.H264_STREAM_TYPE && p.programMapTable.video === null ? p.programMapTable.video = ue : X === tt.ADTS_STREAM_TYPE && p.programMapTable.audio === null ? p.programMapTable.audio = ue : X === tt.METADATA_STREAM_TYPE && (p.programMapTable["timed-metadata"][ue] = X), U += ((y[U + 3] & 15) << 8 | y[U + 4]) + 5;
        }
        D.programMapTable = p.programMapTable;
      }
    }, this.push = function(v) {
      var y = {}, D = 4;
      if (y.payloadUnitStartIndicator = !!(v[1] & 64), y.pid = v[1] & 31, y.pid <<= 8, y.pid |= v[2], (v[3] & 48) >>> 4 > 1 && (D += v[D] + 1), y.pid === 0)
        y.type = "pat", d(v.subarray(D), y), this.trigger("data", y);
      else if (y.pid === this.pmtPid)
        for (y.type = "pmt", d(v.subarray(D), y), this.trigger("data", y); this.packetsWaitingForPmt.length; )
          this.processPes_.apply(this, this.packetsWaitingForPmt.shift());
      else this.programMapTable === void 0 ? this.packetsWaitingForPmt.push([v, D, y]) : this.processPes_(v, D, y);
    }, this.processPes_ = function(v, y, D) {
      D.pid === this.programMapTable.video ? D.streamType = tt.H264_STREAM_TYPE : D.pid === this.programMapTable.audio ? D.streamType = tt.ADTS_STREAM_TYPE : D.streamType = this.programMapTable["timed-metadata"][D.pid], D.type = "pes", D.data = v.subarray(y), this.trigger("data", D);
    };
  }, _i.prototype = new r(), _i.STREAM_TYPES = {
    h264: 27,
    adts: 15
  }, dn = function() {
    var d = this, h = !1, f = {
      data: [],
      size: 0
    }, p = {
      data: [],
      size: 0
    }, v = {
      data: [],
      size: 0
    }, y, D = function(O, U) {
      var X, ue = O[0] << 16 | O[1] << 8 | O[2];
      U.data = new Uint8Array(), ue === 1 && (U.packetLength = 6 + (O[4] << 8 | O[5]), U.dataAlignmentIndicator = (O[6] & 4) !== 0, X = O[7], X & 192 && (U.pts = (O[9] & 14) << 27 | (O[10] & 255) << 20 | (O[11] & 254) << 12 | (O[12] & 255) << 5 | (O[13] & 254) >>> 3, U.pts *= 4, U.pts += (O[13] & 6) >>> 1, U.dts = U.pts, X & 64 && (U.dts = (O[14] & 14) << 27 | (O[15] & 255) << 20 | (O[16] & 254) << 12 | (O[17] & 255) << 5 | (O[18] & 254) >>> 3, U.dts *= 4, U.dts += (O[18] & 6) >>> 1)), U.data = O.subarray(9 + O[8]));
    }, k = function(O, U, X) {
      var ue = new Uint8Array(O.size), de = {
        type: U
      }, ne = 0, ve = 0, $e = !1, ot;
      if (!(!O.data.length || O.size < 9)) {
        for (de.trackId = O.data[0].pid, ne = 0; ne < O.data.length; ne++)
          ot = O.data[ne], ue.set(ot.data, ve), ve += ot.data.byteLength;
        D(ue, de), $e = U === "video" || de.packetLength <= O.size, (X || $e) && (O.size = 0, O.data.length = 0), $e && d.trigger("data", de);
      }
    };
    dn.prototype.init.call(this), this.push = function(F) {
      ({
        pat: function() {
        },
        pes: function() {
          var U, X;
          switch (F.streamType) {
            case tt.H264_STREAM_TYPE:
              U = f, X = "video";
              break;
            case tt.ADTS_STREAM_TYPE:
              U = p, X = "audio";
              break;
            case tt.METADATA_STREAM_TYPE:
              U = v, X = "timed-metadata";
              break;
            default:
              return;
          }
          F.payloadUnitStartIndicator && k(U, X, !0), U.data.push(F), U.size += F.data.byteLength;
        },
        pmt: function() {
          var U = {
            type: "metadata",
            tracks: []
          };
          y = F.programMapTable, y.video !== null && U.tracks.push({
            timelineStartInfo: {
              baseMediaDecodeTime: 0
            },
            id: +y.video,
            codec: "avc",
            type: "video"
          }), y.audio !== null && U.tracks.push({
            timelineStartInfo: {
              baseMediaDecodeTime: 0
            },
            id: +y.audio,
            codec: "adts",
            type: "audio"
          }), h = !0, d.trigger("data", U);
        }
      })[F.type]();
    }, this.reset = function() {
      f.size = 0, f.data.length = 0, p.size = 0, p.data.length = 0, this.trigger("reset");
    }, this.flushStreams_ = function() {
      k(f, "video"), k(p, "audio"), k(v, "timed-metadata");
    }, this.flush = function() {
      if (!h && y) {
        var F = {
          type: "metadata",
          tracks: []
        };
        y.video !== null && F.tracks.push({
          timelineStartInfo: {
            baseMediaDecodeTime: 0
          },
          id: +y.video,
          codec: "avc",
          type: "video"
        }), y.audio !== null && F.tracks.push({
          timelineStartInfo: {
            baseMediaDecodeTime: 0
          },
          id: +y.audio,
          codec: "adts",
          type: "audio"
        }), d.trigger("data", F);
      }
      h = !1, this.flushStreams_(), this.trigger("done");
    };
  }, dn.prototype = new r();
  var jo = {
    PAT_PID: 0,
    MP2T_PACKET_LENGTH: Ur,
    TransportPacketStream: ln,
    TransportParseStream: _i,
    ElementaryStream: dn,
    TimestampRolloverStream: Ef,
    CaptionStream: an.CaptionStream,
    Cea608Stream: an.Cea608Stream,
    Cea708Stream: an.Cea708Stream,
    MetadataStream: Sf
  };
  for (var Da in tt)
    tt.hasOwnProperty(Da) && (jo[Da] = tt[Da]);
  var $t = jo, Cf = Se.ONE_SECOND_IN_TS, cn, Ho = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
  cn = function(d) {
    var h, f = 0;
    cn.prototype.init.call(this), this.skipWarn_ = function(p, v) {
      this.trigger("log", {
        level: "warn",
        message: "adts skiping bytes " + p + " to " + v + " in frame " + f + " outside syncword"
      });
    }, this.push = function(p) {
      var v = 0, y, D, k, F, O;
      if (d || (f = 0), p.type === "audio") {
        h && h.length ? (k = h, h = new Uint8Array(k.byteLength + p.data.byteLength), h.set(k), h.set(p.data, k.byteLength)) : h = p.data;
        for (var U; v + 7 < h.length; ) {
          if (h[v] !== 255 || (h[v + 1] & 246) !== 240) {
            typeof U != "number" && (U = v), v++;
            continue;
          }
          if (typeof U == "number" && (this.skipWarn_(U, v), U = null), D = (~h[v + 1] & 1) * 2, y = (h[v + 3] & 3) << 11 | h[v + 4] << 3 | (h[v + 5] & 224) >> 5, F = ((h[v + 6] & 3) + 1) * 1024, O = F * Cf / Ho[(h[v + 2] & 60) >>> 2], h.byteLength - v < y)
            break;
          this.trigger("data", {
            pts: p.pts + f * O,
            dts: p.dts + f * O,
            sampleCount: F,
            audioobjecttype: (h[v + 2] >>> 6 & 3) + 1,
            channelcount: (h[v + 2] & 1) << 2 | (h[v + 3] & 192) >>> 6,
            samplerate: Ho[(h[v + 2] & 60) >>> 2],
            samplingfrequencyindex: (h[v + 2] & 60) >>> 2,
            // assume ISO/IEC 14496-12 AudioSampleEntry default of 16
            samplesize: 16,
            // data is the frame without it's header
            data: h.subarray(v + 7 + D, v + y)
          }), f++, v += y;
        }
        typeof U == "number" && (this.skipWarn_(U, v), U = null), h = h.subarray(v);
      }
    }, this.flush = function() {
      f = 0, this.trigger("done");
    }, this.reset = function() {
      h = void 0, this.trigger("reset");
    }, this.endTimeline = function() {
      h = void 0, this.trigger("endedtimeline");
    };
  }, cn.prototype = new r();
  var Wo = cn, Go;
  Go = function(d) {
    var h = d.byteLength, f = 0, p = 0;
    this.length = function() {
      return 8 * h;
    }, this.bitsAvailable = function() {
      return 8 * h + p;
    }, this.loadWord = function() {
      var v = d.byteLength - h, y = new Uint8Array(4), D = Math.min(4, h);
      if (D === 0)
        throw new Error("no bytes available");
      y.set(d.subarray(v, v + D)), f = new DataView(y.buffer).getUint32(0), p = D * 8, h -= D;
    }, this.skipBits = function(v) {
      var y;
      p > v ? (f <<= v, p -= v) : (v -= p, y = Math.floor(v / 8), v -= y * 8, h -= y, this.loadWord(), f <<= v, p -= v);
    }, this.readBits = function(v) {
      var y = Math.min(p, v), D = f >>> 32 - y;
      return p -= y, p > 0 ? f <<= y : h > 0 && this.loadWord(), y = v - y, y > 0 ? D << y | this.readBits(y) : D;
    }, this.skipLeadingZeros = function() {
      var v;
      for (v = 0; v < p; ++v)
        if ((f & 2147483648 >>> v) !== 0)
          return f <<= v, p -= v, v;
      return this.loadWord(), v + this.skipLeadingZeros();
    }, this.skipUnsignedExpGolomb = function() {
      this.skipBits(1 + this.skipLeadingZeros());
    }, this.skipExpGolomb = function() {
      this.skipBits(1 + this.skipLeadingZeros());
    }, this.readUnsignedExpGolomb = function() {
      var v = this.skipLeadingZeros();
      return this.readBits(v + 1) - 1;
    }, this.readExpGolomb = function() {
      var v = this.readUnsignedExpGolomb();
      return 1 & v ? 1 + v >>> 1 : -1 * (v >>> 1);
    }, this.readBoolean = function() {
      return this.readBits(1) === 1;
    }, this.readUnsignedByte = function() {
      return this.readBits(8);
    }, this.loadWord();
  };
  var Af = Go, fn, hn, zo;
  hn = function() {
    var d = 0, h, f;
    hn.prototype.init.call(this), this.push = function(p) {
      var v;
      f ? (v = new Uint8Array(f.byteLength + p.data.byteLength), v.set(f), v.set(p.data, f.byteLength), f = v) : f = p.data;
      for (var y = f.byteLength; d < y - 3; d++)
        if (f[d + 2] === 1) {
          h = d + 5;
          break;
        }
      for (; h < y; )
        switch (f[h]) {
          case 0:
            if (f[h - 1] !== 0) {
              h += 2;
              break;
            } else if (f[h - 2] !== 0) {
              h++;
              break;
            }
            d + 3 !== h - 2 && this.trigger("data", f.subarray(d + 3, h - 2));
            do
              h++;
            while (f[h] !== 1 && h < y);
            d = h - 2, h += 3;
            break;
          case 1:
            if (f[h - 1] !== 0 || f[h - 2] !== 0) {
              h += 3;
              break;
            }
            this.trigger("data", f.subarray(d + 3, h - 2)), d = h - 2, h += 3;
            break;
          default:
            h += 3;
            break;
        }
      f = f.subarray(d), h -= d, d = 0;
    }, this.reset = function() {
      f = null, d = 0, this.trigger("reset");
    }, this.flush = function() {
      f && f.byteLength > 3 && this.trigger("data", f.subarray(d + 3)), f = null, d = 0, this.trigger("done");
    }, this.endTimeline = function() {
      this.flush(), this.trigger("endedtimeline");
    };
  }, hn.prototype = new r(), zo = {
    100: !0,
    110: !0,
    122: !0,
    244: !0,
    44: !0,
    83: !0,
    86: !0,
    118: !0,
    128: !0,
    // TODO: the three profiles below don't
    // appear to have sps data in the specificiation anymore?
    138: !0,
    139: !0,
    134: !0
  }, fn = function() {
    var d = new hn(), h, f, p, v, y, D, k;
    fn.prototype.init.call(this), h = this, this.push = function(F) {
      F.type === "video" && (f = F.trackId, p = F.pts, v = F.dts, d.push(F));
    }, d.on("data", function(F) {
      var O = {
        trackId: f,
        pts: p,
        dts: v,
        data: F,
        nalUnitTypeCode: F[0] & 31
      };
      switch (O.nalUnitTypeCode) {
        case 5:
          O.nalUnitType = "slice_layer_without_partitioning_rbsp_idr";
          break;
        case 6:
          O.nalUnitType = "sei_rbsp", O.escapedRBSP = y(F.subarray(1));
          break;
        case 7:
          O.nalUnitType = "seq_parameter_set_rbsp", O.escapedRBSP = y(F.subarray(1)), O.config = D(O.escapedRBSP);
          break;
        case 8:
          O.nalUnitType = "pic_parameter_set_rbsp";
          break;
        case 9:
          O.nalUnitType = "access_unit_delimiter_rbsp";
          break;
      }
      h.trigger("data", O);
    }), d.on("done", function() {
      h.trigger("done");
    }), d.on("partialdone", function() {
      h.trigger("partialdone");
    }), d.on("reset", function() {
      h.trigger("reset");
    }), d.on("endedtimeline", function() {
      h.trigger("endedtimeline");
    }), this.flush = function() {
      d.flush();
    }, this.partialFlush = function() {
      d.partialFlush();
    }, this.reset = function() {
      d.reset();
    }, this.endTimeline = function() {
      d.endTimeline();
    }, k = function(O, U) {
      var X = 8, ue = 8, de, ne;
      for (de = 0; de < O; de++)
        ue !== 0 && (ne = U.readExpGolomb(), ue = (X + ne + 256) % 256), X = ue === 0 ? X : ue;
    }, y = function(O) {
      for (var U = O.byteLength, X = [], ue = 1, de, ne; ue < U - 2; )
        O[ue] === 0 && O[ue + 1] === 0 && O[ue + 2] === 3 ? (X.push(ue + 2), ue += 2) : ue++;
      if (X.length === 0)
        return O;
      de = U - X.length, ne = new Uint8Array(de);
      var ve = 0;
      for (ue = 0; ue < de; ve++, ue++)
        ve === X[0] && (ve++, X.shift()), ne[ue] = O[ve];
      return ne;
    }, D = function(O) {
      var U = 0, X = 0, ue = 0, de = 0, ne, ve, $e, ot, Er, Pa, pu, mu, gu, Ia, vu, He = [1, 1], yu, Cr;
      if (ne = new Af(O), ve = ne.readUnsignedByte(), ot = ne.readUnsignedByte(), $e = ne.readUnsignedByte(), ne.skipUnsignedExpGolomb(), zo[ve] && (Er = ne.readUnsignedExpGolomb(), Er === 3 && ne.skipBits(1), ne.skipUnsignedExpGolomb(), ne.skipUnsignedExpGolomb(), ne.skipBits(1), ne.readBoolean()))
        for (vu = Er !== 3 ? 8 : 12, Cr = 0; Cr < vu; Cr++)
          ne.readBoolean() && (Cr < 6 ? k(16, ne) : k(64, ne));
      if (ne.skipUnsignedExpGolomb(), Pa = ne.readUnsignedExpGolomb(), Pa === 0)
        ne.readUnsignedExpGolomb();
      else if (Pa === 1)
        for (ne.skipBits(1), ne.skipExpGolomb(), ne.skipExpGolomb(), pu = ne.readUnsignedExpGolomb(), Cr = 0; Cr < pu; Cr++)
          ne.skipExpGolomb();
      if (ne.skipUnsignedExpGolomb(), ne.skipBits(1), mu = ne.readUnsignedExpGolomb(), gu = ne.readUnsignedExpGolomb(), Ia = ne.readBits(1), Ia === 0 && ne.skipBits(1), ne.skipBits(1), ne.readBoolean() && (U = ne.readUnsignedExpGolomb(), X = ne.readUnsignedExpGolomb(), ue = ne.readUnsignedExpGolomb(), de = ne.readUnsignedExpGolomb()), ne.readBoolean() && ne.readBoolean()) {
        switch (yu = ne.readUnsignedByte(), yu) {
          case 1:
            He = [1, 1];
            break;
          case 2:
            He = [12, 11];
            break;
          case 3:
            He = [10, 11];
            break;
          case 4:
            He = [16, 11];
            break;
          case 5:
            He = [40, 33];
            break;
          case 6:
            He = [24, 11];
            break;
          case 7:
            He = [20, 11];
            break;
          case 8:
            He = [32, 11];
            break;
          case 9:
            He = [80, 33];
            break;
          case 10:
            He = [18, 11];
            break;
          case 11:
            He = [15, 11];
            break;
          case 12:
            He = [64, 33];
            break;
          case 13:
            He = [160, 99];
            break;
          case 14:
            He = [4, 3];
            break;
          case 15:
            He = [3, 2];
            break;
          case 16:
            He = [2, 1];
            break;
          case 255: {
            He = [ne.readUnsignedByte() << 8 | ne.readUnsignedByte(), ne.readUnsignedByte() << 8 | ne.readUnsignedByte()];
            break;
          }
        }
        He && He[0] / He[1];
      }
      return {
        profileIdc: ve,
        levelIdc: $e,
        profileCompatibility: ot,
        width: (mu + 1) * 16 - U * 2 - X * 2,
        height: (2 - Ia) * (gu + 1) * 16 - ue * 2 - de * 2,
        // sar is sample aspect ratio
        sarRatio: He
      };
    };
  }, fn.prototype = new r();
  var Df = {
    H264Stream: fn
  }, wf = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350], Ko = function(d, h) {
    var f = d[h + 6] << 21 | d[h + 7] << 14 | d[h + 8] << 7 | d[h + 9], p = d[h + 5], v = (p & 16) >> 4;
    return f = f >= 0 ? f : 0, v ? f + 20 : f + 10;
  }, kf = function x(d, h) {
    return d.length - h < 10 || d[h] !== 73 || d[h + 1] !== 68 || d[h + 2] !== 51 ? h : (h += Ko(d, h), x(d, h));
  }, Pf = function(d) {
    var h = kf(d, 0);
    return d.length >= h + 2 && (d[h] & 255) === 255 && (d[h + 1] & 240) === 240 && // verify that the 2 layer bits are 0, aka this
    // is not mp3 data but aac data.
    (d[h + 1] & 22) === 16;
  }, $o = function(d) {
    return d[0] << 21 | d[1] << 14 | d[2] << 7 | d[3];
  }, If = function(d, h, f) {
    var p, v = "";
    for (p = h; p < f; p++)
      v += "%" + ("00" + d[p].toString(16)).slice(-2);
    return v;
  }, Of = function(d, h, f) {
    return unescape(If(d, h, f));
  }, Lf = function(d, h) {
    var f = (d[h + 5] & 224) >> 5, p = d[h + 4] << 3, v = d[h + 3] & 6144;
    return v | p | f;
  }, Ff = function(d, h) {
    return d[h] === 73 && d[h + 1] === 68 && d[h + 2] === 51 ? "timed-metadata" : d[h] & !0 && (d[h + 1] & 240) === 240 ? "audio" : null;
  }, Rf = function(d) {
    for (var h = 0; h + 5 < d.length; ) {
      if (d[h] !== 255 || (d[h + 1] & 246) !== 240) {
        h++;
        continue;
      }
      return wf[(d[h + 2] & 60) >>> 2];
    }
    return null;
  }, Mf = function(d) {
    var h, f, p, v;
    h = 10, d[5] & 64 && (h += 4, h += $o(d.subarray(10, 14)));
    do {
      if (f = $o(d.subarray(h + 4, h + 8)), f < 1)
        return null;
      if (v = String.fromCharCode(d[h], d[h + 1], d[h + 2], d[h + 3]), v === "PRIV") {
        p = d.subarray(h + 10, h + f + 10);
        for (var y = 0; y < p.byteLength; y++)
          if (p[y] === 0) {
            var D = Of(p, 0, y);
            if (D === "com.apple.streaming.transportStreamTimestamp") {
              var k = p.subarray(y + 1), F = (k[3] & 1) << 30 | k[4] << 22 | k[5] << 14 | k[6] << 6 | k[7] >>> 2;
              return F *= 4, F += k[7] & 3, F;
            }
            break;
          }
      }
      h += 10, h += f;
    } while (h < d.byteLength);
    return null;
  }, pn = {
    isLikelyAacData: Pf,
    parseId3TagSize: Ko,
    parseAdtsSize: Lf,
    parseType: Ff,
    parseSampleRate: Rf,
    parseAacTimestamp: Mf
  }, mn;
  mn = function() {
    var d = new Uint8Array(), h = 0;
    mn.prototype.init.call(this), this.setTimestamp = function(f) {
      h = f;
    }, this.push = function(f) {
      var p = 0, v = 0, y, D, k, F;
      for (d.length ? (F = d.length, d = new Uint8Array(f.byteLength + F), d.set(d.subarray(0, F)), d.set(f, F)) : d = f; d.length - v >= 3; ) {
        if (d[v] === 73 && d[v + 1] === 68 && d[v + 2] === 51) {
          if (d.length - v < 10 || (p = pn.parseId3TagSize(d, v), v + p > d.length))
            break;
          D = {
            type: "timed-metadata",
            data: d.subarray(v, v + p)
          }, this.trigger("data", D), v += p;
          continue;
        } else if ((d[v] & 255) === 255 && (d[v + 1] & 240) === 240) {
          if (d.length - v < 7 || (p = pn.parseAdtsSize(d, v), v + p > d.length))
            break;
          k = {
            type: "audio",
            data: d.subarray(v, v + p),
            pts: h,
            dts: h
          }, this.trigger("data", k), v += p;
          continue;
        }
        v++;
      }
      y = d.length - v, y > 0 ? d = d.subarray(v) : d = new Uint8Array();
    }, this.reset = function() {
      d = new Uint8Array(), this.trigger("reset");
    }, this.endTimeline = function() {
      d = new Uint8Array(), this.trigger("endedtimeline");
    };
  }, mn.prototype = new r();
  var Nf = mn, Bf = ["audioobjecttype", "channelcount", "samplerate", "samplingfrequencyindex", "samplesize"], Xo = Bf, Uf = ["width", "height", "profileIdc", "levelIdc", "profileCompatibility", "sarRatio"], Yo = Uf, Vf = Df.H264Stream, qf = pn.isLikelyAacData, jf = Se.ONE_SECOND_IN_TS, gn, Ti, vn, br, Hf = function(d, h) {
    h.stream = d, this.trigger("log", h);
  }, Qo = function(d, h) {
    for (var f = Object.keys(h), p = 0; p < f.length; p++) {
      var v = f[p];
      v === "headOfPipeline" || !h[v].on || h[v].on("log", Hf.bind(d, v));
    }
  }, Jo = function(d, h) {
    var f;
    if (d.length !== h.length)
      return !1;
    for (f = 0; f < d.length; f++)
      if (d[f] !== h[f])
        return !1;
    return !0;
  }, Zo = function(d, h, f, p, v, y) {
    var D = f - h, k = p - h, F = v - f;
    return {
      start: {
        dts: d,
        pts: d + D
      },
      end: {
        dts: d + k,
        pts: d + F
      },
      prependedContentDuration: y,
      baseMediaDecodeTime: d
    };
  };
  Ti = function(d, h) {
    var f = [], p, v = 0, y = 0, D = 1 / 0;
    h = h || {}, p = h.firstSequenceNumber || 0, Ti.prototype.init.call(this), this.push = function(k) {
      S.collectDtsInfo(d, k), d && Xo.forEach(function(F) {
        d[F] = k[F];
      }), f.push(k);
    }, this.setEarliestDts = function(k) {
      v = k;
    }, this.setVideoBaseMediaDecodeTime = function(k) {
      D = k;
    }, this.setAudioAppendStart = function(k) {
      y = k;
    }, this.flush = function() {
      var k, F, O, U, X, ue, de;
      if (f.length === 0) {
        this.trigger("done", "AudioSegmentStream");
        return;
      }
      k = cr.trimAdtsFramesByEarliestDts(f, d, v), d.baseMediaDecodeTime = S.calculateTrackBaseMediaDecodeTime(d, h.keepOriginalTimestamps), de = cr.prefixWithSilence(d, k, y, D), d.samples = cr.generateSampleTable(k), O = Pe.mdat(cr.concatenateFrameData(k)), f = [], F = Pe.moof(p, [d]), U = new Uint8Array(F.byteLength + O.byteLength), p++, U.set(F), U.set(O, F.byteLength), S.clearDtsInfo(d), X = Math.ceil(jf * 1024 / d.samplerate), k.length && (ue = k.length * X, this.trigger("segmentTimingInfo", Zo(
        // The audio track's baseMediaDecodeTime is in audio clock cycles, but the
        // frame info is in video clock cycles. Convert to match expectation of
        // listeners (that all timestamps will be based on video clock cycles).
        Se.audioTsToVideoTs(d.baseMediaDecodeTime, d.samplerate),
        // frame times are already in video clock, as is segment duration
        k[0].dts,
        k[0].pts,
        k[0].dts + ue,
        k[0].pts + ue,
        de || 0
      )), this.trigger("timingInfo", {
        start: k[0].pts,
        end: k[0].pts + ue
      })), this.trigger("data", {
        track: d,
        boxes: U
      }), this.trigger("done", "AudioSegmentStream");
    }, this.reset = function() {
      S.clearDtsInfo(d), f = [], this.trigger("reset");
    };
  }, Ti.prototype = new r(), gn = function(d, h) {
    var f, p = [], v = [], y, D;
    h = h || {}, f = h.firstSequenceNumber || 0, gn.prototype.init.call(this), delete d.minPTS, this.gopCache_ = [], this.push = function(k) {
      S.collectDtsInfo(d, k), k.nalUnitType === "seq_parameter_set_rbsp" && !y && (y = k.config, d.sps = [k.data], Yo.forEach(function(F) {
        d[F] = y[F];
      }, this)), k.nalUnitType === "pic_parameter_set_rbsp" && !D && (D = k.data, d.pps = [k.data]), p.push(k);
    }, this.flush = function() {
      for (var k, F, O, U, X, ue, de = 0, ne, ve; p.length && p[0].nalUnitType !== "access_unit_delimiter_rbsp"; )
        p.shift();
      if (p.length === 0) {
        this.resetStream_(), this.trigger("done", "VideoSegmentStream");
        return;
      }
      if (k = Ne.groupNalsIntoFrames(p), O = Ne.groupFramesIntoGops(k), O[0][0].keyFrame || (F = this.getGopForFusion_(p[0], d), F ? (de = F.duration, O.unshift(F), O.byteLength += F.byteLength, O.nalCount += F.nalCount, O.pts = F.pts, O.dts = F.dts, O.duration += F.duration) : O = Ne.extendFirstKeyFrame(O)), v.length) {
        var $e;
        if (h.alignGopsAtEnd ? $e = this.alignGopsAtEnd_(O) : $e = this.alignGopsAtStart_(O), !$e) {
          this.gopCache_.unshift({
            gop: O.pop(),
            pps: d.pps,
            sps: d.sps
          }), this.gopCache_.length = Math.min(6, this.gopCache_.length), p = [], this.resetStream_(), this.trigger("done", "VideoSegmentStream");
          return;
        }
        S.clearDtsInfo(d), O = $e;
      }
      S.collectDtsInfo(d, O), d.samples = Ne.generateSampleTable(O), X = Pe.mdat(Ne.concatenateNalData(O)), d.baseMediaDecodeTime = S.calculateTrackBaseMediaDecodeTime(d, h.keepOriginalTimestamps), this.trigger("processedGopsInfo", O.map(function(ot) {
        return {
          pts: ot.pts,
          dts: ot.dts,
          byteLength: ot.byteLength
        };
      })), ne = O[0], ve = O[O.length - 1], this.trigger("segmentTimingInfo", Zo(d.baseMediaDecodeTime, ne.dts, ne.pts, ve.dts + ve.duration, ve.pts + ve.duration, de)), this.trigger("timingInfo", {
        start: O[0].pts,
        end: O[O.length - 1].pts + O[O.length - 1].duration
      }), this.gopCache_.unshift({
        gop: O.pop(),
        pps: d.pps,
        sps: d.sps
      }), this.gopCache_.length = Math.min(6, this.gopCache_.length), p = [], this.trigger("baseMediaDecodeTime", d.baseMediaDecodeTime), this.trigger("timelineStartInfo", d.timelineStartInfo), U = Pe.moof(f, [d]), ue = new Uint8Array(U.byteLength + X.byteLength), f++, ue.set(U), ue.set(X, U.byteLength), this.trigger("data", {
        track: d,
        boxes: ue
      }), this.resetStream_(), this.trigger("done", "VideoSegmentStream");
    }, this.reset = function() {
      this.resetStream_(), p = [], this.gopCache_.length = 0, v.length = 0, this.trigger("reset");
    }, this.resetStream_ = function() {
      S.clearDtsInfo(d), y = void 0, D = void 0;
    }, this.getGopForFusion_ = function(k) {
      var F = 45e3, O = 1 / 0, U, X, ue, de, ne;
      for (ne = 0; ne < this.gopCache_.length; ne++)
        de = this.gopCache_[ne], ue = de.gop, !(!(d.pps && Jo(d.pps[0], de.pps[0])) || !(d.sps && Jo(d.sps[0], de.sps[0]))) && (ue.dts < d.timelineStartInfo.dts || (U = k.dts - ue.dts - ue.duration, U >= -1e4 && U <= F && (!X || O > U) && (X = de, O = U)));
      return X ? X.gop : null;
    }, this.alignGopsAtStart_ = function(k) {
      var F, O, U, X, ue, de, ne, ve;
      for (ue = k.byteLength, de = k.nalCount, ne = k.duration, F = O = 0; F < v.length && O < k.length && (U = v[F], X = k[O], U.pts !== X.pts); ) {
        if (X.pts > U.pts) {
          F++;
          continue;
        }
        O++, ue -= X.byteLength, de -= X.nalCount, ne -= X.duration;
      }
      return O === 0 ? k : O === k.length ? null : (ve = k.slice(O), ve.byteLength = ue, ve.duration = ne, ve.nalCount = de, ve.pts = ve[0].pts, ve.dts = ve[0].dts, ve);
    }, this.alignGopsAtEnd_ = function(k) {
      var F, O, U, X, ue, de;
      for (F = v.length - 1, O = k.length - 1, ue = null, de = !1; F >= 0 && O >= 0; ) {
        if (U = v[F], X = k[O], U.pts === X.pts) {
          de = !0;
          break;
        }
        if (U.pts > X.pts) {
          F--;
          continue;
        }
        F === v.length - 1 && (ue = O), O--;
      }
      if (!de && ue === null)
        return null;
      var ne;
      if (de ? ne = O : ne = ue, ne === 0)
        return k;
      var ve = k.slice(ne), $e = ve.reduce(function(ot, Er) {
        return ot.byteLength += Er.byteLength, ot.duration += Er.duration, ot.nalCount += Er.nalCount, ot;
      }, {
        byteLength: 0,
        duration: 0,
        nalCount: 0
      });
      return ve.byteLength = $e.byteLength, ve.duration = $e.duration, ve.nalCount = $e.nalCount, ve.pts = ve[0].pts, ve.dts = ve[0].dts, ve;
    }, this.alignGopsWith = function(k) {
      v = k;
    };
  }, gn.prototype = new r(), br = function(d, h) {
    this.numberOfTracks = 0, this.metadataStream = h, d = d || {}, typeof d.remux < "u" ? this.remuxTracks = !!d.remux : this.remuxTracks = !0, typeof d.keepOriginalTimestamps == "boolean" ? this.keepOriginalTimestamps = d.keepOriginalTimestamps : this.keepOriginalTimestamps = !1, this.pendingTracks = [], this.videoTrack = null, this.pendingBoxes = [], this.pendingCaptions = [], this.pendingMetadata = [], this.pendingBytes = 0, this.emittedTracks = 0, br.prototype.init.call(this), this.push = function(f) {
      if (f.text)
        return this.pendingCaptions.push(f);
      if (f.frames)
        return this.pendingMetadata.push(f);
      this.pendingTracks.push(f.track), this.pendingBytes += f.boxes.byteLength, f.track.type === "video" && (this.videoTrack = f.track, this.pendingBoxes.push(f.boxes)), f.track.type === "audio" && (this.audioTrack = f.track, this.pendingBoxes.unshift(f.boxes));
    };
  }, br.prototype = new r(), br.prototype.flush = function(x) {
    var d = 0, h = {
      captions: [],
      captionStreams: {},
      metadata: [],
      info: {}
    }, f, p, v, y = 0, D;
    if (this.pendingTracks.length < this.numberOfTracks) {
      if (x !== "VideoSegmentStream" && x !== "AudioSegmentStream")
        return;
      if (this.remuxTracks)
        return;
      if (this.pendingTracks.length === 0) {
        this.emittedTracks++, this.emittedTracks >= this.numberOfTracks && (this.trigger("done"), this.emittedTracks = 0);
        return;
      }
    }
    if (this.videoTrack ? (y = this.videoTrack.timelineStartInfo.pts, Yo.forEach(function(k) {
      h.info[k] = this.videoTrack[k];
    }, this)) : this.audioTrack && (y = this.audioTrack.timelineStartInfo.pts, Xo.forEach(function(k) {
      h.info[k] = this.audioTrack[k];
    }, this)), this.videoTrack || this.audioTrack) {
      for (this.pendingTracks.length === 1 ? h.type = this.pendingTracks[0].type : h.type = "combined", this.emittedTracks += this.pendingTracks.length, v = Pe.initSegment(this.pendingTracks), h.initSegment = new Uint8Array(v.byteLength), h.initSegment.set(v), h.data = new Uint8Array(this.pendingBytes), D = 0; D < this.pendingBoxes.length; D++)
        h.data.set(this.pendingBoxes[D], d), d += this.pendingBoxes[D].byteLength;
      for (D = 0; D < this.pendingCaptions.length; D++)
        f = this.pendingCaptions[D], f.startTime = Se.metadataTsToSeconds(f.startPts, y, this.keepOriginalTimestamps), f.endTime = Se.metadataTsToSeconds(f.endPts, y, this.keepOriginalTimestamps), h.captionStreams[f.stream] = !0, h.captions.push(f);
      for (D = 0; D < this.pendingMetadata.length; D++)
        p = this.pendingMetadata[D], p.cueTime = Se.metadataTsToSeconds(p.pts, y, this.keepOriginalTimestamps), h.metadata.push(p);
      for (h.metadata.dispatchType = this.metadataStream.dispatchType, this.pendingTracks.length = 0, this.videoTrack = null, this.pendingBoxes.length = 0, this.pendingCaptions.length = 0, this.pendingBytes = 0, this.pendingMetadata.length = 0, this.trigger("data", h), D = 0; D < h.captions.length; D++)
        f = h.captions[D], this.trigger("caption", f);
      for (D = 0; D < h.metadata.length; D++)
        p = h.metadata[D], this.trigger("id3Frame", p);
    }
    this.emittedTracks >= this.numberOfTracks && (this.trigger("done"), this.emittedTracks = 0);
  }, br.prototype.setRemux = function(x) {
    this.remuxTracks = x;
  }, vn = function(d) {
    var h = this, f = !0, p, v;
    vn.prototype.init.call(this), d = d || {}, this.baseMediaDecodeTime = d.baseMediaDecodeTime || 0, this.transmuxPipeline_ = {}, this.setupAacPipeline = function() {
      var y = {};
      this.transmuxPipeline_ = y, y.type = "aac", y.metadataStream = new $t.MetadataStream(), y.aacStream = new Nf(), y.audioTimestampRolloverStream = new $t.TimestampRolloverStream("audio"), y.timedMetadataTimestampRolloverStream = new $t.TimestampRolloverStream("timed-metadata"), y.adtsStream = new Wo(), y.coalesceStream = new br(d, y.metadataStream), y.headOfPipeline = y.aacStream, y.aacStream.pipe(y.audioTimestampRolloverStream).pipe(y.adtsStream), y.aacStream.pipe(y.timedMetadataTimestampRolloverStream).pipe(y.metadataStream).pipe(y.coalesceStream), y.metadataStream.on("timestamp", function(D) {
        y.aacStream.setTimestamp(D.timeStamp);
      }), y.aacStream.on("data", function(D) {
        D.type !== "timed-metadata" && D.type !== "audio" || y.audioSegmentStream || (v = v || {
          timelineStartInfo: {
            baseMediaDecodeTime: h.baseMediaDecodeTime
          },
          codec: "adts",
          type: "audio"
        }, y.coalesceStream.numberOfTracks++, y.audioSegmentStream = new Ti(v, d), y.audioSegmentStream.on("log", h.getLogTrigger_("audioSegmentStream")), y.audioSegmentStream.on("timingInfo", h.trigger.bind(h, "audioTimingInfo")), y.adtsStream.pipe(y.audioSegmentStream).pipe(y.coalesceStream), h.trigger("trackinfo", {
          hasAudio: !!v,
          hasVideo: !!p
        }));
      }), y.coalesceStream.on("data", this.trigger.bind(this, "data")), y.coalesceStream.on("done", this.trigger.bind(this, "done")), Qo(this, y);
    }, this.setupTsPipeline = function() {
      var y = {};
      this.transmuxPipeline_ = y, y.type = "ts", y.metadataStream = new $t.MetadataStream(), y.packetStream = new $t.TransportPacketStream(), y.parseStream = new $t.TransportParseStream(), y.elementaryStream = new $t.ElementaryStream(), y.timestampRolloverStream = new $t.TimestampRolloverStream(), y.adtsStream = new Wo(), y.h264Stream = new Vf(), y.captionStream = new $t.CaptionStream(d), y.coalesceStream = new br(d, y.metadataStream), y.headOfPipeline = y.packetStream, y.packetStream.pipe(y.parseStream).pipe(y.elementaryStream).pipe(y.timestampRolloverStream), y.timestampRolloverStream.pipe(y.h264Stream), y.timestampRolloverStream.pipe(y.adtsStream), y.timestampRolloverStream.pipe(y.metadataStream).pipe(y.coalesceStream), y.h264Stream.pipe(y.captionStream).pipe(y.coalesceStream), y.elementaryStream.on("data", function(D) {
        var k;
        if (D.type === "metadata") {
          for (k = D.tracks.length; k--; )
            !p && D.tracks[k].type === "video" ? (p = D.tracks[k], p.timelineStartInfo.baseMediaDecodeTime = h.baseMediaDecodeTime) : !v && D.tracks[k].type === "audio" && (v = D.tracks[k], v.timelineStartInfo.baseMediaDecodeTime = h.baseMediaDecodeTime);
          p && !y.videoSegmentStream && (y.coalesceStream.numberOfTracks++, y.videoSegmentStream = new gn(p, d), y.videoSegmentStream.on("log", h.getLogTrigger_("videoSegmentStream")), y.videoSegmentStream.on("timelineStartInfo", function(F) {
            v && !d.keepOriginalTimestamps && (v.timelineStartInfo = F, y.audioSegmentStream.setEarliestDts(F.dts - h.baseMediaDecodeTime));
          }), y.videoSegmentStream.on("processedGopsInfo", h.trigger.bind(h, "gopInfo")), y.videoSegmentStream.on("segmentTimingInfo", h.trigger.bind(h, "videoSegmentTimingInfo")), y.videoSegmentStream.on("baseMediaDecodeTime", function(F) {
            v && y.audioSegmentStream.setVideoBaseMediaDecodeTime(F);
          }), y.videoSegmentStream.on("timingInfo", h.trigger.bind(h, "videoTimingInfo")), y.h264Stream.pipe(y.videoSegmentStream).pipe(y.coalesceStream)), v && !y.audioSegmentStream && (y.coalesceStream.numberOfTracks++, y.audioSegmentStream = new Ti(v, d), y.audioSegmentStream.on("log", h.getLogTrigger_("audioSegmentStream")), y.audioSegmentStream.on("timingInfo", h.trigger.bind(h, "audioTimingInfo")), y.audioSegmentStream.on("segmentTimingInfo", h.trigger.bind(h, "audioSegmentTimingInfo")), y.adtsStream.pipe(y.audioSegmentStream).pipe(y.coalesceStream)), h.trigger("trackinfo", {
            hasAudio: !!v,
            hasVideo: !!p
          });
        }
      }), y.coalesceStream.on("data", this.trigger.bind(this, "data")), y.coalesceStream.on("id3Frame", function(D) {
        D.dispatchType = y.metadataStream.dispatchType, h.trigger("id3Frame", D);
      }), y.coalesceStream.on("caption", this.trigger.bind(this, "caption")), y.coalesceStream.on("done", this.trigger.bind(this, "done")), Qo(this, y);
    }, this.setBaseMediaDecodeTime = function(y) {
      var D = this.transmuxPipeline_;
      d.keepOriginalTimestamps || (this.baseMediaDecodeTime = y), v && (v.timelineStartInfo.dts = void 0, v.timelineStartInfo.pts = void 0, S.clearDtsInfo(v), D.audioTimestampRolloverStream && D.audioTimestampRolloverStream.discontinuity()), p && (D.videoSegmentStream && (D.videoSegmentStream.gopCache_ = []), p.timelineStartInfo.dts = void 0, p.timelineStartInfo.pts = void 0, S.clearDtsInfo(p), D.captionStream.reset()), D.timestampRolloverStream && D.timestampRolloverStream.discontinuity();
    }, this.setAudioAppendStart = function(y) {
      v && this.transmuxPipeline_.audioSegmentStream.setAudioAppendStart(y);
    }, this.setRemux = function(y) {
      var D = this.transmuxPipeline_;
      d.remux = y, D && D.coalesceStream && D.coalesceStream.setRemux(y);
    }, this.alignGopsWith = function(y) {
      p && this.transmuxPipeline_.videoSegmentStream && this.transmuxPipeline_.videoSegmentStream.alignGopsWith(y);
    }, this.getLogTrigger_ = function(y) {
      var D = this;
      return function(k) {
        k.stream = y, D.trigger("log", k);
      };
    }, this.push = function(y) {
      if (f) {
        var D = qf(y);
        D && this.transmuxPipeline_.type !== "aac" ? this.setupAacPipeline() : !D && this.transmuxPipeline_.type !== "ts" && this.setupTsPipeline(), f = !1;
      }
      this.transmuxPipeline_.headOfPipeline.push(y);
    }, this.flush = function() {
      f = !0, this.transmuxPipeline_.headOfPipeline.flush();
    }, this.endTimeline = function() {
      this.transmuxPipeline_.headOfPipeline.endTimeline();
    }, this.reset = function() {
      this.transmuxPipeline_.headOfPipeline && this.transmuxPipeline_.headOfPipeline.reset();
    }, this.resetCaptions = function() {
      this.transmuxPipeline_.captionStream && this.transmuxPipeline_.captionStream.reset();
    };
  }, vn.prototype = new r();
  var Wf = {
    Transmuxer: vn
  }, Gf = function(d) {
    return d >>> 0;
  }, zf = function(d) {
    return ("00" + d.toString(16)).slice(-2);
  }, yn = {
    toUnsigned: Gf,
    toHexString: zf
  }, Kf = function(d) {
    var h = "";
    return h += String.fromCharCode(d[0]), h += String.fromCharCode(d[1]), h += String.fromCharCode(d[2]), h += String.fromCharCode(d[3]), h;
  }, xr = Kf, $f = yn.toUnsigned, Xf = function x(d, h) {
    var f = [], p, v, y, D, k;
    if (!h.length)
      return null;
    for (p = 0; p < d.byteLength; )
      v = $f(d[p] << 24 | d[p + 1] << 16 | d[p + 2] << 8 | d[p + 3]), y = xr(d.subarray(p + 4, p + 8)), D = v > 1 ? p + v : d.byteLength, y === h[0] && (h.length === 1 ? f.push(d.subarray(p + 8, D)) : (k = x(d.subarray(p + 8, D), h.slice(1)), k.length && (f = f.concat(k)))), p = D;
    return f;
  }, Le = Xf, Yf = yn.toUnsigned, Qf = e.getUint64, Jf = function(d) {
    var h = {
      version: d[0],
      flags: new Uint8Array(d.subarray(1, 4))
    };
    return h.version === 1 ? h.baseMediaDecodeTime = Qf(d.subarray(4)) : h.baseMediaDecodeTime = Yf(d[4] << 24 | d[5] << 16 | d[6] << 8 | d[7]), h;
  }, eu = Jf, Zf = function(d) {
    return {
      isLeading: (d[0] & 12) >>> 2,
      dependsOn: d[0] & 3,
      isDependedOn: (d[1] & 192) >>> 6,
      hasRedundancy: (d[1] & 48) >>> 4,
      paddingValue: (d[1] & 14) >>> 1,
      isNonSyncSample: d[1] & 1,
      degradationPriority: d[2] << 8 | d[3]
    };
  }, tu = Zf, eh = function(d) {
    var h = {
      version: d[0],
      flags: new Uint8Array(d.subarray(1, 4)),
      samples: []
    }, f = new DataView(d.buffer, d.byteOffset, d.byteLength), p = h.flags[2] & 1, v = h.flags[2] & 4, y = h.flags[1] & 1, D = h.flags[1] & 2, k = h.flags[1] & 4, F = h.flags[1] & 8, O = f.getUint32(4), U = 8, X;
    for (p && (h.dataOffset = f.getInt32(U), U += 4), v && O && (X = {
      flags: tu(d.subarray(U, U + 4))
    }, U += 4, y && (X.duration = f.getUint32(U), U += 4), D && (X.size = f.getUint32(U), U += 4), F && (h.version === 1 ? X.compositionTimeOffset = f.getInt32(U) : X.compositionTimeOffset = f.getUint32(U), U += 4), h.samples.push(X), O--); O--; )
      X = {}, y && (X.duration = f.getUint32(U), U += 4), D && (X.size = f.getUint32(U), U += 4), k && (X.flags = tu(d.subarray(U, U + 4)), U += 4), F && (h.version === 1 ? X.compositionTimeOffset = f.getInt32(U) : X.compositionTimeOffset = f.getUint32(U), U += 4), h.samples.push(X);
    return h;
  }, ru = eh, th = function(d) {
    var h = new DataView(d.buffer, d.byteOffset, d.byteLength), f = {
      version: d[0],
      flags: new Uint8Array(d.subarray(1, 4)),
      trackId: h.getUint32(4)
    }, p = f.flags[2] & 1, v = f.flags[2] & 2, y = f.flags[2] & 8, D = f.flags[2] & 16, k = f.flags[2] & 32, F = f.flags[0] & 65536, O = f.flags[0] & 131072, U;
    return U = 8, p && (U += 4, f.baseDataOffset = h.getUint32(12), U += 4), v && (f.sampleDescriptionIndex = h.getUint32(U), U += 4), y && (f.defaultSampleDuration = h.getUint32(U), U += 4), D && (f.defaultSampleSize = h.getUint32(U), U += 4), k && (f.defaultSampleFlags = h.getUint32(U)), F && (f.durationIsEmpty = !0), !p && O && (f.baseDataOffsetIsMoof = !0), f;
  }, iu = th, nu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, bi;
  typeof window < "u" ? bi = window : typeof nu < "u" ? bi = nu : typeof self < "u" ? bi = self : bi = {};
  var xi = bi, rh = ze.discardEmulationPreventionBytes, ih = an.CaptionStream, nh = function(d, h) {
    for (var f = d, p = 0; p < h.length; p++) {
      var v = h[p];
      if (f < v.size)
        return v;
      f -= v.size;
    }
    return null;
  }, ah = function(d, h, f) {
    var p = new DataView(d.buffer, d.byteOffset, d.byteLength), v = {
      logs: [],
      seiNals: []
    }, y, D, k, F;
    for (D = 0; D + 4 < d.length; D += k)
      if (k = p.getUint32(D), D += 4, !(k <= 0))
        switch (d[D] & 31) {
          case 6:
            var O = d.subarray(D + 1, D + 1 + k), U = nh(D, h);
            if (y = {
              nalUnitType: "sei_rbsp",
              size: k,
              data: O,
              escapedRBSP: rh(O),
              trackId: f
            }, U)
              y.pts = U.pts, y.dts = U.dts, F = U;
            else if (F)
              y.pts = F.pts, y.dts = F.dts;
            else {
              v.logs.push({
                level: "warn",
                message: "We've encountered a nal unit without data at " + D + " for trackId " + f + ". See mux.js#223."
              });
              break;
            }
            v.seiNals.push(y);
            break;
        }
    return v;
  }, sh = function(d, h, f) {
    var p = h, v = f.defaultSampleDuration || 0, y = f.defaultSampleSize || 0, D = f.trackId, k = [];
    return d.forEach(function(F) {
      var O = ru(F), U = O.samples;
      U.forEach(function(X) {
        X.duration === void 0 && (X.duration = v), X.size === void 0 && (X.size = y), X.trackId = D, X.dts = p, X.compositionTimeOffset === void 0 && (X.compositionTimeOffset = 0), typeof p == "bigint" ? (X.pts = p + xi.BigInt(X.compositionTimeOffset), p += xi.BigInt(X.duration)) : (X.pts = p + X.compositionTimeOffset, p += X.duration);
      }), k = k.concat(U);
    }), k;
  }, oh = function(d, h) {
    var f = Le(d, ["moof", "traf"]), p = Le(d, ["mdat"]), v = {}, y = [];
    return p.forEach(function(D, k) {
      var F = f[k];
      y.push({
        mdat: D,
        traf: F
      });
    }), y.forEach(function(D) {
      var k = D.mdat, F = D.traf, O = Le(F, ["tfhd"]), U = iu(O[0]), X = U.trackId, ue = Le(F, ["tfdt"]), de = ue.length > 0 ? eu(ue[0]).baseMediaDecodeTime : 0, ne = Le(F, ["trun"]), ve, $e;
      h === X && ne.length > 0 && (ve = sh(ne, de, U), $e = ah(k, ve, X), v[X] || (v[X] = {
        seiNals: [],
        logs: []
      }), v[X].seiNals = v[X].seiNals.concat($e.seiNals), v[X].logs = v[X].logs.concat($e.logs));
    }), v;
  }, uh = function(d, h, f) {
    var p;
    if (h === null)
      return null;
    p = oh(d, h);
    var v = p[h] || {};
    return {
      seiNals: v.seiNals,
      logs: v.logs,
      timescale: f
    };
  }, lh = function() {
    var d = !1, h, f, p, v, y, D;
    this.isInitialized = function() {
      return d;
    }, this.init = function(k) {
      h = new ih(), d = !0, D = k ? k.isPartial : !1, h.on("data", function(F) {
        F.startTime = F.startPts / v, F.endTime = F.endPts / v, y.captions.push(F), y.captionStreams[F.stream] = !0;
      }), h.on("log", function(F) {
        y.logs.push(F);
      });
    }, this.isNewInit = function(k, F) {
      return k && k.length === 0 || F && typeof F == "object" && Object.keys(F).length === 0 ? !1 : p !== k[0] || v !== F[p];
    }, this.parse = function(k, F, O) {
      var U;
      if (this.isInitialized()) {
        if (!F || !O)
          return null;
        if (this.isNewInit(F, O))
          p = F[0], v = O[p];
        else if (p === null || !v)
          return f.push(k), null;
      } else return null;
      for (; f.length > 0; ) {
        var X = f.shift();
        this.parse(X, F, O);
      }
      return U = uh(k, p, v), U && U.logs && (y.logs = y.logs.concat(U.logs)), U === null || !U.seiNals ? y.logs.length ? {
        logs: y.logs,
        captions: [],
        captionStreams: []
      } : null : (this.pushNals(U.seiNals), this.flushStream(), y);
    }, this.pushNals = function(k) {
      if (!this.isInitialized() || !k || k.length === 0)
        return null;
      k.forEach(function(F) {
        h.push(F);
      });
    }, this.flushStream = function() {
      if (!this.isInitialized())
        return null;
      D ? h.partialFlush() : h.flush();
    }, this.clearParsedCaptions = function() {
      y.captions = [], y.captionStreams = {}, y.logs = [];
    }, this.resetCaptionStream = function() {
      if (!this.isInitialized())
        return null;
      h.reset();
    }, this.clearAllCaptions = function() {
      this.clearParsedCaptions(), this.resetCaptionStream();
    }, this.reset = function() {
      f = [], p = null, v = null, y ? this.clearParsedCaptions() : y = {
        captions: [],
        // CC1, CC2, CC3, CC4
        captionStreams: {},
        logs: []
      }, this.resetCaptionStream();
    }, this.reset();
  }, dh = lh, _n = yn.toUnsigned, Si = yn.toHexString, ch = e.getUint64, au, su, ou, uu, lu, wa;
  au = function(d) {
    var h = {}, f = Le(d, ["moov", "trak"]);
    return f.reduce(function(p, v) {
      var y, D, k, F, O;
      return y = Le(v, ["tkhd"])[0], !y || (D = y[0], k = D === 0 ? 12 : 20, F = _n(y[k] << 24 | y[k + 1] << 16 | y[k + 2] << 8 | y[k + 3]), O = Le(v, ["mdia", "mdhd"])[0], !O) ? null : (D = O[0], k = D === 0 ? 12 : 20, p[F] = _n(O[k] << 24 | O[k + 1] << 16 | O[k + 2] << 8 | O[k + 3]), p);
    }, h);
  }, su = function(d, h) {
    var f;
    f = Le(h, ["moof", "traf"]);
    var p = f.reduce(function(v, y) {
      var D = Le(y, ["tfhd"])[0], k = _n(D[4] << 24 | D[5] << 16 | D[6] << 8 | D[7]), F = d[k] || 9e4, O = Le(y, ["tfdt"])[0], U = new DataView(O.buffer, O.byteOffset, O.byteLength), X;
      O[0] === 1 ? X = ch(O.subarray(4, 12)) : X = U.getUint32(4);
      var ue;
      return typeof X == "bigint" ? ue = X / xi.BigInt(F) : typeof X == "number" && !isNaN(X) && (ue = X / F), ue < Number.MAX_SAFE_INTEGER && (ue = Number(ue)), ue < v && (v = ue), v;
    }, 1 / 0);
    return typeof p == "bigint" || isFinite(p) ? p : 0;
  }, ou = function(d, h) {
    var f = Le(h, ["moof", "traf"]), p = 0, v = 0, y;
    if (f && f.length) {
      var D = Le(f[0], ["tfhd"])[0], k = Le(f[0], ["trun"])[0], F = Le(f[0], ["tfdt"])[0];
      if (D) {
        var O = iu(D);
        y = O.trackId;
      }
      if (F) {
        var U = eu(F);
        p = U.baseMediaDecodeTime;
      }
      if (k) {
        var X = ru(k);
        X.samples && X.samples.length && (v = X.samples[0].compositionTimeOffset || 0);
      }
    }
    var ue = d[y] || 9e4;
    typeof p == "bigint" && (v = xi.BigInt(v), ue = xi.BigInt(ue));
    var de = (p + v) / ue;
    return typeof de == "bigint" && de < Number.MAX_SAFE_INTEGER && (de = Number(de)), de;
  }, uu = function(d) {
    var h = Le(d, ["moov", "trak"]), f = [];
    return h.forEach(function(p) {
      var v = Le(p, ["mdia", "hdlr"]), y = Le(p, ["tkhd"]);
      v.forEach(function(D, k) {
        var F = xr(D.subarray(8, 12)), O = y[k], U, X, ue;
        F === "vide" && (U = new DataView(O.buffer, O.byteOffset, O.byteLength), X = U.getUint8(0), ue = X === 0 ? U.getUint32(12) : U.getUint32(20), f.push(ue));
      });
    }), f;
  }, wa = function(d) {
    var h = d[0], f = h === 0 ? 12 : 20;
    return _n(d[f] << 24 | d[f + 1] << 16 | d[f + 2] << 8 | d[f + 3]);
  }, lu = function(d) {
    var h = Le(d, ["moov", "trak"]), f = [];
    return h.forEach(function(p) {
      var v = {}, y = Le(p, ["tkhd"])[0], D, k;
      y && (D = new DataView(y.buffer, y.byteOffset, y.byteLength), k = D.getUint8(0), v.id = k === 0 ? D.getUint32(12) : D.getUint32(20));
      var F = Le(p, ["mdia", "hdlr"])[0];
      if (F) {
        var O = xr(F.subarray(8, 12));
        O === "vide" ? v.type = "video" : O === "soun" ? v.type = "audio" : v.type = O;
      }
      var U = Le(p, ["mdia", "minf", "stbl", "stsd"])[0];
      if (U) {
        var X = U.subarray(8);
        v.codec = xr(X.subarray(4, 8));
        var ue = Le(X, [v.codec])[0], de, ne;
        ue && (/^[asm]vc[1-9]$/i.test(v.codec) ? (de = ue.subarray(78), ne = xr(de.subarray(4, 8)), ne === "avcC" && de.length > 11 ? (v.codec += ".", v.codec += Si(de[9]), v.codec += Si(de[10]), v.codec += Si(de[11])) : v.codec = "avc1.4d400d") : /^mp4[a,v]$/i.test(v.codec) ? (de = ue.subarray(28), ne = xr(de.subarray(4, 8)), ne === "esds" && de.length > 20 && de[19] !== 0 ? (v.codec += "." + Si(de[19]), v.codec += "." + Si(de[20] >>> 2 & 63).replace(/^0/, "")) : v.codec = "mp4a.40.2") : v.codec = v.codec.toLowerCase());
      }
      var ve = Le(p, ["mdia", "mdhd"])[0];
      ve && (v.timescale = wa(ve)), f.push(v);
    }), f;
  };
  var du = {
    // export mp4 inspector's findBox and parseType for backwards compatibility
    findBox: Le,
    parseType: xr,
    timescale: au,
    startTime: su,
    compositionStartTime: ou,
    videoTrackIds: uu,
    tracks: lu,
    getTimescaleFromMediaHeader: wa
  }, cu = function(d) {
    var h = d[1] & 31;
    return h <<= 8, h |= d[2], h;
  }, Tn = function(d) {
    return !!(d[1] & 64);
  }, bn = function(d) {
    var h = 0;
    return (d[3] & 48) >>> 4 > 1 && (h += d[4] + 1), h;
  }, fh = function(d, h) {
    var f = cu(d);
    return f === 0 ? "pat" : f === h ? "pmt" : h ? "pes" : null;
  }, hh = function(d) {
    var h = Tn(d), f = 4 + bn(d);
    return h && (f += d[f] + 1), (d[f + 10] & 31) << 8 | d[f + 11];
  }, ph = function(d) {
    var h = {}, f = Tn(d), p = 4 + bn(d);
    if (f && (p += d[p] + 1), !!(d[p + 5] & 1)) {
      var v, y, D;
      v = (d[p + 1] & 15) << 8 | d[p + 2], y = 3 + v - 4, D = (d[p + 10] & 15) << 8 | d[p + 11];
      for (var k = 12 + D; k < y; ) {
        var F = p + k;
        h[(d[F + 1] & 31) << 8 | d[F + 2]] = d[F], k += ((d[F + 3] & 15) << 8 | d[F + 4]) + 5;
      }
      return h;
    }
  }, mh = function(d, h) {
    var f = cu(d), p = h[f];
    switch (p) {
      case tt.H264_STREAM_TYPE:
        return "video";
      case tt.ADTS_STREAM_TYPE:
        return "audio";
      case tt.METADATA_STREAM_TYPE:
        return "timed-metadata";
      default:
        return null;
    }
  }, gh = function(d) {
    var h = Tn(d);
    if (!h)
      return null;
    var f = 4 + bn(d);
    if (f >= d.byteLength)
      return null;
    var p = null, v;
    return v = d[f + 7], v & 192 && (p = {}, p.pts = (d[f + 9] & 14) << 27 | (d[f + 10] & 255) << 20 | (d[f + 11] & 254) << 12 | (d[f + 12] & 255) << 5 | (d[f + 13] & 254) >>> 3, p.pts *= 4, p.pts += (d[f + 13] & 6) >>> 1, p.dts = p.pts, v & 64 && (p.dts = (d[f + 14] & 14) << 27 | (d[f + 15] & 255) << 20 | (d[f + 16] & 254) << 12 | (d[f + 17] & 255) << 5 | (d[f + 18] & 254) >>> 3, p.dts *= 4, p.dts += (d[f + 18] & 6) >>> 1)), p;
  }, ka = function(d) {
    switch (d) {
      case 5:
        return "slice_layer_without_partitioning_rbsp_idr";
      case 6:
        return "sei_rbsp";
      case 7:
        return "seq_parameter_set_rbsp";
      case 8:
        return "pic_parameter_set_rbsp";
      case 9:
        return "access_unit_delimiter_rbsp";
      default:
        return null;
    }
  }, vh = function(d) {
    for (var h = 4 + bn(d), f = d.subarray(h), p = 0, v = 0, y = !1, D; v < f.byteLength - 3; v++)
      if (f[v + 2] === 1) {
        p = v + 5;
        break;
      }
    for (; p < f.byteLength; )
      switch (f[p]) {
        case 0:
          if (f[p - 1] !== 0) {
            p += 2;
            break;
          } else if (f[p - 2] !== 0) {
            p++;
            break;
          }
          v + 3 !== p - 2 && (D = ka(f[v + 3] & 31), D === "slice_layer_without_partitioning_rbsp_idr" && (y = !0));
          do
            p++;
          while (f[p] !== 1 && p < f.length);
          v = p - 2, p += 3;
          break;
        case 1:
          if (f[p - 1] !== 0 || f[p - 2] !== 0) {
            p += 3;
            break;
          }
          D = ka(f[v + 3] & 31), D === "slice_layer_without_partitioning_rbsp_idr" && (y = !0), v = p - 2, p += 3;
          break;
        default:
          p += 3;
          break;
      }
    return f = f.subarray(v), p -= v, v = 0, f && f.byteLength > 3 && (D = ka(f[v + 3] & 31), D === "slice_layer_without_partitioning_rbsp_idr" && (y = !0)), y;
  }, yh = {
    parseType: fh,
    parsePat: hh,
    parsePmt: ph,
    parsePayloadUnitStartIndicator: Tn,
    parsePesType: mh,
    parsePesTime: gh,
    videoPacketContainsKeyFrame: vh
  }, Vr = Uo.handleRollover, Ce = {};
  Ce.ts = yh, Ce.aac = pn;
  var Sr = Se.ONE_SECOND_IN_TS, st = 188, Ut = 71, _h = function(d, h) {
    for (var f = 0, p = st, v, y; p < d.byteLength; ) {
      if (d[f] === Ut && d[p] === Ut) {
        switch (v = d.subarray(f, p), y = Ce.ts.parseType(v, h.pid), y) {
          case "pat":
            h.pid = Ce.ts.parsePat(v);
            break;
          case "pmt":
            var D = Ce.ts.parsePmt(v);
            h.table = h.table || {}, Object.keys(D).forEach(function(k) {
              h.table[k] = D[k];
            });
            break;
        }
        f += st, p += st;
        continue;
      }
      f++, p++;
    }
  }, fu = function(d, h, f) {
    for (var p = 0, v = st, y, D, k, F, O, U = !1; v <= d.byteLength; ) {
      if (d[p] === Ut && (d[v] === Ut || v === d.byteLength)) {
        switch (y = d.subarray(p, v), D = Ce.ts.parseType(y, h.pid), D) {
          case "pes":
            k = Ce.ts.parsePesType(y, h.table), F = Ce.ts.parsePayloadUnitStartIndicator(y), k === "audio" && F && (O = Ce.ts.parsePesTime(y), O && (O.type = "audio", f.audio.push(O), U = !0));
            break;
        }
        if (U)
          break;
        p += st, v += st;
        continue;
      }
      p++, v++;
    }
    for (v = d.byteLength, p = v - st, U = !1; p >= 0; ) {
      if (d[p] === Ut && (d[v] === Ut || v === d.byteLength)) {
        switch (y = d.subarray(p, v), D = Ce.ts.parseType(y, h.pid), D) {
          case "pes":
            k = Ce.ts.parsePesType(y, h.table), F = Ce.ts.parsePayloadUnitStartIndicator(y), k === "audio" && F && (O = Ce.ts.parsePesTime(y), O && (O.type = "audio", f.audio.push(O), U = !0));
            break;
        }
        if (U)
          break;
        p -= st, v -= st;
        continue;
      }
      p--, v--;
    }
  }, Th = function(d, h, f) {
    for (var p = 0, v = st, y, D, k, F, O, U, X, ue, de = !1, ne = {
      data: [],
      size: 0
    }; v < d.byteLength; ) {
      if (d[p] === Ut && d[v] === Ut) {
        switch (y = d.subarray(p, v), D = Ce.ts.parseType(y, h.pid), D) {
          case "pes":
            if (k = Ce.ts.parsePesType(y, h.table), F = Ce.ts.parsePayloadUnitStartIndicator(y), k === "video" && (F && !de && (O = Ce.ts.parsePesTime(y), O && (O.type = "video", f.video.push(O), de = !0)), !f.firstKeyFrame)) {
              if (F && ne.size !== 0) {
                for (U = new Uint8Array(ne.size), X = 0; ne.data.length; )
                  ue = ne.data.shift(), U.set(ue, X), X += ue.byteLength;
                if (Ce.ts.videoPacketContainsKeyFrame(U)) {
                  var ve = Ce.ts.parsePesTime(U);
                  ve ? (f.firstKeyFrame = ve, f.firstKeyFrame.type = "video") : console.warn("Failed to extract PTS/DTS from PES at first keyframe. This could be an unusual TS segment, or else mux.js did not parse your TS segment correctly. If you know your TS segments do contain PTS/DTS on keyframes please file a bug report! You can try ffprobe to double check for yourself.");
                }
                ne.size = 0;
              }
              ne.data.push(y), ne.size += y.byteLength;
            }
            break;
        }
        if (de && f.firstKeyFrame)
          break;
        p += st, v += st;
        continue;
      }
      p++, v++;
    }
    for (v = d.byteLength, p = v - st, de = !1; p >= 0; ) {
      if (d[p] === Ut && d[v] === Ut) {
        switch (y = d.subarray(p, v), D = Ce.ts.parseType(y, h.pid), D) {
          case "pes":
            k = Ce.ts.parsePesType(y, h.table), F = Ce.ts.parsePayloadUnitStartIndicator(y), k === "video" && F && (O = Ce.ts.parsePesTime(y), O && (O.type = "video", f.video.push(O), de = !0));
            break;
        }
        if (de)
          break;
        p -= st, v -= st;
        continue;
      }
      p--, v--;
    }
  }, bh = function(d, h) {
    if (d.audio && d.audio.length) {
      var f = h;
      (typeof f > "u" || isNaN(f)) && (f = d.audio[0].dts), d.audio.forEach(function(y) {
        y.dts = Vr(y.dts, f), y.pts = Vr(y.pts, f), y.dtsTime = y.dts / Sr, y.ptsTime = y.pts / Sr;
      });
    }
    if (d.video && d.video.length) {
      var p = h;
      if ((typeof p > "u" || isNaN(p)) && (p = d.video[0].dts), d.video.forEach(function(y) {
        y.dts = Vr(y.dts, p), y.pts = Vr(y.pts, p), y.dtsTime = y.dts / Sr, y.ptsTime = y.pts / Sr;
      }), d.firstKeyFrame) {
        var v = d.firstKeyFrame;
        v.dts = Vr(v.dts, p), v.pts = Vr(v.pts, p), v.dtsTime = v.dts / Sr, v.ptsTime = v.pts / Sr;
      }
    }
  }, xh = function(d) {
    for (var h = !1, f = 0, p = null, v = null, y = 0, D = 0, k; d.length - D >= 3; ) {
      var F = Ce.aac.parseType(d, D);
      switch (F) {
        case "timed-metadata":
          if (d.length - D < 10) {
            h = !0;
            break;
          }
          if (y = Ce.aac.parseId3TagSize(d, D), y > d.length) {
            h = !0;
            break;
          }
          v === null && (k = d.subarray(D, D + y), v = Ce.aac.parseAacTimestamp(k)), D += y;
          break;
        case "audio":
          if (d.length - D < 7) {
            h = !0;
            break;
          }
          if (y = Ce.aac.parseAdtsSize(d, D), y > d.length) {
            h = !0;
            break;
          }
          p === null && (k = d.subarray(D, D + y), p = Ce.aac.parseSampleRate(k)), f++, D += y;
          break;
        default:
          D++;
          break;
      }
      if (h)
        return null;
    }
    if (p === null || v === null)
      return null;
    var O = Sr / p, U = {
      audio: [{
        type: "audio",
        dts: v,
        pts: v
      }, {
        type: "audio",
        dts: v + f * 1024 * O,
        pts: v + f * 1024 * O
      }]
    };
    return U;
  }, Sh = function(d) {
    var h = {
      pid: null,
      table: null
    }, f = {};
    _h(d, h);
    for (var p in h.table)
      if (h.table.hasOwnProperty(p)) {
        var v = h.table[p];
        switch (v) {
          case tt.H264_STREAM_TYPE:
            f.video = [], Th(d, h, f), f.video.length === 0 && delete f.video;
            break;
          case tt.ADTS_STREAM_TYPE:
            f.audio = [], fu(d, h, f), f.audio.length === 0 && delete f.audio;
            break;
        }
      }
    return f;
  }, Eh = function(d, h) {
    var f = Ce.aac.isLikelyAacData(d), p;
    return f ? p = xh(d) : p = Sh(d), !p || !p.audio && !p.video ? null : (bh(p, h), p);
  }, Ch = {
    inspect: Eh,
    parseAudioPes_: fu
  }, Ah = function(d, h) {
    h.on("data", function(f) {
      var p = f.initSegment;
      f.initSegment = {
        data: p.buffer,
        byteOffset: p.byteOffset,
        byteLength: p.byteLength
      };
      var v = f.data;
      f.data = v.buffer, d.postMessage({
        action: "data",
        segment: f,
        byteOffset: v.byteOffset,
        byteLength: v.byteLength
      }, [f.data]);
    }), h.on("done", function(f) {
      d.postMessage({
        action: "done"
      });
    }), h.on("gopInfo", function(f) {
      d.postMessage({
        action: "gopInfo",
        gopInfo: f
      });
    }), h.on("videoSegmentTimingInfo", function(f) {
      var p = {
        start: {
          decode: Se.videoTsToSeconds(f.start.dts),
          presentation: Se.videoTsToSeconds(f.start.pts)
        },
        end: {
          decode: Se.videoTsToSeconds(f.end.dts),
          presentation: Se.videoTsToSeconds(f.end.pts)
        },
        baseMediaDecodeTime: Se.videoTsToSeconds(f.baseMediaDecodeTime)
      };
      f.prependedContentDuration && (p.prependedContentDuration = Se.videoTsToSeconds(f.prependedContentDuration)), d.postMessage({
        action: "videoSegmentTimingInfo",
        videoSegmentTimingInfo: p
      });
    }), h.on("audioSegmentTimingInfo", function(f) {
      var p = {
        start: {
          decode: Se.videoTsToSeconds(f.start.dts),
          presentation: Se.videoTsToSeconds(f.start.pts)
        },
        end: {
          decode: Se.videoTsToSeconds(f.end.dts),
          presentation: Se.videoTsToSeconds(f.end.pts)
        },
        baseMediaDecodeTime: Se.videoTsToSeconds(f.baseMediaDecodeTime)
      };
      f.prependedContentDuration && (p.prependedContentDuration = Se.videoTsToSeconds(f.prependedContentDuration)), d.postMessage({
        action: "audioSegmentTimingInfo",
        audioSegmentTimingInfo: p
      });
    }), h.on("id3Frame", function(f) {
      d.postMessage({
        action: "id3Frame",
        id3Frame: f
      });
    }), h.on("caption", function(f) {
      d.postMessage({
        action: "caption",
        caption: f
      });
    }), h.on("trackinfo", function(f) {
      d.postMessage({
        action: "trackinfo",
        trackInfo: f
      });
    }), h.on("audioTimingInfo", function(f) {
      d.postMessage({
        action: "audioTimingInfo",
        audioTimingInfo: {
          start: Se.videoTsToSeconds(f.start),
          end: Se.videoTsToSeconds(f.end)
        }
      });
    }), h.on("videoTimingInfo", function(f) {
      d.postMessage({
        action: "videoTimingInfo",
        videoTimingInfo: {
          start: Se.videoTsToSeconds(f.start),
          end: Se.videoTsToSeconds(f.end)
        }
      });
    }), h.on("log", function(f) {
      d.postMessage({
        action: "log",
        log: f
      });
    });
  }, hu = /* @__PURE__ */ (function() {
    function x(h, f) {
      this.options = f || {}, this.self = h, this.init();
    }
    var d = x.prototype;
    return d.init = function() {
      this.transmuxer && this.transmuxer.dispose(), this.transmuxer = new Wf.Transmuxer(this.options), Ah(this.self, this.transmuxer);
    }, d.pushMp4Captions = function(f) {
      this.captionParser || (this.captionParser = new dh(), this.captionParser.init());
      var p = new Uint8Array(f.data, f.byteOffset, f.byteLength), v = this.captionParser.parse(p, f.trackIds, f.timescales);
      this.self.postMessage({
        action: "mp4Captions",
        captions: v && v.captions || [],
        logs: v && v.logs || [],
        data: p.buffer
      }, [p.buffer]);
    }, d.probeMp4StartTime = function(f) {
      var p = f.timescales, v = f.data, y = du.startTime(p, v);
      this.self.postMessage({
        action: "probeMp4StartTime",
        startTime: y,
        data: v
      }, [v.buffer]);
    }, d.probeMp4Tracks = function(f) {
      var p = f.data, v = du.tracks(p);
      this.self.postMessage({
        action: "probeMp4Tracks",
        tracks: v,
        data: p
      }, [p.buffer]);
    }, d.probeTs = function(f) {
      var p = f.data, v = f.baseStartTime, y = typeof v == "number" && !isNaN(v) ? v * Se.ONE_SECOND_IN_TS : void 0, D = Ch.inspect(p, y), k = null;
      D && (k = {
        // each type's time info comes back as an array of 2 times, start and end
        hasVideo: D.video && D.video.length === 2 || !1,
        hasAudio: D.audio && D.audio.length === 2 || !1
      }, k.hasVideo && (k.videoStart = D.video[0].ptsTime), k.hasAudio && (k.audioStart = D.audio[0].ptsTime)), this.self.postMessage({
        action: "probeTs",
        result: k,
        data: p
      }, [p.buffer]);
    }, d.clearAllMp4Captions = function() {
      this.captionParser && this.captionParser.clearAllCaptions();
    }, d.clearParsedMp4Captions = function() {
      this.captionParser && this.captionParser.clearParsedCaptions();
    }, d.push = function(f) {
      var p = new Uint8Array(f.data, f.byteOffset, f.byteLength);
      this.transmuxer.push(p);
    }, d.reset = function() {
      this.transmuxer.reset();
    }, d.setTimestampOffset = function(f) {
      var p = f.timestampOffset || 0;
      this.transmuxer.setBaseMediaDecodeTime(Math.round(Se.secondsToVideoTs(p)));
    }, d.setAudioAppendStart = function(f) {
      this.transmuxer.setAudioAppendStart(Math.ceil(Se.secondsToVideoTs(f.appendStart)));
    }, d.setRemux = function(f) {
      this.transmuxer.setRemux(f.remux);
    }, d.flush = function(f) {
      this.transmuxer.flush(), self.postMessage({
        action: "done",
        type: "transmuxed"
      });
    }, d.endTimeline = function() {
      this.transmuxer.endTimeline(), self.postMessage({
        action: "endedtimeline",
        type: "transmuxed"
      });
    }, d.alignGopsWith = function(f) {
      this.transmuxer.alignGopsWith(f.gopsToAlignWith.slice());
    }, x;
  })();
  self.onmessage = function(x) {
    if (x.data.action === "init" && x.data.options) {
      this.messageHandlers = new hu(self, x.data.options);
      return;
    }
    this.messageHandlers || (this.messageHandlers = new hu(self)), x.data && x.data.action && x.data.action !== "init" && this.messageHandlers[x.data.action] && this.messageHandlers[x.data.action](x.data);
  };
})), f0 = Xc(c0), h0 = function(r, n, i) {
  var e = r.data.segment, t = e.type, a = e.initSegment, o = e.captions, u = e.captionStreams, l = e.metadata, c = e.videoFrameDtsTime, m = e.videoFramePtsTime;
  n.buffer.push({
    captions: o,
    captionStreams: u,
    metadata: l
  });
  var g = r.data.segment.boxes || {
    data: r.data.segment.data
  }, _ = {
    type: t,
    // cast ArrayBuffer to TypedArray
    data: new Uint8Array(g.data, g.data.byteOffset, g.data.byteLength),
    initSegment: new Uint8Array(a.data, a.byteOffset, a.byteLength)
  };
  typeof c < "u" && (_.videoFrameDtsTime = c), typeof m < "u" && (_.videoFramePtsTime = m), i(_);
}, p0 = function(r) {
  var n = r.transmuxedData, i = r.callback;
  n.buffer = [], i(n);
}, m0 = function(r, n) {
  n.gopInfo = r.data.gopInfo;
}, Jc = function(r) {
  var n = r.transmuxer, i = r.bytes, e = r.audioAppendStart, t = r.gopsToAlignWith, a = r.remux, o = r.onData, u = r.onTrackInfo, l = r.onAudioTimingInfo, c = r.onVideoTimingInfo, m = r.onVideoSegmentTimingInfo, g = r.onAudioSegmentTimingInfo, _ = r.onId3, C = r.onCaptions, w = r.onDone, E = r.onEndedTimeline, M = r.onTransmuxerLog, B = r.isEndOfTimeline, z = {
    buffer: []
  }, W = B, H = function(T) {
    n.currentTransmux === r && (T.data.action === "data" && h0(T, z, o), T.data.action === "trackinfo" && u(T.data.trackInfo), T.data.action === "gopInfo" && m0(T, z), T.data.action === "audioTimingInfo" && l(T.data.audioTimingInfo), T.data.action === "videoTimingInfo" && c(T.data.videoTimingInfo), T.data.action === "videoSegmentTimingInfo" && m(T.data.videoSegmentTimingInfo), T.data.action === "audioSegmentTimingInfo" && g(T.data.audioSegmentTimingInfo), T.data.action === "id3Frame" && _([T.data.id3Frame], T.data.id3Frame.dispatchType), T.data.action === "caption" && C(T.data.caption), T.data.action === "endedtimeline" && (W = !1, E()), T.data.action === "log" && M(T.data.log), T.data.type === "transmuxed" && (W || (n.onmessage = null, p0({
      transmuxedData: z,
      callback: w
    }), Zc(n))));
  };
  if (n.onmessage = H, e && n.postMessage({
    action: "setAudioAppendStart",
    appendStart: e
  }), Array.isArray(t) && n.postMessage({
    action: "alignGopsWith",
    gopsToAlignWith: t
  }), typeof a < "u" && n.postMessage({
    action: "setRemux",
    remux: a
  }), i.byteLength) {
    var $ = i instanceof ArrayBuffer ? i : i.buffer, N = i instanceof ArrayBuffer ? 0 : i.byteOffset;
    n.postMessage({
      action: "push",
      // Send the typed-array of data as an ArrayBuffer so that
      // it can be sent as a "Transferable" and avoid the costly
      // memory copy
      data: $,
      // To recreate the original typed-array, we need information
      // about what portion of the ArrayBuffer it was a view into
      byteOffset: N,
      byteLength: i.byteLength
    }, [$]);
  }
  B && n.postMessage({
    action: "endTimeline"
  }), n.postMessage({
    action: "flush"
  });
}, Zc = function(r) {
  r.currentTransmux = null, r.transmuxQueue.length && (r.currentTransmux = r.transmuxQueue.shift(), typeof r.currentTransmux == "function" ? r.currentTransmux() : Jc(r.currentTransmux));
}, Rl = function(r, n) {
  r.postMessage({
    action: n
  }), Zc(r);
}, ef = function(r, n) {
  if (!n.currentTransmux) {
    n.currentTransmux = r, Rl(n, r);
    return;
  }
  n.transmuxQueue.push(Rl.bind(null, n, r));
}, g0 = function(r) {
  ef("reset", r);
}, v0 = function(r) {
  ef("endTimeline", r);
}, tf = function(r) {
  if (!r.transmuxer.currentTransmux) {
    r.transmuxer.currentTransmux = r, Jc(r);
    return;
  }
  r.transmuxer.transmuxQueue.push(r);
}, y0 = function(r) {
  var n = new f0();
  n.currentTransmux = null, n.transmuxQueue = [];
  var i = n.terminate;
  return n.terminate = function() {
    return n.currentTransmux = null, n.transmuxQueue.length = 0, i.call(n);
  }, n.postMessage({
    action: "init",
    options: r
  }), n;
}, ps = {
  reset: g0,
  endTimeline: v0,
  transmux: tf,
  createTransmuxer: y0
}, ia = function(r) {
  var n = r.transmuxer, i = r.endAction || r.action, e = r.callback, t = Ot({}, r, {
    endAction: null,
    transmuxer: null,
    callback: null
  }), a = function l(c) {
    c.data.action === i && (n.removeEventListener("message", l), c.data.data && (c.data.data = new Uint8Array(c.data.data, r.byteOffset || 0, r.byteLength || c.data.data.byteLength), r.data && (r.data = c.data.data)), e(c.data));
  };
  if (n.addEventListener("message", a), r.data) {
    var o = r.data instanceof ArrayBuffer;
    t.byteOffset = o ? 0 : r.data.byteOffset, t.byteLength = r.data.byteLength;
    var u = [o ? r.data : r.data.buffer];
    n.postMessage(t, u);
  } else
    n.postMessage(t);
}, Wt = {
  FAILURE: 2,
  TIMEOUT: -101,
  ABORTED: -102
}, Vs = function(r) {
  r.forEach(function(n) {
    n.abort();
  });
}, _0 = function(r) {
  return {
    bandwidth: r.bandwidth,
    bytesReceived: r.bytesReceived || 0,
    roundTripTime: r.roundTripTime || 0
  };
}, T0 = function(r) {
  var n = r.target, i = Date.now() - n.requestTime, e = {
    bandwidth: 1 / 0,
    bytesReceived: 0,
    roundTripTime: i || 0
  };
  return e.bytesReceived = r.loaded, e.bandwidth = Math.floor(e.bytesReceived / e.roundTripTime * 8 * 1e3), e;
}, Oo = function(r, n) {
  return n.timedout ? {
    status: n.status,
    message: "HLS request timed-out at URL: " + n.uri,
    code: Wt.TIMEOUT,
    xhr: n
  } : n.aborted ? {
    status: n.status,
    message: "HLS request aborted at URL: " + n.uri,
    code: Wt.ABORTED,
    xhr: n
  } : r ? {
    status: n.status,
    message: "HLS request errored at URL: " + n.uri,
    code: Wt.FAILURE,
    xhr: n
  } : n.responseType === "arraybuffer" && n.response.byteLength === 0 ? {
    status: n.status,
    message: "Empty HLS response at URL: " + n.uri,
    code: Wt.FAILURE,
    xhr: n
  } : null;
}, Ml = function(r, n, i) {
  return function(e, t) {
    var a = t.response, o = Oo(e, t);
    if (o)
      return i(o, r);
    if (a.byteLength !== 16)
      return i({
        status: t.status,
        message: "Invalid HLS key at URL: " + t.uri,
        code: Wt.FAILURE,
        xhr: t
      }, r);
    for (var u = new DataView(a), l = new Uint32Array([u.getUint32(0), u.getUint32(4), u.getUint32(8), u.getUint32(12)]), c = 0; c < n.length; c++)
      n[c].bytes = l;
    return i(null, r);
  };
}, rf = function(r, n) {
  var i = Ys(r.map.bytes);
  if (i !== "mp4") {
    var e = r.map.resolvedUri || r.map.uri;
    return n({
      internal: !0,
      message: "Found unsupported " + (i || "unknown") + " container for initialization segment at URL: " + e,
      code: Wt.FAILURE
    });
  }
  ia({
    action: "probeMp4Tracks",
    data: r.map.bytes,
    transmuxer: r.transmuxer,
    callback: function(a) {
      var o = a.tracks, u = a.data;
      return r.map.bytes = u, o.forEach(function(l) {
        r.map.tracks = r.map.tracks || {}, !r.map.tracks[l.type] && (r.map.tracks[l.type] = l, typeof l.id == "number" && l.timescale && (r.map.timescales = r.map.timescales || {}, r.map.timescales[l.id] = l.timescale));
      }), n(null);
    }
  });
}, b0 = function(r) {
  var n = r.segment, i = r.finishProcessingFn;
  return function(e, t) {
    var a = Oo(e, t);
    if (a)
      return i(a, n);
    var o = new Uint8Array(t.response);
    if (n.map.key)
      return n.map.encryptedBytes = o, i(null, n);
    n.map.bytes = o, rf(n, function(u) {
      if (u)
        return u.xhr = t, u.status = t.status, i(u, n);
      i(null, n);
    });
  };
}, x0 = function(r) {
  var n = r.segment, i = r.finishProcessingFn, e = r.responseType;
  return function(t, a) {
    var o = Oo(t, a);
    if (o)
      return i(o, n);
    var u = (
      // although responseText "should" exist, this guard serves to prevent an error being
      // thrown for two primary cases:
      // 1. the mime type override stops working, or is not implemented for a specific
      //    browser
      // 2. when using mock XHR libraries like sinon that do not allow the override behavior
      e === "arraybuffer" || !a.responseText ? a.response : l0(a.responseText.substring(n.lastReachedChar || 0))
    );
    return n.stats = _0(a), n.key ? n.encryptedBytes = new Uint8Array(u) : n.bytes = new Uint8Array(u), i(null, n);
  };
}, S0 = function(r) {
  var n = r.segment, i = r.bytes, e = r.trackInfoFn, t = r.timingInfoFn, a = r.videoSegmentTimingInfoFn, o = r.audioSegmentTimingInfoFn, u = r.id3Fn, l = r.captionsFn, c = r.isEndOfTimeline, m = r.endedTimelineFn, g = r.dataFn, _ = r.doneFn, C = r.onTransmuxerLog, w = n.map && n.map.tracks || {}, E = !!(w.audio && w.video), M = t.bind(null, n, "audio", "start"), B = t.bind(null, n, "audio", "end"), z = t.bind(null, n, "video", "start"), W = t.bind(null, n, "video", "end"), H = function() {
    return tf({
      bytes: i,
      transmuxer: n.transmuxer,
      audioAppendStart: n.audioAppendStart,
      gopsToAlignWith: n.gopsToAlignWith,
      remux: E,
      onData: function(q) {
        q.type = q.type === "combined" ? "video" : q.type, g(n, q);
      },
      onTrackInfo: function(q) {
        e && (E && (q.isMuxed = !0), e(n, q));
      },
      onAudioTimingInfo: function(q) {
        M && typeof q.start < "u" && (M(q.start), M = null), B && typeof q.end < "u" && B(q.end);
      },
      onVideoTimingInfo: function(q) {
        z && typeof q.start < "u" && (z(q.start), z = null), W && typeof q.end < "u" && W(q.end);
      },
      onVideoSegmentTimingInfo: function(q) {
        a(q);
      },
      onAudioSegmentTimingInfo: function(q) {
        o(q);
      },
      onId3: function(q, T) {
        u(n, q, T);
      },
      onCaptions: function(q) {
        l(n, [q]);
      },
      isEndOfTimeline: c,
      onEndedTimeline: function() {
        m();
      },
      onTransmuxerLog: C,
      onDone: function(q) {
        _ && (q.type = q.type === "combined" ? "video" : q.type, _(null, n, q));
      }
    });
  };
  ia({
    action: "probeTs",
    transmuxer: n.transmuxer,
    data: i,
    baseStartTime: n.baseStartTime,
    callback: function(N) {
      n.bytes = i = N.data;
      var q = N.result;
      q && (e(n, {
        hasAudio: q.hasAudio,
        hasVideo: q.hasVideo,
        isMuxed: E
      }), e = null, q.hasAudio && !E && M(q.audioStart), q.hasVideo && z(q.videoStart), M = null, z = null), H();
    }
  });
}, nf = function(r) {
  var n = r.segment, i = r.bytes, e = r.trackInfoFn, t = r.timingInfoFn, a = r.videoSegmentTimingInfoFn, o = r.audioSegmentTimingInfoFn, u = r.id3Fn, l = r.captionsFn, c = r.isEndOfTimeline, m = r.endedTimelineFn, g = r.dataFn, _ = r.doneFn, C = r.onTransmuxerLog, w = new Uint8Array(i);
  if (qm(w)) {
    n.isFmp4 = !0;
    var E = n.map.tracks, M = {
      isFmp4: !0,
      hasVideo: !!E.video,
      hasAudio: !!E.audio
    };
    E.audio && E.audio.codec && E.audio.codec !== "enca" && (M.audioCodec = E.audio.codec), E.video && E.video.codec && E.video.codec !== "encv" && (M.videoCodec = E.video.codec), E.video && E.audio && (M.isMuxed = !0), e(n, M);
    var B = function(W) {
      g(n, {
        data: w,
        type: M.hasAudio && !M.isMuxed ? "audio" : "video"
      }), W && W.length && l(n, W), _(null, n, {});
    };
    ia({
      action: "probeMp4StartTime",
      timescales: n.map.timescales,
      data: w,
      transmuxer: n.transmuxer,
      callback: function(W) {
        var H = W.data, $ = W.startTime;
        if (i = H.buffer, n.bytes = w = H, M.hasAudio && !M.isMuxed && t(n, "audio", "start", $), M.hasVideo && t(n, "video", "start", $), !E.video || !H.byteLength || !n.transmuxer) {
          B();
          return;
        }
        ia({
          action: "pushMp4Captions",
          endAction: "mp4Captions",
          transmuxer: n.transmuxer,
          data: w,
          timescales: n.map.timescales,
          trackIds: [E.video.id],
          callback: function(q) {
            i = q.data.buffer, n.bytes = w = q.data, q.logs.forEach(function(T) {
              C(V.mergeOptions(T, {
                stream: "mp4CaptionParser"
              }));
            }), B(q.captions);
          }
        });
      }
    });
    return;
  }
  if (!n.transmuxer) {
    _(null, n, {});
    return;
  }
  if (typeof n.container > "u" && (n.container = Ys(w)), n.container !== "ts" && n.container !== "aac") {
    e(n, {
      hasAudio: !1,
      hasVideo: !1
    }), _(null, n, {});
    return;
  }
  S0({
    segment: n,
    bytes: i,
    trackInfoFn: e,
    timingInfoFn: t,
    videoSegmentTimingInfoFn: a,
    audioSegmentTimingInfoFn: o,
    id3Fn: u,
    captionsFn: l,
    isEndOfTimeline: c,
    endedTimelineFn: m,
    dataFn: g,
    doneFn: _,
    onTransmuxerLog: C
  });
}, af = function(r, n) {
  var i = r.id, e = r.key, t = r.encryptedBytes, a = r.decryptionWorker, o = function l(c) {
    if (c.data.source === i) {
      a.removeEventListener("message", l);
      var m = c.data.decrypted;
      n(new Uint8Array(m.bytes, m.byteOffset, m.byteLength));
    }
  };
  a.addEventListener("message", o);
  var u;
  e.bytes.slice ? u = e.bytes.slice() : u = new Uint32Array(Array.prototype.slice.call(e.bytes)), a.postMessage(Hc({
    source: i,
    encrypted: t,
    key: u,
    iv: e.iv
  }), [t.buffer, u.buffer]);
}, E0 = function(r) {
  var n = r.decryptionWorker, i = r.segment, e = r.trackInfoFn, t = r.timingInfoFn, a = r.videoSegmentTimingInfoFn, o = r.audioSegmentTimingInfoFn, u = r.id3Fn, l = r.captionsFn, c = r.isEndOfTimeline, m = r.endedTimelineFn, g = r.dataFn, _ = r.doneFn, C = r.onTransmuxerLog;
  af({
    id: i.requestId,
    key: i.key,
    encryptedBytes: i.encryptedBytes,
    decryptionWorker: n
  }, function(w) {
    i.bytes = w, nf({
      segment: i,
      bytes: i.bytes,
      trackInfoFn: e,
      timingInfoFn: t,
      videoSegmentTimingInfoFn: a,
      audioSegmentTimingInfoFn: o,
      id3Fn: u,
      captionsFn: l,
      isEndOfTimeline: c,
      endedTimelineFn: m,
      dataFn: g,
      doneFn: _,
      onTransmuxerLog: C
    });
  });
}, C0 = function(r) {
  var n = r.activeXhrs, i = r.decryptionWorker, e = r.trackInfoFn, t = r.timingInfoFn, a = r.videoSegmentTimingInfoFn, o = r.audioSegmentTimingInfoFn, u = r.id3Fn, l = r.captionsFn, c = r.isEndOfTimeline, m = r.endedTimelineFn, g = r.dataFn, _ = r.doneFn, C = r.onTransmuxerLog, w = 0, E = !1;
  return function(M, B) {
    if (!E) {
      if (M)
        return E = !0, Vs(n), _(M, B);
      if (w += 1, w === n.length) {
        var z = function() {
          if (B.encryptedBytes)
            return E0({
              decryptionWorker: i,
              segment: B,
              trackInfoFn: e,
              timingInfoFn: t,
              videoSegmentTimingInfoFn: a,
              audioSegmentTimingInfoFn: o,
              id3Fn: u,
              captionsFn: l,
              isEndOfTimeline: c,
              endedTimelineFn: m,
              dataFn: g,
              doneFn: _,
              onTransmuxerLog: C
            });
          nf({
            segment: B,
            bytes: B.bytes,
            trackInfoFn: e,
            timingInfoFn: t,
            videoSegmentTimingInfoFn: a,
            audioSegmentTimingInfoFn: o,
            id3Fn: u,
            captionsFn: l,
            isEndOfTimeline: c,
            endedTimelineFn: m,
            dataFn: g,
            doneFn: _,
            onTransmuxerLog: C
          });
        };
        if (B.endOfAllRequests = Date.now(), B.map && B.map.encryptedBytes && !B.map.bytes)
          return af({
            decryptionWorker: i,
            // add -init to the "id" to differentiate between segment
            // and init segment decryption, just in case they happen
            // at the same time at some point in the future.
            id: B.requestId + "-init",
            encryptedBytes: B.map.encryptedBytes,
            key: B.map.key
          }, function(W) {
            B.map.bytes = W, rf(B, function(H) {
              if (H)
                return Vs(n), _(H, B);
              z();
            });
          });
        z();
      }
    }
  };
}, A0 = function(r) {
  var n = r.loadendState, i = r.abortFn;
  return function(e) {
    var t = e.target;
    t.aborted && i && !n.calledAbortFn && (i(), n.calledAbortFn = !0);
  };
}, D0 = function(r) {
  var n = r.segment, i = r.progressFn;
  return function(e) {
    var t = e.target;
    if (!t.aborted)
      return n.stats = V.mergeOptions(n.stats, T0(e)), !n.stats.firstBytesReceivedAt && n.stats.bytesReceived && (n.stats.firstBytesReceivedAt = Date.now()), i(e, n);
  };
}, w0 = function(r) {
  var n = r.xhr, i = r.xhrOptions, e = r.decryptionWorker, t = r.segment, a = r.abortFn, o = r.progressFn, u = r.trackInfoFn, l = r.timingInfoFn, c = r.videoSegmentTimingInfoFn, m = r.audioSegmentTimingInfoFn, g = r.id3Fn, _ = r.captionsFn, C = r.isEndOfTimeline, w = r.endedTimelineFn, E = r.dataFn, M = r.doneFn, B = r.onTransmuxerLog, z = [], W = C0({
    activeXhrs: z,
    decryptionWorker: e,
    trackInfoFn: u,
    timingInfoFn: l,
    videoSegmentTimingInfoFn: c,
    audioSegmentTimingInfoFn: m,
    id3Fn: g,
    captionsFn: _,
    isEndOfTimeline: C,
    endedTimelineFn: w,
    dataFn: E,
    doneFn: M,
    onTransmuxerLog: B
  });
  if (t.key && !t.key.bytes) {
    var H = [t.key];
    t.map && !t.map.bytes && t.map.key && t.map.key.resolvedUri === t.key.resolvedUri && H.push(t.map.key);
    var $ = V.mergeOptions(i, {
      uri: t.key.resolvedUri,
      responseType: "arraybuffer"
    }), N = Ml(t, H, W), q = n($, N);
    z.push(q);
  }
  if (t.map && !t.map.bytes) {
    var T = t.map.key && (!t.key || t.key.resolvedUri !== t.map.key.resolvedUri);
    if (T) {
      var b = V.mergeOptions(i, {
        uri: t.map.key.resolvedUri,
        responseType: "arraybuffer"
      }), L = Ml(t, [t.map.key], W), R = n(b, L);
      z.push(R);
    }
    var j = V.mergeOptions(i, {
      uri: t.map.resolvedUri,
      responseType: "arraybuffer",
      headers: Bs(t.map)
    }), K = b0({
      segment: t,
      finishProcessingFn: W
    }), Y = n(j, K);
    z.push(Y);
  }
  var re = V.mergeOptions(i, {
    uri: t.part && t.part.resolvedUri || t.resolvedUri,
    responseType: "arraybuffer",
    headers: Bs(t)
  }), J = x0({
    segment: t,
    finishProcessingFn: W,
    responseType: re.responseType
  }), ee = n(re, J);
  ee.addEventListener("progress", D0({
    segment: t,
    progressFn: o
  })), z.push(ee);
  var Z = {};
  return z.forEach(function(Q) {
    Q.addEventListener("loadend", A0({
      loadendState: Z,
      abortFn: a
    }));
  }), function() {
    return Vs(z);
  };
}, k0 = Ft("CodecUtils"), P0 = function(r) {
  var n = r.attributes || {};
  if (n.CODECS)
    return Vt(n.CODECS);
}, sf = function(r, n) {
  var i = n.attributes || {};
  return r && r.mediaGroups && r.mediaGroups.AUDIO && i.AUDIO && r.mediaGroups.AUDIO[i.AUDIO];
}, I0 = function(r, n) {
  if (!sf(r, n))
    return !0;
  var i = n.attributes || {}, e = r.mediaGroups.AUDIO[i.AUDIO];
  for (var t in e)
    if (!e[t].uri && !e[t].playlists)
      return !0;
  return !1;
}, na = function(r) {
  var n = {};
  return r.forEach(function(i) {
    var e = i.mediaType, t = i.type, a = i.details;
    n[e] = n[e] || [], n[e].push(id("" + t + a));
  }), Object.keys(n).forEach(function(i) {
    if (n[i].length > 1) {
      k0("multiple " + i + " codecs found as attributes: " + n[i].join(", ") + ". Setting playlist codecs to null so that we wait for mux.js to probe segments for real codecs."), n[i] = null;
      return;
    }
    n[i] = n[i][0];
  }), n;
}, Nl = function(r) {
  var n = 0;
  return r.audio && n++, r.video && n++, n;
}, Mi = function(r, n) {
  var i = n.attributes || {}, e = na(P0(n) || []);
  if (sf(r, n) && !e.audio && !I0(r, n)) {
    var t = na(mp(r, i.AUDIO) || []);
    t.audio && (e.audio = t.audio);
  }
  return e;
}, Ln = Ft("PlaylistSelector"), Bl = function(r) {
  if (!(!r || !r.playlist)) {
    var n = r.playlist;
    return JSON.stringify({
      id: n.id,
      bandwidth: r.bandwidth,
      width: r.width,
      height: r.height,
      codecs: n.attributes && n.attributes.CODECS || ""
    });
  }
}, aa = function(r, n) {
  if (!r)
    return "";
  var i = P.getComputedStyle(r);
  return i ? i[n] : "";
}, Qr = function(r, n) {
  var i = r.slice();
  r.sort(function(e, t) {
    var a = n(e, t);
    return a === 0 ? i.indexOf(e) - i.indexOf(t) : a;
  });
}, Lo = function(r, n) {
  var i, e;
  return r.attributes.BANDWIDTH && (i = r.attributes.BANDWIDTH), i = i || P.Number.MAX_VALUE, n.attributes.BANDWIDTH && (e = n.attributes.BANDWIDTH), e = e || P.Number.MAX_VALUE, i - e;
}, O0 = function(r, n) {
  var i, e;
  return r.attributes.RESOLUTION && r.attributes.RESOLUTION.width && (i = r.attributes.RESOLUTION.width), i = i || P.Number.MAX_VALUE, n.attributes.RESOLUTION && n.attributes.RESOLUTION.width && (e = n.attributes.RESOLUTION.width), e = e || P.Number.MAX_VALUE, i === e && r.attributes.BANDWIDTH && n.attributes.BANDWIDTH ? r.attributes.BANDWIDTH - n.attributes.BANDWIDTH : i - e;
}, of = function(r, n, i, e, t, a) {
  if (r) {
    var o = {
      bandwidth: n,
      width: i,
      height: e,
      limitRenditionByPlayerDimensions: t
    }, u = r.playlists;
    vt.isAudioOnly(r) && (u = a.getAudioTrackPlaylists_(), o.audioOnly = !0);
    var l = u.map(function(b) {
      var L, R = b.attributes && b.attributes.RESOLUTION && b.attributes.RESOLUTION.width, j = b.attributes && b.attributes.RESOLUTION && b.attributes.RESOLUTION.height;
      return L = b.attributes && b.attributes.BANDWIDTH, L = L || P.Number.MAX_VALUE, {
        bandwidth: L,
        width: R,
        height: j,
        playlist: b
      };
    });
    Qr(l, function(b, L) {
      return b.bandwidth - L.bandwidth;
    }), l = l.filter(function(b) {
      return !vt.isIncompatible(b.playlist);
    });
    var c = l.filter(function(b) {
      return vt.isEnabled(b.playlist);
    });
    c.length || (c = l.filter(function(b) {
      return !vt.isDisabled(b.playlist);
    }));
    var m = c.filter(function(b) {
      return b.bandwidth * Qe.BANDWIDTH_VARIANCE < n;
    }), g = m[m.length - 1], _ = m.filter(function(b) {
      return b.bandwidth === g.bandwidth;
    })[0];
    if (t === !1) {
      var C = _ || c[0] || l[0];
      if (C && C.playlist) {
        var w = "sortedPlaylistReps";
        return _ && (w = "bandwidthBestRep"), c[0] && (w = "enabledPlaylistReps"), Ln("choosing " + Bl(C) + " using " + w + " with options", o), C.playlist;
      }
      return Ln("could not choose a playlist with options", o), null;
    }
    var E = m.filter(function(b) {
      return b.width && b.height;
    });
    Qr(E, function(b, L) {
      return b.width - L.width;
    });
    var M = E.filter(function(b) {
      return b.width === i && b.height === e;
    });
    g = M[M.length - 1];
    var B = M.filter(function(b) {
      return b.bandwidth === g.bandwidth;
    })[0], z, W, H;
    B || (z = E.filter(function(b) {
      return b.width > i || b.height > e;
    }), W = z.filter(function(b) {
      return b.width === z[0].width && b.height === z[0].height;
    }), g = W[W.length - 1], H = W.filter(function(b) {
      return b.bandwidth === g.bandwidth;
    })[0]);
    var $;
    if (a.experimentalLeastPixelDiffSelector) {
      var N = E.map(function(b) {
        return b.pixelDiff = Math.abs(b.width - i) + Math.abs(b.height - e), b;
      });
      Qr(N, function(b, L) {
        return b.pixelDiff === L.pixelDiff ? L.bandwidth - b.bandwidth : b.pixelDiff - L.pixelDiff;
      }), $ = N[0];
    }
    var q = $ || H || B || _ || c[0] || l[0];
    if (q && q.playlist) {
      var T = "sortedPlaylistReps";
      return $ ? T = "leastPixelDiffRep" : H ? T = "resolutionPlusOneRep" : B ? T = "resolutionBestRep" : _ ? T = "bandwidthBestRep" : c[0] && (T = "enabledPlaylistReps"), Ln("choosing " + Bl(q) + " using " + T + " with options", o), q.playlist;
    }
    return Ln("could not choose a playlist with options", o), null;
  }
}, Ul = function() {
  var r = this.useDevicePixelRatio && P.devicePixelRatio || 1;
  return of(this.playlists.master, this.systemBandwidth, parseInt(aa(this.tech_.el(), "width"), 10) * r, parseInt(aa(this.tech_.el(), "height"), 10) * r, this.limitRenditionByPlayerDimensions, this.masterPlaylistController_);
}, L0 = function(r) {
  var n = -1, i = -1;
  if (r < 0 || r > 1)
    throw new Error("Moving average bandwidth decay must be between 0 and 1.");
  return function() {
    var e = this.useDevicePixelRatio && P.devicePixelRatio || 1;
    return n < 0 && (n = this.systemBandwidth, i = this.systemBandwidth), this.systemBandwidth > 0 && this.systemBandwidth !== i && (n = r * this.systemBandwidth + (1 - r) * n, i = this.systemBandwidth), of(this.playlists.master, n, parseInt(aa(this.tech_.el(), "width"), 10) * e, parseInt(aa(this.tech_.el(), "height"), 10) * e, this.limitRenditionByPlayerDimensions, this.masterPlaylistController_);
  };
}, F0 = function(r) {
  var n = r.master, i = r.currentTime, e = r.bandwidth, t = r.duration, a = r.segmentDuration, o = r.timeUntilRebuffer, u = r.currentTimeline, l = r.syncController, c = n.playlists.filter(function(w) {
    return !vt.isIncompatible(w);
  }), m = c.filter(vt.isEnabled);
  m.length || (m = c.filter(function(w) {
    return !vt.isDisabled(w);
  }));
  var g = m.filter(vt.hasAttribute.bind(null, "BANDWIDTH")), _ = g.map(function(w) {
    var E = l.getSyncPoint(w, t, u, i), M = E ? 1 : 2, B = vt.estimateSegmentRequestTime(a, e, w), z = B * M - o;
    return {
      playlist: w,
      rebufferingImpact: z
    };
  }), C = _.filter(function(w) {
    return w.rebufferingImpact <= 0;
  });
  return Qr(C, function(w, E) {
    return Lo(E.playlist, w.playlist);
  }), C.length ? C[0] : (Qr(_, function(w, E) {
    return w.rebufferingImpact - E.rebufferingImpact;
  }), _[0] || null);
}, R0 = function() {
  var r = this, n = this.playlists.master.playlists.filter(vt.isEnabled);
  Qr(n, function(e, t) {
    return Lo(e, t);
  });
  var i = n.filter(function(e) {
    return !!Mi(r.playlists.master, e).video;
  });
  return i[0] || null;
}, M0 = function(r) {
  var n = 0, i;
  return r.bytes && (i = new Uint8Array(r.bytes), r.segments.forEach(function(e) {
    i.set(e, n), n += e.byteLength;
  })), i;
}, N0 = function(r, n, i) {
  if (!r[i]) {
    n.trigger({
      type: "usage",
      name: "vhs-608"
    }), n.trigger({
      type: "usage",
      name: "hls-608"
    });
    var e = i;
    /^cc708_/.test(i) && (e = "SERVICE" + i.split("_")[1]);
    var t = n.textTracks().getTrackById(e);
    if (t)
      r[i] = t;
    else {
      var a = n.options_.vhs && n.options_.vhs.captionServices || {}, o = i, u = i, l = !1, c = a[e];
      c && (o = c.label, u = c.language, l = c.default), r[i] = n.addRemoteTextTrack({
        kind: "captions",
        id: e,
        // TODO: investigate why this doesn't seem to turn the caption on by default
        default: l,
        label: o,
        language: u
      }, !1).track;
    }
  }
}, B0 = function(r) {
  var n = r.inbandTextTracks, i = r.captionArray, e = r.timestampOffset;
  if (i) {
    var t = P.WebKitDataCue || P.VTTCue;
    i.forEach(function(a) {
      var o = a.stream;
      n[o].addCue(new t(a.startTime + e, a.endTime + e, a.text));
    });
  }
}, U0 = function(r) {
  Object.defineProperties(r.frame, {
    id: {
      get: function() {
        return V.log.warn("cue.frame.id is deprecated. Use cue.value.key instead."), r.value.key;
      }
    },
    value: {
      get: function() {
        return V.log.warn("cue.frame.value is deprecated. Use cue.value.data instead."), r.value.data;
      }
    },
    privateData: {
      get: function() {
        return V.log.warn("cue.frame.privateData is deprecated. Use cue.value.data instead."), r.value.data;
      }
    }
  });
}, V0 = function(r) {
  var n = r.inbandTextTracks, i = r.metadataArray, e = r.timestampOffset, t = r.videoDuration;
  if (i) {
    var a = P.WebKitDataCue || P.VTTCue, o = n.metadataTrack_;
    if (o && (i.forEach(function(_) {
      var C = _.cueTime + e;
      typeof C != "number" || P.isNaN(C) || C < 0 || !(C < 1 / 0) || _.frames.forEach(function(w) {
        var E = new a(C, C, w.value || w.url || w.data || "");
        E.frame = w, E.value = w, U0(E), o.addCue(E);
      });
    }), !(!o.cues || !o.cues.length))) {
      for (var u = o.cues, l = [], c = 0; c < u.length; c++)
        u[c] && l.push(u[c]);
      var m = l.reduce(function(_, C) {
        var w = _[C.startTime] || [];
        return w.push(C), _[C.startTime] = w, _;
      }, {}), g = Object.keys(m).sort(function(_, C) {
        return Number(_) - Number(C);
      });
      g.forEach(function(_, C) {
        var w = m[_], E = Number(g[C + 1]) || t;
        w.forEach(function(M) {
          M.endTime = E;
        });
      });
    }
  }
}, q0 = function(r, n, i) {
  r.metadataTrack_ || (r.metadataTrack_ = i.addRemoteTextTrack({
    kind: "metadata",
    label: "Timed Metadata"
  }, !1).track, r.metadataTrack_.inBandMetadataTrackDispatchType = n);
}, Oi = function(r, n, i) {
  var e, t;
  if (i && i.cues)
    for (e = i.cues.length; e--; )
      t = i.cues[e], t.startTime >= r && t.endTime <= n && i.removeCue(t);
}, j0 = function(r) {
  var n = r.cues;
  if (n)
    for (var i = 0; i < n.length; i++) {
      for (var e = [], t = 0, a = 0; a < n.length; a++)
        n[i].startTime === n[a].startTime && n[i].endTime === n[a].endTime && n[i].text === n[a].text && (t++, t > 1 && e.push(n[a]));
      e.length && e.forEach(function(o) {
        return r.removeCue(o);
      });
    }
}, H0 = function(r, n, i) {
  if (typeof n > "u" || n === null || !r.length)
    return [];
  var e = Math.ceil((n - i + 3) * Wn.ONE_SECOND_IN_TS), t;
  for (t = 0; t < r.length && !(r[t].pts > e); t++)
    ;
  return r.slice(t);
}, W0 = function(r, n, i) {
  if (!n.length)
    return r;
  if (i)
    return n.slice();
  var e = n[0].pts, t = 0;
  for (t; t < r.length && !(r[t].pts >= e); t++)
    ;
  return r.slice(0, t).concat(n);
}, G0 = function(r, n, i, e) {
  for (var t = Math.ceil((n - e) * Wn.ONE_SECOND_IN_TS), a = Math.ceil((i - e) * Wn.ONE_SECOND_IN_TS), o = r.slice(), u = r.length; u-- && !(r[u].pts <= a); )
    ;
  if (u === -1)
    return o;
  for (var l = u + 1; l-- && !(r[l].pts <= t); )
    ;
  return l = Math.max(l, 0), o.splice(l, u - l + 1), o;
}, z0 = function(r, n) {
  if (!r && !n || !r && n || r && !n)
    return !1;
  if (r === n)
    return !0;
  var i = Object.keys(r).sort(), e = Object.keys(n).sort();
  if (i.length !== e.length)
    return !1;
  for (var t = 0; t < i.length; t++) {
    var a = i[t];
    if (a !== e[t] || r[a] !== n[a])
      return !1;
  }
  return !0;
}, uf = 22, K0 = function(r, n, i) {
  n = n || [];
  for (var e = [], t = 0, a = 0; a < n.length; a++) {
    var o = n[a];
    if (r === o.timeline && (e.push(a), t += o.duration, t > i))
      return a;
  }
  return e.length === 0 ? 0 : e[e.length - 1];
}, ki = 1, $0 = 500, Vl = function(r) {
  return typeof r == "number" && isFinite(r);
}, Fn = 1 / 60, X0 = function(r, n, i) {
  return r !== "main" || !n || !i ? null : !i.hasAudio && !i.hasVideo ? "Neither audio nor video found in segment." : n.hasVideo && !i.hasVideo ? "Only audio found in segment when we expected video. We can't switch to audio only from a stream that had video. To get rid of this message, please add codec information to the manifest." : !n.hasVideo && i.hasVideo ? "Video found in segment when we expected only audio. We can't switch to a stream with video from an audio only stream. To get rid of this message, please add codec information to the manifest." : null;
}, Y0 = function(r, n, i) {
  var e = n - Qe.BACK_BUFFER_LENGTH;
  r.length && (e = Math.max(e, r.start(0)));
  var t = n - i;
  return Math.min(t, e);
}, Gr = function(r) {
  var n = r.startOfSegment, i = r.duration, e = r.segment, t = r.part, a = r.playlist, o = a.mediaSequence, u = a.id, l = a.segments, c = l === void 0 ? [] : l, m = r.mediaIndex, g = r.partIndex, _ = r.timeline, C = c.length - 1, w = "mediaIndex/partIndex increment";
  r.getMediaInfoForTime ? w = "getMediaInfoForTime (" + r.getMediaInfoForTime + ")" : r.isSyncRequest && (w = "getSyncSegmentCandidate (isSyncRequest)"), r.independent && (w += " with independent " + r.independent);
  var E = typeof g == "number", M = r.segment.uri ? "segment" : "pre-segment", B = E ? kc({
    preloadSegment: e
  }) - 1 : 0;
  return M + " [" + (o + m) + "/" + (o + C) + "]" + (E ? " part [" + g + "/" + B + "]" : "") + (" segment start/end [" + e.start + " => " + e.end + "]") + (E ? " part start/end [" + t.start + " => " + t.end + "]" : "") + (" startOfSegment [" + n + "]") + (" duration [" + i + "]") + (" timeline [" + _ + "]") + (" selected by [" + w + "]") + (" playlist [" + u + "]");
}, ql = function(r) {
  return r + "TimingInfo";
}, Q0 = function(r) {
  var n = r.segmentTimeline, i = r.currentTimeline, e = r.startOfSegment, t = r.buffered, a = r.overrideCheck;
  return !a && n === i ? null : n < i ? e : t.length ? t.end(t.length - 1) : e;
}, jl = function(r) {
  var n = r.timelineChangeController, i = r.currentTimeline, e = r.segmentTimeline, t = r.loaderType, a = r.audioDisabled;
  if (i === e)
    return !1;
  if (t === "audio") {
    var o = n.lastTimelineChange({
      type: "main"
    });
    return !o || o.to !== e;
  }
  if (t === "main" && a) {
    var u = n.pendingTimelineChange({
      type: "audio"
    });
    return !(u && u.to === e);
  }
  return !1;
}, J0 = function(r) {
  var n = 0;
  return ["video", "audio"].forEach(function(i) {
    var e = r[i + "TimingInfo"];
    if (e) {
      var t = e.start, a = e.end, o;
      typeof t == "bigint" || typeof a == "bigint" ? o = P.BigInt(a) - P.BigInt(t) : typeof t == "number" && typeof a == "number" && (o = a - t), typeof o < "u" && o > n && (n = o);
    }
  }), typeof n == "bigint" && n < Number.MAX_SAFE_INTEGER && (n = Number(n)), n;
}, Hl = function(r) {
  var n = r.segmentDuration, i = r.maxDuration;
  return n ? Math.round(n) > i + gr : !1;
}, Z0 = function(r, n) {
  if (n !== "hls")
    return null;
  var i = J0({
    audioTimingInfo: r.audioTimingInfo,
    videoTimingInfo: r.videoTimingInfo
  });
  if (!i)
    return null;
  var e = r.playlist.targetDuration, t = Hl({
    segmentDuration: i,
    maxDuration: e * 2
  }), a = Hl({
    segmentDuration: i,
    maxDuration: e
  }), o = "Segment with index " + r.mediaIndex + " " + ("from playlist " + r.playlist.id + " ") + ("has a duration of " + i + " ") + ("when the reported duration is " + r.duration + " ") + ("and the target duration is " + e + ". ") + "For HLS content, a duration in excess of the target duration may result in playback issues. See the HLS specification section on EXT-X-TARGETDURATION for more details: https://tools.ietf.org/html/draft-pantos-http-live-streaming-23#section-4.3.3.1";
  return t || a ? {
    severity: t ? "warn" : "info",
    message: o
  } : null;
}, qs = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    if (t = s.call(this) || this, !i)
      throw new TypeError("Initialization settings are required");
    if (typeof i.currentTime != "function")
      throw new TypeError("No currentTime getter specified");
    if (!i.mediaSource)
      throw new TypeError("No MediaSource specified");
    return t.bandwidth = i.bandwidth, t.throughput = {
      rate: 0,
      count: 0
    }, t.roundTrip = NaN, t.resetStats_(), t.mediaIndex = null, t.partIndex = null, t.hasPlayed_ = i.hasPlayed, t.currentTime_ = i.currentTime, t.seekable_ = i.seekable, t.seeking_ = i.seeking, t.duration_ = i.duration, t.mediaSource_ = i.mediaSource, t.vhs_ = i.vhs, t.loaderType_ = i.loaderType, t.currentMediaInfo_ = void 0, t.startingMediaInfo_ = void 0, t.segmentMetadataTrack_ = i.segmentMetadataTrack, t.goalBufferLength_ = i.goalBufferLength, t.sourceType_ = i.sourceType, t.sourceUpdater_ = i.sourceUpdater, t.inbandTextTracks_ = i.inbandTextTracks, t.state_ = "INIT", t.timelineChangeController_ = i.timelineChangeController, t.shouldSaveSegmentTimingInfo_ = !0, t.parse708captions_ = i.parse708captions, t.useDtsForTimestampOffset_ = i.useDtsForTimestampOffset, t.captionServices_ = i.captionServices, t.experimentalExactManifestTimings = i.experimentalExactManifestTimings, t.checkBufferTimeout_ = null, t.error_ = void 0, t.currentTimeline_ = -1, t.pendingSegment_ = null, t.xhrOptions_ = null, t.pendingSegments_ = [], t.audioDisabled_ = !1, t.isPendingTimestampOffset_ = !1, t.gopBuffer_ = [], t.timeMapping_ = 0, t.safeAppend_ = V.browser.IE_VERSION >= 11, t.appendInitSegment_ = {
      audio: !0,
      video: !0
    }, t.playlistOfLastInitSegment_ = {
      audio: null,
      video: null
    }, t.callQueue_ = [], t.loadQueue_ = [], t.metadataQueue_ = {
      id3: [],
      caption: []
    }, t.waitingOnRemove_ = !1, t.quotaExceededErrorRetryTimeout_ = null, t.activeInitSegmentId_ = null, t.initSegments_ = {}, t.cacheEncryptionKeys_ = i.cacheEncryptionKeys, t.keyCache_ = {}, t.decrypter_ = i.decrypter, t.syncController_ = i.syncController, t.syncPoint_ = {
      segmentIndex: 0,
      time: 0
    }, t.transmuxer_ = t.createTransmuxer_(), t.triggerSyncInfoUpdate_ = function() {
      return t.trigger("syncinfoupdate");
    }, t.syncController_.on("syncinfoupdate", t.triggerSyncInfoUpdate_), t.mediaSource_.addEventListener("sourceopen", function() {
      t.isEndOfStream_() || (t.ended_ = !1);
    }), t.fetchAtBuffer_ = !1, t.logger_ = Ft("SegmentLoader[" + t.loaderType_ + "]"), Object.defineProperty(ye(t), "state", {
      get: function() {
        return this.state_;
      },
      set: function(o) {
        o !== this.state_ && (this.logger_(this.state_ + " -> " + o), this.state_ = o, this.trigger("statechange"));
      }
    }), t.sourceUpdater_.on("ready", function() {
      t.hasEnoughInfoToAppend_() && t.processCallQueue_();
    }), t.loaderType_ === "main" && t.timelineChangeController_.on("pendingtimelinechange", function() {
      t.hasEnoughInfoToAppend_() && t.processCallQueue_();
    }), t.loaderType_ === "audio" && t.timelineChangeController_.on("timelinechange", function() {
      t.hasEnoughInfoToLoad_() && t.processLoadQueue_(), t.hasEnoughInfoToAppend_() && t.processCallQueue_();
    }), t;
  }
  var n = r.prototype;
  return n.createTransmuxer_ = function() {
    return ps.createTransmuxer({
      remux: !1,
      alignGopsAtEnd: this.safeAppend_,
      keepOriginalTimestamps: !0,
      parse708captions: this.parse708captions_,
      captionServices: this.captionServices_
    });
  }, n.resetStats_ = function() {
    this.mediaBytesTransferred = 0, this.mediaRequests = 0, this.mediaRequestsAborted = 0, this.mediaRequestsTimedout = 0, this.mediaRequestsErrored = 0, this.mediaTransferDuration = 0, this.mediaSecondsLoaded = 0, this.mediaAppends = 0;
  }, n.dispose = function() {
    this.trigger("dispose"), this.state = "DISPOSED", this.pause(), this.abort_(), this.transmuxer_ && this.transmuxer_.terminate(), this.resetStats_(), this.checkBufferTimeout_ && P.clearTimeout(this.checkBufferTimeout_), this.syncController_ && this.triggerSyncInfoUpdate_ && this.syncController_.off("syncinfoupdate", this.triggerSyncInfoUpdate_), this.off();
  }, n.setAudio = function(e) {
    this.audioDisabled_ = !e, e ? this.appendInitSegment_.audio = !0 : this.sourceUpdater_.removeAudio(0, this.duration_());
  }, n.abort = function() {
    if (this.state !== "WAITING") {
      this.pendingSegment_ && (this.pendingSegment_ = null);
      return;
    }
    this.abort_(), this.state = "READY", this.paused() || this.monitorBuffer_();
  }, n.abort_ = function() {
    this.pendingSegment_ && this.pendingSegment_.abortRequests && this.pendingSegment_.abortRequests(), this.pendingSegment_ = null, this.callQueue_ = [], this.loadQueue_ = [], this.metadataQueue_.id3 = [], this.metadataQueue_.caption = [], this.timelineChangeController_.clearPendingTimelineChange(this.loaderType_), this.waitingOnRemove_ = !1, P.clearTimeout(this.quotaExceededErrorRetryTimeout_), this.quotaExceededErrorRetryTimeout_ = null;
  }, n.checkForAbort_ = function(e) {
    return this.state === "APPENDING" && !this.pendingSegment_ ? (this.state = "READY", !0) : !this.pendingSegment_ || this.pendingSegment_.requestId !== e;
  }, n.error = function(e) {
    return typeof e < "u" && (this.logger_("error occurred:", e), this.error_ = e), this.pendingSegment_ = null, this.error_;
  }, n.endOfStream = function() {
    this.ended_ = !0, this.transmuxer_ && ps.reset(this.transmuxer_), this.gopBuffer_.length = 0, this.pause(), this.trigger("ended");
  }, n.buffered_ = function() {
    var e = this.getMediaInfo_();
    if (!this.sourceUpdater_ || !e)
      return V.createTimeRanges();
    if (this.loaderType_ === "main") {
      var t = e.hasAudio, a = e.hasVideo, o = e.isMuxed;
      if (a && t && !this.audioDisabled_ && !o)
        return this.sourceUpdater_.buffered();
      if (a)
        return this.sourceUpdater_.videoBuffered();
    }
    return this.sourceUpdater_.audioBuffered();
  }, n.initSegmentForMap = function(e, t) {
    if (t === void 0 && (t = !1), !e)
      return null;
    var a = ra(e), o = this.initSegments_[a];
    return t && !o && e.bytes && (this.initSegments_[a] = o = {
      resolvedUri: e.resolvedUri,
      byterange: e.byterange,
      bytes: e.bytes,
      tracks: e.tracks,
      timescales: e.timescales
    }), o || e;
  }, n.segmentKey = function(e, t) {
    if (t === void 0 && (t = !1), !e)
      return null;
    var a = Wc(e), o = this.keyCache_[a];
    this.cacheEncryptionKeys_ && t && !o && e.bytes && (this.keyCache_[a] = o = {
      resolvedUri: e.resolvedUri,
      bytes: e.bytes
    });
    var u = {
      resolvedUri: (o || e).resolvedUri
    };
    return o && (u.bytes = o.bytes), u;
  }, n.couldBeginLoading_ = function() {
    return this.playlist_ && !this.paused();
  }, n.load = function() {
    if (this.monitorBuffer_(), !!this.playlist_) {
      if (this.state === "INIT" && this.couldBeginLoading_())
        return this.init_();
      !this.couldBeginLoading_() || this.state !== "READY" && this.state !== "INIT" || (this.state = "READY");
    }
  }, n.init_ = function() {
    return this.state = "READY", this.resetEverything(), this.monitorBuffer_();
  }, n.playlist = function(e, t) {
    if (t === void 0 && (t = {}), !!e) {
      var a = this.playlist_, o = this.pendingSegment_;
      this.playlist_ = e, this.xhrOptions_ = t, this.state === "INIT" && (e.syncInfo = {
        mediaSequence: e.mediaSequence,
        time: 0
      }, this.loaderType_ === "main" && this.syncController_.setDateTimeMappingForStart(e));
      var u = null;
      if (a && (a.id ? u = a.id : a.uri && (u = a.uri)), this.logger_("playlist update [" + u + " => " + (e.id || e.uri) + "]"), this.trigger("syncinfoupdate"), this.state === "INIT" && this.couldBeginLoading_())
        return this.init_();
      if (!a || a.uri !== e.uri) {
        this.mediaIndex !== null && (e.endList ? this.resyncLoader() : this.resetLoader()), this.currentMediaInfo_ = void 0, this.trigger("playlistupdate");
        return;
      }
      var l = e.mediaSequence - a.mediaSequence;
      if (this.logger_("live window shift [" + l + "]"), this.mediaIndex !== null)
        if (this.mediaIndex -= l, this.mediaIndex < 0)
          this.mediaIndex = null, this.partIndex = null;
        else {
          var c = this.playlist_.segments[this.mediaIndex];
          if (this.partIndex && (!c.parts || !c.parts.length || !c.parts[this.partIndex])) {
            var m = this.mediaIndex;
            this.logger_("currently processing part (index " + this.partIndex + ") no longer exists."), this.resetLoader(), this.mediaIndex = m;
          }
        }
      o && (o.mediaIndex -= l, o.mediaIndex < 0 ? (o.mediaIndex = null, o.partIndex = null) : (o.mediaIndex >= 0 && (o.segment = e.segments[o.mediaIndex]), o.partIndex >= 0 && o.segment.parts && (o.part = o.segment.parts[o.partIndex]))), this.syncController_.saveExpiredSegmentInfo(a, e);
    }
  }, n.pause = function() {
    this.checkBufferTimeout_ && (P.clearTimeout(this.checkBufferTimeout_), this.checkBufferTimeout_ = null);
  }, n.paused = function() {
    return this.checkBufferTimeout_ === null;
  }, n.resetEverything = function(e) {
    this.ended_ = !1, this.activeInitSegmentId_ = null, this.appendInitSegment_ = {
      audio: !0,
      video: !0
    }, this.resetLoader(), this.remove(0, 1 / 0, e), this.transmuxer_ && (this.transmuxer_.postMessage({
      action: "clearAllMp4Captions"
    }), this.transmuxer_.postMessage({
      action: "reset"
    }));
  }, n.resetLoader = function() {
    this.fetchAtBuffer_ = !1, this.resyncLoader();
  }, n.resyncLoader = function() {
    this.transmuxer_ && ps.reset(this.transmuxer_), this.mediaIndex = null, this.partIndex = null, this.syncPoint_ = null, this.isPendingTimestampOffset_ = !1, this.callQueue_ = [], this.loadQueue_ = [], this.metadataQueue_.id3 = [], this.metadataQueue_.caption = [], this.abort(), this.transmuxer_ && this.transmuxer_.postMessage({
      action: "clearParsedMp4Captions"
    });
  }, n.remove = function(e, t, a, o) {
    if (a === void 0 && (a = function() {
    }), o === void 0 && (o = !1), t === 1 / 0 && (t = this.duration_()), t <= e) {
      this.logger_("skipping remove because end ${end} is <= start ${start}");
      return;
    }
    if (!this.sourceUpdater_ || !this.getMediaInfo_()) {
      this.logger_("skipping remove because no source updater or starting media info");
      return;
    }
    var u = 1, l = function() {
      u--, u === 0 && a();
    };
    (o || !this.audioDisabled_) && (u++, this.sourceUpdater_.removeAudio(e, t, l)), (o || this.loaderType_ === "main") && (this.gopBuffer_ = G0(this.gopBuffer_, e, t, this.timeMapping_), u++, this.sourceUpdater_.removeVideo(e, t, l));
    for (var c in this.inbandTextTracks_)
      Oi(e, t, this.inbandTextTracks_[c]);
    Oi(e, t, this.segmentMetadataTrack_), l();
  }, n.monitorBuffer_ = function() {
    this.checkBufferTimeout_ && P.clearTimeout(this.checkBufferTimeout_), this.checkBufferTimeout_ = P.setTimeout(this.monitorBufferTick_.bind(this), 1);
  }, n.monitorBufferTick_ = function() {
    this.state === "READY" && this.fillBuffer_(), this.checkBufferTimeout_ && P.clearTimeout(this.checkBufferTimeout_), this.checkBufferTimeout_ = P.setTimeout(this.monitorBufferTick_.bind(this), $0);
  }, n.fillBuffer_ = function() {
    if (!this.sourceUpdater_.updating()) {
      var e = this.chooseNextRequest_();
      e && (typeof e.timestampOffset == "number" && (this.isPendingTimestampOffset_ = !1, this.timelineChangeController_.pendingTimelineChange({
        type: this.loaderType_,
        from: this.currentTimeline_,
        to: e.timeline
      })), this.loadSegment_(e));
    }
  }, n.isEndOfStream_ = function(e, t, a) {
    if (e === void 0 && (e = this.mediaIndex), t === void 0 && (t = this.playlist_), a === void 0 && (a = this.partIndex), !t || !this.mediaSource_)
      return !1;
    var o = typeof e == "number" && t.segments[e], u = e + 1 === t.segments.length, l = !o || !o.parts || a + 1 === o.parts.length;
    return t.endList && this.mediaSource_.readyState === "open" && u && l;
  }, n.chooseNextRequest_ = function() {
    var e = this.buffered_(), t = Pl(e) || 0, a = Do(e, this.currentTime_()), o = !this.hasPlayed_() && a >= 1, u = a >= this.goalBufferLength_(), l = this.playlist_.segments;
    if (!l.length || o || u)
      return null;
    this.syncPoint_ = this.syncPoint_ || this.syncController_.getSyncPoint(this.playlist_, this.duration_(), this.currentTimeline_, this.currentTime_());
    var c = {
      partIndex: null,
      mediaIndex: null,
      startOfSegment: null,
      playlist: this.playlist_,
      isSyncRequest: !this.syncPoint_
    };
    if (c.isSyncRequest)
      c.mediaIndex = K0(this.currentTimeline_, l, t);
    else if (this.mediaIndex !== null) {
      var m = l[this.mediaIndex], g = typeof this.partIndex == "number" ? this.partIndex : -1;
      c.startOfSegment = m.end ? m.end : t, m.parts && m.parts[g + 1] ? (c.mediaIndex = this.mediaIndex, c.partIndex = g + 1) : c.mediaIndex = this.mediaIndex + 1;
    } else {
      var _ = vt.getMediaInfoForTime({
        experimentalExactManifestTimings: this.experimentalExactManifestTimings,
        playlist: this.playlist_,
        currentTime: this.fetchAtBuffer_ ? t : this.currentTime_(),
        startingPartIndex: this.syncPoint_.partIndex,
        startingSegmentIndex: this.syncPoint_.segmentIndex,
        startTime: this.syncPoint_.time
      }), C = _.segmentIndex, w = _.startTime, E = _.partIndex;
      c.getMediaInfoForTime = this.fetchAtBuffer_ ? "bufferedEnd " + t : "currentTime " + this.currentTime_(), c.mediaIndex = C, c.startOfSegment = w, c.partIndex = E;
    }
    var M = l[c.mediaIndex], B = M && typeof c.partIndex == "number" && M.parts && M.parts[c.partIndex];
    if (!M || typeof c.partIndex == "number" && !B)
      return null;
    if (typeof c.partIndex != "number" && M.parts && (c.partIndex = 0, B = M.parts[0]), !a && B && !B.independent)
      if (c.partIndex === 0) {
        var z = l[c.mediaIndex - 1], W = z.parts && z.parts.length && z.parts[z.parts.length - 1];
        W && W.independent && (c.mediaIndex -= 1, c.partIndex = z.parts.length - 1, c.independent = "previous segment");
      } else M.parts[c.partIndex - 1].independent && (c.partIndex -= 1, c.independent = "previous part");
    var H = this.mediaSource_ && this.mediaSource_.readyState === "ended";
    return c.mediaIndex >= l.length - 1 && H && !this.seeking_() ? null : this.generateSegmentInfo_(c);
  }, n.generateSegmentInfo_ = function(e) {
    var t = e.independent, a = e.playlist, o = e.mediaIndex, u = e.startOfSegment, l = e.isSyncRequest, c = e.partIndex, m = e.forceTimestampOffset, g = e.getMediaInfoForTime, _ = a.segments[o], C = typeof c == "number" && _.parts[c], w = {
      requestId: "segment-loader-" + Math.random(),
      // resolve the segment URL relative to the playlist
      uri: C && C.resolvedUri || _.resolvedUri,
      // the segment's mediaIndex at the time it was requested
      mediaIndex: o,
      partIndex: C ? c : null,
      // whether or not to update the SegmentLoader's state with this
      // segment's mediaIndex
      isSyncRequest: l,
      startOfSegment: u,
      // the segment's playlist
      playlist: a,
      // unencrypted bytes of the segment
      bytes: null,
      // when a key is defined for this segment, the encrypted bytes
      encryptedBytes: null,
      // The target timestampOffset for this segment when we append it
      // to the source buffer
      timestampOffset: null,
      // The timeline that the segment is in
      timeline: _.timeline,
      // The expected duration of the segment in seconds
      duration: C && C.duration || _.duration,
      // retain the segment in case the playlist updates while doing an async process
      segment: _,
      part: C,
      byteLength: 0,
      transmuxer: this.transmuxer_,
      // type of getMediaInfoForTime that was used to get this segment
      getMediaInfoForTime: g,
      independent: t
    }, E = typeof m < "u" ? m : this.isPendingTimestampOffset_;
    w.timestampOffset = this.timestampOffsetForSegment_({
      segmentTimeline: _.timeline,
      currentTimeline: this.currentTimeline_,
      startOfSegment: u,
      buffered: this.buffered_(),
      overrideCheck: E
    });
    var M = Pl(this.sourceUpdater_.audioBuffered());
    return typeof M == "number" && (w.audioAppendStart = M - this.sourceUpdater_.audioTimestampOffset()), this.sourceUpdater_.videoBuffered().length && (w.gopsToAlignWith = H0(
      this.gopBuffer_,
      // since the transmuxer is using the actual timing values, but the time is
      // adjusted by the timestmap offset, we must adjust the value here
      this.currentTime_() - this.sourceUpdater_.videoTimestampOffset(),
      this.timeMapping_
    )), w;
  }, n.timestampOffsetForSegment_ = function(e) {
    return Q0(e);
  }, n.earlyAbortWhenNeeded_ = function(e) {
    if (!(this.vhs_.tech_.paused() || // Don't abort if the current playlist is on the lowestEnabledRendition
    // TODO: Replace using timeout with a boolean indicating whether this playlist is
    //       the lowestEnabledRendition.
    !this.xhrOptions_.timeout || // Don't abort if we have no bandwidth information to estimate segment sizes
    !this.playlist_.attributes.BANDWIDTH) && !(Date.now() - (e.firstBytesReceivedAt || Date.now()) < 1e3)) {
      var t = this.currentTime_(), a = e.bandwidth, o = this.pendingSegment_.duration, u = vt.estimateSegmentRequestTime(o, a, this.playlist_, e.bytesReceived), l = Tv(this.buffered_(), t, this.vhs_.tech_.playbackRate()) - 1;
      if (!(u <= l)) {
        var c = F0({
          master: this.vhs_.playlists.master,
          currentTime: t,
          bandwidth: a,
          duration: this.duration_(),
          segmentDuration: o,
          timeUntilRebuffer: l,
          currentTimeline: this.currentTimeline_,
          syncController: this.syncController_
        });
        if (c) {
          var m = u - l, g = m - c.rebufferingImpact, _ = 0.5;
          l <= gr && (_ = 1), !(!c.playlist || c.playlist.uri === this.playlist_.uri || g < _) && (this.bandwidth = c.playlist.attributes.BANDWIDTH * Qe.BANDWIDTH_VARIANCE + 1, this.trigger("earlyabort"));
        }
      }
    }
  }, n.handleAbort_ = function(e) {
    this.logger_("Aborting " + Gr(e)), this.mediaRequestsAborted += 1;
  }, n.handleProgress_ = function(e, t) {
    this.earlyAbortWhenNeeded_(t.stats), !this.checkForAbort_(t.requestId) && this.trigger("progress");
  }, n.handleTrackInfo_ = function(e, t) {
    this.earlyAbortWhenNeeded_(e.stats), !this.checkForAbort_(e.requestId) && (this.checkForIllegalMediaSwitch(t) || (t = t || {}, z0(this.currentMediaInfo_, t) || (this.appendInitSegment_ = {
      audio: !0,
      video: !0
    }, this.startingMediaInfo_ = t, this.currentMediaInfo_ = t, this.logger_("trackinfo update", t), this.trigger("trackinfo")), !this.checkForAbort_(e.requestId) && (this.pendingSegment_.trackInfo = t, this.hasEnoughInfoToAppend_() && this.processCallQueue_())));
  }, n.handleTimingInfo_ = function(e, t, a, o) {
    if (this.earlyAbortWhenNeeded_(e.stats), !this.checkForAbort_(e.requestId)) {
      var u = this.pendingSegment_, l = ql(t);
      u[l] = u[l] || {}, u[l][a] = o, this.logger_("timinginfo: " + t + " - " + a + " - " + o), this.hasEnoughInfoToAppend_() && this.processCallQueue_();
    }
  }, n.handleCaptions_ = function(e, t) {
    var a = this;
    if (this.earlyAbortWhenNeeded_(e.stats), !this.checkForAbort_(e.requestId)) {
      if (t.length === 0) {
        this.logger_("SegmentLoader received no captions from a caption event");
        return;
      }
      var o = this.pendingSegment_;
      if (!o.hasAppendedData_) {
        this.metadataQueue_.caption.push(this.handleCaptions_.bind(this, e, t));
        return;
      }
      var u = this.sourceUpdater_.videoTimestampOffset() === null ? this.sourceUpdater_.audioTimestampOffset() : this.sourceUpdater_.videoTimestampOffset(), l = {};
      t.forEach(function(c) {
        l[c.stream] = l[c.stream] || {
          // Infinity, as any other value will be less than this
          startTime: 1 / 0,
          captions: [],
          // 0 as an other value will be more than this
          endTime: 0
        };
        var m = l[c.stream];
        m.startTime = Math.min(m.startTime, c.startTime + u), m.endTime = Math.max(m.endTime, c.endTime + u), m.captions.push(c);
      }), Object.keys(l).forEach(function(c) {
        var m = l[c], g = m.startTime, _ = m.endTime, C = m.captions, w = a.inbandTextTracks_;
        a.logger_("adding cues from " + g + " -> " + _ + " for " + c), N0(w, a.vhs_.tech_, c), Oi(g, _, w[c]), B0({
          captionArray: C,
          inbandTextTracks: w,
          timestampOffset: u
        });
      }), this.transmuxer_ && this.transmuxer_.postMessage({
        action: "clearParsedMp4Captions"
      });
    }
  }, n.handleId3_ = function(e, t, a) {
    if (this.earlyAbortWhenNeeded_(e.stats), !this.checkForAbort_(e.requestId)) {
      var o = this.pendingSegment_;
      if (!o.hasAppendedData_) {
        this.metadataQueue_.id3.push(this.handleId3_.bind(this, e, t, a));
        return;
      }
      var u = this.sourceUpdater_.videoTimestampOffset() === null ? this.sourceUpdater_.audioTimestampOffset() : this.sourceUpdater_.videoTimestampOffset();
      q0(this.inbandTextTracks_, a, this.vhs_.tech_), V0({
        inbandTextTracks: this.inbandTextTracks_,
        metadataArray: t,
        timestampOffset: u,
        videoDuration: this.duration_()
      });
    }
  }, n.processMetadataQueue_ = function() {
    this.metadataQueue_.id3.forEach(function(e) {
      return e();
    }), this.metadataQueue_.caption.forEach(function(e) {
      return e();
    }), this.metadataQueue_.id3 = [], this.metadataQueue_.caption = [];
  }, n.processCallQueue_ = function() {
    var e = this.callQueue_;
    this.callQueue_ = [], e.forEach(function(t) {
      return t();
    });
  }, n.processLoadQueue_ = function() {
    var e = this.loadQueue_;
    this.loadQueue_ = [], e.forEach(function(t) {
      return t();
    });
  }, n.hasEnoughInfoToLoad_ = function() {
    if (this.loaderType_ !== "audio")
      return !0;
    var e = this.pendingSegment_;
    return e ? this.getCurrentMediaInfo_() ? (
      // Technically, instead of waiting to load a segment on timeline changes, a segment
      // can be requested and downloaded and only wait before it is transmuxed or parsed.
      // But in practice, there are a few reasons why it is better to wait until a loader
      // is ready to append that segment before requesting and downloading:
      //
      // 1. Because audio and main loaders cross discontinuities together, if this loader
      //    is waiting for the other to catch up, then instead of requesting another
      //    segment and using up more bandwidth, by not yet loading, more bandwidth is
      //    allotted to the loader currently behind.
      // 2. media-segment-request doesn't have to have logic to consider whether a segment
      // is ready to be processed or not, isolating the queueing behavior to the loader.
      // 3. The audio loader bases some of its segment properties on timing information
      //    provided by the main loader, meaning that, if the logic for waiting on
      //    processing was in media-segment-request, then it would also need to know how
      //    to re-generate the segment information after the main loader caught up.
      !jl({
        timelineChangeController: this.timelineChangeController_,
        currentTimeline: this.currentTimeline_,
        segmentTimeline: e.timeline,
        loaderType: this.loaderType_,
        audioDisabled: this.audioDisabled_
      })
    ) : !0 : !1;
  }, n.getCurrentMediaInfo_ = function(e) {
    return e === void 0 && (e = this.pendingSegment_), e && e.trackInfo || this.currentMediaInfo_;
  }, n.getMediaInfo_ = function(e) {
    return e === void 0 && (e = this.pendingSegment_), this.getCurrentMediaInfo_(e) || this.startingMediaInfo_;
  }, n.getPendingSegmentPlaylist = function() {
    return this.pendingSegment_ ? this.pendingSegment_.playlist : null;
  }, n.hasEnoughInfoToAppend_ = function() {
    if (!this.sourceUpdater_.ready() || this.waitingOnRemove_ || this.quotaExceededErrorRetryTimeout_)
      return !1;
    var e = this.pendingSegment_, t = this.getCurrentMediaInfo_();
    if (!e || !t)
      return !1;
    var a = t.hasAudio, o = t.hasVideo, u = t.isMuxed;
    return !(o && !e.videoTimingInfo || a && !this.audioDisabled_ && !u && !e.audioTimingInfo || jl({
      timelineChangeController: this.timelineChangeController_,
      currentTimeline: this.currentTimeline_,
      segmentTimeline: e.timeline,
      loaderType: this.loaderType_,
      audioDisabled: this.audioDisabled_
    }));
  }, n.handleData_ = function(e, t) {
    if (this.earlyAbortWhenNeeded_(e.stats), !this.checkForAbort_(e.requestId)) {
      if (this.callQueue_.length || !this.hasEnoughInfoToAppend_()) {
        this.callQueue_.push(this.handleData_.bind(this, e, t));
        return;
      }
      var a = this.pendingSegment_;
      if (this.setTimeMapping_(a.timeline), this.updateMediaSecondsLoaded_(a.part || a.segment), this.mediaSource_.readyState !== "closed") {
        if (e.map && (e.map = this.initSegmentForMap(e.map, !0), a.segment.map = e.map), e.key && this.segmentKey(e.key, !0), a.isFmp4 = e.isFmp4, a.timingInfo = a.timingInfo || {}, a.isFmp4)
          this.trigger("fmp4"), a.timingInfo.start = a[ql(t.type)].start;
        else {
          var o = this.getCurrentMediaInfo_(), u = this.loaderType_ === "main" && o && o.hasVideo, l;
          u && (l = a.videoTimingInfo.start), a.timingInfo.start = this.trueSegmentStart_({
            currentStart: a.timingInfo.start,
            playlist: a.playlist,
            mediaIndex: a.mediaIndex,
            currentVideoTimestampOffset: this.sourceUpdater_.videoTimestampOffset(),
            useVideoTimingInfo: u,
            firstVideoFrameTimeForData: l,
            videoTimingInfo: a.videoTimingInfo,
            audioTimingInfo: a.audioTimingInfo
          });
        }
        if (this.updateAppendInitSegmentStatus(a, t.type), this.updateSourceBufferTimestampOffset_(a), a.isSyncRequest) {
          this.updateTimingInfoEnd_(a), this.syncController_.saveSegmentTimingInfo({
            segmentInfo: a,
            shouldSaveTimelineMapping: this.loaderType_ === "main"
          });
          var c = this.chooseNextRequest_();
          if (c.mediaIndex !== a.mediaIndex || c.partIndex !== a.partIndex) {
            this.logger_("sync segment was incorrect, not appending");
            return;
          }
          this.logger_("sync segment was correct, appending");
        }
        a.hasAppendedData_ = !0, this.processMetadataQueue_(), this.appendData_(a, t);
      }
    }
  }, n.updateAppendInitSegmentStatus = function(e, t) {
    this.loaderType_ === "main" && typeof e.timestampOffset == "number" && // in the case that we're handling partial data, we don't want to append an init
    // segment for each chunk
    !e.changedTimestampOffset && (this.appendInitSegment_ = {
      audio: !0,
      video: !0
    }), this.playlistOfLastInitSegment_[t] !== e.playlist && (this.appendInitSegment_[t] = !0);
  }, n.getInitSegmentAndUpdateState_ = function(e) {
    var t = e.type, a = e.initSegment, o = e.map, u = e.playlist;
    if (o) {
      var l = ra(o);
      if (this.activeInitSegmentId_ === l)
        return null;
      a = this.initSegmentForMap(o, !0).bytes, this.activeInitSegmentId_ = l;
    }
    return a && this.appendInitSegment_[t] ? (this.playlistOfLastInitSegment_[t] = u, this.appendInitSegment_[t] = !1, this.activeInitSegmentId_ = null, a) : null;
  }, n.handleQuotaExceededError_ = function(e, t) {
    var a = this, o = e.segmentInfo, u = e.type, l = e.bytes, c = this.sourceUpdater_.audioBuffered(), m = this.sourceUpdater_.videoBuffered();
    c.length > 1 && this.logger_("On QUOTA_EXCEEDED_ERR, found gaps in the audio buffer: " + Or(c).join(", ")), m.length > 1 && this.logger_("On QUOTA_EXCEEDED_ERR, found gaps in the video buffer: " + Or(m).join(", "));
    var g = c.length ? c.start(0) : 0, _ = c.length ? c.end(c.length - 1) : 0, C = m.length ? m.start(0) : 0, w = m.length ? m.end(m.length - 1) : 0;
    if (_ - g <= ki && w - C <= ki) {
      this.logger_("On QUOTA_EXCEEDED_ERR, single segment too large to append to buffer, triggering an error. " + ("Appended byte length: " + l.byteLength + ", ") + ("audio buffer: " + Or(c).join(", ") + ", ") + ("video buffer: " + Or(m).join(", ") + ", ")), this.error({
        message: "Quota exceeded error with append of a single segment of content",
        excludeUntil: 1 / 0
      }), this.trigger("error");
      return;
    }
    this.waitingOnRemove_ = !0, this.callQueue_.push(this.appendToSourceBuffer_.bind(this, {
      segmentInfo: o,
      type: u,
      bytes: l
    }));
    var E = this.currentTime_(), M = E - ki;
    this.logger_("On QUOTA_EXCEEDED_ERR, removing audio/video from 0 to " + M), this.remove(0, M, function() {
      a.logger_("On QUOTA_EXCEEDED_ERR, retrying append in " + ki + "s"), a.waitingOnRemove_ = !1, a.quotaExceededErrorRetryTimeout_ = P.setTimeout(function() {
        a.logger_("On QUOTA_EXCEEDED_ERR, re-processing call queue"), a.quotaExceededErrorRetryTimeout_ = null, a.processCallQueue_();
      }, ki * 1e3);
    }, !0);
  }, n.handleAppendError_ = function(e, t) {
    var a = e.segmentInfo, o = e.type, u = e.bytes;
    if (t) {
      if (t.code === uf) {
        this.handleQuotaExceededError_({
          segmentInfo: a,
          type: o,
          bytes: u
        });
        return;
      }
      this.logger_("Received non QUOTA_EXCEEDED_ERR on append", t), this.error(o + " append of " + u.length + "b failed for segment " + ("#" + a.mediaIndex + " in playlist " + a.playlist.id)), this.trigger("appenderror");
    }
  }, n.appendToSourceBuffer_ = function(e) {
    var t = e.segmentInfo, a = e.type, o = e.initSegment, u = e.data, l = e.bytes;
    if (!l) {
      var c = [u], m = u.byteLength;
      o && (c.unshift(o), m += o.byteLength), l = M0({
        bytes: m,
        segments: c
      });
    }
    this.sourceUpdater_.appendBuffer({
      segmentInfo: t,
      type: a,
      bytes: l
    }, this.handleAppendError_.bind(this, {
      segmentInfo: t,
      type: a,
      bytes: l
    }));
  }, n.handleSegmentTimingInfo_ = function(e, t, a) {
    if (!(!this.pendingSegment_ || t !== this.pendingSegment_.requestId)) {
      var o = this.pendingSegment_.segment, u = e + "TimingInfo";
      o[u] || (o[u] = {}), o[u].transmuxerPrependedSeconds = a.prependedContentDuration || 0, o[u].transmuxedPresentationStart = a.start.presentation, o[u].transmuxedDecodeStart = a.start.decode, o[u].transmuxedPresentationEnd = a.end.presentation, o[u].transmuxedDecodeEnd = a.end.decode, o[u].baseMediaDecodeTime = a.baseMediaDecodeTime;
    }
  }, n.appendData_ = function(e, t) {
    var a = t.type, o = t.data;
    if (!(!o || !o.byteLength) && !(a === "audio" && this.audioDisabled_)) {
      var u = this.getInitSegmentAndUpdateState_({
        type: a,
        initSegment: t.initSegment,
        playlist: e.playlist,
        map: e.isFmp4 ? e.segment.map : null
      });
      this.appendToSourceBuffer_({
        segmentInfo: e,
        type: a,
        initSegment: u,
        data: o
      });
    }
  }, n.loadSegment_ = function(e) {
    var t = this;
    if (this.state = "WAITING", this.pendingSegment_ = e, this.trimBackBuffer_(e), typeof e.timestampOffset == "number" && this.transmuxer_ && this.transmuxer_.postMessage({
      action: "clearAllMp4Captions"
    }), !this.hasEnoughInfoToLoad_()) {
      this.loadQueue_.push(function() {
        var a = Ot({}, e, {
          forceTimestampOffset: !0
        });
        Ot(e, t.generateSegmentInfo_(a)), t.isPendingTimestampOffset_ = !1, t.updateTransmuxerAndRequestSegment_(e);
      });
      return;
    }
    this.updateTransmuxerAndRequestSegment_(e);
  }, n.updateTransmuxerAndRequestSegment_ = function(e) {
    var t = this;
    this.shouldUpdateTransmuxerTimestampOffset_(e.timestampOffset) && (this.gopBuffer_.length = 0, e.gopsToAlignWith = [], this.timeMapping_ = 0, this.transmuxer_.postMessage({
      action: "reset"
    }), this.transmuxer_.postMessage({
      action: "setTimestampOffset",
      timestampOffset: e.timestampOffset
    }));
    var a = this.createSimplifiedSegmentObj_(e), o = this.isEndOfStream_(e.mediaIndex, e.playlist, e.partIndex), u = this.mediaIndex !== null, l = e.timeline !== this.currentTimeline_ && // currentTimeline starts at -1, so we shouldn't end the timeline switching to 0,
    // the first timeline
    e.timeline > 0, c = o || u && l;
    this.logger_("Requesting " + Gr(e)), a.map && !a.map.bytes && (this.logger_("going to request init segment."), this.appendInitSegment_ = {
      video: !0,
      audio: !0
    }), e.abortRequests = w0({
      xhr: this.vhs_.xhr,
      xhrOptions: this.xhrOptions_,
      decryptionWorker: this.decrypter_,
      segment: a,
      abortFn: this.handleAbort_.bind(this, e),
      progressFn: this.handleProgress_.bind(this),
      trackInfoFn: this.handleTrackInfo_.bind(this),
      timingInfoFn: this.handleTimingInfo_.bind(this),
      videoSegmentTimingInfoFn: this.handleSegmentTimingInfo_.bind(this, "video", e.requestId),
      audioSegmentTimingInfoFn: this.handleSegmentTimingInfo_.bind(this, "audio", e.requestId),
      captionsFn: this.handleCaptions_.bind(this),
      isEndOfTimeline: c,
      endedTimelineFn: function() {
        t.logger_("received endedtimeline callback");
      },
      id3Fn: this.handleId3_.bind(this),
      dataFn: this.handleData_.bind(this),
      doneFn: this.segmentRequestFinished_.bind(this),
      onTransmuxerLog: function(g) {
        var _ = g.message, C = g.level, w = g.stream;
        t.logger_(Gr(e) + " logged from transmuxer stream " + w + " as a " + C + ": " + _);
      }
    });
  }, n.trimBackBuffer_ = function(e) {
    var t = Y0(this.seekable_(), this.currentTime_(), this.playlist_.targetDuration || 10);
    t > 0 && this.remove(0, t);
  }, n.createSimplifiedSegmentObj_ = function(e) {
    var t = e.segment, a = e.part, o = {
      resolvedUri: a ? a.resolvedUri : t.resolvedUri,
      byterange: a ? a.byterange : t.byterange,
      requestId: e.requestId,
      transmuxer: e.transmuxer,
      audioAppendStart: e.audioAppendStart,
      gopsToAlignWith: e.gopsToAlignWith,
      part: e.part
    }, u = e.playlist.segments[e.mediaIndex - 1];
    if (u && u.timeline === t.timeline && (u.videoTimingInfo ? o.baseStartTime = u.videoTimingInfo.transmuxedDecodeEnd : u.audioTimingInfo && (o.baseStartTime = u.audioTimingInfo.transmuxedDecodeEnd)), t.key) {
      var l = t.key.iv || new Uint32Array([0, 0, 0, e.mediaIndex + e.playlist.mediaSequence]);
      o.key = this.segmentKey(t.key), o.key.iv = l;
    }
    return t.map && (o.map = this.initSegmentForMap(t.map)), o;
  }, n.saveTransferStats_ = function(e) {
    this.mediaRequests += 1, e && (this.mediaBytesTransferred += e.bytesReceived, this.mediaTransferDuration += e.roundTripTime);
  }, n.saveBandwidthRelatedStats_ = function(e, t) {
    if (this.pendingSegment_.byteLength = t.bytesReceived, e < Fn) {
      this.logger_("Ignoring segment's bandwidth because its duration of " + e + (" is less than the min to record " + Fn));
      return;
    }
    this.bandwidth = t.bandwidth, this.roundTrip = t.roundTripTime;
  }, n.handleTimeout_ = function() {
    this.mediaRequestsTimedout += 1, this.bandwidth = 1, this.roundTrip = NaN, this.trigger("bandwidthupdate"), this.trigger("timeout");
  }, n.segmentRequestFinished_ = function(e, t, a) {
    if (this.callQueue_.length) {
      this.callQueue_.push(this.segmentRequestFinished_.bind(this, e, t, a));
      return;
    }
    if (this.saveTransferStats_(t.stats), !!this.pendingSegment_ && t.requestId === this.pendingSegment_.requestId) {
      if (e) {
        if (this.pendingSegment_ = null, this.state = "READY", e.code === Wt.ABORTED)
          return;
        if (this.pause(), e.code === Wt.TIMEOUT) {
          this.handleTimeout_();
          return;
        }
        this.mediaRequestsErrored += 1, this.error(e), this.trigger("error");
        return;
      }
      var o = this.pendingSegment_;
      this.saveBandwidthRelatedStats_(o.duration, t.stats), o.endOfAllRequests = t.endOfAllRequests, a.gopInfo && (this.gopBuffer_ = W0(this.gopBuffer_, a.gopInfo, this.safeAppend_)), this.state = "APPENDING", this.trigger("appending"), this.waitForAppendsToComplete_(o);
    }
  }, n.setTimeMapping_ = function(e) {
    var t = this.syncController_.mappingForTimeline(e);
    t !== null && (this.timeMapping_ = t);
  }, n.updateMediaSecondsLoaded_ = function(e) {
    typeof e.start == "number" && typeof e.end == "number" ? this.mediaSecondsLoaded += e.end - e.start : this.mediaSecondsLoaded += e.duration;
  }, n.shouldUpdateTransmuxerTimestampOffset_ = function(e) {
    return e === null ? !1 : this.loaderType_ === "main" && e !== this.sourceUpdater_.videoTimestampOffset() || !this.audioDisabled_ && e !== this.sourceUpdater_.audioTimestampOffset();
  }, n.trueSegmentStart_ = function(e) {
    var t = e.currentStart, a = e.playlist, o = e.mediaIndex, u = e.firstVideoFrameTimeForData, l = e.currentVideoTimestampOffset, c = e.useVideoTimingInfo, m = e.videoTimingInfo, g = e.audioTimingInfo;
    if (typeof t < "u")
      return t;
    if (!c)
      return g.start;
    var _ = a.segments[o - 1];
    return o === 0 || !_ || typeof _.start > "u" || _.end !== u + l ? u : m.start;
  }, n.waitForAppendsToComplete_ = function(e) {
    var t = this.getCurrentMediaInfo_(e);
    if (!t) {
      this.error({
        message: "No starting media returned, likely due to an unsupported media format.",
        blacklistDuration: 1 / 0
      }), this.trigger("error");
      return;
    }
    var a = t.hasAudio, o = t.hasVideo, u = t.isMuxed, l = this.loaderType_ === "main" && o, c = !this.audioDisabled_ && a && !u;
    if (e.waitingOnAppends = 0, !e.hasAppendedData_) {
      !e.timingInfo && typeof e.timestampOffset == "number" && (this.isPendingTimestampOffset_ = !0), e.timingInfo = {
        start: 0
      }, e.waitingOnAppends++, this.isPendingTimestampOffset_ || (this.updateSourceBufferTimestampOffset_(e), this.processMetadataQueue_()), this.checkAppendsDone_(e);
      return;
    }
    l && e.waitingOnAppends++, c && e.waitingOnAppends++, l && this.sourceUpdater_.videoQueueCallback(this.checkAppendsDone_.bind(this, e)), c && this.sourceUpdater_.audioQueueCallback(this.checkAppendsDone_.bind(this, e));
  }, n.checkAppendsDone_ = function(e) {
    this.checkForAbort_(e.requestId) || (e.waitingOnAppends--, e.waitingOnAppends === 0 && this.handleAppendsDone_());
  }, n.checkForIllegalMediaSwitch = function(e) {
    var t = X0(this.loaderType_, this.getCurrentMediaInfo_(), e);
    return t ? (this.error({
      message: t,
      blacklistDuration: 1 / 0
    }), this.trigger("error"), !0) : !1;
  }, n.updateSourceBufferTimestampOffset_ = function(e) {
    if (!(e.timestampOffset === null || // we don't yet have the start for whatever media type (video or audio) has
    // priority, timing-wise, so we must wait
    typeof e.timingInfo.start != "number" || // already updated the timestamp offset for this segment
    e.changedTimestampOffset || // the alt audio loader should not be responsible for setting the timestamp offset
    this.loaderType_ !== "main")) {
      var t = !1;
      e.timestampOffset -= this.getSegmentStartTimeForTimestampOffsetCalculation_({
        videoTimingInfo: e.segment.videoTimingInfo,
        audioTimingInfo: e.segment.audioTimingInfo,
        timingInfo: e.timingInfo
      }), e.changedTimestampOffset = !0, e.timestampOffset !== this.sourceUpdater_.videoTimestampOffset() && (this.sourceUpdater_.videoTimestampOffset(e.timestampOffset), t = !0), e.timestampOffset !== this.sourceUpdater_.audioTimestampOffset() && (this.sourceUpdater_.audioTimestampOffset(e.timestampOffset), t = !0), t && this.trigger("timestampoffset");
    }
  }, n.getSegmentStartTimeForTimestampOffsetCalculation_ = function(e) {
    var t = e.videoTimingInfo, a = e.audioTimingInfo, o = e.timingInfo;
    return this.useDtsForTimestampOffset_ ? t && typeof t.transmuxedDecodeStart == "number" ? t.transmuxedDecodeStart : a && typeof a.transmuxedDecodeStart == "number" ? a.transmuxedDecodeStart : o.start : o.start;
  }, n.updateTimingInfoEnd_ = function(e) {
    e.timingInfo = e.timingInfo || {};
    var t = this.getMediaInfo_(), a = this.loaderType_ === "main" && t && t.hasVideo, o = a && e.videoTimingInfo ? e.videoTimingInfo : e.audioTimingInfo;
    o && (e.timingInfo.end = typeof o.end == "number" ? (
      // End time may not exist in a case where we aren't parsing the full segment (one
      // current example is the case of fmp4), so use the rough duration to calculate an
      // end time.
      o.end
    ) : o.start + e.duration);
  }, n.handleAppendsDone_ = function() {
    if (this.pendingSegment_ && this.trigger("appendsdone"), !this.pendingSegment_) {
      this.state = "READY", this.paused() || this.monitorBuffer_();
      return;
    }
    var e = this.pendingSegment_;
    this.updateTimingInfoEnd_(e), this.shouldSaveSegmentTimingInfo_ && this.syncController_.saveSegmentTimingInfo({
      segmentInfo: e,
      shouldSaveTimelineMapping: this.loaderType_ === "main"
    });
    var t = Z0(e, this.sourceType_);
    if (t && (t.severity === "warn" ? V.log.warn(t.message) : this.logger_(t.message)), this.recordThroughput_(e), this.pendingSegment_ = null, this.state = "READY", e.isSyncRequest && (this.trigger("syncinfoupdate"), !e.hasAppendedData_)) {
      this.logger_("Throwing away un-appended sync request " + Gr(e));
      return;
    }
    this.logger_("Appended " + Gr(e)), this.addSegmentMetadataCue_(e), this.fetchAtBuffer_ = !0, this.currentTimeline_ !== e.timeline && (this.timelineChangeController_.lastTimelineChange({
      type: this.loaderType_,
      from: this.currentTimeline_,
      to: e.timeline
    }), this.loaderType_ === "main" && !this.audioDisabled_ && this.timelineChangeController_.lastTimelineChange({
      type: "audio",
      from: this.currentTimeline_,
      to: e.timeline
    })), this.currentTimeline_ = e.timeline, this.trigger("syncinfoupdate");
    var a = e.segment, o = e.part, u = a.end && this.currentTime_() - a.end > e.playlist.targetDuration * 3, l = o && o.end && this.currentTime_() - o.end > e.playlist.partTargetDuration * 3;
    if (u || l) {
      this.logger_("bad " + (u ? "segment" : "part") + " " + Gr(e)), this.resetEverything();
      return;
    }
    var c = this.mediaIndex !== null;
    c && this.trigger("bandwidthupdate"), this.trigger("progress"), this.mediaIndex = e.mediaIndex, this.partIndex = e.partIndex, this.isEndOfStream_(e.mediaIndex, e.playlist, e.partIndex) && this.endOfStream(), this.trigger("appended"), e.hasAppendedData_ && this.mediaAppends++, this.paused() || this.monitorBuffer_();
  }, n.recordThroughput_ = function(e) {
    if (e.duration < Fn) {
      this.logger_("Ignoring segment's throughput because its duration of " + e.duration + (" is less than the min to record " + Fn));
      return;
    }
    var t = this.throughput.rate, a = Date.now() - e.endOfAllRequests + 1, o = Math.floor(e.byteLength / a * 8 * 1e3);
    this.throughput.rate += (o - t) / ++this.throughput.count;
  }, n.addSegmentMetadataCue_ = function(e) {
    if (this.segmentMetadataTrack_) {
      var t = e.segment, a = t.start, o = t.end;
      if (!(!Vl(a) || !Vl(o))) {
        Oi(a, o, this.segmentMetadataTrack_);
        var u = P.WebKitDataCue || P.VTTCue, l = {
          custom: t.custom,
          dateTimeObject: t.dateTimeObject,
          dateTimeString: t.dateTimeString,
          bandwidth: e.playlist.attributes.BANDWIDTH,
          resolution: e.playlist.attributes.RESOLUTION,
          codecs: e.playlist.attributes.CODECS,
          byteLength: e.byteLength,
          uri: e.uri,
          timeline: e.timeline,
          playlist: e.playlist.id,
          start: a,
          end: o
        }, c = JSON.stringify(l), m = new u(a, o, c);
        m.value = l, this.segmentMetadataTrack_.addCue(m);
      }
    }
  }, r;
})(V.EventTarget);
function Zt() {
}
var lf = function(r) {
  return typeof r != "string" ? r : r.replace(/./, function(n) {
    return n.toUpperCase();
  });
}, ey = ["video", "audio"], js = function(r, n) {
  var i = n[r + "Buffer"];
  return i && i.updating || n.queuePending[r];
}, ty = function(r, n) {
  for (var i = 0; i < n.length; i++) {
    var e = n[i];
    if (e.type === "mediaSource")
      return null;
    if (e.type === r)
      return i;
  }
  return null;
}, Fo = function s(r, n) {
  if (n.queue.length !== 0) {
    var i = 0, e = n.queue[i];
    if (e.type === "mediaSource") {
      !n.updating() && n.mediaSource.readyState !== "closed" && (n.queue.shift(), e.action(n), e.doneFn && e.doneFn(), s("audio", n), s("video", n));
      return;
    }
    if (r !== "mediaSource" && !(!n.ready() || n.mediaSource.readyState === "closed" || js(r, n))) {
      if (e.type !== r) {
        if (i = ty(r, n.queue), i === null)
          return;
        e = n.queue[i];
      }
      if (n.queue.splice(i, 1), n.queuePending[r] = e, e.action(r, n), !e.doneFn) {
        n.queuePending[r] = null, s(r, n);
        return;
      }
    }
  }
}, df = function(r, n) {
  var i = n[r + "Buffer"], e = lf(r);
  i && (i.removeEventListener("updateend", n["on" + e + "UpdateEnd_"]), i.removeEventListener("error", n["on" + e + "Error_"]), n.codecs[r] = null, n[r + "Buffer"] = null);
}, qt = function(r, n) {
  return r && n && Array.prototype.indexOf.call(r.sourceBuffers, n) !== -1;
}, Tt = {
  appendBuffer: function(r, n, i) {
    return function(e, t) {
      var a = t[e + "Buffer"];
      if (qt(t.mediaSource, a)) {
        t.logger_("Appending segment " + n.mediaIndex + "'s " + r.length + " bytes to " + e + "Buffer");
        try {
          a.appendBuffer(r);
        } catch (o) {
          t.logger_("Error with code " + o.code + " " + (o.code === uf ? "(QUOTA_EXCEEDED_ERR) " : "") + ("when appending segment " + n.mediaIndex + " to " + e + "Buffer")), t.queuePending[e] = null, i(o);
        }
      }
    };
  },
  remove: function(r, n) {
    return function(i, e) {
      var t = e[i + "Buffer"];
      if (qt(e.mediaSource, t)) {
        e.logger_("Removing " + r + " to " + n + " from " + i + "Buffer");
        try {
          t.remove(r, n);
        } catch {
          e.logger_("Remove " + r + " to " + n + " from " + i + "Buffer failed");
        }
      }
    };
  },
  timestampOffset: function(r) {
    return function(n, i) {
      var e = i[n + "Buffer"];
      qt(i.mediaSource, e) && (i.logger_("Setting " + n + "timestampOffset to " + r), e.timestampOffset = r);
    };
  },
  callback: function(r) {
    return function(n, i) {
      r();
    };
  },
  endOfStream: function(r) {
    return function(n) {
      if (n.mediaSource.readyState === "open") {
        n.logger_("Calling mediaSource endOfStream(" + (r || "") + ")");
        try {
          n.mediaSource.endOfStream(r);
        } catch (i) {
          V.log.warn("Failed to call media source endOfStream", i);
        }
      }
    };
  },
  duration: function(r) {
    return function(n) {
      n.logger_("Setting mediaSource duration to " + r);
      try {
        n.mediaSource.duration = r;
      } catch (i) {
        V.log.warn("Failed to set media source duration", i);
      }
    };
  },
  abort: function() {
    return function(r, n) {
      if (n.mediaSource.readyState === "open") {
        var i = n[r + "Buffer"];
        if (qt(n.mediaSource, i)) {
          n.logger_("calling abort on " + r + "Buffer");
          try {
            i.abort();
          } catch (e) {
            V.log.warn("Failed to abort on " + r + "Buffer", e);
          }
        }
      }
    };
  },
  addSourceBuffer: function(r, n) {
    return function(i) {
      var e = lf(r), t = Ni(n);
      i.logger_("Adding " + r + "Buffer with codec " + n + " to mediaSource");
      var a = i.mediaSource.addSourceBuffer(t);
      a.addEventListener("updateend", i["on" + e + "UpdateEnd_"]), a.addEventListener("error", i["on" + e + "Error_"]), i.codecs[r] = n, i[r + "Buffer"] = a;
    };
  },
  removeSourceBuffer: function(r) {
    return function(n) {
      var i = n[r + "Buffer"];
      if (df(r, n), !!qt(n.mediaSource, i)) {
        n.logger_("Removing " + r + "Buffer with codec " + n.codecs[r] + " from mediaSource");
        try {
          n.mediaSource.removeSourceBuffer(i);
        } catch (e) {
          V.log.warn("Failed to removeSourceBuffer " + r + "Buffer", e);
        }
      }
    };
  },
  changeType: function(r) {
    return function(n, i) {
      var e = i[n + "Buffer"], t = Ni(r);
      if (qt(i.mediaSource, e) && i.codecs[n] !== r) {
        i.logger_("changing " + n + "Buffer codec from " + i.codecs[n] + " to " + r);
        try {
          e.changeType(t), i.codecs[n] = r;
        } catch (a) {
          V.log.warn("Failed to changeType on " + n + "Buffer", a);
        }
      }
    };
  }
}, bt = function(r) {
  var n = r.type, i = r.sourceUpdater, e = r.action, t = r.doneFn, a = r.name;
  i.queue.push({
    type: n,
    action: e,
    doneFn: t,
    name: a
  }), Fo(n, i);
}, Wl = function(r, n) {
  return function(i) {
    if (n.queuePending[r]) {
      var e = n.queuePending[r].doneFn;
      n.queuePending[r] = null, e && e(n[r + "Error_"]);
    }
    Fo(r, n);
  };
}, cf = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    return e = s.call(this) || this, e.mediaSource = i, e.sourceopenListener_ = function() {
      return Fo("mediaSource", ye(e));
    }, e.mediaSource.addEventListener("sourceopen", e.sourceopenListener_), e.logger_ = Ft("SourceUpdater"), e.audioTimestampOffset_ = 0, e.videoTimestampOffset_ = 0, e.queue = [], e.queuePending = {
      audio: null,
      video: null
    }, e.delayedAudioAppendQueue_ = [], e.videoAppendQueued_ = !1, e.codecs = {}, e.onVideoUpdateEnd_ = Wl("video", ye(e)), e.onAudioUpdateEnd_ = Wl("audio", ye(e)), e.onVideoError_ = function(t) {
      e.videoError_ = t;
    }, e.onAudioError_ = function(t) {
      e.audioError_ = t;
    }, e.createdSourceBuffers_ = !1, e.initializedEme_ = !1, e.triggeredReady_ = !1, e;
  }
  var n = r.prototype;
  return n.initializedEme = function() {
    this.initializedEme_ = !0, this.triggerReady();
  }, n.hasCreatedSourceBuffers = function() {
    return this.createdSourceBuffers_;
  }, n.hasInitializedAnyEme = function() {
    return this.initializedEme_;
  }, n.ready = function() {
    return this.hasCreatedSourceBuffers() && this.hasInitializedAnyEme();
  }, n.createSourceBuffers = function(e) {
    this.hasCreatedSourceBuffers() || (this.addOrChangeSourceBuffers(e), this.createdSourceBuffers_ = !0, this.trigger("createdsourcebuffers"), this.triggerReady());
  }, n.triggerReady = function() {
    this.ready() && !this.triggeredReady_ && (this.triggeredReady_ = !0, this.trigger("ready"));
  }, n.addSourceBuffer = function(e, t) {
    bt({
      type: "mediaSource",
      sourceUpdater: this,
      action: Tt.addSourceBuffer(e, t),
      name: "addSourceBuffer"
    });
  }, n.abort = function(e) {
    bt({
      type: e,
      sourceUpdater: this,
      action: Tt.abort(e),
      name: "abort"
    });
  }, n.removeSourceBuffer = function(e) {
    if (!this.canRemoveSourceBuffer()) {
      V.log.error("removeSourceBuffer is not supported!");
      return;
    }
    bt({
      type: "mediaSource",
      sourceUpdater: this,
      action: Tt.removeSourceBuffer(e),
      name: "removeSourceBuffer"
    });
  }, n.canRemoveSourceBuffer = function() {
    return !V.browser.IE_VERSION && !V.browser.IS_FIREFOX && P.MediaSource && P.MediaSource.prototype && typeof P.MediaSource.prototype.removeSourceBuffer == "function";
  }, r.canChangeType = function() {
    return P.SourceBuffer && P.SourceBuffer.prototype && typeof P.SourceBuffer.prototype.changeType == "function";
  }, n.canChangeType = function() {
    return this.constructor.canChangeType();
  }, n.changeType = function(e, t) {
    if (!this.canChangeType()) {
      V.log.error("changeType is not supported!");
      return;
    }
    bt({
      type: e,
      sourceUpdater: this,
      action: Tt.changeType(t),
      name: "changeType"
    });
  }, n.addOrChangeSourceBuffers = function(e) {
    var t = this;
    if (!e || typeof e != "object" || Object.keys(e).length === 0)
      throw new Error("Cannot addOrChangeSourceBuffers to undefined codecs");
    Object.keys(e).forEach(function(a) {
      var o = e[a];
      if (!t.hasCreatedSourceBuffers())
        return t.addSourceBuffer(a, o);
      t.canChangeType() && t.changeType(a, o);
    });
  }, n.appendBuffer = function(e, t) {
    var a = this, o = e.segmentInfo, u = e.type, l = e.bytes;
    if (this.processedAppend_ = !0, u === "audio" && this.videoBuffer && !this.videoAppendQueued_) {
      this.delayedAudioAppendQueue_.push([e, t]), this.logger_("delayed audio append of " + l.length + " until video append");
      return;
    }
    var c = t;
    if (bt({
      type: u,
      sourceUpdater: this,
      action: Tt.appendBuffer(l, o || {
        mediaIndex: -1
      }, c),
      doneFn: t,
      name: "appendBuffer"
    }), u === "video") {
      if (this.videoAppendQueued_ = !0, !this.delayedAudioAppendQueue_.length)
        return;
      var m = this.delayedAudioAppendQueue_.slice();
      this.logger_("queuing delayed audio " + m.length + " appendBuffers"), this.delayedAudioAppendQueue_.length = 0, m.forEach(function(g) {
        a.appendBuffer.apply(a, g);
      });
    }
  }, n.audioBuffered = function() {
    return qt(this.mediaSource, this.audioBuffer) && this.audioBuffer.buffered ? this.audioBuffer.buffered : V.createTimeRange();
  }, n.videoBuffered = function() {
    return qt(this.mediaSource, this.videoBuffer) && this.videoBuffer.buffered ? this.videoBuffer.buffered : V.createTimeRange();
  }, n.buffered = function() {
    var e = qt(this.mediaSource, this.videoBuffer) ? this.videoBuffer : null, t = qt(this.mediaSource, this.audioBuffer) ? this.audioBuffer : null;
    return t && !e ? this.audioBuffered() : e && !t ? this.videoBuffered() : _v(this.audioBuffered(), this.videoBuffered());
  }, n.setDuration = function(e, t) {
    t === void 0 && (t = Zt), bt({
      type: "mediaSource",
      sourceUpdater: this,
      action: Tt.duration(e),
      name: "duration",
      doneFn: t
    });
  }, n.endOfStream = function(e, t) {
    e === void 0 && (e = null), t === void 0 && (t = Zt), typeof e != "string" && (e = void 0), bt({
      type: "mediaSource",
      sourceUpdater: this,
      action: Tt.endOfStream(e),
      name: "endOfStream",
      doneFn: t
    });
  }, n.removeAudio = function(e, t, a) {
    if (a === void 0 && (a = Zt), !this.audioBuffered().length || this.audioBuffered().end(0) === 0) {
      a();
      return;
    }
    bt({
      type: "audio",
      sourceUpdater: this,
      action: Tt.remove(e, t),
      doneFn: a,
      name: "remove"
    });
  }, n.removeVideo = function(e, t, a) {
    if (a === void 0 && (a = Zt), !this.videoBuffered().length || this.videoBuffered().end(0) === 0) {
      a();
      return;
    }
    bt({
      type: "video",
      sourceUpdater: this,
      action: Tt.remove(e, t),
      doneFn: a,
      name: "remove"
    });
  }, n.updating = function() {
    return !!(js("audio", this) || js("video", this));
  }, n.audioTimestampOffset = function(e) {
    return typeof e < "u" && this.audioBuffer && // no point in updating if it's the same
    this.audioTimestampOffset_ !== e && (bt({
      type: "audio",
      sourceUpdater: this,
      action: Tt.timestampOffset(e),
      name: "timestampOffset"
    }), this.audioTimestampOffset_ = e), this.audioTimestampOffset_;
  }, n.videoTimestampOffset = function(e) {
    return typeof e < "u" && this.videoBuffer && // no point in updating if it's the same
    this.videoTimestampOffset !== e && (bt({
      type: "video",
      sourceUpdater: this,
      action: Tt.timestampOffset(e),
      name: "timestampOffset"
    }), this.videoTimestampOffset_ = e), this.videoTimestampOffset_;
  }, n.audioQueueCallback = function(e) {
    this.audioBuffer && bt({
      type: "audio",
      sourceUpdater: this,
      action: Tt.callback(e),
      name: "callback"
    });
  }, n.videoQueueCallback = function(e) {
    this.videoBuffer && bt({
      type: "video",
      sourceUpdater: this,
      action: Tt.callback(e),
      name: "callback"
    });
  }, n.dispose = function() {
    var e = this;
    this.trigger("dispose"), ey.forEach(function(t) {
      e.abort(t), e.canRemoveSourceBuffer() ? e.removeSourceBuffer(t) : e[t + "QueueCallback"](function() {
        return df(t, e);
      });
    }), this.videoAppendQueued_ = !1, this.delayedAudioAppendQueue_.length = 0, this.sourceopenListener_ && this.mediaSource.removeEventListener("sourceopen", this.sourceopenListener_), this.off();
  }, r;
})(V.EventTarget), Gl = function(r) {
  return decodeURIComponent(escape(String.fromCharCode.apply(null, r)));
}, zl = new Uint8Array(`

`.split("").map(function(s) {
  return s.charCodeAt(0);
})), ry = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    return s.call(this, "Trying to parse received VTT cues, but there is no WebVTT. Make sure vtt.js is loaded.") || this;
  }
  return r;
})(/* @__PURE__ */ Ss(Error)), iy = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e) {
    var t;
    return e === void 0 && (e = {}), t = s.call(this, i, e) || this, t.mediaSource_ = null, t.subtitlesTrack_ = null, t.loaderType_ = "subtitle", t.featuresNativeTextTracks_ = i.featuresNativeTextTracks, t.loadVttJs = i.loadVttJs, t.shouldSaveSegmentTimingInfo_ = !1, t;
  }
  var n = r.prototype;
  return n.createTransmuxer_ = function() {
    return null;
  }, n.buffered_ = function() {
    if (!this.subtitlesTrack_ || !this.subtitlesTrack_.cues || !this.subtitlesTrack_.cues.length)
      return V.createTimeRanges();
    var e = this.subtitlesTrack_.cues, t = e[0].startTime, a = e[e.length - 1].startTime;
    return V.createTimeRanges([[t, a]]);
  }, n.initSegmentForMap = function(e, t) {
    if (t === void 0 && (t = !1), !e)
      return null;
    var a = ra(e), o = this.initSegments_[a];
    if (t && !o && e.bytes) {
      var u = zl.byteLength + e.bytes.byteLength, l = new Uint8Array(u);
      l.set(e.bytes), l.set(zl, e.bytes.byteLength), this.initSegments_[a] = o = {
        resolvedUri: e.resolvedUri,
        byterange: e.byterange,
        bytes: l
      };
    }
    return o || e;
  }, n.couldBeginLoading_ = function() {
    return this.playlist_ && this.subtitlesTrack_ && !this.paused();
  }, n.init_ = function() {
    return this.state = "READY", this.resetEverything(), this.monitorBuffer_();
  }, n.track = function(e) {
    return typeof e > "u" ? this.subtitlesTrack_ : (this.subtitlesTrack_ = e, this.state === "INIT" && this.couldBeginLoading_() && this.init_(), this.subtitlesTrack_);
  }, n.remove = function(e, t) {
    Oi(e, t, this.subtitlesTrack_);
  }, n.fillBuffer_ = function() {
    var e = this, t = this.chooseNextRequest_();
    if (t) {
      if (this.syncController_.timestampOffsetForTimeline(t.timeline) === null) {
        var a = function() {
          e.state = "READY", e.paused() || e.monitorBuffer_();
        };
        this.syncController_.one("timestampoffset", a), this.state = "WAITING_ON_TIMELINE";
        return;
      }
      this.loadSegment_(t);
    }
  }, n.timestampOffsetForSegment_ = function() {
    return null;
  }, n.chooseNextRequest_ = function() {
    return this.skipEmptySegments_(s.prototype.chooseNextRequest_.call(this));
  }, n.skipEmptySegments_ = function(e) {
    for (; e && e.segment.empty; ) {
      if (e.mediaIndex + 1 >= e.playlist.segments.length) {
        e = null;
        break;
      }
      e = this.generateSegmentInfo_({
        playlist: e.playlist,
        mediaIndex: e.mediaIndex + 1,
        startOfSegment: e.startOfSegment + e.duration,
        isSyncRequest: e.isSyncRequest
      });
    }
    return e;
  }, n.stopForError = function(e) {
    this.error(e), this.state = "READY", this.pause(), this.trigger("error");
  }, n.segmentRequestFinished_ = function(e, t, a) {
    var o = this;
    if (!this.subtitlesTrack_) {
      this.state = "READY";
      return;
    }
    if (this.saveTransferStats_(t.stats), !this.pendingSegment_) {
      this.state = "READY", this.mediaRequestsAborted += 1;
      return;
    }
    if (e) {
      e.code === Wt.TIMEOUT && this.handleTimeout_(), e.code === Wt.ABORTED ? this.mediaRequestsAborted += 1 : this.mediaRequestsErrored += 1, this.stopForError(e);
      return;
    }
    var u = this.pendingSegment_;
    this.saveBandwidthRelatedStats_(u.duration, t.stats), t.key && this.segmentKey(t.key, !0), this.state = "APPENDING", this.trigger("appending");
    var l = u.segment;
    if (l.map && (l.map.bytes = t.map.bytes), u.bytes = t.bytes, typeof P.WebVTT != "function" && typeof this.loadVttJs == "function") {
      this.state = "WAITING_ON_VTTJS", this.loadVttJs().then(function() {
        return o.segmentRequestFinished_(e, t, a);
      }, function() {
        return o.stopForError({
          message: "Error loading vtt.js"
        });
      });
      return;
    }
    l.requested = !0;
    try {
      this.parseVTTCues_(u);
    } catch (c) {
      this.stopForError({
        message: c.message
      });
      return;
    }
    if (this.updateTimeMapping_(u, this.syncController_.timelines[u.timeline], this.playlist_), u.cues.length ? u.timingInfo = {
      start: u.cues[0].startTime,
      end: u.cues[u.cues.length - 1].endTime
    } : u.timingInfo = {
      start: u.startOfSegment,
      end: u.startOfSegment + u.duration
    }, u.isSyncRequest) {
      this.trigger("syncinfoupdate"), this.pendingSegment_ = null, this.state = "READY";
      return;
    }
    u.byteLength = u.bytes.byteLength, this.mediaSecondsLoaded += l.duration, u.cues.forEach(function(c) {
      o.subtitlesTrack_.addCue(o.featuresNativeTextTracks_ ? new P.VTTCue(c.startTime, c.endTime, c.text) : c);
    }), j0(this.subtitlesTrack_), this.handleAppendsDone_();
  }, n.handleData_ = function() {
  }, n.updateTimingInfoEnd_ = function() {
  }, n.parseVTTCues_ = function(e) {
    var t, a = !1;
    if (typeof P.WebVTT != "function")
      throw new ry();
    typeof P.TextDecoder == "function" ? t = new P.TextDecoder("utf8") : (t = P.WebVTT.StringDecoder(), a = !0);
    var o = new P.WebVTT.Parser(P, P.vttjs, t);
    if (e.cues = [], e.timestampmap = {
      MPEGTS: 0,
      LOCAL: 0
    }, o.oncue = e.cues.push.bind(e.cues), o.ontimestampmap = function(c) {
      e.timestampmap = c;
    }, o.onparsingerror = function(c) {
      V.log.warn("Error encountered when parsing cues: " + c.message);
    }, e.segment.map) {
      var u = e.segment.map.bytes;
      a && (u = Gl(u)), o.parse(u);
    }
    var l = e.bytes;
    a && (l = Gl(l)), o.parse(l), o.flush();
  }, n.updateTimeMapping_ = function(e, t, a) {
    var o = e.segment;
    if (t) {
      if (!e.cues.length) {
        o.empty = !0;
        return;
      }
      var u = e.timestampmap, l = u.MPEGTS / Wn.ONE_SECOND_IN_TS - u.LOCAL + t.mapping;
      if (e.cues.forEach(function(g) {
        g.startTime += l, g.endTime += l;
      }), !a.syncInfo) {
        var c = e.cues[0].startTime, m = e.cues[e.cues.length - 1].startTime;
        a.syncInfo = {
          mediaSequence: a.mediaSequence + e.mediaIndex,
          time: Math.min(c, m - o.duration)
        };
      }
    }
  }, r;
})(qs), ny = function(r, n) {
  for (var i = r.cues, e = 0; e < i.length; e++) {
    var t = i[e];
    if (n >= t.adStartTime && n <= t.adEndTime)
      return t;
  }
  return null;
}, ay = function(r, n, i) {
  if (i === void 0 && (i = 0), !!r.segments)
    for (var e = i, t, a = 0; a < r.segments.length; a++) {
      var o = r.segments[a];
      if (t || (t = ny(n, e + o.duration / 2)), t) {
        if ("cueIn" in o) {
          t.endTime = e, t.adEndTime = e, e += o.duration, t = null;
          continue;
        }
        if (e < t.endTime) {
          e += o.duration;
          continue;
        }
        t.endTime += o.duration;
      } else if ("cueOut" in o && (t = new P.VTTCue(e, e + o.duration, o.cueOut), t.adStartTime = e, t.adEndTime = e + parseFloat(o.cueOut), n.addCue(t)), "cueOutCont" in o) {
        var u = o.cueOutCont.split("/").map(parseFloat), l = u[0], c = u[1];
        t = new P.VTTCue(e, e + o.duration, ""), t.adStartTime = e - l, t.adEndTime = t.adStartTime + c, n.addCue(t);
      }
      e += o.duration;
    }
}, sy = 86400, Kl = [
  // Stategy "VOD": Handle the VOD-case where the sync-point is *always*
  //                the equivalence display-time 0 === segment-index 0
  {
    name: "VOD",
    run: function(r, n, i, e, t) {
      if (i !== 1 / 0) {
        var a = {
          time: 0,
          segmentIndex: 0,
          partIndex: null
        };
        return a;
      }
      return null;
    }
  },
  // Stategy "ProgramDateTime": We have a program-date-time tag in this playlist
  {
    name: "ProgramDateTime",
    run: function(r, n, i, e, t) {
      if (!Object.keys(r.timelineToDatetimeMappings).length)
        return null;
      var a = null, o = null, u = Ls(n);
      t = t || 0;
      for (var l = 0; l < u.length; l++) {
        var c = n.endList || t === 0 ? l : u.length - (l + 1), m = u[c], g = m.segment, _ = r.timelineToDatetimeMappings[g.timeline];
        if (!(!_ || !g.dateTimeObject)) {
          var C = g.dateTimeObject.getTime() / 1e3, w = C + _;
          if (g.parts && typeof m.partIndex == "number")
            for (var E = 0; E < m.partIndex; E++)
              w += g.parts[E].duration;
          var M = Math.abs(t - w);
          if (o !== null && (M === 0 || o < M))
            break;
          o = M, a = {
            time: w,
            segmentIndex: m.segmentIndex,
            partIndex: m.partIndex
          };
        }
      }
      return a;
    }
  },
  // Stategy "Segment": We have a known time mapping for a timeline and a
  //                    segment in the current timeline with timing data
  {
    name: "Segment",
    run: function(r, n, i, e, t) {
      var a = null, o = null;
      t = t || 0;
      for (var u = Ls(n), l = 0; l < u.length; l++) {
        var c = n.endList || t === 0 ? l : u.length - (l + 1), m = u[c], g = m.segment, _ = m.part && m.part.start || g && g.start;
        if (g.timeline === e && typeof _ < "u") {
          var C = Math.abs(t - _);
          if (o !== null && o < C)
            break;
          (!a || o === null || o >= C) && (o = C, a = {
            time: _,
            segmentIndex: m.segmentIndex,
            partIndex: m.partIndex
          });
        }
      }
      return a;
    }
  },
  // Stategy "Discontinuity": We have a discontinuity with a known
  //                          display-time
  {
    name: "Discontinuity",
    run: function(r, n, i, e, t) {
      var a = null;
      if (t = t || 0, n.discontinuityStarts && n.discontinuityStarts.length)
        for (var o = null, u = 0; u < n.discontinuityStarts.length; u++) {
          var l = n.discontinuityStarts[u], c = n.discontinuitySequence + u + 1, m = r.discontinuities[c];
          if (m) {
            var g = Math.abs(t - m.time);
            if (o !== null && o < g)
              break;
            (!a || o === null || o >= g) && (o = g, a = {
              time: m.time,
              segmentIndex: l,
              partIndex: null
            });
          }
        }
      return a;
    }
  },
  // Stategy "Playlist": We have a playlist with a known mapping of
  //                     segment index to display time
  {
    name: "Playlist",
    run: function(r, n, i, e, t) {
      if (n.syncInfo) {
        var a = {
          time: n.syncInfo.time,
          segmentIndex: n.syncInfo.mediaSequence - n.mediaSequence,
          partIndex: null
        };
        return a;
      }
      return null;
    }
  }
], oy = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    return e = s.call(this) || this, e.timelines = [], e.discontinuities = [], e.timelineToDatetimeMappings = {}, e.logger_ = Ft("SyncController"), e;
  }
  var n = r.prototype;
  return n.getSyncPoint = function(e, t, a, o) {
    var u = this.runStrategies_(e, t, a, o);
    return u.length ? this.selectSyncPoint_(u, {
      key: "time",
      value: o
    }) : null;
  }, n.getExpiredTime = function(e, t) {
    if (!e || !e.segments)
      return null;
    var a = this.runStrategies_(e, t, e.discontinuitySequence, 0);
    if (!a.length)
      return null;
    var o = this.selectSyncPoint_(a, {
      key: "segmentIndex",
      value: 0
    });
    return o.segmentIndex > 0 && (o.time *= -1), Math.abs(o.time + Ri({
      defaultDuration: e.targetDuration,
      durationList: e.segments,
      startIndex: o.segmentIndex,
      endIndex: 0
    }));
  }, n.runStrategies_ = function(e, t, a, o) {
    for (var u = [], l = 0; l < Kl.length; l++) {
      var c = Kl[l], m = c.run(this, e, t, a, o);
      m && (m.strategy = c.name, u.push({
        strategy: c.name,
        syncPoint: m
      }));
    }
    return u;
  }, n.selectSyncPoint_ = function(e, t) {
    for (var a = e[0].syncPoint, o = Math.abs(e[0].syncPoint[t.key] - t.value), u = e[0].strategy, l = 1; l < e.length; l++) {
      var c = Math.abs(e[l].syncPoint[t.key] - t.value);
      c < o && (o = c, a = e[l].syncPoint, u = e[l].strategy);
    }
    return this.logger_("syncPoint for [" + t.key + ": " + t.value + "] chosen with strategy" + (" [" + u + "]: [time:" + a.time + ",") + (" segmentIndex:" + a.segmentIndex) + (typeof a.partIndex == "number" ? ",partIndex:" + a.partIndex : "") + "]"), a;
  }, n.saveExpiredSegmentInfo = function(e, t) {
    var a = t.mediaSequence - e.mediaSequence;
    if (a > sy) {
      V.log.warn("Not saving expired segment info. Media sequence gap " + a + " is too large.");
      return;
    }
    for (var o = a - 1; o >= 0; o--) {
      var u = e.segments[o];
      if (u && typeof u.start < "u") {
        t.syncInfo = {
          mediaSequence: e.mediaSequence + o,
          time: u.start
        }, this.logger_("playlist refresh sync: [time:" + t.syncInfo.time + "," + (" mediaSequence: " + t.syncInfo.mediaSequence + "]")), this.trigger("syncinfoupdate");
        break;
      }
    }
  }, n.setDateTimeMappingForStart = function(e) {
    if (this.timelineToDatetimeMappings = {}, e.segments && e.segments.length && e.segments[0].dateTimeObject) {
      var t = e.segments[0], a = t.dateTimeObject.getTime() / 1e3;
      this.timelineToDatetimeMappings[t.timeline] = -a;
    }
  }, n.saveSegmentTimingInfo = function(e) {
    var t = e.segmentInfo, a = e.shouldSaveTimelineMapping, o = this.calculateSegmentTimeMapping_(t, t.timingInfo, a), u = t.segment;
    o && (this.saveDiscontinuitySyncInfo_(t), t.playlist.syncInfo || (t.playlist.syncInfo = {
      mediaSequence: t.playlist.mediaSequence + t.mediaIndex,
      time: u.start
    }));
    var l = u.dateTimeObject;
    u.discontinuity && a && l && (this.timelineToDatetimeMappings[u.timeline] = -(l.getTime() / 1e3));
  }, n.timestampOffsetForTimeline = function(e) {
    return typeof this.timelines[e] > "u" ? null : this.timelines[e].time;
  }, n.mappingForTimeline = function(e) {
    return typeof this.timelines[e] > "u" ? null : this.timelines[e].mapping;
  }, n.calculateSegmentTimeMapping_ = function(e, t, a) {
    var o = e.segment, u = e.part, l = this.timelines[e.timeline], c, m;
    if (typeof e.timestampOffset == "number")
      l = {
        time: e.startOfSegment,
        mapping: e.startOfSegment - t.start
      }, a && (this.timelines[e.timeline] = l, this.trigger("timestampoffset"), this.logger_("time mapping for timeline " + e.timeline + ": " + ("[time: " + l.time + "] [mapping: " + l.mapping + "]"))), c = e.startOfSegment, m = t.end + l.mapping;
    else if (l)
      c = t.start + l.mapping, m = t.end + l.mapping;
    else
      return !1;
    return u && (u.start = c, u.end = m), (!o.start || c < o.start) && (o.start = c), o.end = m, !0;
  }, n.saveDiscontinuitySyncInfo_ = function(e) {
    var t = e.playlist, a = e.segment;
    if (a.discontinuity)
      this.discontinuities[a.timeline] = {
        time: a.start,
        accuracy: 0
      };
    else if (t.discontinuityStarts && t.discontinuityStarts.length)
      for (var o = 0; o < t.discontinuityStarts.length; o++) {
        var u = t.discontinuityStarts[o], l = t.discontinuitySequence + o + 1, c = u - e.mediaIndex, m = Math.abs(c);
        if (!this.discontinuities[l] || this.discontinuities[l].accuracy > m) {
          var g = void 0;
          c < 0 ? g = a.start - Ri({
            defaultDuration: t.targetDuration,
            durationList: t.segments,
            startIndex: e.mediaIndex,
            endIndex: u
          }) : g = a.end + Ri({
            defaultDuration: t.targetDuration,
            durationList: t.segments,
            startIndex: e.mediaIndex + 1,
            endIndex: u
          }), this.discontinuities[l] = {
            time: g,
            accuracy: m
          };
        }
      }
  }, n.dispose = function() {
    this.trigger("dispose"), this.off();
  }, r;
})(V.EventTarget), uy = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r() {
    var i;
    return i = s.call(this) || this, i.pendingTimelineChanges_ = {}, i.lastTimelineChanges_ = {}, i;
  }
  var n = r.prototype;
  return n.clearPendingTimelineChange = function(e) {
    this.pendingTimelineChanges_[e] = null, this.trigger("pendingtimelinechange");
  }, n.pendingTimelineChange = function(e) {
    var t = e.type, a = e.from, o = e.to;
    return typeof a == "number" && typeof o == "number" && (this.pendingTimelineChanges_[t] = {
      type: t,
      from: a,
      to: o
    }, this.trigger("pendingtimelinechange")), this.pendingTimelineChanges_[t];
  }, n.lastTimelineChange = function(e) {
    var t = e.type, a = e.from, o = e.to;
    return typeof a == "number" && typeof o == "number" && (this.lastTimelineChanges_[t] = {
      type: t,
      from: a,
      to: o
    }, delete this.pendingTimelineChanges_[t], this.trigger("timelinechange")), this.lastTimelineChanges_[t];
  }, n.dispose = function() {
    this.trigger("dispose"), this.pendingTimelineChanges_ = {}, this.lastTimelineChanges_ = {}, this.off();
  }, r;
})(V.EventTarget), ly = Yc(Qc(function() {
  var s = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
  function r(W, H, $) {
    return $ = {
      path: H,
      exports: {},
      require: function(q, T) {
        return n(q, T ?? $.path);
      }
    }, W($, $.exports), $.exports;
  }
  function n() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
  }
  var i = r(function(W) {
    function H(N, q) {
      for (var T = 0; T < q.length; T++) {
        var b = q[T];
        b.enumerable = b.enumerable || !1, b.configurable = !0, "value" in b && (b.writable = !0), Object.defineProperty(N, b.key, b);
      }
    }
    function $(N, q, T) {
      return q && H(N.prototype, q), T && H(N, T), N;
    }
    W.exports = $, W.exports.default = W.exports, W.exports.__esModule = !0;
  }), e = r(function(W) {
    function H($, N) {
      return W.exports = H = Object.setPrototypeOf || function(T, b) {
        return T.__proto__ = b, T;
      }, W.exports.default = W.exports, W.exports.__esModule = !0, H($, N);
    }
    W.exports = H, W.exports.default = W.exports, W.exports.__esModule = !0;
  }), t = r(function(W) {
    function H($, N) {
      $.prototype = Object.create(N.prototype), $.prototype.constructor = $, e($, N);
    }
    W.exports = H, W.exports.default = W.exports, W.exports.__esModule = !0;
  }), a = /* @__PURE__ */ (function() {
    function W() {
      this.listeners = {};
    }
    var H = W.prototype;
    return H.on = function(N, q) {
      this.listeners[N] || (this.listeners[N] = []), this.listeners[N].push(q);
    }, H.off = function(N, q) {
      if (!this.listeners[N])
        return !1;
      var T = this.listeners[N].indexOf(q);
      return this.listeners[N] = this.listeners[N].slice(0), this.listeners[N].splice(T, 1), T > -1;
    }, H.trigger = function(N) {
      var q = this.listeners[N];
      if (q)
        if (arguments.length === 2)
          for (var T = q.length, b = 0; b < T; ++b)
            q[b].call(this, arguments[1]);
        else
          for (var L = Array.prototype.slice.call(arguments, 1), R = q.length, j = 0; j < R; ++j)
            q[j].apply(this, L);
    }, H.dispose = function() {
      this.listeners = {};
    }, H.pipe = function(N) {
      this.on("data", function(q) {
        N.push(q);
      });
    }, W;
  })();
  /*! @name pkcs7 @version 1.0.4 @license Apache-2.0 */
  function o(W) {
    return W.subarray(0, W.byteLength - W[W.byteLength - 1]);
  }
  /*! @name aes-decrypter @version 3.1.3 @license Apache-2.0 */
  var u = function() {
    var H = [[[], [], [], [], []], [[], [], [], [], []]], $ = H[0], N = H[1], q = $[4], T = N[4], b, L, R, j = [], K = [], Y, re, J, ee, Z, Q;
    for (b = 0; b < 256; b++)
      K[(j[b] = b << 1 ^ (b >> 7) * 283) ^ b] = b;
    for (L = R = 0; !q[L]; L ^= Y || 1, R = K[R] || 1)
      for (ee = R ^ R << 1 ^ R << 2 ^ R << 3 ^ R << 4, ee = ee >> 8 ^ ee & 255 ^ 99, q[L] = ee, T[ee] = L, J = j[re = j[Y = j[L]]], Q = J * 16843009 ^ re * 65537 ^ Y * 257 ^ L * 16843008, Z = j[ee] * 257 ^ ee * 16843008, b = 0; b < 4; b++)
        $[b][L] = Z = Z << 24 ^ Z >>> 8, N[b][ee] = Q = Q << 24 ^ Q >>> 8;
    for (b = 0; b < 5; b++)
      $[b] = $[b].slice(0), N[b] = N[b].slice(0);
    return H;
  }, l = null, c = /* @__PURE__ */ (function() {
    function W($) {
      l || (l = u()), this._tables = [[l[0][0].slice(), l[0][1].slice(), l[0][2].slice(), l[0][3].slice(), l[0][4].slice()], [l[1][0].slice(), l[1][1].slice(), l[1][2].slice(), l[1][3].slice(), l[1][4].slice()]];
      var N, q, T, b = this._tables[0][4], L = this._tables[1], R = $.length, j = 1;
      if (R !== 4 && R !== 6 && R !== 8)
        throw new Error("Invalid aes key size");
      var K = $.slice(0), Y = [];
      for (this._key = [K, Y], N = R; N < 4 * R + 28; N++)
        T = K[N - 1], (N % R === 0 || R === 8 && N % R === 4) && (T = b[T >>> 24] << 24 ^ b[T >> 16 & 255] << 16 ^ b[T >> 8 & 255] << 8 ^ b[T & 255], N % R === 0 && (T = T << 8 ^ T >>> 24 ^ j << 24, j = j << 1 ^ (j >> 7) * 283)), K[N] = K[N - R] ^ T;
      for (q = 0; N; q++, N--)
        T = K[q & 3 ? N : N - 4], N <= 4 || q < 4 ? Y[q] = T : Y[q] = L[0][b[T >>> 24]] ^ L[1][b[T >> 16 & 255]] ^ L[2][b[T >> 8 & 255]] ^ L[3][b[T & 255]];
    }
    var H = W.prototype;
    return H.decrypt = function(N, q, T, b, L, R) {
      var j = this._key[1], K = N ^ j[0], Y = b ^ j[1], re = T ^ j[2], J = q ^ j[3], ee, Z, Q, ie = j.length / 4 - 2, he, me = 4, ge = this._tables[1], ce = ge[0], Pe = ge[1], Ve = ge[2], Ie = ge[3], qe = ge[4];
      for (he = 0; he < ie; he++)
        ee = ce[K >>> 24] ^ Pe[Y >> 16 & 255] ^ Ve[re >> 8 & 255] ^ Ie[J & 255] ^ j[me], Z = ce[Y >>> 24] ^ Pe[re >> 16 & 255] ^ Ve[J >> 8 & 255] ^ Ie[K & 255] ^ j[me + 1], Q = ce[re >>> 24] ^ Pe[J >> 16 & 255] ^ Ve[K >> 8 & 255] ^ Ie[Y & 255] ^ j[me + 2], J = ce[J >>> 24] ^ Pe[K >> 16 & 255] ^ Ve[Y >> 8 & 255] ^ Ie[re & 255] ^ j[me + 3], me += 4, K = ee, Y = Z, re = Q;
      for (he = 0; he < 4; he++)
        L[(3 & -he) + R] = qe[K >>> 24] << 24 ^ qe[Y >> 16 & 255] << 16 ^ qe[re >> 8 & 255] << 8 ^ qe[J & 255] ^ j[me++], ee = K, K = Y, Y = re, re = J, J = ee;
    }, W;
  })(), m = /* @__PURE__ */ (function(W) {
    t(H, W);
    function H() {
      var N;
      return N = W.call(this, a) || this, N.jobs = [], N.delay = 1, N.timeout_ = null, N;
    }
    var $ = H.prototype;
    return $.processJob_ = function() {
      this.jobs.shift()(), this.jobs.length ? this.timeout_ = setTimeout(this.processJob_.bind(this), this.delay) : this.timeout_ = null;
    }, $.push = function(q) {
      this.jobs.push(q), this.timeout_ || (this.timeout_ = setTimeout(this.processJob_.bind(this), this.delay));
    }, H;
  })(a), g = function(H) {
    return H << 24 | (H & 65280) << 8 | (H & 16711680) >> 8 | H >>> 24;
  }, _ = function(H, $, N) {
    var q = new Int32Array(H.buffer, H.byteOffset, H.byteLength >> 2), T = new c(Array.prototype.slice.call($)), b = new Uint8Array(H.byteLength), L = new Int32Array(b.buffer), R, j, K, Y, re, J, ee, Z, Q;
    for (R = N[0], j = N[1], K = N[2], Y = N[3], Q = 0; Q < q.length; Q += 4)
      re = g(q[Q]), J = g(q[Q + 1]), ee = g(q[Q + 2]), Z = g(q[Q + 3]), T.decrypt(re, J, ee, Z, L, Q), L[Q] = g(L[Q] ^ R), L[Q + 1] = g(L[Q + 1] ^ j), L[Q + 2] = g(L[Q + 2] ^ K), L[Q + 3] = g(L[Q + 3] ^ Y), R = re, j = J, K = ee, Y = Z;
    return b;
  }, C = /* @__PURE__ */ (function() {
    function W($, N, q, T) {
      var b = W.STEP, L = new Int32Array($.buffer), R = new Uint8Array($.byteLength), j = 0;
      for (this.asyncStream_ = new m(), this.asyncStream_.push(this.decryptChunk_(L.subarray(j, j + b), N, q, R)), j = b; j < L.length; j += b)
        q = new Uint32Array([g(L[j - 4]), g(L[j - 3]), g(L[j - 2]), g(L[j - 1])]), this.asyncStream_.push(this.decryptChunk_(L.subarray(j, j + b), N, q, R));
      this.asyncStream_.push(function() {
        T(null, o(R));
      });
    }
    var H = W.prototype;
    return H.decryptChunk_ = function(N, q, T, b) {
      return function() {
        var L = _(N, q, T);
        b.set(L, N.byteOffset);
      };
    }, i(W, null, [{
      key: "STEP",
      get: function() {
        return 32e3;
      }
    }]), W;
  })(), w;
  typeof window < "u" ? w = window : typeof s < "u" ? w = s : typeof self < "u" ? w = self : w = {};
  var E = w, M = function(H) {
    return ArrayBuffer.isView === "function" ? ArrayBuffer.isView(H) : H && H.buffer instanceof ArrayBuffer;
  }, B = E.BigInt || Number;
  B("0x1"), B("0x100"), B("0x10000"), B("0x1000000"), B("0x100000000"), B("0x10000000000"), B("0x1000000000000"), B("0x100000000000000"), B("0x10000000000000000");
  var z = function(H) {
    var $ = {};
    return Object.keys(H).forEach(function(N) {
      var q = H[N];
      M(q) ? $[N] = {
        bytes: q.buffer,
        byteOffset: q.byteOffset,
        byteLength: q.byteLength
      } : $[N] = q;
    }), $;
  };
  self.onmessage = function(W) {
    var H = W.data, $ = new Uint8Array(H.encrypted.bytes, H.encrypted.byteOffset, H.encrypted.byteLength), N = new Uint32Array(H.key.bytes, H.key.byteOffset, H.key.byteLength / 4), q = new Uint32Array(H.iv.bytes, H.iv.byteOffset, H.iv.byteLength / 4);
    new C($, N, q, function(T, b) {
      self.postMessage(z({
        source: H.source,
        decrypted: b
      }), [b.buffer]);
    });
  };
})), dy = Xc(ly), cy = function(r) {
  var n = r.default ? "main" : "alternative";
  return r.characteristics && r.characteristics.indexOf("public.accessibility.describes-video") >= 0 && (n = "main-desc"), n;
}, sa = function(r, n) {
  r.abort(), r.pause(), n && n.activePlaylistLoader && (n.activePlaylistLoader.pause(), n.activePlaylistLoader = null);
}, Hs = function(r, n) {
  n.activePlaylistLoader = r, r.load();
}, fy = function(r, n) {
  return function() {
    var i = n.segmentLoaders, e = i[r], t = i.main, a = n.mediaTypes[r], o = a.activeTrack(), u = a.getActiveGroup(), l = a.activePlaylistLoader, c = a.lastGroup_;
    if (!(u && c && u.id === c.id) && (a.lastGroup_ = u, a.lastTrack_ = o, sa(e, a), !(!u || u.isMasterPlaylist))) {
      if (!u.playlistLoader) {
        l && t.resetEverything();
        return;
      }
      e.resyncLoader(), Hs(u.playlistLoader, a);
    }
  };
}, hy = function(r, n) {
  return function() {
    var i = n.segmentLoaders[r], e = n.mediaTypes[r];
    e.lastGroup_ = null, i.abort(), i.pause();
  };
}, py = function(r, n) {
  return function() {
    var i = n.masterPlaylistLoader, e = n.segmentLoaders, t = e[r], a = e.main, o = n.mediaTypes[r], u = o.activeTrack(), l = o.getActiveGroup(), c = o.activePlaylistLoader, m = o.lastTrack_;
    if (!(m && u && m.id === u.id) && (o.lastGroup_ = l, o.lastTrack_ = u, sa(t, o), !!l)) {
      if (l.isMasterPlaylist) {
        if (!u || !m || u.id === m.id)
          return;
        var g = n.vhs.masterPlaylistController_, _ = g.selectPlaylist();
        if (g.media() === _)
          return;
        o.logger_("track change. Switching master audio from " + m.id + " to " + u.id), i.pause(), a.resetEverything(), g.fastQualityChange_(_);
        return;
      }
      if (r === "AUDIO") {
        if (!l.playlistLoader) {
          a.setAudio(!0), a.resetEverything();
          return;
        }
        t.setAudio(!0), a.setAudio(!1);
      }
      if (c === l.playlistLoader) {
        Hs(l.playlistLoader, o);
        return;
      }
      t.track && t.track(u), t.resetEverything(), Hs(l.playlistLoader, o);
    }
  };
}, oa = {
  /**
   * Returns a function to be called when a SegmentLoader or PlaylistLoader encounters
   * an error.
   *
   * @param {string} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Error handler. Logs warning (or error if the playlist is blacklisted) to
   *         console and switches back to default audio track.
   * @function onError.AUDIO
   */
  AUDIO: function(r, n) {
    return function() {
      var i = n.segmentLoaders[r], e = n.mediaTypes[r], t = n.blacklistCurrentPlaylist;
      sa(i, e);
      var a = e.activeTrack(), o = e.activeGroup(), u = (o.filter(function(m) {
        return m.default;
      })[0] || o[0]).id, l = e.tracks[u];
      if (a === l) {
        t({
          message: "Problem encountered loading the default audio track."
        });
        return;
      }
      V.log.warn("Problem encountered loading the alternate audio track.Switching back to default.");
      for (var c in e.tracks)
        e.tracks[c].enabled = e.tracks[c] === l;
      e.onTrackChanged();
    };
  },
  /**
   * Returns a function to be called when a SegmentLoader or PlaylistLoader encounters
   * an error.
   *
   * @param {string} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Error handler. Logs warning to console and disables the active subtitle track
   * @function onError.SUBTITLES
   */
  SUBTITLES: function(r, n) {
    return function() {
      var i = n.segmentLoaders[r], e = n.mediaTypes[r];
      V.log.warn("Problem encountered loading the subtitle track.Disabling subtitle track."), sa(i, e);
      var t = e.activeTrack();
      t && (t.mode = "disabled"), e.onTrackChanged();
    };
  }
}, $l = {
  /**
   * Setup event listeners for audio playlist loader
   *
   * @param {string} type
   *        MediaGroup type
   * @param {PlaylistLoader|null} playlistLoader
   *        PlaylistLoader to register listeners on
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function setupListeners.AUDIO
   */
  AUDIO: function(r, n, i) {
    if (n) {
      var e = i.tech, t = i.requestOptions, a = i.segmentLoaders[r];
      n.on("loadedmetadata", function() {
        var o = n.media();
        a.playlist(o, t), (!e.paused() || o.endList && e.preload() !== "none") && a.load();
      }), n.on("loadedplaylist", function() {
        a.playlist(n.media(), t), e.paused() || a.load();
      }), n.on("error", oa[r](r, i));
    }
  },
  /**
   * Setup event listeners for subtitle playlist loader
   *
   * @param {string} type
   *        MediaGroup type
   * @param {PlaylistLoader|null} playlistLoader
   *        PlaylistLoader to register listeners on
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function setupListeners.SUBTITLES
   */
  SUBTITLES: function(r, n, i) {
    var e = i.tech, t = i.requestOptions, a = i.segmentLoaders[r], o = i.mediaTypes[r];
    n.on("loadedmetadata", function() {
      var u = n.media();
      a.playlist(u, t), a.track(o.activeTrack()), (!e.paused() || u.endList && e.preload() !== "none") && a.load();
    }), n.on("loadedplaylist", function() {
      a.playlist(n.media(), t), e.paused() || a.load();
    }), n.on("error", oa[r](r, i));
  }
}, my = {
  /**
   * Setup PlaylistLoaders and AudioTracks for the audio groups
   *
   * @param {string} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function initialize.AUDIO
   */
  AUDIO: function(r, n) {
    var i = n.vhs, e = n.sourceType, t = n.segmentLoaders[r], a = n.requestOptions, o = n.master.mediaGroups, u = n.mediaTypes[r], l = u.groups, c = u.tracks, m = u.logger_, g = n.masterPlaylistLoader, _ = Qi(g.master);
    (!o[r] || Object.keys(o[r]).length === 0) && (o[r] = {
      main: {
        default: {
          default: !0
        }
      }
    }, _ && (o[r].main.default.playlists = g.master.playlists));
    for (var C in o[r]) {
      l[C] || (l[C] = []);
      for (var w in o[r][C]) {
        var E = o[r][C][w], M = void 0;
        if (_ ? (m("AUDIO group '" + C + "' label '" + w + "' is a master playlist"), E.isMasterPlaylist = !0, M = null) : e === "vhs-json" && E.playlists ? M = new $r(E.playlists[0], i, a) : E.resolvedUri ? M = new $r(E.resolvedUri, i, a) : E.playlists && e === "dash" ? M = new Us(E.playlists[0], i, a, g) : M = null, E = V.mergeOptions({
          id: w,
          playlistLoader: M
        }, E), $l[r](r, E.playlistLoader, n), l[C].push(E), typeof c[w] > "u") {
          var B = new V.AudioTrack({
            id: w,
            kind: cy(E),
            enabled: !1,
            language: E.language,
            default: E.default,
            label: w
          });
          c[w] = B;
        }
      }
    }
    t.on("error", oa[r](r, n));
  },
  /**
   * Setup PlaylistLoaders and TextTracks for the subtitle groups
   *
   * @param {string} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function initialize.SUBTITLES
   */
  SUBTITLES: function(r, n) {
    var i = n.tech, e = n.vhs, t = n.sourceType, a = n.segmentLoaders[r], o = n.requestOptions, u = n.master.mediaGroups, l = n.mediaTypes[r], c = l.groups, m = l.tracks, g = n.masterPlaylistLoader;
    for (var _ in u[r]) {
      c[_] || (c[_] = []);
      for (var C in u[r][_])
        if (!u[r][_][C].forced) {
          var w = u[r][_][C], E = void 0;
          if (t === "hls")
            E = new $r(w.resolvedUri, e, o);
          else if (t === "dash") {
            var M = w.playlists.filter(function(z) {
              return z.excludeUntil !== 1 / 0;
            });
            if (!M.length)
              return;
            E = new Us(w.playlists[0], e, o, g);
          } else t === "vhs-json" && (E = new $r(
            // if the vhs-json object included the media playlist, use the media playlist
            // as provided, otherwise use the resolved URI to load the playlist
            w.playlists ? w.playlists[0] : w.resolvedUri,
            e,
            o
          ));
          if (w = V.mergeOptions({
            id: C,
            playlistLoader: E
          }, w), $l[r](r, w.playlistLoader, n), c[_].push(w), typeof m[C] > "u") {
            var B = i.addRemoteTextTrack({
              id: C,
              kind: "subtitles",
              default: w.default && w.autoselect,
              language: w.language,
              label: C
            }, !1).track;
            m[C] = B;
          }
        }
    }
    a.on("error", oa[r](r, n));
  },
  /**
   * Setup TextTracks for the closed-caption groups
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function initialize['CLOSED-CAPTIONS']
   */
  "CLOSED-CAPTIONS": function(r, n) {
    var i = n.tech, e = n.master.mediaGroups, t = n.mediaTypes[r], a = t.groups, o = t.tracks;
    for (var u in e[r]) {
      a[u] || (a[u] = []);
      for (var l in e[r][u]) {
        var c = e[r][u][l];
        if (/^(?:CC|SERVICE)/.test(c.instreamId)) {
          var m = i.options_.vhs && i.options_.vhs.captionServices || {}, g = {
            label: l,
            language: c.language,
            instreamId: c.instreamId,
            default: c.default && c.autoselect
          };
          if (m[g.instreamId] && (g = V.mergeOptions(g, m[g.instreamId])), g.default === void 0 && delete g.default, a[u].push(V.mergeOptions({
            id: l
          }, c)), typeof o[l] > "u") {
            var _ = i.addRemoteTextTrack({
              id: g.instreamId,
              kind: "captions",
              default: g.default,
              language: g.language,
              label: g.label
            }, !1).track;
            o[l] = _;
          }
        }
      }
    }
  }
}, gy = function s(r, n) {
  for (var i = 0; i < r.length; i++)
    if (Po(n, r[i]) || r[i].playlists && s(r[i].playlists, n))
      return !0;
  return !1;
}, vy = function(r, n) {
  return function(i) {
    var e = n.masterPlaylistLoader, t = n.mediaTypes[r].groups, a = e.media();
    if (!a)
      return null;
    var o = null;
    a.attributes[r] && (o = t[a.attributes[r]]);
    var u = Object.keys(t);
    if (!o)
      if (r === "AUDIO" && u.length > 1 && Qi(n.master))
        for (var l = 0; l < u.length; l++) {
          var c = t[u[l]];
          if (gy(c, a)) {
            o = c;
            break;
          }
        }
      else t.main ? o = t.main : u.length === 1 && (o = t[u[0]]);
    return typeof i > "u" ? o : i === null || !o ? null : o.filter(function(m) {
      return m.id === i.id;
    })[0] || null;
  };
}, yy = {
  /**
   * Returns a function used to get the active track of type provided
   *
   * @param {string} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Function that returns the active media track for the provided type. Returns
   *         null if no track is active
   * @function activeTrack.AUDIO
   */
  AUDIO: function(r, n) {
    return function() {
      var i = n.mediaTypes[r].tracks;
      for (var e in i)
        if (i[e].enabled)
          return i[e];
      return null;
    };
  },
  /**
   * Returns a function used to get the active track of type provided
   *
   * @param {string} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Function that returns the active media track for the provided type. Returns
   *         null if no track is active
   * @function activeTrack.SUBTITLES
   */
  SUBTITLES: function(r, n) {
    return function() {
      var i = n.mediaTypes[r].tracks;
      for (var e in i)
        if (i[e].mode === "showing" || i[e].mode === "hidden")
          return i[e];
      return null;
    };
  }
}, _y = function(r, n) {
  var i = n.mediaTypes;
  return function() {
    var e = i[r].activeTrack();
    return e ? i[r].activeGroup(e) : null;
  };
}, Ty = function(r) {
  ["AUDIO", "SUBTITLES", "CLOSED-CAPTIONS"].forEach(function(C) {
    my[C](C, r);
  });
  var n = r.mediaTypes, i = r.masterPlaylistLoader, e = r.tech, t = r.vhs, a = r.segmentLoaders, o = a.AUDIO, u = a.main;
  ["AUDIO", "SUBTITLES"].forEach(function(C) {
    n[C].activeGroup = vy(C, r), n[C].activeTrack = yy[C](C, r), n[C].onGroupChanged = fy(C, r), n[C].onGroupChanging = hy(C, r), n[C].onTrackChanged = py(C, r), n[C].getActiveGroup = _y(C, r);
  });
  var l = n.AUDIO.activeGroup();
  if (l) {
    var c = (l.filter(function(C) {
      return C.default;
    })[0] || l[0]).id;
    n.AUDIO.tracks[c].enabled = !0, n.AUDIO.onGroupChanged(), n.AUDIO.onTrackChanged();
    var m = n.AUDIO.getActiveGroup();
    m.playlistLoader ? (u.setAudio(!1), o.setAudio(!0)) : u.setAudio(!0);
  }
  i.on("mediachange", function() {
    ["AUDIO", "SUBTITLES"].forEach(function(C) {
      return n[C].onGroupChanged();
    });
  }), i.on("mediachanging", function() {
    ["AUDIO", "SUBTITLES"].forEach(function(C) {
      return n[C].onGroupChanging();
    });
  });
  var g = function() {
    n.AUDIO.onTrackChanged(), e.trigger({
      type: "usage",
      name: "vhs-audio-change"
    }), e.trigger({
      type: "usage",
      name: "hls-audio-change"
    });
  };
  e.audioTracks().addEventListener("change", g), e.remoteTextTracks().addEventListener("change", n.SUBTITLES.onTrackChanged), t.on("dispose", function() {
    e.audioTracks().removeEventListener("change", g), e.remoteTextTracks().removeEventListener("change", n.SUBTITLES.onTrackChanged);
  }), e.clearTracks("audio");
  for (var _ in n.AUDIO.tracks)
    e.audioTracks().addTrack(n.AUDIO.tracks[_]);
}, by = function() {
  var r = {};
  return ["AUDIO", "SUBTITLES", "CLOSED-CAPTIONS"].forEach(function(n) {
    r[n] = {
      groups: {},
      tracks: {},
      activePlaylistLoader: null,
      activeGroup: Zt,
      activeTrack: Zt,
      getActiveGroup: Zt,
      onGroupChanged: Zt,
      onTrackChanged: Zt,
      lastTrack_: null,
      logger_: Ft("MediaGroups[" + n + "]")
    };
  }), r;
}, xy = 120, Yt, Sy = ["mediaRequests", "mediaRequestsAborted", "mediaRequestsTimedout", "mediaRequestsErrored", "mediaTransferDuration", "mediaBytesTransferred", "mediaAppends"], Ey = function(r) {
  return this.audioSegmentLoader_[r] + this.mainSegmentLoader_[r];
}, Cy = function(r) {
  var n = r.currentPlaylist, i = r.buffered, e = r.currentTime, t = r.nextPlaylist, a = r.bufferLowWaterLine, o = r.bufferHighWaterLine, u = r.duration, l = r.experimentalBufferBasedABR, c = r.log;
  if (!t)
    return V.log.warn("We received no playlist to switch to. Please check your stream."), !1;
  var m = "allowing switch " + (n && n.id || "null") + " -> " + t.id;
  if (!n)
    return c(m + " as current playlist is not set"), !0;
  if (t.id === n.id)
    return !1;
  var g = !!Kr(i, e).length;
  if (!n.endList)
    return !g && typeof n.partTargetDuration == "number" ? (c("not " + m + " as current playlist is live llhls, but currentTime isn't in buffered."), !1) : (c(m + " as current playlist is live"), !0);
  var _ = Do(i, e), C = l ? Qe.EXPERIMENTAL_MAX_BUFFER_LOW_WATER_LINE : Qe.MAX_BUFFER_LOW_WATER_LINE;
  if (u < C)
    return c(m + " as duration < max low water line (" + u + " < " + C + ")"), !0;
  var w = t.attributes.BANDWIDTH, E = n.attributes.BANDWIDTH;
  if (w < E && (!l || _ < o)) {
    var M = m + " as next bandwidth < current bandwidth (" + w + " < " + E + ")";
    return l && (M += " and forwardBuffer < bufferHighWaterLine (" + _ + " < " + o + ")"), c(M), !0;
  }
  if ((!l || w > E) && _ >= a) {
    var B = m + " as forwardBuffer >= bufferLowWaterLine (" + _ + " >= " + a + ")";
    return l && (B += " and next bandwidth > current bandwidth (" + w + " > " + E + ")"), c(B), !0;
  }
  return c("not " + m + " as no switching criteria met"), !1;
}, Ay = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i) {
    var e;
    e = s.call(this) || this;
    var t = i.src, a = i.handleManifestRedirects, o = i.withCredentials, u = i.tech, l = i.bandwidth, c = i.externVhs, m = i.useCueTags, g = i.blacklistDuration, _ = i.enableLowInitialPlaylist, C = i.sourceType, w = i.cacheEncryptionKeys, E = i.experimentalBufferBasedABR, M = i.experimentalLeastPixelDiffSelector, B = i.captionServices;
    if (!t)
      throw new Error("A non-empty playlist URL or JSON manifest string is required");
    var z = i.maxPlaylistRetries;
    (z === null || typeof z > "u") && (z = 1 / 0), Yt = c, e.experimentalBufferBasedABR = !!E, e.experimentalLeastPixelDiffSelector = !!M, e.withCredentials = o, e.tech_ = u, e.vhs_ = u.vhs, e.sourceType_ = C, e.useCueTags_ = m, e.blacklistDuration = g, e.maxPlaylistRetries = z, e.enableLowInitialPlaylist = _, e.useCueTags_ && (e.cueTagsTrack_ = e.tech_.addTextTrack("metadata", "ad-cues"), e.cueTagsTrack_.inBandMetadataTrackDispatchType = ""), e.requestOptions_ = {
      withCredentials: o,
      handleManifestRedirects: a,
      maxPlaylistRetries: z,
      timeout: null
    }, e.on("error", e.pauseLoading), e.mediaTypes_ = by(), e.mediaSource = new P.MediaSource(), e.handleDurationChange_ = e.handleDurationChange_.bind(ye(e)), e.handleSourceOpen_ = e.handleSourceOpen_.bind(ye(e)), e.handleSourceEnded_ = e.handleSourceEnded_.bind(ye(e)), e.mediaSource.addEventListener("durationchange", e.handleDurationChange_), e.mediaSource.addEventListener("sourceopen", e.handleSourceOpen_), e.mediaSource.addEventListener("sourceended", e.handleSourceEnded_), e.seekable_ = V.createTimeRanges(), e.hasPlayed_ = !1, e.syncController_ = new oy(i), e.segmentMetadataTrack_ = u.addRemoteTextTrack({
      kind: "metadata",
      label: "segment-metadata"
    }, !1).track, e.decrypter_ = new dy(), e.sourceUpdater_ = new cf(e.mediaSource), e.inbandTextTracks_ = {}, e.timelineChangeController_ = new uy();
    var W = {
      vhs: e.vhs_,
      parse708captions: i.parse708captions,
      useDtsForTimestampOffset: i.useDtsForTimestampOffset,
      captionServices: B,
      mediaSource: e.mediaSource,
      currentTime: e.tech_.currentTime.bind(e.tech_),
      seekable: function() {
        return e.seekable();
      },
      seeking: function() {
        return e.tech_.seeking();
      },
      duration: function() {
        return e.duration();
      },
      hasPlayed: function() {
        return e.hasPlayed_;
      },
      goalBufferLength: function() {
        return e.goalBufferLength();
      },
      bandwidth: l,
      syncController: e.syncController_,
      decrypter: e.decrypter_,
      sourceType: e.sourceType_,
      inbandTextTracks: e.inbandTextTracks_,
      cacheEncryptionKeys: w,
      sourceUpdater: e.sourceUpdater_,
      timelineChangeController: e.timelineChangeController_,
      experimentalExactManifestTimings: i.experimentalExactManifestTimings
    };
    e.masterPlaylistLoader_ = e.sourceType_ === "dash" ? new Us(t, e.vhs_, e.requestOptions_) : new $r(t, e.vhs_, e.requestOptions_), e.setupMasterPlaylistLoaderListeners_(), e.mainSegmentLoader_ = new qs(V.mergeOptions(W, {
      segmentMetadataTrack: e.segmentMetadataTrack_,
      loaderType: "main"
    }), i), e.audioSegmentLoader_ = new qs(V.mergeOptions(W, {
      loaderType: "audio"
    }), i), e.subtitleSegmentLoader_ = new iy(V.mergeOptions(W, {
      loaderType: "vtt",
      featuresNativeTextTracks: e.tech_.featuresNativeTextTracks,
      loadVttJs: function() {
        return new Promise(function(N, q) {
          function T() {
            u.off("vttjserror", b), N();
          }
          function b() {
            u.off("vttjsloaded", T), q();
          }
          u.one("vttjsloaded", T), u.one("vttjserror", b), u.addWebVttScript_();
        });
      }
    }), i), e.setupSegmentLoaderListeners_(), e.experimentalBufferBasedABR && (e.masterPlaylistLoader_.one("loadedplaylist", function() {
      return e.startABRTimer_();
    }), e.tech_.on("pause", function() {
      return e.stopABRTimer_();
    }), e.tech_.on("play", function() {
      return e.startABRTimer_();
    })), Sy.forEach(function($) {
      e[$ + "_"] = Ey.bind(ye(e), $);
    }), e.logger_ = Ft("MPC"), e.triggeredFmp4Usage = !1, e.tech_.preload() === "none" ? (e.loadOnPlay_ = function() {
      e.loadOnPlay_ = null, e.masterPlaylistLoader_.load();
    }, e.tech_.one("play", e.loadOnPlay_)) : e.masterPlaylistLoader_.load(), e.timeToLoadedData__ = -1, e.mainAppendsToLoadedData__ = -1, e.audioAppendsToLoadedData__ = -1;
    var H = e.tech_.preload() === "none" ? "play" : "loadstart";
    return e.tech_.one(H, function() {
      var $ = Date.now();
      e.tech_.one("loadeddata", function() {
        e.timeToLoadedData__ = Date.now() - $, e.mainAppendsToLoadedData__ = e.mainSegmentLoader_.mediaAppends, e.audioAppendsToLoadedData__ = e.audioSegmentLoader_.mediaAppends;
      });
    }), e;
  }
  var n = r.prototype;
  return n.mainAppendsToLoadedData_ = function() {
    return this.mainAppendsToLoadedData__;
  }, n.audioAppendsToLoadedData_ = function() {
    return this.audioAppendsToLoadedData__;
  }, n.appendsToLoadedData_ = function() {
    var e = this.mainAppendsToLoadedData_(), t = this.audioAppendsToLoadedData_();
    return e === -1 || t === -1 ? -1 : e + t;
  }, n.timeToLoadedData_ = function() {
    return this.timeToLoadedData__;
  }, n.checkABR_ = function(e) {
    e === void 0 && (e = "abr");
    var t = this.selectPlaylist();
    t && this.shouldSwitchToMedia_(t) && this.switchMedia_(t, e);
  }, n.switchMedia_ = function(e, t, a) {
    var o = this.media(), u = o && (o.id || o.uri), l = e.id || e.uri;
    u && u !== l && (this.logger_("switch media " + u + " -> " + l + " from " + t), this.tech_.trigger({
      type: "usage",
      name: "vhs-rendition-change-" + t
    })), this.masterPlaylistLoader_.media(e, a);
  }, n.startABRTimer_ = function() {
    var e = this;
    this.stopABRTimer_(), this.abrTimer_ = P.setInterval(function() {
      return e.checkABR_();
    }, 250);
  }, n.stopABRTimer_ = function() {
    this.tech_.scrubbing && this.tech_.scrubbing() || (P.clearInterval(this.abrTimer_), this.abrTimer_ = null);
  }, n.getAudioTrackPlaylists_ = function() {
    var e = this.master(), t = e && e.playlists || [];
    if (!e || !e.mediaGroups || !e.mediaGroups.AUDIO)
      return t;
    var a = e.mediaGroups.AUDIO, o = Object.keys(a), u;
    if (Object.keys(this.mediaTypes_.AUDIO.groups).length)
      u = this.mediaTypes_.AUDIO.activeTrack();
    else {
      var l = a.main || o.length && a[o[0]];
      for (var c in l)
        if (l[c].default) {
          u = {
            label: c
          };
          break;
        }
    }
    if (!u)
      return t;
    var m = [];
    for (var g in a)
      if (a[g][u.label]) {
        var _ = a[g][u.label];
        if (_.playlists && _.playlists.length)
          m.push.apply(m, _.playlists);
        else if (_.uri)
          m.push(_);
        else if (e.playlists.length)
          for (var C = 0; C < e.playlists.length; C++) {
            var w = e.playlists[C];
            w.attributes && w.attributes.AUDIO && w.attributes.AUDIO === g && m.push(w);
          }
      }
    return m.length ? m : t;
  }, n.setupMasterPlaylistLoaderListeners_ = function() {
    var e = this;
    this.masterPlaylistLoader_.on("loadedmetadata", function() {
      var t = e.masterPlaylistLoader_.media(), a = t.targetDuration * 1.5 * 1e3;
      Fs(e.masterPlaylistLoader_.master, e.masterPlaylistLoader_.media()) ? e.requestOptions_.timeout = 0 : e.requestOptions_.timeout = a, t.endList && e.tech_.preload() !== "none" && (e.mainSegmentLoader_.playlist(t, e.requestOptions_), e.mainSegmentLoader_.load()), Ty({
        sourceType: e.sourceType_,
        segmentLoaders: {
          AUDIO: e.audioSegmentLoader_,
          SUBTITLES: e.subtitleSegmentLoader_,
          main: e.mainSegmentLoader_
        },
        tech: e.tech_,
        requestOptions: e.requestOptions_,
        masterPlaylistLoader: e.masterPlaylistLoader_,
        vhs: e.vhs_,
        master: e.master(),
        mediaTypes: e.mediaTypes_,
        blacklistCurrentPlaylist: e.blacklistCurrentPlaylist.bind(e)
      }), e.triggerPresenceUsage_(e.master(), t), e.setupFirstPlay(), !e.mediaTypes_.AUDIO.activePlaylistLoader || e.mediaTypes_.AUDIO.activePlaylistLoader.media() ? e.trigger("selectedinitialmedia") : e.mediaTypes_.AUDIO.activePlaylistLoader.one("loadedmetadata", function() {
        e.trigger("selectedinitialmedia");
      });
    }), this.masterPlaylistLoader_.on("loadedplaylist", function() {
      e.loadOnPlay_ && e.tech_.off("play", e.loadOnPlay_);
      var t = e.masterPlaylistLoader_.media();
      if (!t) {
        e.excludeUnsupportedVariants_();
        var a;
        if (e.enableLowInitialPlaylist && (a = e.selectInitialPlaylist()), a || (a = e.selectPlaylist()), !a || !e.shouldSwitchToMedia_(a))
          return;
        e.initialMedia_ = a, e.switchMedia_(e.initialMedia_, "initial");
        var o = e.sourceType_ === "vhs-json" && e.initialMedia_.segments;
        if (!o)
          return;
        t = e.initialMedia_;
      }
      e.handleUpdatedMediaPlaylist(t);
    }), this.masterPlaylistLoader_.on("error", function() {
      e.blacklistCurrentPlaylist(e.masterPlaylistLoader_.error);
    }), this.masterPlaylistLoader_.on("mediachanging", function() {
      e.mainSegmentLoader_.abort(), e.mainSegmentLoader_.pause();
    }), this.masterPlaylistLoader_.on("mediachange", function() {
      var t = e.masterPlaylistLoader_.media(), a = t.targetDuration * 1.5 * 1e3;
      Fs(e.masterPlaylistLoader_.master, e.masterPlaylistLoader_.media()) ? e.requestOptions_.timeout = 0 : e.requestOptions_.timeout = a, e.masterPlaylistLoader_.load(), e.mainSegmentLoader_.playlist(t, e.requestOptions_), e.mainSegmentLoader_.load(), e.tech_.trigger({
        type: "mediachange",
        bubbles: !0
      });
    }), this.masterPlaylistLoader_.on("playlistunchanged", function() {
      var t = e.masterPlaylistLoader_.media();
      if (t.lastExcludeReason_ !== "playlist-unchanged") {
        var a = e.stuckAtPlaylistEnd_(t);
        a && (e.blacklistCurrentPlaylist({
          message: "Playlist no longer updating.",
          reason: "playlist-unchanged"
        }), e.tech_.trigger("playliststuck"));
      }
    }), this.masterPlaylistLoader_.on("renditiondisabled", function() {
      e.tech_.trigger({
        type: "usage",
        name: "vhs-rendition-disabled"
      }), e.tech_.trigger({
        type: "usage",
        name: "hls-rendition-disabled"
      });
    }), this.masterPlaylistLoader_.on("renditionenabled", function() {
      e.tech_.trigger({
        type: "usage",
        name: "vhs-rendition-enabled"
      }), e.tech_.trigger({
        type: "usage",
        name: "hls-rendition-enabled"
      });
    });
  }, n.handleUpdatedMediaPlaylist = function(e) {
    this.useCueTags_ && this.updateAdCues_(e), this.mainSegmentLoader_.playlist(e, this.requestOptions_), this.updateDuration(!e.endList), this.tech_.paused() || (this.mainSegmentLoader_.load(), this.audioSegmentLoader_ && this.audioSegmentLoader_.load());
  }, n.triggerPresenceUsage_ = function(e, t) {
    var a = e.mediaGroups || {}, o = !0, u = Object.keys(a.AUDIO);
    for (var l in a.AUDIO)
      for (var c in a.AUDIO[l]) {
        var m = a.AUDIO[l][c];
        m.uri || (o = !1);
      }
    o && (this.tech_.trigger({
      type: "usage",
      name: "vhs-demuxed"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-demuxed"
    })), Object.keys(a.SUBTITLES).length && (this.tech_.trigger({
      type: "usage",
      name: "vhs-webvtt"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-webvtt"
    })), Yt.Playlist.isAes(t) && (this.tech_.trigger({
      type: "usage",
      name: "vhs-aes"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-aes"
    })), u.length && Object.keys(a.AUDIO[u[0]]).length > 1 && (this.tech_.trigger({
      type: "usage",
      name: "vhs-alternate-audio"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-alternate-audio"
    })), this.useCueTags_ && (this.tech_.trigger({
      type: "usage",
      name: "vhs-playlist-cue-tags"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-playlist-cue-tags"
    }));
  }, n.shouldSwitchToMedia_ = function(e) {
    var t = this.masterPlaylistLoader_.media() || this.masterPlaylistLoader_.pendingMedia_, a = this.tech_.currentTime(), o = this.bufferLowWaterLine(), u = this.bufferHighWaterLine(), l = this.tech_.buffered();
    return Cy({
      buffered: l,
      currentTime: a,
      currentPlaylist: t,
      nextPlaylist: e,
      bufferLowWaterLine: o,
      bufferHighWaterLine: u,
      duration: this.duration(),
      experimentalBufferBasedABR: this.experimentalBufferBasedABR,
      log: this.logger_
    });
  }, n.setupSegmentLoaderListeners_ = function() {
    var e = this;
    this.mainSegmentLoader_.on("bandwidthupdate", function() {
      e.checkABR_("bandwidthupdate"), e.tech_.trigger("bandwidthupdate");
    }), this.mainSegmentLoader_.on("timeout", function() {
      e.experimentalBufferBasedABR && e.mainSegmentLoader_.load();
    }), this.experimentalBufferBasedABR || this.mainSegmentLoader_.on("progress", function() {
      e.trigger("progress");
    }), this.mainSegmentLoader_.on("error", function() {
      e.blacklistCurrentPlaylist(e.mainSegmentLoader_.error());
    }), this.mainSegmentLoader_.on("appenderror", function() {
      e.error = e.mainSegmentLoader_.error_, e.trigger("error");
    }), this.mainSegmentLoader_.on("syncinfoupdate", function() {
      e.onSyncInfoUpdate_();
    }), this.mainSegmentLoader_.on("timestampoffset", function() {
      e.tech_.trigger({
        type: "usage",
        name: "vhs-timestamp-offset"
      }), e.tech_.trigger({
        type: "usage",
        name: "hls-timestamp-offset"
      });
    }), this.audioSegmentLoader_.on("syncinfoupdate", function() {
      e.onSyncInfoUpdate_();
    }), this.audioSegmentLoader_.on("appenderror", function() {
      e.error = e.audioSegmentLoader_.error_, e.trigger("error");
    }), this.mainSegmentLoader_.on("ended", function() {
      e.logger_("main segment loader ended"), e.onEndOfStream();
    }), this.mainSegmentLoader_.on("earlyabort", function(a) {
      e.experimentalBufferBasedABR || (e.delegateLoaders_("all", ["abort"]), e.blacklistCurrentPlaylist({
        message: "Aborted early because there isn't enough bandwidth to complete the request without rebuffering."
      }, xy));
    });
    var t = function() {
      if (!e.sourceUpdater_.hasCreatedSourceBuffers())
        return e.tryToCreateSourceBuffers_();
      var o = e.getCodecsOrExclude_();
      o && e.sourceUpdater_.addOrChangeSourceBuffers(o);
    };
    this.mainSegmentLoader_.on("trackinfo", t), this.audioSegmentLoader_.on("trackinfo", t), this.mainSegmentLoader_.on("fmp4", function() {
      e.triggeredFmp4Usage || (e.tech_.trigger({
        type: "usage",
        name: "vhs-fmp4"
      }), e.tech_.trigger({
        type: "usage",
        name: "hls-fmp4"
      }), e.triggeredFmp4Usage = !0);
    }), this.audioSegmentLoader_.on("fmp4", function() {
      e.triggeredFmp4Usage || (e.tech_.trigger({
        type: "usage",
        name: "vhs-fmp4"
      }), e.tech_.trigger({
        type: "usage",
        name: "hls-fmp4"
      }), e.triggeredFmp4Usage = !0);
    }), this.audioSegmentLoader_.on("ended", function() {
      e.logger_("audioSegmentLoader ended"), e.onEndOfStream();
    });
  }, n.mediaSecondsLoaded_ = function() {
    return Math.max(this.audioSegmentLoader_.mediaSecondsLoaded + this.mainSegmentLoader_.mediaSecondsLoaded);
  }, n.load = function() {
    this.mainSegmentLoader_.load(), this.mediaTypes_.AUDIO.activePlaylistLoader && this.audioSegmentLoader_.load(), this.mediaTypes_.SUBTITLES.activePlaylistLoader && this.subtitleSegmentLoader_.load();
  }, n.smoothQualityChange_ = function(e) {
    e === void 0 && (e = this.selectPlaylist()), this.fastQualityChange_(e);
  }, n.fastQualityChange_ = function(e) {
    var t = this;
    if (e === void 0 && (e = this.selectPlaylist()), e === this.masterPlaylistLoader_.media()) {
      this.logger_("skipping fastQualityChange because new media is same as old");
      return;
    }
    this.switchMedia_(e, "fast-quality"), this.mainSegmentLoader_.resetEverything(function() {
      V.browser.IE_VERSION || V.browser.IS_EDGE ? t.tech_.setCurrentTime(t.tech_.currentTime() + 0.04) : t.tech_.setCurrentTime(t.tech_.currentTime());
    });
  }, n.play = function() {
    if (!this.setupFirstPlay()) {
      this.tech_.ended() && this.tech_.setCurrentTime(0), this.hasPlayed_ && this.load();
      var e = this.tech_.seekable();
      if (this.tech_.duration() === 1 / 0 && this.tech_.currentTime() < e.start(0))
        return this.tech_.setCurrentTime(e.end(e.length - 1));
    }
  }, n.setupFirstPlay = function() {
    var e = this, t = this.masterPlaylistLoader_.media();
    if (!t || this.tech_.paused() || this.hasPlayed_)
      return !1;
    if (!t.endList) {
      var a = this.seekable();
      if (!a.length)
        return !1;
      if (V.browser.IE_VERSION && this.tech_.readyState() === 0)
        return this.tech_.one("loadedmetadata", function() {
          e.trigger("firstplay"), e.tech_.setCurrentTime(a.end(0)), e.hasPlayed_ = !0;
        }), !1;
      this.trigger("firstplay"), this.tech_.setCurrentTime(a.end(0));
    }
    return this.hasPlayed_ = !0, this.load(), !0;
  }, n.handleSourceOpen_ = function() {
    if (this.tryToCreateSourceBuffers_(), this.tech_.autoplay()) {
      var e = this.tech_.play();
      typeof e < "u" && typeof e.then == "function" && e.then(null, function(t) {
      });
    }
    this.trigger("sourceopen");
  }, n.handleSourceEnded_ = function() {
    if (this.inbandTextTracks_.metadataTrack_) {
      var e = this.inbandTextTracks_.metadataTrack_.cues;
      if (!(!e || !e.length)) {
        var t = this.duration();
        e[e.length - 1].endTime = isNaN(t) || Math.abs(t) === 1 / 0 ? Number.MAX_VALUE : t;
      }
    }
  }, n.handleDurationChange_ = function() {
    this.tech_.trigger("durationchange");
  }, n.onEndOfStream = function() {
    var e = this.mainSegmentLoader_.ended_;
    if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
      var t = this.mainSegmentLoader_.getCurrentMediaInfo_();
      !t || t.hasVideo ? e = e && this.audioSegmentLoader_.ended_ : e = this.audioSegmentLoader_.ended_;
    }
    e && (this.stopABRTimer_(), this.sourceUpdater_.endOfStream());
  }, n.stuckAtPlaylistEnd_ = function(e) {
    var t = this.seekable();
    if (!t.length)
      return !1;
    var a = this.syncController_.getExpiredTime(e, this.duration());
    if (a === null)
      return !1;
    var o = Yt.Playlist.playlistEnd(e, a), u = this.tech_.currentTime(), l = this.tech_.buffered();
    if (!l.length)
      return o - u <= Ht;
    var c = l.end(l.length - 1);
    return c - u <= Ht && o - c <= Ht;
  }, n.blacklistCurrentPlaylist = function(e, t) {
    e === void 0 && (e = {});
    var a = e.playlist || this.masterPlaylistLoader_.media();
    if (t = t || e.blacklistDuration || this.blacklistDuration, !a) {
      this.error = e, this.mediaSource.readyState !== "open" ? this.trigger("error") : this.sourceUpdater_.endOfStream("network");
      return;
    }
    a.playlistErrors_++;
    var o = this.masterPlaylistLoader_.master.playlists, u = o.filter(Ea), l = u.length === 1 && u[0] === a;
    if (o.length === 1 && t !== 1 / 0)
      return V.log.warn("Problem encountered with playlist " + a.id + ". Trying again since it is the only playlist."), this.tech_.trigger("retryplaylist"), this.masterPlaylistLoader_.load(l);
    if (l) {
      var c = !1;
      o.forEach(function(M) {
        if (M !== a) {
          var B = M.excludeUntil;
          typeof B < "u" && B !== 1 / 0 && (c = !0, delete M.excludeUntil);
        }
      }), c && (V.log.warn("Removing other playlists from the exclusion list because the last rendition is about to be excluded."), this.tech_.trigger("retryplaylist"));
    }
    var m;
    a.playlistErrors_ > this.maxPlaylistRetries ? m = 1 / 0 : m = Date.now() + t * 1e3, a.excludeUntil = m, e.reason && (a.lastExcludeReason_ = e.reason), this.tech_.trigger("blacklistplaylist"), this.tech_.trigger({
      type: "usage",
      name: "vhs-rendition-blacklisted"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-rendition-blacklisted"
    });
    var g = this.selectPlaylist();
    if (!g) {
      this.error = "Playback cannot continue. No available working or supported playlists.", this.trigger("error");
      return;
    }
    var _ = e.internal ? this.logger_ : V.log.warn, C = e.message ? " " + e.message : "";
    _((e.internal ? "Internal problem" : "Problem") + " encountered with playlist " + a.id + "." + (C + " Switching to playlist " + g.id + ".")), g.attributes.AUDIO !== a.attributes.AUDIO && this.delegateLoaders_("audio", ["abort", "pause"]), g.attributes.SUBTITLES !== a.attributes.SUBTITLES && this.delegateLoaders_("subtitle", ["abort", "pause"]), this.delegateLoaders_("main", ["abort", "pause"]);
    var w = g.targetDuration / 2 * 1e3 || 5 * 1e3, E = typeof g.lastRequest == "number" && Date.now() - g.lastRequest <= w;
    return this.switchMedia_(g, "exclude", l || E);
  }, n.pauseLoading = function() {
    this.delegateLoaders_("all", ["abort", "pause"]), this.stopABRTimer_();
  }, n.delegateLoaders_ = function(e, t) {
    var a = this, o = [], u = e === "all";
    (u || e === "main") && o.push(this.masterPlaylistLoader_);
    var l = [];
    (u || e === "audio") && l.push("AUDIO"), (u || e === "subtitle") && (l.push("CLOSED-CAPTIONS"), l.push("SUBTITLES")), l.forEach(function(c) {
      var m = a.mediaTypes_[c] && a.mediaTypes_[c].activePlaylistLoader;
      m && o.push(m);
    }), ["main", "audio", "subtitle"].forEach(function(c) {
      var m = a[c + "SegmentLoader_"];
      m && (e === c || e === "all") && o.push(m);
    }), o.forEach(function(c) {
      return t.forEach(function(m) {
        typeof c[m] == "function" && c[m]();
      });
    });
  }, n.setCurrentTime = function(e) {
    var t = Kr(this.tech_.buffered(), e);
    if (!(this.masterPlaylistLoader_ && this.masterPlaylistLoader_.media()) || !this.masterPlaylistLoader_.media().segments)
      return 0;
    if (t && t.length)
      return e;
    this.mainSegmentLoader_.resetEverything(), this.mainSegmentLoader_.abort(), this.mediaTypes_.AUDIO.activePlaylistLoader && (this.audioSegmentLoader_.resetEverything(), this.audioSegmentLoader_.abort()), this.mediaTypes_.SUBTITLES.activePlaylistLoader && (this.subtitleSegmentLoader_.resetEverything(), this.subtitleSegmentLoader_.abort()), this.load();
  }, n.duration = function() {
    if (!this.masterPlaylistLoader_)
      return 0;
    var e = this.masterPlaylistLoader_.media();
    return e ? e.endList ? this.mediaSource ? this.mediaSource.duration : Yt.Playlist.duration(e) : 1 / 0 : 0;
  }, n.seekable = function() {
    return this.seekable_;
  }, n.onSyncInfoUpdate_ = function() {
    var e;
    if (this.masterPlaylistLoader_) {
      var t = this.masterPlaylistLoader_.media();
      if (t) {
        var a = this.syncController_.getExpiredTime(t, this.duration());
        if (a !== null) {
          var o = this.masterPlaylistLoader_.master, u = Yt.Playlist.seekable(t, a, Yt.Playlist.liveEdgeDelay(o, t));
          if (u.length !== 0 && !(this.mediaTypes_.AUDIO.activePlaylistLoader && (t = this.mediaTypes_.AUDIO.activePlaylistLoader.media(), a = this.syncController_.getExpiredTime(t, this.duration()), a === null || (e = Yt.Playlist.seekable(t, a, Yt.Playlist.liveEdgeDelay(o, t)), e.length === 0)))) {
            var l, c;
            this.seekable_ && this.seekable_.length && (l = this.seekable_.end(0), c = this.seekable_.start(0)), e ? e.start(0) > u.end(0) || u.start(0) > e.end(0) ? this.seekable_ = u : this.seekable_ = V.createTimeRanges([[e.start(0) > u.start(0) ? e.start(0) : u.start(0), e.end(0) < u.end(0) ? e.end(0) : u.end(0)]]) : this.seekable_ = u, !(this.seekable_ && this.seekable_.length && this.seekable_.end(0) === l && this.seekable_.start(0) === c) && (this.logger_("seekable updated [" + Dc(this.seekable_) + "]"), this.tech_.trigger("seekablechanged"));
          }
        }
      }
    }
  }, n.updateDuration = function(e) {
    if (this.updateDuration_ && (this.mediaSource.removeEventListener("sourceopen", this.updateDuration_), this.updateDuration_ = null), this.mediaSource.readyState !== "open") {
      this.updateDuration_ = this.updateDuration.bind(this, e), this.mediaSource.addEventListener("sourceopen", this.updateDuration_);
      return;
    }
    if (e) {
      var t = this.seekable();
      if (!t.length)
        return;
      (isNaN(this.mediaSource.duration) || this.mediaSource.duration < t.end(t.length - 1)) && this.sourceUpdater_.setDuration(t.end(t.length - 1));
      return;
    }
    var a = this.tech_.buffered(), o = Yt.Playlist.duration(this.masterPlaylistLoader_.media());
    a.length > 0 && (o = Math.max(o, a.end(a.length - 1))), this.mediaSource.duration !== o && this.sourceUpdater_.setDuration(o);
  }, n.dispose = function() {
    var e = this;
    this.trigger("dispose"), this.decrypter_.terminate(), this.masterPlaylistLoader_.dispose(), this.mainSegmentLoader_.dispose(), this.loadOnPlay_ && this.tech_.off("play", this.loadOnPlay_), ["AUDIO", "SUBTITLES"].forEach(function(t) {
      var a = e.mediaTypes_[t].groups;
      for (var o in a)
        a[o].forEach(function(u) {
          u.playlistLoader && u.playlistLoader.dispose();
        });
    }), this.audioSegmentLoader_.dispose(), this.subtitleSegmentLoader_.dispose(), this.sourceUpdater_.dispose(), this.timelineChangeController_.dispose(), this.stopABRTimer_(), this.updateDuration_ && this.mediaSource.removeEventListener("sourceopen", this.updateDuration_), this.mediaSource.removeEventListener("durationchange", this.handleDurationChange_), this.mediaSource.removeEventListener("sourceopen", this.handleSourceOpen_), this.mediaSource.removeEventListener("sourceended", this.handleSourceEnded_), this.off();
  }, n.master = function() {
    return this.masterPlaylistLoader_.master;
  }, n.media = function() {
    return this.masterPlaylistLoader_.media() || this.initialMedia_;
  }, n.areMediaTypesKnown_ = function() {
    var e = !!this.mediaTypes_.AUDIO.activePlaylistLoader, t = !!this.mainSegmentLoader_.getCurrentMediaInfo_(), a = e ? !!this.audioSegmentLoader_.getCurrentMediaInfo_() : !0;
    return !(!t || !a);
  }, n.getCodecsOrExclude_ = function() {
    var e = this, t = {
      main: this.mainSegmentLoader_.getCurrentMediaInfo_() || {},
      audio: this.audioSegmentLoader_.getCurrentMediaInfo_() || {}
    }, a = this.mainSegmentLoader_.getPendingSegmentPlaylist() || this.media();
    t.video = t.main;
    var o = Mi(this.master(), a), u = {}, l = !!this.mediaTypes_.AUDIO.activePlaylistLoader;
    if (t.main.hasVideo && (u.video = o.video || t.main.videoCodec || vp), t.main.isMuxed && (u.video += "," + (o.audio || t.main.audioCodec || Nu)), (t.main.hasAudio && !t.main.isMuxed || t.audio.hasAudio || l) && (u.audio = o.audio || t.main.audioCodec || t.audio.audioCodec || Nu, t.audio.isFmp4 = t.main.hasAudio && !t.main.isMuxed ? t.main.isFmp4 : t.audio.isFmp4), !u.audio && !u.video) {
      this.blacklistCurrentPlaylist({
        playlist: a,
        message: "Could not determine codecs for playlist.",
        blacklistDuration: 1 / 0
      });
      return;
    }
    var c = function(M, B) {
      return M ? Mn(B) : Ka(B);
    }, m = {}, g;
    if (["video", "audio"].forEach(function(E) {
      if (u.hasOwnProperty(E) && !c(t[E].isFmp4, u[E])) {
        var M = t[E].isFmp4 ? "browser" : "muxer";
        m[M] = m[M] || [], m[M].push(u[E]), E === "audio" && (g = M);
      }
    }), l && g && a.attributes.AUDIO) {
      var _ = a.attributes.AUDIO;
      this.master().playlists.forEach(function(E) {
        var M = E.attributes && E.attributes.AUDIO;
        M === _ && E !== a && (E.excludeUntil = 1 / 0);
      }), this.logger_("excluding audio group " + _ + " as " + g + ' does not support codec(s): "' + u.audio + '"');
    }
    if (Object.keys(m).length) {
      var C = Object.keys(m).reduce(function(E, M) {
        return E && (E += ", "), E += M + ' does not support codec(s): "' + m[M].join(",") + '"', E;
      }, "") + ".";
      this.blacklistCurrentPlaylist({
        playlist: a,
        internal: !0,
        message: C,
        blacklistDuration: 1 / 0
      });
      return;
    }
    if (this.sourceUpdater_.hasCreatedSourceBuffers() && !this.sourceUpdater_.canChangeType()) {
      var w = [];
      if (["video", "audio"].forEach(function(E) {
        var M = (Vt(e.sourceUpdater_.codecs[E] || "")[0] || {}).type, B = (Vt(u[E] || "")[0] || {}).type;
        M && B && M.toLowerCase() !== B.toLowerCase() && w.push('"' + e.sourceUpdater_.codecs[E] + '" -> "' + u[E] + '"');
      }), w.length) {
        this.blacklistCurrentPlaylist({
          playlist: a,
          message: "Codec switching not supported: " + w.join(", ") + ".",
          blacklistDuration: 1 / 0,
          internal: !0
        });
        return;
      }
    }
    return u;
  }, n.tryToCreateSourceBuffers_ = function() {
    if (!(this.mediaSource.readyState !== "open" || this.sourceUpdater_.hasCreatedSourceBuffers()) && this.areMediaTypesKnown_()) {
      var e = this.getCodecsOrExclude_();
      if (e) {
        this.sourceUpdater_.createSourceBuffers(e);
        var t = [e.video, e.audio].filter(Boolean).join(",");
        this.excludeIncompatibleVariants_(t);
      }
    }
  }, n.excludeUnsupportedVariants_ = function() {
    var e = this, t = this.master().playlists, a = [];
    Object.keys(t).forEach(function(o) {
      var u = t[o];
      if (a.indexOf(u.id) === -1) {
        a.push(u.id);
        var l = Mi(e.master, u), c = [];
        l.audio && !Ka(l.audio) && !Mn(l.audio) && c.push("audio codec " + l.audio), l.video && !Ka(l.video) && !Mn(l.video) && c.push("video codec " + l.video), l.text && l.text === "stpp.ttml.im1t" && c.push("text codec " + l.text), c.length && (u.excludeUntil = 1 / 0, e.logger_("excluding " + u.id + " for unsupported: " + c.join(", ")));
      }
    });
  }, n.excludeIncompatibleVariants_ = function(e) {
    var t = this, a = [], o = this.master().playlists, u = na(Vt(e)), l = Nl(u), c = u.video && Vt(u.video)[0] || null, m = u.audio && Vt(u.audio)[0] || null;
    Object.keys(o).forEach(function(g) {
      var _ = o[g];
      if (!(a.indexOf(_.id) !== -1 || _.excludeUntil === 1 / 0)) {
        a.push(_.id);
        var C = [], w = Mi(t.masterPlaylistLoader_.master, _), E = Nl(w);
        if (!(!w.audio && !w.video)) {
          if (E !== l && C.push('codec count "' + E + '" !== "' + l + '"'), !t.sourceUpdater_.canChangeType()) {
            var M = w.video && Vt(w.video)[0] || null, B = w.audio && Vt(w.audio)[0] || null;
            M && c && M.type.toLowerCase() !== c.type.toLowerCase() && C.push('video codec "' + M.type + '" !== "' + c.type + '"'), B && m && B.type.toLowerCase() !== m.type.toLowerCase() && C.push('audio codec "' + B.type + '" !== "' + m.type + '"');
          }
          C.length && (_.excludeUntil = 1 / 0, t.logger_("blacklisting " + _.id + ": " + C.join(" && ")));
        }
      }
    });
  }, n.updateAdCues_ = function(e) {
    var t = 0, a = this.seekable();
    a.length && (t = a.start(0)), ay(e, this.cueTagsTrack_, t);
  }, n.goalBufferLength = function() {
    var e = this.tech_.currentTime(), t = Qe.GOAL_BUFFER_LENGTH, a = Qe.GOAL_BUFFER_LENGTH_RATE, o = Math.max(t, Qe.MAX_GOAL_BUFFER_LENGTH);
    return Math.min(t + e * a, o);
  }, n.bufferLowWaterLine = function() {
    var e = this.tech_.currentTime(), t = Qe.BUFFER_LOW_WATER_LINE, a = Qe.BUFFER_LOW_WATER_LINE_RATE, o = Math.max(t, Qe.MAX_BUFFER_LOW_WATER_LINE), u = Math.max(t, Qe.EXPERIMENTAL_MAX_BUFFER_LOW_WATER_LINE);
    return Math.min(t + e * a, this.experimentalBufferBasedABR ? u : o);
  }, n.bufferHighWaterLine = function() {
    return Qe.BUFFER_HIGH_WATER_LINE;
  }, r;
})(V.EventTarget), Dy = function(r, n, i) {
  return function(e) {
    var t = r.master.playlists[n], a = ko(t), o = Ea(t);
    return typeof e > "u" ? o : (e ? delete t.disabled : t.disabled = !0, e !== o && !a && (i(), e ? r.trigger("renditionenabled") : r.trigger("renditiondisabled")), e);
  };
}, wy = function(r, n, i) {
  var e = r.masterPlaylistController_, t = r.options_.smoothQualityChange, a = t ? "smooth" : "fast", o = e[a + "QualityChange_"].bind(e);
  if (n.attributes) {
    var u = n.attributes.RESOLUTION;
    this.width = u && u.width, this.height = u && u.height, this.bandwidth = n.attributes.BANDWIDTH, this.frameRate = n.attributes["FRAME-RATE"];
  }
  this.codecs = Mi(e.master(), n), this.playlist = n, this.id = i, this.enabled = Dy(r.playlists, n.id, o);
}, ky = function(r) {
  r.representations = function() {
    var n = r.masterPlaylistController_.master(), i = Qi(n) ? r.masterPlaylistController_.getAudioTrackPlaylists_() : n.playlists;
    return i ? i.filter(function(e) {
      return !ko(e);
    }).map(function(e, t) {
      return new wy(r, e, e.id);
    }) : [];
  };
}, Xl = ["seeking", "seeked", "pause", "playing", "error"], Py = /* @__PURE__ */ (function() {
  function s(n) {
    var i = this;
    this.masterPlaylistController_ = n.masterPlaylistController, this.tech_ = n.tech, this.seekable = n.seekable, this.allowSeeksWithinUnsafeLiveWindow = n.allowSeeksWithinUnsafeLiveWindow, this.liveRangeSafeTimeDelta = n.liveRangeSafeTimeDelta, this.media = n.media, this.consecutiveUpdates = 0, this.lastRecordedTime = null, this.timer_ = null, this.checkCurrentTimeTimeout_ = null, this.logger_ = Ft("PlaybackWatcher"), this.logger_("initialize");
    var e = function() {
      return i.monitorCurrentTime_();
    }, t = function() {
      return i.monitorCurrentTime_();
    }, a = function() {
      return i.techWaiting_();
    }, o = function() {
      return i.cancelTimer_();
    }, u = this.masterPlaylistController_, l = ["main", "subtitle", "audio"], c = {};
    l.forEach(function(g) {
      c[g] = {
        reset: function() {
          return i.resetSegmentDownloads_(g);
        },
        updateend: function() {
          return i.checkSegmentDownloads_(g);
        }
      }, u[g + "SegmentLoader_"].on("appendsdone", c[g].updateend), u[g + "SegmentLoader_"].on("playlistupdate", c[g].reset), i.tech_.on(["seeked", "seeking"], c[g].reset);
    });
    var m = function(_) {
      ["main", "audio"].forEach(function(C) {
        u[C + "SegmentLoader_"][_]("appended", i.seekingAppendCheck_);
      });
    };
    this.seekingAppendCheck_ = function() {
      i.fixesBadSeeks_() && (i.consecutiveUpdates = 0, i.lastRecordedTime = i.tech_.currentTime(), m("off"));
    }, this.clearSeekingAppendCheck_ = function() {
      return m("off");
    }, this.watchForBadSeeking_ = function() {
      i.clearSeekingAppendCheck_(), m("on");
    }, this.tech_.on("seeked", this.clearSeekingAppendCheck_), this.tech_.on("seeking", this.watchForBadSeeking_), this.tech_.on("waiting", a), this.tech_.on(Xl, o), this.tech_.on("canplay", t), this.tech_.one("play", e), this.dispose = function() {
      i.clearSeekingAppendCheck_(), i.logger_("dispose"), i.tech_.off("waiting", a), i.tech_.off(Xl, o), i.tech_.off("canplay", t), i.tech_.off("play", e), i.tech_.off("seeking", i.watchForBadSeeking_), i.tech_.off("seeked", i.clearSeekingAppendCheck_), l.forEach(function(g) {
        u[g + "SegmentLoader_"].off("appendsdone", c[g].updateend), u[g + "SegmentLoader_"].off("playlistupdate", c[g].reset), i.tech_.off(["seeked", "seeking"], c[g].reset);
      }), i.checkCurrentTimeTimeout_ && P.clearTimeout(i.checkCurrentTimeTimeout_), i.cancelTimer_();
    };
  }
  var r = s.prototype;
  return r.monitorCurrentTime_ = function() {
    this.checkCurrentTime_(), this.checkCurrentTimeTimeout_ && P.clearTimeout(this.checkCurrentTimeTimeout_), this.checkCurrentTimeTimeout_ = P.setTimeout(this.monitorCurrentTime_.bind(this), 250);
  }, r.resetSegmentDownloads_ = function(i) {
    var e = this.masterPlaylistController_[i + "SegmentLoader_"];
    this[i + "StalledDownloads_"] > 0 && this.logger_("resetting possible stalled download count for " + i + " loader"), this[i + "StalledDownloads_"] = 0, this[i + "Buffered_"] = e.buffered_();
  }, r.checkSegmentDownloads_ = function(i) {
    var e = this.masterPlaylistController_, t = e[i + "SegmentLoader_"], a = t.buffered_(), o = bv(this[i + "Buffered_"], a);
    if (this[i + "Buffered_"] = a, o) {
      this.resetSegmentDownloads_(i);
      return;
    }
    this[i + "StalledDownloads_"]++, this.logger_("found #" + this[i + "StalledDownloads_"] + " " + i + " appends that did not increase buffer (possible stalled download)", {
      playlistId: t.playlist_ && t.playlist_.id,
      buffered: Or(a)
    }), !(this[i + "StalledDownloads_"] < 10) && (this.logger_(i + " loader stalled download exclusion"), this.resetSegmentDownloads_(i), this.tech_.trigger({
      type: "usage",
      name: "vhs-" + i + "-download-exclusion"
    }), i !== "subtitle" && e.blacklistCurrentPlaylist({
      message: "Excessive " + i + " segment downloading detected."
    }, 1 / 0));
  }, r.checkCurrentTime_ = function() {
    if (!(this.tech_.paused() || this.tech_.seeking())) {
      var i = this.tech_.currentTime(), e = this.tech_.buffered();
      if (this.lastRecordedTime === i && (!e.length || i + Ht >= e.end(e.length - 1)))
        return this.techWaiting_();
      this.consecutiveUpdates >= 5 && i === this.lastRecordedTime ? (this.consecutiveUpdates++, this.waiting_()) : i === this.lastRecordedTime ? this.consecutiveUpdates++ : (this.consecutiveUpdates = 0, this.lastRecordedTime = i);
    }
  }, r.cancelTimer_ = function() {
    this.consecutiveUpdates = 0, this.timer_ && (this.logger_("cancelTimer_"), clearTimeout(this.timer_)), this.timer_ = null;
  }, r.fixesBadSeeks_ = function() {
    var i = this.tech_.seeking();
    if (!i)
      return !1;
    var e = this.seekable(), t = this.tech_.currentTime(), a = this.afterSeekableWindow_(e, t, this.media(), this.allowSeeksWithinUnsafeLiveWindow), o;
    if (a) {
      var u = e.end(e.length - 1);
      o = u;
    }
    if (this.beforeSeekableWindow_(e, t)) {
      var l = e.start(0);
      o = l + // if the playlist is too short and the seekable range is an exact time (can
      // happen in live with a 3 segment playlist), then don't use a time delta
      (l === e.end(0) ? 0 : Ht);
    }
    if (typeof o < "u")
      return this.logger_("Trying to seek outside of seekable at time " + t + " with " + ("seekable range " + Dc(e) + ". Seeking to ") + (o + ".")), this.tech_.setCurrentTime(o), !0;
    for (var c = this.masterPlaylistController_.sourceUpdater_, m = this.tech_.buffered(), g = c.audioBuffer ? c.audioBuffered() : null, _ = c.videoBuffer ? c.videoBuffered() : null, C = this.media(), w = C.partTargetDuration ? C.partTargetDuration : (C.targetDuration - gr) * 2, E = [g, _], M = 0; M < E.length; M++)
      if (E[M]) {
        var B = Do(E[M], t);
        if (B < w)
          return !1;
      }
    var z = On(m, t);
    return z.length === 0 ? !1 : (o = z.start(0) + Ht, this.logger_("Buffered region starts (" + z.start(0) + ") " + (" just beyond seek point (" + t + "). Seeking to " + o + ".")), this.tech_.setCurrentTime(o), !0);
  }, r.waiting_ = function() {
    if (!this.techWaiting_()) {
      var i = this.tech_.currentTime(), e = this.tech_.buffered(), t = Kr(e, i);
      if (t.length && i + 3 <= t.end(0)) {
        this.cancelTimer_(), this.tech_.setCurrentTime(i), this.logger_("Stopped at " + i + " while inside a buffered region " + ("[" + t.start(0) + " -> " + t.end(0) + "]. Attempting to resume ") + "playback by seeking to the current time."), this.tech_.trigger({
          type: "usage",
          name: "vhs-unknown-waiting"
        }), this.tech_.trigger({
          type: "usage",
          name: "hls-unknown-waiting"
        });
        return;
      }
    }
  }, r.techWaiting_ = function() {
    var i = this.seekable(), e = this.tech_.currentTime();
    if (this.tech_.seeking() || this.timer_ !== null)
      return !0;
    if (this.beforeSeekableWindow_(i, e)) {
      var t = i.end(i.length - 1);
      return this.logger_("Fell out of live window at time " + e + ". Seeking to " + ("live point (seekable end) " + t)), this.cancelTimer_(), this.tech_.setCurrentTime(t), this.tech_.trigger({
        type: "usage",
        name: "vhs-live-resync"
      }), this.tech_.trigger({
        type: "usage",
        name: "hls-live-resync"
      }), !0;
    }
    var a = this.tech_.vhs.masterPlaylistController_.sourceUpdater_, o = this.tech_.buffered(), u = this.videoUnderflow_({
      audioBuffered: a.audioBuffered(),
      videoBuffered: a.videoBuffered(),
      currentTime: e
    });
    if (u)
      return this.cancelTimer_(), this.tech_.setCurrentTime(e), this.tech_.trigger({
        type: "usage",
        name: "vhs-video-underflow"
      }), this.tech_.trigger({
        type: "usage",
        name: "hls-video-underflow"
      }), !0;
    var l = On(o, e);
    if (l.length > 0) {
      var c = l.start(0) - e;
      return this.logger_("Stopped at " + e + ", setting timer for " + c + ", seeking " + ("to " + l.start(0))), this.cancelTimer_(), this.timer_ = setTimeout(this.skipTheGap_.bind(this), c * 1e3, e), !0;
    }
    return !1;
  }, r.afterSeekableWindow_ = function(i, e, t, a) {
    if (a === void 0 && (a = !1), !i.length)
      return !1;
    var o = i.end(i.length - 1) + Ht, u = !t.endList;
    return u && a && (o = i.end(i.length - 1) + t.targetDuration * 3), e > o;
  }, r.beforeSeekableWindow_ = function(i, e) {
    return !!(i.length && // can't fall before 0 and 0 seekable start identifies VOD stream
    i.start(0) > 0 && e < i.start(0) - this.liveRangeSafeTimeDelta);
  }, r.videoUnderflow_ = function(i) {
    var e = i.videoBuffered, t = i.audioBuffered, a = i.currentTime;
    if (e) {
      var o;
      if (e.length && t.length) {
        var u = Kr(e, a - 3), l = Kr(e, a), c = Kr(t, a);
        c.length && !l.length && u.length && (o = {
          start: u.end(0),
          end: c.end(0)
        });
      } else {
        var m = On(e, a);
        m.length || (o = this.gapFromVideoUnderflow_(e, a));
      }
      return o ? (this.logger_("Encountered a gap in video from " + o.start + " to " + o.end + ". " + ("Seeking to current time " + a)), !0) : !1;
    }
  }, r.skipTheGap_ = function(i) {
    var e = this.tech_.buffered(), t = this.tech_.currentTime(), a = On(e, t);
    this.cancelTimer_(), !(a.length === 0 || t !== i) && (this.logger_("skipTheGap_:", "currentTime:", t, "scheduled currentTime:", i, "nextRange start:", a.start(0)), this.tech_.setCurrentTime(a.start(0) + gr), this.tech_.trigger({
      type: "usage",
      name: "vhs-gap-skip"
    }), this.tech_.trigger({
      type: "usage",
      name: "hls-gap-skip"
    }));
  }, r.gapFromVideoUnderflow_ = function(i, e) {
    for (var t = yv(i), a = 0; a < t.length; a++) {
      var o = t.start(a), u = t.end(a);
      if (e - o < 4 && e - o > 2)
        return {
          start: o,
          end: u
        };
    }
    return null;
  }, s;
})(), Iy = {
  errorInterval: 30,
  getSource: function(r) {
    var n = this.tech({
      IWillNotUseThisInPlugins: !0
    }), i = n.currentSource_ || this.currentSource();
    return r(i);
  }
}, Oy = function s(r, n) {
  var i = 0, e = 0, t = V.mergeOptions(Iy, n);
  r.ready(function() {
    r.trigger({
      type: "usage",
      name: "vhs-error-reload-initialized"
    }), r.trigger({
      type: "usage",
      name: "hls-error-reload-initialized"
    });
  });
  var a = function() {
    e && r.currentTime(e);
  }, o = function(g) {
    g != null && (e = r.duration() !== 1 / 0 && r.currentTime() || 0, r.one("loadedmetadata", a), r.src(g), r.trigger({
      type: "usage",
      name: "vhs-error-reload"
    }), r.trigger({
      type: "usage",
      name: "hls-error-reload"
    }), r.play());
  }, u = function() {
    if (Date.now() - i < t.errorInterval * 1e3) {
      r.trigger({
        type: "usage",
        name: "vhs-error-reload-canceled"
      }), r.trigger({
        type: "usage",
        name: "hls-error-reload-canceled"
      });
      return;
    }
    if (!t.getSource || typeof t.getSource != "function") {
      V.log.error("ERROR: reloadSourceOnError - The option getSource must be a function!");
      return;
    }
    return i = Date.now(), t.getSource.call(r, o);
  }, l = function m() {
    r.off("loadedmetadata", a), r.off("error", u), r.off("dispose", m);
  }, c = function(g) {
    l(), s(r, g);
  };
  r.on("error", u), r.on("dispose", l), r.reloadSourceOnError = c;
}, Ly = function(r) {
  Oy(this, r);
}, ff = "2.16.3", Fy = "6.0.1", Ry = "0.22.1", My = "4.8.0", Ny = "3.1.3", it = {
  PlaylistLoader: $r,
  Playlist: vt,
  utils: zv,
  STANDARD_PLAYLIST_SELECTOR: Ul,
  INITIAL_PLAYLIST_SELECTOR: R0,
  lastBandwidthSelector: Ul,
  movingAverageBandwidthSelector: L0,
  comparePlaylistBandwidth: Lo,
  comparePlaylistResolution: O0,
  xhr: jc()
};
Object.keys(Qe).forEach(function(s) {
  Object.defineProperty(it, s, {
    get: function() {
      return V.log.warn("using Vhs." + s + " is UNSAFE be sure you know what you are doing"), Qe[s];
    },
    set: function(n) {
      if (V.log.warn("using Vhs." + s + " is UNSAFE be sure you know what you are doing"), typeof n != "number" || n < 0) {
        V.log.warn("value of Vhs." + s + " must be greater than or equal to 0");
        return;
      }
      Qe[s] = n;
    }
  });
});
var hf = "videojs-vhs", pf = function(r, n) {
  for (var i = n.media(), e = -1, t = 0; t < r.length; t++)
    if (r[t].id === i.id) {
      e = t;
      break;
    }
  r.selectedIndex_ = e, r.trigger({
    selectedIndex: e,
    type: "change"
  });
}, By = function(r, n) {
  n.representations().forEach(function(i) {
    r.addQualityLevel(i);
  }), pf(r, n.playlists);
};
it.canPlaySource = function() {
  return V.log.warn("HLS is no longer a tech. Please remove it from your player's techOrder.");
};
var Uy = function(r, n, i) {
  if (!r)
    return r;
  var e = {};
  n && n.attributes && n.attributes.CODECS && (e = na(Vt(n.attributes.CODECS))), i && i.attributes && i.attributes.CODECS && (e.audio = i.attributes.CODECS);
  var t = Ni(e.video), a = Ni(e.audio), o = {};
  for (var u in r)
    o[u] = {}, a && (o[u].audioContentType = a), t && (o[u].videoContentType = t), n.contentProtection && n.contentProtection[u] && n.contentProtection[u].pssh && (o[u].pssh = n.contentProtection[u].pssh), typeof r[u] == "string" && (o[u].url = r[u]);
  return V.mergeOptions(r, o);
}, Vy = function(r, n) {
  return r.reduce(function(i, e) {
    if (!e.contentProtection)
      return i;
    var t = n.reduce(function(a, o) {
      var u = e.contentProtection[o];
      return u && u.pssh && (a[o] = {
        pssh: u.pssh
      }), a;
    }, {});
    return Object.keys(t).length && i.push(t), i;
  }, []);
}, qy = function(r) {
  var n = r.player, i = r.sourceKeySystems, e = r.audioMedia, t = r.mainPlaylists;
  if (!n.eme.initializeMediaKeys)
    return Promise.resolve();
  var a = e ? t.concat([e]) : t, o = Vy(a, Object.keys(i)), u = [], l = [];
  return o.forEach(function(c) {
    l.push(new Promise(function(m, g) {
      n.tech_.one("keysessioncreated", m);
    })), u.push(new Promise(function(m, g) {
      n.eme.initializeMediaKeys({
        keySystems: c
      }, function(_) {
        if (_) {
          g(_);
          return;
        }
        m();
      });
    }));
  }), Promise.race([
    // If a session was previously created, these will all finish resolving without
    // creating a new session, otherwise it will take until the end of all license
    // requests, which is why the key session check is used (to make setup much faster).
    Promise.all(u),
    // Once a single session is created, the browser knows DRM will be used.
    Promise.race(l)
  ]);
}, jy = function(r) {
  var n = r.player, i = r.sourceKeySystems, e = r.media, t = r.audioMedia, a = Uy(i, e, t);
  return a ? (n.currentSource().keySystems = a, a && !n.eme ? (V.log.warn("DRM encrypted source cannot be decrypted without a DRM plugin"), !1) : !0) : !1;
}, mf = function() {
  if (!P.localStorage)
    return null;
  var r = P.localStorage.getItem(hf);
  if (!r)
    return null;
  try {
    return JSON.parse(r);
  } catch {
    return null;
  }
}, Hy = function(r) {
  if (!P.localStorage)
    return !1;
  var n = mf();
  n = n ? V.mergeOptions(n, r) : r;
  try {
    P.localStorage.setItem(hf, JSON.stringify(n));
  } catch {
    return !1;
  }
  return n;
}, Wy = function(r) {
  return r.toLowerCase().indexOf("data:application/vnd.videojs.vhs+json,") === 0 ? JSON.parse(r.substring(r.indexOf(",") + 1)) : r;
};
it.supportsNativeHls = (function() {
  if (!ae || !ae.createElement)
    return !1;
  var s = ae.createElement("video");
  if (!V.getTech("Html5").isSupported())
    return !1;
  var r = [
    // Apple santioned
    "application/vnd.apple.mpegurl",
    // Apple sanctioned for backwards compatibility
    "audio/mpegurl",
    // Very common
    "audio/x-mpegurl",
    // Very common
    "application/x-mpegurl",
    // Included for completeness
    "video/x-mpegurl",
    "video/mpegurl",
    "application/mpegurl"
  ];
  return r.some(function(n) {
    return /maybe|probably/i.test(s.canPlayType(n));
  });
})();
it.supportsNativeDash = (function() {
  return !ae || !ae.createElement || !V.getTech("Html5").isSupported() ? !1 : /maybe|probably/i.test(ae.createElement("video").canPlayType("application/dash+xml"));
})();
it.supportsTypeNatively = function(s) {
  return s === "hls" ? it.supportsNativeHls : s === "dash" ? it.supportsNativeDash : !1;
};
it.isSupported = function() {
  return V.log.warn("HLS is no longer a tech. Please remove it from your player's techOrder.");
};
var Gy = V.getComponent("Component"), Ro = /* @__PURE__ */ (function(s) {
  oe(r, s);
  function r(i, e, t) {
    var a;
    if (a = s.call(this, e, V.mergeOptions(t.hls, t.vhs)) || this, t.hls && Object.keys(t.hls).length && V.log.warn("Using hls options is deprecated. Please rename `hls` to `vhs` in your options object."), typeof t.initialBandwidth == "number" && (a.options_.bandwidth = t.initialBandwidth), a.logger_ = Ft("VhsHandler"), e.options_ && e.options_.playerId) {
      var o = V(e.options_.playerId);
      o.hasOwnProperty("hls") || Object.defineProperty(o, "hls", {
        get: function() {
          return V.log.warn("player.hls is deprecated. Use player.tech().vhs instead."), e.trigger({
            type: "usage",
            name: "hls-player-access"
          }), ye(a);
        },
        configurable: !0
      }), o.hasOwnProperty("vhs") || Object.defineProperty(o, "vhs", {
        get: function() {
          return V.log.warn("player.vhs is deprecated. Use player.tech().vhs instead."), e.trigger({
            type: "usage",
            name: "vhs-player-access"
          }), ye(a);
        },
        configurable: !0
      }), o.hasOwnProperty("dash") || Object.defineProperty(o, "dash", {
        get: function() {
          return V.log.warn("player.dash is deprecated. Use player.tech().vhs instead."), ye(a);
        },
        configurable: !0
      }), a.player_ = o;
    }
    if (a.tech_ = e, a.source_ = i, a.stats = {}, a.ignoreNextSeekingEvent_ = !1, a.setOptions_(), a.options_.overrideNative && e.overrideNativeAudioTracks && e.overrideNativeVideoTracks)
      e.overrideNativeAudioTracks(!0), e.overrideNativeVideoTracks(!0);
    else if (a.options_.overrideNative && (e.featuresNativeVideoTracks || e.featuresNativeAudioTracks))
      throw new Error("Overriding native HLS requires emulated tracks. See https://git.io/vMpjB");
    return a.on(ae, ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"], function(u) {
      var l = ae.fullscreenElement || ae.webkitFullscreenElement || ae.mozFullScreenElement || ae.msFullscreenElement;
      l && l.contains(a.tech_.el()) ? a.masterPlaylistController_.fastQualityChange_() : a.masterPlaylistController_.checkABR_();
    }), a.on(a.tech_, "seeking", function() {
      if (this.ignoreNextSeekingEvent_) {
        this.ignoreNextSeekingEvent_ = !1;
        return;
      }
      this.setCurrentTime(this.tech_.currentTime());
    }), a.on(a.tech_, "error", function() {
      this.tech_.error() && this.masterPlaylistController_ && this.masterPlaylistController_.pauseLoading();
    }), a.on(a.tech_, "play", a.play), a;
  }
  var n = r.prototype;
  return n.setOptions_ = function() {
    var e = this;
    if (this.options_.withCredentials = this.options_.withCredentials || !1, this.options_.handleManifestRedirects = this.options_.handleManifestRedirects !== !1, this.options_.limitRenditionByPlayerDimensions = this.options_.limitRenditionByPlayerDimensions !== !1, this.options_.useDevicePixelRatio = this.options_.useDevicePixelRatio || !1, this.options_.smoothQualityChange = this.options_.smoothQualityChange || !1, this.options_.useBandwidthFromLocalStorage = typeof this.source_.useBandwidthFromLocalStorage < "u" ? this.source_.useBandwidthFromLocalStorage : this.options_.useBandwidthFromLocalStorage || !1, this.options_.useNetworkInformationApi = this.options_.useNetworkInformationApi || !1, this.options_.useDtsForTimestampOffset = this.options_.useDtsForTimestampOffset || !1, this.options_.customTagParsers = this.options_.customTagParsers || [], this.options_.customTagMappers = this.options_.customTagMappers || [], this.options_.cacheEncryptionKeys = this.options_.cacheEncryptionKeys || !1, typeof this.options_.blacklistDuration != "number" && (this.options_.blacklistDuration = 300), typeof this.options_.bandwidth != "number" && this.options_.useBandwidthFromLocalStorage) {
      var t = mf();
      t && t.bandwidth && (this.options_.bandwidth = t.bandwidth, this.tech_.trigger({
        type: "usage",
        name: "vhs-bandwidth-from-local-storage"
      }), this.tech_.trigger({
        type: "usage",
        name: "hls-bandwidth-from-local-storage"
      })), t && t.throughput && (this.options_.throughput = t.throughput, this.tech_.trigger({
        type: "usage",
        name: "vhs-throughput-from-local-storage"
      }), this.tech_.trigger({
        type: "usage",
        name: "hls-throughput-from-local-storage"
      }));
    }
    typeof this.options_.bandwidth != "number" && (this.options_.bandwidth = Qe.INITIAL_BANDWIDTH), this.options_.enableLowInitialPlaylist = this.options_.enableLowInitialPlaylist && this.options_.bandwidth === Qe.INITIAL_BANDWIDTH, ["withCredentials", "useDevicePixelRatio", "limitRenditionByPlayerDimensions", "bandwidth", "smoothQualityChange", "customTagParsers", "customTagMappers", "handleManifestRedirects", "cacheEncryptionKeys", "playlistSelector", "initialPlaylistSelector", "experimentalBufferBasedABR", "liveRangeSafeTimeDelta", "experimentalLLHLS", "useNetworkInformationApi", "useDtsForTimestampOffset", "experimentalExactManifestTimings", "experimentalLeastPixelDiffSelector"].forEach(function(a) {
      typeof e.source_[a] < "u" && (e.options_[a] = e.source_[a]);
    }), this.limitRenditionByPlayerDimensions = this.options_.limitRenditionByPlayerDimensions, this.useDevicePixelRatio = this.options_.useDevicePixelRatio;
  }, n.src = function(e, t) {
    var a = this;
    if (e) {
      this.setOptions_(), this.options_.src = Wy(this.source_.src), this.options_.tech = this.tech_, this.options_.externVhs = it, this.options_.sourceType = ad(t), this.options_.seekTo = function(l) {
        a.tech_.setCurrentTime(l);
      }, this.options_.smoothQualityChange && V.log.warn("smoothQualityChange is deprecated and will be removed in the next major version"), this.masterPlaylistController_ = new Ay(this.options_);
      var o = V.mergeOptions({
        liveRangeSafeTimeDelta: Ht
      }, this.options_, {
        seekable: function() {
          return a.seekable();
        },
        media: function() {
          return a.masterPlaylistController_.media();
        },
        masterPlaylistController: this.masterPlaylistController_
      });
      this.playbackWatcher_ = new Py(o), this.masterPlaylistController_.on("error", function() {
        var l = V.players[a.tech_.options_.playerId], c = a.masterPlaylistController_.error;
        typeof c == "object" && !c.code ? c.code = 3 : typeof c == "string" && (c = {
          message: c,
          code: 3
        }), l.error(c);
      });
      var u = this.options_.experimentalBufferBasedABR ? it.movingAverageBandwidthSelector(0.55) : it.STANDARD_PLAYLIST_SELECTOR;
      this.masterPlaylistController_.selectPlaylist = this.selectPlaylist ? this.selectPlaylist.bind(this) : u.bind(this), this.masterPlaylistController_.selectInitialPlaylist = it.INITIAL_PLAYLIST_SELECTOR.bind(this), this.playlists = this.masterPlaylistController_.masterPlaylistLoader_, this.mediaSource = this.masterPlaylistController_.mediaSource, Object.defineProperties(this, {
        selectPlaylist: {
          get: function() {
            return this.masterPlaylistController_.selectPlaylist;
          },
          set: function(c) {
            this.masterPlaylistController_.selectPlaylist = c.bind(this);
          }
        },
        throughput: {
          get: function() {
            return this.masterPlaylistController_.mainSegmentLoader_.throughput.rate;
          },
          set: function(c) {
            this.masterPlaylistController_.mainSegmentLoader_.throughput.rate = c, this.masterPlaylistController_.mainSegmentLoader_.throughput.count = 1;
          }
        },
        bandwidth: {
          get: function() {
            var c = this.masterPlaylistController_.mainSegmentLoader_.bandwidth, m = P.navigator.connection || P.navigator.mozConnection || P.navigator.webkitConnection, g = 1e7;
            if (this.options_.useNetworkInformationApi && m) {
              var _ = m.downlink * 1e3 * 1e3;
              _ >= g && c >= g ? c = Math.max(c, _) : c = _;
            }
            return c;
          },
          set: function(c) {
            this.masterPlaylistController_.mainSegmentLoader_.bandwidth = c, this.masterPlaylistController_.mainSegmentLoader_.throughput = {
              rate: 0,
              count: 0
            };
          }
        },
        /**
         * `systemBandwidth` is a combination of two serial processes bit-rates. The first
         * is the network bitrate provided by `bandwidth` and the second is the bitrate of
         * the entire process after that - decryption, transmuxing, and appending - provided
         * by `throughput`.
         *
         * Since the two process are serial, the overall system bandwidth is given by:
         *   sysBandwidth = 1 / (1 / bandwidth + 1 / throughput)
         */
        systemBandwidth: {
          get: function() {
            var c = 1 / (this.bandwidth || 1), m;
            this.throughput > 0 ? m = 1 / this.throughput : m = 0;
            var g = Math.floor(1 / (c + m));
            return g;
          },
          set: function() {
            V.log.error('The "systemBandwidth" property is read-only');
          }
        }
      }), this.options_.bandwidth && (this.bandwidth = this.options_.bandwidth), this.options_.throughput && (this.throughput = this.options_.throughput), Object.defineProperties(this.stats, {
        bandwidth: {
          get: function() {
            return a.bandwidth || 0;
          },
          enumerable: !0
        },
        mediaRequests: {
          get: function() {
            return a.masterPlaylistController_.mediaRequests_() || 0;
          },
          enumerable: !0
        },
        mediaRequestsAborted: {
          get: function() {
            return a.masterPlaylistController_.mediaRequestsAborted_() || 0;
          },
          enumerable: !0
        },
        mediaRequestsTimedout: {
          get: function() {
            return a.masterPlaylistController_.mediaRequestsTimedout_() || 0;
          },
          enumerable: !0
        },
        mediaRequestsErrored: {
          get: function() {
            return a.masterPlaylistController_.mediaRequestsErrored_() || 0;
          },
          enumerable: !0
        },
        mediaTransferDuration: {
          get: function() {
            return a.masterPlaylistController_.mediaTransferDuration_() || 0;
          },
          enumerable: !0
        },
        mediaBytesTransferred: {
          get: function() {
            return a.masterPlaylistController_.mediaBytesTransferred_() || 0;
          },
          enumerable: !0
        },
        mediaSecondsLoaded: {
          get: function() {
            return a.masterPlaylistController_.mediaSecondsLoaded_() || 0;
          },
          enumerable: !0
        },
        mediaAppends: {
          get: function() {
            return a.masterPlaylistController_.mediaAppends_() || 0;
          },
          enumerable: !0
        },
        mainAppendsToLoadedData: {
          get: function() {
            return a.masterPlaylistController_.mainAppendsToLoadedData_() || 0;
          },
          enumerable: !0
        },
        audioAppendsToLoadedData: {
          get: function() {
            return a.masterPlaylistController_.audioAppendsToLoadedData_() || 0;
          },
          enumerable: !0
        },
        appendsToLoadedData: {
          get: function() {
            return a.masterPlaylistController_.appendsToLoadedData_() || 0;
          },
          enumerable: !0
        },
        timeToLoadedData: {
          get: function() {
            return a.masterPlaylistController_.timeToLoadedData_() || 0;
          },
          enumerable: !0
        },
        buffered: {
          get: function() {
            return Or(a.tech_.buffered());
          },
          enumerable: !0
        },
        currentTime: {
          get: function() {
            return a.tech_.currentTime();
          },
          enumerable: !0
        },
        currentSource: {
          get: function() {
            return a.tech_.currentSource_;
          },
          enumerable: !0
        },
        currentTech: {
          get: function() {
            return a.tech_.name_;
          },
          enumerable: !0
        },
        duration: {
          get: function() {
            return a.tech_.duration();
          },
          enumerable: !0
        },
        master: {
          get: function() {
            return a.playlists.master;
          },
          enumerable: !0
        },
        playerDimensions: {
          get: function() {
            return a.tech_.currentDimensions();
          },
          enumerable: !0
        },
        seekable: {
          get: function() {
            return Or(a.tech_.seekable());
          },
          enumerable: !0
        },
        timestamp: {
          get: function() {
            return Date.now();
          },
          enumerable: !0
        },
        videoPlaybackQuality: {
          get: function() {
            return a.tech_.getVideoPlaybackQuality();
          },
          enumerable: !0
        }
      }), this.tech_.one("canplay", this.masterPlaylistController_.setupFirstPlay.bind(this.masterPlaylistController_)), this.tech_.on("bandwidthupdate", function() {
        a.options_.useBandwidthFromLocalStorage && Hy({
          bandwidth: a.bandwidth,
          throughput: Math.round(a.throughput)
        });
      }), this.masterPlaylistController_.on("selectedinitialmedia", function() {
        ky(a);
      }), this.masterPlaylistController_.sourceUpdater_.on("createdsourcebuffers", function() {
        a.setupEme_();
      }), this.on(this.masterPlaylistController_, "progress", function() {
        this.tech_.trigger("progress");
      }), this.on(this.masterPlaylistController_, "firstplay", function() {
        this.ignoreNextSeekingEvent_ = !0;
      }), this.setupQualityLevels_(), this.tech_.el() && (this.mediaSourceUrl_ = P.URL.createObjectURL(this.masterPlaylistController_.mediaSource), this.tech_.src(this.mediaSourceUrl_));
    }
  }, n.createKeySessions_ = function() {
    var e = this, t = this.masterPlaylistController_.mediaTypes_.AUDIO.activePlaylistLoader;
    this.logger_("waiting for EME key session creation"), qy({
      player: this.player_,
      sourceKeySystems: this.source_.keySystems,
      audioMedia: t && t.media(),
      mainPlaylists: this.playlists.master.playlists
    }).then(function() {
      e.logger_("created EME key session"), e.masterPlaylistController_.sourceUpdater_.initializedEme();
    }).catch(function(a) {
      e.logger_("error while creating EME key session", a), e.player_.error({
        message: "Failed to initialize media keys for EME",
        code: 3
      });
    });
  }, n.handleWaitingForKey_ = function() {
    this.logger_("waitingforkey fired, attempting to create any new key sessions"), this.createKeySessions_();
  }, n.setupEme_ = function() {
    var e = this, t = this.masterPlaylistController_.mediaTypes_.AUDIO.activePlaylistLoader, a = jy({
      player: this.player_,
      sourceKeySystems: this.source_.keySystems,
      media: this.playlists.media(),
      audioMedia: t && t.media()
    });
    if (this.player_.tech_.on("keystatuschange", function(o) {
      if (o.status === "output-restricted") {
        var u = e.masterPlaylistController_.master();
        if (!(!u || !u.playlists)) {
          var l = [];
          if (u.playlists.forEach(function(m) {
            m && m.attributes && m.attributes.RESOLUTION && m.attributes.RESOLUTION.height >= 720 && (!m.excludeUntil || m.excludeUntil < 1 / 0) && (m.excludeUntil = 1 / 0, l.push(m));
          }), l.length) {
            var c;
            (c = V.log).warn.apply(c, ['DRM keystatus changed to "output-restricted." Removing the following HD playlists that will most likely fail to play and clearing the buffer. This may be due to HDCP restrictions on the stream and the capabilities of the current device.'].concat(l)), e.masterPlaylistController_.fastQualityChange_();
          }
        }
      }
    }), this.handleWaitingForKey_ = this.handleWaitingForKey_.bind(this), this.player_.tech_.on("waitingforkey", this.handleWaitingForKey_), V.browser.IE_VERSION === 11 || !a) {
      this.masterPlaylistController_.sourceUpdater_.initializedEme();
      return;
    }
    this.createKeySessions_();
  }, n.setupQualityLevels_ = function() {
    var e = this, t = V.players[this.tech_.options_.playerId];
    !t || !t.qualityLevels || this.qualityLevels_ || (this.qualityLevels_ = t.qualityLevels(), this.masterPlaylistController_.on("selectedinitialmedia", function() {
      By(e.qualityLevels_, e);
    }), this.playlists.on("mediachange", function() {
      pf(e.qualityLevels_, e.playlists);
    }));
  }, r.version = function() {
    return {
      "@videojs/http-streaming": ff,
      "mux.js": Fy,
      "mpd-parser": Ry,
      "m3u8-parser": My,
      "aes-decrypter": Ny
    };
  }, n.version = function() {
    return this.constructor.version();
  }, n.canChangeType = function() {
    return cf.canChangeType();
  }, n.play = function() {
    this.masterPlaylistController_.play();
  }, n.setCurrentTime = function(e) {
    this.masterPlaylistController_.setCurrentTime(e);
  }, n.duration = function() {
    return this.masterPlaylistController_.duration();
  }, n.seekable = function() {
    return this.masterPlaylistController_.seekable();
  }, n.dispose = function() {
    this.playbackWatcher_ && this.playbackWatcher_.dispose(), this.masterPlaylistController_ && this.masterPlaylistController_.dispose(), this.qualityLevels_ && this.qualityLevels_.dispose(), this.player_ && (delete this.player_.vhs, delete this.player_.dash, delete this.player_.hls), this.tech_ && this.tech_.vhs && delete this.tech_.vhs, this.tech_ && delete this.tech_.hls, this.mediaSourceUrl_ && P.URL.revokeObjectURL && (P.URL.revokeObjectURL(this.mediaSourceUrl_), this.mediaSourceUrl_ = null), this.tech_ && this.tech_.off("waitingforkey", this.handleWaitingForKey_), s.prototype.dispose.call(this);
  }, n.convertToProgramTime = function(e, t) {
    return Zv({
      playlist: this.masterPlaylistController_.media(),
      time: e,
      callback: t
    });
  }, n.seekToProgramTime = function(e, t, a, o) {
    return a === void 0 && (a = !0), o === void 0 && (o = 2), e0({
      programTime: e,
      playlist: this.masterPlaylistController_.media(),
      retryCount: o,
      pauseAfterSeek: a,
      seekTo: this.options_.seekTo,
      tech: this.options_.tech,
      callback: t
    });
  }, r;
})(Gy), Hi = {
  name: "videojs-http-streaming",
  VERSION: ff,
  canHandleSource: function(r, n) {
    n === void 0 && (n = {});
    var i = V.mergeOptions(V.options, n);
    return Hi.canPlayType(r.type, i);
  },
  handleSource: function(r, n, i) {
    i === void 0 && (i = {});
    var e = V.mergeOptions(V.options, i);
    return n.vhs = new Ro(r, n, e), V.hasOwnProperty("hls") || Object.defineProperty(n, "hls", {
      get: function() {
        return V.log.warn("player.tech().hls is deprecated. Use player.tech().vhs instead."), n.vhs;
      },
      configurable: !0
    }), n.vhs.xhr = jc(), n.vhs.src(r.src, r.type), n.vhs;
  },
  canPlayType: function(r, n) {
    var i = ad(r);
    if (!i)
      return "";
    var e = Hi.getOverrideNative(n), t = it.supportsTypeNatively(i), a = !t || e;
    return a ? "maybe" : "";
  },
  getOverrideNative: function(r) {
    r === void 0 && (r = {});
    var n = r, i = n.vhs, e = i === void 0 ? {} : i, t = n.hls, a = t === void 0 ? {} : t, o = !(V.browser.IS_ANY_SAFARI || V.browser.IS_IOS), u = e.overrideNative, l = u === void 0 ? o : u, c = a.overrideNative, m = c === void 0 ? !1 : c;
    return m || l;
  }
}, zy = function() {
  return Mn("avc1.4d400d,mp4a.40.2");
};
zy() && V.getTech("Html5").registerSourceHandler(Hi, 0);
V.VhsHandler = Ro;
Object.defineProperty(V, "HlsHandler", {
  get: function() {
    return V.log.warn("videojs.HlsHandler is deprecated. Use videojs.VhsHandler instead."), Ro;
  },
  configurable: !0
});
V.VhsSourceHandler = Hi;
Object.defineProperty(V, "HlsSourceHandler", {
  get: function() {
    return V.log.warn("videojs.HlsSourceHandler is deprecated. Use videojs.VhsSourceHandler instead."), Hi;
  },
  configurable: !0
});
V.Vhs = it;
Object.defineProperty(V, "Hls", {
  get: function() {
    return V.log.warn("videojs.Hls is deprecated. Use videojs.Vhs instead."), it;
  },
  configurable: !0
});
V.use || (V.registerComponent("Hls", it), V.registerComponent("Vhs", it));
V.options.vhs = V.options.vhs || {};
V.options.hls = V.options.hls || {};
if (!V.getPlugin || !V.getPlugin("reloadSourceOnError")) {
  var Ky = V.registerPlugin || V.plugin;
  Ky("reloadSourceOnError", Ly);
}
function ms(s, r) {
  var n = {};
  for (var i in s) Object.prototype.hasOwnProperty.call(s, i) && r.indexOf(i) < 0 && (n[i] = s[i]);
  if (s != null && typeof Object.getOwnPropertySymbols == "function") {
    var e = 0;
    for (i = Object.getOwnPropertySymbols(s); e < i.length; e++) r.indexOf(i[e]) < 0 && Object.prototype.propertyIsEnumerable.call(s, i[e]) && (n[i[e]] = s[i[e]]);
  }
  return n;
}
var $y = { src: { type: String, onChange: function(s, r) {
  return s.src(r);
} }, width: { type: Number, onChange: function(s, r) {
  return s.width(r);
}, onEvent: function(s, r) {
  s.on(["playerresize", "resize"], (function() {
    return r(s.width());
  }));
} }, height: { type: Number, onChange: function(s, r) {
  return s.height(r);
}, onEvent: function(s, r) {
  s.on(["playerresize", "resize"], (function() {
    return r(s.height());
  }));
} }, preload: { type: String, onChange: function(s, r) {
  return s.preload(r);
} }, loop: { type: Boolean, onChange: function(s, r) {
  return s.loop(r);
} }, muted: { type: Boolean, onChange: function(s, r) {
  return s.muted(r);
}, onEvent: function(s, r) {
  return s.on("volumechange", (function() {
    return r(s.muted());
  }));
} }, poster: { type: String, onChange: function(s, r) {
  return s.poster(r);
}, onEvent: function(s, r) {
  return s.on("posterchange", (function() {
    return r(s.poster());
  }));
} }, controls: { type: Boolean, onChange: function(s, r) {
  return s.controls(r);
}, onEvent: function(s, r) {
  s.on("controlsenabled", (function() {
    return r(!0);
  })), s.on("controlsdisabled", (function() {
    return r(!1);
  }));
} }, autoplay: { type: [Boolean, String], onChange: function(s, r) {
  return s.autoplay(r);
} }, crossorigin: { type: String, onChange: function(s, r) {
  return s.crossOrigin(r);
} }, crossOrigin: { type: String, onChange: function(s, r) {
  return s.crossOrigin(r);
} }, playsinline: { type: Boolean, onChange: function(s, r) {
  return s.playsinline(r);
} }, playsInline: { type: Boolean, onChange: function(s, r) {
  return s.playsinline(r);
} } }, Xy = { id: { type: String }, sources: { type: Array, onChange: function(s, r) {
  return s.src(r);
} }, tracks: { type: Array, onChange: function(s, r) {
  for (var n = s.remoteTextTracks(), i = (n == null ? void 0 : n.length) || 0; i--; ) s.removeRemoteTextTrack(n[i]);
  s.ready((function() {
    r.forEach((function(e) {
      return s.addRemoteTextTrack(e, !1);
    }));
  }));
} }, textTrackSettings: { type: Object, onChange: function(s, r) {
  return s.textTrackSettings.options(r);
} }, language: { type: String, onChange: function(s, r) {
  return s.language(r);
}, onEvent: function(s, r) {
  return s.on("languagechange", (function() {
    return r(s.language());
  }));
} }, languages: { type: Object }, playbackRates: { type: Array, onChange: function(s, r) {
  return s.playbackRates(r ?? []);
}, onEvent: function(s, r) {
  s.on("playbackrateschange", (function() {
    return r(s.playbackRates());
  }));
} }, audioOnlyMode: { type: Boolean, onChange: function(s, r) {
  return s.audioOnlyMode(r);
} }, audioPosterMode: { type: Boolean, onChange: function(s, r) {
  return s.audioPosterMode(r);
} }, responsive: { type: Boolean, onChange: function(s, r) {
  return s.responsive(r);
} }, breakpoints: { type: Object, onChange: function(s, r) {
  return s.breakpoints(r);
} }, fluid: { type: Boolean, onChange: function(s, r) {
  return s.fluid(r);
} }, fill: { type: Boolean, onChange: function(s, r) {
  return s.fill(r);
} }, aspectRatio: { type: String, onChange: function(s, r) {
  return s.aspectRatio(r);
} }, fullscreen: { type: Object }, liveui: { type: Boolean }, liveTracker: { type: Object }, disablePictureInPicture: { type: Boolean, onChange: function(s, r) {
  return s.disablePictureInPicture(r);
} }, notSupportedMessage: { type: String }, normalizeAutoplay: { type: Boolean }, noUITitleAttributes: { type: Boolean }, preferFullWindow: { type: Boolean }, suppressNotSupportedError: { type: Boolean }, techCanOverridePoster: { type: Boolean }, reportTouchActivity: { type: Boolean }, techOrder: { type: Array }, inactivityTimeout: { type: Number }, userActions: { type: Object }, plugins: { type: Object }, restoreEl: { type: [Boolean, Object] }, "vtt.js": { type: String } }, Yy = { children: { type: [Array, Object] }, controlBar: { type: Object, onChange: function(s, r) {
  return s.controlBar.options(r);
} } }, Qy = { html5: { type: Object } }, Jy = { volume: { type: Number, onChange: function(s, r) {
  return s.volume(r);
}, onEvent: function(s, r) {
  return s.on("volumechange", (function() {
    return r(s.volume());
  }));
} }, playbackRate: { type: Number, onChange: function(s, r) {
  s.playbackRate(r), s.defaultPlaybackRate(r);
}, onEvent: function(s, r) {
  s.on("ratechange", (function() {
    r(s.playbackRate());
  }));
} }, options: { type: Object } }, Wi = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, $y), Xy), Yy), Qy), Jy), Mo = Object.keys(Wi), gf = Object.assign(Object.assign(Object.assign(Object.assign({}, { loadstart: "onLoadStart", suspend: "onSuspend", abort: "onAbort", error: "onError", emptied: "onEmptied", stalled: "onStalled", loadedmetadata: "onLoadedMetadata", loadeddata: "onLoadedData", canplay: "onCanPlay", canplaythrough: "onCanPlayThrough", playing: "onPlaying", waiting: "onWaiting", seeking: "onSeeking", seeked: "onSeeked", ended: "onEnded", durationchange: "onDurationChange", timeupdate: "onTimeUpdate", progress: "onProgress", play: "onPlay", pause: "onpause", ratechange: "onRateChange", resize: "onResize", volumechange: "onVolumeChange" }), { posterchange: "onPosterChange", languagechange: "onLanguageChange", fullscreenchange: "onFullscreenChange", playbackrateschange: "onPlaybackRatesChange", controlsdisabled: "onControlsDisabled", controlsenabled: "onControlsEnabled", enterFullWindow: "onEnterFullWindow", exitFullWindow: "onExitFullWindow", enterpictureinpicture: "onEnterPictureInPicture", leavepictureinpicture: "onLeavePictureInPicture", sourceset: "onSourceSet", texttrackchange: "onTextTrackChange", textdata: "onTextData", useractive: "onUserActive", userinactive: "onUserInactive", usingcustomcontrols: "onUsingCustomControls", usingnativecontrols: "onUsingNativeControls", dispose: "onDispose" }), { beforepluginsetup: "onBeforePluginSetup", pluginsetup: "onPluginSetup" }), { componentresize: "onComponentResize", playerresize: "onPlayerResize", ready: "onReady", tap: "onTap" }), vf = Object.keys(gf);
Object.values(gf);
var gs = function(s) {
  var r, n = s == null ? void 0 : s.trim().replace(/\s+/g, " ");
  return n && (r = n.split(" ")) !== null && r !== void 0 ? r : [];
}, vs = { src: { getter: function(s) {
  return s.src();
} }, currentSrc: { getter: function(s) {
  return s.currentSrc();
} }, currentSource: { getter: function(s) {
  return s.currentSource();
} }, width: { events: ["resize", "playerresize"], getter: function(s) {
  return s.width();
} }, height: { events: ["resize", "playerresize"], getter: function(s) {
  return s.height();
} }, currentWidth: { events: ["resize", "playerresize"], getter: function(s) {
  return s.currentWidth();
} }, currentHeight: { events: ["resize", "playerresize"], getter: function(s) {
  return s.currentHeight();
} }, videoWidth: { events: ["resize", "playerresize"], getter: function(s) {
  return s.videoWidth();
} }, videoHeight: { events: ["resize", "playerresize"], getter: function(s) {
  return s.videoHeight();
} }, controls: { events: ["controlsdisabled", "controlsenabled"], getter: function(s) {
  return s.controls();
} }, volume: { events: ["volumechange"], getter: function(s) {
  return s.volume();
} }, muted: { events: ["volumechange"], getter: function(s) {
  return s.muted();
} }, poster: { events: ["posterchange"], getter: function(s) {
  return s.poster();
} }, seeking: { events: ["seeking"], getter: function(s) {
  return s.seeking();
} }, paused: { events: ["pause", "play", "playing"], getter: function(s) {
  return s.paused();
} }, ended: { events: ["ended", "play"], getter: function(s) {
  return s.ended();
} }, currentTime: { events: ["timeupdate"], getter: function(s) {
  return s.currentTime();
} }, duration: { events: ["durationchange"], getter: function(s) {
  return s.duration();
} }, playbackRate: { events: ["ratechange"], getter: function(s) {
  return s.playbackRate();
} }, playbackRates: { events: ["playbackrateschange"], getter: function(s) {
  return s.playbackRates();
} }, isFullscreen: { events: ["fullscreenchange"], getter: function(s) {
  return s.isFullscreen();
} }, isInPictureInPicture: { events: ["enterpictureinpicture", "leavepictureinpicture"], getter: function(s) {
  return s.isInPictureInPicture();
} }, isLive: { getter: function(s) {
  var r;
  return (r = s.liveTracker) === null || r === void 0 ? void 0 : r.isLive();
} }, language: { events: ["languagechange"], getter: function(s) {
  return s.language();
} }, userActive: { events: ["useractive", "userinactive"], getter: function(s) {
  return s.userActive();
} }, readyState: { events: ["loadeddata"], getter: function(s) {
  return s.readyState();
} }, networkState: { events: ["loadeddata", "error"], getter: function(s) {
  return s.networkState();
} }, error: { events: ["loadeddata", "error"], getter: function(s) {
  return s.error();
} }, buffered: { events: ["progress"], getter: function(s) {
  return s.buffered();
} }, bufferedPercent: { events: ["progress"], getter: function(s) {
  return s.bufferedPercent();
} }, played: { events: ["timeupdate"], getter: function(s) {
  return s.played();
} }, seekable: { events: ["progress", "seeked"], getter: function(s) {
  return s.seekable();
} }, audioTracks: { getter: function(s) {
  var r;
  return (r = s.audioTracks) === null || r === void 0 ? void 0 : r.call(s);
} }, videoTracks: { getter: function(s) {
  var r;
  return (r = s.videoTracks) === null || r === void 0 ? void 0 : r.call(s);
} }, textTracks: { getter: function(s) {
  var r;
  return (r = s.textTracks) === null || r === void 0 ? void 0 : r.call(s);
} } }, yf = Mo.filter((function(s) {
  return !!Wi[s].onEvent;
})), _f = function(s) {
  return "update:" + s;
}, Zy = vf.concat(yf.map(_f)), e_ = Mo.reduce((function(s, r) {
  var n, i = Wi[r], e = Array.isArray(i.type) ? i.type : [i.type], t = Object.assign({}, i);
  return e.includes(Boolean) && (t.default = void 0), Object.assign(Object.assign({}, s), ((n = {})[r] = t, n));
}), {}), t_ = Yl({ name: "VueVideoPlayer", props: Object.assign(Object.assign({}, e_), { class: [String, Object, Array] }), emits: Zy.concat(["mounted"], ["unmounted"]), setup: function(s, r) {
  var n = Ph(s), i = n.class, e = ms(n, ["class"]), t = Oa(!1), a = Oa(null), o = Oa(null), u = qn((function() {
    return o.value ? o.value.player : null;
  })), l = hr(null), c = qn((function() {
    return l.value ? Ih(l.value) : null;
  }));
  return Oh((function() {
    var m, g = (function(_) {
      var C, w = _.props, E = _.element, M = _.className, B = _.onEvent, z = w.options;
      z === void 0 && (z = {});
      var W = ms(w, ["options"]), H = {};
      Object.keys(W).forEach((function(j) {
        var K = W[j];
        K !== void 0 && (H[j] = K);
      }));
      var $ = Object.assign(Object.assign({}, H), z), N = $.volume, q = $.playbackRate, T = ms($, ["volume", "playbackRate"]), b = Object.assign(Object.assign({}, T), { playsinline: (C = T.playsinline) !== null && C !== void 0 ? C : T.playsInline }), L = V(E, b, (function() {
        var j = this;
        vf.forEach((function(K) {
          j.on(K, (function(Y) {
            B(K, Y);
          }));
        })), T.src && !T.sources && this.src(T.src), N && Number.isFinite(N) && this.volume(N), q && Number.isFinite(q) && (this.defaultPlaybackRate(q), setTimeout((function() {
          j.playbackRate(q);
        }), 0));
      }));
      M && gs(M).map((function(j) {
        return L.addClass(j);
      }));
      var R = function(j) {
        var K;
        (K = L.options) === null || K === void 0 || K.call(L, j ?? {});
      };
      return { player: L, dispose: function() {
        return L.dispose();
      }, updateClassNames: function(j, K) {
        gs(j).map((function(Y) {
          return L.removeClass(Y);
        })), gs(K).map((function(Y) {
          return L.addClass(Y);
        }));
      }, updateOptions: R, updatePropOption: function(j, K) {
        var Y, re, J;
        R(((Y = {})[j] = K, Y)), (J = (re = Wi[j]) === null || re === void 0 ? void 0 : re.onChange) === null || J === void 0 || J.call(re, L, K);
      } };
    })({ element: a.value, props: e, onEvent: r.emit });
    m = { player: g.player, onEvent: r.emit }, yf.forEach((function(_) {
      var C, w;
      (w = (C = Wi[_]) === null || C === void 0 ? void 0 : C.onEvent) === null || w === void 0 || w.call(C, m.player, (function(E) {
        m.onEvent(_f(_), E);
      }));
    })), Rn((function() {
      return s.class;
    }), (function(_, C) {
      var w = Li(C), E = Li(_);
      g.updateClassNames(w, E);
    }), { immediate: !0 }), Rn((function() {
      return s.options;
    }), (function(_) {
      return g.updateOptions(_ ?? {});
    }), { deep: !0 }), Mo.filter((function(_) {
      return _ !== "options";
    })).forEach((function(_) {
      Rn((function() {
        return s[_];
      }), (function(C) {
        return g.updatePropOption(_, C);
      }), { deep: !0 });
    })), (function(_, C) {
      var w = Object.keys(vs), E = w.reduce((function(B, z) {
        var W;
        return Object.assign(Object.assign({}, B), ((W = {})[z] = vs[z].getter(_), W));
      }), { playing: !1, waiting: !1 }), M = function(B, z) {
        E[B] = z, C.onUpdate(B, z, Object.assign({}, E));
      };
      _.on(["pause", "ended"], (function() {
        M("playing", !1);
      })), _.on(["play", "playing"], (function() {
        M("playing", !0);
      })), _.on("waiting", (function() {
        M("waiting", !0);
        var B = _.currentTime(), z = function() {
          B !== _.currentTime() && (M("waiting", !1), _.off("timeupdate", z));
        };
        _.on("timeupdate", z);
      })), w.forEach((function(B) {
        var z, W = vs[B];
        _.on(["loadstart", "loadedmetadata"].concat((z = W.events) !== null && z !== void 0 ? z : []), (function() {
          M(B, W.getter(_));
        }));
      })), C.onInit(Object.assign({}, E));
    })(g.player, { onInit: function(_) {
      l.value = _;
    }, onUpdate: function(_, C) {
      l.value && (l.value[_] = C);
    } }), o.value = g, t.value = !0, r.emit("mounted", { video: a.value, player: u.value, state: c.value });
  })), Ql((function() {
    o.value && (o.value.dispose(), o.value = null, l.value = null, r.emit("unmounted"));
  })), function() {
    var m, g;
    return _u("div", { "data-vjs-player": "", class: Li(i) }, [_u("video", { class: ["video-js", "v-video-player"], ref: a }), t.value && ((g = (m = r.slots).default) === null || g === void 0 ? void 0 : g.call(m, { video: a.value, player: u.value, state: c.value }))]);
  };
} }), r_ = t_;
const i_ = { class: "video-comparison-widget" }, n_ = { class: "video-header" }, a_ = { class: "video-label" }, s_ = {
  key: 0,
  class: "video-status"
}, o_ = {
  key: 1,
  class: "video-status pending"
}, u_ = { class: "video-container" }, l_ = {
  key: 1,
  class: "video-placeholder"
}, d_ = { class: "controls-panel" }, c_ = { class: "playback-controls" }, f_ = { class: "timeline-controls" }, h_ = { class: "time-display" }, p_ = { class: "time-display" }, m_ = { class: "info-panel" }, g_ = { class: "video-count" }, v_ = /* @__PURE__ */ Yl({
  __name: "VideoComparisonWidget",
  props: {
    widget: {},
    referenceVideo: {},
    baseVideo: {},
    upscaledVideo: {}
  },
  setup(s) {
    const r = {
      referenceVideo: "Reference Video",
      baseVideo: "Base Video",
      upscaledVideo: "Upscaled Video",
      waitingForVideo: "Waiting for video...",
      playAll: "Play All",
      pauseAll: "Pause All",
      sync: "Sync",
      mute: "Mute All",
      unmute: "Unmute All",
      videosLoaded: "videos loaded"
    }, n = (T) => {
      const b = T.replace("videoComparison.", "").replace("videoPreview.", "");
      return r[b] || T;
    }, i = s, e = hr([null, null, null]), t = hr([]), a = hr(!1), o = hr(!1), u = hr(0), l = hr(0), c = hr(!1), m = {
      controls: !0,
      responsive: !0,
      fluid: !0,
      aspectRatio: "9:16",
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        pictureInPictureToggle: !1
      }
    }, g = (T) => {
      var b, L, R;
      if (console.log("Widget value:", (b = i.widget) == null ? void 0 : b.value), (R = (L = i.widget) == null ? void 0 : L.value) != null && R.videos) {
        const K = i.widget.value.videos[T];
        if (K != null && K.url)
          return console.log(`Found ${T} video URL:`, K.url), K.url;
      }
      if (T === "reference") return i.referenceVideo;
      if (T === "base") return i.baseVideo;
      if (T === "upscaled") return i.upscaledVideo;
    }, _ = qn(() => {
      const T = [
        {
          key: "reference",
          label: n("videoComparison.referenceVideo"),
          src: g("reference")
        },
        {
          key: "base",
          label: n("videoComparison.baseVideo"),
          src: g("base")
        },
        {
          key: "upscaled",
          label: n("videoComparison.upscaledVideo"),
          src: g("upscaled")
        }
      ];
      return console.log("Video slots:", T), T;
    }), C = qn(() => _.value.filter((T) => T.src));
    function w(T, b) {
      b && (t.value[T] = b);
    }
    function E(T) {
      const b = t.value[T];
      b && b.player && (e.value[T] = b.player, l.value === 0 && (l.value = b.player.duration() || 0), console.log(`Video player ${T} ready`, {
        duration: b.player.duration()
      }));
    }
    function M(T, b) {
      if (!c.value && e.value[T]) {
        const L = e.value[T];
        if (L) {
          u.value = L.currentTime();
          const R = L.duration();
          R && R !== l.value && (l.value = R);
        }
      }
    }
    function B(T) {
      a.value = !0;
    }
    function z(T) {
      e.value.filter((L) => L !== null).every((L) => L.paused()) && (a.value = !1);
    }
    function W() {
      const T = e.value.filter((b) => b !== null);
      a.value ? (T.forEach((b) => b.pause()), a.value = !1) : (T.forEach((b) => b.play()), a.value = !0);
    }
    function H() {
      const T = e.value.filter((L) => L !== null);
      if (T.length < 2) return;
      const b = T[0].currentTime();
      T.forEach((L, R) => {
        R > 0 && L.currentTime(b);
      }), u.value = b, console.log("Videos synced to time:", b);
    }
    function $() {
      const T = e.value.filter((b) => b !== null);
      o.value = !o.value, T.forEach((b) => {
        b.muted(o.value);
      });
    }
    function N(T) {
      const b = Array.isArray(T) ? T[0] ?? 0 : T;
      c.value = !0, e.value.filter((R) => R !== null).forEach((R) => {
        R.currentTime(b);
      }), setTimeout(() => {
        c.value = !1;
      }, 100);
    }
    function q(T) {
      if (!isFinite(T) || T < 0) return "00:00";
      const b = Math.floor(T / 60), L = Math.floor(T % 60);
      return `${b.toString().padStart(2, "0")}:${L.toString().padStart(2, "0")}`;
    }
    return Rn(
      () => [i.referenceVideo, i.baseVideo, i.upscaledVideo],
      () => {
        console.log("Video sources updated:", {
          reference: i.referenceVideo,
          base: i.baseVideo,
          upscaled: i.upscaledVideo
        });
      }
    ), Ql(() => {
      e.value.forEach((T) => {
        T && T.dispose();
      });
    }), (T, b) => (Ar(), qr("div", i_, [
      _t("div", {
        class: Li(["video-grid", `grid-${C.value.length}`])
      }, [
        (Ar(!0), qr(Lh, null, Fh(_.value, (L, R) => (Ar(), qr("div", {
          key: L.key,
          class: Li(["video-panel", { active: L.src }])
        }, [
          _t("div", n_, [
            _t("span", a_, Dr(L.label), 1),
            L.src ? (Ar(), qr("span", s_, "✓ Loaded")) : (Ar(), qr("span", o_, "Waiting..."))
          ]),
          _t("div", u_, [
            L.src ? (Ar(), Rh(Ei(r_), {
              key: 0,
              ref_for: !0,
              ref: (j) => w(R, j),
              src: L.src,
              options: m,
              onReady: (j) => E(R),
              onTimeupdate: (j) => M(R),
              onPlay: (j) => B(),
              onPause: (j) => z()
            }, null, 8, ["src", "onReady", "onTimeupdate", "onPlay", "onPause"])) : (Ar(), qr("div", l_, [
              b[1] || (b[1] = _t("i", { class: "pi pi-video" }, null, -1)),
              _t("p", null, Dr(n("videoComparison.waitingForVideo")), 1)
            ]))
          ])
        ], 2))), 128))
      ], 2),
      _t("div", d_, [
        _t("div", c_, [
          xn(Ei(La), {
            icon: a.value ? "pi pi-pause" : "pi pi-play",
            label: a.value ? n("videoComparison.pauseAll") : n("videoComparison.playAll"),
            onClick: W,
            disabled: C.value.length === 0,
            size: "small"
          }, null, 8, ["icon", "label", "disabled"]),
          xn(Ei(La), {
            icon: "pi pi-sync",
            label: n("videoComparison.sync"),
            onClick: H,
            disabled: C.value.length < 2,
            size: "small",
            severity: "secondary"
          }, null, 8, ["label", "disabled"]),
          xn(Ei(La), {
            icon: o.value ? "pi pi-volume-off" : "pi pi-volume-up",
            label: o.value ? n("videoComparison.unmute") : n("videoComparison.mute"),
            onClick: $,
            disabled: C.value.length === 0,
            size: "small",
            severity: "secondary"
          }, null, 8, ["icon", "label", "disabled"])
        ]),
        _t("div", f_, [
          _t("span", h_, Dr(q(u.value)), 1),
          xn(Ei(Mh), {
            modelValue: u.value,
            "onUpdate:modelValue": [
              b[0] || (b[0] = (L) => u.value = L),
              N
            ],
            min: 0,
            max: l.value,
            step: 0.1,
            disabled: C.value.length === 0,
            class: "timeline-slider"
          }, null, 8, ["modelValue", "max", "disabled"]),
          _t("span", p_, Dr(q(l.value)), 1)
        ]),
        _t("div", m_, [
          _t("span", g_, Dr(C.value.length) + " / " + Dr(_.value.length) + " " + Dr(n("videoComparison.videosLoaded")), 1)
        ])
      ])
    ]));
  }
}), y_ = (s, r) => {
  const n = s.__vccOpts || s;
  for (const [i, e] of r)
    n[i] = e;
  return n;
}, __ = /* @__PURE__ */ y_(v_, [["__scopeId", "data-v-766b0858"]]), T_ = Dh;
T_.registerExtension({
  name: "comfyui-swissarmyknife.vue-components",
  async setup() {
    console.log("Vue components for ComfyUI Swiss Army Knife loaded");
  },
  getCustomWidgets(s) {
    return {
      VIDEO_COMPARISON_WIDGET(r) {
        const n = {
          name: "video_widget",
          type: "video-widget"
        }, i = new wh({
          node: r,
          name: n.name,
          component: __,
          inputSpec: n,
          options: {}
        });
        return kh(r, i), { widget: i };
      }
    };
  },
  nodeCreated(s) {
  }
});
export {
  T_ as comfyApp
};
