import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Email } from './../../model/email';
import { Destinatarios } from './../../model/destinatarios';

import { EnviaEmailService } from './../envia-email/envia-email.service';
import { ValidacoesFormService } from './../../services/validacoes-form.service';

@Component({
  selector: 'app-envia-email',
  templateUrl: './envia-email.component.html',
  styleUrls: ['./envia-email.component.scss']
})
export class EnviaEmailComponent implements OnInit {

  spinner = false;
  formulario: FormGroup;

  destinatarios: Destinatarios[] = null;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private emailService: EnviaEmailService,
    public validaForm: ValidacoesFormService
  ) { }

  ngOnInit() {
    // Retornar Nomes e Emails para popular ComboBox
    this.retornaNomeDestinatario();

    this.criarFormulario();
  }

  onClose() {
    this.bsModalRef.hide();
  }

  onSubmit() {

    this.spinner = true;

    if (this.formulario.valid) {
      // this.enviarEmail();
    }
  }

  // Contagem de caracteres do campo mensagem
  contarCaracteres() {
    const mensagem = (this.formulario.get('mensagem').value as string);
    if (mensagem !== null) {
      return `${mensagem.length}/255`;
    }
  }

  private criarFormulario() {
    this.formulario = this.formBuilder.group({
      email: [null, Validators.required],
      assunto: [null, Validators.required],
      mensagem: [null, [Validators.required, Validators.maxLength(250)]]
    });
  }

  private enviarEmail() {
    this.emailService.enviarEmail(this.criarObjeto()).subscribe(
      (success) => {
        console.log(success);
      }, (erro) => {
        console.log(erro);
      }, () => {
        console.log('Debug envia email component finally');
        this.spinner = false;
      }
    );
  }

  private retornaNomeDestinatario() {
    this.emailService.retornaNomeDestinatario().subscribe(
      (success) => {
        this.destinatarios = success;
      },
      (error) => { console.log(error); },
      () => { console.log('finally'); },
    );
  }

  private criarObjeto(): Email {
    const email: Email = new Email();

    email.destinatario = this.formulario.get('email').value;
    email.assunto = this.formulario.get('assunto').value;
    email.mensagem = this.formulario.get('mensagem').value;

    return email;
  }

}
