import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRegistroHorasMaquinariaOperador } from './crear-registro-horas-maquinaria-operador';

describe('CrearRegistroHorasMaquinariaOperador', () => {
  let component: CrearRegistroHorasMaquinariaOperador;
  let fixture: ComponentFixture<CrearRegistroHorasMaquinariaOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRegistroHorasMaquinariaOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRegistroHorasMaquinariaOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
