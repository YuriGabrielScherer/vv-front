import { MessagesHandlerService } from './../../../../shared/services/messages/messages-handler.service';
import { take, switchMap, finalize } from 'rxjs/operators';
import { Subscription, EMPTY } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from './../../../../shared/modais/modal.service';
import { ToastService } from './../../../../shared/services/toast/toast.service';
import { PessoaService } from './../../../pessoa.service';
import { Pessoa } from './../../../../shared/model/pessoa';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ValidacoesFormService } from './../../../../shared/services/validacoes-form.service';

@Component({
  selector: 'app-cadastro-form',
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.scss']
})
export class CadastroFormComponent implements OnInit {

  // Variavel validar Tela Alteracao
  telaAlteracao = false;

  // Variavel do Formulario para controle
  formulario: FormGroup;

  // Mascaras para os campos Input
  maskTelefone = this.validacaoForm.maskTelefone;
  maskCpf = this.validacaoForm.maskCpf;
  maskData = this.validacaoForm.maskData;

  // Variavel controle Spinner
  spinner = false;

  // Pessoa a ser cadastrada
  pessoa: Pessoa = new Pessoa();

  constructor(
    private formBuilder: FormBuilder,
    public validacaoForm: ValidacoesFormService,
    private pessoaService: PessoaService,
    private toastService: ToastService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private messageHandler: MessagesHandlerService
  ) { }

  ngOnInit() {
    this.criarFormulario();
    this.validaTelaAlteracao();
  }

  onSubmit() {
    if (this.preparaSubmit(this.formulario)) {
      // Chamando metodo responsavel por salvar da Pessoa Service.
      this.pessoaService.save(this.tratarPessoa(this.formulario))
        .pipe(
          finalize(() => {
            // Escondendo Spinner
            this.spinner = false;
          }))
        .subscribe((retorno) => {
          // Toast Com mensagem de sucesso
          this.toastService.toastSuccess('Registrado com sucesso!', 'Usuário cadastrado com sucesso!');
          // Limpando formulario
          this.formulario.reset();

          // Navegando para a tela de Login
          if ((sessionStorage.getItem('usuario_logado') === null) &&
            (localStorage.getItem('usuario_logado') === null)) {
            this.router.navigate(['/login']);
          } else {
            // Caso usuario logado, voltando para tela de listar pessoas
            this.router.navigate(['/pessoa/listar']);
          }
        },
          // Caso dê erro no servidor.
          (error) => {
            this.messageHandler.errorMessageHandler(error);
          });
    } else {
      // Resgatando os Componentes do Formulario
      this.validaFormulario(this.formulario);
    }
  }

  onSubmitAlteracao() {
    if (this.preparaSubmit(this.formulario)) {
      this.pessoaService.update(this.tratarPessoa(this.formulario))
        .pipe(
          take(1),
          finalize(() => {
            this.spinner = false;
          })
        )
        .subscribe((respose) => {
          this.toastService.toastSuccess('Alterada com sucesso.', 'Pessoa alterada com sucesso!');
          this.formulario.reset();
          this.router.navigate(['pessoa/listar']);
        }, (error) => {
          this.messageHandler.errorMessageHandler(error);
        });
    }
  }

  onDelete() {
    // Resposta do Modal que será aberto
    const resposta$ = this.modalService.showConfirmModal('Confirmar exclusão',
      'Deseja realmente excluir o usuário selecionado?', 'Excluir');

    // Transformando o Subject em Observable para usar o Subscribe
    resposta$.asObservable()
      .pipe(
        take(1),
        switchMap(resposta => resposta ? this.pessoaService.delete(this.pessoa.cpf) : EMPTY),
        finalize(() => {
          this.spinner = false;
        })
      ).subscribe( // Esse subscribe refere-se ao PessoaService.remove() que é retornado pelo resposta$ atraves do switchMap()
        (retorno) => {
          this.toastService.toastInfo('Sucesso!', 'O registro foi excluído com sucesso.');
          this.router.navigate(['pessoa/listar']);
        },
        (error) => {
          this.messageHandler.errorMessageHandler(error, 'Exclusão de Pessoas.');
        });
  }

