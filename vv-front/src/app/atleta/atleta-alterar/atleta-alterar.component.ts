import { take, switchMap } from 'rxjs/operators';
import { Subject, EMPTY } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from './../../shared/services/toast/toast.service';
import { AtletaService } from './../atleta.service';
import { ValidacoesFormService } from './../../shared/services/validacoes-form.service';
import { VwAtletaPessoa } from './../../shared/model/vwAtletaPessoa';
import { ModalService } from './../../shared/modais/modal.service';

@Component({
  selector: 'app-atleta-alterar',
  templateUrl: './atleta-alterar.component.html',
  styleUrls: ['./atleta-alterar.component.scss'],
})
export class AtletaAlterarComponent implements OnInit {

  // Get nos dados do Atleta para mostrar no Modal
  @Input() atleta: VwAtletaPessoa;
  @Input() formulario: FormGroup;

  // Comunicar com o Atleta Listar para atualizar a Lista quando o
  // Atleta for alterado
  respostaModal: Subject<boolean>;

  // Mascaras
  maskTelefone = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];


  constructor(
    public validaForm: ValidacoesFormService,
    private bsModalRef: BsModalRef,
    private atletaService: AtletaService,
    private modalService: ModalService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    // Inicializando Resposta
    this.respostaModal = new Subject();

  }

  onClose() {
    this.respostaModal.next(true);
    this.bsModalRef.hide();
  }

  onSubmit() {
    // Validando Formulario
    if (this.formulario.valid) {
      this.atletaService.alterarAtleta(this.criarObjeto()).subscribe(
        (success) => {
          // Mensagem
          this.toast.toastSuccess('Sucesso!', 'Atleta alterado com sucesso!');

          // Resposta
          this.onClose();

        }, (error) => {
          // Tratamento de Erros
          switch (error['status']) {
            // Erro Banco
            case 400: {
              this.toast.toastErroBanco();
              break;
            }
            // Usuário não encontrado.
            case 404: {
              this.toast.toastError('Não encontrado!',
                'Atleta não encontrado no banco de dados. Atualize a página e tente novamente.');
              break;
            }
          }
        }, () => {
          // Fechando o modal de Alteracao
          this.onClose();
        }
      );
    }
  }

  onDelete() {
    // Confirmando Exclusao.
    const resposta$ = this.modalService.showConfirmModal('Confirmar exclusão', 'Deseja mesmo excluir o atleta?', 'Excluir');

    resposta$.asObservable()
      .pipe(
        take(1),
        switchMap((resposta) => resposta ? this.atletaService.removeById(this.atleta.idAtleta) : EMPTY)
      ).subscribe(
        (success) => {
          // Mensagem
          this.toast.toastInfo('Sucesso.', 'Atleta excluído com sucesso da base de dados.');

          // Fechando Modal
          this.onClose();
        }, (error) => {
          switch (error['status']) {
            case 400: {
              this.toast.toastErroBanco();
              break;
            }
            case 404: {
              this.toast.toastError('Erro ao excluir o atleta!', 'O atleta não foi encontrado! Atualize a página e tente novamente.');
              break;
            }
            default: {
              this.toast.toastErroBanco();
              break;
            }
          }
        });
  }

  // Metodos Privados
  private criarObjeto(): VwAtletaPessoa {
    const atleta: VwAtletaPessoa = new VwAtletaPessoa();

    // Pessoa Competitiva
    atleta.confederacao = this.formulario.get('confederacao').value;
    atleta.federacao = this.formulario.get('federacao').value;
    atleta.idGrau = this.formulario.get('idGrau').value;
    atleta.idPessoa = this.formulario.get('idPessoa').value;
    atleta.idPessoaCompetitiva = this.formulario.get('idPessoaCompetitiva').value;
    atleta.dataInicio = this.formulario.get('dataInicio').value;

    // Atleta
    atleta.idAtleta = this.formulario.get('idAtleta').value;
    atleta.cpfResponsavel = this.formulario.get('cpfResponsavel').value;
    atleta.nomeResponsavel = this.formulario.get('nomeResponsavel').value;

    // Tratamento para o telefone
    const telefone: string = this.formulario.get('telefoneResponsavel').value.replace(/[^0-9]+/g, '');
    atleta.telefoneResponsavel = telefone;

    return atleta;
  }


}
