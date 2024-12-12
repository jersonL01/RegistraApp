import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarCursosPageRoutingModule } from './modificar-cursos-routing.module';

import { ModificarCursosPage } from './modificar-cursos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarCursosPageRoutingModule
  ],
  declarations: [ModificarCursosPage]
})
export class ModificarCursosPageModule {}
