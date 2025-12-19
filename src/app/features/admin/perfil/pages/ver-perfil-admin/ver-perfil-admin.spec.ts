import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPerfilAdmin } from './ver-perfil-admin';

describe('VerPerfilAdmin', () => {
  let component: VerPerfilAdmin;
  let fixture: ComponentFixture<VerPerfilAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPerfilAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPerfilAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
