import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCursosComponent } from './landing-cursos.component';

describe('LandingCursosComponent', () => {
  let component: LandingCursosComponent;
  let fixture: ComponentFixture<LandingCursosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingCursosComponent]
    });
    fixture = TestBed.createComponent(LandingCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
