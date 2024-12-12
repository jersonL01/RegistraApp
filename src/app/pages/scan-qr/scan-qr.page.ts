import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {

  resultadoQR = ''; // Guarda el UID del profesor escaneado

  constructor(
    private modalController: ModalController,
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private mensajes: MensajesService,
    private plataform: Platform
  ) { }


  ngOnInit() {
    if(this.plataform.is('capacitor')){
      this.openCamra();
    }
  }


  //CREAMOS UN MODAL EL CUAL TIENE LA CAMARA PARA ESCANEAR EL QR 23
  async openCamra(){
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanner-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back
      }
    });

    await modal.present();

    //DESPUES DE ESCANEAR EL QR
   
    const { data } = await modal.onWillDismiss();
    if (data?.barcode?.displayValue) {
      this.resultadoQR = data.barcode.displayValue;  // UID del profesor escaneado
      this.registrarAsistencia(this.resultadoQR);
    }

  }


  // Registra la asistencia del alumno en Firebase
  registrarAsistencia(profesorUid: string) {
    // Obtener el UID del alumno actualmente autenticado
    this.authService.isLogged().subscribe(user => {
      if (user) {
        const alumnoUid = user.uid;

        // Actualizar la asistencia en la colección 'usuarios'
        this.firestore.collection('usuarios').doc(alumnoUid).update({
          asistencia: `presente - ${profesorUid}`
        })
        .then(() => {
          Swal.fire({
            title: 'Asistencia registrada!',
            text: 'Has sido marcado como presente.',
            icon: 'success',
            heightAuto: false,
          });
        })
        .catch(error => {
         
         this.mensajes.mensaje('No se registro la asistencia', 'error', 'Error!');
       
        });
      } else {
        console.log("No se ha autenticado ningún usuario");
      }
    });
  }
}
