import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAlarmasTecnico } from './ver-alarmas-tecnico';

describe('VerAlarmasTecnico', () => {
  let component: VerAlarmasTecnico;
  let fixture: ComponentFixture<VerAlarmasTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAlarmasTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAlarmasTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
