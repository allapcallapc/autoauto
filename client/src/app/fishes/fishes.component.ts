import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from "@angular/core";
import { RenderService } from "./render.service";

@Component({
  selector: "app-fishes",
  templateUrl: "./fishes.component.html",
  styleUrls: ["./fishes.component.css"],
})
export class FishesComponent implements AfterViewInit, OnDestroy {

  @ViewChild("container") private containerRef: ElementRef;

  public constructor(private renderService: RenderService) { }

  public ngAfterViewInit(): void {
    this.renderService.initialize(this.container);
  }

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @HostListener("document:keypress")
  public attackOnKey(): void {
      this.renderService.aquariumLife.attackOnKey();
  }

  public ngOnDestroy(): void {
    this.renderService.stop();
  }

}
