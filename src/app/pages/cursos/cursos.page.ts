import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service'; // Asegúrate de tener este servicio para obtener el usuario autenticado

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {
  usuario: any = null; // Datos del usuario autenticado
  cursos: any[] = [];   // Lista de cursos asignados al usuario
  uid: string = '';    // UID del usuario autenticado

  constructor(
    private authservice: AuthService,  // Servicio de autenticación para obtener el usuario autenticado
    private firestore: AngularFirestore,
    private router: Router // Para acceder a Firestore
  ) { }

  ngOnInit() {
    this.getCurrentUser();  // Obtener el usuario autenticado
  }

  // Obtener el usuario autenticado
  getCurrentUser() {
    this.authservice.getUser().subscribe(user => {
      if (user) {
        this.uid = user.uid;  // Guardar el UID del usuario
        this.cargarUsuario(); // Cargar los datos del usuario
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  // Cargar los datos del usuario desde Firestore y obtener los cursos asignados
  cargarUsuario() {
    this.firestore.collection('usuarios').doc(this.uid).get().toPromise()
      .then((userDoc) => {
        if (userDoc && userDoc.exists) {
          this.usuario = userDoc.data();  // Asignar los datos del usuario
          const cursosIds = this.usuario?.cursos || [];  // Obtener los IDs de los cursos asignados

          // Cargar los detalles de los cursos asignados
          if (cursosIds.length > 0) {
            this.cargarCursos(cursosIds);
          } else {
            console.log("El usuario no tiene cursos asignados.");
          }
        } else {
          console.log("El usuario no existe en la base de datos.");
        }
      })
      .catch(error => {
        console.error("Error al cargar los datos del usuario", error);
      });
  }

  // Cargar los cursos desde Firestore usando los IDs de los cursos
  cargarCursos(cursosIds: string[]) {
    cursosIds.forEach((cursoId) => {
      this.firestore.collection('cursos').doc(cursoId).get().toPromise()
        .then((cursoDoc) => {
          if (cursoDoc && cursoDoc.exists) {
            let cursoData = cursoDoc.data();
            let cursoId = cursoDoc.id;  // Obtener el ID del documento
            if (cursoData && typeof cursoData === 'object') {
              this.cursos.push({ ...cursoData, id: cursoId });  // Agregar el ID al objeto del curso
            } else {
              console.log("Los datos del curso no son un objeto.");
            }
          } else {
            console.log("Curso no encontrado.");
          }
        })
        .catch(error => {
          console.error("Error al cargar el curso", error);
        });
    });
  }

  // Redirigir a la página de ver alumnos y pasar el ID del curso
  verAlumnos(uid: string) {
      this.router.navigate(['/ver-alumnos',uid]);  // Redirigir usando el ID del curso
  }

  

}
