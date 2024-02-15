var ae = Object.defineProperty;
var re = (e, a, t) => a in e ? ae(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var i = (e, a, t) => (re(e, typeof a != "symbol" ? a + "" : a, t), t);
import { defineComponent as ne, ref as c, toRefs as se, watch as m, toRef as H, nextTick as le, onMounted as ie, onBeforeUnmount as oe, openBlock as u, createElementBlock as h, normalizeClass as ue, createElementVNode as g, Fragment as D, renderList as p, toDisplayString as U, normalizeStyle as k, createCommentVNode as w, renderSlot as b } from "vue";
import he, { createSingleton as de } from "tippy.js";
const L = class {
  constructor(a, t, s, o) {
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
      const l = t.length > 0 ? Math.min(...t.map((_) => this.parseDate(_.date).getFullYear())) : (/* @__PURE__ */ new Date()).getFullYear() - 10;
      this.startDate = /* @__PURE__ */ new Date(), this.startDate.setFullYear(l);
    }
    this.numSlices = (this.endDate.getFullYear() - this.startDate.getFullYear() + 1) * 2, this.numItems = L.MONTHS_IN_ROW, this._values = t;
  }
  set values(a) {
    this.max = Math.ceil(Math.max(...a.map((s) => s.count)) / 5 * 4), this._values = a;
    const t = a.length > 0 ? Math.min(...a.map((s) => this.parseDate(s.date).getFullYear())) : (/* @__PURE__ */ new Date()).getFullYear() - 10;
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
    return L.DAYS_IN_WEEK - 1 - this.endDate.getDay();
  }
  getDaysCount() {
    return L.DAYS_IN_ONE_YEAR + 1 + this.getCountEmptyDaysAtStart() + this.getCountEmptyDaysAtEnd();
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
let n = L;
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
}), i(n, "DEFAULT_TOOLTIP_UNIT", "contributions"), i(n, "DAYS_IN_ONE_YEAR", 365), i(n, "DAYS_IN_WEEK", 7), i(n, "MONTHS_IN_ONE_YEAR", 12), i(n, "MONTHS_IN_ROW", 6), i(n, "SQUARE_SIZE", 10);
const _e = /* @__PURE__ */ ne({
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
    const a = n.SQUARE_SIZE / 5, t = n.SQUARE_SIZE + a, s = Math.ceil(n.SQUARE_SIZE * 2.5), o = t * 3, l = n.SQUARE_SIZE + n.SQUARE_SIZE / 2, _ = n.SQUARE_SIZE + n.SQUARE_SIZE / 2, d = `translate(${s}, ${l})`, I = c(null), R = c(/* @__PURE__ */ new Date()), E = c(new n(e.endDate, e.values, e.max)), A = c(0), T = c(0), Q = c("0 0 0 0"), Z = c("0 0 0 0"), F = c(""), N = c(""), Y = c(""), y = c({}), O = c(e.rangeColor || (e.darkMode ? n.DEFAULT_RANGE_COLOR_DARK : n.DEFAULT_RANGE_COLOR_LIGHT)), { values: G, tooltipUnit: z, tooltipFormatter: K, noDataText: V, max: q, vertical: W, locale: J } = se(e), v = /* @__PURE__ */ new Map();
    let S;
    function B() {
      v.clear(), S ? S.setInstances(Array.from(v.values())) : S = de(Array.from(v.values()), {
        overrides: [],
        moveTransition: "transform 0.1s ease-out",
        allowHTML: !0
      });
    }
    function j(r) {
      if (e.tooltip) {
        if (r.count !== void 0)
          return e.tooltipFormatter ? e.tooltipFormatter(r, e.tooltipUnit) : `<b>${r.count} ${e.tooltipUnit}</b> ${y.value.on} ${y.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`;
        if (e.noDataText !== !1)
          return `<b>No ${e.tooltipUnit}</b> ${y.value.on} ${y.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`;
      }
    }
    function x(r) {
      return e.vertical ? `translate(0, ${t * E.value.numSlices - (r + 1) * t})` : `translate(${r * t}, 0)`;
    }
    function X(r) {
      return e.vertical ? `translate(${r * t}, 0)` : `translate(0, ${r * t})`;
    }
    function ee(r) {
      return e.vertical ? { x: 0, y: t * E.value.numSlices - t * (r * 2) - t / 4 } : { x: t * r * 2, y: t - a };
    }
    m([H(e, "rangeColor"), H(e, "darkMode")], ([r, f]) => {
      O.value = r || (f ? n.DEFAULT_RANGE_COLOR_DARK : n.DEFAULT_RANGE_COLOR_LIGHT);
    }), m(W, (r) => {
      r ? (A.value = s + t * n.MONTHS_IN_ROW + o, T.value = l + t * E.value.numSlices + a, F.value = `translate(${s}, 0)`, N.value = `translate(0, ${l})`) : (A.value = s + t * E.value.numSlices + a, T.value = l + t * n.MONTHS_IN_ROW, F.value = `translate(0, ${l})`, N.value = `translate(${s}, 0)`);
    }, { immediate: !0 }), m([A, T], ([r, f]) => Q.value = ` 0 0 ${r} ${f}`, { immediate: !0 }), m([A, T, O], ([r, f, M]) => {
      Y.value = W.value ? `translate(${s + t * n.MONTHS_IN_ROW}, ${l})` : `translate(${r - t * M.length - 30}, ${f - _})`;
    }, { immediate: !0 }), m(J, (r) => y.value = r ? { ...n.DEFAULT_LOCALE, ...r } : n.DEFAULT_LOCALE, { immediate: !0 }), m(O, (r) => Z.value = `0 0 ${n.SQUARE_SIZE * (r.length + 1)} ${n.SQUARE_SIZE}`, { immediate: !0 }), m(
      [G, z, K, V, q, O],
      () => {
        E.value = new n(e.endDate, e.values, e.max), v.forEach((r) => r.destroy()), le(B);
      }
    ), ie(B), oe(() => {
      S == null || S.destroy(), v.forEach((r) => r.destroy());
    });
    function te(r) {
      if (S && r.target && r.target.classList.contains("vch__day__square") && r.target.dataset.sliceIndex !== void 0 && r.target.dataset.itemIndex !== void 0) {
        const f = Number(r.target.dataset.sliceIndex), M = Number(r.target.dataset.itemIndex);
        if (!isNaN(f) && !isNaN(M)) {
          const C = j(E.value.calendar[f][M]);
          if (C) {
            const $ = v.get(r.target);
            $ ? $.setContent(C) : $ || (v.set(r.target, he(r.target, { content: C })), S.setInstances(Array.from(v.values())));
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
      BOTTOM_SECTION_HEIGHT: _,
      svg: I,
      heatmap: E,
      now: R,
      width: A,
      height: T,
      viewbox: Q,
      daysLabelWrapperTransform: F,
      monthsLabelWrapperTransform: N,
      yearWrapperTransform: d,
      legendWrapperTransform: Y,
      lo: y,
      legendViewbox: Z,
      curRangeColor: O,
      getSlicePosition: x,
      getItemPosition: X,
      getYearLabelPosition: ee,
      initTippyLazy: te
    };
  }
});
const ce = (e, a) => {
  const t = e.__vccOpts || e;
  for (const [s, o] of a)
    t[s] = o;
  return t;
}, ge = ["viewBox"], Ee = ["transform"], ve = ["x", "y"], Se = ["transform"], fe = ["x"], me = ["rx", "ry", "width", "height", "x", "y"], ye = ["x", "y"], De = ["transform"], Ie = ["transform"], Re = ["rx", "ry", "transform", "width", "height", "data-slice-index", "data-item-index", "onClick"], Ae = {
  key: 0,
  class: "vch__legend"
}, Te = { class: "vch__legend-left" }, Oe = { class: "vch__legend-right" }, pe = { class: "vch__legend" }, Ue = ["viewBox", "height"], Le = { class: "vch__legend__wrapper" }, Me = ["rx", "ry", "width", "height", "x"];
function we(e, a, t, s, o, l) {
  return u(), h("div", {
    class: ue({ vch__container: !0, "dark-mode": e.darkMode })
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
        (u(!0), h(D, null, p(e.heatmap.yearsToHaveInlabels, (_, d) => (u(), h("text", {
          class: "vch__month__label",
          key: d,
          x: e.getYearLabelPosition(d).x,
          y: e.getYearLabelPosition(d).y
        }, U(_), 9, ve))), 128))
      ], 8, Ee),
      e.vertical ? (u(), h("g", {
        key: 0,
        class: "vch__legend__wrapper",
        transform: e.legendWrapperTransform
      }, [
        g("text", {
          x: e.SQUARE_SIZE * 1.25,
          y: "8"
        }, U(e.lo.less), 9, fe),
        (u(!0), h(D, null, p(e.curRangeColor, (_, d) => (u(), h("rect", {
          key: d,
          rx: e.round,
          ry: e.round,
          style: k({ fill: _ }),
          width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
          height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
          x: e.SQUARE_SIZE * 1.75,
          y: e.SQUARE_SIZE * (d + 1)
        }, null, 12, me))), 128)),
        g("text", {
          x: e.SQUARE_SIZE * 1.25,
          y: e.SQUARE_SIZE * (e.curRangeColor.length + 2) - e.SQUARE_BORDER_SIZE
        }, U(e.lo.more), 9, ye)
      ], 8, Se)) : w("", !0),
      g("g", {
        class: "vch__year__wrapper",
        transform: e.yearWrapperTransform,
        onMouseover: a[0] || (a[0] = (..._) => e.initTippyLazy && e.initTippyLazy(..._))
      }, [
        (u(!0), h(D, null, p(e.heatmap.calendar, (_, d) => (u(), h("g", {
          class: "vch__slice__wrapper",
          key: d,
          transform: e.getSlicePosition(d)
        }, [
          (u(!0), h(D, null, p(_, (I, R) => (u(), h(D, { key: R }, [
            I.date < e.now ? (u(), h("rect", {
              key: 0,
              class: "vch__day__square",
              rx: e.round,
              ry: e.round,
              transform: e.getItemPosition(R),
              width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
              height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
              style: k({ fill: e.curRangeColor[I.colorIndex] }),
              "data-slice-index": d,
              "data-item-index": R,
              onClick: (E) => e.$emit("itemClick", I)
            }, null, 12, Re)) : w("", !0)
          ], 64))), 128))
        ], 8, Ie))), 128))
      ], 40, De)
    ], 8, ge)),
    e.vertical ? w("", !0) : (u(), h("div", Ae, [
      b(e.$slots, "legend", {}, () => [
        g("div", Te, [
          b(e.$slots, "vch__legend-left")
        ]),
        g("div", Oe, [
          b(e.$slots, "legend-right", {}, () => [
            g("div", pe, [
              g("div", null, U(e.lo.less), 1),
              e.vertical ? w("", !0) : (u(), h("svg", {
                key: 0,
                class: "vch__external-legend-wrapper",
                viewBox: e.legendViewbox,
                height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE
              }, [
                g("g", Le, [
                  (u(!0), h(D, null, p(e.curRangeColor, (_, d) => (u(), h("rect", {
                    key: d,
                    rx: e.round,
                    ry: e.round,
                    style: k({ fill: _ }),
                    width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
                    height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
                    x: e.SQUARE_SIZE * d
                  }, null, 12, Me))), 128))
                ])
              ], 8, Ue)),
              g("div", null, U(e.lo.more), 1)
            ])
          ])
        ])
      ])
    ]))
  ], 2);
}
const P = /* @__PURE__ */ ce(_e, [["render", we]]);
function Fe(e) {
  e.component(P.name, P);
}
const ke = { install: Fe };
export {
  P as CalendarHeatmap,
  n as Heatmap,
  ke as default
};
//# sourceMappingURL=vue3-calendar-heatmap.es.js.map
