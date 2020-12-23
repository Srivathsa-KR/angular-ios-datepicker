import { Component, VERSION } from "@angular/core";
import { MONTHS, YEARS } from "./datepicker/date-wheel-picker.constants";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  public date: Date = new Date();
  public MONTH_LIST = MONTHS;

  onDateSelected(event: Date) {
    this.date = event;
  }
}
