import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMaquinariasOperador } from './ver-maquinarias-operador';

describe('VerMaquinariasOperador', () => {
  let component: VerMaquinariasOperador;
  let fixture: ComponentFixture<VerMaquinariasOperador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMaquinariasOperador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMaquinariasOperador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
