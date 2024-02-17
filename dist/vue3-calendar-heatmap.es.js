var re = Object.defineProperty;
var ne = (e, a, t) => a in e ? re(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var i = (e, a, t) => (ne(e, typeof a != "symbol" ? a + "" : a, t), t);
import { defineComponent as se, ref as c, toRefs as le, watch as m, toRef as P, nextTick as ie, onMounted as oe, onBeforeUnmount as ue, openBlock as u, createElementBlock as h, normalizeClass as he, createElementVNode as g, Fragment as D, renderList as U, toDisplayString as L, normalizeStyle as Y, createCommentVNode as N, renderSlot as b } from "vue";
import _e, { createSingleton as de } from "tippy.js";
const y = class {
  constructor(a, t, s, o) {
    // 5 years
    i(this, "startDate");
    i(this, "endDate");
    i(this, "max");
    i(this, "numSlices");
    i(this, "numItems");
    i(this, "_values");
    i(this, "_firstFullWeekOfMonths");
    i(this, "_yearsToHaveInLabels");
    i(this, "_activities");
    i(this, "_calendar");
    if (this.endDate = this.parseDate(a), this.max = s || Math.ceil(Math.max(...t.map((l) => l.count)) / 5 * 4), o)
      this.startDate = new Date(o);
    else {
      const l = t.length > 0 ? Math.min(...t.map((d) => this.parseDate(d.date).getFullYear())) : (/* @__PURE__ */ new Date()).getFullYear() - y.DEFAULT_HISTORY_IN_YEARS;
      this.startDate = /* @__PURE__ */ new Date(), this.startDate.setFullYear(l);
    }
    this.numSlices = (this.endDate.getFullYear() - this.startDate.getFullYear() + 1) * 2, this.numItems = y.MONTHS_IN_ROW, this._values = t;
  }
  set values(a) {
    this.max = Math.ceil(Math.max(...a.map((s) => s.count)) / 5 * 4), this._values = a;
    const t = a.length > 0 ? Math.min(...a.map((s) => this.parseDate(s.date).getFullYear())) : (/* @__PURE__ */ new Date()).getFullYear() - y.DEFAULT_HISTORY_IN_YEARS;
    this.startDate = /* @__PURE__ */ new Date(), this.startDate.setFullYear(t), this.numSlices = (this.endDate.getFullYear() - this.startDate.getFullYear() + 1) * 2, this._firstFullWeekOfMonths = void 0, this._yearsToHaveInLabels = void 0, this._calendar = void 0, this._activities = void 0;
  }
  get values() {
    return this._values;
  }
  get activities() {
    var a;
    if (!this._activities) {
      this._activities = /* @__PURE__ */ new Map();
      for (let t = 0, s = this.values.length; t < s; t++) {
        const o = this.keyMonthParser(this.values[t].date), l = (((a = this._activities.get(o)) == null ? void 0 : a.count) || 0) + this.values[t].count;
        this._activities.set(o, {
          count: l,
          colorIndex: this.getColorIndex(l)
        });
      }
    }
    return this._activities;
  }
  get calendar() {
    if (!this._calendar) {
      let a = new Date(this.startDate.getFullYear(), 0, 1);
      this._calendar = new Array(this.numSlices);
      for (let t = 0, s = this._calendar.length; t < s; t++) {
        this._calendar[t] = new Array(this.numItems);
        for (let o = 0; o < this.numItems; o++) {
          const l = this.activities.get(this.keyMonthParser(a));
          this._calendar[t][o] = {
            date: new Date(a.valueOf()),
            count: l ? l.count : void 0,
            colorIndex: l ? l.colorIndex : 0
          }, a.setMonth(a.getMonth() + 1);
        }
      }
    }
    return this._calendar;
  }
  get yearsToHaveInlabels() {
    if (!this._yearsToHaveInLabels) {
      this._yearsToHaveInLabels = [];
      let a = this.startDate.getFullYear();
      const t = this.endDate.getFullYear();
      for (; a <= t; )
        this._yearsToHaveInLabels.push(a), a++;
    }
    return this._yearsToHaveInLabels;
  }
  get firstFullWeekOfMonths() {
    if (!this._firstFullWeekOfMonths) {
      const a = this.calendar;
      this._firstFullWeekOfMonths = [];
      for (let t = 1, s = a.length; t < s; t++) {
        const o = a[t - 1][0].date, l = a[t][0].date;
        (o.getFullYear() < l.getFullYear() || o.getMonth() < l.getMonth()) && this._firstFullWeekOfMonths.push({ value: l.getMonth(), index: t });
      }
    }
    return this._firstFullWeekOfMonths;
  }
  getColorIndex(a) {
    return a == null ? 0 : a <= 0 ? 1 : a >= this.max ? 5 : Math.ceil(a * 100 / this.max * 0.03) + 1;
  }
  getCountEmptyDaysAtStart() {
    return this.startDate.getDay();
  }
  getCountEmptyDaysAtEnd() {
    return y.DAYS_IN_WEEK - 1 - this.endDate.getDay();
  }
  getDaysCount() {
    return y.DAYS_IN_ONE_YEAR + 1 + this.getCountEmptyDaysAtStart() + this.getCountEmptyDaysAtEnd();
  }
  shiftDate(a, t) {
    const s = new Date(a);
    return s.setDate(s.getDate() + t), s;
  }
  parseDate(a) {
    return a instanceof Date ? a : new Date(a);
  }
  keyDayParser(a) {
    const t = this.parseDate(a);
    return String(t.getFullYear()) + String(t.getMonth()).padStart(2, "0") + String(t.getDate()).padStart(2, "0");
  }
  keyMonthParser(a) {
    const t = this.parseDate(a);
    return String(t.getFullYear()) + String(t.getMonth()).padStart(2, "0");
  }
};
let n = y;
i(n, "DEFAULT_RANGE_COLOR_LIGHT", ["#ebedf0", "#dae2ef", "#c0ddf9", "#73b3f3", "#3886e1", "#17459e"]), i(n, "DEFAULT_RANGE_COLOR_DARK", ["#1f1f22", "#1e334a", "#1d466c", "#1d5689", "#1d69ac", "#1B95D1"]), // other color candidates
// static readonly DEFAULT_RANGE_COLOR_LIGHT = [ '#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39' ];
// static readonly DEFAULT_RANGE_COLOR_DARK  = [ '#161b22', '#0e4429', '#006d32', '#26a641', '#39d353' ];
// static readonly DEFAULT_RANGE_COLOR_DARK    = [ '#011526', '#012E40', '#025959', '#02735E', '#038C65' ];
// static readonly DEFAULT_RANGE_COLOR_DARK    = [ '#161b22', '#015958', '#008F8C', '#0CABA8', '#0FC2C0' ];
// static readonly DEFAULT_RANGE_COLOR_DARK    = [ '#012030', '#13678A', '#45C4B0', '#9AEBA3', '#DAFDBA' ];
i(n, "DEFAULT_LOCALE", {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  on: "in",
  less: "Less",
  more: "More"
}), i(n, "DEFAULT_TOOLTIP_UNIT", "contributions"), i(n, "DAYS_IN_ONE_YEAR", 365), i(n, "DAYS_IN_WEEK", 7), i(n, "MONTHS_IN_ONE_YEAR", 12), i(n, "MONTHS_IN_ROW", 6), i(n, "SQUARE_SIZE", 10), i(n, "DEFAULT_HISTORY_IN_YEARS", 5);
const ce = /* @__PURE__ */ se({
  name: "CalendarHeatmap",
  props: {
    endDate: {
      required: !0
    },
    max: {
      type: Number
    },
    startDate: {},
    rangeColor: {
      type: Array
    },
    values: {
      type: Array,
      required: !0
    },
    locale: {
      type: Object
    },
    tooltip: {
      type: Boolean,
      default: !0
    },
    tooltipUnit: {
      type: String,
      default: n.DEFAULT_TOOLTIP_UNIT
    },
    tooltipFormatter: {
      type: Function
    },
    vertical: {
      type: Boolean,
      default: !1
    },
    noDataText: {
      type: [Boolean, String],
      default: null
    },
    round: {
      type: Number,
      default: 0
    },
    darkMode: Boolean
  },
  emits: ["itemClick"],
  setup(e) {
    const a = n.SQUARE_SIZE / 5, t = n.SQUARE_SIZE + a, s = Math.ceil(n.SQUARE_SIZE * 2.5), o = t * 3, l = n.SQUARE_SIZE + n.SQUARE_SIZE / 2, d = n.SQUARE_SIZE + n.SQUARE_SIZE / 2, _ = `translate(${s}, ${l})`, R = c(null), A = c(/* @__PURE__ */ new Date()), v = c(new n(e.endDate, e.values, e.max)), T = c(0), O = c(0), Q = c("0 0 0 0"), Z = c("0 0 0 0"), w = c(""), C = c(""), W = c(""), I = c({}), p = c(e.rangeColor || (e.darkMode ? n.DEFAULT_RANGE_COLOR_DARK : n.DEFAULT_RANGE_COLOR_LIGHT)), { values: z, tooltipUnit: K, tooltipFormatter: V, noDataText: q, max: J, vertical: F, locale: j } = le(e), S = /* @__PURE__ */ new Map();
    let f;
    function B() {
      S.clear(), f ? f.setInstances(Array.from(S.values())) : f = de(Array.from(S.values()), {
        overrides: [],
        moveTransition: "transform 0.1s ease-out",
        allowHTML: !0
      });
    }
    function x(r) {
      if (e.tooltip) {
        if (r.count !== void 0)
          return e.tooltipFormatter ? e.tooltipFormatter(r, e.tooltipUnit) : `<b>${r.count} ${e.tooltipUnit}</b> ${I.value.on} ${I.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`;
        if (e.noDataText !== !1)
          return `<b>No ${e.tooltipUnit}</b> ${I.value.on} ${I.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`;
      }
    }
    function X(r) {
      return e.vertical ? `translate(0, ${t * v.value.numSlices - (r + 1) * t})` : `translate(${r * t}, 0)`;
    }
    function ee(r) {
      return e.vertical ? `translate(${r * t}, 0)` : `translate(0, ${r * t})`;
    }
    function te(r) {
      return e.vertical ? { x: 0, y: t * v.value.numSlices - t * (r * 2) - t / 4 } : { x: t * r * 2, y: t - a };
    }
    function H() {
      F.value ? (T.value = s + t * n.MONTHS_IN_ROW + o, O.value = l + t * v.value.numSlices + a, w.value = `translate(${s}, 0)`, C.value = `translate(0, ${l})`) : (T.value = s + t * v.value.numSlices + a, O.value = l + t * n.MONTHS_IN_ROW, w.value = `translate(0, ${l})`, C.value = `translate(${s}, 0)`);
    }
    m([P(e, "rangeColor"), P(e, "darkMode")], ([r, E]) => {
      p.value = r || (E ? n.DEFAULT_RANGE_COLOR_DARK : n.DEFAULT_RANGE_COLOR_LIGHT);
    }), m(F, (r) => {
      H();
    }, { immediate: !0 }), m([T, O], ([r, E]) => {
      F.value ? E < 119 && (E = 119) : r < 175 && (r = 175), Q.value = ` 0 0 ${r} ${E}`;
    }, { immediate: !0 }), m([T, O, p], ([r, E, M]) => {
      W.value = F.value ? `translate(${s + t * n.MONTHS_IN_ROW}, ${l})` : `translate(${r - t * M.length - 30}, ${E - d})`;
    }, { immediate: !0 }), m(j, (r) => I.value = r ? { ...n.DEFAULT_LOCALE, ...r } : n.DEFAULT_LOCALE, { immediate: !0 }), m(p, (r) => Z.value = `0 0 ${n.SQUARE_SIZE * (r.length + 1)} ${n.SQUARE_SIZE}`, { immediate: !0 }), m(
      [z, K, V, q, J, p],
      () => {
        v.value = new n(e.endDate, e.values, e.max), S.forEach((r) => r.destroy()), ie(B), H();
      },
      { deep: !0 }
    ), oe(B), ue(() => {
      f == null || f.destroy(), S.forEach((r) => r.destroy());
    });
    function ae(r) {
      if (f && r.target && r.target.classList.contains("vch__day__square") && r.target.dataset.sliceIndex !== void 0 && r.target.dataset.itemIndex !== void 0) {
        const E = Number(r.target.dataset.sliceIndex), M = Number(r.target.dataset.itemIndex);
        if (!isNaN(E) && !isNaN(M)) {
          const $ = x(v.value.calendar[E][M]);
          if ($) {
            const k = S.get(r.target);
            k ? k.setContent($) : k || (S.set(r.target, _e(r.target, { content: $ })), f.setInstances(Array.from(S.values())));
          }
        }
      }
    }
    return {
      SQUARE_BORDER_SIZE: a,
      SQUARE_SIZE: t,
      LEFT_SECTION_WIDTH: s,
      RIGHT_SECTION_WIDTH: o,
      TOP_SECTION_HEIGHT: l,
      BOTTOM_SECTION_HEIGHT: d,
      svg: R,
      heatmap: v,
      now: A,
      width: T,
      height: O,
      viewbox: Q,
      daysLabelWrapperTransform: w,
      monthsLabelWrapperTransform: C,
      yearWrapperTransform: _,
      legendWrapperTransform: W,
      lo: I,
      legendViewbox: Z,
      curRangeColor: p,
      getSlicePosition: X,
      getItemPosition: ee,
      getYearLabelPosition: te,
      initTippyLazy: ae
    };
  }
});
const Ee = (e, a) => {
  const t = e.__vccOpts || e;
  for (const [s, o] of a)
    t[s] = o;
  return t;
}, ge = ["viewBox"], ve = ["transform"], Se = ["x", "y"], fe = ["transform"], me = ["x"], ye = ["rx", "ry", "width", "height", "x", "y"], Ie = ["x", "y"], De = ["transform"], Re = ["transform"], Ae = ["rx", "ry", "transform", "width", "height", "data-slice-index", "data-item-index", "onClick"], Te = {
  key: 0,
  class: "vch__legend"
}, Oe = { class: "vch__legend-left" }, pe = { class: "vch__legend-right" }, Ue = { class: "vch__legend" }, Le = ["viewBox", "height"], Fe = { class: "vch__legend__wrapper" }, Me = ["rx", "ry", "width", "height", "x"];
function Ne(e, a, t, s, o, l) {
  return u(), h("div", {
    class: he({ vch__container: !0, "dark-mode": e.darkMode })
  }, [
    (u(), h("svg", {
      class: "vch__wrapper",
      ref: "svg",
      viewBox: e.viewbox
    }, [
      g("g", {
        class: "vch__months__labels__wrapper",
        transform: e.monthsLabelWrapperTransform
      }, [
        (u(!0), h(D, null, U(e.heatmap.yearsToHaveInlabels, (d, _) => (u(), h("text", {
          class: "vch__month__label",
          key: _,
          x: e.getYearLabelPosition(_).x,
          y: e.getYearLabelPosition(_).y
        }, L(d), 9, Se))), 128))
      ], 8, ve),
      e.vertical ? (u(), h("g", {
        key: 0,
        class: "vch__legend__wrapper",
        transform: e.legendWrapperTransform
      }, [
        g("text", {
          x: e.SQUARE_SIZE * 1.25,
          y: "8"
        }, L(e.lo.less), 9, me),
        (u(!0), h(D, null, U(e.curRangeColor, (d, _) => (u(), h("rect", {
          key: _,
          rx: e.round,
          ry: e.round,
          style: Y({ fill: d }),
          width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
          height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
          x: e.SQUARE_SIZE * 1.75,
          y: e.SQUARE_SIZE * (_ + 1)
        }, null, 12, ye))), 128)),
        g("text", {
          x: e.SQUARE_SIZE * 1.25,
          y: e.SQUARE_SIZE * (e.curRangeColor.length + 2) - e.SQUARE_BORDER_SIZE
        }, L(e.lo.more), 9, Ie)
      ], 8, fe)) : N("", !0),
      g("g", {
        class: "vch__year__wrapper",
        transform: e.yearWrapperTransform,
        onMouseover: a[0] || (a[0] = (...d) => e.initTippyLazy && e.initTippyLazy(...d))
      }, [
        (u(!0), h(D, null, U(e.heatmap.calendar, (d, _) => (u(), h("g", {
          class: "vch__slice__wrapper",
          key: _,
          transform: e.getSlicePosition(_)
        }, [
          (u(!0), h(D, null, U(d, (R, A) => (u(), h(D, { key: A }, [
            R.date < e.now ? (u(), h("rect", {
              key: 0,
              class: "vch__day__square",
              rx: e.round,
              ry: e.round,
              transform: e.getItemPosition(A),
              width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
              height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
              style: Y({ fill: e.curRangeColor[R.colorIndex] }),
              "data-slice-index": _,
              "data-item-index": A,
              onClick: (v) => e.$emit("itemClick", R)
            }, null, 12, Ae)) : N("", !0)
          ], 64))), 128))
        ], 8, Re))), 128))
      ], 40, De)
    ], 8, ge)),
    e.vertical ? N("", !0) : (u(), h("div", Te, [
      b(e.$slots, "legend", {}, () => [
        g("div", Oe, [
          b(e.$slots, "vch__legend-left")
        ]),
        g("div", pe, [
          b(e.$slots, "legend-right", {}, () => [
            g("div", Ue, [
              g("div", null, L(e.lo.less), 1),
              e.vertical ? N("", !0) : (u(), h("svg", {
                key: 0,
                class: "vch__external-legend-wrapper",
                viewBox: e.legendViewbox,
                height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE
              }, [
                g("g", Fe, [
                  (u(!0), h(D, null, U(e.curRangeColor, (d, _) => (u(), h("rect", {
                    key: _,
                    rx: e.round,
                    ry: e.round,
                    style: Y({ fill: d }),
                    width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
                    height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
                    x: e.SQUARE_SIZE * _
                  }, null, 12, Me))), 128))
                ])
              ], 8, Le)),
              g("div", null, L(e.lo.more), 1)
            ])
          ])
        ])
      ])
    ]))
  ], 2);
}
const G = /* @__PURE__ */ Ee(ce, [["render", Ne]]);
function we(e) {
  e.component(G.name, G);
}
const Ye = { install: we };
export {
  G as CalendarHeatmap,
  n as Heatmap,
  Ye as default
};
//# sourceMappingURL=vue3-calendar-heatmap.es.js.map
