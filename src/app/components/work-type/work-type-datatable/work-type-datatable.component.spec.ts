import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTypeDatatableComponent } from './work-type-datatable.component';

describe('WorkTypeDatatableComponent', () => {
  let component: WorkTypeDatatableComponent;
  let fixture: ComponentFixture<WorkTypeDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTypeDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTypeDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
