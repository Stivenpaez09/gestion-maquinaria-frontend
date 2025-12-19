import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesRegistroHorasMaquinariaAdmin } from './detalles-registro-horas-maquinaria-admin';

describe('DetallesRegistroHorasMaquinariaAdmin', () => {
  let component: DetallesRegistroHorasMaquinariaAdmin;
  let fixture: ComponentFixture<DetallesRegistroHorasMaquinariaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesRegistroHorasMaquinariaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesRegistroHorasMaquinariaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
