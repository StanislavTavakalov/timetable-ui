import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingDeleteComponent } from './building-delete.component';

describe('BuildingDeleteComponent', () => {
  let component: BuildingDeleteComponent;
  let fixture: ComponentFixture<BuildingDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
