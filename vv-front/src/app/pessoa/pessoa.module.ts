import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaRoutingModule } from './pessoa-routing.module';

import { CadastroComponent } from './cadastro/cadastro.component';
import { ListarPessoasComponent } from './listar-pessoas/listar-pessoas.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';
import { PessoaService } from './pessoa.service';

import { ListarPessoaResolver } from './guards/listar-pessoas.resolver';
import { PessoaAlteracaoResolver } from './guards/alterar-pessoa.resolver';
import { CadastroFormComponent } from './cadastro/cadastro-form/cadastro-form/cadastro-form.component';

@NgModule({
  declarations: [
    CadastroComponent,
    ListarPessoasComponent,
    CadastroFormComponent
  ],
  imports: [
    CommonModule,
    PessoaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    PessoaService,
    ListarPessoaResolver,
    PessoaAlteracaoResolver
  ]
})
export class PessoaModule { }
