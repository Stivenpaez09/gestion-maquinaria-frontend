import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMantenimientoTecnico } from './crear-mantenimiento-tecnico';

describe('CrearMantenimientoTecnico', () => {
  let component: CrearMantenimientoTecnico;
  let fixture: ComponentFixture<CrearMantenimientoTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMantenimientoTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMantenimientoTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
