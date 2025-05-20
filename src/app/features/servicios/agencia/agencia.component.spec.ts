import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenciaComponent } from './agencia.component';

describe('AgenciaComponent', () => {
  let component: AgenciaComponent;
  let fixture: ComponentFixture<AgenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgenciaComponent]
    });
    fixture = TestBed.createComponent(AgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
