import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesConductorAdmin } from './detalles-conductor-admin';

describe('DetallesConductorAdmin', () => {
  let component: DetallesConductorAdmin;
  let fixture: ComponentFixture<DetallesConductorAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesConductorAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesConductorAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
