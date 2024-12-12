import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaCursosPage } from './lista-cursos.page';

describe('ListaCursosPage', () => {
  let component: ListaCursosPage;
  let fixture: ComponentFixture<ListaCursosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCursosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
