import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "./login.service";

// tslint:disable-next-line:no-magic-numbers
const IGNORE_KEY_CODE: number[] = [8, 16, 17, 18, 20, 46];

@Component({
  selector: "app-login-screen",
  templateUrl: "./login-screen.component.html",
  styleUrls: ["./login-screen.component.css"],
})
export class LoginScreenComponent implements OnInit {

  public form: FormGroup;
  public isError: boolean;
  @ViewChild("inputNameBox") public inputNameBox: ElementRef;

  public constructor(private fb: FormBuilder) {
    this.isError = false;
    this.form = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  public ngOnInit(): void {}

  public login(): void {
    LoginService.instance.login(this.form.controls["username"].value, this.form.controls["password"].value).then((isGoodCreds: boolean) => {
      isGoodCreds ? this.goodCredentialEntered() : this.badCredentialEntered();
    }).catch(() => { this.badCredentialEntered(); });
  }

  public goodCredentialEntered(): void {
    this.isError = false;
  }

  public badCredentialEntered(): void {
    this.isError = true;
    this.form.controls["password"].setValue("");
  }

  public keyDownFunction(event: KeyboardEvent): void {
    const ENTER_CODE: number = 13;
    if (event.keyCode === ENTER_CODE && !this.isSendDisabled()) {
      this.login();
    }
  }

  public isSendDisabled(): boolean {
    return this.form.status === "INVALID";
  }

  @HostListener("window:keyup", ["$event"])
  public keyrelease(event: KeyboardEvent): void {
    if (!this.form.dirty) {
      if (IGNORE_KEY_CODE.indexOf(event.keyCode) === -1) {
        this.form.controls["username"].setValue(event.key);
      }
      this.inputNameBox.nativeElement.focus();
      console.log(event.keyCode);
    }
  }

}
