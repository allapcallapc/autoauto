import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { LoginService } from "./login-screen/login.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
    public constructor(private loginService: LoginService) {}

    public ngOnInit(): void {
      this.loginService = this.loginService;
    }

    public isHomeView(): boolean {
      return !location.href.endsWith("Home");
    }

    public getCurrent(): string {
      const current: string | undefined = location.href.split("/").pop();

      return current === undefined ? "" : current;
    }

    public isLoginScreenOn(): boolean {
      const INSTANCE: LoginService = LoginService.instance;

      return INSTANCE === undefined ? false : INSTANCE.isLoginScreenOn;
    }

    @HostListener("window:beforeunload")
    public ngOnDestroy(): void {
      this.loginService.clearKey();
    }
}
