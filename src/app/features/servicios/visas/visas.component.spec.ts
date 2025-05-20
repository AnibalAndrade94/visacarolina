import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisasComponent } from './visas.component';

describe('VisasComponent', () => {
  let component: VisasComponent;
  let fixture: ComponentFixture<VisasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisasComponent]
    });
    fixture = TestBed.createComponent(VisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
