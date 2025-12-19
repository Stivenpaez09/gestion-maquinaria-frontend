import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMantenimientosTecnico } from './ver-mantenimientos-tecnico';

describe('VerMantenimientosTecnico', () => {
  let component: VerMantenimientosTecnico;
  let fixture: ComponentFixture<VerMantenimientosTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMantenimientosTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMantenimientosTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
