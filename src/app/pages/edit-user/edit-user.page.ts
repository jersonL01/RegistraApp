import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarios';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  uid: string = '';
  editUserForm: FormGroup;
  cursos: any[] = []; // Array para almacenar la lista de cursos

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private router: Router,
    private storage: AngularFireStorage
  ) { 
    // Inicializar el formulario con los campos requeridos
    this.editUserForm = this.formBuilder.group({ 
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required],
      tipo: ['', Validators.required],
      imagen: [''],  // Campo para la URL de la imagen
      curso: [[], Validators.required] // Nuevo campo para el ID del curso
    });
  }

  ngOnInit() {
    // Obtener el UID del usuario desde la URL
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') as string;
    this.cargarData();
    this.obtenerCursos(); // Cargar la lista de cursos
  }

  // Método para obtener los cursos desde Firebase
  obtenerCursos() {
    this.firestore.collection('cursos').valueChanges({ idField: 'id' }).subscribe((data) => {
      this.cursos = data; // Guardar los cursos en el array
    });
  }

  // Cargar los datos del usuario desde Firestore y asignarlos al formulario
  cargarData() {
    this.firestore.collection('usuarios').doc(this.uid).get().toPromise()
      .then((user) => {
        if (user?.exists) {
          this.editUserForm.patchValue(user.data() as Usuario);
        }
      }).catch(() => this.showError('Hubo un Error', 'Vuelve más Tarde!'));
  }

  // Manejar la selección de archivo y verificar su tipo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.isValidImageType(file.type)) {
      this.uploadImage(file);  // Subir la imagen si el tipo es válido
    } else {
      this.showError("Tipo de Archivo No Válido", "Por favor selecciona una imagen en formato JPEG, PNG o GIF.");
    }
  }

  private isValidImageType(type: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(type);
  }

  private uploadImage(file: File) {
    const filePath = `usuarios/${this.uid}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.editUserForm.patchValue({ imagen: url });
          this.UpdateUser();
        }, error => {
          this.showError("Error al Cargar Imagen", "No se pudo obtener la URL de la imagen.");
        });
      })
    ).subscribe(null, error => {
      this.showError("Error de Subida", "No se pudo completar la subida de la imagen.");
    });
  }

  // Actualizar el usuario en Firestore con los nuevos datos, incluyendo la URL de la imagen
  UpdateUser() {
    if (this.editUserForm.valid) {
      const updatedUser: Usuario = {
        ...this.editUserForm.value,
        // Asegurarte de que 'cursos' esté correctamente asignado si es necesario
        cursos: this.editUserForm.value.curso || []  // Si el campo 'curso' no está vacío, asignarlo
      };
  
      this.firestore.collection('usuarios').doc(this.uid).update(updatedUser)
        .then(() => {
          Swal.fire({
            title: "Actualizado!",
            text: "El usuario ha sido actualizado correctamente.",
            icon: "success",
            heightAuto: false,
          });
          this.router.navigate(['/ver-usuarios']);
        })
        .catch(() => this.showError("Error en la actualización", "Hubo un problema al actualizar los datos."));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Formulario Invalido",
        text: "Por favor verifica que todos los campos sean válidos.",
        heightAuto: false,
      });
    }
  }
  

  private showError(title: string, text: string) {
    Swal.fire({ icon: "error", title, text, heightAuto: false });
  }
}

