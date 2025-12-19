import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoProgramadoOperador } from './detalles-mantenimiento-programado-operador';

describe('DetallesMantenimientoProgramadoOperador', () => {
  let component: DetallesMantenimientoProgramadoOperador;
  let fixture: ComponentFixture<DetallesMantenimientoProgramadoOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoProgramadoOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoProgramadoOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
