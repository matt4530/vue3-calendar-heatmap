export interface Value {
    date: Date | string;
    count: number;
}
export interface Activity {
    count: number;
    colorIndex: number;
}
export type Activities = Map<string, Activity>;
export interface CalendarItem {
    date: Date;
    count?: number;
    colorIndex: number;
}
export type Calendar = CalendarItem[][];
export interface Month {
    value: number;
    index: number;
}
export interface Locale {
    months: string[];
    days: string[];
    on: string;
    less: string;
    more: string;
}
export type TooltipFormatter = (item: CalendarItem, unit: string) => string;
export declare class Heatmap {
    static readonly DEFAULT_RANGE_COLOR_LIGHT: string[];
    static readonly DEFAULT_RANGE_COLOR_DARK: string[];
    static readonly DEFAULT_LOCALE: Locale;
    static readonly DEFAULT_TOOLTIP_UNIT = "contributions";
    static readonly DAYS_IN_ONE_YEAR = 365;
    static readonly DAYS_IN_WEEK = 7;
    static readonly MONTHS_IN_ONE_YEAR = 12;
    static readonly MONTHS_IN_ROW = 6;
    static readonly SQUARE_SIZE = 10;
    static DEFAULT_HISTORY_IN_YEARS: number;
    startDate: Date;
    endDate: Date;
    max: number;
    numSlices: number;
    numItems: number;
    private _values;
    private _firstFullWeekOfMonths?;
    private _yearsToHaveInLabels?;
    private _activities?;
    private _calendar?;
    constructor(endDate: Date | string, values: Value[], max?: number, startDate?: Date | string);
    set values(v: Value[]);
    get values(): Value[];
    get activities(): Activities;
    get calendar(): Calendar;
    get yearsToHaveInlabels(): number[];
    get firstFullWeekOfMonths(): Month[];
    getColorIndex(count?: number): number;
    getCountEmptyDaysAtStart(): number;
    getCountEmptyDaysAtEnd(): number;
    getDaysCount(): number;
    private shiftDate;
    private parseDate;
    private keyDayParser;
    private keyMonthParser;
}
