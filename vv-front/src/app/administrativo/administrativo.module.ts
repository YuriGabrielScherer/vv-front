import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativoRoutingModule } from './administrativo-routing.module';
import { AdministrativoComponent } from './administrativo/administrativo.component';

import { SharedModule } from './../shared/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PainelAdministrativoComponent } from './painel-administrativo/painel-administrativo.component';

@NgModule({
  declarations: [AdministrativoComponent, PainelAdministrativoComponent],
  imports: [
    CommonModule,
    AdministrativoRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ]
})
export class AdministrativoModule { }
