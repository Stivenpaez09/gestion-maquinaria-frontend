import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCursoAdmin } from './detalles-curso-admin';

describe('DetallesCursoAdmin', () => {
  let component: DetallesCursoAdmin;
  let fixture: ComponentFixture<DetallesCursoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesCursoAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesCursoAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
