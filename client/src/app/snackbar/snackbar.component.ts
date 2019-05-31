import { Component } from "@angular/core";

const DEFAULT_TIMEOUT_TIME: number = 5000;

@Component({
  selector: "app-snackbar",
  templateUrl: "./snackbar.component.html",
  styleUrls: ["./snackbar.component.css"],
})
export class SnackbarComponent {

  public static instance: SnackbarComponent;

  public isShowing: boolean;
  public message: string;
  // tslint:disable-next-line:no-any
  private timeOutP: any;

  public constructor() {
    SnackbarComponent.instance = this;
    this.isShowing = false;
  }

  public show(message: string, timeOut: number = DEFAULT_TIMEOUT_TIME): void {
    this.message = message;
    this.isShowing = true;
    clearTimeout(this.timeOutP);
    this.timeOutP = setTimeout(() => {
      this.isShowing = false;
    },                         timeOut);
  }

}
