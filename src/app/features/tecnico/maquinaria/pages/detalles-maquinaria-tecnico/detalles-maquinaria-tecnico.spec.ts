import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMaquinariaTecnico } from './detalles-maquinaria-tecnico';

describe('DetallesMaquinariaTecnico', () => {
  let component: DetallesMaquinariaTecnico;
  let fixture: ComponentFixture<DetallesMaquinariaTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMaquinariaTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMaquinariaTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
