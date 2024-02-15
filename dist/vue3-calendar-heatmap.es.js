var ae = Object.defineProperty;
var re = (e, a, t) => a in e ? ae(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var i = (e, a, t) => (re(e, typeof a != "symbol" ? a + "" : a, t), t);
import { defineComponent as ne, ref as c, toRefs as se, watch as m, toRef as H, nextTick as le, onMounted as ie, onBeforeUnmount as oe, openBlock as h, createElementBlock as _, normalizeClass as ue, createElementVNode as E, Fragment as I, renderList as p, toDisplayString as U, normalizeStyle as $, createCommentVNode as b, renderSlot as k } from "vue";
import he, { createSingleton as _e } from "tippy.js";
const L = class {
  constructor(a, t, l, o) {
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
    if (this.endDate = this.parseDate(a), this.max = l || Math.ceil(Math.max(...t.map((s) => s.count)) / 5 * 4), o)
      this.startDate = new Date(o);
    else {
      const s = t.length > 0 ? Math.min(...t.map((d) => this.parseDate(d.date).getFullYear())) : (/* @__PURE__ */ new Date()).getFullYear() - 10;
      this.startDate = /* @__PURE__ */ new Date(), this.startDate.setFullYear(s);
    }
    this.numSlices = (this.endDate.getFullYear() - this.startDate.getFullYear() + 1) * 2, this.numItems = L.MONTHS_IN_ROW, this._values = t;
  }
  set values(a) {
    this.max = Math.ceil(Math.max(...a.map((t) => t.count)) / 5 * 4), this._values = a, this._firstFullWeekOfMonths = void 0, this._yearsToHaveInLabels = void 0, this._calendar = void 0, this._activities = void 0;
  }
  get values() {
    return this._values;
  }
  get activities() {
    var a;
    if (!this._activities) {
      this._activities = /* @__PURE__ */ new Map();
      for (let t = 0, l = this.values.length; t < l; t++) {
        const o = this.keyMonthParser(this.values[t].date), s = (((a = this._activities.get(o)) == null ? void 0 : a.count) || 0) + this.values[t].count;
        this._activities.set(o, {
          count: s,
          colorIndex: this.getColorIndex(s)
        });
      }
    }
    return this._activities;
  }
  get calendar() {
    if (!this._calendar) {
      let a = new Date(this.startDate.getFullYear(), 0, 1);
      this._calendar = new Array(this.numSlices);
      for (let t = 0, l = this._calendar.length; t < l; t++) {
        this._calendar[t] = new Array(this.numItems);
        for (let o = 0; o < this.numItems; o++) {
          const s = this.activities.get(this.keyMonthParser(a));
          this._calendar[t][o] = {
            date: new Date(a.valueOf()),
            count: s ? s.count : void 0,
            colorIndex: s ? s.colorIndex : 0
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
      for (console.log(a, t); a <= t; )
        this._yearsToHaveInLabels.push(a), a++;
    }
    return console.log("Years to have in labels", this._yearsToHaveInLabels), this._yearsToHaveInLabels;
  }
  get firstFullWeekOfMonths() {
    if (!this._firstFullWeekOfMonths) {
      const a = this.calendar;
      this._firstFullWeekOfMonths = [];
      for (let t = 1, l = a.length; t < l; t++) {
        const o = a[t - 1][0].date, s = a[t][0].date;
        (o.getFullYear() < s.getFullYear() || o.getMonth() < s.getMonth()) && this._firstFullWeekOfMonths.push({ value: s.getMonth(), index: t });
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
    const l = new Date(a);
    return l.setDate(l.getDate() + t), l;
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
const de = /* @__PURE__ */ ne({
  name: "CalendarHeatmap",
  props: {
    endDate: {
      required: !0
    },
    max: {
      type: Number
    },
    startDate: {
      type: Number
    },
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
    const a = n.SQUARE_SIZE / 5, t = n.SQUARE_SIZE + a, l = Math.ceil(n.SQUARE_SIZE * 2.5), o = t * 3, s = n.SQUARE_SIZE + n.SQUARE_SIZE / 2, d = n.SQUARE_SIZE + n.SQUARE_SIZE / 2, u = `translate(${l}, ${s})`, R = c(null), D = c(/* @__PURE__ */ new Date()), g = c(new n(e.endDate, e.values, e.max)), A = c(0), T = c(0), Q = c("0 0 0 0"), Z = c("0 0 0 0"), w = c(""), N = c(""), W = c(""), y = c({}), O = c(e.rangeColor || (e.darkMode ? n.DEFAULT_RANGE_COLOR_DARK : n.DEFAULT_RANGE_COLOR_LIGHT)), { values: G, tooltipUnit: z, tooltipFormatter: K, noDataText: V, max: q, vertical: Y, locale: J } = se(e), v = /* @__PURE__ */ new Map();
    let S;
    function B() {
      v.clear(), S ? S.setInstances(Array.from(v.values())) : S = _e(Array.from(v.values()), {
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
      return e.vertical ? `translate(0, ${t * g.value.numSlices - (r + 1) * t})` : `translate(${r * t}, 0)`;
    }
    function X(r) {
      return e.vertical ? `translate(${r * t}, 0)` : `translate(0, ${r * t})`;
    }
    function ee(r) {
      return e.vertical ? { x: 0, y: t * g.value.numSlices - t * (r * 2) - t / 4 } : { x: t * r * 2, y: t - a };
    }
    m([H(e, "rangeColor"), H(e, "darkMode")], ([r, f]) => {
      O.value = r || (f ? n.DEFAULT_RANGE_COLOR_DARK : n.DEFAULT_RANGE_COLOR_LIGHT);
    }), m(Y, (r) => {
      r ? (A.value = l + t * n.MONTHS_IN_ROW + o, T.value = s + t * g.value.numSlices + a, w.value = `translate(${l}, 0)`, N.value = `translate(0, ${s})`) : (A.value = l + t * g.value.numSlices + a, T.value = s + t * n.MONTHS_IN_ROW, w.value = `translate(0, ${s})`, N.value = `translate(${l}, 0)`);
    }, { immediate: !0 }), m([A, T], ([r, f]) => Q.value = ` 0 0 ${r} ${f}`, { immediate: !0 }), m([A, T, O], ([r, f, M]) => {
      W.value = Y.value ? `translate(${l + t * n.MONTHS_IN_ROW}, ${s})` : `translate(${r - t * M.length - 30}, ${f - d})`;
    }, { immediate: !0 }), m(J, (r) => y.value = r ? { ...n.DEFAULT_LOCALE, ...r } : n.DEFAULT_LOCALE, { immediate: !0 }), m(O, (r) => Z.value = `0 0 ${n.SQUARE_SIZE * (r.length + 1)} ${n.SQUARE_SIZE}`, { immediate: !0 }), m(
      [G, z, K, V, q, O],
      () => {
        g.value = new n(e.endDate, e.values, e.max), v.forEach((r) => r.destroy()), le(B);
      }
    ), ie(B), oe(() => {
      S == null || S.destroy(), v.forEach((r) => r.destroy());
    });
    function te(r) {
      if (S && r.target && r.target.classList.contains("vch__day__square") && r.target.dataset.sliceIndex !== void 0 && r.target.dataset.itemIndex !== void 0) {
        const f = Number(r.target.dataset.sliceIndex), M = Number(r.target.dataset.itemIndex);
        if (!isNaN(f) && !isNaN(M)) {
          const C = j(g.value.calendar[f][M]);
          if (C) {
            const F = v.get(r.target);
            F ? F.setContent(C) : F || (v.set(r.target, he(r.target, { content: C })), S.setInstances(Array.from(v.values())));
          }
        }
      }
    }
    return {
      SQUARE_BORDER_SIZE: a,
      SQUARE_SIZE: t,
      LEFT_SECTION_WIDTH: l,
      RIGHT_SECTION_WIDTH: o,
      TOP_SECTION_HEIGHT: s,
      BOTTOM_SECTION_HEIGHT: d,
      svg: R,
      heatmap: g,
      now: D,
      width: A,
      height: T,
      viewbox: Q,
      daysLabelWrapperTransform: w,
      monthsLabelWrapperTransform: N,
      yearWrapperTransform: u,
      legendWrapperTransform: W,
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
  for (const [l, o] of a)
    t[l] = o;
  return t;
}, Ee = ["viewBox"], ge = ["transform"], ve = ["x", "y"], Se = ["transform"], fe = ["x"], me = ["rx", "ry", "width", "height", "x", "y"], ye = ["x", "y"], Ie = ["transform"], Re = ["transform"], De = ["rx", "ry", "transform", "width", "height", "data-slice-index", "data-item-index", "onClick"], Ae = { class: "vch__legend" }, Te = { class: "vch__legend-left" }, Oe = { class: "vch__legend-right" }, pe = { class: "vch__legend" }, Ue = ["viewBox", "height"], Le = { class: "vch__legend__wrapper" }, Me = ["rx", "ry", "width", "height", "x"];
function we(e, a, t, l, o, s) {
  return h(), _("div", {
    class: ue({ vch__container: !0, "dark-mode": e.darkMode })
  }, [
    (h(), _("svg", {
      class: "vch__wrapper",
      ref: "svg",
      viewBox: e.viewbox
    }, [
      E("g", {
        class: "vch__months__labels__wrapper",
        transform: e.monthsLabelWrapperTransform
      }, [
        (h(!0), _(I, null, p(e.heatmap.yearsToHaveInlabels, (d, u) => (h(), _("text", {
          class: "vch__month__label",
          key: u,
          x: e.getYearLabelPosition(u).x,
          y: e.getYearLabelPosition(u).y
        }, U(d), 9, ve))), 128))
      ], 8, ge),
      e.vertical ? (h(), _("g", {
        key: 0,
        class: "vch__legend__wrapper",
        transform: e.legendWrapperTransform
      }, [
        E("text", {
          x: e.SQUARE_SIZE * 1.25,
          y: "8"
        }, U(e.lo.less), 9, fe),
        (h(!0), _(I, null, p(e.curRangeColor, (d, u) => (h(), _("rect", {
          key: u,
          rx: e.round,
          ry: e.round,
          style: $({ fill: d }),
          width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
          height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
          x: e.SQUARE_SIZE * 1.75,
          y: e.SQUARE_SIZE * (u + 1)
        }, null, 12, me))), 128)),
        E("text", {
          x: e.SQUARE_SIZE * 1.25,
          y: e.SQUARE_SIZE * (e.curRangeColor.length + 2) - e.SQUARE_BORDER_SIZE
        }, U(e.lo.more), 9, ye)
      ], 8, Se)) : b("", !0),
      E("g", {
        class: "vch__year__wrapper",
        transform: e.yearWrapperTransform,
        onMouseover: a[0] || (a[0] = (...d) => e.initTippyLazy && e.initTippyLazy(...d))
      }, [
        (h(!0), _(I, null, p(e.heatmap.calendar, (d, u) => (h(), _("g", {
          class: "vch__slice__wrapper",
          key: u,
          transform: e.getSlicePosition(u)
        }, [
          (h(!0), _(I, null, p(d, (R, D) => (h(), _(I, { key: D }, [
            R.date < e.now ? (h(), _("rect", {
              key: 0,
              class: "vch__day__square",
              rx: e.round,
              ry: e.round,
              transform: e.getItemPosition(D),
              width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
              height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
              style: $({ fill: e.curRangeColor[R.colorIndex] }),
              "data-slice-index": u,
              "data-item-index": D,
              onClick: (g) => e.$emit("itemClick", R)
            }, null, 12, De)) : b("", !0)
          ], 64))), 128))
        ], 8, Re))), 128))
      ], 40, Ie)
    ], 8, Ee)),
    E("div", Ae, [
      k(e.$slots, "legend", {}, () => [
        E("div", Te, [
          k(e.$slots, "vch__legend-left")
        ]),
        E("div", Oe, [
          k(e.$slots, "legend-right", {}, () => [
            E("div", pe, [
              E("div", null, U(e.lo.less), 1),
              e.vertical ? b("", !0) : (h(), _("svg", {
                key: 0,
                class: "vch__external-legend-wrapper",
                viewBox: e.legendViewbox,
                height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE
              }, [
                E("g", Le, [
                  (h(!0), _(I, null, p(e.curRangeColor, (d, u) => (h(), _("rect", {
                    key: u,
                    rx: e.round,
                    ry: e.round,
                    style: $({ fill: d }),
                    width: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
                    height: e.SQUARE_SIZE - e.SQUARE_BORDER_SIZE,
                    x: e.SQUARE_SIZE * u
                  }, null, 12, Me))), 128))
                ])
              ], 8, Ue)),
              E("div", null, U(e.lo.more), 1)
            ])
          ])
        ])
      ])
    ])
  ], 2);
}
const P = /* @__PURE__ */ ce(de, [["render", we]]);
function Ne(e) {
  e.component(P.name, P);
}
const be = { install: Ne };
export {
  P as CalendarHeatmap,
  n as Heatmap,
  be as default
};
//# sourceMappingURL=vue3-calendar-heatmap.es.js.map
