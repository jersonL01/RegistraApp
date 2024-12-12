import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiCursoPageRoutingModule } from './mi-curso-routing.module';

import { MiCursoPage } from './mi-curso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiCursoPageRoutingModule
  ],
  declarations: [MiCursoPage]
})
export class MiCursoPageModule {}
