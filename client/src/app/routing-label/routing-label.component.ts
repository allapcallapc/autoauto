import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-routing-label",
  templateUrl: "./routing-label.component.html",
  styleUrls: ["./routing-label.component.css"],
})
export class RoutingLabelComponent {

  @Input() public current: string;

  public constructor(private router: Router) {
    this.current = "";
  }

  public onButtonClick(buttonClickedName: string): void {
    this.router.navigate([buttonClickedName]);
  }

}
