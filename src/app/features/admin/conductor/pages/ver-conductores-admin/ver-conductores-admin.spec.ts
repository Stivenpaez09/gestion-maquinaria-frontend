import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerConductoresAdmin } from './ver-conductores-admin';

describe('VerConductoresAdmin', () => {
  let component: VerConductoresAdmin;
  let fixture: ComponentFixture<VerConductoresAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerConductoresAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerConductoresAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
