import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTariffDatatableComponent } from './work-tariff-datatable.component';

describe('WorkTariffDatatableComponent', () => {
  let component: WorkTariffDatatableComponent;
  let fixture: ComponentFixture<WorkTariffDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTariffDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTariffDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
