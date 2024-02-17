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

// Indexed originally, first by week then by day
// Indexed originally, first by half-year then by month
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

export class Heatmap {

	static readonly DEFAULT_RANGE_COLOR_LIGHT = ['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'];
	static readonly DEFAULT_RANGE_COLOR_DARK = ['#1f1f22', '#1e334a', '#1d466c', '#1d5689', '#1d69ac', '#1B95D1'];
	// other color candidates
	// static readonly DEFAULT_RANGE_COLOR_LIGHT = [ '#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39' ];
	// static readonly DEFAULT_RANGE_COLOR_DARK  = [ '#161b22', '#0e4429', '#006d32', '#26a641', '#39d353' ];
	// static readonly DEFAULT_RANGE_COLOR_DARK    = [ '#011526', '#012E40', '#025959', '#02735E', '#038C65' ];
	// static readonly DEFAULT_RANGE_COLOR_DARK    = [ '#161b22', '#015958', '#008F8C', '#0CABA8', '#0FC2C0' ];
	// static readonly DEFAULT_RANGE_COLOR_DARK    = [ '#012030', '#13678A', '#45C4B0', '#9AEBA3', '#DAFDBA' ];
	static readonly DEFAULT_LOCALE: Locale = {
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		on: 'in',
		less: 'Less',
		more: 'More'
	};
	static readonly DEFAULT_TOOLTIP_UNIT = 'contributions';
	static readonly DAYS_IN_ONE_YEAR = 365;
	static readonly DAYS_IN_WEEK = 7;
	static readonly MONTHS_IN_ONE_YEAR = 12;
	static readonly MONTHS_IN_ROW = 6;
	static readonly SQUARE_SIZE = 10;

	static DEFAULT_HISTORY_IN_YEARS = 5; // 5 years

	startDate: Date;
	endDate: Date;
	max: number;
	numSlices: number;
	numItems: number;

	private _values: Value[];
	private _firstFullWeekOfMonths?: Month[];
	private _yearsToHaveInLabels?: number[];
	private _activities?: Activities;
	private _calendar?: Calendar;

	constructor(endDate: Date | string, values: Value[], max?: number, startDate?: Date | string) {
		this.endDate = this.parseDate(endDate);

		this.max = max || Math.ceil((Math.max(...values.map(item => item.count)) / 5) * 4);

		if (startDate)
			this.startDate = new Date(startDate);
		else {
			const oldest = values.length > 0 ? Math.min(...values.map(v => this.parseDate(v.date).getFullYear())) : new Date().getFullYear() - Heatmap.DEFAULT_HISTORY_IN_YEARS
			this.startDate = new Date();
			this.startDate.setFullYear(oldest);
		}


		this.numSlices = (this.endDate.getFullYear() - this.startDate.getFullYear() + 1) * 2;
		this.numItems = Heatmap.MONTHS_IN_ROW;

		this._values = values;
	}

	set values(v: Value[]) {
		this.max = Math.ceil((Math.max(...v.map(item => item.count)) / 5) * 4);
		this._values = v;

		const oldest = v.length > 0 ? Math.min(...v.map(v2 => this.parseDate(v2.date).getFullYear())) : new Date().getFullYear() - Heatmap.DEFAULT_HISTORY_IN_YEARS
		this.startDate = new Date();
		this.startDate.setFullYear(oldest);
		this.numSlices = (this.endDate.getFullYear() - this.startDate.getFullYear() + 1) * 2;

		this._firstFullWeekOfMonths = undefined;
		this._yearsToHaveInLabels = undefined;
		this._calendar = undefined;
		this._activities = undefined;
	}

	get values(): Value[] {
		return this._values;
	}

