import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanQrPageRoutingModule } from './scan-qr-routing.module';
//ESCANEAR QR
import { ScanQrPage } from './scan-qr.page';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanQrPageRoutingModule,
    QrCodeModule
  ],
  declarations: [ScanQrPage, BarcodeScanningModalComponent]
})
export class ScanQrPageModule {}
