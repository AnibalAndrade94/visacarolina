import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaEligibilityWizardComponent } from './visa-eligibility-wizard.component';

describe('VisaEligibilityWizardComponent', () => {
  let component: VisaEligibilityWizardComponent;
  let fixture: ComponentFixture<VisaEligibilityWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaEligibilityWizardComponent]
    });
    fixture = TestBed.createComponent(VisaEligibilityWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
