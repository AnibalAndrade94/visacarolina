import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCodigosComponent } from './admin-codigos.component';

describe('AdminCodigosComponent', () => {
  let component: AdminCodigosComponent;
  let fixture: ComponentFixture<AdminCodigosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCodigosComponent]
    });
    fixture = TestBed.createComponent(AdminCodigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
