import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';

import { Pessoa } from './../../shared/model/pessoa';
import { PessoaService } from './../../pessoa/pessoa.service';

import { ToastService } from '../../shared/services/toast/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private login = {
    username: null,
    password: null
  };

  private lembrarDeMim = false;

  //  Variavel de controle
  spinnerCarregar = false;

  // Formulario de Login
  formulario: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private pessoaService: PessoaService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
  }


  ngOnInit() {

    this.formulario = this.formBuilder.group({
      login: [null, Validators.required],
      senha: [null, Validators.required],
      lembrar: [false]
    });

  }

  realizarLogin() {

    if (this.formulario.valid) {
      this.spinnerCarregar = true;
      this.criarObjeto();
      this.authService.authenticate1(this.login).pipe(
        finalize(
          () => {
            this.spinnerCarregar = !this.spinnerCarregar;
          }
        )
      )
        .subscribe(
          (success) => {
            this.formulario.reset();
            this.toastService.toastSuccess('Login realizado com sucesso.', 'Bem-vindo ao sistema!');

            // Rotacionando
            this.router.navigate(['/administrativo']);
          },
          (error: any) => {
            console.log(error);
            // Verificando falha com o banco ou Login
            if (error.status === 401) {
              this.toastService.toastWarning('Erro ao realizar o login.',
                'Por favor, confira se o usuário e senha estão corretos e tente novamente.');

              // Selecionando o Campo de Login.
              const campoLogin = document.getElementById('campoLogin') as HTMLInputElement;
              campoLogin.focus();
            } else {
              this.toastService.toastErroBanco();
            }
          });
    }

  }

  // Metodo para popular o Objeto de login
  criarObjeto() {
    // Atribuindo valores ao objeto logins
    this.login.username = this.formulario.get('login').value.toString();
    this.login.password = this.formulario.get('senha').value.toString();

    this.lembrarDeMim = this.formulario.get('lembrar').value;
  }

}
