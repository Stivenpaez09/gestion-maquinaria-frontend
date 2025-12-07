import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMaquinaria } from './crear-maquinaria';

describe('CrearMaquinaria', () => {
  let component: CrearMaquinaria;
  let fixture: ComponentFixture<CrearMaquinaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMaquinaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMaquinaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
