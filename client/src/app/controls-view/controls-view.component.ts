import { Component, OnInit } from "@angular/core";
import { ControllableDevicesState } from "../../../../common/communication/controllableDevicesState";
import { LoginService } from "../login-screen/login.service";
import { SnackbarComponent } from "../snackbar/snackbar.component";
import { ControlsUpdateService } from "./controls-update.service";
import { TimerControlling } from "./timerControlling";

@Component({
  selector: "app-controls-view",
  templateUrl: "./controls-view.component.html",
  styleUrls: ["./controls-view.component.css"],
})
export class ControlsViewComponent implements OnInit {

  public devicesState: ControllableDevicesState;
  public isSomeoneControlling: boolean;
  public isControlling: boolean;

  public constructor(private controlsUpdate: ControlsUpdateService, private timer: TimerControlling) {
    this.devicesState = {filter: false, light: false, bubble: false};
    this.isSomeoneControlling = false;
    this.isControlling = false;
    this.setControlsUpdateListener();
  }

  public ngOnInit(): void {
    if (LoginService.instance.isKeyAvailable()) {
      const OLD_TIME: number = this.timer.time;
      this.controlsUpdate.justChangedBack(this.timer.time).subscribe((isControlling: boolean) => {
        this.isControlling = isControlling;
        if (isControlling) {
          this.controlsUpdate.makeChangeToTime(OLD_TIME);
          this.timer.resetTime(OLD_TIME);
        }
      });
    }
  }

  public setControlsUpdateListener(): void {
    this.controlsUpdate.onDevicesStateChange().subscribe((state: ControllableDevicesState) => { this.devicesState = state; });
    this.controlsUpdate.onSomeoneControlsChange().subscribe((isControlling: boolean) => { this.isSomeoneControlling = isControlling; });
    this.controlsUpdate.onChangeControlRight().subscribe((isControlling: boolean) => {
      if (!this.isControlling && isControlling) {
        this.timer.resetTime();
      }
      this.isControlling = isControlling;
    });
  }

  public toggleFilter(): void {
    if (this.triesToggle()) {
      this.controlsUpdate.toggleFilter();
    }
  }

  public toggleBubble(): void {
    if (this.triesToggle()) {
      this.controlsUpdate.toggleBubble();
    }
  }

  public toggleLight(): void {
    if (this.triesToggle()) {
      this.controlsUpdate.toggleLight();
    }
  }

  private triesToggle(): boolean {
    if (!this.isControlling) {
      SnackbarComponent.instance.show("You are not controlling ! If you want control you just have to ask for it ...");
    }

    return this.isControlling;
  }

  public startControlling(): void {
    this.controlsUpdate.startControlling();
  }

  public stopControlling(): void {
    this.controlsUpdate.stopControlling();
  }

  public timeChanged(isIncrement: boolean): void {
    if (this.timer) {
      isIncrement ? this.timer.addTime() : this.timer.removeTime();
      this.controlsUpdate.makeChangeToTime(this.timer.time);
    }
  }

}
