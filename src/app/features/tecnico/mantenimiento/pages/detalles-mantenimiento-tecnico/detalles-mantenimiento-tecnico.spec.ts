import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoTecnico } from './detalles-mantenimiento-tecnico';

describe('DetallesMantenimientoTecnico', () => {
  let component: DetallesMantenimientoTecnico;
  let fixture: ComponentFixture<DetallesMantenimientoTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
