import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-qr',
  templateUrl: 'qr.page.html',
  styleUrls: ['qr.page.scss'],
})
export class QrPage {
  
  qrValue = ''; // QR


  constructor(private authService:AuthService,
    private plataforma: Platform,
  ) {}

    ngOnInit(){
      //OBTENER EL UID DEL USUARIO LOGEADO Y LO ASIGNAMOS AL QR

      if(this.plataforma.is('capacitor')){
        BarcodeScanner.isSupported().then()
        BarcodeScanner.checkPermissions().then()
        BarcodeScanner.removeAllListeners().then()
      }
      this.authService.isLogged().subscribe(user=>{
        if (user) {
          this.qrValue = user.uid;  // UID del profesor para generar el QR
        }
      });

    }

}