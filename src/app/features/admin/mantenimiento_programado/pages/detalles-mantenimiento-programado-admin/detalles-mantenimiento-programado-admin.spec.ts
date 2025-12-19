import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoProgramadoAdmin } from './detalles-mantenimiento-programado-admin';

describe('DetallesMantenimientoProgramadoAdmin', () => {
  let component: DetallesMantenimientoProgramadoAdmin;
  let fixture: ComponentFixture<DetallesMantenimientoProgramadoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoProgramadoAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoProgramadoAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
