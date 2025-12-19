import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProyectosAdmin } from './ver-proyectos-admin';

describe('VerProyectosAdmin', () => {
  let component: VerProyectosAdmin;
  let fixture: ComponentFixture<VerProyectosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerProyectosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProyectosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
