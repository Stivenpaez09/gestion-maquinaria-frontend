import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesEmpresaAdmin } from './detalles-empresa-admin';

describe('DetallesEmpresaAdmin', () => {
  let component: DetallesEmpresaAdmin;
  let fixture: ComponentFixture<DetallesEmpresaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesEmpresaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesEmpresaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
