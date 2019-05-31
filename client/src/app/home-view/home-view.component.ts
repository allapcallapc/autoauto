import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";

const MIN_WIDTH_BUTTON_DIV: number = 80;

@Component({
  selector: "app-home-view",
  templateUrl: "./home-view.component.html",
  styleUrls: ["./home-view.component.css"],
})
export class HomeViewComponent implements OnInit {

    public hasBeenClicked: boolean;
    public isSmallTextClass: boolean;

    public constructor(private router: Router) {
        this.hasBeenClicked = false;
    }

    public onClick(): void {
        this.router.navigate(["Controls"]);
    }

    public get heightFishes(): number {
        // tslint:disable-next-line:no-magic-numbers
        return window.innerHeight * 0.98;
    }

    @HostListener("window:resize", ["$event"])
    public ngOnInit(): void {
        const ELEMENT: HTMLElement | null = document.getElementById("buttonContainer");
        this.isSmallTextClass = (ELEMENT === null) ? false : this.isSmallTextClass = ELEMENT.clientWidth <= MIN_WIDTH_BUTTON_DIV;
    }
}
