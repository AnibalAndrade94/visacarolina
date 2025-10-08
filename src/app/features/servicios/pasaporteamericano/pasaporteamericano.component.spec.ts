import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasaporteamericanoComponent } from './pasaporteamericano.component';

describe('PasaporteamericanoComponent', () => {
  let component: PasaporteamericanoComponent;
  let fixture: ComponentFixture<PasaporteamericanoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasaporteamericanoComponent]
    });
    fixture = TestBed.createComponent(PasaporteamericanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
