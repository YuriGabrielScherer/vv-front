import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { AtletaRoutingModule } from './atleta-routing.module';

import { AtletaService } from './atleta.service';
import { AtletaAlterarService } from './atleta-alterar/atleta-alterar.service';

import { AtletaComponent } from './atleta/atleta.component';
import { AtletaListarComponent } from './atleta-listar/atleta-listar.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AtletaFuncoesComponent } from './atleta-funcoes/atleta-funcoes.component';

@NgModule({
  declarations: [
    AtletaComponent,
    AtletaListarComponent,
    AtletaFuncoesComponent,
  ],
  imports: [
    CommonModule,
    AtletaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot()
  ],
  exports: [
    AtletaComponent,
  ],
  providers: [
    AtletaService,
    AtletaAlterarService
  ]

})
export class AtletaModule { }
