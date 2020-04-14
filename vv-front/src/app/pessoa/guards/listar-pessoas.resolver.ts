import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

import { Pessoa } from './../../shared/model/pessoa';
import { PessoaService } from './../pessoa.service';

@Injectable()
export class ListarPessoaResolver implements Resolve<Pessoa[]> {

  constructor(private pessoaService: PessoaService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pessoa[]> | Promise<Pessoa[]> | Pessoa[] {

    // Retornando usuarios cadastrados no banco
    return this.pessoaService.list();
  }
}
