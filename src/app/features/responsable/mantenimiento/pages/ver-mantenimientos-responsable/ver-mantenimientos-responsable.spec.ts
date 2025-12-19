import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMantenimientosResponsable } from './ver-mantenimientos-responsable';

describe('VerMantenimientosResponsable', () => {
  let component: VerMantenimientosResponsable;
  let fixture: ComponentFixture<VerMantenimientosResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMantenimientosResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMantenimientosResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
