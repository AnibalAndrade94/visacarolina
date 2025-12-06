import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoPlayerComponent } from './curso-player.component';

describe('CursoPlayerComponent', () => {
  let component: CursoPlayerComponent;
  let fixture: ComponentFixture<CursoPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoPlayerComponent]
    });
    fixture = TestBed.createComponent(CursoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
