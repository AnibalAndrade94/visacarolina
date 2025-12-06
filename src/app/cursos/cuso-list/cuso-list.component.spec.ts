import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusoListComponent } from './cuso-list.component';

describe('CusoListComponent', () => {
  let component: CusoListComponent;
  let fixture: ComponentFixture<CusoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CusoListComponent]
    });
    fixture = TestBed.createComponent(CusoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
