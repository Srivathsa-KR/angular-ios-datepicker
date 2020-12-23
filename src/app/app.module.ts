import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { DatepickerComponent } from "./datepicker/date-wheel-picker.component";
import { IosWheelPickerComponent } from "./isopicker/ios-wheel-picker.component";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, DatepickerComponent, IosWheelPickerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
