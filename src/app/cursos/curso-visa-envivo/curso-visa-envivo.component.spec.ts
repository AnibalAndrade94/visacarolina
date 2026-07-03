import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoVisaEnvivoComponent } from './curso-visa-envivo.component';

describe('CursoVisaEnvivoComponent', () => {
  let component: CursoVisaEnvivoComponent;
  let fixture: ComponentFixture<CursoVisaEnvivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoVisaEnvivoComponent]
    });
    fixture = TestBed.createComponent(CursoVisaEnvivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
