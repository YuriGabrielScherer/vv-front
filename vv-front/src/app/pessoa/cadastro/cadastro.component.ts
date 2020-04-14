import { Subscription, EMPTY } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ValidacoesFormService } from './../../shared/services/validacoes-form.service';
import { Pessoa } from '../../shared/model/pessoa';
import { PessoaService } from '../pessoa.service';
import { ToastService } from './../../shared/services/toast/toast.service';
import { ModalService } from './../../shared/modais/modal.service';

import { switchMap, take, finalize } from 'rxjs/operators';

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
      login: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, [Validators.required, this.validacaoForm.isValidPhone()]],
      dataNascimento: [null, [Validators.required, this.validacaoForm.isValidDate()]],
      senha: [null, [Validators.required, Validators.minLength(5)]],
      sexo: ['m', Validators.required]
    });

    // Tentando pegar atributos do Roteamento - Tela Alteracao
    this.inscricao = this.route.data.subscribe((dados: Pessoa) => {

      // Verificando se tem Pessoa para alterar
      if (dados['alteracao']) {

        this.telaAlteracao = true;

        this.objetoPessoa = dados['alteracao'];

        let telefone = this.objetoPessoa.telefone;

        // Colocando mascara para passar na validacao
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1)$2'); // Colocando parenteses
        telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');  // Colocando hifen

        // Retornando dados alterados
        this.objetoPessoa.telefone = telefone;

        // Atribuindo valores para o formulario
        this.formulario.patchValue({
          nome: this.objetoPessoa.nome,
          login: this.objetoPessoa.login,
          cpf: this.objetoPessoa.cpf,
          email: this.objetoPessoa.email,
          telefone: this.objetoPessoa.telefone,
          dataNascimento: this.objetoPessoa.dataNascimento,
          senha: this.objetoPessoa.senha,
          sexo: this.objetoPessoa.sexo
        });

        // Setando Formulario como valido - Aplicar CSS Valido
        this.formulario.markAllAsTouched();
      }
    });

  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onSubmit() {

    if (this.formulario.valid && this.formulario.dirty) {
      this.spinner = true;
      this.pessoaService.save(this.criarObjetoPessoa(this.formulario))
        .pipe(
          finalize(() => {
            this.spinner = false;
          }))
        .subscribe((retorno) => {
          this.toastService.toastSuccess('Registrado com sucesso!', 'Usuário cadastrado com sucesso!');
          this.formulario.reset();
          console.log(retorno);
          // Navegando para a tela de Login
          if ((sessionStorage.getItem('usuario_logado') === null) &&
            (localStorage.getItem('usuario_logado') === null)) {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/pessoa/listar']);
          }
        },
          (error) => {
            console.log(error);
            if (error['status'] === 400) {
              this.toastService.toastWarning('Erro ao registrar.', 'Erro ao cadastrar o usuário. Verifique os dados e tente novamente.');
            } else {
              this.toastService.toastErroBanco();
            }
          });
    } else {
      // Resgatando os Componentes do Formulario
      this.validaFormulario(this.formulario);
    }
  }

  onDelete() {
    const resposta$ = this.modalService.showConfirmModal('Confirmar exclusão',
      'Deseja realmente excluir o usuário selecionado?', 'Excluir');

    // Transformando o Subject em Observable para usar o Subscribe
    resposta$.asObservable()
      .pipe(
        take(1),
        switchMap(resposta => resposta ? this.pessoaService.remove(this.objetoPessoa.id) : EMPTY),
        finalize(() => {
          this.spinner = false;
        })
      ).subscribe( // Esse subscribe refere-se ao PessoaService.remove() que é retornado pelo resposta$ atraves do switchMap()
        () => {
          this.toastService.toastInfo('Sucesso!', 'O registro foi excluído com sucesso.');
          this.router.navigate(['pessoa/listar']);
        },
        (error) => {
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
        });
  }

  private criarObjetoPessoa(formGroup: FormGroup): Pessoa {
    // Atribuindo valores
    this.objetoPessoa.nome = formGroup.get('nome').value;
    this.objetoPessoa.email = formGroup.get('email').value;
    this.objetoPessoa.senha = formGroup.get('senha').value;
    this.objetoPessoa.sexo = formGroup.get('sexo').value;
    this.objetoPessoa.login = formGroup.get('login').value;
    this.objetoPessoa.dataNascimento = this.validarData(formGroup.get('dataNascimento').value);

    // Tratando o CPF - Retirando a mascara
    const cpf: string = formGroup.get('cpf').value.replace(/[^0-9]+/g, '');
    this.objetoPessoa.cpf = cpf;

    // Tratando Telefone - Retirando mascara
    const telefone: string = formGroup.get('telefone').value.replace(/[^0-9]+/g, '');
    this.objetoPessoa.telefone = telefone;

    // Retornando objeto para POST
    return this.objetoPessoa;
  }

  private validarData(data: string) {
    const dia = this.formulario.get('dataNascimento').value.slice(0, 2);
    const mes = this.formulario.get('dataNascimento').value.slice(3, 5);
    const ano = this.formulario.get('dataNascimento').value.slice(6, 10);
    const dataN = `${ano}-${mes}-${dia}`;
    return dataN;
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

