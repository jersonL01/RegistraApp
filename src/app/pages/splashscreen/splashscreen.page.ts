import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/firebase/auth.service';

//HUELLA DIGITAL
import {NativeBiometric} from 'capacitor-native-biometric';



@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {
  

  constructor(private router: Router,
    private authServices: AuthService,
    private firestore : AngularFirestore,
  ) { }
  


  ngOnInit(){setTimeout(() => {
      this.validarLogin();
      //this.router.navigate(['/login']);
    }, 2000);
  }

  async validarLogin(){
    this.authServices.isLogged().subscribe(async(user) => {
      if(user){
        try {
          
          //Verificar la huella digital
          await this.checkHuellaDigital();
            
          const usuario = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
          const userData = usuario?.data() as Usuario;

          if (userData.tipo === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (userData.tipo === 'alumno') {
            this.router.navigate(['/alumno-dashboard']);
          } else if (userData.tipo === 'profesor') {
            this.router.navigate(['profesor-dashboard']);
          }  else {
            this.router.navigate(['/invitado-dashboard']);
          }
        }catch (error) {  
          this.router.navigate(['/login']);
        }
         
      }else{
        this.router.navigate(['/login']);
      }
       
    });
  }


  async checkHuellaDigital(){
    try{ 
      await NativeBiometric.verifyIdentity({
        reason: 'Por favor, verifica tu identidad',
        title: 'Autenticación Biometrica',
        subtitle: 'Ingresa tu huella digital para continuar',
        description: 'Coloca tu huella digital en el sensor',
      });
    }catch(error){
      throw error; //Forzar el error para capturarlo
    }
  }

  

}
