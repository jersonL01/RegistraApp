import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import 'firebase/compat/auth';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { MensajesService } from 'src/app/services/mensaje.service';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  emailValue?: string;
  passValue?: string;
  loginForm: FormGroup;
  angularFireAuth: any;

  

  constructor(private router: Router, 
    private alertController: AlertController,
    private loadingController:LoadingController, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private menu: MenuController,
    private firestore: AngularFirestore,
    private mensajes: MensajesService

  
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menu.enable(false);
    
  }

  async login(){
   try{
    const email = this.emailValue;
    const pass = this.passValue;
    
    const usuarioLogeado = await this.authService.login(email as string, pass as string);


    if (usuarioLogeado.user) {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 2000
      });

      await loading.present();

      //localStorage.setItem('usuarioLogin', email as string);40min

      const usuario = await this.firestore.collection('usuarios').doc(usuarioLogeado.user.uid).get().toPromise();
      const userData = usuario?.data() as Usuario;
      console.log(userData);

      setTimeout(async() => {
        await loading.dismiss();

        if (userData.tipo === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userData.tipo === 'alumno') {
          this.router.navigate(['/alumno-dashboard']);
        } else if (userData.tipo === 'profesor') {
          this.router.navigate(['/profesor-dashboard']);
        }  else {
          this.router.navigate(['/invitado-dashboard']);
        }
      }, 2000);

    }
   }catch(error){
    this.mensajes.mensaje('Ingrese las credenciales', 'error', 'Error!');
       
   };
  }

  register() {
    this.router.navigate(['/register']);
  } 

  
  loginGoogle() {
    this.authService.loginWithGoogle()
      .then((res) => {
        Swal.fire({
          title: 'Éxito!',
          text: 'Inicio de sesión exitoso',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          heightAuto: false
        }).then(() => {
          // Redirige a la vista deseada después del inicio de sesión exitoso
          this.router.navigate(['/invitado-dashboard']); 
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo iniciar sesión',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          heightAuto: false
        });
        console.error('Error al iniciar sesión con Google:', error);
      });
  }



  loginWithGitHub() {
    this.authService.loginWithGitHub()
      .then((res) => {
        // Mostrar mensaje de éxito usando SweetAlert
        Swal.fire({
          title: '¡Éxito!',
          text: 'Inicio de sesión con GitHub exitoso',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          heightAuto: false
        }).then(() => {
          // Redirigir al usuario a la vista de home
          this.router.navigate(['/invitado-dashboard']);
        });
      })
      .catch((error) => {
        // Mostrar mensaje de error
        Swal.fire({
          title: 'Error',
          text: 'No se pudo iniciar sesión con GitHub',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          heightAuto: false
        });
        console.error('Error al iniciar sesión con GitHub:', error);
      });
  }
}