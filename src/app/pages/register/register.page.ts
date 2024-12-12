import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';


//SERVICE RANDOMUSER
import { RandomUserService } from '../../services/random-user.service';
import { MensajesService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userValue: string = '';
  emailValue: string = '';
  passValue: string = '';
  registerForm: FormGroup;
  menu: any;

  // Variable para almacenar los usuarios aleatorios
  usuarios: any[] = [];


  constructor(private router: Router,
     private formBuilder: FormBuilder,
     private authService: AuthService,
     private firestore: AngularFirestore,
     private randomUserService: RandomUserService,
     private mensajes: MensajesService
    ){ 
   this.registerForm = this.formBuilder.group({
     user: ['', [Validators.required]],
     email: ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required, Validators.minLength(6)]],
   });
 }

  ngOnInit() {
    this.menu.enable(false);
  }
  async register() {
    if (this.registerForm.valid) {
      const { user, email, password } = this.registerForm.value;

      try {
        // Registrar el usuario con Firebase
        const usuario = await this.authService.register(email, password, user);
        const userCreado = usuario.user;

        if (userCreado) {
          // Guardar información adicional en Firestore
          await this.firestore.collection('usuarios').doc(userCreado.uid).set({
            uid: userCreado.uid,
            email: userCreado.email,
            pass: password,  // Guarda la contraseña si así lo deseas
            tipo: 'usuario', // Tipo de usuario
            nombre: user      // Guarda el nombre ingresado por el usuario
          });

          // Mostrar SweetAlert de "Creando Cuenta"
          let timerInterval: any;
          Swal.fire({
            title: "Creando Cuenta!",
            html: "Cargando...",
            timer: 1500,
            timerProgressBar: true,
            heightAuto: false,
            didOpen: () => {
              Swal.showLoading();
              timerInterval = setInterval(() => {
                Swal.getTimerLeft();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              // Mostrar SweetAlert de éxito
              Swal.fire({
                title: 'Éxito!',
                text: 'Usuario Registrado Correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                heightAuto: false
              });

              // Redirigir al login después del éxito
              this.router.navigate(['/login']);
            }
          });
        }

      } catch (error) {
        // Mostrar alerta de error si el registro falla
        this.mensajes.mensaje('No se pudo registrar el usuario', 'error', 'Error!');
      }
    }
  }
  

  // Método para crear usuarios aleatorios

  crearUsuarios() {
    this.randomUserService.getRandomUsers(10).subscribe(response => {
      const randomUsers = response.results;
      const usuariosParaGuardar = [];
  
      for (let i = 0; i < 5; i++) {
        const user = randomUsers[i];
        usuariosParaGuardar.push({
          nombre: user.name.first,
          apellido: user.name.last,
          email: `${user.name.first}.${user.name.last}@conductor.cl`,
          pass: 'duoc1234',
          tipo: 'profesor',
          imagen: user.picture.medium,
        });
      }
  
      for (let i = 5; i < 10; i++) {
        const user = randomUsers[i];
        usuariosParaGuardar.push({
          nombre: user.name.first,
          apellido: user.name.last,
          email: `${user.name.first}.${user.name.last}@alumno.cl`,
          pass: 'duoc1234',
          tipo: 'alumno',
          imagen: user.picture.medium,
        });
      }
  
      // Guardar en Firestore
      usuariosParaGuardar.forEach(usuario => {
        this.firestore.collection('usuarios').add(usuario).then(() => {
          console.log('Usuario guardado:', usuario);
        }).catch((error) => {
          console.error('Error al guardar usuario:', error);
        });
      });
  
      Swal.fire({
        title: 'Usuarios creados!',
        text: 'Se han creado 10 usuarios correctamente.',
        icon: 'success',
        heightAuto: false,
      });
    }, error => {
      console.error('Error al obtener usuarios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron crear los usuarios.',
        heightAuto: false,
      });
    });
  }
  
}
