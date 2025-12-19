import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesLoginAdmin } from './detalles-login-admin';

describe('DetallesLoginAdmin', () => {
  let component: DetallesLoginAdmin;
  let fixture: ComponentFixture<DetallesLoginAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesLoginAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesLoginAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
