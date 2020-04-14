import { Subscription, EMPTY } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ValidacoesFormService } from './../../shared/services/validacoes-form.service';
import { Pessoa } from '../../shared/model/pessoa';
import { PessoaService } from '../pessoa.service';
import { ToastService } from './../../shared/services/toast/toast.service';
import { ModalService } from './../../shared/modais/modal.service';

import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit, OnDestroy {

  // Variavel controle Spinner
  spinner = false;

  // Variavel do Formulario para controle
  formulario: FormGroup;

  // Mascaras para os campos Input
  public maskTelefone = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  // Variavel validar Tela Alteracao
  telaAlteracao = false;

  // Variavel inscricao para tela de Alteracao
  private inscricao: Subscription;

  // Pessoa a ser cadastrada
  objetoPessoa: Pessoa = new Pessoa();


  constructor(
    private formBuilder: FormBuilder,
    private pessoaService: PessoaService,
    protected validacaoForm: ValidacoesFormService,
    private toastService: ToastService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {

    // Atribuindo o formulario para a variavel
    this.formulario = this.formBuilder.group({
      // Campos previstos
      nome: [null,  // Valor inicial nulo
        Validators.required], // Validacoes dos campos
      cpf: [null, [Validators.required, this.validacaoForm.isValidCpf()]],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, [Validators.required, this.validacaoForm.isValidPhone()]],
      dataNascimento: [null, [Validators.required]],
      senha: [null, [Validators.required, Validators.minLength(5)]],
      sexo: ['m', Validators.required]
    });

    // Tentando pegar atributos do Roteamento - Tela Alteracao
    this.inscricao = this.route.data.subscribe((dados: Pessoa) => {

      // Verificando se tem Pessoa para alterar
      if (dados['alteracao']) {

        // Validando toda a tela de Alteracao
        this.telaAlteracao = true;

        // Pegando os dados
        this.objetoPessoa = dados['alteracao'];

        // Tratando o telefone
        let telefone = this.objetoPessoa.telefonePessoa;

        // Colocando mascara para passar na validacao
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1)$2'); // Colocando parenteses
        telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');  // Colocando hifen

        // Retornando dados alterados
        this.objetoPessoa.telefonePessoa = telefone;

        // Atribuindo valores para o formulario
        this.formulario.patchValue({
          nome: this.objetoPessoa.nomePessoa,
          cpf: this.objetoPessoa.cpfPessoa,
          email: this.objetoPessoa.emailPessoa,
          telefone: this.objetoPessoa.telefonePessoa,
          dataNascimento: this.objetoPessoa.dataNascimentoPessoa,
          senha: this.objetoPessoa.senhaPessoa,
          sexo: this.objetoPessoa.sexoPessoa
        });

        // Setando Formulario como valido - Aplicar CSS Valido
        this.formulario.markAllAsTouched();
      }
    });

  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  // OnSubmit do Formulario
  private onSubmit() {

    // Verificando se o formulario é valido
    if (this.formulario.valid && this.formulario.dirty) {

      // Spinner
      this.spinner = true;

      // Service de POST
      this.pessoaService.save(this.criarObjetoPessoa(this.formulario))
        .subscribe((retorno) => {

          // Mensagem Sucesso
          this.toastService.toastSuccess('Registrado com sucesso!', 'Usuário cadastrado com sucesso!');

          // Resetando o Form
          this.formulario.reset();

          // Navegando para a tela de Login
          if ((sessionStorage.getItem('usuario_logado') === null) &&
            (localStorage.getItem('usuario_logado') === null)) {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/pessoa/listar']);
          }
        },
          (error) => {

            // Mensagens de Erro
            if (error['status'] === 400) {
              this.toastService.toastWarning('Erro ao registrar.', 'Erro ao cadastrar o usuário. Verifique os dados e tente novamente.');
            } else {
              this.toastService.toastErroBanco();
            }
          }, () => { // Quando a requisicao acabar
            this.spinner = false;
          });
    } else {
      // Resgatando os Componentes do Formulario
      this.validaFormulario(this.formulario);
    }
  }

  // Excluindo Pessoa
  onDelete() {
    // Confirmando exclusao com o usuario
    const resposta$ = this.modalService.showConfirmModal('Confirmar exclusão',
      'Deseja realmente excluir o usuário selecionado?', 'Excluir');

    // Transformando o Subject em Observable para usar o Subscribe
    resposta$.asObservable()
      .pipe(
        take(1),
        switchMap(resposta => resposta ? this.pessoaService.remove(this.objetoPessoa.idPessoa) : EMPTY)
      ).subscribe( // Esse subscribe refere-se ao PessoaService.remove() que é retornado pelo resposta$ atraves do switchMap()
        () => {
          // Mensagem
          this.toastService.toastInfo('Sucesso!', 'O registro foi excluído com sucesso.');
          // Roteamento
          this.router.navigate(['pessoa/listar']);
        },
        (error) => {
          // Tratamento de Erros
          switch (error['status']) {
            // Erro Banco
            case 400: {
              this.toastService.toastErroBanco();
              break;
            }
            // Usuário não encontrado.
            case 404: {
              this.toastService.toastError('Não encontrado!',
                'Usuário não encontrado no banco de dados. Atualize a página e tente novamente.');
              break;
            }
          }
          this.spinner = false;
        }, () => { // Requisicao acabou
          this.spinner = false;
        }
      );
  }

  // Criando objeto Pessoa
  private criarObjetoPessoa(formGroup: FormGroup): Pessoa {

    // Atribuindo valores
    this.objetoPessoa.nomePessoa = formGroup.get('nome').value;
    this.objetoPessoa.emailPessoa = formGroup.get('email').value;
    this.objetoPessoa.senhaPessoa = formGroup.get('senha').value;
    this.objetoPessoa.sexoPessoa = formGroup.get('sexo').value;

    // Tratando o CPF - Retirando a mascara
    const cpf: string = formGroup.get('cpf').value.replace(/[^0-9]+/g, '');
    this.objetoPessoa.cpfPessoa = cpf;

    // Tratando Data de Nascimento
    this.objetoPessoa.dataNascimentoPessoa = formGroup.get('dataNascimento').value;

    // Tratando Telefone - Retirando mascara
    const telefone: string = formGroup.get('telefone').value.replace(/[^0-9]+/g, '');
    this.objetoPessoa.telefonePessoa = telefone;

    // Retornando objeto para POST
    return this.objetoPessoa;
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

}

