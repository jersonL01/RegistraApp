import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiCursoPage } from './mi-curso.page';

const routes: Routes = [
  {
    path: '',
    component: MiCursoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiCursoPageRoutingModule {}
