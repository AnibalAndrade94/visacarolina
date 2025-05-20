import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaBritanicaComponent } from './eta-britanica.component';

describe('EtaBritanicaComponent', () => {
  let component: EtaBritanicaComponent;
  let fixture: ComponentFixture<EtaBritanicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtaBritanicaComponent]
    });
    fixture = TestBed.createComponent(EtaBritanicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
