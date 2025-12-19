import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAlarmasAdmin } from './ver-alarmas-admin';

describe('VerAlarmasAdmin', () => {
  let component: VerAlarmasAdmin;
  let fixture: ComponentFixture<VerAlarmasAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerAlarmasAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAlarmasAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
