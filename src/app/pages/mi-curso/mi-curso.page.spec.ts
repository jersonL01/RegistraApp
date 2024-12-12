import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiCursoPage } from './mi-curso.page';

describe('MiCursoPage', () => {
  let component: MiCursoPage;
  let fixture: ComponentFixture<MiCursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiCursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
