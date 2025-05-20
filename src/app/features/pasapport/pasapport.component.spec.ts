import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasapportComponent } from './pasapport.component';

describe('PasapportComponent', () => {
  let component: PasapportComponent;
  let fixture: ComponentFixture<PasapportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasapportComponent]
    });
    fixture = TestBed.createComponent(PasapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
