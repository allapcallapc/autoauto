import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { Credential } from "../../../../common/communication/credential";
import { SnackbarComponent } from "../snackbar/snackbar.component";
import { RASP_SERVER_URL } from "../environment";

const CREDENTIAL_KEY_STORAGE: string = "CredsInStorage_132455651316fsdufhks kfsd";

@Injectable({
  providedIn: "root",
})
export class LoginService {

  public static instance: LoginService;

  public socket: SocketIOClient.Socket;
  public isLoginScreenOn: boolean;
  public promiseNewKey: EventEmitter<string>;

  public constructor() {
    this.socket = io(`${RASP_SERVER_URL}account`);
    this.isLoginScreenOn = false;
    LoginService.instance = this;
    this.promiseNewKey = new EventEmitter<string>();
    this.socket.on("invalidKeyTried", (key: string) => {
      if (this.getKey() === key && this.getKey() !== undefined) {
        this.isLoginScreenOn = true;
      }
    });

    this.socket.on("account/newConnection", (name: string) => {
      SnackbarComponent.instance.show(`${name} just connected !`);
    });
  }

  private getKey(): string | undefined {
    const CREDS: string | null = sessionStorage.getItem(CREDENTIAL_KEY_STORAGE);

    return CREDS === null ? undefined : JSON.parse(CREDS).key;
  }

  public login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const LOGIN_CREDENTIAL: Credential = { username: username, password: password };
      this.socket.emit("login", LOGIN_CREDENTIAL);
      this.socket.on("loginAnswer", (credential: Credential) => {
        this.socket.removeListener("loginAnswer");
        resolve(this.parseAnswer(credential));
      });
    });
  }

  private parseAnswer(credential: Credential): boolean {
    sessionStorage.setItem(CREDENTIAL_KEY_STORAGE, JSON.stringify(credential));
    const RESULT: boolean = credential.key !== undefined;
    if (RESULT) {
      this.isLoginScreenOn = false;
      this.promiseNewKey.emit(credential.key);
    }

    return RESULT;
  }

  public requestKey(): Observable<string> {
    const KEY: string | undefined = this.getKey();
    this.isLoginScreenOn = KEY === undefined;

    return (this.isLoginScreenOn) ?
      new Observable<string>((observer) => {
        this.promiseNewKey.subscribe((key: string) => { observer.next(key); });
      }) :
      new Observable<string>((observer) => { observer.next(KEY); });
  }

  public clearKey(): void {
    sessionStorage.removeItem(CREDENTIAL_KEY_STORAGE);
  }

  public isKeyAvailable(): boolean {
    return this.getKey() !== undefined;
  }
}
