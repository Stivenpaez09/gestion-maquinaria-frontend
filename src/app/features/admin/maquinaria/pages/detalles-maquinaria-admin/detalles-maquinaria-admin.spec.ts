import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMaquinariaAdmin } from './detalles-maquinaria-admin';

describe('DetallesMaquinariaAdmin', () => {
  let component: DetallesMaquinariaAdmin;
  let fixture: ComponentFixture<DetallesMaquinariaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMaquinariaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMaquinariaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
