import { AtletaFuncoesComponent } from './atleta-funcoes/atleta-funcoes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve } from '@angular/router';

import { AtletaListarComponent } from './atleta-listar/atleta-listar.component';
import { AtletaComponent } from './atleta/atleta.component';

const routes: Routes = [
  {
    path: '',
    component: AtletaComponent
  },
  {
    path: 'listar',
    component: AtletaListarComponent
  },
  {
    path: 'funcoes',
    component: AtletaFuncoesComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtletaRoutingModule { }
