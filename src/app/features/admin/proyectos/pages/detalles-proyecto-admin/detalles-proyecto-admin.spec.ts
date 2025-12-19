import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesProyectoAdmin } from './detalles-proyecto-admin';

describe('DetallesProyectoAdmin', () => {
  let component: DetallesProyectoAdmin;
  let fixture: ComponentFixture<DetallesProyectoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesProyectoAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesProyectoAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
