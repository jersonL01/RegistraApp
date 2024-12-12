import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { MensajesService } from 'src/app/services/mensaje.service';
import { Usuario } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-modificar-cursos',
  templateUrl: './modificar-cursos.page.html',
  styleUrls: ['./modificar-cursos.page.scss'],
})
export class ModificarCursosPage implements OnInit {
  alumnos: Usuario[] = [];
  alumnosSeleccionados: string[] = []; // Almacenar UIDs de alumnos seleccionados

  nombreCurso: string = '';
  seccion: string = '';
  imagen: File | null = null;
  cursoId: string = '';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private mensajes: MensajesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get('uid')!;
    this.obtenerCurso();
    this.cargarAlumnos();
  }

  obtenerCurso() {
    this.firestore
      .collection('cursos')
      .doc(this.cursoId)
      .valueChanges()
      .subscribe((curso: any) => {
        if (curso) {
          this.nombreCurso = curso.nombre;
          this.seccion = curso.seccion;
          this.alumnosSeleccionados = curso.alumnos || []; // Cargar alumnos asignados al curso
        }
      });
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

  modificarCurso() {
    const cursoData: {
      nombre: string;
      seccion: string;
      imagenURL?: string;
      alumnos?: string[]; // Almacenar UIDs de los alumnos seleccionados
    } = {
      nombre: this.nombreCurso,
      seccion: this.seccion,
      alumnos: this.alumnosSeleccionados, // Guardar alumnos seleccionados (UIDs)
    };

    if (this.imagen) {
      const filePath = `cursos/${new Date().getTime()}_${this.imagen.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.imagen);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              cursoData.imagenURL = url;
              this.actualizarCurso(cursoData);
            });
          })
        )
        .subscribe();
    } else {
      this.actualizarCurso(cursoData);
    }
  }

  actualizarCurso(cursoData: any) {
    this.firestore
      .collection('cursos')
      .doc(this.cursoId)
      .update(cursoData)
      .then(() => {
        this.mensajes.mensaje(
          'Curso modificado correctamente',
          'success',
          'Éxito!'
        );
      })
      .catch((error) => {
        console.error('Error al modificar curso:', error);
        this.mensajes.mensaje(
          'No se pudo modificar el curso. Intenta nuevamente.',
          'error',
          'Error!'
        );
      });
  }

  cargarAlumnos() {
    this.firestore
      .collection<Usuario>('usuarios', (ref) => ref.where('tipo', '==', 'alumno'))
      .valueChanges({ idField: 'uid' }) // Incluye el UID como parte del objeto
      .subscribe(
        (alumnos) => {
          this.alumnos = alumnos;
          console.log('Lista de alumnos:', this.alumnos);
        },
        (error) => {
          console.error('Error al obtener alumnos:', error);
        }
      );
  }
}
