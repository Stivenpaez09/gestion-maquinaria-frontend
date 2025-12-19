import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMantenimientoAdmin } from './detalles-mantenimiento-admin';

describe('DetallesMantenimientoAdmin', () => {
  let component: DetallesMantenimientoAdmin;
  let fixture: ComponentFixture<DetallesMantenimientoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMantenimientoAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMantenimientoAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
