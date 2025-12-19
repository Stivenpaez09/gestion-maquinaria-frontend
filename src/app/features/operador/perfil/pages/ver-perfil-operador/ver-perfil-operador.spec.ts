import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPerfilOperador } from './ver-perfil-operador';

describe('VerPerfilOperador', () => {
  let component: VerPerfilOperador;
  let fixture: ComponentFixture<VerPerfilOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPerfilOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPerfilOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
