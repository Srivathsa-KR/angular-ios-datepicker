export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

export const YEARS = new Array(201)
  .fill(1900)
  .map((value, index) => value + index);

export const ALLOWED_DATES_ENUM = {
  PAST_DATES: "PAST_DATES",
  FUTURE_DATES: "FUTURE_DATES"
};

export type ALLOWED_DATES = keyof typeof ALLOWED_DATES_ENUM;
