import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerAlumnosPage } from './ver-alumnos.page';

const routes: Routes = [
  {
    path: '',
    component: VerAlumnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerAlumnosPageRoutingModule {}
