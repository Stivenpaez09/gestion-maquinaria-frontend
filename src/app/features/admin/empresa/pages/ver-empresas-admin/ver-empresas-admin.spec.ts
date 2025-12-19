import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEmpresasAdmin } from './ver-empresas-admin';

describe('VerEmpresasAdmin', () => {
  let component: VerEmpresasAdmin;
  let fixture: ComponentFixture<VerEmpresasAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEmpresasAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEmpresasAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
