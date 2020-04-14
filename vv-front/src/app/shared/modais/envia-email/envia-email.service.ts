import { Destinatarios } from './../../model/destinatarios';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Email } from '../../model/email';

@Injectable({providedIn: 'root'})
export class EnviaEmailService {

  constructor(
    protected http: HttpClient,
  ) { }


  enviarEmail(email: Email) {
    console.log('Debug Enviar Email -> ', email);
    return this.http.post('http://localhost:8080/api/enviarEmail', email)
    .pipe(
      take(1)
    );
  }

  retornaNomeDestinatario() {
    console.log('Debug Enviar Email - Nome Destinatario -> ');
    return this.http.get<Destinatarios[]>('http://localhost:8080/api/atleta/nomeEmails')
    .pipe(
      take(1)
    );
  }


}
