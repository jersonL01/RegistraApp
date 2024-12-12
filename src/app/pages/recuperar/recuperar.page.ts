import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { MensajesService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],

})
export class RecuperarPage implements OnInit {


  email: string = '';

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private mensajes: MensajesService
    ) { }

  ngOnInit() {
  }
  

  async RecuperarPass(){
    try{
      await this.authService.recoveryPassword(this.email);
      let timerInterval: any;
      Swal.fire({
        title: "Procesando!",
        html: "Enviando Correo...",
        timer: 1500,
        timerProgressBar: true,
        heightAuto: false,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup()!.querySelector("b");
          timerInterval = setInterval(() => {
            timer!.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          Swal.fire({
            title: 'Exito!',
            text: 'Correo Enviado',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            heightAuto: false
          });
        
        }
      });
    } catch (error) {
      this.mensajes.mensaje('No se envio el correo', 'error', 'Error!');
       
    }
  }
}

