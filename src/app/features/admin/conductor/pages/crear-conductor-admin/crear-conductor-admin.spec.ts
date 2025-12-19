import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearConductorAdmin } from './crear-conductor-admin';

describe('CrearConductorAdmin', () => {
  let component: CrearConductorAdmin;
  let fixture: ComponentFixture<CrearConductorAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearConductorAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearConductorAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
