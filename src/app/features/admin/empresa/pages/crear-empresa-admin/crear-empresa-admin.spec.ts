import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEmpresaAdmin } from './crear-empresa-admin';

describe('CrearEmpresaAdmin', () => {
  let component: CrearEmpresaAdmin;
  let fixture: ComponentFixture<CrearEmpresaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEmpresaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEmpresaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
