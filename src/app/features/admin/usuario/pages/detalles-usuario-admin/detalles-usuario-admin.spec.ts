import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesUsuarioAdmin } from './detalles-usuario-admin';

describe('DetallesUsuarioAdmin', () => {
  let component: DetallesUsuarioAdmin;
  let fixture: ComponentFixture<DetallesUsuarioAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesUsuarioAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesUsuarioAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