	get activities(): Activities {
		if (!this._activities) {
			this._activities = new Map();
			for (let i = 0, len = this.values.length; i < len; i++) {
				//this._activities.set(this.keyDayParser(this.values[i].date), {

				// additive
				const key = this.keyMonthParser(this.values[i].date);
				const newCount = (this._activities.get(key)?.count || 0) + this.values[i].count
				this._activities.set(key, {
					count: newCount,
					colorIndex: this.getColorIndex(newCount)
				});
			}
		}
		return this._activities;
	}

	get calendar() {
		if (!this._calendar) {
			//let date = this.shiftDate(this.startDate, -this.getCountEmptyDaysAtStart());
			//date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			let date = new Date(this.startDate.getFullYear(), 0, 1);
			//this._calendar = new Array(this.weekCount);
			this._calendar = new Array(this.numSlices);
			for (let i = 0, len = this._calendar.length; i < len; i++) {
				//this._calendar[i] = new Array(Heatmap.DAYS_IN_WEEK);
				this._calendar[i] = new Array(this.numItems);
				//for (let j = 0; j < Heatmap.DAYS_IN_WEEK; j++) {
				for (let j = 0; j < this.numItems; j++) {
					//const dayValues = this.activities.get(this.keyDayParser(date));
					const monthValues = this.activities.get(this.keyMonthParser(date));
					this._calendar![i][j] = {
						date: new Date(date.valueOf()),
						count: monthValues ? monthValues.count : undefined,
						colorIndex: monthValues ? monthValues.colorIndex : 0
					};
					//date.setDate(date.getDate() + 1);
					date.setMonth(date.getMonth() + 1);
				}
			}
		}
		return this._calendar;
	}

	get yearsToHaveInlabels(): number[] {
		if (!this._yearsToHaveInLabels) {
			this._yearsToHaveInLabels = [];

			let year = this.startDate.getFullYear();
			const lastYear = this.endDate.getFullYear();
			while (year <= lastYear) {
				this._yearsToHaveInLabels.push(year)
				year++
			}
		}
		return this._yearsToHaveInLabels;
	}

	get firstFullWeekOfMonths(): Month[] {
		if (!this._firstFullWeekOfMonths) {
			const cal = this.calendar;
			this._firstFullWeekOfMonths = [];
			for (let index = 1, len = cal.length; index < len; index++) {
				const lastWeek = cal[index - 1][0].date,
					currentWeek = cal[index][0].date;
				if (lastWeek.getFullYear() < currentWeek.getFullYear() || lastWeek.getMonth() < currentWeek.getMonth()) {
					this._firstFullWeekOfMonths.push({ value: currentWeek.getMonth(), index });
				}
			}
		}
		return this._firstFullWeekOfMonths;
	}

	getColorIndex(count?: number) {
		if (count === null || count === undefined) {
			return 0;
		} else if (count <= 0) {
			return 1;
		} else if (count >= this.max) {
			return 5;
		} else {
			return (Math.ceil(((count * 100) / this.max) * (0.03))) + 1;
		}
	}

	getCountEmptyDaysAtStart() {
		return this.startDate.getDay();
	}

	getCountEmptyDaysAtEnd() {
		return (Heatmap.DAYS_IN_WEEK - 1) - this.endDate.getDay();
	}

	getDaysCount() {
		return Heatmap.DAYS_IN_ONE_YEAR + 1 + this.getCountEmptyDaysAtStart() + this.getCountEmptyDaysAtEnd();
	}

	private shiftDate(date: Date | string, numDays: number) {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + numDays);
		return newDate;
	}

	private parseDate(entry: Date | string) {
		return (entry instanceof Date) ? entry : (new Date(entry));
	}

	private keyDayParser(date: Date | string) {
		const day = this.parseDate(date);
		return String(day.getFullYear()) + String(day.getMonth()).padStart(2, '0') + String(day.getDate()).padStart(2, '0');
	}
	private keyMonthParser(date: Date | string) {
		const day = this.parseDate(date);
		return String(day.getFullYear()) + String(day.getMonth()).padStart(2, '0');
	}

}
