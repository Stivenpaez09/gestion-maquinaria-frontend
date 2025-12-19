import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAlarmasResponsable } from './ver-alarmas-responsable';

describe('VerAlarmasResponsable', () => {
  let component: VerAlarmasResponsable;
  let fixture: ComponentFixture<VerAlarmasResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAlarmasResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAlarmasResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
