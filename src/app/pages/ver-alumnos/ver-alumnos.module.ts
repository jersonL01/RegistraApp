import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerAlumnosPageRoutingModule } from './ver-alumnos-routing.module';

import { VerAlumnosPage } from './ver-alumnos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerAlumnosPageRoutingModule
  ],
  declarations: [VerAlumnosPage]
})
export class VerAlumnosPageModule {}
