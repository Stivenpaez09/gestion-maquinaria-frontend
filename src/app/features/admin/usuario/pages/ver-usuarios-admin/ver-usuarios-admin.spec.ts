import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUsuariosAdmin } from './ver-usuarios-admin';

describe('VerUsuariosAdmin', () => {
  let component: VerUsuariosAdmin;
  let fixture: ComponentFixture<VerUsuariosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerUsuariosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerUsuariosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
