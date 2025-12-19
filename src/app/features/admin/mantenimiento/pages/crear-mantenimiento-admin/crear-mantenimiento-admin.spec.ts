import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMantenimientoAdmin } from './crear-mantenimiento-admin';

describe('CrearMantenimientoAdmin', () => {
  let component: CrearMantenimientoAdmin;
  let fixture: ComponentFixture<CrearMantenimientoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMantenimientoAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMantenimientoAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
