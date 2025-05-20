import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormvisaComponent } from './formvisa.component';

describe('FormvisaComponent', () => {
  let component: FormvisaComponent;
  let fixture: ComponentFixture<FormvisaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormvisaComponent]
    });
    fixture = TestBed.createComponent(FormvisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
