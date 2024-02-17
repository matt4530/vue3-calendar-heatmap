(function(d,e){typeof exports=="object"&&typeof module<"u"?e(exports,require("vue"),require("tippy.js")):typeof define=="function"&&define.amd?define(["exports","vue","tippy.js"],e):(d=typeof globalThis<"u"?globalThis:d||self,e(d.CalendarHeatmap={},d.Vue,d.tippy))})(this,function(d,e,m){"use strict";var ge=Object.defineProperty;var fe=(d,e,m)=>e in d?ge(d,e,{enumerable:!0,configurable:!0,writable:!0,value:m}):d[e]=m;var i=(d,e,m)=>(fe(d,typeof e!="symbol"?e+"":e,m),m);const S=class{constructor(n,a,s,c){i(this,"startDate");i(this,"endDate");i(this,"max");i(this,"numSlices");i(this,"numItems");i(this,"_values");i(this,"_firstFullWeekOfMonths");i(this,"_yearsToHaveInLabels");i(this,"_activities");i(this,"_calendar");if(this.endDate=this.parseDate(n),this.max=s||Math.ceil(Math.max(...a.map(o=>o.count))/5*4),c)this.startDate=new Date(c);else{const o=a.length>0?Math.min(...a.map(_=>this.parseDate(_.date).getFullYear())):new Date().getFullYear()-S.DEFAULT_HISTORY_IN_YEARS;this.startDate=new Date,this.startDate.setFullYear(o)}this.numSlices=(this.endDate.getFullYear()-this.startDate.getFullYear()+1)*2,this.numItems=S.MONTHS_IN_ROW,this._values=a}set values(n){this.max=Math.ceil(Math.max(...n.map(s=>s.count))/5*4),this._values=n;const a=n.length>0?Math.min(...n.map(s=>this.parseDate(s.date).getFullYear())):new Date().getFullYear()-S.DEFAULT_HISTORY_IN_YEARS;this.startDate=new Date,this.startDate.setFullYear(a),this.numSlices=(this.endDate.getFullYear()-this.startDate.getFullYear()+1)*2,this._firstFullWeekOfMonths=void 0,this._yearsToHaveInLabels=void 0,this._calendar=void 0,this._activities=void 0}get values(){return this._values}get activities(){var n;if(!this._activities){this._activities=new Map;for(let a=0,s=this.values.length;a<s;a++){const c=this.keyMonthParser(this.values[a].date),o=(((n=this._activities.get(c))==null?void 0:n.count)||0)+this.values[a].count;this._activities.set(c,{count:o,colorIndex:this.getColorIndex(o)})}}return this._activities}get calendar(){if(!this._calendar){let n=new Date(this.startDate.getFullYear(),0,1);this._calendar=new Array(this.numSlices);for(let a=0,s=this._calendar.length;a<s;a++){this._calendar[a]=new Array(this.numItems);for(let c=0;c<this.numItems;c++){const o=this.activities.get(this.keyMonthParser(n));this._calendar[a][c]={date:new Date(n.valueOf()),count:o?o.count:void 0,colorIndex:o?o.colorIndex:0},n.setMonth(n.getMonth()+1)}}}return this._calendar}get yearsToHaveInlabels(){if(!this._yearsToHaveInLabels){this._yearsToHaveInLabels=[];let n=this.startDate.getFullYear();const a=this.endDate.getFullYear();for(;n<=a;)this._yearsToHaveInLabels.push(n),n++}return this._yearsToHaveInLabels}get firstFullWeekOfMonths(){if(!this._firstFullWeekOfMonths){const n=this.calendar;this._firstFullWeekOfMonths=[];for(let a=1,s=n.length;a<s;a++){const c=n[a-1][0].date,o=n[a][0].date;(c.getFullYear()<o.getFullYear()||c.getMonth()<o.getMonth())&&this._firstFullWeekOfMonths.push({value:o.getMonth(),index:a})}}return this._firstFullWeekOfMonths}getColorIndex(n){return n==null?0:n<=0?1:n>=this.max?5:Math.ceil(n*100/this.max*.03)+1}getCountEmptyDaysAtStart(){return this.startDate.getDay()}getCountEmptyDaysAtEnd(){return S.DAYS_IN_WEEK-1-this.endDate.getDay()}getDaysCount(){return S.DAYS_IN_ONE_YEAR+1+this.getCountEmptyDaysAtStart()+this.getCountEmptyDaysAtEnd()}shiftDate(n,a){const s=new Date(n);return s.setDate(s.getDate()+a),s}parseDate(n){return n instanceof Date?n:new Date(n)}keyDayParser(n){const a=this.parseDate(n);return String(a.getFullYear())+String(a.getMonth()).padStart(2,"0")+String(a.getDate()).padStart(2,"0")}keyMonthParser(n){const a=this.parseDate(n);return String(a.getFullYear())+String(a.getMonth()).padStart(2,"0")}};let l=S;i(l,"DEFAULT_RANGE_COLOR_LIGHT",["#ebedf0","#dae2ef","#c0ddf9","#73b3f3","#3886e1","#17459e"]),i(l,"DEFAULT_RANGE_COLOR_DARK",["#1f1f22","#1e334a","#1d466c","#1d5689","#1d69ac","#1B95D1"]),i(l,"DEFAULT_LOCALE",{months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],on:"in",less:"Less",more:"More"}),i(l,"DEFAULT_TOOLTIP_UNIT","contributions"),i(l,"DAYS_IN_ONE_YEAR",365),i(l,"DAYS_IN_WEEK",7),i(l,"MONTHS_IN_ONE_YEAR",12),i(l,"MONTHS_IN_ROW",6),i(l,"SQUARE_SIZE",10),i(l,"DEFAULT_HISTORY_IN_YEARS",5);const Se="",ye="",$=e.defineComponent({name:"CalendarHeatmap",props:{endDate:{required:!0},max:{type:Number},startDate:{},rangeColor:{type:Array},values:{type:Array,required:!0},locale:{type:Object},tooltip:{type:Boolean,default:!0},tooltipUnit:{type:String,default:l.DEFAULT_TOOLTIP_UNIT},tooltipFormatter:{type:Function},vertical:{type:Boolean,default:!1},noDataText:{type:[Boolean,String],default:null},round:{type:Number,default:0},darkMode:Boolean},emits:["itemClick"],setup(t){const n=l.SQUARE_SIZE/5,a=l.SQUARE_SIZE+n,s=Math.ceil(l.SQUARE_SIZE*2.5),c=a*3,o=l.SQUARE_SIZE+l.SQUARE_SIZE/2,_=l.SQUARE_SIZE+l.SQUARE_SIZE/2,h=`translate(${s}, ${o})`,D=e.ref(null),I=e.ref(new Date),u=e.ref(new l(t.endDate,t.values,t.max)),R=e.ref(0),p=e.ref(0),B=e.ref("0 0 0 0"),w=e.ref("0 0 0 0"),N=e.ref(""),L=e.ref(""),M=e.ref(""),y=e.ref({}),A=e.ref(t.rangeColor||(t.darkMode?l.DEFAULT_RANGE_COLOR_DARK:l.DEFAULT_RANGE_COLOR_LIGHT)),{values:le,tooltipUnit:se,tooltipFormatter:oe,noDataText:ie,max:ce,vertical:T,locale:de}=e.toRefs(t),g=new Map;let f;function C(){g.clear(),f?f.setInstances(Array.from(g.values())):f=m.createSingleton(Array.from(g.values()),{overrides:[],moveTransition:"transform 0.1s ease-out",allowHTML:!0})}function he(r){if(t.tooltip){if(r.count!==void 0)return t.tooltipFormatter?t.tooltipFormatter(r,t.tooltipUnit):`<b>${r.count} ${t.tooltipUnit}</b> ${y.value.on} ${y.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`;if(t.noDataText!==!1)return`<b>No ${t.tooltipUnit}</b> ${y.value.on} ${y.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`}}function _e(r){return t.vertical?`translate(0, ${a*u.value.numSlices-(r+1)*a})`:`translate(${r*a}, 0)`}function Ee(r){return t.vertical?`translate(${r*a}, 0)`:`translate(0, ${r*a})`}function me(r){return t.vertical?{x:0,y:a*u.value.numSlices-a*(r*2)-a/4}:{x:a*r*2,y:a-n}}function Y(){T.value?(R.value=s+a*l.MONTHS_IN_ROW+c,p.value=o+a*u.value.numSlices+n,N.value=`translate(${s}, 0)`,L.value=`translate(0, ${o})`):(R.value=s+a*u.value.numSlices+n,p.value=o+a*l.MONTHS_IN_ROW,N.value=`translate(0, ${o})`,L.value=`translate(${s}, 0)`)}e.watch([e.toRef(t,"rangeColor"),e.toRef(t,"darkMode")],([r,E])=>{A.value=r||(E?l.DEFAULT_RANGE_COLOR_DARK:l.DEFAULT_RANGE_COLOR_LIGHT)}),e.watch(T,r=>{Y()},{immediate:!0}),e.watch([R,p],([r,E])=>{T.value?E<119&&(E=119):r<175&&(r=175),B.value=` 0 0 ${r} ${E}`},{immediate:!0}),e.watch([R,p,A],([r,E,k])=>{M.value=T.value?`translate(${s+a*l.MONTHS_IN_ROW}, ${o})`:`translate(${r-a*k.length-30}, ${E-_})`},{immediate:!0}),e.watch(de,r=>y.value=r?{...l.DEFAULT_LOCALE,...r}:l.DEFAULT_LOCALE,{immediate:!0}),e.watch(A,r=>w.value=`0 0 ${l.SQUARE_SIZE*(r.length+1)} ${l.SQUARE_SIZE}`,{immediate:!0}),e.watch([le,se,oe,ie,ce,A],()=>{u.value=new l(t.endDate,t.values,t.max),g.forEach(r=>r.destroy()),e.nextTick(C),Y()},{deep:!0}),e.onMounted(C),e.onBeforeUnmount(()=>{f==null||f.destroy(),g.forEach(r=>r.destroy())});function ue(r){if(f&&r.target&&r.target.classList.contains("vch__day__square")&&r.target.dataset.sliceIndex!==void 0&&r.target.dataset.itemIndex!==void 0){const E=Number(r.target.dataset.sliceIndex),k=Number(r.target.dataset.itemIndex);if(!isNaN(E)&&!isNaN(k)){const U=he(u.value.calendar[E][k]);if(U){const F=g.get(r.target);F?F.setContent(U):F||(g.set(r.target,m(r.target,{content:U})),f.setInstances(Array.from(g.values())))}}}}return{SQUARE_BORDER_SIZE:n,SQUARE_SIZE:a,LEFT_SECTION_WIDTH:s,RIGHT_SECTION_WIDTH:c,TOP_SECTION_HEIGHT:o,BOTTOM_SECTION_HEIGHT:_,svg:D,heatmap:u,now:I,width:R,height:p,viewbox:B,daysLabelWrapperTransform:N,monthsLabelWrapperTransform:L,yearWrapperTransform:h,legendWrapperTransform:M,lo:y,legendViewbox:w,curRangeColor:A,getSlicePosition:_e,getItemPosition:Ee,getYearLabelPosition:me,initTippyLazy:ue}}}),De="",b=(t,n)=>{const a=t.__vccOpts||t;for(const[s,c]of n)a[s]=c;return a},Q=["viewBox"],Z=["transform"],v=["x","y"],W=["transform"],H=["x"],V=["rx","ry","width","height","x","y"],P=["x","y"],G=["transform"],z=["transform"],j=["rx","ry","transform","width","height","data-slice-index","data-item-index","onClick"],q={key:0,class:"vch__legend"},K={class:"vch__legend-left"},J={class:"vch__legend-right"},X={class:"vch__legend"},x=["viewBox","height"],ee={class:"vch__legend__wrapper"},te=["rx","ry","width","height","x"];function ae(t,n,a,s,c,o){return e.openBlock(),e.createElementBlock("div",{class:e.normalizeClass({vch__container:!0,"dark-mode":t.darkMode})},[(e.openBlock(),e.createElementBlock("svg",{class:"vch__wrapper",ref:"svg",viewBox:t.viewbox},[e.createElementVNode("g",{class:"vch__months__labels__wrapper",transform:t.monthsLabelWrapperTransform},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.heatmap.yearsToHaveInlabels,(_,h)=>(e.openBlock(),e.createElementBlock("text",{class:"vch__month__label",key:h,x:t.getYearLabelPosition(h).x,y:t.getYearLabelPosition(h).y},e.toDisplayString(_),9,v))),128))],8,Z),t.vertical?(e.openBlock(),e.createElementBlock("g",{key:0,class:"vch__legend__wrapper",transform:t.legendWrapperTransform},[e.createElementVNode("text",{x:t.SQUARE_SIZE*1.25,y:"8"},e.toDisplayString(t.lo.less),9,H),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.curRangeColor,(_,h)=>(e.openBlock(),e.createElementBlock("rect",{key:h,rx:t.round,ry:t.round,style:e.normalizeStyle({fill:_}),width:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,x:t.SQUARE_SIZE*1.75,y:t.SQUARE_SIZE*(h+1)},null,12,V))),128)),e.createElementVNode("text",{x:t.SQUARE_SIZE*1.25,y:t.SQUARE_SIZE*(t.curRangeColor.length+2)-t.SQUARE_BORDER_SIZE},e.toDisplayString(t.lo.more),9,P)],8,W)):e.createCommentVNode("",!0),e.createElementVNode("g",{class:"vch__year__wrapper",transform:t.yearWrapperTransform,onMouseover:n[0]||(n[0]=(..._)=>t.initTippyLazy&&t.initTippyLazy(..._))},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.heatmap.calendar,(_,h)=>(e.openBlock(),e.createElementBlock("g",{class:"vch__slice__wrapper",key:h,transform:t.getSlicePosition(h)},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(_,(D,I)=>(e.openBlock(),e.createElementBlock(e.Fragment,{key:I},[D.date<t.now?(e.openBlock(),e.createElementBlock("rect",{key:0,class:"vch__day__square",rx:t.round,ry:t.round,transform:t.getItemPosition(I),width:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,style:e.normalizeStyle({fill:t.curRangeColor[D.colorIndex]}),"data-slice-index":h,"data-item-index":I,onClick:u=>t.$emit("itemClick",D)},null,12,j)):e.createCommentVNode("",!0)],64))),128))],8,z))),128))],40,G)],8,Q)),t.vertical?e.createCommentVNode("",!0):(e.openBlock(),e.createElementBlock("div",q,[e.renderSlot(t.$slots,"legend",{},()=>[e.createElementVNode("div",K,[e.renderSlot(t.$slots,"vch__legend-left")]),e.createElementVNode("div",J,[e.renderSlot(t.$slots,"legend-right",{},()=>[e.createElementVNode("div",X,[e.createElementVNode("div",null,e.toDisplayString(t.lo.less),1),t.vertical?e.createCommentVNode("",!0):(e.openBlock(),e.createElementBlock("svg",{key:0,class:"vch__external-legend-wrapper",viewBox:t.legendViewbox,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE},[e.createElementVNode("g",ee,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.curRangeColor,(_,h)=>(e.openBlock(),e.createElementBlock("rect",{key:h,rx:t.round,ry:t.round,style:e.normalizeStyle({fill:_}),width:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,x:t.SQUARE_SIZE*h},null,12,te))),128))])],8,x)),e.createElementVNode("div",null,e.toDisplayString(t.lo.more),1)])])])])]))],2)}const O=b($,[["render",ae]]);function ne(t){t.component(O.name,O)}const re={install:ne};d.CalendarHeatmap=O,d.Heatmap=l,d.default=re,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=vue3-calendar-heatmap.umd.js.map
