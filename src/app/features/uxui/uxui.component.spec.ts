import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UxuiComponent } from './uxui.component';

describe('UxuiComponent', () => {
  let component: UxuiComponent;
  let fixture: ComponentFixture<UxuiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UxuiComponent]
    });
    fixture = TestBed.createComponent(UxuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
