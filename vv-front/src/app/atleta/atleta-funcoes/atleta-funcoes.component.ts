import { Component, OnInit } from '@angular/core';

import { AtletaService } from './../atleta.service';
import { ModalService } from './../../shared/modais/modal.service';

@Component({
  selector: 'app-atleta-funcoes',
  templateUrl: './atleta-funcoes.component.html',
  styleUrls: ['./atleta-funcoes.component.scss']
})
export class AtletaFuncoesComponent implements OnInit {

  constructor(
    private atletaService: AtletaService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  onEnviaEmail() {
    this.modalService.showEmailModal();
  }

  cadastrarFck() {
    this.atletaService.cadastrarFck().subscribe(
      (success) => {
        console.log(success);
      },
      (erro) => {
        console.log(erro);
      }
    );
  }



}
