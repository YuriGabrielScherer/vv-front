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
export class CadastroComponent implements OnInit {


  constructor(

  ) { }

  ngOnInit() {

  }

}

