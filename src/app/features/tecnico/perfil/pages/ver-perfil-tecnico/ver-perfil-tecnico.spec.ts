import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPerfilTecnico } from './ver-perfil-tecnico';

describe('VerPerfilTecnico', () => {
  let component: VerPerfilTecnico;
  let fixture: ComponentFixture<VerPerfilTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPerfilTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPerfilTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
