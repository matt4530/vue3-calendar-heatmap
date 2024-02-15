(function(d,e){typeof exports=="object"&&typeof module<"u"?e(exports,require("vue"),require("tippy.js")):typeof define=="function"&&define.amd?define(["exports","vue","tippy.js"],e):(d=typeof globalThis<"u"?globalThis:d||self,e(d.CalendarHeatmap={},d.Vue,d.tippy))})(this,function(d,e,E){"use strict";var ge=Object.defineProperty;var fe=(d,e,E)=>e in d?ge(d,e,{enumerable:!0,configurable:!0,writable:!0,value:E}):d[e]=E;var i=(d,e,E)=>(fe(d,typeof e!="symbol"?e+"":e,E),E);const y=class{constructor(n,a,s,c){i(this,"startDate");i(this,"endDate");i(this,"max");i(this,"numSlices");i(this,"numItems");i(this,"_values");i(this,"_firstFullWeekOfMonths");i(this,"_yearsToHaveInLabels");i(this,"_activities");i(this,"_calendar");if(this.endDate=this.parseDate(n),this.max=s||Math.ceil(Math.max(...a.map(o=>o.count))/5*4),c)this.startDate=new Date(c);else{const o=a.length>0?Math.min(...a.map(_=>this.parseDate(_.date).getFullYear())):new Date().getFullYear()-10;this.startDate=new Date,this.startDate.setFullYear(o)}this.numSlices=(this.endDate.getFullYear()-this.startDate.getFullYear()+1)*2,this.numItems=y.MONTHS_IN_ROW,this._values=a}set values(n){this.max=Math.ceil(Math.max(...n.map(a=>a.count))/5*4),this._values=n,this._firstFullWeekOfMonths=void 0,this._yearsToHaveInLabels=void 0,this._calendar=void 0,this._activities=void 0}get values(){return this._values}get activities(){var n;if(!this._activities){this._activities=new Map;for(let a=0,s=this.values.length;a<s;a++){const c=this.keyMonthParser(this.values[a].date),o=(((n=this._activities.get(c))==null?void 0:n.count)||0)+this.values[a].count;this._activities.set(c,{count:o,colorIndex:this.getColorIndex(o)})}}return this._activities}get calendar(){if(!this._calendar){let n=new Date(this.startDate.getFullYear(),0,1);this._calendar=new Array(this.numSlices);for(let a=0,s=this._calendar.length;a<s;a++){this._calendar[a]=new Array(this.numItems);for(let c=0;c<this.numItems;c++){const o=this.activities.get(this.keyMonthParser(n));this._calendar[a][c]={date:new Date(n.valueOf()),count:o?o.count:void 0,colorIndex:o?o.colorIndex:0},n.setMonth(n.getMonth()+1)}}}return this._calendar}get yearsToHaveInlabels(){if(!this._yearsToHaveInLabels){this._yearsToHaveInLabels=[];let n=this.startDate.getFullYear();const a=this.endDate.getFullYear();for(console.log(n,a);n<=a;)this._yearsToHaveInLabels.push(n),n++}return console.log("Years to have in labels",this._yearsToHaveInLabels),this._yearsToHaveInLabels}get firstFullWeekOfMonths(){if(!this._firstFullWeekOfMonths){const n=this.calendar;this._firstFullWeekOfMonths=[];for(let a=1,s=n.length;a<s;a++){const c=n[a-1][0].date,o=n[a][0].date;(c.getFullYear()<o.getFullYear()||c.getMonth()<o.getMonth())&&this._firstFullWeekOfMonths.push({value:o.getMonth(),index:a})}}return this._firstFullWeekOfMonths}getColorIndex(n){return n==null?0:n<=0?1:n>=this.max?5:Math.ceil(n*100/this.max*.03)+1}getCountEmptyDaysAtStart(){return this.startDate.getDay()}getCountEmptyDaysAtEnd(){return y.DAYS_IN_WEEK-1-this.endDate.getDay()}getDaysCount(){return y.DAYS_IN_ONE_YEAR+1+this.getCountEmptyDaysAtStart()+this.getCountEmptyDaysAtEnd()}shiftDate(n,a){const s=new Date(n);return s.setDate(s.getDate()+a),s}parseDate(n){return n instanceof Date?n:new Date(n)}keyDayParser(n){const a=this.parseDate(n);return String(a.getFullYear())+String(a.getMonth()).padStart(2,"0")+String(a.getDate()).padStart(2,"0")}keyMonthParser(n){const a=this.parseDate(n);return String(a.getFullYear())+String(a.getMonth()).padStart(2,"0")}};let l=y;i(l,"DEFAULT_RANGE_COLOR_LIGHT",["#ebedf0","#dae2ef","#c0ddf9","#73b3f3","#3886e1","#17459e"]),i(l,"DEFAULT_RANGE_COLOR_DARK",["#1f1f22","#1e334a","#1d466c","#1d5689","#1d69ac","#1B95D1"]),i(l,"DEFAULT_LOCALE",{months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],on:"in",less:"Less",more:"More"}),i(l,"DEFAULT_TOOLTIP_UNIT","contributions"),i(l,"DAYS_IN_ONE_YEAR",365),i(l,"DAYS_IN_WEEK",7),i(l,"MONTHS_IN_ONE_YEAR",12),i(l,"MONTHS_IN_ROW",6),i(l,"SQUARE_SIZE",10);const ue="",Se="",b=e.defineComponent({name:"CalendarHeatmap",props:{endDate:{required:!0},max:{type:Number},startDate:{type:Number},rangeColor:{type:Array},values:{type:Array,required:!0},locale:{type:Object},tooltip:{type:Boolean,default:!0},tooltipUnit:{type:String,default:l.DEFAULT_TOOLTIP_UNIT},tooltipFormatter:{type:Function},vertical:{type:Boolean,default:!1},noDataText:{type:[Boolean,String],default:null},round:{type:Number,default:0},darkMode:Boolean},emits:["itemClick"],setup(t){const n=l.SQUARE_SIZE/5,a=l.SQUARE_SIZE+n,s=Math.ceil(l.SQUARE_SIZE*2.5),c=a*3,o=l.SQUARE_SIZE+l.SQUARE_SIZE/2,_=l.SQUARE_SIZE+l.SQUARE_SIZE/2,h=`translate(${s}, ${o})`,p=e.ref(null),I=e.ref(new Date),m=e.ref(new l(t.endDate,t.values,t.max)),R=e.ref(0),D=e.ref(0),w=e.ref("0 0 0 0"),B=e.ref("0 0 0 0"),O=e.ref(""),N=e.ref(""),M=e.ref(""),S=e.ref({}),A=e.ref(t.rangeColor||(t.darkMode?l.DEFAULT_RANGE_COLOR_DARK:l.DEFAULT_RANGE_COLOR_LIGHT)),{values:re,tooltipUnit:le,tooltipFormatter:oe,noDataText:se,max:ie,vertical:F,locale:ce}=e.toRefs(t),g=new Map;let f;function C(){g.clear(),f?f.setInstances(Array.from(g.values())):f=E.createSingleton(Array.from(g.values()),{overrides:[],moveTransition:"transform 0.1s ease-out",allowHTML:!0})}function de(r){if(t.tooltip){if(r.count!==void 0)return t.tooltipFormatter?t.tooltipFormatter(r,t.tooltipUnit):`<b>${r.count} ${t.tooltipUnit}</b> ${S.value.on} ${S.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`;if(t.noDataText!==!1)return`<b>No ${t.tooltipUnit}</b> ${S.value.on} ${S.value.months[r.date.getMonth()]} ${r.date.getFullYear()}`}}function he(r){return t.vertical?`translate(0, ${a*m.value.numSlices-(r+1)*a})`:`translate(${r*a}, 0)`}function _e(r){return t.vertical?`translate(${r*a}, 0)`:`translate(0, ${r*a})`}function Ee(r){return t.vertical?{x:0,y:a*m.value.numSlices-a*(r*2)-a/4}:{x:a*r*2,y:a-n}}e.watch([e.toRef(t,"rangeColor"),e.toRef(t,"darkMode")],([r,u])=>{A.value=r||(u?l.DEFAULT_RANGE_COLOR_DARK:l.DEFAULT_RANGE_COLOR_LIGHT)}),e.watch(F,r=>{r?(R.value=s+a*l.MONTHS_IN_ROW+c,D.value=o+a*m.value.numSlices+n,O.value=`translate(${s}, 0)`,N.value=`translate(0, ${o})`):(R.value=s+a*m.value.numSlices+n,D.value=o+a*l.MONTHS_IN_ROW,O.value=`translate(0, ${o})`,N.value=`translate(${s}, 0)`)},{immediate:!0}),e.watch([R,D],([r,u])=>w.value=` 0 0 ${r} ${u}`,{immediate:!0}),e.watch([R,D,A],([r,u,T])=>{M.value=F.value?`translate(${s+a*l.MONTHS_IN_ROW}, ${o})`:`translate(${r-a*T.length-30}, ${u-_})`},{immediate:!0}),e.watch(ce,r=>S.value=r?{...l.DEFAULT_LOCALE,...r}:l.DEFAULT_LOCALE,{immediate:!0}),e.watch(A,r=>B.value=`0 0 ${l.SQUARE_SIZE*(r.length+1)} ${l.SQUARE_SIZE}`,{immediate:!0}),e.watch([re,le,oe,se,ie,A],()=>{m.value=new l(t.endDate,t.values,t.max),g.forEach(r=>r.destroy()),e.nextTick(C)}),e.onMounted(C),e.onBeforeUnmount(()=>{f==null||f.destroy(),g.forEach(r=>r.destroy())});function me(r){if(f&&r.target&&r.target.classList.contains("vch__day__square")&&r.target.dataset.sliceIndex!==void 0&&r.target.dataset.itemIndex!==void 0){const u=Number(r.target.dataset.sliceIndex),T=Number(r.target.dataset.itemIndex);if(!isNaN(u)&&!isNaN(T)){const L=de(m.value.calendar[u][T]);if(L){const U=g.get(r.target);U?U.setContent(L):U||(g.set(r.target,E(r.target,{content:L})),f.setInstances(Array.from(g.values())))}}}}return{SQUARE_BORDER_SIZE:n,SQUARE_SIZE:a,LEFT_SECTION_WIDTH:s,RIGHT_SECTION_WIDTH:c,TOP_SECTION_HEIGHT:o,BOTTOM_SECTION_HEIGHT:_,svg:p,heatmap:m,now:I,width:R,height:D,viewbox:w,daysLabelWrapperTransform:O,monthsLabelWrapperTransform:N,yearWrapperTransform:h,legendWrapperTransform:M,lo:S,legendViewbox:B,curRangeColor:A,getSlicePosition:he,getItemPosition:_e,getYearLabelPosition:Ee,initTippyLazy:me}}}),ye="",$=(t,n)=>{const a=t.__vccOpts||t;for(const[s,c]of n)a[s]=c;return a},Q=["viewBox"],Z=["transform"],v=["x","y"],W=["transform"],Y=["x"],H=["rx","ry","width","height","x","y"],V=["x","y"],P=["transform"],G=["transform"],z=["rx","ry","transform","width","height","data-slice-index","data-item-index","onClick"],j={class:"vch__legend"},q={class:"vch__legend-left"},K={class:"vch__legend-right"},J={class:"vch__legend"},x=["viewBox","height"],X={class:"vch__legend__wrapper"},ee=["rx","ry","width","height","x"];function te(t,n,a,s,c,o){return e.openBlock(),e.createElementBlock("div",{class:e.normalizeClass({vch__container:!0,"dark-mode":t.darkMode})},[(e.openBlock(),e.createElementBlock("svg",{class:"vch__wrapper",ref:"svg",viewBox:t.viewbox},[e.createElementVNode("g",{class:"vch__months__labels__wrapper",transform:t.monthsLabelWrapperTransform},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.heatmap.yearsToHaveInlabels,(_,h)=>(e.openBlock(),e.createElementBlock("text",{class:"vch__month__label",key:h,x:t.getYearLabelPosition(h).x,y:t.getYearLabelPosition(h).y},e.toDisplayString(_),9,v))),128))],8,Z),t.vertical?(e.openBlock(),e.createElementBlock("g",{key:0,class:"vch__legend__wrapper",transform:t.legendWrapperTransform},[e.createElementVNode("text",{x:t.SQUARE_SIZE*1.25,y:"8"},e.toDisplayString(t.lo.less),9,Y),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.curRangeColor,(_,h)=>(e.openBlock(),e.createElementBlock("rect",{key:h,rx:t.round,ry:t.round,style:e.normalizeStyle({fill:_}),width:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,x:t.SQUARE_SIZE*1.75,y:t.SQUARE_SIZE*(h+1)},null,12,H))),128)),e.createElementVNode("text",{x:t.SQUARE_SIZE*1.25,y:t.SQUARE_SIZE*(t.curRangeColor.length+2)-t.SQUARE_BORDER_SIZE},e.toDisplayString(t.lo.more),9,V)],8,W)):e.createCommentVNode("",!0),e.createElementVNode("g",{class:"vch__year__wrapper",transform:t.yearWrapperTransform,onMouseover:n[0]||(n[0]=(..._)=>t.initTippyLazy&&t.initTippyLazy(..._))},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.heatmap.calendar,(_,h)=>(e.openBlock(),e.createElementBlock("g",{class:"vch__slice__wrapper",key:h,transform:t.getSlicePosition(h)},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(_,(p,I)=>(e.openBlock(),e.createElementBlock(e.Fragment,{key:I},[p.date<t.now?(e.openBlock(),e.createElementBlock("rect",{key:0,class:"vch__day__square",rx:t.round,ry:t.round,transform:t.getItemPosition(I),width:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,style:e.normalizeStyle({fill:t.curRangeColor[p.colorIndex]}),"data-slice-index":h,"data-item-index":I,onClick:m=>t.$emit("itemClick",p)},null,12,z)):e.createCommentVNode("",!0)],64))),128))],8,G))),128))],40,P)],8,Q)),e.createElementVNode("div",j,[e.renderSlot(t.$slots,"legend",{},()=>[e.createElementVNode("div",q,[e.renderSlot(t.$slots,"vch__legend-left")]),e.createElementVNode("div",K,[e.renderSlot(t.$slots,"legend-right",{},()=>[e.createElementVNode("div",J,[e.createElementVNode("div",null,e.toDisplayString(t.lo.less),1),t.vertical?e.createCommentVNode("",!0):(e.openBlock(),e.createElementBlock("svg",{key:0,class:"vch__external-legend-wrapper",viewBox:t.legendViewbox,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE},[e.createElementVNode("g",X,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.curRangeColor,(_,h)=>(e.openBlock(),e.createElementBlock("rect",{key:h,rx:t.round,ry:t.round,style:e.normalizeStyle({fill:_}),width:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,height:t.SQUARE_SIZE-t.SQUARE_BORDER_SIZE,x:t.SQUARE_SIZE*h},null,12,ee))),128))])],8,x)),e.createElementVNode("div",null,e.toDisplayString(t.lo.more),1)])])])])])],2)}const k=$(b,[["render",te]]);function ae(t){t.component(k.name,k)}const ne={install:ae};d.CalendarHeatmap=k,d.Heatmap=l,d.default=ne,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=vue3-calendar-heatmap.umd.js.map
