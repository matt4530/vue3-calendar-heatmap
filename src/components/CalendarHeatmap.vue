<template>
	<div :class="{'vch__container': true, 'dark-mode': darkMode}">
		<svg class="vch__wrapper" ref="svg" :viewBox="viewbox">
			<g class="vch__months__labels__wrapper" :transform="monthsLabelWrapperTransform">
				<text
					class="vch__month__label"
					v-for="(year, index) in heatmap.yearsToHaveInlabels"
					:key="index"
					:x="getYearLabelPosition(index).x"
					:y="getYearLabelPosition(index).y"
				>
					{{ year}}
				</text>
			</g>

			<!-- legend that has more, less and a few squares -->
			<g v-if="vertical" class="vch__legend__wrapper" :transform="legendWrapperTransform">
				<text :x="SQUARE_SIZE * 1.25" y="8">{{ lo.less }}</text>
				<rect
					v-for="(color, index) in curRangeColor"
					:key="index"
					:rx="round"
					:ry="round"
					:style="{ fill: color }"
					:width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
					:height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
					:x="SQUARE_SIZE * 1.75"
					:y="SQUARE_SIZE * (index + 1)"
				/>
				<text
					:x="SQUARE_SIZE * 1.25"
					:y="SQUARE_SIZE * (curRangeColor.length + 2) - SQUARE_BORDER_SIZE"
				>
					{{ lo.more }}
				</text>
			</g>

			<!-- colored boxes region -->
			<g class="vch__year__wrapper" :transform="yearWrapperTransform" @mouseover="initTippyLazy">
				<g class="vch__slice__wrapper"
				   v-for="(slice, sliceIndex) in heatmap.calendar"
				   :key="sliceIndex"
				   :transform="getSlicePosition(sliceIndex)"
				>
					<!-- outer index is a slice, inner index is an item-->
					<template v-for="(item, itemIndex) in slice" :key="itemIndex">
						<rect class="vch__day__square"
							  v-if="item.date < now"
							  :rx="round"
							  :ry="round"
							  :transform="getItemPosition(itemIndex)"
							  :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
							  :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
							  :style="{ fill: curRangeColor[item.colorIndex] }"
							  :data-slice-index="sliceIndex"
							  :data-item-index="itemIndex"
							  @click="$emit('itemClick', item)"
						/>
					</template>
				</g>
			</g>
		</svg>
		<div v-if="!vertical" class="vch__legend">
			<slot name="legend">
				<div class="vch__legend-left">
					<slot name="vch__legend-left"></slot>
				</div>
				<div class="vch__legend-right">
					<slot name="legend-right">
						<div class="vch__legend">
							<div>{{ lo.less }}</div>
							<svg v-if="!vertical" class="vch__external-legend-wrapper" :viewBox="legendViewbox" :height="SQUARE_SIZE - SQUARE_BORDER_SIZE">
								<g class="vch__legend__wrapper">
									<rect
										v-for="(color, index) in curRangeColor"
										:key="index"
										:rx="round"
										:ry="round"
										:style="{ fill: color }"
										:width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
										:height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
										:x="SQUARE_SIZE * index"
									/>
								</g>
							</svg>
							<div>{{ lo.more }}</div>
						</div>
					</slot>
				</div>
			</slot>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, nextTick, onBeforeUnmount, onMounted, PropType, ref, toRef, toRefs, watch } from 'vue';
	import { CalendarItem, Heatmap, Locale, Month, TooltipFormatter, Value } from '@/components/Heatmap';
	import tippy, { createSingleton, CreateSingletonInstance, Instance } from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/dist/svg-arrow.css';

	export default /*#__PURE__*/defineComponent({
		name : 'CalendarHeatmap',
		props: {
			endDate         : {
				required: true
			},
			max             : {
				type: Number
			},
			startDate: {
			},
			rangeColor      : {
				type: Array as PropType<string[]>
			},
			values          : {
				type    : Array as PropType<Value[]>,
				required: true
			},
			locale          : {
				type: Object as PropType<Partial<Locale>>
			},
			tooltip         : {
				type   : Boolean,
				default: true
			},
			tooltipUnit     : {
				type   : String,
				default: Heatmap.DEFAULT_TOOLTIP_UNIT
			},
			tooltipFormatter: {
				type: Function as PropType<TooltipFormatter>
			},
			vertical        : {
				type   : Boolean,
				default: false
			},
			noDataText      : {
				type   : [ Boolean, String ],
				default: null
			},
			round           : {
				type   : Number,
				default: 0
			},
			darkMode        : Boolean
		},
		emits: [ 'itemClick' ],
		setup(props) {

			const SQUARE_BORDER_SIZE          = Heatmap.SQUARE_SIZE / 5,
				  SQUARE_SIZE                 = Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE,
				  LEFT_SECTION_WIDTH          = Math.ceil(Heatmap.SQUARE_SIZE * 2.5),
				  RIGHT_SECTION_WIDTH         = SQUARE_SIZE * 3,
				  TOP_SECTION_HEIGHT          = Heatmap.SQUARE_SIZE + (Heatmap.SQUARE_SIZE / 2),
				  BOTTOM_SECTION_HEIGHT       = Heatmap.SQUARE_SIZE + (Heatmap.SQUARE_SIZE / 2),
				  yearWrapperTransform        = `translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`,

				  svg                         = ref<null | SVGElement>(null),
				  now                         = ref(new Date()),
				  heatmap                     = ref(new Heatmap(props.endDate as Date, props.values, props.max)),

				  width                       = ref(0),
				  height                      = ref(0),
				  viewbox                     = ref('0 0 0 0'),
				  legendViewbox               = ref('0 0 0 0'),
				  daysLabelWrapperTransform   = ref(''),
				  monthsLabelWrapperTransform = ref(''),
				  legendWrapperTransform      = ref(''),
				  lo                          = ref<Locale>({} as any),
				  rangeColor                  = ref<string[]>(props.rangeColor || (props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT));

			const { values, tooltipUnit, tooltipFormatter, noDataText, max, vertical, locale } = toRefs(props),
				  tippyInstances                                                               = new Map<HTMLElement, Instance>();

			let tippySingleton: CreateSingletonInstance;


			function initTippy() {
				tippyInstances.clear();
				if (tippySingleton) {
					tippySingleton.setInstances(Array.from(tippyInstances.values()));
				} else {
					tippySingleton = createSingleton(Array.from(tippyInstances.values()), {
						overrides     : [],
						moveTransition: 'transform 0.1s ease-out',
						allowHTML     : true
					});
				}
			}

			function tooltipOptions(item: CalendarItem) {
				if (props.tooltip) {
					if (item.count !== undefined) {
						if (props.tooltipFormatter) {
							return props.tooltipFormatter(item, props.tooltipUnit!);
						}
						return `<b>${item.count} ${props.tooltipUnit}</b> ${lo.value.on} ${lo.value.months[ item.date.getMonth() ]} ${item.date.getFullYear()}`;
					} else if (props.noDataText !== false) {
						return `<b>No ${props.tooltipUnit}</b> ${lo.value.on} ${lo.value.months[ item.date.getMonth() ]} ${item.date.getFullYear()}`;
					}
				}
				return undefined;
			}

			function getSlicePosition(index: number) {
				if (props.vertical) {
					return `translate(0, ${(SQUARE_SIZE * heatmap.value.numSlices) - ((index + 1) * SQUARE_SIZE)})`;
				}
				return `translate(${index * SQUARE_SIZE}, 0)`;
			}

			function getItemPosition(index: number) {
				if (props.vertical) {
					return `translate(${index * SQUARE_SIZE}, 0)`;
				}
				return `translate(0, ${index * SQUARE_SIZE})`;
			}

			function getYearLabelPosition(yearIndex: number) {
				if (props.vertical) {
					return { x: 0, y: (SQUARE_SIZE * heatmap.value.numSlices) - (SQUARE_SIZE * (yearIndex*2)) - (SQUARE_SIZE / 4) };
				}
				return { x: SQUARE_SIZE * yearIndex * 2, y: SQUARE_SIZE - SQUARE_BORDER_SIZE };
			}

			function resize() {
				if (vertical.value) {
					width.value                       = LEFT_SECTION_WIDTH + (SQUARE_SIZE * Heatmap.MONTHS_IN_ROW) + RIGHT_SECTION_WIDTH;
					height.value                      = Math.max(TOP_SECTION_HEIGHT + (SQUARE_SIZE * heatmap.value.numSlices) + SQUARE_BORDER_SIZE, 119);
					daysLabelWrapperTransform.value   = `translate(${LEFT_SECTION_WIDTH}, 0)`;
					monthsLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`;
				} else {
					width.value                       = Math.max(LEFT_SECTION_WIDTH + (SQUARE_SIZE * heatmap.value.numSlices) + SQUARE_BORDER_SIZE, 179);
					height.value                      = TOP_SECTION_HEIGHT + (SQUARE_SIZE * Heatmap.MONTHS_IN_ROW);
					daysLabelWrapperTransform.value   = `translate(0, ${TOP_SECTION_HEIGHT})`;
					monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`;
				}
			}

			watch([ toRef(props, 'rangeColor'), toRef(props, 'darkMode') ], ([ rc, dm ]) => {
				rangeColor.value = rc || (dm ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT);
			});

			watch(vertical, v => {
				resize();
			}, { immediate: true });

			watch([ width, height ], ([ w, h ]) => {
				viewbox.value = ` 0 0 ${w} ${h}`
			}, { immediate: true });
			watch([ width, height, rangeColor ], ([ w, h, rc ]) => {
				legendWrapperTransform.value = vertical.value
					? `translate(${LEFT_SECTION_WIDTH + (SQUARE_SIZE * Heatmap.MONTHS_IN_ROW)}, ${TOP_SECTION_HEIGHT})`
					: `translate(${w - (SQUARE_SIZE * rc.length) - 30}, ${h - BOTTOM_SECTION_HEIGHT})`;
			}, { immediate: true });

			watch(locale, l => (lo.value = l ? { ...Heatmap.DEFAULT_LOCALE, ...l } : Heatmap.DEFAULT_LOCALE), { immediate: true });
			watch(rangeColor, rc => (legendViewbox.value = `0 0 ${Heatmap.SQUARE_SIZE * (rc.length + 1)} ${Heatmap.SQUARE_SIZE}`), { immediate: true });

			watch(
				[ values, tooltipUnit, tooltipFormatter, noDataText, max, rangeColor ],
				() => {
					heatmap.value = new Heatmap(props.endDate as Date, props.values, props.max);
					tippyInstances.forEach((item) => item.destroy());
					nextTick(initTippy);
					resize();
				}
				, {deep:true});

			onMounted(initTippy);
			onBeforeUnmount(() => {
				tippySingleton?.destroy();
				tippyInstances.forEach((item) => item.destroy());
			});

			function initTippyLazy(e: MouseEvent) {

				if (tippySingleton
					&& e.target
					&& (e.target as HTMLElement).classList.contains('vch__day__square')
					&& (e.target as HTMLElement).dataset.sliceIndex !== undefined
					&& (e.target as HTMLElement).dataset.itemIndex !== undefined
				) {

					const sliceIndex = Number((e.target as HTMLElement).dataset.sliceIndex),
						  itemIndex  = Number((e.target as HTMLElement).dataset.itemIndex);

					if (!isNaN(sliceIndex) && !isNaN(itemIndex)) {

						const tooltip = tooltipOptions(heatmap.value.calendar[ sliceIndex ][ itemIndex ]);
						if (tooltip) {

							const instance = tippyInstances.get(e.target as HTMLElement);

							if (instance) {
								instance.setContent(tooltip);
							} else if (!instance) {
								tippyInstances.set(e.target as HTMLElement, tippy(e.target as HTMLElement, { content: tooltip } as any));
								tippySingleton.setInstances(Array.from(tippyInstances.values()));
							}

						}
					}

				}

			}

			return {
				SQUARE_BORDER_SIZE, SQUARE_SIZE, LEFT_SECTION_WIDTH, RIGHT_SECTION_WIDTH, TOP_SECTION_HEIGHT, BOTTOM_SECTION_HEIGHT,
				svg, heatmap, now, width, height, viewbox, daysLabelWrapperTransform, monthsLabelWrapperTransform, yearWrapperTransform, legendWrapperTransform,
				lo, legendViewbox, curRangeColor: rangeColor,
				getSlicePosition, getItemPosition, getYearLabelPosition, initTippyLazy
			};
		}
	});
</script>

<style lang="scss">

	.vch__container {
		.vch__legend {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.vch__external-legend-wrapper {
			margin: 0 8px;
		}
	}

	svg.vch__wrapper {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 10px;
		width: 100%;

		.vch__months__labels__wrapper text.vch__month__label {
			font-size: 10px;
		}

		.vch__days__labels__wrapper text.vch__day__label,
		.vch__legend__wrapper text {
			font-size: 9px;
		}

		text.vch__month__label,
		text.vch__day__label,
		.vch__legend__wrapper text {
			fill: #767676;
		}

		rect.vch__day__square:hover {
			stroke: #555;
			stroke-width: 2px;
			paint-order: stroke;
		}

		rect.vch__day__square:focus {
			outline: none;
		}

		&.dark-mode {
			text.vch__month__label,
			text.vch__day__label,
			.vch__legend__wrapper text {
				fill: #fff;
			}
		}
	}

</style>