  private preparaSubmit(form: FormGroup): boolean {
    if (form.valid && form.dirty) {
      // Exibindo Spinner de carregamento
      this.spinner = true;
      return true;
    }
    return false;
  }

  private roteamento() {

  }

  private tratarPessoa(formGroup: FormGroup): Pessoa {
    // Atribuindo valores
    this.pessoa.nome = formGroup.get('nome').value;
    this.pessoa.email = formGroup.get('email').value;
    this.pessoa.senha = formGroup.get('senha').value;
    this.pessoa.sexo = formGroup.get('sexo').value;
    this.pessoa.login = formGroup.get('login').value;
    this.pessoa.dataNascimento = this.validacaoForm.transformarDataToBanco(formGroup.get('dataNascimento').value);

    // Tratando o CPF - Retirando a mascara
    const cpf: string = formGroup.get('cpf').value.replace(/[^0-9]+/g, '');
    this.pessoa.cpf = cpf;

    // Tratando Telefone - Retirando mascara
    const telefone: string = formGroup.get('telefone').value.replace(/[^0-9]+/g, '');
    this.pessoa.telefone = telefone;

    // Retornando objeto tratado
    return this.pessoa;
  }

  // Realizando verificacao Campo por Campo
  private validaFormulario(grupo: FormGroup) {
    // This.Formulario.Controls retorna o objeto que nao pode ser lido aqui.
    // Assim, atribui-se Chaves para o Objeto poder ser lido.

    Object.keys(this.formulario.controls).forEach(controle => {
      // Marcando como Touched para aplicar as validacoes
      this.formulario.get(controle).markAsTouched();
    });
  }

  resetForm() {
    // Validando Modo Alteracao
    if (this.telaAlteracao) {
      this.router.navigate(['/pessoa/listar']);
    } else {
      this.formulario.reset();
      Object.keys(this.formulario.controls).forEach(controle => {
        // Marcando como Touched para aplicar as validacoes
        this.formulario.get(controle).markAsUntouched();
      });
    }
  }

  private criarFormulario() {
    // Atribuindo o formulario para a variavel
    this.formulario = this.formBuilder.group({
      // Campos que irão compor o formulario
      nome: [null,  // Valor inicial nulo
        Validators.required], // Validacoes dos campos

      cpf: [null, [Validators.required, this.validacaoForm.isValidCpf()]],
      login: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, [Validators.required, this.validacaoForm.isValidPhone()]],
      dataNascimento: [null, [Validators.required, this.validacaoForm.isValidDate()]],
      senha: [null, [Validators.required, Validators.minLength(5)]],
      sexo: ['M', Validators.required]
    });
  }

  private validaTelaAlteracao() {
    // Tentando pegar atributos do Roteamento - Tela Alteracao
    this.route.data
      .pipe(
        take(1))
      .subscribe((dados: any) => {
        // Verificando se tem Pessoa para alterar
        if (dados.alteracao) {

          this.telaAlteracao = true;

          this.pessoa = dados.alteracao;

          let telefone = this.pessoa.telefone;

          // Colocando mascara para passar na validacao
          telefone = telefone.replace(/^(\d{2})(\d)/g, '($1)$2'); // Colocando parenteses
          telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');  // Colocando hifen

          // Retornando dados alterados
          this.pessoa.telefone = telefone;

          // Atribuindo valores para o formulario
          this.formulario.patchValue({
            nome: this.pessoa.nome,
            cpf: this.pessoa.cpf,
            email: this.pessoa.email,
            telefone: this.pessoa.telefone,
            dataNascimento: this.validacaoForm.transformarDataToSite(this.pessoa.dataNascimento),
            sexo: this.pessoa.sexo,
            senha: 12345,
            login: 1
          });

          // Setando Formulario como valido - Aplicar CSS Valido
          this.formulario.markAllAsTouched();
        }
      });
  }



}
