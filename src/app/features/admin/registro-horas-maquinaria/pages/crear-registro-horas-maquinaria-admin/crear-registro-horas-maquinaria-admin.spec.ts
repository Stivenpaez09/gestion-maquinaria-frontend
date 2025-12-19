import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRegistroHorasMaquinariaAdmin } from './crear-registro-horas-maquinaria-admin';

describe('CrearRegistroHorasMaquinariaAdmin', () => {
  let component: CrearRegistroHorasMaquinariaAdmin;
  let fixture: ComponentFixture<CrearRegistroHorasMaquinariaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRegistroHorasMaquinariaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRegistroHorasMaquinariaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
