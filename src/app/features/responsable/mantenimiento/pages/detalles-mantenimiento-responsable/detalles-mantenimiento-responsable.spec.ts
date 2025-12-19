import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoResponsable } from './detalles-mantenimiento-responsable';

describe('DetallesMantenimientoResponsable', () => {
  let component: DetallesMantenimientoResponsable;
  let fixture: ComponentFixture<DetallesMantenimientoResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
