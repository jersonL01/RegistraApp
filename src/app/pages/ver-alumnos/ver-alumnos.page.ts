import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-ver-alumnos',
  templateUrl: './ver-alumnos.page.html',
  styleUrls: ['./ver-alumnos.page.scss'],
})
export class VerAlumnosPage implements OnInit {
  cursoId: string = ''; // ID del curso
  alumnos: any[] = [];  // Lista de alumnos

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    // Obtener el ID del curso desde la URL
    this.cursoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.cursoId) {
      this.cargarAlumnosDelCurso();
    }
  }

  cargarAlumnosDelCurso() {
    // Obtener el curso por su ID
    this.authService.obtenerCursoPorId(this.cursoId).subscribe((curso) => {
      if (curso && curso.alumnos && curso.alumnos.length > 0) {
        // Obtener detalles de los alumnos asignados al curso
        this.authService.obtenerAlumnosPorUIDs(curso.alumnos).subscribe((alumnos) => {
          this.alumnos = alumnos;
        });
      } else {
        console.warn('El curso no tiene alumnos asignados');
      }
    });
  }
}
