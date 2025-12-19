import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRegistrosHorasMaquinariaAdmin } from './ver-registros-horas-maquinaria-admin';

describe('VerRegistrosHorasMaquinariaAdmin', () => {
  let component: VerRegistrosHorasMaquinariaAdmin;
  let fixture: ComponentFixture<VerRegistrosHorasMaquinariaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerRegistrosHorasMaquinariaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRegistrosHorasMaquinariaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
