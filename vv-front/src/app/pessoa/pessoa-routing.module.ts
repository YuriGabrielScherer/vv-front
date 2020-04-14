import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarPessoasComponent } from './listar-pessoas/listar-pessoas.component';
import { CadastroComponent } from './cadastro/cadastro.component';

import { AuthGuard } from '../guards/auth-guard';
import { ListarPessoaResolver } from './guards/listar-pessoas.resolver';
import { PessoaAlteracaoResolver } from './guards/alterar-pessoa.resolver';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cadastro' },
  {
    path: 'cadastro', component: CadastroComponent
  },
  {
    path: 'cadastro/:id',
    component: CadastroComponent,
    canActivate: [AuthGuard],
    resolve: { alteracao: PessoaAlteracaoResolver }
  },
  {
    path: 'listar',
    component: ListarPessoasComponent,
    canActivate: [AuthGuard],
    resolve: { pessoa: ListarPessoaResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoaRoutingModule { }
