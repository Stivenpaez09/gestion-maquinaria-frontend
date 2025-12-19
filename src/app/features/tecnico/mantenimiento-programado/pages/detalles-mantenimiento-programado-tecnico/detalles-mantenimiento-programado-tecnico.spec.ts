import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoProgramadoTecnico } from './detalles-mantenimiento-programado-tecnico';

describe('DetallesMantenimientoProgramadoTecnico', () => {
  let component: DetallesMantenimientoProgramadoTecnico;
  let fixture: ComponentFixture<DetallesMantenimientoProgramadoTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoProgramadoTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoProgramadoTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
