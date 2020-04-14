import { AuthService } from './../../login/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  usuario_logado() {
    return this.authService.isUserLoggedIn();
  }

  deslogar() {
    this.authService.deslogar();
  }

}
