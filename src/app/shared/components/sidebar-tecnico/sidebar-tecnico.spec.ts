import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTecnico } from './sidebar-tecnico';

describe('SidebarTecnico', () => {
  let component: SidebarTecnico;
  let fixture: ComponentFixture<SidebarTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTecnico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
