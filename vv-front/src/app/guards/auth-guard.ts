import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { ToastService } from '../shared/services/toast/toast.service';
import { AuthService } from './../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    // Verificando se a Rota pode ser ativada ou não.
    if (this.authService.isUserLoggedIn()) {
      return true;
    }

    // Mensagem para o usuário
    this.toast.toastError('Realize login!',
      'Faça login antes de entrar no sistema administrativo.');

    // Redirecionando
    this.router.navigate(['/login']);
    return false;
  }
}
