import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaCanadaComponent } from './eta-canada.component';

describe('EtaCanadaComponent', () => {
  let component: EtaCanadaComponent;
  let fixture: ComponentFixture<EtaCanadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtaCanadaComponent]
    });
    fixture = TestBed.createComponent(EtaCanadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
