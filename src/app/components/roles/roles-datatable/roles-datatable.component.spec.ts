import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesDatatableComponent } from './roles-datatable.component';

describe('RolesDatatableComponent', () => {
  let component: RolesDatatableComponent;
  let fixture: ComponentFixture<RolesDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
