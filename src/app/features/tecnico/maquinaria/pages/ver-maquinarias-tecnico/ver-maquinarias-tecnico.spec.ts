import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMaquinariasTecnico } from './ver-maquinarias-tecnico';

describe('VerMaquinariasTecnico', () => {
  let component: VerMaquinariasTecnico;
  let fixture: ComponentFixture<VerMaquinariasTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMaquinariasTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMaquinariasTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
