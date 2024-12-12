import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-mi-curso',
  templateUrl: './mi-curso.page.html',
  styleUrls: ['./mi-curso.page.scss'],
})
export class MiCursoPage implements OnInit  {
  cursoId: string = '';
  curso: any = null;
  profesor: any = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtener el ID del curso desde la URL
    this.cursoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.cursoId) {
      this.cargarInformacionCurso();
    }
  }

  cargarInformacionCurso() {
    // Obtener información del curso
    this.authService.InformacionCurso(this.cursoId).subscribe({
      next: (curso) => {
        this.curso = curso;
        if (curso?.profesor) {
          // Obtener información del profesor
          this.authService.InformacionProfesor(curso.profesor).subscribe({
            next: (profesor) => {
              this.profesor = profesor;
            },
            error: (err) => {
              console.error('Error al obtener la información del profesor:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener la información del curso:', err);
      }
    });
  }
}