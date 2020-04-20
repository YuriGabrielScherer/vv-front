import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Pessoa } from '../shared/model/pessoa';
import { PessoaService } from './../pessoa/pessoa.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private pessoaService: PessoaService
  ) {

  }

  authenticate(login: any) {
    return this.http.post('http://localhost:8080/login', login).pipe(
      take(1)
    );
  }

  authenticate1(login) {
    return this.http.post<Pessoa>('http://localhost:8080/login', login).pipe(
      take(1),
      map(
        (token: any) => {
          sessionStorage.setItem('login', login.username);
          const tokenStr = 'Bearer ' + token.token;
          sessionStorage.setItem('token', tokenStr);
          return token;
        }
      )
    );
  }

  isUserLoggedIn(): boolean {
    const user = sessionStorage.getItem('login');
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('email');
  }

  // Deslogar
  deslogar() {
    // Removendo do Session Storage
    sessionStorage.removeItem('usuario_logado');

    // Removendo do Local Storage
    localStorage.removeItem('usuario_logado');

    // Rotacionando
    this.router.navigate(['/', 'login']);
  }

  getUserLogged() {
    let login: string;
    if (sessionStorage.getItem('login')) {
      login = sessionStorage.getItem('login');
    } else {
      login = localStorage.getItem('login');
    }

    return this.pessoaService.loadByLogin(login)
      .pipe(
        take(1)
      );
  }
}
