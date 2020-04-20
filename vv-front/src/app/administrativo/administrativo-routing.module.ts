import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrativoComponent } from './administrativo/administrativo.component';
import { PainelAdministrativoComponent } from './painel-administrativo/painel-administrativo.component';

import { AuthGuard } from './../guards/auth-guard';
import { PessoaResolver } from './../guards/pessoa-resolver';

const routes: Routes = [
  {
    path: '', component: AdministrativoComponent, children: [
      {
        path: '',
        component: PainelAdministrativoComponent,
        // canActivate: [AuthGuard],
        // resolve: { pessoa: PessoaResolver }
      },
      {
        path: 'atleta',
        loadChildren: () => import('../atleta/atleta.module').then(m => m.AtletaModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'pessoa',
        loadChildren: () => import('../pessoa/pessoa.module').then(m => m.PessoaModule)
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
