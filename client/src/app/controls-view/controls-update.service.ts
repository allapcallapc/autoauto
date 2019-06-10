import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { ControllableDevicesState } from "../../../../common/communication/controllableDevicesState";
import { LoginService } from "../login-screen/login.service";
import { RASP_SERVER_URL } from "../environment";

@Injectable({
  providedIn: "root",
})
export class ControlsUpdateService {

  public socket: SocketIOClient.Socket;

  public constructor() {
    this.socket = io(`${RASP_SERVER_URL}controls`);
  }

  public toggleFilter(): void {
    LoginService.instance.requestKey().subscribe((key: string) => {
      this.socket.emit("toggleFilter", key);
    });
  }

  public toggleBubble(): void {
    LoginService.instance.requestKey().subscribe((key: string) => {
      this.socket.emit("toggleBubble", key);
    });
  }

  public toggleLight(): void {
    LoginService.instance.requestKey().subscribe((key: string) => {
      this.socket.emit("toggleLight", key);
    });
  }

  public startControlling(): void {
    LoginService.instance.requestKey().subscribe((key: string) => {
      this.socket.emit("startControlling", key);
    });
  }

  public stopControlling(): void {
    this.socket.emit("stopControling");
  }

  public makeChangeToTime(time: number): void {
    this.socket.emit("changeTimeControlling", time);
  }

  public onDevicesStateChange(): Observable<ControllableDevicesState> {
    return new Observable<ControllableDevicesState>((observer) => {
      this.socket.on("controls/devicesStateChanged", (data: ControllableDevicesState) => observer.next(data));
    });
  }

  public onSomeoneControlsChange(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.socket.on("controls/someoneControls", (data: boolean) => observer.next(data));
    });
  }

  public onChangeControlRight(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.socket.on("controls/changeControlsRight", (data: boolean) => observer.next(data));
    });
  }

  public justChangedBack(time: number): Observable<boolean> {
    LoginService.instance.requestKey().subscribe((key: string) => {
      this.socket.emit("justChangedBack", key);
    });

    return new Observable<boolean>((observer) => {
      this.socket.on("controls/changeTimes", (data: boolean) => {
        this.socket.removeListener("controls/changeTimes");
        observer.next(data);
      });
    });
  }
}
