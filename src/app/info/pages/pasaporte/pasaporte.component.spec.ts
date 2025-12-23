import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasaporteComponent } from './pasaporte.component';

describe('PasaporteComponent', () => {
  let component: PasaporteComponent;
  let fixture: ComponentFixture<PasaporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasaporteComponent]
    });
    fixture = TestBed.createComponent(PasaporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
