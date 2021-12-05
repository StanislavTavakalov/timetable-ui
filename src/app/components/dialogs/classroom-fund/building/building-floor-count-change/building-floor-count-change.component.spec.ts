import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingFloorCountChangeComponent } from './building-floor-count-change.component';

describe('BuildingFloorCountChangeComponent', () => {
  let component: BuildingFloorCountChangeComponent;
  let fixture: ComponentFixture<BuildingFloorCountChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingFloorCountChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingFloorCountChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
