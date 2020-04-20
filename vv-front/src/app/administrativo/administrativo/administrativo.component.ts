import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Pessoa } from './../../shared/model/pessoa';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-administrativo',
  templateUrl: './administrativo.component.html',
  styleUrls: ['./administrativo.component.scss']
})
export class AdministrativoComponent implements OnInit {

  // Usuario autenticado
  usuarioAutenticado: Pessoa = new Pessoa;

  isCollapsedUsuarios = false;
  isCollapsedAtletas = false;
  isCollapsedCampeonatos = false;
  isCollapsedExames = false;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.title.setTitle('Administrativo Karatê');
    // this.getUsuarioLogado();
  }

  private getUsuarioLogado() {
    this.route.data.subscribe(
      (pessoa) => {
        this.usuarioAutenticado = pessoa.pessoa;
      });
  }

  clickMenu(event) {
    this.fecharMenus();

    switch (event.target.id) {
      case 'divUsuario':
        this.isCollapsedUsuarios = true;
        break;
      case 'divAtleta':
        this.isCollapsedAtletas = true;
        break;
      case 'divCampeonato':
        this.isCollapsedCampeonatos = true;
        break;
      case 'divExame':
        this.isCollapsedExames = true;
        break;

      default:
        break;
    }
  }

  clickInicio() {
    this.fecharMenus();
  }

  private fecharMenus() {
    this.isCollapsedAtletas = false;
    this.isCollapsedCampeonatos = false;
    this.isCollapsedExames = false;
    this.isCollapsedUsuarios = false;
  }
}
