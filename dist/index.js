import * as S from "three/webgpu";
import { uniform as T, texture as lt, uv as ut, sub as I, max as K, clamp as X, add as W, div as E, fwidth as V, smoothstep as q, mix as H, mul as k, oneMinus as Q, materialOpacity as ft, min as J } from "three/tsl";
function dt(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var $ = { exports: {} }, Z;
function pt() {
  return Z || (Z = 1, (function(n) {
    var t = /\n/, e = `
`, r = /\s/;
    n.exports = function(i, s) {
      var o = n.exports.lines(i, s);
      return o.map(function(c) {
        return i.substring(c.start, c.end);
      }).join(`
`);
    }, n.exports.lines = function(s, o) {
      if (o = o || {}, o.width === 0 && o.mode !== "nowrap")
        return [];
      s = s || "";
      var c = typeof o.width == "number" ? o.width : Number.MAX_VALUE, f = Math.max(0, o.start || 0), y = typeof o.end == "number" ? o.end : s.length, m = o.mode, l = o.measure || g;
      return m === "pre" ? p(l, s, f, y, c) : h(l, s, f, y, c, m);
    };
    function a(i, s, o, c) {
      var f = i.indexOf(s, o);
      return f === -1 || f > c ? c : f;
    }
    function d(i) {
      return r.test(i);
    }
    function p(i, s, o, c, f) {
      for (var y = [], m = o, l = o; l < c && l < s.length; l++) {
        var A = s.charAt(l), v = t.test(A);
        if (v || l === c - 1) {
          var u = v ? l : l + 1, x = i(s, m, u, f);
          y.push(x), m = l + 1;
        }
      }
      return y;
    }
    function h(i, s, o, c, f, y) {
      var m = [], l = f;
      for (y === "nowrap" && (l = Number.MAX_VALUE); o < c && o < s.length; ) {
        for (var A = a(s, e, o, c); o < A && d(s.charAt(o)); )
          o++;
        var v = i(s, o, A, l), u = o + (v.end - v.start), x = u + e.length;
        if (u < A) {
          for (; u > o && !d(s.charAt(u)); )
            u--;
          if (u === o)
            x > o + e.length && x--, u = x;
          else
            for (x = u; u > o && d(s.charAt(u - e.length)); )
              u--;
        }
        if (u >= o) {
          var w = i(s, o, u, l);
          m.push(w);
        }
        o = x;
      }
      return m;
    }
    function g(i, s, o, c) {
      var f = Math.min(c, o - s);
      return {
        start: s,
        end: s + f
      };
    }
  })($)), $.exports;
}
var gt = pt();
const mt = /* @__PURE__ */ dt(gt);
function yt(n) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  for (const a of n.chars)
    t.set(a.id, a);
  const r = n.kernings ?? [];
  for (const { first: a, second: d, amount: p } of r)
    e.has(a) || e.set(a, /* @__PURE__ */ new Map()), e.get(a).set(d, p);
  return { glyphLookup: t, kerningLookup: e };
}
function nt(n, t, e) {
  if (!t || !e) return 0;
  const r = n.get(t.id);
  return r ? r.get(e.id) ?? 0 : 0;
}
function wt(n, t, e, r, a, d, p, h, g) {
  let i = 0, s = 0, o = null;
  const c = Math.min(d.length, h), f = g * (1 + r / 100);
  let y = p;
  for (; y < c; y++) {
    const m = d.charCodeAt(y), l = n.get(m);
    if (!l) {
      o = null;
      continue;
    }
    i += nt(t, o, l);
    const v = i + l.xoffset * e + l.width * e, u = l.xadvance * e + a;
    if (v > f && f !== Number.MAX_VALUE)
      break;
    s = Math.max(s, v), i += u, o = l;
  }
  return {
    start: p,
    end: y,
    width: s
  };
}
function xt(n) {
  const { font: t, metrics: e } = n, { glyphLookup: r, kerningLookup: a } = yt(t), d = ["pre", "nowrap"];
  let p;
  d.includes(e.fontCssStyles.whiteSpace) && (p = e.fontCssStyles.whiteSpace);
  const h = e.fontCssStyles.fontSize / t.info?.size, g = 0.5, i = mt.lines(e.text, {
    width: e.widthPx,
    mode: p,
    measure: (w, C, b, M) => wt(r, a, h, g, e.fontCssStyles.letterSpacingPx, w, C, b, M)
  }), s = [], o = e.fontCssStyles.lineHeightPx || t.common.lineHeight, f = t.common.base * h - e.canvasRenderMeasurements.baselineOffsetTop;
  let y = 0;
  i.forEach((w, C) => {
    let b = 0, M = 0;
    const D = -(C * o), G = w.start, N = w.end, _ = [];
    let O = null;
    for (let U = G; U < N; U++) {
      const z = e.text.charCodeAt(U), B = r.get(z);
      if (!B) {
        O = null;
        continue;
      }
      b += nt(a, O, B);
      const j = b + B.xoffset * h, rt = D - B.yoffset * h - B.height * h, Y = B.width * h, ct = B.height * h, ht = {
        x: j,
        y: rt + f
      };
      _.push({
        index: y++,
        char: B.char || String.fromCharCode(z),
        code: z,
        lineIndex: C,
        bottomLeftPosition: ht,
        size: {
          width: Y,
          height: ct
        },
        atlas: B
      });
      const at = j + Y;
      M = Math.max(M, at), b += B.xadvance * h + e.fontCssStyles.letterSpacingPx, O = B;
    }
    const F = e.fontCssStyles.textAlign;
    let P = 0;
    F === "center" ? P = (e.widthPx - M) / 2 : (F === "right" || F === "end") && (P = e.widthPx - M);
    for (const U of _)
      U.bottomLeftPosition.x += P, s.push(U);
  });
  const m = o * i.length, l = e.widthPx, { textAlign: A, verticalAlign: v } = e.fontCssStyles, u = v === "center" ? m / 2 : v === "bottom" ? m : 0, x = A === "center" ? -l / 2 : A === "right" || A === "end" ? -l : 0;
  for (const w of s)
    w.bottomLeftPosition.x += x, w.bottomLeftPosition.y += u;
  return {
    glyphs: s,
    lines: i,
    width: l,
    height: m
  };
}
function St(n) {
  const { glyphs: t, font: e } = n, r = t.length, a = e.common.scaleW, d = e.common.scaleH, p = new Uint32Array(r * 6), h = new Float32Array(r * 4 * 3), g = new Float32Array(r * 4 * 2), i = new Float32Array(r * 4 * 2), s = new Uint32Array(r * 4);
  return t.forEach((o, c) => {
    const { atlas: f } = o, y = o.bottomLeftPosition.x, m = o.bottomLeftPosition.y, l = o.size.width, A = o.size.height, v = m + A, u = c * 12, x = c * 8, w = c * 8, C = c * 6, b = c * 4, M = c * 4;
    h[u + 0] = y, h[u + 1] = v, h[u + 2] = 0, h[u + 3] = y + l, h[u + 4] = v, h[u + 5] = 0, h[u + 6] = y + l, h[u + 7] = m, h[u + 8] = 0, h[u + 9] = y, h[u + 10] = m, h[u + 11] = 0;
    const D = f.x / a, G = f.y / d, N = (f.x + f.width) / a, O = 1 - (f.y + f.height) / d, F = 1 - G;
    g[x + 0] = D, g[x + 1] = F, g[x + 2] = N, g[x + 3] = F, g[x + 4] = N, g[x + 5] = O, g[x + 6] = D, g[x + 7] = O;
    const P = y + l / 2, U = m + A / 2;
    i[w + 0] = P, i[w + 1] = U, i[w + 2] = P, i[w + 3] = U, i[w + 4] = P, i[w + 5] = U, i[w + 6] = P, i[w + 7] = U, s[M] = c, s[M + 1] = c, s[M + 2] = c, s[M + 3] = c, p[C] = b, p[C + 1] = b + 2, p[C + 2] = b + 1, p[C + 3] = b, p[C + 4] = b + 3, p[C + 5] = b + 2;
  }), {
    positions: h,
    uvs: g,
    centers: i,
    indices: p,
    glyphIndices: s,
    glyphCount: r
  };
}
class ot extends S.BufferGeometry {
  width;
  height;
  verticalAlign = "top";
  textAlign = "left";
  currentMetrics;
  // Metrics last used to generate the geometry
  currentGlyphCount = null;
  font;
  get textStyles() {
    const { opacity: t, color: e, ...r } = this.currentMetrics?.fontCssStyles || {};
    return r;
  }
  get text() {
    return this.currentMetrics?.text;
  }
  constructor(t) {
    super(), this.font = t.font, this.update(t.metrics);
  }
  computeBoundingBox() {
    const t = this.textAlign === "center" ? -this.width / 2 : this.textAlign === "right" || this.textAlign === "end" ? -this.width : 0, e = this.verticalAlign === "center" ? -this.height / 2 : this.verticalAlign === "top" ? -this.height : 0;
    this.boundingBox = new S.Box3(
      new S.Vector3(t, e, 0),
      new S.Vector3(t + this.width, e + this.height, 0)
    );
  }
  update(t) {
    const { glyphs: e, width: r, height: a } = xt({ metrics: t, font: this.font }), { positions: d, uvs: p, centers: h, indices: g, glyphIndices: i, glyphCount: s } = St({ glyphs: e, font: this.font });
    this.width = r, this.height = a, this.verticalAlign = t.fontCssStyles.verticalAlign, this.textAlign = t.fontCssStyles.textAlign, this.currentGlyphCount == s ? (this.attributes.position.array.set(d), this.attributes.uv.array.set(p), this.attributes.center.array.set(h), this.attributes.position.needsUpdate = !0, this.attributes.uv.needsUpdate = !0, this.attributes.center.needsUpdate = !0) : (this.setAttribute("position", new S.BufferAttribute(d, 3)), this.setAttribute("uv", new S.BufferAttribute(p, 2)), this.setAttribute("center", new S.BufferAttribute(h, 2)), this.setAttribute("glyphIndices", new S.BufferAttribute(i, 1)), this.setIndex(new S.BufferAttribute(g, 1))), this.computeBoundingBox(), this.computeBoundingSphere(), this.currentMetrics = t, this.currentGlyphCount = s;
  }
}
class st extends S.NodeMaterial {
  map;
  // MSDF atlas texture
  colorUniform = T(new S.Color("#ff0000"));
  isSmoothUniform = T(0);
  thresholdUniform = T(0.2);
  defaultColorNode;
  defaultOpacityNode;
  // Getters & Setters
  get color() {
    return `#${this.colorUniform.value.getHexString()}`;
  }
  set color(t) {
    this.colorUniform.value.set(t);
  }
  get isSmooth() {
    return !!this.isSmoothUniform.value;
  }
  set isSmooth(t) {
    this.isSmoothUniform.value = t ? 1 : 0;
  }
  get threshold() {
    return this.thresholdUniform.value;
  }
  set threshold(t) {
    this.thresholdUniform.value = S.MathUtils.clamp(t, 0, 1);
  }
  constructor(t) {
    super();
    const { fontAtlas: e, metrics: r } = t;
    this.alphaTest = 0.01, this.transparent = !0, this.map = e, this.update(r);
    const a = r.fontCssStyles.fontSize < 20 ? 1 : 0;
    this.isSmoothUniform.value = a;
    const d = new S.Color("#000000"), p = 0, h = T(d), g = T(p), i = 1.4142135623730951 / 2, s = (C, b, M) => K(J(C, b), J(K(C, b), M)), o = lt(this.map, ut()), c = I(s(o.r, o.g, o.b), 0.5);
    let f = X(W(E(c, V(c)), 0.5), 0, 1);
    const y = q(I(this.thresholdUniform, i), W(this.thresholdUniform, i), c);
    f = H(f, y, this.isSmoothUniform);
    const m = W(c, k(g, 0.5)), l = W(c, k(g, 0.5));
    let A = X(W(E(m, V(m)), 0.5), 0, 1), v = Q(X(W(E(l, V(l)), 0.5), 0, 1));
    const u = q(I(this.thresholdUniform, i), W(this.thresholdUniform, i), m), x = Q(q(I(this.thresholdUniform, i), W(this.thresholdUniform, i), l));
    A = H(A, u, this.isSmoothUniform), v = H(v, x, this.isSmoothUniform);
    const w = k(A, v);
    this.defaultColorNode = H(this.colorUniform, h, w), this.defaultOpacityNode = k(ft, W(f, w)), this.colorNode = this.defaultColorNode, this.opacityNode = this.defaultOpacityNode;
  }
  update(t) {
    this.colorUniform.value.set(t.fontCssStyles.color), this.opacity = t.fontCssStyles.opacity, this.needsUpdate = !0;
  }
}
const vt = {
  widthPx: 500,
  fontFamily: "Roboto",
  fontSize: 16,
  fontWeight: "400",
  fontStyle: "normal",
  lineHeightPx: 16,
  letterSpacingPx: 0,
  textAlign: "left",
  verticalAlign: "top",
  whiteSpace: "normal",
  color: "#ff0000",
  opacity: 1
  // strokeColor: '#000000',
  // strokeWidth: 0,
};
let L = null;
function At() {
  if (L)
    return L;
  const n = document.createElement("canvas");
  if (n.width = 2, n.height = 2, L = n.getContext("2d"), !L)
    throw new Error("Unable to acquire 2D context for font measurements.");
  return L;
}
function R(n) {
  if (n === "normal" || n === "" || n === "initial" || n === "inherit")
    return NaN;
  if (n.endsWith("px"))
    return parseFloat(n);
  const t = parseFloat(n);
  return Number.isFinite(t) ? t : NaN;
}
function bt(n) {
  const t = window.getComputedStyle(n), { width: e } = n.getBoundingClientRect();
  return {
    widthPx: e,
    fontFamily: t.fontFamily,
    fontSize: R(t.fontSize) || 16,
    fontWeight: t.fontWeight,
    fontStyle: t.fontStyle,
    lineHeightPx: Mt(t, R(t.fontSize) || 16),
    letterSpacingPx: Ut(t),
    textAlign: t.textAlign || "left",
    verticalAlign: "top",
    whiteSpace: t.whiteSpace || "normal",
    color: t.color,
    opacity: parseFloat(t.opacity) || 1
    // strokeColor: style.webkitTextStrokeColor,
    // strokeWidth: parseFloat(style.webkitTextStrokeWidth) || 0,
  };
}
const Ct = 1.2;
function Mt(n, t) {
  const e = R(n.lineHeight);
  return Number.isFinite(e) ? e : t * Ct;
}
function Ut(n) {
  const t = n.letterSpacing;
  return !t || t === "normal" ? 0 : R(t) || 0;
}
function it(n, t) {
  const e = At();
  e.font = `${n.fontStyle} ${n.fontWeight} ${n.fontSize}px ${n.fontFamily}`, e.textAlign = n.textAlign;
  const r = e.measureText(t), a = r.actualBoundingBoxAscent ?? 0, d = r.actualBoundingBoxDescent ?? 0, p = r.fontBoundingBoxAscent ?? a, h = r.fontBoundingBoxDescent ?? d, g = Math.max(0, n.lineHeightPx - (a + d)), i = a + g * 0.5, s = d + g * 0.5;
  return {
    width: r.width,
    actualAscent: a,
    actualDescent: d,
    fontAscent: p,
    fontDescent: h,
    baselineOffsetTop: i,
    baselineOffsetBottom: s,
    lineGap: g
  };
}
function tt(n) {
  const t = bt(n), e = it(t, n.textContent ?? ""), { width: r } = n.getBoundingClientRect();
  return {
    text: n.textContent ?? "",
    fontCssStyles: t,
    canvasRenderMeasurements: e,
    widthPx: r
  };
}
function et(n) {
  const t = { ...vt, ...n.textStyles }, e = it(t, n.text);
  return {
    text: n.text,
    fontCssStyles: t,
    canvasRenderMeasurements: e,
    widthPx: n.textStyles?.widthPx || e.width
  };
}
class Pt extends S.Mesh {
  constructor(t, e) {
    const r = et(t), a = new ot({ metrics: r, font: e.data }), d = new st({ fontAtlas: e.atlas, metrics: r });
    super(a, d);
  }
  update(t) {
    const e = this.getCurrentOptions(), r = { ...e, ...t, textStyles: { ...e.textStyles, ...t.textStyles } }, a = et(r);
    this.geometry.update(a), this.material.update(a);
  }
  getCurrentOptions() {
    return {
      text: this.geometry.text,
      textStyles: {
        ...this.geometry.textStyles,
        color: this.material.color,
        opacity: this.material.opacity
      }
    };
  }
}
class Ot extends S.Mesh {
  element;
  constructor(t, e) {
    const r = tt(t), a = new ot({ metrics: r, font: e.data }), d = new st({ fontAtlas: e.atlas, metrics: r });
    super(a, d), this.element = t;
  }
  // Update the transform of the mesh to match the position of a DOM element on a perpendicular plane at a given depth from the camera
  update(t, e = 5) {
    if (!this.element) {
      console.log("Unable to align MSDFText with element when using the fromString constructor");
      return;
    }
    const { top: r, left: a } = this.element.getBoundingClientRect(), d = t.fov * (Math.PI / 180), p = 2 * Math.abs(e) * Math.tan(d / 2), h = p * t.aspect, g = new S.Vector3(
      -(h / 2) + a / window.innerWidth * h,
      p / 2 - r / window.innerHeight * p,
      -e
    ), i = new S.Matrix4();
    i.compose(t.position, t.quaternion, new S.Vector3(1, 1, 1));
    const s = g.clone().applyMatrix4(i), o = new S.Quaternion().setFromRotationMatrix(i), c = h / window.innerWidth;
    this.scale.set(c, c, 1), this.position.copy(s), this.quaternion.copy(o);
    const f = tt(this.element);
    this.geometry.update(f), this.material.update(f);
  }
}
export {
  Pt as MSDFText,
  ot as MSDFTextGeometry,
  st as MSDFTextNodeMaterial,
  Ot as SyncMSDFText
};
