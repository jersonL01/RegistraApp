import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarCursosPage } from './modificar-cursos.page';

describe('ModificarCursosPage', () => {
  let component: ModificarCursosPage;
  let fixture: ComponentFixture<ModificarCursosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarCursosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
