import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarCursoPageRoutingModule } from './agregar-curso-routing.module';

import { AgregarCursoPage } from './agregar-curso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarCursoPageRoutingModule
  ],
  declarations: [AgregarCursoPage]
})
export class AgregarCursoPageModule {}
