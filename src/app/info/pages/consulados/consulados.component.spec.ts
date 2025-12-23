import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsuladosComponent } from './consulados.component';

describe('ConsuladosComponent', () => {
  let component: ConsuladosComponent;
  let fixture: ComponentFixture<ConsuladosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsuladosComponent]
    });
    fixture = TestBed.createComponent(ConsuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
