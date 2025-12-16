import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbassyMapComponent } from './embassy-map.component';

describe('EmbassyMapComponent', () => {
  let component: EmbassyMapComponent;
  let fixture: ComponentFixture<EmbassyMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmbassyMapComponent]
    });
    fixture = TestBed.createComponent(EmbassyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
