import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaAppointmentComponent } from './visa-appointment.component';

describe('VisaAppointmentComponent', () => {
  let component: VisaAppointmentComponent;
  let fixture: ComponentFixture<VisaAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaAppointmentComponent]
    });
    fixture = TestBed.createComponent(VisaAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
