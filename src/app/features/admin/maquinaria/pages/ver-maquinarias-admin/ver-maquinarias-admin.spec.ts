import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMaquinariasAdmin } from './ver-maquinarias-admin';

describe('VerMaquinariasAdmin', () => {
  let component: VerMaquinariasAdmin;
  let fixture: ComponentFixture<VerMaquinariasAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMaquinariasAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMaquinariasAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
