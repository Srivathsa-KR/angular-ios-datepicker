import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from "@angular/core";
import {
  DEFAULT_SETTING,
  DEFAULT_SETTING_ENUM
} from "../isopicker/ios-wheel-picker.component";
import {
  ALLOWED_DATES,
  ALLOWED_DATES_ENUM,
  MONTHS,
  YEARS
} from "./date-wheel-picker.constants";

export const getMaxDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getListOfAllDates = (year, month) => {
  return new Array(getMaxDaysInMonth(year, month))
    .fill(1)
    .map((value, index) => value + index);
};

@Component({
  selector: "app-date-wheel-picker",
  templateUrl: "./date-wheel-picker.component.html",
  styleUrls: ["./date-wheel-picker.component.scss"]
})
export class DatepickerComponent implements OnInit, OnChanges {
  @Input("date") selectedDate: Date;
  @Input("allowedDates") allowedDates: ALLOWED_DATES;
  @Output("onDateSelected") dateEmitter = new EventEmitter<Date>();

  public daysList: number[] = [];
  public YEAR_LIST = YEARS;
  public MONTH_LIST = MONTHS;

  public DEFAULT_MONTHS = MONTHS;
  // public DEFAULT_SETTING_ENUM = DEFAULT_SETTING_ENUM;
  public defaultSetting: DEFAULT_SETTING;
  readonly CURRENT_DATE = new Date();
  constructor() {}

  ngOnInit() {
    this.daysList = getListOfAllDates(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth()
    );

    if (this.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
      const pastYearList = YEARS.slice(
        0,
        YEARS.indexOf(this.CURRENT_DATE.getFullYear() + 1)
      );
      this.YEAR_LIST = pastYearList;
      this.defaultSetting = DEFAULT_SETTING_ENUM.DEFAULT_TO_END as DEFAULT_SETTING;
    } else if (this.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
      const futureYearList = YEARS.slice(
        YEARS.indexOf(this.CURRENT_DATE.getFullYear()),
        YEARS.length
      );
      this.YEAR_LIST = futureYearList;
      this.defaultSetting = DEFAULT_SETTING_ENUM.DEFAULT_TO_START as DEFAULT_SETTING;
    }
    this.setMonthListUponChange(this.selectedDate);
    this.setDaysListUponChange(this.selectedDate);
    // console.log(this.daysList);
  }

  ngOnChanges(change: SimpleChanges) {
    const changedDate: SimpleChange = change.selectedDate;
    const shouldRunChange = changedDate && !changedDate.firstChange;
    // console.log(changedDate);
    if (
      shouldRunChange &&
      changedDate.currentValue.getFullYear() !==
        changedDate.previousValue.getFullYear()
    ) {
      if (
        shouldRunChange &&
        changedDate.currentValue.getFullYear() !==
          changedDate.previousValue.getFullYear()
      ) {
        this.setMonthListUponChange(changedDate.currentValue);
      }
    }

    if (
      shouldRunChange &&
      (changedDate.currentValue.getMonth() !==
        changedDate.previousValue.getMonth() ||
        changedDate.currentValue.getFullYear() !==
          changedDate.previousValue.getFullYear())
    ) {
      this.setDaysListUponChange(changedDate.currentValue);
    }
    // console.log(this.daysList);
  }

  onDayChange(changedDayIndex: number) {
    // console.log({ changedDayIndex });
    this.emitNewlySelectedDate(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.daysList[changedDayIndex]
    );
  }

  onMonthChange(changedMonthIndex: number) {
    const dayToBeSet = this.getDayToBeSet(
      this.selectedDate.getFullYear(),
      MONTHS.indexOf(this.MONTH_LIST[changedMonthIndex]) //To be lifted
    );
    this.emitNewlySelectedDate(
      this.selectedDate.getFullYear(),
      MONTHS.indexOf(this.MONTH_LIST[changedMonthIndex]),
      dayToBeSet
    );
  }

  onYearChange(changedYearIndex: number) {
    const yearToBeSet = this.YEAR_LIST[changedYearIndex];
    const dayToBeSet = this.getDayToBeSet(
      yearToBeSet,
      this.selectedDate.getMonth()
    );
    this.emitNewlySelectedDate(
      yearToBeSet,
      this.selectedDate.getMonth(),
      dayToBeSet
    );
  }

  private setDaysListUponChange(concerenedDate: Date) {
    if (
      concerenedDate.getFullYear() === this.CURRENT_DATE.getFullYear() &&
      concerenedDate.getMonth() === this.CURRENT_DATE.getMonth()
    ) {
      if (this.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
        const previousDaysList = this.daysList.slice(
          0,
          this.daysList.indexOf(this.CURRENT_DATE.getDate() + 1)
        );
        // console.log({previousDaysList});
        this.daysList = previousDaysList;
        // setDaysList(previousDaysList);
      } else if (this.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
        const futureDaysList = this.daysList.slice(
          this.daysList.indexOf(this.CURRENT_DATE.getDate()),
          this.daysList.length + 1
        );
        // console.log({futureDaysList});
        this.daysList = futureDaysList;
        // setDaysList(futureDaysList);
      }
    } else {
      // console.log({selectedDate});
      this.daysList = getListOfAllDates(
        concerenedDate.getFullYear(),
        concerenedDate.getMonth()
      );
    }
  }

  private setMonthListUponChange(concerenedDate: Date) {
    if (concerenedDate.getFullYear() === this.CURRENT_DATE.getFullYear()) {
      if (this.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
        const previousMonths = MONTHS.slice(
          0,
          this.CURRENT_DATE.getMonth() + 1
        );
        // console.log({previousMonths});
        this.MONTH_LIST = previousMonths;
      } else if (this.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
        const futureMonths = MONTHS.slice(
          this.CURRENT_DATE.getMonth(),
          MONTHS.length
        );
        // console.log({futureMonths});
        this.MONTH_LIST = futureMonths;
      }
    } else {
      this.MONTH_LIST = MONTHS;
    }
  }

  private getMinOfDays(maxDaysInMonth: number): number {
    return Math.min(this.selectedDate.getDate(), maxDaysInMonth);
  }

  private getDayToBeSet(year: number, month: number): number {
    const maxDaysInMonth = getMaxDaysInMonth(year, month);
    return this.getMinOfDays(maxDaysInMonth);
  }

  private emitNewlySelectedDate(year, month, date) {
    // console.log({year})
    // console.log({month})
    // console.log({date})
    const newDate = new Date(year, month, date);
    // console.log({newDate})
    this.dateEmitter.emit(newDate);
  }
}
