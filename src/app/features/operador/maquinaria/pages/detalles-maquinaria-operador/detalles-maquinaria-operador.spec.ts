import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMaquinariaOperador } from './detalles-maquinaria-operador';

describe('DetallesMaquinariaOperador', () => {
  let component: DetallesMaquinariaOperador;
  let fixture: ComponentFixture<DetallesMaquinariaOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMaquinariaOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMaquinariaOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
