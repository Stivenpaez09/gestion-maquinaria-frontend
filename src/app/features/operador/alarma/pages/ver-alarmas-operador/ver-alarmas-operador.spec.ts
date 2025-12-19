import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAlarmasOperador } from './ver-alarmas-operador';

describe('VerAlarmasOperador', () => {
  let component: VerAlarmasOperador;
  let fixture: ComponentFixture<VerAlarmasOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAlarmasOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAlarmasOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
