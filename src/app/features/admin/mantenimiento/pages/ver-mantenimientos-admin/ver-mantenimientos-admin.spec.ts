import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMantenimientosAdmin } from './ver-mantenimientos-admin';

describe('VerMantenimientosAdmin', () => {
  let component: VerMantenimientosAdmin;
  let fixture: ComponentFixture<VerMantenimientosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMantenimientosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMantenimientosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
