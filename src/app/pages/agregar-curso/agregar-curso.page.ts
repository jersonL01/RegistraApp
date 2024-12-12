import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { MensajesService } from 'src/app/services/mensaje.service';

interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  tipo: string; // Asegúrate de que exista esta propiedad para identificar el tipo de usuario
}

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.page.html',
  styleUrls: ['./agregar-curso.page.scss'],
})
export class AgregarCursoPage implements OnInit {
  nombreCurso: string = '';
  seccion: string = '';
  imagen: File | null = null;
  alumnos: Usuario[] = []; // Lista completa de alumnos obtenidos desde Firebase
  selectedAlumnos: string[] = []; // Almacena los UID de los alumnos seleccionados

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private mensajes: MensajesService
  ) {}

  ngOnInit() {
    this.cargarAlumnos();
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

  // Método para cargar alumnos del tipo "alumno"
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

  // Método para agregar un curso y asociarlo con alumnos
  agregarCurso() {
    if (this.nombreCurso && this.seccion) {
      const cursoData = {
        nombre: this.nombreCurso,
        seccion: this.seccion,
        imagenURL: '',
        alumnos: this.selectedAlumnos, // Guarda los UID de los alumnos seleccionados
      };

      if (this.imagen) {
        const filePath = `cursos/${new Date().getTime()}_${this.imagen.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.imagen);

        uploadTask.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(
                (url) => {
                  cursoData.imagenURL = url;
                  this.guardarCurso(cursoData);
                },
                (error) => {
                  console.error('Error al obtener URL de la imagen:', error);
                  this.mensajes.mensaje('No se pudo obtener la URL de la imagen', 'error', 'Error!');
                }
              );
            })
          )
          .subscribe();
      } else {
        this.guardarCurso(cursoData);
      }
    } else {
      this.mensajes.mensaje('Por favor completa todos los campos', 'warning', 'Advertencia!');
    }
  }

  // Método para guardar el curso en Firestore
  private guardarCurso(cursoData: any) {
    this.firestore
      .collection('cursos')
      .add(cursoData)
      .then(() => {
        this.mensajes.mensaje('Curso agregado correctamente', 'success', 'Éxito!');
        this.limpiarFormulario();
      })
      .catch((error) => {
        console.error('Error al agregar curso:', error);
        this.mensajes.mensaje('No se pudo agregar el curso', 'error', 'Error!');
      });
  }

  // Método para limpiar el formulario
  private limpiarFormulario() {
    this.nombreCurso = '';
    this.seccion = '';
    this.imagen = null;
    this.selectedAlumnos = [];
  }
}
