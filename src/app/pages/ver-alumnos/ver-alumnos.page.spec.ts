import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerAlumnosPage } from './ver-alumnos.page';

describe('VerAlumnosPage', () => {
  let component: VerAlumnosPage;
  let fixture: ComponentFixture<VerAlumnosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAlumnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
