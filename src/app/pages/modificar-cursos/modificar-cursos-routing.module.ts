import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarCursosPage } from './modificar-cursos.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarCursosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarCursosPageRoutingModule {}
