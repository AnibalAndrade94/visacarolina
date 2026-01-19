import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarCorreoComponent } from './confirmar-correo.component';

describe('ConfirmarCorreoComponent', () => {
  let component: ConfirmarCorreoComponent;
  let fixture: ComponentFixture<ConfirmarCorreoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmarCorreoComponent]
    });
    fixture = TestBed.createComponent(ConfirmarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
