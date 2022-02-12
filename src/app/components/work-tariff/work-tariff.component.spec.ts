import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTariffComponent } from './work-tariff.component';

describe('WorkTariffComponent', () => {
  let component: WorkTariffComponent;
  let fixture: ComponentFixture<WorkTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTariffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
