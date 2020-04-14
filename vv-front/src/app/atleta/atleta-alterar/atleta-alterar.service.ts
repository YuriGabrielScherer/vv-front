import { Subscription, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AtletaService } from './../atleta.service';
import { ValidacoesFormService } from './../../shared/services/validacoes-form.service';
import { ToastService } from './../../shared/services/toast/toast.service';

import { AtletaAlterarComponent } from './atleta-alterar.component';
import { VwAtletaPessoa } from './../../shared/model/vwAtletaPessoa';


@Injectable({
  providedIn: 'root'
})
export class AtletaAlterarService {

  vwAtletaPessoa: VwAtletaPessoa;

  constructor(
    private modalService: BsModalService,
    private atletaService: AtletaService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    protected validacaoForm: ValidacoesFormService,
  ) { }


  showModal(idAtleta: number) {

    // Abrindo o Modal
    const bsModalRef: BsModalRef = this.modalService.show(AtletaAlterarComponent);

    // Tentando carregar o atleta para abrir o modal.
    this.atletaService.getAtletaPessoaById(idAtleta).subscribe(
      // Caso Sucesso
      (success) => {
        // Get dos Dados
        this.vwAtletaPessoa = success;

        // Passando as informacoes
        bsModalRef.content.atleta = this.vwAtletaPessoa;
        bsModalRef.content.formulario = this.criarFormulario(this.vwAtletaPessoa);
      },
      // Tratamento de erros
      (error) => {
        switch (error['status']) {
          case 404: {
            this.toast.toastWarning('Não encontrado.',
              'O atleta não foi encontrado na base de dados. Atualize a página e tente novamente.');
            break;
          }
          case 400: {
            this.toast.toastErroBanco();
            break;
          }
          default: {
            this.toast.toastErroBanco();
            break;
          }
        }
      }
    );

    // Retornando para atualizar a lista de Atletas
    return (bsModalRef.content as AtletaAlterarComponent).respostaModal;
  }

  private criarFormulario(vwAtletaPessoa: VwAtletaPessoa): FormGroup {

    // Alterando telefone - Colocando mascara para passar na validacao do Form
    let telefone = vwAtletaPessoa.telefoneResponsavel.replace(/^(\d{2})(\d)/g, '($1)$2'); // Colocando parenteses
    telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');  // Colocando hifen

    // Variavel do Formulario
    let formulario: FormGroup;

    formulario = this.formBuilder.group({
      // Campos referentes ao Atleta
      idAtleta: [vwAtletaPessoa.idAtleta],
      federacao: [vwAtletaPessoa.federacao],
      confederacao: [vwAtletaPessoa.confederacao],
      dataInicio: [vwAtletaPessoa.dataInicio, Validators.required, ],
      idGrau: [vwAtletaPessoa.idGrau, Validators.required],
      idPessoaCompetitiva: [vwAtletaPessoa.idPessoaCompetitiva],
      idPessoa: [vwAtletaPessoa.idPessoa],
      // Campos referentes ao Responsavel
      nomeResponsavel: [vwAtletaPessoa.nomeResponsavel, Validators.required],
      telefoneResponsavel: [telefone, [Validators.required, this.validacaoForm.isValidPhone()]],
      cpfResponsavel: [vwAtletaPessoa.cpfResponsavel, [Validators.required, this.validacaoForm.isValidCpf()]]
    });

    Object.keys(formulario.controls).forEach(controle => {
      // Marcando como Touched para aplicar as validacoes
      formulario.get(controle).markAsTouched();
    });

    return formulario;
  }


}
