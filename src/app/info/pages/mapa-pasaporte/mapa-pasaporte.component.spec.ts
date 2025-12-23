import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaPasaporteComponent } from './mapa-pasaporte.component';

describe('MapaPasaporteComponent', () => {
  let component: MapaPasaporteComponent;
  let fixture: ComponentFixture<MapaPasaporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapaPasaporteComponent]
    });
    fixture = TestBed.createComponent(MapaPasaporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
