import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMaquinariasResponsable } from './ver-maquinarias-responsable';

describe('VerMaquinariasResponsable', () => {
  let component: VerMaquinariasResponsable;
  let fixture: ComponentFixture<VerMaquinariasResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMaquinariasResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMaquinariasResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
