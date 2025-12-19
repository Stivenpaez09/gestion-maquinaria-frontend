import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPerfilResponsable } from './ver-perfil-responsable';

describe('VerPerfilResponsable', () => {
  let component: VerPerfilResponsable;
  let fixture: ComponentFixture<VerPerfilResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPerfilResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPerfilResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
