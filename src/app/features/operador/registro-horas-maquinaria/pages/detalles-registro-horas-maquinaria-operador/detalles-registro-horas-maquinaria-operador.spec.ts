import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesRegistroHorasMaquinariaOperador } from './detalles-registro-horas-maquinaria-operador';

describe('DetallesRegistroHorasMaquinariaOperador', () => {
  let component: DetallesRegistroHorasMaquinariaOperador;
  let fixture: ComponentFixture<DetallesRegistroHorasMaquinariaOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesRegistroHorasMaquinariaOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesRegistroHorasMaquinariaOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
