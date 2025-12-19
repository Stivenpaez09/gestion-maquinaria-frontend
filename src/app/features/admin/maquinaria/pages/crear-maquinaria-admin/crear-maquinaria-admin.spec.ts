import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMaquinariaAdmin } from './crear-maquinaria-admin';

describe('CrearMaquinariaAdmin', () => {
  let component: CrearMaquinariaAdmin;
  let fixture: ComponentFixture<CrearMaquinariaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMaquinariaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMaquinariaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
