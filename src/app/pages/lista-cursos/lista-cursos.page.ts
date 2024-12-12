import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensaje.service'; // Importa el servicio

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista-cursos.page.html',
  styleUrls: ['./lista-cursos.page.scss'],
})
export class ListaCursosPage implements OnInit {
  cursos: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private mensajes: MensajesService // Inyecta el servicio
  ) {}

  ngOnInit() {
    this.config();
  }

  async config() {
    this.firestore
      .collection('cursos')
      .snapshotChanges()
      .subscribe((snapshot) => {
        this.cursos = snapshot.map((curso) => {
          return {
            uid: curso.payload.doc.id, // Incluye el ID del documento
            ...curso.payload.doc.data() as any,
          };
        });
      });
  }

  eliminarCurso(uid: string) {
    // Confirmación estilizada
    this.mensajes
      .mensaje(
        '¿Estás seguro de que deseas eliminar este curso?',
        'warning',
        'Confirmación'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.firestore
            .collection('cursos')
            .doc(uid)
            .delete()
            .then(() => {
              this.mensajes.mensaje(
                'Curso eliminado correctamente',
                'success',
                'Éxito!'
              );
            })
            .catch((error) => {
              console.error('Error al eliminar el curso:', error);
              this.mensajes.mensaje(
                'No se pudo eliminar el curso. Intenta nuevamente.',
                'error',
                'Error!'
              );
            });
        }
      });
  }

  editarCursos(uid: string) {
    this.router.navigate(['/modificar-cursos', uid]);
  }
}
