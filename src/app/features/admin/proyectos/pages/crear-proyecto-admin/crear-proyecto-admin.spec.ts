import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProyectoAdmin } from './crear-proyecto-admin';

describe('CrearProyectoAdmin', () => {
  let component: CrearProyectoAdmin;
  let fixture: ComponentFixture<CrearProyectoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearProyectoAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearProyectoAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
