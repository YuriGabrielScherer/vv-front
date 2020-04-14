import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Atleta } from './../../shared/model/atleta';
import { Pessoa } from './../../shared/model/pessoa';
import { PessoaService } from './../../pessoa/pessoa.service';
import { ToastService } from './../../shared/services/toast/toast.service';
import { AtletaService } from './../atleta.service';
import { ValidacoesFormService } from './../../shared/services/validacoes-form.service';

@Component({
  selector: 'app-atleta',
  templateUrl: './atleta.component.html',
  styleUrls: ['./atleta.component.scss'],
  preserveWhitespaces: true
})
export class AtletaComponent implements OnInit {

  // Mascara para o CPF
  public maskCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public maskTel = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  // Formulario
  formulario: FormGroup;

  // Objetos
  pessoa: Pessoa = null;

  // Var Controle Spinner
  spinnerCarregar = false;
  spinnerCarregarCadastro = false;

  constructor(
    public validacoesForm: ValidacoesFormService,
    private formBuild: FormBuilder,
    private pessoaService: PessoaService,
    private atletaService: AtletaService,
    private toast: ToastService,
    private route: Router
  ) { }

  ngOnInit() {
    // Criando formulario
    this.formulario = this.formBuild.group({
      // Dados da Pessoa
      cpfAtleta: [null, [Validators.required, this.validacoesForm.isValidCpf()]],
      // Dados do Atleta
      nomeResp: [null, Validators.required],
      cpfResp: [null, [Validators.required, this.validacoesForm.isValidCpf()]],
      telResp: [null, [Validators.required, this.validacoesForm.isValidPhone()]],
      dataInicio: [null, Validators.required],
      grau: [1, Validators.required],
      federacao: [null],
      confederacao: [null]
    });
  }

  // Retorna dados do Atleta do Cadastro Pessoa
  buscarDadosAtleta() {

    // Pegando valor do Componente
    if (this.formulario.get('cpfAtleta').valid) {

      // Spinner
      this.spinnerCarregar = true;

      // Retirando mascara
      const cpf: string = this.formulario.get('cpfAtleta').value.replace(/[^0-9]+/g, '');

      this.pessoaService.loadbyCpf(cpf).subscribe(
        // Caso Sucesso
        (response: Pessoa) => {
          // Passando dados
          this.pessoa = response;

          // Bloqueando Campo CPF
          this.formulario.get('cpfAtleta').disable();
        },
        // Tratamento de erros
        (error) => {
          switch (error['status']) {
            case 400: {
              // CPF nao cadastrado
              this.toast.toastWarning('CPF não encontrado.',
                'Confira o CPF ou realize o cadastro da pessoa.');
              this.formulario.get('cpfAtleta').setErrors(isNaN);
              break;
            }
            default: {
              this.toast.toastErroBanco();
              break;
            }
          }

        },
        // Quando o Request terminar, tirar Spinner.
        () => this.spinnerCarregar = false);

    }
  }

  // Resetando o formulario inteiro
  cancelarCadastro() {
    // Controle de Usuario Selecionado
    this.pessoa = null;
    // Resetando formulario
    this.formulario.reset();
    // Habilitando Campo CPF
    this.formulario.get('cpfAtleta').enable();
  }

  // Metodo Realizar Cadastro
  onSubmit() {

    // Verificando formulario
    if (this.formulario.valid) {

      this.spinnerCarregarCadastro = !this.spinnerCarregarCadastro;

      // Salvando
      this.atletaService.save(this.criarObjeto()).subscribe(
        (sucesso) => {
          // Mensagem
          this.toast.toastSuccess('Sucesso!', 'Atleta cadastrado com sucesso!');

          // Mudando Rota
          this.route.navigate(['/administrativo/atleta/listar']);
        }, (error) => {
          switch (error['status']) {
            case 400: {
              this.toast.toastError('Erro ao cadastrar!', 'Ocorreu um erro ao cadastrar o atleta. Verifique os dados e tente novamente.');
              break;
            }
            case 404: {
              this.toast.toastErroBanco();
              break;
            }
          }
        }, () => {
          // Escondendo Spinner
          this.spinnerCarregarCadastro = !this.spinnerCarregarCadastro;
        });

    }
  }

  // Criar objeto atleta
  criarObjeto() {

    const atleta: Atleta = new Atleta();

    atleta.nomeResponsavel = this.formulario.get('nomeResp').value;
    atleta.telefoneResponsavel = this.formulario.get('telResp').value.replace(/[^0-9]+/g, '');
    atleta.cpfResponsavel = this.formulario.get('cpfResp').value.replace(/[^0-9]+/g, '');
    atleta.confederacao = this.formulario.get('confederacao').value;
    atleta.federacao = this.formulario.get('federacao').value;
    atleta.idGrau = this.formulario.get('grau').value;
    atleta.dataInicio = this.formulario.get('dataInicio').value;

    atleta.idPessoa = this.pessoa.id;

    return atleta;

  }

}
