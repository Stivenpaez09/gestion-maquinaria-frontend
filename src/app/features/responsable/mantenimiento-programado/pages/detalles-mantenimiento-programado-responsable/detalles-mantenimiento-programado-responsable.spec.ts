import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoProgramadoResponsable } from './detalles-mantenimiento-programado-responsable';

describe('DetallesMantenimientoProgramadoResponsable', () => {
  let component: DetallesMantenimientoProgramadoResponsable;
  let fixture: ComponentFixture<DetallesMantenimientoProgramadoResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoProgramadoResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoProgramadoResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
