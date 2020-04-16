import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

import { AtletaService } from './../atleta.service';
import { ToastService } from './../../shared/services/toast/toast.service';
import { AtletaAlterarService } from './../atleta-alterar/atleta-alterar.service';
import { ValidacoesFormService } from './../../shared/services/validacoes-form.service';

import { VwAtletaPessoa } from './../../shared/model/vwAtletaPessoa';

@Component({
  selector: 'app-atleta-listar',
  templateUrl: './atleta-listar.component.html',
  styleUrls: ['./atleta-listar.component.scss'],
  preserveWhitespaces: true
})
export class AtletaListarComponent implements OnInit {


  // Listagem de Atletas cadastrados.
  atletas: VwAtletaPessoa[];

  // Objeto Campeonato
  campeonatos = [
    'Olesc',
    'Joguinhos',
    'Jasc',
    'Brasileiro'
  ];

  constructor(
    private atletaService: AtletaService,
    private modal: AtletaAlterarService,
    private toast: ToastService,
    protected validacaoForm: ValidacoesFormService) {
  }

  ngOnInit() {}


  retornarAtletas() {
    return this.atletas;
  }

  openModal(idAtleta: number) {
    // Verificando se o usuário foi alterado após a abertura do Modal
    const resposta$ = this.modal.showModal(idAtleta);

    // Tratando a resposta
    resposta$.asObservable().pipe(
      take(1)
    ).subscribe(
      (alterado) => {
        this.carregarListaAtletas();
      });
  }

  //  Metodos privados
  private carregarListaAtletas() {
    this.atletaService.getAtletasPessoas().subscribe(
      (success) => {
        this.atletas = success;
      },
      (error) => {
        switch (error['status']) {
          default: {
            this.toast.toastErroBanco();
            break;
          }
        }
      });
  }



}
