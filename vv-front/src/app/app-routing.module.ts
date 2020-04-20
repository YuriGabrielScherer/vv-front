import { CadastroComponent } from './pessoa/cadastro/cadastro.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { IndexComponent } from './shared/index/index.component';
import { LoginComponent } from './login/login/login.component';

// Guards
import { AuthGuard } from './guards/auth-guard';
import { PessoaResolver } from './guards/pessoa-resolver';

const routes: Routes = [
  { // Caso vazio, vai para o index
    path: '', pathMatch: 'full', redirectTo: 'index'
  },
  {
    path: 'index', component: IndexComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'administrativo',
    loadChildren: () => import('./administrativo/administrativo.module').then(m => m.AdministrativoModule),
    //canActivate: [AuthGuard],
    //resolve: { pessoa: PessoaResolver }
  },
  {
    path: 'novaPessoa', component: CadastroComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
