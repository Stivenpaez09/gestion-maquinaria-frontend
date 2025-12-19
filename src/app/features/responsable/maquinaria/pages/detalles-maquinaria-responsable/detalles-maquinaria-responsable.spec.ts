import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMaquinariaResponsable } from './detalles-maquinaria-responsable';

describe('DetallesMaquinariaResponsable', () => {
  let component: DetallesMaquinariaResponsable;
  let fixture: ComponentFixture<DetallesMaquinariaResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMaquinariaResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMaquinariaResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
