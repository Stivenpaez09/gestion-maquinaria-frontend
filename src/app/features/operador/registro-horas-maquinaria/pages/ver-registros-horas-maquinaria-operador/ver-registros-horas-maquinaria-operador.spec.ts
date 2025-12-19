import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRegistrosHorasMaquinariaOperador } from './ver-registros-horas-maquinaria-operador';

describe('VerRegistrosHorasMaquinariaOperador', () => {
  let component: VerRegistrosHorasMaquinariaOperador;
  let fixture: ComponentFixture<VerRegistrosHorasMaquinariaOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerRegistrosHorasMaquinariaOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRegistrosHorasMaquinariaOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
