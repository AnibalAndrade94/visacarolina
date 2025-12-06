import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoDetalleComponent } from './curso-detalle.component';

describe('CursoDetalleComponent', () => {
  let component: CursoDetalleComponent;
  let fixture: ComponentFixture<CursoDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoDetalleComponent]
    });
    fixture = TestBed.createComponent(CursoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
