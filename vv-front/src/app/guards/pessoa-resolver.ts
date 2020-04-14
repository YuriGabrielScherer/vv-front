import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Pessoa } from './../shared/model/pessoa';
import { AuthService } from './../login/auth.service';

@Injectable(
  { providedIn: 'root' }
)
export class PessoaResolver implements Resolve<Pessoa> {



  constructor(
    private authService: AuthService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Pessoa> | Promise<Pessoa> | Pessoa {
    return this.authService.getUserLogged();
  }
}
