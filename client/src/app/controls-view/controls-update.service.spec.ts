import { TestBed } from "@angular/core/testing";

import { ControlsUpdateService } from "./controls-update.service";

describe("ControlsUpdateService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ControlsUpdateService = TestBed.get(ControlsUpdateService);
    expect(service).toBeTruthy();
  });
});
